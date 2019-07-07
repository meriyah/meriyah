import { CharFlags, CharTypes } from './charClassifier';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { nextCP, LexerState, TokenLookup } from './';
import { scanSingleToken } from './scan';

/**
 * Scans JSX attribute value
 *
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXAttributeValue(parser: ParserState, context: Context): Token {
  parser.startIndex = parser.index;
  parser.startColumn = parser.column;
  parser.startLine = parser.line;
  parser.token =
    CharTypes[parser.nextCP] & CharFlags.StringLiteral
      ? scanJSXString(parser)
      : scanSingleToken(parser, context, LexerState.None);
  return parser.token;
}

/**
 * Scans JSX string
 *
 * @param parser The parser object
 */
export function scanJSXString(parser: ParserState): Token {
  const quote = parser.nextCP;
  let char = nextCP(parser);
  const start = parser.index;
  while (char !== quote) {
    if (parser.index >= parser.end) report(parser, Errors.UnterminatedString);
    char = nextCP(parser);
  }

  // check for unterminated string
  if (char !== quote) report(parser, Errors.UnterminatedString);
  parser.tokenValue = parser.source.slice(start, parser.index);
  nextCP(parser); // skip the quote
  return Token.StringLiteral;
}

/**
 * Scans JSX token
 *
 * @param parser The parser object
 */
export function scanJSXToken(parser: ParserState): Token {
  parser.startIndex = parser.tokenIndex = parser.index;
  parser.startColumn = parser.colPos = parser.column;
  parser.startLine = parser.linePos = parser.line;

  if (parser.index >= parser.end) return (parser.token = Token.EOF);

  const token = TokenLookup[parser.source.charCodeAt(parser.index)];

  switch (token) {
    case Token.LessThan: {
      nextCP(parser);
      if (parser.nextCP === Chars.Slash) {
        nextCP(parser);
        return (parser.token = Token.JSXClose);
      }

      return (parser.token = Token.LessThan);
    }
    case Token.LeftBrace: {
      nextCP(parser);
      return (parser.token = Token.LeftBrace);
    }
    default: // ignore
  }

  while (parser.index < parser.end && (CharTypes[nextCP(parser)] & CharFlags.JSXToken) === 0) {}

  parser.tokenValue = parser.source.slice(parser.tokenIndex, parser.index);

  return (parser.token = Token.JSXText);
}

/**
 * Scans JSX identifier
 *
 * @param parser The parser instance
 */
export function scanJSXIdentifier(parser: ParserState): Token {
  if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
    const { index } = parser;
    let char = parser.nextCP;
    while ((CharTypes[char] & (CharFlags.Hyphen | CharFlags.IdentifierPart)) !== 0) {
      char = nextCP(parser);
    }
    parser.tokenValue += parser.source.slice(index, parser.index);
  }

  return parser.token;
}
