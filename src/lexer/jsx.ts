import { CharFlags, CharTypes } from './charClassifier';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { advanceChar, LexerState, TokenLookup, scanSingleToken, scanNewLine, consumeLineFeed } from './';

/**
 * Scans JSX attribute value
 *
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXAttributeValue(parser: ParserState, context: Context): Token {
  parser.startPos = parser.tokenPos = parser.index;
  parser.startColumn = parser.colPos = parser.column;
  parser.startLine = parser.linePos = parser.line;
  parser.token =
    CharTypes[parser.currentChar] & CharFlags.StringLiteral
      ? scanJSXString(parser, context)
      : scanSingleToken(parser, context, LexerState.None);
  return parser.token;
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
  if (context & Context.OptionsRaw) parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
  return Token.StringLiteral;
}

/**
 * Scans JSX token
 *
 * @param parser The parser object
 */
export function scanJSXToken(parser: ParserState, context: Context): Token {
  parser.startPos = parser.tokenPos = parser.index;
  parser.startColumn = parser.colPos = parser.column;
  parser.startLine = parser.linePos = parser.line;

  if (parser.index >= parser.end) return (parser.token = Token.EOF);

  const token = TokenLookup[parser.source.charCodeAt(parser.index)];

  switch (token) {
    // '<'
    case Token.LessThan: {
      advanceChar(parser);
      if (parser.currentChar === Chars.Slash) {
        advanceChar(parser);
        parser.token = Token.JSXClose;
      } else {
        parser.token = Token.LessThan;
      }

      break;
    }
    // '{'
    case Token.LeftBrace: {
      advanceChar(parser);
      parser.token = Token.LeftBrace;
      break;
    }
    default: {
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

      parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
      if (context & Context.OptionsRaw) parser.tokenRaw = parser.tokenValue;
      parser.token = Token.JSXText;
    }
  }

  return parser.token;
}

/**
 * Scans JSX identifier
 *
 * @param parser The parser instance
 */
export function scanJSXIdentifier(parser: ParserState): Token {
  if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
    const { index } = parser;
    let char = parser.currentChar;
    while (CharTypes[char] & (CharFlags.Hyphen | CharFlags.IdentifierPart)) {
      char = advanceChar(parser);
    }
    parser.tokenValue += parser.source.slice(index, parser.index);
  }
  parser.token = Token.Identifier;
  return parser.token;
}
