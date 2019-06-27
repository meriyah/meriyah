import { nextCP, fromCodePoint } from './common';
import { parseEscape, handleStringError } from './string';
import { report } from '../errors';
export function scanTemplate(parser, context) {
    const { index: start } = parser;
    let tail = true;
    let ret = '';
    let ch = nextCP(parser);
    while (ch !== 96) {
        if (ch === 36 && parser.source.charCodeAt(parser.index + 1) === 123) {
            nextCP(parser);
            tail = false;
            break;
        }
        else if ((ch & 8) === 8 && ch === 92) {
            ch = nextCP(parser);
            if (ch > 0x7e) {
                ret += fromCodePoint(ch);
            }
            else {
                const code = parseEscape(parser, context | 1024, ch);
                if (code >= 0) {
                    ret += fromCodePoint(code);
                }
                else if (code !== -1 && context & 65536) {
                    ret = undefined;
                    ch = scanBadTemplate(parser, ch);
                    if (ch < 0) {
                        tail = false;
                    }
                    break;
                }
                else {
                    handleStringError(parser, code, 1);
                }
            }
        }
        else {
            if (ch === 13) {
                if (parser.index < parser.end && parser.source.charCodeAt(parser.index) === 10) {
                    ret += fromCodePoint(ch);
                    parser.nextCP = parser.source.charCodeAt(++parser.index);
                }
            }
            if (ch === 10 || ch === 8232 || ch === 8233) {
                parser.column = -1;
                parser.line++;
            }
            ret += fromCodePoint(ch);
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        ch = nextCP(parser);
    }
    nextCP(parser);
    parser.tokenValue = ret;
    if (tail) {
        parser.tokenRaw = parser.source.slice(start + 1, parser.index - 1);
        return 67174409;
    }
    else {
        parser.tokenRaw = parser.source.slice(start + 1, parser.index - 2);
        return 67174408;
    }
}
function scanBadTemplate(parser, ch) {
    while (ch !== 96) {
        switch (ch) {
            case 36: {
                const index = parser.index + 1;
                if (index < parser.end && parser.source.charCodeAt(index) === 123) {
                    parser.index = index;
                    parser.column++;
                    return -ch;
                }
                break;
            }
            case 10:
            case 8232:
            case 8233:
                parser.column = -1;
                parser.line++;
            default:
        }
        if (parser.index >= parser.end)
            report(parser, 15);
        ch = nextCP(parser);
    }
    return ch;
}
export function scanTemplateTail(parser, context) {
    if (parser.index >= parser.end)
        report(parser, 0);
    parser.index--;
    parser.column--;
    return scanTemplate(parser, context);
}
//# sourceMappingURL=template.js.map