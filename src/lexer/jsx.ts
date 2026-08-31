import { Chars } from '../chars.ts';
import { type Context } from '../common.ts';
import { Errors } from '../errors.ts';
import { type Parser } from '../parser/parser.ts';
import { Token } from '../token.ts';
import { CharFlags, CharTypes } from './charClassifier.ts';
import { decodeHTMLStrict } from './decodeHTML.ts';
import { advanceChar, consumeLineFeed, LexerState, scanNewLine, scanSingleToken } from './index.ts';

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

    // Unlike a normal string, a JSX attribute value may contain raw line
    // terminators, and they have to be counted or every location after the
    // attribute is off. `CharTypes` only covers the first 128 code points, so
    // `<LS>` and `<PS>` are matched by code point like `scanString` does.
    if (char === Chars.CarriageReturn) {
      // `<CR><LF>` is one line terminator sequence, not two
      if (parser.source.charCodeAt(parser.index + 1) === Chars.LineFeed) advanceChar(parser);
      parser.column = -1;
      parser.line++;
    } else if (char === Chars.LineFeed || char === Chars.LineSeparator || char === Chars.ParagraphSeparator) {
      parser.column = -1;
      parser.line++;
    }

    char = advanceChar(parser);
  }

  // check for unterminated string
  if (char !== quote) parser.report(Errors.UnterminatedString);
  // Decode HTML entities, same as `nextJSXToken` does for JSX text
  parser.tokenValue = decodeHTMLStrict(parser.source.slice(start, parser.index));
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

  if (parser.currentChar === Chars.RightBrace) {
    parser.report(Errors.UnexpectedRightBraceInJSXText);
  }

  if (parser.currentChar === Chars.GreaterThan) {
    parser.report(Errors.UnexpectedGreaterThanInJSXText);
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
  if (parser.getToken() & Token.IsIdentifier) {
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
