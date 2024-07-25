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
  OnInsertedSemicolon,
  OnToken,
  pushComment,
  pushToken,
  reinterpretToPattern,
  DestructuringKind,
  AssignmentKind,
  BindingKind,
  validateBindingIdentifier,
  validateFunctionName,
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
  declareUnboundVariable,
  isEqualTagName,
  isValidStrictMode,
  createArrowHeadParsingScope,
  addVarOrBlock,
  isValidIdentifier,
  classifyIdentifier
} from './common';

/**
 * Create a new parser instance
 */

export function create(
  source: string,
  sourceFile: string | void,
  onComment: OnComment | void,
  onToken: OnToken | void,
  onInsertedSemicolon: OnInsertedSemicolon | void
): ParserState {
  let token = Token.EOF;

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
    linePos: 1,

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
     * Get the current token in the stream to consume
     * This function exists as workaround for TS issue
     * https://github.com/microsoft/TypeScript/issues/9998
     */
    getToken() {
      return token;
    },

    /**
     * Set the current token in the stream to consume
     * This function exists as workaround for TS issue
     * https://github.com/microsoft/TypeScript/issues/9998
     */
    setToken(value: Token) {
      return (token = value);
    },

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

    /**
     * Holds either a function or array used on every comment
     */
    onComment,

    /**
     * Holds either a function or array used on every token
     */
    onToken,

    /**
     * Function invoked with the character offset when automatic semicolon insertion occurs
     */
    onInsertedSemicolon,

    /**
     * Holds leading decorators before "export" or "class" keywords
     */
    leadingDecorators: []
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
  // Enable web compatibility
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
  // Enable React JSX parsing
  jsx?: boolean;
  // Allows comment extraction. Accepts either a callback function or an array
  onComment?: OnComment;
  // Allows detection of automatic semicolon insertion. Accepts a callback function that will be passed the charater offset where the semicolon was inserted
  onInsertedSemicolon?: OnInsertedSemicolon;
  // Allows token extraction. Accepts either a callback function or an array
  onToken?: OnToken;
  // Creates unique key for in ObjectPattern when key value are same
  uniqueKeyInPattern?: boolean;
}

/**
 * Consumes a sequence of tokens and produces an syntax tree
 */
