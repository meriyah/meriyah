import { skipSingleLineComment, skipMultiLineComment } from './';
import { CharTypes } from './charClassifier';
import { report } from '../errors';
import { isIDStart } from '../unicode';
import { nextCP, consumeMultiUnitCodePoint, isExoticECMAScriptWhitespace, scanRegularExpression, scanTemplate, scanNumber, scanString, scanIdentifier, scanUnicodeIdentifier, scanIdentifierSlowCase, scanPrivateName, fromCodePoint, consumeLineFeed, advanceNewline } from './';
export const TokenLookup = [
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    124,
    135,
    124,
    124,
    130,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    129,
    124,
    16842797,
    134283267,
    131,
    208897,
    8456756,
    8455492,
    134283267,
    67174411,
    1073741840,
    8456755,
    25233711,
    -1073741806,
    25233712,
    67108877,
    8456757,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    134283266,
    21,
    -2146435055,
    8455999,
    -2143289315,
    8456000,
    22,
    133,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    69271571,
    136,
    20,
    8455238,
    208897,
    132,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    208897,
    2162700,
    8454981,
    -2146435057,
    16842798,
    129
];
export function nextToken(parser, context) {
    parser.flags = (parser.flags | 1) ^ 1;
    parser.startIndex = parser.index;
    parser.startColumn = parser.column;
    parser.startLine = parser.line;
    parser.token = scanSingleToken(parser, context, 0);
}
export function scanSingleToken(parser, context, state) {
    const isStartOfLine = parser.index === 0;
    while (parser.index < parser.end) {
        parser.tokenIndex = parser.index;
        parser.colPos = parser.column;
        parser.linePos = parser.line;
        const first = parser.nextCP;
        if (first <= 0x7e) {
            const token = TokenLookup[first];
            switch (token) {
                case 67174411:
                case 1073741840:
                case 2162700:
                case -2146435057:
                case 69271571:
                case 20:
                case 22:
                case 21:
                case -2146435055:
                case -1073741806:
                case 16842798:
                case 133:
                case 129:
                    nextCP(parser);
                    return token;
                case 124:
                    nextCP(parser);
                    break;
                case 130:
                    state |= 1 | 4;
                    advanceNewline(parser);
                    break;
                case 135:
                    consumeLineFeed(parser, (state & 4) !== 0);
                    state = (state | 4 | 1) ^ 4;
                    break;
                case 208897:
                    return scanIdentifier(parser, context);
                case 134283266:
                    return scanNumber(parser, context, 0);
                case 134283267:
                    return scanString(parser, context);
                case 132:
                    return scanTemplate(parser, context);
                case 136:
                    return scanUnicodeIdentifier(parser, context);
                case 131:
                    return scanPrivateName(parser);
                case 16842797:
                    if (nextCP(parser) !== 61) {
                        return 16842797;
                    }
                    if (nextCP(parser) !== 61) {
                        return 8455740;
                    }
                    nextCP(parser);
                    return 8455738;
                case 8456756:
                    if (nextCP(parser) !== 61)
                        return 8456756;
                    nextCP(parser);
                    return 4194342;
                case -2143289315: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return -2143289315;
                    const next = parser.nextCP;
                    if (next === 61) {
                        if (nextCP(parser) === 61) {
                            nextCP(parser);
                            return 8455737;
                        }
                        else {
                            return 8455739;
                        }
                    }
                    else if (next === 62) {
                        nextCP(parser);
                        return 10;
                    }
                    return -2143289315;
                }
                case 8456755: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 8456755;
                    const next = parser.nextCP;
                    if (next === 61) {
                        nextCP(parser);
                        return 4194340;
                    }
                    if (next !== 42)
                        return 8456755;
                    nextCP(parser);
                    if (parser.nextCP !== 61)
                        return 8457014;
                    nextCP(parser);
                    return 4194337;
                }
                case 8455238:
                    if (nextCP(parser) !== 61)
                        return 8455238;
                    nextCP(parser);
                    return 4194343;
                case 25233711: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 25233711;
                    if (parser.nextCP === 43) {
                        nextCP(parser);
                        return 33619995;
                    }
                    if (parser.nextCP === 61) {
                        nextCP(parser);
                        return 4194338;
                    }
                    return 25233711;
                }
                case 25233712: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 25233712;
                    const next = parser.nextCP;
                    if (next === 45) {
                        nextCP(parser);
                        if ((context & 2048) === 0 &&
                            (state & 1 || isStartOfLine) &&
                            parser.nextCP === 62) {
                            if ((context & 256) === 0)
                                report(parser, 122);
                            state = skipSingleLineComment(parser, state);
                            continue;
                        }
                        return 33619996;
                    }
                    if (next === 61) {
                        nextCP(parser);
                        return 4194339;
                    }
                    return 25233712;
                }
                case 8456757: {
                    nextCP(parser);
                    if (parser.index < parser.end) {
                        const ch = parser.nextCP;
                        if (ch === 47) {
                            nextCP(parser);
                            state = skipSingleLineComment(parser, state);
                            continue;
                        }
                        else if (ch === 42) {
                            nextCP(parser);
                            state = skipMultiLineComment(parser, state);
                            continue;
                        }
                        else if (context & 32768) {
                            return scanRegularExpression(parser, context);
                        }
                        else if (ch === 61) {
                            nextCP(parser);
                            return 4259877;
                        }
                    }
                    return 8456757;
                }
                case 8455999:
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 8455999;
                    switch (parser.nextCP) {
                        case 60:
                            if (nextCP(parser) === 61) {
                                nextCP(parser);
                                return 4194334;
                            }
                            else {
                                return 8456257;
                            }
                        case 61:
                            nextCP(parser);
                            return 8455997;
                        case 33:
                            if ((context & 2048) === 0 &&
                                parser.source.charCodeAt(parser.index + 1) === 45 &&
                                parser.source.charCodeAt(parser.index + 2) === 45) {
                                state = skipSingleLineComment(parser, state);
                                continue;
                            }
                        default:
                            return 8455999;
                    }
                case 8454981: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 8454981;
                    const next = parser.nextCP;
                    if (next === 124) {
                        nextCP(parser);
                        return 8978744;
                    }
                    else if (next === 61) {
                        nextCP(parser);
                        return 4194344;
                    }
                    return 8454981;
                }
                case 8456000: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 8456000;
                    const next = parser.nextCP;
                    if (next === 61) {
                        nextCP(parser);
                        return 8455998;
                    }
                    if (next !== 62)
                        return 8456000;
                    nextCP(parser);
                    if (parser.index < parser.end) {
                        const next = parser.nextCP;
                        if (next === 62) {
                            if (nextCP(parser) === 61) {
                                nextCP(parser);
                                return 4194336;
                            }
                            else {
                                return 8456259;
                            }
                        }
                        else if (next === 61) {
                            nextCP(parser);
                            return 4194335;
                        }
                    }
                    return 8456258;
                }
                case 8455492: {
                    nextCP(parser);
                    if (parser.index >= parser.end)
                        return 8455492;
                    const next = parser.nextCP;
                    if (next === 38) {
                        nextCP(parser);
                        return 8978999;
                    }
                    if (next === 61) {
                        nextCP(parser);
                        return 4194345;
                    }
                    return 8455492;
                }
                case 67108877:
                    nextCP(parser);
                    if ((CharTypes[parser.nextCP] & 1024) !== 0)
                        return scanNumber(parser, context, 1);
                    if (parser.nextCP === 46) {
                        if (nextCP(parser) === 46) {
                            nextCP(parser);
                            return 14;
                        }
                    }
                    return 67108877;
                default:
            }
        }
        else {
            if ((first ^ 8232) <= 1) {
                state = (state | 4 | 1) ^ 4;
                advanceNewline(parser);
                continue;
            }
            if (isIDStart(first) || consumeMultiUnitCodePoint(parser, first)) {
                parser.tokenValue = '';
                return scanIdentifierSlowCase(parser, context, 0, 0);
            }
            if (isExoticECMAScriptWhitespace(first)) {
                nextCP(parser);
                continue;
            }
            report(parser, 18, fromCodePoint(first));
        }
    }
    return 1048576;
}
//# sourceMappingURL=scan.js.map