import { Token, KeywordDescTable } from './token';
import { Errors } from './errors';
import { nextToken } from './lexer/scan';
import { type Parser } from './parser/parser';

/**
 * The core context, passed around everywhere as a simple immutable bit set
 */
export const enum Context {
  None = 0,

  Strict = 1 << 0,
  Module = 1 << 1, // Current code should be parsed as a module body
  InSwitch = 1 << 2,
  InGlobal = 1 << 3,
  InClass = 1 << 4,
  AllowRegExp = 1 << 5,
  TaggedTemplate = 1 << 6,
  InIteration = 1 << 7,
  SuperProperty = 1 << 8,
  SuperCall = 1 << 9,
  InYieldContext = 1 << 10,
  InAwaitContext = 1 << 11,
  InReturnContext = 1 << 12,
  InArgumentList = 1 << 13,
  InConstructor = 1 << 14,
  InMethodOrFunction = 1 << 15,
  AllowNewTarget = 1 << 16,
  DisallowIn = 1 << 17,
  AllowEscapedKeyword = 1 << 18,
  InStaticBlock = 1 << 19,
}

/**
 * Masks to track the property kind
 */
export const enum PropertyKind {
  None = 0,
  Method = 1 << 0,
  Computed = 1 << 1,
  Shorthand = 1 << 2,
  Generator = 1 << 3,
  Async = 1 << 4,
  Static = 1 << 5,
  Constructor = 1 << 6,
  ClassField = 1 << 7,
  Getter = 1 << 8,
  Setter = 1 << 9,
  Accessor = 1 << 10,
  Extends = 1 << 11,
  Literal = 1 << 12,
  PrivateField = 1 << 13,
  GetSet = Getter | Setter,
}

/**
 * Masks to track the binding kind
 */
export const enum BindingKind {
  None = 0,
  ArgumentList = 1 << 0,
  Empty = 1 << 1,
  Variable = 1 << 2,
  Let = 1 << 3,
  Const = 1 << 4,
  Class = 1 << 5,
  FunctionLexical = 1 << 6,
  FunctionStatement = 1 << 7,
  CatchPattern = 1 << 8,
  CatchIdentifier = 1 << 9,
  Async = 1 << 10,
  Generator = 1 << 10,
  AsyncFunctionLexical = Async | FunctionLexical,
  GeneratorFunctionLexical = Generator | FunctionLexical,
  AsyncGeneratorFunctionLexical = Async | Generator | FunctionLexical,
  CatchIdentifierOrPattern = CatchIdentifier | CatchPattern,
  LexicalOrFunction = Variable | FunctionLexical,
  LexicalBinding = Let | Const | FunctionLexical | FunctionStatement | Class,
}

/**
 * The masks to track where something begins. E.g. statements, declarations or arrows.
 */
export const enum Origin {
  None = 0,
  Statement = 1 << 0,
  BlockStatement = 1 << 1,
  TopLevel = 1 << 2,
  Declaration = 1 << 3,
  Arrow = 1 << 4,
  ForStatement = 1 << 5,
  Export = 1 << 6,
}

/**
 * Masks to track the assignment kind
 */
export const enum AssignmentKind {
  None = 0,
  Assignable = 1 << 0,
  CannotAssign = 1 << 1,
}

/**
 * Masks to track the destructuring kind
 */
export const enum DestructuringKind {
  None = 0,
  HasToDestruct = 1 << 3,
  // "Cannot" rather than "can" so that this flag can be ORed together across
  // multiple characters.
  CannotDestruct = 1 << 4,
  // Only destructible if assignable
  Assignable = 1 << 5,
  // `__proto__` is a special case and only valid to parse if destructible
  SeenProto = 1 << 6,
  Await = 1 << 7,
  Yield = 1 << 8,
}

/**
 * The mutable parser flags, in case any flags need passed by reference.
 */
export const enum Flags {
  None = 0,
  NewLine = 1 << 0,
  HasConstructor = 1 << 5,
  Octal = 1 << 6,
  NonSimpleParameterList = 1 << 7,
  HasStrictReserved = 1 << 8,
  StrictEvalArguments = 1 << 9,
  DisallowCall = 1 << 10,
  HasOptionalChaining = 1 << 11,
  EightAndNine = 1 << 12,
}

export const enum HoistedClassFlags {
  None,
  Hoisted = 1 << 0,
  Export = 1 << 1,
}

export const enum HoistedFunctionFlags {
  None,
  Hoisted = 1 << 0,
  Export = 1 << 1,
}

