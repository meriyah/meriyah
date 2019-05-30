import { ParserState, Context } from '../common';
import { Token } from '../token';
import { Chars } from '../chars';
import { nextCodePoint, fromCodePoint } from './common';
import { parseEscape, Escape, handleStringError } from './string';
import { report, Errors } from '../errors';

/**
 * Scan a template section. It can start either from the quote or closing brace.
 */
export function scanTemplate(parser: ParserState, context: Context): Token {
  const { index: start } = parser;
  let tail = true;
  let ret: string | void = '';

  let ch = nextCodePoint(parser);

  while (ch !== Chars.Backtick) {
    if (ch === Chars.Dollar && parser.source.charCodeAt(parser.index + 1) === Chars.LeftBrace) {
      nextCodePoint(parser);
      tail = false;
      break;
    } else if ((ch & 8) === 8 && ch === Chars.Backslash) {
      ch = nextCodePoint(parser);
      if (ch > 0x7e) {
        ret += fromCodePoint(ch);
      } else {
        const code = parseEscape(parser, context | Context.Strict, ch);
        if (code >= 0) {
          ret += fromCodePoint(code);
        } else if (code !== Escape.Empty && context & Context.TaggedTemplate) {
          ret = undefined;
          ch = scanBadTemplate(parser, ch);
          if (ch < 0) {
            tail = false;
          }
          break;
        } else {
          handleStringError(parser, code as Escape, /* isTemplate */ 1);
        }
      }
    } else {
      if (ch === Chars.CarriageReturn) {
        if (parser.index < parser.length && parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
          ret += fromCodePoint(ch);
          parser.currentCodePoint = parser.source.charCodeAt(++parser.index);
        }
      }

      if (ch === Chars.LineFeed || ch === Chars.LineSeparator || ch === Chars.ParagraphSeparator) {
        parser.column = -1;
        parser.line++;
      }
      ret += fromCodePoint(ch);
    }
    if (parser.index >= parser.length) report(parser, Errors.UnterminatedTemplate);
    ch = nextCodePoint(parser);
  }

  nextCodePoint(parser); // Consume the quote or opening brace
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
        if (index < parser.length && parser.source.charCodeAt(index) === Chars.LeftBrace) {
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
    if (parser.index >= parser.length) report(parser, Errors.UnterminatedTemplate);
    ch = nextCodePoint(parser);
  }

  return ch;
}

export function scanTemplateTail(state: ParserState, context: Context): Token {
  if (state.index >= state.length) return Token.Illegal;
  state.index--;
  state.column--;
  return scanTemplate(state, context);
}
