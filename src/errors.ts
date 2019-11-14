import { ParserState } from './common';

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
  CantAssignTo,
  InvalidLHSAsyncArrow,
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
  InvalidGeneratorGetter,
  InvalidComputedPropName,
  InvalidGetSetGenerator,
  InvalidAsyncGetter,
  InvalidGenMethodShorthand,
  InvalidLineBreak,
  InvalidArrowDestructLHS,
  InvalidBindingDestruct,
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
  InvalidDestructuringTarget,
  RestDefaultInitializer,
  InvalidRestNotLast,
  InvalidRestArg,
  InvalidRestDefault,
  StrictFunction,
  SloppyFunction,
  WebCompatFunction,
  ClassForbiddenAsStatement,
  CantAssignToInOfForLoop,
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
  DisallowedInContext,
  AwaitOutsideAsync,
  InvalidStrictLet,
  InvalidLetConstBinding,
  InvalidLetClassName,
  KeywordNotId,
  InvalidImportExportSloppy,
  UnicodeOverflow,
  InvalidExportImportSource,
  InvalidKeywordAsAlias,
  InvalidDefaultImport,
  TrailingDecorators,
  GeneratorConstructor,
  AwaitOrYieldIdentInModule,
  HtmlCommentInWebCompat,
  StrictInvalidLetInExprPos,
  NotAssignableLetArgs,
  ForOfLet,
  InvalidInvokedBlockBodyArrow,
  InvalidAccessedBlockBodyArrow,
  UnexpectedStrictReserved,
  StrictEvalArguments,
  InvalidDecoratorSemicolon,
  StrictDelete,
  InvalidPatternTail,
  AsyncFunctionInSingleStatementContext,
  InvalidTernaryYield,
  InvalidArrowPostfix,
  InvalidObjLitKeyStar,
  DeletePrivateField,
  InvalidStaticClassFieldConstructor,
  InvalidClassFieldConstructor,
  InvalidClassFieldArgEval,
  InvalidGeneratorFunction,
  AsyncRestrictedProd,
  UnexpectedCharAfterObjLit,
  InvalidObjLitKey,
  InvalidKeyToken,
  LabelRedeclaration,
  InvalidNestedStatement,
  UnknownLabel,
  InvalidImportTail,
  ImportNotOneArg,
  InvalidImportNew,
  InvalidSpreadInImport,
  UncompleteArrow,
  DuplicateBinding,
  DuplicateExportBinding,
  UndeclaredExportedBinding,
  UnexpectedPrivateField,
  DuplicateLetConstBinding,
  CantAssignToValidRHS,
  ContinuousNumericSeparator,
  TrailingNumericSeparator,
  InvalidJSXAttributeValue,
  ExpectedJSXClosingTag,
  AdjacentJSXElements,
  InvalidNonEmptyJSXExpr,
  DuplicateIdentifier,
  ShadowedCatchClause,
  InvalidDotProperty,
  UnclosedSpreadElement,
  CatchWithoutTry,
  FinallyWithoutTry,
  UnCorrespondingFragmentTag,
  InvalidCoalescing,
  OptionalChainingNoTemplate,
  OptionalChainingNoSuper,
  OptionalChainingNoNew,
  ImportMetaOutsideModule
}

