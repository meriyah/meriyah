import { ParserState } from './common';

/*@internal*/
export const enum Errors {
  Unexpected,
  StrictOctalEscape,
  TemplateOctalLiteral,
  InvalidPrivateName,
  InvalidUnicodeEscapeSequence,
  InvalidCodePoint,
  InvalidHexEscapeSequence,
  StrictDecimalWithLeadingZero,
  StrictOctalLiteral,
  ExpectedNumberInRadix,
  MissingExponent,
  InvalidBigInt,
  IDStartAfterNumber,
  InvalidEightAndNine,
  UnterminatedString,
  UnterminatedTemplate,
  UnterminatedComment,
  InvalidDynamicUnicode,
  IllegalCaracter,
  MissingHexDigits,
  InvalidImplicitOctals,
  InvalidStringLT,
  InvalidEscapeIdentifier,
  ExpectedToken,
  InvalidLHS,
  InvalidLHSInAsyncArrow,
  InvalidLHSValidRHS,
  SuperNoConstructor,
  InvalidSuperProperty,
  UnexpectedToken,
  AwaitInParameter,
  YieldInParameter,
  InvalidExponentationLHS,
  UnterminatedRegExp,
  UnexpectedTokenRegExpFlag,
  DuplicateRegExpFlag,
  AccessorWrongArgs,
  BadSetterRestParameter,
  DeclNoName,
  StrictFunctionName,
  RestMissingArg,
  InvalidLHSInit,
  InvalidGeneratorGetter,
  InvalidComputedPropName,
  InvalidGetSetGenerator,
  InvalidAsyncGetter,
  InvalidGenMethodShorthand,
  InvalidLineBreak,
  InvalidAsyncParamList,
  IllegalArrowFunctionParams,
  InvalidArrowDestructLHS,
  InvalidBindingDestruct,
  InvalidBindingInFuncParam,
  InvalidAsyncArrow,
  StaticPrototype,
  InvalidConstructor,
  DuplicateConstructor,
  InvalidIncDecTarget,
  InvalidIncDecNew,
  InvalidAssignmentTarget,
  InvalidRestTrailing,
  DeclarationMissingInitializer,
  ForInOfLoopInitializer,
  ForInOfLoopMultiBindings,
  InvalidShorthandPropInit,
  DuplicateProto,
  InvalidLetBoundName,
  InvalidNewUnary,
  IllegalUseStrict,
  DisallowedLetInStrict,
  IllegalContinue,
  IllegalBreak,
  InvalidLetBracket,
  InvalidArrayCompoundAssignment,
  InvalidObjCompoundAssignment,
  InvalidDestructuringTarget,
  InvalidRestObjBinding,
  RestDefaultInitializer,
  NotDestructibeRestArg,
  InvalidRestNotLast,
  InvalidRestArg,
  InvalidRestDefault,
  InvalidArrowDefaultYield,
  InvalidExprInGroupAssign,
  StrictFunction,
  SloppyFunction,
  WebCompatFunction,
  ClassForbiddenAsStatement,
  InvalidAwaitIdent,
  InvalidLHSInOfForLoop,
  InvalidAssignmentInOfForLoop,
  InvalidForAwait,
  InvalidTemplateContinuation,
  RestricedLetProduction,
  UnexpectedLetStrictReserved,
  InvalidCatchParams,
  InvalidCatchParamDefault,
  NoCatchOrFinally,
  MultipleDefaultsInSwitch,
  NewlineAfterThrow,
  StrictWith,
  IllegalReturn,
  InvalidForLHSBinding,
  InvalidNewTarget,
  InvalidEscapedKeyword,
  MissingPrivateName,
  InvalidStrictStatic,
  DisallowedInContext,
  FutureReservedWordInStrictModeNotId,
  AwaitOutsideAsync,
  InvalidStrictLet,
  InvalidLetConstBinding,
  InvalidLetClassName,
  KeywordNotId,
  InvalidImportExportSloppy,
  InvalidExportAtTopLevel,
  InvalidNestedExport,
  UnicodeOverflow,
  InvalidExportImportSource,
  InvalidKeywordAsAlias,
  InvalidDefaultImport,
  NoIdentOrDynamicName,
  TrailingDecorators,
  GeneratorConstructor,
  AwaitOrYieldIdentInModule,
  HtmlCommentInWebCompat,
  StrictInvalidLetInExprPos,
  NotAssignableLetArgs,
  ForOfLet,
  InvalidBlockBodyArrow,
  UnexpectedStrictReserved,
  StrictEvalArguments,
  InvalidDecoratorSemicolon,
  InvalidStatementStart,
  StrictDelete,
  InvalidPatternTail,
  ForLoopInvalidLHS
}

