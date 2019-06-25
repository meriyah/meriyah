import { Token, KeywordDescTable } from './token';
import { Errors, report } from './errors';
import { Node } from './estree';
import { nextToken } from './lexer/scan';

/**
 * The core context, passed around everywhere as a simple immutable bit set.
 */
export const enum Context {
  None                  = 0,
  OptionsNext           = 1 << 0,
  OptionsRanges         = 1 << 1,
  OptionsLoc            = 1 << 2,
  OptionsDirectives     = 1 << 3,
  OptionsJSX            = 1 << 4,
  OptionsGlobalReturn   = 1 << 5,
  OptionsLexical        = 1 << 6,
  OptionsParenthesized  = 1 << 7,
  OptionsWebCompat      = 1 << 8,
  OptionsRaw            = 1 << 9,
  Strict                = 1 << 10,
  Module                = 1 << 11, // Current code should be parsed as a module body
  InSwitch              = 1 << 12,
  InGlobal              = 1 << 13,
  TopLevel              = 1 << 14,
  AllowRegExp           = 1 << 15,
  TaggedTemplate        = 1 << 16,
  InIteration           = 1 << 17,
  SuperProperty         = 1 << 18,
  SuperCall             = 1 << 19,
  InYieldContext        = 1 << 21,
  InAwaitContext        = 1 << 22,
  InArgList             = 1 << 23,
  InConstructor         = 1 << 24,
  InMethod              = 1 << 25,
  AllowNewTarget        = 1 << 26,
  DisallowIn            = 1 << 27,
  InClass               = 1 << 28
}

export const enum PropertyKind {
  None        = 0,
  Method      = 1 << 0,
  Computed    = 1 << 1,
  Shorthand   = 1 << 2,
  Generator   = 1 << 3,
  Async       = 1 << 4,
  Static      = 1 << 5,
  Constructor = 1 << 6,
  ClassField  = 1 << 7,
  Getter      = 1 << 8,
  Setter      = 1 << 9,
  Extends     = 1 << 10,
  Literal     = 1 << 11,
  PrivateField = 1 << 12,
  GetSet = Getter | Setter
}

export const enum BindingType {
  None          = 0,
  Variable      = 1 << 0,
  ArgList       = 1 << 1,
  Let           = 1 << 3,
  Const         = 1 << 4
}

export const enum BindingOrigin {
  None          = 0,
  Declaration   = 1 << 0,
  Arrow         = 1 << 1,
  ForStatement  = 1 << 2,
  Statement     = 1 << 3,
  Export        = 1 << 4
}

export const enum AssignmentKind {
  None           = 0,
  Assignable   = 1 << 0,
  NotAssignable   = 1 << 1
}

export const enum DestructuringKind {
  None               = 0,
  MustDestruct       = 1 << 3,
  CannotDestruct     = 1 << 4,
  // Only destructible if assignable
  AssignableDestruct = 1 << 5,
  // `__proto__` is a special case and only valid to parse if destructible
  SeenProto          = 1 << 6,
  Await              = 1 << 7,
  Yield              = 1 << 8,
}

/**
 * The mutable parser flags, in case any flags need passed by reference.
 */
export const enum Flags {
  None                = 0,
  NewLine             = 1 << 0,
  HasConstructor      = 1 << 5,
  Octals              = 1 << 6,
  SimpleParameterList = 1 << 7,
  Yield               = 1 << 8,
}

export const enum HoistedClassFlags {
  None,
  Hoisted = 1 << 0,
  Export = 1 << 1
}

export const enum HoistedFunctionFlags {
  None,
  Hoisted = 1 << 0,
  Export = 1 << 1
}

export const enum FunctionStatement {
  Disallow,
  Allow,
}

/**
 * The parser interface.
 */
export interface ParserState {
  source: string;
  flags: Flags;
  index: number;
  line: number;
  column: number;
  tokenIndex: number;
  startIndex: number;
  startColumn: number;
  startLine: number;
  columnPos: number;
  linePos: number;
  end: number;
  token: Token;
  tokenValue: any;
  tokenRaw: string;
  tokenRegExp: void | {
    pattern: string;
    flags: string;
  };
  sourceFile: string | void;
  assignable: AssignmentKind | DestructuringKind;
  destructible: AssignmentKind | DestructuringKind;
  nextCP: number;
  exportedNames: any;
  exportedBindings: any;
}

/**
 * Check for automatic semicolon insertion according to the rules
 * given in `ECMA-262, section 7.9, page 21`.
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function consumeSemicolon(parser: ParserState, context: Context): void {
  if ((parser.flags & Flags.NewLine) === 0 && (parser.token & Token.IsAutoSemicolon) !== Token.IsAutoSemicolon) {
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }
  consumeOpt(parser, context, Token.Semicolon);
}

/**
 * Consumes the current token if the current token kind is
 * the specified `kind` and returns `0`. Otherwise returns `1`.
 *
 * @param parser Parser state
 * @param context Context masks
 * @param token The type of token to consume
 */
