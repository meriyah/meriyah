import { Chars } from './chars';
import {
  AssignmentKind,
  BindingKind,
  classifyIdentifier,
  consume,
  consumeOpt,
  Context,
  DestructuringKind,
  Flags,
  HoistedClassFlags,
  HoistedFunctionFlags,
  isEqualTagName,
  isPropertyWithPrivateFieldKey,
  isStrictReservedWord,
  isValidIdentifier,
  isValidLabel,
  isValidStrictMode,
  type Location,
  matchOrInsertSemicolon,
  optionalBit,
  Origin,
  PropertyKind,
  reinterpretToPattern,
  validateAndDeclareLabel,
  validateBindingIdentifier,
  validateFunctionName,
} from './common';
import { Errors, ParseError } from './errors';
import type * as ESTree from './estree';
import { nextToken, skipHashBang } from './lexer';
import { nextJSXToken, rescanJSXIdentifier, scanJSXAttributeValue } from './lexer/jsx';
import { scanTemplateTail } from './lexer/template';
import { normalizeOptions, type Options } from './options';
import { Parser } from './parser/parser';
import { type PrivateScope } from './parser/private-scope';
import { createArrowHeadParsingScope, type Scope, ScopeKind } from './parser/scope';
import { KeywordDescTable, Token } from './token';

/**
 * Consumes a sequence of tokens and produces an syntax tree
 */
export function parseSource(source: string, rawOptions: Options = {}, context: Context = Context.None): ESTree.Program {
  const options = normalizeOptions(rawOptions);

  if (options.sourceType === 'module') context |= Context.Module | Context.Strict;
  // Turn on return context in global
  if (options.sourceType === 'commonjs') context |= Context.InReturnContext;
  if (options.impliedStrict) context |= Context.Strict;

  // Initialize parser state
  const parser = new Parser(source, options);

  // See: https://github.com/tc39/proposal-hashbang
  skipHashBang(parser);

  const scope = parser.createScopeIfLexical();

  let body: (ESTree.Statement | ReturnType<typeof parseDirective | typeof parseModuleItem>)[] = [];

  // https://tc39.es/ecma262/#sec-scripts
  // https://tc39.es/ecma262/#sec-modules

  let sourceType: 'module' | 'script' = 'script';

  if (context & Context.Module) {
    sourceType = 'module';
    body = parseModuleItemList(parser, context | Context.InGlobal, scope);

    if (scope) {
      for (const name of parser.exportedBindings) {
        if (!scope.hasVariable(name)) parser.report(Errors.UndeclaredExportedBinding, name);
      }
    }
  } else {
    body = parseStatementList(parser, context | Context.InGlobal, scope);
  }

  return parser.finishNode<ESTree.Program>(
    {
      type: 'Program',
      sourceType,
      body,
    },
    { index: 0, line: 1, column: 0 },
    parser.currentLocation,
  );
}

/**
 * Parses statement list items
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseStatementList(parser: Parser, context: Context, scope: Scope | undefined): ESTree.Statement[] {
  // StatementList ::
  //   (StatementListItem)* <end_token>

  nextToken(parser, context | Context.AllowRegExp | Context.AllowEscapedKeyword);

  const statements: ESTree.Statement[] = [];

  while (parser.getToken() === Token.StringLiteral) {
    // "use strict" must be the exact literal without escape sequences or line continuation.
    const { index, tokenValue, tokenStart, tokenIndex } = parser;
    const token = parser.getToken();
    const expr = parseLiteral(parser, context);
    if (isValidStrictMode(parser, index, tokenIndex, tokenValue)) {
      context |= Context.Strict;

      if (parser.flags & Flags.Octal) {
        throw new ParseError(parser.tokenStart, parser.currentLocation, Errors.StrictOctalLiteral);
      }

      if (parser.flags & Flags.EightAndNine) {
        throw new ParseError(parser.tokenStart, parser.currentLocation, Errors.StrictEightAndNine);
      }
    }
    statements.push(parseDirective(parser, context, expr, token, tokenStart));
  }

  while (parser.getToken() !== Token.EOF) {
    statements.push(parseStatementListItem(parser, context, scope, undefined, Origin.TopLevel, {}) as ESTree.Statement);
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
function parseModuleItemList(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
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

  while (parser.getToken() === Token.StringLiteral) {
    const { tokenStart } = parser;
    const token = parser.getToken();
    statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenStart));
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

export function parseModuleItem(parser: Parser, context: Context, scope: Scope | undefined): any {
  if (parser.getToken() === Token.Decorator) {
    Object.assign(parser.leadingDecorators, {
      start: parser.tokenStart,
      decorators: parseDecorators(parser, context, undefined),
    });
  }

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
      moduleItem = parseStatementListItem(parser, context, scope, undefined, Origin.TopLevel, {});
  }

  if (parser.leadingDecorators?.decorators.length) {
    parser.report(Errors.InvalidLeadingDecorator);
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

function parseStatementListItem(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  labels: ESTree.Labels,
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
  const start = parser.tokenStart;

  switch (parser.getToken()) {
    //   HoistableDeclaration[?Yield, ~Default]
    case Token.FunctionKeyword:
      return parseFunctionDeclaration(
        parser,
        context,
        scope,
        privateScope,
        origin,
        1,
        HoistedFunctionFlags.None,
        0,
        start,
      );

    case Token.Decorator: // @decorator
    case Token.ClassKeyword: // ClassDeclaration[?Yield, ~Default]
      return parseClassDeclaration(parser, context, scope, privateScope, HoistedClassFlags.None);
    // LexicalDeclaration[In, ?Yield]
    // LetOrConst BindingList[?In, ?Yield]
    case Token.ConstKeyword:
      return parseLexicalDeclaration(parser, context, scope, privateScope, BindingKind.Const, Origin.None);
    case Token.LetKeyword:
      return parseLetIdentOrVarDeclarationStatement(parser, context, scope, privateScope, origin);
    // ExportDeclaration
    case Token.ExportKeyword:
      parser.report(Errors.InvalidImportExportSloppy, 'export');
    // ImportDeclaration
    case Token.ImportKeyword:
      nextToken(parser, context);
      switch (parser.getToken()) {
        case Token.LeftParen:
          return parseImportCallDeclaration(parser, context, privateScope, start);
        case Token.Period:
          return parseImportMetaDeclaration(parser, context, start);
        default:
          parser.report(Errors.InvalidImportExportSloppy, 'import');
      }
    //   async [no LineTerminator here] AsyncArrowBindingIdentifier ...
    //   async [no LineTerminator here] ArrowFormalParameters ...
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, privateScope, origin, labels, 1);
    default:
      return parseStatement(parser, context, scope, privateScope, origin, labels, 1);
  }
}

/**
 * Parse statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowFuncDecl Allow / disallow func statement
 */

function parseStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
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
      return parseVariableStatement(parser, context, scope, privateScope, Origin.None);
    // [+Return] ReturnStatement[?Yield]
    case Token.ReturnKeyword:
      return parseReturnStatement(parser, context, privateScope);
    case Token.IfKeyword:
      return parseIfStatement(parser, context, scope, privateScope, labels);
    case Token.ForKeyword:
      return parseForStatement(parser, context, scope, privateScope, labels);
    // BreakableStatement[Yield, Return]:
    //   IterationStatement[?Yield, ?Return]
    //   SwitchStatement[?Yield, ?Return]
    case Token.DoKeyword:
      return parseDoWhileStatement(parser, context, scope, privateScope, labels);
    case Token.WhileKeyword:
      return parseWhileStatement(parser, context, scope, privateScope, labels);
    case Token.SwitchKeyword:
      return parseSwitchStatement(parser, context, scope, privateScope, labels);
    case Token.Semicolon:
      // EmptyStatement
      return parseEmptyStatement(parser, context);
    // BlockStatement[?Yield, ?Return]
    case Token.LeftBrace:
      return parseBlock(
        parser,
        context,
        scope?.createChildScope(),
        privateScope,
        labels,
        parser.tokenStart,
      ) as ESTree.Statement;

    // ThrowStatement[?Yield]
    case Token.ThrowKeyword:
      return parseThrowStatement(parser, context, privateScope);
    case Token.BreakKeyword:
      // BreakStatement[?Yield]
      return parseBreakStatement(parser, context, labels);
    // ContinueStatement[?Yield]
    case Token.ContinueKeyword:
      return parseContinueStatement(parser, context, labels);
    // TryStatement[?Yield, ?Return]
    case Token.TryKeyword:
      return parseTryStatement(parser, context, scope, privateScope, labels);
    // WithStatement[?Yield, ?Return]
    case Token.WithKeyword:
      return parseWithStatement(parser, context, scope, privateScope, labels);
    case Token.DebuggerKeyword:
      // DebuggerStatement
      return parseDebuggerStatement(parser, context);
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, privateScope, origin, labels, 0);
    // Miscellaneous error cases arguably better caught here than elsewhere
    case Token.CatchKeyword:
      parser.report(Errors.CatchWithoutTry);
    case Token.FinallyKeyword:
      parser.report(Errors.FinallyWithoutTry);
    case Token.FunctionKeyword:
      // FunctionDeclaration & ClassDeclaration is forbidden by lookahead
      // restriction in an arbitrary statement position.
      parser.report(
        context & Context.Strict
          ? Errors.StrictFunction
          : !parser.options.webcompat
            ? Errors.WebCompatFunction
            : Errors.SloppyFunction,
      );
    case Token.ClassKeyword:
      parser.report(Errors.ClassForbiddenAsStatement);

    default:
      return parseExpressionOrLabelledStatement(parser, context, scope, privateScope, origin, labels, allowFuncDecl);
  }
}

/**
 * Parses either expression or labeled statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowFuncDecl Allow / disallow func statement
 */

function parseExpressionOrLabelledStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
): ESTree.ExpressionStatement | ESTree.LabeledStatement {
  // ExpressionStatement | LabelledStatement ::
  //   Expression ';'
  //   Identifier ':' Statement
  //
  // ExpressionStatement[Yield] :
  //   [lookahead not in {{, function, class, let [}] Expression[In, ?Yield] ;

  const { tokenValue, tokenStart } = parser;
  const token = parser.getToken();

  let expr: ESTree.Expression;

  switch (token) {
    case Token.LetKeyword:
      expr = parseIdentifier(parser, context);
      if (context & Context.Strict) parser.report(Errors.UnexpectedLetStrictReserved);

      // "let" followed by either "[", "{" or an identifier means a lexical
      // declaration, which should not appear here.
      // However, ASI may insert a line break before an identifier or a brace.
      if (parser.getToken() === Token.LeftBracket) parser.report(Errors.RestrictedLetProduction);

      break;

    default:
      expr = parsePrimaryExpression(parser, context, privateScope, BindingKind.Empty, 0, 1, 0, 1, parser.tokenStart);
  }

  /** LabelledStatement[Yield, Await, Return]:
   *
   * ExpressionStatement | LabelledStatement ::
   * Expression ';'
   *   Identifier ':' Statement
   *
   * ExpressionStatement[Yield] :
   *   [lookahead not in {{, function, class, let [}] Expression[In, ?Yield] ;
   */
  if (token & Token.IsIdentifier && parser.getToken() === Token.Colon) {
    return parseLabelledStatement(
      parser,
      context,
      scope,
      privateScope,
      origin,
      labels,
      tokenValue,
      expr,
      token,
      allowFuncDecl,
      tokenStart,
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

  expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, tokenStart);

  /** AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */

  expr = parseAssignmentExpression(parser, context, privateScope, 0, 0, tokenStart, expr as ESTree.ArgumentExpression);

  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, privateScope, 0, tokenStart, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */

  return parseExpressionStatement(parser, context, expr, tokenStart);
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
 * @param type BlockStatement or StaticBlock
 */
function parseBlock<T extends ESTree.BlockStatement | ESTree.StaticBlock = ESTree.BlockStatement>(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
  start: Location = parser.tokenStart,
  type: T['type'] = 'BlockStatement',
): T {
  // Block ::
  //   '{' StatementList '}'

  const body: ESTree.Statement[] = [];

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);
  while (parser.getToken() !== Token.RightBrace) {
    body.push(
      parseStatementListItem(parser, context, scope, privateScope, Origin.BlockStatement, { $: labels }) as any,
    );
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);

  return parser.finishNode(
    {
      type,
      body,
    } as T,
    start,
  );
}

/**
 * Parses return statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ReturnStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseReturnStatement(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.ReturnStatement {
  // ReturnStatement ::
  //   'return' [no line terminator] Expression? ';'

  if ((context & Context.InReturnContext) === 0) parser.report(Errors.IllegalReturn);

  const start = parser.tokenStart;
  nextToken(parser, context | Context.AllowRegExp);

  const argument =
    parser.flags & Flags.NewLine || parser.getToken() & Token.IsAutoSemicolon
      ? null
      : parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return parser.finishNode<ESTree.ReturnStatement>(
    {
      type: 'ReturnStatement',
      argument,
    },
    start,
  );
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
 */
function parseExpressionStatement(
  parser: Parser,
  context: Context,
  expression: ESTree.Expression,
  start: Location,
): ESTree.ExpressionStatement {
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.ExpressionStatement>(
    {
      type: 'ExpressionStatement',
      expression,
    },
    start,
  );
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
 */
function parseLabelledStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  value: string,
  expr: ESTree.Identifier | ESTree.Expression,
  token: Token,
  allowFuncDecl: 0 | 1,
  start: Location,
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
    parser.options.webcompat &&
    // In sloppy mode, Annex B.3.2 allows labelled function declarations.
    // Otherwise it's a parse error.
    parser.getToken() === Token.FunctionKeyword
      ? parseFunctionDeclaration(
          parser,
          context,
          scope?.createChildScope(),
          privateScope,
          origin,
          0,
          HoistedFunctionFlags.None,
          0,
          parser.tokenStart,
        )
      : parseStatement(parser, context, scope, privateScope, origin, labels, allowFuncDecl);

  return parser.finishNode<ESTree.LabeledStatement>(
    {
      type: 'LabeledStatement',
      label: expr as ESTree.Identifier,
      body,
    },
    start,
  );
}

/**
 * Parses either async ident, async function or async arrow in
 * statement position
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param labels
 * @param allowFuncDecl Allow / disallow func statement
 */

function parseAsyncArrowOrAsyncFunctionDeclaration(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  labels: ESTree.Labels,
  allowFuncDecl: 0 | 1,
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

  const { tokenValue, tokenStart: start } = parser;
  const token = parser.getToken();

  let expr: ESTree.Expression = parseIdentifier(parser, context);

  if (parser.getToken() === Token.Colon) {
    return parseLabelledStatement(
      parser,
      context,
      scope,
      privateScope,
      origin,
      labels,
      tokenValue,
      expr,
      token,
      1,
      start,
    );
  }

  const asyncNewLine = parser.flags & Flags.NewLine;

  if (!asyncNewLine) {
    // async function ...
    if (parser.getToken() === Token.FunctionKeyword) {
      if (!allowFuncDecl) parser.report(Errors.AsyncFunctionInSingleStatementContext);

      return parseFunctionDeclaration(
        parser,
        context,
        scope,
        privateScope,
        origin,
        1,
        HoistedFunctionFlags.None,
        1,
        start,
      );
    }

    // async Identifier => ...
    if (isValidIdentifier(context, parser.getToken())) {
      /** ArrowFunction[In, Yield, Await]:
       *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
       */
      expr = parseAsyncArrowAfterIdent(parser, context, privateScope, /* assignable */ 1, start);
      if (parser.getToken() === Token.Comma)
        expr = parseSequenceExpression(parser, context, privateScope, 0, start, expr);

      /**
       * ExpressionStatement[Yield, Await]:
       *   [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
       */
      return parseExpressionStatement(parser, context, expr, start);
    }
  }

  /** ArrowFunction[In, Yield, Await]:
   *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
   */
  if (parser.getToken() === Token.LeftParen) {
    expr = parseAsyncArrowOrCallExpression(
      parser,
      context,
      privateScope,
      expr,
      1,
      BindingKind.ArgumentList,
      Origin.None,
      asyncNewLine,
      start,
    );
  } else {
    if (parser.getToken() === Token.Arrow) {
      classifyIdentifier(parser, context, token);
      if ((token & Token.FutureReserved) === Token.FutureReserved) {
        parser.flags |= Flags.HasStrictReserved;
      }
      expr = parseArrowFromIdentifier(
        parser,
        context | Context.InAwaitContext,
        privateScope,
        parser.tokenValue,
        expr,
        0,
        1,
        0,
        start,
      );
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

  expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, start);

  /** AssignmentExpression :
   *
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */
  expr = parseAssignmentExpression(parser, context, privateScope, 0, 0, start, expr as ESTree.ArgumentExpression);

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
    expr = parseSequenceExpression(parser, context, privateScope, 0, start, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *   [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start);
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
 */

export function parseDirective(
  parser: Parser,
  context: Context,
  expression: ESTree.ArgumentExpression | ESTree.SequenceExpression | ESTree.Expression,
  token: Token,
  start: Location,
): ESTree.ExpressionStatement {
  const endIndex = parser.startIndex;

  if (token !== Token.Semicolon) {
    parser.assignable = AssignmentKind.CannotAssign;

    expression = parseMemberOrUpdateExpression(parser, context, undefined, expression, 0, 0, start);

    if (parser.getToken() !== Token.Semicolon) {
      expression = parseAssignmentExpression(parser, context, undefined, 0, 0, start, expression);

      if (parser.getToken() === Token.Comma) {
        expression = parseSequenceExpression(parser, context, undefined, 0, start, expression);
      }
    }

    matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  }

  const node: ESTree.ExpressionStatement = {
    type: 'ExpressionStatement',
    expression,
  };

  if (expression.type === 'Literal' && typeof expression.value === 'string') {
    node.directive = parser.source.slice(start.index + 1, endIndex - 1);
  }

  return parser.finishNode(node, start);
}

/**
 * Parses empty statement
 *
 * @param parser  Parser object
 * @param context Context masks
 */

function parseEmptyStatement(parser: Parser, context: Context): ESTree.EmptyStatement {
  const start = parser.tokenStart;
  nextToken(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.EmptyStatement>(
    {
      type: 'EmptyStatement',
    },
    start,
  );
}

/**
 * Parses throw statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-ThrowStatement)
 *
 * @param parser  Parser object
 * @param context Context masks

 */
function parseThrowStatement(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.ThrowStatement {
  const start = parser.tokenStart;

  // ThrowStatement ::
  //   'throw' Expression ';'
  nextToken(parser, context | Context.AllowRegExp);
  if (parser.flags & Flags.NewLine) parser.report(Errors.NewlineAfterThrow);
  const argument: ESTree.Expression = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.ThrowStatement>(
    {
      type: 'ThrowStatement',
      argument,
    },
    start,
  );
}

/**
 * Parses an if statement with an optional else block
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-if-statement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseIfStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.IfStatement {
  const start = parser.tokenStart;

  // IfStatement ::
  //   'if' '(' Expression ')' Statement ('else' Statement)?
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  parser.assignable = AssignmentKind.Assignable;
  const test = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const consequent = parseConsequentOrAlternative(parser, context, scope, privateScope, labels);
  let alternate: ESTree.Statement | null = null;
  if (parser.getToken() === Token.ElseKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    alternate = parseConsequentOrAlternative(parser, context, scope, privateScope, labels);
  }

  return parser.finishNode<ESTree.IfStatement>(
    {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    },
    start,
  );
}

/**
 * Parse either consequent or alternate.
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseConsequentOrAlternative(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.Statement | ESTree.FunctionDeclaration {
  const { tokenStart } = parser;

  return context & Context.Strict ||
    // Disallow if web compatibility is off
    !parser.options.webcompat ||
    parser.getToken() !== Token.FunctionKeyword
    ? parseStatement(parser, context, scope, privateScope, Origin.None, { $: labels }, 0)
    : parseFunctionDeclaration(
        parser,
        context,
        scope?.createChildScope(),
        privateScope,
        Origin.None,
        0,
        HoistedFunctionFlags.None,
        0,
        tokenStart,
      );
}

/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSwitchStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.SwitchStatement {
  // SwitchStatement ::
  //   'switch' '(' Expression ')' '{' CaseClause* '}'
  // CaseClause ::
  //   'case' Expression ':' StatementList
  //   'default' ':' StatementList

  const start = parser.tokenStart;

  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const discriminant = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  consume(parser, context, Token.RightParen);
  consume(parser, context, Token.LeftBrace);
  const cases: ESTree.SwitchCase[] = [];
  let seenDefault: 0 | 1 = 0;
  scope = scope?.createChildScope(ScopeKind.SwitchStatement);
  while (parser.getToken() !== Token.RightBrace) {
    const { tokenStart } = parser;
    let test: ESTree.Expression | null = null;
    const consequent: ESTree.Statement[] = [];
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.CaseKeyword)) {
      test = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
    } else {
      consume(parser, context | Context.AllowRegExp, Token.DefaultKeyword);
      if (seenDefault) parser.report(Errors.MultipleDefaultsInSwitch);
      seenDefault = 1;
    }
    consume(parser, context | Context.AllowRegExp, Token.Colon);
    while (
      parser.getToken() !== Token.CaseKeyword &&
      parser.getToken() !== Token.RightBrace &&
      parser.getToken() !== Token.DefaultKeyword
    ) {
      consequent.push(
        parseStatementListItem(parser, context | Context.InSwitch, scope, privateScope, Origin.BlockStatement, {
          $: labels,
        }) as ESTree.Statement,
      );
    }

    cases.push(
      parser.finishNode<ESTree.SwitchCase>(
        {
          type: 'SwitchCase',
          test,
          consequent,
        },
        tokenStart,
      ),
    );
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);
  return parser.finishNode<ESTree.SwitchStatement>(
    {
      type: 'SwitchStatement',
      discriminant,
      cases,
    },
    start,
  );
}

/**
 * Parses while statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-grammar-notation-WhileStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseWhileStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.WhileStatement {
  // WhileStatement ::
  //   'while' '(' Expression ')' Statement

  const start = parser.tokenStart;

  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseIterationStatementBody(parser, context, scope, privateScope, labels);
  return parser.finishNode<ESTree.WhileStatement>(
    {
      type: 'WhileStatement',
      test,
      body,
    },
    start,
  );
}

/**
 * Parses iteration statement body
 *
 * @see [Link](https://tc39.es/ecma262/#sec-iteration-statements)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseIterationStatementBody(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.Statement {
  return parseStatement(
    parser,
    ((context | Context.DisallowIn) ^ Context.DisallowIn) | Context.InIteration,
    scope,
    privateScope,
    Origin.None,
    { loop: 1, $: labels },
    0,
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
function parseContinueStatement(parser: Parser, context: Context, labels: ESTree.Labels): ESTree.ContinueStatement {
  // ContinueStatement ::
  //   'continue' Identifier? ';'

  if ((context & Context.InIteration) === 0) parser.report(Errors.IllegalContinue);

  const start = parser.tokenStart;

  nextToken(parser, context);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 1))
      parser.report(Errors.UnknownLabel, tokenValue);
  }
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.ContinueStatement>(
    {
      type: 'ContinueStatement',
      label,
    },
    start,
  );
}

/**
 * Parses the break statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BreakStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBreakStatement(parser: Parser, context: Context, labels: ESTree.Labels): ESTree.BreakStatement {
  // BreakStatement ::
  //   'break' Identifier? ';'

  const start = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() & Token.IsIdentifier) {
    const { tokenValue } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 0))
      parser.report(Errors.UnknownLabel, tokenValue);
  } else if ((context & (Context.InSwitch | Context.InIteration)) === 0) {
    parser.report(Errors.IllegalBreak);
  }

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.BreakStatement>(
    {
      type: 'BreakStatement',
      label,
    },
    start,
  );
}

/**
 * Parses with statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-WithStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseWithStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.WithStatement {
  // WithStatement ::
  //   'with' '(' Expression ')' Statement

  const start = parser.tokenStart;

  nextToken(parser, context);

  if (context & Context.Strict) parser.report(Errors.StrictWith);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const object = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseStatement(parser, context, scope, privateScope, Origin.BlockStatement, labels, 0);
  return parser.finishNode<ESTree.WithStatement>(
    {
      type: 'WithStatement',
      object,
      body,
    },
    start,
  );
}

/**
 * Parses the debugger statement production
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-DebuggerStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseDebuggerStatement(parser: Parser, context: Context): ESTree.DebuggerStatement {
  // DebuggerStatement ::
  //   'debugger' ';'
  const start = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp);
  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.DebuggerStatement>(
    {
      type: 'DebuggerStatement',
    },
    start,
  );
}

/**
 * Parses try statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-TryStatement)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseTryStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.TryStatement {
  // TryStatement ::
  //   'try' Block Catch
  //   'try' Block Finally
  //   'try' Block Catch Finally
  //
  // Catch ::
  //   'catch' '(' CatchParameter ')' Block
  //   'catch' Block
  //
  // Finally ::
  //   'finally' Block
  //
  // CatchParameter ::
  //   BindingIdentifier
  //   BindingPattern

  const start = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp);

  const firstScope = scope?.createChildScope(ScopeKind.TryStatement);

  const block = parseBlock(parser, context, firstScope, privateScope, { $: labels });
  const { tokenStart } = parser;
  const handler = consumeOpt(parser, context | Context.AllowRegExp, Token.CatchKeyword)
    ? parseCatchBlock(parser, context, scope, privateScope, labels, tokenStart)
    : null;

  let finalizer: ESTree.BlockStatement | null = null;

  if (parser.getToken() === Token.FinallyKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    const finalizerScope = scope?.createChildScope(ScopeKind.CatchStatement);
    const block = parseBlock(parser, context, finalizerScope, privateScope, { $: labels });
    finalizer = block;
  }

  if (!handler && !finalizer) {
    parser.report(Errors.NoCatchOrFinally);
  }

  return parser.finishNode<ESTree.TryStatement>(
    {
      type: 'TryStatement',
      block,
      handler,
      finalizer,
    },
    start,
  );
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
 */
function parseCatchBlock(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
  start: Location,
): ESTree.CatchClause {
  let param: ESTree.BindingPattern | ESTree.Identifier | null = null;
  let additionalScope: Scope | undefined = scope;

  if (consumeOpt(parser, context, Token.LeftParen)) {
    /*
     * Create a lexical scope around the whole catch clause,
     * including the head.
     */
    scope = scope?.createChildScope(ScopeKind.CatchStatement);

    param = parseBindingPattern(
      parser,
      context,
      scope,
      privateScope,
      (parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart
        ? BindingKind.CatchPattern
        : BindingKind.CatchIdentifier,
      Origin.None,
    );

    if (parser.getToken() === Token.Comma) {
      parser.report(Errors.InvalidCatchParams);
    } else if (parser.getToken() === Token.Assign) {
      parser.report(Errors.InvalidCatchParamDefault);
    }

    consume(parser, context | Context.AllowRegExp, Token.RightParen);
  }

  additionalScope = scope?.createChildScope(ScopeKind.CatchBlock);

  const body = parseBlock(parser, context, additionalScope, privateScope, { $: labels });

  return parser.finishNode<ESTree.CatchClause>(
    {
      type: 'CatchClause',
      param,
      body,
    },
    start,
  );
}

/**
 * Parses class static initialization block
 *
 * @see [Link](https://github.com/tc39/proposal-class-static-block)
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseStaticBlock(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  start: Location,
): ESTree.StaticBlock {
  // ClassStaticBlock :
  //   static { ClassStaticBlockBody }
  //
  // ClassStaticBlockBody :
  //   ClassStaticBlockStatementList
  //
  // ClassStaticBlockStatementList :
  //   StatementList[~Yield, +Await, ~Return]opt

  scope = scope?.createChildScope();

  const ctorContext =
    Context.SuperCall | Context.InReturnContext | Context.InYieldContext | Context.InSwitch | Context.InIteration;

  context =
    ((context | ctorContext) ^ ctorContext) |
    Context.SuperProperty |
    Context.InAwaitContext |
    Context.InStaticBlock |
    Context.AllowNewTarget;

  return parseBlock(parser, context, scope, privateScope, {}, start, 'StaticBlock');
}

/**
 * Parses do while statement
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
function parseDoWhileStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.DoWhileStatement {
  // DoStatement ::
  //   'do Statement while ( Expression ) ;'

  const start = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp);
  const body = parseIterationStatementBody(parser, context, scope, privateScope, labels);
  consume(parser, context, Token.WhileKeyword);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  // ECMA-262, section 11.9
  // The previous token is ) and the inserted semicolon would then be parsed as the terminating semicolon of a do-while statement (13.7.2).
  // This cannot be implemented in matchOrInsertSemicolon() because it doesn't know
  // this RightParen is the end of a do-while statement.
  consumeOpt(parser, context | Context.AllowRegExp, Token.Semicolon);
  return parser.finishNode<ESTree.DoWhileStatement>(
    {
      type: 'DoWhileStatement',
      body,
      test,
    },
    start,
  );
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
 */
function parseLetIdentOrVarDeclarationStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
): ESTree.VariableDeclaration | ESTree.LabeledStatement | ESTree.ExpressionStatement {
  const { tokenValue, tokenStart } = parser;
  const token = parser.getToken();
  let expr: ESTree.Identifier | ESTree.Expression = parseIdentifier(parser, context);

  if (parser.getToken() & (Token.IsIdentifier | Token.IsPatternStart)) {
    /* VariableDeclarations ::
     *  ('let') (Identifier ('=' AssignmentExpression)?)+[',']
     */

    const declarations = parseVariableDeclarationList(
      parser,
      context,
      scope,
      privateScope,
      BindingKind.Let,
      Origin.None,
    );

    matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

    return parser.finishNode<ESTree.VariableDeclaration>(
      {
        type: 'VariableDeclaration',
        kind: 'let',
        declarations,
      },
      tokenStart,
    );
  }
  // 'Let' as identifier
  parser.assignable = AssignmentKind.Assignable;

  if (context & Context.Strict) parser.report(Errors.UnexpectedLetStrictReserved);

  /** LabelledStatement[Yield, Await, Return]:
   *
   * ExpressionStatement | LabelledStatement ::
   * Expression ';'
   *   Identifier ':' Statement
   *
   * ExpressionStatement[Yield] :
   *   [lookahead not in {{, function, class, let [}] Expression[In, ?Yield] ;
   */

  if (parser.getToken() === Token.Colon) {
    return parseLabelledStatement(
      parser,
      context,
      scope,
      privateScope,
      origin,
      {},
      tokenValue,
      expr,
      token,
      0,
      tokenStart,
    );
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
    let scope: Scope | undefined = void 0;

    if (parser.options.lexical) scope = createArrowHeadParsingScope(parser, context, tokenValue);

    parser.flags = (parser.flags | Flags.NonSimpleParameterList) ^ Flags.NonSimpleParameterList;

    expr = parseArrowFunctionExpression(parser, context, scope, privateScope, [expr], /* isAsync */ 0, tokenStart);
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

    expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, tokenStart);

    /**
     * AssignmentExpression :
     *   1. ConditionalExpression
     *   2. LeftHandSideExpression = AssignmentExpression
     *
     */
    expr = parseAssignmentExpression(
      parser,
      context,
      privateScope,
      0,
      0,
      tokenStart,
      expr as ESTree.ArgumentExpression,
    );
  }

  /** Sequence expression
   */
  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, privateScope, 0, tokenStart, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, tokenStart);
}

/**
 * Parses a `const` or `let` lexical declaration statement
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param type Binding kind
 * @param origin Binding origin
 * @param type Binding kind
 */
function parseLexicalDeclaration(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  kind: BindingKind,
  origin: Origin,
): ESTree.VariableDeclaration {
  // BindingList ::
  //  LexicalBinding
  //    BindingIdentifier
  //    BindingPattern

  const start = parser.tokenStart;

  nextToken(parser, context);

  const declarations = parseVariableDeclarationList(parser, context, scope, privateScope, kind, origin);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return parser.finishNode<ESTree.VariableDeclaration>(
    {
      type: 'VariableDeclaration',
      kind: kind & BindingKind.Let ? 'let' : 'const',
      declarations,
    },
    start,
  );
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
 */
function parseVariableStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
): ESTree.VariableDeclaration {
  // VariableDeclarations ::
  //  ('var') (Identifier ('=' AssignmentExpression)?)+[',']
  //

  const start = parser.tokenStart;

  nextToken(parser, context);
  const declarations = parseVariableDeclarationList(parser, context, scope, privateScope, BindingKind.Variable, origin);

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
  return parser.finishNode<ESTree.VariableDeclaration>(
    {
      type: 'VariableDeclaration',
      kind: 'var',
      declarations,
    },
    start,
  );
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
function parseVariableDeclarationList(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  kind: BindingKind,
  origin: Origin,
): ESTree.VariableDeclarator[] {
  let bindingCount = 1;
  const list: ESTree.VariableDeclarator[] = [
    parseVariableDeclaration(parser, context, scope, privateScope, kind, origin),
  ];
  while (consumeOpt(parser, context, Token.Comma)) {
    bindingCount++;
    list.push(parseVariableDeclaration(parser, context, scope, privateScope, kind, origin));
  }

  if (bindingCount > 1 && origin & Origin.ForStatement && parser.getToken() & Token.IsInOrOf) {
    parser.report(Errors.ForInOfLoopMultiBindings, KeywordDescTable[parser.getToken() & Token.Type]);
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
 */
function parseVariableDeclaration(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  kind: BindingKind,
  origin: Origin,
): ESTree.VariableDeclarator {
  // VariableDeclaration :
  //   BindingIdentifier Initializer opt
  //   BindingPattern Initializer
  //
  // VariableDeclarationNoIn :
  //   BindingIdentifier InitializerNoIn opt
  //   BindingPattern InitializerNoIn

  const { tokenStart } = parser;
  const token = parser.getToken();

  let init: ESTree.Expression | ESTree.BindingPattern | ESTree.Identifier | null = null;

  const id = parseBindingPattern(parser, context, scope, privateScope, kind, origin);

  if (parser.getToken() === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);
    init = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
    if (origin & Origin.ForStatement || (token & Token.IsPatternStart) === 0) {
      // Lexical declarations in for-in / for-of loops can't be initialized

      if (
        parser.getToken() === Token.OfKeyword ||
        (parser.getToken() === Token.InKeyword &&
          (token & Token.IsPatternStart || (kind & BindingKind.Variable) === 0 || context & Context.Strict))
      ) {
        throw new ParseError(
          tokenStart,
          parser.currentLocation,
          Errors.ForInOfLoopInitializer,
          parser.getToken() === Token.OfKeyword ? 'of' : 'in',
        );
      }
    }
    // Normal const declarations, and const declarations in for(;;) heads, must be initialized.
  } else if (
    (kind & BindingKind.Const || (token & Token.IsPatternStart) > 0) &&
    (parser.getToken() & Token.IsInOrOf) !== Token.IsInOrOf
  ) {
    parser.report(Errors.DeclarationMissingInitializer, kind & BindingKind.Const ? 'const' : 'destructuring');
  }

  return parser.finishNode<ESTree.VariableDeclarator>(
    {
      type: 'VariableDeclarator',
      id,
      init,
    },
    tokenStart,
  );
}

/**
 * Parses either For, ForIn or ForOf statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-statement)
 * @see [Link](https://tc39.github.io/ecma262/#sec-for-in-and-for-of-statements)
 *
 * @param parser Parser object
 * @param context Context masks

 */
function parseForStatement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  labels: ESTree.Labels,
): ESTree.ForStatement | ESTree.ForInStatement | ESTree.ForOfStatement {
  const start = parser.tokenStart;

  nextToken(parser, context);

  const forAwait =
    ((context & Context.InAwaitContext) > 0 || ((context & Context.Module) > 0 && (context & Context.InGlobal) > 0)) &&
    consumeOpt(parser, context, Token.AwaitKeyword);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  scope = scope?.createChildScope(ScopeKind.ForStatement);

  let test: ESTree.Expression | null = null;
  let update: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = 0;
  let init = null;
  let isVarDecl =
    parser.getToken() === Token.VarKeyword ||
    parser.getToken() === Token.LetKeyword ||
    parser.getToken() === Token.ConstKeyword;
  let right;

  const { tokenStart } = parser;
  const token = parser.getToken();

  if (isVarDecl) {
    if (token === Token.LetKeyword) {
      init = parseIdentifier(parser, context);
      if (parser.getToken() & (Token.IsIdentifier | Token.IsPatternStart)) {
        if (parser.getToken() === Token.InKeyword) {
          if (context & Context.Strict) parser.report(Errors.DisallowedLetInStrict);
        } else {
          init = parser.finishNode<ESTree.VariableDeclaration>(
            {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: parseVariableDeclarationList(
                parser,
                context | Context.DisallowIn,
                scope,
                privateScope,
                BindingKind.Let,
                Origin.ForStatement,
              ),
            },
            tokenStart,
          );
        }

        parser.assignable = AssignmentKind.Assignable;
      } else if (context & Context.Strict) {
        parser.report(Errors.DisallowedLetInStrict);
      } else {
        isVarDecl = false;
        parser.assignable = AssignmentKind.Assignable;
        init = parseMemberOrUpdateExpression(parser, context, privateScope, init, 0, 0, tokenStart);

        // `for of` only allows LeftHandSideExpressions which do not start with `let`, and no other production matches
        if (parser.getToken() === Token.OfKeyword) parser.report(Errors.ForOfLet);
      }
    } else {
      nextToken(parser, context);

      init = parser.finishNode(
        token === Token.VarKeyword
          ? {
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: parseVariableDeclarationList(
                parser,
                context | Context.DisallowIn,
                scope,
                privateScope,
                BindingKind.Variable,
                Origin.ForStatement,
              ),
            }
          : {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: parseVariableDeclarationList(
                parser,
                context | Context.DisallowIn,
                scope,
                privateScope,
                BindingKind.Const,
                Origin.ForStatement,
              ),
            },
        tokenStart,
      );

      parser.assignable = AssignmentKind.Assignable;
    }
  } else if (token === Token.Semicolon) {
    if (forAwait) parser.report(Errors.InvalidForAwait);
  } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
    const patternStart = parser.tokenStart;
    init =
      token === Token.LeftBrace
        ? parseObjectLiteralOrPattern(
            parser,
            context,
            void 0,
            privateScope,
            1,
            0,
            0,
            BindingKind.Empty,
            Origin.ForStatement,
          )
        : parseArrayExpressionOrPattern(
            parser,
            context,
            void 0,
            privateScope,
            1,
            0,
            0,
            BindingKind.Empty,
            Origin.ForStatement,
          );

    destructible = parser.destructible;

    if (destructible & DestructuringKind.SeenProto) {
      parser.report(Errors.DuplicateProto);
    }

    parser.assignable =
      destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

    init = parseMemberOrUpdateExpression(
      parser,
      context | Context.DisallowIn,
      privateScope,
      init as ESTree.Expression,
      0,
      0,
      patternStart,
    );
  } else {
    init = parseLeftHandSideExpression(parser, context | Context.DisallowIn, privateScope, 1, 0, 1);
  }

  if ((parser.getToken() & Token.IsInOrOf) === Token.IsInOrOf) {
    if (parser.getToken() === Token.OfKeyword) {
      if (parser.assignable & AssignmentKind.CannotAssign)
        parser.report(Errors.CantAssignToInOfForLoop, forAwait ? 'await' : 'of');

      reinterpretToPattern(parser, init);
      nextToken(parser, context | Context.AllowRegExp);

      // IterationStatement:
      //  for(LeftHandSideExpression of AssignmentExpression) Statement
      //  for await(LeftHandSideExpression of AssignmentExpression) Statement
      right = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);

      consume(parser, context | Context.AllowRegExp, Token.RightParen);

      const body = parseIterationStatementBody(parser, context, scope, privateScope, labels);

      return parser.finishNode<ESTree.ForOfStatement>(
        {
          type: 'ForOfStatement',
          left: init,
          right,
          body,
          await: forAwait,
        },
        start,
      );
    }

    if (parser.assignable & AssignmentKind.CannotAssign) parser.report(Errors.CantAssignToInOfForLoop, 'in');

    reinterpretToPattern(parser, init);
    nextToken(parser, context | Context.AllowRegExp);

    // `for await` only accepts the `for-of` type
    if (forAwait) parser.report(Errors.InvalidForAwait);

    // IterationStatement:
    //  for(LeftHandSideExpression in Expression) Statement
    right = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);

    consume(parser, context | Context.AllowRegExp, Token.RightParen);
    const body = parseIterationStatementBody(parser, context, scope, privateScope, labels);

    return parser.finishNode<ESTree.ForInStatement>(
      {
        type: 'ForInStatement',
        body,
        left: init,
        right,
      },
      start,
    );
  }

  if (forAwait) parser.report(Errors.InvalidForAwait);

  if (!isVarDecl) {
    if (destructible & DestructuringKind.HasToDestruct && parser.getToken() !== Token.Assign) {
      parser.report(Errors.CantAssignToInOfForLoop, 'loop');
    }

    init = parseAssignmentExpression(parser, context | Context.DisallowIn, privateScope, 0, 0, tokenStart, init);
  }

  if (parser.getToken() === Token.Comma)
    init = parseSequenceExpression(parser, context, privateScope, 0, tokenStart, init);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.getToken() !== Token.Semicolon)
    test = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.getToken() !== Token.RightParen)
    update = parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart);

  consume(parser, context | Context.AllowRegExp, Token.RightParen);

  const body = parseIterationStatementBody(parser, context, scope, privateScope, labels);

  return parser.finishNode<ESTree.ForStatement>(
    {
      type: 'ForStatement',
      init,
      test,
      update,
      body,
    },
    start,
  );
}

/**
 * Parses restricted identifier in import & export declaration
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object
 */
