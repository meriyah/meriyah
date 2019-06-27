import { ParserState } from './common';
export declare class ParseError extends SyntaxError {
    index: number;
    line: number;
    column: number;
    description: string;
    constructor(startindex: number, line: number, column: number, source: string, type: Errors, ...params: string[]);
}
export declare function report(parser: ParserState, type: Errors, ...params: string[]): never;
export declare function reportAt(parser: ParserState, index: number, line: number, column: number, type: Errors, ...params: string[]): never;
//# sourceMappingURL=errors.d.ts.map