import { Chars } from '../chars';
import { type Context } from '../common';
import { Errors } from '../errors';
import { type Parser } from '../parser/parser';
import { Token } from '../token';
import { advanceChar, consumeLineFeed, LexerState, scanNewLine, scanSingleToken } from './';
import { CharFlags, CharTypes } from './charClassifier';
import { decodeHTMLStrict } from './decodeHTML';

/**
 * Scans JSX attribute value
 *
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXAttributeValue(parser: Parser, context: Context): Token {
  // skip "=" before the value
  parser.startIndex = parser.tokenIndex = parser.index;
  parser.startColumn = parser.tokenColumn = parser.column;
  parser.startLine = parser.tokenLine = parser.line;
  parser.setToken(
    CharTypes[parser.currentChar] & CharFlags.StringLiteral
      ? scanJSXString(parser)
      : scanSingleToken(parser, context, LexerState.None),
  );
  return parser.getToken();
}

/**
 * Scans JSX string
 *
 * @param parser The parser object
 */
function scanJSXString(parser: Parser): Token {
  const quote = parser.currentChar;
  let char = advanceChar(parser);
  const start = parser.index;
  while (char !== quote) {
    if (parser.index >= parser.end) parser.report(Errors.UnterminatedString);
    char = advanceChar(parser);
  }

  // check for unterminated string
  if (char !== quote) parser.report(Errors.UnterminatedString);
  parser.tokenValue = parser.source.slice(start, parser.index);
  advanceChar(parser); // skip the quote
  if (parser.options.raw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
  return Token.StringLiteral;
}

/**
 * consume Token.LessThan, Token.LeftBrace, or Token.JSXText
 *
 * @param parser The parser object
 */
export function nextJSXToken(parser: Parser) {
  parser.startIndex = parser.tokenIndex = parser.index;
  parser.startColumn = parser.tokenColumn = parser.column;
  parser.startLine = parser.tokenLine = parser.line;

  if (parser.index >= parser.end) {
    parser.setToken(Token.EOF);
    return;
  }

  if (parser.currentChar === Chars.LessThan) {
    advanceChar(parser);
    parser.setToken(Token.LessThan);
    return;
  }

  if (parser.currentChar === Chars.LeftBrace) {
    advanceChar(parser);
    parser.setToken(Token.LeftBrace);
    return;
  }

  let state = LexerState.None;

  while (parser.index < parser.end) {
    const type = CharTypes[parser.source.charCodeAt(parser.index)];

    if (type & CharFlags.CarriageReturn) {
      state |= LexerState.NewLine | LexerState.LastIsCR;
      scanNewLine(parser);
    } else if (type & CharFlags.LineFeed) {
      consumeLineFeed(parser, state);
      state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
    } else {
      advanceChar(parser);
    }

    if (CharTypes[parser.currentChar] & CharFlags.JSXToken) break;
  }

  // No text, next char is "}" or ">"
  if (parser.tokenIndex === parser.index) parser.report(Errors.Unexpected);

  const raw = parser.source.slice(parser.tokenIndex, parser.index);
  if (parser.options.raw) parser.tokenRaw = raw;
  parser.tokenValue = decodeHTMLStrict(raw);
  parser.setToken(Token.JSXText);
}

/**
 * Re-scans JSX identifier which might include hyphen
 *
 * @param parser The parser instance
 */
export function rescanJSXIdentifier(parser: Parser): Token {
  if ((parser.getToken() & Token.IsIdentifier) === Token.IsIdentifier) {
    const { index } = parser;
    let char = parser.currentChar;
    while (CharTypes[char] & (CharFlags.Hyphen | CharFlags.IdentifierPart)) {
      char = advanceChar(parser);
    }
    parser.tokenValue += parser.source.slice(index, parser.index);
    parser.setToken(Token.Identifier, true);
  }
  return parser.getToken();
}
