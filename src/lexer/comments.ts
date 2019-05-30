import { nextCodePoint, CharTypes, CharFlags } from './';
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
      skipSingleLineComment(parser);
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
export function skipSingleLineComment(parser: ParserState): Token {
  while (parser.index < parser.end) {
    if (
      CharTypes[parser.currentCodePoint] & CharFlags.LineTerminator ||
      (parser.currentCodePoint ^ Chars.LineSeparator) <= 1
    ) {
      break;
    }
    nextCodePoint(parser);
  }
  return Token.WhiteSpace;
}

/**
 * Skips multiline comment
 *
 * @param parser  Parser object
 */
export function skipMultiLineComment(parser: ParserState): any {
  while (parser.index < parser.end) {
    while (CharTypes[parser.currentCodePoint] & CharFlags.Asterisk) {
      if (nextCodePoint(parser) === Chars.Slash) {
        nextCodePoint(parser);
        return Token.WhiteSpace;
      }
    }

    // ES 2020 11.3 Line Terminators
    if (
      CharTypes[parser.currentCodePoint] & CharFlags.LineTerminator ||
      (parser.currentCodePoint ^ Chars.LineSeparator) <= 1
    ) {
      if (
        CharTypes[parser.currentCodePoint] & CharFlags.CarriageReturn &&
        CharTypes[parser.source.charCodeAt(parser.index + 1)] & CharFlags.LineFeed
      ) {
        parser.index++;
      }
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
