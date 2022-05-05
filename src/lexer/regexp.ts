import { Chars } from '../chars';
import { Context, ParserState } from '../common';
import { Token } from '../token';
import { advanceChar } from './common';
import { isIdentifierPart } from './charClassifier';
import { report, Errors } from '../errors';

/**
 * Scans regular expression
 *
 * @param parser Parser object
 * @param context Context masks
 */

export function scanRegularExpression(parser: ParserState, context: Context): Token {
  const enum RegexState {
    Empty = 0,
    Escape = 0x1,
    Class = 0x2
  }
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
        case Chars.CarriageReturn:
        case Chars.LineFeed:
        case Chars.LineSeparator:
        case Chars.ParagraphSeparator:
          report(parser, Errors.UnterminatedRegExp);
        default: // ignore
      }
    }

    if (parser.index >= parser.source.length) {
      return report(parser, Errors.UnterminatedRegExp);
    }
  }

  const bodyEnd = parser.index - 1;

  const enum RegexFlags {
    Empty = 0b0000000,
    IgnoreCase = 0b0000001,
    Global = 0b0000010,
    Multiline = 0b0000100,
    Unicode = 0b0010000,
    Sticky = 0b0001000,
    DotAll = 0b0100000,
    Indices = 0b1000000
  }

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
        mask |= RegexFlags.Unicode;
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

  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);

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
function validate(parser: ParserState, pattern: string, flags: string): RegExp | null | Token {
  try {
    return new RegExp(pattern, flags);
  } catch (e) {
    try {
      // Some JavaScript engine has not supported flag "d".
      new RegExp(pattern, flags.replace('d', ''));
      // Use null as tokenValue according to ESTree spec
      return null;
    } catch (e) {
      report(parser, Errors.UnterminatedRegExp);
    }
  }
}
