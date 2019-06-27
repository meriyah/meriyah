import { nextCP, isIdentifierPart } from './';
import { report } from '../errors';
export function scanRegularExpression(parser, context) {
    const bodyStart = parser.index;
    let preparseState = 0;
    loop: while (true) {
        const ch = parser.nextCP;
        nextCP(parser);
        if (preparseState & 1) {
            preparseState &= ~1;
        }
        else {
            switch (ch) {
                case 47:
                    if (!preparseState)
                        break loop;
                    else
                        break;
                case 92:
                    preparseState |= 1;
                    break;
                case 91:
                    preparseState |= 2;
                    break;
                case 93:
                    preparseState &= 1;
                    break;
                case 13:
                case 10:
                case 8232:
                case 8233:
                    report(parser, 33);
                default:
            }
        }
        if (parser.index >= parser.source.length) {
            return report(parser, 33);
        }
    }
    const bodyEnd = parser.index - 1;
    let mask = 0;
    const { index: flagStart } = parser;
    loop: while (isIdentifierPart(parser.nextCP)) {
        switch (parser.nextCP) {
            case 103:
                if (mask & 2)
                    report(parser, 35, 'g');
                mask |= 2;
                break;
            case 105:
                if (mask & 1)
                    report(parser, 35, 'i');
                mask |= 1;
                break;
            case 109:
                if (mask & 4)
                    report(parser, 35, 'm');
                mask |= 4;
                break;
            case 117:
                if (mask & 16)
                    report(parser, 35, 'g');
                mask |= 16;
                break;
            case 121:
                if (mask & 8)
                    report(parser, 35, 'y');
                mask |= 8;
                break;
            case 115:
                if (mask & 12)
                    report(parser, 35, 's');
                mask |= 12;
                break;
            default:
                report(parser, 34);
        }
        nextCP(parser);
    }
    const flags = parser.source.slice(flagStart, parser.index);
    const pattern = parser.source.slice(bodyStart, bodyEnd);
    parser.tokenRegExp = { pattern, flags };
    if (context & 512)
        parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
    parser.tokenValue = validate(parser, pattern, flags);
    return 65540;
}
function validate(parser, pattern, flags) {
    try {
        RegExp(pattern);
    }
    catch (e) {
        report(parser, 33);
    }
    try {
        return new RegExp(pattern, flags);
    }
    catch (e) {
        return null;
    }
}
//# sourceMappingURL=regexp.js.map