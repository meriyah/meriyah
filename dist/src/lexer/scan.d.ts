import { Token } from '../token';
import { ParserState, Context } from '../common';
import { LexerState } from './common';
export declare const TokenLookup: Token[];
export declare function nextToken(parser: ParserState, context: Context): void;
export declare function scanSingleToken(parser: ParserState, context: Context, state: LexerState): Token;
//# sourceMappingURL=scan.d.ts.map