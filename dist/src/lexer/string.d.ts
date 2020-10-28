import { ParserState, Context } from '../common';
import { Token } from '../token';
export declare const enum Escape {
    Empty = -1,
    StrictOctal = -2,
    EightOrNine = -3,
    InvalidHex = -4,
    OutOfRange = -5
}
export declare function scanString(parser: ParserState, context: Context, quote: number): Token;
export declare function parseEscape(parser: ParserState, context: Context, first: number): number;
export declare function handleStringError(state: ParserState, code: Escape, isTemplate: 0 | 1): void;
//# sourceMappingURL=string.d.ts.map