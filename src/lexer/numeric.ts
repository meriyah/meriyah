import { ParserState, Context, Flags } from '../common';
import { Token } from '../token';
import { nextCodePoint, toHex, CharTypes, CharFlags, isIdentifierStart } from './';
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

export function scanNumber(parser: ParserState, context: Context, isFloat: boolean): Token {
  let kind: NumberKind = NumberKind.Decimal;
  let value: number | string = 0;
  let atStart = !isFloat;
  if (isFloat) {
    while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
      nextCodePoint(parser);
    }
  } else {
    if (parser.nextCP === Chars.Zero) {
      nextCodePoint(parser);

      // Hex
      if ((parser.nextCP | 32) === Chars.LowerX) {
        kind = NumberKind.Hex;
        let digits = 0;
        while (CharTypes[nextCodePoint(parser)] & CharFlags.Hex) {
          value = value * 0x10 + toHex(parser.nextCP);
          digits++;
        }
        if (digits < 1) report(parser, Errors.MissingHexDigits);
        // Octal
      } else if ((parser.nextCP | 32) === Chars.LowerO) {
        kind = NumberKind.Octal;
        let digits = 0;
        while (CharTypes[nextCodePoint(parser)] & CharFlags.Octal) {
          value = value * 8 + (parser.nextCP - Chars.Zero);
          digits++;
        }
        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${8}`);
      } else if ((parser.nextCP | 32) === Chars.LowerB) {
        kind = NumberKind.Binary;
        let digits = 0;
        while (CharTypes[nextCodePoint(parser)] & CharFlags.Binary) {
          value = value * 2 + (parser.nextCP - Chars.Zero);
          digits++;
        }
        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${2}`);
      } else if (CharTypes[parser.nextCP] & CharFlags.Octal) {
        // Octal integer literals are not permitted in strict mode code
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        else parser.flags = Flags.Octals;
        kind = NumberKind.ImplicitOctal;
        do {
          if (CharTypes[parser.nextCP] & CharFlags.ImplicitOctalDigits) {
            kind = NumberKind.DecimalWithLeadingZero;
            atStart = false;
            break;
          }
          value = value * 8 + (parser.nextCP - Chars.Zero);
        } while (CharTypes[nextCodePoint(parser)] & CharFlags.Decimal);
      } else if (CharTypes[parser.nextCP] & CharFlags.ImplicitOctalDigits) {
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        else parser.flags = Flags.Octals;
        kind = NumberKind.DecimalWithLeadingZero;
      }
    }

    // Parse decimal digits and allow trailing fractional part
    if (kind & (NumberKind.Decimal | NumberKind.DecimalWithLeadingZero)) {
      if (atStart) {
        // scan subsequent decimal digits
        let digit = 9;
        while (digit >= 0 && CharTypes[parser.nextCP] & CharFlags.Decimal) {
          value = 10 * value + (parser.nextCP - Chars.Zero);
          nextCodePoint(parser);
          --digit;
        }

        if (digit >= 0 && parser.nextCP !== Chars.Period && !isIdentifierStart(parser.nextCP)) {
          if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
          parser.tokenValue = value;
          return Token.NumericLiteral;
        }
      }

      while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
        nextCodePoint(parser);
      }

      // Scan any decimal dot and fractional component
      if (parser.nextCP === Chars.Period) {
        isFloat = true;
        nextCodePoint(parser); // consumes '.'
        while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
          nextCodePoint(parser);
        }
      }
    }
  }

  let isBigInt = false;
  if (
    parser.nextCP === Chars.LowerN &&
    (kind & (NumberKind.Decimal | NumberKind.Binary | NumberKind.Octal | NumberKind.Hex)) !== 0
  ) {
    if (isFloat) report(parser, Errors.InvalidBigInt);
    isBigInt = true;
    nextCodePoint(parser);
    // Scan any exponential notation
  } else if ((parser.nextCP | 32) === Chars.LowerE) {
    if ((kind & (NumberKind.Decimal | NumberKind.DecimalWithLeadingZero)) === 0) {
      report(parser, Errors.MissingExponent);
    }

    nextCodePoint(parser);

    // '-', '+'
    if (CharTypes[parser.nextCP] & CharFlags.Exponent) {
      nextCodePoint(parser);
    }

    let exponentDigits = 0;
    // Consume exponential digits
    while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
      nextCodePoint(parser);
      exponentDigits++;
    }
    // Exponential notation must contain at least one digit
    if (exponentDigits < 1) {
      report(parser, Errors.MissingExponent);
    }
  }

  // The source character immediately following a numeric literal must
  // not be an identifier start or a decimal digit
  if (CharTypes[parser.nextCP] & CharFlags.Decimal || isIdentifierStart(parser.nextCP)) {
    report(parser, Errors.IDStartAfterNumber);
  }
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
  parser.tokenValue =
    kind & (NumberKind.ImplicitOctal | NumberKind.Binary | NumberKind.Hex | NumberKind.Octal)
      ? value
      : kind & NumberKind.DecimalWithLeadingZero
      ? parseFloat(parser.source.slice(parser.tokenIndex, parser.index))
      : isBigInt
      ? parseInt(parser.source.slice(parser.tokenIndex, parser.index), 0xa)
      : +parser.source.slice(parser.tokenIndex, parser.index);
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenValue, parser.index);
  return isBigInt ? Token.BigIntLiteral : Token.NumericLiteral;
}
