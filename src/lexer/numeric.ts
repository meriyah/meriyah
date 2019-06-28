import { ParserState, Context, Flags } from '../common';
import { Token } from '../token';
import { nextCP, toHex, CharTypes, CharFlags, isIdentifierStart } from './';
import { Chars } from '../chars';
import { report, Errors } from '../errors';

export const enum NumberKind {
  ImplicitOctal = 1 << 0,
  Binary = 1 << 1,
  Octal = 1 << 2,
  Hex = 1 << 3,
  Decimal = 1 << 4,
  DecimalWithLeadingZero = 1 << 5
}

export const enum SeparatorState {
  None = 0,
  Allowed = 1 << 0,
  Previous = 1 << 1
}

export function scanDigits(parser: ParserState, char: number): string {
  let seenSeparator = false;
  let start = parser.index;
  let ret = '';
  while (CharTypes[char] & (CharFlags.Decimal | CharFlags.Underscore)) {
    if (char === Chars.Underscore) {
      const preUnderscoreIndex = parser.index;
      char = nextCP(parser);
      if (char === Chars.Underscore) report(parser, Errors.ContinuousNumericSeparator);
      seenSeparator = true;
      ret += parser.source.substring(start, preUnderscoreIndex);
      start = parser.index;
      continue;
    }
    seenSeparator = false;
    char = nextCP(parser);
  }
  if (seenSeparator) {
    report(parser, Errors.TrailingNumericSeparator);
  }

  return ret + parser.source.substring(start, parser.index);
}

