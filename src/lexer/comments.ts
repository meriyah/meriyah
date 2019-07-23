import { nextCP, CharTypes, CharFlags, LexerState, scanNewLine, consumeLineFeed } from './';
import { Chars } from '../chars';
import { Context, ParserState } from '../common';
import { report, Errors } from '../errors';

export const enum CommentType {
  Single,
  Multi,
  HTMLOpen,
  HTMLClose,
  HashBang
}

export const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];

/**
 * Skips hasbang (stage 3)
 *
 * @param parser  Parser object
 */
export function skipHashBang(parser: ParserState): void {
  // HashbangComment ::
  //   #!  SingleLineCommentChars_opt
  if (parser.nextCP === Chars.Hash && parser.source.charCodeAt(parser.index + 1) === Chars.Exclamation) {
    skipSingleLineComment(parser, LexerState.None, CommentType.HashBang);
  }
}

export function skipSingleHTMLComment(
  parser: ParserState,
  state: LexerState,
  context: Context,
  type: CommentType
): LexerState {
  if (context & Context.Module) report(parser, Errors.Unexpected);
  return skipSingleLineComment(parser, state, type);
}

/**
 * Skips single line comment
 *
 * @param parser  Parser object
 * @param state  Lexer state
 */
export function skipSingleLineComment(parser: ParserState, state: LexerState, type: CommentType): LexerState {
  const { index } = parser;
  while (parser.index < parser.end) {
    if (CharTypes[parser.nextCP] & CharFlags.LineTerminator || (parser.nextCP ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      scanNewLine(parser);
      return state;
    }
    nextCP(parser);
  }
  if (parser.onComment)
    parser.onComment(CommentTypes[type & 0xff], parser.source.slice(index, parser.index), parser, parser.index);
  return state;
}

/**
 * Skips multiline comment
 *
 * @param parser Parser object
 * @param state Lexer state
 */
export function skipMultiLineComment(parser: ParserState, state: LexerState): LexerState | void {
  const { index } = parser;
  while (parser.index < parser.end) {
    while (parser.nextCP === Chars.Asterisk) {
      if (nextCP(parser) === Chars.Slash) {
        nextCP(parser);
        if (parser.onComment)
          parser.onComment(
            CommentTypes[CommentType.Multi & 0xff],
            parser.source.slice(index, parser.index - 2),
            index,
            parser.index
          );
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
