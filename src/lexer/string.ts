import { ParserState, Context, Flags } from '../common';
import { Token } from '../token';
import { Chars } from '../chars';
import { report, Errors } from '../errors';
import { toHex, nextCodePoint, fromCodePoint, CharTypes, CharFlags } from './';

// Intentionally negative
export const enum Escape {
  Empty = -1,
  StrictOctal = -2,
  EightOrNine = -3,
  InvalidHex = -4,
  OutOfRange = -5
}

/**
 * Scan a string token.
 */
export function scanString(parser: ParserState, context: Context): any {
  const quote = parser.currentCodePoint;
  const { index: start } = parser;
  let ret: string | void = '';
  let ch = nextCodePoint(parser);
  let marker = parser.index; // Consumes the quote
  while ((CharTypes[ch] & CharFlags.LineTerminator) === 0) {
    if (ch === quote) {
      ret += parser.source.slice(marker, parser.index);
      nextCodePoint(parser); // skip closing quote
      if (context & Context.OptionsRaw) parser.source.slice(start, parser.index);
      parser.tokenValue = ret;
      return Token.StringLiteral;
    }

    if ((ch & 8) === 8 && ch === Chars.Backslash) {
      ret += parser.source.slice(marker, parser.index);
      const ch = nextCodePoint(parser);

      if (ch > 0x7e) {
        ret += fromCodePoint(ch);
      } else {
        const code = parseEscape(parser, context, ch);

        if (code >= 0) ret += fromCodePoint(code);
        else handleStringError(parser, code as Escape);
      }
      marker = parser.index + 1;
    }

    if (parser.index >= parser.length) report(parser, Errors.UnterminatedString);
    ch = nextCodePoint(parser);
  }

  report(parser, Errors.UnterminatedString);
}

