import { ParserState, Context, Flags } from '../common';
import { Token } from '../token';
import { nextCP, toHex, CharTypes, CharFlags, isIdentifierStart, storeRaw } from './';
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

export function scanNumber(parser: ParserState, context: Context, isFloat: 0 | 1): Token {
  let kind: NumberKind = NumberKind.Decimal;
  let value: number | string = 0;

  if (isFloat) {
    while (CharTypes[nextCP(parser)] & CharFlags.Decimal) {}
  } else {
    if (parser.nextCP === Chars.Zero) {
      nextCP(parser);

      // Hex
      if ((parser.nextCP | 32) === Chars.LowerX) {
        kind = NumberKind.Hex;
        let digits = 0;
        while (CharTypes[nextCP(parser)] & CharFlags.Hex) {
          value = value * 0x10 + toHex(parser.nextCP);
          digits++;
        }
        if (digits < 1) report(parser, Errors.MissingHexDigits);
        // Octal
      } else if ((parser.nextCP | 32) === Chars.LowerO) {
        kind = NumberKind.Octal;
        let digits = 0;
        while (CharTypes[nextCP(parser)] & CharFlags.Octal) {
          value = value * 8 + (parser.nextCP - Chars.Zero);
          digits++;
        }
        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${8}`);
      } else if ((parser.nextCP | 32) === Chars.LowerB) {
        kind = NumberKind.Binary;
        let digits = 0;
        while (CharTypes[nextCP(parser)] & CharFlags.Binary) {
          value = value * 2 + (parser.nextCP - Chars.Zero);
          digits++;
        }
        if (digits < 1) report(parser, Errors.ExpectedNumberInRadix, `${2}`);
      } else if (CharTypes[parser.nextCP] & CharFlags.Octal) {
        // Octal integer literals are not permitted in strict mode code
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        kind = NumberKind.ImplicitOctal;
        do {
          if (CharTypes[parser.nextCP] & CharFlags.ImplicitOctalDigits) {
            kind = NumberKind.DecimalWithLeadingZero;
            isFloat = 0;
            break;
          }
          value = value * 8 + (parser.nextCP - Chars.Zero);
        } while (CharTypes[nextCP(parser)] & CharFlags.Decimal);
      } else if (CharTypes[parser.nextCP] & CharFlags.ImplicitOctalDigits) {
        if (context & Context.Strict) report(parser, Errors.StrictOctalEscape);
        else parser.flags = Flags.Octals;
        kind = NumberKind.DecimalWithLeadingZero;
      }
    }

    // Parse decimal digits and allow trailing fractional part
    if (kind & (NumberKind.Decimal | NumberKind.DecimalWithLeadingZero)) {
      if (isFloat) {
        // scan subsequent decimal digits
        let digit = 9;
        while (digit >= 0 && CharTypes[nextCP(parser)] & CharFlags.Decimal) {
          value = 10 * value + (parser.nextCP - Chars.Zero);
          --digit;
        }

        if (digit >= 0 && !isIdentifierStart(parser.nextCP) && parser.nextCP !== Chars.Period) {
          if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
          parser.tokenValue = value;
          return Token.NumericLiteral;
        }
      }

      while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
        nextCP(parser);
      }

      // Scan any decimal dot and fractional component
      if (parser.nextCP === Chars.Period) {
        isFloat = 1;
        nextCP(parser); // consumes '.'
        while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
          nextCP(parser);
        }
      }
    }
  }

  let isBigInt: 0 | 1 = 0;

  if (
    parser.nextCP === Chars.LowerN &&
    (kind & (NumberKind.Decimal | NumberKind.Binary | NumberKind.Octal | NumberKind.Hex)) !== 0
  ) {
    if (isFloat) report(parser, Errors.InvalidBigInt);
    isBigInt = 1;
    nextCP(parser);
    // Scan any exponential notation
  } else if ((parser.nextCP | 32) === Chars.LowerE) {
    if ((kind & (NumberKind.Decimal | NumberKind.DecimalWithLeadingZero)) === 0) {
      report(parser, Errors.MissingExponent);
    }

    nextCP(parser);

    // '-', '+'
    if (CharTypes[parser.nextCP] & CharFlags.Exponent) {
      nextCP(parser);
    }

    let exponentDigits = 0;
    // Consume exponential digits
    while (CharTypes[parser.nextCP] & CharFlags.Decimal) {
      nextCP(parser);
      exponentDigits++;
    }
    // Exponential notation must contain at least one digit
    if (exponentDigits < 1) {
      report(parser, Errors.MissingExponent);
    }
  }

  // The source character immediately following a numeric literal must
  // not be an identifier start or a decimal digit
  if ((parser.index < parser.end && CharTypes[parser.nextCP] & CharFlags.Decimal) || isIdentifierStart(parser.nextCP)) {
    report(parser, Errors.IDStartAfterNumber);
  }

  if (kind & (NumberKind.ImplicitOctal | NumberKind.Binary | NumberKind.Hex | NumberKind.Octal)) {
    parser.tokenValue = value;
  } else {
    const raw = parser.source.slice(parser.tokenIndex, parser.index);
    parser.tokenValue =
      kind & NumberKind.DecimalWithLeadingZero ? parseFloat(raw) : isBigInt ? parseInt(raw, 0xa) : +raw;
  }

  if (isBigInt) {
    storeRaw(parser, parser.tokenIndex);
    return Token.BigIntLiteral;
  }

  if (context & Context.OptionsRaw) storeRaw(parser, parser.tokenIndex);

  return Token.NumericLiteral;
}
