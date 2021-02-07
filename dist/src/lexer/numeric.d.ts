import { ParserState, Context } from '../common';
import { Token } from '../token';
import { NumberKind } from './common';
export declare function scanNumber(parser: ParserState, context: Context, kind: NumberKind): Token;
export declare function scanDecimalDigitsOrSeparator(parser: ParserState, char: number): string;
//# sourceMappingURL=numeric.d.ts.map