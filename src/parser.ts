import { nextToken, skipHashBang } from './lexer';
import { Token, KeywordDescTable } from './token';
import * as ESTree from './estree';
import { report, reportMessageAt, reportScopeError, Errors } from './errors';
import { scanTemplateTail } from './lexer/template';
import { scanJSXIdentifier, scanJSXToken, scanJSXAttributeValue } from './lexer/jsx';
import {
  Context,
  ParserState,
  PropertyKind,
  Origin,
  consumeOpt,
  consume,
  Flags,
  OnComment,
  pushComment,
  reinterpretToPattern,
  DestructuringKind,
  AssignmentKind,
  BindingKind,
  validateBindingIdentifier,
  isStrictReservedWord,
  optionalBit,
  matchOrInsertSemicolon,
  isPropertyWithPrivateFieldKey,
  isValidLabel,
  validateAndDeclareLabel,
  finishNode,
  HoistedClassFlags,
  HoistedFunctionFlags,
  createScope,
  addChildScope,
  ScopeKind,
  ScopeState,
  addVarName,
  addBlockName,
  addBindingToExports,
  updateExportsList,
  isEqualTagName,
  isValidStrictMode,
  createArrowHeadParsingScope,
  addVarOrBlock
} from './common';

/**
 * Create a new parser instance
 */

export function create(source: string, sourceFile: string | void, onComment: OnComment | void): ParserState {
  return {
    /**
     * The source code to be parsed
     */
    source,

    /**
     * The mutable parser flags, in case any flags need passed by reference.
     */
    flags: Flags.None,

    /**
     * The current index
     */
    index: 0,

    /**
     * Beginning of current line
     */
    line: 1,

    /**
     * Beginning of current column
     */
    column: 0,

    /**
     * Start position of whitespace before current token
     */
    startPos: 0,

    /**
     * The end of the source code
     */
    end: source.length,

    /**
     * Start position of text of current token
     */
    tokenPos: 0,

    /**
     * Start position of the colum before newline
     */
    startColumn: 0,

    /**
     * Position in the input code of the first character after the last newline
     */
    colPos: 0,

    /**
     * The number of newlines
     */
    linePos: 0,

    /**
     * Start position of text of current token
     */
    startLine: 1,

    /**
     * Used together with source maps. File containing the code being parsed
     */

    sourceFile,

    /**
     * Holds the scanned token value
     */
    tokenValue: '',

    /**
     * The current token in the stream to consume
     */
    token: Token.EOF,

    /**
     * Holds the raw text that have been scanned by the lexer
     */
    tokenRaw: '',

    /**
     * Holds the regExp info text that have been collected by the lexer
     */
    tokenRegExp: void 0,

    /**
     * The code point at the current index
     */
    currentChar: source.charCodeAt(0),

    /**
     *  https://tc39.es/ecma262/#sec-module-semantics-static-semantics-exportednames
     */
    exportedNames: [],

    /**
     * https://tc39.es/ecma262/#sec-exports-static-semantics-exportedbindings
     */

    exportedBindings: [],

    /**
     * Assignable state
     */
    assignable: 1,

    /**
     * Destructuring state
     */
    destructible: 0,

    onComment
  };
}

/**
 * The parser options.
 */
export interface Options {
  // Allow module code
  module?: boolean;
  // Enable stage 3 support (ESNext)
  next?: boolean;
  // Enable start and end offsets to each node
  ranges?: boolean;
  // Enable web compability
  webcompat?: boolean;
  // Enable line/column location information to each node
  loc?: boolean;
  // Attach raw property to each literal and identifier node
  raw?: boolean;
  // Enabled directives
  directives?: boolean;
  // Allow return in the global scope
  globalReturn?: boolean;
  // Enable implied strict mode
  impliedStrict?: boolean;
  // Enable non-standard parenthesized expression node
  preserveParens?: boolean;
  // Enable lexical binding and scope tracking
  lexical?: boolean;
  // Adds a source attribute in every node’s loc object when the locations option is `true`
  source?: string;
  // Distinguish Identifier from IdentifierPattern
  identifierPattern?: boolean;
  // Enable React JSX parsing
  jsx?: boolean;
  // Allow edge cases that deviate from the spec
  specDeviation?: boolean;
  // Enabled V8 features
  v8?: boolean;
  // Allowes comment extraction. Accepts either a a callback function or an array
  onComment?: OnComment;
}

/**
 * Consumes a sequence of tokens and produces an syntax tree
 */
export function parseSource(source: string, options: Options | void, context: Context): ESTree.Program {
  let sourceFile = '';
  let onComment;
  if (options != null) {
    if (options.module) context |= Context.Module | Context.Strict;
    if (options.next) context |= Context.OptionsNext;
    if (options.loc) context |= Context.OptionsLoc;
    if (options.ranges) context |= Context.OptionsRanges;
    if (options.lexical) context |= Context.OptionsLexical;
    if (options.webcompat) context |= Context.OptionsWebCompat;
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    if (options.raw) context |= Context.OptionsRaw;
    if (options.preserveParens) context |= Context.OptionsPreserveParens;
    if (options.impliedStrict) context |= Context.Strict;
    if (options.jsx) context |= Context.OptionsJSX;
    if (options.v8) context |= Context.OptionsV8;
    if (options.identifierPattern) context |= Context.OptionsIdentifierPattern;
    if (options.specDeviation) context |= Context.OptionsSpecDeviation;
    if (options.source) sourceFile = options.source;
    // Accepts either a callback function to be invoked or an array to collect comments (as the node is constructed)
    if (options.onComment != null) {
      onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
    }
  }

  // Initialize parser state
  const parser = create(source, sourceFile, onComment);

  // See: https://github.com/tc39/proposal-hashbang
  if (context & Context.OptionsNext) skipHashBang(parser);

  const scope: ScopeState | undefined = context & Context.OptionsLexical ? createScope() : void 0;

  let body: (ESTree.Statement | ReturnType<typeof parseDirective | typeof parseModuleItem>)[] = [];

  // https://tc39.es/ecma262/#sec-scripts
  // https://tc39.es/ecma262/#sec-modules

  let sourceType: 'module' | 'script' = 'script';

  if (context & Context.Module) {
    sourceType = 'module';
    body = parseModuleItemList(parser, context | Context.InGlobal, scope);

    if (scope) {
      for (const key in parser.exportedBindings) {
        if (key[0] === '#' && !(scope as any)[key]) report(parser, Errors.UndeclaredExportedBinding, key.slice(1));
      }
    }
  } else {
    body = parseStatementList(parser, context | Context.InGlobal, scope);
  }

  const node: ESTree.Program = {
    type: 'Program',
    sourceType,
    body
  };

  if (context & Context.OptionsRanges) {
    node.start = 0;
    node.end = source.length;
  }

  if (context & Context.OptionsLoc) {
    node.loc = {
      start: { line: 1, column: 0 },
      end: { line: parser.line, column: parser.column }
    };

    if (parser.sourceFile) node.loc.source = sourceFile;
  }

  return node;
}

/**
 * Parses statement list items
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseStatementList(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined
): ESTree.Statement[] {
  // StatementList ::
  //   (StatementListItem)* <end_token>

  nextToken(parser, context | Context.AllowRegExp);

  const statements: ESTree.Statement[] = [];

  while (parser.token === Token.StringLiteral) {
    // "use strict" must be the exact literal without escape sequences or line continuation.
    const { index, tokenPos, tokenValue, linePos, colPos, token } = parser;
    const expr = parseLiteral(parser, context);
    if (isValidStrictMode(parser, index, tokenPos, tokenValue)) context |= Context.Strict;
    statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
  }

  while (parser.token !== Token.EOF) {
    statements.push(parseStatementListItem(
      parser,
      context,
      scope,
      Origin.TopLevel,
      {},
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    ) as ESTree.Statement);
  }
  return statements;
}

/**
 * Parse module item list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItemList)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseModuleItemList(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined
): (ReturnType<typeof parseDirective | typeof parseModuleItem>)[] {
  // ecma262/#prod-Module
  // Module :
  //    ModuleBody?
  //
  // ecma262/#prod-ModuleItemList
  // ModuleBody :
  //    ModuleItem*

  nextToken(parser, context | Context.AllowRegExp);

  const statements: (ReturnType<typeof parseDirective | typeof parseModuleItem>)[] = [];

  // Avoid this if we're not going to create any directive nodes. This is likely to be the case
  // most of the time, considering the prevalence of strict mode and the fact modules
  // are already in strict mode.
  if (context & Context.OptionsDirectives) {
    while (parser.token === Token.StringLiteral) {
      const { tokenPos, linePos, colPos, token } = parser;
      statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
    }
  }

  while (parser.token !== Token.EOF) {
    statements.push(parseModuleItem(
      parser,
      context,
      scope,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    ) as ESTree.Statement);
  }
  return statements;
}

/**
 * Parse module item
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleItem)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 * @param start
 */

export function parseModuleItem(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  start: number,
  line: number,
  column: number
): any {
  // ecma262/#prod-ModuleItem
  // ModuleItem :
  //    ImportDeclaration
  //    ExportDeclaration
  //    StatementListItem

  switch (parser.token) {
    case Token.ExportKeyword:
      return parseExportDeclaration(parser, context, scope, start, line, column);
    case Token.ImportKeyword:
      return parseImportDeclaration(parser, context, scope, start, line, column);
    case Token.Decorator:
      return parseDecorators(parser, context) as ESTree.Decorator[];
    default:
      return parseStatementListItem(parser, context, scope, Origin.TopLevel, {}, start, line, column);
  }
}

/**
 *  Parse statement list
 *
 * @param parser  Parser object
 * @param context Context masks
 */

export function parseStatementListItem(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.Statement | ESTree.Decorator[] {
  // ECMA 262 10th Edition
  // StatementListItem[Yield, Return] :
  //   Statement[?Yield, ?Return]
  //   Declaration[?Yield]
  //
  // Declaration[Yield] :
  //   HoistableDeclaration[?Yield]
  //   ClassDeclaration[?Yield]
  //   LexicalDeclaration[In, ?Yield]
  //
  // HoistableDeclaration[Yield, Default] :
  //   FunctionDeclaration[?Yield, ?Default]
  //   GeneratorDeclaration[?Yield, ?Default]
  //
  // LexicalDeclaration[In, Yield] :
  //   LetOrConst BindingList[?In, ?Yield] ;

  switch (parser.token) {
    //   HoistableDeclaration[?Yield, ~Default]
    case Token.FunctionKeyword:
      return parseFunctionDeclaration(
        parser,
        context,
        scope,
        origin,
        1,
        HoistedFunctionFlags.None,
        0,
        start,
        line,
        column
      );
    // @decorator
    case Token.Decorator:
    // ClassDeclaration[?Yield, ~Default]
    case Token.ClassKeyword:
      return parseClassDeclaration(parser, context, scope, HoistedClassFlags.None, start, line, column);
    // LexicalDeclaration[In, ?Yield]
    // LetOrConst BindingList[?In, ?Yield]
    case Token.ConstKeyword:
      return parseLexicalDeclaration(parser, context, scope, BindingKind.Const, Origin.None, start, line, column);
    case Token.LetKeyword:
      return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
    // ExportDeclaration
    case Token.ExportKeyword:
      report(parser, Errors.InvalidImportExportSloppy, 'export');
    // ImportDeclaration
    case Token.ImportKeyword:
      nextToken(parser, context);
      switch (parser.token) {
        case Token.LeftParen:
          return parseImportCallDeclaration(parser, context, start, line, column);
        default:
          report(parser, Errors.InvalidImportExportSloppy, 'import');
      }
    //   async [no LineTerminator here] AsyncArrowBindingIdentifier ...
    //   async [no LineTerminator here] ArrowFormalParameters ...
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
    default:
      return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
  }
}

/**
 * Parse statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowFuncDecl Allow / disallow func statement
 */

export function parseStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.Statement {
  // Statement ::
  //   Block
  //   VariableStatement
  //   EmptyStatement
  //   ExpressionStatement
  //   IfStatement
  //   IterationStatement
  //   ContinueStatement
  //   BreakStatement
  //   ReturnStatement
  //   WithStatement
  //   LabelledStatement
  //   SwitchStatement
  //   ThrowStatement
  //   TryStatement
  //   DebuggerStatement

  switch (parser.token) {
    // VariableStatement[?Yield]
    case Token.VarKeyword:
      return parseVariableStatement(parser, context, scope, Origin.None, start, line, column);
    // [+Return] ReturnStatement[?Yield]
    case Token.ReturnKeyword:
      return parseReturnStatement(parser, context, start, line, column);
    case Token.IfKeyword:
      return parseIfStatement(parser, context, scope, labels, start, line, column);
    case Token.ForKeyword:
      return parseForStatement(parser, context, scope, labels, start, line, column);
    // BreakableStatement[Yield, Return]:
    //   IterationStatement[?Yield, ?Return]
    //   SwitchStatement[?Yield, ?Return]
    case Token.DoKeyword:
      return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
    case Token.WhileKeyword:
      return parseWhileStatement(parser, context, scope, labels, start, line, column);
    case Token.SwitchKeyword:
      return parseSwitchStatement(parser, context, scope, labels, start, line, column);
    case Token.Semicolon:
      // EmptyStatement
      return parseEmptyStatement(parser, context, start, line, column);
    // BlockStatement[?Yield, ?Return]
    case Token.LeftBrace:
      return parseBlock(
        parser,
        context,
        scope ? addChildScope(scope, ScopeKind.Block) : scope,
        labels,
        start,
        line,
        column
      ) as ESTree.Statement;

    // ThrowStatement[?Yield]
    case Token.ThrowKeyword:
      return parseThrowStatement(parser, context, start, line, column);
    case Token.BreakKeyword:
      // BreakStatement[?Yield]
      return parseBreakStatement(parser, context, labels, start, line, column);
    // ContinueStatement[?Yield]
    case Token.ContinueKeyword:
      return parseContinueStatement(parser, context, labels, start, line, column);
    // TryStatement[?Yield, ?Return]
    case Token.TryKeyword:
      return parseTryStatement(parser, context, scope, labels, start, line, column);
    // WithStatement[?Yield, ?Return]
    case Token.WithKeyword:
      return parseWithStatement(parser, context, scope, labels, start, line, column);
    case Token.DebuggerKeyword:
      // DebuggerStatement
      return parseDebuggerStatement(parser, context, start, line, column);
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
    // Miscellaneous error cases arguably better caught here than elsewhere
    case Token.CatchKeyword:
      report(parser, Errors.CatchWithoutTry);
    case Token.FinallyKeyword:
      report(parser, Errors.FinallyWithoutTry);
    case Token.FunctionKeyword:
      // FunctionDeclaration & ClassDeclaration is forbidden by lookahead
      // restriction in an arbitrary statement position.
      report(
        parser,
        context & Context.Strict
          ? Errors.StrictFunction
          : (context & Context.OptionsWebCompat) < 1
          ? Errors.WebCompatFunction
          : Errors.SloppyFunction
      );
    case Token.ClassKeyword:
      report(parser, Errors.ClassForbiddenAsStatement);

    default:
      return parseExpressionOrLabelledStatement(
        parser,
        context,
        scope,
        origin,
        labels,
        allowFuncDecl,
        start,
        line,
        column
      );
  }
}

/**
 * Parses either expression or labeled statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowFuncDecl Allow / disallow func statement
 */

export function parseExpressionOrLabelledStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement | ESTree.LabeledStatement {
  // ExpressionStatement | LabelledStatement ::
  //   Expression ';'
  //   Identifier ':' Statement
  //
  // ExpressionStatement[Yield] :
  //   [lookahead notin {{, function, class, let [}] Expression[In, ?Yield] ;

  const { tokenValue, token } = parser;

  let expr: ESTree.Expression;

  switch (token) {
    case Token.LetKeyword:
      expr = parseIdentifier(parser, context, 0);
      if (context & Context.Strict) report(parser, Errors.UnexpectedLetStrictReserved);

      if (parser.token === Token.Colon)
        return parseLabelledStatement(
          parser,
          context,
          scope,
          origin,
          labels,
          tokenValue,
          expr,
          token,
          allowFuncDecl,
          start,
          line,
          column
        );
      // "let" followed by either "[", "{" or an identifier means a lexical
      // declaration, which should not appear here.
      // However, ASI may insert a line break before an identifier or a brace.
      if (parser.token === Token.LeftBracket) report(parser, Errors.RestricedLetProduction);

      break;

    default:
      expr = parsePrimaryExpressionExtended(
        parser,
        context,
        BindingKind.Empty,
        0,
        1,
        0,
        0,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
  }

  /** LabelledStatement[Yield, Await, Return]:
   *
   * ExpressionStatement | LabelledStatement ::
   * Expression ';'
   *   Identifier ':' Statement
   *
   * ExpressionStatement[Yield] :
   *   [lookahead notin {{, function, class, let [}] Expression[In, ?Yield] ;
   */
  if (token & Token.IsIdentifier && parser.token === Token.Colon) {
    return parseLabelledStatement(
      parser,
      context,
      scope,
      origin,
      labels,
      tokenValue,
      expr,
      token,
      allowFuncDecl,
      start,
      line,
      column
    );
  }
  /** MemberExpression :
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *
   * CallExpression :
   *   1. MemberExpression Arguments
   *   2. CallExpression ImportCall
   *   3. CallExpression Arguments
   *   4. CallExpression [ AssignmentExpression ]
   *   5. CallExpression . IdentifierName
   *   6. CallExpression TemplateLiteral
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   *
   */

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);

  /** parseAssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */

  expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr as ESTree.ArgumentExpression);

  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.token === Token.Comma) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */

  return parseExpressionStatement(parser, context, expr, start, line, column);
}

/**
 * Parses block statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BlockStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Block)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope  Scope object
 * @param labels Labels object
 * @param start
 * @param line
 * @param column
 *
 */
export function parseBlock(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.BlockStatement {
  // Block ::
  //   '{' StatementList '}'
  const body: ESTree.Statement[] = [];
  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);
  while (parser.token !== Token.RightBrace) {
    body.push(parseStatementListItem(
      parser,
      context,
      scope,
      Origin.BlockStatement,
      { $: labels },
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    ) as any);
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);

  return finishNode(parser, context, start, line, column, {
    type: 'BlockStatement',
    body
  });
}

/**
 * Parses return statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ReturnStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseReturnStatement(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ReturnStatement {
  // ReturnStatement ::
  //   'return' [no line terminator] Expression? ';'
  if ((context & Context.OptionsGlobalReturn) < 1 && context & Context.InGlobal) report(parser, Errors.IllegalReturn);

  nextToken(parser, context | Context.AllowRegExp);

  const argument =
    parser.flags & Flags.NewLine || parser.token & Token.IsAutoSemicolon
      ? null
      : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.column);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, line, column, {
    type: 'ReturnStatement',
    argument
  });
}

/**
 * Parses an expression statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExpressionStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expression AST node
 * @param start
 * @param line
 * @param column
 */
export function parseExpressionStatement(
  parser: ParserState,
  context: Context,
  expression: ESTree.Expression,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'ExpressionStatement',
    expression
  });
}

/**
 * Parses either expression or labeled statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 * @param token Token to validate
 * @param allowFuncDecl Allow / disallow func statement
 * @param start
 * @param line
 * @param column
 *
 */
export function parseLabelledStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  value: string,
  expr: ESTree.Identifier | ESTree.Expression,
  token: Token,
  allowFuncDecl: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.LabeledStatement {
  // LabelledStatement ::
  //   Expression ';'
  //   Identifier ':' Statement

  validateBindingIdentifier(parser, context, BindingKind.None, token, 1);
  validateAndDeclareLabel(parser, labels, value);

  nextToken(parser, context | Context.AllowRegExp); // skip: ':'

  const body =
    allowFuncDecl &&
    (context & Context.Strict) < 1 &&
    context & Context.OptionsWebCompat &&
    // In sloppy mode, Annex B.3.2 allows labelled function declarations.
    // Otherwise it's a parse error.
    parser.token === Token.FunctionKeyword
      ? parseFunctionDeclaration(
          parser,
          context,
          addChildScope(scope, ScopeKind.Block),
          origin,
          0,
          HoistedFunctionFlags.None,
          0,
          parser.tokenPos,
          parser.linePos,
          parser.colPos
        )
      : parseStatement(
          parser,
          context,
          scope,
          origin,
          labels,
          allowFuncDecl,
          parser.tokenPos,
          parser.linePos,
          parser.colPos
        );

  return finishNode(parser, context, start, line, column, {
    type: 'LabeledStatement',
    label: expr as ESTree.Identifier,
    body
  });
}

/**
 * Parses either async ident, async function or async arrow in
 * statement position
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param labels
 * @param allowFuncDecl Allow / disallow func statement
 * @param start Start position of current AST node
 * @param start
 * @param line
 * @param column
 */

