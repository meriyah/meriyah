import { nextCP, toHex, CharTypes, isIdentifierStart, storeRaw } from './';
import { report } from '../errors';
export function scanNumber(parser, context, isFloat) {
    let kind = 16;
    let value = 0;
    if (isFloat) {
        while (CharTypes[nextCP(parser)] & 1024) { }
    }
    else {
        if (parser.nextCP === 48) {
            nextCP(parser);
            if ((parser.nextCP | 32) === 120) {
                kind = 8;
                let digits = 0;
                while (CharTypes[nextCP(parser)] & 4096) {
                    value = value * 0x10 + toHex(parser.nextCP);
                    digits++;
                }
                if (digits < 1)
                    report(parser, 19);
            }
            else if ((parser.nextCP | 32) === 111) {
                kind = 4;
                let digits = 0;
                while (CharTypes[nextCP(parser)] & 2048) {
                    value = value * 8 + (parser.nextCP - 48);
                    digits++;
                }
                if (digits < 1)
                    report(parser, 9, `${8}`);
            }
            else if ((parser.nextCP | 32) === 98) {
                kind = 2;
                let digits = 0;
                while (CharTypes[nextCP(parser)] & 8192) {
                    value = value * 2 + (parser.nextCP - 48);
                    digits++;
                }
                if (digits < 1)
                    report(parser, 9, `${2}`);
            }
            else if (CharTypes[parser.nextCP] & 2048) {
                if (context & 1024)
                    report(parser, 1);
                kind = 1;
                do {
                    if (CharTypes[parser.nextCP] & 262144) {
                        kind = 32;
                        isFloat = 0;
                        break;
                    }
                    value = value * 8 + (parser.nextCP - 48);
                } while (CharTypes[nextCP(parser)] & 1024);
            }
            else if (CharTypes[parser.nextCP] & 262144) {
                if (context & 1024)
                    report(parser, 1);
                else
                    parser.flags = 64;
                kind = 32;
            }
        }
        if (kind & (16 | 32)) {
            if (isFloat) {
                let digit = 9;
                while (digit >= 0 && CharTypes[nextCP(parser)] & 1024) {
                    value = 10 * value + (parser.nextCP - 48);
                    --digit;
                }
                if (digit >= 0 && !isIdentifierStart(parser.nextCP) && parser.nextCP !== 46) {
                    if (context & 512)
                        parser.tokenRaw = parser.source.slice(parser.tokenIndex, parser.index);
                    parser.tokenValue = value;
                    return 134283266;
                }
            }
            while (CharTypes[parser.nextCP] & 1024) {
                nextCP(parser);
            }
            if (parser.nextCP === 46) {
                isFloat = 1;
                nextCP(parser);
                while (CharTypes[parser.nextCP] & 1024) {
                    nextCP(parser);
                }
            }
        }
    }
    let isBigInt = 0;
    if (parser.nextCP === 110 &&
        (kind & (16 | 2 | 4 | 8)) !== 0) {
        if (isFloat)
            report(parser, 11);
        isBigInt = 1;
        nextCP(parser);
    }
    else if ((parser.nextCP | 32) === 101) {
        if ((kind & (16 | 32)) === 0) {
            report(parser, 10);
        }
        nextCP(parser);
        if (CharTypes[parser.nextCP] & 32768) {
            nextCP(parser);
        }
        let exponentDigits = 0;
        while (CharTypes[parser.nextCP] & 1024) {
            nextCP(parser);
            exponentDigits++;
        }
        if (exponentDigits < 1) {
            report(parser, 10);
        }
    }
    if ((parser.index < parser.end && CharTypes[parser.nextCP] & 1024) || isIdentifierStart(parser.nextCP)) {
        report(parser, 12);
    }
    if (kind & (1 | 2 | 8 | 4)) {
        parser.tokenValue = value;
    }
    else {
        const raw = parser.source.slice(parser.tokenIndex, parser.index);
        parser.tokenValue =
            kind & 32 ? parseFloat(raw) : isBigInt ? parseInt(raw, 0xa) : +raw;
    }
    if (isBigInt) {
        storeRaw(parser, parser.tokenIndex);
        return 122;
    }
    if (context & 512)
        storeRaw(parser, parser.tokenIndex);
    return 134283266;
}
//# sourceMappingURL=numeric.js.map