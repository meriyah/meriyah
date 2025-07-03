import { Chars } from '../chars';
import { Errors } from '../errors';
import { type Parser } from '../parser/parser';
import { Token } from '../token';
import { isIdentifierPart } from './charClassifier';
import { advanceChar } from './common';

enum RegexState {
  Empty = 0,
  Escape = 0x1,
  Class = 0x2,
}

enum RegexFlags {
  Empty = 0b0000_0000,
  IgnoreCase = 0b0000_0001,
  Global = 0b0000_0010,
  Multiline = 0b0000_0100,
  Unicode = 0b0001_0000,
  Sticky = 0b0000_1000,
  DotAll = 0b0010_0000,
  Indices = 0b0100_0000,
  UnicodeSets = 0b1000_0000,
}

/**
 * Scans regular expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanRegularExpression(parser: Parser): Token {
  const bodyStart = parser.index;
  // Scan: ('/' | '/=') RegularExpressionBody '/' RegularExpressionFlags
  let preparseState = RegexState.Empty;

  loop: while (true) {
    const ch = parser.currentChar;
    advanceChar(parser);

    if (preparseState & RegexState.Escape) {
      preparseState &= ~RegexState.Escape;
    } else {
      switch (ch) {
        case Chars.Slash:
          if (!preparseState) break loop;
          else break;
        case Chars.Backslash:
          preparseState |= RegexState.Escape;
          break;
        case Chars.LeftBracket:
          preparseState |= RegexState.Class;
          break;
        case Chars.RightBracket:
          preparseState &= RegexState.Escape;
          break;
        // No default
      }
    }

    if (
      ch === Chars.CarriageReturn ||
      ch === Chars.LineFeed ||
      ch === Chars.LineSeparator ||
      ch === Chars.ParagraphSeparator
    ) {
      parser.report(Errors.UnterminatedRegExp);
    }

    if (parser.index >= parser.source.length) {
      return parser.report(Errors.UnterminatedRegExp);
    }
  }

  const bodyEnd = parser.index - 1;

  let mask = RegexFlags.Empty;
  let char = parser.currentChar;

  const { index: flagStart } = parser;

  while (isIdentifierPart(char)) {
    switch (char) {
      case Chars.LowerG:
        if (mask & RegexFlags.Global) parser.report(Errors.DuplicateRegExpFlag, 'g');
        mask |= RegexFlags.Global;
        break;

      case Chars.LowerI:
        if (mask & RegexFlags.IgnoreCase) parser.report(Errors.DuplicateRegExpFlag, 'i');
        mask |= RegexFlags.IgnoreCase;
        break;

      case Chars.LowerM:
        if (mask & RegexFlags.Multiline) parser.report(Errors.DuplicateRegExpFlag, 'm');
        mask |= RegexFlags.Multiline;
        break;

      case Chars.LowerU:
        if (mask & RegexFlags.Unicode) parser.report(Errors.DuplicateRegExpFlag, 'u');
        if (mask & RegexFlags.UnicodeSets) parser.report(Errors.DuplicateRegExpFlag, 'vu');
        mask |= RegexFlags.Unicode;
        break;

      case Chars.LowerV:
        if (mask & RegexFlags.Unicode) parser.report(Errors.DuplicateRegExpFlag, 'uv');
        if (mask & RegexFlags.UnicodeSets) parser.report(Errors.DuplicateRegExpFlag, 'v');
        mask |= RegexFlags.UnicodeSets;
        break;

      case Chars.LowerY:
        if (mask & RegexFlags.Sticky) parser.report(Errors.DuplicateRegExpFlag, 'y');
        mask |= RegexFlags.Sticky;
        break;

      case Chars.LowerS:
        if (mask & RegexFlags.DotAll) parser.report(Errors.DuplicateRegExpFlag, 's');
        mask |= RegexFlags.DotAll;
        break;

      case Chars.LowerD:
        if (mask & RegexFlags.Indices) parser.report(Errors.DuplicateRegExpFlag, 'd');
        mask |= RegexFlags.Indices;
        break;

      default:
        parser.report(Errors.UnexpectedTokenRegExpFlag);
    }

    char = advanceChar(parser);
  }

  const flags = parser.source.slice(flagStart, parser.index);

  const pattern = parser.source.slice(bodyStart, bodyEnd);

  parser.tokenRegExp = { pattern, flags };

  if (parser.options.raw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);

  parser.tokenValue = validate(parser, pattern, flags);

  return Token.RegularExpression;
}

/**
 * Validates regular expressions
 *
 *
 * @param state Parser instance
 * @param context Context masks
 * @param pattern Regexp body
 * @param flags Regexp flags
 */
function validate(parser: Parser, pattern: string, flags: string): RegExp | null | Token {
  try {
    return new RegExp(pattern, flags);
  } catch {
    // Use null as tokenValue according to ESTree spec
    // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
    if (!parser.options.validateRegularExpressionWithRuntime) {
      return null;
    }

    parser.report(Errors.UnterminatedRegExp);
  }
}