/*@internal*/
export const errorMessages: {
  [key: string]: string;
} = {
  [Errors.Unexpected]: 'Unexpected token',
  [Errors.UnexpectedToken]: "Unexpected token '%0'",
  [Errors.StrictOctalEscape]: 'Octal escape sequences are not allowed in strict mode',
  [Errors.TemplateOctalLiteral]: 'Octal escape sequences are not allowed in template strings',
  [Errors.InvalidPrivateName]: 'Unexpected token `#`',
  [Errors.InvalidUnicodeEscapeSequence]: 'Invalid Unicode escape sequence',
  [Errors.InvalidCodePoint]: 'Invalid code point %0',
  [Errors.InvalidHexEscapeSequence]: 'Invalid hexadecimal escape sequence',
  [Errors.StrictOctalLiteral]: 'Octal literals are not allowed in strict mode',
  [Errors.StrictDecimalWithLeadingZero]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
  [Errors.ExpectedNumberInRadix]: 'Expected number in radix %0',
  [Errors.MissingExponent]: 'Non-number found after exponent indicator',
  [Errors.InvalidBigInt]: 'Invalid BigIntLiteral',
  [Errors.IDStartAfterNumber]: 'No identifiers allowed directly after numeric literal',
  [Errors.InvalidEightAndNine]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
  [Errors.UnterminatedString]: 'Unterminated string literal',
  [Errors.UnterminatedTemplate]: 'Unterminated template literal',
  [Errors.UnterminatedComment]: 'Multiline comment was not closed properly',
  [Errors.InvalidDynamicUnicode]: 'The identifier contained dynamic unicode escape that was not closed',
  [Errors.IllegalCaracter]: "Illegal character '%0'",
  [Errors.MissingHexDigits]: 'Missing hex digits',
  [Errors.InvalidImplicitOctals]: 'Invalid implicit octal',
  [Errors.InvalidStringLT]: 'Invalid line break in string literal',
  [Errors.InvalidEscapeIdentifier]: 'Only unicode escapes are legal in identifier names',
  [Errors.ExpectedToken]: "Expected '%0'",
  [Errors.InvalidLHS]: 'Invalid left-hand side in assignment',
  [Errors.InvalidLHSInAsyncArrow]: 'Invalid left-hand side in async arrow',
  [Errors.InvalidLHSValidRHS]: 'Only the right-hand side is destructible. The left-hand side is invalid',
  [Errors.SuperNoConstructor]:
    'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
  [Errors.InvalidSuperProperty]: 'Member access on super must be in a method',
  [Errors.AwaitInParameter]: 'Await expression not allowed in formal parameter',
  [Errors.YieldInParameter]: 'Yield expression not allowed in formal parameter',
  [Errors.InvalidExponentationLHS]:
    'Unary expressions as the left operand of an exponentation expression must be disambiguated with parentheses',
  [Errors.UnterminatedRegExp]: 'Unterminated regular expression',
  [Errors.UnexpectedTokenRegExpFlag]: 'Unexpected regular expression flag',
  [Errors.DuplicateRegExpFlag]: "Duplicate regular expression flag '%0'",
  [Errors.AccessorWrongArgs]: '%0 functions must have exactly %1 argument%2',
  [Errors.BadSetterRestParameter]: 'Setter function argument must not be a rest parameter',
  [Errors.DeclNoName]: '%0 declaration must have a name in this context',
  [Errors.StrictFunctionName]: 'Function name may not be eval or arguments in strict mode',
  [Errors.RestMissingArg]: 'The rest operator is missing an argument',
  [Errors.InvalidLHSInit]: 'Cannot assign to lhs, not destructible with this initializer',
  [Errors.InvalidGeneratorGetter]: 'A getter cannot be a generator',
  [Errors.InvalidComputedPropName]: 'A computed property name must be followed by a colon or paren',
  [Errors.InvalidAsyncGetter]: 'Found `* async x(){}` but this should be `async * x(){}`',
  [Errors.InvalidGetSetGenerator]: 'Getters and setters can not be generators',
  [Errors.InvalidGenMethodShorthand]: "'%0' can not be generator method",
  [Errors.InvalidLineBreak]: "No line break is allowed after '=>'",
  [Errors.InvalidAsyncParamList]: 'Illegal async arrow function parameter list',
  [Errors.IllegalArrowFunctionParams]: 'Illegal arrow function parameter list',
  [Errors.InvalidArrowDestructLHS]: 'The left-hand side of the arrow can only be destructed through assignment',
  [Errors.InvalidBindingDestruct]: 'The binding declaration is not destructible',
  [Errors.InvalidBindingInFuncParam]: 'Invalid non-destructible binding in function parameters',
  [Errors.InvalidAsyncArrow]: 'Invalid async arrow',
  [Errors.StaticPrototype]: "Classes may not have a static property named 'prototype'",
  [Errors.InvalidConstructor]: 'Class constructor may not be a %0',
  [Errors.DuplicateConstructor]: 'Duplicate constructor method in class',
  [Errors.InvalidIncDecTarget]: 'Invalid increment/decrement operand',
  [Errors.InvalidIncDecNew]: 'Invalid use of `new` keyword on an increment/decrement expression',
  [Errors.InvalidAssignmentTarget]: '`=>` is an invalid assignment target',
  [Errors.InvalidRestTrailing]: 'Rest element may not have a trailing comma',
  [Errors.DeclarationMissingInitializer]: 'Missing initializer in %0 declaration',
  [Errors.ForInOfLoopInitializer]: "'for-%0' loop head declarations can not have an initializer",
  [Errors.ForInOfLoopMultiBindings]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
  [Errors.ForLoopInvalidLHS]: 'Invalid left-hand side in for-loop',
  [Errors.InvalidShorthandPropInit]: 'Invalid shorthand property initializer',
  [Errors.DuplicateProto]: 'Property name __proto__ appears more than once in object literal',
  [Errors.InvalidLetBoundName]: 'Let is disallowed as a lexically bound name',
  [Errors.InvalidNewUnary]: "Invalid use of '%0' inside new expression",
  [Errors.IllegalUseStrict]: "Illegal 'use strict' directive in function with non-simple parameter list",
  [Errors.DisallowedLetInStrict]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
  [Errors.IllegalContinue]: 'Illegal continue statement',
  [Errors.IllegalBreak]: 'Illegal break statement',
  [Errors.InvalidLetBracket]: 'Cannot have `let[...]` as a var name in strict mode',
  [Errors.InvalidArrayCompoundAssignment]: 'Cannot compound-assign to an array literal',
  [Errors.InvalidObjCompoundAssignment]: 'Cannot compound-assign to an object literal',
  [Errors.InvalidDestructuringTarget]: 'Invalid destructuring assignment target',
  [Errors.InvalidRestObjBinding]:
    'The rest argument of an object binding pattern must always be a simple ident and not an array pattern',
  [Errors.RestDefaultInitializer]: 'Rest parameter may not have a default initializer',
  [Errors.NotDestructibeRestArg]:
    'The rest argument was not destructible as it must be last and can not have a trailing comma',
  [Errors.InvalidRestNotLast]: 'The rest argument must the be last parameter',
  [Errors.InvalidRestArg]: 'Invalid rest argument',
  [Errors.InvalidArrowDefaultYield]: 'The arguments of an arrow cannot contain a yield expression in their defaults',
  [Errors.InvalidExprInGroupAssign]: 'Cannot assign to list of expressions in a group',
  [Errors.StrictFunction]: 'In strict mode code, functions can only be declared at top level or inside a block',
  [Errors.SloppyFunction]:
    'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
  [Errors.WebCompatFunction]:
    'Without web compability enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
  [Errors.ClassForbiddenAsStatement]: "Class declaration can't appear in single-statement context",
  [Errors.InvalidAwaitIdent]: "'await' may not be used as an identifier in this context",
  [Errors.InvalidLHSInOfForLoop]: 'Invalid left-hand side in for-%0',
  [Errors.InvalidAssignmentInOfForLoop]: 'Invalid assignment in for-%0',
  [Errors.InvalidForAwait]: 'for await (... of ...) is only valid in async functions and async generators',
  [Errors.InvalidTemplateContinuation]:
    'The first token after the template expression should be a continuation of the template',
  [Errors.UnexpectedLetStrictReserved]:
    '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
  [Errors.RestricedLetProduction]: '`let \n [` is a restricted production at the start of a statement',
  [Errors.InvalidCatchParams]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
  [Errors.InvalidCatchParamDefault]: 'Catch clause parameter does not support default values',
  [Errors.NoCatchOrFinally]: 'Missing catch or finally after try',
  [Errors.MultipleDefaultsInSwitch]: 'More than one default clause in switch statement',
  [Errors.NewlineAfterThrow]: 'Illegal newline after throw',
  [Errors.StrictWith]: 'Strict mode code may not include a with statement',
  [Errors.IllegalReturn]: 'Illegal return statement',
  [Errors.InvalidForLHSBinding]: 'The for-header left hand side binding declaration is not destructible',
  [Errors.InvalidNewTarget]: 'new.target only allowed within functions',
  [Errors.InvalidEscapedKeyword]: 'Keywords must be written literally, without embedded escapes',
  [Errors.MissingPrivateName]: "''#' not followed by identifier",
  [Errors.InvalidStrictStatic]: '`Static` is a reserved word in strict mode',
  [Errors.FutureReservedWordInStrictModeNotId]:
    'The use of a future reserved word for an identifier is invalid. The identifier name is reserved in strict mode',
  [Errors.KeywordNotId]: 'The use of a keyword for an identifier is invalid',
  [Errors.InvalidLetClassName]: "Can not use 'let' as a class name",
  [Errors.InvalidLetConstBinding]: 'Can not use `let` when binding through `let` or `const`',
  [Errors.InvalidStrictLet]: 'Can not use `let` as variable name in strict mode',
  [Errors.DisallowedInContext]: "'%0' may not be used as an identifier in this context",
  [Errors.AwaitOutsideAsync]: 'Await is only valid in async functions',
  [Errors.InvalidImportExportSloppy]: 'The %0 keyword can only be used with the module goal',
  [Errors.InvalidExportAtTopLevel]: 'The `export` keyword is only supported at the top level',
  [Errors.InvalidNestedExport]: 'The `export` keyword can not be nested in another statement',
  [Errors.UnicodeOverflow]: 'Unicode codepoint must not be greater than 0x10FFFF',
  [Errors.InvalidExportImportSource]: '%0 source must be string',
  [Errors.InvalidKeywordAsAlias]: 'Only a identifier can be used to indicate alias',
  [Errors.InvalidDefaultImport]: "Only '*' or '{...}' can be imported after default",
  [Errors.NoIdentOrDynamicName]: 'Method must have an identifier or dynamic name',
  [Errors.TrailingDecorators]: 'Trailing decorator may be followed by method',
  [Errors.GeneratorConstructor]: "Decorators can't be used with a constructor",
  [Errors.AwaitOrYieldIdentInModule]: "'%0' may not be used as an identifier in this context",
  [Errors.HtmlCommentInWebCompat]: 'HTML comments are only allowed with web compability (Annex B)',
  [Errors.StrictInvalidLetInExprPos]: "The identifier 'let' must not be in expression position in strict mode",
  [Errors.NotAssignableLetArgs]: 'Cannot assign to `eval` and `arguments` in strict mode',
  [Errors.ForOfLet]: "The left-hand side of a for-of loop may not start with 'let'",
  [Errors.InvalidBlockBodyArrow]: 'Block body arrows can not be immediately %0 without a group',
  [Errors.UnexpectedStrictReserved]: 'Unexpected strict mode reserved word',
  [Errors.StrictEvalArguments]: 'Unexpected eval or arguments in strict mode',
  [Errors.InvalidDecoratorSemicolon]: 'Decorators must not be followed by a semicolon',
  [Errors.InvalidStatementStart]: 'A statement can not start with object destructuring assignment',
  [Errors.StrictDelete]: 'Calling delete on expression not allowed in strict mode',
  [Errors.InvalidPatternTail]: 'Pattern can not have a tail'
};

