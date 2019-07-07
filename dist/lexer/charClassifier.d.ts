export declare const enum CharFlags {
    None = 0,
    IdentifierStart = 1,
    IdentifierPart = 2,
    KeywordCandidate = 64,
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
    Underscore = 2097152,
    StringLiteral = 4194304,
    JSXToken = 8388608,
    Hyphen = 16777216
}
export declare const CharTypes: number[];
export declare function isIdentifierStart(code: number): number;
export declare function isIdentifierPart(code: number): any;
//# sourceMappingURL=charClassifier.d.ts.map