function parseRestrictedIdentifier(parser: Parser, context: Context, scope: Scope | undefined): ESTree.Identifier {
  if (!isValidIdentifier(context, parser.getToken())) parser.report(Errors.UnexpectedStrictReserved);
  if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
    parser.report(Errors.StrictEvalArguments);
  scope?.addBlockName(context, parser.tokenValue, BindingKind.Let, Origin.None);
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
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
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

  const start = parser.tokenStart;

  nextToken(parser, context);

  let source: ESTree.Literal | null = null;

  const { tokenStart } = parser;

  let specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[] = [];

  // 'import' ModuleSpecifier ';'
  if (parser.getToken() === Token.StringLiteral) {
    source = parseLiteral(parser, context);
  } else {
    if (parser.getToken() & Token.IsIdentifier) {
      const local = parseRestrictedIdentifier(parser, context, scope);
      specifiers = [
        parser.finishNode<ESTree.ImportDefaultSpecifier>(
          {
            type: 'ImportDefaultSpecifier',
            local,
          },
          tokenStart,
        ),
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
            parser.report(Errors.InvalidDefaultImport);
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
          return parseImportCallDeclaration(parser, context, undefined, start);
        case Token.Period:
          return parseImportMetaDeclaration(parser, context, start);
        default:
          parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
      }
    }

    source = parseModuleSpecifier(parser, context);
  }

  const attributes = parseImportAttributes(parser, context);

  const node: ESTree.ImportDeclaration = {
    type: 'ImportDeclaration',
    specifiers,
    source,
    attributes,
  };

  matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

  return parser.finishNode(node, start);
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
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
): ESTree.ImportNamespaceSpecifier {
  // NameSpaceImport:
  //  * as ImportedBinding

  const { tokenStart } = parser;

  nextToken(parser, context);
  consume(parser, context, Token.AsKeyword);

  // 'import * as class from "foo":'
  if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    throw new ParseError(
      tokenStart,
      parser.currentLocation,
      Errors.UnexpectedToken,
      KeywordDescTable[parser.getToken() & Token.Type],
    );
  }

  return parser.finishNode<ESTree.ImportNamespaceSpecifier>(
    {
      type: 'ImportNamespaceSpecifier',
      local: parseRestrictedIdentifier(parser, context, scope),
    },
    tokenStart,
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
function parseModuleSpecifier(parser: Parser, context: Context): ESTree.Literal {
  // ModuleSpecifier :
  //   StringLiteral
  consume(parser, context, Token.FromKeyword);
  if (parser.getToken() !== Token.StringLiteral) parser.report(Errors.InvalidExportImportSource, 'Import');

  return parseLiteral(parser, context);
}

function parseImportSpecifierOrNamedImports(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[],
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
  //   ModuleExportName 'as' BindingIdentifier
  //
  // ModuleExportName :
  //   IdentifierName
  //   StringLiteral

  nextToken(parser, context);

  while (parser.getToken() & Token.IsIdentifier || parser.getToken() === Token.StringLiteral) {
    let { tokenValue, tokenStart } = parser;
    const token = parser.getToken();
    const imported = parseModuleExportName(parser, context);
    let local: ESTree.Identifier;

    if (consumeOpt(parser, context, Token.AsKeyword)) {
      if (
        (parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber ||
        parser.getToken() === Token.Comma
      ) {
        parser.report(Errors.InvalidKeywordAsAlias);
      } else {
        validateBindingIdentifier(parser, context, BindingKind.Const, parser.getToken(), 0);
      }
      tokenValue = parser.tokenValue;
      local = parseIdentifier(parser, context);
    } else if (imported.type === 'Identifier') {
      // Keywords cannot be bound to themselves, so an import name
      // that is a keyword is a syntax error if it is not followed
      // by the keyword 'as'.
      // See the ImportSpecifier production in ES6 section 15.2.2.
      validateBindingIdentifier(parser, context, BindingKind.Const, token, 0);
      local = imported;
    } else {
      // Expect `import "str" as ...`
      parser.report(Errors.ExpectedToken, KeywordDescTable[Token.AsKeyword & Token.Type]);
    }

    scope?.addBlockName(context, tokenValue, BindingKind.Let, Origin.None);

    specifiers.push(
      parser.finishNode<ESTree.ImportSpecifier>(
        {
          type: 'ImportSpecifier',
          local,
          imported,
        },
        tokenStart,
      ),
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
 */
function parseImportMetaDeclaration(parser: Parser, context: Context, start: Location): ESTree.ExpressionStatement {
  let expr: ESTree.Expression = parseImportMetaExpression(
    parser,
    context,
    parser.finishNode<ESTree.Identifier>(
      {
        type: 'Identifier',
        name: 'import',
      },
      start,
    ),
    start,
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

  expr = parseMemberOrUpdateExpression(parser, context, undefined, expr, 0, 0, start);

  /** AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   */

  expr = parseAssignmentExpression(parser, context, undefined, 0, 0, start, expr as ESTree.Expression);

  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, undefined, 0, start, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start);
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
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  start: Location,
): ESTree.ExpressionStatement {
  let expr: ESTree.Expression = parseImportExpression(parser, context, privateScope, /* inGroup */ 0, start);

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

  expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, start);

  if (parser.getToken() === Token.Comma) {
    expr = parseSequenceExpression(parser, context, privateScope, 0, start, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr, start);
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
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
): ESTree.ExportAllDeclaration | ESTree.ExportNamedDeclaration | ESTree.ExportDefaultDeclaration {
  // ExportDeclaration:
  //    'export' '*' 'from' ModuleSpecifier ';'
  //    'export' '*' 'as' IdentifierName 'from' ModuleSpecifier ';'
  //    'export' ExportClause ('from' ModuleSpecifier)? ';'
  //    'export' VariableStatement
  //    'export' Declaration
  //    'export' 'default'
  const start = parser.leadingDecorators.decorators.length ? parser.leadingDecorators.start! : parser.tokenStart;

  // https://tc39.github.io/ecma262/#sec-exports
  nextToken(parser, context | Context.AllowRegExp);

  const specifiers: ESTree.ExportSpecifier[] = [];

  let declaration: ESTree.ExportDeclaration | ESTree.Expression | null = null;
  let source: ESTree.Literal | null = null;
  let attributes: ESTree.ImportAttribute[] = [];

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
          undefined,
          Origin.TopLevel,
          1,
          HoistedFunctionFlags.Hoisted,
          0,
          parser.tokenStart,
        );
        break;
      }
      // export default ClassDeclaration[Default]
      // export default  @decl ClassDeclaration[Default]
      case Token.Decorator:
      case Token.ClassKeyword:
        declaration = parseClassDeclaration(parser, context, scope, undefined, HoistedClassFlags.Hoisted);
        break;

      // export default HoistableDeclaration[Default]
      case Token.AsyncKeyword: {
        const { tokenStart } = parser;

        declaration = parseIdentifier(parser, context);

        const { flags } = parser;

        if ((flags & Flags.NewLine) === 0) {
          if (parser.getToken() === Token.FunctionKeyword) {
            declaration = parseFunctionDeclaration(
              parser,
              context,
              scope,
              undefined,
              Origin.TopLevel,
              1,
              HoistedFunctionFlags.Hoisted,
              1,
              tokenStart,
            );
          } else {
            if (parser.getToken() === Token.LeftParen) {
              declaration = parseAsyncArrowOrCallExpression(
                parser,
                context,
                undefined,
                declaration,
                1,
                BindingKind.ArgumentList,
                Origin.None,
                flags,
                tokenStart,
              );
              declaration = parseMemberOrUpdateExpression(
                parser,
                context,
                undefined,
                declaration as any,
                0,
                0,
                tokenStart,
              );
              declaration = parseAssignmentExpression(parser, context, undefined, 0, 0, tokenStart, declaration as any);
            } else if (parser.getToken() & Token.IsIdentifier) {
              if (scope) scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);

              declaration = parseIdentifier(parser, context);
              declaration = parseArrowFunctionExpression(
                parser,
                context,
                scope,
                undefined,
                [declaration],
                1,
                tokenStart,
              );
            }
          }
        }
        break;
      }

      default:
        // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
        declaration = parseExpression(parser, context, undefined, 1, 0, parser.tokenStart);
        matchOrInsertSemicolon(parser, context | Context.AllowRegExp);
    }

    // See: https://www.ecma-international.org/ecma-262/9.0/index.html#sec-exports-static-semantics-exportednames
    if (scope) parser.declareUnboundVariable('default');

    return parser.finishNode<ESTree.ExportDefaultDeclaration>(
      {
        type: 'ExportDefaultDeclaration',
        declaration,
      },
      start,
    );
  }

  switch (parser.getToken()) {
    case Token.Multiply: {
      //
      // 'export' '*' 'as' ModuleExportName 'from' ModuleSpecifier ';'
      //
      // See: https://github.com/tc39/ecma262/pull/1174
      nextToken(parser, context); // Skips: '*'

      let exported: ESTree.Identifier | ESTree.Literal | null = null;
      const isNamedDeclaration = consumeOpt(parser, context, Token.AsKeyword);

      if (isNamedDeclaration) {
        if (scope) parser.declareUnboundVariable(parser.tokenValue);
        exported = parseModuleExportName(parser, context);
      }

      consume(parser, context, Token.FromKeyword);

      if (parser.getToken() !== Token.StringLiteral) parser.report(Errors.InvalidExportImportSource, 'Export');

      source = parseLiteral(parser, context);

      const attributes = parseImportAttributes(parser, context);

      const node: ESTree.ExportAllDeclaration = {
        type: 'ExportAllDeclaration',
        source,
        exported,
        attributes,
      };

      matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

      return parser.finishNode(node, start);
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
      //   ModuleExportName
      //   ModuleExportName 'as' ModuleExportName
      //
      // ModuleExportName :
      //   IdentifierName
      //   StringLiteral

      nextToken(parser, context); // Skips: '{'

      const tmpExportedNames: string[] = [];
      const tmpExportedBindings: string[] = [];
      let hasLiteralLocal: 0 | 1 = 0;

      while (parser.getToken() & Token.IsIdentifier || parser.getToken() === Token.StringLiteral) {
        const { tokenStart, tokenValue } = parser;
        const local = parseModuleExportName(parser, context);
        if (local.type === 'Literal') {
          hasLiteralLocal = 1;
        }

        let exported: ESTree.Identifier | ESTree.Literal | null;

        if (parser.getToken() === Token.AsKeyword) {
          nextToken(parser, context);
          if ((parser.getToken() & Token.IsIdentifier) === 0 && parser.getToken() !== Token.StringLiteral) {
            parser.report(Errors.InvalidKeywordAsAlias);
          }
          if (scope) {
            tmpExportedNames.push(parser.tokenValue);
            tmpExportedBindings.push(tokenValue);
          }
          exported = parseModuleExportName(parser, context);
        } else {
          if (scope) {
            tmpExportedNames.push(parser.tokenValue);
            tmpExportedBindings.push(parser.tokenValue);
          }
          exported = local;
        }

        specifiers.push(
          parser.finishNode<ESTree.ExportSpecifier>(
            {
              type: 'ExportSpecifier',
              local,
              exported,
            },
            tokenStart,
          ),
        );

        if (parser.getToken() !== Token.RightBrace) consume(parser, context, Token.Comma);
      }

      consume(parser, context, Token.RightBrace);

      if (consumeOpt(parser, context, Token.FromKeyword)) {
        //  The left hand side can't be a keyword where there is no
        // 'from' keyword since it references a local binding.
        if (parser.getToken() !== Token.StringLiteral) parser.report(Errors.InvalidExportImportSource, 'Export');

        source = parseLiteral(parser, context);

        attributes = parseImportAttributes(parser, context);

        if (scope) {
          tmpExportedNames.forEach((n) => parser.declareUnboundVariable(n));
        }
      } else {
        if (hasLiteralLocal) {
          parser.report(Errors.InvalidExportReference);
        }

        if (scope) {
          tmpExportedNames.forEach((n) => parser.declareUnboundVariable(n));
          tmpExportedBindings.forEach((b) => parser.addBindingToExports(b));
        }
      }

      matchOrInsertSemicolon(parser, context | Context.AllowRegExp);

      break;
    }

    case Token.Decorator:
    case Token.ClassKeyword:
      declaration = parseClassDeclaration(parser, context, scope, undefined, HoistedClassFlags.Export);
      break;
    case Token.FunctionKeyword:
      declaration = parseFunctionDeclaration(
        parser,
        context,
        scope,
        undefined,
        Origin.TopLevel,
        1,
        HoistedFunctionFlags.Export,
        0,
        parser.tokenStart,
      );
      break;

    case Token.LetKeyword:
      declaration = parseLexicalDeclaration(parser, context, scope, undefined, BindingKind.Let, Origin.Export);
      break;
    case Token.ConstKeyword:
      declaration = parseLexicalDeclaration(parser, context, scope, undefined, BindingKind.Const, Origin.Export);
      break;
    case Token.VarKeyword:
      declaration = parseVariableStatement(parser, context, scope, undefined, Origin.Export);
      break;
    case Token.AsyncKeyword: {
      const { tokenStart } = parser;

      nextToken(parser, context);

      if ((parser.flags & Flags.NewLine) === 0 && parser.getToken() === Token.FunctionKeyword) {
        declaration = parseFunctionDeclaration(
          parser,
          context,
          scope,
          undefined,
          Origin.TopLevel,
          1,
          HoistedFunctionFlags.Export,
          1,
          tokenStart,
        );
        break;
      }
    }
    // falls through
    default:
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  const node: ESTree.ExportNamedDeclaration = {
    type: 'ExportNamedDeclaration',
    declaration,
    specifiers,
    source,
    attributes: attributes,
  };

  return parser.finishNode(node, start);
}

/**
 * Parses an expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param canAssign
 * @param inGroup,
 * @param start,
 */
function parseExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  start: Location,
): ESTree.Expression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression

  let expr = parsePrimaryExpression(parser, context, privateScope, BindingKind.Empty, 0, canAssign, inGroup, 1, start);

  expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, inGroup, 0, start);

  return parseAssignmentExpression(parser, context, privateScope, inGroup, 0, start, expr);
}

/**
 * Parse sequence expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 */
function parseSequenceExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  start: Location,
  expr: ESTree.AssignmentExpression | ESTree.Expression,
): ESTree.SequenceExpression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression
  const expressions: ESTree.Expression[] = [expr];
  while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
    expressions.push(parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart));
  }

  return parser.finishNode<ESTree.SequenceExpression>(
    {
      type: 'SequenceExpression',
      expressions,
    },
    start,
  );
}

/**
 * Parse expression or sequence expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param canAssign
 */
