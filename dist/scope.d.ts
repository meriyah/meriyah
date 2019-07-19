import { Context, ParserState, BindingKind } from './common';
export declare const enum ScopeType {
    None = 0,
    For = 1,
    Block = 2,
    Catch = 4,
    Switch = 8,
    ArgumentList = 16
}
export declare const enum ScopeMasks {
    Redeclared = 1,
    Undeclared = 2
}
export interface ScopeState {
    var: any;
    lexicalVariables: any;
    lexicals: any;
    funcs?: any;
}
export declare function initblockScope(): ScopeState;
export declare function inheritScope(scope: any, type: ScopeType): ScopeState;
export declare function declareName(parser: ParserState, context: Context, scope: any, name: string, bindingType: BindingKind, dupeChecks: 0 | 1, isVarDecl: 0 | 1): void;
export declare function declareAndDedupe(parser: ParserState, context: Context, scope: any, name: string, type: BindingKind, isVarDecl: 0 | 1): void;
export declare function declareUnboundVariable(parser: ParserState, context: Context, scope: any, name: string, type: BindingKind): void;
export declare function addFunctionName(parser: ParserState, context: Context, scope: any, name: string, type: BindingKind, isVarDecl: 0 | 1): void;
export declare function checkConflictingLexicalDeclarations(parser: ParserState, context: Context, scope: any, checkParent: 0 | 1): boolean;
export declare function verifyArguments(parser: ParserState, lex: any): void;
export declare function updateExportsList(parser: ParserState, name: string): void;
export declare function addBindingToExports(parser: ParserState, name: string): void;
//# sourceMappingURL=scope.d.ts.map