export function parseAsyncArrowOrAsyncFunctionDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement | ESTree.LabeledStatement | ESTree.FunctionDeclaration {
  // AsyncArrowFunction[In, Yield, Await]:
  //    async[no LineTerminator here]AsyncArrowBindingIdentifier[?Yield][no LineTerminator here]=>AsyncConciseBody[?In]
  //    CoverCallExpressionAndAsyncArrowHead[?Yield, ?Await][no LineTerminator here]=>AsyncConciseBody[?In]
  //
  // AsyncArrowBindingIdentifier[Yield]:
  //    BindingIdentifier[?Yield, +Await]
  //
  // CoverCallExpressionAndAsyncArrowHead[Yield, Await]:
  //    MemberExpression[?Yield, ?Await]Arguments[?Yield, ?Await]
  //
  // AsyncFunctionDeclaration[Yield, Await, Default]:
  //    async[no LineTerminator here]functionBindingIdentifier[?Yield, ?Await](FormalParameters[~Yield, +Await]){AsyncFunctionBody}
  //    [+Default]async[no LineTerminator here]function(FormalParameters[~Yield, +Await]){AsyncFunctionBody}
  //
  // AsyncFunctionBody:
  //    FunctionBody[~Yield, +Await]

  const { token, tokenValue } = parser;

  let expr: ESTree.Expression = parseIdentifier(parser, context, 0);

  if (parser.token === Token.Colon) {
    return parseLabelledStatement(
      parser,
      context,
      scope,
      origin,
      labels,
      tokenValue,
      expr,
      token,
      1,
      start,
      line,
      column
    );
  }

  const asyncNewLine = parser.flags & Flags.NewLine;

  if (!asyncNewLine) {
    // async function ...
    if (parser.token === Token.FunctionKeyword) {
      if (!allowFuncDecl) report(parser, Errors.AsyncFunctionInSingleStatementContext);

      return parseFunctionDeclaration(
        parser,
        context,
        scope,
        origin,
        1,
        HoistedFunctionFlags.None,
        1,
        start,
        line,
        column
      );
    }

    // async Identifier => ...
    if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
      /** ArrowFunction[In, Yield, Await]:
       *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
       */
      expr = parseAsyncArrowAfterIdent(parser, context, scope, /* assignable */ 1, start, line, column);
      if (parser.token === Token.Comma) expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);

      /**
       * ExpressionStatement[Yield, Await]:
       *   [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
       */
      return parseExpressionStatement(parser, context, expr, start, line, column);
    }
  }

  /** ArrowFunction[In, Yield, Await]:
   *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
   */
  if (parser.token === Token.LeftParen) {
    expr = parseAsyncArrowOrCallExpression(
      parser,
      (context | Context.DisallowIn) ^ Context.DisallowIn,
      expr,
      1,
      BindingKind.ArgumentList,
      Origin.None,
      asyncNewLine,
      start,
      line,
      column
    );
  } else {
    if (parser.token === Token.Arrow) {
      let scope: ScopeState | undefined = void 0;

      if (context & Context.OptionsLexical) {
        scope = addChildScope(createScope(), ScopeKind.FunctionBody);
        addBlockName(parser, context, scope, parser.tokenValue, BindingKind.ArgumentList, Origin.None);
      }

      expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }

    parser.assignable = AssignmentKind.Assignable;
  }

  /** MemberExpression :
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *
   * CallExpression :
   *   1. MemberExpression Arguments
   *   2. CallExpression ImportCall
   *   3. CallExpression Arguments
   *   4. CallExpression [ AssignmentExpression ]
   *   5. CallExpression . IdentifierName
   *   6. CallExpression TemplateLiteral
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   */

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);
  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.token === Token.Comma) expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);

  /** parseAssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */
  expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr as ESTree.ArgumentExpression);

  parser.assignable = AssignmentKind.Assignable;

  /**
   * ExpressionStatement[Yield, Await]:
   *   [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start, line, column);
}

/**
 * Parse directive node
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-directive-prologues-and-the-use-strict-directive)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param expression AST expression node
 * @param token
 * @param start Start pos of node
 * @param line
 * @param column
 */

export function parseDirective(
  parser: ParserState,
  context: Context,
  expression: ESTree.ArgumentExpression | ESTree.SequenceExpression | ESTree.Expression,
  token: Token,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  const { tokenRaw } = parser;

  if (token !== Token.Semicolon) {
    parser.assignable = AssignmentKind.CannotAssign;

    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, start, line, column);

    if (parser.token !== Token.Semicolon) {
      expression = parseAssignmentExpression(parser, context, 0, start, line, column, expression);

      if (parser.token === Token.Comma) {
        expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
      }
    }

    matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  }

  return context & Context.OptionsDirectives
    ? finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression,
        directive: tokenRaw.slice(1, -1)
      })
    : finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression
      });
}

/**
 * Parses empty statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */

export function parseEmptyStatement(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.EmptyStatement {
  nextToken(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'EmptyStatement'
  });
}

/**
 * Parses throw statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ThrowStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
* @param line
* @param column

 */
export function parseThrowStatement(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ThrowStatement {
  // ThrowStatement ::
  //   'throw' Expression ';'
  nextToken(parser, context | Context.AllowRegExp);
  if (parser.flags & Flags.NewLine) report(parser, Errors.NewlineAfterThrow);
  const argument: ESTree.Expression = parseExpressions(
    parser,
    context,
    0,
    1,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'ThrowStatement',
    argument
  });
}

/**
 * Parses an if statement with an optional else block
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-if-statement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
* @param line
* @param column

 */
export function parseIfStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.IfStatement {
  // IfStatement ::
  //   'if' '(' Expression ')' Statement ('else' Statement)?
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  parser.assignable = AssignmentKind.Assignable;
  const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const consequent = parseConsequentOrAlternative(
    parser,
    context,
    scope,
    labels,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  let alternate: ESTree.Statement | null = null;
  if (parser.token === Token.ElseKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    alternate = parseConsequentOrAlternative(
      parser,
      context,
      scope,
      labels,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
  }

  return finishNode(parser, context, start, line, column, {
    type: 'IfStatement',
    test,
    consequent,
    alternate
  });
}

/**
 * Parse either consequent or alternate.
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseConsequentOrAlternative(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.Statement | ESTree.FunctionDeclaration {
  return context & Context.Strict ||
    // Disallow if web compability is off
    (context & Context.OptionsWebCompat) < 1 ||
    parser.token !== Token.FunctionKeyword
    ? parseStatement(
        parser,
        context,
        scope,
        Origin.None,
        { $: labels },
        0,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      )
    : parseFunctionDeclaration(
        parser,
        context,
        addChildScope(scope, ScopeKind.Block),
        Origin.None,
        0,
        HoistedFunctionFlags.None,
        0,
        start,
        line,
        column
      );
}

/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseSwitchStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.SwitchStatement {
  // SwitchStatement ::
  //   'switch' '(' Expression ')' '{' CaseClause* '}'
  // CaseClause ::
  //   'case' Expression ':' StatementList
  //   'default' ':' StatementList
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context, Token.RightParen);
  consume(parser, context, Token.LeftBrace);
  const cases: ESTree.SwitchCase[] = [];
  let seenDefault: 0 | 1 = 0;
  if (scope) scope = addChildScope(scope, ScopeKind.SwitchStatement);
  while (parser.token !== Token.RightBrace) {
    const { tokenPos, linePos, colPos } = parser;
    let test: ESTree.Expression | null = null;
    const consequent: ESTree.Statement[] = [];
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.CaseKeyword)) {
      test = parseExpressions(
        parser,
        (context | Context.DisallowIn) ^ Context.DisallowIn,
        0,
        1,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
    } else {
      consume(parser, context | Context.AllowRegExp, Token.DefaultKeyword);
      if (seenDefault) report(parser, Errors.MultipleDefaultsInSwitch);
      seenDefault = 1;
    }
    consume(parser, context | Context.AllowRegExp, Token.Colon);
    while (
      parser.token !== Token.CaseKeyword &&
      parser.token !== Token.RightBrace &&
      parser.token !== Token.DefaultKeyword
    ) {
      consequent.push(parseStatementListItem(
        parser,
        context | Context.InSwitch,
        scope,
        Origin.BlockStatement,
        {
          $: labels
        },
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      ) as ESTree.Statement);
    }

    cases.push(
      finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'SwitchCase',
        test,
        consequent
      })
    );
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);
  return finishNode(parser, context, start, line, column, {
    type: 'SwitchStatement',
    discriminant,
    cases
  });
}

/**
 * Parses while statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-grammar-notation-WhileStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseWhileStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.WhileStatement {
  // WhileStatement ::
  //   'while' '(' Expression ')' Statement
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseIterationStatementBody(parser, context, scope, labels);
  return finishNode(parser, context, start, line, column, {
    type: 'WhileStatement',
    test,
    body
  });
}

/**
 * Parses iteration statement body
 *
 * @see [Link](https://tc39.es/ecma262/#sec-iteration-statements)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseIterationStatementBody(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels
): ESTree.Statement {
  return parseStatement(
    parser,
    ((context | Context.DisallowIn) ^ Context.DisallowIn) | Context.InIteration,
    scope,
    Origin.None,
    { loop: 1, $: labels },
    0,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
}

/**
 * Parses the continue statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ContinueStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseContinueStatement(
  parser: ParserState,
  context: Context,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.ContinueStatement {
  // ContinueStatement ::
  //   'continue' Identifier? ';'
  if ((context & Context.InIteration) < 1) report(parser, Errors.IllegalContinue);
  nextToken(parser, context);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) < 1 && parser.token & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp, 0);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 1))
      report(parser, Errors.UnknownLabel, tokenValue);
  }
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'ContinueStatement',
    label
  });
}

/**
 * Parses the break statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BreakStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseBreakStatement(
  parser: ParserState,
  context: Context,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.BreakStatement {
  // BreakStatement ::
  //   'break' Identifier? ';'
  nextToken(parser, context | Context.AllowRegExp);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) < 1 && parser.token & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp, 0);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 0))
      report(parser, Errors.UnknownLabel, tokenValue);
  } else if ((context & (Context.InSwitch | Context.InIteration)) < 1) {
    report(parser, Errors.IllegalBreak);
  }

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'BreakStatement',
    label
  });
}

/**
 * Parses with statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-WithStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseWithStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.WithStatement {
  // WithStatement ::
  //   'with' '(' Expression ')' Statement

  nextToken(parser, context);

  if (context & Context.Strict) report(parser, Errors.StrictWith);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseStatement(
    parser,
    context,
    scope,
    Origin.BlockStatement,
    labels,
    0,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  return finishNode(parser, context, start, line, column, {
    type: 'WithStatement',
    object,
    body
  });
}

/**
 * Parses the debugger statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-DebuggerStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseDebuggerStatement(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.DebuggerStatement {
  // DebuggerStatement ::
  //   'debugger' ';'
  nextToken(parser, context | Context.AllowRegExp);
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'DebuggerStatement'
  });
}

/**
 * Parses try statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TryStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseTryStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.TryStatement {
  // TryStatement ::
  //   'try' Block Catch
  //   'try' Block Finally
  //   'try' Block Catch Finally
  //
  // Catch ::
  //   'catch' '(' Identifier ')' Block
  //
  // Finally ::
  //   'finally' Block

  nextToken(parser, context | Context.AllowRegExp);

  const firstScope = scope ? addChildScope(scope, ScopeKind.TryStatement) : void 0;

  const block = parseBlock(parser, context, firstScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
  const { tokenPos, linePos, colPos } = parser;
  const handler = consumeOpt(parser, context | Context.AllowRegExp, Token.CatchKeyword)
    ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos)
    : null;

  let finalizer: ESTree.BlockStatement | null = null;

  if (parser.token === Token.FinallyKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    const finalizerScope = firstScope ? addChildScope(scope, ScopeKind.CatchStatement) : void 0;
    finalizer = parseBlock(parser, context, finalizerScope, { $: labels }, tokenPos, linePos, colPos);
  }

  if (!handler && !finalizer) {
    report(parser, Errors.NoCatchOrFinally);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'TryStatement',
    block,
    handler,
    finalizer
  });
}

/**
 * Parses catch block
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-Catch)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseCatchBlock(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.CatchClause {
  let param: ESTree.BindingName | null = null;
  let additionalScope: ScopeState | undefined = scope;

  if (consumeOpt(parser, context, Token.LeftParen)) {
    /*
     * Create a lexical scope around the whole catch clause,
     * including the head.
     */
    if (scope) scope = addChildScope(scope, ScopeKind.CatchStatement);

    param = parseBindingPattern(
      parser,
      context,
      scope,
      (parser.token & Token.IsPatternStart) === Token.IsPatternStart
        ? BindingKind.CatchPattern
        : BindingKind.CatchIdentifier,
      Origin.None,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );

    if (parser.token === Token.Comma) {
      report(parser, Errors.InvalidCatchParams);
    } else if (parser.token === Token.Assign) {
      report(parser, Errors.InvalidCatchParamDefault);
    }

    consume(parser, context | Context.AllowRegExp, Token.RightParen);
    // ES 13.15.7 CatchClauseEvaluation
    //
    // Step 8 means that the body of a catch block always has an additional
    // lexical scope.
    if (scope) additionalScope = addChildScope(scope, ScopeKind.CatchBlock);
  }

  const body = parseBlock(
    parser,
    context,
    additionalScope,
    { $: labels },
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );

  return finishNode(parser, context, start, line, column, {
    type: 'CatchClause',
    param,
    body
  });
}

/**
 * Parses do while statement
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseDoWhileStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.DoWhileStatement {
  // DoStatement ::
  //   'do Statement while ( Expression ) ;'

  nextToken(parser, context | Context.AllowRegExp);
  const body = parseIterationStatementBody(parser, context, scope, labels);
  consume(parser, context, Token.WhileKeyword);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp, context & Context.OptionsSpecDeviation);
  return finishNode(parser, context, start, line, column, {
    type: 'DoWhileStatement',
    body,
    test
  });
}

/**
 * Because we are not doing any backtracking - this parses `let` as an identifier
 * or a variable declaration statement.
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-declarations-and-the-variable-statement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 * @param origin Binding origin
 * @param start Start pos of node
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseLetIdentOrVarDeclarationStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.VariableDeclaration | ESTree.LabeledStatement | ESTree.ExpressionStatement {
  const { token, tokenValue } = parser;
  let expr: ESTree.Identifier | ESTree.Expression = parseIdentifier(parser, context, 0);

  if (parser.token & (Token.IsIdentifier | Token.IsPatternStart)) {
    /* VariableDeclarations ::
     *  ('let') (Identifier ('=' AssignmentExpression)?)+[',']
     */
    const declarations = parseVariableDeclarationList(parser, context, scope, BindingKind.Let, Origin.None);

    matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

    return finishNode(parser, context, start, line, column, {
      type: 'VariableDeclaration',
      kind: 'let',
      declarations
    });
  }
  // 'Let' as identifier
  parser.assignable = AssignmentKind.Assignable;

  if (context & Context.Strict) report(parser, Errors.UnexpectedLetStrictReserved);

  /** LabelledStatement[Yield, Await, Return]:
   *
   * ExpressionStatement | LabelledStatement ::
   * Expression ';'
   *   Identifier ':' Statement
   *
   * ExpressionStatement[Yield] :
   *   [lookahead notin {{, function, class, let [}] Expression[In, ?Yield] ;
   */

  if (parser.token === Token.Colon) {
    return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
  }

  /**
   * ArrowFunction :
   *   ArrowParameters => ConciseBody
   *
   * ConciseBody :
   *   [lookahead not {] AssignmentExpression
   *   { FunctionBody }
   *
   */
  if (parser.token === Token.Arrow) {
    let scope: ScopeState | undefined = void 0;

    if (context & Context.OptionsLexical) scope = createArrowHeadParsingScope(parser, context, tokenValue);

    parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

    expr = parseArrowFunctionExpression(parser, context, scope, [expr], /* isAsync */ 0, start, line, column);
  } else {
    /**
     * UpdateExpression ::
     *   ('++' | '--')? LeftHandSideExpression
     *
     * MemberExpression ::
     *   (PrimaryExpression | FunctionLiteral | ClassLiteral)
     *     ('[' Expression ']' | '.' Identifier | Arguments | TemplateLiteral)*
     *
     * CallExpression ::
     *   (SuperCall | ImportCall)
     *     ('[' Expression ']' | '.' Identifier | Arguments | TemplateLiteral)*
     *
     * LeftHandSideExpression ::
     *   (NewExpression | MemberExpression) ...
     */

    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);

    /**
     * AssignmentExpression :
     *   1. ConditionalExpression
     *   2. LeftHandSideExpression = AssignmentExpression
     *
     */
    expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr as ESTree.ArgumentExpression);
  }

  /** Sequence expression
   */
  if (parser.token === Token.Comma) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start, line, column);
}

/**
 * Parses a `const` or `let` lexical declaration statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param type Binding kind
 * @param origin Binding origin
 * @param type Binding kind
 * @param start Start pos of node
 * @param start Start pos of node
 * @param line
 * @param column
 */
function parseLexicalDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.VariableDeclaration {
  // BindingList ::
  //  LexicalBinding
  //    BindingIdentifier
  //    BindingPattern
  nextToken(parser, context);

  const declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, line, column, {
    type: 'VariableDeclaration',
    kind: kind & BindingKind.Let ? 'let' : 'const',
    declarations
  });
}

/**
 * Parses a variable declaration statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 * @param origin Binding origin
 * @param start Start pos of node
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseVariableStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.VariableDeclaration {
  // VariableDeclarations ::
  //  ('var') (Identifier ('=' AssignmentExpression)?)+[',']
  //
  nextToken(parser, context);
  const declarations = parseVariableDeclarationList(parser, context, scope, BindingKind.Variable, origin);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, line, column, {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations
  });
}

/**
 * Parses variable declaration list
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclarationList)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param type Binding kind
 * @param origin Binding origin
 */
export function parseVariableDeclarationList(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  kind: BindingKind,
  origin: Origin
): ESTree.VariableDeclarator[] {
  let bindingCount = 1;
  const list: ESTree.VariableDeclarator[] = [parseVariableDeclaration(parser, context, scope, kind, origin)];
  while (consumeOpt(parser, context, Token.Comma)) {
    bindingCount++;
    list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
  }

  if (bindingCount > 1 && origin & Origin.ForStatement && parser.token & Token.IsInOrOf) {
    report(parser, Errors.ForInOfLoopMultiBindings, KeywordDescTable[parser.token & Token.Type]);
  }
  return list;
}

/**
 * Parses variable declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-VariableDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param start Start pos of node
 * @param line
 * @param column
 */
function parseVariableDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  kind: BindingKind,
  origin: Origin
): ESTree.VariableDeclarator {
  // VariableDeclaration :
  //   BindingIdentifier Initializeropt
  //   BindingPattern Initializer
  //
  // VariableDeclarationNoIn :
  //   BindingIdentifier InitializerNoInopt
  //   BindingPattern InitializerNoIn

  const { token, tokenPos, linePos, colPos } = parser;

  let init: ESTree.Expression | ESTree.BindingName | null = null;

  const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);

  if (parser.token === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);
    init = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    if (origin & Origin.ForStatement || (token & Token.IsPatternStart) < 1) {
      // Lexical declarations in for-in / for-of loops can't be initialized

      if (
        parser.token === Token.OfKeyword ||
        (parser.token === Token.InKeyword &&
          (token & Token.IsPatternStart ||
            (kind & BindingKind.Variable) < 1 ||
            (context & Context.OptionsWebCompat) < 1 ||
            context & Context.Strict))
      ) {
        reportMessageAt(
          tokenPos,
          parser.line,
          parser.index - 3,
          Errors.ForInOfLoopInitializer,
          parser.token === Token.OfKeyword ? 'of' : 'in'
        );
      }
    }
    // Normal const declarations, and const declarations in for(;;) heads, must be initialized.
  } else if (
    (kind & BindingKind.Const || (token & Token.IsPatternStart) > 0) &&
    (parser.token & Token.IsInOrOf) !== Token.IsInOrOf
  ) {
    report(parser, Errors.DeclarationMissingInitializer, kind & BindingKind.Const ? 'const' : 'destructuring');
  }

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'VariableDeclarator',
    init,
    id
  });
}

/**
 * Parses either For, ForIn or ForOf statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param start Start pos of node
 * @param line
 * @param column

 */
export function parseForStatement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  labels: ESTree.Labels,
  start: number,
  line: number,
  column: number
): ESTree.ForStatement | ESTree.ForInStatement | ESTree.ForOfStatement {
  nextToken(parser, context);

  const forAwait = (context & Context.InAwaitContext) > 0 && consumeOpt(parser, context, Token.AwaitKeyword);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  if (scope) scope = addChildScope(scope, ScopeKind.ForStatement);

  let test: ESTree.Expression | null = null;
  let update: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = 0;
  let init = null;
  let isVarDecl: number = parser.token & Token.VarDecl;
  let right;

  const { token, tokenPos, linePos, colPos } = parser;

  if (isVarDecl) {
    if (token === Token.LetKeyword) {
      init = parseIdentifier(parser, context, 0);
      if (parser.token & (Token.IsIdentifier | Token.IsPatternStart)) {
        if (parser.token === Token.InKeyword) {
          if (context & Context.Strict) report(parser, Errors.DisallowedLetInStrict);
        } else {
          init = finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: parseVariableDeclarationList(
              parser,
              context | Context.DisallowIn,
              scope,
              BindingKind.Let,
              Origin.ForStatement
            )
          });
        }

        parser.assignable = AssignmentKind.Assignable;
      } else if (context & Context.Strict) {
        report(parser, Errors.DisallowedLetInStrict);
      } else {
        isVarDecl = 0;
        parser.assignable = AssignmentKind.Assignable;
        init = parseMemberOrUpdateExpression(parser, context, init, 0, tokenPos, linePos, colPos);

        // `for of` only allows LeftHandSideExpressions which do not start with `let`, and no other production matches
        if (parser.token === Token.OfKeyword) report(parser, Errors.ForOfLet);
      }
    } else {
      nextToken(parser, context);

      init = finishNode(
        parser,
        context,
        tokenPos,
        linePos,
        colPos,
        token === Token.VarKeyword
          ? {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: parseVariableDeclarationList(
                parser,
                context | Context.DisallowIn,
                scope,
                BindingKind.Variable,
                Origin.ForStatement
              )
            }
          : {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: parseVariableDeclarationList(
                parser,
                context | Context.DisallowIn,
                scope,
                BindingKind.Const,
                Origin.ForStatement
              )
            }
      );

      parser.assignable = AssignmentKind.Assignable;
    }
  } else if (token === Token.Semicolon) {
    if (forAwait) report(parser, Errors.InvalidForAwait);
  } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
    init =
      token === Token.LeftBrace
        ? parseObjectLiteralOrPattern(
            parser,
            context,
            void 0,
            1,
            0,
            BindingKind.Empty,
            Origin.ForStatement,
            tokenPos,
            linePos,
            colPos
          )
        : parseArrayExpressionOrPattern(
            parser,
            context,
            void 0,
            1,
            0,
            BindingKind.Empty,
            Origin.ForStatement,
            tokenPos,
            linePos,
            colPos
          );

    destructible = parser.destructible;

    if (context & Context.OptionsWebCompat && destructible & DestructuringKind.SeenProto) {
      report(parser, Errors.DuplicateProto);
    }

    parser.assignable =
      destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

    init = parseMemberOrUpdateExpression(
      parser,
      context | Context.DisallowIn,
      init as ESTree.Expression,
      0,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
  } else {
    init = parseLeftHandSideExpression(parser, context | Context.DisallowIn, 1, 0, tokenPos, linePos, colPos);
  }

  if ((parser.token & Token.IsInOrOf) === Token.IsInOrOf) {
    if (parser.token === Token.OfKeyword) {
      if (parser.assignable & AssignmentKind.CannotAssign)
        report(parser, Errors.CantAssignToInOfForLoop, forAwait ? 'await' : 'of');

      reinterpretToPattern(parser, init);
      nextToken(parser, context | Context.AllowRegExp);

      // IterationStatement:
      //  for(LeftHandSideExpression of AssignmentExpression) Statement
      //  forawait(LeftHandSideExpression of AssignmentExpression) Statement
      right = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);

      consume(parser, context | Context.AllowRegExp, Token.RightParen);

      const body = parseIterationStatementBody(parser, context, scope, labels);

      return finishNode(parser, context, start, line, column, {
        type: 'ForOfStatement',
        body,
        left: init,
        right,
        await: forAwait
      });
    }

    if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.CantAssignToInOfForLoop, 'in');

    reinterpretToPattern(parser, init);
    nextToken(parser, context | Context.AllowRegExp);

    // `for await` only accepts the `for-of` type
    if (forAwait) report(parser, Errors.InvalidForAwait);

    // IterationStatement:
    //  for(LeftHandSideExpression in Expression) Statement
    right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

    consume(parser, context | Context.AllowRegExp, Token.RightParen);
    const body = parseIterationStatementBody(parser, context, scope, labels);

    return finishNode(parser, context, start, line, column, {
      type: 'ForInStatement',
      body,
      left: init,
      right
    });
  }

  if (forAwait) report(parser, Errors.InvalidForAwait);

  if (!isVarDecl) {
    if (destructible & DestructuringKind.HasToDestruct && parser.token !== Token.Assign) {
      report(parser, Errors.ForLoopCantAssignTo);
    }

    init = parseAssignmentExpression(parser, context | Context.DisallowIn, 0, tokenPos, linePos, colPos, init);
  }

  if (parser.token === Token.Comma)
    init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.token !== Token.Semicolon)
    test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.token !== Token.RightParen)
    update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

  consume(parser, context | Context.AllowRegExp, Token.RightParen);

  const body = parseIterationStatementBody(parser, context, scope, labels);

  return finishNode(parser, context, start, line, column, {
    type: 'ForStatement',
    body,
    init,
    test,
    update
  });
}

