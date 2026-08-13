import { BindingKind, Context, type Location, Origin } from '../common.ts';
import { Errors, ParseError } from '../errors.ts';
import { type Parser } from './parser.ts';

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
interface ScopeError {
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
  scopeError?: ScopeError;

  variableBindings = new Map<string, BindingKind>();

  constructor(
    public readonly parser: Parser,
    public readonly type: ScopeKind = ScopeKind.Block,
    public readonly parent?: Scope,
  ) {}

  createChildScope(type?: ScopeKind) {
    return new Scope(this.parser, type, this);
  }

  /**
   * Adds either a var binding or a block scoped binding.
   *
   * @param context Context masks
   * @param name Binding name
   * @param type Binding kind
   * @param origin Binding Origin
   */
  addVarOrBlock(
    context: Context,
    name: string,
    kind: BindingKind,
    tokenStart: Location,
    tokenEnd: Location,
    origin: Origin,
  ) {
    if (kind & BindingKind.Variable) {
      this.addVarName(context, name, kind, tokenStart, tokenEnd);
    } else {
      this.addBlockName(context, name, kind, tokenStart, tokenEnd, origin);
    }
    if (origin & Origin.Export) {
      this.parser.declareUnboundVariable(name);
    }
  }

  /**
   * Adds a variable binding
   *
   * @param context Context masks
   * @param name Binding name
   * @param type Binding kind
   * @param tokenStart Token start location
   * @param tokenEnd Token end location
   */
  addVarName(context: Context, name: string, kind: BindingKind, tokenStart: Location, tokenEnd: Location): void {
    const { parser } = this;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let currentScope: Scope | undefined = this;

    while (currentScope && (currentScope.type & ScopeKind.FunctionRoot) === 0) {
      const { variableBindings } = currentScope;
      const value = variableBindings.get(name);

      if (value && value & BindingKind.LexicalBinding) {
        if (
          parser.options.webcompat &&
          (context & Context.Strict) === 0 &&
          ((kind & BindingKind.FunctionStatement && value & BindingKind.LexicalOrFunction) ||
            (value & BindingKind.FunctionStatement && kind & BindingKind.LexicalOrFunction))
        ) {
          // No op
        } else {
          throw new ParseError(tokenStart, tokenEnd, Errors.DuplicateBinding, name);
        }
      }
      if (currentScope === this) {
        if (value && value & BindingKind.ArgumentList && kind & BindingKind.ArgumentList) {
          currentScope.recordScopeError(Errors.DuplicateBinding, tokenStart, tokenEnd, name);
        }
      }
      if (
        value &&
        (value & BindingKind.CatchPattern || (value & BindingKind.CatchIdentifier && !parser.options.webcompat))
      ) {
        throw new ParseError(tokenStart, tokenEnd, Errors.DuplicateBinding, name);
      }

      currentScope.variableBindings.set(name, kind);

      currentScope = currentScope.parent;
    }
  }

  hasVariable(name: string) {
    return this.variableBindings.has(name);
  }

  /**
   * Adds block scoped binding
   *
   * @param context Context masks
   * @param name Binding name
   * @param type Binding kind
   * @param tokenStart Token start location
   * @param tokenEnd Token end location
   * @param origin Binding Origin
   */
  addBlockName(
    context: Context,
    name: string,
    kind: BindingKind,
    tokenStart: Location,
    tokenEnd: Location,
    origin: Origin = Origin.None,
  ): void {
    const { parser } = this;
    const value = this.variableBindings.get(name);

    if (value && (value & BindingKind.Empty) === 0) {
      if (kind & BindingKind.ArgumentList) {
        this.recordScopeError(Errors.DuplicateBinding, tokenStart, tokenEnd, name);
      } else if (
        parser.options.webcompat &&
        (context & Context.Strict) === 0 &&
        origin & Origin.BlockStatement &&
        value === BindingKind.FunctionLexical &&
        kind === BindingKind.FunctionLexical
      ) {
        // No op
      } else {
        throw new ParseError(tokenStart, tokenEnd, Errors.DuplicateBinding, name);
      }
    }

    if (
      this.type & ScopeKind.FunctionBody &&
      this.parent?.hasVariable(name) &&
      (this.parent.variableBindings.get(name)! & BindingKind.Empty) === 0
    ) {
      throw new ParseError(tokenStart, tokenEnd, Errors.DuplicateBinding, name);
    }

    if (this.type & ScopeKind.ArrowParams && value && (value & BindingKind.Empty) === 0) {
      if (kind & BindingKind.ArgumentList) {
        this.recordScopeError(Errors.DuplicateBinding, tokenStart, tokenEnd, name);
      }
    }

    if (this.type & ScopeKind.CatchBlock) {
      if (this.parent!.variableBindings.get(name)! & BindingKind.CatchIdentifierOrPattern)
        throw new ParseError(tokenStart, tokenEnd, Errors.ShadowedCatchClause, name);
    }

    this.variableBindings.set(name, kind);
  }

  /**
   * Record duplicate binding errors that may occur in a arrow head or function parameters
   *
   * @param parser Parser state
   * @param type Errors type
   */
  recordScopeError(type: Errors, tokenStart: Location, tokenEnd: Location, ...params: string[]) {
    // Only record the first error, subsequent errors will be ignored
    this.scopeError ??= {
      type,
      params,
      start: tokenStart,
      end: tokenEnd,
    };
  }

  reportScopeError() {
    const { scopeError } = this;
    if (!scopeError) {
      return;
    }

    throw new ParseError(scopeError.start, scopeError.end, scopeError.type, ...scopeError.params);
  }
}

/**
 * Create a parsing scope for arrow head, and add lexical binding
 *
 * @param parser Parser state
 * @param context Context masks
 * @param value Binding name to be declared
 * @param tokenStart Token start location
 * @param tokenEnd Token end location
 * @returns Scope
 */
export function createArrowHeadParsingScope(
  parser: Parser,
  context: Context,
  value: string,
  tokenStart: Location,
  tokenEnd: Location,
): Scope {
  const scope = parser.createScope().createChildScope(ScopeKind.ArrowParams);
  scope.addBlockName(context, value, BindingKind.ArgumentList, tokenStart, tokenEnd);
  return scope;
}
