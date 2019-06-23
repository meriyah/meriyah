import { ParserState } from '../common';
export declare const enum ScannerState {
    None = 0,
    NewLine = 1,
    SameLine = 2,
    LastIsCR = 4
}
export declare function nextCodePoint(parser: ParserState): number;
export declare function consumeMultiUnitCodePoint(parser: ParserState, hi: number): boolean;
export declare function consumeLineFeed(parser: ParserState, lastIsCR: boolean): void;
export declare function advanceNewline(parser: ParserState): void;
export declare function isExoticECMAScriptWhitespace(code: number): boolean;
export declare function fromCodePoint(codePoint: number): string;
export declare function toHex(code: number): number;
//# sourceMappingURL=common.d.ts.map