/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
  @param start Start pos of node
* @param line
* @param column

 */
function parseImportDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  start: number,
  line: number,
  column: number
): ESTree.ImportDeclaration | ESTree.ExpressionStatement {
  // ImportDeclaration :
  //   'import' ImportClause 'from' ModuleSpecifier ';'
  //   'import' ModuleSpecifier ';'
  //
  // ImportClause :
  //   ImportedDefaultBinding
  //   NameSpaceImport
  //   NamedImports
  //   ImportedDefaultBinding ',' NameSpaceImport
  //   ImportedDefaultBinding ',' NamedImports
  //
  // NameSpaceImport :
  //   '*' 'as' ImportedBinding

  nextToken(parser, context);

  let source: ESTree.Literal | null = null;

  // This is `import("...")` call or `import.meta` meta property case.
  //
  // See: https://tc39.github.io/proposal-dynamic-import/#sec-modules
  if (parser.token === Token.LeftParen) return parseImportCallDeclaration(parser, context, start, line, column);

  const { tokenPos, linePos, colPos } = parser;

  const specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[] = [];

  // 'import' ModuleSpecifier ';'
  if (parser.token === Token.StringLiteral) {
    source = parseLiteral(parser, context);
  } else {
    if (parser.token & Token.IsIdentifier) {
      validateBindingIdentifier(parser, context, BindingKind.Const, parser.token, 0);
      if (context & Context.OptionsLexical)
        addBlockName(parser, context, scope, parser.tokenValue, BindingKind.Let, Origin.None);
      const local = parseIdentifier(parser, context, 0);
      specifiers.push(
        finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'ImportDefaultSpecifier',
          local
        })
      );

      // NameSpaceImport
      if (consumeOpt(parser, context, Token.Comma)) {
        switch (parser.token) {
          case Token.Multiply:
            parseImportNamespaceSpecifier(parser, context, scope, specifiers);
            break;

          case Token.LeftBrace:
            parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
            break;

          default:
            report(parser, Errors.InvalidDefaultImport);
        }
      }
    } else if (parser.token === Token.Multiply) {
      parseImportNamespaceSpecifier(parser, context, scope, specifiers);
    } else if (parser.token === Token.LeftBrace) {
      parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
    } else report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

    source = parseModuleSpecifier(parser, context);
  }

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, line, column, {
    type: 'ImportDeclaration',
    specifiers,
    source
  });
}

/**
 * Parse binding identifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-NameSpaceImport)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param specifiers Array of import specifiers
 */
function parseImportNamespaceSpecifier(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[]
): void {
  // NameSpaceImport:
  //  * as ImportedBinding
  const { tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  consume(parser, context, Token.AsKeyword);

  // 'import * as class from "foo":'
  if (parser.token & (Token.IsIdentifier | Token.Contextual)) {
    validateBindingIdentifier(parser, context, BindingKind.Const, parser.token, 0);
  } else {
    reportMessageAt(
      tokenPos,
      parser.line,
      parser.index,
      Errors.UnexpectedToken,
      KeywordDescTable[parser.token & Token.Type]
    );
  }

  if (scope) addBlockName(parser, context, scope, parser.tokenValue, BindingKind.Let, Origin.None);

  const local = parseIdentifier(parser, context, 0);

  specifiers.push(
    finishNode(parser, context, tokenPos, linePos, colPos, {
      type: 'ImportNamespaceSpecifier',
      local
    })
  );
}

/**
 * Parse module specifier
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ModuleSpecifier)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseModuleSpecifier(parser: ParserState, context: Context): ESTree.Literal {
  // ModuleSpecifier :
  //   StringLiteral
  consumeOpt(parser, context, Token.FromKeyword);

  if (parser.token !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Import');

  return parseLiteral(parser, context);
}

function parseImportSpecifierOrNamedImports(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[]
): (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[] {
  // NamedImports :
  //   '{' '}'
  //   '{' ImportsList '}'
  //   '{' ImportsList ',' '}'
  //
  // ImportsList :
  //   ImportSpecifier
  //   ImportsList ',' ImportSpecifier
  //
  // ImportSpecifier :
  //   BindingIdentifier
  //   IdentifierName 'as' BindingIdentifier

  nextToken(parser, context);

  while (parser.token & Token.IsIdentifier) {
    let { token, tokenValue, tokenPos, linePos, colPos } = parser;
    const imported = parseIdentifier(parser, context, 0);
    let local: ESTree.Identifier;

    if (consumeOpt(parser, context, Token.AsKeyword)) {
      if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber || parser.token === Token.Comma) {
        report(parser, Errors.InvalidKeywordAsAlias);
      } else {
        validateBindingIdentifier(parser, context, BindingKind.Const, parser.token, 0);
      }
      tokenValue = parser.tokenValue;
      local = parseIdentifier(parser, context, 0);
    } else {
      // Keywords cannot be bound to themselves, so an import name
      // that is a keyword is a syntax error if it is not followed
      // by the keyword 'as'.
      // See the ImportSpecifier production in ES6 section 15.2.2.
      validateBindingIdentifier(parser, context, BindingKind.Const, token, 0);
      local = imported;
    }

    if (scope) addBlockName(parser, context, scope, tokenValue, BindingKind.Let, Origin.None);

    specifiers.push(
      finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'ImportSpecifier',
        local,
        imported
      })
    );

    if (parser.token !== Token.RightBrace) consume(parser, context, Token.Comma);
  }

  consume(parser, context, Token.RightBrace);

  return specifiers;
}

/**
 * Parse dynamic import declaration
 *
 * @see [Link](https://github.com/tc39/proposal-dynamic-import)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param number
 */
function parseImportCallDeclaration(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  let expr = parseImportExpression(parser, context, /* inGroup */ 0, start, line, column);

  /** MemberExpression :
   *   1. PrimaryExpression
   *   2. MemberExpression [ AssignmentExpression ]
   *   3. MemberExpression . IdentifierName
   *   4. MemberExpression TemplateLiteral
   *
   * CallExpression :
   *   1. MemberExpression Arguments
   *   2. CallExpression ImportCall
   *   3. CallExpression Arguments
   *   4. CallExpression [ AssignmentExpression ]
   *   5. CallExpression . IdentifierName
   *   6. CallExpression TemplateLiteral
   *
   *  UpdateExpression ::
   *   ('++' | '--')? LeftHandSideExpression
   *
   */
  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start, line, column);
}

/**
 * Parse export declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ExportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseExportDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  start: number,
  line: number,
  column: number
): ESTree.ExportAllDeclaration | ESTree.ExportNamedDeclaration | ESTree.ExportDefaultDeclaration {
  // ExportDeclaration:
  //    'export' '*' 'from' ModuleSpecifier ';'
  //    'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';'
  //    'export' ExportClause ('from' ModuleSpecifier)? ';'
  //    'export' VariableStatement
  //    'export' Declaration
  //    'export' 'default'

  // https://tc39.github.io/ecma262/#sec-exports
  nextToken(parser, context | Context.AllowRegExp);

  const specifiers: (ESTree.ExportSpecifier | ESTree.ExportNamespaceSpecifier)[] = [];

  let declaration: ESTree.ExportDeclaration | ESTree.Expression | null = null;
  let source: ESTree.Literal | null = null;
  let key: string;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.DefaultKeyword)) {
    // export default HoistableDeclaration[Default]
    // export default ClassDeclaration[Default]
    // export default [lookahead not-in {function, class}] AssignmentExpression[In] ;

    switch (parser.token) {
      // export default HoistableDeclaration[Default]
      case Token.FunctionKeyword: {
        declaration = parseFunctionDeclaration(
          parser,
          context,
          scope,
          Origin.TopLevel,
          1,
          HoistedFunctionFlags.Hoisted,
          0,
          parser.tokenPos,
          parser.linePos,
          parser.colPos
        );
        break;
      }
      // export default ClassDeclaration[Default]
      // export default  @decl ClassDeclaration[Default]
      case Token.Decorator:
      case Token.ClassKeyword:
        declaration = parseClassDeclaration(
          parser,
          context,
          scope,
          HoistedClassFlags.Hoisted,
          parser.tokenPos,
          parser.linePos,
          parser.colPos
        );
        break;

      // export default HoistableDeclaration[Default]
      case Token.AsyncKeyword:
        const { tokenPos, linePos, colPos } = parser;

        declaration = parseIdentifier(parser, context, 0);

        const { flags } = parser;

        if ((flags & Flags.NewLine) < 1) {
          if (parser.token === Token.FunctionKeyword) {
            declaration = parseFunctionDeclaration(
              parser,
              context,
              scope,
              Origin.TopLevel,
              1,
              HoistedFunctionFlags.Hoisted,
              1,
              tokenPos,
              linePos,
              colPos
            );
          } else {
            if (parser.token === Token.LeftParen) {
              declaration = parseAsyncArrowOrCallExpression(
                parser,
                (context | Context.DisallowIn) ^ Context.DisallowIn,
                declaration,
                1,
                BindingKind.ArgumentList,
                Origin.None,
                flags,
                tokenPos,
                linePos,
                colPos
              );
              declaration = parseMemberOrUpdateExpression(
                parser,
                context,
                declaration as any,
                0,
                tokenPos,
                linePos,
                colPos
              );
              declaration = parseAssignmentExpression(
                parser,
                context,
                0,
                tokenPos,
                linePos,
                colPos,
                declaration as any
              );
            } else if (parser.token & Token.IsIdentifier) {
              if (scope) scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);

              declaration = parseIdentifier(parser, context, 0);
              declaration = parseArrowFunctionExpression(
                parser,
                context,
                scope,
                [declaration],
                1,
                tokenPos,
                linePos,
                colPos
              );
            }
          }
        }
        break;

      default:
        // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
        declaration = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
        matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
    }

    // See: https://www.ecma-international.org/ecma-262/9.0/index.html#sec-exports-static-semantics-exportednames
    if (scope) updateExportsList(parser, 'default');

    return finishNode(parser, context, start, line, column, {
      type: 'ExportDefaultDeclaration',
      declaration
    });
  }

  switch (parser.token) {
    case Token.Multiply: {
      //
      // 'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';'
      //
      // See: https://github.com/tc39/ecma262/pull/1174

      let ecma262PR: 0 | 1 = 0;

      nextToken(parser, context); // Skips: '*'

      if (context & Context.OptionsNext && consumeOpt(parser, context, Token.AsKeyword)) {
        ecma262PR = 1;

        specifiers.push(
          finishNode(parser, context, parser.tokenPos, parser.linePos, parser.colPos, {
            type: 'ExportNamespaceSpecifier',
            specifier: parseIdentifier(parser, context, 0)
          })
        );
      }

      consume(parser, context, Token.FromKeyword);

      if (parser.token !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

      source = parseLiteral(parser, context);

      matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

      return finishNode(
        parser,
        context,
        start,
        line,
        column,
        ecma262PR
          ? {
              type: 'ExportNamedDeclaration',
              source,
              specifiers
            }
          : ({
              type: 'ExportAllDeclaration',
              source
            } as any)
      );
    }
    case Token.LeftBrace: {
      // ExportClause :
      //   '{' '}'
      //   '{' ExportsList '}'
      //   '{' ExportsList ',' '}'
      //
      // ExportsList :
      //   ExportSpecifier
      //   ExportsList ',' ExportSpecifier
      //
      // ExportSpecifier :
      //   IdentifierName
      //   IdentifierName 'as' IdentifierName

      nextToken(parser, context); // Skips: '{'

      const tmpExportedNames: string[] = [];
      const tmpExportedBindings: string[] = [];

      while (parser.token & Token.IsIdentifier) {
        const { tokenPos, tokenValue, linePos, colPos } = parser;
        const local = parseIdentifier(parser, context, 0);

        let exported: ESTree.Identifier | null;

        if (parser.token === Token.AsKeyword) {
          nextToken(parser, context);
          if (scope) {
            tmpExportedNames.push(parser.tokenValue);
            tmpExportedBindings.push(tokenValue);
          }
          exported = parseIdentifier(parser, context, 0);
        } else {
          if (scope) {
            tmpExportedNames.push(parser.tokenValue);
            tmpExportedBindings.push(parser.tokenValue);
          }
          exported = local;
        }

        specifiers.push(
          finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'ExportSpecifier',
            local,
            exported
          })
        );

        if (parser.token !== Token.RightBrace) consume(parser, context, Token.Comma);
      }

      consume(parser, context, Token.RightBrace);

      if (consumeOpt(parser, context, Token.FromKeyword)) {
        //  The left hand side can't be a keyword where there is no
        // 'from' keyword since it references a local binding.
        if (parser.token !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

        source = parseLiteral(parser, context);
      } else if (scope) {
        let i = 0;
        let iMax = tmpExportedNames.length;
        for (; i < iMax; i++) {
          updateExportsList(parser, tmpExportedNames[i]);
        }
        i = 0;
        iMax = tmpExportedBindings.length;

        for (; i < iMax; i++) {
          addBindingToExports(parser, tmpExportedBindings[i]);
        }
      }

      matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

      break;
    }

    case Token.ClassKeyword:
      declaration = parseClassDeclaration(
        parser,
        context,
        scope,
        HoistedClassFlags.Export,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
      break;
    case Token.FunctionKeyword:
      declaration = parseFunctionDeclaration(
        parser,
        context,
        scope,
        Origin.TopLevel,
        1,
        HoistedFunctionFlags.Export,
        0,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
      break;

    case Token.LetKeyword:
      declaration = parseLexicalDeclaration(
        parser,
        context,
        scope,
        BindingKind.Let,
        Origin.Export,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
      break;
    case Token.ConstKeyword:
      declaration = parseLexicalDeclaration(
        parser,
        context,
        scope,
        BindingKind.Const,
        Origin.Export,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
      break;
    case Token.VarKeyword:
      declaration = parseVariableStatement(
        parser,
        context,
        scope,
        Origin.Export,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );
      break;
    case Token.AsyncKeyword:
      const { tokenPos, linePos, colPos } = parser;

      nextToken(parser, context);

      if ((parser.flags & Flags.NewLine) < 1 && parser.token === Token.FunctionKeyword) {
        declaration = parseFunctionDeclaration(
          parser,
          context,
          scope,
          Origin.TopLevel,
          1,
          HoistedFunctionFlags.Export,
          1,
          tokenPos,
          linePos,
          colPos
        );
        if (scope) {
          key = declaration.id ? declaration.id.name : '';
          addBindingToExports(parser, key);
          updateExportsList(parser, key);
        }
        break;
      }
    // falls through
    default:
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'ExportNamedDeclaration',
    source,
    specifiers,
    declaration
  });
}

/**
 * Parses an expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param assignable
 */
export function parseExpression(
  parser: ParserState,
  context: Context,
  allowAssign: 0 | 1,
  identifierPattern: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.Expression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression

  let expr = parsePrimaryExpressionExtended(
    parser,
    context,
    BindingKind.Empty,
    0,
    allowAssign,
    identifierPattern,
    inGroup,
    start,
    line,
    column
  );

  expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, start, line, column);

  return parseAssignmentExpression(parser, context, inGroup, start, line, column, expr);
}

/**
 * Parse sequence expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 */
export function parseSequenceExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number,
  expr: ESTree.AssignmentExpression | ESTree.Expression
): ESTree.SequenceExpression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression
  const expressions: ESTree.Expression[] = [expr];
  while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
    expressions.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
  }

  return finishNode(parser, context, start, line, column, {
    type: 'SequenceExpression',
    expressions
  });
}

/**
 * Parse expression or sequence expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param assignable
 */
export function parseExpressions(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  assignable: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.SequenceExpression | ESTree.Expression {
  const expr = parseExpression(parser, context, assignable, 0, inGroup, start, line, column);
  return parser.token === Token.Comma
    ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
    : expr;
}

/**
 * Parse assignment expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param left ESTree AST node
 */
export function parseAssignmentExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number,
  left: ESTree.ArgumentExpression | ESTree.Expression
): ESTree.ArgumentExpression | ESTree.Expression {
  /** AssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression ::
   *   ConditionalExpression
   *   ArrowFunction
   *   YieldExpression
   *   LeftHandSideExpression AssignmentOperator AssignmentExpression
   */

  const { token } = parser;

  if ((token & Token.IsAssignOp) > 0) {
    if (parser.assignable & AssignmentKind.CannotAssign) {
      report(parser, Errors.CantAssignTo);
    }
    if (
      (token === Token.Assign && (left.type as string) === 'ArrayExpression') ||
      (left.type as string) === 'ObjectExpression'
    ) {
      reinterpretToPattern(parser, left);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

    left = finishNode(parser, context, start, line, column, {
      type: 'AssignmentExpression',
      left,
      operator: KeywordDescTable[token & Token.Type],
      right
    });

    parser.assignable = AssignmentKind.CannotAssign;

    return left;
  }

  /** Binary expression
   *
   * https://tc39.github.io/ecma262/#sec-multiplicative-operators
   *
   */
  if ((token & Token.IsBinaryOp) > 0) {
    // We start using the binary expression parser for prec >= 4 only!
    left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
  }

  /**
   * Conditional expression
   * https://tc39.github.io/ecma262/#prod-ConditionalExpression
   *
   */
  if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
    left = parseConditionalExpression(parser, context, left, start, line, column);
  }

  return left;
}

/**
 * Parse conditional expression
 *
 * Precedence: 3
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param test ESTree AST node
 */
export function parseConditionalExpression(
  parser: ParserState,
  context: Context,
  test: ESTree.Expression,
  start: number,
  line: number,
  column: number
): ESTree.ConditionalExpression {
  // ConditionalExpression ::
  //   LogicalOrExpression
  //   LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
  const consequent = parseExpression(
    parser,
    (context | Context.DisallowIn) ^ Context.DisallowIn,
    1,
    0,
    0,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  consume(parser, context | Context.AllowRegExp, Token.Colon);
  parser.assignable = AssignmentKind.Assignable;
  // In parsing the first assignment expression in conditional
  // expressions we always accept the 'in' keyword; see ECMA-262,
  // section 11.12, page 58.
  const alternate = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(parser, context, start, line, column, {
    type: 'ConditionalExpression',
    test,
    consequent,
    alternate
  });
}

/**
 * Parses binary and unary expressions recursively
 * based on the precedence of the operators encountered.
 *
 * Precedence: 4
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param minPrec The precedence of the last binary expression parsed
 * @param left ESTree AST node
 */
export function parseBinaryExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number,
  minPrec: number,
  operator: Token,
  left: ESTree.ArgumentExpression | ESTree.Expression
): ESTree.ArgumentExpression | ESTree.Expression {
  const bit = -((context & Context.DisallowIn) > 0) & Token.InKeyword;
  let t: Token;
  let prec: number;

  parser.assignable = AssignmentKind.CannotAssign;

  while (parser.token & Token.IsBinaryOp) {
    t = parser.token;
    prec = t & Token.Precedence;

    if ((t & Token.IsLogical && operator & Token.IsCoalesc) || (operator & Token.IsLogical && t & Token.IsCoalesc)) {
      report(parser, Errors.InvalidCoalescing);
    }

    // 0 precedence will terminate binary expression parsing

    if (prec + (((t === Token.Exponentiate) as any) << 8) - (((bit === t) as any) << 12) <= minPrec) break;
    nextToken(parser, context | Context.AllowRegExp);

    left = finishNode(parser, context, start, line, column, {
      type: t & Token.IsLogical ? 'LogicalExpression' : t & Token.IsCoalesc ? 'CoalesceExpression' : 'BinaryExpression',
      left,
      right: parseBinaryExpression(
        parser,
        context,
        inGroup,
        parser.tokenPos,
        parser.linePos,
        parser.colPos,
        prec,
        t,
        parseLeftHandSideExpression(parser, context, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos)
      ),
      operator: KeywordDescTable[t & Token.Type]
    });
  }

  if (parser.token === Token.Assign) report(parser, Errors.CantAssignTo);

  return left;
}

/**
 * Parses unary expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseUnaryExpression(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number,
  inGroup: 0 | 1
): ESTree.UnaryExpression {
  /**
   *  UnaryExpression ::
   *      1) UpdateExpression
   *      2) delete UnaryExpression
   *      3) void UnaryExpression
   *      4) typeof UnaryExpression
   *      5) + UnaryExpression
   *      6) - UnaryExpression
   *      7) ~ UnaryExpression
   *      8) ! UnaryExpression
   *      9) AwaitExpression
   */
  const unaryOperator = parser.token;
  nextToken(parser, context | Context.AllowRegExp);
  const arg = parseLeftHandSideExpression(
    parser,
    context,
    /* assignable*/ 0,
    inGroup,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  if (parser.token === Token.Exponentiate) report(parser, Errors.InvalidExponentationLHS);
  if (context & Context.Strict && unaryOperator === Token.DeleteKeyword) {
    if (arg.type === 'Identifier') {
      report(parser, Errors.StrictDelete);
      // Prohibit delete of private class elements
    } else if (isPropertyWithPrivateFieldKey(arg)) {
      report(parser, Errors.DeletePrivateField);
    }
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'UnaryExpression',
    operator: KeywordDescTable[unaryOperator & Token.Type] as ESTree.UnaryOperator,
    argument: arg,
    prefix: true
  });
}

