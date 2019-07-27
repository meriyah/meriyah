import { ParserState, Context } from '../common';
import { Token, descKeywordTable } from '../token';
import { Chars } from '../chars';
import { nextCP, consumeMultiUnitCodePoint, fromCodePoint, toHex } from './';
import { CharTypes, CharFlags, isIdentifierPart, isIdentifierStart } from './charClassifier';
import { report, reportMessageAt, Errors } from '../errors';

/**
 * Scans identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function scanIdentifier(parser: ParserState, context: Context, isValidAsKeyword: 0 | 1): Token {
  while ((CharTypes[nextCP(parser)] & CharFlags.IdentifierPart) !== 0) {}
  parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
  return parser.nextCP !== Chars.Backslash && parser.nextCP < 0x7e
    ? descKeywordTable[parser.tokenValue] || Token.Identifier
    : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
}

/**
 * Scans unicode identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function scanUnicodeIdentifier(parser: ParserState, context: Context): Token {
  const cookedChar = scanIdentifierUnicodeEscape(parser);
  if (!isIdentifierPart(cookedChar)) report(parser, Errors.InvalidUnicodeEscapeSequence);
  parser.tokenValue = fromCodePoint(cookedChar);
  return scanIdentifierSlowCase(parser, context, /* hasEscape */ 1, CharTypes[cookedChar] & CharFlags.KeywordCandidate);
}

/**
 * Scans identifier slow case
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param hasEscape True if contains a unicode sequence
 * @param isValidAsKeyword
 */
export function scanIdentifierSlowCase(
  parser: ParserState,
  context: Context,
  hasEscape: 0 | 1,
  isValidAsKeyword: number
): Token {
  let start = parser.index;

  while (parser.index < parser.end) {
    if (parser.nextCP === Chars.Backslash) {
      parser.tokenValue += parser.source.slice(start, parser.index);
      hasEscape = 1;
      const code = scanIdentifierUnicodeEscape(parser);
      if (!isIdentifierPart(code)) report(parser, Errors.InvalidUnicodeEscapeSequence);
      isValidAsKeyword = isValidAsKeyword && CharTypes[code] & CharFlags.KeywordCandidate;
      parser.tokenValue += fromCodePoint(code);
      start = parser.index;
    } else if (isIdentifierPart(parser.nextCP) || consumeMultiUnitCodePoint(parser, parser.nextCP)) {
      nextCP(parser);
    } else {
      break;
    }
  }

  if (parser.index <= parser.end) {
    parser.tokenValue += parser.source.slice(start, parser.index);
  }

  const length = parser.tokenValue.length;

  if (isValidAsKeyword && (length >= 2 && length <= 11)) {
    const token: Token | undefined = descKeywordTable[parser.tokenValue];

    return token === void 0
      ? Token.Identifier
      : token === Token.YieldKeyword || !hasEscape
      ? token
      : context & Context.Strict && (token === Token.LetKeyword || token === Token.StaticKeyword)
      ? Token.EscapedFutureReserved
      : (token & Token.FutureReserved) === Token.FutureReserved
      ? context & Context.Strict
        ? Token.EscapedFutureReserved
        : token
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
  if (!isIdentifierStart(nextCP(parser))) report(parser, Errors.MissingPrivateName);
  return Token.PrivateField;
}

/**
 * Scans unicode identifier
 *
 * @param parser  Parser object
 */
export function scanIdentifierUnicodeEscape(parser: ParserState): number {
  // Check for Unicode escape of the form '\uXXXX'
  // and return code point value if valid Unicode escape is found.
  if (parser.source.charCodeAt(parser.index + 1) !== Chars.LowerU) {
    report(parser, Errors.InvalidUnicodeEscapeSequence);
  }
  parser.nextCP = parser.source.charCodeAt((parser.index += 2));
  return scanUnicodeEscapeValue(parser);
}

/**
 * Scans unicode escape value
 *
 * @param parser  Parser object
 */
export function scanUnicodeEscapeValue(parser: ParserState): number {
  let codePoint = 0;
  const char = parser.nextCP;
  // First handle a delimited Unicode escape, e.g. \u{1F4A9}
  if (char === Chars.LeftBrace) {
    const startPos = parser.index;
    while (CharTypes[nextCP(parser)] & CharFlags.Hex) {
      codePoint = (codePoint << 4) | toHex(parser.nextCP);
      if (codePoint > Chars.NonBMPMax) report(parser, Errors.UnicodeOverflow);
    }

    // At least 4 characters have to be read
    if (codePoint < 1 || (parser.nextCP as number) !== Chars.RightBrace) {
      reportMessageAt(startPos, parser.line, startPos - 1, Errors.InvalidHexEscapeSequence);
    }
    nextCP(parser); // consumes '}'
    return codePoint;
  }

  if ((CharTypes[char] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence); // first one is mandatory

  const char2 = parser.source.charCodeAt(parser.index + 1);
  if ((CharTypes[char2] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence);
  const char3 = parser.source.charCodeAt(parser.index + 2);
  if ((CharTypes[char3] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence);
  const char4 = parser.source.charCodeAt(parser.index + 3);
  if ((CharTypes[char4] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence);

  codePoint = (toHex(char) << 12) | (toHex(char2) << 8) | (toHex(char3) << 4) | toHex(char4);

  parser.nextCP = parser.source.charCodeAt((parser.index += 4));

  return codePoint;
}
