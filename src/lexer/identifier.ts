import { ParserState, Context } from '../common';
import { Token, descKeywordTable } from '../token';
import { Chars } from '../chars';
import { nextCodePoint, consumeMultiUnitCodePoint, fromCodePoint, toHex, Escape } from './';
import { CharTypes, CharFlags, isIdentifierStart, isIdentifierPart } from './charClassifier';
import { report, Errors } from '../errors';
import { unicodeLookup } from '../unicode';

export function scanIdentifier(state: ParserState, context: Context): Token {
  let hasEscape = false;
  let canBeKeyword = (CharTypes[state.currentCodePoint] & CharFlags.KeywordCandidate) !== 0;
  state.tokenValue = '';
  if (state.currentCodePoint <= 0x7e) {
    if ((CharTypes[state.currentCodePoint] & CharFlags.BackSlash) === 0) {
      while ((CharTypes[nextCodePoint(state)] & CharFlags.IdentifierPart) !== 0) {}
      state.tokenValue = state.source.slice(state.startIndex, state.index);
      if (state.currentCodePoint > 0x7e) return scanIdentifierSlowCase(state, context, hasEscape, canBeKeyword);

      if ((CharTypes[state.currentCodePoint] & CharFlags.BackSlash) === 0) {
        return descKeywordTable[state.tokenValue] || Token.Identifier;
      }
    } else {
      hasEscape = true;
      const code = scanIdentifierUnicodeEscape(state);
      if (!isIdentifierPart(code)) report(state, Errors.InvalidUnicodeEscapeSequence);
      canBeKeyword = (CharTypes[code] & CharFlags.KeywordCandidate) !== 0;
      state.tokenValue += fromCodePoint(code);
    }
  }

  return scanIdentifierSlowCase(state, context, hasEscape, canBeKeyword);
}

export function scanIdentifierSlowCase(
  state: ParserState,
  context: Context,
  hasEscape: boolean,
  canBeKeyword: boolean
): Token {
  let start = state.index;
  while (state.index < state.length) {
    if ((state.currentCodePoint & 8) === 8 && state.currentCodePoint === Chars.Backslash) {
      state.tokenValue += state.source.slice(start, state.index);
      hasEscape = true;
      const code = scanIdentifierUnicodeEscape(state);
      if (!isIdentifierPart(code)) report(state, Errors.InvalidUnicodeEscapeSequence);
      canBeKeyword = canBeKeyword && (CharTypes[code] & CharFlags.KeywordCandidate) !== 0;
      state.tokenValue += fromCodePoint(code);
      start = state.index;
    } else if (isIdentifierPart(state.currentCodePoint) || consumeMultiUnitCodePoint(state, state.currentCodePoint)) {
      nextCodePoint(state);
    } else {
      break;
    }
  }

  if (state.index <= state.length) {
    state.tokenValue += state.source.slice(start, state.index);
  }

  const length = (state.tokenValue as string).length;

  if (canBeKeyword && (length >= 2 && length <= 11)) {
    const keyword: Token | undefined = descKeywordTable[state.tokenValue as string];
    if (keyword === undefined) return Token.Identifier;

    if (keyword === Token.YieldKeyword) return keyword;

    if ((keyword & Token.FutureReserved) === Token.FutureReserved) {
      return context & Context.Strict && hasEscape ? Token.EscapedFutureReserved : keyword;
    }

    return context & Context.Strict && (keyword === Token.LetKeyword || keyword === Token.StaticKeyword)
      ? Token.EscapedFutureReserved
      : Token.EscapedReserved;
  }
  return Token.Identifier;
}

export function scanPrivateName(state: ParserState): Token {
  nextCodePoint(state); // consumes '#'
  if (
    (CharTypes[state.currentCodePoint] & CharFlags.Decimal) !== 0 ||
    ((CharTypes[state.currentCodePoint] & CharFlags.IdentifierStart) === 0 &&
      ((unicodeLookup[(state.currentCodePoint >>> 5) + 0] >>> state.currentCodePoint) & 31 & 1) === 0)
  ) {
    report(state, Errors.MissingPrivateName);
  }

  return Token.PrivateField;
}

export function scanIdentifierUnicodeEscape(state: ParserState): any {
  // Check for Unicode escape of the form '\uXXXX'
  // and return code point value if valid Unicode escape is found. Otherwise return -1.
  if (state.index + 5 < state.length && state.source.charCodeAt(state.index + 1) === Chars.LowerU) {
    state.currentCodePoint = state.source.charCodeAt((state.index += 2));
    return scanUnicodeEscapeValue(state);
  }
  report(state, Errors.InvalidUnicodeEscapeSequence);
}

export function scanUnicodeEscapeValue(state: ParserState): number | Escape {
  let codePoint = 0;
  // First handle a delimited Unicode escape, e.g. \u{1F4A9}
  if (state.currentCodePoint === Chars.LeftBrace) {
    while (CharTypes[nextCodePoint(state)] & CharFlags.Hex) {
      codePoint = (codePoint << 4) | toHex(state.currentCodePoint);
      // Check this early to avoid `code` wrapping to a negative on overflow (which is
      // reserved for abnormal conditions).
      if (codePoint > Chars.NonBMPMax) {
        report(state, Errors.UnicodeOverflow);
      }
    }

    // At least 4 characters have to be read
    if (codePoint < 1 || (state.currentCodePoint as number) !== Chars.RightBrace) {
      report(state, Errors.InvalidHexEscapeSequence);
    }
    nextCodePoint(state); // consumes '}'
    return codePoint;
  }

  if ((CharTypes[state.currentCodePoint] & CharFlags.Hex) === 0) report(state, Errors.InvalidHexEscapeSequence); // first one is mandatory

  const c2 = state.source.charCodeAt(state.index + 1);
  if ((CharTypes[c2] & CharFlags.Hex) === 0) report(state, Errors.Unexpected);
  const c3 = state.source.charCodeAt(state.index + 2);
  if ((CharTypes[c3] & CharFlags.Hex) === 0) report(state, Errors.Unexpected);
  const c4 = state.source.charCodeAt(state.index + 3);
  if ((CharTypes[c4] & CharFlags.Hex) === 0) report(state, Errors.Unexpected);

  codePoint = (toHex(state.currentCodePoint) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);

  state.currentCodePoint = state.source.charCodeAt((state.index += 4));

  return codePoint;
}