/**
 * Parse yield expression or 'yield' identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseYieldExpressionOrIdentifier(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.IdentifierOrExpression | ESTree.YieldExpression {
  if (context & Context.InYieldContext) {
    // YieldExpression[In] :
    //     yield
    //     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
    //     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]

    nextToken(parser, context | Context.AllowRegExp);

    if (context & Context.InArgumentList) report(parser, Errors.YieldInParameter);

    if (parser.token === Token.QuestionMark) report(parser, Errors.InvalidTernaryYield);

    let argument: ESTree.Expression | null = null;
    let delegate = false; // yield*

    if ((parser.flags & Flags.NewLine) < 1) {
      delegate = consumeOpt(parser, context | Context.AllowRegExp, Token.Multiply);
      if (parser.token & Token.IsExpressionStart || delegate) {
        argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      }
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'YieldExpression',
      argument,
      delegate
    });
  }

  if (context & Context.Strict) report(parser, Errors.AwaitOrYieldIdentInModule, 'Yield');
  return parseIdentifierOrArrow(parser, context, start, line, column);
}

/**
 * Parse await expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNewExpression
 */
export function parseAwaitExpressionOrIdentifier(
  parser: ParserState,
  context: Context,
  inNewExpression: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.IdentifierOrExpression | ESTree.AwaitExpression {
  if (context & Context.InAwaitContext) {
    if (inNewExpression) report(parser, Errors.InvalidAwaitIdent);

    if (context & Context.InArgumentList) {
      reportMessageAt(parser.index, parser.line, parser.index, Errors.AwaitInParameter);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const argument = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'AwaitExpression',
      argument
    });
  }

  if (context & Context.Module) report(parser, Errors.AwaitOrYieldIdentInModule, 'Await');

  const expr = parseIdentifierOrArrow(parser, context, start, line, column);

  return expr;
}

/**
 * Parses function body
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param origin Binding origin
 * @param firstRestricted
 */
export function parseFunctionBody(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  firstRestricted: Token | undefined,
  scopeError: any
): ESTree.BlockStatement {
  const { tokenPos, linePos, colPos } = parser;

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);

  const body: ESTree.Statement[] = [];
  const prevContext = context;

  if (parser.token !== Token.RightBrace) {
    while (parser.token === Token.StringLiteral) {
      const { index, tokenPos, tokenValue, token } = parser;
      const expr = parseLiteral(parser, context);
      if (isValidStrictMode(parser, index, tokenPos, tokenValue)) {
        context |= Context.Strict;
        // TC39 deemed "use strict" directives to be an error when occurring
        // in the body of a function with non-simple parameter list, on
        // 29/7/2015. https://goo.gl/ueA7Ln
        if (parser.flags & Flags.SimpleParameterList) {
          reportMessageAt(parser.index, parser.line, parser.tokenPos, Errors.IllegalUseStrict);
        }

        if (parser.flags & Flags.Octals) {
          reportMessageAt(parser.index, parser.line, parser.tokenPos, Errors.StrictOctalLiteral);
        }
      }
      body.push(parseDirective(parser, context, expr, token, tokenPos, parser.linePos, parser.colPos));
    }
    if (context & Context.Strict && firstRestricted) {
      if ((firstRestricted & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
        report(parser, Errors.StrictEvalArguments);
      }
      if ((firstRestricted & Token.FutureReserved) === Token.FutureReserved) {
        report(parser, Errors.StrictFunctionName);
      }
    }

    if (
      context & Context.OptionsLexical &&
      scope &&
      (scopeError !== void 0 && (prevContext & Context.Strict) < 1 && (context & Context.InGlobal) < 1)
    ) {
      reportScopeError(scopeError);
    }
  }

  while (parser.token !== Token.RightBrace) {
    body.push(parseStatementListItem(
      parser,
      context,
      scope,
      Origin.TopLevel,
      {},
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    ) as ESTree.Statement);
  }

  consume(
    parser,
    origin & (Origin.Arrow | Origin.Declaration) ? context | Context.AllowRegExp : context,
    Token.RightBrace
  );

  parser.flags &= ~(Flags.SimpleParameterList | Flags.Octals);

  if (parser.token === Token.Assign) report(parser, Errors.InvalidStatementStart);

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'BlockStatement',
    body
  });
}

/**
 * Parse super expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseSuperExpression(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.Super {
  nextToken(parser, context);

  switch (parser.token) {
    case Token.LeftParen: {
      // The super property has to be within a class constructor
      if ((context & Context.SuperCall) < 1) report(parser, Errors.SuperNoConstructor);
      if (context & Context.InClass) report(parser, Errors.UnexpectedPrivateField);
      parser.assignable = AssignmentKind.CannotAssign;
      break;
    }
    case Token.LeftBracket:
    case Token.Period: {
      // new super() is never allowed.
      // super() is only allowed in derived constructor
      if ((context & Context.SuperProperty) < 1) report(parser, Errors.InvalidSuperProperty);
      if (context & Context.InClass) report(parser, Errors.UnexpectedPrivateField);
      parser.assignable = AssignmentKind.Assignable;
      break;
    }
    default:
      report(parser, Errors.UnexpectedToken, 'super');
  }

  return finishNode(parser, context, start, line, column, { type: 'Super' });
}

/**
 * Parses left hand side
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowAssign
 */
export function parseLeftHandSideExpression(
  parser: ParserState,
  context: Context,
  allowAssign: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.Expression {
  // LeftHandSideExpression ::
  //   (PrimaryExpression | MemberExpression) ...

  const expression = parsePrimaryExpressionExtended(
    parser,
    context,
    BindingKind.Empty,
    0,
    allowAssign,
    0,
    inGroup,
    start,
    line,
    column
  );

  return parseMemberOrUpdateExpression(parser, context, expression, inGroup, start, line, column);
}

/**
 * Parses member or update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 * @param inNewExpression
 */
export function parseMemberOrUpdateExpression(
  parser: ParserState,
  context: Context,
  expr: ESTree.Expression,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number,
  chained: 0 | 1 = 0
): any {
  // Update + Member expression
  if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp && (parser.flags & Flags.NewLine) < 1) {
    if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidIncDecTarget);

    const { token } = parser;

    nextToken(parser, context);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'UpdateExpression',
      argument: expr,
      operator: KeywordDescTable[token & Token.Type] as ESTree.UpdateOperator,
      prefix: false
    });
  }

  if (parser.token & Token.IsMemberOrCallExpression) {
    context = context & ~Context.DisallowIn;

    switch (parser.token) {
      /* Property */
      case Token.Period: {
        nextToken(parser, context);

        parser.assignable = AssignmentKind.Assignable;

        const property = parsePropertyOrPrivatePropertyName(parser, context);

        expr = finishNode(parser, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: false,
          property
        });
        break;
      }

      /* Property */
      case Token.LeftBracket: {
        nextToken(parser, context | Context.AllowRegExp);

        const { tokenPos, linePos, colPos } = parser;

        const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);

        consume(parser, context, Token.RightBracket);

        parser.assignable = AssignmentKind.Assignable;

        expr = finishNode(
          parser,
          context,
          start,
          line,
          column,
          chained
            ? {
                type: 'OptionalMemberExpression',
                object: expr,
                computed: true,
                optional: chained === 1,
                property
              }
            : {
                type: 'MemberExpression',
                object: expr,
                computed: true,
                property
              }
        );
        break;
      }

      /* Call */
      case Token.LeftParen: {
        const args = parseArguments(parser, context, inGroup);

        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(
          parser,
          context,
          start,
          line,
          column,
          chained
            ? {
                type: 'OptionalCallExpression',
                callee: expr,
                optional: chained === 1,
                arguments: args
              }
            : {
                type: 'CallExpression',
                callee: expr,
                arguments: args
              }
        );
        break;
      }

      /* Optional chaining */
      case Token.QuestionMarkPeriod: {
        nextToken(parser, context); // skips: '?.'

        if ((parser.token & Token.IsMemberOrCallExpression) === Token.IsMemberOrCallExpression) {
          expr = parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column, 1);
        } else {
          const property = parseIdentifier(parser, context, 0);
          if (parser.token === Token.TemplateSpan) report(parser, Errors.InvalidTaggedTemplateChain);
          expr = finishNode(parser, context, start, line, column, {
            type: 'OptionalMemberExpression',
            object: expr,
            computed: false,
            optional: true,
            property
          } as any);
        }

        parser.assignable = AssignmentKind.CannotAssign;

        break;
      }

      /* Template */
      default: {
        parser.assignable = AssignmentKind.CannotAssign;
        expr = finishNode(parser, context, parser.tokenPos, parser.linePos, parser.colPos, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi:
            parser.token === Token.TemplateContinuation
              ? parseTemplate(parser, context | Context.TaggedTemplate, start, line, column)
              : parseTemplateLiteral(parser, context, start, line, column)
        });
      }
    }

    return parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);
  }
  return expr;
}

/**
 * Parses property or private property name
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parsePropertyOrPrivatePropertyName(parser: ParserState, context: Context): any {
  if ((parser.token & (Token.IsIdentifier | Token.Keyword)) < 1 && parser.token !== Token.PrivateField) {
    report(parser, Errors.InvalidDotProperty);
  }

  return context & Context.OptionsNext && parser.token === Token.PrivateField
    ? parsePrivateName(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
    : parseIdentifier(parser, context, 0);
}

/**
 * Parses expressions such as a literal expression
 * and update expression.
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param type Binding kind
 * @param inNewExpression
 * @param assignable
 */

export function parsePrimaryExpressionExtended(
  parser: ParserState,
  context: Context,
  kind: BindingKind,
  inNewExpression: 0 | 1,
  allowAssign: 0 | 1,
  identifierPattern: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): any {
  // PrimaryExpression ::
  //   'this'
  //   'null'
  //   'true'
  //   'false'
  //   Identifier
  //   Number
  //   String
  //   ArrayLiteral
  //   ObjectLiteral
  //   RegExpLiteral
  //   ClassLiteral
  //   '(' Expression ')'
  //   TemplateLiteral
  //   do Block
  //   AsyncFunctionLiteral
  //   YieldExpression
  //   AwaitExpression

  const { token } = parser;

  /**
   * https://tc39.github.io/ecma262/#sec-unary-operators
   *
   *  UnaryExpression ::
   *      1) UpdateExpression
   *      2) delete UnaryExpression
   *      3) void UnaryExpression
   *      4) typeof UnaryExpression
   *      5) + UnaryExpression
   *      6) - UnaryExpression
   *      7) ~ UnaryExpression
   *      8) ! UnaryExpression
   *      9) AwaitExpression
   *
   */

  if ((token & Token.IsUnaryOp) === Token.IsUnaryOp) {
    if (inNewExpression && (token !== Token.VoidKeyword || token !== Token.TypeofKeyword)) {
      report(parser, Errors.InvalidNewUnary, KeywordDescTable[parser.token & Token.Type]);
    }
    parser.assignable = AssignmentKind.CannotAssign;
    return parseUnaryExpression(parser, context, start, line, column, inGroup);
  }

  /**
   * https://tc39.github.io/ecma262/#sec-unary-operators
   *
   *  UpdateExpression ::
   *   LeftHandSideExpression ('++' | '--')?
   */

  if ((token & Token.IsUpdateOp) === Token.IsUpdateOp) {
    if (inNewExpression) report(parser, Errors.InvalidIncDecNew);

    const { token } = parser;

    nextToken(parser, context | Context.AllowRegExp);

    const arg = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);

    if (parser.assignable & AssignmentKind.CannotAssign) {
      report(
        parser,
        (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments
          ? Errors.NotAssignableLetArgs
          : Errors.InvalidIncDecTarget
      );
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'UpdateExpression',
      argument: arg,
      operator: KeywordDescTable[token & Token.Type] as ESTree.UpdateOperator,
      prefix: true
    });
  }

  /**
   * AwaitExpression ::
   *   awaitUnaryExpression
   */
  if (token === Token.AwaitKeyword) {
    if (inGroup) parser.destructible |= DestructuringKind.Await;
    return parseAwaitExpressionOrIdentifier(parser, context, inNewExpression, start, line, column);
  }

  /**
   * YieldExpression[In] :
   *     yield
   *     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
   *     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]
   */

  if (token === Token.YieldKeyword) {
    if (inGroup) parser.destructible |= DestructuringKind.Yield;

    if (allowAssign) return parseYieldExpressionOrIdentifier(parser, context, start, line, column);

    if (context & ((context & Context.InYieldContext) | Context.Strict))
      report(parser, Errors.DisallowedInContext, 'yield');

    return parseIdentifier(parser, context, 0);
  }

  /**
   *  LexicalBinding ::
   *    BindingIdentifier
   *    BindingPattern
   */

  if (parser.token === Token.LetKeyword) {
    if (context & Context.Strict) report(parser, Errors.StrictInvalidLetInExprPos);
    if (kind & (BindingKind.Let | BindingKind.Const)) report(parser, Errors.InvalidLetBoundName);
  }

  if (context & Context.InClass && parser.token === Token.Arguments) {
    report(parser, Errors.InvalidClassFieldArgEval);
  }

  if ((token & Token.IsIdentifier) === Token.IsIdentifier) {
    const { tokenValue } = parser;

    const expr = parseIdentifier(parser, context | Context.TaggedTemplate, identifierPattern);

    if (token === Token.AsyncKeyword) {
      const { flags } = parser;

      if ((flags & Flags.NewLine) < 1) {
        // async function ...
        if (parser.token === Token.FunctionKeyword) {
          return parseFunctionExpression(parser, context, /* isAsync */ 1, inGroup, start, line, column);
        }

        // async Identifier => ...
        if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
          return parseAsyncArrowAfterIdent(parser, context, void 0, allowAssign, start, line, column);
        }
      }

      // async (...) => ...
      if (!inNewExpression && parser.token === Token.LeftParen) {
        return parseAsyncArrowOrCallExpression(
          parser,
          context,
          expr,
          allowAssign,
          BindingKind.ArgumentList,
          Origin.None,
          flags,
          start,
          line,
          column
        );
      }
    }

    if (token === Token.EscapedReserved) report(parser, Errors.InvalidEscapedKeyword);

    const IsEvalOrArguments = (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments;

    if (parser.token === Token.Arrow) {
      if (inNewExpression) report(parser, Errors.InvalidAsyncArrow);
      parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;
      if (IsEvalOrArguments) {
        if (context & Context.Strict) report(parser, Errors.StrictEvalArguments);
        parser.flags |= Flags.SimpleParameterList;
      } else {
        parser.flags &= ~Flags.SimpleParameterList;
      }

      if (!allowAssign) report(parser, Errors.InvalidAssignmentTarget);

      let scope: ScopeState | undefined = void 0;

      if (context & Context.OptionsLexical) scope = createArrowHeadParsingScope(parser, context, tokenValue);

      return parseArrowFunctionExpression(parser, context, scope, [expr], /* isAsync */ 0, start, line, column);
    }

    parser.assignable =
      context & Context.Strict && IsEvalOrArguments ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

    return expr;
  }

  if ((token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    parser.assignable = AssignmentKind.CannotAssign;
    return parseLiteral(parser, context);
  }

  switch (token) {
    case Token.FunctionKeyword:
      return parseFunctionExpression(parser, context, /* isAsync */ 0, inGroup, start, line, column);
    case Token.LeftBrace:
      return parseObjectLiteral(parser, context, allowAssign ? 0 : 1, inGroup, start, line, column);
    case Token.LeftBracket:
      return parseArrayLiteral(parser, context, allowAssign ? 0 : 1, inGroup, start, line, column);
    case Token.LeftParen:
      return parseParenthesizedExpression(
        parser,
        context & ~Context.DisallowIn,
        allowAssign,
        BindingKind.ArgumentList,
        Origin.None,
        start,
        line,
        column
      );
    case Token.PrivateField:
      return parsePrivateName(parser, context, start, line, column);
    case Token.Decorator:
    case Token.ClassKeyword:
      return parseClassExpression(parser, context, inGroup, start, line, column);
    case Token.RegularExpression:
      return parseRegExpLiteral(parser, context, start, line, column);
    case Token.ThisKeyword:
      return parseThisExpression(parser, context, start, line, column);
    case Token.FalseKeyword:
    case Token.TrueKeyword:
    case Token.NullKeyword:
      return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
    case Token.SuperKeyword:
      return parseSuperExpression(parser, context, start, line, column);
    case Token.TemplateSpan:
      return parseTemplateLiteral(parser, context, start, line, column);
    case Token.TemplateContinuation:
      return parseTemplate(parser, context, start, line, column);
    case Token.NewKeyword:
      return parseNewExpression(parser, context, inGroup, start, line, column);
    case Token.BigIntLiteral:
      return parseBigIntLiteral(parser, context, start, line, column);
    case Token.ImportKeyword:
      return parseImportCallExpression(parser, context, inNewExpression, inGroup, start, line, column);
    case Token.LessThan:
      if (context & Context.OptionsJSX)
        return parseJSXRootElementOrFragment(parser, context, /*inJSXChild*/ 1, start, line, column);
    case Token.Modulo:
      if (context & Context.OptionsV8) return parseV8Intrinsic(parser, context, start, line, column);
    default:
      if (
        context & Context.Strict
          ? (token & Token.IsIdentifier) === Token.IsIdentifier || (token & Token.Contextual) === Token.Contextual
          : (token & Token.IsIdentifier) === Token.IsIdentifier ||
            (token & Token.Contextual) === Token.Contextual ||
            (token & Token.FutureReserved) === Token.FutureReserved
      ) {
        return parseIdentifierOrArrow(parser, context, start, line, column);
      }

      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }
}

/**
 * Parses V8 intrinsic
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 * @param line
 * @param column
 */
export function parseV8Intrinsic(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): any {
  // CallRuntime ::
  //   '%' Identifier Arguments

  nextToken(parser, context); // skips: '%'

  const expr = v8IntrinsicIdentifier(parser, context);

  if (parser.token !== Token.LeftParen) report(parser, Errors.Unexpected);

  return parseMemberOrUpdateExpression(parser, context, expr, 0, start, line, column);
}

/**
 * Parses V8 intrinsic identifier
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function v8IntrinsicIdentifier(parser: ParserState, context: Context): ESTree.Identifier {
  const { tokenValue, tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'V8IntrinsicIdentifier',
    name: tokenValue
  } as any);
}

/**
 * Parses Import call expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 * @param line
 * @param column
 */
function parseImportCallExpression(
  parser: ParserState,
  context: Context,
  inNewExpression: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ImportExpression {
  // ImportCall[Yield, Await]:
  //  import(AssignmentExpression[+In, ?Yield, ?Await])

  if (inNewExpression) report(parser, Errors.InvalidImportNew);

  nextToken(parser, context);

  let expr = parseImportExpression(parser, context, inGroup, start, line, column);

  expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, start, line, column);

  parser.assignable = AssignmentKind.CannotAssign;

  return expr;
}

/**
 * Parses Import expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 */
export function parseImportExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ImportExpression {
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  if (parser.token === Token.Ellipsis) report(parser, Errors.InvalidSpreadInImport);

  const source = parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

  consume(parser, context, Token.RightParen);

  return finishNode(parser, context, start, line, column, {
    type: 'ImportExpression',
    source
  });
}

/**
 * Parses BigInt literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBigIntLiteral(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.BigIntLiteral {
  const { tokenRaw, tokenValue } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    context & Context.OptionsRaw
      ? {
          type: 'BigIntLiteral',
          value: tokenValue,
          bigint: tokenRaw,
          raw: tokenRaw
        }
      : {
          type: 'BigIntLiteral',
          value: tokenValue,
          bigint: tokenRaw
        }
  );
}

/**
 * Parses template literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseTemplateLiteral(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.TemplateLiteral {
  /**
   * Template Literals
   *
   * Template ::
   *   FullTemplate
   *   TemplateHead
   *
   * FullTemplate ::
   *   `TemplateCharactersopt`
   *
   * TemplateHead ::
   *   ` TemplateCharactersopt ${
   *
   * TemplateSubstitutionTail ::
   *   TemplateMiddle
   *   TemplateTail
   *
   * TemplateMiddle ::
   *   } TemplateCharactersopt ${
   *
   * TemplateTail ::
   *   } TemplateCharactersopt `
   *
   * TemplateCharacters ::
   *   TemplateCharacter TemplateCharactersopt
   *
   * TemplateCharacter ::
   *   SourceCharacter but not one of ` or \ or $
   *   $ [lookahead not { ]
   *   \ EscapeSequence
   *   LineContinuation
   */

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions: [],
    quasis: [parseTemplateTail(parser, context, start, line, column)]
  });
}
/**
 * Parses template tail
 *
 * @param parser  Parser object
 * @param context Context masks
 * @returns {ESTree.TemplateElement}
 */
export function parseTemplateTail(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.TemplateElement {
  const { tokenValue, tokenRaw } = parser;

  consume(parser, context, Token.TemplateSpan);

  return finishNode(parser, context, start, line, column, {
    type: 'TemplateElement',
    value: {
      cooked: tokenValue,
      raw: tokenRaw
    },
    tail: true
  });
}

/**
 * Parses template
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseTemplate(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.TemplateLiteral {
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  const quasis = [parseTemplateSpans(parser, context, /* tail */ false)];

  consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);

  const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];

  if (parser.token !== Token.RightBrace) report(parser, Errors.InvalidTemplateContinuation);

  while ((parser.token = scanTemplateTail(parser, context)) !== Token.TemplateSpan) {
    const { tokenPos, linePos, colPos } = parser;
    quasis.push(parseTemplateSpans(parser, context, /* tail */ false));
    consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);
    expressions.push(parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos));
    if (parser.token !== Token.RightBrace) report(parser, Errors.InvalidTemplateContinuation);
  }

  quasis.push(parseTemplateSpans(parser, context, /* tail */ true));

  consume(parser, context, Token.TemplateSpan);

  return finishNode(parser, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions,
    quasis
  });
}

/**
 * Parses template spans
 *
 * @param parser  Parser object
 * @param tail
 */
export function parseTemplateSpans(parser: ParserState, context: Context, tail: boolean): ESTree.TemplateElement {
  const { tokenPos, linePos, colPos } = parser;
  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'TemplateElement',
    value: {
      cooked: parser.tokenValue,
      raw: parser.tokenRaw
    },
    tail
  });
}