function parseExpressions(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  canAssign: 0 | 1,
  start: Location,
): ESTree.SequenceExpression | ESTree.Expression {
  const expr = parseExpression(parser, context, privateScope, canAssign, inGroup, start);
  return parser.getToken() === Token.Comma
    ? parseSequenceExpression(parser, context, privateScope, inGroup, start, expr)
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
 * @param left ESTree AST node
 */
function parseAssignmentExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: Location,
  left: ESTree.ArgumentExpression | ESTree.Expression | null,
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
    if (parser.assignable & AssignmentKind.CannotAssign) parser.report(Errors.CantAssignTo);
    if (
      (!isPattern && token === Token.Assign && ((left as ESTree.Expression).type as string) === 'ArrayExpression') ||
      ((left as ESTree.Expression).type as string) === 'ObjectExpression'
    ) {
      reinterpretToPattern(parser, left);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

    parser.assignable = AssignmentKind.CannotAssign;

    return parser.finishNode(
      isPattern
        ? {
            type: 'AssignmentPattern',
            left,
            right,
          }
        : ({
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[token & Token.Type],
            right,
          } as any),
      start,
    );
  }

  /** Binary expression
   *
   * https://tc39.github.io/ecma262/#sec-multiplicative-operators
   *
   */
  if ((token & Token.IsBinaryOp) === Token.IsBinaryOp) {
    // We start using the binary expression parser for Precedence >= 4 only!
    left = parseBinaryExpression(parser, context, privateScope, inGroup, start, 4, token, left as ESTree.Expression);
  }

  /**
   * Conditional expression
   * https://tc39.github.io/ecma262/#prod-ConditionalExpression
   *
   */
  if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
    left = parseConditionalExpression(parser, context, privateScope, left as ESTree.Expression, start);
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
 * @param left
 */
function parseAssignmentExpressionOrPattern(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: Location,
  left: any,
): any {
  const token = parser.getToken();

  nextToken(parser, context | Context.AllowRegExp);

  const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

  left = parser.finishNode(
    isPattern
      ? {
          type: 'AssignmentPattern',
          left,
          right,
        }
      : ({
          type: 'AssignmentExpression',
          left,
          operator: KeywordDescTable[token & Token.Type],
          right,
        } as any),
    start,
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
function parseConditionalExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  test: ESTree.Expression,
  start: Location,
): ESTree.ConditionalExpression {
  // ConditionalExpression ::
  //   LogicalOrExpression
  //   LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
  const consequent = parseExpression(
    parser,
    (context | Context.DisallowIn) ^ Context.DisallowIn,
    privateScope,
    1,
    0,
    parser.tokenStart,
  );
  consume(parser, context | Context.AllowRegExp, Token.Colon);
  parser.assignable = AssignmentKind.Assignable;
  // In parsing the first assignment expression in conditional
  // expressions we always accept the 'in' keyword; see ECMA-262,
  // section 11.12, page 58.
  const alternate = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
  parser.assignable = AssignmentKind.CannotAssign;
  return parser.finishNode<ESTree.ConditionalExpression>(
    {
      type: 'ConditionalExpression',
      test,
      consequent,
      alternate,
    },
    start,
  );
}

/**
 * Parses binary and unary expressions recursively
 * based on the precedence of the operators encountered.
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param minPrecedence The precedence of the last binary expression parsed
 * @param left ESTree AST node
 */
function parseBinaryExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  start: Location,
  minPrecedence: number,
  operator: Token,
  left: ESTree.ArgumentExpression | ESTree.Expression,
): ESTree.ArgumentExpression | ESTree.Expression {
  const bit = -((context & Context.DisallowIn) > 0) & Token.InKeyword;
  let t: Token;
  let precedence: number;

  parser.assignable = AssignmentKind.CannotAssign;

  while (parser.getToken() & Token.IsBinaryOp) {
    t = parser.getToken();
    precedence = t & Token.Precedence;

    if ((t & Token.IsLogical && operator & Token.IsCoalesce) || (operator & Token.IsLogical && t & Token.IsCoalesce)) {
      parser.report(Errors.InvalidCoalescing);
    }

    // 0 precedence will terminate binary expression parsing

    if (precedence + (((t === Token.Exponentiation) as any) << 8) - (((bit === t) as any) << 12) <= minPrecedence)
      break;
    nextToken(parser, context | Context.AllowRegExp);

    left = parser.finishNode(
      {
        type: t & Token.IsLogical || t & Token.IsCoalesce ? 'LogicalExpression' : 'BinaryExpression',
        left,
        right: parseBinaryExpression(
          parser,
          context,
          privateScope,
          inGroup,
          parser.tokenStart,
          precedence,
          t,
          parseLeftHandSideExpression(parser, context, privateScope, 0, inGroup, 1),
        ),
        operator: KeywordDescTable[t & Token.Type],
      },
      start,
    );
  }

  if (parser.getToken() === Token.Assign) parser.report(Errors.CantAssignTo);

  return left;
}

/**
 * Parses unary expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseUnaryExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  isLHS: 0 | 1,
  inGroup: 0 | 1,
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
  if (!isLHS) parser.report(Errors.Unexpected);
  const { tokenStart } = parser;
  const unaryOperator = parser.getToken();
  nextToken(parser, context | Context.AllowRegExp);
  const arg = parseLeftHandSideExpression(parser, context, privateScope, 0, inGroup, 1);
  if (parser.getToken() === Token.Exponentiation) parser.report(Errors.InvalidExponentiationLHS);
  if (context & Context.Strict && unaryOperator === Token.DeleteKeyword) {
    if (arg.type === 'Identifier') {
      parser.report(Errors.StrictDelete);
      // Prohibit delete of private class elements
    } else if (isPropertyWithPrivateFieldKey(arg)) {
      parser.report(Errors.DeletePrivateField);
    }
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.UnaryExpression>(
    {
      type: 'UnaryExpression',
      operator: KeywordDescTable[unaryOperator & Token.Type] as ESTree.UnaryOperator,
      argument: arg,
      prefix: true,
    },
    tokenStart,
  );
}

/**
 * Parse async expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseAsyncExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
  canAssign: 0 | 1,
  inNew: 0 | 1,
  start: Location,
): ESTree.FunctionExpression | ESTree.ArrowFunctionExpression | ESTree.CallExpression | ESTree.Identifier {
  const token = parser.getToken();
  const expr = parseIdentifier(parser, context);
  const { flags } = parser;

  if ((flags & Flags.NewLine) === 0) {
    // async function ...
    if (parser.getToken() === Token.FunctionKeyword) {
      return parseFunctionExpression(parser, context, privateScope, /* isAsync */ 1, inGroup, start);
    }

    // async Identifier => ...
    if (isValidIdentifier(context, parser.getToken())) {
      if (!isLHS) parser.report(Errors.Unexpected);
      if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
        parser.flags |= Flags.HasStrictReserved;
      }
      return parseAsyncArrowAfterIdent(parser, context, privateScope, canAssign, start);
    }
  }

  // async (...) => ...
  if (!inNew && parser.getToken() === Token.LeftParen) {
    return parseAsyncArrowOrCallExpression(
      parser,
      context,
      privateScope,
      expr,
      canAssign,
      BindingKind.ArgumentList,
      Origin.None,
      flags,
      start,
    );
  }

  if (parser.getToken() === Token.Arrow) {
    classifyIdentifier(parser, context, token);
    if (inNew) parser.report(Errors.InvalidAsyncArrow);
    if ((token & Token.FutureReserved) === Token.FutureReserved) {
      parser.flags |= Flags.HasStrictReserved;
    }
    return parseArrowFromIdentifier(parser, context, privateScope, parser.tokenValue, expr, inNew, canAssign, 0, start);
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
function parseYieldExpressionOrIdentifier(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  canAssign: 0 | 1,
  start: Location,
): ESTree.YieldExpression | ESTree.Identifier | ESTree.ArrowFunctionExpression {
  // YieldExpression[In] :
  //     yield
  //     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
  //     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]

  if (inGroup) parser.destructible |= DestructuringKind.Yield;
  if (context & Context.InYieldContext) {
    nextToken(parser, context | Context.AllowRegExp);
    if (context & Context.InArgumentList) parser.report(Errors.YieldInParameter);
    if (!canAssign) parser.report(Errors.CantAssignTo);
    if (parser.getToken() === Token.QuestionMark) parser.report(Errors.InvalidTernaryYield);

    let argument: ESTree.Expression | null = null;
    let delegate = false; // yield*

    if ((parser.flags & Flags.NewLine) === 0) {
      delegate = consumeOpt(parser, context | Context.AllowRegExp, Token.Multiply);
      if (parser.getToken() & (Token.Contextual | Token.IsExpressionStart) || delegate) {
        argument = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
      }
    } else if (parser.getToken() === Token.Multiply) {
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return parser.finishNode<ESTree.YieldExpression>(
      {
        type: 'YieldExpression',
        argument,
        delegate,
      },
      start,
    );
  }

  if (context & Context.Strict) parser.report(Errors.DisallowedInContext, 'yield');

  return parseIdentifierOrArrow(parser, context, privateScope);
}

/**
 * Parse await expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 */
function parseAwaitExpressionOrIdentifier(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inNew: 0 | 1,
  inGroup: 0 | 1,
  start: Location,
): ESTree.IdentifierOrExpression | ESTree.AwaitExpression {
  if (inGroup) parser.destructible |= DestructuringKind.Await;
  if (context & Context.InStaticBlock) parser.report(Errors.InvalidAwaitInStaticBlock);

  // Peek next Token first;
  const possibleIdentifierOrArrowFunc = parseIdentifierOrArrow(parser, context, privateScope);

  // If got an arrow function, or token after "await" is not an expression.
  const isIdentifier =
    possibleIdentifierOrArrowFunc.type === 'ArrowFunctionExpression' ||
    (parser.getToken() & Token.IsExpressionStart) === 0;

  if (isIdentifier) {
    if (context & Context.InAwaitContext)
      throw new ParseError(
        start,
        { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
        Errors.InvalidAwaitAsIdentifier,
      );
    if (context & Context.Module)
      throw new ParseError(
        start,
        { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
        Errors.AwaitIdentInModuleOrAsyncFunc,
      );

    if (context & Context.InArgumentList && context & Context.InAwaitContext)
      throw new ParseError(
        start,
        { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
        Errors.AwaitIdentInModuleOrAsyncFunc,
      );
    // "await" can be identifier out of async func.
    return possibleIdentifierOrArrowFunc;
  }

  // "await" is start of await expression.
  if (context & Context.InArgumentList) {
    throw new ParseError(
      start,
      { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
      Errors.AwaitInParameter,
    );
  }

  // await expression is only allowed in async func or at module top level.
  if (context & Context.InAwaitContext || (context & Context.Module && context & Context.InGlobal)) {
    if (inNew)
      throw new ParseError(
        start,
        { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
        Errors.Unexpected,
      );

    const argument = parseLeftHandSideExpression(parser, context, privateScope, 0, 0, 1);

    if (parser.getToken() === Token.Exponentiation) parser.report(Errors.InvalidExponentiationLHS);

    parser.assignable = AssignmentKind.CannotAssign;

    return parser.finishNode<ESTree.AwaitExpression>(
      {
        type: 'AwaitExpression',
        argument,
      },
      start,
    );
  }

  if (context & Context.Module)
    throw new ParseError(
      start,
      { index: parser.startIndex, line: parser.startLine, column: parser.startColumn },
      Errors.AwaitOutsideAsync,
    );
  // Fallback to identifier in script mode
  return possibleIdentifierOrArrowFunc;
}

/**
 * Parses function body
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param scope Scope object | null
 * @param origin Binding origin
 * @param funcNameToken
 * @param functionScope
 */
function parseFunctionBody(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  funcNameToken: Token | undefined,
  functionScope: Scope | undefined,
): ESTree.BlockStatement {
  const { tokenStart } = parser;

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);

  const body: ESTree.Statement[] = [];

  if (parser.getToken() !== Token.RightBrace) {
    while (parser.getToken() === Token.StringLiteral) {
      const { index, tokenStart, tokenIndex, tokenValue } = parser;
      const token = parser.getToken();
      const expr = parseLiteral(parser, context);
      if (isValidStrictMode(parser, index, tokenIndex, tokenValue)) {
        context |= Context.Strict;
        // TC39 deemed "use strict" directives to be an error when occurring
        // in the body of a function with non-simple parameter list, on
        // 29/7/2015. https://goo.gl/ueA7Ln
        if (parser.flags & Flags.NonSimpleParameterList) {
          throw new ParseError(tokenStart, parser.currentLocation, Errors.IllegalUseStrict);
        }

        if (parser.flags & Flags.Octal) {
          throw new ParseError(tokenStart, parser.currentLocation, Errors.StrictOctalLiteral);
        }

        if (parser.flags & Flags.EightAndNine) {
          throw new ParseError(tokenStart, parser.currentLocation, Errors.StrictEightAndNine);
        }

        functionScope?.reportScopeError();
      }
      body.push(parseDirective(parser, context, expr, token, tokenStart));
    }
    if (context & Context.Strict) {
      if (funcNameToken) {
        if ((funcNameToken & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.report(Errors.StrictEvalArguments);
        }
        if ((funcNameToken & Token.FutureReserved) === Token.FutureReserved) {
          parser.report(Errors.StrictFunctionName);
        }
      }
      if (parser.flags & Flags.StrictEvalArguments) parser.report(Errors.StrictEvalArguments);
      if (parser.flags & Flags.HasStrictReserved) parser.report(Errors.UnexpectedStrictReserved);
    }
  }

  parser.flags =
    (parser.flags | Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octal | Flags.EightAndNine) ^
    (Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octal | Flags.EightAndNine);

  parser.destructible = (parser.destructible | DestructuringKind.Yield) ^ DestructuringKind.Yield;

  while (parser.getToken() !== Token.RightBrace) {
    body.push(parseStatementListItem(parser, context, scope, privateScope, Origin.TopLevel, {}) as ESTree.Statement);
  }

  consume(
    parser,
    origin & (Origin.Arrow | Origin.Declaration) ? context | Context.AllowRegExp : context,
    Token.RightBrace,
  );

  parser.flags &= ~(Flags.NonSimpleParameterList | Flags.Octal | Flags.EightAndNine);

  if (parser.getToken() === Token.Assign) parser.report(Errors.CantAssignTo);

  return parser.finishNode<ESTree.BlockStatement>(
    {
      type: 'BlockStatement',
      body,
    },
    tokenStart,
  );
}

/**
 * Parse super expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseSuperExpression(parser: Parser, context: Context): ESTree.Super {
  const { tokenStart } = parser;
  nextToken(parser, context);

  switch (parser.getToken()) {
    case Token.QuestionMarkPeriod:
      parser.report(Errors.OptionalChainingNoSuper);
    case Token.LeftParen: {
      // The super property has to be within a class constructor
      if ((context & Context.SuperCall) === 0) parser.report(Errors.SuperNoConstructor);
      parser.assignable = AssignmentKind.CannotAssign;
      break;
    }
    case Token.LeftBracket:
    case Token.Period: {
      // new super() is never allowed.
      // super() is only allowed in derived constructor
      if ((context & Context.SuperProperty) === 0) parser.report(Errors.InvalidSuperProperty);
      parser.assignable = AssignmentKind.Assignable;
      break;
    }
    default:
      parser.report(Errors.UnexpectedToken, 'super');
  }

  return parser.finishNode<ESTree.Super>({ type: 'Super' }, tokenStart);
}

/**
 * Parses left hand side
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param canAssign
 */
function parseLeftHandSideExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
): ESTree.Expression {
  // LeftHandSideExpression ::
  //   (PrimaryExpression | MemberExpression) ...

  const start = parser.tokenStart;
  const expression = parsePrimaryExpression(
    parser,
    context,
    privateScope,
    BindingKind.Empty,
    0,
    canAssign,
    inGroup,
    isLHS,
    start,
  );

  return parseMemberOrUpdateExpression(parser, context, privateScope, expression, inGroup, 0, start);
}

/**
 * Parse update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 * @param start
 */
function parseUpdateExpression(parser: Parser, context: Context, expr: ESTree.Expression, start: Location) {
  if (parser.assignable & AssignmentKind.CannotAssign) parser.report(Errors.InvalidIncDecTarget);

  const token = parser.getToken();

  nextToken(parser, context);

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.UpdateExpression>(
    {
      type: 'UpdateExpression',
      argument: expr,
      operator: KeywordDescTable[token & Token.Type] as ESTree.UpdateOperator,
      prefix: false,
    },
    start,
  );
}
/**
 * Parses member or update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 * @param inGroup
 * @param start
 */
function parseMemberOrUpdateExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  expr: ESTree.Expression,
  inGroup: 0 | 1,
  inChain: 0 | 1,
  start: Location,
): any {
  if ((parser.getToken() & Token.IsUpdateOp) === Token.IsUpdateOp && (parser.flags & Flags.NewLine) === 0) {
    expr = parseUpdateExpression(parser, context, expr, start);
  } else if ((parser.getToken() & Token.IsMemberOrCallExpression) === Token.IsMemberOrCallExpression) {
    context = (context | Context.DisallowIn) ^ Context.DisallowIn;

    switch (parser.getToken()) {
      /* Property */
      case Token.Period: {
        nextToken(parser, (context | Context.AllowEscapedKeyword | Context.InGlobal) ^ Context.InGlobal);

        if (context & Context.InClass && parser.getToken() === Token.PrivateField && parser.tokenValue === 'super') {
          parser.report(Errors.InvalidSuperPrivate);
        }

        parser.assignable = AssignmentKind.Assignable;

        const property = parsePropertyOrPrivatePropertyName(parser, context | Context.TaggedTemplate, privateScope);

        expr = parser.finishNode<ESTree.MemberExpression>(
          {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            property,
            optional: false,
          },
          start,
        );
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

        const { tokenStart } = parser;
        const property = parseExpressions(parser, context, privateScope, inGroup, 1, tokenStart);

        consume(parser, context, Token.RightBracket);

        parser.assignable = AssignmentKind.Assignable;

        expr = parser.finishNode<ESTree.MemberExpression>(
          {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            property,
            optional: false,
          },
          start,
        );

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

        const args = parseArguments(parser, context, privateScope, inGroup);

        parser.assignable = AssignmentKind.CannotAssign;

        expr = parser.finishNode<ESTree.CallExpression>(
          {
            type: 'CallExpression',
            callee: expr,
            arguments: args,
            optional: false,
          },
          start,
        );

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
        expr = parseOptionalChain(parser, context, privateScope, expr, start);
        break;
      }

      default:
        if ((parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
          parser.report(Errors.OptionalChainingNoTemplate);
        }
        /* Tagged Template */
        parser.assignable = AssignmentKind.CannotAssign;

        expr = parser.finishNode<ESTree.TaggedTemplateExpression>(
          {
            type: 'TaggedTemplateExpression',
            tag: expr,
            quasi:
              parser.getToken() === Token.TemplateContinuation
                ? parseTemplate(parser, context | Context.TaggedTemplate, privateScope)
                : parseTemplateLiteral(parser, context),
          },
          start,
        );
    }

    expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 1, start);
  }

  // Finalize ChainExpression
  // FIXME: current implementation does not invalidate destructuring like `({ a: x?.obj['a'] } = {})`
  if (inChain === 0 && (parser.flags & Flags.HasOptionalChaining) === Flags.HasOptionalChaining) {
    parser.flags = (parser.flags | Flags.HasOptionalChaining) ^ Flags.HasOptionalChaining;

    expr = parser.finishNode<ESTree.ChainExpression>(
      {
        type: 'ChainExpression',
        expression: expr as ESTree.CallExpression | ESTree.MemberExpression,
      },
      start,
    );
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
function parseOptionalChain(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  expr: ESTree.Expression,
  start: Location,
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
    const { tokenStart } = parser;
    const property = parseExpressions(parser, context, privateScope, 0, 1, tokenStart);
    consume(parser, context, Token.RightBracket);
    parser.assignable = AssignmentKind.CannotAssign;
    node = parser.finishNode<ESTree.MemberExpression>(
      {
        type: 'MemberExpression',
        object: expr,
        computed: true,
        optional: true,
        property,
      },
      start,
    );
  } else if (parser.getToken() === Token.LeftParen) {
    const args = parseArguments(parser, context, privateScope, 0);

    parser.assignable = AssignmentKind.CannotAssign;

    node = parser.finishNode<ESTree.CallExpression>(
      {
        type: 'CallExpression',
        callee: expr,
        arguments: args,
        optional: true,
      },
      start,
    );
  } else {
    const property = parsePropertyOrPrivatePropertyName(parser, context, privateScope);
    parser.assignable = AssignmentKind.CannotAssign;
    node = parser.finishNode<ESTree.MemberExpression>(
      {
        type: 'MemberExpression',
        object: expr,
        computed: false,
        optional: true,
        property,
      },
      start,
    );
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
function parsePropertyOrPrivatePropertyName(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): any {
  if (
    (parser.getToken() & Token.IsIdentifier) === 0 &&
    parser.getToken() !== Token.EscapedReserved &&
    parser.getToken() !== Token.EscapedFutureReserved &&
    parser.getToken() !== Token.PrivateField
  ) {
    parser.report(Errors.InvalidDotProperty);
  }

  return parser.getToken() === Token.PrivateField
    ? parsePrivateIdentifier(parser, context, privateScope, PropertyKind.None)
    : parseIdentifier(parser, context);
}

/**
 * Parse update expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inNew
 * @param start
 */
function parseUpdateExpressionPrefixed(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inNew: 0 | 1,
  isLHS: 0 | 1,
  start: Location,
): ESTree.UpdateExpression {
  //  UpdateExpression ::
  //   LeftHandSideExpression ('++' | '--')?

  if (inNew) parser.report(Errors.InvalidIncDecNew);
  if (!isLHS) parser.report(Errors.Unexpected);

  const token = parser.getToken();

  nextToken(parser, context | Context.AllowRegExp);

  const arg = parseLeftHandSideExpression(parser, context, privateScope, 0, 0, 1);

  if (parser.assignable & AssignmentKind.CannotAssign) {
    parser.report(Errors.InvalidIncDecTarget);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.UpdateExpression>(
    {
      type: 'UpdateExpression',
      argument: arg,
      operator: KeywordDescTable[token & Token.Type] as ESTree.UpdateOperator,
      prefix: true,
    },
    start,
  );
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
 */
function parsePrimaryExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  kind: BindingKind,
  inNew: 0 | 1,
  canAssign: 0 | 1,
  inGroup: 0 | 1,
  isLHS: 0 | 1,
  start: Location,
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
        return parseAwaitExpressionOrIdentifier(parser, context, privateScope, inNew, inGroup, start);
      case Token.YieldKeyword:
        return parseYieldExpressionOrIdentifier(parser, context, privateScope, inGroup, canAssign, start);
      case Token.AsyncKeyword:
        return parseAsyncExpression(parser, context, privateScope, inGroup, isLHS, canAssign, inNew, start);
      default: // ignore
    }

    const { tokenValue } = parser;
    const token = parser.getToken();

    const expr = parseIdentifier(parser, context | Context.TaggedTemplate);

    if (parser.getToken() === Token.Arrow) {
      if (!isLHS) parser.report(Errors.Unexpected);
      classifyIdentifier(parser, context, token);
      if ((token & Token.FutureReserved) === Token.FutureReserved) {
        parser.flags |= Flags.HasStrictReserved;
      }
      return parseArrowFromIdentifier(parser, context, privateScope, tokenValue, expr, inNew, canAssign, 0, start);
    }

    if (
      context & Context.InClass &&
      !(context & Context.InMethodOrFunction) &&
      !(context & Context.InArgumentList) &&
      // Use tokenValue instead of token === Token.Arguments
      // because "arguments" maybe escaped like argument\u0073
      parser.tokenValue === 'arguments'
    )
      parser.report(Errors.InvalidClassFieldArgEval);

    // Only a "simple validation" is done here to handle 'let' edge cases

    if ((token & Token.Type) === (Token.LetKeyword & Token.Type)) {
      if (context & Context.Strict) parser.report(Errors.StrictInvalidLetInExprPos);
      if (kind & (BindingKind.Let | BindingKind.Const)) parser.report(Errors.InvalidLetConstBinding);
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
      return parseUpdateExpressionPrefixed(parser, context, privateScope, inNew, isLHS, start);
    case Token.DeleteKeyword:
    case Token.Negate:
    case Token.Complement:
    case Token.Add:
    case Token.Subtract:
    case Token.TypeofKeyword:
    case Token.VoidKeyword:
      return parseUnaryExpression(parser, context, privateScope, isLHS, inGroup);
    case Token.FunctionKeyword:
      return parseFunctionExpression(parser, context, privateScope, /* isAsync */ 0, inGroup, start);
    case Token.LeftBrace:
      return parseObjectLiteral(parser, context, privateScope, canAssign ? 0 : 1, inGroup);
    case Token.LeftBracket:
      return parseArrayLiteral(parser, context, privateScope, canAssign ? 0 : 1, inGroup);
    case Token.LeftParen:
      return parseParenthesizedExpression(
        parser,
        context | Context.TaggedTemplate,
        privateScope,
        canAssign,
        BindingKind.ArgumentList,
        Origin.None,
        start,
      );
    case Token.FalseKeyword:
    case Token.TrueKeyword:
    case Token.NullKeyword:
      return parseNullOrTrueOrFalseLiteral(parser, context);
    case Token.ThisKeyword:
      return parseThisExpression(parser, context);
    case Token.RegularExpression:
      return parseRegExpLiteral(parser, context);
    case Token.Decorator:
    case Token.ClassKeyword:
      return parseClassExpression(parser, context, privateScope, inGroup, start);
    case Token.SuperKeyword:
      return parseSuperExpression(parser, context);
    case Token.TemplateSpan:
      return parseTemplateLiteral(parser, context);
    case Token.TemplateContinuation:
      return parseTemplate(parser, context, privateScope);
    case Token.NewKeyword:
      return parseNewExpression(parser, context, privateScope, inGroup);
    case Token.BigIntLiteral:
      return parseBigIntLiteral(parser, context);
    case Token.PrivateField:
      return parsePrivateIdentifier(parser, context, privateScope, PropertyKind.None);
    case Token.ImportKeyword:
      return parseImportCallOrMetaExpression(parser, context, privateScope, inNew, inGroup, start);
    case Token.LessThan:
      if (parser.options.jsx)
        return parseJSXRootElementOrFragment(parser, context, privateScope, /*inJSXChild*/ 0, parser.tokenStart);
    default:
      if (isValidIdentifier(context, parser.getToken())) return parseIdentifierOrArrow(parser, context, privateScope);
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
}

/**
 * Parses Import call expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 */
function parseImportCallOrMetaExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inNew: 0 | 1,
  inGroup: 0 | 1,
  start: Location,
): ESTree.ImportExpression | ESTree.MetaProperty {
  // ImportCall[Yield, Await]:
  //  import(AssignmentExpression[+In, ?Yield, ?Await])

  let expr: ESTree.Identifier | ESTree.ImportExpression = parseIdentifier(parser, context);

  if (parser.getToken() === Token.Period) {
    return parseImportMetaExpression(parser, context, expr, start);
  }

  if (inNew) parser.report(Errors.InvalidImportNew);

  expr = parseImportExpression(parser, context, privateScope, inGroup, start);

  parser.assignable = AssignmentKind.CannotAssign;

  return parseMemberOrUpdateExpression(parser, context, privateScope, expr, inGroup, 0, start);
}

/**
 * Parses import meta expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param meta ESTree AST node
 */
function parseImportMetaExpression(
  parser: Parser,
  context: Context,
  meta: ESTree.Identifier,
  start: Location,
): ESTree.MetaProperty {
  if ((context & Context.Module) === 0) parser.report(Errors.ImportMetaOutsideModule);

  nextToken(parser, context); // skips: '.'
  const token = parser.getToken();
  if (token !== Token.Meta && parser.tokenValue !== 'meta') {
    parser.report(Errors.InvalidImportMeta);
  } else if (token & Token.IsEscaped) {
    parser.report(Errors.InvalidEscapedImportMeta);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.MetaProperty>(
    {
      type: 'MetaProperty',
      meta,
      property: parseIdentifier(parser, context),
    },
    start,
  );
}

/**
 * Parses import expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param inGroup
 * @param start
 */
function parseImportExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  start: Location,
): ESTree.ImportExpression {
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  if (parser.getToken() === Token.Ellipsis) parser.report(Errors.InvalidSpreadInImport);

  const source = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

  let options: ESTree.Expression | null = null;

  if (parser.getToken() === Token.Comma) {
    consume(parser, context, Token.Comma);

    if (parser.getToken() !== Token.RightParen) {
      const expContext = (context | Context.DisallowIn) ^ Context.DisallowIn;
      options = parseExpression(parser, expContext, privateScope, 1, inGroup, parser.tokenStart);
    }

    consumeOpt(parser, context, Token.Comma);
  }

  const node: ESTree.ImportExpression = {
    type: 'ImportExpression',
    source,
    options,
  };

  consume(parser, context, Token.RightParen);

  return parser.finishNode(node, start);
}

/**
 * Parses import attributes
 *
 * @param parser Parser object
 * @param context Context masks
 * @returns
 */

function parseImportAttributes(parser: Parser, context: Context): ESTree.ImportAttribute[] {
  if (!consumeOpt(parser, context, Token.WithKeyword)) return [];
  consume(parser, context, Token.LeftBrace);

  const attributes: ESTree.ImportAttribute[] = [];
  const keysContent = new Set<ESTree.Literal['value'] | ESTree.Identifier['name']>();

  while (parser.getToken() !== Token.RightBrace) {
    const start = parser.tokenStart;

    const key = parseIdentifierOrStringLiteral(parser, context);
    consume(parser, context, Token.Colon);
    const value = parseStringLiteral(parser, context);
    const keyContent = key.type === 'Literal' ? key.value : key.name;

    if (keysContent.has(keyContent)) {
      parser.report(Errors.DuplicateBinding, `${keyContent}`);
    }

    keysContent.add(keyContent);
    attributes.push(
      parser.finishNode<ESTree.ImportAttribute>(
        {
          type: 'ImportAttribute',
          key,
          value,
        },
        start,
      ),
    );

    if (parser.getToken() !== Token.RightBrace) {
      consume(parser, context, Token.Comma);
    }
  }

  consume(parser, context, Token.RightBrace);
  return attributes;
}

function parseStringLiteral(parser: Parser, context: Context): ESTree.Literal {
  if (parser.getToken() === Token.StringLiteral) {
    return parseLiteral(parser, context);
  } else {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
}

function parseIdentifierOrStringLiteral(parser: Parser, context: Context): ESTree.Identifier | ESTree.Literal {
  if (parser.getToken() === Token.StringLiteral) {
    return parseLiteral(parser, context);
  } else if (parser.getToken() & Token.IsIdentifier) {
    return parseIdentifier(parser, context);
  } else {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
}

/**
 * Checks IsStringWellFormedUnicode, same as String.prototype.isWellFormed
 *
 * @param str string to check
 * @returns void when passed the check
 */
function validateStringWellFormed(parser: Parser, str: string): void {
  const len = str.length;
  for (let i = 0; i < len; i++) {
    const code = str.charCodeAt(i);
    // Single UTF-16 unit
    if ((code & 0xfc00) !== Chars.LeadSurrogateMin) continue;
    // unpaired surrogate
    if (code > Chars.LeadSurrogateMax || ++i >= len || (str.charCodeAt(i) & 0xfc00) !== Chars.TrailSurrogateMin) {
      parser.report(Errors.InvalidExportName, JSON.stringify(str.charAt(i--)));
    }
  }
}

function parseModuleExportName(parser: Parser, context: Context): ESTree.Identifier | ESTree.Literal {
  // ModuleExportName :
  //   IdentifierName
  //   StringLiteral
  //
  // ModuleExportName : StringLiteral
  //   It is a Syntax Error if IsStringWellFormedUnicode(the SV of
  //   StringLiteral) is false.

  if (parser.getToken() === Token.StringLiteral) {
    validateStringWellFormed(parser, parser.tokenValue as string);
    return parseLiteral(parser, context);
  } else if (parser.getToken() & Token.IsIdentifier) {
    return parseIdentifier(parser, context);
  } else {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
}

/**
 * Parses BigInt literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseBigIntLiteral(parser: Parser, context: Context): ESTree.BigIntLiteral {
  const { tokenRaw, tokenValue, tokenStart } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;

  const node: ESTree.BigIntLiteral = {
    type: 'Literal',
    value: tokenValue,
    bigint: String(tokenValue),
  };

  if (parser.options.raw) {
    node.raw = tokenRaw;
  }

  return parser.finishNode(node, tokenStart);
}

/**
 * Parses template literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseTemplateLiteral(parser: Parser, context: Context): ESTree.TemplateLiteral {
  /**
   * Template Literals
   *
   * Template ::
   *   FullTemplate
   *   TemplateHead
   *
   * FullTemplate ::
   *   `Template Characters opt`
   *
   * TemplateHead ::
   *   ` Template Characters opt ${
   *
   * TemplateSubstitutionTail ::
   *   TemplateMiddle
   *   TemplateTail
   *
   * TemplateMiddle ::
   *   } Template Characters opt ${
   *
   * TemplateTail ::
   *   } Template Characters opt `
   *
   * TemplateCharacters ::
   *   TemplateCharacter Template Characters opt
   *
   * TemplateCharacter ::
   *   SourceCharacter but not one of ` or \ or $
   *   $ [lookahead not { ]
   *   \ TemplateEscapeSequence
   *   \ NotEscapeSequence
   *   LineContinuation
   *   LineTerminatorSequence
   *   SourceCharacter but not one of ` or \ or $ or LineTerminator
   *
   * TemplateEscapeSequence ::
   *   CharacterEscapeSequence
   *   0 [lookahead ∉ DecimalDigit]
   *   HexEscapeSequence
   *   UnicodeEscapeSequence
   *
   * Note: TemplateEscapeSequence removed
   *   LegacyOctalEscapeSequence
   *   NonOctalDecimalEscapeSequence
   * from EscapeSequence.
   *
   * NotEscapeSequence :: 0 DecimalDigit
   *   DecimalDigit but not 0
   *   x [lookahead ∉ HexDigit]
   *   x HexDigit [lookahead ∉ HexDigit]
   *   u [lookahead ∉ HexDigit] [lookahead ≠ {]
   *   u HexDigit [lookahead ∉ HexDigit]
   *   u HexDigit HexDigit [lookahead ∉ HexDigit]
   *   u HexDigit HexDigit HexDigit [lookahead ∉ HexDigit] u { [lookahead ∉ HexDigit]
   *   u { NotCodePoint [lookahead ∉ HexDigit]
   *   u { CodePoint [lookahead ∉ HexDigit] [lookahead ≠ }]
   *
   * NotCodePoint ::
   *   HexDigits[~Sep] but only if MV of HexDigits > 0x10FFFF
   *
   * CodePoint ::
   *   HexDigits[~Sep] but only if MV of HexDigits ≤ 0x10FFFF
   */

  parser.assignable = AssignmentKind.CannotAssign;
  const { tokenValue, tokenRaw, tokenStart } = parser;
  consume(parser, context, Token.TemplateSpan);
  const quasis = [parseTemplateElement(parser, tokenValue, tokenRaw, tokenStart, true)];

  return parser.finishNode<ESTree.TemplateLiteral>(
    {
      type: 'TemplateLiteral',
      expressions: [],
      quasis,
    },
    tokenStart,
  );
}

/**
 * Parses template
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseTemplate(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.TemplateLiteral {
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  const { tokenValue, tokenRaw, tokenStart } = parser;
  consume(parser, (context & ~Context.TaggedTemplate) | Context.AllowRegExp, Token.TemplateContinuation);

  const quasis = [parseTemplateElement(parser, tokenValue, tokenRaw, tokenStart, /* tail */ false)];

  const expressions = [
    parseExpressions(parser, context & ~Context.TaggedTemplate, privateScope, 0, 1, parser.tokenStart),
  ];

  if (parser.getToken() !== Token.RightBrace) parser.report(Errors.InvalidTemplateContinuation);

  while (parser.setToken(scanTemplateTail(parser, context), true) !== Token.TemplateSpan) {
    const { tokenValue, tokenRaw, tokenStart } = parser;
    consume(parser, (context & ~Context.TaggedTemplate) | Context.AllowRegExp, Token.TemplateContinuation);
    quasis.push(parseTemplateElement(parser, tokenValue, tokenRaw, tokenStart, /* tail */ false));

    expressions.push(parseExpressions(parser, context, privateScope, 0, 1, parser.tokenStart));
    if (parser.getToken() !== Token.RightBrace) parser.report(Errors.InvalidTemplateContinuation);
  }

  {
    const { tokenValue, tokenRaw, tokenStart } = parser;
    consume(parser, context, Token.TemplateSpan);
    quasis.push(parseTemplateElement(parser, tokenValue, tokenRaw, tokenStart, /* tail */ true));
  }

  return parser.finishNode<ESTree.TemplateLiteral>(
    {
      type: 'TemplateLiteral',
      expressions,
      quasis,
    },
    tokenStart,
  );
}

/**
 * Parses template spans
 *
 * @param parser  Parser object
 * @param tail
 */
function parseTemplateElement(
  parser: Parser,
  cooked: string | null,
  raw: string,
  start: Location,
  tail: boolean,
): ESTree.TemplateElement {
  const node = parser.finishNode<ESTree.TemplateElement>(
    {
      type: 'TemplateElement',
      value: {
        cooked,
        raw,
      },
      tail,
    },
    start,
  ) as ESTree.TemplateElement;

  const tailSize = tail ? 1 : 2;

  // Patch range
  if (parser.options.ranges) {
    // skip the front "`" or "}"
    (node.start as number) += 1;
    (node.range as [number, number])[0] += 1;
    // skip the tail "`" or "${"
    (node.end as number) -= tailSize;
    (node.range as [number, number])[1] -= tailSize;
  }

  // Patch loc
  if (parser.options.loc) {
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
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.SpreadElement {
  const start = parser.tokenStart;
  context = (context | Context.DisallowIn) ^ Context.DisallowIn;
  consume(parser, context | Context.AllowRegExp, Token.Ellipsis);
  const argument = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
  parser.assignable = AssignmentKind.Assignable;
  return parser.finishNode<ESTree.SpreadElement>(
    {
      type: 'SpreadElement',
      argument,
    },
    start,
  );
}

/**
 * Parses arguments
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseArguments(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
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
      args.push(parseSpreadElement(parser, context, privateScope));
    } else {
      args.push(parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart));
    }

    if (parser.getToken() !== Token.Comma) break;

    nextToken(parser, context | Context.AllowRegExp);

    if (parser.getToken() === Token.RightParen) break;
  }

  consume(parser, context | Context.TaggedTemplate, Token.RightParen);

  return args;
}

/**
 * Parses an identifier expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseIdentifier(parser: Parser, context: Context): ESTree.Identifier {
  const { tokenValue, tokenStart } = parser;

  const allowRegex = tokenValue === 'await' && (parser.getToken() & Token.IsEscaped) === 0;
  nextToken(parser, context | (allowRegex ? Context.AllowRegExp : 0));

  return parser.finishNode<ESTree.Identifier>(
    {
      type: 'Identifier',
      name: tokenValue,
    },
    tokenStart,
  );
}

/**
 * Parses an literal expression such as string literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseLiteral(parser: Parser, context: Context): ESTree.Literal {
  const { tokenValue, tokenRaw, tokenStart } = parser;
  if (parser.getToken() === Token.BigIntLiteral) {
    return parseBigIntLiteral(parser, context);
  }

  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return parser.finishNode(
    parser.options.raw
      ? {
          type: 'Literal',
          value: tokenValue,
          raw: tokenRaw,
        }
      : {
          type: 'Literal',
          value: tokenValue,
        },
    tokenStart,
  );
}

/**
 * Parses null and boolean expressions
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseNullOrTrueOrFalseLiteral(parser: Parser, context: Context): ESTree.Literal {
  const start = parser.tokenStart;
  const raw = KeywordDescTable[parser.getToken() & Token.Type];
  const value = parser.getToken() === Token.NullKeyword ? null : raw === 'true';

  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return parser.finishNode(
    parser.options.raw
      ? {
          type: 'Literal',
          value,
          raw,
        }
      : {
          type: 'Literal',
          value,
        },
    start,
  );
}

/**
 * Parses this expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseThisExpression(parser: Parser, context: Context): ESTree.ThisExpression {
  const { tokenStart } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  return parser.finishNode<ESTree.ThisExpression>(
    {
      type: 'ThisExpression',
    },
    tokenStart,
  );
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
function parseFunctionDeclaration(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  origin: Origin,
  allowGen: 0 | 1,
  flags: HoistedFunctionFlags,
  isAsync: 0 | 1,
  start: Location,
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
  let funcNameToken: Token | undefined;

  // Create a new function scope
  let functionScope = scope ? parser.createScope() : void 0;

  if (parser.getToken() === Token.LeftParen) {
    if ((flags & HoistedClassFlags.Hoisted) === 0) parser.report(Errors.DeclNoName, 'Function');
  } else {
    // In ES6, a function behaves as a lexical binding, except in
    // a script scope, or the initial scope of eval or another function.
    const kind =
      origin & Origin.TopLevel && ((context & Context.InGlobal) === 0 || (context & Context.Module) === 0)
        ? BindingKind.Variable
        : BindingKind.FunctionLexical | (isAsync ? BindingKind.Async : 0) | (isGenerator ? BindingKind.Generator : 0);

    validateFunctionName(parser, context, parser.getToken());

    if (scope) {
      if (kind & BindingKind.Variable) {
        scope.addVarName(context, parser.tokenValue, kind);
      } else {
        scope.addBlockName(context, parser.tokenValue, kind, origin);
      }

      functionScope = functionScope?.createChildScope(ScopeKind.FunctionRoot);

      if (flags) {
        if (flags & HoistedClassFlags.Export) {
          parser.declareUnboundVariable(parser.tokenValue);
        }
      }
    }

    funcNameToken = parser.getToken();

    if (parser.getToken() & Token.IsIdentifier) {
      id = parseIdentifier(parser, context);
    } else {
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
    }
  }

  {
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
  }

  functionScope = functionScope?.createChildScope(ScopeKind.FunctionParams);

  const params = parseFormalParametersOrFormalList(
    parser,
    (context | Context.InArgumentList) & ~Context.InStaticBlock,
    functionScope,
    privateScope,
    0,
    BindingKind.ArgumentList,
  );

  const modifierFlags = Context.InGlobal | Context.InSwitch | Context.InIteration | Context.InStaticBlock;

  const body = parseFunctionBody(
    parser,
    ((context | modifierFlags) ^ modifierFlags) | Context.InMethodOrFunction | Context.InReturnContext,
    functionScope?.createChildScope(ScopeKind.FunctionBody),
    privateScope,
    Origin.Declaration,
    funcNameToken,
    functionScope,
  );

  return parser.finishNode<ESTree.FunctionDeclaration>(
    {
      type: 'FunctionDeclaration',
      id,
      params,
      body,
      async: isAsync === 1,
      generator: isGenerator === 1,
    },
    start,
  );
}

/**
 * Parse function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param isAsync
 */
function parseFunctionExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  start: Location,
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
  let funcNameToken: Token | undefined;

  // Create a new function scope
  let scope = parser.createScopeIfLexical();

  const modifierFlags =
    Context.SuperProperty |
    Context.SuperCall |
    Context.InYieldContext |
    Context.InAwaitContext |
    Context.InArgumentList |
    Context.InConstructor |
    Context.InStaticBlock;

  if (parser.getToken() & Token.IsIdentifier) {
    validateFunctionName(
      parser,
      ((context | modifierFlags) ^ modifierFlags) | generatorAndAsyncFlags,
      parser.getToken(),
    );

    scope = scope?.createChildScope(ScopeKind.FunctionRoot);

    funcNameToken = parser.getToken();
    id = parseIdentifier(parser, context);
  }

  context =
    ((context | modifierFlags) ^ modifierFlags) |
    Context.AllowNewTarget |
    generatorAndAsyncFlags |
    (isGenerator ? 0 : Context.AllowEscapedKeyword);

  scope = scope?.createChildScope(ScopeKind.FunctionParams);

  const params = parseFormalParametersOrFormalList(
    parser,
    (context | Context.InArgumentList) & ~Context.InStaticBlock,
    scope,
    privateScope,
    inGroup,
    BindingKind.ArgumentList,
  );

  const body = parseFunctionBody(
    parser,
    (context & ~(Context.DisallowIn | Context.InSwitch | Context.InGlobal | Context.InIteration | Context.InClass)) |
      Context.InMethodOrFunction |
      Context.InReturnContext,
    scope?.createChildScope(ScopeKind.FunctionBody),
    privateScope,
    0,
    funcNameToken,
    scope,
  );

  parser.assignable = AssignmentKind.CannotAssign;
  return parser.finishNode<ESTree.FunctionExpression>(
    {
      type: 'FunctionExpression',
      id,
      params,
      body,
      async: isAsync === 1,
      generator: isGenerator === 1,
    },
    start,
  );
}

/**
 * Parses array literal expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 */
function parseArrayLiteral(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
): ESTree.ArrayExpression {
  /* ArrayLiteral :
   *   [ Elision opt ]
   *   [ ElementList ]
   *   [ ElementList , Elision opt ]
   *
   * ElementList :
   *   Elision opt AssignmentExpression
   *   Elision opt ... AssignmentExpression
   *   ElementList , Elision opt AssignmentExpression
   *   ElementList , Elision opt SpreadElement
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
    privateScope,
    skipInitializer,
    inGroup,
    0,
    BindingKind.Empty,
    Origin.None,
  );

  if (parser.destructible & DestructuringKind.SeenProto) {
    parser.report(Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.HasToDestruct) {
    parser.report(Errors.InvalidShorthandPropInit);
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

function parseArrayExpressionOrPattern(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  kind: BindingKind,
  origin: Origin,
): ESTree.ArrayExpression | ESTree.ArrayPattern | ESTree.AssignmentExpression {
  const { tokenStart: start } = parser;

  /* ArrayLiteral :
   *   [ Elision opt ]
   *   [ ElementList ]
   *   [ ElementList , Elision opt ]
   *
   * ElementList :
   *   Elision opt AssignmentExpression
   *   Elision opt ... AssignmentExpression
   *   ElementList , Elision opt AssignmentExpression
   *   ElementList , Elision opt SpreadElement
   *
   * Elision :
   *   ,
   *   Elision ,
   *
   * SpreadElement :
   *   ... AssignmentExpression
   *
   * ArrayAssignmentPattern[Yield] :
   *   [ Elision opt AssignmentRestElement[?Yield]opt ]
   *   [ AssignmentElementList[?Yield] ]
   *   [ AssignmentElementList[?Yield] , Elision opt AssignmentRestElement[?Yield]opt ]
   *
   * AssignmentRestElement[Yield] :
   *   ... DestructuringAssignmentTarget[?Yield]
   *
   * AssignmentElementList[Yield] :
   *   AssignmentElisionElement[?Yield]
   *   AssignmentElementList[?Yield] , AssignmentElisionElement[?Yield]
   *
   * AssignmentElisionElement[Yield] :
   *   Elision opt AssignmentElement[?Yield]
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

      const { tokenStart, tokenValue } = parser;
      const token = parser.getToken();

      if (token & Token.IsIdentifier) {
        left = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, inGroup, 1, tokenStart);

        if (parser.getToken() === Token.Assign) {
          if (parser.assignable & AssignmentKind.CannotAssign) parser.report(Errors.CantAssignTo);

          nextToken(parser, context | Context.AllowRegExp);

          scope?.addVarOrBlock(context, tokenValue, kind, origin);

          const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

          left = parser.finishNode(
            isPattern
              ? {
                  type: 'AssignmentPattern',
                  left,
                  right,
                }
              : ({
                  type: 'AssignmentExpression',
                  operator: '=',
                  left,
                  right,
                } as any),
            tokenStart,
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
          } else {
            scope?.addVarOrBlock(context, tokenValue, kind, origin);
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

          left = parseMemberOrUpdateExpression(parser, context, privateScope, left, inGroup, 0, tokenStart);

          if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
            if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
            left = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, left);
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
            ? parseObjectLiteralOrPattern(parser, context, scope, privateScope, 0, inGroup, isPattern, kind, origin)
            : parseArrayExpressionOrPattern(parser, context, scope, privateScope, 0, inGroup, isPattern, kind, origin);

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
          parser.report(Errors.InvalidDestructuringTarget);
        } else {
          left = parseMemberOrUpdateExpression(parser, context, privateScope, left, inGroup, 0, tokenStart);
          destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

          if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
            left = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, left);
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
          privateScope,
          Token.RightBracket,
          kind,
          origin,
          0,
          inGroup,
          isPattern,
        );
        destructible |= parser.destructible;
        if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket)
          parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
      } else {
        left = parseLeftHandSideExpression(parser, context, privateScope, 1, 0, 1);

        if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBracket) {
          left = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, left);
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

  const node = parser.finishNode(
    {
      type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
      elements,
    } as any,
    start,
  );

  if (!skipInitializer && parser.getToken() & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(
      parser,
      context,
      privateScope,
      destructible,
      inGroup,
      isPattern,
      start,
      node,
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
 * @param node ESTree AST node
 */
function parseArrayOrObjectAssignmentPattern(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  destructible: AssignmentKind | DestructuringKind,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  start: Location,
  node: ESTree.ArrayExpression | ESTree.ObjectExpression | ESTree.ObjectPattern,
): ESTree.AssignmentExpression {
  // 12.15.5 Destructuring Assignment
  //
  // AssignmentElement[Yield, Await]:
  //   DestructuringAssignmentTarget[?Yield, ?Await]
  //   DestructuringAssignmentTarget[?Yield, ?Await] Initializer[+In, ?Yield, ?Await]
  //

  if (parser.getToken() !== Token.Assign) parser.report(Errors.CantAssignTo);

  nextToken(parser, context | Context.AllowRegExp);

  if (destructible & DestructuringKind.CannotDestruct) parser.report(Errors.CantAssignTo);

  if (!isPattern) reinterpretToPattern(parser, node);

  const { tokenStart } = parser;

  const right = parseExpression(parser, context, privateScope, 1, inGroup, tokenStart);

  parser.destructible =
    ((destructible | DestructuringKind.SeenProto | DestructuringKind.HasToDestruct) ^
      (DestructuringKind.HasToDestruct | DestructuringKind.SeenProto)) |
    (parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0) |
    (parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0);

  return parser.finishNode(
    isPattern
      ? {
          type: 'AssignmentPattern',
          left: node,
          right,
        }
      : ({
          type: 'AssignmentExpression',
          left: node,
          operator: '=',
          right,
        } as any),
    start,
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
 */
function parseSpreadOrRestElement(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  closingToken: Token,
  kind: BindingKind,
  origin: Origin,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
): ESTree.SpreadElement | ESTree.RestElement {
  const { tokenStart: start } = parser;

  nextToken(parser, context | Context.AllowRegExp); // skip '...'

  let argument: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = DestructuringKind.None;

  const { tokenValue, tokenStart } = parser;
  let token = parser.getToken();

  if (token & Token.IsIdentifier) {
    parser.assignable = AssignmentKind.Assignable;

    argument = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, inGroup, 1, tokenStart);

    token = parser.getToken();

    argument = parseMemberOrUpdateExpression(
      parser,
      context,
      privateScope,
      argument as ESTree.Expression,
      inGroup,
      0,
      tokenStart,
    );

    if (parser.getToken() !== Token.Comma && parser.getToken() !== closingToken) {
      if (parser.assignable & AssignmentKind.CannotAssign && parser.getToken() === Token.Assign)
        parser.report(Errors.InvalidDestructuringTarget);

      destructible |= DestructuringKind.CannotDestruct;

      argument = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, argument);
    }

    if (parser.assignable & AssignmentKind.CannotAssign) {
      destructible |= DestructuringKind.CannotDestruct;
    } else if (token === closingToken || token === Token.Comma) {
      scope?.addVarOrBlock(context, tokenValue, kind, origin);
    } else {
      destructible |= DestructuringKind.Assignable;
    }

    destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
  } else if (token === closingToken) {
    parser.report(Errors.RestMissingArg);
  } else if (token & Token.IsPatternStart) {
    argument =
      parser.getToken() === Token.LeftBrace
        ? parseObjectLiteralOrPattern(parser, context, scope, privateScope, 1, inGroup, isPattern, kind, origin)
        : parseArrayExpressionOrPattern(parser, context, scope, privateScope, 1, inGroup, isPattern, kind, origin);

    token = parser.getToken();

    if (token !== Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.destructible & DestructuringKind.HasToDestruct) parser.report(Errors.InvalidDestructuringTarget);

      argument = parseMemberOrUpdateExpression(parser, context, privateScope, argument, inGroup, 0, tokenStart);

      destructible |= parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

      if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
        if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
        argument = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, argument);
      } else {
        if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
          argument = parseBinaryExpression(parser, context, privateScope, 1, tokenStart, 4, token, argument as any);
        }
        if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
          argument = parseConditionalExpression(parser, context, privateScope, argument as any, tokenStart);
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

    argument = parseLeftHandSideExpression(parser, context, privateScope, 1, inGroup, 1);

    const { tokenStart } = parser;
    const token = parser.getToken();

    if (token === Token.Assign) {
      if (parser.assignable & AssignmentKind.CannotAssign) parser.report(Errors.CantAssignTo);

      argument = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, argument);

      destructible |= DestructuringKind.CannotDestruct;
    } else {
      if (token === Token.Comma) {
        destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== closingToken) {
        argument = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, argument);
      }

      destructible |=
        parser.assignable & AssignmentKind.Assignable ? DestructuringKind.Assignable : DestructuringKind.CannotDestruct;
    }

    parser.destructible = destructible;

    if (parser.getToken() !== closingToken && parser.getToken() !== Token.Comma)
      parser.report(Errors.UnclosedSpreadElement);

    return parser.finishNode(
      {
        type: isPattern ? 'RestElement' : 'SpreadElement',
        argument: argument as ESTree.SpreadArgument,
      } as any,
      start,
    );
  }

  if (parser.getToken() !== closingToken) {
    if (kind & BindingKind.ArgumentList)
      destructible |= isAsync ? DestructuringKind.CannotDestruct : DestructuringKind.Assignable;

    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
      if (destructible & DestructuringKind.CannotDestruct) parser.report(Errors.CantAssignTo);

      reinterpretToPattern(parser, argument);

      const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

      argument = parser.finishNode(
        isPattern
          ? {
              type: 'AssignmentPattern',
              left: argument as ESTree.SpreadArgument,
              right,
            }
          : ({
              type: 'AssignmentExpression',
              left: argument as ESTree.SpreadArgument,
              operator: '=',
              right,
            } as any),
        tokenStart,
      );

      destructible = DestructuringKind.CannotDestruct;
    } else {
      // Note the difference between '|=' and '=' above
      destructible |= DestructuringKind.CannotDestruct;
    }
  }

  parser.destructible = destructible;

  return parser.finishNode(
    {
      type: isPattern ? 'RestElement' : 'SpreadElement',
      argument: argument as ESTree.SpreadArgument,
    } as any,
    start,
  );
}

/**
 * Parses method definition
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind
 * @param inGroup
 * @param start Start index
 */
function parseMethodDefinition(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  kind: PropertyKind,
  inGroup: 0 | 1,
  start: Location,
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
    Context.InMethodOrFunction |
    Context.AllowNewTarget;

  let scope = parser.createScopeIfLexical(ScopeKind.FunctionParams);

  const params = parseMethodFormals(
    parser,
    (context | Context.InArgumentList) & ~Context.InStaticBlock,
    scope,
    privateScope,
    kind,
    BindingKind.ArgumentList,
    inGroup,
  );

  scope = scope?.createChildScope(ScopeKind.FunctionBody);

  const body = parseFunctionBody(
    parser,
    (context & ~(Context.DisallowIn | Context.InSwitch | Context.InGlobal | Context.InStaticBlock)) |
      Context.InMethodOrFunction |
      Context.InReturnContext,
    scope,
    privateScope,
    Origin.None,
    void 0,
    scope?.parent,
  );

  return parser.finishNode<ESTree.FunctionExpression>(
    {
      type: 'FunctionExpression',
      params,
      body,
      async: (kind & PropertyKind.Async) > 0,
      generator: (kind & PropertyKind.Generator) > 0,
      id: null,
    },
    start,
  );
}

/**
 * Parse object literal or object pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 * @param inGroup

 */
function parseObjectLiteral(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
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
    privateScope,
    skipInitializer,
    inGroup,
    0,
    BindingKind.Empty,
    Origin.None,
  );

  if (parser.destructible & DestructuringKind.SeenProto) {
    parser.report(Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.HasToDestruct) {
    parser.report(Errors.InvalidShorthandPropInit);
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
 */
function parseObjectLiteralOrPattern(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  isPattern: 0 | 1,
  kind: BindingKind,
  origin: Origin,
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
   *   BindingIdentifier Initializer opt
   *
   * PropertyDefinition :
   *   IdentifierName
   *   CoverInitializedName
   *   PropertyName : AssignmentExpression
   *   MethodDefinition
   */

  const { tokenStart: start } = parser;

  nextToken(parser, context);

  const properties: (ESTree.Property | ESTree.SpreadElement | ESTree.RestElement)[] = [];
  let destructible: DestructuringKind | AssignmentKind = 0;
  let prototypeCount = 0;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  while (parser.getToken() !== Token.RightBrace) {
    const { tokenValue, tokenStart } = parser;
    const token = parser.getToken();

    if (token === Token.Ellipsis) {
      properties.push(
        parseSpreadOrRestElement(
          parser,
          context,
          scope,
          privateScope,
          Token.RightBrace,
          kind,
          origin,
          0,
          inGroup,
          isPattern,
        ),
      );
    } else {
      let state = PropertyKind.None;
      let key: ESTree.Expression | null = null;
      let value;
      if (
        parser.getToken() & Token.IsIdentifier ||
        parser.getToken() === Token.EscapedReserved ||
        parser.getToken() === Token.EscapedFutureReserved
      ) {
        if (parser.getToken() === Token.EscapedFutureReserved) destructible |= DestructuringKind.CannotDestruct;

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

          scope?.addVarOrBlock(context, tokenValue, kind, origin);

          if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
            destructible |= DestructuringKind.HasToDestruct;

            const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

            destructible |=
              parser.destructible & DestructuringKind.Yield
                ? DestructuringKind.Yield
                : 0 | (parser.destructible & DestructuringKind.Await)
                  ? DestructuringKind.Await
                  : 0;

            value = parser.finishNode<ESTree.AssignmentPattern>(
              {
                type: 'AssignmentPattern',
                left: parser.cloneIdentifier(key),
                right,
              },
              tokenStart,
            );
          } else {
            destructible |=
              (token === Token.AwaitKeyword ? DestructuringKind.Await : 0) |
              (token === Token.EscapedReserved ? DestructuringKind.CannotDestruct : 0);
            value = parser.cloneIdentifier(key);
          }
        } else if (consumeOpt(parser, context | Context.AllowRegExp, Token.Colon)) {
          const { tokenStart } = parser;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.getToken() & Token.IsIdentifier) {
            const tokenAfterColon = parser.getToken();
            const valueAfterColon = parser.tokenValue;

            value = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, inGroup, 1, tokenStart);

            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else if ((tokenAfterColon & Token.IsIdentifier) === Token.IsIdentifier) {
                  scope?.addVarOrBlock(context, valueAfterColon, kind, origin);
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
              } else {
                scope?.addVarOrBlock(context, valueAfterColon, kind, origin);
              }
              value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                value = parseBinaryExpression(parser, context, privateScope, 1, tokenStart, 4, token, value);
              }
              if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                value = parseConditionalExpression(parser, context, privateScope, value, tokenStart);
              }
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (parser.destructible & DestructuringKind.HasToDestruct) {
              parser.report(Errors.InvalidDestructuringTarget);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  privateScope,
                  inGroup,
                  isPattern,
                  tokenStart,
                  value,
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, privateScope, 1, tokenStart, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, privateScope, value, tokenStart);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, privateScope, 1, inGroup, 1);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if (parser.getToken() !== Token.Comma && token !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
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

          key = parseComputedPropertyName(parser, context, privateScope, inGroup);
          destructible |= parser.assignable;

          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else if (parser.getToken() & Token.IsIdentifier) {
          destructible |= DestructuringKind.CannotDestruct;
          if (token === Token.EscapedReserved) parser.report(Errors.InvalidEscapedKeyword);
          if (token === Token.AsyncKeyword) {
            if (parser.flags & Flags.NewLine) parser.report(Errors.AsyncRestrictedProd);
            state |= PropertyKind.Async | PropertyKind.Method;
          } else if (token === Token.GetKeyword) {
            state |= PropertyKind.Getter;
          } else if (token === Token.SetKeyword) {
            state |= PropertyKind.Setter;
          } else {
            parser.report(Errors.Unexpected);
          }
          key = parseIdentifier(parser, context);

          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else if (parser.getToken() === Token.LeftParen) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else if (parser.getToken() === Token.Multiply) {
          destructible |= DestructuringKind.CannotDestruct;

          if (token === Token.GetKeyword) {
            parser.report(Errors.InvalidGeneratorGetter);
          } else if (token === Token.SetKeyword) {
            parser.report(Errors.InvalidGeneratorSetter);
          } else if (token !== Token.AsyncKeyword) {
            parser.report(Errors.UnexpectedToken, KeywordDescTable[Token.Multiply & Token.Type]);
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
            key = parseComputedPropertyName(parser, context, privateScope, inGroup);
            destructible |= parser.assignable;
          } else {
            parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
          }
          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
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

          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else {
          parser.report(Errors.UnexpectedCharAfterObjLit);
        }
      } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
        key = parseLiteral(parser, context);

        if (parser.getToken() === Token.Colon) {
          consume(parser, context | Context.AllowRegExp, Token.Colon);

          const { tokenStart } = parser;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.getToken() & Token.IsIdentifier) {
            value = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, inGroup, 1, tokenStart);

            const { tokenValue: valueAfterColon } = parser;
            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else {
                  scope?.addVarOrBlock(context, valueAfterColon, kind, origin);
                }
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.Assignable
                    ? DestructuringKind.Assignable
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.getToken() === Token.Assign) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else if ((parser.destructible & DestructuringKind.HasToDestruct) !== DestructuringKind.HasToDestruct) {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);
              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  privateScope,
                  inGroup,
                  isPattern,
                  tokenStart,
                  value,
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, privateScope, 1, tokenStart, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, privateScope, value, tokenStart);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, privateScope, 1, 0, 1);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
              }
            }
          }
        } else if (parser.getToken() === Token.LeftParen) {
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
          destructible = parser.assignable | DestructuringKind.CannotDestruct;
        } else {
          parser.report(Errors.InvalidObjLitKey);
        }
      } else if (parser.getToken() === Token.LeftBracket) {
        key = parseComputedPropertyName(parser, context, privateScope, inGroup);

        destructible |= parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0;

        state |= PropertyKind.Computed;

        if (parser.getToken() === Token.Colon) {
          nextToken(parser, context | Context.AllowRegExp); // skip ':'

          const { tokenStart, tokenValue } = parser;
          const tokenAfterColon = parser.getToken();

          if (parser.getToken() & Token.IsIdentifier) {
            value = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, inGroup, 1, tokenStart);

            const token = parser.getToken();

            value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

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
                privateScope,
                inGroup,
                isPattern,
                tokenStart,
                value,
              );
            } else if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) {
                  destructible |= DestructuringKind.CannotDestruct;
                } else if ((tokenAfterColon & Token.IsIdentifier) === Token.IsIdentifier) {
                  scope?.addVarOrBlock(context, tokenValue, kind, origin);
                }
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.Assignable
                    ? DestructuringKind.Assignable
                    : DestructuringKind.CannotDestruct;
              }
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
            }
          } else if ((parser.getToken() & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.getToken() === Token.LeftBracket
                ? parseArrayExpressionOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  )
                : parseObjectLiteralOrPattern(
                    parser,
                    context,
                    scope,
                    privateScope,
                    0,
                    inGroup,
                    isPattern,
                    kind,
                    origin,
                  );

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.Assignable;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (destructible & DestructuringKind.HasToDestruct) {
              parser.report(Errors.InvalidShorthandPropInit);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

              destructible =
                parser.assignable & AssignmentKind.CannotAssign ? destructible | DestructuringKind.CannotDestruct : 0;

              if ((parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpressionOrPattern(
                  parser,
                  context,
                  privateScope,
                  inGroup,
                  isPattern,
                  tokenStart,
                  value,
                );
              } else {
                if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
                  value = parseBinaryExpression(parser, context, privateScope, 1, tokenStart, 4, token, value);
                }
                if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
                  value = parseConditionalExpression(parser, context, privateScope, value, tokenStart);
                }
                destructible |=
                  parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.Assignable;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, privateScope, 1, 0, 1);

            destructible |=
              parser.assignable & AssignmentKind.Assignable
                ? DestructuringKind.Assignable
                : DestructuringKind.CannotDestruct;

            if (parser.getToken() === Token.Comma || parser.getToken() === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, privateScope, value, inGroup, 0, tokenStart);

              destructible = parser.assignable & AssignmentKind.Assignable ? 0 : DestructuringKind.CannotDestruct;

              if (parser.getToken() !== Token.Comma && parser.getToken() !== Token.RightBrace) {
                if (parser.getToken() !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
                value = parseAssignmentExpression(parser, context, privateScope, inGroup, isPattern, tokenStart, value);
              }
            }
          }
        } else if (parser.getToken() === Token.LeftParen) {
          state |= PropertyKind.Method;

          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);

          destructible = DestructuringKind.CannotDestruct;
        } else {
          parser.report(Errors.InvalidComputedPropName);
        }
      } else if (token === Token.Multiply) {
        consume(parser, context | Context.AllowRegExp, Token.Multiply);

        state |= PropertyKind.Generator;

        if (parser.getToken() & Token.IsIdentifier) {
          const token = parser.getToken();

          key = parseIdentifier(parser, context);

          state |= PropertyKind.Method;

          if (parser.getToken() === Token.LeftParen) {
            destructible |= DestructuringKind.CannotDestruct;
            value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
          } else {
            throw new ParseError(
              parser.tokenStart,
              parser.currentLocation,
              token === Token.AsyncKeyword
                ? Errors.InvalidAsyncGetter
                : token === Token.GetKeyword || parser.getToken() === Token.SetKeyword
                  ? Errors.InvalidGetSetGenerator
                  : Errors.InvalidGenMethodShorthand,
              KeywordDescTable[token & Token.Type],
            );
          }
        } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
          destructible |= DestructuringKind.CannotDestruct;
          key = parseLiteral(parser, context);
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else if (parser.getToken() === Token.LeftBracket) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Computed | PropertyKind.Method;
          key = parseComputedPropertyName(parser, context, privateScope, inGroup);
          value = parseMethodDefinition(parser, context, privateScope, state, inGroup, parser.tokenStart);
        } else {
          parser.report(Errors.InvalidObjLitKeyStar);
        }
      } else {
        parser.report(Errors.UnexpectedToken, KeywordDescTable[token & Token.Type]);
      }

      destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;

      parser.destructible = destructible;

      properties.push(
        parser.finishNode<ESTree.Property>(
          {
            type: 'Property',
            key: key as ESTree.Expression,
            value,
            kind: !(state & PropertyKind.GetSet) ? 'init' : state & PropertyKind.Setter ? 'set' : 'get',
            computed: (state & PropertyKind.Computed) > 0,
            method: (state & PropertyKind.Method) > 0,
            shorthand: (state & PropertyKind.Shorthand) > 0,
          },
          tokenStart,
        ),
      );
    }

    destructible |= parser.destructible;
    if (parser.getToken() !== Token.Comma) break;
    nextToken(parser, context);
  }

  consume(parser, context, Token.RightBrace);

  if (prototypeCount > 1) destructible |= DestructuringKind.SeenProto;

  const node = parser.finishNode(
    {
      type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
      properties,
    },
    start,
  );

  if (!skipInitializer && parser.getToken() & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(
      parser,
      context,
      privateScope,
      destructible,
      inGroup,
      isPattern,
      start,
      node,
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
function parseMethodFormals(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  kind: PropertyKind,
  type: BindingKind,
  inGroup: 0 | 1,
): ESTree.Parameter[] {
  // FormalParameter[Yield,GeneratorParameter] :
  //   BindingElement[?Yield, ?GeneratorParameter]

  consume(parser, context, Token.LeftParen);

  const params: (ESTree.AssignmentPattern | ESTree.Parameter)[] = [];

  parser.flags = (parser.flags | Flags.NonSimpleParameterList) ^ Flags.NonSimpleParameterList;

  if (parser.getToken() === Token.RightParen) {
    if (kind & PropertyKind.Setter) {
      parser.report(Errors.AccessorWrongArgs, 'Setter', 'one', '');
    }
    nextToken(parser, context);
    return params;
  }

  if (kind & PropertyKind.Getter) {
    parser.report(Errors.AccessorWrongArgs, 'Getter', 'no', 's');
  }
  if (kind & PropertyKind.Setter && parser.getToken() === Token.Ellipsis) {
    parser.report(Errors.BadSetterRestParameter);
  }

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  let setterArgs = 0;
  let isNonSimpleParameterList: 0 | 1 = 0;

  while (parser.getToken() !== Token.Comma) {
    let left = null;
    const { tokenStart } = parser;

    if (parser.getToken() & Token.IsIdentifier) {
      if ((context & Context.Strict) === 0) {
        if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
          parser.flags |= Flags.HasStrictReserved;
        }

        if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.flags |= Flags.StrictEvalArguments;
        }
      }

      left = parseAndClassifyIdentifier(parser, context, scope, kind | BindingKind.ArgumentList, Origin.None);
    } else {
      if (parser.getToken() === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(parser, context, scope, privateScope, 1, inGroup, 1, type, Origin.None);
      } else if (parser.getToken() === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(parser, context, scope, privateScope, 1, inGroup, 1, type, Origin.None);
      } else if (parser.getToken() === Token.Ellipsis) {
        left = parseSpreadOrRestElement(
          parser,
          context,
          scope,
          privateScope,
          Token.RightParen,
          type,
          Origin.None,
          0,
          inGroup,
          1,
        );
      }

      isNonSimpleParameterList = 1;

      if (parser.destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
        parser.report(Errors.InvalidBindingDestruct);
    }

    if (parser.getToken() === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isNonSimpleParameterList = 1;

      const right = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);

      left = parser.finishNode<ESTree.AssignmentPattern>(
        {
          type: 'AssignmentPattern',
          left: left as ESTree.BindingPattern | ESTree.Identifier,
          right,
        },
        tokenStart,
      );
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
    parser.report(Errors.AccessorWrongArgs, 'Setter', 'one', '');
  }

  scope?.reportScopeError();
  if (isNonSimpleParameterList) parser.flags |= Flags.NonSimpleParameterList;

  consume(parser, context, Token.RightParen);

  return params;
}

/**
 * Parse computed property name
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseComputedPropertyName(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
): ESTree.Expression {
  // ComputedPropertyName :
  //   [ AssignmentExpression ]
  nextToken(parser, context | Context.AllowRegExp);
  const key = parseExpression(
    parser,
    (context | Context.DisallowIn) ^ Context.DisallowIn,
    privateScope,
    1,
    inGroup,
    parser.tokenStart,
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
 */
function parseParenthesizedExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  canAssign: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  start: Location,
): any {
  parser.flags = (parser.flags | Flags.NonSimpleParameterList) ^ Flags.NonSimpleParameterList;

  const parenthesesStart = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp | Context.AllowEscapedKeyword);

  const scope = parser.createScopeIfLexical()?.createChildScope(ScopeKind.ArrowParams);

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (consumeOpt(parser, context, Token.RightParen)) {
    // Not valid expression syntax, but this is valid in an arrow function
    // with no params: `() => body`.
    return parseParenthesizedArrow(parser, context, scope, privateScope, [], canAssign, 0, start);
  }

  let destructible: AssignmentKind | DestructuringKind = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  let expr;
  let expressions: ESTree.Expression[] = [];
  let isSequence: 0 | 1 = 0;
  let isNonSimpleParameterList: 0 | 1 = 0;
  let hasStrictReserved: 0 | 1 = 0;

  const tokenAfterParenthesesStart = parser.tokenStart;

  parser.assignable = AssignmentKind.Assignable;

  while (parser.getToken() !== Token.RightParen) {
    const { tokenStart } = parser;
    const token = parser.getToken();

    if (token & Token.IsIdentifier) {
      scope?.addBlockName(context, parser.tokenValue, BindingKind.ArgumentList, Origin.None);

      if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
        isNonSimpleParameterList = 1;
      } else if ((token & Token.FutureReserved) === Token.FutureReserved) {
        hasStrictReserved = 1;
      }

      expr = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, 1, 1, tokenStart);

      if (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isNonSimpleParameterList = 1;
        }
      } else {
        if (parser.getToken() === Token.Assign) {
          isNonSimpleParameterList = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, /* inGroup */ 1, 0, tokenStart);

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, privateScope, 1, 0, tokenStart, expr);
        }
      }
    } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(
              parser,
              context | Context.AllowEscapedKeyword,
              scope,
              privateScope,
              0,
              1,
              0,
              kind,
              origin,
            )
          : parseArrayExpressionOrPattern(
              parser,
              context | Context.AllowEscapedKeyword,
              scope,
              privateScope,
              0,
              1,
              0,
              kind,
              origin,
            );

      destructible |= parser.destructible;

      isNonSimpleParameterList = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) parser.report(Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, tokenStart);

        destructible |= DestructuringKind.CannotDestruct;

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, privateScope, 0, 0, tokenStart, expr);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadOrRestElement(parser, context, scope, privateScope, Token.RightParen, kind, origin, 0, 1, 0);

      if (parser.destructible & DestructuringKind.CannotDestruct) parser.report(Errors.InvalidRestArg);

      isNonSimpleParameterList = 1;

      if (isSequence && (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma)) {
        expressions.push(expr);
      }
      destructible |= DestructuringKind.HasToDestruct;
      break;
    } else {
      destructible |= DestructuringKind.CannotDestruct;

      expr = parseExpression(parser, context, privateScope, 1, 1, tokenStart);

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
          expressions.push(parseExpression(parser, context, privateScope, 1, 1, parser.tokenStart));
        }

        parser.assignable = AssignmentKind.CannotAssign;

        expr = parser.finishNode<ESTree.SequenceExpression>(
          {
            type: 'SequenceExpression',
            expressions,
          },
          tokenAfterParenthesesStart,
        );
      }

      consume(parser, context, Token.RightParen);

      parser.destructible = destructible;

      return parser.options.preserveParens
        ? parser.finishNode<ESTree.ParenthesizedExpression>(
            {
              type: 'ParenthesizedExpression',
              expression: expr,
            },
            parenthesesStart,
          )
        : expr;
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

    expr = parser.finishNode<ESTree.SequenceExpression>(
      {
        type: 'SequenceExpression',
        expressions,
      },
      tokenAfterParenthesesStart,
    );
  }

  consume(parser, context, Token.RightParen);

  if (destructible & DestructuringKind.CannotDestruct && destructible & DestructuringKind.HasToDestruct)
    parser.report(Errors.CantAssignToValidRHS);

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
        ? DestructuringKind.Await
        : 0;

  if (parser.getToken() === Token.Arrow) {
    if (destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
      parser.report(Errors.InvalidArrowDestructLHS);
    if (context & (Context.InAwaitContext | Context.Module) && destructible & DestructuringKind.Await)
      parser.report(Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield) {
      parser.report(Errors.YieldInParameter);
    }
    if (isNonSimpleParameterList) parser.flags |= Flags.NonSimpleParameterList;
    if (hasStrictReserved) parser.flags |= Flags.HasStrictReserved;
    return parseParenthesizedArrow(
      parser,
      context,
      scope,
      privateScope,
      isSequence ? expressions : [expr],
      canAssign,
      0,
      start,
    );
  }

  if (destructible & DestructuringKind.SeenProto) {
    parser.report(Errors.DuplicateProto);
  }

  if (destructible & DestructuringKind.HasToDestruct) {
    parser.report(Errors.IncompleteArrow);
  }

  parser.destructible = ((parser.destructible | DestructuringKind.Yield) ^ DestructuringKind.Yield) | destructible;

  return parser.options.preserveParens
    ? parser.finishNode<ESTree.ParenthesizedExpression>(
        {
          type: 'ParenthesizedExpression',
          expression: expr,
        },
        parenthesesStart,
      )
    : expr;
}

