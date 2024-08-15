import { CharFlags, CharTypes } from './charClassifier';
import { Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { advanceChar, LexerState, scanSingleToken, scanNewLine, consumeLineFeed } from './';
import { decodeHTMLStrict } from './decodeHTML';
import { Chars } from '../chars';

/**
 * Scans JSX attribute value
 *
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXAttributeValue(parser: ParserState, context: Context): Token {
  // skip "=" before the value
  parser.startIndex = parser.tokenIndex = parser.index;
  parser.startColumn = parser.tokenColumn = parser.column;
  parser.startLine = parser.tokenLine = parser.line;
  parser.setToken(
    CharTypes[parser.currentChar] & CharFlags.StringLiteral
      ? scanJSXString(parser, context)
      : scanSingleToken(parser, context, LexerState.None)
  );
  return parser.getToken();
}

/**
 * Scans JSX string
 *
 * @param parser The parser object
 */
export function scanJSXString(parser: ParserState, context: Context): Token {
  const quote = parser.currentChar;
  let char = advanceChar(parser);
  const start = parser.index;
  while (char !== quote) {
    if (parser.index >= parser.end) report(parser, Errors.UnterminatedString);
    char = advanceChar(parser);
  }

  // check for unterminated string
  if (char !== quote) report(parser, Errors.UnterminatedString);
  parser.tokenValue = parser.source.slice(start, parser.index);
  advanceChar(parser); // skip the quote
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
  return Token.StringLiteral;
}

/**
 * consume Token.LessThan, Token.LeftBrace, or Token.JSXText
 *
 * @param parser The parser object
 */
export function nextJSXToken(parser: ParserState, context: Context) {
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
  if (parser.tokenIndex === parser.index) report(parser, Errors.Unexpected);

  const raw = parser.source.slice(parser.tokenIndex, parser.index);
  if (context & Context.OptionsRaw) parser.tokenRaw = raw;
  parser.tokenValue = decodeHTMLStrict(raw);
  parser.setToken(Token.JSXText);
}

/**
 * Re-scans JSX identifier which might include hyphen
 *
 * @param parser The parser instance
 */
export function rescanJSXIdentifier(parser: ParserState): Token {
  if ((parser.getToken() & Token.IsIdentifier) === Token.IsIdentifier) {
    const { index } = parser;
    let char = parser.currentChar;
    while (CharTypes[char] & (CharFlags.Hyphen | CharFlags.IdentifierPart)) {
      char = advanceChar(parser);
    }
    parser.tokenValue += parser.source.slice(index, parser.index);
  }
  parser.setToken(Token.Identifier, true);
  return parser.getToken();
}