/**
 * Check for automatic semicolon insertion according to the rules
 * given in `ECMA-262, section 11.9`.
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function matchOrInsertSemicolon(parser: Parser, context: Context): void {
  if ((parser.flags & Flags.NewLine) === 0 && (parser.getToken() & Token.IsAutoSemicolon) !== Token.IsAutoSemicolon) {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  if (!consumeOpt(parser, context, Token.Semicolon)) {
    // Automatic semicolon insertion has occurred
    parser.options.onInsertedSemicolon?.(parser.startIndex);
  }
}

export function isValidStrictMode(parser: Parser, index: number, tokenIndex: number, tokenValue: string): 0 | 1 {
  if (index - tokenIndex < 13 && tokenValue === 'use strict') {
    if ((parser.getToken() & Token.IsAutoSemicolon) === Token.IsAutoSemicolon || parser.flags & Flags.NewLine) {
      return 1;
    }
  }
  return 0;
}

/**
 * Consumes the current token if the current token kind is
 * the specified `kind` and returns `0`. Otherwise returns `1`.
 *
 * @param parser Parser state
 * @param context Context masks
 * @param token The type of token to consume
 */
export function optionalBit(parser: Parser, context: Context, t: Token): 0 | 1 {
  if (parser.getToken() !== t) return 0;
  nextToken(parser, context);
  return 1;
}

/** Consumes the current token if the current token kind is
 * the specified `kind` and returns `true`. Otherwise returns
 * `false`.
 *
 * @param parser Parser state
 * @param context Context masks
 * @param token The type of token to consume
 */
export function consumeOpt(parser: Parser, context: Context, t: Token): boolean {
  if (parser.getToken() !== t) return false;
  nextToken(parser, context);
  return true;
}

/**
 * Consumes the current token. If the current token kind is not
 * the specified `kind`, an error will be reported.
 *
 * @param parser Parser state
 * @param context Context masks
 * @param t The type of token to consume
 */
export function consume(parser: Parser, context: Context, t: Token): void {
  if (parser.getToken() !== t) parser.report(Errors.ExpectedToken, KeywordDescTable[t & Token.Type]);
  nextToken(parser, context);
}

/**
 * Transforms a `LeftHandSideExpression` into a `AssignmentPattern` if possible,
 * otherwise it returns the original tree.
 *
 * @param parser Parser state
 * @param {*} node
 */
export function reinterpretToPattern(parser: Parser, node: any): void {
  switch (node.type) {
    case 'ArrayExpression': {
      node.type = 'ArrayPattern';
      const { elements } = node;
      for (let i = 0, n = elements.length; i < n; ++i) {
        const element = elements[i];
        if (element) reinterpretToPattern(parser, element);
      }
      return;
    }
    case 'ObjectExpression': {
      node.type = 'ObjectPattern';
      const { properties } = node;
      for (let i = 0, n = properties.length; i < n; ++i) {
        reinterpretToPattern(parser, properties[i]);
      }
      return;
    }
    case 'AssignmentExpression':
      node.type = 'AssignmentPattern';
      if (node.operator !== '=') parser.report(Errors.InvalidDestructuringTarget);
      delete node.operator;
      reinterpretToPattern(parser, node.left);
      return;
    case 'Property':
      reinterpretToPattern(parser, node.value);
      return;
    case 'SpreadElement':
      node.type = 'RestElement';
      reinterpretToPattern(parser, node.argument);
    // No default
  }
}

/**
 * Validates binding identifier
 *
 * @param parser Parser state
 * @param context Context masks
 * @param type Binding type
 * @param token Token
 */

