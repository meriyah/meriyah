import { report, Errors } from './errors';
import { Context, ParserState, BindingType } from './common';

/**
 * Scope types
 */
export const enum ScopeType {
  None = 0,
  For = 1 << 0,
  Block = 1 << 1,
  Catch = 1 << 2,
  Switch = 1 << 3,
  ArgList = 1 << 4
}
/**
 * Scope masks
 */
export const enum ScopeMasks {
  Redeclared = 1 << 0,
  Undeclared = 1 << 1
}

/**
 * Lexical scope interface
 */
export interface ScopeState {
  var: any;
  lexvar: any;
  lex: any;
  funcs?: any;
}

/**
 * Creates a block scope
 */
export function initblockScope(): ScopeState {
  return {
    var: {},
    lexvar: {},
    lex: { funcs: [] }
  };
}

/**
 * Inherit scope
 *
 * @param scope Parser object
 * @param type Scope type
 */
export function inheritScope(scope: any, type: ScopeType): ScopeState {
  return {
    var: scope.var,
    lexvar: {
      '#': scope.lexvar
    },
    lex: {
      '#': scope.lex,
      type,
      funcs: []
    }
  };
}

/**
 * Declare name
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param type Binding type
 */
export function declareName(
  parser: ParserState,
  context: Context,
  scope: any,
  name: string,
  bindingType: BindingType,
  dupeChecks: 0 | 1,
  isVarDecl: 0 | 1
): void {
  if (scope === null) return;

  let hashed = '#' + name;

  if (bindingType & BindingType.Variable) {
    let lex = scope.lex;

    while (lex !== undefined) {
      if (lex[hashed] !== undefined) {
        if (lex.type & ScopeType.Catch) {
          if (!isVarDecl || (context & Context.OptionsWebCompat) === 0) {
            report(parser, Errors.DuplicateBinding, name);
          }
        } else if (lex.type & ScopeType.For) {
          report(parser, Errors.DuplicateBinding, name);
        } else if (
          (lex.type & ScopeType.ArgList) === 0 &&
          ((context & Context.OptionsWebCompat) === 0 ||
            (scope.lex.funcs[hashed] & ScopeMasks.Undeclared) === 0 ||
            context & Context.Strict)
        )
          report(parser, Errors.DuplicateBinding, name);
      }

      lex = lex['#'];
    }

    scope.var[hashed] = scope.var[hashed] ? ScopeMasks.Undeclared : ScopeMasks.Redeclared;

    let lexvar = scope.lexvar;

    while (lexvar !== undefined) {
      lexvar[hashed] = ScopeMasks.Redeclared;

      lexvar = lexvar['#'];
    }
  } else {
    let lex = scope.lex;

    if (dupeChecks) {
      let lexParent = scope.lex['#'];

      if (lexParent && lexParent.type & (ScopeType.ArgList | ScopeType.Catch) && lexParent[hashed]) {
        report(parser, Errors.DuplicateBinding, name);
      } else if (scope.lexvar[hashed]) {
        if (
          (context & Context.OptionsWebCompat) === 0 ||
          (scope.lex.funcs[hashed] & ScopeMasks.Undeclared) === 0 ||
          (context & Context.Strict) !== 0
        ) {
          report(parser, Errors.DuplicateBinding, name);
        }
      }

      if (
        lex[hashed] !== undefined &&
        ((context & Context.OptionsWebCompat) === 0 ||
          (scope.lex.funcs[hashed] & ScopeMasks.Undeclared) === 0 ||
          context & Context.Strict)
      ) {
        report(parser, Errors.DuplicateBinding, name);
      }
    }

    lex[hashed] = lex[hashed] ? ScopeMasks.Undeclared : ScopeMasks.Redeclared;
  }
}

/**
 * Declare name and dedupe
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param scope Binding type
 * @param name Parser object
 * @param bindingType  Context masks
 * @param isVarDecl Binding type
 */
export function declareAndDedupe(
  parser: ParserState,
  context: Context,
  scope: any,
  name: string,
  type: BindingType,
  isVarDecl: 0 | 1
): void {
  declareName(parser, context, scope, name, type, 1, isVarDecl);
  if (scope === null) return;
  if (context & Context.OptionsWebCompat) scope.lex.funcs['#' + name] = ScopeMasks.Redeclared;
}
export function declareUnboundVariable(
  parser: ParserState,
  context: Context,
  scope: any,
  name: string,
  type: BindingType
): void {
  declareName(parser, context, scope, name, type, 1, 0);
}

/**
 * Add function name
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param type Binding type
 */
export function addFunctionName(
  parser: ParserState,
  context: Context,
  scope: any,
  name: string,
  type: BindingType,
  isVarDecl: 0 | 1
): void {
  declareName(parser, context, scope, name, type, 1, isVarDecl);
  if (context & Context.OptionsWebCompat && !('#' + name in scope.lex.funcs)) {
    scope.lex.funcs['#' + name] = ScopeMasks.Undeclared;
  }
}
/**
 * Check if the scope has conflicting var/let declarations from different scopes.
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param scope
 * @param checkParent
 */
export function checkConflictingLexicalDeclarations(
  parser: ParserState,
  context: Context,
  scope: any,
  checkParent: 0 | 1
): boolean {
  for (let key in scope.lex) {
    if (key[0] === '#' && key.length > 1) {
      if (scope.lex[key] > 1) report(parser, Errors.DuplicateBinding, key);

      if (checkParent) {
        if (scope.lex['#'] && scope.lex['#'].type & (ScopeType.ArgList | ScopeType.Catch) && scope.lex['#'][key]) {
          report(parser, Errors.DuplicateBinding, key.slice(1));
        } else if (
          ((context & Context.OptionsWebCompat) === 0 || (context & Context.Strict) !== 0 || !scope.lex.funcs[key]) &&
          scope.lexvar[key]
        ) {
          report(parser, Errors.DuplicateBinding, key.slice(1));
        }
      }
    }
  }
  return false;
}

/**
 * Verify arguments
 *
 * @param parser Parser object
 * @param lex
 */

export function verifyArguments(parser: ParserState, lex: any): void {
  for (let key in lex) {
    if (key[0] === '#' && key.length > 1 && lex[key] > 1) {
      report(parser, Errors.DuplicateBinding, key.slice(1));
    }
  }
}

/**
 * Appends a name to the `ExportedNames` of the `ExportsList`, and checks
 * for duplicates
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-exports-static-semantics-exportednames)
 *
 * @param parser Parser object
 * @param name Exported name
 */
export function updateExportsList(parser: ParserState, name: string): void {
  if (parser.exportedNames !== undefined && name !== '') {
    if (parser.exportedNames['#' + name]) {
      report(parser, Errors.DuplicateExportBinding, name);
    }
    parser.exportedNames['#' + name] = ScopeMasks.Undeclared;
  }
}

/**
 * Appends a name to the `ExportedBindings` of the `ExportsList`,
 *
 * @see [Link](https://tc39.es/ecma262/#sec-exports-static-semantics-exportedbindings)
 *
 * @param parser Parser object
 * @param name Exported binding name
 */
export function addBindingToExports(parser: ParserState, name: string): void {
  if (parser.exportedBindings !== undefined && name !== '') {
    parser.exportedBindings['#' + name] = ScopeMasks.Undeclared;
  }
}
