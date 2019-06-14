import { Token } from './token';
import { Node } from './estree';
export declare const enum Context {
    None = 0,
    OptionsNext = 1,
    OptionsRanges = 2,
    OptionsLoc = 4,
    OptionsDirectives = 8,
    OptionsJSX = 16,
    OptionsGlobalReturn = 32,
    OptionsLexical = 64,
    OptionsParenthesized = 128,
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
    DisallowIn = 134217728,
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
    PrivateField = 4096,
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
    IsAssignable = 1,
    CannotAssign = 2,
    Await = 4,
    Yield = 8
}
export declare const enum DestructuringKind {
    None = 0,
    MustDestruct = 8,
    CannotDestruct = 16,
    AssignableDestruct = 32,
    SeenProto = 64,
    Await = 128,
    Yield = 256
}
export declare const enum Flags {
    None = 0,
    NewLine = 1,
    HasConstructor = 32,
    Octals = 64,
    SimpleParameterList = 128,
    Yield = 256
}
export declare const enum FunctionStatement {
    Disallow = 0,
    Allow = 1
}
export interface ParserState {
    source: string;
    flags: Flags;
    index: number;
    line: number;
    column: number;
    tokenIndex: number;
    startIndex: number;
    end: number;
    token: Token;
    tokenValue: any;
    tokenRaw: string;
    tokenRegExp: void | {
        pattern: string;
        flags: string;
    };
    assignable: AssignmentKind | DestructuringKind;
    destructible: AssignmentKind | DestructuringKind;
    nextCP: number;
    exportedNames: any;
    exportedBindings: any;
}
export declare function consumeSemicolon(parser: ParserState, context: Context): void;
export declare function optionalBit(parser: ParserState, context: Context, t: Token): 0 | 1;
export declare function consumeOpt(parser: ParserState, context: Context, t: Token): boolean;
export declare function consume(parser: ParserState, context: Context, t: Token): void;
export declare function reinterpretToPattern(state: ParserState, node: any): void;
export declare function validateBindingIdentifier(parser: ParserState, context: Context, type: BindingType, t: Token, skipEvalArgCheck: 0 | 1): void;
export declare function isStrictReservedWord(parser: ParserState, context: Context, t: Token): boolean;
export declare function isPropertyWithPrivateFieldKey(expr: any): boolean;
export declare function isValidLabel(parser: ParserState, labels: any, name: string, isIterationStatement: 0 | 1): 0 | 1;
export declare function validateAndDeclareLabel(parser: ParserState, labels: any, name: string): void;
export declare function finishNode<T extends Node>(parser: ParserState, context: Context, start: number, node: T): T;
//# sourceMappingURL=common.d.ts.map