/**
 * Parses spread element
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSpreadCall(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.SpreadElement {
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;
  consume(parser, context | Context.AllowRegExp, Token.Ellipsis);
  const argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  parser.assignable = AssignmentKind.Assignable;
  return finishNode(parser, context, start, line, column, {
    type: 'SpreadElement',
    argument
  });
}

/**
 * Parses arguments
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseArguments(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1
): (ESTree.SpreadElement | ESTree.Expression)[] {
  // Arguments ::
  //   '(' (AssignmentExpression)*[','] ')'
  nextToken(parser, context | Context.AllowRegExp);

  const args: (ESTree.Expression | ESTree.SpreadElement)[] = [];

  if (parser.token === Token.RightParen) {
    nextToken(parser, context);
    return args;
  }

  while (parser.token !== Token.RightParen) {
    if (parser.token === Token.Ellipsis) {
      args.push(parseSpreadCall(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    } else {
      args.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }

    if (parser.token !== Token.Comma) break;

    nextToken(parser, context | Context.AllowRegExp);

    if (parser.token === Token.RightParen) break;
  }

  consume(parser, context, Token.RightParen);

  return args;
}

/**
 * Parses an identifier expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseIdentifier(parser: ParserState, context: Context, isPattern: 0 | 1): ESTree.Identifier {
  const { tokenValue, tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  return finishNode(
    parser,
    context,
    tokenPos,
    linePos,
    colPos,
    context & Context.OptionsIdentifierPattern
      ? {
          type: 'Identifier',
          name: tokenValue,
          pattern: isPattern === 1
        }
      : {
          type: 'Identifier',
          name: tokenValue
        }
  );
}

/**
 * Parses an literal expression such as string literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseLiteral(parser: ParserState, context: Context): ESTree.Literal {
  const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  return finishNode(
    parser,
    context,
    tokenPos,
    linePos,
    colPos,
    context & Context.OptionsRaw
      ? {
          type: 'Literal',
          value: tokenValue,
          raw: tokenRaw
        }
      : {
          type: 'Literal',
          value: tokenValue
        }
  );
}

/**
 * Parses null and boolean expressions
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseNullOrTrueOrFalseLiteral(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.Literal {
  const raw = KeywordDescTable[parser.token & Token.Type];
  const value = parser.token === Token.NullKeyword ? null : raw === 'true';

  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    context & Context.OptionsRaw
      ? {
          type: 'Literal',
          value,
          raw
        }
      : {
          type: 'Literal',
          value
        }
  );
}

/**
 * Parses this expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseThisExpression(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ThisExpression {
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(parser, context, start, line, column, {
    type: 'ThisExpression'
  });
}

/**
 * Parse function declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope
 * @param allowGen
 * @param ExportDefault
 * @param isAsync
 * @param start
 */
export function parseFunctionDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  allowGen: 0 | 1,
  flags: HoistedFunctionFlags,
  isAsync: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.FunctionDeclaration {
  // FunctionDeclaration ::
  //   function BindingIdentifier ( FormalParameters ) { FunctionBody }
  //   function ( FormalParameters ) { FunctionBody }
  //
  // GeneratorDeclaration ::
  //   function * BindingIdentifier ( FormalParameters ) { FunctionBody }
  //   function * ( FormalParameters ) { FunctionBody }
  //
  // AsyncFunctionDeclaration ::
  //   async function BindingIdentifier ( FormalParameters ) { FunctionBody }
  //   async function ( FormalParameters ) { FunctionBody }
  //
  // AsyncGeneratorDeclaration ::
  //   async function * BindingIdentifier ( FormalParameters ) { FunctionBody }
  //   async function * ( FormalParameters ) { FunctionBody }

  nextToken(parser, context | Context.AllowRegExp);

  const isGenerator = allowGen ? optionalBit(parser, context, Token.Multiply) : 0;

  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  // Create a new function scope
  let functionScope = scope ? createScope() : void 0;

  if (parser.token === Token.LeftParen) {
    if ((flags & HoistedClassFlags.Hoisted) < 1) report(parser, Errors.DeclNoName, 'Function');
    if (scope) addBindingToExports(parser, '');
  } else {
    // In ES6, a function behaves as a lexical binding, except in
    // a script scope, or the initial scope of eval or another function.
    const type =
      origin & Origin.TopLevel && ((context & Context.InGlobal) < 1 || (context & Context.Module) < 1)
        ? BindingKind.Variable
        : BindingKind.FunctionLexical;

    validateBindingIdentifier(
      parser,
      context | ((context & 0b0000000000000000000_1100_00000000) << 11),
      type,
      parser.token,
      0
    );

    if (scope) {
      if (type & BindingKind.Variable) {
        addVarName(parser, context, scope as ScopeState, parser.tokenValue, type);
      } else {
        addBlockName(parser, context, scope, parser.tokenValue, type, origin);
      }

      functionScope = addChildScope(functionScope, ScopeKind.FunctionRoot);

      if (flags) {
        if (flags & HoistedClassFlags.Hoisted) {
          addBindingToExports(parser, parser.tokenValue);
        } else {
          updateExportsList(parser, parser.tokenValue);
        }
      }
    }

    firstRestricted = parser.token;

    id = parseIdentifier(parser, context, 0);
  }

  context =
    ((context | 0b0000001111011000000_0000_00000000) ^ 0b0000001111011000000_0000_00000000) |
    Context.AllowNewTarget |
    ((isAsync * 2 + isGenerator) << 21);

  if (scope) functionScope = addChildScope(functionScope, ScopeKind.FunctionParams);

  const params = parseFormalParametersOrFormalList(
    parser,
    context | Context.InArgumentList,
    functionScope,
    0,
    BindingKind.ArgumentList
  );

  const body = parseFunctionBody(
    parser,
    (context | Context.InGlobal | Context.InSwitch | Context.InIteration) ^
      (Context.InGlobal | Context.InSwitch | Context.InIteration),
    scope ? addChildScope(functionScope, ScopeKind.FunctionBody) : functionScope,
    Origin.Declaration,
    firstRestricted,
    scope ? (functionScope as ScopeState).scopeError : void 0
  );

  return finishNode(parser, context, start, line, column, {
    type: 'FunctionDeclaration',
    params,
    body,
    async: isAsync === 1,
    generator: isGenerator === 1,
    id
  });
}

/**
 * Parse function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param isAsync
 */
export function parseFunctionExpression(
  parser: ParserState,
  context: Context,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.FunctionExpression {
  // GeneratorExpression:
  //      function* BindingIdentifier [Yield][opt](FormalParameters[Yield]){ GeneratorBody }
  //
  // FunctionExpression:
  //      function BindingIdentifier[opt](FormalParameters){ FunctionBody }

  nextToken(parser, context | Context.AllowRegExp);

  const isGenerator = optionalBit(parser, context, Token.Multiply);
  const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;

  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  // Create a new function scope
  let scope = context & Context.OptionsLexical ? createScope() : void 0;

  if ((parser.token & (Token.IsIdentifier | Token.Keyword | Token.FutureReserved)) > 0) {
    validateBindingIdentifier(
      parser,
      ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags,
      BindingKind.Variable,
      parser.token,
      0
    );

    if (scope) scope = addChildScope(scope, ScopeKind.FunctionRoot);

    firstRestricted = parser.token;
    id = parseIdentifier(parser, context, /* isPattern */ 0);
  }

  context =
    ((context | 0b0000001111011000000_0000_00000000) ^ 0b0000001111011000000_0000_00000000) |
    Context.AllowNewTarget |
    generatorAndAsyncFlags;

  if (scope) scope = addChildScope(scope, ScopeKind.FunctionParams);

  const params = parseFormalParametersOrFormalList(
    parser,
    context | Context.InArgumentList,
    scope,
    inGroup,
    BindingKind.ArgumentList
  );

  const body = parseFunctionBody(
    parser,
    context & ~(0x8001000 | Context.InGlobal | Context.InSwitch | Context.InIteration | Context.InClass),
    scope ? addChildScope(scope, ScopeKind.FunctionBody) : scope,
    0,
    firstRestricted,
    void 0
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'FunctionExpression',
    params,
    body,
    async: isAsync === 1,
    generator: isGenerator === 1,
    id
  });
}

/**
 * Parses array literal expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 */
function parseArrayLiteral(
  parser: ParserState,
  context: Context,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ArrayExpression {
  /* ArrayLiteral :
   *   [ Elisionopt ]
   *   [ ElementList ]
   *   [ ElementList , Elisionopt ]
   *
   * ElementList :
   *   Elisionopt AssignmentExpression
   *   Elisionopt ... AssignmentExpression
   *   ElementList , Elisionopt AssignmentExpression
   *   ElementList , Elisionopt SpreadElement
   *
   * Elision :
   *   ,
   *   Elision ,
   *
   * SpreadElement :
   *   ... AssignmentExpression
   *
   */
  const expr = parseArrayExpressionOrPattern(
    parser,
    context,
    void 0,
    skipInitializer,
    inGroup,
    BindingKind.Empty,
    Origin.None,
    start,
    line,
    column
  );

  if (context & Context.OptionsWebCompat && parser.destructible & DestructuringKind.SeenProto) {
    report(parser, Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.HasToDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  return expr as ESTree.ArrayExpression;
}

/**
 * Parse array expression or pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 * @param BindingKind
 */

export function parseArrayExpressionOrPattern(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.ArrayExpression | ESTree.ArrayPattern | ESTree.AssignmentExpression {
  /* ArrayLiteral :
   *   [ Elisionopt ]
   *   [ ElementList ]
   *   [ ElementList , Elisionopt ]
   *
   * ElementList :
   *   Elisionopt AssignmentExpression
   *   Elisionopt ... AssignmentExpression
   *   ElementList , Elisionopt AssignmentExpression
   *   ElementList , Elisionopt SpreadElement
   *
   * Elision :
   *   ,
   *   Elision ,
   *
   * SpreadElement :
   *   ... AssignmentExpression
   *
   * ArrayAssignmentPattern[Yield] :
   *   [ Elisionopt AssignmentRestElement[?Yield]opt ]
   *   [ AssignmentElementList[?Yield] ]
   *   [ AssignmentElementList[?Yield] , Elisionopt AssignmentRestElement[?Yield]opt ]
   *
   * AssignmentRestElement[Yield] :
   *   ... DestructuringAssignmentTarget[?Yield]
   *
   * AssignmentElementList[Yield] :
   *   AssignmentElisionElement[?Yield]
   *   AssignmentElementList[?Yield] , AssignmentElisionElement[?Yield]
   *
   * AssignmentElisionElement[Yield] :
   *   Elisionopt AssignmentElement[?Yield]
   *
   * AssignmentElement[Yield] :
   *   DestructuringAssignmentTarget[?Yield] Initializer[In,?Yield]opt
   *
   * DestructuringAssignmentTarget[Yield] :
   *   LeftHandSideExpression[?Yield]
   */

  nextToken(parser, context | Context.AllowRegExp);

  const elements: (ESTree.Identifier | ESTree.AssignmentExpression | null)[] = [];
  let destructible: AssignmentKind | DestructuringKind = 0;

  context = context & ~Context.DisallowIn;

  while (parser.token !== Token.RightBracket) {
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
      elements.push(null);
    } else {
      let left: any;

      const { token, tokenPos, linePos, colPos, tokenValue } = parser;

      if (token & Token.IsIdentifier) {
        left = parsePrimaryExpressionExtended(parser, context, kind, 0, 1, 0, inGroup, tokenPos, linePos, colPos);

        if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            reportMessageAt(parser.index, parser.line, parser.index - 3, Errors.CantAssignTo);
          } else if (scope) {
            addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
          }
          const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

          left = finishNode(parser, context, tokenPos, linePos, colPos, {
            type: 'AssignmentExpression',
            operator: '=',
            left,
            right
          });
        } else if (parser.token === Token.Comma || parser.token === Token.RightBracket) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            destructible |= DestructuringKind.CannotDestruct;
          } else if (scope) {
            addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
          }
        } else {
          //if (type) destructible |= DestructuringKind.CannotDestruct;
          destructible |=
            kind & BindingKind.ArgumentList
              ? DestructuringKind.Assignable
              : (kind & BindingKind.Empty) < 1
              ? DestructuringKind.CannotDestruct
              : 0;

          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, tokenPos, linePos, colPos);

          if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
            if (parser.token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
            left = parseAssignmentExpression(parser, context, inGroup, tokenPos, linePos, colPos, left);
          } else if (parser.token !== Token.Assign) {
            destructible |=
              parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.Assignable;
          }
        }

        destructible |=
          parser.destructible & DestructuringKind.Yield
            ? DestructuringKind.Yield
            : 0 | (parser.destructible & DestructuringKind.Await)
            ? DestructuringKind.Await
            : 0;
      } else if (token & Token.IsPatternStart) {
        left =
          parser.token === Token.LeftBrace
            ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, kind, origin, tokenPos, linePos, colPos)
            : parseArrayExpressionOrPattern(
                parser,
                context,
                scope,
                0,
                inGroup,
                kind,
                origin,
                tokenPos,
                linePos,
                colPos
              );

        destructible |= parser.destructible;

        parser.assignable =
          parser.destructible & DestructuringKind.CannotDestruct
            ? AssignmentKind.CannotAssign
            : AssignmentKind.Assignable;

        if (parser.token === Token.Comma || parser.token === Token.RightBracket) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            destructible |= DestructuringKind.CannotDestruct;
          }
        } else if (parser.destructible & DestructuringKind.HasToDestruct) {
          report(parser, Errors.InvalidDestructuringTarget);
        } else {
          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, tokenPos, linePos, colPos);
          destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

          if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
            left = parseAssignmentExpression(parser, context, inGroup, tokenPos, linePos, colPos, left);
          } else if (parser.token !== Token.Assign) {
            destructible |=
              parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.Assignable;
          }
        }
      } else if (token === Token.Ellipsis) {
        left = parseSpreadElement(
          parser,
          context,
          scope,
          Token.RightBracket,
          kind,
          origin,
          0,
          inGroup,
          tokenPos,
          linePos,
          colPos
        );
        destructible |= parser.destructible;
        if (parser.token !== Token.Comma && parser.token !== Token.RightBracket)
          report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
      } else {
        left = parseLeftHandSideExpression(parser, context, 1, 0, tokenPos, linePos, colPos);

        if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
          left = parseAssignmentExpression(parser, context, inGroup, tokenPos, linePos, colPos, left);
          if ((kind & (BindingKind.Empty | BindingKind.ArgumentList)) < 1 && token === Token.LeftParen)
            destructible |= DestructuringKind.CannotDestruct;
        } else if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
        } else if (
          token === Token.LeftParen &&
          parser.assignable & AssignmentKind.Assignable &&
          kind & (BindingKind.Empty | BindingKind.ArgumentList)
        ) {
          destructible |= DestructuringKind.Assignable;
        } else if (token === Token.LeftParen || parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
        }
      }

      elements.push(left);

      if (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        if (parser.token === Token.RightBracket) break;
      } else break;
    }
  }

  consume(parser, context, Token.RightBracket);

  const node = finishNode(parser, context, start, line, column, {
    type: 'ArrayExpression',
    elements
  });

  if (!skipInitializer && parser.token & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, line, column, node);
  }

  parser.destructible = destructible;

  return node;
}

/**
 * Parses array or object assignment pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param destructible
 * @param inGroup
 * @param start Start index
 * @param line Start line
 * @param column Start of column
 * @param node ESTree AST node
 */

function parseArrayOrObjectAssignmentPattern(
  parser: ParserState,
  context: Context,
  destructible: AssignmentKind | DestructuringKind,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number,
  node: ESTree.ArrayExpression | ESTree.ObjectExpression
): ESTree.AssignmentExpression {
  // 12.15.5 Destructuring Assignment
  //
  // AssignmentElement[Yield, Await]:
  //   DestructuringAssignmentTarget[?Yield, ?Await]
  //   DestructuringAssignmentTarget[?Yield, ?Await] Initializer[+In, ?Yield, ?Await]
  //

  if (parser.token !== Token.Assign) report(parser, Errors.CantAssignTo);

  nextToken(parser, context | Context.AllowRegExp);

  if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.CantAssignTo);

  reinterpretToPattern(parser, node);

  const { tokenPos, linePos, colPos } = parser;

  const right = parseExpression(
    parser,
    (context | Context.DisallowIn) ^ Context.DisallowIn,
    1,
    1,
    inGroup,
    tokenPos,
    linePos,
    colPos
  );

  parser.destructible =
    ((destructible | DestructuringKind.SeenProto | DestructuringKind.HasToDestruct) ^
      (DestructuringKind.HasToDestruct | DestructuringKind.SeenProto)) |
    (parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0) |
    (parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0);

  return finishNode(parser, context, start, line, column, {
    type: 'AssignmentExpression',
    left: node,
    operator: '=',
    right
  });
}

/**
 * Parses rest or spread element
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param closingToken
 * @param type Binding kind
 * @param origin Binding origin
 * @param isAsync
 * @param isGroup
 * @param start Start index
 * @param line Start line
 * @param column Start of column
 */
function parseSpreadElement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  closingToken: Token,
  kind: BindingKind,
  origin: Origin,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.SpreadElement {
  nextToken(parser, context | Context.AllowRegExp); // skip '...'

  let argument: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = DestructuringKind.None;

  let { token, tokenPos, linePos, colPos } = parser;

  if (token & (Token.Keyword | Token.IsIdentifier)) {
    parser.assignable = AssignmentKind.Assignable;

    const tokenValue = parser.tokenValue;

    argument = parsePrimaryExpressionExtended(parser, context, kind, 0, 1, 0, inGroup, tokenPos, linePos, colPos);

    token = parser.token;

    argument = parseMemberOrUpdateExpression(
      parser,
      context,
      argument as ESTree.Expression,
      inGroup,
      tokenPos,
      linePos,
      colPos
    );

    if (parser.token !== Token.Comma && parser.token !== closingToken) {
      if (parser.assignable & AssignmentKind.CannotAssign && parser.token === Token.Assign)
        report(parser, Errors.InvalidDestructuringTarget);

      destructible |= DestructuringKind.CannotDestruct;

      argument = parseAssignmentExpression(
        parser,
        context,
        inGroup,
        tokenPos,
        linePos,
        colPos,
        argument as ESTree.ArgumentExpression
      );
    }

    if (parser.assignable & AssignmentKind.CannotAssign) {
      destructible |= DestructuringKind.CannotDestruct;
    } else if (token === closingToken || token === Token.Comma) {
      if (scope) {
        addVarName(parser, context, scope, tokenValue, kind);
        if (origin & Origin.Export) {
          updateExportsList(parser, tokenValue);
        }
      }
    } else {
      destructible |= DestructuringKind.Assignable;
    }

    destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
  } else if (token === closingToken) {
    report(parser, Errors.RestMissingArg);
  } else if (token & Token.IsPatternStart) {
    argument =
      parser.token === Token.LeftBrace
        ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, kind, origin, tokenPos, linePos, colPos)
        : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, kind, origin, tokenPos, linePos, colPos);

    token = parser.token;

    if (token !== Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidDestructuringTarget);

      argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, tokenPos, linePos, colPos);

      destructible |= parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

      token = parser.token;

      if (token !== Token.Comma && token !== closingToken) {
        argument = parseAssignmentExpression(
          parser,
          context,
          inGroup,
          tokenPos,
          linePos,
          colPos,
          argument as ESTree.ArgumentExpression
        );

        if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== Token.Assign) {
        destructible |=
          parser.assignable & AssignmentKind.CannotAssign
            ? DestructuringKind.CannotDestruct
            : DestructuringKind.Assignable;
      }
    } else {
      destructible |=
        closingToken === Token.RightBrace && token !== Token.Assign
          ? DestructuringKind.CannotDestruct
          : parser.destructible;
    }
  } else {
    destructible |= DestructuringKind.Assignable;

    argument = parseLeftHandSideExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

    const { token, tokenPos } = parser;

    if (token === Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.CantAssignToInit);

      argument = parseAssignmentExpression(
        parser,
        context,
        inGroup,
        tokenPos,
        linePos,
        colPos,
        argument as ESTree.ArgumentExpression
      );

      destructible |= DestructuringKind.CannotDestruct;
    } else {
      if (token === Token.Comma) {
        destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== closingToken) {
        argument = parseAssignmentExpression(
          parser,
          context,
          inGroup,
          tokenPos,
          linePos,
          colPos,
          argument as ESTree.ArgumentExpression
        );
      }

      destructible |=
        parser.assignable & AssignmentKind.Assignable ? DestructuringKind.Assignable : DestructuringKind.CannotDestruct;
    }

    parser.destructible = destructible;

    if (parser.token !== closingToken && parser.token !== Token.Comma) report(parser, Errors.UnclosedSpreadElement);

    return finishNode(parser, context, start, line, column, {
      type: 'SpreadElement',
      argument: argument as ESTree.SpreadArgument
    });
  }

  if (parser.token !== closingToken) {
    if (kind & BindingKind.ArgumentList)
      destructible |= isAsync ? DestructuringKind.CannotDestruct : DestructuringKind.Assignable;

    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
      if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.CantAssignTo);

      reinterpretToPattern(parser, argument);

      const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

      argument = finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentExpression',
        left: argument as ESTree.SpreadArgument,
        operator: '=',
        right
      });

      destructible = DestructuringKind.CannotDestruct;
    } else {
      // Note the difference between '|=' and '=' above
      destructible |= DestructuringKind.CannotDestruct;
    }
  }

  parser.destructible = destructible;

  return finishNode(parser, context, start, line, column, {
    type: 'SpreadElement',
    argument: argument as ESTree.SpreadArgument
  });
}

/**
 * Parses method definition
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind
 * @param inGroup
 * @param start Start index
 * @param line Start line
 * @param column Start of column
 */
