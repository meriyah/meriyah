export { scanSingleToken, nextToken } from './scan';
export { skipMultiLineComment, skipSingleLineComment, skipHashBang } from './comments';
export { nextCP, consumeMultiUnitCodePoint, isExoticECMAScriptWhitespace, fromCodePoint, toHex, storeRaw, consumeLineFeed, advanceNewline, LexerState } from './common';
export { CharTypes, CharFlags, isIdentifierStart, isIdentifierPart } from './charClassifier';
export { scanIdentifier, scanIdentifierSlowCase, scanUnicodeIdentifier, scanPrivateName, scanUnicodeEscapeValue } from './identifier';
export { scanString } from './string';
export { scanNumber, NumberKind } from './numeric';
export { scanTemplate, scanTemplateTail } from './template';
export { scanRegularExpression } from './regexp';
//# sourceMappingURL=index.d.ts.map