/**
 * Parses either an identifier or an arrow function
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseIdentifierOrArrow(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.Identifier | ESTree.ArrowFunctionExpression {
  const { tokenStart: start } = parser;
  const { tokenValue } = parser;

  let isNonSimpleParameterList: 0 | 1 = 0;
  let hasStrictReserved: 0 | 1 = 0;

  if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
    isNonSimpleParameterList = 1;
  } else if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
    hasStrictReserved = 1;
  }

  const expr = parseIdentifier(parser, context);
  parser.assignable = AssignmentKind.Assignable;
  if (parser.getToken() === Token.Arrow) {
    const scope = parser.options.lexical ? createArrowHeadParsingScope(parser, context, tokenValue) : undefined;

    if (isNonSimpleParameterList) parser.flags |= Flags.NonSimpleParameterList;
    if (hasStrictReserved) parser.flags |= Flags.HasStrictReserved;

    return parseArrowFunctionExpression(parser, context, scope, privateScope, [expr], /* isAsync */ 0, start);
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
 */
function parseArrowFromIdentifier(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  value: any,
  expr: ESTree.Expression,
  inNew: 0 | 1,
  canAssign: 0 | 1,
  isAsync: 0 | 1,
  start: Location,
): ESTree.ArrowFunctionExpression {
  if (!canAssign) parser.report(Errors.InvalidAssignmentTarget);
  if (inNew) parser.report(Errors.InvalidAsyncArrow);
  parser.flags &= ~Flags.NonSimpleParameterList;
  const scope = parser.options.lexical ? createArrowHeadParsingScope(parser, context, value) : void 0;

  return parseArrowFunctionExpression(parser, context, scope, privateScope, [expr], isAsync, start);
}

