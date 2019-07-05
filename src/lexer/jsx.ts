import { CharFlags, CharTypes, isIdentifierStart, isIdentifierPart } from './charClassifier';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { nextCP, LexerState } from './';
import { scanSingleToken } from './scan';

/**
 * Scans JSX attribute value
 *
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXAttributeValue(parser: ParserState, context: Context): Token {
  parser.startIndex = parser.index;
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

  if (parser.index >= parser.end) return (parser.token = Token.EOF);

  let char = parser.source.charCodeAt(parser.index);

  if (char === Chars.LessThan) {
    if (parser.source.charCodeAt(parser.index + 1) === Chars.Slash) {
      parser.column += 2;
      parser.nextCP = parser.source.charCodeAt((parser.index += 2));
      return (parser.token = Token.JSXClose);
    }
    nextCP(parser);
    return (parser.token = Token.LessThan);
  }

  if (char === Chars.LeftBrace) {
    nextCP(parser);
    return (parser.token = Token.LeftBrace);
  }

  while (parser.index < parser.end) {
    if (CharTypes[nextCP(parser)] & CharFlags.JSXToken) break;
  }

  parser.tokenValue = parser.source.slice(parser.tokenIndex, parser.index);
  return (parser.token = Token.JSXText);
}

/**
 * Scans JSX identifier
 * @param parser The parser instance
 * @param context Context masks
 */
export function scanJSXIdentifier(parser: ParserState): Token {
  if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
    const { index } = parser;

    while (parser.index < parser.end) {
      const char = parser.nextCP;
      if (char === Chars.Hyphen || (index === parser.index ? isIdentifierStart(char) : isIdentifierPart(char))) {
        nextCP(parser);
      } else break;
    }
    parser.tokenValue += parser.source.slice(index, parser.index);
  }

  return parser.token;
}