export function parseEscape(parser: ParserState, context: Context, first: number): number {
  switch (first) {
    // https://tc39.github.io/ecma262/#prod-SingleEscapeCharacter
    // one of ' " \ b f n r t v
    case Chars.LowerB:
      return Chars.Backspace;
    case Chars.LowerF:
      return Chars.FormFeed;
    case Chars.LowerR:
      return Chars.CarriageReturn;
    case Chars.LowerN:
      return Chars.LineFeed;
    case Chars.LowerT:
      return Chars.Tab;
    case Chars.LowerV:
      return Chars.VerticalTab;

    // Line continuations
    case Chars.CarriageReturn: {
      const { index } = parser;

      if (index < parser.length) {
        const ch = parser.source.charCodeAt(index);

        if (ch === Chars.LineFeed) {
          parser.currentCodePoint = ch;
          parser.index = index + 1;
        }
      }
    }
    // falls through

    case Chars.LineFeed:
    case Chars.LineSeparator:
    case Chars.ParagraphSeparator:
      parser.column = -1;
      parser.line++;
      return Escape.Empty;

    // Null character, octals
    case Chars.Zero:
    case Chars.One:
    case Chars.Two:
    case Chars.Three: {
      let code = first - Chars.Zero;
      let index = parser.index + 1;
      let column = parser.column + 1;

      if (index < parser.length) {
        const next = parser.source.charCodeAt(index);

        if ((CharTypes[next] & CharFlags.Octal) === 0) {
          // Verify that it's `\0` if we're in strict mode.
          if ((code !== 0 || CharTypes[next] & CharFlags.ImplicitOctalDigits) && context & Context.Strict)
            return Escape.StrictOctal;
        } else if (context & Context.Strict) {
          return Escape.StrictOctal;
        } else {
          parser.currentCodePoint = next;
          code = (code << 3) | (next - Chars.Zero);
          index++;
          column++;

          if (index < parser.length) {
            const next = parser.source.charCodeAt(index);

            if (CharTypes[next] & CharFlags.Octal) {
              parser.currentCodePoint = next;
              code = (code << 3) | (next - Chars.Zero);
              index++;
              column++;
            }
          }

          parser.index = index - 1;
          parser.column = column - 1;
        }
      }

      return code;
    }

    case Chars.Four:
    case Chars.Five:
    case Chars.Six:
    case Chars.Seven: {
      if (context & Context.Strict) return Escape.StrictOctal;

      let code = first - Chars.Zero;
      const index = parser.index + 1;
      const column = parser.column + 1;

      if (index < parser.length) {
        const next = parser.source.charCodeAt(index);

        if (CharTypes[next] & CharFlags.Octal) {
          code = (code << 3) | (next - Chars.Zero);
          parser.currentCodePoint = next;
          parser.index = index;
          parser.column = column;
        }
      }

      return code;
    }

    // `8`, `9` (invalid escapes)
    case Chars.Eight:
    case Chars.Nine:
      return Escape.EightOrNine;

    // HexEscapeSequence
    // \x HexDigit HexDigit
    case Chars.LowerX: {
      const ch1 = nextCodePoint(parser);
      if ((CharTypes[ch1] & CharFlags.Hex) === 0) return Escape.InvalidHex;
      const hi = toHex(ch1);
      const ch2 = nextCodePoint(parser);
      if ((CharTypes[ch2] & CharFlags.Hex) === 0) return Escape.InvalidHex;
      const lo = toHex(ch2);

      return (hi << 4) | lo;
    }

    // UnicodeEscapeSequence
    // \u HexDigit HexDigit HexDigit HexDigit
    // \u { HexDigit HexDigit HexDigit ... }
    case Chars.LowerU: {
      const ch = nextCodePoint(parser);

      if (parser.currentCodePoint === Chars.LeftBrace) {
        let code = 0;
        while ((CharTypes[nextCodePoint(parser)] & CharFlags.Hex) !== 0) {
          code = (code << 4) | toHex(parser.currentCodePoint);
          if (code > Chars.NonBMPMax) return Escape.OutOfRange;
        }

        if (parser.currentCodePoint < 1 || (parser.currentCodePoint as number) !== Chars.RightBrace) {
          return Escape.InvalidHex;
        }
        return code;
      } else {
        if ((CharTypes[ch] & CharFlags.Hex) === 0) return Escape.InvalidHex; // first one is mandatory
        const c2 = parser.source.charCodeAt(parser.index + 1);
        if ((CharTypes[c2] & CharFlags.Hex) === 0) return Escape.InvalidHex;
        const c3 = parser.source.charCodeAt(parser.index + 2);
        if ((CharTypes[c3] & CharFlags.Hex) === 0) return Escape.InvalidHex;
        const c4 = parser.source.charCodeAt(parser.index + 3);
        if ((CharTypes[c4] & CharFlags.Hex) === 0) return Escape.InvalidHex;

        parser.index += 3;
        parser.column += 3;

        return (toHex(ch) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);
      }
    }

    default:
      return nextUnicodeChar(parser);
  }
}

export function handleStringError(state: ParserState, code: Escape): void {
  switch (code) {
    case Escape.Empty:
      return;

    case Escape.StrictOctal:
      report(state, Errors.StrictOctalEscape);

    case Escape.EightOrNine:
      report(state, Errors.InvalidEightAndNine);

    case Escape.InvalidHex:
      report(state, Errors.InvalidHexEscapeSequence);

    case Escape.OutOfRange:
      report(state, Errors.UnicodeOverflow);

    default:
  }
}
export function nextUnicodeChar(parser: ParserState) {
  let { index } = parser;
  const hi = parser.source.charCodeAt(index++);

  if (hi < 0xd800 || hi > 0xdbff) return hi;
  if (index === parser.source.length) return hi;
  const lo = parser.source.charCodeAt(index);

  if (lo < 0xdc00 || lo > 0xdfff) return hi;
  return ((hi & 0x3ff) << 10) | (lo & 0x3ff) | 0x10000;
}
