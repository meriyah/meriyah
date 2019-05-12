import { Token } from './token';
export declare const enum Context {
    None = 0,
    OptionsNext = 1,
    OptionsRanges = 2,
    OptionsLoc = 4,
    OptionsDirectives = 8,
    OptionsJSX = 16,
    OptionsGlobalReturn = 32,
    OptionsGlobalAwait = 64,
    OptionsExperimental = 128,
    OptionsWebCompat = 256,
    OptionsRaw = 512,
    Strict = 1024,
    Module = 2048,
    InSwitch = 4096,
    InGlobal = 8192,
    TopLevel = 16384,
    AllowRegExp = 32768,
    TaggedTemplate = 65536,
    InIteration = 131072,
    SuperProperty = 262144,
    SuperCall = 524288,
    InYieldContext = 2097152,
    InAwaitContext = 4194304,
    InArgList = 8388608,
    InConstructor = 16777216,
    InMethod = 33554432,
    AllowNewTarget = 67108864,
    DisallowInContext = 134217728,
    InDecoratorContext = 268435456,
    InClass = 536870912,
    InSwitchOrIteration = 135168
}
export declare const enum PropertyKind {
    None = 0,
    Method = 1,
    Computed = 2,
    Shorthand = 4,
    Generator = 8,
    Async = 16,
    Static = 32,
    Constructor = 64,
    ClassField = 128,
    Getter = 256,
    Setter = 512,
    Extends = 1024,
    Literal = 2048,
    PrivatField = 4096,
    GetSet = 768
}
export declare const enum BindingType {
    None = 0,
    ArgumentList = 1,
    Variable = 4,
    Let = 8,
    Const = 16,
    Class = 32
}
export declare const enum BindingOrigin {
    None = 0,
    Declaration = 1,
    Arrow = 2,
    ForStatement = 4,
    Statement = 8,
    Export = 16
}
export declare const enum AssignmentKind {
    None = 0,
    Assignable = 1,
    NotAssignable = 2
}
export declare const enum DestructuringKind {
    None = 0,
    Required = 8,
    NotDestructible = 16,
    Assignable = 32,
    SeenProto = 64,
    HasAWait = 128,
    HasYield = 256
}
export declare const enum Flags {
    None = 0,
    NewLine = 1,
    SeenAwait = 2,
    SeenYield = 4,
    HasConstructor = 32,
    Octals = 64,
    SimpleParameterList = 128
}
export declare const enum ParseFunctionFlag {
    None = 0,
    DisallowGenerator = 1,
    RequireIdentifier = 2
}
export declare const enum LabelledFunctionStatement {
    Disallow = 0,
    Allow = 1
}
export interface ParserState {
    source: string;
    flags: Flags;
    index: number;
    line: number;
    column: number;
    startIndex: number;
    length: number;
    token: Token;
    tokenValue: any;
    tokenRaw: string;
    tokenRegExp: void | {
        pattern: string;
        flags: string;
    };
    assignable: AssignmentKind | DestructuringKind;
    destructible: AssignmentKind | DestructuringKind;
    currentCodePoint: number;
}
export declare function consumeSemicolon(parser: ParserState, context: Context): void;
export declare function optionalBit(parser: ParserState, context: Context, t: Token): 0 | 1;
export declare function consumeOpt(parser: ParserState, context: Context, t: Token): boolean;
export declare function consume(parser: ParserState, context: Context, t: Token): void;
export declare function reinterpretToPattern(state: ParserState, node: any): void;
export declare function validateIdentifier(parser: ParserState, context: Context, type: BindingType, token: Token): void;
export declare function isStrictReservedWord(parser: ParserState, context: Context, t: Token): boolean;
export declare function validateArrowBlockBody(parser: ParserState): void;
export declare function isPropertyWithPrivateFieldKey(expr: any): boolean;
//# sourceMappingURL=common.d.ts.map