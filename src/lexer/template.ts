import { Chars } from '../chars';
import { Context } from '../common';
import { Errors } from '../errors';
import { type Parser } from '../parser/parser';
import { Token } from '../token';
import { advanceChar } from './common';
import { Escape, handleStringError, parseEscape } from './string';

/**
 * Scan a template section. It can start either from the quote or closing brace.
 */
export function scanTemplate(parser: Parser, context: Context): Token {
  const { index: start } = parser;
  let token: Token = Token.TemplateSpan;
  let ret: string | null = '';

  let char = advanceChar(parser);

  while (char !== Chars.Backtick) {
    if (char === Chars.Dollar && parser.source.charCodeAt(parser.index + 1) === Chars.LeftBrace) {
      advanceChar(parser); // Skip: '$'
      token = Token.TemplateContinuation;
      break;
    } else if (char === Chars.Backslash) {
      char = advanceChar(parser);
      if (char > 0x7e) {
        ret += String.fromCodePoint(char);
      } else {
        const { index, line, column } = parser;
        const code = parseEscape(parser, context | Context.Strict, char, /* isTemplate */ 1);
        if (code >= 0) {
          ret += String.fromCodePoint(code);
        } else if (code !== Escape.Empty && context & Context.TaggedTemplate) {
          // Restore before the error in parseEscape
          parser.index = index;
          parser.line = line;
          parser.column = column;
          ret = null;
          char = scanBadTemplate(parser, char);
          if (char < 0) token = Token.TemplateContinuation;
          break;
        } else {
          handleStringError(parser, code as Escape, /* isTemplate */ 1);
        }
      }
    } else if (parser.index < parser.end) {
      if (char === Chars.CarriageReturn && parser.source.charCodeAt(parser.index) === Chars.LineFeed) {
        ret += String.fromCodePoint(char);
        parser.currentChar = parser.source.charCodeAt(++parser.index);
      }

      if (((char & 83) < 3 && char === Chars.LineFeed) || (char ^ Chars.LineSeparator) <= 1) {
        parser.column = -1;
        parser.line++;
      }
      ret += String.fromCodePoint(char);
    }
    if (parser.index >= parser.end) parser.report(Errors.UnterminatedTemplate);
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
function scanBadTemplate(parser: Parser, ch: number): number {
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
    if (parser.index >= parser.end) parser.report(Errors.UnterminatedTemplate);
    ch = advanceChar(parser);
  }

  return ch;
}

export function scanTemplateTail(parser: Parser, context: Context): Token {
  if (parser.index >= parser.end) parser.report(Errors.Unexpected);
  parser.index--;
  parser.column--;
  return scanTemplate(parser, context);
}