export function parseMethodDefinition(
  parser: ParserState,
  context: Context,
  kind: PropertyKind,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.FunctionExpression {
  const modifierFlags =
    (kind & PropertyKind.Constructor) < 1 ? 0b0000001111010000000_0000_00000000 : 0b0000000111000000000_0000_00000000;

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    ((kind & 0b0000000000000000000_0000_01011000) << 18) |
    0b0000110000001000000_0000_00000000;

  let scope = context & Context.OptionsLexical ? addChildScope(createScope(), ScopeKind.FunctionParams) : void 0;

  const params = parseMethodFormals(
    parser,
    context | Context.InArgumentList,
    scope,
    kind,
    BindingKind.ArgumentList,
    inGroup
  );

  if (scope) scope = addChildScope(scope, ScopeKind.FunctionBody);

  const body = parseFunctionBody(parser, context & ~(0x8001000 | Context.InGlobal), scope, Origin.None, void 0, void 0);

  return finishNode(parser, context, start, line, column, {
    type: 'FunctionExpression',
    params,
    body,
    async: (kind & PropertyKind.Async) > 0,
    generator: (kind & PropertyKind.Generator) > 0,
    id: null
  });
}

/**
 * Parse object literal or object pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 * @param inGroup
 * @param start Start index
 * @param line Start line
 * @param column Start of column

 */
function parseObjectLiteral(
  parser: ParserState,
  context: Context,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ObjectExpression {
  /**
   * ObjectLiteral
   *   {}
   * {PropertyDefinitionList }
   *
   * {PropertyDefinitionList }
   *
   * PropertyDefinitionList:
   *   PropertyDefinition
   *   PropertyDefinitionList, PropertyDefinition
   *
   * PropertyDefinition:
   *   { IdentifierReference }
   *   { CoverInitializedName }
   *   { PropertyName:AssignmentExpression }
   *
   * MethodDefinition:
   * ...AssignmentExpression
   *
   * PropertyName:
   *   LiteralPropertyName
   *   ComputedPropertyName
   *   LiteralPropertyName:
   *   IdentifierName
   *   StringLiteral
   *   NumericLiteral
   *
   * ComputedPropertyName: AssignmentExpression
   *
   * CoverInitializedName:
   *   IdentifierReference , Initializer
   *
   * Initializer:
   * =AssignmentExpression
   */
  const expr = parseObjectLiteralOrPattern(
    parser,
    context,
    void 0,
    skipInitializer,
    inGroup,
    BindingKind.Empty,
    Origin.None,
    start,
    line,
    column
  );

  if (context & Context.OptionsWebCompat && parser.destructible & DestructuringKind.SeenProto) {
    report(parser, Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.HasToDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  return expr as ESTree.ObjectExpression;
}

/**
 * Parse object literal or object pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer Context masks
 * @param type Binding kind
 */
export function parseObjectLiteralOrPattern(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.ObjectExpression | ESTree.ObjectPattern | ESTree.AssignmentExpression {
  /**
   *
   * ObjectLiteral :
   *   { }
   *   { PropertyDefinitionList }
   *
   * PropertyDefinitionList :
   *   PropertyDefinition
   *   PropertyDefinitionList, PropertyDefinition
   *
   * PropertyDefinition :
   *   IdentifierName
   *   PropertyName : AssignmentExpression
   *
   * PropertyName :
   *   IdentifierName
   *   StringLiteral
   *   NumericLiteral
   *
   *
   * ObjectBindingPattern :
   *   {}
   *   { BindingPropertyList }
   *   { BindingPropertyList , }
   *
   * BindingPropertyList :
   *   BindingProperty
   *   BindingPropertyList , BindingProperty
   *
   * BindingProperty :
   *   SingleNameBinding
   *   PropertyName : BindingElement
   *
   * SingleNameBinding :
   *   BindingIdentifier Initializeropt
   *
   * PropertyDefinition :
   *   IdentifierName
   *   CoverInitializedName
   *   PropertyName : AssignmentExpression
   *   MethodDefinition
   */

  nextToken(parser, context);

  const properties: (ESTree.Property | ESTree.SpreadElement)[] = [];
  let destructible: DestructuringKind | AssignmentKind = 0;
  let prototypeCount = 0;

  while (parser.token !== Token.RightBrace) {
    const { token, tokenValue, linePos, colPos, tokenPos } = parser;

    if (token === Token.Ellipsis) {
      properties.push(
        parseSpreadElement(
          parser,
          context,
          scope,
          Token.RightBrace,
          kind,
          origin,
          0,
          inGroup,
          tokenPos,
          linePos,
          colPos
        )
      );
    } else {
      let state = PropertyKind.None;
      let key: ESTree.Expression | null = null;
      let value;

      if (parser.token & (Token.IsIdentifier | (parser.token & Token.Keyword))) {
        key = parseIdentifier(parser, context, 0);

        if (parser.token === Token.Comma || parser.token === Token.RightBrace || parser.token === Token.Assign) {
          state |= PropertyKind.Shorthand;

          if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
            if (context & Context.Strict) destructible |= DestructuringKind.CannotDestruct;
          } else {
            validateBindingIdentifier(parser, context, kind, token, 0);
          }

          if (scope) addVarOrBlock(parser, context, scope, tokenValue, kind, origin);

          if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
            destructible |= DestructuringKind.HasToDestruct;

            const right = parseExpression(
              parser,
              (context | Context.DisallowIn) ^ Context.DisallowIn,
              1,
              1,
              inGroup,
              parser.tokenPos,
              parser.linePos,
              parser.colPos
            );

            destructible |=
              parser.destructible & DestructuringKind.Yield
                ? DestructuringKind.Yield
                : 0 | (parser.destructible & DestructuringKind.Await)
                ? DestructuringKind.Await
                : 0;

            value = finishNode(parser, context, tokenPos, linePos, colPos, {
              type: 'AssignmentPattern',
              left: key,
              right
            });
          } else {
            destructible |= token === Token.AwaitKeyword ? DestructuringKind.Await : 0;

            value = key;
          }
        } else if (consumeOpt(parser, context | Context.AllowRegExp, Token.Colon)) {
          const idxAfterColon = parser.tokenPos;
          const lineAfterColon = parser.linePos;
          const columnAfterColon = parser.colPos;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.token & Token.IsIdentifier) {
            const tokenAfterColon = parser.token;
            const valueAfterColon = parser.tokenValue;

            value = parsePrimaryExpressionExtended(
              parser,
              context,
              kind,
              0,
              1,
              0,
              inGroup,
              idxAfterColon,
              lineAfterColon,
              columnAfterColon
            );

            const { token } = parser;

            value = parseMemberOrUpdateExpression(
              parser,
              context,
              value,
              inGroup,
              idxAfterColon,
              lineAfterColon,
              columnAfterColon
            );

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else if (scope && (tokenAfterColon & Token.IsIdentifier) === Token.IsIdentifier) {
                  addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                }
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.Assignable
                    ? DestructuringKind.Assignable
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |= DestructuringKind.Assignable;
              } else if (scope) {
                addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
              }
              value = parseAssignmentExpression(
                parser,
                context,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon,
                value
              );
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(
                parser,
                context,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon,
                value
              );
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    idxAfterColon,
                    lineAfterColon,
                    columnAfterColon
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    idxAfterColon,
                    lineAfterColon,
                    columnAfterColon
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (parser.destructible & DestructuringKind.HasToDestruct) {
              report(parser, Errors.InvalidDestructuringTarget);
            } else {
              value = parseMemberOrUpdateExpression(
                parser,
                context,
                value,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon
              );

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (token !== Token.Comma && token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context & ~Context.DisallowIn,
                  inGroup,
                  idxAfterColon,
                  lineAfterColon,
                  columnAfterColon,
                  value
                );

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(
              parser,
              context,
              1,
              inGroup,
              idxAfterColon,
              lineAfterColon,
              columnAfterColon
            );

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(
                parser,
                context,
                value,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon
              );

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (token !== Token.Comma && token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context & ~Context.DisallowIn,
                  inGroup,
                  idxAfterColon,
                  lineAfterColon,
                  columnAfterColon,
                  value
                );
                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              }
            }
          }
        } else if (parser.token === Token.LeftBracket) {
          destructible |= DestructuringKind.CannotDestruct;
          if (token === Token.AsyncKeyword) state |= PropertyKind.Async;
          state |=
            (token === Token.GetKeyword
              ? PropertyKind.Getter
              : token === Token.SetKeyword
              ? PropertyKind.Setter
              : PropertyKind.Method) | PropertyKind.Computed;

          key = parseComputedPropertyName(parser, context, inGroup);
          destructible |= parser.assignable;

          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else if (parser.token & (Token.IsIdentifier | Token.Keyword)) {
          destructible |= DestructuringKind.CannotDestruct;

          if (token === Token.AsyncKeyword) {
            if (parser.flags & Flags.NewLine) report(parser, Errors.AsyncRestrictedProd);
            state |= PropertyKind.Async;
          }
          key = parseIdentifier(parser, context, 0);

          if (token === Token.EscapedReserved) report(parser, Errors.UnexpectedStrictReserved);

          state |=
            token === Token.GetKeyword
              ? PropertyKind.Getter
              : token === Token.SetKeyword
              ? PropertyKind.Setter
              : PropertyKind.Method;

          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else if (parser.token === Token.LeftParen) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Method;
          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else if (parser.token === Token.Multiply) {
          destructible |= DestructuringKind.CannotDestruct;
          if (token === Token.EscapedReserved) report(parser, Errors.InvalidEscapeIdentifier);
          if (token === Token.GetKeyword || token === Token.SetKeyword) {
            report(parser, Errors.InvalidGeneratorGetter);
          }
          nextToken(parser, context);
          state |=
            PropertyKind.Generator | PropertyKind.Method | (token === Token.AsyncKeyword ? PropertyKind.Async : 0);
          if (parser.token & Token.IsIdentifier) {
            key = parseIdentifier(parser, context, 0);
          } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
            key = parseLiteral(parser, context);
          } else if (parser.token === Token.LeftBracket) {
            state |= PropertyKind.Computed;
            key = parseComputedPropertyName(parser, context, inGroup);
            destructible |= parser.assignable;
          } else {
            report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
          }
          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
          if (token === Token.AsyncKeyword) state |= PropertyKind.Async;

          state |=
            token === Token.GetKeyword
              ? PropertyKind.Getter
              : token === Token.SetKeyword
              ? PropertyKind.Setter
              : PropertyKind.Method;
          destructible |= DestructuringKind.CannotDestruct;

          key = parseLiteral(parser, context);

          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else {
          report(parser, Errors.UnexpectedCharAfterObjLit);
        }
      } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
        key = parseLiteral(parser, context);

        if (parser.token === Token.Colon) {
          consume(parser, context | Context.AllowRegExp, Token.Colon);

          const idxAfterColon = parser.tokenPos;
          const lineAfterColon = parser.linePos;
          const columnAfterColon = parser.colPos;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.token & Token.IsIdentifier) {
            value = parsePrimaryExpressionExtended(
              parser,
              context,
              kind,
              0,
              1,
              0,
              inGroup,
              idxAfterColon,
              lineAfterColon,
              columnAfterColon
            );
            const { token, tokenValue: valueAfterColon } = parser;

            value = parseMemberOrUpdateExpression(
              parser,
              context,
              value,
              inGroup,
              idxAfterColon,
              lineAfterColon,
              columnAfterColon
            );

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else if (scope) {
                  addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                }
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.Assignable
                    ? DestructuringKind.Assignable
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(
                parser,
                context & ~Context.DisallowIn,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon,
                value
              );
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(
                parser,
                context & ~Context.DisallowIn,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon,
                value
              );
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    idxAfterColon,
                    lineAfterColon,
                    columnAfterColon
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    idxAfterColon,
                    lineAfterColon,
                    columnAfterColon
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else if ((parser.destructible & DestructuringKind.HasToDestruct) !== DestructuringKind.HasToDestruct) {
              value = parseMemberOrUpdateExpression(
                parser,
                context,
                value,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon
              );
              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context,
                  inGroup,
                  idxAfterColon,
                  lineAfterColon,
                  columnAfterColon,
                  value
                );
              } else if (parser.token !== Token.Assign) {
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, idxAfterColon, lineAfterColon, columnAfterColon);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else {
              value = parseMemberOrUpdateExpression(
                parser,
                context,
                value,
                inGroup,
                idxAfterColon,
                lineAfterColon,
                columnAfterColon
              );

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context & ~Context.DisallowIn,
                  inGroup,
                  idxAfterColon,
                  lineAfterColon,
                  columnAfterColon,
                  value
                );
                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              }
            }
          }
        } else if (parser.token === Token.LeftParen) {
          state |= PropertyKind.Method;
          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
          destructible = parser.assignable | DestructuringKind.CannotDestruct;
        } else {
          report(parser, Errors.InvalidObjLitKey);
        }
      } else if (parser.token === Token.LeftBracket) {
        key = parseComputedPropertyName(parser, context, inGroup);

        destructible |= parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0;

        state |= PropertyKind.Computed;

        if (parser.token === Token.Colon) {
          nextToken(parser, context | Context.AllowRegExp); // skip ':'

          const { tokenPos, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;

          if (parser.token & Token.IsIdentifier) {
            value = parsePrimaryExpressionExtended(parser, context, kind, 0, 1, 0, inGroup, tokenPos, linePos, colPos);

            const { token } = parser;

            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, tokenPos, linePos, colPos);

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else if (scope && (tokenAfterColon & Token.IsIdentifier) === Token.IsIdentifier) {
                  addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                }
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.Assignable
                    ? DestructuringKind.Assignable
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              destructible |=
                parser.assignable & AssignmentKind.CannotAssign
                  ? DestructuringKind.CannotDestruct
                  : token === Token.Assign
                  ? 0
                  : DestructuringKind.Assignable;
              value = parseAssignmentExpression(
                parser,
                (context | Context.DisallowIn) ^ Context.DisallowIn,
                inGroup,
                tokenPos,
                linePos,
                colPos,
                value
              );
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(
                parser,
                (context | Context.DisallowIn) ^ Context.DisallowIn,
                inGroup,
                tokenPos,
                linePos,
                colPos,
                value
              );
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    tokenPos,
                    linePos,
                    colPos
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    kind,
                    origin,
                    tokenPos,
                    linePos,
                    colPos
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (destructible & DestructuringKind.HasToDestruct) {
              report(parser, Errors.InvalidShorthandPropInit);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, tokenPos, linePos, colPos);

              destructible =
                parser.assignable & AssignmentKind.CannotAssign ? destructible | DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context & ~Context.DisallowIn,
                  inGroup,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, tokenPos, linePos, colPos);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, tokenPos, linePos, colPos);

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(
                  parser,
                  context & ~Context.DisallowIn,
                  inGroup,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              }
            }
          }
        } else if (parser.token === Token.LeftParen) {
          state |= PropertyKind.Method;

          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);

          destructible = DestructuringKind.CannotDestruct;
        } else {
          report(parser, Errors.InvalidComputedPropName);
        }
      } else if (token === Token.Multiply) {
        consume(parser, context | Context.AllowRegExp, Token.Multiply);

        state |= PropertyKind.Generator;

        if (parser.token & Token.IsIdentifier) {
          const { token, line, index } = parser;

          key = parseIdentifier(parser, context, 0);

          state |= PropertyKind.Method;

          if (parser.token === Token.LeftParen) {
            destructible |= DestructuringKind.CannotDestruct;
            value = parseMethodDefinition(
              parser,
              context,
              state,
              inGroup,
              parser.tokenPos,
              parser.linePos,
              parser.colPos
            );
          } else {
            reportMessageAt(
              index,
              line,
              index,
              token === Token.AsyncKeyword
                ? Errors.InvalidAsyncGetter
                : token === Token.GetKeyword || parser.token === Token.SetKeyword
                ? Errors.InvalidGetSetGenerator
                : Errors.InvalidGenMethodShorthand,
              KeywordDescTable[token & Token.Type]
            );
          }
        } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
          destructible |= DestructuringKind.CannotDestruct;
          key = parseLiteral(parser, context);
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
        } else if (parser.token === Token.LeftBracket) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Computed | PropertyKind.Method;
          key = parseComputedPropertyName(parser, context, inGroup);
          value = parseMethodDefinition(
            parser,
            context,
            state,
            inGroup,
            parser.tokenPos,
            parser.linePos,
            parser.colPos
          );
        } else {
          report(parser, Errors.InvalidObjLitKeyStar);
        }
      } else {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[token & Token.Type]);
      }

      destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;

      parser.destructible = destructible;

      properties.push(
        finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'Property',
          key: key as ESTree.Expression,
          value,
          kind: !(state & PropertyKind.GetSet) ? 'init' : state & PropertyKind.Setter ? 'set' : 'get',
          computed: (state & PropertyKind.Computed) > 0,
          method: (state & PropertyKind.Method) > 0,
          shorthand: (state & PropertyKind.Shorthand) > 0
        })
      );
    }

    destructible |= parser.destructible;
    if (parser.token !== Token.Comma) break;
    nextToken(parser, context);
  }

  consume(parser, context, Token.RightBrace);

  if (prototypeCount > 1) destructible |= DestructuringKind.SeenProto;

  const node = finishNode(parser, context, start, line, column, {
    type: 'ObjectExpression',
    properties
  });

  if (!skipInitializer && parser.token & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, line, column, node);
  }

  parser.destructible = destructible;

  return node;
}

/**
 * Parses method formals
 *
 * @param parser parser object
 * @param context context masks
 * @param kind
 * @param type Binding kind
 * @param inGroup
 */
export function parseMethodFormals(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  kind: PropertyKind,
  type: BindingKind,
  inGroup: 0 | 1
): ESTree.Parameter[] {
  // FormalParameter[Yield,GeneratorParameter] :
  //   BindingElement[?Yield, ?GeneratorParameter]
  consume(parser, context, Token.LeftParen);
  const params: (ESTree.AssignmentPattern | ESTree.Parameter)[] = [];

  parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

  let setterArgs = 0;

  if (parser.token === Token.RightParen) {
    if (kind & PropertyKind.Setter) {
      report(parser, Errors.AccessorWrongArgs, 'Setter', 'one', '');
    }
    nextToken(parser, context);
    return params;
  }

  if (kind & PropertyKind.Getter) {
    report(parser, Errors.AccessorWrongArgs, 'Getter', 'no', 's');
  }
  if (kind & PropertyKind.Setter && parser.token === Token.Ellipsis) {
    report(parser, Errors.BadSetterRestParameter);
  }

  while (parser.token !== Token.RightParen) {
    let left: ESTree.BindingName | ESTree.SpreadElement | ESTree.AssignmentPattern | null = null;
    const { tokenPos, tokenValue, linePos, colPos } = parser;
    if (parser.token & Token.IsIdentifier) {
      if (
        (context & Context.Strict) < 1 &&
        ((parser.token & Token.FutureReserved) === Token.FutureReserved ||
          (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      ) {
        parser.flags |= Flags.SimpleParameterList;
      }

      if (scope && (parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
        addVarOrBlock(parser, context, scope, tokenValue, BindingKind.ArgumentList, Origin.None);
      }
      left = parseAndClassifyIdentifier(parser, context, type, tokenPos, linePos, colPos);
    } else {
      if (parser.token === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          type,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.token === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          type,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.token === Token.Ellipsis) {
        left = parseSpreadElement(
          parser,
          context,
          scope,
          Token.RightParen,
          type,
          Origin.None,
          0,
          inGroup,
          tokenPos,
          linePos,
          colPos
        );
      }

      parser.flags |= Flags.SimpleParameterList;

      reinterpretToPattern(parser, left);

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidBindingDestruct);

      if (parser.destructible & DestructuringKind.Assignable) report(parser, Errors.InvalidBindingDestruct);
    }

    if (parser.token === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      parser.flags |= Flags.SimpleParameterList;

      const right = parseExpression(
        parser,
        (context | Context.DisallowIn) ^ Context.DisallowIn,
        1,
        1,
        0,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );

      left = finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left: left as ESTree.BindingName,
        right
      });
    }

    setterArgs++;
    params.push(left as any);

    if (parser.token !== Token.RightParen) consume(parser, context, Token.Comma);
  }

  if (kind & PropertyKind.Setter && setterArgs !== 1) {
    report(parser, Errors.AccessorWrongArgs, 'Setter', 'one', '');
  }

  if (scope && scope.scopeError !== void 0) {
    reportScopeError(scope.scopeError);
  }

  consume(parser, context, Token.RightParen);
  return params;
}

/**
 * Parse computed property name
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseComputedPropertyName(parser: ParserState, context: Context, inGroup: 0 | 1): ESTree.Expression {
  // ComputedPropertyName :
  //   [ AssignmentExpression ]
  nextToken(parser, context | Context.AllowRegExp);
  const key = parseExpression(
    parser,
    (context | Context.DisallowIn) ^ Context.DisallowIn,
    1,
    0,
    inGroup,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  consume(parser, context, Token.RightBracket);
  return key;
}

/**
 * Parses an expression which has been parenthesised, or arrow head
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param assignable
 * @param start Start index
 * @param line Start line
 * @param column Start of column
 */
export function parseParenthesizedExpression(
  parser: ParserState,
  context: Context,
  assignable: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): any {
  parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

  nextToken(parser, context | Context.AllowRegExp);

  const scope = context & Context.OptionsLexical ? addChildScope(createScope(), ScopeKind.ArrowParams) : void 0;

  if (consumeOpt(parser, context, Token.RightParen)) {
    // Not valid expression syntax, but this is valid in an arrow function
    // with no params: `() => body`.
    if (!assignable) report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
    return parseArrowFunctionExpression(parser, context, scope, [], /* isAsync */ 0, start, line, column);
  }

  let destructible: AssignmentKind | DestructuringKind = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  let expr;
  let expressions: ESTree.Expression[] = [];
  let isSequence: 0 | 1 = 0;
  let isComplex: 0 | 1 = 0;

  const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;

  parser.assignable = AssignmentKind.Assignable;

  while (parser.token !== Token.RightParen) {
    const { token, tokenPos, linePos, colPos } = parser;

    if (token & (Token.IsIdentifier | Token.Keyword)) {
      if (scope) addBlockName(parser, context, scope, parser.tokenValue, BindingKind.ArgumentList, Origin.None);

      expr = parsePrimaryExpressionExtended(parser, context, kind, 0, 1, 0, 1, tokenPos, linePos, colPos);

      if (parser.token === Token.RightParen || parser.token === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isComplex = 1;
        } else if (
          (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
          (token & Token.FutureReserved) === Token.FutureReserved
        ) {
          isComplex = 1;
        }
      } else {
        if (parser.token === Token.Assign) {
          isComplex = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(parser, context, expr, 1, tokenPos, linePos, colPos);

        if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 1, tokenPos, linePos, colPos, expr);
        }
      }
    } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, kind, origin, tokenPos, linePos, colPos)
          : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, kind, origin, tokenPos, linePos, colPos);

      destructible |= parser.destructible;

      isComplex = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, tokenPos, linePos, colPos);

        destructible |= DestructuringKind.CannotDestruct;

        if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadElement(
        parser,
        context,
        scope,
        Token.RightParen,
        kind,
        origin,
        0,
        1,
        tokenPos,
        linePos,
        colPos
      );

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidRestArg);

      isComplex = 1;

      if (isSequence && (parser.token === Token.RightParen || parser.token === Token.Comma)) {
        expressions.push(expr);
      }
      destructible |= DestructuringKind.HasToDestruct;
      break;
    } else {
      destructible |= DestructuringKind.CannotDestruct;

      expr = parseExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);

      if (isSequence && (parser.token === Token.RightParen || parser.token === Token.Comma)) {
        expressions.push(expr);
      }

      if (parser.token === Token.Comma) {
        if (!isSequence) {
          isSequence = 1;
          expressions = [expr];
        }
      }

      if (isSequence) {
        while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
          expressions.push(parseExpression(parser, context, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
        }

        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(parser, context, iStart, lStart, cStart, {
          type: 'SequenceExpression',
          expressions
        });
      }

      consume(parser, context, Token.RightParen);

      parser.destructible = destructible;

      return expr;
    }

    if (isSequence && (parser.token === Token.RightParen || parser.token === Token.Comma)) {
      expressions.push(expr);
    }

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;

    if (!isSequence) {
      isSequence = 1;
      expressions = [expr];
    }

    if (parser.token === Token.RightParen) {
      destructible |= DestructuringKind.HasToDestruct;
      break;
    }
  }

  if (isSequence) {
    parser.assignable = AssignmentKind.CannotAssign;

    expr = finishNode(parser, context, iStart, lStart, cStart, {
      type: 'SequenceExpression',
      expressions
    });
  }

  consume(parser, context, Token.RightParen);

  if (destructible & DestructuringKind.CannotDestruct && destructible & DestructuringKind.HasToDestruct)
    report(parser, Errors.CantAssignToValidRHS);

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
      ? DestructuringKind.Await
      : 0;

  if (parser.token === Token.Arrow) {
    if (isComplex) parser.flags |= Flags.SimpleParameterList;
    if (!assignable) report(parser, Errors.IllegalArrowFunctionParams);
    if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.IllegalArrowFunctionParams);
    if (destructible & DestructuringKind.Assignable) report(parser, Errors.InvalidArrowDestructLHS);
    if (context & (Context.InAwaitContext | Context.Module) && destructible & DestructuringKind.Await)
      report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield) {
      report(parser, Errors.YieldInParameter);
    }

    return parseArrowFunctionExpression(
      parser,
      context,
      scope,
      isSequence ? expressions : [expr],
      0,
      start,
      line,
      column
    );
  } else if (destructible & DestructuringKind.HasToDestruct) {
    report(parser, Errors.UncompleteArrow);
  }

  parser.destructible = ((parser.destructible | DestructuringKind.Yield) ^ DestructuringKind.Yield) | destructible;

  return context & Context.OptionsPreserveParens
    ? finishNode(parser, context, iStart, lStart, cStart, {
        type: 'ParenthesizedExpression',
        expression: expr
      })
    : expr;
}

