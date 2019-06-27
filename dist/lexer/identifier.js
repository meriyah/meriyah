import { descKeywordTable } from '../token';
import { nextCP, consumeMultiUnitCodePoint, fromCodePoint, toHex } from './';
import { CharTypes, isIdentifierPart } from './charClassifier';
import { report } from '../errors';
import { unicodeLookup } from '../unicode';
export function scanIdentifier(parser, context) {
    const canBeKeyword = CharTypes[parser.nextCP] & 64;
    while ((CharTypes[nextCP(parser)] & 2) !== 0) { }
    parser.tokenValue = parser.source.slice(parser.tokenIndex, parser.index);
    const hasEscape = CharTypes[parser.nextCP] & 131072;
    if ((parser.nextCP & ~0x7f) === 0 && !hasEscape) {
        return descKeywordTable[parser.tokenValue] || 208897;
    }
    return scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword);
}
export function scanUnicodeIdentifier(parser, context) {
    const cookedChar = scanIdentifierUnicodeEscape(parser);
    if (!isIdentifierPart(cookedChar))
        report(parser, 4);
    parser.tokenValue = fromCodePoint(cookedChar);
    return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & 64);
}
export function scanIdentifierSlowCase(parser, context, hasEscape, canBeKeyword) {
    let start = parser.index;
    while (parser.index < parser.end) {
        if (parser.nextCP === 92) {
            parser.tokenValue += parser.source.slice(start, parser.index);
            hasEscape = 1;
            const code = scanIdentifierUnicodeEscape(parser);
            if (!isIdentifierPart(code))
                report(parser, 4);
            canBeKeyword = canBeKeyword && CharTypes[code] & 64;
            parser.tokenValue += fromCodePoint(code);
            start = parser.index;
        }
        else if (isIdentifierPart(parser.nextCP) || consumeMultiUnitCodePoint(parser, parser.nextCP)) {
            nextCP(parser);
        }
        else {
            break;
        }
    }
    if (parser.index <= parser.end) {
        parser.tokenValue += parser.source.slice(start, parser.index);
    }
    const length = parser.tokenValue.length;
    if (canBeKeyword && (length >= 2 && length <= 11)) {
        const keyword = descKeywordTable[parser.tokenValue];
        return keyword === void 0
            ? 208897
            : keyword === 241770 || !hasEscape
                ? keyword
                : context & 1024 && (keyword === 268677192 || keyword === 36969)
                    ? 143479
                    : (keyword & 36864) === 36864
                        ? context & 1024
                            ? 143479
                            : keyword
                        : 143478;
    }
    return 208897;
}
export function scanPrivateName(parser) {
    nextCP(parser);
    if ((CharTypes[parser.nextCP] & 1024) !== 0 ||
        ((CharTypes[parser.nextCP] & 1) === 0 &&
            ((unicodeLookup[(parser.nextCP >>> 5) + 0] >>> parser.nextCP) & 31 & 1) === 0)) {
        report(parser, 102);
    }
    return 131;
}
export function scanIdentifierUnicodeEscape(parser) {
    if (parser.index + 5 < parser.end && parser.source.charCodeAt(parser.index + 1) === 117) {
        parser.nextCP = parser.source.charCodeAt((parser.index += 2));
        return scanUnicodeEscapeValue(parser);
    }
    report(parser, 4);
}
export function scanUnicodeEscapeValue(parser) {
    let codePoint = 0;
    if (parser.nextCP === 123) {
        while (CharTypes[nextCP(parser)] & 4096) {
            codePoint = (codePoint << 4) | toHex(parser.nextCP);
            if (codePoint > 1114111) {
                report(parser, 114);
            }
        }
        if (codePoint < 1 || parser.nextCP !== 125) {
            report(parser, 6);
        }
        nextCP(parser);
        return codePoint;
    }
    if ((CharTypes[parser.nextCP] & 4096) === 0)
        report(parser, 6);
    const c2 = parser.source.charCodeAt(parser.index + 1);
    if ((CharTypes[c2] & 4096) === 0)
        report(parser, 0);
    const c3 = parser.source.charCodeAt(parser.index + 2);
    if ((CharTypes[c3] & 4096) === 0)
        report(parser, 0);
    const c4 = parser.source.charCodeAt(parser.index + 3);
    if ((CharTypes[c4] & 4096) === 0)
        report(parser, 0);
    codePoint = (toHex(parser.nextCP) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);
    parser.nextCP = parser.source.charCodeAt((parser.index += 4));
    return codePoint;
}
//# sourceMappingURL=identifier.js.map