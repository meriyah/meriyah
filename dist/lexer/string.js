import { report } from '../errors';
import { toHex, nextCP, fromCodePoint, CharTypes, storeRaw } from './';
export function scanString(parser, context) {
    const quote = parser.nextCP;
    const { index: start } = parser;
    let ret = '';
    let ch = nextCP(parser);
    let marker = parser.index;
    while ((CharTypes[ch] & 512) === 0) {
        if (ch === quote) {
            ret += parser.source.slice(marker, parser.index);
            nextCP(parser);
            if (context & 512)
                storeRaw(parser, start);
            parser.tokenValue = ret;
            return 134283267;
        }
        if ((ch & 8) === 8 && ch === 92) {
            ret += parser.source.slice(marker, parser.index);
            const ch = nextCP(parser);
            if (ch > 0x7e) {
                ret += fromCodePoint(ch);
            }
            else {
                const code = parseEscape(parser, context, ch);
                if (code >= 0)
                    ret += fromCodePoint(code);
                else
                    handleStringError(parser, code, 0);
            }
            marker = parser.index + 1;
        }
        if (parser.index >= parser.end)
            report(parser, 14);
        ch = nextCP(parser);
    }
    report(parser, 14);
}
export function parseEscape(parser, context, first) {
    switch (first) {
        case 98:
            return 8;
        case 102:
            return 12;
        case 114:
            return 13;
        case 110:
            return 10;
        case 116:
            return 9;
        case 118:
            return 11;
        case 13: {
            if (parser.index < parser.end) {
                if (parser.nextCP === 10) {
                    parser.index = parser.index + 1;
                    parser.nextCP = parser.source.charCodeAt(parser.index);
                }
            }
        }
        case 10:
        case 8232:
        case 8233:
            parser.column = -1;
            parser.line++;
            return -1;
        case 48:
        case 49:
        case 50:
        case 51: {
            let code = first - 48;
            let index = parser.index + 1;
            let column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if ((CharTypes[next] & 2048) === 0) {
                    if ((code !== 0 || CharTypes[next] & 262144) && context & 1024)
                        return -2;
                }
                else if (context & 1024) {
                    return -2;
                }
                else {
                    parser.nextCP = next;
                    code = (code << 3) | (next - 48);
                    index++;
                    column++;
                    if (index < parser.end) {
                        const next = parser.source.charCodeAt(index);
                        if (CharTypes[next] & 2048) {
                            parser.nextCP = next;
                            code = (code << 3) | (next - 48);
                            index++;
                            column++;
                        }
                    }
                    parser.flags |= 64;
                    parser.index = index - 1;
                    parser.column = column - 1;
                }
            }
            return code;
        }
        case 52:
        case 53:
        case 54:
        case 55: {
            if (context & 1024)
                return -2;
            let code = first - 48;
            const index = parser.index + 1;
            const column = parser.column + 1;
            if (index < parser.end) {
                const next = parser.source.charCodeAt(index);
                if (CharTypes[next] & 2048) {
                    code = (code << 3) | (next - 48);
                    parser.nextCP = next;
                    parser.index = index;
                    parser.column = column;
                }
            }
            parser.flags |= 64;
            return code;
        }
        case 56:
        case 57:
            return -3;
        case 120: {
            const ch1 = nextCP(parser);
            if ((CharTypes[ch1] & 4096) === 0)
                return -4;
            const hi = toHex(ch1);
            const ch2 = nextCP(parser);
            if ((CharTypes[ch2] & 4096) === 0)
                return -4;
            const lo = toHex(ch2);
            return (hi << 4) | lo;
        }
        case 117: {
            const ch = nextCP(parser);
            if (parser.nextCP === 123) {
                let code = 0;
                while ((CharTypes[nextCP(parser)] & 4096) !== 0) {
                    code = (code << 4) | toHex(parser.nextCP);
                    if (code > 1114111)
                        return -5;
                }
                if (parser.nextCP < 1 || parser.nextCP !== 125) {
                    return -4;
                }
                return code;
            }
            else {
                if ((CharTypes[ch] & 4096) === 0)
                    return -4;
                const c2 = parser.source.charCodeAt(parser.index + 1);
                if ((CharTypes[c2] & 4096) === 0)
                    return -4;
                const c3 = parser.source.charCodeAt(parser.index + 2);
                if ((CharTypes[c3] & 4096) === 0)
                    return -4;
                const c4 = parser.source.charCodeAt(parser.index + 3);
                if ((CharTypes[c4] & 4096) === 0)
                    return -4;
                parser.index += 3;
                parser.column += 3;
                return (toHex(ch) << 12) | (toHex(c2) << 8) | (toHex(c3) << 4) | toHex(c4);
            }
        }
        default:
            return nextUnicodeChar(parser);
    }
}
export function handleStringError(state, code, isTemplate) {
    switch (code) {
        case -1:
            return;
        case -2:
            report(state, isTemplate ? 2 : 1);
        case -3:
            report(state, 13);
        case -4:
            report(state, 6);
        case -5:
            report(state, 114);
        default:
    }
}
export function nextUnicodeChar(parser) {
    let { index } = parser;
    const hi = parser.source.charCodeAt(index++);
    if (hi < 0xd800 || hi > 0xdbff)
        return hi;
    if (index === parser.source.length)
        return hi;
    const lo = parser.source.charCodeAt(index);
    if (lo < 0xdc00 || lo > 0xdfff)
        return hi;
    return ((hi & 0x3ff) << 10) | (lo & 0x3ff) | 0x10000;
}
//# sourceMappingURL=string.js.map