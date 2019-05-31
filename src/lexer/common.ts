import { Chars } from '../chars';
import { ParserState } from '../common';
import { unicodeLookup } from '../unicode';
import { report, Errors } from '../errors';

export const enum Seek {
  None,
  SameLine,
  NewLine
}
export const enum ScannerState {
  None = 0,
  NewLine = 1 << 0,
  SameLine = 1 << 1,
  LastIsCR = 1 << 2
}

/**
 * Advances this lexer's current index.
 * @param parser The parser instance
 */
export function nextCodePoint(parser: ParserState): number {
  parser.column++;
  return (parser.nextCP = parser.source.charCodeAt(++parser.index));
}

export function consumeMultiUnitCodePoint(parser: ParserState, hi: number): boolean {
  // See: https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type
  if ((hi & 0xfc00) !== Chars.LeadSurrogateMin) return false;
  const lo = parser.source.charCodeAt(parser.index + 1);
  if ((lo & 0xfc00) !== 0xdc00) return false;
  hi = Chars.NonBMPMin + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
  if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
    report(parser, Errors.IllegalCaracter, fromCodePoint(hi));
  }
  parser.index++;
  parser.column++;
  parser.nextCP = hi;
  return true;
}

// ECMA-262 11.2 White Space
export function isExoticECMAScriptWhitespace(code: number): boolean {
  /**
   * There are 25 white space characters we need to correctly class.
   * Lucky for us that we have already classified the lower ASCII range (127) white space, so
   * what we have to do now is to validate against the remaining
   * 15 Unicode category "Zs" ("Space_Separator") chars.
   *
   * - 0x1680
   * - 0x2000
   * - 0x2001
   * - 0x2002
   * - 0x2003
   * - 0x2004
   * - 0x2005
   * - 0x2006
   * - 0x2007
   * - 0x2008
   * - 0x2009
   * - 0x200a
   * - 0x2028 // <LS> LineTerminator (LINE SEPARATOR)
   * - 0x2029 // <PS> LineTerminator (PARAGRAPH SEPARATOR)
   * - 0x202f
   * - 0x205f
   * - 0x3000
   * - 0xfeff // <ZWNBSP>
   */
  return (
    code === Chars.NonBreakingSpace ||
    code === Chars.NextLine ||
    code === Chars.Ogham ||
    (code >= Chars.EnQuad && code <= Chars.ZeroWidthSpace) ||
    code === Chars.NarrowNoBreakSpace ||
    code === Chars.MathematicalSpace ||
    code === Chars.IdeographicSpace ||
    code === Chars.ByteOrderMark
  );
}

/**
 * Optimized version of 'fromCodePoint'
 *
 * @param {number} code
 * @returns {string}
 */
export function fromCodePoint(codePoint: number): string {
  return codePoint <= 65535
    ? String.fromCharCode(codePoint)
    : String.fromCharCode(codePoint >>> 10) + String.fromCharCode(codePoint & 0x3ff);
}

/**
 * Converts a value to a hex value
 *
 * @param code CodePoint
 */
export function toHex(code: number): number {
  return code < Chars.UpperA ? code - Chars.Zero : (code - Chars.UpperA + 10) & 0xf;
}
