import { Chars } from '../chars';
import { Context, ParserState } from '../common';
import { Token } from '../token';
import { advanceChar } from './common';
import { isIdentifierPart } from './charClassifier';
import { report, Errors } from '../errors';

enum RegexState {
  Empty = 0,
  Escape = 0x1,
  Class = 0x2
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
  UnicodeSets = 0b1000_0000
}

/**
 * Scans regular expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanRegularExpression(parser: ParserState, context: Context): Token {
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
      report(parser, Errors.UnterminatedRegExp);
    }

    if (parser.index >= parser.source.length) {
      return report(parser, Errors.UnterminatedRegExp);
    }
  }

  const bodyEnd = parser.index - 1;

  let mask = RegexFlags.Empty;
  let char = parser.currentChar;

  const { index: flagStart } = parser;

  while (isIdentifierPart(char)) {
    switch (char) {
      case Chars.LowerG:
        if (mask & RegexFlags.Global) report(parser, Errors.DuplicateRegExpFlag, 'g');
        mask |= RegexFlags.Global;
        break;

      case Chars.LowerI:
        if (mask & RegexFlags.IgnoreCase) report(parser, Errors.DuplicateRegExpFlag, 'i');
        mask |= RegexFlags.IgnoreCase;
        break;

      case Chars.LowerM:
        if (mask & RegexFlags.Multiline) report(parser, Errors.DuplicateRegExpFlag, 'm');
        mask |= RegexFlags.Multiline;
        break;

      case Chars.LowerU:
        if (mask & RegexFlags.Unicode) report(parser, Errors.DuplicateRegExpFlag, 'u');
        if (mask & RegexFlags.UnicodeSets) report(parser, Errors.DuplicateRegExpFlag, 'vu');
        mask |= RegexFlags.Unicode;
        break;

      case Chars.LowerV:
        if (mask & RegexFlags.Unicode) report(parser, Errors.DuplicateRegExpFlag, 'uv');
        if (mask & RegexFlags.UnicodeSets) report(parser, Errors.DuplicateRegExpFlag, 'v');
        mask |= RegexFlags.UnicodeSets;
        break;

      case Chars.LowerY:
        if (mask & RegexFlags.Sticky) report(parser, Errors.DuplicateRegExpFlag, 'y');
        mask |= RegexFlags.Sticky;
        break;

      case Chars.LowerS:
        if (mask & RegexFlags.DotAll) report(parser, Errors.DuplicateRegExpFlag, 's');
        mask |= RegexFlags.DotAll;
        break;

      case Chars.LowerD:
        if (mask & RegexFlags.Indices) report(parser, Errors.DuplicateRegExpFlag, 'd');
        mask |= RegexFlags.Indices;
        break;

      default:
        report(parser, Errors.UnexpectedTokenRegExpFlag);
    }

    char = advanceChar(parser);
  }

  const flags = parser.source.slice(flagStart, parser.index);

  const pattern = parser.source.slice(bodyStart, bodyEnd);

  parser.tokenRegExp = { pattern, flags };

  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);

  let value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch {
    // Use null as tokenValue according to ESTree spec
    // https://github.com/estree/estree/blob/a27003adf4fd7bfad44de9cef372a2eacd527b1c/es5.md#regexpliteral
  }

  parser.tokenValue = value;

  return Token.RegularExpression;
}
