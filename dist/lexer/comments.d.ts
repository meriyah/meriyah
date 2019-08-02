import { LexerState } from './';
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
export declare function skipSingleHTMLComment(parser: ParserState, state: LexerState, context: Context, type: CommentType): LexerState;
export declare function skipSingleLineComment(parser: ParserState, state: LexerState, type: CommentType): LexerState;
export declare function skipMultiLineComment(parser: ParserState, state: LexerState): LexerState | void;
//# sourceMappingURL=comments.d.ts.map