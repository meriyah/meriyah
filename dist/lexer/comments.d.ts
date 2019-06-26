import { LexerState } from './';
import { ParserState } from '../common';
export declare function skipHashBang(parser: ParserState): void;
export declare function skipSingleLineComment(parser: ParserState, state: LexerState): LexerState;
export declare function skipMultiLineComment(parser: ParserState, state: LexerState): LexerState | void;
//# sourceMappingURL=comments.d.ts.map