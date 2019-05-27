export declare const enum CharFlags {
    None = 0,
    IdentifierStart = 1,
    IdentifierPart = 2,
    WhiteSpace = 4,
    KeywordCandidate = 64,
    Asterisk = 128,
    LineTerminator = 512,
    Decimal = 1024,
    Octal = 2048,
    Hex = 4096,
    Binary = 8192,
    Exponent = 32768,
    BackSlash = 131072,
    ImplicitOctalDigits = 262144,
    CarriageReturn = 524288,
    LineFeed = 1048576,
    Underscore = 2097152
}
export declare const CharTypes: number[];
export declare function isIdentifierStart(code: number): number;
export declare function isIdentifierPart(code: number): any;
//# sourceMappingURL=charClassifier.d.ts.map