import { Chars } from '../chars.ts';
import { type Context, Flags } from '../common.ts';
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
  let hasCarriageReturn = false;

  while (parser.index < parser.end) {
    const char = parser.source.charCodeAt(parser.index);

    // `CharTypes` only covers the first 128 code points, and the
    // `CarriageReturn`/`LineFeed` flags it does have are swapped relative to
    // the conventional `\r`/`\n` mapping used everywhere else in this file
    // (`scanJSXString`, `scanString`, `scanTemplate`, `comments.ts`). Matching
    // by code point, like `scanJSXString` already does, makes `<CR><LF>` one
    // line terminator (not two), `<LF><CR>` two line terminators (not one),
    // and counts `<LS>` / `<PS>` as line terminators at all.
    if (char === Chars.CarriageReturn) {
      state |= LexerState.NewLine | LexerState.LastIsCR;
      hasCarriageReturn = true;
      scanNewLine(parser);
    } else if (char === Chars.LineFeed) {
      consumeLineFeed(parser, state);
      state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
    } else if (char === Chars.LineSeparator || char === Chars.ParagraphSeparator) {
      parser.flags |= Flags.NewLine;
      parser.currentChar = parser.source.charCodeAt(++parser.index);
      parser.column = 0;
      parser.line++;
      state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
    } else {
      advanceChar(parser);
    }

    if (CharTypes[parser.currentChar] & CharFlags.JSXToken) break;
  }

  // No text, next char is "}" or ">"
  if (parser.tokenIndex === parser.index) parser.report(Errors.Unexpected);

  // Normalize `<CR><LF>` to `<LF>` in the decoded value, matching Babel and
  // acorn-jsx. A lone `<CR>` is intentionally kept, the same way those parsers
  // keep it. `scanTemplate` already does the equivalent normalization for
  // template raw text.
  const sourceSlice = parser.source.slice(parser.tokenIndex, parser.index);
  const raw = hasCarriageReturn ? sourceSlice.replaceAll('\r\n', '\n') : sourceSlice;
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