/**
 * Parse arrow function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param params
 * @param isAsync
 * @param start Start index
 */
function parseParenthesizedArrow(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  params: any,
  canAssign: 0 | 1,
  isAsync: 0 | 1,
  start: Location,
): ESTree.ArrowFunctionExpression {
  if (!canAssign) parser.report(Errors.InvalidAssignmentTarget);

  for (let i = 0; i < params.length; ++i) reinterpretToPattern(parser, params[i]);

  return parseArrowFunctionExpression(parser, context, scope, privateScope, params, isAsync, start);
}

/**
 * Parse arrow function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param params
 * @param isAsync
 * @param start Start index
 */
function parseArrowFunctionExpression(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  params: any,
  isAsync: 0 | 1,
  start: Location,
): ESTree.ArrowFunctionExpression {
  /**
   * ArrowFunction :
   *   ArrowParameters => ConciseBody
   *
   * ArrowParameters :
   *   BindingIdentifier
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

  if (parser.flags & Flags.NewLine) parser.report(Errors.InvalidLineBreak);

  consume(parser, context | Context.AllowRegExp, Token.Arrow);

  const modifierFlags =
    Context.InYieldContext | Context.InAwaitContext | Context.InArgumentList | Context.InStaticBlock;

  context = ((context | modifierFlags) ^ modifierFlags) | (isAsync ? Context.InAwaitContext : 0);

  const expression = parser.getToken() !== Token.LeftBrace;

  let body: ESTree.BlockStatement | ESTree.Expression;

  scope?.reportScopeError();

  if (expression) {
    parser.flags =
      (parser.flags | Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octal | Flags.EightAndNine) ^
      (Flags.StrictEvalArguments | Flags.HasStrictReserved | Flags.Octal | Flags.EightAndNine);

    // Single-expression body
    body = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
  } else {
    scope = scope?.createChildScope(ScopeKind.FunctionBody);

    const modifierFlags = Context.InSwitch | Context.DisallowIn | Context.InGlobal;

    body = parseFunctionBody(
      parser,
      ((context | modifierFlags) ^ modifierFlags) | Context.InReturnContext,
      scope,
      privateScope,
      Origin.Arrow,
      void 0,
      void 0,
    );

    switch (parser.getToken()) {
      case Token.LeftBracket:
        if ((parser.flags & Flags.NewLine) === 0) {
          parser.report(Errors.InvalidInvokedBlockBodyArrow);
        }
        break;
      case Token.Period:
      case Token.TemplateSpan:
      case Token.QuestionMark:
        parser.report(Errors.InvalidAccessedBlockBodyArrow);
      case Token.LeftParen:
        if ((parser.flags & Flags.NewLine) === 0) {
          parser.report(Errors.InvalidInvokedBlockBodyArrow);
        }
        parser.flags |= Flags.DisallowCall;
        break;
      default: // ignore
    }
    if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp && (parser.flags & Flags.NewLine) === 0)
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
    if ((parser.getToken() & Token.IsUpdateOp) === Token.IsUpdateOp) parser.report(Errors.InvalidArrowPostfix);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.ArrowFunctionExpression>(
    {
      type: 'ArrowFunctionExpression',
      params,
      body,
      async: isAsync === 1,
      expression,
      generator: false,
    },
    start,
  );
}

/**
 * Parses formal parameters
 *
 * @param parser  Parser object
 * @param context Context masks
 */
function parseFormalParametersOrFormalList(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  kind: BindingKind,
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
   *   BindingPattern Initializer opt
   *
   */
  consume(parser, context, Token.LeftParen);

  parser.flags = (parser.flags | Flags.NonSimpleParameterList) ^ Flags.NonSimpleParameterList;

  const params: ESTree.Parameter[] = [];

  if (consumeOpt(parser, context, Token.RightParen)) return params;

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  let isNonSimpleParameterList: 0 | 1 = 0;

  while (parser.getToken() !== Token.Comma) {
    let left: any;

    const { tokenStart } = parser;
    const token = parser.getToken();

    if (token & Token.IsIdentifier) {
      if ((context & Context.Strict) === 0) {
        if ((token & Token.FutureReserved) === Token.FutureReserved) {
          parser.flags |= Flags.HasStrictReserved;
        }
        if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
          parser.flags |= Flags.StrictEvalArguments;
        }
      }

      left = parseAndClassifyIdentifier(parser, context, scope, kind | BindingKind.ArgumentList, Origin.None);
    } else {
      if (token === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(parser, context, scope, privateScope, 1, inGroup, 1, kind, Origin.None);
      } else if (token === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(parser, context, scope, privateScope, 1, inGroup, 1, kind, Origin.None);
      } else if (token === Token.Ellipsis) {
        left = parseSpreadOrRestElement(
          parser,
          context,
          scope,
          privateScope,
          Token.RightParen,
          kind,
          Origin.None,
          0,
          inGroup,
          1,
        );
      } else {
        parser.report(Errors.UnexpectedToken, KeywordDescTable[token & Token.Type]);
      }

      isNonSimpleParameterList = 1;

      if (parser.destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct)) {
        parser.report(Errors.InvalidBindingDestruct);
      }
    }

    if (parser.getToken() === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isNonSimpleParameterList = 1;

      const right = parseExpression(parser, context, privateScope, 1, inGroup, parser.tokenStart);

      left = parser.finishNode<ESTree.AssignmentPattern>(
        {
          type: 'AssignmentPattern',
          left,
          right,
        },
        tokenStart,
      );
    }

    params.push(left);

    if (!consumeOpt(parser, context, Token.Comma)) break;
    if (parser.getToken() === Token.RightParen) {
      // allow the trailing comma
      break;
    }
  }
  if (isNonSimpleParameterList) parser.flags |= Flags.NonSimpleParameterList;

  if (isNonSimpleParameterList || context & Context.Strict) {
    scope?.reportScopeError();
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
 */
function parseMemberExpressionNoCall(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  expr: ESTree.Expression,
  inGroup: 0 | 1,
  start: Location,
): any {
  const token = parser.getToken();

  if (token & Token.IsMemberOrCallExpression) {
    /* Property */
    if (token === Token.Period) {
      nextToken(parser, context | Context.AllowEscapedKeyword);

      parser.assignable = AssignmentKind.Assignable;

      const property = parsePropertyOrPrivatePropertyName(parser, context, privateScope);

      return parseMemberExpressionNoCall(
        parser,
        context,
        privateScope,
        parser.finishNode<ESTree.MemberExpression>(
          {
            type: 'MemberExpression',
            object: expr,
            computed: false,
            property,
            optional: false,
          },
          start,
        ),
        0,
        start,
      );
      /* Property */
    } else if (token === Token.LeftBracket) {
      nextToken(parser, context | Context.AllowRegExp);

      const { tokenStart } = parser;

      const property = parseExpressions(parser, context, privateScope, inGroup, 1, tokenStart);

      consume(parser, context, Token.RightBracket);

      parser.assignable = AssignmentKind.Assignable;

      return parseMemberExpressionNoCall(
        parser,
        context,
        privateScope,
        parser.finishNode<ESTree.MemberExpression>(
          {
            type: 'MemberExpression',
            object: expr,
            computed: true,
            property,
            optional: false,
          },
          start,
        ),
        0,
        start,
      );
      /* Template */
    } else if (token === Token.TemplateContinuation || token === Token.TemplateSpan) {
      parser.assignable = AssignmentKind.CannotAssign;

      return parseMemberExpressionNoCall(
        parser,
        context,
        privateScope,
        parser.finishNode<ESTree.TaggedTemplateExpression>(
          {
            type: 'TaggedTemplateExpression',
            tag: expr,
            quasi:
              parser.getToken() === Token.TemplateContinuation
                ? parseTemplate(parser, context | Context.TaggedTemplate, privateScope)
                : parseTemplateLiteral(parser, context | Context.TaggedTemplate),
          },
          start,
        ),
        0,
        start,
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
function parseNewExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
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
  const { tokenStart: start } = parser;
  const id = parseIdentifier(parser, context | Context.AllowRegExp);
  const { tokenStart } = parser;

  if (consumeOpt(parser, context, Token.Period)) {
    if (context & Context.AllowNewTarget && parser.getToken() === Token.Target) {
      parser.assignable = AssignmentKind.CannotAssign;
      return parseMetaProperty(parser, context, id, start);
    }

    parser.report(Errors.InvalidNewTarget);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  if ((parser.getToken() & Token.IsUnaryOp) === Token.IsUnaryOp) {
    parser.report(Errors.InvalidNewUnary, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  const expr = parsePrimaryExpression(parser, context, privateScope, BindingKind.Empty, 1, 0, inGroup, 1, tokenStart);

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (parser.getToken() === Token.QuestionMarkPeriod) parser.report(Errors.OptionalChainingNoNew);

  // NewExpression without arguments.
  const callee = parseMemberExpressionNoCall(parser, context, privateScope, expr, inGroup, tokenStart);

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.NewExpression>(
    {
      type: 'NewExpression',
      callee,
      arguments: parser.getToken() === Token.LeftParen ? parseArguments(parser, context, privateScope, inGroup) : [],
    },
    start,
  );
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
function parseMetaProperty(
  parser: Parser,
  context: Context,
  meta: ESTree.Identifier,
  start: Location,
): ESTree.MetaProperty {
  const property = parseIdentifier(parser, context);
  return parser.finishNode<ESTree.MetaProperty>(
    {
      type: 'MetaProperty',
      meta,
      property,
    },
    start,
  );
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
 */
function parseAsyncArrowAfterIdent(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  canAssign: 0 | 1,
  start: Location,
) {
  if (parser.getToken() === Token.AwaitKeyword) parser.report(Errors.AwaitInParameter);

  if (context & (Context.Strict | Context.InYieldContext) && parser.getToken() === Token.YieldKeyword) {
    parser.report(Errors.YieldInParameter);
  }

  classifyIdentifier(parser, context, parser.getToken());

  if ((parser.getToken() & Token.FutureReserved) === Token.FutureReserved) {
    parser.flags |= Flags.HasStrictReserved;
  }

  return parseArrowFromIdentifier(
    parser,
    (context & ~Context.InStaticBlock) | Context.InAwaitContext,
    privateScope,
    parser.tokenValue,
    parseIdentifier(parser, context),
    0,
    canAssign,
    1,
    start,
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
 */
function parseAsyncArrowOrCallExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  callee: ESTree.Identifier | void,
  canAssign: 0 | 1,
  kind: BindingKind,
  origin: Origin,
  flags: Flags,
  start: Location,
): ESTree.CallExpression | ESTree.ArrowFunctionExpression {
  nextToken(parser, context | Context.AllowRegExp);

  const scope = parser.createScopeIfLexical()?.createChildScope(ScopeKind.ArrowParams);

  context = (context | Context.DisallowIn) ^ Context.DisallowIn;

  if (consumeOpt(parser, context, Token.RightParen)) {
    if (parser.getToken() === Token.Arrow) {
      if (flags & Flags.NewLine) parser.report(Errors.InvalidLineBreak);
      return parseParenthesizedArrow(parser, context, scope, privateScope, [], canAssign, 1, start);
    }

    return parser.finishNode<ESTree.CallExpression>(
      {
        type: 'CallExpression',
        callee,
        arguments: [],
        optional: false,
      },
      start,
    );
  }

  let destructible: AssignmentKind | DestructuringKind = 0;
  let expr: ESTree.Expression | null = null;
  let isNonSimpleParameterList: 0 | 1 = 0;

  parser.destructible =
    (parser.destructible | DestructuringKind.Yield | DestructuringKind.Await) ^
    (DestructuringKind.Yield | DestructuringKind.Await);

  const params: ESTree.Expression[] = [];

  // FIXME: #337 at this point, it's unknown whether this is a argument list, or calling params list.
  // const previousContext = context;
  // context = context | Context.InArgumentList;
  while (parser.getToken() !== Token.RightParen) {
    const { tokenStart } = parser;
    const token = parser.getToken();

    if (token & Token.IsIdentifier) {
      scope?.addBlockName(context, parser.tokenValue, kind, Origin.None);

      if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
        parser.flags |= Flags.StrictEvalArguments;
      } else if ((token & Token.FutureReserved) === Token.FutureReserved) {
        parser.flags |= Flags.HasStrictReserved;
      }

      expr = parsePrimaryExpression(parser, context, privateScope, kind, 0, 1, 1, 1, tokenStart);

      if (parser.getToken() === Token.RightParen || parser.getToken() === Token.Comma) {
        if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
          isNonSimpleParameterList = 1;
        }
      } else {
        if (parser.getToken() === Token.Assign) {
          isNonSimpleParameterList = 1;
        } else {
          destructible |= DestructuringKind.CannotDestruct;
        }

        expr = parseMemberOrUpdateExpression(
          parser,
          context,
          privateScope,
          expr as ESTree.Expression,
          1,
          0,
          tokenStart,
        );

        if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
          expr = parseAssignmentExpression(parser, context, privateScope, 1, 0, tokenStart, expr as ESTree.Expression);
        }
      }
    } else if (token & Token.IsPatternStart) {
      expr =
        token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, scope, privateScope, 0, 1, 0, kind, origin)
          : parseArrayExpressionOrPattern(parser, context, scope, privateScope, 0, 1, 0, kind, origin);

      destructible |= parser.destructible;

      isNonSimpleParameterList = 1;

      if (parser.getToken() !== Token.RightParen && parser.getToken() !== Token.Comma) {
        if (destructible & DestructuringKind.HasToDestruct) parser.report(Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, privateScope, expr, 0, 0, tokenStart);

        destructible |= DestructuringKind.CannotDestruct;

        if ((parser.getToken() & Token.IsBinaryOp) === Token.IsBinaryOp) {
          expr = parseBinaryExpression(parser, context, privateScope, 1, start, 4, token, expr as ESTree.Expression);
        }
        if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
          expr = parseConditionalExpression(parser, context, privateScope, expr as ESTree.Expression, start);
        }
      }
    } else if (token === Token.Ellipsis) {
      expr = parseSpreadOrRestElement(parser, context, scope, privateScope, Token.RightParen, kind, origin, 1, 1, 0);

      destructible |=
        (parser.getToken() === Token.RightParen ? 0 : DestructuringKind.CannotDestruct) | parser.destructible;

      isNonSimpleParameterList = 1;
    } else {
      expr = parseExpression(parser, context, privateScope, 1, 0, tokenStart);

      destructible = parser.assignable;

      params.push(expr);

      while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        params.push(parseExpression(parser, context, privateScope, 1, 0, tokenStart));
      }

      destructible |= parser.assignable;

      consume(parser, context, Token.RightParen);

      parser.destructible = destructible | DestructuringKind.CannotDestruct;

      parser.assignable = AssignmentKind.CannotAssign;

      return parser.finishNode<ESTree.CallExpression>(
        {
          type: 'CallExpression',
          callee,
          arguments: params,
          optional: false,
        },
        start,
      );
    }

    params.push(expr as ESTree.Expression);

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;
  }

  // context = previousContext;
  consume(parser, context, Token.RightParen);

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
        ? DestructuringKind.Await
        : 0;

  if (parser.getToken() === Token.Arrow) {
    if (destructible & (DestructuringKind.Assignable | DestructuringKind.CannotDestruct))
      parser.report(Errors.InvalidLHSAsyncArrow);
    if (parser.flags & Flags.NewLine || flags & Flags.NewLine) parser.report(Errors.InvalidLineBreak);
    if (destructible & DestructuringKind.Await) parser.report(Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield)
      parser.report(Errors.YieldInParameter);
    if (isNonSimpleParameterList) parser.flags |= Flags.NonSimpleParameterList;

    return parseParenthesizedArrow(
      parser,
      context | Context.InAwaitContext,
      scope,
      privateScope,
      params,
      canAssign,
      1,
      start,
    );
  }

  if (destructible & DestructuringKind.SeenProto) {
    parser.report(Errors.DuplicateProto);
  }

  if (destructible & DestructuringKind.HasToDestruct) {
    parser.report(Errors.InvalidShorthandPropInit);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.CallExpression>(
    {
      type: 'CallExpression',
      callee,
      arguments: params,
      optional: false,
    },
    start,
  );
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
 * Parses regular expression literal AST node
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseRegExpLiteral(parser: Parser, context: Context): ESTree.RegExpLiteral {
  const { tokenRaw, tokenRegExp, tokenValue, tokenStart } = parser;
  nextToken(parser, context);
  parser.assignable = AssignmentKind.CannotAssign;
  const node: ESTree.RegExpLiteral = {
    type: 'Literal',
    value: tokenValue,
    regex: tokenRegExp as { pattern: string; flags: string },
  };

  if (parser.options.raw) {
    node.raw = tokenRaw;
  }

  return parser.finishNode(node, tokenStart);
}

/**
 * Parse class expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param ExportDefault
 */
function parseClassDeclaration(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  flags: HoistedClassFlags,
): ESTree.ClassDeclaration {
  // ClassDeclaration ::
  //   'class' Identifier ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   'class' ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   DecoratorList[?Yield, ?Await]opt classBindingIdentifier[?Yield, ?Await]ClassTail[?Yield, ?Await]
  //   DecoratorList[?Yield, ?Await]opt classClassTail[?Yield, ?Await]
  //

  let start;
  let decorators;
  if (parser.leadingDecorators.decorators.length) {
    if (parser.getToken() === Token.Decorator) {
      parser.report(Errors.UnexpectedToken, '@');
    }
    start = parser.leadingDecorators.start!;
    decorators = [...parser.leadingDecorators.decorators];
    parser.leadingDecorators.decorators.length = 0;
  } else {
    start = parser.tokenStart;
    decorators = parseDecorators(parser, context, privateScope);
  }

  context = (context | Context.InConstructor | Context.Strict) ^ Context.InConstructor;

  nextToken(parser, context);
  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  const { tokenValue } = parser;

  if (parser.getToken() & Token.Keyword && parser.getToken() !== Token.ExtendsKeyword) {
    if (isStrictReservedWord(parser, context, parser.getToken())) {
      parser.report(Errors.UnexpectedStrictReserved);
    }

    if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      parser.report(Errors.StrictEvalArguments);
    }

    if (scope) {
      // A named class creates a new lexical scope with a const binding of the
      // class name for the "inner name".
      scope.addBlockName(context, tokenValue, BindingKind.Class, Origin.None);

      if (flags) {
        if (flags & HoistedClassFlags.Export) {
          parser.declareUnboundVariable(tokenValue);
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
    if ((flags & HoistedClassFlags.Hoisted) === 0) parser.report(Errors.DeclNoName, 'Class');
  }
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, privateScope, 0, 0, 0);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(
    parser,
    inheritedContext,
    context,
    scope,
    privateScope,
    BindingKind.Empty,
    Origin.Declaration,
    0,
  );

  return parser.finishNode<ESTree.ClassDeclaration>(
    {
      type: 'ClassDeclaration',
      id,
      superClass,
      body,
      ...(parser.options.next ? { decorators } : null),
    },
    start,
  );
}

/**
 * Parse class expression
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseClassExpression(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inGroup: 0 | 1,
  start: Location,
): ESTree.ClassExpression {
  // ClassExpression ::
  //   'class' Identifier ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   'class' ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   DecoratorList[?Yield, ?Await]opt classBindingIdentifier[?Yield, ?Await]ClassTail[?Yield, ?Await]
  //

  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  const decorators = parseDecorators(parser, context, privateScope);

  context = (context | Context.Strict | Context.InConstructor) ^ Context.InConstructor;

  nextToken(parser, context);

  if (parser.getToken() & Token.Keyword && parser.getToken() !== Token.ExtendsKeyword) {
    if (isStrictReservedWord(parser, context, parser.getToken())) parser.report(Errors.UnexpectedStrictReserved);
    if ((parser.getToken() & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      parser.report(Errors.StrictEvalArguments);
    }

    id = parseIdentifier(parser, context);
  }

  // Second set of context masks to fix 'super' edge cases
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, privateScope, 0, inGroup, 0);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(
    parser,
    inheritedContext,
    context,
    void 0,
    privateScope,
    BindingKind.Empty,
    Origin.None,
    inGroup,
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return parser.finishNode<ESTree.ClassExpression>(
    {
      type: 'ClassExpression',
      id,
      superClass,
      body,
      ...(parser.options.next ? { decorators } : null),
    },
    start,
  );
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseDecorators(parser: Parser, context: Context, privateScope: PrivateScope | undefined): ESTree.Decorator[] {
  const list: ESTree.Decorator[] = [];

  if (parser.options.next) {
    while (parser.getToken() === Token.Decorator) {
      list.push(parseDecoratorList(parser, context, privateScope));
    }
  }

  return list;
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parseDecoratorList(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.Decorator {
  const start = parser.tokenStart;

  nextToken(parser, context | Context.AllowRegExp);
  const expressionStart = parser.tokenStart;

  let expression = parsePrimaryExpression(parser, context, privateScope, BindingKind.Empty, 0, 1, 0, 1, start);

  expression = parseMemberOrUpdateExpression(parser, context, privateScope, expression, 0, 0, expressionStart);

  return parser.finishNode<ESTree.Decorator>(
    {
      type: 'Decorator',
      expression,
    },
    start,
  );
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

function parseClassBody(
  parser: Parser,
  context: Context,
  inheritedContext: Context,
  scope: Scope | undefined,
  parentScope: PrivateScope | undefined,
  kind: BindingKind,
  origin: Origin,
  inGroup: 0 | 1,
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

  const { tokenStart } = parser;

  const privateScope = parser.createPrivateScopeIfLexical(parentScope);

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);

  const modifierFlags = Context.DisallowIn | Context.InStaticBlock;
  context = (context | modifierFlags) ^ modifierFlags;

  const hasConstr = parser.flags & Flags.HasConstructor;
  parser.flags = (parser.flags | Flags.HasConstructor) ^ Flags.HasConstructor;

  const body: (ESTree.MethodDefinition | ESTree.PropertyDefinition | ESTree.AccessorProperty | ESTree.StaticBlock)[] =
    [];

  while (parser.getToken() !== Token.RightBrace) {
    // See: https://github.com/tc39/proposal-decorators

    const decoratorStart = parser.tokenStart;
    const decorators = parseDecorators(parser, context, privateScope);

    if (decorators.length > 0 && parser.tokenValue === 'constructor') {
      parser.report(Errors.GeneratorConstructor);
    }

    if (parser.getToken() === Token.RightBrace) parser.report(Errors.TrailingDecorators);

    if (consumeOpt(parser, context, Token.Semicolon)) {
      if (decorators.length > 0) parser.report(Errors.InvalidDecoratorSemicolon);
      continue;
    }
    body.push(
      parseClassElementList(
        parser,
        context,
        scope,
        privateScope,
        inheritedContext,
        kind,
        decorators,
        0,
        inGroup,
        decorators.length > 0 ? decoratorStart : parser.tokenStart,
      ),
    );
  }
  consume(parser, origin & Origin.Declaration ? context | Context.AllowRegExp : context, Token.RightBrace);

  privateScope?.validatePrivateIdentifierRefs();

  parser.flags = (parser.flags & ~Flags.HasConstructor) | hasConstr;

  return parser.finishNode<ESTree.ClassBody>(
    {
      type: 'ClassBody',
      body,
    },
    tokenStart,
  );
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
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  inheritedContext: Context,
  type: BindingKind,
  decorators: ESTree.Decorator[],
  isStatic: 0 | 1,
  inGroup: 0 | 1,
  start: Location,
): ESTree.MethodDefinition | ESTree.PropertyDefinition | ESTree.AccessorProperty | ESTree.StaticBlock {
  let kind: PropertyKind = isStatic ? PropertyKind.Static : PropertyKind.None;
  let key: ESTree.Expression | ESTree.PrivateIdentifier | null = null;
  const token = parser.getToken();

  // Escaped reserved keyword can be used as ClassElementName which is NOT a Identifier,
  // However in ESTree definition, "Identifier" is used for ClassElementName
  if (token & (Token.IsIdentifier | Token.FutureReserved) || token === Token.EscapedReserved) {
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
            privateScope,
            inheritedContext,
            type,
            decorators,
            1,
            inGroup,
            start,
          );
        }
        break;

      case Token.AsyncKeyword:
        if (parser.getToken() !== Token.LeftParen && (parser.flags & Flags.NewLine) === 0) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, privateScope, key, kind, decorators, start);
          }

          kind |= PropertyKind.Async | (optionalBit(parser, context, Token.Multiply) ? PropertyKind.Generator : 0);
        }
        break;

      case Token.GetKeyword:
        if (parser.getToken() !== Token.LeftParen) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, privateScope, key, kind, decorators, start);
          }
          kind |= PropertyKind.Getter;
        }
        break;

      case Token.SetKeyword:
        if (parser.getToken() !== Token.LeftParen) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, privateScope, key, kind, decorators, start);
          }
          kind |= PropertyKind.Setter;
        }
        break;
      case Token.AccessorKeyword:
        if (parser.getToken() !== Token.LeftParen && (parser.flags & Flags.NewLine) === 0) {
          if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
            return parsePropertyDefinition(parser, context, privateScope, key, kind, decorators, start);
          }
          // class auto-accessor is part of stage 3 decorator spec
          if (parser.options.next) kind |= PropertyKind.Accessor;
        }
        break;
      default: // ignore
    }
  } else if (token === Token.LeftBracket) {
    kind |= PropertyKind.Computed;
    key = parseComputedPropertyName(parser, inheritedContext, privateScope, inGroup);
  } else if ((token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    key = parseLiteral(parser, context);
  } else if (token === Token.Multiply) {
    kind |= PropertyKind.Generator;
    nextToken(parser, context); // skip: '*'
  } else if (parser.getToken() === Token.PrivateField) {
    kind |= PropertyKind.PrivateField;
    key = parsePrivateIdentifier(
      parser,
      context | Context.InClass,
      privateScope,
      // #privateId without get/set prefix is both GetSet.
      PropertyKind.GetSet,
    );
  } else if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
    kind |= PropertyKind.ClassField;
  } else if (isStatic && token === Token.LeftBrace) {
    return parseStaticBlock(parser, context | Context.InClass, scope, privateScope, start);
  } else if (token === Token.EscapedFutureReserved) {
    key = parseIdentifier(parser, context);
    if (parser.getToken() !== Token.LeftParen)
      parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  } else {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }

  if (kind & (PropertyKind.Generator | PropertyKind.Async | PropertyKind.GetSet | PropertyKind.Accessor)) {
    if (
      parser.getToken() & Token.IsIdentifier ||
      // Escaped reserved keyword can be used as ClassElementName which is NOT a Identifier
      parser.getToken() === Token.EscapedReserved ||
      parser.getToken() === Token.EscapedFutureReserved
    ) {
      key = parseIdentifier(parser, context);
    } else if ((parser.getToken() & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
      key = parseLiteral(parser, context);
    } else if (parser.getToken() === Token.LeftBracket) {
      kind |= PropertyKind.Computed;
      key = parseComputedPropertyName(parser, context, privateScope, /* inGroup */ 0);
    } else if (parser.getToken() === Token.PrivateField) {
      kind |= PropertyKind.PrivateField;
      key = parsePrivateIdentifier(parser, context, privateScope, kind);
    } else parser.report(Errors.InvalidKeyToken);
  }

  if ((kind & PropertyKind.Computed) === 0) {
    if (parser.tokenValue === 'constructor') {
      if ((parser.getToken() & Token.IsClassField) === Token.IsClassField) {
        parser.report(Errors.InvalidClassFieldConstructor);
      } else if ((kind & PropertyKind.Static) === 0 && parser.getToken() === Token.LeftParen) {
        if (kind & (PropertyKind.GetSet | PropertyKind.Async | PropertyKind.ClassField | PropertyKind.Generator)) {
          parser.report(Errors.InvalidConstructor, 'accessor');
        } else if ((context & Context.SuperCall) === 0) {
          if (parser.flags & Flags.HasConstructor) parser.report(Errors.DuplicateConstructor);
          else parser.flags |= Flags.HasConstructor;
        }
      }
      kind |= PropertyKind.Constructor;
    } else if (
      // Private Methods and static private methods can be named "#prototype" (class declaration).
      // Async/Generator/GetSet can be named "prototype".
      (kind & PropertyKind.PrivateField) === 0 &&
      kind & PropertyKind.Static &&
      parser.tokenValue === 'prototype'
    ) {
      parser.report(Errors.StaticPrototype);
    }
  }

  if (kind & PropertyKind.Accessor || (parser.getToken() !== Token.LeftParen && (kind & PropertyKind.GetSet) === 0)) {
    return parsePropertyDefinition(parser, context, privateScope, key, kind, decorators, start);
  }

  const value = parseMethodDefinition(
    parser,
    context | Context.InClass,
    privateScope,
    kind,
    inGroup,
    parser.tokenStart,
  );

  return parser.finishNode<ESTree.MethodDefinition>(
    {
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
      ...(parser.options.next ? { decorators } : null),
    },
    start,
  );
}

/**
 * Parses private name
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePrivateIdentifier(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  kind: PropertyKind,
): ESTree.PrivateIdentifier {
  const { tokenStart } = parser;

  // PrivateIdentifier::
  //    #IdentifierName
  nextToken(parser, context); // skip: '#'
  const { tokenValue } = parser;
  if (tokenValue === 'constructor') parser.report(Errors.InvalidStaticClassFieldConstructor);

  if (parser.options.lexical) {
    if (!privateScope) parser.report(Errors.InvalidPrivateIdentifier, tokenValue);

    if (kind) {
      // Define a private property
      privateScope.addPrivateIdentifier(tokenValue, kind);
    } else {
      privateScope.addPrivateIdentifierRef(tokenValue);
    }
  }

  nextToken(parser, context);

  return parser.finishNode<ESTree.PrivateIdentifier>(
    {
      type: 'PrivateIdentifier',
      name: tokenValue,
    },
    tokenStart,
  );
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

function parsePropertyDefinition(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  key: ESTree.PrivateIdentifier | ESTree.Expression | null,
  state: PropertyKind,
  decorators: ESTree.Decorator[],
  start: Location,
): ESTree.PropertyDefinition | ESTree.AccessorProperty {
  //  ClassElement :
  //    MethodDefinition
  //    static MethodDefinition
  //    PropertyDefinition ;
  //  ;
  let value: ESTree.Expression | null = null;

  if (state & PropertyKind.Generator) parser.report(Errors.Unexpected);

  if (parser.getToken() === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);

    const { tokenStart } = parser;

    if (parser.getToken() === Token.Arguments) parser.report(Errors.StrictEvalArguments);

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
      Context.AllowNewTarget;

    value = parsePrimaryExpression(
      parser,
      context | Context.InClass,
      privateScope,
      BindingKind.Empty,
      0,
      1,
      0,
      1,
      tokenStart,
    );

    if (
      (parser.getToken() & Token.IsClassField) !== Token.IsClassField ||
      (parser.getToken() & Token.IsAssignOp) === Token.IsAssignOp
    ) {
      value = parseMemberOrUpdateExpression(
        parser,
        context | Context.InClass,
        privateScope,
        value as ESTree.Expression,
        0,
        0,
        tokenStart,
      );

      value = parseAssignmentExpression(parser, context | Context.InClass, privateScope, 0, 0, tokenStart, value);
    }
  }

  matchOrInsertSemicolon(parser, context);

  return parser.finishNode(
    {
      type: state & PropertyKind.Accessor ? 'AccessorProperty' : 'PropertyDefinition',
      key,
      value,
      static: (state & PropertyKind.Static) > 0,
      computed: (state & PropertyKind.Computed) > 0,
      ...(parser.options.next ? { decorators } : null),
    } as any,
    start,
  );
}

/**
 * Parses binding pattern
 *
 * @param parser Parser object
 * @param context Context masks
 * @param type Binding kind
 */
function parseBindingPattern(
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  privateScope: PrivateScope | undefined,
  type: BindingKind,
  origin: Origin,
): ESTree.BindingPattern {
  // Pattern ::
  //   Identifier
  //   ArrayLiteral
  //   ObjectLiteral

  if (
    parser.getToken() & Token.IsIdentifier ||
    ((context & Context.Strict) === 0 && parser.getToken() === Token.EscapedFutureReserved)
  )
    return parseAndClassifyIdentifier(parser, context, scope, type, origin);

  if ((parser.getToken() & Token.IsPatternStart) !== Token.IsPatternStart)
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);

  const left: any =
    parser.getToken() === Token.LeftBracket
      ? parseArrayExpressionOrPattern(parser, context, scope, privateScope, 1, 0, 1, type, origin)
      : parseObjectLiteralOrPattern(parser, context, scope, privateScope, 1, 0, 1, type, origin);

  if (parser.destructible & DestructuringKind.CannotDestruct) parser.report(Errors.InvalidBindingDestruct);

  if (parser.destructible & DestructuringKind.Assignable) parser.report(Errors.InvalidBindingDestruct);

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
  parser: Parser,
  context: Context,
  scope: Scope | undefined,
  kind: BindingKind,
  origin: Origin,
): ESTree.Identifier {
  const token = parser.getToken();

  if (context & Context.Strict) {
    if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
      parser.report(Errors.StrictEvalArguments);
    } else if ((token & Token.FutureReserved) === Token.FutureReserved || token === Token.EscapedFutureReserved) {
      parser.report(Errors.UnexpectedStrictReserved);
    }
  }

  if ((token & Token.Reserved) === Token.Reserved) {
    parser.report(Errors.KeywordNotId);
  }

  if (token === Token.YieldKeyword) {
    if (context & Context.InYieldContext) parser.report(Errors.YieldInParameter);
    if (context & Context.Module) parser.report(Errors.YieldIdentInModule);
  }

  if ((token & Token.Type) === (Token.LetKeyword & Token.Type)) {
    if (kind & (BindingKind.Let | BindingKind.Const)) parser.report(Errors.InvalidLetConstBinding);
  }
  if (token === Token.AwaitKeyword) {
    if (context & Context.InAwaitContext) parser.report(Errors.InvalidAwaitAsIdentifier);
    if (context & Context.Module) parser.report(Errors.AwaitIdentInModuleOrAsyncFunc);
  }

  const { tokenValue, tokenStart: start } = parser;
  nextToken(parser, context);

  scope?.addVarOrBlock(context, tokenValue, kind, origin);

  return parser.finishNode<ESTree.Identifier>(
    {
      type: 'Identifier',
      name: tokenValue,
    },
    start,
  );
}

/**
 * Parses either a JSX element or JSX Fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 */

function parseJSXRootElementOrFragment(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
  start: Location,
): ESTree.JSXElement | ESTree.JSXFragment {
  // "<" is pre-consumed in parseJSXChildren
  if (!inJSXChild) consume(parser, context, Token.LessThan);

  // JSX fragments
  if (parser.getToken() === Token.GreaterThan) {
    const openingFragment = parseJSXOpeningFragment(parser, start);
    const [children, closingFragment] = parseJSXChildrenAndClosingFragment(parser, context, privateScope, inJSXChild);

    return parser.finishNode<ESTree.JSXFragment>(
      {
        type: 'JSXFragment',
        openingFragment,
        children,
        closingFragment,
      },
      start,
    );
  }

  // Unexpected JSX Close
  if (parser.getToken() === Token.Divide)
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);

  let closingElement: ESTree.JSXClosingElement | null = null;
  let children: ESTree.JSXChild[] = [];

  const openingElement: ESTree.JSXOpeningElement = parseJSXOpeningElementOrSelfCloseElement(
    parser,
    context,
    privateScope,
    inJSXChild,
    start,
  );

  if (!openingElement.selfClosing) {
    [children, closingElement] = parseJSXChildrenAndClosingElement(parser, context, privateScope, inJSXChild);

    const close = isEqualTagName(closingElement.name);
    if (isEqualTagName(openingElement.name) !== close) parser.report(Errors.ExpectedJSXClosingTag, close);
  }

  return parser.finishNode<ESTree.JSXElement>(
    {
      type: 'JSXElement',
      children,
      openingElement,
      closingElement,
    },
    start,
  );
}

