export { scanSingleToken, nextToken, TokenLookup } from './scan';
export {
  skipMultiLineComment,
  skipSingleLineComment,
  skipHashBang,
  skipSingleHTMLComment,
  CommentType
} from './comments';
export {
  advanceChar,
  consumeMultiUnitCodePoint,
  isExoticECMAScriptWhitespace,
  fromCodePoint,
  toHex,
  consumeLineFeed,
  scanNewLine,
  LexerState,
  NumberKind,
  convertTokenType
} from './common';
export { CharTypes, CharFlags, isIdentifierStart, isIdentifierPart } from './charClassifier';
export {
  scanIdentifier,
  scanIdentifierSlowCase,
  scanUnicodeIdentifier,
  scanPrivateIdentifier,
  scanUnicodeEscape
} from './identifier';
export { scanString } from './string';
export { scanNumber } from './numeric';
export { scanTemplate, scanTemplateTail } from './template';
export { scanRegularExpression } from './regexp';
