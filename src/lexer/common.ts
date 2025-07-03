import { Chars } from '../chars';
import { Flags } from '../common';
import { type Parser } from '../parser/parser';
import { Token } from '../token';

export const enum LexerState {
  None = 0,
  NewLine = 1 << 0,
  LastIsCR = 1 << 2,
}

export const enum NumberKind {
  ImplicitOctal = 1 << 0,
  Binary = 1 << 1,
  Octal = 1 << 2,
  Hex = 1 << 3,
  Decimal = 1 << 4,
  NonOctalDecimal = 1 << 5,
  Float = 1 << 6,
  ValidBigIntKind = 1 << 7,
  DecimalNumberKind = Decimal | NonOctalDecimal,
}

/**
 * Advances this lexer's current index.
 *
 * @param parser The parser instance
 */
export function advanceChar(parser: Parser): number {
  parser.column++;
  return (parser.currentChar = parser.source.charCodeAt(++parser.index));
}

/**
 * Consumes possible surrogate pair, return the merged code point or 0
 *
 * @param parser The parser instance
 */
export function consumePossibleSurrogatePair(parser: Parser): number {
  // See: https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type
  const hi = parser.currentChar;
  // Not surrogate
  if ((hi & 0xfc00) !== Chars.LeadSurrogateMin) return Chars.Null;
  const lo = parser.source.charCodeAt(parser.index + 1);
  // Unpaired surrogate
  if ((lo & 0xfc00) !== Chars.TrailSurrogateMin) return Chars.Null;
  // Merged code point
  return Chars.NonBMPMin + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
}

/**
 * Use to consume a line feed instead of `scanNewLine`.
 */
export function consumeLineFeed(parser: Parser, state: LexerState): void {
  parser.currentChar = parser.source.charCodeAt(++parser.index);
  parser.flags |= Flags.NewLine;
  if ((state & LexerState.LastIsCR) === 0) {
    parser.column = 0;
    parser.line++;
  }
}

export function scanNewLine(parser: Parser): void {
  parser.flags |= Flags.NewLine;
  parser.currentChar = parser.source.charCodeAt(++parser.index);
  parser.column = 0;
  parser.line++;
}

// ECMA-262 11.2 White Space
// gC=Zs, U+0009, U+000B, U+000C, U+FEFF
export function isExoticECMAScriptWhitespace(ch: number): boolean {
  return (
    ch === Chars.NonBreakingSpace ||
    ch === Chars.ZeroWidthNoBreakSpace ||
    ch === Chars.NextLine ||
    ch === Chars.Ogham ||
    (ch >= Chars.EnQuad && ch <= Chars.ZeroWidthSpace) ||
    ch === Chars.NarrowNoBreakSpace ||
    ch === Chars.MathematicalSpace ||
    ch === Chars.IdeographicSpace ||
    ch === Chars.ThinSpace ||
    ch === Chars.ByteOrderMark
  );
}

/**
 * Converts a value to a hex value
 *
 * @param code CodePoint
 */
export function toHex(code: number): number {
  return code < Chars.UpperA ? code - Chars.Zero : (code - Chars.UpperA + 10) & 0xf;
}

/**
 * Converts a token to a string representation
 *
 * @param t Token
 */
export function convertTokenType(t: Token): string {
  switch (t) {
    case Token.NumericLiteral:
      return 'NumericLiteral';
    case Token.StringLiteral:
      return 'StringLiteral';
    case Token.FalseKeyword:
    case Token.TrueKeyword:
      return 'BooleanLiteral';
    case Token.NullKeyword:
      return 'NullLiteral';
    case Token.RegularExpression:
      return 'RegularExpression';
    case Token.TemplateContinuation:
    case Token.TemplateSpan:
    case Token.Template:
      return 'TemplateLiteral';
    default:
      if ((t & Token.IsIdentifier) === Token.IsIdentifier) return 'Identifier';
      if ((t & Token.Keyword) === Token.Keyword) return 'Keyword';

      return 'Punctuator';
  }
}
