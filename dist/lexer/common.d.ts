import { ParserState } from '../common';
export declare const enum LexerState {
    None = 0,
    NewLine = 1,
    SameLine = 2,
    LastIsCR = 4,
    InJSXMode = 8
}
export declare const enum NumberKind {
    ImplicitOctal = 1,
    Binary = 2,
    Octal = 4,
    Hex = 8,
    Decimal = 16,
    DecimalWithLeadingZero = 32,
    Float = 64,
    DecimalNumberKind = 48,
    ValidBigIntKind = 62
}
export declare function nextCP(parser: ParserState): number;
export declare function consumeMultiUnitCodePoint(parser: ParserState, hi: number): 0 | 1;
export declare function consumeLineFeed(parser: ParserState, lastIsCR: boolean): void;
export declare function scanNewLine(parser: ParserState): void;
export declare function isExoticECMAScriptWhitespace(code: number): boolean;
export declare function fromCodePoint(codePoint: number): string;
export declare function toHex(code: number): number;
//# sourceMappingURL=common.d.ts.map