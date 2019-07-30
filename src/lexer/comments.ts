import { advanceChar, CharTypes, CharFlags, LexerState, scanNewLine, consumeLineFeed } from './';
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
  if (parser.currentChar === Chars.Hash && parser.source.charCodeAt(parser.index + 1) === Chars.Exclamation) {
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
    if (CharTypes[parser.currentChar] & CharFlags.LineTerminator || (parser.currentChar ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      scanNewLine(parser);
      return state;
    }
    advanceChar(parser);
  }
  if (parser.onComment)
    parser.onComment(CommentTypes[type & 0xff], parser.source.slice(index, parser.index), index, parser.index);
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
    while (parser.currentChar === Chars.Asterisk) {
      if (advanceChar(parser) === Chars.Slash) {
        advanceChar(parser);
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

    if (parser.currentChar === Chars.CarriageReturn) {
      state |= LexerState.NewLine | LexerState.LastIsCR;
      scanNewLine(parser);
    } else if (parser.currentChar === Chars.LineFeed) {
      consumeLineFeed(parser, (state & LexerState.LastIsCR) !== 0);
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
    } else if ((parser.currentChar ^ Chars.LineSeparator) <= 1) {
      state = (state | LexerState.LastIsCR | LexerState.NewLine) ^ LexerState.LastIsCR;
      scanNewLine(parser);
    } else {
      advanceChar(parser);
    }
  }

  report(parser, Errors.UnterminatedComment);
}
