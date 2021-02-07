import { LexerState } from './common';
import { Context, ParserState } from '../common';
export declare const enum CommentType {
    Single = 0,
    Multi = 1,
    HTMLOpen = 2,
    HTMLClose = 3,
    HashBang = 4
}
export declare const CommentTypes: string[];
export declare function skipHashBang(parser: ParserState): void;
export declare function skipSingleHTMLComment(parser: ParserState, source: string, state: LexerState, context: Context, type: CommentType, start: number, line: number, column: number): LexerState;
export declare function skipSingleLineComment(parser: ParserState, source: string, state: LexerState, type: CommentType, start: number, line: number, column: number): LexerState;
export declare function skipMultiLineComment(parser: ParserState, source: string, state: LexerState): LexerState | void;
//# sourceMappingURL=comments.d.ts.map