/**
 * Parses JSX opening fragment
 *
 * @param parser Parser object
 */
function parseJSXOpeningFragment(parser: Parser, start: Location): ESTree.JSXOpeningFragment {
  nextJSXToken(parser);
  return parser.finishNode<ESTree.JSXOpeningFragment>(
    {
      type: 'JSXOpeningFragment',
    },
    start,
  );
}

/**
 * Parses JSX Closing element
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 */
function parseJSXClosingElement(
  parser: Parser,
  context: Context,
  inJSXChild: 0 | 1,
  start: Location,
): ESTree.JSXClosingElement {
  consume(parser, context, Token.Divide);
  const name = parseJSXElementName(parser, context);

  if (parser.getToken() !== Token.GreaterThan) {
    parser.report(Errors.ExpectedToken, KeywordDescTable[Token.GreaterThan & Token.Type]);
  }

  if (inJSXChild) {
    nextJSXToken(parser);
  } else {
    nextToken(parser, context);
  }

  return parser.finishNode<ESTree.JSXClosingElement>(
    {
      type: 'JSXClosingElement',
      name,
    },
    start,
  );
}

/**
 * Parses JSX closing fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXClosingFragment(
  parser: Parser,
  context: Context,
  inJSXChild: 0 | 1,
  start: Location,
): ESTree.JSXClosingFragment {
  consume(parser, context, Token.Divide);

  if (parser.getToken() !== Token.GreaterThan) {
    parser.report(Errors.ExpectedToken, KeywordDescTable[Token.GreaterThan & Token.Type]);
  }

  if (inJSXChild) {
    nextJSXToken(parser);
  } else {
    nextToken(parser, context);
  }

  return parser.finishNode<ESTree.JSXClosingFragment>(
    {
      type: 'JSXClosingFragment',
    },
    start,
  );
}

/**
 * Parses JSX children
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXChildrenAndClosingElement(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
): [ESTree.JSXChild[], ESTree.JSXClosingElement] {
  const children: ESTree.JSXChild[] = [];
  while (true) {
    const child = parseJSXChildOrClosingElement(parser, context, privateScope, inJSXChild);
    if (child.type === 'JSXClosingElement') {
      return [children, child];
    }
    children.push(child);
  }
}

/**
 * Parses JSX children
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXChildrenAndClosingFragment(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
): [ESTree.JSXChild[], ESTree.JSXClosingFragment] {
  const children: ESTree.JSXChild[] = [];
  while (true) {
    const child = parseJSXChildOrClosingFragment(parser, context, privateScope, inJSXChild);
    if (child.type === 'JSXClosingFragment') {
      return [children, child];
    }
    children.push(child);
  }
}

/**
 * Parses a JSX child node or closing element
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXChildOrClosingElement(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
) {
  if (parser.getToken() === Token.JSXText) return parseJSXText(parser, context);
  if (parser.getToken() === Token.LeftBrace)
    return parseJSXExpressionContainer(parser, context, privateScope, /*inJSXChild*/ 1, /* isAttr */ 0);
  if (parser.getToken() === Token.LessThan) {
    const { tokenStart } = parser;
    nextToken(parser, context);
    if (parser.getToken() === Token.Divide) return parseJSXClosingElement(parser, context, inJSXChild, tokenStart);
    return parseJSXRootElementOrFragment(parser, context, privateScope, /*inJSXChild*/ 1, tokenStart);
  }

  parser.report(Errors.Unexpected);
}

