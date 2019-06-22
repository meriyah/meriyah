import { ParserState, Context } from '../common';
import { Token, descKeywordTable } from '../token';
import { Chars } from '../chars';
import { nextCodePoint, consumeMultiUnitCodePoint, fromCodePoint, toHex } from './';
import { CharTypes, CharFlags, isIdentifierPart } from './charClassifier';
import { report, Errors } from '../errors';
import { unicodeLookup } from '../unicode';

/**
 * Scans identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function scanIdentifier(parser: ParserState, context: Context): Token {
  let hasEscape: 0 | 1 = 0;
  let canBeKeyword: number = CharTypes[parser.nextCP] & CharFlags.KeywordCandidate;
  parser.tokenValue = '';
  while ((CharTypes[nextCodePoint(parser)] & CharFlags.IdentifierPart) !== 0) {}
  parser.tokenValue = parser.source.slice(parser.tokenIndex, parser.index);
  if (parser.nextCP > 0x7e) return scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword);

  if ((CharTypes[parser.nextCP] & CharFlags.BackSlash) === 0) {
    return descKeywordTable[parser.tokenValue] || Token.Identifier;
  }

  return scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword);
}

/**
 * Scans unicode identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function scanUnicodeIdentifier(parser: ParserState, context: Context): Token {
  parser.tokenValue = '';
  const cookedChar = scanIdentifierUnicodeEscape(parser) as number;
  if (!isIdentifierPart(cookedChar)) report(parser, Errors.InvalidUnicodeEscapeSequence);
  parser.tokenValue += fromCodePoint(cookedChar);
  return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & CharFlags.KeywordCandidate);
}

/**
 * Scans identifier slow case
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param hasEscape
 * @param canBeKeyword
 */
export function scanIdentifierSlowCase(
  parser: ParserState,
  context: Context,
  hasEscape: 0 | 1,
  canBeKeyword: number
): Token {
  let start = parser.index;
  while (parser.index < parser.end) {
    if (CharTypes[parser.nextCP] & CharFlags.BackSlash) {
      parser.tokenValue += parser.source.slice(start, parser.index);
      hasEscape = 1;
      const code = scanIdentifierUnicodeEscape(parser) as number;
      if (!isIdentifierPart(code)) report(parser, Errors.InvalidUnicodeEscapeSequence);
      canBeKeyword = canBeKeyword && CharTypes[code] & CharFlags.KeywordCandidate;
      parser.tokenValue += fromCodePoint(code);
      start = parser.index;
    } else if (isIdentifierPart(parser.nextCP) || consumeMultiUnitCodePoint(parser, parser.nextCP)) {
      nextCodePoint(parser);
    } else {
      break;
    }
  }

  if (parser.index <= parser.end) {
    parser.tokenValue += parser.source.slice(start, parser.index);
  }

  const length = (parser.tokenValue as string).length;

  if (canBeKeyword && (length >= 2 && length <= 11)) {
    const keyword: Token | undefined = descKeywordTable[parser.tokenValue as string];

    return keyword === void 0
      ? Token.Identifier
      : keyword === Token.YieldKeyword || !hasEscape
      ? keyword
      : context & Context.Strict && (keyword === Token.LetKeyword || keyword === Token.StaticKeyword)
      ? Token.EscapedFutureReserved
      : (keyword & Token.FutureReserved) === Token.FutureReserved
      ? context & Context.Strict
        ? Token.EscapedFutureReserved
        : keyword
      : Token.EscapedReserved;
  }
  return Token.Identifier;
}

/**
 * Scans private name
 *
 * @param parser  Parser object
 */
export function scanPrivateName(parser: ParserState): Token {
  nextCodePoint(parser); // consumes '#'
  if (
    (CharTypes[parser.nextCP] & CharFlags.Decimal) !== 0 ||
    ((CharTypes[parser.nextCP] & CharFlags.IdentifierStart) === 0 &&
      ((unicodeLookup[(parser.nextCP >>> 5) + 0] >>> parser.nextCP) & 31 & 1) === 0)
  ) {
    report(parser, Errors.MissingPrivateName);
  }

  return Token.PrivateField;
}

/**
 * Scans unicode identifier
 *
 * @param parser  Parser object
 */
export function scanIdentifierUnicodeEscape(parser: ParserState): number | void {
  // Check for Unicode escape of the form '\uXXXX'
  // and return code point value if valid Unicode escape is found. Otherwise return -1.
  if (parser.index + 5 < parser.end && parser.source.charCodeAt(parser.index + 1) === Chars.LowerU) {
    parser.nextCP = parser.source.charCodeAt((parser.index += 2));
    return scanUnicodeEscapeValue(parser);
  }
  report(parser, Errors.InvalidUnicodeEscapeSequence);
}

/**
 * Scans unicode escape value
 *
 * @param parser  Parser object
 */
export function scanUnicodeEscapeValue(parser: ParserState): number {
  let codePoint = 0;
  // First handle a delimited Unicode escape, e.g. \u{1F4A9}
  if (parser.nextCP === Chars.LeftBrace) {
    while (CharTypes[nextCodePoint(parser)] & CharFlags.Hex) {
      codePoint = (codePoint << 4) | toHex(parser.nextCP);
      // Check this early to avoid `code` wrapping to a negative on overflow (which is
      // reserved for abnormal conditions).
      if (codePoint > Chars.NonBMPMax) {
        report(parser, Errors.UnicodeOverflow);
      }
    }

    // At least 4 characters have to be read
    if (codePoint < 1 || (parser.nextCP as number) !== Chars.RightBrace) {
      report(parser, Errors.InvalidHexEscapeSequence);
    }
    nextCodePoint(parser); // consumes '}'
    return codePoint;
  }

  if ((CharTypes[parser.nextCP] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence); // first one is mandatory

  const c2 = parser.source.charCodeAt(parser.index + 1);
  if ((CharTypes[c2] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);
  const c3 = parser.source.charCodeAt(parser.index + 2);
  if ((CharTypes[c3] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);
  const c4 = parser.source.charCodeAt(parser.index + 3);
  if ((CharTypes[c4] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);

  codePoint = (toHex(parser.nextCP) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);

  parser.nextCP = parser.source.charCodeAt((parser.index += 4));

  return codePoint;
}
