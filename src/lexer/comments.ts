import { nextCP, CharTypes, CharFlags, LexerState, scanNewLine, consumeLineFeed } from './';
import { Chars } from '../chars';
import { ParserState } from '../common';
import { report, Errors } from '../errors';

/**
 * Skips hasbang (stage 3)
 *
 * @param parser  Parser object
 */
export function skipHashBang(parser: ParserState): void {
  // HashbangComment ::
  //   #!  SingleLineCommentChars_opt
  if (parser.nextCP === Chars.Hash && parser.source.charCodeAt(parser.index + 1) === Chars.Exclamation) {
    skipSingleLineComment(parser, LexerState.None);
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
      scanNewLine(parser);
      return state;
    }
    nextCP(parser);
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
      if (nextCP(parser) === Chars.Slash) {
        nextCP(parser);
        return state;
      }
    }

    if (parser.nextCP === Chars.CarriageReturn) {
      state |= LexerState.NewLine | LexerState.LastIsCR;
      scanNewLine(parser);
    } else if (parser.nextCP === Chars.LineFeed) {
      consumeLineFeed(parser, (state & LexerState.LastIsCR) !== 0);
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
    } else if ((parser.nextCP ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      scanNewLine(parser);
    } else {
      nextCP(parser);
    }
  }

  report(parser, Errors.UnterminatedComment);
}