export function validateBindingIdentifier(
  parser: Parser,
  context: Context,
  kind: BindingKind,
  t: Token,
  skipEvalArgCheck: 0 | 1,
): void {
  if (context & Context.Strict) {
    if ((t & Token.FutureReserved) === Token.FutureReserved) {
      parser.report(Errors.UnexpectedStrictReserved);
    }

    if (!skipEvalArgCheck && (t & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      parser.report(Errors.StrictEvalArguments);
    }
  }

  if ((t & Token.Reserved) === Token.Reserved || t === Token.EscapedReserved) {
    parser.report(Errors.KeywordNotId);
  }

  // The BoundNames of LexicalDeclaration and ForDeclaration must not
  // contain 'let'. (CatchParameter is the only lexical binding form
  // without this restriction.)
  if (kind & (BindingKind.Let | BindingKind.Const) && (t & Token.Type) === (Token.LetKeyword & Token.Type)) {
    parser.report(Errors.InvalidLetConstBinding);
  }

  if (context & (Context.InAwaitContext | Context.Module) && t === Token.AwaitKeyword) {
    parser.report(Errors.AwaitIdentInModuleOrAsyncFunc);
  }

  if (context & (Context.InYieldContext | Context.Strict) && t === Token.YieldKeyword) {
    parser.report(Errors.DisallowedInContext, 'yield');
  }
}

export function validateFunctionName(parser: Parser, context: Context, t: Token): void {
  if (context & Context.Strict) {
    if ((t & Token.FutureReserved) === Token.FutureReserved) {
      parser.report(Errors.UnexpectedStrictReserved);
    }

    if ((t & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      parser.report(Errors.StrictEvalArguments);
    }

    if (t === Token.EscapedFutureReserved) {
      parser.report(Errors.InvalidEscapedKeyword);
    }

    if (t === Token.EscapedReserved) {
      parser.report(Errors.InvalidEscapedKeyword);
    }
  }

  if ((t & Token.Reserved) === Token.Reserved) {
    parser.report(Errors.KeywordNotId);
  }

  if (context & (Context.InAwaitContext | Context.Module) && t === Token.AwaitKeyword) {
    parser.report(Errors.AwaitIdentInModuleOrAsyncFunc);
  }

  if (context & (Context.InYieldContext | Context.Strict) && t === Token.YieldKeyword) {
    parser.report(Errors.DisallowedInContext, 'yield');
  }
}

/**
 * Validates binding identifier
 *
 * @param parser Parser state
 * @param context Context masks
 * @param t Token
 */

export function isStrictReservedWord(parser: Parser, context: Context, t: Token): boolean {
  if (t === Token.AwaitKeyword) {
    if (context & (Context.InAwaitContext | Context.Module)) parser.report(Errors.AwaitIdentInModuleOrAsyncFunc);
    parser.destructible |= DestructuringKind.Await;
  }

  if (t === Token.YieldKeyword && context & Context.InYieldContext) parser.report(Errors.DisallowedInContext, 'yield');

  return (
    (t & Token.Reserved) === Token.Reserved ||
    (t & Token.FutureReserved) === Token.FutureReserved ||
    t == Token.EscapedFutureReserved
  );
}

/**
 * Checks if the property has any private field key
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function isPropertyWithPrivateFieldKey(expr: any): boolean {
  return !expr.property ? false : expr.property.type === 'PrivateIdentifier';
}

/**
 * Checks if a label in `LabelledStatement` are valid or not
 *
 * @param parser Parser state
 * @param labels Object holding the labels
 * @param name Current label
 * @param isIterationStatement
 */
export function isValidLabel(parser: Parser, labels: any, name: string, isIterationStatement: 0 | 1): 0 | 1 {
  while (labels) {
    if (labels['$' + name]) {
      if (isIterationStatement) parser.report(Errors.InvalidNestedStatement);
      return 1;
    }
    if (isIterationStatement && labels.loop) isIterationStatement = 0;
    labels = labels['$'];
  }

  return 0;
}

/**
 * Checks if current label already have been declared, and if not
 * declare it
 *
 * @param parser Parser state
 * @param labels Object holding the labels
 * @param name Current label
 */
export function validateAndDeclareLabel(parser: Parser, labels: any, name: string): void {
  let set = labels;
  while (set) {
    if (set['$' + name]) parser.report(Errors.LabelRedeclaration, name);
    set = set['$'];
  }

  labels['$' + name] = 1;
}

/** @internal */
export function isEqualTagName(elementName: any): any {
  switch (elementName.type) {
    case 'JSXIdentifier':
      return elementName.name;
    case 'JSXNamespacedName':
      return elementName.namespace + ':' + elementName.name;
    case 'JSXMemberExpression':
      return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
    /* istanbul ignore next */
    default:
    // ignore
  }
}

/**
 * Appends a name to the `ExportedNames` of the `ExportsList`, and checks
 * for duplicates
 *
 * @see [Link](https://tc39.github.io/ecma262/$sec-exports-static-semantics-exportednames)
 *
 * @param parser Parser object
 * @param name Exported name
 */
export function declareUnboundVariable(parser: Parser, name: string): void {
  if (parser.exportedNames !== void 0 && name !== '') {
    if (parser.exportedNames['#' + name]) {
      parser.report(Errors.DuplicateExportBinding, name);
    }
    parser.exportedNames['#' + name] = 1;
  }
}

/**
 * Appends a name to the `ExportedBindings` of the `ExportsList`,
 *
 * @see [Link](https://tc39.es/ecma262/$sec-exports-static-semantics-exportedbindings)
 *
 * @param parser Parser object
 * @param name Exported binding name
 */
export function addBindingToExports(parser: Parser, name: string): void {
  if (parser.exportedBindings !== void 0 && name !== '') {
    parser.exportedBindings['#' + name] = 1;
  }
}

export function isValidIdentifier(context: Context, t: Token): boolean {
  if (context & (Context.Strict | Context.InYieldContext)) {
    // Module code is also "strict mode code"
    if (context & Context.Module && t === Token.AwaitKeyword) return false;
    if (context & Context.InYieldContext && t === Token.YieldKeyword) return false;
    return (t & Token.Contextual) === Token.Contextual;
  }

  return (t & Token.Contextual) === Token.Contextual || (t & Token.FutureReserved) === Token.FutureReserved;
}

export function classifyIdentifier(parser: Parser, context: Context, t: Token): any {
  if ((t & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
    if (context & Context.Strict) parser.report(Errors.StrictEvalArguments);
    parser.flags |= Flags.StrictEvalArguments;
  }

  if (!isValidIdentifier(context, t)) parser.report(Errors.Unexpected);
}

export type Location = {
  index: number;
  line: number;
  column: number;
};

export function getOwnProperty<T>(object: Record<string | number, T>, key: string | number): T | undefined {
  return Object.hasOwn(object, key) ? object[key] : undefined;
}
