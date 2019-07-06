import { ParserState, Context } from '../common';
import { Token } from '../token';
import { Chars } from '../chars';
import { nextCP, fromCodePoint } from './common';
import { parseEscape, Escape, handleStringError } from './string';
import { report, Errors } from '../errors';

/**
 * Scan a template section. It can start either from the quote or closing brace.
 */
export function scanTemplate(parser: ParserState, context: Context): Token {
  const { index: start } = parser;
  let tail = 1;
  let ret: string | void = '';

  let char = nextCP(parser);

  while (char !== Chars.Backtick) {
    if (char === Chars.Dollar && parser.source.charCodeAt(parser.index + 1) === Chars.LeftBrace) {
      nextCP(parser); // Skip: '}'
      tail = 0;
      break;
    } else if ((char & 8) === 8 && char === Chars.Backslash) {
      char = nextCP(parser);
      if (char > 0x7e) {
        ret += fromCodePoint(char);
      } else {
        const code = parseEscape(parser, context | Context.Strict, char);
        if (code >= 0) {
          ret += fromCodePoint(code);
        } else if (code !== Escape.Empty && context & Context.TaggedTemplate) {
          ret = undefined;
          char = scanBadTemplate(parser, char);
          if (char < 0) {
            tail = 0;
          }
          break;
        } else {
          handleStringError(parser, code as Escape, /* isTemplate */ 1);
        }
      }
    } else {
      if (char === Chars.CarriageReturn) {
        if (parser.index < parser.end && parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
          ret += fromCodePoint(char);
          parser.nextCP = parser.source.charCodeAt(++parser.index);
        }
      }

      if (((char & 83) < 3 && char === Chars.LineFeed) || (char ^ Chars.LineSeparator) <= 1) {
        parser.column = -1;
        parser.line++;
      }
      ret += fromCodePoint(char);
    }
    if (parser.index >= parser.end) report(parser, Errors.UnterminatedTemplate);
    char = nextCP(parser);
  }

  nextCP(parser); // Consume the quote or opening brace
  parser.tokenValue = ret;
  if (tail) {
    parser.tokenRaw = parser.source.slice(start + 1, parser.index - 1);
    return Token.TemplateTail;
  } else {
    parser.tokenRaw = parser.source.slice(start + 1, parser.index - 2);
    return Token.TemplateContinuation;
  }
}

// Fallback for looser template segment validation (no actual parsing).
// It returns `ch` as negative iff the segment ends with `${`
function scanBadTemplate(parser: ParserState, ch: number): number {
  while (ch !== Chars.Backtick) {
    // Break after a literal `${` (thus the dedicated code path).
    switch (ch) {
      case Chars.Dollar: {
        const index = parser.index + 1;
        if (index < parser.end && parser.source.charCodeAt(index) === Chars.LeftBrace) {
          parser.index = index;
          parser.column++;
          return -ch;
        }
        break;
      }
      case Chars.LineFeed:
      case Chars.LineSeparator:
      case Chars.ParagraphSeparator:
        parser.column = -1;
        parser.line++;
      // falls through

      default:
      // do nothing
    }
    if (parser.index >= parser.end) report(parser, Errors.UnterminatedTemplate);
    ch = nextCP(parser);
  }

  return ch;
}

export function scanTemplateTail(parser: ParserState, context: Context): Token {
  if (parser.index >= parser.end) report(parser, Errors.Unexpected);
  parser.index--;
  parser.column--;
  return scanTemplate(parser, context);
}