export function scanNumber(parser: ParserState, context: Context, isFloat: 0 | 1): Token {
  let kind: NumberKind = NumberKind.Decimal;
  let char = parser.nextCP;
  let value: any = 0;
  let digit = 9;
  let atStart = !isFloat;
  let state = SeparatorState.None;

  if (isFloat) {
    if (char === Chars.Underscore) report(parser, Errors.Unexpected);
    value += '.' + scanDigits(parser, char);
    char = parser.nextCP;
  } else {
    if (char === Chars.Zero) {
      char = nextCP(parser);

      // Hex
      if ((char | 32) === Chars.LowerX) {
        kind = NumberKind.Hex;
        let digits = 0;

        char = nextCP(parser);
        while (CharTypes[char] & (CharFlags.Hex | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            //  let seenSeparator = 1;
            if (state & SeparatorState.Allowed) {
              state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Allowed;
            } else if (state & SeparatorState.Previous) {
              report(parser, Errors.ContinuousNumericSeparator);
            } else {
              report(parser, Errors.ContinuousNumericSeparator);
            }
            char = nextCP(parser);
            continue;
          }
          state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Previous;
          value = value * 0x10 + toHex(char);
          digits++;
          char = nextCP(parser);
        }

        if (parser.source.charCodeAt(parser.index - 1) === Chars.Underscore)
          report(parser, Errors.TrailingNumericSeparator);

        char = parser.nextCP;
        if (digits < 1) report(parser, Errors.MissingHexDigits);
        // Octal
      } else if ((char | 32) === Chars.LowerO) {
        kind = NumberKind.Octal;
        let digits = 0;

        char = nextCP(parser);
        while (CharTypes[char] & (CharFlags.Octal | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            //  let seenSeparator = 1;
            if (state & SeparatorState.Allowed) {
              state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Allowed;
            } else if (state & SeparatorState.Previous) {
              report(parser, Errors.ContinuousNumericSeparator);
            } else {
              report(parser, Errors.ContinuousNumericSeparator);
            }
            char = nextCP(parser);
            continue;
          }
          state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Previous;
          value = value * 8 + (char - Chars.Zero);
          digits++;
          char = nextCP(parser);
        }

        if (parser.source.charCodeAt(parser.index - 1) === Chars.Underscore)
          report(parser, Errors.TrailingNumericSeparator);

        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${8}`);
      } else if ((char | 32) === Chars.LowerB) {
        kind = NumberKind.Binary;
        let digits = 0;
        char = nextCP(parser);
        while (CharTypes[char] & (CharFlags.Binary | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            if (state & SeparatorState.Allowed) {
              state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Allowed;
            } else if (state & SeparatorState.Previous) {
              report(parser, Errors.ContinuousNumericSeparator);
            } else {
              report(parser, Errors.ContinuousNumericSeparator);
            }
            char = nextCP(parser);
            continue;
          }
          state = (state | SeparatorState.Allowed | SeparatorState.Previous) ^ SeparatorState.Previous;
          value = value * 2 + (char - Chars.Zero);
          digits++;
          char = nextCP(parser);
        }
        if (parser.source.charCodeAt(parser.index - 1) === Chars.Underscore)
          report(parser, Errors.TrailingNumericSeparator);
        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${2}`);
      } else if (CharTypes[char] & CharFlags.Octal) {
        // Octal integer literals are not permitted in strict mode code
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        kind = NumberKind.ImplicitOctal;
        do {
          if (CharTypes[parser.nextCP] & CharFlags.ImplicitOctalDigits) {
            kind = NumberKind.DecimalWithLeadingZero;
            atStart = false;
            break;
          }
          value = value * 8 + (parser.nextCP - Chars.Zero);
        } while (CharTypes[nextCP(parser)] & CharFlags.Decimal);
        char = parser.nextCP;
      } else if (CharTypes[char] & CharFlags.ImplicitOctalDigits) {
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        else parser.flags = Flags.Octals;
        kind = NumberKind.DecimalWithLeadingZero;
        char = parser.nextCP;
      } else if (char === Chars.Underscore) {
        report(parser, Errors.Unexpected);
      }
    }

    // Parse decimal digits and allow trailing fractional part
    if (kind & (NumberKind.Decimal | NumberKind.DecimalWithLeadingZero)) {
      let seenSeparator = 0;

      if (atStart) {
        while (digit >= 0 && CharTypes[char] & (CharFlags.Decimal | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            char = nextCP(parser);
            if (char === Chars.Underscore) report(parser, Errors.ContinuousNumericSeparator);
            seenSeparator = 1;
            continue;
          }
          seenSeparator = 0;
          value = 10 * value + (char - Chars.Zero);
          char = nextCP(parser);
          --digit;
        }
        if (seenSeparator) {
          report(parser, Errors.TrailingNumericSeparator);
        }

        if (digit >= 0 && !isIdentifierStart(char) && char !== Chars.Period && char !== Chars.Underscore) {
          // Most numbers are pure decimal integers without fractional component
          // or exponential notation.  Handle that with optimized code.
          parser.tokenValue = value;
          if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
          return Token.NumericLiteral;
        }
      }

      value += scanDigits(parser, char);

      char = parser.nextCP;

      // Consume any decimal dot and fractional component.
      if (char === Chars.Period) {
        char = nextCP(parser);
        if ((char as number) === Chars.Underscore) report(parser, Errors.Unexpected);
        isFloat = 1;
        value += '.' + scanDigits(parser, char);
        char = parser.nextCP;
      }
    }
  }
  const end = parser.index;

  let isBigInt: 0 | 1 = 0;

  if (char === Chars.LowerN) {
    if (isFloat) report(parser, Errors.InvalidBigInt);
    isBigInt = 1;
    char = nextCP(parser);
  } else {
    // Consume any exponential notation.
    if ((parser.nextCP | 32) === Chars.LowerE) {
      char = nextCP(parser);
      // '-', '+'
      if (CharTypes[char] & CharFlags.Exponent) {
        char = nextCP(parser);
      }

      const preNumericPart = parser.index;

      // Exponential notation must contain at least one digit
      if ((CharTypes[char] & CharFlags.Decimal) < 1) report(parser, Errors.MissingExponent);

      // Consume exponential digits
      value += parser.source.substring(end, preNumericPart) + scanDigits(parser, char);

      char = parser.nextCP;
    }
  }

  // The source character immediately following a numeric literal must
  // not be an identifier start or a decimal digit
  if (CharTypes[char] & CharFlags.Decimal || isIdentifierStart(char)) {
    report(parser, Errors.IDStartAfterNumber);
  }

  if (context & Context.OptionsRaw || isBigInt) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);

  if (kind & NumberKind.DecimalWithLeadingZero)
    parser.tokenValue = parseFloat(parser.source.slice(parser.tokenIndex, parser.index));
  else parser.tokenValue = parseFloat(value);

  if (isBigInt) return Token.BigIntLiteral;

  return Token.NumericLiteral;
}