/**
 * Parses either an identifier or an arrow function
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param start Start index
 * @param line Start line
 * @param column Start of column

 */
export function parseIdentifierOrArrow(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.Identifier | ESTree.ArrowFunctionExpression {
  const { tokenValue } = parser;

  const expr = parseIdentifier(parser, context, 0);
  parser.assignable = AssignmentKind.Assignable;
  if (parser.token === Token.Arrow) {
    let scope: ScopeState | undefined = void 0;

    if (context & Context.OptionsLexical) scope = createArrowHeadParsingScope(parser, context, tokenValue);

    parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

    return parseArrowFunctionExpression(parser, context, scope, [expr], /* isAsync */ 0, start, line, column);
  }
  return expr;
}
/**
 * Parse arrow function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param params
 * @param isAsync
 * @param start Start index
 * @param line Start line
 * @param column Start of column

 */
export function parseArrowFunctionExpression(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  params: any,
  isAsync: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ArrowFunctionExpression {
  /**
   * ArrowFunction :
   *   ArrowParameters => ConciseBody
   *
   * ArrowParameters :
   *   BindingIdentifer
   *   CoverParenthesizedExpressionAndArrowParameterList
   *
   * CoverParenthesizedExpressionAndArrowParameterList :
   *   ( Expression )
   *   ( )
   *   ( ... BindingIdentifier )
   *   ( Expression , ... BindingIdentifier )
   *
   * ConciseBody :
   *   [lookahead not {] AssignmentExpression
   *   { FunctionBody }
   *
   */

  if (parser.flags & Flags.NewLine) report(parser, Errors.InvalidLineBreak);

  consume(parser, context | Context.AllowRegExp, Token.Arrow);

  for (let i = 0; i < params.length; ++i) reinterpretToPattern(parser, params[i]);

  context = ((context | 0b0000000111100000000_0000_00000000) ^ 0b0000000111100000000_0000_00000000) | (isAsync << 22);

  const expression = parser.token !== Token.LeftBrace;

  let body: ESTree.BlockStatement | ESTree.Expression;

  if (scope && scope.scopeError !== void 0) {
    reportScopeError(scope.scopeError);
  }

  if (expression) {
    // Single-expression body
    body = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  } else {
    if (scope) scope = addChildScope(scope, ScopeKind.FunctionBody);

    body = parseFunctionBody(
      parser,
      (context | 0b0001000000000000001_0000_00000000 | Context.InGlobal | Context.InClass) ^
        (0b0001000000000000001_0000_00000000 | Context.InGlobal | Context.InClass),
      scope,
      Origin.Arrow,
      void 0,
      void 0
    );

    switch (parser.token) {
      case Token.Period:
      case Token.LeftBracket:
      case Token.TemplateSpan:
      case Token.QuestionMark:
        report(parser, Errors.InvalidAccessedBlockBodyArrow);
      case Token.LeftParen:
        report(parser, Errors.InvalidInvokedBlockBodyArrow);
      default: // ignore
    }
    if ((parser.token & Token.IsBinaryOp) === Token.IsBinaryOp && (parser.flags & Flags.NewLine) < 1)
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
    if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp) report(parser, Errors.InvalidArrowPostfix);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'ArrowFunctionExpression',
    body,
    params,
    async: isAsync === 1,
    expression
  });
}

/**
 * Parses formal parameters
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseFormalParametersOrFormalList(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  inGroup: 0 | 1,
  kind: BindingKind
): (ESTree.Parameter)[] {
  /**
   * FormalParameter :
   *    BindingElement
   *
   * FormalParameterList :
   *    [empty]
   *       FunctionRestParameter
   *      FormalsList
   *     FormalsList , FunctionRestParameter
   *
   *     FunctionRestParameter :
   *      ... BindingIdentifier
   *
   *     FormalsList :
   *      FormalParameter
   *     FormalsList , FormalParameter
   *
   *     FormalParameter :
   *      BindingElement
   *
   *     BindingElement :
   *      SingleNameBinding
   *   BindingPattern Initializeropt
   *
   */
  consume(parser, context, Token.LeftParen);

  parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

  const params: ESTree.Parameter[] = [];

  let isComplex: 0 | 1 = 0;

  while (parser.token !== Token.RightParen) {
    let left: any;
    const { tokenPos, tokenValue, linePos, colPos } = parser;
    if (parser.token & Token.IsIdentifier) {
      if (
        (context & Context.Strict) < 1 &&
        ((parser.token & Token.FutureReserved) === Token.FutureReserved ||
          (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      ) {
        isComplex = 1;
      }
      if (scope) {
        // Strict-mode disallows duplicate args. We may not know whether we are
        // in strict mode or not (since the function body hasn't been parsed).
        // In such cases the potential error will be saved on the parser object
        // and thrown later if there was any duplicates.
        addVarOrBlock(parser, context, scope, tokenValue, BindingKind.ArgumentList, Origin.None);
      }
      left = parseAndClassifyIdentifier(parser, context, kind, tokenPos, linePos, colPos);
    } else {
      if (parser.token === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          kind,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.token === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          kind,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.token === Token.Ellipsis) {
        left = parseSpreadElement(
          parser,
          context,
          scope,
          Token.RightParen,
          kind,
          Origin.None,
          0,
          inGroup,
          tokenPos,
          linePos,
          colPos
        );
      } else {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
      }

      isComplex = 1;

      reinterpretToPattern(parser, left);

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidBindingDestruct);

      if (parser.destructible & DestructuringKind.Assignable) report(parser, Errors.InvalidBindingDestruct);
    }

    if (parser.token === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isComplex = 1;

      const right = parseExpression(
        parser,
        (context | Context.DisallowIn) ^ Context.DisallowIn,
        1,
        1,
        inGroup,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      );

      left = finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left,
        right
      });
    }

    params.push(left);

    if (parser.token !== Token.RightParen) consume(parser, context, Token.Comma);
  }

  if (isComplex) parser.flags |= Flags.SimpleParameterList;

  if (scope && ((isComplex || context & Context.Strict) && scope.scopeError !== void 0)) {
    reportScopeError(scope.scopeError);
  }

  consume(parser, context, Token.RightParen);

  return params;
}

/**
 * Parses member or update expression without call expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr  ESTree AST node
 * @param inGroup
 * @param start
 * @param line
 * @param column
 */
export function parseMembeExpressionNoCall(
  parser: ParserState,
  context: Context,
  expr: ESTree.Expression,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): any {
  const { token } = parser;

  if (token & Token.IsMemberOrCallExpression) {
    context = context & ~Context.DisallowIn;

    /* Property */
    if (token === Token.Period) {
      nextToken(parser, context);

      parser.assignable = AssignmentKind.Assignable;

      const property = parsePropertyOrPrivatePropertyName(parser, context);

      return parseMembeExpressionNoCall(
        parser,
        context,
        finishNode(parser, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: false,
          property
        }),
        0,
        start,
        line,
        column
      );
      /* Property */
    } else if (token === Token.LeftBracket) {
      nextToken(parser, context | Context.AllowRegExp);

      const { tokenPos, linePos, colPos } = parser;

      const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);

      consume(parser, context, Token.RightBracket);

      parser.assignable = AssignmentKind.Assignable;

      return parseMembeExpressionNoCall(
        parser,
        context,
        finishNode(parser, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: true,
          property
        }),
        0,
        start,
        line,
        column
      );
      /* Template */
    } else if (token === Token.TemplateContinuation || token === Token.TemplateSpan) {
      parser.assignable = AssignmentKind.CannotAssign;

      return parseMembeExpressionNoCall(
        parser,
        context,
        finishNode(parser, context, parser.tokenPos, parser.linePos, parser.colPos, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi:
            parser.token === Token.TemplateContinuation
              ? parseTemplate(parser, context | Context.TaggedTemplate, start, line, column)
              : parseTemplateLiteral(parser, context, start, line, column)
        }),
        0,
        start,
        line,
        column
      );
    }
  }
  return expr;
}

/**
 * Parses new or new target expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @returns {(ESTree.Expression | ESTree.MetaProperty)}
 */
export function parseNewExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.NewExpression | ESTree.Expression | ESTree.MetaProperty {
  // NewExpression ::
  //   ('new')+ MemberExpression
  //
  // NewTarget ::
  //   'new' '.' 'target'
  //
  // Examples of new expression:
  // - new foo.bar().baz
  // - new foo()()
  // - new new foo()()
  // - new new foo
  // - new new foo()
  // - new new foo().bar().baz
  // - `new.target[await x]`
  // - `new (foo);`
  // - `new (foo)();`
  // - `new foo()();`
  // - `new (await foo);`
  // - `new x(await foo);`
  const id = parseIdentifier(parser, context | Context.AllowRegExp, 0);
  const { tokenPos, linePos, colPos } = parser;

  if (consumeOpt(parser, context, Token.Period)) {
    if (context & Context.AllowNewTarget && parser.token === Token.Target) {
      parser.assignable = AssignmentKind.CannotAssign;
      return parseMetaProperty(parser, context, id, start, line, column);
    }

    report(parser, Errors.InvalidNewTarget);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  const expr = parsePrimaryExpressionExtended(
    parser,
    context,
    BindingKind.Empty,
    1,
    0,
    0,
    inGroup,
    tokenPos,
    linePos,
    colPos
  );

  if (parser.token === Token.QuestionMarkPeriod) report(parser, Errors.InvalidChaining);

  // NewExpression without arguments.
  const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'NewExpression',
    callee,
    arguments: parser.token === Token.LeftParen ? parseArguments(parser, context, inGroup) : []
  });
}

/**
 * Parse meta property
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-StatementList)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param meta ESTree AST node
 */
export function parseMetaProperty(
  parser: ParserState,
  context: Context,
  meta: ESTree.Identifier,
  start: number,
  line: number,
  column: number
): ESTree.MetaProperty {
  const property = parseIdentifier(parser, context, 0);
  return finishNode(parser, context, start, line, column, {
    type: 'MetaProperty',
    meta,
    property
  });
}

/**
 * Parses async expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNewExpression
 * @param assignable
 */

/**
 * Parses async arrow after identifier
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param scope Scope object
 * @param assignable Either true or false
 * @param start Start pos of node
 * @param line Line pos of node
 * @param column Column pos of node
 */
function parseAsyncArrowAfterIdent(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  assignable: 0 | 1,
  start: number,
  line: number,
  column: number
) {
  if (!assignable) report(parser, Errors.InvalidAsyncParamList);
  if (parser.token === Token.AwaitKeyword) report(parser, Errors.AwaitInParameter);
  if (context & (Context.Strict | Context.InYieldContext) && parser.token === Token.YieldKeyword) {
    report(parser, Errors.YieldInParameter);
  }

  if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
    parser.flags |= Flags.SimpleParameterList;
  }

  if (context & Context.OptionsLexical) {
    scope = addChildScope(createScope(), ScopeKind.FunctionBody);
    addBlockName(parser, context, scope, parser.tokenValue, BindingKind.ArgumentList, Origin.None);
  }
  const param = [parseIdentifier(parser, context, 0)];

  // This has to be an async arrow, so let the caller throw on missing arrows etc
  return parseArrowFunctionExpression(parser, context, scope, param, 1, start, line, column);
}

/**
 * Parses async arrow or call expressions
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param callee  ESTree AST node
 * @param assignable
 * @param kind Binding kind
 * @param origin Binding origin
 * @param flags Mutual parser flags
 * @param start Start pos of node
 * @param line Line pos of node
 * @param column Column pos of node
 */

export function parseAsyncArrowOrCallExpression(
  parser: ParserState,
  context: Context,
  callee: ESTree.Identifier | void,
  assignable: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  flags: Flags,
  start: number,
  line: number,
  column: number
): ESTree.CallExpression | ESTree.ArrowFunctionExpression {
  nextToken(parser, context | Context.AllowRegExp);

  const scope = context & Context.OptionsLexical ? addChildScope(createScope(), ScopeKind.ArrowParams) : void 0;

  if (consumeOpt(parser, context, Token.RightParen)) {
    if (parser.token === Token.Arrow) {
      if (flags & Flags.NewLine) report(parser, Errors.InvalidLineBreak);
      if (!assignable) report(parser, Errors.InvalidAsyncParamList);
      return parseArrowFunctionExpression(parser, context, scope, [], /* isAsync */ 1, start, line, column);
    }

    return finishNode(parser, context, start, line, column, {
      type: 'CallExpression',
      callee,
      arguments: []
    });
  }

  let destructible: AssignmentKind | DestructuringKind = 0;
  let expr: any;
  let isComplex: 0 | 1 = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  const params: ESTree.Expression[] = [];

  while (parser.token !== Token.RightParen) {
    const { token, tokenPos, linePos, colPos } = parser;

    if (token & (Token.IsIdentifier | Token.Keyword)) {
      if (scope) {
        addBlockName(parser, context, scope, parser.tokenValue, kind, Origin.None);
      }
      expr = parsePrimaryExpressionExtended(parser, context, kind, 0, 1, 0, 1, tokenPos, linePos, colPos);

      if (parser.token === Token.RightParen || parser.token === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isComplex = 1;
        } else if (
          (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
          (token & Token.FutureReserved) === Token.FutureReserved
        ) {
          isComplex = 1;
        }
      } else {
        if (parser.token === Token.Assign) {
          isComplex = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(parser, context, expr, 1, tokenPos, linePos, colPos);

        if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 1, tokenPos, linePos, colPos, expr);
        }
      }
    } else if (token & Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, kind, origin, tokenPos, linePos, colPos)
          : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, kind, origin, tokenPos, linePos, colPos);

      destructible |= parser.destructible;

      isComplex = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, tokenPos, linePos, colPos);

        destructible |= DestructuringKind.CannotDestruct;

        if (parser.token !== Token.RightParen && parser.token !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, expr);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadElement(
        parser,
        context,
        scope,
        Token.RightParen,
        kind,
        origin,
        1,
        1,
        tokenPos,
        linePos,
        colPos
      );

      destructible |= (parser.token === Token.RightParen ? 0 : DestructuringKind.CannotDestruct) | parser.destructible;

      isComplex = 1;
    } else {
      expr = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);

      destructible = parser.assignable;

      params.push(expr);

      while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        params.push(parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos));
      }

      destructible |= parser.assignable;

      consume(parser, context, Token.RightParen);

      parser.destructible = destructible | DestructuringKind.CannotDestruct;

      parser.assignable = AssignmentKind.CannotAssign;

      return finishNode(parser, context, start, line, column, {
        type: 'CallExpression',
        callee,
        arguments: params
      });
    }

    params.push(expr);

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;
  }

  consume(parser, context, Token.RightParen);

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
      ? DestructuringKind.Await
      : 0;

  if (parser.token === Token.Arrow) {
    if (isComplex) parser.flags |= Flags.SimpleParameterList;
    if (!assignable) report(parser, Errors.IllegalArrowFunctionParams);
    if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.CantAssignToAsyncArrow);
    if (destructible & DestructuringKind.Assignable) report(parser, Errors.InvalidArrowDestructLHS);
    if (parser.flags & Flags.NewLine || flags & Flags.NewLine) report(parser, Errors.InvalidLineBreak);
    if (destructible & DestructuringKind.Await) report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield)
      report(parser, Errors.YieldInParameter);

    return parseArrowFunctionExpression(parser, context, scope, params, /* isAsync */ 1, start, line, column);
  } else if (destructible & DestructuringKind.HasToDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'CallExpression',
    callee,
    arguments: params
  });
}

/**
 * Parse regular expression literal
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-literals-regular-expression-literals)
 *
 * @param parser Parser object
 * @param context Context masks
 */

/**
 * Parses reguar expression literal AST node
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseRegExpLiteral(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.Literal {
  const { tokenRaw, tokenRegExp, tokenValue } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return context & Context.OptionsRaw
    ? finishNode(parser, context, start, line, column, {
        type: 'Literal',
        value: tokenValue,
        regex: tokenRegExp,
        raw: tokenRaw
      })
    : finishNode(parser, context, start, line, column, {
        type: 'Literal',
        value: tokenValue,
        regex: tokenRegExp
      });
}

/**
 * Parse class expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param ExportDefault
 */
export function parseClassDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  flags: HoistedClassFlags,
  start: number,
  line: number,
  column: number
): ESTree.ClassDeclaration {
  // ClassDeclaration ::
  //   'class' Identifier ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   'class' ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   DecoratorList[?Yield, ?Await]optclassBindingIdentifier[?Yield, ?Await]ClassTail[?Yield, ?Await]
  //   DecoratorList[?Yield, ?Await]optclassClassTail[?Yield, ?Await]
  //

  context = (context | Context.InConstructor | Context.Strict) ^ Context.InConstructor;

  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  const decorators: ESTree.Decorator[] = context & Context.OptionsNext ? parseDecorators(parser, context) : [];

  nextToken(parser, context);

  const { tokenValue } = parser;

  if (
    ((parser.token & 0b0000000000000000001_0000_11111111) ^ 0b0000000000000000000_0000_01010100) >
    0b0000000000000000001_0000_00000000
  ) {
    if (isStrictReservedWord(parser, context, parser.token)) {
      report(parser, Errors.UnexpectedStrictReserved);
    }

    if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    }

    if (scope) {
      // A named class creates a new lexical scope with a const binding of the
      // class name for the "inner name".
      addBlockName(parser, context, scope, tokenValue, BindingKind.Class, Origin.None);

      if (flags) {
        if (flags & HoistedClassFlags.Hoisted) {
          addBindingToExports(parser, tokenValue);
        } else {
          updateExportsList(parser, tokenValue);
        }
      }
    }

    id = parseIdentifier(parser, context, 0);
  } else {
    // Only under the "export default" context, class declaration does not require the class name.
    //
    //     ExportDeclaration:
    //         ...
    //         export default ClassDeclaration[~Yield, +Default]
    //         ...
    //
    //     ClassDeclaration[Yield, Default]:
    //         ...
    //         [+Default] class ClassTail[?Yield]
    //
    if ((flags & HoistedClassFlags.Hoisted) < 1) report(parser, Errors.DeclNoName, 'Class');
    if (scope) addBindingToExports(parser, '');
  }
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(parser, inheritedContext, context, scope, BindingKind.Empty, Origin.Declaration, 0);

  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    context & Context.OptionsNext
      ? {
          type: 'ClassDeclaration',
          id,
          superClass,
          decorators,
          body
        }
      : {
          type: 'ClassDeclaration',
          id,
          superClass,
          body
        }
  );
}

/**
 * Parse class expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseClassExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ClassExpression {
  // ClassExpression ::
  //   'class' Identifier ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   'class' ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   DecoratorList[?Yield, ?Await]optclassBindingIdentifier[?Yield, ?Await]ClassTail[?Yield, ?Await]
  //

  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  // All class code is always strict mode implicitly
  context = (context & ~Context.InConstructor) | Context.Strict;

  const decorators: ESTree.Decorator[] = context & Context.OptionsNext ? parseDecorators(parser, context) : [];

  nextToken(parser, context);

  if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
    if (isStrictReservedWord(parser, context, parser.token)) report(parser, Errors.UnexpectedStrictReserved);
    if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      report(parser, Errors.StrictEvalArguments);

    id = parseIdentifier(parser, context, 0);
  }

  // Second set of context masks to fix 'super' edge cases
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(
      parser,
      context,
      0,
      inGroup,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(parser, inheritedContext, context, void 0, BindingKind.Empty, Origin.None, inGroup);

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    context & Context.OptionsNext
      ? {
          type: 'ClassExpression',
          id,
          superClass,
          decorators,
          body
        }
      : {
          type: 'ClassExpression',
          id,
          superClass,
          body
        }
  );
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseDecorators(parser: ParserState, context: Context): ESTree.Decorator[] {
  const list: ESTree.Decorator[] = [];

  while (parser.token === Token.Decorator) {
    list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
  }

  return list;
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 * @param start
 */

