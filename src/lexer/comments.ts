import { nextCodePoint, CharTypes, CharFlags } from './';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Flags } from '../common';
import { report, Errors } from '../errors';

export function skipHashBang(parser: ParserState): void {
  let index = parser.index;
  if (parser.index === parser.source.length) return;
  if (parser.currentCodePoint === Chars.ByteOrderMark) {
    parser.currentCodePoint = parser.source.charCodeAt(index++);
    parser.index = index;
  }

  if (index < parser.source.length && parser.source.charCodeAt(index) === Chars.Hash) {
    index++;
    if (index < parser.source.length && parser.source.charCodeAt(index) === Chars.Exclamation) {
      parser.index = index + 1;
      parser.currentCodePoint = parser.source.charCodeAt(parser.index);
      skipSingleLineComment(parser);
    } else {
      report(parser, Errors.UnterminatedComment);
    }
  }
}

export function skipSingleLineComment(state: ParserState): Token {
  while (state.index < state.length) {
    if (
      CharTypes[state.currentCodePoint] & CharFlags.LineTerminator ||
      (state.currentCodePoint ^ Chars.LineSeparator) <= 1
    ) {
      break;
    }
    nextCodePoint(state);
  }
  return Token.WhiteSpace;
}

export function skipMultiLineComment(state: ParserState): any {
  while (state.index < state.length) {
    while (CharTypes[state.currentCodePoint] & CharFlags.Asterisk) {
      if (nextCodePoint(state) === Chars.Slash) {
        nextCodePoint(state);
        return Token.WhiteSpace;
      }
    }

    // ES 2020 11.3 Line Terminators
    if (
      CharTypes[state.currentCodePoint] & CharFlags.LineTerminator ||
      (state.currentCodePoint ^ Chars.LineSeparator) <= 1
    ) {
      if (
        CharTypes[state.currentCodePoint] & CharFlags.CarriageReturn &&
        CharTypes[state.source.charCodeAt(state.index + 1)] & CharFlags.LineFeed
      ) {
        state.index++;
      }
      state.column = 0;
      state.currentCodePoint = state.source.charCodeAt(++state.index);
      state.line++;
      state.flags |= Flags.NewLine;
    } else {
      nextCodePoint(state);
    }
  }

  report(state, Errors.UnterminatedComment);
}