export const errorMessages: {
  [key: string]: string;
} = {
  [Errors.Unexpected]: 'Unexpected token',
  [Errors.UnexpectedToken]: "Unexpected token: '%0'",
  [Errors.StrictOctalEscape]: 'Octal escape sequences are not allowed in strict mode',
  [Errors.TemplateOctalLiteral]: 'Octal escape sequences are not allowed in template strings',
  [Errors.InvalidPrivateName]: 'Unexpected token `#`',
  [Errors.InvalidUnicodeEscapeSequence]: 'Illegal Unicode escape sequence',
  [Errors.InvalidCodePoint]: 'Invalid code point %0',
  [Errors.InvalidHexEscapeSequence]: 'Invalid hexadecimal escape sequence',
  [Errors.StrictOctalLiteral]: 'Octal literals are not allowed in strict mode',
  [Errors.StrictDecimalWithLeadingZero]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
  [Errors.ExpectedNumberInRadix]: 'Expected number in radix %0',
  [Errors.CantAssignToValidRHS]: 'Invalid left-hand side assignment to a destructible right-hand side',
  [Errors.MissingExponent]: 'Non-number found after exponent indicator',
  [Errors.InvalidBigInt]: 'Invalid BigIntLiteral',
  [Errors.IDStartAfterNumber]: 'No identifiers allowed directly after numeric literal',
  [Errors.InvalidEightAndNine]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
  [Errors.UnterminatedString]: 'Unterminated string literal',
  [Errors.UnterminatedTemplate]: 'Unterminated template literal',
  [Errors.UnterminatedComment]: 'Multiline comment was not closed properly',
  [Errors.InvalidDynamicUnicode]: 'The identifier contained dynamic unicode escape that was not closed',
  [Errors.IllegalCaracter]: "Illegal character '%0'",
  [Errors.MissingHexDigits]: 'Missing hexadecimal digits',
  [Errors.InvalidImplicitOctals]: 'Invalid implicit octal',
  [Errors.InvalidStringLT]: 'Invalid line break in string literal',
  [Errors.InvalidEscapeIdentifier]: 'Only unicode escapes are legal in identifier names',
  [Errors.ExpectedToken]: "Expected '%0'",
  [Errors.CantAssignTo]: 'Invalid left-hand side in assignment',
  [Errors.InvalidLHSAsyncArrow]: 'Invalid left-hand side in async arrow',
  [Errors.SuperNoConstructor]:
    'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
  [Errors.InvalidSuperProperty]: 'Member access on super must be in a method',
  [Errors.AwaitInParameter]: 'Await expression not allowed in formal parameter',
  [Errors.YieldInParameter]: 'Yield expression not allowed in formal parameter',
  [Errors.InvalidEscapedKeyword]: "Unexpected token: 'escaped keyword'",
  [Errors.InvalidExponentationLHS]:
    'Unary expressions as the left operand of an exponentation expression must be disambiguated with parentheses',
  [Errors.AsyncFunctionInSingleStatementContext]:
    'Async functions can only be declared at the top level or inside a block',
  [Errors.UnterminatedRegExp]: 'Unterminated regular expression',
  [Errors.UnexpectedTokenRegExpFlag]: 'Unexpected regular expression flag',
  [Errors.DuplicateRegExpFlag]: "Duplicate regular expression flag '%0'",
  [Errors.AccessorWrongArgs]: '%0 functions must have exactly %1 argument%2',
  [Errors.BadSetterRestParameter]: 'Setter function argument must not be a rest parameter',
  [Errors.DeclNoName]: '%0 declaration must have a name in this context',
  [Errors.StrictFunctionName]:
    'Function name may not contain any reserved words or be eval or arguments in strict mode',
  [Errors.RestMissingArg]: 'The rest operator is missing an argument',
  [Errors.InvalidGeneratorGetter]: 'A getter cannot be a generator',
  [Errors.InvalidComputedPropName]: 'A computed property name must be followed by a colon or paren',
  [Errors.InvalidObjLitKey]: 'Object literal keys that are strings or numbers must be a method or have a colon',
  [Errors.InvalidAsyncGetter]: 'Found `* async x(){}` but this should be `async * x(){}`',
  [Errors.InvalidGetSetGenerator]: 'Getters and setters can not be generators',
  [Errors.InvalidGenMethodShorthand]: "'%0' can not be generator method",
  [Errors.InvalidLineBreak]: "No line break is allowed after '=>'",
  [Errors.InvalidArrowDestructLHS]: 'The left-hand side of the arrow can only be destructed through assignment',
  [Errors.InvalidBindingDestruct]: 'The binding declaration is not destructible',
  [Errors.InvalidAsyncArrow]: 'Async arrow can not be followed by new expression',
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
  [Errors.InvalidShorthandPropInit]: 'Invalid shorthand property initializer',
  [Errors.DuplicateProto]: 'Property name __proto__ appears more than once in object literal',
  [Errors.InvalidLetBoundName]: 'Let is disallowed as a lexically bound name',
  [Errors.InvalidNewUnary]: "Invalid use of '%0' inside new expression",
  [Errors.IllegalUseStrict]: "Illegal 'use strict' directive in function with non-simple parameter list",
  [Errors.DisallowedLetInStrict]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
  [Errors.IllegalContinue]: 'Illegal continue statement',
  [Errors.IllegalBreak]: 'Illegal break statement',
  [Errors.InvalidLetBracket]: 'Cannot have `let[...]` as a var name in strict mode',
  [Errors.InvalidDestructuringTarget]: 'Invalid destructuring assignment target',
  [Errors.RestDefaultInitializer]: 'Rest parameter may not have a default initializer',
  [Errors.InvalidRestNotLast]: 'The rest argument must the be last parameter',
  [Errors.InvalidRestArg]: 'Invalid rest argument',
  [Errors.StrictFunction]: 'In strict mode code, functions can only be declared at top level or inside a block',
  [Errors.SloppyFunction]:
    'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
  [Errors.WebCompatFunction]:
    'Without web compability enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
  [Errors.ClassForbiddenAsStatement]: "Class declaration can't appear in single-statement context",
  [Errors.CantAssignToInOfForLoop]: 'Invalid left-hand side in for-%0',
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
  [Errors.InvalidForLHSBinding]: 'The left hand side of the for-header binding declaration is not destructible',
  [Errors.InvalidNewTarget]: 'new.target only allowed within functions',
  [Errors.InvalidEscapedKeyword]: "'Unexpected token: 'escaped keyword'",
  [Errors.MissingPrivateName]: "'#' not followed by identifier",
  [Errors.KeywordNotId]: 'Invalid keyword',
  [Errors.InvalidLetClassName]: "Can not use 'let' as a class name",
  [Errors.InvalidLetConstBinding]: "'A lexical declaration can't define a 'let' binding",
  [Errors.InvalidStrictLet]: 'Can not use `let` as variable name in strict mode',
  [Errors.DisallowedInContext]: "'%0' may not be used as an identifier in this context",
  [Errors.AwaitOutsideAsync]: 'Await is only valid in async functions',
  [Errors.InvalidImportExportSloppy]: 'The %0 keyword can only be used with the module goal',
  [Errors.UnicodeOverflow]: 'Unicode codepoint must not be greater than 0x10FFFF',
  [Errors.InvalidExportImportSource]: '%0 source must be string',
  [Errors.InvalidKeywordAsAlias]: 'Only a identifier can be used to indicate alias',
  [Errors.InvalidDefaultImport]: "Only '*' or '{...}' can be imported after default",
  [Errors.TrailingDecorators]: 'Trailing decorator may be followed by method',
  [Errors.GeneratorConstructor]: "Decorators can't be used with a constructor",
  [Errors.AwaitOrYieldIdentInModule]: "'%0' may not be used as an identifier in this context",
  [Errors.HtmlCommentInWebCompat]: 'HTML comments are only allowed with web compability (Annex B)',
  [Errors.StrictInvalidLetInExprPos]: "The identifier 'let' must not be in expression position in strict mode",
  [Errors.NotAssignableLetArgs]: 'Cannot assign to `eval` and `arguments` in strict mode',
  [Errors.ForOfLet]: "The left-hand side of a for-of loop may not start with 'let'",
  [Errors.InvalidInvokedBlockBodyArrow]: 'Block body arrows can not be immediately invoked without a group',
  [Errors.InvalidAccessedBlockBodyArrow]: 'Block body arrows can not be immediately accessed without a group',
  [Errors.UnexpectedStrictReserved]: 'Unexpected strict mode reserved word',
  [Errors.StrictEvalArguments]: 'Unexpected eval or arguments in strict mode',
  [Errors.InvalidDecoratorSemicolon]: 'Decorators must not be followed by a semicolon',
  [Errors.StrictDelete]: 'Calling delete on expression not allowed in strict mode',
  [Errors.InvalidPatternTail]: 'Pattern can not have a tail',
  [Errors.InvalidTernaryYield]: 'Can not have a `yield` expression on the left side of a ternary',
  [Errors.InvalidArrowPostfix]: 'An arrow function can not have a postfix update operator',
  [Errors.InvalidObjLitKeyStar]: 'Invalid object literal key character after generator star',
  [Errors.DeletePrivateField]: 'Private fields can not be deleted',
  [Errors.InvalidClassFieldConstructor]: 'Classes may not have a field called constructor',
  [Errors.InvalidStaticClassFieldConstructor]: 'Classes may not have a private element named constructor',
  [Errors.InvalidClassFieldArgEval]: 'A class field initializer may not contain arguments',
  [Errors.InvalidGeneratorFunction]: 'Generators can only be declared at the top level or inside a block',
  [Errors.AsyncRestrictedProd]: 'Async methods are a restricted production and cannot have a newline following it',
  [Errors.UnexpectedCharAfterObjLit]: 'Unexpected character after object literal property name',
  [Errors.InvalidKeyToken]: 'Invalid key token',
  [Errors.LabelRedeclaration]: "Label '%0' has already been declared",
  [Errors.InvalidNestedStatement]: 'continue statement must be nested within an iteration statement',
  [Errors.UnknownLabel]: "Undefined label '%0'",
  [Errors.InvalidImportTail]: 'Trailing comma is disallowed inside import(...) arguments',
  [Errors.ImportNotOneArg]: 'import() requires exactly one argument',
  [Errors.InvalidImportNew]: 'Cannot use new with import(...)',
  [Errors.InvalidSpreadInImport]: '... is not allowed in import()',
  [Errors.UncompleteArrow]: "Expected '=>'",
  [Errors.DuplicateBinding]: "Duplicate binding '%0'",
  [Errors.DuplicateExportBinding]: "Cannot export a duplicate name '%0'",
  [Errors.DuplicateLetConstBinding]: 'Duplicate %0 for-binding',
  [Errors.UndeclaredExportedBinding]: "Exported binding '%0' needs to refer to a top-level declared variable",
  [Errors.UnexpectedPrivateField]: 'Unexpected private field',
  [Errors.TrailingNumericSeparator]: 'Numeric separators are not allowed at the end of numeric literals',
  [Errors.ContinuousNumericSeparator]: 'Only one underscore is allowed as numeric separator',
  [Errors.InvalidJSXAttributeValue]: 'JSX value should be either an expression or a quoted JSX text',
  [Errors.ExpectedJSXClosingTag]: 'Expected corresponding JSX closing tag for %0',
  [Errors.AdjacentJSXElements]: 'Adjacent JSX elements must be wrapped in an enclosing tag',
  [Errors.InvalidNonEmptyJSXExpr]: "JSX attributes must only be assigned a non-empty 'expression'",
  [Errors.DuplicateIdentifier]: "'%0' has already been declared",
  [Errors.ShadowedCatchClause]: "'%0' shadowed a catch clause binding",
  [Errors.InvalidDotProperty]: 'Dot property must be an identifier',
  [Errors.UnclosedSpreadElement]: 'Encountered invalid input after spread/rest argument',
  [Errors.CatchWithoutTry]: 'Catch without try',
  [Errors.FinallyWithoutTry]: 'Finally without try',
  [Errors.UnCorrespondingFragmentTag]: 'Expected corresponding closing tag for JSX fragment',
  [Errors.InvalidCoalescing]:
    'Coalescing and logical operators used together in the same expression must be disambiguated with parentheses',
  [Errors.OptionalChainingNoTemplate]: 'Invalid tagged template on optional chain',
  [Errors.OptionalChainingNoSuper]: 'Invalid optional chain from super property',
  [Errors.OptionalChainingNoNew]: 'Invalid optional chain from new expression',
  [Errors.ImportMetaOutsideModule]: 'Cannot use "import.meta" outside a module'
};

export class ParseError extends SyntaxError {
  public loc: {
    line: ParseError['line'];
    column: ParseError['column'];
  };
  public index: number;
  public line: number;
  public column: number;
  public description: string;
  /*eslint-disable*/
  constructor(startindex: number, line: number, column: number, type: Errors, ...params: string[]) {
    const message =
      '[' + line + ':' + column + ']: ' + errorMessages[type].replace(/%(\d+)/g, (_: string, i: number) => params[i]);
    super(`${message}`);
    this.index = startindex;
    this.line = line;
    this.column = column;
    this.description = message;
    /* Acorn compat */
    this.loc = {
      line,
      column
    } as any;
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
export function report(parser: ParserState, type: Errors, ...params: string[]): never {
  throw new ParseError(parser.index, parser.line, parser.column, type, ...params);
}

export function reportScopeError(scope: any): never {
  throw new ParseError(scope.index, scope.line, scope.column, scope.type, scope.params);
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
 */
export function reportMessageAt(index: number, line: number, column: number, type: Errors, ...params: string[]): never {
  throw new ParseError(index, line, column, type, ...params);
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
 */
export function reportScannerError(index: number, line: number, column: number, type: Errors): never {
  throw new ParseError(index, line, column, type);
}
