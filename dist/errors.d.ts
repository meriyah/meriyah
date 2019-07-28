import { ParserState } from './common';
export declare class ParseError extends SyntaxError {
    index: number;
    line: number;
    column: number;
    description: string;
    constructor(startindex: number, line: number, column: number, type: Errors, ...params: string[]);
}
export declare function report(parser: ParserState, type: Errors, ...params: string[]): never;
export declare function reportScopeError(scope: any): never;
export declare function reportMessageAt(index: number, line: number, column: number, type: Errors, ...params: string[]): never;
export declare function reportScannerError(index: number, line: number, column: number, type: Errors): never;
//# sourceMappingURL=errors.d.ts.map