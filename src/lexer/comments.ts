import { nextCodePoint, CharTypes, CharFlags, LexerState, advanceNewline, consumeLineFeed } from './';
import { Chars } from '../chars';
import { ParserState } from '../common';
import { report, Errors } from '../errors';

/**
 * Skips BOM and hasbang (stage 3)
 *
 * @param parser  Parser object
 */
export function skipHashBang(parser: ParserState): void {
  let index = parser.index;
  if (index === parser.end) return;
  if (parser.nextCP === Chars.ByteOrderMark) {
    parser.index = ++index;
    parser.nextCP = parser.source.charCodeAt(index);
  }

  if (index < parser.end && parser.nextCP === Chars.Hash) {
    index++;
    if (index < parser.end && parser.source.charCodeAt(index) === Chars.Exclamation) {
      parser.index = index + 1;
      parser.nextCP = parser.source.charCodeAt(parser.index);
      skipSingleLineComment(parser, LexerState.None);
    } else {
      report(parser, Errors.IllegalCaracter, '#');
    }
  }
}

/**
 * Skips single line comment
 *
 * @param parser  Parser object
 * @param state  Lexer state
 */
export function skipSingleLineComment(parser: ParserState, state: LexerState): LexerState {
  while (parser.index < parser.end) {
    if (CharTypes[parser.nextCP] & CharFlags.LineTerminator || (parser.nextCP ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      advanceNewline(parser);
      return state;
    }
    nextCodePoint(parser);
  }
  return state;
}

/**
 * Skips multiline comment
 *
 * @param parser Parser object
 * @param state Lexer state
 */
export function skipMultiLineComment(parser: ParserState, state: LexerState): LexerState | void {
  while (parser.index < parser.end) {
    while (parser.nextCP === Chars.Asterisk) {
      if (nextCodePoint(parser) === Chars.Slash) {
        nextCodePoint(parser);
        return state;
      }
    }

    if (parser.nextCP === Chars.CarriageReturn) {
      state |= LexerState.NewLine | LexerState.LastIsCR;
      advanceNewline(parser);
    } else if (parser.nextCP === Chars.LineFeed) {
      consumeLineFeed(parser, (state & LexerState.LastIsCR) !== 0);
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
    } else if ((parser.nextCP ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      advanceNewline(parser);
    } else {
      nextCodePoint(parser);
    }
  }

  report(parser, Errors.UnterminatedComment);
}
