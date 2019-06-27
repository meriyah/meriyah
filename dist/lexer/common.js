import { unicodeLookup } from '../unicode';
import { report } from '../errors';
export function nextCP(parser) {
    parser.column++;
    return (parser.nextCP = parser.source.charCodeAt(++parser.index));
}
export function consumeMultiUnitCodePoint(parser, hi) {
    if ((hi & 0xfc00) !== 55296)
        return false;
    const lo = parser.source.charCodeAt(parser.index + 1);
    if ((lo & 0xfc00) !== 0xdc00)
        return false;
    hi = 65536 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
    if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
        report(parser, 18, fromCodePoint(hi));
    }
    parser.index++;
    parser.column++;
    parser.nextCP = hi;
    return true;
}
export function storeRaw(parser, start) {
    parser.tokenRaw = parser.source.slice(start, parser.index);
}
export function consumeLineFeed(parser, lastIsCR) {
    parser.nextCP = parser.source.charCodeAt(++parser.index);
    parser.flags |= 1;
    if (!lastIsCR) {
        parser.column = 0;
        parser.line++;
    }
}
export function advanceNewline(parser) {
    parser.flags |= 1;
    parser.nextCP = parser.source.charCodeAt(++parser.index);
    parser.column = 0;
    parser.line++;
}
export function isExoticECMAScriptWhitespace(code) {
    return (code === 160 ||
        code === 65279 ||
        code === 133 ||
        code === 5760 ||
        (code >= 8192 && code <= 8203) ||
        code === 8239 ||
        code === 8287 ||
        code === 12288 ||
        code === 65519);
}
export function fromCodePoint(codePoint) {
    return codePoint <= 65535
        ? String.fromCharCode(codePoint)
        : String.fromCharCode(codePoint >>> 10) + String.fromCharCode(codePoint & 0x3ff);
}
export function toHex(code) {
    return code < 65 ? code - 48 : (code - 65 + 10) & 0xf;
}
//# sourceMappingURL=common.js.map