import { ParserState, Context } from '../common';
import { Token } from '../token';
export declare function scanIdentifier(parser: ParserState, context: Context): Token;
export declare function scanIdentifierSlowCase(parser: ParserState, context: Context, hasEscape: 0 | 1, canBeKeyword: number): Token;
export declare function scanPrivateName(parser: ParserState): Token;
export declare function scanIdentifierUnicodeEscape(parser: ParserState): any;
export declare function scanUnicodeEscapeValue(parser: ParserState): number;
//# sourceMappingURL=identifier.d.ts.map