/**
 * Parses a JSX child node or closing fragment
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXChildOrClosingFragment(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
) {
  if (parser.getToken() === Token.JSXText) return parseJSXText(parser, context);
  if (parser.getToken() === Token.LeftBrace)
    return parseJSXExpressionContainer(parser, context, privateScope, /*inJSXChild*/ 1, /* isAttr */ 0);
  if (parser.getToken() === Token.LessThan) {
    const { tokenStart } = parser;
    nextToken(parser, context);
    if (parser.getToken() === Token.Divide) return parseJSXClosingFragment(parser, context, inJSXChild, tokenStart);
    return parseJSXRootElementOrFragment(parser, context, privateScope, /*inJSXChild*/ 1, tokenStart);
  }

  parser.report(Errors.Unexpected);
}

/**
 * Parses JSX Text
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXText(parser: Parser, context: Context): ESTree.JSXText {
  const start = parser.tokenStart;

  nextToken(parser, context);

  const node = {
    type: 'JSXText',
    value: parser.tokenValue as string,
  } as ESTree.JSXText;

  if (parser.options.raw) {
    node.raw = parser.tokenRaw;
  }

  return parser.finishNode(node, start);
}

/**
 * Parses either a JSX element, JSX Fragment or JSX self close element
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 */
function parseJSXOpeningElementOrSelfCloseElement(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
  start: Location,
): ESTree.JSXOpeningElement {
  if (
    (parser.getToken() & Token.IsIdentifier) !== Token.IsIdentifier &&
    (parser.getToken() & Token.Keyword) !== Token.Keyword
  )
    parser.report(Errors.Unexpected);

  const tagName = parseJSXElementName(parser, context);
  const attributes = parseJSXAttributes(parser, context, privateScope);
  const selfClosing = parser.getToken() === Token.Divide;

  if (selfClosing) consume(parser, context, Token.Divide);

  if (parser.getToken() !== Token.GreaterThan) {
    parser.report(Errors.ExpectedToken, KeywordDescTable[Token.GreaterThan & Token.Type]);
  }

  if (inJSXChild || !selfClosing) {
    nextJSXToken(parser);
  } else {
    nextToken(parser, context);
  }

  return parser.finishNode<ESTree.JSXOpeningElement>(
    {
      type: 'JSXOpeningElement',
      name: tagName,
      attributes,
      selfClosing,
    },
    start,
  );
}

/**
 * Parses JSX element name
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXElementName(
  parser: Parser,
  context: Context,
): ESTree.JSXIdentifier | ESTree.JSXMemberExpression | ESTree.JSXNamespacedName {
  const { tokenStart } = parser;

  rescanJSXIdentifier(parser);

  let key: ESTree.JSXIdentifier | ESTree.JSXMemberExpression = parseJSXIdentifier(parser, context);

  // Namespace
  if (parser.getToken() === Token.Colon) return parseJSXNamespacedName(parser, context, key, tokenStart);

  // Member expression
  while (consumeOpt(parser, context, Token.Period)) {
    rescanJSXIdentifier(parser);
    key = parseJSXMemberExpression(parser, context, key, tokenStart);
  }
  return key;
}

/**
 * Parses JSX member expression
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXMemberExpression(
  parser: Parser,
  context: Context,
  object: ESTree.JSXIdentifier | ESTree.JSXMemberExpression,
  start: Location,
): ESTree.JSXMemberExpression {
  const property = parseJSXIdentifier(parser, context);
  return parser.finishNode<ESTree.JSXMemberExpression>(
    {
      type: 'JSXMemberExpression',
      object,
      property,
    },
    start,
  );
}

/**
 * Parses JSX attributes
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXAttributes(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): (ESTree.JSXAttribute | ESTree.JSXSpreadAttribute)[] {
  const attributes: (ESTree.JSXAttribute | ESTree.JSXSpreadAttribute)[] = [];
  while (
    parser.getToken() !== Token.Divide &&
    parser.getToken() !== Token.GreaterThan &&
    parser.getToken() !== Token.EOF
  ) {
    attributes.push(parseJsxAttribute(parser, context, privateScope));
  }
  return attributes;
}

/**
 * Parses JSX Spread attribute
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXSpreadAttribute(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.JSXSpreadAttribute {
  const start = parser.tokenStart;

  nextToken(parser, context); // skips: '{'
  consume(parser, context, Token.Ellipsis);
  const expression = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
  consume(parser, context, Token.RightBrace);
  return parser.finishNode<ESTree.JSXSpreadAttribute>(
    {
      type: 'JSXSpreadAttribute',
      argument: expression,
    },
    start,
  );
}

/**
 * Parses JSX attribute
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJsxAttribute(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
): ESTree.JSXAttribute | ESTree.JSXSpreadAttribute {
  const { tokenStart } = parser;

  if (parser.getToken() === Token.LeftBrace) return parseJSXSpreadAttribute(parser, context, privateScope);
  rescanJSXIdentifier(parser);
  let value: ESTree.JSXAttributeValue | null = null;
  let name: ESTree.JSXNamespacedName | ESTree.JSXIdentifier = parseJSXIdentifier(parser, context);

  if (parser.getToken() === Token.Colon) {
    name = parseJSXNamespacedName(parser, context, name, tokenStart);
  }

  // HTML empty attribute
  if (parser.getToken() === Token.Assign) {
    const token = scanJSXAttributeValue(parser, context);
    switch (token) {
      case Token.StringLiteral:
        value = parseLiteral(parser, context);
        break;
      case Token.LessThan:
        value = parseJSXRootElementOrFragment(parser, context, privateScope, /*inJSXChild*/ 0, parser.tokenStart)!;
        break;
      case Token.LeftBrace:
        value = parseJSXExpressionContainer(parser, context, privateScope, /*inJSXChild*/ 0, 1);
        break;
      default:
        parser.report(Errors.InvalidJSXAttributeValue);
    }
  }

  return parser.finishNode<ESTree.JSXAttribute>(
    {
      type: 'JSXAttribute',
      value,
      name,
    },
    tokenStart,
  );
}

/**
 * Parses JSX namespace name
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param namespace
 */

function parseJSXNamespacedName(
  parser: Parser,
  context: Context,
  namespace: ESTree.JSXIdentifier | ESTree.JSXMemberExpression,
  start: Location,
): ESTree.JSXNamespacedName {
  consume(parser, context, Token.Colon);
  const name = parseJSXIdentifier(parser, context);
  return parser.finishNode<ESTree.JSXNamespacedName>(
    {
      type: 'JSXNamespacedName',
      namespace,
      name,
    },
    start,
  );
}

/**
 * Parses JSX Expression container
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param inJSXChild
 */
function parseJSXExpressionContainer(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  inJSXChild: 0 | 1,
  isAttr: 0 | 1,
): ESTree.JSXExpressionContainer | ESTree.JSXSpreadChild {
  const { tokenStart: start } = parser;

  nextToken(parser, context | Context.AllowRegExp);
  const { tokenStart } = parser;
  if (parser.getToken() === Token.Ellipsis) return parseJSXSpreadChild(parser, context, privateScope, start);

  let expression: ESTree.Expression | ESTree.JSXEmptyExpression | null = null;

  if (parser.getToken() === Token.RightBrace) {
    // JSX attributes must only be assigned a non-empty 'expression'
    if (isAttr) parser.report(Errors.InvalidNonEmptyJSXExpr);
    expression = parseJSXEmptyExpression(parser, {
      index: parser.startIndex,
      line: parser.startLine,
      column: parser.startColumn,
    });
  } else {
    expression = parseExpression(parser, context, privateScope, 1, 0, tokenStart);
  }

  if (parser.getToken() !== Token.RightBrace) {
    parser.report(Errors.ExpectedToken, KeywordDescTable[Token.RightBrace & Token.Type]);
  }

  if (inJSXChild) {
    nextJSXToken(parser);
  } else {
    nextToken(parser, context);
  }

  return parser.finishNode<ESTree.JSXExpressionContainer>(
    {
      type: 'JSXExpressionContainer',
      expression,
    },
    start,
  );
}

/**
 * Parses JSX spread child
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXSpreadChild(
  parser: Parser,
  context: Context,
  privateScope: PrivateScope | undefined,
  start: Location,
): ESTree.JSXSpreadChild {
  consume(parser, context, Token.Ellipsis);
  const expression = parseExpression(parser, context, privateScope, 1, 0, parser.tokenStart);
  consume(parser, context, Token.RightBrace);
  return parser.finishNode<ESTree.JSXSpreadChild>(
    {
      type: 'JSXSpreadChild',
      expression,
    },
    start,
  );
}

/**
 * Parses JSX empty expression
 *
 * @param parser Parser object
 */
function parseJSXEmptyExpression(parser: Parser, start: Location): ESTree.JSXEmptyExpression {
  return parser.finishNode<ESTree.JSXEmptyExpression>(
    {
      type: 'JSXEmptyExpression',
    },
    start,
    // Since " }" is treated as single token, we have to artificially break
    // it into " " and "}".
    parser.tokenStart,
  );
}

/**
 * Parses JSX Identifier
 *
 * @param parser Parser object
 * @param context  Context masks
 */
function parseJSXIdentifier(parser: Parser, context: Context): ESTree.JSXIdentifier {
  const start = parser.tokenStart;

  if (!(parser.getToken() & Token.IsIdentifier)) {
    parser.report(Errors.UnexpectedToken, KeywordDescTable[parser.getToken() & Token.Type]);
  }
  const { tokenValue } = parser;
  nextToken(parser, context);

  return parser.finishNode<ESTree.JSXIdentifier>(
    {
      type: 'JSXIdentifier',
      name: tokenValue,
    },
    start,
  );
}