export function parseSource(source: string, options: Options | void, context: Context): ESTree.Program {
  let sourceFile = '';
  let onComment;
  let onInsertedSemicolon;
  let onToken;
  if (options != null) {
    if (options.module) context |= Context.Module | Context.Strict;
    if (options.next) context |= Context.OptionsNext;
    if (options.loc) context |= Context.OptionsLoc;
    if (options.ranges) context |= Context.OptionsRanges;
    if (options.uniqueKeyInPattern) context |= Context.OptionsUniqueKeyInPattern;
    if (options.lexical) context |= Context.OptionsLexical;
    if (options.webcompat) context |= Context.OptionsWebCompat;
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    if (options.raw) context |= Context.OptionsRaw;
    if (options.preserveParens) context |= Context.OptionsPreserveParens;
    if (options.impliedStrict) context |= Context.Strict;
    if (options.jsx) context |= Context.OptionsJSX;
    if (options.source) sourceFile = options.source;
    // Accepts either a callback function to be invoked or an array to collect comments (as the node is constructed)
    if (options.onComment != null) {
      onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
    }
    if (options.onInsertedSemicolon != null) onInsertedSemicolon = options.onInsertedSemicolon;
    // Accepts either a callback function to be invoked or an array to collect tokens
    if (options.onToken != null) {
      onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
    }
  }

  // Initialize parser state
  const parser = create(source, sourceFile, onComment, onToken, onInsertedSemicolon);

  // See: https://github.com/tc39/proposal-hashbang
  skipHashBang(parser);

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
    node.range = [0, source.length];
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

  nextToken(parser, context | Context.AllowRegExp | Context.AllowEscapedKeyword);

  const statements: ESTree.Statement[] = [];

  while (parser.getToken() === Token.StringLiteral) {
    // "use strict" must be the exact literal without escape sequences or line continuation.
    const { index, tokenPos, tokenValue, linePos, colPos } = parser;
    const token = parser.getToken();
    const expr = parseLiteral(parser, context);
    if (isValidStrictMode(parser, index, tokenPos, tokenValue)) context |= Context.Strict;
    statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
  }

  while (parser.getToken() !== Token.EOF) {
    statements.push(parseStatementListItem(parser, context, scope, Origin.TopLevel, {}) as ESTree.Statement);
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
): ReturnType<typeof parseDirective | typeof parseModuleItem>[] {
  // ecma262/#prod-Module
  // Module :
  //    ModuleBody?
  //
  // ecma262/#prod-ModuleItemList
  // ModuleBody :
  //    ModuleItem*

  nextToken(parser, context | Context.AllowRegExp);

  const statements: ReturnType<typeof parseDirective | typeof parseModuleItem>[] = [];

  // Avoid this if we're not going to create any directive nodes. This is likely to be the case
  // most of the time, considering the prevalence of strict mode and the fact modules
  // are already in strict mode.
  if (context & Context.OptionsDirectives) {
    while (parser.getToken() === Token.StringLiteral) {
      const { tokenPos, linePos, colPos } = parser;
      const token = parser.getToken();
      statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
    }
  }

  while (parser.getToken() !== Token.EOF) {
    statements.push(parseModuleItem(parser, context, scope) as ESTree.Statement);
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
 */

export function parseModuleItem(parser: ParserState, context: Context, scope: ScopeState | undefined): any {
  // Support legacy decorators before export keyword.
  parser.leadingDecorators = parseDecorators(parser, context);

  // ecma262/#prod-ModuleItem
  // ModuleItem :
  //    ImportDeclaration
  //    ExportDeclaration
  //    StatementListItem

  let moduleItem;
  switch (parser.getToken()) {
    case Token.ExportKeyword:
      moduleItem = parseExportDeclaration(parser, context, scope);
      break;
    case Token.ImportKeyword:
      moduleItem = parseImportDeclaration(parser, context, scope);
      break;
    default:
      moduleItem = parseStatementListItem(parser, context, scope, Origin.TopLevel, {});
  }

  if (parser.leadingDecorators.length) {
    report(parser, Errors.InvalidLeadingDecorator);
  }
  return moduleItem;
}

/**
 *  Parse statement list
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 */

export function parseStatementListItem(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  origin: Origin,
  labels: ESTree.Labels
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
  const start = parser.tokenPos;
  const line = parser.linePos;
  const column = parser.colPos;

  switch (parser.getToken()) {
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

    case Token.Decorator: // @decorator
    case Token.ClassKeyword: // ClassDeclaration[?Yield, ~Default]
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
      switch (parser.getToken()) {
        case Token.LeftParen:
          return parseImportCallDeclaration(parser, context, start, line, column);
        case Token.Period:
          return parseImportMetaDeclaration(parser, context, start, line, column);
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

  switch (parser.getToken()) {
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
          : (context & Context.OptionsWebCompat) === 0
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

  const { tokenValue } = parser;
  const token = parser.getToken();

  let expr: ESTree.Expression;

  switch (token) {
    case Token.LetKeyword:
      expr = parseIdentifier(parser, context);
      if (context & Context.Strict) report(parser, Errors.UnexpectedLetStrictReserved);

      // "let" followed by either "[", "{" or an identifier means a lexical
      // declaration, which should not appear here.
      // However, ASI may insert a line break before an identifier or a brace.
      if (parser.getToken() === Token.LeftBracket) report(parser, Errors.RestrictedLetProduction);

      break;

    default:
      expr = parsePrimaryExpression(
        parser,
        context,
        BindingKind.Empty,
        0,
        1,
        0,
        1,
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
  if (token & Token.IsIdentifier && parser.getToken() === Token.Colon) {
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

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);

  /** AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */

  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr as ESTree.ArgumentExpression);

  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.getToken() === Token.Comma) {
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
  while (parser.getToken() !== Token.RightBrace) {
    body.push(parseStatementListItem(parser, context, scope, Origin.BlockStatement, { $: labels }) as any);
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
  if ((context & Context.OptionsGlobalReturn) === 0 && context & Context.InGlobal) report(parser, Errors.IllegalReturn);

  nextToken(parser, context | Context.AllowRegExp);

  const argument =
    parser.flags & Flags.NewLine || parser.getToken() & Token.IsAutoSemicolon
      ? null
      : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

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
    (context & Context.Strict) === 0 &&
    context & Context.OptionsWebCompat &&
    // In sloppy mode, Annex B.3.2 allows labelled function declarations.
    // Otherwise it's a parse error.
    parser.getToken() === Token.FunctionKeyword
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

  const { tokenValue } = parser;
  const token = parser.getToken();

  let expr: ESTree.Expression = parseIdentifier(parser, context);

  if (parser.getToken() === Token.Colon) {
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
    if (parser.getToken() === Token.FunctionKeyword) {
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
    if ((parser.getToken() & Token.IsIdentifier) === Token.IsIdentifier) {
      /** ArrowFunction[In, Yield, Await]:
       *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
       */
      expr = parseAsyncArrowAfterIdent(parser, context, /* assignable */ 1, start, line, column);
      if (parser.getToken() === Token.Comma)
        expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);

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
  if (parser.getToken() === Token.LeftParen) {
    expr = parseAsyncArrowOrCallExpression(
      parser,
      context,
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
    if (parser.getToken() === Token.Arrow) {
      classifyIdentifier(parser, context, token);
      expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
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

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);

  /** AssignmentExpression :
   *
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */
  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr as ESTree.ArgumentExpression);

  parser.assignable = AssignmentKind.Assignable;

  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }

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
  if (token !== Token.Semicolon) {
    parser.assignable = AssignmentKind.CannotAssign;

    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);

    if (parser.getToken() !== Token.Semicolon) {
      expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);

      if (parser.getToken() === Token.Comma) {
        expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
      }
    }

    matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  }

  return context & Context.OptionsDirectives && expression.type === 'Literal' && typeof expression.value === 'string'
    ? finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression,
        // OptionsRaw is implicitly turned on by OptionsDirectives.
        directive: (expression.raw as string).slice(1, -1)
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
  if (parser.getToken() === Token.ElseKeyword) {
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
    // Disallow if web compatibility is off
    (context & Context.OptionsWebCompat) === 0 ||
    parser.getToken() !== Token.FunctionKeyword
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
  while (parser.getToken() !== Token.RightBrace) {
    const { tokenPos, linePos, colPos } = parser;
    let test: ESTree.Expression | null = null;
    const consequent: ESTree.Statement[] = [];
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.CaseKeyword)) {
      test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
    } else {
      consume(parser, context | Context.AllowRegExp, Token.DefaultKeyword);
      if (seenDefault) report(parser, Errors.MultipleDefaultsInSwitch);
      seenDefault = 1;
    }
    consume(parser, context | Context.AllowRegExp, Token.Colon);
    while (
      parser.getToken() !== Token.CaseKeyword &&
      parser.getToken() !== Token.RightBrace &&
      parser.getToken() !== Token.DefaultKeyword
    ) {
      consequent.push(
        parseStatementListItem(parser, context | Context.InSwitch, scope, Origin.BlockStatement, {
          $: labels
        }) as ESTree.Statement
      );
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
  if ((context & Context.InIteration) === 0) report(parser, Errors.IllegalContinue);
  nextToken(parser, context);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp);
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
  if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 0))
      report(parser, Errors.UnknownLabel, tokenValue);
  } else if ((context & (Context.InSwitch | Context.InIteration)) === 0) {
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

  if (parser.getToken() === Token.FinallyKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    const finalizerScope = firstScope ? addChildScope(scope, ScopeKind.CatchStatement) : void 0;
    finalizer = parseBlock(
      parser,
      context,
      finalizerScope,
      { $: labels },
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
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
  let param: ESTree.BindingPattern | ESTree.Identifier | null = null;
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
      (parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart
        ? BindingKind.CatchPattern
        : BindingKind.CatchIdentifier,
      Origin.None,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );

    if (parser.getToken() === Token.Comma) {
      report(parser, Errors.InvalidCatchParams);
    } else if (parser.getToken() === Token.Assign) {
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
 * Parses class static initialization block
 *
 * @see [Link](https://github.com/tc39/proposal-class-static-block)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 * @param start Start pos of node
 * @param line
 * @param column
 */
export function parseStaticBlock(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  start: number,
  line: number,
  column: number
): ESTree.StaticBlock {
  // StaticBlock ::
  //   '{' StatementList '}'

  if (scope) scope = addChildScope(scope, ScopeKind.Block);

  const ctorContext = Context.InClass | Context.SuperCall;
  context = ((context | ctorContext) ^ ctorContext) | Context.SuperProperty;
  const { body } = parseBlock(parser, context, scope, {}, start, line, column);

  return finishNode(parser, context, start, line, column, {
    type: 'StaticBlock',
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
  // ECMA-262, section 11.9
  // The previous token is ) and the inserted semicolon would then be parsed as the terminating semicolon of a do-while statement (13.7.2).
  // This cannot be implemented in matchOrInsertSemicolon() because it doesn't know
  // this RightParen is the end of a do-while statement.
  consumeOpt(parser, context | Context.AllowRegExp, Token.Semicolon);
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
  const { tokenValue } = parser;
  const token = parser.getToken();
  let expr: ESTree.Identifier | ESTree.Expression = parseIdentifier(parser, context);

  if (parser.getToken() & (Token.IsIdentifier | Token.IsPatternStart)) {
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

  if (parser.getToken() === Token.Colon) {
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
  if (parser.getToken() === Token.Arrow) {
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

    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);

    /**
     * AssignmentExpression :
     *   1. ConditionalExpression
     *   2. LeftHandSideExpression = AssignmentExpression
     *
     */
    expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr as ESTree.ArgumentExpression);
  }

  /** Sequence expression
   */
  if (parser.getToken() === Token.Comma) {
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

  if (bindingCount > 1 && origin & Origin.ForStatement && parser.getToken() & Token.IsInOrOf) {
    report(parser, Errors.ForInOfLoopMultiBindings, KeywordDescTable[parser.getToken() & Token.Type]);
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

  const { tokenPos, linePos, colPos } = parser;
  const token = parser.getToken();

  let init: ESTree.Expression | ESTree.BindingPattern | ESTree.Identifier | null = null;

  const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);

  if (parser.getToken() === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);
    init = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
    if (origin & Origin.ForStatement || (token & Token.IsPatternStart) === 0) {
      // Lexical declarations in for-in / for-of loops can't be initialized

      if (
        parser.getToken() === Token.OfKeyword ||
        (parser.getToken() === Token.InKeyword &&
          (token & Token.IsPatternStart || (kind & BindingKind.Variable) === 0 || context & Context.Strict))
      ) {
        reportMessageAt(
          tokenPos,
          parser.line,
          parser.index - 3,
          Errors.ForInOfLoopInitializer,
          parser.getToken() === Token.OfKeyword ? 'of' : 'in'
        );
      }
    }
    // Normal const declarations, and const declarations in for(;;) heads, must be initialized.
  } else if (
    (kind & BindingKind.Const || (token & Token.IsPatternStart) > 0) &&
    (parser.getToken() & Token.IsInOrOf) !== Token.IsInOrOf
  ) {
    report(parser, Errors.DeclarationMissingInitializer, kind & BindingKind.Const ? 'const' : 'destructuring');
  }

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'VariableDeclarator',
    id,
    init
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

  const forAwait =
    ((context & Context.InAwaitContext) > 0 || ((context & Context.Module) > 0 && (context & Context.InGlobal) > 0)) &&
    consumeOpt(parser, context, Token.AwaitKeyword);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  if (scope) scope = addChildScope(scope, ScopeKind.ForStatement);

  let test: ESTree.Expression | null = null;
  let update: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = 0;
  let init = null;
  let isVarDecl =
    parser.getToken() === Token.VarKeyword ||
    parser.getToken() === Token.LetKeyword ||
    parser.getToken() === Token.ConstKeyword;
  let right;

  const { tokenPos, linePos, colPos } = parser;
  const token = parser.getToken();

  if (isVarDecl) {
    if (token === Token.LetKeyword) {
      init = parseIdentifier(parser, context);
      if (parser.getToken() & (Token.IsIdentifier | Token.IsPatternStart)) {
        if (parser.getToken() === Token.InKeyword) {
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
        isVarDecl = false;
        parser.assignable = AssignmentKind.Assignable;
        init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);

        // `for of` only allows LeftHandSideExpressions which do not start with `let`, and no other production matches
        if (parser.getToken() === Token.OfKeyword) report(parser, Errors.ForOfLet);
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
      0,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
  } else {
    init = parseLeftHandSideExpression(parser, context | Context.DisallowIn, 1, 0, 1, tokenPos, linePos, colPos);
  }

  if ((parser.getToken() & Token.IsInOrOf) === Token.IsInOrOf) {
    if (parser.getToken() === Token.OfKeyword) {
      if (parser.assignable & AssignmentKind.CannotAssign)
        report(parser, Errors.CantAssignToInOfForLoop, forAwait ? 'await' : 'of');

      reinterpretToPattern(parser, init);
      nextToken(parser, context | Context.AllowRegExp);

      // IterationStatement:
      //  for(LeftHandSideExpression of AssignmentExpression) Statement
      //  forawait(LeftHandSideExpression of AssignmentExpression) Statement
      right = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);

      consume(parser, context | Context.AllowRegExp, Token.RightParen);

      const body = parseIterationStatementBody(parser, context, scope, labels);

      return finishNode(parser, context, start, line, column, {
        type: 'ForOfStatement',
        left: init,
        right,
        body,
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
    if (destructible & DestructuringKind.HasToDestruct && parser.getToken() !== Token.Assign) {
      report(parser, Errors.CantAssignToInOfForLoop, 'loop');
    }

    init = parseAssignmentExpression(parser, context | Context.DisallowIn, 0, 0, tokenPos, linePos, colPos, init);
  }

  if (parser.getToken() === Token.Comma)
    init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.getToken() !== Token.Semicolon)
    test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.getToken() !== Token.RightParen)
    update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

  consume(parser, context | Context.AllowRegExp, Token.RightParen);

  const body = parseIterationStatementBody(parser, context, scope, labels);

  return finishNode(parser, context, start, line, column, {
    type: 'ForStatement',
    init,
    test,
    update,
    body
  });
}

/**
 * Parses restricted identifier in import & export declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 */

export function parseRestrictedIdentifier(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined
): ESTree.Identifier {
  if (!isValidIdentifier(context, parser.getToken())) report(parser, Errors.UnexpectedStrictReserved);
  if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
    report(parser, Errors.StrictEvalArguments);
  if (scope) addBlockName(parser, context, scope, parser.tokenValue, BindingKind.Let, Origin.None);
  return parseIdentifier(parser, context);
}

/**
 * Parse import declaration
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ImportDeclaration)
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 */
function parseImportDeclaration(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined
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
  const start = parser.tokenPos;
  const line = parser.linePos;
  const column = parser.colPos;

  nextToken(parser, context);

  let source: ESTree.Literal | null = null;

  const { tokenPos, linePos, colPos } = parser;

  let specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[] = [];

  // 'import' ModuleSpecifier ';'
  if (parser.getToken() === Token.StringLiteral) {
    source = parseLiteral(parser, context);
  } else {
    if (parser.getToken() & Token.IsIdentifier) {
      const local = parseRestrictedIdentifier(parser, context, scope);
      specifiers = [
        finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'ImportDefaultSpecifier',
          local
        })
      ];

      // NameSpaceImport
      if (consumeOpt(parser, context, Token.Comma)) {
        switch (parser.getToken()) {
          case Token.Multiply:
            specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
            break;

          case Token.LeftBrace:
            parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
            break;

          default:
            report(parser, Errors.InvalidDefaultImport);
        }
      }
    } else {
      // Parse NameSpaceImport or NamedImports if present
      switch (parser.getToken()) {
        case Token.Multiply:
          specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
          break;
        case Token.LeftBrace:
          parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
          break;
        case Token.LeftParen:
          return parseImportCallDeclaration(parser, context, start, line, column);
        case Token.Period:
          return parseImportMetaDeclaration(parser, context, start, line, column);
        default:
          report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
      }
    }

    source = parseModuleSpecifier(parser, context);
  }

  const node: ESTree.ImportDeclaration = {
    type: 'ImportDeclaration',
    specifiers,
    source
  };

  if (context & Context.OptionsNext) {
    node.attributes = parser.getToken() === Token.WithKeyword ? parseImportAttributes(parser, context, specifiers) : [];
  }

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, line, column, node);
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
  scope: ScopeState | undefined
): ESTree.ImportNamespaceSpecifier {
  // NameSpaceImport:
  //  * as ImportedBinding
  const { tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  consume(parser, context, Token.AsKeyword);

  // 'import * as class from "foo":'
  if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    reportMessageAt(
      tokenPos,
      parser.line,
      parser.index,
      Errors.UnexpectedToken,
      KeywordDescTable[parser.getToken() & Token.Type]
    );
  }

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'ImportNamespaceSpecifier',
    local: parseRestrictedIdentifier(parser, context, scope)
  });
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
  consume(parser, context, Token.FromKeyword);
  if (parser.getToken() !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Import');

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

  while (parser.getToken() & Token.IsIdentifier) {
    let { tokenValue, tokenPos, linePos, colPos } = parser;
    const token = parser.getToken();
    const imported = parseIdentifier(parser, context);
    let local: ESTree.Identifier;

    if (consumeOpt(parser, context, Token.AsKeyword)) {
      if (
        (parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber ||
        parser.getToken() === Token.Comma
      ) {
        report(parser, Errors.InvalidKeywordAsAlias);
      } else {
        validateBindingIdentifier(parser, context, BindingKind.Const, parser.getToken(), 0);
      }
      tokenValue = parser.tokenValue;
      local = parseIdentifier(parser, context);
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

    if (parser.getToken() !== Token.RightBrace) consume(parser, context, Token.Comma);
  }

  consume(parser, context, Token.RightBrace);

  return specifiers;
}

/**
 * Parse import meta declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param meta  ESTree AST node
 * @param start
 * @param line
 * @param column
 */
export function parseImportMetaDeclaration(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.ExpressionStatement {
  let expr: ESTree.Expression = parseImportMetaExpression(
    parser,
    context,
    finishNode(parser, context, start, line, column, {
      type: 'Identifier',
      name: 'import'
    }),
    start,
    line,
    column
  );

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

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);

  /** AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   */

  expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr as ESTree.Expression);

  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start, line, column);
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
  let expr: ESTree.Expression = parseImportExpression(parser, context, /* inGroup */ 0, start, line, column);

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

  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);

  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
  }

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
  scope: ScopeState | undefined
): ESTree.ExportAllDeclaration | ESTree.ExportNamedDeclaration | ESTree.ExportDefaultDeclaration {
  // ExportDeclaration:
  //    'export' '*' 'from' ModuleSpecifier ';'
  //    'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';'
  //    'export' ExportClause ('from' ModuleSpecifier)? ';'
  //    'export' VariableStatement
  //    'export' Declaration
  //    'export' 'default'
  const start = parser.tokenPos;
  const line = parser.linePos;
  const column = parser.colPos;

  // https://tc39.github.io/ecma262/#sec-exports
  nextToken(parser, context | Context.AllowRegExp);

  const specifiers: ESTree.ExportSpecifier[] = [];

  let declaration: ESTree.ExportDeclaration | ESTree.Expression | null = null;
  let source: ESTree.Literal | null = null;
  let key: string;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.DefaultKeyword)) {
    // export default HoistableDeclaration[Default]
    // export default ClassDeclaration[Default]
    // export default [lookahead not-in {function, class}] AssignmentExpression[In] ;

    switch (parser.getToken()) {
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
      case Token.AsyncKeyword: {
        const { tokenPos, linePos, colPos } = parser;

        declaration = parseIdentifier(parser, context);

        const { flags } = parser;

        if ((flags & Flags.NewLine) === 0) {
          if (parser.getToken() === Token.FunctionKeyword) {
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
            if (parser.getToken() === Token.LeftParen) {
              declaration = parseAsyncArrowOrCallExpression(
                parser,
                context,
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
                0,
                tokenPos,
                linePos,
                colPos
              );
              declaration = parseAssignmentExpression(
                parser,
                context,
                0,
                0,
                tokenPos,
                linePos,
                colPos,
                declaration as any
              );
            } else if (parser.getToken() & Token.IsIdentifier) {
              if (scope) scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);

              declaration = parseIdentifier(parser, context);
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
      }

      default:
        // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
        declaration = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
        matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
    }

    // See: https://www.ecma-international.org/ecma-262/9.0/index.html#sec-exports-static-semantics-exportednames
    if (scope) declareUnboundVariable(parser, 'default');

    return finishNode(parser, context, start, line, column, {
      type: 'ExportDefaultDeclaration',
      declaration
    });
  }

  switch (parser.getToken()) {
    case Token.Multiply: {
      //
      // 'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';'
      //
      // See: https://github.com/tc39/ecma262/pull/1174
      nextToken(parser, context); // Skips: '*'

      let exported: ESTree.Identifier | null = null;
      const isNamedDeclaration = consumeOpt(parser, context, Token.AsKeyword);

      if (isNamedDeclaration) {
        if (scope) declareUnboundVariable(parser, parser.tokenValue);
        exported = parseIdentifier(parser, context);
      }

      consume(parser, context, Token.FromKeyword);

      if (parser.getToken() !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

      source = parseLiteral(parser, context);

      const node: ESTree.ExportAllDeclaration = {
        type: 'ExportAllDeclaration',
        source,
        exported
      };

      if (context & Context.OptionsNext) {
        node.attributes = parser.getToken() === Token.WithKeyword ? parseImportAttributes(parser, context) : [];
      }

      matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

      return finishNode(parser, context, start, line, column, node);
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

      while (parser.getToken() & Token.IsIdentifier) {
        const { tokenPos, tokenValue, linePos, colPos } = parser;
        const local = parseIdentifier(parser, context);

        let exported: ESTree.Identifier | null;

        if (parser.getToken() === Token.AsKeyword) {
          nextToken(parser, context);
          if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
            report(parser, Errors.InvalidKeywordAsAlias);
          }
          if (scope) {
            tmpExportedNames.push(parser.tokenValue);
            tmpExportedBindings.push(tokenValue);
          }
          exported = parseIdentifier(parser, context);
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

        if (parser.getToken() !== Token.RightBrace) consume(parser, context, Token.Comma);
      }

      consume(parser, context, Token.RightBrace);

      if (consumeOpt(parser, context, Token.FromKeyword)) {
        //  The left hand side can't be a keyword where there is no
        // 'from' keyword since it references a local binding.
        if (parser.getToken() !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

        source = parseLiteral(parser, context);
      } else if (scope) {
        let i = 0;
        let iMax = tmpExportedNames.length;
        for (; i < iMax; i++) {
          declareUnboundVariable(parser, tmpExportedNames[i]);
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
    case Token.AsyncKeyword: {
      const { tokenPos, linePos, colPos } = parser;

      nextToken(parser, context);

      if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() === Token.FunctionKeyword) {
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
          declareUnboundVariable(parser, key);
        }
        break;
      }
    }
    // falls through
    default:
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  return finishNode(parser, context, start, line, column, {
    type: 'ExportNamedDeclaration',
    declaration,
    specifiers,
    source
  });
}

/**
 * Parses an expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param canAssign
 * @param inGroup,
 * @param start,
 * @param line,
 * @param column,
 */
export function parseExpression(
  parser: ParserState,
  context: Context,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.Expression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression

  let expr = parsePrimaryExpression(parser, context, BindingKind.Empty, 0, canAssign, inGroup, 1, start, line, column);

  expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);

  return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
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
    expressions.push(parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
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
 * @param canAssign
 */
export function parseExpressions(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  canAssign: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.SequenceExpression | ESTree.Expression {
  const expr = parseExpression(parser, context, canAssign, inGroup, start, line, column);
  return parser.getToken() === Token.Comma
    ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
    : expr;
}

/**
 * Parse assignment expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param isPattern
 * @param start
 * @param line
 * @param column
 * @param left
 *
 * * @param left ESTree AST node
 */
export function parseAssignmentExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: number,
  line: number,
  column: number,
  left: ESTree.ArgumentExpression | ESTree.Expression | null
): ESTree.ArgumentExpression | ESTree.Expression {
  /**
   * AssignmentExpression ::
   *   ConditionalExpression
   *   ArrowFunction
   *   AsyncArrowFunction
   *   YieldExpression
   *   LeftHandSideExpression AssignmentOperator AssignmentExpression
   */

  const token = parser.getToken();

  if ((token & Token.IsAssignOp) === Token.IsAssignOp) {
    if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.CantAssignTo);
    if (
      (!isPattern && token === Token.Assign && ((left as ESTree.Expression).type as string) === 'ArrayExpression') ||
      ((left as ESTree.Expression).type as string) === 'ObjectExpression'
    ) {
      reinterpretToPattern(parser, left);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(
      parser,
      context,
      start,
      line,
      column,
      isPattern
        ? {
            type: 'AssignmentPattern',
            left,
            right
          }
        : ({
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[token & Token.Type],
            right
          } as any)
    );
  }

  /** Binary expression
   *
   * https://tc39.github.io/ecma262/#sec-multiplicative-operators
   *
   */
  if ((token & Token.IsBinaryOp) === Token.IsBinaryOp) {
    // We start using the binary expression parser for prec >= 4 only!
    left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left as ESTree.Expression);
  }

  /**
   * Conditional expression
   * https://tc39.github.io/ecma262/#prod-ConditionalExpression
   *
   */
  if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
    left = parseConditionalExpression(parser, context, left as ESTree.Expression, start, line, column);
  }

  return left as ESTree.Expression;
}

/**
 * Parse assignment expression or assignment pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param isPattern
 * @param start
 * @param line
 * @param column
 * @param left
 */

export function parseAssignmentExpressionOrPattern(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: number,
  line: number,
  column: number,
  left: any
): any {
  const token = parser.getToken();

  nextToken(parser, context | Context.AllowRegExp);

  const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

  left = finishNode(
    parser,
    context,
    start,
    line,
    column,
    isPattern
      ? {
          type: 'AssignmentPattern',
          left,
          right
        }
      : ({
          type: 'AssignmentExpression',
          left,
          operator: KeywordDescTable[token & Token.Type],
          right
        } as any)
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return left as ESTree.Expression;
}

/**
 * Parse conditional expression
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
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  consume(parser, context | Context.AllowRegExp, Token.Colon);
  parser.assignable = AssignmentKind.Assignable;
  // In parsing the first assignment expression in conditional
  // expressions we always accept the 'in' keyword; see ECMA-262,
  // section 11.12, page 58.
  const alternate = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
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

  while (parser.getToken() & Token.IsBinaryOp) {
    t = parser.getToken();
    prec = t & Token.Precedence;

    if ((t & Token.IsLogical && operator & Token.IsCoalesc) || (operator & Token.IsLogical && t & Token.IsCoalesc)) {
      report(parser, Errors.InvalidCoalescing);
    }

    // 0 precedence will terminate binary expression parsing

    if (prec + (((t === Token.Exponentiate) as any) << 8) - (((bit === t) as any) << 12) <= minPrec) break;
    nextToken(parser, context | Context.AllowRegExp);

    left = finishNode(parser, context, start, line, column, {
      type: t & Token.IsLogical || t & Token.IsCoalesc ? 'LogicalExpression' : 'BinaryExpression',
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
        parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)
      ),
      operator: KeywordDescTable[t & Token.Type]
    });
  }

  if (parser.getToken() === Token.Assign) report(parser, Errors.CantAssignTo);

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
  isLHS: 0 | 1,
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
  if (!isLHS) report(parser, Errors.Unexpected);
  const unaryOperator = parser.getToken();
  nextToken(parser, context | Context.AllowRegExp);
  const arg = parseLeftHandSideExpression(
    parser,
    context,
    0,
    inGroup,
    1,
    parser.tokenPos,
    parser.linePos,
    parser.colPos
  );
  if (parser.getToken() === Token.Exponentiate) report(parser, Errors.InvalidExponentiationLHS);
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
 * Parse async expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseAsyncExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
  canAssign: 0 | 1,
  inNew: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.FunctionExpression | ESTree.ArrowFunctionExpression | ESTree.CallExpression | ESTree.Identifier {
  const token = parser.getToken();
  const expr = parseIdentifier(parser, context);
  const { flags } = parser;

  if ((flags & Flags.NewLine) === 0) {
    // async function ...
    if (parser.getToken() === Token.FunctionKeyword) {
      return parseFunctionExpression(parser, context, /* isAsync */ 1, inGroup, start, line, column);
    }

    // async Identifier => ...
    if ((parser.getToken() & Token.IsIdentifier) === Token.IsIdentifier) {
      if (!isLHS) report(parser, Errors.Unexpected);
      return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
    }
  }

  // async (...) => ...
  if (!inNew && parser.getToken() === Token.LeftParen) {
    return parseAsyncArrowOrCallExpression(
      parser,
      context,
      expr,
      canAssign,
      BindingKind.ArgumentList,
      Origin.None,
      flags,
      start,
      line,
      column
    );
  }

  if (parser.getToken() === Token.Arrow) {
    classifyIdentifier(parser, context, token);
    if (inNew) report(parser, Errors.InvalidAsyncArrow);
    return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
  }

  parser.assignable = AssignmentKind.Assignable;
  return expr;
}

/**
 * Parse yield expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseYieldExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  canAssign: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.YieldExpression | ESTree.Identifier | ESTree.ArrowFunctionExpression {
  // YieldExpression[In] :
  //     yield
  //     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
  //     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]

  if (inGroup) parser.destructible |= DestructuringKind.Yield;
  if (context & Context.InYieldContext) {
    nextToken(parser, context | Context.AllowRegExp);
    if (context & Context.InArgumentList) report(parser, Errors.YieldInParameter);
    if (!canAssign) report(parser, Errors.CantAssignTo);
    if (parser.getToken() === Token.QuestionMark) report(parser, Errors.InvalidTernaryYield);

    let argument: ESTree.Expression | null = null;
    let delegate = false; // yield*

    if ((parser.flags & Flags.NewLine) === 0) {
      delegate = consumeOpt(parser, context | Context.AllowRegExp, Token.Multiply);
      if (parser.getToken() & (Token.Contextual | Token.IsExpressionStart) || delegate) {
        argument = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
      }
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'YieldExpression',
      argument,
      delegate
    });
  }

  if (context & Context.Strict) report(parser, Errors.DisallowedInContext, 'yield');

  return parseIdentifierOrArrow(parser, context, start, line, column);
}

/**
 * Parse await expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 */
export function parseAwaitExpression(
  parser: ParserState,
  context: Context,
  inNew: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.IdentifierOrExpression | ESTree.AwaitExpression {
  if (inGroup) parser.destructible |= DestructuringKind.Await;
  if (context & Context.InAwaitContext || (context & Context.Module && context & Context.InGlobal)) {
    if (inNew) report(parser, Errors.Unexpected);

    if (context & Context.InArgumentList) {
      reportMessageAt(parser.index, parser.line, parser.index, Errors.AwaitInParameter);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const argument = parseLeftHandSideExpression(
      parser,
      context,
      0,
      0,
      1,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );

    if (parser.getToken() === Token.Exponentiate) report(parser, Errors.InvalidExponentiationLHS);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, line, column, {
      type: 'AwaitExpression',
      argument
    });
  }

  if (context & Context.Module) report(parser, Errors.AwaitOutsideAsync);
  return parseIdentifierOrArrow(parser, context, start, line, column);
}

/**
 * Parses function body
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object | null
 * @param origin Binding origin
 * @param firstRestricted
 * @param scopeError
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

  if (parser.getToken() !== Token.RightBrace) {
    while (parser.getToken() === Token.StringLiteral) {
      const { index, tokenPos, tokenValue } = parser;
      const token = parser.getToken();
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
    if (context & Context.Strict) {
      if (firstRestricted) {
        if ((firstRestricted & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          report(parser, Errors.StrictEvalArguments);
        }
        if ((firstRestricted & Token.FutureReserved) === Token.FutureReserved) {
          report(parser, Errors.StrictFunctionName);
        }
      }
      if (parser.flags & Flags.StrictEvalArguments) report(parser, Errors.StrictEvalArguments);
      if (parser.flags & Flags.HasStrictReserved) report(parser, Errors.UnexpectedStrictReserved);
    }

    if (
      context & Context.OptionsLexical &&
      scope &&
      scopeError !== void 0 &&
      (prevContext & Context.Strict) === 0 &&
      (context & Context.InGlobal) === 0
    ) {
      reportScopeError(scopeError);
    }
  }

  parser.flags =
    (parser.flags | Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octals) ^
    (Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octals);

  parser.destructible = (parser.destructible | DestructuringKind.Yield) ^ DestructuringKind.Yield;

  while (parser.getToken() !== Token.RightBrace) {
    body.push(parseStatementListItem(parser, context, scope, Origin.TopLevel, {}) as ESTree.Statement);
  }

  consume(
    parser,
    origin & (Origin.Arrow | Origin.Declaration) ? context | Context.AllowRegExp : context,
    Token.RightBrace
  );

  parser.flags &= ~(Flags.SimpleParameterList | Flags.Octals);

  if (parser.getToken() === Token.Assign) report(parser, Errors.CantAssignTo);

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

  switch (parser.getToken()) {
    case Token.QuestionMarkPeriod:
      report(parser, Errors.OptionalChainingNoSuper);
    case Token.LeftParen: {
      // The super property has to be within a class constructor
      if ((context & Context.SuperCall) === 0) report(parser, Errors.SuperNoConstructor);
      if (context & Context.InClass && !(context & Context.InMethod)) {
        report(parser, Errors.InvalidSuperProperty);
      }
      parser.assignable = AssignmentKind.CannotAssign;
      break;
    }
    case Token.LeftBracket:
    case Token.Period: {
      // new super() is never allowed.
      // super() is only allowed in derived constructor
      if ((context & Context.SuperProperty) === 0) report(parser, Errors.InvalidSuperProperty);
      if (context & Context.InClass && !(context & Context.InMethod)) {
        report(parser, Errors.InvalidSuperProperty);
      }
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
 * @param canAssign
 * @param start
 * @param line
 * @param column
 */
export function parseLeftHandSideExpression(
  parser: ParserState,
  context: Context,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.Expression {
  // LeftHandSideExpression ::
  //   (PrimaryExpression | MemberExpression) ...

  const expression = parsePrimaryExpression(
    parser,
    context,
    BindingKind.Empty,
    0,
    canAssign,
    inGroup,
    isLHS,
    start,
    line,
    column
  );

  return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
}

/**
 * Parse update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 * @param start
 * @param line
 * @param column
 */
function parseUpdateExpression(
  parser: ParserState,
  context: Context,
  expr: ESTree.Expression,
  start: number,
  line: number,
  column: number
) {
  if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidIncDecTarget);

  const token = parser.getToken();

  nextToken(parser, context);

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'UpdateExpression',
    argument: expr,
    operator: KeywordDescTable[token & Token.Type] as ESTree.UpdateOperator,
    prefix: false
  });
}
/**
 * Parses member or update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 * @param inGroup
 * @param start
 * @param line
 * @param column
 */
export function parseMemberOrUpdateExpression(
  parser: ParserState,
  context: Context,
  expr: ESTree.Expression,
  inGroup: 0 | 1,
  inChain: 0 | 1,
  start: number,
  line: number,
  column: number
): any {
  if ((parser.getToken() & Token.IsUpdateOp) === Token.IsUpdateOp && (parser.flags & Flags.NewLine) === 0) {
    expr = parseUpdateExpression(parser, context, expr, start, line, column);
  } else if ((parser.getToken() & Token.IsMemberOrCallExpression) === Token.IsMemberOrCallExpression) {
    context = (context | Context.DisallowIn) ^ Context.DisallowIn;

    switch (parser.getToken()) {
      /* Property */
      case Token.Period: {
        nextToken(parser, (context | Context.AllowEscapedKeyword | Context.InGlobal) ^ Context.InGlobal);

        if (context & Context.InClass && parser.getToken() === Token.PrivateField && parser.tokenValue === 'super') {
          report(parser, Errors.InvalidSuperProperty);
        }

        parser.assignable = AssignmentKind.Assignable;

        const property = parsePropertyOrPrivatePropertyName(parser, context | Context.TaggedTemplate);

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
        let restoreHasOptionalChaining = false;
        if ((parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
          restoreHasOptionalChaining = true;
          parser.flags = (parser.flags | Flags.HasOptionalChaining) ^ Flags.HasOptionalChaining;
        }

        nextToken(parser, context | Context.AllowRegExp);

        const { tokenPos, linePos, colPos } = parser;
        const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);

        consume(parser, context, Token.RightBracket);

        parser.assignable = AssignmentKind.Assignable;

        expr = finishNode(parser, context, start, line, column, {
          type: 'MemberExpression',
          object: expr,
          computed: true,
          property
        });

        if (restoreHasOptionalChaining) {
          parser.flags |= Flags.HasOptionalChaining;
        }
        break;
      }

      /* Call */
      case Token.LeftParen: {
        if ((parser.flags & Flags.DisallowCall) === Flags.DisallowCall) {
          parser.flags = (parser.flags | Flags.DisallowCall) ^ Flags.DisallowCall;
          return expr;
        }

        let restoreHasOptionalChaining = false;
        if ((parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
          restoreHasOptionalChaining = true;
          parser.flags = (parser.flags | Flags.HasOptionalChaining) ^ Flags.HasOptionalChaining;
        }

        const args = parseArguments(parser, context, inGroup);

        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(parser, context, start, line, column, {
          type: 'CallExpression',
          callee: expr,
          arguments: args
        });

        if (restoreHasOptionalChaining) {
          parser.flags |= Flags.HasOptionalChaining;
        }
        break;
      }

      /* Optional chaining */
      case Token.QuestionMarkPeriod: {
        nextToken(parser, (context | Context.AllowEscapedKeyword | Context.InGlobal) ^ Context.InGlobal); // skips: '?.'
        parser.flags |= Flags.HasOptionalChaining;
        parser.assignable = AssignmentKind.CannotAssign;
        expr = parseOptionalChain(parser, context, expr, start, line, column);
        break;
      }

      default:
        if ((parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
          report(parser, Errors.OptionalChainingNoTemplate);
        }
        /* Tagged Template */
        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(parser, context, start, line, column, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi:
            parser.getToken() === Token.TemplateContinuation
              ? parseTemplate(parser, context | Context.TaggedTemplate)
              : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
        });
    }

    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
  }

  // Finalize ChainExpression
  // FIXME: current implementation does not invalidate destructuring like `({ a: x?.obj['a'] } = {})`
  if (inChain === 0 && (parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
    parser.flags = (parser.flags | Flags.HasOptionalChaining) ^ Flags.HasOptionalChaining;

    expr = finishNode(parser, context, start, line, column, {
      type: 'ChainExpression',
      expression: expr as ESTree.CallExpression | ESTree.MemberExpression
    });
  }

  return expr;
}

/**
 * Parses optional chain
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr  ESTree AST node
 */
export function parseOptionalChain(
  parser: ParserState,
  context: Context,
  expr: ESTree.Expression,
  start: number,
  line: number,
  column: number
): ESTree.MemberExpression | ESTree.CallExpression {
  let restoreHasOptionalChaining = false;
  let node;
  if (parser.getToken() === Token.LeftBracket || parser.getToken() === Token.LeftParen) {
    if ((parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
      restoreHasOptionalChaining = true;
      parser.flags = (parser.flags | Flags.HasOptionalChaining) ^ Flags.HasOptionalChaining;
    }
  }
  if (parser.getToken() === Token.LeftBracket) {
    nextToken(parser, context | Context.AllowRegExp);
    const { tokenPos, linePos, colPos } = parser;
    const property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
    consume(parser, context, Token.RightBracket);
    parser.assignable = AssignmentKind.CannotAssign;
    node = finishNode(parser, context, start, line, column, {
      type: 'MemberExpression',
      object: expr,
      computed: true,
      optional: true,
      property
    });
  } else if (parser.getToken() === Token.LeftParen) {
    const args = parseArguments(parser, context, 0);

    parser.assignable = AssignmentKind.CannotAssign;

    node = finishNode(parser, context, start, line, column, {
      type: 'CallExpression',
      callee: expr,
      arguments: args,
      optional: true
    });
  } else {
    if ((parser.getToken() & (Token.IsIdentifier | Token.Keyword)) === 0) report(parser, Errors.InvalidDotProperty);
    const property = parseIdentifier(parser, context);
    parser.assignable = AssignmentKind.CannotAssign;
    node = finishNode(parser, context, start, line, column, {
      type: 'MemberExpression',
      object: expr,
      computed: false,
      optional: true,
      property
    });
  }

  if (restoreHasOptionalChaining) {
    parser.flags |= Flags.HasOptionalChaining;
  }
  return node;
}

/**
 * Parses property or private property name
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parsePropertyOrPrivatePropertyName(parser: ParserState, context: Context): any {
  if ((parser.getToken() & (Token.IsIdentifier | Token.Keyword)) === 0 && parser.getToken() !== Token.PrivateField) {
    report(parser, Errors.InvalidDotProperty);
  }

  return parser.getToken() === Token.PrivateField
    ? parsePrivateIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
    : parseIdentifier(parser, context);
}

/**
 * Parse update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 * @param start
 * @param line
 * @param column
 */
export function parseUpdateExpressionPrefixed(
  parser: ParserState,
  context: Context,
  inNew: 0 | 1,
  isLHS: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.UpdateExpression {
  //  UpdateExpression ::
  //   LeftHandSideExpression ('++' | '--')?

  if (inNew) report(parser, Errors.InvalidIncDecNew);
  if (!isLHS) report(parser, Errors.Unexpected);

  const token = parser.getToken();

  nextToken(parser, context | Context.AllowRegExp);

  const arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);

  if (parser.assignable & AssignmentKind.CannotAssign) {
    report(parser, Errors.InvalidIncDecTarget);
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
 * Parses expressions such as a literal expression
 * and update expression.
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind Binding kind
 * @param inNew
 * @param canAssign
 * @param inGroup
 * @param start
 * @param line
 * @param column
 */

export function parsePrimaryExpression(
  parser: ParserState,
  context: Context,
  kind: BindingKind,
  inNew: 0 | 1,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
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
  //   BigIntLiteral
  //   ArrayLiteral
  //   ObjectLiteral
  //   RegExpLiteral
  //   ClassLiteral
  //   ImportCall
  //   ImportMeta
  //   '(' Expression ')'
  //   TemplateLiteral
  //   AsyncFunctionLiteral
  //   YieldExpression
  //   AwaitExpression
  //   PrivateField
  //   Decorator
  //   Intrinsic
  //   JSX

  if ((parser.getToken() & Token.IsIdentifier) === Token.IsIdentifier) {
    switch (parser.getToken()) {
      case Token.AwaitKeyword:
        return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
      case Token.YieldKeyword:
        return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
      case Token.AsyncKeyword:
        return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, inNew, start, line, column);
      default: // ignore
    }

    const { tokenValue } = parser;
    const token = parser.getToken();

    const expr = parseIdentifier(parser, context | Context.TaggedTemplate);

    if (parser.getToken() === Token.Arrow) {
      if (!isLHS) report(parser, Errors.Unexpected);
      classifyIdentifier(parser, context, token);
      return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
    }

    if (context & Context.InClass && token === Token.Arguments) report(parser, Errors.InvalidClassFieldArgEval);

    // Only a "simple validation" is done here to handle 'let' edge cases

    if (token === Token.LetKeyword) {
      if (context & Context.Strict) report(parser, Errors.StrictInvalidLetInExprPos);
      if (kind & (BindingKind.Let | BindingKind.Const)) report(parser, Errors.InvalidLetConstBinding);
    }

    parser.assignable =
      context & Context.Strict && (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments
        ? AssignmentKind.CannotAssign
        : AssignmentKind.Assignable;

    return expr;
  }

  if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    return parseLiteral(parser, context);
  }

  // Update + Unary + Primary expression
  switch (parser.getToken()) {
    case Token.Increment:
    case Token.Decrement:
      return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
    case Token.DeleteKeyword:
    case Token.Negate:
    case Token.Complement:
    case Token.Add:
    case Token.Subtract:
    case Token.TypeofKeyword:
    case Token.VoidKeyword:
      return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
    case Token.FunctionKeyword:
      return parseFunctionExpression(parser, context, /* isAsync */ 0, inGroup, start, line, column);
    case Token.LeftBrace:
      return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
    case Token.LeftBracket:
      return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
    case Token.LeftParen:
      return parseParenthesizedExpression(
        parser,
        context | Context.TaggedTemplate,
        canAssign,
        BindingKind.ArgumentList,
        Origin.None,
        start,
        line,
        column
      );
    case Token.FalseKeyword:
    case Token.TrueKeyword:
    case Token.NullKeyword:
      return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
    case Token.ThisKeyword:
      return parseThisExpression(parser, context);
    case Token.RegularExpression:
      return parseRegExpLiteral(parser, context, start, line, column);
    case Token.Decorator:
    case Token.ClassKeyword:
      return parseClassExpression(parser, context, inGroup, start, line, column);
    case Token.SuperKeyword:
      return parseSuperExpression(parser, context, start, line, column);
    case Token.TemplateSpan:
      return parseTemplateLiteral(parser, context, start, line, column);
    case Token.TemplateContinuation:
      return parseTemplate(parser, context);
    case Token.NewKeyword:
      return parseNewExpression(parser, context, inGroup, start, line, column);
    case Token.BigIntLiteral:
      return parseBigIntLiteral(parser, context, start, line, column);
    case Token.PrivateField:
      return parsePrivateIdentifier(parser, context, start, line, column);
    case Token.ImportKeyword:
      return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
    case Token.LessThan:
      if (context & Context.OptionsJSX)
        return parseJSXRootElementOrFragment(parser, context, /*inJSXChild*/ 1, start, line, column);
    default:
      if (isValidIdentifier(context, parser.getToken()))
        return parseIdentifierOrArrow(parser, context, start, line, column);
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
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
function parseImportCallOrMetaExpression(
  parser: ParserState,
  context: Context,
  inNew: 0 | 1,
  inGroup: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ImportExpression | ESTree.MetaProperty {
  // ImportCall[Yield, Await]:
  //  import(AssignmentExpression[+In, ?Yield, ?Await])

  let expr: ESTree.Identifier | ESTree.ImportExpression = parseIdentifier(parser, context);

  if (parser.getToken() === Token.Period) {
    return parseImportMetaExpression(parser, context, expr, start, line, column);
  }

  if (inNew) report(parser, Errors.InvalidImportNew);

  expr = parseImportExpression(parser, context, inGroup, start, line, column);

  parser.assignable = AssignmentKind.CannotAssign;

  return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
}

/**
 * Parses import meta expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param meta ESTree AST node
 * @param start
 * @param line
 * @param column
 */

export function parseImportMetaExpression(
  parser: ParserState,
  context: Context,
  meta: ESTree.Identifier,
  start: number,
  line: number,
  column: number
): ESTree.MetaProperty {
  if ((context & Context.Module) === 0) report(parser, Errors.ImportMetaOutsideModule);

  nextToken(parser, context); // skips: '.'

  if (parser.getToken() !== Token.Meta && parser.tokenValue !== 'meta')
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'MetaProperty',
    meta,
    property: parseIdentifier(parser, context)
  });
}

/**
 * Parses import expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 * @param line
 * @param column
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

  if (parser.getToken() === Token.Ellipsis) report(parser, Errors.InvalidSpreadInImport);

  const source = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
  const node: ESTree.ImportExpression = {
    type: 'ImportExpression',
    source
  };

  if (context & Context.OptionsNext) {
    let options: ESTree.Expression | null = null;

    if (parser.getToken() === Token.Comma) {
      consume(parser, context, Token.Comma);

      if (parser.getToken() !== Token.RightParen) {
        const expContext = (context | Context.DisallowIn) ^ Context.DisallowIn;
        options = parseExpression(parser, expContext, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      }
    }

    node.options = options;
    consumeOpt(parser, context, Token.Comma);
  }

  consume(parser, context, Token.RightParen);

  return finishNode(parser, context, start, line, column, node);
}

/**
 * Parses import attributes
 *
 * @param parser Parser object
 * @param context Context masks
 * @returns
 */

export function parseImportAttributes(
  parser: ParserState,
  context: Context,
  specifiers: ESTree.ImportDeclaration['specifiers'] = []
): ESTree.ImportAttribute[] {
  consume(parser, context, Token.WithKeyword);
  consume(parser, context, Token.LeftBrace);

  const attributes: ESTree.ImportAttribute[] = [];
  const keysContent = new Set<ESTree.Literal['value'] | ESTree.Identifier['name']>();

  while (parser.getToken() !== Token.RightBrace) {
    const start = parser.tokenPos;
    const line = parser.linePos;
    const column = parser.colPos;

    const key = parseIdentifierOrStringLiteral(parser, context);
    consume(parser, context, Token.Colon);
    const value = parseStringLiteral(parser, context);
    const keyContent = key.type === 'Literal' ? key.value : key.name;
    const isJSONImportAttribute = keyContent === 'type' && value.value === 'json';

    if (isJSONImportAttribute) {
      const validJSONImportAttributeBindings =
        specifiers.length === 1 &&
        (specifiers[0].type === 'ImportDefaultSpecifier' ||
          specifiers[0].type === 'ImportNamespaceSpecifier' ||
          (specifiers[0].type === 'ImportSpecifier' && specifiers[0].imported.name === 'default'));

      if (!validJSONImportAttributeBindings) report(parser, Errors.InvalidJSONImportBinding);
    }

    if (keysContent.has(keyContent)) {
      report(parser, Errors.DuplicateBinding, `${keyContent}`);
    }

    keysContent.add(keyContent);
    attributes.push(
      finishNode(parser, context, start, line, column, {
        type: 'ImportAttribute',
        key,
        value
      })
    );

    if (parser.getToken() !== Token.RightBrace) {
      consume(parser, context, Token.Comma);
    }
  }

  consume(parser, context, Token.RightBrace);
  return attributes;
}

function parseStringLiteral(parser: ParserState, context: Context): ESTree.Literal {
  if (parser.getToken() === Token.StringLiteral) {
    return parseLiteral(parser, context);
  } else {
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
}

function parseIdentifierOrStringLiteral(parser: ParserState, context: Context): ESTree.Identifier | ESTree.Literal {
  if (parser.getToken() === Token.StringLiteral) {
    return parseLiteral(parser, context);
  } else if (parser.getToken() & Token.IsIdentifier) {
    return parseIdentifier(parser, context);
  } else {
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
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
          type: 'Literal',
          value: tokenValue,
          bigint: tokenRaw.slice(0, -1), // without the ending "n"
          raw: tokenRaw
        }
      : {
          type: 'Literal',
          value: tokenValue,
          bigint: tokenRaw.slice(0, -1) // without the ending "n"
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
  const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
  consume(parser, context, Token.TemplateSpan);
  const quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];

  return finishNode(parser, context, start, line, column, {
    type: 'TemplateLiteral',
    expressions: [],
    quasis
  });
}

/**
 * Parses template
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseTemplate(parser: ParserState, context: Context): ESTree.TemplateLiteral {
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
  consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);
  const quasis = [
    parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, /* tail */ false)
  ];

  const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];

  if (parser.getToken() !== Token.RightBrace) report(parser, Errors.InvalidTemplateContinuation);

  while (parser.setToken(scanTemplateTail(parser, context)) !== Token.TemplateSpan) {
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);
    quasis.push(
      parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, /* tail */ false)
    );

    expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
    if (parser.getToken() !== Token.RightBrace) report(parser, Errors.InvalidTemplateContinuation);
  }

  {
    const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
    consume(parser, context, Token.TemplateSpan);
    quasis.push(
      parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, /* tail */ true)
    );
  }

  return finishNode(parser, context, tokenPos, linePos, colPos, {
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
export function parseTemplateElement(
  parser: ParserState,
  context: Context,
  cooked: string | null,
  raw: string,
  start: number,
  line: number,
  col: number,
  tail: boolean
): ESTree.TemplateElement {
  const node = finishNode(parser, context, start, line, col, {
    type: 'TemplateElement',
    value: {
      cooked,
      raw
    },
    tail
  }) as ESTree.TemplateElement;

  const tailSize = tail ? 1 : 2;

  // Patch range
  if (context & Context.OptionsRanges) {
    // skip the front "`" or "}"
    (node.start as number) += 1;
    (node.range as [number, number])[0] += 1;
    // skip the tail "`" or "${"
    (node.end as number) -= tailSize;
    (node.range as [number, number])[1] -= tailSize;
  }

  // Patch loc
  if (context & Context.OptionsLoc) {
    // skip the front "`" or "}"
    (node.loc as ESTree.SourceLocation).start.column += 1;
    // skip the tail "`" or "${"
    (node.loc as ESTree.SourceLocation).end.column -= tailSize;
  }

  return node;
}

/**
 * Parses spread element
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSpreadElement(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.SpreadElement {
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;
  consume(parser, context | Context.AllowRegExp, Token.Ellipsis);
  const argument = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
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

  if (parser.getToken() === Token.RightParen) {
    nextToken(parser, context | Context.TaggedTemplate);
    return args;
  }

  while (parser.getToken() !== Token.RightParen) {
    if (parser.getToken() === Token.Ellipsis) {
      args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    } else {
      args.push(parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
    }

    if (parser.getToken() !== Token.Comma) break;

    nextToken(parser, context | Context.AllowRegExp);

    if (parser.getToken() === Token.RightParen) break;
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
export function parseIdentifier(parser: ParserState, context: Context): ESTree.Identifier {
  const { tokenValue, tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);

  return finishNode(parser, context, tokenPos, linePos, colPos, {
    type: 'Identifier',
    name: tokenValue
  });
}

/**
 * Parses an literal expression such as string literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseLiteral(parser: ParserState, context: Context): ESTree.Literal {
  const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
  if (parser.getToken() === Token.BigIntLiteral) {
    return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
  }

  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
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
  const raw = KeywordDescTable[parser.getToken() & Token.Type];
  const value = parser.getToken() === Token.NullKeyword ? null : raw === 'true';

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
export function parseThisExpression(parser: ParserState, context: Context): ESTree.ThisExpression {
  const { tokenPos, linePos, colPos } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(parser, context, tokenPos, linePos, colPos, {
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

  if (parser.getToken() === Token.LeftParen) {
    if ((flags & HoistedClassFlags.Hoisted) === 0) report(parser, Errors.DeclNoName, 'Function');
  } else {
    // In ES6, a function behaves as a lexical binding, except in
    // a script scope, or the initial scope of eval or another function.
    const kind =
      origin & Origin.TopLevel && ((context & Context.InGlobal) === 0 || (context & Context.Module) === 0)
        ? BindingKind.Variable
        : BindingKind.FunctionLexical;

    validateFunctionName(parser, context, parser.getToken());

    if (scope) {
      if (kind & BindingKind.Variable) {
        addVarName(parser, context, scope as ScopeState, parser.tokenValue, kind);
      } else {
        addBlockName(parser, context, scope, parser.tokenValue, kind, origin);
      }

      functionScope = addChildScope(functionScope, ScopeKind.FunctionRoot);

      if (flags) {
        if (flags & HoistedClassFlags.Export) {
          declareUnboundVariable(parser, parser.tokenValue);
        }
      }
    }

    firstRestricted = parser.getToken();

    if (parser.getToken() & Token.IsIdentifier) {
      id = parseIdentifier(parser, context);
    } else {
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
    }
  }

  const modifierFlags =
    Context.SuperProperty |
    Context.SuperCall |
    Context.InYieldContext |
    Context.InAwaitContext |
    Context.InArgumentList |
    Context.InConstructor;

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    Context.AllowNewTarget |
    (isAsync ? Context.InAwaitContext : 0) |
    (isGenerator ? Context.InYieldContext : 0) |
    (isGenerator ? 0 : Context.AllowEscapedKeyword);

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
    id,
    params,
    body,
    async: isAsync === 1,
    generator: isGenerator === 1
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
  const generatorAndAsyncFlags = (isAsync ? Context.InAwaitContext : 0) | (isGenerator ? Context.InYieldContext : 0);

  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  // Create a new function scope
  let scope = context & Context.OptionsLexical ? createScope() : void 0;

  const modifierFlags =
    Context.SuperProperty |
    Context.SuperCall |
    Context.InYieldContext |
    Context.InAwaitContext |
    Context.InArgumentList |
    Context.InConstructor;

  if ((parser.getToken() & (Token.IsIdentifier | Token.Keyword | Token.FutureReserved)) > 0) {
    validateFunctionName(
      parser,
      ((context | modifierFlags) ^ modifierFlags) | generatorAndAsyncFlags,
      parser.getToken()
    );

    if (scope) scope = addChildScope(scope, ScopeKind.FunctionRoot);

    firstRestricted = parser.getToken();
    id = parseIdentifier(parser, context);
  }

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    Context.AllowNewTarget |
    generatorAndAsyncFlags |
    (isGenerator ? 0 : Context.AllowEscapedKeyword);

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
    context & ~(Context.DisallowIn | Context.InSwitch | Context.InGlobal | Context.InIteration | Context.InClass),
    scope ? addChildScope(scope, ScopeKind.FunctionBody) : scope,
    0,
    firstRestricted,
    void 0
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'FunctionExpression',
    id,
    params,
    body,
    async: isAsync === 1,
    generator: isGenerator === 1
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
    0,
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
  isPattern: 0 | 1,
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

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  while (parser.getToken() !== Token.RightBracket) {
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
      elements.push(null);
    } else {
      let left: any;

      const { tokenPos, linePos, colPos, tokenValue } = parser;
      const token = parser.getToken();

      if (token & Token.IsIdentifier) {
        left = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);

        if (parser.getToken() === Token.Assign) {
          if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.CantAssignTo);

          nextToken(parser, context | Context.AllowRegExp);

          if (scope) addVarOrBlock(parser, context, scope, tokenValue, kind, origin);

          const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

          left = finishNode(
            parser,
            context,
            tokenPos,
            linePos,
            colPos,
            isPattern
              ? {
                  type: 'AssignmentPattern',
                  left,
                  right
                }
              : ({
                  type: 'AssignmentExpression',
                  operator: '=',
                  left,
                  right
                } as any)
          );

          destructible |=
            parser.destructible & DestructuringKind.Yield
              ? DestructuringKind.Yield
              : 0 | (parser.destructible & DestructuringKind.Await)
                ? DestructuringKind.Await
                : 0;
        } else if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBracket) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            destructible |= DestructuringKind.CannotDestruct;
          } else if (scope) {
            addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
          }
          destructible |=
            parser.destructible & DestructuringKind.Yield
              ? DestructuringKind.Yield
              : 0 | (parser.destructible & DestructuringKind.Await)
                ? DestructuringKind.Await
                : 0;
        } else {
          destructible |=
            kind & BindingKind.ArgumentList
              ? DestructuringKind.Assignable
              : (kind & BindingKind.Empty) === 0
                ? DestructuringKind.CannotDestruct
                : 0;

          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);

          if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
            if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
            left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          } else if (parser.getToken() !== Token.Assign) {
            destructible |=
              parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.Assignable;
          }
        }
      } else if (token & Token.IsPatternStart) {
        left =
          parser.getToken() === Token.LeftBrace
            ? parseObjectLiteralOrPattern(
                parser,
                context,
                scope,
                0,
                inGroup,
                isPattern,
                kind,
                origin,
                tokenPos,
                linePos,
                colPos
              )
            : parseArrayExpressionOrPattern(
                parser,
                context,
                scope,
                0,
                inGroup,
                isPattern,
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

        if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBracket) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            destructible |= DestructuringKind.CannotDestruct;
          }
        } else if (parser.destructible & DestructuringKind.HasToDestruct) {
          report(parser, Errors.InvalidDestructuringTarget);
        } else {
          left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
          destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

          if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
            left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          } else if (parser.getToken() !== Token.Assign) {
            destructible |=
              parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.Assignable;
          }
        }
      } else if (token === Token.Ellipsis) {
        left = parseSpreadOrRestElement(
          parser,
          context,
          scope,
          Token.RightBracket,
          kind,
          origin,
          0,
          inGroup,
          isPattern,
          tokenPos,
          linePos,
          colPos
        );
        destructible |= parser.destructible;
        if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket)
          report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
      } else {
        left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);

        if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
          left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
          if ((kind & (BindingKind.Empty | BindingKind.ArgumentList)) === 0 && token === Token.LeftParen)
            destructible |= DestructuringKind.CannotDestruct;
        } else if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
        } else if (token === Token.LeftParen) {
          destructible |=
            parser.assignable & AssignmentKind.Assignable && kind & (BindingKind.Empty | BindingKind.ArgumentList)
              ? DestructuringKind.Assignable
              : DestructuringKind.CannotDestruct;
        }
      }

      elements.push(left);

      if (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        if (parser.getToken() === Token.RightBracket) break;
      } else break;
    }
  }

  consume(parser, context, Token.RightBracket);

  const node = finishNode(parser, context, start, line, column, {
    type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
    elements
  } as any);

  if (!skipInitializer && parser.getToken() & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(
      parser,
      context,
      destructible,
      inGroup,
      isPattern,
      start,
      line,
      column,
      node
    );
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
  isPattern: 0 | 1,
  start: number,
  line: number,
  column: number,
  node: ESTree.ArrayExpression | ESTree.ObjectExpression | ESTree.ObjectPattern
): ESTree.AssignmentExpression {
  // 12.15.5 Destructuring Assignment
  //
  // AssignmentElement[Yield, Await]:
  //   DestructuringAssignmentTarget[?Yield, ?Await]
  //   DestructuringAssignmentTarget[?Yield, ?Await] Initializer[+In, ?Yield, ?Await]
  //

  if (parser.getToken() !== Token.Assign) report(parser, Errors.CantAssignTo);

  nextToken(parser, context | Context.AllowRegExp);

  if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.CantAssignTo);

  if (!isPattern) reinterpretToPattern(parser, node);

  const { tokenPos, linePos, colPos } = parser;

  const right = parseExpression(parser, context, 1, inGroup, tokenPos, linePos, colPos);

  parser.destructible =
    ((destructible | DestructuringKind.SeenProto | DestructuringKind.HasToDestruct) ^
      (DestructuringKind.HasToDestruct | DestructuringKind.SeenProto)) |
    (parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0) |
    (parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0);

  return finishNode(
    parser,
    context,
    start,
    line,
    column,
    isPattern
      ? {
          type: 'AssignmentPattern',
          left: node,
          right
        }
      : ({
          type: 'AssignmentExpression',
          left: node,
          operator: '=',
          right
        } as any)
  );
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
function parseSpreadOrRestElement(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  closingToken: Token,
  kind: BindingKind,
  origin: Origin,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.SpreadElement | ESTree.RestElement {
  nextToken(parser, context | Context.AllowRegExp); // skip '...'

  let argument: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = DestructuringKind.None;

  const { tokenValue, tokenPos, linePos, colPos } = parser;
  let token = parser.getToken();

  if (token & (Token.Keyword | Token.IsIdentifier)) {
    parser.assignable = AssignmentKind.Assignable;

    argument = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);

    token = parser.getToken();

    argument = parseMemberOrUpdateExpression(
      parser,
      context,
      argument as ESTree.Expression,
      inGroup,
      0,
      tokenPos,
      linePos,
      colPos
    );

    if (parser.getToken() !== Token.Comma && parser.getToken() !== closingToken) {
      if (parser.assignable & AssignmentKind.CannotAssign && parser.getToken() === Token.Assign)
        report(parser, Errors.InvalidDestructuringTarget);

      destructible |= DestructuringKind.CannotDestruct;

      argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
    }

    if (parser.assignable & AssignmentKind.CannotAssign) {
      destructible |= DestructuringKind.CannotDestruct;
    } else if (token === closingToken || token === Token.Comma) {
      if (scope) addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
    } else {
      destructible |= DestructuringKind.Assignable;
    }

    destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
  } else if (token === closingToken) {
    report(parser, Errors.RestMissingArg);
  } else if (token & Token.IsPatternStart) {
    argument =
      parser.getToken() === Token.LeftBrace
        ? parseObjectLiteralOrPattern(
            parser,
            context,
            scope,
            1,
            inGroup,
            isPattern,
            kind,
            origin,
            tokenPos,
            linePos,
            colPos
          )
        : parseArrayExpressionOrPattern(
            parser,
            context,
            scope,
            1,
            inGroup,
            isPattern,
            kind,
            origin,
            tokenPos,
            linePos,
            colPos
          );

    token = parser.getToken();

    if (token !== Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidDestructuringTarget);

      argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);

      destructible |= parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

      if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
        if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
        argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
      } else {
        if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
          argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument as any);
        }
        if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
          argument = parseConditionalExpression(parser, context, argument as any, tokenPos, linePos, colPos);
        }
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

    argument = parseLeftHandSideExpression(
      parser,
      context,
      1,
      inGroup,
      1,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );

    const { tokenPos, linePos, colPos } = parser;
    const token = parser.getToken();

    if (token === Token.Assign) {
      if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.CantAssignTo);

      argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);

      destructible |= DestructuringKind.CannotDestruct;
    } else {
      if (token === Token.Comma) {
        destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== closingToken) {
        argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
      }

      destructible |=
        parser.assignable & AssignmentKind.Assignable ? DestructuringKind.Assignable : DestructuringKind.CannotDestruct;
    }

    parser.destructible = destructible;

    if (parser.getToken() !== closingToken && parser.getToken() !== Token.Comma)
      report(parser, Errors.UnclosedSpreadElement);

    return finishNode(parser, context, start, line, column, {
      type: isPattern ? 'RestElement' : 'SpreadElement',
      argument: argument as ESTree.SpreadArgument
    } as any);
  }

  if (parser.getToken() !== closingToken) {
    if (kind & BindingKind.ArgumentList)
      destructible |= isAsync ? DestructuringKind.CannotDestruct : DestructuringKind.Assignable;

    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
      if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.CantAssignTo);

      reinterpretToPattern(parser, argument);

      const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

      argument = finishNode(
        parser,
        context,
        tokenPos,
        linePos,
        colPos,
        isPattern
          ? {
              type: 'AssignmentPattern',
              left: argument as ESTree.SpreadArgument,
              right
            }
          : ({
              type: 'AssignmentExpression',
              left: argument as ESTree.SpreadArgument,
              operator: '=',
              right
            } as any)
      );

      destructible = DestructuringKind.CannotDestruct;
    } else {
      // Note the difference between '|=' and '=' above
      destructible |= DestructuringKind.CannotDestruct;
    }
  }

  parser.destructible = destructible;

  return finishNode(parser, context, start, line, column, {
    type: isPattern ? 'RestElement' : 'SpreadElement',
    argument: argument as ESTree.SpreadArgument
  } as any);
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
    Context.InYieldContext |
    Context.InAwaitContext |
    Context.InArgumentList |
    ((kind & PropertyKind.Constructor) === 0 ? Context.SuperCall | Context.InConstructor : 0);

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    (kind & PropertyKind.Generator ? Context.InYieldContext : 0) |
    (kind & PropertyKind.Async ? Context.InAwaitContext : 0) |
    (kind & PropertyKind.Constructor ? Context.InConstructor : 0) |
    Context.SuperProperty |
    Context.InMethod |
    Context.AllowNewTarget;

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

  const body = parseFunctionBody(
    parser,
    context & ~(Context.DisallowIn | Context.InSwitch | Context.InGlobal),
    scope,
    Origin.None,
    void 0,
    void 0
  );

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
    0,
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
 * @param inGroup
 * @param kind Binding kind
 * @param origin Binding origin
 * @param start
 * @param line
 * @param column
 */
export function parseObjectLiteralOrPattern(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
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

  const properties: (ESTree.Property | ESTree.SpreadElement | ESTree.RestElement)[] = [];
  let destructible: DestructuringKind | AssignmentKind = 0;
  let prototypeCount = 0;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  while (parser.getToken() !== Token.RightBrace) {
    const { tokenValue, linePos, colPos, tokenPos } = parser;
    const token = parser.getToken();

    if (token === Token.Ellipsis) {
      properties.push(
        parseSpreadOrRestElement(
          parser,
          context,
          scope,
          Token.RightBrace,
          kind,
          origin,
          0,
          inGroup,
          isPattern,
          tokenPos,
          linePos,
          colPos
        )
      );
    } else {
      let state = PropertyKind.None;
      let key: ESTree.Expression | null = null;
      let value;
      const t = parser.getToken();
      if (parser.getToken() & (Token.IsIdentifier | Token.Keyword) || parser.getToken() === Token.EscapedReserved) {
        key = parseIdentifier(parser, context);

        if (
          parser.getToken() === Token.Comma ||
          parser.getToken() === Token.RightBrace ||
          parser.getToken() === Token.Assign
        ) {
          state |= PropertyKind.Shorthand;

          if (context & Context.Strict && (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
            destructible |= DestructuringKind.CannotDestruct;
          } else {
            validateBindingIdentifier(parser, context, kind, token, 0);
          }

          if (scope) addVarOrBlock(parser, context, scope, tokenValue, kind, origin);

          if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
            destructible |= DestructuringKind.HasToDestruct;

            const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

            destructible |=
              parser.destructible & DestructuringKind.Yield
                ? DestructuringKind.Yield
                : 0 | (parser.destructible & DestructuringKind.Await)
                  ? DestructuringKind.Await
                  : 0;

            value = finishNode(parser, context, tokenPos, linePos, colPos, {
              type: 'AssignmentPattern',
              left: context & Context.OptionsUniqueKeyInPattern ? Object.assign({}, key) : key,
              right
            });
          } else {
            destructible |=
              (token === Token.AwaitKeyword ? DestructuringKind.Await : 0) |
              (token === Token.EscapedReserved ? DestructuringKind.CannotDestruct : 0);
            value = context & Context.OptionsUniqueKeyInPattern ? Object.assign({}, key) : key;
          }
        } else if (consumeOpt(parser, context | Context.AllowRegExp, Token.Colon)) {
          const { tokenPos, linePos, colPos } = parser;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.getToken() & Token.IsIdentifier) {
            const tokenAfterColon = parser.getToken();
            const valueAfterColon = parser.tokenValue;
            // A reserved word is an IdentifierName that cannot be used as an Identifier
            destructible |= t === Token.EscapedReserved ? DestructuringKind.CannotDestruct : 0;

            value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);

            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
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
            } else if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |= DestructuringKind.Assignable;
              } else if (scope) {
                addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
              }
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
              }
              if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
              }
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    isPattern,
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
                    isPattern,
                    kind,
                    origin,
                    tokenPos,
                    linePos,
                    colPos
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (parser.destructible & DestructuringKind.HasToDestruct) {
              report(parser, Errors.InvalidDestructuringTarget);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, tokenPos, linePos, colPos);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if (parser.getToken() !== Token.Comma && token !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              }
            }
          }
        } else if (parser.getToken() === Token.LeftBracket) {
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
        } else if (parser.getToken() & (Token.IsIdentifier | Token.Keyword)) {
          destructible |= DestructuringKind.CannotDestruct;
          if (token === Token.EscapedReserved) report(parser, Errors.InvalidEscapedKeyword);
          if (token === Token.AsyncKeyword) {
            if (parser.flags & Flags.NewLine) report(parser, Errors.AsyncRestrictedProd);
            state |= PropertyKind.Async;
          }
          key = parseIdentifier(parser, context);

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
        } else if (parser.getToken() === Token.LeftParen) {
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
        } else if (parser.getToken() === Token.Multiply) {
          destructible |= DestructuringKind.CannotDestruct;

          if (token === Token.GetKeyword) {
            report(parser, Errors.InvalidGeneratorGetter);
          } else if (token === Token.SetKeyword) {
            report(parser, Errors.InvalidGeneratorSetter);
          } else if (token === Token.AnyIdentifier) {
            report(parser, Errors.InvalidEscapedKeyword);
          }

          nextToken(parser, context);

          state |=
            PropertyKind.Generator | PropertyKind.Method | (token === Token.AsyncKeyword ? PropertyKind.Async : 0);

          if (parser.getToken() & Token.IsIdentifier) {
            key = parseIdentifier(parser, context);
          } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
            key = parseLiteral(parser, context);
          } else if (parser.getToken() === Token.LeftBracket) {
            state |= PropertyKind.Computed;
            key = parseComputedPropertyName(parser, context, inGroup);
            destructible |= parser.assignable;
          } else {
            report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
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
        } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
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
      } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
        key = parseLiteral(parser, context);

        if (parser.getToken() === Token.Colon) {
          consume(parser, context | Context.AllowRegExp, Token.Colon);

          const { tokenPos, linePos, colPos } = parser;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.getToken() & Token.IsIdentifier) {
            value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);

            const { tokenValue: valueAfterColon } = parser;
            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
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
            } else if (parser.getToken() === Token.Assign) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    isPattern,
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
                    isPattern,
                    kind,
                    origin,
                    tokenPos,
                    linePos,
                    colPos
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else if ((parser.destructible & DestructuringKind.HasToDestruct) !== DestructuringKind.HasToDestruct) {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              }
            }
          }
        } else if (parser.getToken() === Token.LeftParen) {
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
      } else if (parser.getToken() === Token.LeftBracket) {
        key = parseComputedPropertyName(parser, context, inGroup);

        destructible |= parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0;

        state |= PropertyKind.Computed;

        if (parser.getToken() === Token.Colon) {
          nextToken(parser, context | Context.AllowRegExp); // skip ':'

          const { tokenPos, linePos, colPos, tokenValue } = parser;
          const tokenAfterColon = parser.getToken();

          if (parser.getToken() & Token.IsIdentifier) {
            value = parsePrimaryExpression(parser, context, kind, 0, 1, inGroup, 1, tokenPos, linePos, colPos);

            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

            if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
              destructible |=
                parser.assignable & AssignmentKind.CannotAssign
                  ? DestructuringKind.CannotDestruct
                  : token === Token.Assign
                    ? 0
                    : DestructuringKind.Assignable;
              value = parseAssignmentExpressionOrPattern(
                parser,
                context,
                inGroup,
                isPattern,
                tokenPos,
                linePos,
                colPos,
                value
              );
            } else if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
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
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    0,
                    inGroup,
                    isPattern,
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
                    isPattern,
                    kind,
                    origin,
                    tokenPos,
                    linePos,
                    colPos
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (destructible & DestructuringKind.HasToDestruct) {
              report(parser, Errors.InvalidShorthandPropInit);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

              destructible =
                parser.assignable & AssignmentKind.CannotAssign ? destructible | DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(
                  parser,
                  context,
                  inGroup,
                  isPattern,
                  tokenPos,
                  linePos,
                  colPos,
                  value
                );
              }
            }
          }
        } else if (parser.getToken() === Token.LeftParen) {
          state |= PropertyKind.Method;

          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);

          destructible = DestructuringKind.CannotDestruct;
        } else {
          report(parser, Errors.InvalidComputedPropName);
        }
      } else if (token === Token.Multiply) {
        consume(parser, context | Context.AllowRegExp, Token.Multiply);

        state |= PropertyKind.Generator;

        if (parser.getToken() & Token.IsIdentifier) {
          const { line, index } = parser;
          const token = parser.getToken();

          key = parseIdentifier(parser, context);

          state |= PropertyKind.Method;

          if (parser.getToken() === Token.LeftParen) {
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
                : token === Token.GetKeyword || parser.getToken() === Token.SetKeyword
                  ? Errors.InvalidGetSetGenerator
                  : Errors.InvalidGenMethodShorthand,
              KeywordDescTable[token & Token.Type]
            );
          }
        } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
          destructible |= DestructuringKind.CannotDestruct;
          key = parseLiteral(parser, context);
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
        } else if (parser.getToken() === Token.LeftBracket) {
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
    if (parser.getToken() !== Token.Comma) break;
    nextToken(parser, context);
  }

  consume(parser, context, Token.RightBrace);

  if (prototypeCount > 1) destructible |= DestructuringKind.SeenProto;

  const node = finishNode(parser, context, start, line, column, {
    type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
    properties
  });

  if (!skipInitializer && parser.getToken() & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(
      parser,
      context,
      destructible,
      inGroup,
      isPattern,
      start,
      line,
      column,
      node
    );
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

  if (parser.getToken() === Token.RightParen) {
    if (kind & PropertyKind.Setter) {
      report(parser, Errors.AccessorWrongArgs, 'Setter', 'one', '');
    }
    nextToken(parser, context);
    return params;
  }

  if (kind & PropertyKind.Getter) {
    report(parser, Errors.AccessorWrongArgs, 'Getter', 'no', 's');
  }
  if (kind & PropertyKind.Setter && parser.getToken() === Token.Ellipsis) {
    report(parser, Errors.BadSetterRestParameter);
  }

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  let setterArgs = 0;
  let isSimpleParameterList: 0 | 1 = 0;

  while (parser.getToken() !== Token.Comma) {
    let left = null;
    const { tokenPos, linePos, colPos } = parser;

    if (parser.getToken() & Token.IsIdentifier) {
      if ((context & Context.Strict) === 0) {
        if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
          parser.flags |= Flags.HasStrictReserved;
        }

        if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.flags |= Flags.StrictEvalArguments;
        }
      }

      left = parseAndClassifyIdentifier(
        parser,
        context,
        scope,
        kind | BindingKind.ArgumentList,
        Origin.None,
        tokenPos,
        linePos,
        colPos
      );
    } else {
      if (parser.getToken() === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          1,
          type,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.getToken() === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          1,
          type,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.getToken() === Token.Ellipsis) {
        left = parseSpreadOrRestElement(
          parser,
          context,
          scope,
          Token.RightParen,
          type,
          Origin.None,
          0,
          inGroup,
          1,
          tokenPos,
          linePos,
          colPos
        );
      }

      isSimpleParameterList = 1;

      if (parser.destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
        report(parser, Errors.InvalidBindingDestruct);
    }

    if (parser.getToken() === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isSimpleParameterList = 1;

      const right = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);

      left = finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left: left as ESTree.BindingPattern | ESTree.Identifier,
        right
      });
    }

    setterArgs++;

    params.push(left as any);

    if (!consumeOpt(parser, context, Token.Comma)) break;
    if (parser.getToken() === Token.RightParen) {
      // allow the trailing comma
      break;
    }
  }

  if (kind & PropertyKind.Setter && setterArgs !== 1) {
    report(parser, Errors.AccessorWrongArgs, 'Setter', 'one', '');
  }

  if (scope && scope.scopeError !== void 0) reportScopeError(scope.scopeError);

  if (isSimpleParameterList) parser.flags |= Flags.SimpleParameterList;

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
  canAssign: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): any {
  parser.flags = (parser.flags | Flags.SimpleParameterList) ^ Flags.SimpleParameterList;

  const { tokenPos: piStart, linePos: plStart, colPos: pcStart } = parser;

  nextToken(parser, context | Context.AllowRegExp | Context.AllowEscapedKeyword);

  const scope = context & Context.OptionsLexical ? addChildScope(createScope(), ScopeKind.ArrowParams) : void 0;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (consumeOpt(parser, context, Token.RightParen)) {
    // Not valid expression syntax, but this is valid in an arrow function
    // with no params: `() => body`.
    return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
  }

  let destructible: AssignmentKind | DestructuringKind = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  let expr;
  let expressions: ESTree.Expression[] = [];
  let isSequence: 0 | 1 = 0;
  let isSimpleParameterList: 0 | 1 = 0;

  const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;

  parser.assignable = AssignmentKind.Assignable;

  while (parser.getToken() !== Token.RightParen) {
    const { tokenPos, linePos, colPos } = parser;
    const token = parser.getToken();

    if (token & (Token.IsIdentifier | Token.Keyword)) {
      if (scope) addBlockName(parser, context, scope, parser.tokenValue, BindingKind.ArgumentList, Origin.None);

      expr = parsePrimaryExpression(parser, context, kind, 0, 1, 1, 1, tokenPos, linePos, colPos);

      if (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isSimpleParameterList = 1;
        } else if (
          (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
          (token & Token.FutureReserved) === Token.FutureReserved
        ) {
          isSimpleParameterList = 1;
        }
      } else {
        if (parser.getToken() === Token.Assign) {
          isSimpleParameterList = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(parser, context, expr, /* inGroup */ 1, 0, tokenPos, linePos, colPos);

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(
              parser,
              context | Context.AllowEscapedKeyword,
              scope,
              0,
              1,
              0,
              kind,
              origin,
              tokenPos,
              linePos,
              colPos
            )
          : parseArrayExpressionOrPattern(
              parser,
              context | Context.AllowEscapedKeyword,
              scope,
              0,
              1,
              0,
              kind,
              origin,
              tokenPos,
              linePos,
              colPos
            );

      destructible |= parser.destructible;

      isSimpleParameterList = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);

        destructible |= DestructuringKind.CannotDestruct;

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadOrRestElement(
        parser,
        context,
        scope,
        Token.RightParen,
        kind,
        origin,
        0,
        1,
        0,
        tokenPos,
        linePos,
        colPos
      );

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidRestArg);

      isSimpleParameterList = 1;

      if (isSequence && (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma)) {
        expressions.push(expr);
      }
      destructible |= DestructuringKind.HasToDestruct;
      break;
    } else {
      destructible |= DestructuringKind.CannotDestruct;

      expr = parseExpression(parser, context, 1, 1, tokenPos, linePos, colPos);

      if (isSequence && (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma)) {
        expressions.push(expr);
      }

      if (parser.getToken() === Token.Comma) {
        if (!isSequence) {
          isSequence = 1;
          expressions = [expr];
        }
      }

      if (isSequence) {
        while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
          expressions.push(parseExpression(parser, context, 1, 1, parser.tokenPos, parser.linePos, parser.colPos));
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

    if (isSequence && (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma)) {
      expressions.push(expr);
    }

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;

    if (!isSequence) {
      isSequence = 1;
      expressions = [expr];
    }

    if (parser.getToken() === Token.RightParen) {
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

  if (parser.getToken() === Token.Arrow) {
    if (destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
      report(parser, Errors.InvalidArrowDestructLHS);
    if (context & (Context.InAwaitContext | Context.Module) && destructible & DestructuringKind.Await)
      report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield) {
      report(parser, Errors.YieldInParameter);
    }
    if (isSimpleParameterList) parser.flags |= Flags.SimpleParameterList;
    return parseParenthesizedArrow(
      parser,
      context,
      scope,
      isSequence ? expressions : [expr],
      canAssign,
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
    ? finishNode(parser, context, piStart, plStart, pcStart, {
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

  const expr = parseIdentifier(parser, context);
  parser.assignable = AssignmentKind.Assignable;
  if (parser.getToken() === Token.Arrow) {
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
function parseArrowFromIdentifier(
  parser: ParserState,
  context: Context,
  value: any,
  expr: ESTree.Expression,
  inNew: 0 | 1,
  canAssign: 0 | 1,
  isAsync: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ArrowFunctionExpression {
  if (!canAssign) report(parser, Errors.InvalidAssignmentTarget);
  if (inNew) report(parser, Errors.InvalidAsyncArrow);
  parser.flags &= ~Flags.SimpleParameterList;
  const scope = context & Context.OptionsLexical ? createArrowHeadParsingScope(parser, context, value) : void 0;

  return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
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
function parseParenthesizedArrow(
  parser: ParserState,
  context: Context,
  scope: ScopeState | undefined,
  params: any,
  canAssign: 0 | 1,
  isAsync: 0 | 1,
  start: number,
  line: number,
  column: number
): ESTree.ArrowFunctionExpression {
  if (!canAssign) report(parser, Errors.InvalidAssignmentTarget);

  for (let i = 0; i < params.length; ++i) reinterpretToPattern(parser, params[i]);

  return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
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

  const modifierFlags = Context.InYieldContext | Context.InAwaitContext | Context.InArgumentList;

  context = ((context | modifierFlags) ^ modifierFlags) | (isAsync ? Context.InAwaitContext : 0);

  const expression = parser.getToken() !== Token.LeftBrace;

  let body: ESTree.BlockStatement | ESTree.Expression;

  if (scope && scope.scopeError !== void 0) {
    reportScopeError(scope.scopeError);
  }

  if (expression) {
    // Single-expression body
    body = parseExpression(
      parser,
      context & Context.InClass ? context | Context.InMethod : context,
      1,
      0,
      parser.tokenPos,
      parser.linePos,
      parser.colPos
    );
  } else {
    if (scope) scope = addChildScope(scope, ScopeKind.FunctionBody);

    const modifierFlags = Context.InSwitch | Context.DisallowIn | Context.InGlobal | Context.InClass;

    body = parseFunctionBody(parser, (context | modifierFlags) ^ modifierFlags, scope, Origin.Arrow, void 0, void 0);

    switch (parser.getToken()) {
      case Token.LeftBracket:
        if ((parser.flags & Flags.NewLine) === 0) {
          report(parser, Errors.InvalidInvokedBlockBodyArrow);
        }
        break;
      case Token.Period:
      case Token.TemplateSpan:
      case Token.QuestionMark:
        report(parser, Errors.InvalidAccessedBlockBodyArrow);
      case Token.LeftParen:
        if ((parser.flags & Flags.NewLine) === 0) {
          report(parser, Errors.InvalidInvokedBlockBodyArrow);
        }
        parser.flags |= Flags.DisallowCall;
        break;
      default: // ignore
    }
    if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp && (parser.flags & Flags.NewLine) === 0)
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
    if ((parser.getToken() & Token.IsUpdateOp) === Token.IsUpdateOp) report(parser, Errors.InvalidArrowPostfix);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'ArrowFunctionExpression',
    params,
    body,
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
): ESTree.Parameter[] {
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

  if (consumeOpt(parser, context, Token.RightParen)) return params;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  let isSimpleParameterList: 0 | 1 = 0;

  while (parser.getToken() !== Token.Comma) {
    let left: any;

    const { tokenPos, linePos, colPos } = parser;

    if (parser.getToken() & Token.IsIdentifier) {
      if ((context & Context.Strict) === 0) {
        if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
          parser.flags |= Flags.HasStrictReserved;
        }
        if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.flags |= Flags.StrictEvalArguments;
        }
      }

      left = parseAndClassifyIdentifier(
        parser,
        context,
        scope,
        kind | BindingKind.ArgumentList,
        Origin.None,
        tokenPos,
        linePos,
        colPos
      );
    } else {
      if (parser.getToken() === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          1,
          kind,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.getToken() === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(
          parser,
          context,
          scope,
          1,
          inGroup,
          1,
          kind,
          Origin.None,
          tokenPos,
          linePos,
          colPos
        );
      } else if (parser.getToken() === Token.Ellipsis) {
        left = parseSpreadOrRestElement(
          parser,
          context,
          scope,
          Token.RightParen,
          kind,
          Origin.None,
          0,
          inGroup,
          1,
          tokenPos,
          linePos,
          colPos
        );
      } else {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
      }

      isSimpleParameterList = 1;

      if (parser.destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct)) {
        report(parser, Errors.InvalidBindingDestruct);
      }
    }

    if (parser.getToken() === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isSimpleParameterList = 1;

      const right = parseExpression(parser, context, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

      left = finishNode(parser, context, tokenPos, linePos, colPos, {
        type: 'AssignmentPattern',
        left,
        right
      });
    }

    params.push(left);

    if (!consumeOpt(parser, context, Token.Comma)) break;
    if (parser.getToken() === Token.RightParen) {
      // allow the trailing comma
      break;
    }
  }

  if (isSimpleParameterList) parser.flags |= Flags.SimpleParameterList;

  if (scope && (isSimpleParameterList || context & Context.Strict) && scope.scopeError !== void 0) {
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
  const token = parser.getToken();

  if (token & Token.IsMemberOrCallExpression) {
    /* Property */
    if (token === Token.Period) {
      nextToken(parser, context | Context.AllowEscapedKeyword);

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
        finishNode(parser, context, start, line, column, {
          type: 'TaggedTemplateExpression',
          tag: expr,
          quasi:
            parser.getToken() === Token.TemplateContinuation
              ? parseTemplate(parser, context | Context.TaggedTemplate)
              : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
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
  const id = parseIdentifier(parser, context | Context.AllowRegExp);
  const { tokenPos, linePos, colPos } = parser;

  if (consumeOpt(parser, context, Token.Period)) {
    if (context & Context.AllowNewTarget && parser.getToken() === Token.Target) {
      parser.assignable = AssignmentKind.CannotAssign;
      return parseMetaProperty(parser, context, id, start, line, column);
    }

    report(parser, Errors.InvalidNewTarget);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  if ((parser.getToken() & Token.IsUnaryOp) === Token.IsUnaryOp) {
    report(parser, Errors.InvalidNewUnary, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  const expr = parsePrimaryExpression(parser, context, BindingKind.Empty, 1, 0, inGroup, 1, tokenPos, linePos, colPos);

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (parser.getToken() === Token.QuestionMarkPeriod) report(parser, Errors.OptionalChainingNoNew);

  // NewExpression without arguments.
  const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, line, column, {
    type: 'NewExpression',
    callee,
    arguments: parser.getToken() === Token.LeftParen ? parseArguments(parser, context, inGroup) : []
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
  const property = parseIdentifier(parser, context);
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
 * @param inNew
 * @param assignable
 */

/**
 * Parses async arrow after identifier
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param canAssign Either true or false
 * @param start Start pos of node
 * @param line Line pos of node
 * @param column Column pos of node
 */
function parseAsyncArrowAfterIdent(
  parser: ParserState,
  context: Context,
  canAssign: 0 | 1,
  start: number,
  line: number,
  column: number
) {
  if (parser.getToken() === Token.AwaitKeyword) report(parser, Errors.AwaitInParameter);

  if (context & (Context.Strict | Context.InYieldContext) && parser.getToken() === Token.YieldKeyword) {
    report(parser, Errors.YieldInParameter);
  }

  if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
    parser.flags |= Flags.StrictEvalArguments;
  }

  return parseArrowFromIdentifier(
    parser,
    context,
    parser.tokenValue,
    parseIdentifier(parser, context),
    0,
    canAssign,
    1,
    start,
    line,
    column
  );
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
  canAssign: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  flags: Flags,
  start: number,
  line: number,
  column: number
): ESTree.CallExpression | ESTree.ArrowFunctionExpression {
  nextToken(parser, context | Context.AllowRegExp);

  const scope = context & Context.OptionsLexical ? addChildScope(createScope(), ScopeKind.ArrowParams) : void 0;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (consumeOpt(parser, context, Token.RightParen)) {
    if (parser.getToken() === Token.Arrow) {
      if (flags & Flags.NewLine) report(parser, Errors.InvalidLineBreak);
      return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
    }

    return finishNode(parser, context, start, line, column, {
      type: 'CallExpression',
      callee,
      arguments: []
    });
  }

  let destructible: AssignmentKind | DestructuringKind = 0;
  let expr: ESTree.Expression | null = null;
  let isSimpleParameterList: 0 | 1 = 0;

  parser.destructible =
    (parser.destructible | DestructuringKind.Yield | DestructuringKind.Await) ^
    (DestructuringKind.Yield | DestructuringKind.Await);

  const params: ESTree.Expression[] = [];

  while (parser.getToken() !== Token.RightParen) {
    const { tokenPos, linePos, colPos } = parser;
    const token = parser.getToken();

    if (token & (Token.IsIdentifier | Token.Keyword)) {
      if (scope) addBlockName(parser, context, scope, parser.tokenValue, kind, Origin.None);

      expr = parsePrimaryExpression(parser, context, kind, 0, 1, 1, 1, tokenPos, linePos, colPos);

      if (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isSimpleParameterList = 1;
        } else if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.flags |= Flags.StrictEvalArguments;
        } else if ((token & Token.FutureReserved) === Token.FutureReserved) {
          parser.flags |= Flags.HasStrictReserved;
        }
      } else {
        if (parser.getToken() === Token.Assign) {
          isSimpleParameterList = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(
          parser,
          context,
          expr as ESTree.Expression,
          1,
          0,
          tokenPos,
          linePos,
          colPos
        );

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr as ESTree.Expression);
        }
      }
    } else if (token & Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
          : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);

      destructible |= parser.destructible;

      isSimpleParameterList = 1;

      if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);

        destructible |= DestructuringKind.CannotDestruct;

        if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
          expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr as ESTree.Expression);
        }
        if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
          expr = parseConditionalExpression(parser, context, expr as ESTree.Expression, start, line, column);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadOrRestElement(
        parser,
        context,
        scope,
        Token.RightParen,
        kind,
        origin,
        1,
        1,
        0,
        tokenPos,
        linePos,
        colPos
      );

      destructible |=
        (parser.getToken() === Token.RightParen ? 0 : DestructuringKind.CannotDestruct) | parser.destructible;

      isSimpleParameterList = 1;
    } else {
      expr = parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos);

      destructible = parser.assignable;

      params.push(expr);

      while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        params.push(parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos));
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

    params.push(expr as ESTree.Expression);

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;
  }

  consume(parser, context, Token.RightParen);

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
        ? DestructuringKind.Await
        : 0;

  if (parser.getToken() === Token.Arrow) {
    if (destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
      report(parser, Errors.InvalidLHSAsyncArrow);
    if (parser.flags & Flags.NewLine || flags & Flags.NewLine) report(parser, Errors.InvalidLineBreak);
    if (destructible & DestructuringKind.Await) report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield)
      report(parser, Errors.YieldInParameter);
    if (isSimpleParameterList) parser.flags |= Flags.SimpleParameterList;

    return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
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
): ESTree.RegExpLiteral {
  const { tokenRaw, tokenRegExp, tokenValue } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return context & Context.OptionsRaw
    ? finishNode(parser, context, start, line, column, {
        type: 'Literal',
        value: tokenValue,
        regex: tokenRegExp as { pattern: string; flags: string },
        raw: tokenRaw
      })
    : finishNode(parser, context, start, line, column, {
        type: 'Literal',
        value: tokenValue,
        regex: tokenRegExp as { pattern: string; flags: string }
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

  let decorators = parseDecorators(parser, context);
  if (decorators.length) {
    start = parser.tokenPos;
    line = parser.linePos;
    column = parser.colPos;
  }

  if (parser.leadingDecorators.length) {
    parser.leadingDecorators.push(...decorators);
    decorators = parser.leadingDecorators;
    parser.leadingDecorators = [];
  }

  nextToken(parser, context);
  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  const { tokenValue } = parser;

  if (parser.getToken() & Token.Keyword && parser.getToken() !== Token.ExtendsKeyword) {
    if (isStrictReservedWord(parser, context, parser.getToken())) {
      report(parser, Errors.UnexpectedStrictReserved);
    }

    if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    }

    if (scope) {
      // A named class creates a new lexical scope with a const binding of the
      // class name for the "inner name".
      addBlockName(parser, context, scope, tokenValue, BindingKind.Class, Origin.None);

      if (flags) {
        if (flags & HoistedClassFlags.Export) {
          declareUnboundVariable(parser, tokenValue);
        }
      }
    }

    id = parseIdentifier(parser, context);
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
    if ((flags & HoistedClassFlags.Hoisted) === 0) report(parser, Errors.DeclNoName, 'Class');
  }
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(parser, inheritedContext, context, scope, BindingKind.Empty, Origin.Declaration, 0);

  return finishNode(parser, context, start, line, column, {
    type: 'ClassDeclaration',
    id,
    superClass,
    body,
    ...(context & Context.OptionsNext ? { decorators } : null)
  });
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
  context = (context | Context.Strict | Context.InConstructor) ^ Context.InConstructor;

  const decorators = parseDecorators(parser, context);
  if (decorators.length) {
    start = parser.tokenPos;
    line = parser.linePos;
    column = parser.colPos;
  }

  nextToken(parser, context);

  if (parser.getToken() & Token.Keyword && parser.getToken() !== Token.ExtendsKeyword) {
    if (isStrictReservedWord(parser, context, parser.getToken())) report(parser, Errors.UnexpectedStrictReserved);
    if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    }

    id = parseIdentifier(parser, context);
  }

  // Second set of context masks to fix 'super' edge cases
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(
      parser,
      context,
      0,
      inGroup,
      0,
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

  return finishNode(parser, context, start, line, column, {
    type: 'ClassExpression',
    id,
    superClass,
    body,
    ...(context & Context.OptionsNext ? { decorators } : null)
  });
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseDecorators(parser: ParserState, context: Context): ESTree.Decorator[] {
  const list: ESTree.Decorator[] = [];

  if (context & Context.OptionsNext) {
    while (parser.getToken() === Token.Decorator) {
      list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
    }
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

  let expression = parsePrimaryExpression(parser, context, BindingKind.Empty, 0, 1, 0, 1, start, line, column);

  expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);

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
   *   DecoratorList PropertyDefinition
   *   DecoratorList static PropertyDefinition
   *
   * MethodDefinition :
   *   ClassElementName ( FormalParameterList ) { FunctionBody }
   *    get ClassElementName ( ) { FunctionBody }
   *    set ClassElementName ( PropertySetParameterList ) { FunctionBody }
   *
   * ClassElementName :
   *   PropertyName
   *   PrivateIdentifier
   *
   * PrivateIdentifier ::
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
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  const hasConstr = parser.flags & Flags.HasConstructor;
  parser.flags = (parser.flags | Flags.HasConstructor) ^ Flags.HasConstructor;

  const body: (ESTree.MethodDefinition | ESTree.PropertyDefinition | ESTree.StaticBlock)[] = [];
  let decorators: ESTree.Decorator[];

  while (parser.getToken() !== Token.RightBrace) {
    let length = 0;

    // See: https://github.com/tc39/proposal-decorators

    decorators = parseDecorators(parser, context);

    length = decorators.length;

    if (length > 0 && parser.tokenValue === 'constructor') {
      report(parser, Errors.GeneratorConstructor);
    }

    if (parser.getToken() === Token.RightBrace) report(parser, Errors.TrailingDecorators);

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
  parser.flags = (parser.flags & ~Flags.HasConstructor) | hasConstr;

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
): ESTree.MethodDefinition | ESTree.PropertyDefinition | ESTree.StaticBlock {
  let kind: PropertyKind = isStatic ? PropertyKind.Static : PropertyKind.None;
  let key: ESTree.Expression | ESTree.PrivateIdentifier | null = null;

  const { tokenPos, linePos, colPos } = parser;
  const token = parser.getToken();

  if (token & (Token.IsIdentifier | Token.FutureReserved)) {
    key = parseIdentifier(parser, context);

    switch (token) {
      case Token.StaticKeyword:
        if (
          !isStatic &&
          parser.getToken() !== Token.LeftParen &&
          (parser.getToken() & Token.IsAutoSemicolon) !== Token.IsAutoSemicolon &&
          parser.getToken() !== Token.Assign
        ) {
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
        if (parser.getToken() !== Token.LeftParen && (parser.flags & Flags.NewLine) === 0) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }

          kind |= PropertyKind.Async | (optionalBit(parser, context, Token.Multiply) ? PropertyKind.Generator : 0);
        }
        break;

      case Token.GetKeyword:
        if (parser.getToken() !== Token.LeftParen) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= PropertyKind.Getter;
        }
        break;

      case Token.SetKeyword:
        if (parser.getToken() !== Token.LeftParen) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
          }
          kind |= PropertyKind.Setter;
        }
        break;

      default: // ignore
    }
  } else if (token === Token.LeftBracket) {
    kind |= PropertyKind.Computed;
    key = parseComputedPropertyName(parser, inheritedContext, inGroup);
  } else if ((token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    key = parseLiteral(parser, context);
  } else if (token === Token.Multiply) {
    kind |= PropertyKind.Generator;
    nextToken(parser, context); // skip: '*'
  } else if (parser.getToken() === Token.PrivateField) {
    kind |= PropertyKind.PrivateField;
    key = parsePrivateIdentifier(parser, context | Context.InClass, tokenPos, linePos, colPos);
  } else if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
    kind |= PropertyKind.ClassField;
  } else if (isStatic && token === Token.LeftBrace) {
    return parseStaticBlock(parser, context, scope, tokenPos, linePos, colPos);
  } else if (token === Token.EscapedFutureReserved) {
    key = parseIdentifier(parser, context);
    if (parser.getToken() !== Token.LeftParen)
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  } else {
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  if (kind & (PropertyKind.Generator | PropertyKind.Async | PropertyKind.GetSet)) {
    if (parser.getToken() & Token.IsIdentifier) {
      key = parseIdentifier(parser, context);
    } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
      key = parseLiteral(parser, context);
    } else if (parser.getToken() === Token.LeftBracket) {
      kind |= PropertyKind.Computed;
      key = parseComputedPropertyName(parser, context, /* inGroup */ 0);
    } else if (parser.getToken() === Token.EscapedFutureReserved) {
      key = parseIdentifier(parser, context);
    } else if (parser.getToken() === Token.PrivateField) {
      kind |= PropertyKind.PrivateField;
      key = parsePrivateIdentifier(parser, context, tokenPos, linePos, colPos);
    } else report(parser, Errors.InvalidKeyToken);
  }

  if ((kind & PropertyKind.Computed) === 0) {
    if (parser.tokenValue === 'constructor') {
      if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
        report(parser, Errors.InvalidClassFieldConstructor);
      } else if ((kind & PropertyKind.Static) === 0 && parser.getToken() === Token.LeftParen) {
        if (kind & (PropertyKind.GetSet | PropertyKind.Async | PropertyKind.ClassField | PropertyKind.Generator)) {
          report(parser, Errors.InvalidConstructor, 'accessor');
        } else if ((context & Context.SuperCall) === 0) {
          if (parser.flags & Flags.HasConstructor) report(parser, Errors.DuplicateConstructor);
          else parser.flags |= Flags.HasConstructor;
        }
      }
      kind |= PropertyKind.Constructor;
    } else if (
      // Static Async Generator Private Methods can be named "#prototype" (class declaration)
      (kind & PropertyKind.PrivateField) === 0 &&
      kind & (PropertyKind.Static | PropertyKind.GetSet | PropertyKind.Generator | PropertyKind.Async) &&
      parser.tokenValue === 'prototype'
    ) {
      report(parser, Errors.StaticPrototype);
    }
  }

  if (parser.getToken() !== Token.LeftParen && (kind & PropertyKind.GetSet) === 0) {
    return parsePropertyDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
  }

  const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);

  return finishNode(parser, context, start, line, column, {
    type: 'MethodDefinition',
    kind:
      (kind & PropertyKind.Static) === 0 && kind & PropertyKind.Constructor
        ? 'constructor'
        : kind & PropertyKind.Getter
          ? 'get'
          : kind & PropertyKind.Setter
            ? 'set'
            : 'method',
    static: (kind & PropertyKind.Static) > 0,
    computed: (kind & PropertyKind.Computed) > 0,
    key,
    value,
    ...(context & Context.OptionsNext ? { decorators } : null)
  });
}

/**
 * Parses private name
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePrivateIdentifier(
  parser: ParserState,
  context: Context,
  start: number,
  line: number,
  column: number
): ESTree.PrivateIdentifier {
  // PrivateIdentifier::
  //    #IdentifierName
  nextToken(parser, context); // skip: '#'
  const { tokenValue } = parser;
  if (tokenValue === 'constructor') report(parser, Errors.InvalidStaticClassFieldConstructor);
  nextToken(parser, context);

  return finishNode(parser, context, start, line, column, {
    type: 'PrivateIdentifier',
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

export function parsePropertyDefinition(
  parser: ParserState,
  context: Context,
  key: ESTree.PrivateIdentifier | ESTree.Expression | null,
  state: PropertyKind,
  decorators: ESTree.Decorator[] | null,
  start: number,
  line: number,
  column: number
): ESTree.PropertyDefinition {
  //  ClassElement :
  //    MethodDefinition
  //    static MethodDefinition
  //    PropertyDefinition ;
  //  ;
  let value: ESTree.Expression | null = null;

  if (state & PropertyKind.Generator) report(parser, Errors.Unexpected);

  if (parser.getToken() === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);

    const { tokenPos, linePos, colPos } = parser;

    if (parser.getToken() === Token.Arguments) report(parser, Errors.StrictEvalArguments);

    const modifierFlags =
      Context.InYieldContext |
      Context.InAwaitContext |
      Context.InArgumentList |
      ((state & PropertyKind.Constructor) === 0 ? Context.SuperCall | Context.InConstructor : 0);

    context =
      ((context | modifierFlags) ^ modifierFlags) |
      (state & PropertyKind.Generator ? Context.InYieldContext : 0) |
      (state & PropertyKind.Async ? Context.InAwaitContext : 0) |
      (state & PropertyKind.Constructor ? Context.InConstructor : 0) |
      Context.SuperProperty |
      Context.InMethod |
      Context.AllowNewTarget;

    value = parsePrimaryExpression(
      parser,
      context | Context.InClass,
      BindingKind.Empty,
      0,
      1,
      0,
      1,
      tokenPos,
      linePos,
      colPos
    );

    if (
      (parser.getToken() & Token.IsClassField) !== Token.IsClassField ||
      (parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp
    ) {
      value = parseMemberOrUpdateExpression(
        parser,
        context | Context.InClass,
        value as ESTree.Expression,
        0,
        0,
        tokenPos,
        linePos,
        colPos
      );

      value = parseAssignmentExpression(parser, context | Context.InClass, 0, 0, tokenPos, linePos, colPos, value);
    }
  }

  matchOrInsertSemicolon(parser, context);

  return finishNode(parser, context, start, line, column, {
    type: 'PropertyDefinition',
    key,
    value,
    static: (state & PropertyKind.Static) > 0,
    computed: (state & PropertyKind.Computed) > 0,
    ...(context & Context.OptionsNext ? { decorators } : null)
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

  if (parser.getToken() & Token.IsIdentifier)
    return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);

  if ((parser.getToken() & Token.IsPatternStart) !== Token.IsPatternStart)
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);

  const left: any =
    parser.getToken() === Token.LeftBracket
      ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column)
      : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);

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
  scope: ScopeState | undefined,
  kind: BindingKind,
  origin: Origin,
  start: number,
  line: number,
  column: number
): ESTree.Identifier {
  const { tokenValue } = parser;
  const token = parser.getToken();

  if (context & Context.Strict) {
    if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      report(parser, Errors.StrictEvalArguments);
    } else if ((token & Token.FutureReserved) === Token.FutureReserved) {
      report(parser, Errors.UnexpectedStrictReserved);
    }
  }

  if ((token & Token.Reserved) === Token.Reserved) {
    report(parser, Errors.KeywordNotId);
  }

  if (context & (Context.Module | Context.InYieldContext) && token === Token.YieldKeyword) {
    report(parser, Errors.YieldInParameter);
  }
  if (token === Token.LetKeyword) {
    if (kind & (BindingKind.Let | BindingKind.Const)) report(parser, Errors.InvalidLetConstBinding);
  }
  if (context & (Context.InAwaitContext | Context.Module) && token === Token.AwaitKeyword) {
    report(parser, Errors.AwaitOutsideAsync);
  }

  nextToken(parser, context);

  if (scope) addVarOrBlock(parser, context, scope, tokenValue, kind, origin);

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
  if (parser.getToken() === Token.GreaterThan) {
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
  scanJSXToken(parser, context);
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
    parser.setToken(scanJSXToken(parser, context));
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
  while (parser.getToken() !== Token.JSXClose) {
    parser.index = parser.tokenPos = parser.startPos;
    parser.column = parser.colPos = parser.startColumn;
    parser.line = parser.linePos = parser.startLine;
    scanJSXToken(parser, context);
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
  if (parser.getToken() === Token.JSXText) return parseJSXText(parser, context, start, line, column);
  if (parser.getToken() === Token.LeftBrace)
    return parseJSXExpressionContainer(parser, context, /*inJSXChild*/ 0, /* isAttr */ 0, start, line, column);
  if (parser.getToken() === Token.LessThan)
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
  scanJSXToken(parser, context);

  const node = {
    type: 'JSXText',
    value: parser.tokenValue as string
  } as ESTree.JSXText;

  if (context & Context.OptionsRaw) {
    node.raw = parser.tokenRaw;
  }

  return finishNode(parser, context, start, line, column, node);
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
  if (
    (parser.getToken() & Token.IsIdentifier) !== Token.IsIdentifier &&
    (parser.getToken() & Token.Keyword) !== Token.Keyword
  )
    report(parser, Errors.Unexpected);

  const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
  const attributes = parseJSXAttributes(parser, context);
  const selfClosing = parser.getToken() === Token.Divide;

  if (parser.getToken() === Token.GreaterThan) {
    scanJSXToken(parser, context);
  } else {
    consume(parser, context, Token.Divide);
    if (inJSXChild) {
      consume(parser, context, Token.GreaterThan);
    } else {
      scanJSXToken(parser, context);
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
  if (parser.getToken() === Token.Colon) return parseJSXNamespacedName(parser, context, key, start, line, column);

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
  while (
    parser.getToken() !== Token.Divide &&
    parser.getToken() !== Token.GreaterThan &&
    parser.getToken() !== Token.EOF
  ) {
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
  const expression = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
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
  if (parser.getToken() === Token.LeftBrace) return parseJSXSpreadAttribute(parser, context, start, line, column);
  scanJSXIdentifier(parser);
  let value: ESTree.JSXAttributeValue | null = null;
  let name: ESTree.JSXNamespacedName | ESTree.JSXIdentifier = parseJSXIdentifier(parser, context, start, line, column);

  if (parser.getToken() === Token.Colon) {
    name = parseJSXNamespacedName(parser, context, name, start, line, column);
  }

  // HTML empty attribute
  if (parser.getToken() === Token.Assign) {
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
  nextToken(parser, context | Context.AllowRegExp);
  const { tokenPos, linePos, colPos } = parser;
  if (parser.getToken() === Token.Ellipsis) return parseJSXSpreadChild(parser, context, start, line, column);

  let expression: ESTree.Expression | ESTree.JSXEmptyExpression | null = null;

  if (parser.getToken() === Token.RightBrace) {
    // JSX attributes must only be assigned a non-empty 'expression'
    if (isAttr) report(parser, Errors.InvalidNonEmptyJSXExpr);
    expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
  } else {
    expression = parseExpression(parser, context, 1, 0, tokenPos, linePos, colPos);
  }
  if (inJSXChild) {
    consume(parser, context, Token.RightBrace);
  } else {
    scanJSXToken(parser, context);
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
  const expression = parseExpression(parser, context, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
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
  // Since " }" is treated as single token, we have to artificially break
  // it into " " and "}".
  // Move token start from beginning of whitespace(s) to beginning of "}",
  // so JSXEmptyExpression can have correct end loc.
  parser.startPos = parser.tokenPos;
  parser.startLine = parser.linePos;
  parser.startColumn = parser.colPos;
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
