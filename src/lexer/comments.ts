import { nextCodePoint, CharTypes, CharFlags, ScannerState, Seek } from './';
import { Chars } from '../chars';
import { Token } from '../token';
import { ParserState, Flags } from '../common';
import { report, Errors } from '../errors';

/**
 * Skips BOM and hasbang (stage 3)
 *
 * @param parser  Parser object
 */
export function skipHashBang(parser: ParserState): void {
  let index = parser.index;
  if (index === parser.end) return;
  if (parser.currentCodePoint === Chars.ByteOrderMark) {
    parser.currentCodePoint = parser.source.charCodeAt(++index);
    parser.index = index;
  }

  if (index < parser.end && parser.source.charCodeAt(index) === Chars.Hash) {
    index++;
    if (index < parser.end && parser.source.charCodeAt(index) === Chars.Exclamation) {
      parser.index = index + 1;
      parser.currentCodePoint = parser.source.charCodeAt(parser.index);
      skipSingleLineComment(parser, ScannerState.None);
    } else {
      report(parser, Errors.IllegalCaracter, '#');
    }
  }
}

/**
 * Skips single line comment
 *
 * @param parser  Parser object
 */
export function skipSingleLineComment(parser: ParserState, state: ScannerState): ScannerState {
  while (parser.index < parser.end) {
    if (
      CharTypes[parser.currentCodePoint] & CharFlags.LineTerminator ||
      (parser.currentCodePoint ^ Chars.LineSeparator) <= 1
    ) {
      parser.flags |= Flags.NewLine;
      parser.column = 0;
      parser.line++;
      parser.currentCodePoint = parser.source.charCodeAt(++parser.index);
      return state;
    }
    nextCodePoint(parser);
  }
  return state;
}

/**
 * Skips multiline comment
 *
 * @param parser  Parser object
 */
export function skipMultiLineComment(parser: ParserState, state: ScannerState): any {
  while (parser.index < parser.end) {
    while (CharTypes[parser.currentCodePoint] & CharFlags.Asterisk) {
      if (nextCodePoint(parser) === Chars.Slash) {
        nextCodePoint(parser);
        return state;
      }
    }

    // ES 2020 11.3 Line Terminators
    if (CharTypes[parser.currentCodePoint] & CharFlags.LineTerminator) {
      if (CharTypes[parser.currentCodePoint] & CharFlags.CarriageReturn) {
        state |= ScannerState.NewLine | ScannerState.LastIsCR;
        parser.column = 0;
        parser.line++;
      } else {
        if (state & ScannerState.LastIsCR) {
          parser.column = 0;
          parser.line++;
        }
        state = (state & ~ScannerState.LastIsCR) | ScannerState.NewLine;
      }
      parser.currentCodePoint = parser.source.charCodeAt(++parser.index);
      parser.flags |= Flags.NewLine;
    } else if ((parser.currentCodePoint ^ Chars.LineSeparator) <= 1) {
      state = (state & ~ScannerState.LastIsCR) | ScannerState.NewLine;
      parser.column = 0;
      parser.currentCodePoint = parser.source.charCodeAt(++parser.index);
      parser.line++;
      parser.flags |= Flags.NewLine;
    } else {
      nextCodePoint(parser);
    }
  }

  report(parser, Errors.UnterminatedComment);
}
