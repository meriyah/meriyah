import { ParserState } from '../common';
export declare function nextCodePoint(parser: ParserState): number;
export declare function consumeMultiUnitCodePoint(parser: ParserState, hi: number): boolean;
export declare function isExoticECMAScriptWhitespace(code: number): boolean;
export declare function fromCodePoint(codePoint: number): string;
export declare function toHex(code: number): number;
//# sourceMappingURL=common.d.ts.map