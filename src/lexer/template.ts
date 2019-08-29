import { ParserState, Context } from '../common';
import { Token } from '../token';
import { Chars } from '../chars';
import { advanceChar, fromCodePoint } from './common';
import { parseEscape, Escape, handleStringError } from './string';
import { report, Errors } from '../errors';

/**
 * Scan a template section. It can start either from the quote or closing brace.
 */
export function scanTemplate(parser: ParserState, context: Context): Token {
  const { index: start } = parser;
  let token: Token = Token.TemplateSpan;
  let ret: string | void = '';

  let char = advanceChar(parser);

  while (char !== Chars.Backtick) {
    if (char === Chars.Dollar && parser.source.charCodeAt(parser.index + 1) === Chars.LeftBrace) {
      advanceChar(parser); // Skip: '}'
      token = Token.TemplateContinuation;
      break;
    } else if ((char & 8) === 8 && char === Chars.Backslash) {
      char = advanceChar(parser);
      if (char > 0x7e) {
        ret += fromCodePoint(char);
      } else {
        const code = parseEscape(parser, context | Context.Strict, char);
        if (code >= 0) {
          ret += fromCodePoint(code);
        } else if (code !== Escape.Empty && context & Context.TaggedTemplate) {
          ret = undefined;
          char = scanBadTemplate(parser, char);
          if (char < 0) token = Token.TemplateContinuation;
          break;
        } else {
          handleStringError(parser, code as Escape, /* isTemplate */ 1);
        }
      }
    } else {
      if (
        parser.index < parser.end &&
        char === Chars.CarriageReturn &&
        parser.source.charCodeAt(parser.index) === Chars.LineFeed
      ) {
        ret += fromCodePoint(char);
        parser.currentChar = parser.source.charCodeAt(++parser.index);
      }

      if (((char & 83) < 3 && char === Chars.LineFeed) || (char ^ Chars.LineSeparator) <= 1) {
        parser.column = -1;
        parser.line++;
      }
      ret += fromCodePoint(char);
    }
    if (parser.index >= parser.end) report(parser, Errors.UnterminatedTemplate);
    char = advanceChar(parser);
  }

  advanceChar(parser); // Consume the quote or opening brace
  parser.tokenValue = ret;

  parser.tokenRaw = parser.source.slice(start + 1, parser.index - (token === Token.TemplateSpan ? 1 : 2));

  return token;
}

/**
 * Scans looser template segment
 *
 * @param parser Parser state
 * @param ch Code point
 */
function scanBadTemplate(parser: ParserState, ch: number): number {
  while (ch !== Chars.Backtick) {
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
    ch = advanceChar(parser);
  }

  return ch;
}

export function scanTemplateTail(parser: ParserState, context: Context): Token {
  if (parser.index >= parser.end) report(parser, Errors.Unexpected);
  parser.index--;
  parser.column--;
  return scanTemplate(parser, context);
}
