import { nextCP, CharTypes, advanceNewline, consumeLineFeed } from './';
import { report } from '../errors';
export function skipHashBang(parser) {
    let index = parser.index;
    if (index === parser.end)
        return;
    if (parser.nextCP === 65519) {
        parser.index = ++index;
        parser.nextCP = parser.source.charCodeAt(index);
    }
    if (index < parser.end && parser.nextCP === 35) {
        index++;
        if (index < parser.end && parser.source.charCodeAt(index) === 33) {
            parser.index = index + 1;
            parser.nextCP = parser.source.charCodeAt(parser.index);
            skipSingleLineComment(parser, 0);
        }
        else {
            report(parser, 18, '#');
        }
    }
}
export function skipSingleLineComment(parser, state) {
    while (parser.index < parser.end) {
        if (CharTypes[parser.nextCP] & 512 || (parser.nextCP ^ 8232) <= 1) {
            state = (state | 4 | 1) ^ 4;
            advanceNewline(parser);
            return state;
        }
        nextCP(parser);
    }
    return state;
}
export function skipMultiLineComment(parser, state) {
    while (parser.index < parser.end) {
        while (parser.nextCP === 42) {
            if (nextCP(parser) === 47) {
                nextCP(parser);
                return state;
            }
        }
        if (parser.nextCP === 13) {
            state |= 1 | 4;
            advanceNewline(parser);
        }
        else if (parser.nextCP === 10) {
            consumeLineFeed(parser, (state & 4) !== 0);
            state = (state | 4 | 1) ^ 4;
        }
        else if ((parser.nextCP ^ 8232) <= 1) {
            state = (state | 4 | 1) ^ 4;
            advanceNewline(parser);
        }
        else {
            nextCP(parser);
        }
    }
    report(parser, 16);
}
//# sourceMappingURL=comments.js.map