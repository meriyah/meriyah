import { ParserState, Context } from '../common';
import { Token } from '../token';
export declare function scanIdentifier(parser: ParserState, context: Context, isValidAsKeyword: 0 | 1): Token;
export declare function scanUnicodeIdentifier(parser: ParserState, context: Context): Token;
export declare function scanIdentifierSlowCase(parser: ParserState, context: Context, hasEscape: 0 | 1, isValidAsKeyword: number): Token;
export declare function scanPrivateName(parser: ParserState): Token;
export declare function scanIdentifierUnicodeEscape(parser: ParserState): number;
export declare function scanUnicodeEscape(parser: ParserState): number;
//# sourceMappingURL=identifier.d.ts.map