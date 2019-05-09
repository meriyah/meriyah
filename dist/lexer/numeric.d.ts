import { ParserState, Context } from '../common';
import { Token } from '../token';
export declare const enum NumberKind {
    ImplicitOctal = 1,
    Binary = 2,
    Octal = 4,
    Hex = 8,
    Decimal = 16,
    DecimalWithLeadingZero = 32
}
export declare function scanNumber(parser: ParserState, context: Context, isFloat: boolean): Token;
//# sourceMappingURL=numeric.d.ts.map