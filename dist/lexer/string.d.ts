import { ParserState, Context } from '../common';
export declare const enum Escape {
    Empty = -1,
    StrictOctal = -2,
    EightOrNine = -3,
    InvalidHex = -4,
    OutOfRange = -5
}
export declare function scanString(parser: ParserState, context: Context): any;
export declare function parseEscape(parser: ParserState, context: Context, first: number): number;
export declare function handleStringError(state: ParserState, code: Escape): void;
export declare function nextUnicodeChar(parser: ParserState): number;
//# sourceMappingURL=string.d.ts.map