import { ParserState } from '../common';
export declare const enum LexerState {
    None = 0,
    NewLine = 1,
    SameLine = 2,
    LastIsCR = 4
}
export declare function nextCP(parser: ParserState): number;
export declare function consumeMultiUnitCodePoint(parser: ParserState, hi: number): boolean;
export declare function consumeLineFeed(parser: ParserState, lastIsCR: boolean): void;
export declare function scanNewLine(parser: ParserState): void;
export declare function isExoticECMAScriptWhitespace(code: number): boolean;
export declare function fromCodePoint(codePoint: number): string;
export declare function toHex(code: number): number;
//# sourceMappingURL=common.d.ts.map