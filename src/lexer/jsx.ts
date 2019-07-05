import { isIdentifierStart, isIdentifierPart } from './charClassifier';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Context } from '../common';
import { report, Errors } from '../errors';
import { nextCP, nextToken } from './';

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

export function scanJSXToken(parser: ParserState): Token {
  parser.startIndex = parser.tokenIndex = parser.index;

  if (parser.index >= parser.end) {
    return (parser.token = Token.EOF);
  }

  let char = parser.source.charCodeAt(parser.index);

  if (char === Chars.LessThan) {
    if (parser.source.charCodeAt(parser.index + 1) === Chars.Slash) {
      parser.index += 2;
      parser.nextCP = parser.source.charCodeAt(parser.index);
      return (parser.token = Token.JSXClose);
    }
    ++parser.index;
    parser.nextCP = parser.source.charCodeAt(parser.index);
    return (parser.token = Token.LessThan);
  }

  if (char === Chars.LeftBrace) {
    ++parser.index;
    parser.nextCP = parser.source.charCodeAt(parser.index);
    return (parser.token = Token.LeftBrace);
  }

  while (parser.index < parser.end) {
    parser.index++;
    char = parser.source.charCodeAt(parser.index);
    if (char === Chars.LeftBrace || char === Chars.LessThan) {
      break;
    }
  }
  parser.nextCP = parser.source.charCodeAt(parser.index);
  parser.tokenValue = parser.source.slice(parser.tokenIndex, parser.index);
  return (parser.token = Token.JSXText);
}

export function scanJSXIdentifier(parser: ParserState): Token {
  if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
    const firstCharPosition = parser.index;

    while (parser.index < parser.end) {
      const char = parser.nextCP;
      if (
        char === Chars.Hyphen ||
        (firstCharPosition === parser.index ? isIdentifierStart(char) : isIdentifierPart(char))
      ) {
        parser.index++;
      } else break;
      parser.nextCP = parser.source.charCodeAt(parser.index);
    }

    parser.tokenValue += parser.source.slice(firstCharPosition, parser.index); // - firstCharPosition);
  }

  return parser.token;
}

export function scanJsxAttributeValue(parser: ParserState, context: Context): any {
  parser.startIndex = parser.index;

  switch (parser.nextCP) {
    case Chars.DoubleQuote:
    case Chars.SingleQuote:
      parser.token = scanJSXString(parser);
      return (parser.token = Token.StringLiteral);
    default:
      // If this scans anything other than `{`, it's a parse error.
      nextToken(parser, context);
  }
}
