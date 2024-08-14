import { CharFlags, CharTypes } from './charClassifier';
import { KeywordDescTable, Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { advanceChar, LexerState, TokenLookup, scanSingleToken, scanNewLine, consumeLineFeed, nextToken } from './';
import { decodeHTMLStrict } from './decodeHTML';

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
 * Scans JSX token
 *
 * @param parser The parser object
 */
export function scanJSXToken(parser: ParserState, context: Context): Token {
  parser.startIndex = parser.tokenIndex = parser.index;
  parser.startColumn = parser.tokenColumn = parser.column;
  parser.startLine = parser.tokenLine = parser.line;

  if (parser.index >= parser.end) return parser.setToken(Token.EOF);

  const token = TokenLookup[parser.source.charCodeAt(parser.index)];

  switch (token) {
    // '<'
    case Token.LessThan: {
      nextToken(parser, context);
      if (parser.getToken() === Token.JSXClose) break;
      if (parser.getToken() !== Token.LessThan)
        report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);

      // Possible white space or comments between "<" and "/".
      const {
        index,
        line,
        column,
        tokenIndex,
        startIndex,
        startColumn,
        startLine,
        tokenColumn,
        tokenLine,
        currentChar,
        tokenValue,
        tokenRaw,
        tokenRegExp
      } = parser;
      const tokenAfter = scanSingleToken(parser, context, LexerState.None);

      if (tokenAfter === Token.Divide) {
        // Rewrite LessThan + Divide as JSXClose
        parser.setToken(Token.JSXClose, true);
      } else {
        // Reset if not merged
        parser.index = index;
        parser.line = line;
        parser.column = column;
        parser.tokenIndex = tokenIndex;
        parser.startIndex = startIndex;
        parser.startColumn = startColumn;
        parser.startLine = startLine;
        parser.tokenColumn = tokenColumn;
        parser.tokenLine = tokenLine;
        parser.currentChar = currentChar;
        parser.tokenValue = tokenValue;
        parser.tokenRaw = tokenRaw;
        parser.tokenRegExp = tokenRegExp;
      }

      break;
    }
    // '{'
    case Token.LeftBrace: {
      advanceChar(parser);
      parser.setToken(Token.LeftBrace);
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

      const raw = parser.source.slice(parser.tokenIndex, parser.index);
      if (context & Context.OptionsRaw) parser.tokenRaw = raw;
      parser.tokenValue = decodeHTMLStrict(raw);
      parser.setToken(Token.JSXText);
    }
  }

  return parser.getToken();
}

/**
 * Scans JSX identifier
 *
 * @param parser The parser instance
 */
export function scanJSXIdentifier(parser: ParserState): Token {
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