export class ParseError extends SyntaxError {
  public index: number;
  public line: number;
  public column: number;
  public description: string;
  constructor(index: number, line: number, column: number, source: string, type: Errors, ...params: string[]) {
    let message =
      errorMessages[type].replace(/%(\d+)/g, (_: string, i: number) => params[i]) + ' (' + line + ':' + column + ')';
    const lines = source.split('\n');
    message = message + '\n' + lines[line - 1] + '\n';
    for (let i = 0; i < column; i++) {
      message += ' ';
    }
    message += '^\n';

    super(`${message}`);

    this.index = index;
    this.line = line;
    this.column = column;
    this.description = message;
  }
}

/**
 * Throws an error
 *
 * @export
 * @param {ParserState} state
 * @param {Errors} type
 * @param {...string[]} params
 * @returns {never}
 */
export function report(state: ParserState, type: Errors, ...params: string[]): never {
  throw new ParseError(state.index, state.line, state.column, state.source, type, ...params);
}

/**
 * Throws an error at a given position
 *
 * @export
 * @param {ParserState} state
 * @param {number} index
 * @param {number} line
 * @param {number} column
 * @param {Errors} type
 * @param {...string[]} params
 * @returns {never}
 */
export function reportAt(
  state: ParserState,
  index: number,
  line: number,
  column: number,
  type: Errors,
  ...params: string[]
): never {
  throw new ParseError(index, line, column, state.source, type, ...params);
}
