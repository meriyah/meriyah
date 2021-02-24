export declare const enum CharFlags {
    None = 0,
    IdentifierStart = 1,
    IdentifierPart = 2,
    KeywordCandidate = 4,
    LineTerminator = 8,
    Decimal = 16,
    Octal = 32,
    Hex = 64,
    Binary = 128,
    Exponent = 256,
    ImplicitOctalDigits = 512,
    CarriageReturn = 1024,
    LineFeed = 2048,
    Underscore = 4096,
    StringLiteral = 8192,
    JSXToken = 16384,
    Hyphen = 32768
}
export declare const CharTypes: (number | CharFlags)[];
export declare const isIdStart: number[];
export declare const isIdPart: number[];
export declare function isIdentifierStart(code: number): number;
export declare function isIdentifierPart(code: number): any;
//# sourceMappingURL=charClassifier.d.ts.map