import { ParserState, Context } from '../common';
import { Token, descKeywordTable } from '../token';
import { Chars } from '../chars';
import { nextCodePoint, consumeMultiUnitCodePoint, fromCodePoint, toHex } from './';
import { CharTypes, CharFlags, isIdentifierPart } from './charClassifier';
import { report, Errors } from '../errors';
import { unicodeLookup } from '../unicode';

export function scanIdentifier(parser: ParserState, context: Context): Token {
  let hasEscape: 0 | 1 = 0;
  let canBeKeyword: number = CharTypes[parser.currentCodePoint] & CharFlags.KeywordCandidate;
  parser.tokenValue = '';
  if (parser.currentCodePoint <= 0x7e) {
    if ((CharTypes[parser.currentCodePoint] & CharFlags.BackSlash) === 0) {
      while ((CharTypes[nextCodePoint(parser)] & CharFlags.IdentifierPart) !== 0) {}
      parser.tokenValue = parser.source.slice(parser.startIndex, parser.index);
      if (parser.currentCodePoint > 0x7e) return scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword);

      if ((CharTypes[parser.currentCodePoint] & CharFlags.BackSlash) === 0) {
        return descKeywordTable[parser.tokenValue] || Token.Identifier;
      }
    } else {
      hasEscape = 1;
      const code = scanIdentifierUnicodeEscape(parser);
      if (!isIdentifierPart(code)) report(parser, Errors.InvalidUnicodeEscapeSequence);
      canBeKeyword = CharTypes[code] & CharFlags.KeywordCandidate;
      parser.tokenValue += fromCodePoint(code);
    }
  }

  return scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword);
}

export function scanIdentifierSlowCase(
  parser: ParserState,
  context: Context,
  hasEscape: 0 | 1,
  canBeKeyword: number
): Token {
  let start = parser.index;
  while (parser.index < parser.length) {
    if (CharTypes[parser.currentCodePoint] & CharFlags.BackSlash) {
      parser.tokenValue += parser.source.slice(start, parser.index);
      hasEscape = 1;
      const code = scanIdentifierUnicodeEscape(parser);
      if (!isIdentifierPart(code)) report(parser, Errors.InvalidUnicodeEscapeSequence);
      canBeKeyword = canBeKeyword && CharTypes[code] & CharFlags.KeywordCandidate;
      parser.tokenValue += fromCodePoint(code);
      start = parser.index;
    } else if (
      isIdentifierPart(parser.currentCodePoint) ||
      consumeMultiUnitCodePoint(parser, parser.currentCodePoint)
    ) {
      nextCodePoint(parser);
    } else {
      break;
    }
  }

  if (parser.index <= parser.length) {
    parser.tokenValue += parser.source.slice(start, parser.index);
  }

  const length = (parser.tokenValue as string).length;

  if (canBeKeyword && (length >= 2 && length <= 11)) {
    const keyword: Token | undefined = descKeywordTable[parser.tokenValue as string];

    return keyword === void 0
      ? Token.Identifier
      : keyword === Token.YieldKeyword
      ? keyword
      : (keyword & Token.FutureReserved) === Token.FutureReserved
      ? context & Context.Strict && hasEscape
        ? Token.EscapedFutureReserved
        : keyword
      : context & Context.Strict && (keyword === Token.LetKeyword || keyword === Token.StaticKeyword)
      ? Token.EscapedFutureReserved
      : Token.EscapedReserved;
  }
  return Token.Identifier;
}

export function scanPrivateName(parser: ParserState): Token {
  nextCodePoint(parser); // consumes '#'
  if (
    (CharTypes[parser.currentCodePoint] & CharFlags.Decimal) !== 0 ||
    ((CharTypes[parser.currentCodePoint] & CharFlags.IdentifierStart) === 0 &&
      ((unicodeLookup[(parser.currentCodePoint >>> 5) + 0] >>> parser.currentCodePoint) & 31 & 1) === 0)
  ) {
    report(parser, Errors.MissingPrivateName);
  }

  return Token.PrivateField;
}

export function scanIdentifierUnicodeEscape(parser: ParserState): any {
  // Check for Unicode escape of the form '\uXXXX'
  // and return code point value if valid Unicode escape is found. Otherwise return -1.
  if (parser.index + 5 < parser.length && parser.source.charCodeAt(parser.index + 1) === Chars.LowerU) {
    parser.currentCodePoint = parser.source.charCodeAt((parser.index += 2));
    return scanUnicodeEscapeValue(parser);
  }
  report(parser, Errors.InvalidUnicodeEscapeSequence);
}

export function scanUnicodeEscapeValue(parser: ParserState): number {
  let codePoint = 0;
  // First handle a delimited Unicode escape, e.g. \u{1F4A9}
  if (parser.currentCodePoint === Chars.LeftBrace) {
    while (CharTypes[nextCodePoint(parser)] & CharFlags.Hex) {
      codePoint = (codePoint << 4) | toHex(parser.currentCodePoint);
      // Check this early to avoid `code` wrapping to a negative on overflow (which is
      // reserved for abnormal conditions).
      if (codePoint > Chars.NonBMPMax) {
        report(parser, Errors.UnicodeOverflow);
      }
    }

    // At least 4 characters have to be read
    if (codePoint < 1 || (parser.currentCodePoint as number) !== Chars.RightBrace) {
      report(parser, Errors.InvalidHexEscapeSequence);
    }
    nextCodePoint(parser); // consumes '}'
    return codePoint;
  }

  if ((CharTypes[parser.currentCodePoint] & CharFlags.Hex) === 0) report(parser, Errors.InvalidHexEscapeSequence); // first one is mandatory

  const c2 = parser.source.charCodeAt(parser.index + 1);
  if ((CharTypes[c2] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);
  const c3 = parser.source.charCodeAt(parser.index + 2);
  if ((CharTypes[c3] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);
  const c4 = parser.source.charCodeAt(parser.index + 3);
  if ((CharTypes[c4] & CharFlags.Hex) === 0) report(parser, Errors.Unexpected);

  codePoint = (toHex(parser.currentCodePoint) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);

  parser.currentCodePoint = parser.source.charCodeAt((parser.index += 4));

  return codePoint;
}