export function optionalBit(parser: ParserState, context: Context, t: Token): 0 | 1 {
  if (parser.token !== t) return 0;
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
export function consumeOpt(parser: ParserState, context: Context, t: Token): boolean {
  if (parser.token !== t) return false;
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
export function consume(parser: ParserState, context: Context, t: Token): void {
  if (parser.token !== t) report(parser, Errors.ExpectedToken, KeywordDescTable[t & Token.Type]);
  nextToken(parser, context);
}

/**
 * Transforms a `LeftHandSideExpression` into a `AssignmentPattern` if possible,
 * otherwise it returns the original tree.
 *
 * @param parser Parser state
 * @param {*} node
 */
export function reinterpretToPattern(state: ParserState, node: any): void {
  switch (node.type) {
    case 'ArrayExpression':
      node.type = 'ArrayPattern';
      const elements = node.elements;
      for (let i = 0, n = elements.length; i < n; ++i) {
        const element = elements[i];
        if (element) reinterpretToPattern(state, element);
      }
      return;
    case 'ObjectExpression':
      node.type = 'ObjectPattern';
      const properties = node.properties;
      for (let i = 0, n = properties.length; i < n; ++i) {
        reinterpretToPattern(state, properties[i]);
      }
      return;
    case 'AssignmentExpression':
      node.type = 'AssignmentPattern';
      if (node.operator !== '=') report(state, Errors.InvalidDestructuringTarget);
      delete node.operator;
      reinterpretToPattern(state, node.left);
      return;
    case 'Property':
      reinterpretToPattern(state, node.value);
      return;
    case 'SpreadElement':
      node.type = 'RestElement';
      reinterpretToPattern(state, node.argument);
    default: // ignore
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
  parser: ParserState,
  context: Context,
  type: BindingType,
  t: Token,
  skipEvalArgCheck: 0 | 1
): void {
  if ((t & Token.Keyword) !== Token.Keyword) return;

  if (context & Context.Strict) {
    if (t === Token.StaticKeyword) {
      report(parser, Errors.InvalidStrictStatic);
    }

    if ((t & Token.FutureReserved) === Token.FutureReserved) {
      report(parser, Errors.FutureReservedWordInStrictModeNotId);
    }

    if (!skipEvalArgCheck && (t & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    }

    if (t === Token.EscapedFutureReserved) {
      report(parser, Errors.InvalidEscapedKeyword);
    }
  }

  if ((t & Token.Reserved) === Token.Reserved) {
    report(parser, Errors.KeywordNotId);
  }

  if (type & (BindingType.Let | BindingType.Const) && t === Token.LetKeyword) {
    report(parser, Errors.InvalidLetConstBinding);
  }

  if (context & (Context.InAwaitContext | Context.Module) && t === Token.AwaitKeyword) {
      report(parser, Errors.AwaitOutsideAsync);
  }

  if (context & (Context.InYieldContext | Context.Strict) && t === Token.YieldKeyword) {
      report(parser, Errors.DisallowedInContext, 'yield');
  }

  if (t === Token.EscapedReserved) {
    report(parser, Errors.InvalidEscapedKeyword);
  }
}

/**
 * Validates binding identifier
 *
 * @param parser Parser state
 * @param context Context masks
  * @param t Token
 */

export function isStrictReservedWord(parser: ParserState, context: Context, t: Token): boolean {
  if (t === Token.AwaitKeyword) {
    if (context & (Context.InAwaitContext | Context.Module)) report(parser, Errors.AwaitOutsideAsync);
    parser.destructible |= DestructuringKind.Await;
  }

  if (t === Token.YieldKeyword && context & Context.InYieldContext) report(parser, Errors.DisallowedInContext, 'yield');

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
  return !expr.property ? false : expr.property.type === 'PrivateName';
}

/**
 * Checks if a label in `LabelledStatement` are valid or not
 *
 * @param parser Parser state
 * @param labels Object holding the labels
 * @param name Current label
 * @param isIterationStatement
 */
export function isValidLabel(parser: ParserState, labels: any, name: string, isIterationStatement: 0 | 1): 0 | 1 {

  while (labels) {
    if (labels['$' + name]) {
      if (isIterationStatement) report(parser, Errors.InvalidNestedStatement);
      return 1;
    }
    if (isIterationStatement && labels.loop) isIterationStatement = 0;
    labels = labels['$'];
  }

  return 0;
}

/**
 * Checks if current label already have been declrared, and if not
 * declare it
 *
 * @param parser Parser state
 * @param labels Object holding the labels
 * @param name Current label
 */
export function validateAndDeclareLabel(parser: ParserState, labels: any, name: string): void {
  let set = labels;
  do {
    if (set['$' + name]) report(parser, Errors.LabelRedeclaration, name);
    set = set['$'];
  } while (set);

  labels['$' + name] = 1;
}

export function finishNode<T extends Node>(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number,
  node: T,
): T {
  if (context & Context.OptionsRanges) {
    node.start = start;
    node.end = parser.startIndex;
  }

  if (context & Context.OptionsLoc) {
    node.loc = {
      start: {
        line,
        column,
      },
      end: {
        line: parser.startLine,
        column: parser.startColumn,
      }
    };

    if (parser.sourceFile) {
      node.loc.source = parser.sourceFile;
  }
  }

  return node;
}