export function parseDecoratorList(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.Decorator {
  nextToken(parser, context | Context.AllowRegExp);

  let expression = parsePrimaryExpressionExtended(parser, context, BindingKind.Empty, 0, 1, 0, 0, start, line, column);

  expression = parseMemberOrUpdateExpression(parser, context, expression, 0, start, line, column);

  return finishNode(parser, context, start, line, column, {
    type: 'Decorator',
    expression
  });
}
/**
 * Parses class body
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inheritedContext Second set of context masks
 * @param type Binding kind
 * @param origin  Binding origin
 * @param decorators
 */

export function parseClassBody(
  parser: ParserState,
  context: Context,
  inheritedContext: Context,
  scope: ScopeState | undefined,
  kind: BindingKind,
  origin: Origin,
  inGroup: 0 | 1
): ESTree.ClassBody {
  /**
   * ClassElement :
   *   static MethodDefinition
   *   MethodDefinition
   *   DecoratorList
   *   DecoratorList static MethodDefinition
   *   DecoratorList FieldDefinition
   *   DecoratorList static FieldDefinition
   *
   * MethodDefinition :
   *   ClassElementName ( FormalParameterList ) { FunctionBody }
   *    get ClassElementName ( ) { FunctionBody }
   *    set ClassElementName ( PropertySetParameterList ) { FunctionBody }
   *
   * ClassElementName :
   *   PropertyName
   *   PrivateName
   *
   * PrivateName ::
   *   # IdentifierName
   *
   * IdentifierName ::
   *   IdentifierStart
   *   IdentifierName IdentifierPart
   *
   * IdentifierStart ::
   *   UnicodeIDStart
   *   $
   *   _
   *   \ UnicodeEscapeSequence
   * IdentifierPart::
   *   UnicodeIDContinue
   *   $
   *   \ UnicodeEscapeSequence
   *   <ZWNJ> <ZWJ>
   *
   * UnicodeIDStart::
   *   any Unicode code point with the Unicode property "ID_Start"
   *
   * UnicodeIDContinue::
   *   any Unicode code point with the Unicode property "ID_Continue"
   *
   * GeneratorMethod :
   *   * ClassElementName ( UniqueFormalParameters ){GeneratorBody}
   *
   * AsyncMethod :
   *  async [no LineTerminator here] ClassElementName ( UniqueFormalParameters ) { AsyncFunctionBody }
   *
   * AsyncGeneratorMethod :
   *  async [no LineTerminator here]* ClassElementName ( UniqueFormalParameters ) { AsyncGeneratorBody }
   */

  const { tokenPos, linePos, colPos } = parser;

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);

  parser.flags = (parser.flags | Flags.HasConstructor) ^ Flags.HasConstructor;

  const body: (ESTree.MethodDefinition | ESTree.FieldDefinition)[] = [];
  let decorators: ESTree.Decorator[] = [];

  while (parser.token !== Token.RightBrace) {
    let length = 0;

    // See: https://github.com/tc39/proposal-decorators

    decorators = parseDecorators(parser, context);

    length = decorators.length;

    if (length > 0 && parser.tokenValue === 'constructor') {
      report(parser, Errors.GeneratorConstructor);
    }

    if (parser.token === Token.RightBrace) report(parser, Errors.TrailingDecorators);

    if (consumeOpt(parser, context, Token.Semicolon)) {
      if (length > 0) report(parser, Errors.InvalidDecoratorSemicolon);
      continue;
    }
    body.push(
      parseClassElementList(
        parser,
        context,
        scope,
        inheritedContext,
        kind,
        decorators,
        0,
        inGroup,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      )
    );
  }
  consume(parser, origin & Origin.Declaration ? context | Context.AllowRegExp : context, Token.RightBrace);

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'ClassBody',
    body
  });
}

/**
 * Parses class element list
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inheritedContext Second set of context masks
 * @param type  Binding type
 * @param decorators
 * @param isStatic
 */
function parseClassElementList(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  inheritedContext: Context,
  type: BindingKind,
  decorators: ESTree.Decorator[],
  isStatic: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.MethodDefinition | ESTree.FieldDefinition {
  let kind: PropertyKind = isStatic ? PropertyKind.Static : PropertyKind.None;
  let key: ESTree.Expression | ESTree.PrivateName | null = null;

  const { token, tokenPos, linePos, colPos } = parser;

  if (token & (Token.IsIdentifier | Token.FutureReserved)) {
    key = parseIdentifier(parser, context, 0);

    switch (token) {
      case Token.StaticKeyword:
        if (!isStatic && parser.token !== Token.LeftParen) {
          return parseClassElementList(
            parser,
            context,
            scope,
            inheritedContext,
            type,
            decorators,
            1,
            inGroup,
            start,
            line,
            column
          );
        }
        break;

      case Token.AsyncKeyword:
        if (parser.token !== Token.LeftParen && (parser.flags & Flags.NewLine) < 1) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }

          kind |= PropertyKind.Async | (optionalBit(parser, context, Token.Multiply) ? PropertyKind.Generator : 0);
        }
        break;

      case Token.GetKeyword:
        if (parser.token !== Token.LeftParen) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= PropertyKind.Getter;
        }
        break;

      case Token.SetKeyword:
        if (parser.token !== Token.LeftParen) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= PropertyKind.Setter;
        }
        break;

      default: // ignore
    }
  } else if (token === Token.LeftBracket) {
    kind = PropertyKind.Computed;
    key = parseComputedPropertyName(parser, inheritedContext, inGroup);
  } else if ((token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    key = parseLiteral(parser, context);
  } else if (token === Token.Multiply) {
    kind |= PropertyKind.Generator;
    nextToken(parser, context); // skip: '*'
  } else if (context & Context.OptionsNext && parser.token === Token.PrivateField) {
    kind |= PropertyKind.PrivateField;
    key = parsePrivateName(parser, context, tokenPos, linePos, colPos);
    context = context | Context.InClass;
  } else if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
    kind |= PropertyKind.ClassField;
    context = context | Context.InClass;
  } else {
    report(parser, Errors.Unexpected);
  }

  if (kind & (PropertyKind.Generator | PropertyKind.Async | PropertyKind.GetSet)) {
    if (parser.token & Token.IsIdentifier) {
      key = parseIdentifier(parser, context, 0);
    } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
      key = parseLiteral(parser, context);
    } else if (parser.token === Token.LeftBracket) {
      kind |= PropertyKind.Computed;
      key = parseComputedPropertyName(parser, context, /* inGroup */ 0);
    } else if (context & Context.OptionsNext && parser.token === Token.PrivateField) {
      kind |= PropertyKind.PrivateField;
      key = parsePrivateName(parser, context, tokenPos, linePos, colPos);
    } else report(parser, Errors.InvalidKeyToken);
  }

  if ((kind & PropertyKind.Computed) < 1) {
    if (parser.tokenValue === 'constructor') {
      if ((parser.token & Token.IsClassField) === Token.IsClassField) {
        report(parser, Errors.InvalidClassFieldConstructor);
      } else if ((kind & PropertyKind.Static) < 1 && parser.token === Token.LeftParen) {
        if (kind & (PropertyKind.GetSet | PropertyKind.Async | PropertyKind.ClassField | PropertyKind.Generator)) {
          report(parser, Errors.InvalidConstructor, 'accessor');
        } else if ((context & Context.SuperCall) < 1) {
          if (parser.flags & Flags.HasConstructor) report(parser, Errors.DuplicateConstructor);
          else parser.flags |= Flags.HasConstructor;
        }
      }
      kind |= PropertyKind.Constructor;
    } else if (
      // Static Async Generator Private Methods can be named "#prototype" (class declaration)
      (kind & PropertyKind.PrivateField) < 1 &&
      kind & (PropertyKind.Static | PropertyKind.GetSet | PropertyKind.Generator | PropertyKind.Async) &&
      parser.tokenValue === 'prototype'
    ) {
      report(parser, Errors.StaticPrototype);
    }
  }

  if (context & Context.OptionsNext && parser.token !== Token.LeftParen) {
    return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
  }

  const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    context & Context.OptionsNext
      ? {
          type: 'MethodDefinition',
          kind:
            (kind & PropertyKind.Static) < 1 && kind & PropertyKind.Constructor
              ? 'constructor'
              : kind & PropertyKind.Getter
              ? 'get'
              : kind & PropertyKind.Setter
              ? 'set'
              : 'method',
          static: (kind & PropertyKind.Static) > 0,
          computed: (kind & PropertyKind.Computed) > 0,
          key,
          decorators,
          value
        }
      : {
          type: 'MethodDefinition',
          kind:
            (kind & PropertyKind.Static) < 1 && kind & PropertyKind.Constructor
              ? 'constructor'
              : kind & PropertyKind.Getter
              ? 'get'
              : kind & PropertyKind.Setter
              ? 'set'
              : 'method',
          static: (kind & PropertyKind.Static) > 0,
          computed: (kind & PropertyKind.Computed) > 0,
          key,
          value
        }
  );
}

/**
 * Parses private name
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePrivateName(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.PrivateName {
  // PrivateName::
  //    #IdentifierName
  nextToken(parser, context); // skip: '#'
  const { tokenValue } = parser;
  if (tokenValue === 'constructor') report(parser, Errors.InvalidStaticClassFieldConstructor);
  nextToken(parser, context);

  return finishNode(parser, context, start, line, column, {
    type: 'PrivateName',
    name: tokenValue
  });
}

/**
 * Parses field definition
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param key ESTree AST node
 * @param state
 * @param decorators
 */

export function parseFieldDefinition(
  parser: ParserState,
  context: Context,
  key: ESTree.PrivateName | ESTree.Expression | null,
  state: PropertyKind,
  decorators: ESTree.Decorator[] | null,
  start: number,
  line: number,
  column: number
): ESTree.FieldDefinition {
  //  ClassElement :
  //    MethodDefinition
  //    static MethodDefinition
  //    FieldDefinition ;
  //  ;
  let value: ESTree.Expression | null = null;

  if (state & PropertyKind.Generator) report(parser, Errors.Unexpected);

  if (parser.token === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);

    const { tokenPos, linePos, colPos } = parser;

    if (parser.token === Token.Arguments) report(parser, Errors.StrictEvalArguments);

    value = parsePrimaryExpressionExtended(
      parser,
      context | Context.InClass,
      BindingKind.Empty,
      0,
      1,
      0,
      0,
      tokenPos,
      linePos,
      colPos
    );

    if ((parser.token & Token.IsClassField) !== Token.IsClassField) {
      value = parseMemberOrUpdateExpression(
        parser,
        context | Context.InClass,
        value as ESTree.Expression,
        0,
        tokenPos,
        linePos,
        colPos
      );
      if ((parser.token & Token.IsClassField) !== Token.IsClassField) {
        value = parseAssignmentExpression(
          parser,
          context | Context.InClass,
          0,
          tokenPos,
          linePos,
          colPos,
          value as ESTree.ArgumentExpression
        );
      }
    }
  }

  return finishNode(parser, context, start, line, column, {
    type: 'FieldDefinition',
    key,
    value,
    static: (state & PropertyKind.Static) > 0,
    computed: (state & PropertyKind.Computed) > 0,
    decorators
  } as any);
}

/**
 * Parses binding pattern
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding kind
 */
export function parseBindingPattern(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  type: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.BindingPattern {
  // Pattern ::
  //   Identifier
  //   ArrayLiteral
  //   ObjectLiteral

  if (parser.token & Token.IsIdentifier) {
    if (scope) addVarOrBlock(parser, context, scope, parser.tokenValue, type, origin);

    return parseAndClassifyIdentifier(parser, context, type, start, line, column);
  }

  if ((parser.token & Token.IsPatternStart) !== Token.IsPatternStart)
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

  const left =
    parser.token === Token.LeftBracket
      ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, type, origin, start, line, column)
      : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, type, origin, start, line, column);

  reinterpretToPattern(parser, left);

  if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidBindingDestruct);

  if (parser.destructible & DestructuringKind.Assignable) report(parser, Errors.InvalidBindingDestruct);

  return left;
}

/**
 * Classify and parse identifier if of valid type
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param type Binding kind
 */
function parseAndClassifyIdentifier(
  parser: ParserState,
  context: Context,
  type: BindingKind,
  start: number,
  line: number,
  column: number
): ESTree.Identifier {
  const { tokenValue, token } = parser;

  if (context & Context.Strict) {
    if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    } else if ((token & Token.FutureReserved) === Token.FutureReserved) {
      report(parser, Errors.FutureReservedWordInStrictModeNotId);
    } else if (token === Token.EscapedFutureReserved) {
      report(parser, Errors.InvalidEscapedKeyword);
    }
  }

  if ((token & Token.Reserved) === Token.Reserved) {
    report(parser, Errors.KeywordNotId);
  }

  if (context & (Context.Module | Context.InYieldContext) && token === Token.YieldKeyword) {
    report(parser, Errors.YieldInParameter);
  }
  if (token === Token.LetKeyword) {
    if (type & (BindingKind.Let | BindingKind.Const)) report(parser, Errors.InvalidLetConstBinding);
  }
  if (context & (Context.InAwaitContext | Context.Module) && token === Token.AwaitKeyword) {
    report(parser, Errors.AwaitOutsideAsync);
  }
  if (token === Token.EscapedReserved) {
    report(parser, Errors.InvalidEscapedKeyword);
  }

  nextToken(parser, context);
  return finishNode(parser, context, start, line, column, {
    type: 'Identifier',
    name: tokenValue
  });
}

/**
 * Parses either a JSX element or JSX Fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 * @param start
 * @param line
 * @param column
 */

function parseJSXRootElementOrFragment(
  parser: ParserState,
  context: Context,
  inJSXChild: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.JSXElement | ESTree.JSXFragment {
  nextToken(parser, context);

  // JSX fragments
  if (parser.token === Token.GreaterThan) {
    return finishNode(parser, context, start, line, column, {
      type: 'JSXFragment',
      openingFragment: parseOpeningFragment(parser, context, start, line, column),
      children: parseJSXChildren(parser, context),
      closingFragment: parseJSXClosingFragment(
        parser,
        context,
        inJSXChild,
        parser.tokenPos,
        parser.linePos,
        parser.colPos
      )
    });
  }

  let closingElement: ESTree.JSXClosingElement | null = null;
  let children: ESTree.JSXChild[] = [];

  const openingElement: ESTree.JSXOpeningElement = parseJSXOpeningFragmentOrSelfCloseElement(
    parser,
    context,
    inJSXChild,
    start,
    line,
    column
  );

  if (!openingElement.selfClosing) {
    children = parseJSXChildren(parser, context);
    closingElement = parseJSXClosingElement(
      parser,
      context,
      inJSXChild,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
    const close = isEqualTagName(closingElement.name);
    if (isEqualTagName(openingElement.name) !== close) report(parser, Errors.ExpectedJSXClosingTag, close);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXElement',
    children,
    openingElement,
    closingElement
  });
}

/**
 * Parses JSX opening fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseOpeningFragment(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXOpeningFragment {
  scanJSXToken(parser);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXOpeningFragment'
  });
}

/**
 * Parses JSX Closing element
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 * @param start
 * @param line
 * @param column
 */
function parseJSXClosingElement(
  parser: ParserState,
  context: Context,
  inJSXChild: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.JSXClosingElement {
  consume(parser, context, Token.JSXClose);
  const name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  if (inJSXChild) {
    consume(parser, context, Token.GreaterThan);
  } else {
    parser.token = scanJSXToken(parser);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXClosingElement',
    name
  });
}

/**
 * Parses JSX closing fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 * @param start
 * @param line
 * @param column
 */
export function parseJSXClosingFragment(
  parser: ParserState,
  context: Context,
  inJSXChild: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.JSXClosingFragment {
  consume(parser, context, Token.JSXClose);

  if (inJSXChild) {
    consume(parser, context, Token.GreaterThan);
  } else {
    consume(parser, context, Token.GreaterThan);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXClosingFragment'
  });
}

/**
 * Parses JSX children
 *
 * @param parser Parser object
 * @param context  Context masks
 */
export function parseJSXChildren(parser: ParserState, context: Context): ESTree.JSXChild[] {
  const children: ESTree.JSXChild[] = [];
  while (parser.token !== Token.JSXClose) {
    parser.index = parser.tokenPos = parser.startPos;
    parser.column = parser.colPos = parser.startColumn;
    parser.line = parser.linePos = parser.startLine;
    scanJSXToken(parser);
    children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
  }
  return children;
}

/**
 * Parses a JSX child node
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
function parseJSXChild(parser: ParserState, context: Context, start: number, line: number, column: number): any {
  if (parser.token === Token.JSXText) return parseJSXText(parser, context, start, line, column);
  if (parser.token === Token.LeftBrace)
    return parseJSXExpressionContainer(parser, context, /*inJSXChild*/ 0, /* isAttr */ 0, start, line, column);
  if (parser.token === Token.LessThan)
    return parseJSXRootElementOrFragment(parser, context, /*inJSXChild*/ 0, start, line, column);
  report(parser, Errors.Unexpected);
}

/**
 * Parses JSX Text
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseJSXText(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXText {
  scanJSXToken(parser);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXText',
    value: parser.tokenValue as string
  });
}

/**
 * Parses either a JSX element, JSX Fragment or JSX self close element
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 * @param start
 * @param line
 * @param column
 */
function parseJSXOpeningFragmentOrSelfCloseElement(
  parser: ParserState,
  context: Context,
  inJSXChild: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.JSXOpeningElement {
  if ((parser.token & Token.IsIdentifier) !== Token.IsIdentifier && (parser.token & Token.Keyword) !== Token.Keyword)
    report(parser, Errors.Unexpected);

  const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  const attributes = parseJSXAttributes(parser, context);
  const selfClosing = parser.token === Token.Divide;
  if (parser.token === Token.GreaterThan) {
    scanJSXToken(parser);
  } else {
    consume(parser, context, Token.Divide);
    if (inJSXChild) {
      consume(parser, context, Token.GreaterThan);
    } else {
      scanJSXToken(parser);
    }
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXOpeningElement',
    name: tagName,
    attributes,
    selfClosing
  });
}

/**
 * Parses JSX element name
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
function parseJSXElementName(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXIdentifier | ESTree.JSXMemberExpression | ESTree.JSXNamespacedName {
  scanJSXIdentifier(parser);

  let key: ESTree.JSXIdentifier | ESTree.JSXMemberExpression = parseJSXIdentifier(parser, context, start, line, column);

  // Namespace
  if (parser.token === Token.Colon) return parseJSXNamespacedName(parser, context, key, start, line, column);

  // Member expression
  while (consumeOpt(parser, context, Token.Period)) {
    scanJSXIdentifier(parser);
    key = parseJSXMemberExpression(parser, context, key, start, line, column);
  }
  return key;
}

/**
 * Parses JSX member expression
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseJSXMemberExpression(
  parser: ParserState,
  context: Context,
  object: ESTree.JSXIdentifier | ESTree.JSXMemberExpression,
  start: number,
  line: number,
  column: number
): ESTree.JSXMemberExpression {
  const property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXMemberExpression',
    object,
    property
  });
}

/**
 * Parses JSX attributes
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseJSXAttributes(
  parser: ParserState,
  context: Context
): (ESTree.JSXAttribute | ESTree.JSXSpreadAttribute)[] {
  const attributes: (ESTree.JSXAttribute | ESTree.JSXSpreadAttribute)[] = [];
  while (parser.token !== Token.Divide && parser.token !== Token.GreaterThan) {
    attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
  }
  return attributes;
}

/**
 * Parses JSX Spread attribute
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseJSXSpreadAttribute(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXSpreadAttribute {
  nextToken(parser, context); // skips: '{'
  consume(parser, context, Token.Ellipsis);
  const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context, Token.RightBrace);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXSpreadAttribute',
    argument: expression
  });
}

/**
 * Parses JSX attribute
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
function parseJsxAttribute(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXAttribute | ESTree.JSXSpreadAttribute {
  if (parser.token === Token.LeftBrace) return parseJSXSpreadAttribute(parser, context, start, line, column);
  scanJSXIdentifier(parser);
  let value: ESTree.JSXAttributeValue | null = null;
  let name: ESTree.JSXNamespacedName | ESTree.JSXIdentifier = parseJSXIdentifier(parser, context, start, line, column);

  if (parser.token === Token.Colon) {
    name = parseJSXNamespacedName(parser, context, name, start, line, column);
  }

  // HTML empty attribute
  if (parser.token === Token.Assign) {
    const token = scanJSXAttributeValue(parser, context);
    const { tokenPos, linePos, colPos } = parser;
    switch (token) {
      case Token.StringLiteral:
        value = parseLiteral(parser, context);
        break;
      case Token.LessThan:
        value = parseJSXRootElementOrFragment(parser, context, /*inJSXChild*/ 1, tokenPos, linePos, colPos);
        break;
      case Token.LeftBrace:
        value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
        break;
      default:
        report(parser, Errors.InvalidJSXAttributeValue);
    }
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXAttribute',
    value,
    name
  });
}

/**
 * Parses JSX namespace name
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param namespace
 * @param start
 * @param line
 * @param column
 */

function parseJSXNamespacedName(
  parser: ParserState,
  context: Context,
  namespace: ESTree.JSXIdentifier | ESTree.JSXMemberExpression,
  start: number,
  line: number,
  column: number
): ESTree.JSXNamespacedName {
  consume(parser, context, Token.Colon);
  const name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXNamespacedName',
    namespace,
    name
  });
}

/**
 * Parses JSX Expression container
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 * @param start
 * @param line
 * @param column
 */
function parseJSXExpressionContainer(
  parser: ParserState,
  context: Context,
  inJSXChild: 0 | 1,
  isAttr: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.JSXExpressionContainer | ESTree.JSXSpreadChild {
  nextToken(parser, context);
  const { tokenPos, linePos, colPos } = parser;
  if (parser.token === Token.Ellipsis) return parseJSXSpreadChild(parser, context, tokenPos, linePos, colPos);

  let expression: ESTree.Expression | ESTree.JSXEmptyExpression | null = null;

  if (parser.token === Token.RightBrace) {
    // JSX attributes must only be assigned a non-empty 'expression'
    if (isAttr) report(parser, Errors.InvalidNonEmptyJSXExpr);
    expression = parseJSXEmptyExpression(parser, context, tokenPos, linePos, colPos);
  } else {
    expression = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
  }
  if (inJSXChild) {
    consume(parser, context, Token.RightBrace);
  } else {
    scanJSXToken(parser);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'JSXExpressionContainer',
    expression
  });
}

/**
 * Parses JSX spread child
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
function parseJSXSpreadChild(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXSpreadChild {
  consume(parser, context, Token.Ellipsis);
  const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
  consume(parser, context, Token.RightBrace);
  return finishNode(parser, context, start, line, column, {
    type: 'JSXSpreadChild',
    expression
  });
}

/**
 * Parses JSX empty expression
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
function parseJSXEmptyExpression(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXEmptyExpression {
  return finishNode(parser, context, start, line, column, {
    type: 'JSXEmptyExpression'
  });
}

/**
 * Parses JSX Identifier
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param start
 * @param line
 * @param column
 */
export function parseJSXIdentifier(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.JSXIdentifier {
  const { tokenValue } = parser;
  nextToken(parser, context);

  return finishNode(parser, context, start, line, column, {
    type: 'JSXIdentifier',
    name: tokenValue
  });
}
