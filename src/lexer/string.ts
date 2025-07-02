import { Chars } from '../chars';
import { Context, Flags } from '../common';
import { Errors } from '../errors';
import { type Parser } from '../parser/parser';
import { Token } from '../token';
import { CharFlags, CharTypes } from './charClassifier';
import { advanceChar, toHex } from './common';
// Intentionally negative
export const enum Escape {
  Empty = -1,
  StrictOctal = -2,
  EightOrNine = -3,
  InvalidHex = -4,
  OutOfRange = -5,
}

/**
 * Scan a string token.
 */
export function scanString(parser: Parser, context: Context, quote: number): Token {
  const { index: start } = parser;

  let ret: string | void = '';
  let char = advanceChar(parser);
  let marker = parser.index; // Consumes the quote

  while ((CharTypes[char] & CharFlags.LineTerminator) === 0) {
    if (char === quote) {
      ret += parser.source.slice(marker, parser.index);
      advanceChar(parser); // skip closing quote
      if (parser.options.raw) parser.tokenRaw = parser.source.slice(start, parser.index);
      parser.tokenValue = ret;
      return Token.StringLiteral;
    }

    if ((char & 8) === 8 && char === Chars.Backslash) {
      ret += parser.source.slice(marker, parser.index);
      char = advanceChar(parser);

      if (char < 0x7f || char === Chars.LineSeparator || char === Chars.ParagraphSeparator) {
        const code = parseEscape(parser, context, char);
        if (code >= 0) ret += String.fromCodePoint(code);
        else handleStringError(parser, code as Escape, /* isTemplate */ 0);
      } else {
        ret += String.fromCodePoint(char);
      }
      marker = parser.index + 1;
    } else if (char === Chars.LineSeparator || char === Chars.ParagraphSeparator) {
      parser.column = -1;
      parser.line++;
    }

    if (parser.index >= parser.end) parser.report(Errors.UnterminatedString);

    char = advanceChar(parser);
  }

  parser.report(Errors.UnterminatedString);
}

// TODO! Use table lookup

export function parseEscape(parser: Parser, context: Context, first: number, isTemplate: 0 | 1 = 0): number {
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
      if (parser.index < parser.end) {
        const nextChar = parser.source.charCodeAt(parser.index + 1);
        if (nextChar === Chars.LineFeed) {
          parser.index = parser.index + 1;
          parser.currentChar = nextChar;
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

    // Null character, octal
    case Chars.Zero:
    case Chars.One:
    case Chars.Two:
    case Chars.Three: {
      let code = first - Chars.Zero;
      let index = parser.index + 1;
      let column = parser.column + 1;

      if (index < parser.end) {
        const next = parser.source.charCodeAt(index);

        if ((CharTypes[next] & CharFlags.Octal) === 0) {
          // Verify that it's `\0` if we're in strict mode.
          if (code !== 0 || CharTypes[next] & CharFlags.ImplicitOctalDigits) {
            if (context & Context.Strict || isTemplate) return Escape.StrictOctal;
            parser.flags |= Flags.Octal;
          }
        } else if (context & Context.Strict || isTemplate) {
          return Escape.StrictOctal;
        } else {
          parser.currentChar = next;
          code = (code << 3) | (next - Chars.Zero);
          index++;
          column++;
          if (index < parser.end) {
            const next = parser.source.charCodeAt(index);

            if (CharTypes[next] & CharFlags.Octal) {
              parser.currentChar = next;
              code = (code << 3) | (next - Chars.Zero);
              index++;
              column++;
            }
          }
          parser.flags |= Flags.Octal;
        }

        parser.index = index - 1;
        parser.column = column - 1;
      }

      return code;
    }

    case Chars.Four:
    case Chars.Five:
    case Chars.Six:
    case Chars.Seven: {
      if (isTemplate || context & Context.Strict) return Escape.StrictOctal;

      let code = first - Chars.Zero;
      const index = parser.index + 1;
      const column = parser.column + 1;

      if (index < parser.end) {
        const next = parser.source.charCodeAt(index);

        if (CharTypes[next] & CharFlags.Octal) {
          code = (code << 3) | (next - Chars.Zero);
          parser.currentChar = next;
          parser.index = index;
          parser.column = column;
        }
      }

      parser.flags |= Flags.Octal;

      return code;
    }

    // HexEscapeSequence
    // \x HexDigit HexDigit
    case Chars.LowerX: {
      const ch1 = advanceChar(parser);
      if ((CharTypes[ch1] & CharFlags.Hex) === 0) return Escape.InvalidHex;
      const hi = toHex(ch1);
      const ch2 = advanceChar(parser);
      if ((CharTypes[ch2] & CharFlags.Hex) === 0) return Escape.InvalidHex;
      const lo = toHex(ch2);

      return (hi << 4) | lo;
    }

    // UnicodeEscapeSequence
    // \u HexDigit HexDigit HexDigit HexDigit
    // \u { HexDigit HexDigit HexDigit ... }
    case Chars.LowerU: {
      const ch = advanceChar(parser);

      if (parser.currentChar === Chars.LeftBrace) {
        let code = 0;
        while ((CharTypes[advanceChar(parser)] & CharFlags.Hex) !== 0) {
          code = (code << 4) | toHex(parser.currentChar);
          if (code > Chars.NonBMPMax) return Escape.OutOfRange;
        }

        if (parser.currentChar < 1 || (parser.currentChar as number) !== Chars.RightBrace) {
          return Escape.InvalidHex;
        }
        return code;
      } else {
        if ((CharTypes[ch] & CharFlags.Hex) === 0) return Escape.InvalidHex; // first one is mandatory
        const ch2 = parser.source.charCodeAt(parser.index + 1);
        if ((CharTypes[ch2] & CharFlags.Hex) === 0) return Escape.InvalidHex;
        const ch3 = parser.source.charCodeAt(parser.index + 2);
        if ((CharTypes[ch3] & CharFlags.Hex) === 0) return Escape.InvalidHex;
        const ch4 = parser.source.charCodeAt(parser.index + 3);
        if ((CharTypes[ch4] & CharFlags.Hex) === 0) return Escape.InvalidHex;

        parser.index += 3;
        parser.column += 3;

        parser.currentChar = parser.source.charCodeAt(parser.index);

        return (toHex(ch) << 12) | (toHex(ch2) << 8) | (toHex(ch3) << 4) | toHex(ch4);
      }
    }

    // `8`, `9` (invalid escapes)
    case Chars.Eight:
    case Chars.Nine:
      if (isTemplate || !parser.options.webcompat || context & Context.Strict) return Escape.EightOrNine;
      parser.flags |= Flags.EightAndNine;
    // fallthrough
    default:
      return first;
  }
}

export function handleStringError(parser: Parser, code: Escape, isTemplate: 0 | 1): void {
  switch (code) {
    case Escape.Empty:
      return;

    case Escape.StrictOctal:
      parser.report(isTemplate ? Errors.TemplateOctalLiteral : Errors.StrictOctalEscape);

    case Escape.EightOrNine:
      parser.report(isTemplate ? Errors.TemplateEightAndNine : Errors.InvalidEightAndNine);

    case Escape.InvalidHex:
      parser.report(Errors.InvalidHexEscapeSequence);

    case Escape.OutOfRange:
      parser.report(Errors.UnicodeOverflow);

    // No default
  }
}
