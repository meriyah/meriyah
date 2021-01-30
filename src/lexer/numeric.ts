import { ParserState, Context, Flags } from '../common';
import { Token } from '../token';
import { advanceChar, toHex, NumberKind } from './common';
import { CharTypes, CharFlags, isIdentifierStart } from './charClassifier';
import { Chars } from '../chars';
import { report, Errors, reportScannerError } from '../errors';

/**
 * Scans numeric literal
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param isFloat
 */
export function scanNumber(parser: ParserState, context: Context, kind: NumberKind): Token {
  // DecimalLiteral ::
  //   DecimalIntegerLiteral . DecimalDigits_opt
  //   . DecimalDigits
  let char = parser.currentChar;
  let value: any = 0;
  let digit = 9;
  let atStart = kind & NumberKind.Float ? 0 : 1;
  let digits = 0;
  let allowSeparator: 0 | 1 = 0;

  if (kind & NumberKind.Float) {
    value = '.' + scanDecimalDigitsOrSeparator(parser, char);
    char = parser.currentChar;
    // It is a Syntax Error if the MV is not an integer. (dot decimalDigits)
    if (char === Chars.LowerN) report(parser, Errors.InvalidBigInt);
  } else {
    if (char === Chars.Zero) {
      char = advanceChar(parser);

      // Hex
      if ((char | 32) === Chars.LowerX) {
        kind = NumberKind.Hex | NumberKind.ValidBigIntKind;
        char = advanceChar(parser); // skips 'X', 'x'
        while (CharTypes[char] & (CharFlags.Hex | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            if (!allowSeparator) report(parser, Errors.ContinuousNumericSeparator);
            allowSeparator = 0;
            char = advanceChar(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 0x10 + toHex(char);
          digits++;
          char = advanceChar(parser);
        }

        if (digits < 1 || !allowSeparator) {
          report(parser, digits < 1 ? Errors.MissingHexDigits : Errors.TrailingNumericSeparator);
        }
        // Octal
      } else if ((char | 32) === Chars.LowerO) {
        kind = NumberKind.Octal | NumberKind.ValidBigIntKind;
        char = advanceChar(parser); // skips 'X', 'x'
        while (CharTypes[char] & (CharFlags.Octal | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            if (!allowSeparator) {
              report(parser, Errors.ContinuousNumericSeparator);
            }
            allowSeparator = 0;
            char = advanceChar(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 8 + (char - Chars.Zero);
          digits++;
          char = advanceChar(parser);
        }
        if (digits < 1 || !allowSeparator) {
          report(parser, digits < 1 ? Errors.Unexpected : Errors.TrailingNumericSeparator);
        }
      } else if ((char | 32) === Chars.LowerB) {
        kind = NumberKind.Binary | NumberKind.ValidBigIntKind;
        char = advanceChar(parser); // skips 'B', 'b'
        while (CharTypes[char] & (CharFlags.Binary | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            if (!allowSeparator) {
              report(parser, Errors.ContinuousNumericSeparator);
            }
            allowSeparator = 0;
            char = advanceChar(parser);
            continue;
          }
          allowSeparator = 1;
          value = value * 2 + (char - Chars.Zero);
          digits++;
          char = advanceChar(parser);
        }
        if (digits < 1 || !allowSeparator) {
          report(parser, digits < 1 ? Errors.Unexpected : Errors.TrailingNumericSeparator);
        }
      } else if (CharTypes[char] & CharFlags.Octal) {
        // Octal integer literals are not permitted in strict mode code
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        kind = NumberKind.ImplicitOctal;
        while (CharTypes[char] & CharFlags.Decimal) {
          if (CharTypes[char] & CharFlags.ImplicitOctalDigits) {
            kind = NumberKind.NonOctalDecimal;
            atStart = 0;
            break;
          }
          value = value * 8 + (char - Chars.Zero);
          char = advanceChar(parser);
        }
      } else if (CharTypes[char] & CharFlags.ImplicitOctalDigits) {
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        parser.flags |= Flags.Octals;
        kind = NumberKind.NonOctalDecimal;
      } else if (char === Chars.Underscore) {
        report(parser, Errors.Unexpected);
      }
    }

    // Parse decimal digits and allow trailing fractional part
    if (kind & NumberKind.DecimalNumberKind) {
      if (atStart) {
        while (digit >= 0 && CharTypes[char] & (CharFlags.Decimal | CharFlags.Underscore)) {
          if (char === Chars.Underscore) {
            char = advanceChar(parser);
            if (char === Chars.Underscore || kind & NumberKind.NonOctalDecimal) {
              reportScannerError(
                parser.index,
                parser.line,
                parser.index + 1 /* skips `_` */,
                Errors.ContinuousNumericSeparator
              );
            }
            allowSeparator = 1;
            continue;
          }
          allowSeparator = 0;
          value = 10 * value + (char - Chars.Zero);
          char = advanceChar(parser);
          --digit;
        }

        if (allowSeparator) {
          reportScannerError(
            parser.index,
            parser.line,
            parser.index + 1 /* skips `_` */,
            Errors.TrailingNumericSeparator
          );
        }

        if (digit >= 0 && !isIdentifierStart(char) && char !== Chars.Period) {
          // Most numbers are pure decimal integers without fractional component
          // or exponential notation.  Handle that with optimized code.
          parser.tokenValue = value;
          if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
          return Token.NumericLiteral;
        }
      }

      value += scanDecimalDigitsOrSeparator(parser, char);

      char = parser.currentChar;

      // Consume any decimal dot and fractional component.
      if (char === Chars.Period) {
        if (advanceChar(parser) === Chars.Underscore) report(parser, Errors.Unexpected);
        kind = NumberKind.Float;
        value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
        char = parser.currentChar;
      }
    }
  }
  const end = parser.index;

  let isBigInt: 0 | 1 = 0;

  if (char === Chars.LowerN && kind & NumberKind.ValidBigIntKind) {
    isBigInt = 1;
    char = advanceChar(parser);
  } else {
    // Consume any exponential notation.
    if ((char | 32) === Chars.LowerE) {
      char = advanceChar(parser);

      // '-', '+'
      if (CharTypes[char] & CharFlags.Exponent) char = advanceChar(parser);

      const { index } = parser;

      // Exponential notation must contain at least one digit
      if ((CharTypes[char] & CharFlags.Decimal) < 1) report(parser, Errors.MissingExponent);

      // Consume exponential digits
      value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, char);

      char = parser.currentChar;
    }
  }

  // The source character immediately following a numeric literal must
  // not be an identifier start or a decimal digit
  if ((parser.index < parser.end && CharTypes[char] & CharFlags.Decimal) || isIdentifierStart(char)) {
    report(parser, Errors.IDStartAfterNumber);
  }

  if (isBigInt) {
    parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
    parser.tokenValue = BigInt(value);
    return Token.BigIntLiteral;
  }

  parser.tokenValue =
    kind & (NumberKind.ImplicitOctal | NumberKind.Binary | NumberKind.Hex | NumberKind.Octal)
      ? value
      : kind & NumberKind.NonOctalDecimal
      ? parseFloat(parser.source.substring(parser.tokenPos, parser.index))
      : +value;

  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);

  return Token.NumericLiteral;
}

/**
 * Scans numeric literal and skip underscore '_' if it exist
 *
 * @param parser  Parser object
 * @param char Code point
 */
export function scanDecimalDigitsOrSeparator(parser: ParserState, char: number): string {
  let allowSeparator: 0 | 1 = 0;
  let start = parser.index;
  let ret = '';
  while (CharTypes[char] & (CharFlags.Decimal | CharFlags.Underscore)) {
    if (char === Chars.Underscore) {
      const { index } = parser;
      char = advanceChar(parser);
      if (char === Chars.Underscore) {
        reportScannerError(
          parser.index,
          parser.line,
          parser.index + 1 /* skips `_` */,
          Errors.ContinuousNumericSeparator
        );
      }
      allowSeparator = 1;
      ret += parser.source.substring(start, index);
      start = parser.index;
      continue;
    }
    allowSeparator = 0;
    char = advanceChar(parser);
  }

  if (allowSeparator) {
    reportScannerError(parser.index, parser.line, parser.index + 1 /* skips `_` */, Errors.TrailingNumericSeparator);
  }

  return ret + parser.source.substring(start, parser.index);
}
