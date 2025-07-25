import { Chars } from '../chars';
import { Context, type Location } from '../common';
import { Errors } from '../errors';
import type * as ESTree from '../estree';
import { type Parser } from '../parser/parser';
import { CharFlags, CharTypes } from './charClassifier';
import { advanceChar, consumeLineFeed, LexerState, scanNewLine } from './common';

export const enum CommentType {
  Single,
  Multi,
  HTMLOpen,
  HTMLClose,
  HashBang,
}

const CommentTypes: ESTree.CommentType[] = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];

/**
 * Skips hashbang (stage 3)
 *
 * @param parser  Parser object
 */
export function skipHashBang(parser: Parser): void {
  // HashbangComment ::
  //   #!  SingleLineCommentChars_opt
  const { source } = parser;
  if (parser.currentChar === Chars.Hash && source.charCodeAt(parser.index + 1) === Chars.Exclamation) {
    advanceChar(parser);
    advanceChar(parser);
    skipSingleLineComment(parser, source, LexerState.None, CommentType.HashBang, parser.tokenStart);
  }
}

export function skipSingleHTMLComment(
  parser: Parser,
  source: string,
  state: LexerState,
  context: Context,
  type: CommentType,
  start: Location,
): LexerState {
  if (context & Context.Module) parser.report(Errors.Unexpected);
  return skipSingleLineComment(parser, source, state, type, start);
}

/**
 * Skips single line comment
 *
 * @param parser  Parser object
 * @param state  Lexer state
 */
export function skipSingleLineComment(
  parser: Parser,
  source: string,
  state: LexerState,
  type: CommentType,
  start: Location,
): LexerState {
  const { index } = parser;
  parser.tokenIndex = parser.index;
  parser.tokenLine = parser.line;
  parser.tokenColumn = parser.column;
  while (parser.index < parser.end) {
    if (CharTypes[parser.currentChar] & CharFlags.LineTerminator) {
      const isCR = parser.currentChar === Chars.CarriageReturn;
      scanNewLine(parser);
      if (isCR && parser.index < parser.end && parser.currentChar === Chars.LineFeed)
        parser.currentChar = source.charCodeAt(++parser.index);
      break;
    } else if ((parser.currentChar ^ Chars.LineSeparator) <= 1) {
      scanNewLine(parser);
      break;
    }
    advanceChar(parser);
    parser.tokenIndex = parser.index;
    parser.tokenLine = parser.line;
    parser.tokenColumn = parser.column;
  }
  if (parser.options.onComment) {
    const loc = {
      start: {
        line: start.line,
        column: start.column,
      },
      end: {
        line: parser.tokenLine,
        column: parser.tokenColumn,
      },
    };
    // For Single, start before "//",
    // For HTMLOpen, start before "<!--",
    // For HTMLClose, start before "\n-->"
    parser.options.onComment(
      CommentTypes[type & 0xff],
      source.slice(index, parser.tokenIndex),
      start.index,
      parser.tokenIndex,
      loc,
    );
  }
  return state | LexerState.NewLine;
}

/**
 * Skips multiline comment
 *
 * @param parser Parser object
 * @param state Lexer state
 */
export function skipMultiLineComment(parser: Parser, source: string, state: LexerState): LexerState | void {
  const { index } = parser;
  while (parser.index < parser.end) {
    if (parser.currentChar < 0x2b) {
      let skippedOneAsterisk = false;
      while (parser.currentChar === Chars.Asterisk) {
        if (!skippedOneAsterisk) {
          state &= ~LexerState.LastIsCR;
          skippedOneAsterisk = true;
        }
        if (advanceChar(parser) === Chars.Slash) {
          advanceChar(parser);
          if (parser.options.onComment) {
            const loc = {
              start: {
                line: parser.tokenLine,
                column: parser.tokenColumn,
              },
              end: {
                line: parser.line,
                column: parser.column,
              },
            };
            parser.options.onComment(
              CommentTypes[CommentType.Multi & 0xff],
              source.slice(index, parser.index - 2),
              index - 2, // start before '/*'
              parser.index, // end after '*/'
              loc,
            );
          }
          parser.tokenIndex = parser.index;
          parser.tokenLine = parser.line;
          parser.tokenColumn = parser.column;
          return state;
        }
      }

      if (skippedOneAsterisk) {
        continue;
      }

      if (CharTypes[parser.currentChar] & CharFlags.LineTerminator) {
        if (parser.currentChar === Chars.CarriageReturn) {
          state |= LexerState.NewLine | LexerState.LastIsCR;
          scanNewLine(parser);
        } else {
          consumeLineFeed(parser, state);
          state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
        }
      } else {
        advanceChar(parser);
      }
    } else if ((parser.currentChar ^ Chars.LineSeparator) <= 1) {
      state = (state & ~LexerState.LastIsCR) | LexerState.NewLine;
      scanNewLine(parser);
    } else {
      state &= ~LexerState.LastIsCR;
      advanceChar(parser);
    }
  }

  parser.report(Errors.UnterminatedComment);
}
