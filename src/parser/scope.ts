import { Errors, ParseError } from '../errors';
import { type Location, declareUnboundVariable, Context, BindingKind, Origin } from '../common';
import { type Parser } from './parser';

/**
 * Scope kinds
 */
export const enum ScopeKind {
  ForStatement = 1 << 0,
  Block = 1 << 1,
  CatchStatement = 1 << 2,
  SwitchStatement = 1 << 3,
  TryStatement = 1 << 4,
  CatchBlock = 1 << 5,
  FunctionBody = 1 << 6,
  FunctionRoot = 1 << 7,
  FunctionParams = 1 << 8,
  ArrowParams = 1 << 9,
}

/** Scope error interface */
export interface ScopeError {
  type: Errors;
  params: string[];
  start: Location;
  end: Location;
}

export class Scope {
  // Some scopeError doesn't necessarily fail parsing.
  // For example function a(dup, dup) {} is fine,
  // But duplicated params is not allowed in strict mode,
  // So function a(dup, dup) { "use strict" } would fail.
  // Retain the scopeError on scope for later decision.
  scopeError?: ScopeError | null;

  constructor(
    public type: ScopeKind = ScopeKind.Block,
    public parent?: Scope,
  ) {}

  createChildScope(type?: ScopeKind) {
    return new Scope(type, this);
  }
}

/**
 * Lexical scope interface
 */
export interface ScopeState {
  parent: ScopeState | undefined;
  type: ScopeKind;
  // Some scopeError doesn't necessarily fail parsing.
  // For example function a(dup, dup) {} is fine,
  // But duplicated params is not allowed in strict mode,
  // So function a(dup, dup) { "use strict" } would fail.
  // Retain the scopeError on scope for later decision.
  scopeError?: ScopeError | null;
}

/**
 * Creates a block scope
 */
export function createScope(): ScopeState {
  return {
    parent: void 0,
    type: ScopeKind.Block,
  };
}

/**
 * Inherit scope
 *
 * @param parent optional parent ScopeState
 * @param type Scope kind
 */
export function addChildScope(parent: ScopeState | undefined, type: ScopeKind): ScopeState {
  return {
    parent,
    type,
    scopeError: void 0,
  };
}

/**
 * Create a parsing scope for arrow head, and add lexical binding
 *
 * @param parser Parser state
 * @param context Context masks
 * @param value Binding name to be declared
 */
export function createArrowHeadParsingScope(parser: Parser, context: Context, value: string): Scope {
  const scope = new Scope().createChildScope(ScopeKind.ArrowParams);
  addBlockName(parser, context, scope, value, BindingKind.ArgumentList, Origin.None);
  return scope;
}

/**
 * Record duplicate binding errors that may occur in a arrow head or function parameters
 *
 * @param parser Parser state
 * @param type Errors type
 */
function recordScopeError(parser: Parser, type: Errors, ...params: string[]): ScopeError {
  return {
    type,
    params,
    start: parser.tokenStart,
    end: parser.currentLocation,
  };
}

/**
 * Adds a variable binding
 *
 * @param parser Parser state
 * @param context Context masks
 * @param scope Scope state
 * @param name Binding name
 * @param type Binding kind
 */
export function addVarName(parser: Parser, context: Context, scope: Scope, name: string, kind: BindingKind): void {
  let currentScope: any = scope;

  while (currentScope && (currentScope.type & ScopeKind.FunctionRoot) === 0) {
    const value: ScopeKind = currentScope['#' + name];

    if (value & BindingKind.LexicalBinding) {
      if (
        context & Context.OptionsWebCompat &&
        (context & Context.Strict) === 0 &&
        ((kind & BindingKind.FunctionStatement && value & BindingKind.LexicalOrFunction) ||
          (value & BindingKind.FunctionStatement && kind & BindingKind.LexicalOrFunction))
      ) {
        // No op
      } else {
        parser.report(Errors.DuplicateBinding, name);
      }
    }
    if (currentScope === scope) {
      if (value & BindingKind.ArgumentList && kind & BindingKind.ArgumentList) {
        currentScope.scopeError = recordScopeError(parser, Errors.DuplicateBinding, name);
      }
    }
    if (
      value & BindingKind.CatchPattern ||
      (value & BindingKind.CatchIdentifier && (context & Context.OptionsWebCompat) === 0)
    ) {
      parser.report(Errors.DuplicateBinding, name);
    }

    currentScope['#' + name] = kind;

    currentScope = currentScope.parent;
  }
}

/**
 * Adds block scoped binding
 *
 * @param parser Parser state
 * @param context Context masks
 * @param scope Scope state
 * @param name Binding name
 * @param type Binding kind
 * @param origin Binding Origin
 */
export function addBlockName(
  parser: Parser,
  context: Context,
  scope: any,
  name: string,
  kind: BindingKind,
  origin: Origin,
) {
  const value = (scope as any)['#' + name];

  if (value && (value & BindingKind.Empty) === 0) {
    if (kind & BindingKind.ArgumentList) {
      scope.scopeError = recordScopeError(parser, Errors.DuplicateBinding, name);
    } else if (
      context & Context.OptionsWebCompat &&
      (context & Context.Strict) === 0 &&
      origin & Origin.BlockStatement &&
      value === BindingKind.FunctionLexical &&
      kind === BindingKind.FunctionLexical
    ) {
      // No op
    } else {
      parser.report(Errors.DuplicateBinding, name);
    }
  }

  if (
    scope.type & ScopeKind.FunctionBody &&
    (scope as any).parent['#' + name] &&
    ((scope as any).parent['#' + name] & BindingKind.Empty) === 0
  ) {
    parser.report(Errors.DuplicateBinding, name);
  }

  if (scope.type & ScopeKind.ArrowParams && value && (value & BindingKind.Empty) === 0) {
    if (kind & BindingKind.ArgumentList) {
      scope.scopeError = recordScopeError(parser, Errors.DuplicateBinding, name);
    }
  }

  if (scope.type & ScopeKind.CatchBlock) {
    if ((scope as any).parent['#' + name] & BindingKind.CatchIdentifierOrPattern)
      parser.report(Errors.ShadowedCatchClause, name);
  }

  (scope as any)['#' + name] = kind;
}

/**
 * Adds either a var binding or a block scoped binding.
 *
 * @param parser Parser state
 * @param context Context masks
 * @param scope Scope state
 * @param name Binding name
 * @param type Binding kind
 * @param origin Binding Origin
 */
export function addVarOrBlock(
  parser: Parser,
  context: Context,
  scope: Scope,
  name: string,
  kind: BindingKind,
  origin: Origin,
) {
  if (kind & BindingKind.Variable) {
    addVarName(parser, context, scope, name, kind);
  } else {
    addBlockName(parser, context, scope, name, kind, origin);
  }
  if (origin & Origin.Export) {
    declareUnboundVariable(parser, name);
  }
}

export function reportScopeError(scope: ScopeError): never {
  throw new ParseError(scope.start, scope.end, scope.type, ...scope.params);
}
