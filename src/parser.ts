import { nextToken, skipHashBang } from './lexer';
import { Token, KeywordDescTable } from './token';
import * as ESTree from './estree';
import { report, reportAt, Errors } from './errors';
import { scanTemplateTail } from './lexer/template';
import {
  Context,
  ParserState,
  PropertyKind,
  BindingOrigin,
  consumeOpt,
  consume,
  Flags,
  reinterpretToPattern,
  DestructuringKind,
  AssignmentKind,
  FunctionStatement,
  BindingType,
  validateBindingIdentifier,
  isStrictReservedWord,
  optionalBit,
  consumeSemicolon,
  isPropertyWithPrivateFieldKey,
  isValidLabel,
  validateAndDeclareLabel,
  finishNode
} from './common';

/**
 * Create a new parser instance
 */
export function create(source: string): ParserState {
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
    startIndex: 0,

    /**
     * The end of the source code
     */
    end: source.length,

    /**
     * Start position of text of current token
     */
    tokenIndex: 0,

    /**
     * Holds the scanned token value
     */
    tokenValue: '',

    /**
     * The token to consume
     */
    token: Token.EOF,

    /**
     * Holds the raw text that have been scanned by the lexer
     */
    tokenRaw: '',

    /**
     * Holds the regExp info text that have been collected by the lexer
     */
    tokenRegExp: undefined,

    /**
     * The code point at the current index
     */
    nextCP: source.charCodeAt(0),

    /**
     * Assignable state
     */
    assignable: 1,

    /**
     * Destructuring state
     */
    destructible: 0
  };
}

/**
 * The parser options.
 */
export interface Options {
  // The flag to allow module code
  module?: boolean;
  // The flag to enable stage 3 support (ESNext)
  next?: boolean;
  // The flag to enable start and end offsets to each node
  ranges?: boolean;
  // Enable web compability
  webCompat?: boolean;
  // The flag to enable line/column location information to each node
  loc?: boolean;
  // The flag to attach raw property to each literal and identifier node
  raw?: boolean;
  // Enabled directives
  directives?: boolean;
  // The flag to allow return in the global scope
  globalReturn?: boolean;
  // The flag to allow await in the global scope
  globalAwait?: boolean;
  // The flag to enable implied strict mode
  impliedStrict?: boolean;
  // Enable non-standard parenthesized expression node
  parenthesizedExpr?: boolean;
}

/**
 * Consumes a sequence of tokens and produces an unbound syntax tree
 */
export function parseSource(source: string, options: Options | void, context: Context): ESTree.Program {
  if (options != null) {
    if (options.module) context |= Context.Module;
    if (options.next) context |= Context.OptionsNext;
    if (options.loc) context |= Context.OptionsLoc;
    if (options.ranges) context |= Context.OptionsRanges;
    if (options.webCompat) context |= Context.OptionsWebCompat;
    if (options.directives) context |= Context.OptionsDirectives | Context.OptionsRaw;
    if (options.globalReturn) context |= Context.OptionsGlobalReturn;
    if (options.globalAwait) context |= Context.OptionsGlobalAwait;
    if (options.raw) context |= Context.OptionsRaw;
    if (options.parenthesizedExpr) context |= Context.OptionsParenthesized;
    if (options.impliedStrict) context |= Context.Strict;
  }

  // Initialize parser state
  const parser = create(source);

  // See: https://github.com/tc39/proposal-hashbang
  skipHashBang(parser);

  context = context | Context.InGlobal | Context.TopLevel;

  const node: ESTree.Program =
    context & Context.Module
      ? {
          type: 'Program',
          sourceType: 'module',
          body: parseparseModuleItemList(parser, context)
        }
      : {
          type: 'Program',
          sourceType: 'script',
          body: parseStatementList(parser, context)
        };

  if (context & Context.OptionsRanges) {
    node.start = 0;
    node.end = source.length;
  }

  return node;
}

/**
 * Parses statement list items
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseStatementList(parser: ParserState, context: Context): ESTree.Statement[] {
  // StatementList ::
  //   (StatementListItem)* <end_token>

  nextToken(parser, context | Context.AllowRegExp);

  const statements: ESTree.Statement[] = [];

  while (parser.token === Token.StringLiteral) {
    // "use strict" must be the exact literal without escape sequences or line continuation.
    const { index, tokenIndex, tokenValue, token } = parser;
    let expr = parseLiteral(parser, context, parser.tokenIndex);
    if (index - tokenIndex < 13 && tokenValue === 'use strict') {
      if ((parser.token & Token.IsAutoSemicolon) === Token.IsAutoSemicolon || parser.flags & Flags.NewLine) {
        context |= Context.Strict;
      }
    }
    statements.push(parseDirective(parser, context, expr, token, tokenIndex));
  }

  while (parser.token !== Token.EOF) {
    statements.push(parseStatementListItem(parser, context, /* labels */ {}, parser.tokenIndex) as ESTree.Statement);
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
export function parseparseModuleItemList(
  parser: ParserState,
  context: Context
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
      // "use strict" must be the exact literal without escape sequences or line continuation.
      const { index, tokenIndex, tokenValue, token } = parser;
      let expr = parseLiteral(parser, context, parser.tokenIndex);
      if (index - tokenIndex < 13 && tokenValue === 'use strict') {
        if ((parser.token & Token.IsAutoSemicolon) === Token.IsAutoSemicolon || parser.flags & Flags.NewLine) {
          context |= Context.Strict;
        }
      }
      statements.push(parseDirective(parser, context, expr, token, tokenIndex));
    }
  }

  while (parser.token !== Token.EOF) {
    statements.push(parseModuleItem(parser, context, parser.tokenIndex) as ESTree.Statement);
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
 */
export function parseModuleItem(parser: ParserState, context: Context, start: number): any {
  // ecma262/#prod-ModuleItem
  // ModuleItem :
  //    ImportDeclaration
  //    ExportDeclaration
  //    StatementListItem
  const next = parser.token;

  if (next === Token.ExportKeyword) {
    return parseExportDeclaration(parser, context, start);
  }

  if (next === Token.ImportKeyword) {
    return parseImportDeclaration(parser, context, start);
  }

  return parseStatementListItem(parser, context, /* labels */ {}, start);
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
  labels: any,
  start: number
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
      return parseFunctionDeclaration(parser, context, 1, 0, 0, start);
    // @decorator
    case Token.Decorator:
      if (context & Context.Module)
        return parseDecorators(parser, context | Context.InDecoratorContext) as ESTree.Decorator[];
    // ClassDeclaration[?Yield, ~Default]
    case Token.ClassKeyword:
      return parseClassDeclaration(parser, context, /* isExportDefault */ 0, start);
    // LexicalDeclaration[In, ?Yield]
    // LetOrConst BindingList[?In, ?Yield]
    case Token.ConstKeyword:
      return parseVariableStatement(parser, context, BindingType.Const, BindingOrigin.Statement, start);
    case Token.LetKeyword:
      return parseLetIdentOrVarDeclarationStatement(parser, context, start);
    // ExportDeclaration (only inside modules)
    case Token.ExportKeyword:
      report(parser, Errors.InvalidImportExportSloppy, 'export');
    // ImportDeclaration (only inside modules)
    case Token.ImportKeyword:
      nextToken(parser, context);
      switch (parser.token) {
        case Token.LeftParen:
          return parseImportCallDeclaration(parser, context, start);
        default:
          report(parser, Errors.InvalidImportExportSloppy, 'import');
      }
    //   async [no LineTerminator here] AsyncArrowBindingIdentifier ...
    //   async [no LineTerminator here] ArrowFormalParameters ...
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, labels, /* allowFuncDecl */ 1, start);
    default:
      return parseStatement(parser, context & ~Context.TopLevel, labels, FunctionStatement.Allow, start);
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
  labels: any,
  allowFuncDecl: FunctionStatement,
  start: number
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
    // BlockStatement[?Yield, ?Return]
    case Token.LeftBrace:
      return parseBlock(parser, context, labels, start) as ESTree.Statement;
    // VariableStatement[?Yield]
    case Token.VarKeyword:
      return parseVariableStatement(parser, context, BindingType.Variable, BindingOrigin.Statement, start);
    // [+Return] ReturnStatement[?Yield]
    case Token.ReturnKeyword:
      return parseReturnStatement(parser, context, start);
    case Token.IfKeyword:
      return parseIfStatement(parser, context, labels, start);
    // BreakableStatement[Yield, Return]:
    //   IterationStatement[?Yield, ?Return]
    //   SwitchStatement[?Yield, ?Return]
    case Token.DoKeyword:
      return parseDoWhileStatement(parser, context, labels, start);
    case Token.WhileKeyword:
      return parseWhileStatement(parser, context, labels, start);
    case Token.ForKeyword:
      return parseForStatement(parser, context, labels, start);
    case Token.SwitchKeyword:
      return parseSwitchStatement(parser, context, labels, start);
    case Token.Semicolon:
      // EmptyStatement
      return parseEmptyStatement(parser, context, start);
    // ThrowStatement[?Yield]
    case Token.ThrowKeyword:
      return parseThrowStatement(parser, context, start);
    case Token.BreakKeyword:
      // BreakStatement[?Yield]
      return parseBreakStatement(parser, context, labels, start);
    // ContinueStatement[?Yield]
    case Token.ContinueKeyword:
      return parseContinueStatement(parser, context, labels, start);
    // TryStatement[?Yield, ?Return]
    case Token.TryKeyword:
      return parseTryStatement(parser, context, labels, start);
    // WithStatement[?Yield, ?Return]
    case Token.WithKeyword:
      return parseWithStatement(parser, context, labels, start);
    case Token.DebuggerKeyword:
      // DebuggerStatement
      return parseDebuggerStatement(parser, context, start);
    case Token.AsyncKeyword:
      return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, labels, 0, start);
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

    case Token.YieldKeyword:
      const { token, tokenValue } = parser;
      let expr = parseYieldExpressionOrIdentifier(parser, context, start);
      if (parser.token === Token.Comma) expr = parseSequenceExpression(parser, context, start, expr);
      if (context & Context.InYieldContext) return parseExpressionStatement(parser, context, expr, start);

      if (parser.token === Token.Colon) {
        return parseLabelledStatement(
          parser,
          context,
          labels,
          tokenValue,
          expr as ESTree.Identifier,
          token,
          allowFuncDecl,
          start
        );
      }
      expr = parseMemberOrUpdateExpression(parser, context, expr as ESTree.Expression, 0, 0, 0, start);

      expr = parseAssignmentExpression(parser, context, 0, start, expr);

      return parseExpressionStatement(parser, context, expr, start);

    default:
      return parseExpressionOrLabelledStatement(parser, context, labels, allowFuncDecl, start);
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
  labels: any,
  allowFuncDecl: FunctionStatement,
  start: number
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
      expr = parseIdentifier(parser, context, start);
      if (context & Context.Strict) report(parser, Errors.UnexpectedLetStrictReserved);
      if (parser.token === Token.Colon)
        return parseLabelledStatement(parser, context, labels, tokenValue, expr, token, allowFuncDecl, start);
      // "let" followed by either "[", "{" or an identifier means a lexical
      // declaration, which should not appear here.
      // However, ASI may insert a line break before an identifier or a brace.
      if (parser.token === Token.LeftBracket && parser.flags & Flags.NewLine) {
        report(parser, Errors.RestricedLetProduction);
      }
      break;
    default:
      expr = parsePrimaryExpressionExtended(parser, context, BindingType.None, 0, 1, 0, parser.tokenIndex);
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
      labels,
      tokenValue,
      expr as ESTree.Identifier,
      token,
      allowFuncDecl,
      start
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
  expr = parseMemberOrUpdateExpression(parser, context, expr, /* inNewExpression */ 0, 0, 0, start);

  /** parseAssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */

  expr = parseAssignmentExpression(parser, context, 0, start, expr as
    | ESTree.AssignmentExpression
    | ESTree.Identifier
    | ESTree.Literal
    | ESTree.BinaryExpression
    | ESTree.LogicalExpression
    | ESTree.ConditionalExpression);

  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.token === Token.Comma) {
    expr = parseSequenceExpression(parser, context, start, expr);
  }

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */

  return parseExpressionStatement(parser, context, expr, start);
}

/**
 * Parses block statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-BlockStatement)
 * @see [Link](https://tc39.github.io/ecma262/#prod-Block)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBlock(parser: ParserState, context: Context, labels: any, start: number): ESTree.BlockStatement {
  // Block ::
  //   '{' StatementList '}'
  const body: ESTree.Statement[] = [];
  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);
  while (parser.token !== Token.RightBrace) {
    body.push(parseStatementListItem(parser, context, { '€': labels }, parser.tokenIndex) as any);
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);

  return finishNode(parser, context, start, {
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
 */
export function parseReturnStatement(parser: ParserState, context: Context, start: number): ESTree.ReturnStatement {
  // ReturnStatement ::
  //   'return' [no line terminator] Expression? ';'
  if ((context & Context.OptionsGlobalReturn) === 0 && context & Context.InGlobal) report(parser, Errors.IllegalReturn);

  nextToken(parser, context | Context.AllowRegExp);

  const argument =
    parser.flags & Flags.NewLine || parser.token & Token.IsAutoSemicolon
      ? null
      : parseExpressions(parser, context, /* assignable*/ 1, parser.tokenIndex);

  consumeSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, {
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
 * @param context Context masks
 */
export function parseExpressionStatement(
  parser: ParserState,
  context: Context,
  expression: ESTree.Expression,
  start: number
): ESTree.ExpressionStatement {
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 *
 */
export function parseLabelledStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  label: string,
  expr: ESTree.Identifier,
  token: Token,
  allowFuncDecl: 0 | 1,
  start: number
): ESTree.LabeledStatement {
  // LabelledStatement ::
  //   Expression ';'
  //   Identifier ':' Statement

  if ((token & Token.Reserved) === Token.Reserved) report(parser, Errors.UnexpectedStrictReserved);

  validateAndDeclareLabel(parser, labels, label);

  nextToken(parser, context | Context.AllowRegExp);

  const body =
    allowFuncDecl &&
    (context & Context.Strict) === 0 &&
    context & Context.OptionsWebCompat &&
    // In sloppy mode, Annex B.3.2 allows labelled function declarations.
    // Otherwise it's a parse error.
    parser.token === Token.FunctionKeyword
      ? parseFunctionDeclaration(parser, context, 0, 0, 0, parser.tokenIndex)
      : parseStatement(parser, context & ~Context.TopLevel, labels, allowFuncDecl, parser.tokenIndex);

  return finishNode(parser, context, start, {
    type: 'LabeledStatement',
    label: expr,
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
 */

export function parseAsyncArrowOrAsyncFunctionDeclaration(
  parser: ParserState,
  context: Context,
  labels: any,
  allowFuncDecl: FunctionStatement,
  start: number
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

  let expr: ESTree.Expression = parseIdentifier(parser, context, start);

  if (parser.token === Token.Colon) {
    return parseLabelledStatement(parser, context, labels, tokenValue, expr, token, /* allowFuncDecl */ 1, start);
  }

  const asyncNewLine = parser.flags & Flags.NewLine;

  if (!asyncNewLine) {
    // async function ...
    if (parser.token === Token.FunctionKeyword) {
      if (!allowFuncDecl) report(parser, Errors.AsyncFunctionInSingleStatementContext);

      return parseFunctionDeclaration(parser, context, 1, 0, 1, start);
    }

    // async Identifier => ...
    if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
      if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidAsyncParamList);
      if (parser.token === Token.AwaitKeyword) report(parser, Errors.AwaitInParameter);
      if (context & (Context.Strict | Context.InYieldContext) && parser.token === Token.YieldKeyword) {
        report(parser, Errors.YieldInParameter);
      }

      if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
        parser.flags |= Flags.SimpleParameterList;

      // This has to be an async arrow, so let the caller throw on missing arrows etc
      expr = parseArrowFunctionExpression(
        parser,
        context,
        [parseIdentifier(parser, context, parser.tokenIndex)],
        1,
        start
      );

      if (parser.token === Token.Comma) expr = parseSequenceExpression(parser, context, start, expr);

      return parseExpressionStatement(parser, context, expr, start);
    }
  }

  /** ArrowFunction[In, Yield, Await]:
   *    ArrowParameters[?Yield, ?Await][no LineTerminator here]=>ConciseBody[?In]
   */
  if (parser.token === Token.LeftParen) {
    expr = parseAsyncArrowOrCallExpression(parser, context & ~Context.DisallowIn, expr, 1, asyncNewLine, start);
  } else {
    if (parser.token === Token.Arrow) {
      expr = parseArrowFunctionExpression(parser, context, [expr], /* isAsync */ 0, start);
    }

    parser.assignable = AssignmentKind.IsAssignable;
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

  expr = parseMemberOrUpdateExpression(parser, context, expr, /* inNewExpression */ 0, 0, 0, start);
  /** Sequence expression
   *
   * Note: The comma operator leads to a sequence expression which is not equivalent
   * to the ES Expression, but it's part of the ESTree specs:
   *
   * https://github.com/estree/estree/blob/master/es5.md#sequenceexpression
   *
   */
  if (parser.token === Token.Comma) expr = parseSequenceExpression(parser, context, start, expr);

  /** parseAssignmentExpression
   *
   * https://tc39.github.io/ecma262/#prod-AssignmentExpression
   *
   * AssignmentExpression :
   *   1. ConditionalExpression
   *   2. LeftHandSideExpression = AssignmentExpression
   *
   */
  expr = parseAssignmentExpression(parser, context, 0, start, expr as
    | ESTree.Identifier
    | ESTree.Literal
    | ESTree.BinaryExpression
    | ESTree.AssignmentExpression
    | ESTree.LogicalExpression
    | ESTree.ConditionalExpression);

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
  parser: ParserState,
  context: Context,
  expression: any,
  token: Token,
  start: number
): ESTree.ExpressionStatement {
  const { tokenRaw } = parser;

  if (token !== Token.Semicolon) {
    parser.assignable = AssignmentKind.CannotAssign;

    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, 0, start);

    if (parser.token !== Token.Semicolon) {
      expression = parseAssignmentExpression(parser, context, 0, start, expression);

      if (parser.token === Token.Comma) {
        expression = parseSequenceExpression(parser, context, start, expression);
      }
    }

    consumeSemicolon(parser, context | Context.AllowRegExp);
  }

  return context & Context.OptionsDirectives
    ? finishNode(parser, context, start, {
        type: 'ExpressionStatement',
        expression,
        directive: tokenRaw.slice(1, -1)
      })
    : finishNode(parser, context, start, {
        type: 'ExpressionStatement',
        expression
      });
}

export function parseEmptyStatement(parser: ParserState, context: Context, start: number): ESTree.EmptyStatement {
  nextToken(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 */
export function parseThrowStatement(parser: ParserState, context: Context, start: number): ESTree.ThrowStatement {
  // ThrowStatement ::
  //   'throw' Expression ';'
  nextToken(parser, context | Context.AllowRegExp);
  if (parser.flags & Flags.NewLine) report(parser, Errors.NewlineAfterThrow);
  const argument: ESTree.Expression = parseExpressions(parser, context, /* assignable */ 1, parser.tokenIndex);
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 */
export function parseIfStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.IfStatement {
  // IfStatement ::
  //   'if' '(' Expression ')' Statement ('else' Statement)?
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  parser.assignable = AssignmentKind.IsAssignable;
  const test = parseExpressions(parser, context, 1, parser.tokenIndex);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const consequent = parseConsequentOrAlternate(parser, context, labels, parser.tokenIndex);
  let alternate: ESTree.Statement | null = null;
  if (parser.token === Token.ElseKeyword) {
    nextToken(parser, context | Context.AllowRegExp);
    alternate = parseConsequentOrAlternate(parser, context, labels, parser.tokenIndex);
  }

  return finishNode(parser, context, start, {
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
 */
export function parseConsequentOrAlternate(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.Statement | ESTree.FunctionDeclaration {
  return context & Context.Strict ||
    // Disallow if web compability is off
    (context & Context.OptionsWebCompat) === 0 ||
    parser.token !== Token.FunctionKeyword
    ? parseStatement(
        parser,
        (context | Context.TopLevel) ^ Context.TopLevel,
        { '€': labels },
        FunctionStatement.Disallow,
        parser.tokenIndex
      )
    : parseFunctionDeclaration(parser, context, /* allowGen */ 0, /* isExportDefault */ 0, /* isAsync */ 0, start);
}

/**
 * Parses switch statement
 *
 * @see [Link](https://tc39.github.io/ecma262/#prod-SwitchStatement)
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseSwitchStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.SwitchStatement {
  // SwitchStatement ::
  //   'switch' '(' Expression ')' '{' CaseClause* '}'
  // CaseClause ::
  //   'case' Expression ':' StatementList
  //   'default' ':' StatementList
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const discriminant = parseExpressions(parser, context, /* assignable */ 1, parser.tokenIndex);
  consume(parser, context, Token.RightParen);
  consume(parser, context, Token.LeftBrace);
  const cases: ESTree.SwitchCase[] = [];
  let seenDefault: 0 | 1 = 0;
  while (parser.token !== Token.RightBrace) {
    const { tokenIndex } = parser;
    let test: ESTree.Expression | null = null;
    const consequent: ESTree.Statement[] = [];
    if (consumeOpt(parser, context | Context.AllowRegExp, Token.CaseKeyword)) {
      test = parseExpressions(parser, context & ~Context.DisallowIn, 1, parser.tokenIndex);
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
        {
          '€': labels
        },
        parser.tokenIndex
      ) as ESTree.Statement);
    }

    cases.push(
      finishNode(parser, context, tokenIndex, {
        type: 'SwitchCase',
        test,
        consequent
      })
    );
  }

  consume(parser, context | Context.AllowRegExp, Token.RightBrace);
  return finishNode(parser, context, start, {
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
 */
export function parseWhileStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.WhileStatement {
  // WhileStatement ::
  //   'while' '(' Expression ')' Statement
  nextToken(parser, context);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, /* assignable */ 1, parser.tokenIndex);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseStatement(
    parser,
    ((context | Context.TopLevel | Context.DisallowIn) ^ (Context.TopLevel | Context.DisallowIn)) | Context.InIteration,
    { loop: 1, '€': labels },
    FunctionStatement.Disallow,
    parser.tokenIndex
  );
  return finishNode(parser, context, start, {
    type: 'WhileStatement',
    test,
    body
  });
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
  labels: any,
  start: number
): ESTree.ContinueStatement {
  // ContinueStatement ::
  //   'continue' Identifier? ';'
  if ((context & Context.InIteration) === 0) report(parser, Errors.IllegalContinue);
  nextToken(parser, context);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) === 0 && parser.token & Token.IsIdentifier) {
    const { tokenValue, tokenIndex } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp, tokenIndex);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 1))
      report(parser, Errors.UnknownLabel, tokenValue);
  }
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 */
export function parseBreakStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.BreakStatement {
  // BreakStatement ::
  //   'break' Identifier? ';'
  nextToken(parser, context | Context.AllowRegExp);
  let label: ESTree.Identifier | undefined | null = null;
  if ((parser.flags & Flags.NewLine) === 0 && parser.token & Token.IsIdentifier) {
    const { tokenValue, tokenIndex } = parser;
    label = parseIdentifier(parser, context | Context.AllowRegExp, tokenIndex);
    if (!isValidLabel(parser, labels, tokenValue, /* requireIterationStatement */ 0))
      report(parser, Errors.UnknownLabel, tokenValue);
  } else if ((context & Context.InSwitchOrIteration) === 0) {
    report(parser, Errors.IllegalBreak);
  }

  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 */
export function parseWithStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.WithStatement {
  // WithStatement ::
  //   'with' '(' Expression ')' Statement

  nextToken(parser, context);

  if (context & Context.Strict) report(parser, Errors.StrictWith);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const object = parseExpressions(parser, context, /* assignable*/ 1, parser.tokenIndex);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  const body = parseStatement(
    parser,
    (context | Context.TopLevel) ^ Context.TopLevel,
    labels,
    FunctionStatement.Disallow,
    parser.tokenIndex
  );
  return finishNode(parser, context, start, {
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
 */
export function parseDebuggerStatement(parser: ParserState, context: Context, start: number): ESTree.DebuggerStatement {
  nextToken(parser, context | Context.AllowRegExp);
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 */
export function parseTryStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
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

  const block = parseBlock(parser, context, { '€': labels }, parser.tokenIndex);
  const { tokenIndex } = parser;
  const handler = consumeOpt(parser, context | Context.AllowRegExp, Token.CatchKeyword)
    ? parseCatchBlock(parser, context, labels, tokenIndex)
    : null;
  const finalizer = consumeOpt(parser, context | Context.AllowRegExp, Token.FinallyKeyword)
    ? parseBlock(parser, context, { '€': labels }, tokenIndex)
    : null;

  if (!handler && !finalizer) {
    report(parser, Errors.NoCatchOrFinally);
  }

  return finishNode(parser, context, start, {
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
 */
export function parseCatchBlock(parser: ParserState, context: Context, labels: any, start: number): ESTree.CatchClause {
  let param: any = null;
  if (consumeOpt(parser, context, Token.LeftParen)) {
    param = parseBindingPattern(parser, context, BindingType.ArgumentList, parser.tokenIndex);
    if (parser.token === Token.Comma) {
      report(parser, Errors.InvalidCatchParams);
    } else if (parser.token === Token.Assign) {
      report(parser, Errors.InvalidCatchParamDefault);
    }
    consume(parser, context | Context.AllowRegExp, Token.RightParen);
  }

  return finishNode(parser, context, start, {
    type: 'CatchClause',
    param,
    body: parseBlock(parser, context, { '€': labels }, parser.tokenIndex)
  });
}

/**
 * Parses do while statement
 *
 * @param parser Parser object
 * @param context Context masks
 * @param scope Scope instance
 */
export function parseDoWhileStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.DoWhileStatement {
  // DoStatement ::
  //   'do Statement while ( Expression ) ;'

  nextToken(parser, context | Context.AllowRegExp);
  const body = parseStatement(
    parser,
    ((context | Context.TopLevel) ^ Context.TopLevel) | Context.InIteration,
    { loop: 1, '€': labels },
    FunctionStatement.Disallow,
    parser.tokenIndex
  );
  consume(parser, context, Token.WhileKeyword);
  consume(parser, context | Context.AllowRegExp, Token.LeftParen);
  const test = parseExpressions(parser, context, /* assignable */ 1, parser.tokenIndex);
  consume(parser, context | Context.AllowRegExp, Token.RightParen);
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
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
 * @param type Binding type
 */
export function parseLetIdentOrVarDeclarationStatement(
  parser: ParserState,
  context: Context,
  start: number
): ESTree.VariableDeclaration | ESTree.LabeledStatement | ESTree.ExpressionStatement {
  const { token, tokenValue } = parser;
  let expr: ESTree.Identifier | ESTree.Expression = parseIdentifier(parser, context, start);
  // If the next token is an identifier, `[`, or `{`, this is not
  // a `let` declaration, and we parse it as an identifier.
  if ((parser.token & (Token.IsIdentifier | Token.IsPatternStart)) === 0) {
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
      return parseLabelledStatement(
        parser,
        context,
        /* labels */ {},
        tokenValue,
        expr,
        token,
        FunctionStatement.Disallow,
        start
      );
    }

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

    expr = parseMemberOrUpdateExpression(parser, context, expr, /* inNewExpression */ 0, 0, 0, start);

    /**
     * AssignmentExpression :
     *   1. ConditionalExpression
     *   2. LeftHandSideExpression = AssignmentExpression
     *
     */
    expr = parseAssignmentExpression(parser, context, 0, start, expr as
      | ESTree.AssignmentExpression
      | ESTree.Identifier
      | ESTree.Literal
      | ESTree.BinaryExpression
      | ESTree.LogicalExpression
      | ESTree.ConditionalExpression);

    /** Sequence expression
     */
    if (parser.token === Token.Comma) {
      expr = parseSequenceExpression(parser, context, start, expr);
    }

    /**
     * ExpressionStatement[Yield, Await]:
     *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
     */
    return parseExpressionStatement(parser, context, expr, start);
  }

  /* VariableDeclarations ::
   *  ('let') (Identifier ('=' AssignmentExpression)?)+[',']
   */
  const declarations = parseVariableDeclarationList(parser, context, BindingType.Let, BindingOrigin.Statement);
  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
    type: 'VariableDeclaration',
    kind: 'let',
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
 * @param type Binding type
 * @param origin Binding origin
 */
export function parseVariableStatement(
  parser: ParserState,
  context: Context,
  type: BindingType,
  origin: BindingOrigin,
  start: number
): ESTree.VariableDeclaration {
  // VariableDeclarations ::
  //  ('var' | 'const') (Identifier ('=' AssignmentExpression)?)+[',']
  //
  const kind = KeywordDescTable[parser.token & Token.Type] as 'var' | 'const';
  nextToken(parser, context);
  const declarations = parseVariableDeclarationList(parser, context, type, origin);

  consumeSemicolon(parser, context | Context.AllowRegExp);
  return finishNode(parser, context, start, {
    type: 'VariableDeclaration',
    kind,
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
 * @param type Binding type
 * @param origin Binding origin
 */
export function parseVariableDeclarationList(
  parser: ParserState,
  context: Context,
  type: BindingType,
  origin: BindingOrigin
): ESTree.VariableDeclarator[] {
  let bindingCount = 1;
  const list: ESTree.VariableDeclarator[] = [parseVariableDeclaration(parser, context, type, origin)];
  while (consumeOpt(parser, context, Token.Comma)) {
    bindingCount++;
    list.push(parseVariableDeclaration(parser, context, type, origin));
  }

  if (bindingCount > 1 && origin & BindingOrigin.ForStatement && parser.token & Token.IsInOrOf) {
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
 */
function parseVariableDeclaration(
  parser: ParserState,
  context: Context,
  type: BindingType,
  origin: BindingOrigin
): ESTree.VariableDeclarator {
  // VariableDeclaration :
  //   BindingIdentifier Initializeropt
  //   BindingPattern Initializer
  //
  // VariableDeclarationNoIn :
  //   BindingIdentifier InitializerNoInopt
  //   BindingPattern InitializerNoIn

  const { token, index, line, tokenIndex } = parser;

  let init: ESTree.Expression | null = null;

  const id: ESTree.Pattern | ESTree.Identifier = parseBindingPattern(parser, context, type, tokenIndex);

  if (parser.token === Token.Assign) {
    nextToken(parser, context | Context.AllowRegExp);
    init = parseExpression(parser, context, /* assignable */ 1, 0, parser.tokenIndex);
    if (origin & BindingOrigin.ForStatement || (token & Token.IsPatternStart) === 0) {
      if (
        parser.token === Token.OfKeyword ||
        (parser.token === Token.InKeyword &&
          (token & Token.IsPatternStart ||
            (type & BindingType.Variable) === 0 ||
            (context & Context.OptionsWebCompat) === 0 ||
            context & Context.Strict))
      ) {
        report(parser, Errors.ForInOfLoopInitializer, parser.token === Token.OfKeyword ? 'of' : 'in');
      }
    }
  } else if (
    // Normal const declarations, and const declarations in for(;;) heads, must be initialized.

    (type & BindingType.Const || (token & Token.IsPatternStart) > 0) &&
    (parser.token & Token.IsInOrOf) !== Token.IsInOrOf
  ) {
    reportAt(
      parser,
      index,
      line,
      index,
      Errors.DeclarationMissingInitializer,
      type & BindingType.Const ? 'const' : 'destructuring'
    );
  }

  return finishNode(parser, context, tokenIndex, {
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
 */
export function parseForStatement(
  parser: ParserState,
  context: Context,
  labels: any,
  start: number
): ESTree.ForStatement | ESTree.ForInStatement | ESTree.ForOfStatement {
  nextToken(parser, context);

  const forAwait = (context & Context.InAwaitContext) > 0 && consumeOpt(parser, context, Token.AwaitKeyword);

  consume(parser, context | Context.AllowRegExp, Token.LeftParen);

  let test: ESTree.Expression | null = null;
  let update: ESTree.Expression | null = null;
  let destructible: AssignmentKind | DestructuringKind = 0;
  let init = null;
  let isVarDecl: number = parser.token & Token.VarDecl;
  let right;

  const { token, tokenIndex } = parser;

  if (isVarDecl) {
    if (token === Token.LetKeyword) {
      let varStart = parser.tokenIndex;
      init = parseIdentifier(parser, context, tokenIndex);
      if (parser.token & (Token.IsIdentifier | Token.IsPatternStart)) {
        if (parser.token === Token.InKeyword) {
          if (context & Context.Strict) report(parser, Errors.DisallowedLetInStrict);
        } else {
          init = finishNode(parser, context, varStart, {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: parseVariableDeclarationList(
              parser,
              context | Context.DisallowIn,
              BindingType.Let,
              BindingOrigin.ForStatement
            )
          });
        }
        parser.assignable = AssignmentKind.IsAssignable;
      } else if (context & Context.Strict) {
        report(parser, Errors.DisallowedLetInStrict);
      } else {
        isVarDecl = 0;

        init = parseMemberOrUpdateExpression(parser, context, init, /* inNewExpression */ 0, 0, 0, varStart);

        // Note: `for of` only allows LeftHandSideExpressions which do not start with `let`, and no other production matches
        if (parser.token === Token.OfKeyword) report(parser, Errors.ForOfLet);
      }
    } else {
      // 'var', 'const'
      let varStart = parser.tokenIndex;

      nextToken(parser, context);

      init = finishNode(parser, context, varStart, {
        type: 'VariableDeclaration',
        kind: KeywordDescTable[token & Token.Type] as 'var' | 'const',
        declarations: parseVariableDeclarationList(
          parser,
          context | Context.DisallowIn,
          token === Token.VarKeyword ? BindingType.Variable : BindingType.Const,
          BindingOrigin.ForStatement
        )
      });
      parser.assignable = AssignmentKind.IsAssignable;
    }
  } else if (token === Token.Semicolon) {
    if (forAwait) report(parser, Errors.InvalidForAwait);
  } else if ((token & Token.IsPatternStart) === Token.IsPatternStart) {
    init =
      token === Token.LeftBrace
        ? parseObjectLiteralOrPattern(parser, context, 1, 0, BindingType.None, tokenIndex)
        : parseArrayExpressionOrPattern(parser, context, 1, 0, BindingType.None, tokenIndex);

    destructible = parser.destructible;

    if (context & Context.OptionsWebCompat && destructible & DestructuringKind.SeenProto) {
      report(parser, Errors.DuplicateProto);
    }

    parser.assignable =
      destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.IsAssignable;

    init = parseMemberOrUpdateExpression(
      parser,
      context | Context.DisallowIn,
      init as ESTree.Expression,
      0,
      0,
      0,
      parser.tokenIndex
    );
  } else {
    init = parseLeftHandSideExpression(parser, context | Context.DisallowIn, /* assignable */ 1, 0, tokenIndex);
  }

  if ((parser.token & Token.IsInOrOf) === Token.IsInOrOf) {
    const isOf = parser.token === Token.OfKeyword;

    if (parser.assignable & AssignmentKind.CannotAssign) {
      report(parser, Errors.InvalidLHSInOfForLoop, isOf && forAwait ? 'await' : isOf ? 'of' : 'in');
    }
    reinterpretToPattern(parser, init);
    nextToken(parser, context | Context.AllowRegExp);

    // `for await` only accepts the `for-of` type
    if (!isOf) {
      if (forAwait) report(parser, Errors.InvalidForAwait);
      right = parseExpressions(parser, context, /* assignable*/ 1, parser.tokenIndex);
    } else {
      right = parseExpression(parser, context, /* assignable*/ 1, 0, parser.tokenIndex);
    }
    consume(parser, context | Context.AllowRegExp, Token.RightParen);
    const body = parseStatement(
      parser,
      ((context | Context.TopLevel) ^ Context.TopLevel) | Context.InIteration,
      { loop: 1, '€': labels },
      FunctionStatement.Disallow,
      parser.tokenIndex
    );

    return isOf
      ? finishNode(parser, context, start, {
          type: 'ForOfStatement',
          body,
          left: init,
          right,
          await: forAwait
        })
      : finishNode(parser, context, start, {
          type: 'ForInStatement',
          body,
          left: init,
          right
        });
  }

  if (forAwait) {
    report(parser, Errors.InvalidForAwait);
  }

  if (!isVarDecl) {
    if (destructible & DestructuringKind.MustDestruct && parser.token !== Token.Assign) {
      report(parser, Errors.ForLoopInvalidLHS);
    }

    init = parseAssignmentExpression(parser, context | Context.DisallowIn, 0, tokenIndex, init);
  }

  if (parser.token === Token.Comma) init = parseSequenceExpression(parser, context, parser.tokenIndex, init);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.token !== Token.Semicolon) test = parseExpressions(parser, context, /* assignable*/ 1, parser.tokenIndex);

  consume(parser, context | Context.AllowRegExp, Token.Semicolon);

  if (parser.token !== Token.RightParen)
    update = parseExpressions(parser, context, /* assignable*/ 1, parser.tokenIndex);

  consume(parser, context | Context.AllowRegExp, Token.RightParen);

  const body = parseStatement(
    parser,
    ((context | Context.TopLevel) ^ Context.TopLevel) | Context.InIteration,
    { loop: 1, '€': labels },
    FunctionStatement.Disallow,
    parser.tokenIndex
  );

  return finishNode(parser, context, start, {
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
 */
function parseImportDeclaration(
  parser: ParserState,
  context: Context,
  start: number
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

  let source: ESTree.Literal;

  // See: https://tc39.github.io/proposal-dynamic-import/#sec-modules
  if (parser.token === Token.LeftParen) return parseImportCallDeclaration(parser, context, start);

  const { tokenIndex } = parser;

  const specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[] = [];

  // 'import' ModuleSpecifier ';'
  if (parser.token === Token.StringLiteral) {
    source = parseLiteral(parser, context, tokenIndex);
  } else {
    if (parser.token & Token.IsIdentifier) {
      validateBindingIdentifier(parser, context, BindingType.Const, parser.token);
      const local = parseIdentifier(parser, context, tokenIndex);
      specifiers.push(
        finishNode(parser, context, tokenIndex, {
          type: 'ImportDefaultSpecifier',
          local
        })
      );

      // NameSpaceImport
      if (consumeOpt(parser, context, Token.Comma)) {
        switch (parser.token) {
          case Token.Multiply:
            parseImportNamespaceSpecifier(parser, context, specifiers);
            break;

          case Token.LeftBrace:
            parseImportSpecifierOrNamedImports(parser, context, specifiers);
            break;

          default:
            report(parser, Errors.InvalidDefaultImport);
        }
      }
    } else if (parser.token === Token.Multiply) {
      parseImportNamespaceSpecifier(parser, context, specifiers);
    } else if (parser.token === Token.LeftBrace) {
      parseImportSpecifierOrNamedImports(parser, context, specifiers);
    } else report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

    source = parseModuleSpecifier(parser, context);
  }

  consumeSemicolon(parser, context | Context.AllowRegExp);

  return finishNode(parser, context, start, {
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
  specifiers: (ESTree.ImportSpecifier | ESTree.ImportDefaultSpecifier | ESTree.ImportNamespaceSpecifier)[]
): void {
  // NameSpaceImport:
  //  * as ImportedBinding
  const { tokenIndex } = parser;
  nextToken(parser, context);
  consume(parser, context, Token.AsKeyword);

  // 'import * as class from "foo":'
  if (parser.token & (Token.IsIdentifier | Token.Contextual)) {
    validateBindingIdentifier(parser, context, BindingType.Const, parser.token);
  } else report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

  const local = parseIdentifier(parser, context, parser.tokenIndex);
  specifiers.push(
    finishNode(parser, context, tokenIndex, {
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

  return parseLiteral(parser, context, parser.tokenIndex);
}

function parseImportSpecifierOrNamedImports(
  parser: ParserState,
  context: Context,
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
    const { token, tokenIndex } = parser;
    const imported = parseIdentifier(parser, context, tokenIndex);
    let local: ESTree.Identifier;

    if (consumeOpt(parser, context, Token.AsKeyword)) {
      if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber || parser.token === Token.Comma) {
        report(parser, Errors.InvalidKeywordAsAlias);
      } else {
        validateBindingIdentifier(parser, context, BindingType.Const, parser.token);
      }
      local = parseIdentifier(parser, context, parser.tokenIndex);
    } else {
      // Keywords cannot be bound to themselves, so an import name
      // that is a keyword is a syntax error if it is not followed
      // by the keyword 'as'.
      // See the ImportSpecifier production in ES6 section 15.2.2.
      validateBindingIdentifier(parser, context, BindingType.Const, token);
      local = imported;
    }

    specifiers.push(
      finishNode(parser, context, tokenIndex, {
        type: 'ImportSpecifier',
        local,
        imported
      })
    );

    if (parser.token !== <Token>Token.RightBrace) consume(parser, context, Token.Comma);
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
 */
function parseImportCallDeclaration(parser: ParserState, context: Context, start: number) {
  let expr: ESTree.ImportExpression = finishNode(parser, context, start, { type: 'Import' } as any);

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

  expr = parseMemberOrUpdateExpression(parser, context, expr as any, 0, 1, 0, start);

  /**
   * ExpressionStatement[Yield, Await]:
   *  [lookahead ∉ { {, function, async [no LineTerminator here] function, class, let [ }]Expression[+In, ?Yield, ?Await]
   */
  return parseExpressionStatement(parser, context, expr as any, start);
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
  start: number
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

  const specifiers: ESTree.ExportSpecifier[] = [];

  let declaration: any = null;
  let source: ESTree.Literal | null = null;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.DefaultKeyword)) {
    // export default HoistableDeclaration[Default]
    // export default ClassDeclaration[Default]
    // export default [lookahead not-in {function, class}] AssignmentExpression[In] ;

    switch (parser.token) {
      // export default HoistableDeclaration[Default]
      case Token.FunctionKeyword: {
        declaration = parseFunctionDeclaration(parser, context, 1, 1, 0, parser.tokenIndex);
        break;
      }
      // export default ClassDeclaration[Default]
      // export default  @decl ClassDeclaration[Default]
      case Token.Decorator:
      case Token.ClassKeyword:
        declaration = parseClassDeclaration(parser, context, /* isExportDefault */ 1, parser.tokenIndex);
        break;

      // export default HoistableDeclaration[Default]
      case Token.AsyncKeyword:
        let idxBeforeAsync = parser.tokenIndex;
        declaration = parseIdentifier(parser, context, idxBeforeAsync);
        const hasNewLine = parser.flags & Flags.NewLine ? 1 : 0;
        if (!hasNewLine) {
          if (parser.token === Token.FunctionKeyword) {
            declaration = parseFunctionDeclaration(parser, context, 1, 1, 1, idxBeforeAsync);
          } else {
            if (parser.token === Token.LeftParen) {
              declaration = parseAsyncArrowOrCallExpression(
                parser,
                context & ~Context.DisallowIn,
                declaration,
                /* assignable */ 1,
                hasNewLine,
                idxBeforeAsync
              );
              declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, 0, idxBeforeAsync);
              declaration = parseAssignmentExpression(parser, context, 0, parser.tokenIndex, declaration);
            } else if (parser.token & Token.IsIdentifier) {
              declaration = parseIdentifier(parser, context, parser.tokenIndex);
              declaration = parseArrowFunctionExpression(parser, context, [declaration], 1, idxBeforeAsync);
            }
          }
        }
        break;

      default:
        // export default [lookahead ∉ {function, class}] AssignmentExpression[In] ;
        declaration = parseExpression(parser, context, /* assignable */ 1, 0, parser.tokenIndex);
        consumeSemicolon(parser, context | Context.AllowRegExp);
    }

    return finishNode(parser, context, start, {
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
          finishNode(parser, context, parser.index, {
            type: 'ExportNamespaceSpecifier',
            specifier: parseIdentifier(parser, context, start)
          } as any)
        );
      }

      consume(parser, context, Token.FromKeyword);

      if (parser.token !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

      source = parseLiteral(parser, context, parser.tokenIndex);

      consumeSemicolon(parser, context | Context.AllowRegExp);

      return ecma262PR
        ? finishNode(parser, context, start, {
            type: 'ExportNamedDeclaration',
            source,
            specifiers
          } as any)
        : finishNode(parser, context, start, {
            type: 'ExportAllDeclaration',
            source
          } as any);
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

      while (parser.token & Token.IsIdentifier) {
        const { tokenIndex } = parser;
        const local = parseIdentifier(parser, context, tokenIndex);

        let exported: ESTree.Identifier | null;

        if (parser.token === Token.AsKeyword) {
          nextToken(parser, context);
          exported = parseIdentifier(parser, context, parser.tokenIndex);
        } else {
          exported = local;
        }

        specifiers.push(
          finishNode(parser, context, tokenIndex, {
            type: 'ExportSpecifier',
            local,
            exported
          })
        );

        if (parser.token !== <Token>Token.RightBrace) consume(parser, context, Token.Comma);
      }

      consume(parser, context, Token.RightBrace);

      if (consumeOpt(parser, context, Token.FromKeyword)) {
        //  The left hand side can't be a keyword where there is no
        // 'from' keyword since it references a local binding.
        if (parser.token !== Token.StringLiteral) report(parser, Errors.InvalidExportImportSource, 'Export');

        source = parseLiteral(parser, context, parser.tokenIndex);
      }

      consumeSemicolon(parser, context | Context.AllowRegExp);

      break;
    }

    case Token.ClassKeyword:
      declaration = parseClassDeclaration(parser, context, /* isExportDefault */ 0, parser.tokenIndex);
      break;
    case Token.LetKeyword:
      declaration = parseVariableStatement(parser, context, BindingType.Let, BindingOrigin.Export, parser.tokenIndex);
      break;
    case Token.ConstKeyword:
      declaration = parseVariableStatement(parser, context, BindingType.Const, BindingOrigin.Export, parser.tokenIndex);
      break;
    case Token.VarKeyword:
      declaration = parseVariableStatement(
        parser,
        context,
        BindingType.Variable,
        BindingOrigin.Export,
        parser.tokenIndex
      );
      break;
    case Token.FunctionKeyword:
      declaration = parseFunctionDeclaration(parser, context, 1, 0, 0, parser.tokenIndex);
      break;
    case Token.AsyncKeyword:
      const idxAfterAsync = parser.tokenIndex;

      nextToken(parser, context);

      if ((parser.flags & Flags.NewLine) === 0 && parser.token === Token.FunctionKeyword) {
        declaration = parseFunctionDeclaration(parser, context, 1, 0, 1, idxAfterAsync);
        break;
      }
    // falls through
    default:
      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }

  return finishNode(parser, context, start, {
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
  assignable: 0 | 1,
  inGroup: 0 | 1,
  start: number
): ESTree.Expression {
  /**
   * Expression :
   *   AssignmentExpression
   *   Expression , AssignmentExpression
   *
   * ExpressionNoIn :
   *   AssignmentExpressionNoIn
   *   ExpressionNoIn , AssignmentExpressionNoIn
   */
  return parseAssignmentExpression(
    parser,
    context,
    inGroup,
    start,
    parseLeftHandSideExpression(parser, context, assignable, inGroup, start)
  );
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
  start: number,
  expr: ESTree.AssignmentExpression | ESTree.Expression
): ESTree.SequenceExpression {
  // Expression ::
  //   AssignmentExpression
  //   Expression ',' AssignmentExpression
  const expressions: ESTree.Expression[] = [expr];
  while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
    expressions.push(parseExpression(parser, context, /* assignable*/ 1, 0, parser.tokenIndex));
  }

  return finishNode(parser, context, start, {
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
  assignable: 0 | 1,
  start: number
): ESTree.SequenceExpression | ESTree.Expression {
  const expr = parseExpression(parser, context, assignable, 0, start);
  return parser.token === Token.Comma ? parseSequenceExpression(parser, context, start, expr) : expr;
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
  left:
    | ESTree.AssignmentExpression
    | ESTree.LogicalExpression
    | ESTree.BinaryExpression
    | ESTree.Identifier
    | ESTree.Literal
    | ESTree.ConditionalExpression
):
  | ESTree.AssignmentExpression
  | ESTree.LogicalExpression
  | ESTree.BinaryExpression
  | ESTree.Identifier
  | ESTree.Literal
  | ESTree.ConditionalExpression {
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
  if ((parser.token & Token.IsAssignOp) > 0) {
    if (parser.assignable & AssignmentKind.CannotAssign) {
      report(parser, Errors.InvalidLHS);
    }
    if (
      (parser.token === Token.Assign && (left.type as string) === 'ArrayExpression') ||
      (left.type as string) === 'ObjectExpression'
    ) {
      reinterpretToPattern(parser, left);
    }

    const assignToken = parser.token;

    nextToken(parser, context | Context.AllowRegExp);

    const right = parseExpression(parser, context, /* assignable*/ 1, inGroup, parser.tokenIndex);

    left = finishNode(parser, context, start, {
      type: 'AssignmentExpression',
      left,
      operator: KeywordDescTable[assignToken & Token.Type] as ESTree.AssignmentOperator,
      right
    } as any);

    parser.assignable = AssignmentKind.CannotAssign;

    return left;
  }

  /** Binary expression
   *
   * https://tc39.github.io/ecma262/#sec-multiplicative-operators
   *
   */
  if ((parser.token & Token.IsBinaryOp) > 0) {
    // We start using the binary expression parser for prec >= 4 only!
    left = parseBinaryExpression(parser, context, inGroup, start, /* precedence */ 4, left);
  }

  /**
   * Conditional expression
   * https://tc39.github.io/ecma262/#prod-ConditionalExpression
   *
   */
  if (consumeOpt(parser, context | Context.AllowRegExp, Token.QuestionMark)) {
    left = parseConditionalExpression(parser, context, left, start);
  }

  return left;
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
  start: number
): ESTree.ConditionalExpression {
  // ConditionalExpression ::
  //   LogicalOrExpression
  //   LogicalOrExpression '?' AssignmentExpression ':' AssignmentExpression
  const consequent = parseExpression(parser, context & ~Context.DisallowIn, /* assignable*/ 1, 0, parser.tokenIndex);
  consume(parser, context | Context.AllowRegExp, Token.Colon);
  parser.assignable = AssignmentKind.IsAssignable;
  const alternate = parseExpression(parser, context, /* assignable*/ 1, 0, parser.tokenIndex);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(parser, context, start, {
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
  minPrec: number,
  left:
    | ESTree.AssignmentExpression
    | ESTree.BinaryExpression
    | ESTree.LogicalExpression
    | ESTree.Identifier
    | ESTree.Literal
    | ESTree.ConditionalExpression
):
  | ESTree.AssignmentExpression
  | ESTree.LogicalExpression
  | ESTree.BinaryExpression
  | ESTree.Identifier
  | ESTree.Literal
  | ESTree.ConditionalExpression {
  const bit = -((context & Context.DisallowIn) > 0) & Token.InKeyword;
  let t: Token;
  let prec: number;

  parser.assignable = AssignmentKind.CannotAssign;

  while (parser.token & Token.IsBinaryOp) {
    t = parser.token;
    prec = t & Token.Precedence;
    if (prec + (((t === Token.Exponentiate) as any) << 8) - (((bit === t) as any) << 12) <= minPrec) break;
    nextToken(parser, context | Context.AllowRegExp);
    left = finishNode(parser, context, start, {
      type: t & Token.IsLogical ? 'LogicalExpression' : 'BinaryExpression',
      left,
      right: parseBinaryExpression(
        parser,
        context,
        inGroup,
        parser.tokenIndex,
        prec,
        parseLeftHandSideExpression(parser, context, /* assignable */ 0, inGroup, parser.tokenIndex)
      ),
      operator: KeywordDescTable[t & Token.Type] as ESTree.LogicalOperator
    } as ESTree.BinaryExpression | ESTree.LogicalExpression);
  }

  if (parser.token === Token.Assign) report(parser, Errors.InvalidLHS);

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
  inGroup: 0 | 1
): ESTree.UnaryExpression {
  /**
   *  UnaryExpression ::
   *   PostfixExpression
   *      1) UpdateExpression
   *      2) delete UnaryExpression
   *      3) void UnaryExpression
   *      4) typeof UnaryExpression
   *      5) + UnaryExpression
   *      6) - UnaryExpression
   *      7) ~ UnaryExpression
   *      8) ! UnaryExpression
   */
  const unaryOperator = parser.token;
  nextToken(parser, context | Context.AllowRegExp);
  const arg = parseLeftHandSideExpression(parser, context, /* assignable*/ 0, inGroup, parser.tokenIndex);
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

  return finishNode(parser, context, start, {
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
export function parseYieldExpressionOrIdentifier(parser: ParserState, context: Context, start: number): any {
  parser.flags |= Flags.Yield;
  if (context & Context.InYieldContext) {
    // YieldExpression[In] :
    //     yield
    //     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
    //     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]

    nextToken(parser, context | Context.AllowRegExp);

    if (context & Context.InArgList) report(parser, Errors.YieldInParameter);

    if (parser.token === Token.QuestionMark) report(parser, Errors.InvalidTernaryYield);

    let argument: ESTree.Expression | null = null;
    let delegate = false; // yield*

    if ((parser.flags & Flags.NewLine) < 1) {
      delegate = consumeOpt(parser, context | Context.AllowRegExp, Token.Multiply);
      // 'Token.IsExpressionStart' contains the complete set of tokens that can appear
      // after an AssignmentExpression, and none of them can start an
      // AssignmentExpression.
      if (parser.token & Token.IsExpressionStart || delegate) {
        argument = parseExpression(parser, context, /* assignable */ 1, 0, parser.tokenIndex);
      }
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, {
      type: 'YieldExpression',
      argument,
      delegate
    });
  }

  if (context & Context.Strict) report(parser, Errors.AwaitOrYieldIdentInModule, 'Yield');
  return parseIdentifierOrArrow(parser, context, parseIdentifier(parser, context, start), start);
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
  start: number
): ESTree.Identifier | ESTree.Expression | ESTree.ArrowFunctionExpression | ESTree.AwaitExpression {
  parser.flags |= Flags.Await;

  if (context & Context.InAwaitContext) {
    if (inNewExpression) {
      report(parser, Errors.InvalidAwaitIdent);
    } else if (context & Context.InArgList) {
      reportAt(parser, parser.index, parser.line, parser.index, Errors.AwaitInParameter);
    }

    nextToken(parser, context | Context.AllowRegExp);

    const argument = parseLeftHandSideExpression(parser, context, /* assignable */ 0, 0, parser.tokenIndex);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, {
      type: 'AwaitExpression',
      argument
    });
  }

  if (context & Context.Module) report(parser, Errors.AwaitOrYieldIdentInModule, 'Await');

  const expr = parseIdentifierOrArrow(parser, context, parseIdentifier(parser, context, start), start);

  parser.assignable = AssignmentKind.IsAssignable;

  return parseMemberOrUpdateExpression(parser, context, expr, inNewExpression, 0, 0, start);
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
  origin: BindingOrigin,
  firstRestricted: Token | undefined
): ESTree.BlockStatement {
  const { tokenIndex } = parser;

  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);
  const body: ESTree.Statement[] = [];

  if (parser.token !== Token.RightBrace) {
    while (parser.token === Token.StringLiteral) {
      // "use strict" must be the exact literal without escape sequences or line continuation.
      const { index, tokenIndex, tokenValue, token } = parser;
      let expr = parseLiteral(parser, context, parser.tokenIndex);
      if (index - tokenIndex < 13 && tokenValue === 'use strict') {
        if ((parser.token & Token.IsAutoSemicolon) === Token.IsAutoSemicolon || parser.flags & Flags.NewLine) {
          context |= Context.Strict;
          // TC39 deemed "use strict" directives to be an error when occurring
          // in the body of a function with non-simple parameter list, on
          // 29/7/2015. https://goo.gl/ueA7Ln
          if (parser.flags & Flags.SimpleParameterList) {
            reportAt(parser, parser.index, parser.line, parser.tokenIndex, Errors.IllegalUseStrict);
          }
          if (parser.flags & Flags.Octals) {
            reportAt(parser, parser.index, parser.line, parser.tokenIndex, Errors.StrictOctalLiteral);
          }
        }
      }
      body.push(parseDirective(parser, context, expr, token, tokenIndex));
    }

    if (
      context & Context.Strict &&
      firstRestricted &&
      ((firstRestricted & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
        (firstRestricted & Token.FutureReserved) === Token.FutureReserved)
    ) {
      report(parser, Errors.StrictFunctionName);
    }
  }

  while (parser.token !== Token.RightBrace) {
    body.push(parseStatementListItem(parser, context, /* labels */ {}, parser.tokenIndex) as ESTree.Statement);
  }

  consume(
    parser,
    origin & (BindingOrigin.Arrow | BindingOrigin.Declaration) ? context | Context.AllowRegExp : context,
    Token.RightBrace
  );

  parser.flags &= ~(Flags.SimpleParameterList | Flags.Octals);

  if (parser.token === Token.Assign) report(parser, Errors.InvalidStatementStart);

  return finishNode(parser, context, tokenIndex, {
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
export function parseSuperExpression(parser: ParserState, context: Context, start: number): ESTree.Super {
  nextToken(parser, context);
  if (context & Context.InClass) report(parser, Errors.UnexpectedToken, 'super');
  switch (parser.token) {
    case Token.LeftParen: {
      // The super property has to be within a class constructor
      if ((context & Context.SuperCall) === 0) report(parser, Errors.SuperNoConstructor);
      parser.assignable = AssignmentKind.CannotAssign;
      break;
    }
    case Token.LeftBracket:
    case Token.Period: {
      // new super() is never allowed.
      // super() is only allowed in derived constructor
      if ((context & Context.SuperProperty) === 0) report(parser, Errors.InvalidSuperProperty);
      parser.assignable = AssignmentKind.IsAssignable;
      break;
    }
    default:
      report(parser, Errors.UnexpectedToken, 'super');
  }

  return finishNode(parser, context, start, { type: 'Super' });
}

/**
 * Parses left hand side
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param assignable
 */
export function parseLeftHandSideExpression(
  parser: ParserState,
  context: Context,
  assignable: 0 | 1,
  inGroup: 0 | 1,
  start: number
): any {
  let expression = parsePrimaryExpressionExtended(parser, context, BindingType.None, 0, assignable, inGroup, start);

  return parseMemberOrUpdateExpression(parser, context, expression, 0, 0, inGroup, start);
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
  inNewExpression: 0 | 1,
  isImportCall: 0 | 1,
  inGroup: 0 | 1,
  start: number
): any {
  // Update + Member expression
  if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp && (parser.flags & Flags.NewLine) === 0) {
    if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidIncDecTarget);

    const updateOperator = parser.token;

    nextToken(parser, context);

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, {
      type: 'UpdateExpression',
      argument: expr,
      operator: KeywordDescTable[updateOperator & Token.Type] as ESTree.UpdateOperator,
      prefix: false
    });
  }

  context = context & ~Context.DisallowIn;

  if ((parser.token & Token.IsMemberOrCallExpression) === Token.IsMemberOrCallExpression) {
    if (parser.token === Token.Period) {
      /* Property */
      nextToken(parser, context);

      if ((parser.token & (Token.IsIdentifier | Token.Keyword)) === 0 && parser.token !== Token.PrivateField) {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
      }

      parser.assignable = AssignmentKind.IsAssignable;

      const property =
        context & Context.OptionsNext && parser.token === Token.PrivateField
          ? parsePrivateName(parser, context, parser.tokenIndex)
          : parseIdentifier(parser, context, parser.tokenIndex);

      expr = finishNode(parser, context, start, {
        type: 'MemberExpression',
        object: expr,
        computed: false,
        property
      });
    } else if (parser.token === Token.LeftBracket) {
      nextToken(parser, context | Context.AllowRegExp);
      const idxAfterLeftBracket = parser.tokenIndex;
      let property = parseExpression(parser, context, 1, inGroup, idxAfterLeftBracket);
      if (parser.token === Token.Comma)
        property = parseSequenceExpression(parser, context, idxAfterLeftBracket, property);
      consume(parser, context, Token.RightBracket);
      parser.assignable = AssignmentKind.IsAssignable;
      expr = finishNode(parser, context, start, {
        type: 'MemberExpression',
        object: expr,
        computed: true,
        property
      });
    } else if (inNewExpression) {
      parser.assignable = AssignmentKind.CannotAssign;
      return expr;
    } else if (parser.token === Token.LeftParen) {
      const args = parseArguments(parser, context & ~Context.DisallowIn, isImportCall, inGroup);
      parser.assignable = AssignmentKind.CannotAssign;
      expr = finishNode(parser, context, start, {
        type: 'CallExpression',
        callee: expr,
        arguments: args
      });
    } else {
      parser.assignable = AssignmentKind.CannotAssign;
      expr = finishNode(parser, context, parser.index, {
        type: 'TaggedTemplateExpression',
        tag: expr,
        quasi:
          parser.token === Token.TemplateContinuation
            ? parseTemplate(parser, context | Context.TaggedTemplate, start)
            : parseTemplateLiteral(parser, context, start)
      });
    }
    return parseMemberOrUpdateExpression(parser, context, expr, inNewExpression, 0, 0, start);
  } else if (inNewExpression) {
    parser.assignable = AssignmentKind.CannotAssign;
  }
  return expr;
}

/**
 * Parses expressions such as a literal expression
 * and update expression.
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param type Binding type
 * @param inNewExpression
 * @param assignable
 */

export function parsePrimaryExpressionExtended(
  parser: ParserState,
  context: Context,
  type: BindingType,
  inNewExpression: 0 | 1,
  assignable: 0 | 1,
  inGroup: 0 | 1,
  start: number
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
   * UnaryExpression :
   *   1. LeftHandSideExpression
   *   2. void UnaryExpression
   *   3. typeof UnaryExpression
   *   4. + UnaryExpression
   *   5. - UnaryExpression
   *   6. ! UnaryExpression
   *
   */

  if ((token & Token.IsUnaryOp) === Token.IsUnaryOp) {
    if (inNewExpression && (token !== Token.VoidKeyword || token !== Token.TypeofKeyword)) {
      report(parser, Errors.InvalidNewUnary);
    }
    parser.assignable = AssignmentKind.CannotAssign;
    return parseUnaryExpression(parser, context, start, inGroup);
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

    const arg = parseLeftHandSideExpression(parser, context, /* assignable */ 0, 0, parser.tokenIndex);

    if (parser.assignable & AssignmentKind.CannotAssign) {
      report(
        parser,
        (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments
          ? Errors.NotAssignableLetArgs
          : Errors.InvalidIncDecTarget
      );
    }

    parser.assignable = AssignmentKind.CannotAssign;

    return finishNode(parser, context, start, {
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
    return parseAwaitExpressionOrIdentifier(parser, context, inNewExpression, start);
  }

  /**
   * YieldExpression[In] :
   *     yield
   *     yield [no LineTerminator here] AssignmentExpression[?In, Yield]
   *     yield [no LineTerminator here] * AssignmentExpression[?In, Yield]
   */

  if (token === Token.YieldKeyword) {
    if (inGroup) parser.destructible |= DestructuringKind.Yield;

    if (assignable) return parseYieldExpressionOrIdentifier(parser, context, start);

    if (context & ((context & Context.InYieldContext) | Context.Strict))
      report(parser, Errors.DisallowedInContext, 'yield');

    return parseIdentifier(parser, context, start);
  }

  /**
   *  LexicalBinding ::
   *    BindingIdentifier
   *    BindingPattern
   */

  if (parser.token === Token.LetKeyword) {
    if (context & Context.Strict) report(parser, Errors.StrictInvalidLetInExprPos);
    if (type & (BindingType.Let | BindingType.Const)) report(parser, Errors.InvalidLetBoundName);
  }
  if (context & Context.InClass && parser.token === Token.Arguments) report(parser, Errors.InvalidNewUnary);
  if ((token & Token.IsIdentifier) === Token.IsIdentifier) {
    const expr = parseIdentifier(parser, context | Context.TaggedTemplate, start);

    if (token === Token.AsyncKeyword) {
      return parseAsyncExpression(parser, context, expr, inNewExpression, assignable, start);
    }

    if (token === Token.EscapedReserved) report(parser, Errors.InvalidEscapedKeyword);

    const IsEvalOrArguments = (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments;

    if (parser.token === Token.Arrow) {
      if (IsEvalOrArguments) {
        if (context & Context.Strict) report(parser, Errors.StrictEvalArguments);
        parser.flags |= Flags.SimpleParameterList;
      } else {
        parser.flags &= ~Flags.SimpleParameterList;
      }

      if (!assignable) report(parser, Errors.InvalidAssignmentTarget);

      return parseArrowFunctionExpression(parser, context, [expr], /* isAsync */ 0, start);
    }

    parser.assignable =
      context & Context.Strict && IsEvalOrArguments ? AssignmentKind.CannotAssign : AssignmentKind.IsAssignable;

    return expr;
  }

  if ((token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
    parser.assignable = AssignmentKind.CannotAssign;
    return parseLiteral(parser, context, start);
  }

  switch (token) {
    case Token.FunctionKeyword:
      return parseFunctionExpression(parser, context, /* isAsync */ 0, start);
    case Token.LeftBrace:
      return parseObjectLiteral(parser, context, assignable ? 0 : 1, inGroup, start);
    case Token.LeftBracket:
      return parseArrayLiteral(parser, context, assignable ? 0 : 1, inGroup, start);
    case Token.LeftParen:
      return parseParenthesizedExpression(parser, context & ~Context.DisallowIn, assignable, start);
    case Token.PrivateField:
      return parsePrivateName(parser, context, start);
    case Token.Decorator:
    case Token.ClassKeyword:
      return parseClassExpression(parser, context, inGroup, start);
    case Token.RegularExpression:
      parser.assignable = AssignmentKind.CannotAssign;
      return parseRegExpLiteral(parser, context, start);
    case Token.ThisKeyword:
      parser.assignable = AssignmentKind.CannotAssign;
      return parseThisExpression(parser, context, start);
    case Token.FalseKeyword:
    case Token.TrueKeyword:
    case Token.NullKeyword:
      parser.assignable = AssignmentKind.CannotAssign;
      return parseNullOrTrueOrFalseLiteral(parser, context, start);
    case Token.SuperKeyword:
      return parseSuperExpression(parser, context, start);
    case Token.TemplateTail:
      return parseTemplateLiteral(parser, context, start);
    case Token.TemplateContinuation:
      return parseTemplate(parser, context, start);
    case Token.NewKeyword:
      return parseNewExpression(parser, context, inGroup, start);
    case Token.BigIntLiteral:
      parser.assignable = AssignmentKind.CannotAssign;
      return parseBigIntLiteral(parser, context);
    case Token.ImportKeyword:
      return parseImportCallExpression(parser, context, inNewExpression, start);
    default:
      if (
        context & Context.Strict
          ? (token & Token.IsIdentifier) === Token.IsIdentifier || (token & Token.Contextual) === Token.Contextual
          : (token & Token.IsIdentifier) === Token.IsIdentifier ||
            (token & Token.Contextual) === Token.Contextual ||
            (token & Token.FutureReserved) === Token.FutureReserved
      ) {
        parser.assignable = AssignmentKind.IsAssignable;
        return parseIdentifierOrArrow(parser, context, parseIdentifier(parser, context, start), start);
      }

      report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }
}

function parseImportCallExpression(
  parser: ParserState,
  context: Context,
  inNewExpression: 0 | 1,
  start: number
): ESTree.ImportExpression | ESTree.MetaProperty {
  // ImportCall[Yield, Await]:
  //  import(AssignmentExpression[+In, ?Yield, ?Await])

  nextToken(parser, context);

  if (parser.token !== Token.LeftParen)
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

  if (inNewExpression) report(parser, Errors.InvalidImportNew);

  const expr = parseMemberOrUpdateExpression(
    parser,
    context,
    finishNode(parser, context, start, { type: 'Import' } as any),
    inNewExpression,
    /* isImportCall */ 1,
    0,
    start
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return expr;
}

/**
 * Parses BigInt literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseBigIntLiteral(parser: ParserState, context: Context): ESTree.Literal {
  const { tokenRaw: raw, tokenValue: value } = parser;
  nextToken(parser, context);
  return finishNode(parser, context, parser.index, {
    type: 'Literal',
    value,
    bigint: raw,
    raw
  });
}

/**
 * Parses template literal
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseTemplateLiteral(parser: ParserState, context: Context, start: number): ESTree.TemplateLiteral {
  /**
   * Template Literals
   *
   * Template ::
   *   FullTemplate
   *   TemplateHead
   *
   * FullTemplate ::
   *   ` TemplateCharactersopt `
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

  return finishNode(parser, context, start, {
    type: 'TemplateLiteral',
    expressions: [],
    quasis: [parseTemplateTail(parser, context, start)]
  });
}

/**
 * Parses template tail
 *
 * @param parser  Parser object
 * @param context Context masks
 * @returns {ESTree.TemplateElement}
 */
export function parseTemplateTail(parser: ParserState, context: Context, start: number): ESTree.TemplateElement {
  const { tokenValue, tokenRaw } = parser;

  consume(parser, context, Token.TemplateTail);

  return finishNode(parser, context, start, {
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
export function parseTemplate(parser: ParserState, context: Context, start: number): ESTree.TemplateLiteral {
  const quasis = [parseTemplateSpans(parser, context, /* tail */ false, start)];

  consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);

  const expressions = [parseExpressions(parser, context, /* assignable */ 1, parser.tokenIndex)];
  if (parser.token !== Token.RightBrace) report(parser, Errors.InvalidTemplateContinuation);
  while ((parser.token = scanTemplateTail(parser, context)) !== Token.TemplateTail) {
    const { tokenIndex } = parser;
    quasis.push(parseTemplateSpans(parser, context, /* tail */ false, tokenIndex));
    consume(parser, context | Context.AllowRegExp, Token.TemplateContinuation);
    expressions.push(parseExpressions(parser, context, /* assignable */ 1, tokenIndex));
  }

  quasis.push(parseTemplateSpans(parser, context, /* tail */ true, parser.tokenIndex));

  nextToken(parser, context);

  return finishNode(parser, context, start, {
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
export function parseTemplateSpans(
  parser: ParserState,
  context: Context,
  tail: boolean,
  start: number
): ESTree.TemplateElement {
  return finishNode(parser, context, start, {
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
function parseSpreadElement(parser: ParserState, context: Context, start: number): ESTree.SpreadElement {
  consume(parser, context | Context.AllowRegExp, Token.Ellipsis);
  const argument = parseExpression(parser, context, /* assignable */ 1, 0, parser.tokenIndex);
  parser.assignable = AssignmentKind.IsAssignable;
  return finishNode(parser, context, start, {
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
  isImportCall: 0 | 1,
  inGroup: 0 | 1
): (ESTree.SpreadElement | ESTree.Expression)[] {
  nextToken(parser, context | Context.AllowRegExp);

  const args: (ESTree.Expression | ESTree.SpreadElement)[] = [];

  let argCount = 0;

  while (parser.token !== Token.RightParen) {
    if (parser.token === Token.Ellipsis) {
      if (isImportCall) report(parser, Errors.InvalidSpreadInImport);
      args.push(parseSpreadElement(parser, context, parser.tokenIndex));
    } else {
      args.push(parseExpression(parser, context, /* assignable */ 1, inGroup, parser.tokenIndex));
    }

    argCount++;

    if (parser.token !== Token.Comma) break;

    if (isImportCall) report(parser, Errors.InvalidImportTail);

    nextToken(parser, context | Context.AllowRegExp);

    if (parser.token === Token.RightParen) break;
  }

  if (isImportCall && argCount !== 1) report(parser, Errors.ImportNotOneArg);

  consume(parser, context, Token.RightParen);

  return args;
}

/**
 * Parses an identifier expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseIdentifier(parser: ParserState, context: Context, start: number): ESTree.Identifier {
  const { tokenValue } = parser;
  nextToken(parser, context);
  return finishNode(parser, context, start, {
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
export function parseLiteral(parser: ParserState, context: Context, start: number): ESTree.Literal {
  const { tokenValue, tokenRaw } = parser;
  nextToken(parser, context);
  return context & Context.OptionsRaw
    ? finishNode(parser, context, start, {
        type: 'Literal',
        value: tokenValue,
        raw: tokenRaw
      })
    : finishNode(parser, context, start, {
        type: 'Literal',
        value: tokenValue
      });
}

/**
 * Parses null and boolean expressions
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseNullOrTrueOrFalseLiteral(parser: ParserState, context: Context, start: number): ESTree.Literal {
  const raw = KeywordDescTable[parser.token & Token.Type];
  const value = parser.token === Token.NullKeyword ? null : raw === 'true';

  nextToken(parser, context);

  return context & Context.OptionsRaw
    ? finishNode(parser, context, start, {
        type: 'Literal',
        value,
        raw
      })
    : finishNode(parser, context, start, {
        type: 'Literal',
        value
      });
}

/**
 * Parses this expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseThisExpression(parser: ParserState, context: Context, start: number): ESTree.ThisExpression {
  nextToken(parser, context);
  return finishNode(parser, context, start, {
    type: 'ThisExpression'
  });
}

/**
 * Parse function expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param allowGen
 * @param isExportDefault
 * @param isAsync
 */
export function parseFunctionDeclaration(
  parser: ParserState,
  context: Context,
  allowGen: 0 | 1,
  isExportDefault: 0 | 1,
  isAsync: 0 | 1,
  start: number
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
  let isGenerator: 0 | 1 = 0;
  if (parser.token === Token.Multiply) {
    if (!allowGen) report(parser, Errors.InvalidGeneratorFunction);
    nextToken(parser, context);
    isGenerator = 1;
  }
  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  if (parser.token & Token.IsIdentifier) {
    // @ts-ignore
    const type = 4 - ((context & 0x1800) === 0x1000) * 2;
    validateBindingIdentifier(parser, context | ((context & 0xc00) << 11), type, parser.token);
    firstRestricted = parser.token;
    id = parseIdentifier(parser, context, parser.tokenIndex);
  } else if (!isExportDefault) {
    // Only under the "export default" context, function declaration does not require the function name.
    //
    //     ExportDeclaration:
    //         ...
    //         export default HoistableDeclaration[~Yield, +Default]
    //         ...
    //
    //     HoistableDeclaration[Yield, Default]:
    //         FunctionDeclaration[?Yield, ?Default]
    //         GeneratorDeclaration[?Yield, ?Default]
    //
    //     FunctionDeclaration[Yield, Default]:
    //         ...
    //         [+Default] function ( FormalParameters[~Yield] ) { FunctionBody[~Yield] }
    //
    //     GeneratorDeclaration[Yield, Default]:
    //         ...
    //         [+Default] function * ( FormalParameters[+Yield] ) { GeneratorBody }
    //
    report(parser, Errors.DeclNoName, 'Function');
  }

  context = (context & ~0x1ec0000) | Context.AllowNewTarget | ((isAsync * 2 + isGenerator) << 21);

  const params = parseFormalParametersOrFormalList(parser, context | Context.InArgList, BindingType.ArgumentList);

  const body = parseFunctionBody(
    parser,
    context & ~(0x8001000 | Context.InGlobal | Context.InSwitchOrIteration),
    BindingOrigin.Declaration,
    firstRestricted
  );

  return finishNode(parser, context, start, {
    type: 'FunctionDeclaration',
    params,
    body,
    async: isAsync !== 0,
    generator: isGenerator !== 0,
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
  start: number
): ESTree.FunctionExpression {
  // GeneratorExpression:
  //      function* BindingIdentifier [Yield][opt](FormalParameters[Yield]){ GeneratorBody }
  //
  // FunctionExpression:
  //      function BindingIdentifier[opt](FormalParameters){ FunctionBody }

  nextToken(parser, context | Context.AllowRegExp);
  const isGenerator = optionalBit(parser, context, Token.Multiply);
  // @ts-ignore
  const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
  let id: ESTree.Identifier | null = null;
  let firstRestricted: Token | undefined;

  if (
    ((parser.token & 0b0000000000000000001_0000_11111111) ^ 0b0000000000000000000_0000_01010100) >
    0b0000000000000000001_0000_00000000
  ) {
    validateBindingIdentifier(
      parser,
      ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags,
      BindingType.Variable,
      parser.token
    );
    firstRestricted = parser.token;
    id = parseIdentifier(parser, context, parser.tokenIndex);
  }

  // @ts-ignore
  context = (context & ~0x1ec0000) | Context.AllowNewTarget | generatorAndAsyncFlags;

  const params = parseFormalParametersOrFormalList(parser, context | Context.InArgList, BindingType.ArgumentList);
  const body = parseFunctionBody(
    parser,
    (context |
      Context.InGlobal |
      Context.TopLevel |
      Context.InSwitchOrIteration |
      Context.InClass |
      Context.DisallowIn) ^
      (Context.InGlobal | Context.TopLevel | Context.InSwitchOrIteration | Context.InClass | Context.DisallowIn),
    0,
    firstRestricted
  );

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, {
    type: 'FunctionExpression',
    params,
    body,
    async: !!isAsync,
    generator: !!isGenerator,
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
  start: number
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
  const expr = parseArrayExpressionOrPattern(parser, context, skipInitializer, inGroup, BindingType.None, start);

  if (context & Context.OptionsWebCompat && parser.destructible & DestructuringKind.SeenProto) {
    report(parser, Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.MustDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  parser.assignable =
    parser.destructible & DestructuringKind.CannotDestruct ? AssignmentKind.CannotAssign : AssignmentKind.IsAssignable;
  return expr as ESTree.ArrayExpression;
}

/**
 * Parse array expression or pattern
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param skipInitializer
 * @param bindingType
 */
export function parseArrayExpressionOrPattern(
  parser: ParserState,
  context: Context,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  type: BindingType,
  start: number
): ESTree.ArrayExpression | ESTree.ArrayPattern {
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

      const { token, tokenIndex } = parser;

      if (token & Token.IsIdentifier) {
        left = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, tokenIndex);

        if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            reportAt(parser, parser.index, parser.line, parser.index - 3, Errors.InvalidLHS);
          }

          const right = parseExpression(parser, context, /* assignable */ 1, inGroup, parser.tokenIndex);

          left = finishNode(parser, context, tokenIndex, {
            type: 'AssignmentExpression',
            operator: '=',
            left,
            right
          });
        } else if (parser.token === Token.Comma || parser.token === Token.RightBracket) {
          destructible |= parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;
        } else {
          if (type) destructible |= DestructuringKind.CannotDestruct;

          left = parseMemberOrUpdateExpression(parser, context, left, /* assignable */ 0, 0, inGroup, tokenIndex);

          if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;

          if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
            if (parser.token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;

            left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, left);
          } else if (parser.token !== Token.Assign) {
            destructible |=
              type || parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.AssignableDestruct;
          }
        }

        destructible |=
          parser.destructible & DestructuringKind.Yield
            ? DestructuringKind.Yield
            : 0 | (parser.destructible & DestructuringKind.Await)
            ? DestructuringKind.Await
            : 0;
      } else if (parser.token & Token.IsPatternStart) {
        left =
          parser.token === Token.LeftBrace
            ? parseObjectLiteralOrPattern(parser, context, /* skipInitializer*/ 0, inGroup, type, tokenIndex)
            : parseArrayExpressionOrPattern(parser, context, /* skipInitializer*/ 0, inGroup, type, tokenIndex);

        destructible |= parser.destructible;

        parser.assignable =
          parser.destructible & DestructuringKind.CannotDestruct
            ? AssignmentKind.CannotAssign
            : AssignmentKind.IsAssignable;

        if (parser.token === Token.Comma || parser.token === Token.RightBracket) {
          if (parser.assignable & AssignmentKind.CannotAssign) {
            destructible |= DestructuringKind.CannotDestruct;
          }
        } else if (parser.destructible & DestructuringKind.MustDestruct) {
          report(parser, Errors.InvalidDestructuringTarget);
        } else {
          left = parseMemberOrUpdateExpression(parser, context, left, /* assignable */ 0, 0, inGroup, tokenIndex);
          destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

          if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
            left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, left);
          } else if (parser.token !== Token.Assign) {
            destructible |=
              type || parser.assignable & AssignmentKind.CannotAssign
                ? DestructuringKind.CannotDestruct
                : DestructuringKind.AssignableDestruct;
          }
        }
      } else if (parser.token === Token.Ellipsis) {
        left = parseRestOrSpreadElement(parser, context, Token.RightBracket, type, 0, inGroup, tokenIndex);
        destructible |= parser.destructible;
        if (parser.token !== Token.Comma && parser.token !== Token.RightBracket)
          report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
      } else {
        left = parseLeftHandSideExpression(parser, context, /* assignable */ 1, 0, tokenIndex);

        if (parser.token !== Token.Comma && parser.token !== Token.RightBracket) {
          left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, left);
          if (type && token === Token.LeftParen) destructible |= DestructuringKind.CannotDestruct;
        } else if (parser.assignable & AssignmentKind.CannotAssign) {
          destructible |= DestructuringKind.CannotDestruct;
        } else if (token === Token.LeftParen) {
          destructible |=
            parser.assignable & AssignmentKind.IsAssignable && !type
              ? DestructuringKind.AssignableDestruct
              : token === Token.LeftParen || parser.assignable & AssignmentKind.CannotAssign
              ? DestructuringKind.CannotDestruct
              : 0;
        }
      }

      elements.push(left);

      if (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        if (parser.token === Token.RightBracket) break;
      } else break;
    }
  }

  consume(parser, context, Token.RightBracket);

  const node = finishNode(parser, context, start, {
    type: 'ArrayExpression',
    elements
  } as ESTree.ArrayExpression);

  if (!skipInitializer && parser.token & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, node) as any;
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
 * @param node ESTree AST node
 */

function parseArrayOrObjectAssignmentPattern(
  parser: ParserState,
  context: Context,
  destructible: AssignmentKind | DestructuringKind,
  inGroup: 0 | 1,
  start: number,
  node: ESTree.ArrayExpression | ESTree.ObjectExpression
): ESTree.AssignmentExpression {
  // 12.15.5 Destructuring Assignment
  //
  // AssignmentElement[Yield, Await]:
  //   DestructuringAssignmentTarget[?Yield, ?Await]
  //   DestructuringAssignmentTarget[?Yield, ?Await] Initializer[+In, ?Yield, ?Await]
  //

  if (parser.token !== Token.Assign) report(parser, Errors.InvalidObjCompoundAssignment);

  nextToken(parser, context | Context.AllowRegExp);

  if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidLHS);

  reinterpretToPattern(parser, node);

  const { tokenIndex } = parser;

  const right = parseExpression(parser, context & ~Context.DisallowIn, /* assignable */ 1, inGroup, tokenIndex);

  parser.destructible =
    ((destructible | DestructuringKind.SeenProto | DestructuringKind.MustDestruct) ^
      (DestructuringKind.MustDestruct | DestructuringKind.SeenProto)) |
    (parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0) |
    (parser.destructible & DestructuringKind.Yield ? DestructuringKind.Yield : 0);

  return finishNode(parser, context, start, {
    type: 'AssignmentExpression',
    left: node as any,
    operator: '=' as ESTree.AssignmentOperator,
    right
  });
}

/**
 * Parses rest or spread element
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param closingToken
 * @param type Binding type
 * @param isAsync
 */
function parseRestOrSpreadElement(
  parser: ParserState,
  context: Context,
  closingToken: Token,
  type: BindingType,
  isAsync: 0 | 1,
  inGroup: 0 | 1,
  start: number
): ESTree.SpreadElement {
  nextToken(parser, context | Context.AllowRegExp); // skip '...'

  let argument: any;
  let destructible: AssignmentKind | DestructuringKind = 0;

  let tokenIndex = parser.tokenIndex;

  if (parser.token & (Token.Keyword | Token.IsIdentifier)) {
    parser.assignable = AssignmentKind.IsAssignable;

    argument = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, tokenIndex);

    const { token } = parser;

    argument = parseMemberOrUpdateExpression(parser, context, argument, /* assignable */ 0, 0, inGroup, tokenIndex);

    if (parser.token !== Token.Comma && parser.token !== closingToken) {
      if (parser.assignable & AssignmentKind.CannotAssign && parser.token === Token.Assign)
        report(parser, Errors.InvalidDestructuringTarget);

      destructible |= DestructuringKind.CannotDestruct;

      argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, argument);
    }

    destructible |=
      parser.assignable & AssignmentKind.CannotAssign
        ? DestructuringKind.CannotDestruct
        : token !== closingToken && token !== Token.Comma
        ? DestructuringKind.AssignableDestruct
        : parser.destructible & DestructuringKind.Await
        ? DestructuringKind.Await
        : 0;
  } else if (parser.token === closingToken) {
    report(parser, Errors.RestMissingArg);
  } else if (parser.token & Token.IsPatternStart) {
    argument =
      parser.token === Token.LeftBrace
        ? parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 1, inGroup, type, tokenIndex)
        : parseArrayExpressionOrPattern(parser, context, /* skipInitializer */ 1, inGroup, type, tokenIndex);

    const { token } = parser;

    if (token !== Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.destructible & DestructuringKind.MustDestruct) report(parser, Errors.InvalidDestructuringTarget);

      argument = parseMemberOrUpdateExpression(parser, context, argument, 0, 0, 0, tokenIndex);

      destructible |= parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

      const { token } = parser;

      if (parser.token !== Token.Comma && parser.token !== closingToken) {
        argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, argument);

        if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== Token.Assign) {
        destructible |=
          type || parser.assignable & AssignmentKind.CannotAssign
            ? DestructuringKind.CannotDestruct
            : DestructuringKind.AssignableDestruct;
      }
    } else {
      destructible |=
        closingToken === Token.RightBrace && token !== Token.Assign
          ? DestructuringKind.CannotDestruct
          : parser.destructible;
    }
  } else {
    if (type) report(parser, Errors.InvalidLHSInit);

    argument = parseLeftHandSideExpression(parser, context, /* assignable */ 1, inGroup, parser.tokenIndex);

    const { token, tokenIndex } = parser;

    if (token === Token.Assign && token !== closingToken && token !== Token.Comma) {
      if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidLHSInit);

      argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, argument);

      destructible |= DestructuringKind.CannotDestruct;
    } else {
      if (token === Token.Comma) {
        destructible |= DestructuringKind.CannotDestruct;
      } else if (token !== closingToken) {
        argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, argument);
      }

      destructible |=
        parser.assignable & AssignmentKind.IsAssignable
          ? DestructuringKind.AssignableDestruct
          : DestructuringKind.CannotDestruct;
    }

    parser.destructible = destructible;

    return finishNode(parser, context, start, {
      type: 'SpreadElement',
      argument
    });
  }

  if (parser.token !== closingToken) {
    if (!isAsync && type & BindingType.ArgumentList) {
      report(
        parser,
        parser.token === Token.Comma
          ? Errors.InvalidRestTrailing
          : parser.token === Token.Assign
          ? Errors.RestDefaultInitializer
          : Errors.InvalidRestNotLast
      );
    }

    if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
      if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidLHS);

      reinterpretToPattern(parser, argument);

      const right = parseExpression(parser, context, /* assignable */ 1, inGroup, parser.tokenIndex);

      argument = finishNode(parser, context, tokenIndex, {
        type: 'AssignmentExpression',
        left: argument,
        operator: '=',
        right
      });
      destructible = DestructuringKind.CannotDestruct;
    }

    destructible |= DestructuringKind.CannotDestruct;
  }

  parser.destructible = destructible;

  return finishNode(parser, context, start, {
    type: 'SpreadElement',
    argument
  });
}

/**
 * Parses method definition
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param kind
 */
export function parseMethodDefinition(
  parser: ParserState,
  context: Context,
  kind: PropertyKind,
  start: number
): ESTree.FunctionExpression {
  context =
    (context & ~((kind & PropertyKind.Constructor) === 0 ? 0x1e80000 : 0xe00000)) | ((kind & 0x58) << 18) | 0x6040000;

  const params = parseMethodFormals(parser, context | Context.InArgList, kind, BindingType.ArgumentList);
  const body = parseFunctionBody(parser, context & ~(0x8001000 | Context.InGlobal), BindingOrigin.None, void 0);

  return finishNode(parser, context, start, {
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
 */
function parseObjectLiteral(
  parser: ParserState,
  context: Context,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  start: number
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
  const expr = parseObjectLiteralOrPattern(parser, context, skipInitializer, inGroup, BindingType.None, start);

  if (context & Context.OptionsWebCompat && parser.destructible & DestructuringKind.SeenProto) {
    report(parser, Errors.DuplicateProto);
  }

  if (parser.destructible & DestructuringKind.MustDestruct) {
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
 * @param type Binding type
 */
export function parseObjectLiteralOrPattern(
  parser: ParserState,
  context: Context,
  skipInitializer: 0 | 1,
  inGroup: 0 | 1,
  type: BindingType,
  start: number
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
    if (parser.token === Token.Ellipsis) {
      properties.push(
        parseRestOrSpreadElement(parser, context, Token.RightBrace, type, /* isAsync */ 0, inGroup, parser.tokenIndex)
      );
    } else {
      let state = PropertyKind.None;
      let key: ESTree.Expression | null = null;
      let value: any;

      const { token, tokenValue, tokenIndex } = parser;

      if (parser.token & (Token.IsIdentifier | (parser.token & Token.Keyword))) {
        key = parseIdentifier(parser, context, tokenIndex);

        if (parser.token === Token.Comma || parser.token === Token.RightBrace || parser.token === Token.Assign) {
          state |= PropertyKind.Shorthand;

          if ((token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments) {
            if (context & Context.Strict) destructible |= DestructuringKind.CannotDestruct;
          } else {
            validateBindingIdentifier(parser, context, type, token);
          }

          if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
            destructible |= DestructuringKind.MustDestruct;

            const right = parseExpression(parser, context & ~Context.DisallowIn, 1, inGroup, parser.tokenIndex);

            destructible |=
              parser.destructible & DestructuringKind.Yield
                ? DestructuringKind.Yield
                : 0 | (parser.destructible & DestructuringKind.Await)
                ? DestructuringKind.Await
                : 0;

            value = finishNode(parser, context, tokenIndex, {
              type: 'AssignmentPattern',
              left: key,
              right
            });
          } else {
            destructible |= token === Token.AwaitKeyword ? DestructuringKind.Await : 0;

            value = key;
          }
        } else if (consumeOpt(parser, context | Context.AllowRegExp, Token.Colon)) {
          const idxAfterColon = parser.tokenIndex;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.token & Token.IsIdentifier) {
            value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, idxAfterColon);

            const { token } = parser;

            value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;
                if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.IsAssignable
                    ? DestructuringKind.AssignableDestruct
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              destructible |=
                parser.assignable & AssignmentKind.CannotAssign
                  ? DestructuringKind.CannotDestruct
                  : token === Token.Assign
                  ? 0
                  : DestructuringKind.AssignableDestruct;
              value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, value);
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon)
                : parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon);

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct
                ? AssignmentKind.CannotAssign
                : AssignmentKind.IsAssignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (parser.destructible & DestructuringKind.MustDestruct) {
              report(parser, Errors.InvalidDestructuringTarget);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (token !== Token.Comma && token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |=
                  type || parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.AssignableDestruct;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, /* assignable */ 1, inGroup, idxAfterColon);

            destructible |=
              parser.assignable & AssignmentKind.IsAssignable
                ? DestructuringKind.AssignableDestruct
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (token !== Token.Comma && token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
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

          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
        } else if (parser.token & (Token.IsIdentifier | Token.Keyword)) {
          destructible |= DestructuringKind.CannotDestruct;

          if (token === Token.AsyncKeyword) {
            if (parser.flags & Flags.NewLine) report(parser, Errors.AsyncRestrictedProd);
            state |= PropertyKind.Async;
          }
          key = parseIdentifier(parser, context, parser.tokenIndex);

          if (token === Token.EscapedReserved) report(parser, Errors.UnexpectedStrictReserved);

          state |=
            token === Token.GetKeyword
              ? PropertyKind.Getter
              : token === Token.SetKeyword
              ? PropertyKind.Setter
              : PropertyKind.Method;

          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
        } else if (parser.token === Token.LeftParen) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
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
            key = parseIdentifier(parser, context, parser.tokenIndex);
          } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
            key = parseLiteral(parser, context, parser.tokenIndex);
          } else if (parser.token === Token.LeftBracket) {
            state |= PropertyKind.Computed;
            key = parseComputedPropertyName(parser, context, inGroup);
            destructible |= parser.assignable;
          } else {
            report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
          }
          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
        } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
          if (token === Token.AsyncKeyword) state |= PropertyKind.Async;

          state |=
            token === Token.GetKeyword
              ? PropertyKind.Getter
              : token === Token.SetKeyword
              ? PropertyKind.Setter
              : PropertyKind.Method;
          destructible |= DestructuringKind.CannotDestruct;

          key = parseLiteral(parser, context, parser.tokenIndex);

          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
        } else {
          report(parser, Errors.UnexpectedCharAfterObjLit);
        }
      } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
        key = parseLiteral(parser, context, tokenIndex);

        if (parser.token === Token.Colon) {
          consume(parser, context | Context.AllowRegExp, Token.Colon);

          const idxAfterColon = parser.tokenIndex;

          if (tokenValue === '__proto__') prototypeCount++;

          if (parser.token & Token.IsIdentifier) {
            value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, idxAfterColon);

            const { token } = parser;

            value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.IsAssignable
                    ? DestructuringKind.AssignableDestruct
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              destructible |=
                parser.assignable & AssignmentKind.CannotAssign
                  ? DestructuringKind.CannotDestruct
                  : token === Token.Assign
                  ? 0
                  : DestructuringKind.AssignableDestruct;
              value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon)
                : parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon);

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct
                ? AssignmentKind.CannotAssign
                : AssignmentKind.IsAssignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else if (parser.destructible & DestructuringKind.MustDestruct) {
              report(parser, Errors.InvalidDestructuringTarget);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);
              destructible = parser.assignable & AssignmentKind.CannotAssign ? DestructuringKind.CannotDestruct : 0;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, value);
              } else if (parser.token !== Token.Assign) {
                destructible |=
                  type || parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.AssignableDestruct;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, /* assignable */ 1, 0, idxAfterColon);

            destructible |=
              parser.assignable & AssignmentKind.IsAssignable
                ? DestructuringKind.AssignableDestruct
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) {
                destructible |= DestructuringKind.CannotDestruct;
              }
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

              destructible = parser.assignable & AssignmentKind.IsAssignable ? 0 : DestructuringKind.CannotDestruct;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              }
            }
          }
        } else if (parser.token === Token.LeftParen) {
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
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
          const idxAfterColon = parser.tokenIndex;

          if (parser.token & Token.IsIdentifier) {
            value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, idxAfterColon);

            const { token } = parser;

            value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (token === Token.Assign || token === Token.RightBrace || token === Token.Comma) {
                if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
              } else {
                destructible |=
                  parser.assignable & AssignmentKind.IsAssignable
                    ? DestructuringKind.AssignableDestruct
                    : DestructuringKind.CannotDestruct;
              }
            } else if (parser.token === Token.Assign) {
              destructible |=
                parser.assignable & AssignmentKind.CannotAssign
                  ? DestructuringKind.CannotDestruct
                  : token === Token.Assign
                  ? 0
                  : DestructuringKind.AssignableDestruct;
              value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
            } else {
              destructible |= DestructuringKind.CannotDestruct;
              value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);
            }
          } else if ((parser.token & Token.IsPatternStart) === Token.IsPatternStart) {
            value =
              parser.token === Token.LeftBracket
                ? parseArrayExpressionOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon)
                : parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 0, inGroup, type, idxAfterColon);

            destructible = parser.destructible;

            parser.assignable =
              destructible & DestructuringKind.CannotDestruct
                ? AssignmentKind.CannotAssign
                : AssignmentKind.IsAssignable;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else if (destructible & DestructuringKind.MustDestruct) {
              report(parser, Errors.InvalidShorthandPropInit);
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

              destructible =
                parser.assignable & AssignmentKind.CannotAssign ? destructible | DestructuringKind.CannotDestruct : 0;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              } else if (token !== Token.Assign) {
                destructible |=
                  type || parser.assignable & AssignmentKind.CannotAssign
                    ? DestructuringKind.CannotDestruct
                    : DestructuringKind.AssignableDestruct;
              }
            }
          } else {
            value = parseLeftHandSideExpression(parser, context, /* assignable */ 1, 0, idxAfterColon);

            destructible |=
              parser.assignable & AssignmentKind.IsAssignable
                ? DestructuringKind.AssignableDestruct
                : DestructuringKind.CannotDestruct;

            if (parser.token === Token.Comma || parser.token === Token.RightBrace) {
              if (parser.assignable & AssignmentKind.CannotAssign) destructible |= DestructuringKind.CannotDestruct;
            } else {
              value = parseMemberOrUpdateExpression(parser, context, value, 0, 0, inGroup, idxAfterColon);

              destructible = parser.assignable & AssignmentKind.IsAssignable ? 0 : DestructuringKind.CannotDestruct;

              const { token } = parser;

              if (parser.token !== Token.Comma && parser.token !== Token.RightBrace) {
                value = parseAssignmentExpression(parser, context & ~Context.DisallowIn, inGroup, idxAfterColon, value);

                if (token !== Token.Assign) destructible |= DestructuringKind.CannotDestruct;
              }
            }
          }
        } else if (parser.token === Token.LeftParen) {
          state |= PropertyKind.Method;

          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);

          destructible = DestructuringKind.CannotDestruct;
        } else {
          report(parser, Errors.InvalidComputedPropName);
        }
      } else if (parser.token === Token.Multiply) {
        consume(parser, context | Context.AllowRegExp, Token.Multiply);

        state |= PropertyKind.Generator;

        if (parser.token & Token.IsIdentifier) {
          const { token, line, index } = parser;

          key = parseIdentifier(parser, context, parser.tokenIndex);

          state |= PropertyKind.Method;

          if (parser.token === Token.LeftParen) {
            destructible |= DestructuringKind.CannotDestruct;
            value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
          } else {
            reportAt(
              parser,
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
          key = parseLiteral(parser, context, parser.tokenIndex);
          state |= PropertyKind.Method;
          value = parseMethodDefinition(parser, context, state, tokenIndex);
        } else if (parser.token === Token.LeftBracket) {
          destructible |= DestructuringKind.CannotDestruct;
          state |= PropertyKind.Computed | PropertyKind.Method;
          key = parseComputedPropertyName(parser, context, inGroup);
          value = parseMethodDefinition(parser, context, state, parser.tokenIndex);
        } else {
          report(parser, Errors.InvalidObjLitKeyStar);
        }
      } else {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[token & Token.Type]);
      }

      destructible |= parser.destructible & DestructuringKind.Await ? DestructuringKind.Await : 0;

      parser.destructible = destructible;

      properties.push(
        finishNode(parser, context, tokenIndex, {
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

    consumeOpt(parser, context, Token.Comma);
  }

  consume(parser, context, Token.RightBrace);

  if (prototypeCount > 1) destructible |= DestructuringKind.SeenProto;

  const node = finishNode(parser, context, start, {
    type: 'ObjectExpression',
    properties
  } as any);

  if (!skipInitializer && parser.token & Token.IsAssignOp) {
    return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, node);
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
 */
export function parseMethodFormals(
  parser: ParserState,
  context: Context,
  kind: PropertyKind,
  type: BindingType
): any[] {
  // FormalParameter[Yield,GeneratorParameter] :
  //   BindingElement[?Yield, ?GeneratorParameter]
  consume(parser, context, Token.LeftParen);
  const params: ESTree.Expression[] = [];
  parser.flags &= ~Flags.SimpleParameterList;
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
  } else if (kind & PropertyKind.Setter && parser.token === Token.Ellipsis) {
    report(parser, Errors.BadSetterRestParameter);
  } else {
    let isComplex: 0 | 1 = 0;
    while (parser.token !== Token.RightParen) {
      let left: any;
      let tokenIndex = parser.tokenIndex;
      if (parser.token & Token.IsIdentifier) {
        if (
          (context & Context.Strict) === 0 &&
          ((parser.token & Token.FutureReserved) === Token.FutureReserved ||
            (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
        ) {
          isComplex = 1;
        }
        left = parseAndClassifyIdentifier(parser, context, type, tokenIndex);
      } else {
        if (parser.token === Token.LeftBrace) {
          left = parseObjectLiteralOrPattern(
            parser,
            context,
            /* skipInitializer */ 1,
            /* inGroup */ 0,
            type,
            tokenIndex
          );
        } else if (parser.token === Token.LeftBracket) {
          left = parseArrayExpressionOrPattern(
            parser,
            context,
            /* skipInitializer */ 1,
            /* inGroup */ 0,
            type,
            tokenIndex
          );
        } else if (parser.token === Token.Ellipsis) {
          left = parseRestOrSpreadElement(
            parser,
            context,
            Token.RightParen,
            type,
            /* isAsync */ 0,
            /* inGroup */ 0,
            tokenIndex
          );
        }

        isComplex = 1;

        reinterpretToPattern(parser, left);

        if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidBindingDestruct);

        if (type && parser.destructible & DestructuringKind.AssignableDestruct)
          report(parser, Errors.InvalidBindingDestruct);
      }

      if (parser.token === Token.Assign) {
        nextToken(parser, context | Context.AllowRegExp);

        isComplex = 1;

        const right = parseExpression(parser, context & ~Context.DisallowIn, /* assignable */ 1, 0, parser.tokenIndex);

        left = finishNode(parser, context, tokenIndex, {
          type: 'AssignmentPattern',
          left,
          right
        } as any);
      }
      setterArgs++;
      params.push(left);

      if (parser.token !== Token.RightParen) consume(parser, context, Token.Comma);
    }

    if (isComplex) parser.flags |= Flags.SimpleParameterList;

    if (kind & PropertyKind.Setter && setterArgs !== 1) {
      report(parser, Errors.AccessorWrongArgs, 'Setter', 'one', '');
    }
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
  const key = parseExpression(parser, context & ~Context.DisallowIn, /* assignable */ 1, inGroup, parser.tokenIndex);
  consume(parser, context, Token.RightBracket);
  return key;
}

/**
 * Parses an expression which has been parenthesised, or arrow head
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param assignable
 */
export function parseParenthesizedExpression(
  parser: ParserState,
  context: Context,
  assignable: 0 | 1,
  start: number
): any {
  parser.flags &= ~Flags.SimpleParameterList;

  nextToken(parser, context | Context.AllowRegExp);

  if (consumeOpt(parser, context, Token.RightParen)) {
    if (!assignable) report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
    return parseArrowFunctionExpression(parser, context, [], /* isAsync */ 0, start);
  }

  let destructible: AssignmentKind | DestructuringKind = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  let expr: any;
  let expressions: ESTree.Expression[] = [];
  let toplevelComma: 0 | 1 = 0;
  let isComplex: 0 | 1 = 0;

  let idxStart = parser.tokenIndex;

  parser.assignable = AssignmentKind.IsAssignable;

  while (parser.token !== Token.RightParen) {
    const idxAfterLeftParen = parser.tokenIndex;

    if (parser.token & (Token.IsIdentifier | Token.Keyword)) {
      const { token } = parser;

      if (
        (token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
        (token & Token.FutureReserved) === Token.FutureReserved
      ) {
        isComplex = 1;
      }

      expr = parsePrimaryExpressionExtended(parser, context, BindingType.None, 0, 1, 1, idxAfterLeftParen);

      if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
        isComplex = 1;

        validateBindingIdentifier(parser, context, BindingType.None, token);

        const right = parseExpression(parser, context, /* assignable */ 1, 1, parser.tokenIndex);

        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(parser, context, idxAfterLeftParen, {
          type: 'AssignmentExpression',
          left: expr,
          operator: '=',
          right
        });
      } else {
        destructible |=
          (parser.token & Token.IsCommaOrRightParen) === Token.IsCommaOrRightParen
            ? parser.assignable & AssignmentKind.CannotAssign
              ? DestructuringKind.CannotDestruct
              : 0
            : DestructuringKind.CannotDestruct;

        expr = parseAssignmentExpression(
          parser,
          context,
          1,
          idxAfterLeftParen,
          parseMemberOrUpdateExpression(parser, context, expr, /* assignable */ 0, 0, 1, idxAfterLeftParen)
        );
      }
    } else if (parser.token & Token.IsPatternStart) {
      expr =
        parser.token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, 0, 1, BindingType.None, idxAfterLeftParen)
          : parseArrayExpressionOrPattern(parser, context, 0, 1, BindingType.None, idxAfterLeftParen);

      destructible |= parser.destructible;

      isComplex = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if ((parser.token & Token.IsCommaOrRightParen) !== Token.IsCommaOrRightParen) {
        if (destructible & DestructuringKind.MustDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, /* assignable */ 0, 0, 0, idxAfterLeftParen);

        destructible |= DestructuringKind.CannotDestruct;

        if ((parser.token & Token.IsCommaOrRightParen) !== Token.IsCommaOrRightParen) {
          expr = parseAssignmentExpression(parser, context, 0, idxAfterLeftParen, expr);
        }
      }
    } else if (parser.token === Token.Ellipsis) {
      expr = parseRestOrSpreadElement(
        parser,
        context,
        Token.RightParen,
        BindingType.ArgumentList,
        0,
        1,
        parser.tokenIndex
      );

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidRestArg);

      isComplex = 1;

      if (toplevelComma && (parser.token & Token.IsCommaOrRightParen) === Token.IsCommaOrRightParen) {
        expressions.push(expr);
      }
      destructible |= DestructuringKind.MustDestruct;
      break;
    } else {
      destructible |= DestructuringKind.CannotDestruct;

      expr = parseExpression(parser, context, /* assignable */ 1, 1, parser.tokenIndex);

      if (toplevelComma && (parser.token & Token.IsCommaOrRightParen) === Token.IsCommaOrRightParen) {
        expressions.push(expr);
      }

      if (parser.token === Token.Comma) {
        if (!toplevelComma) {
          toplevelComma = 1;
          expressions = [expr];
        }
      }

      if (toplevelComma) {
        while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
          expressions.push(parseExpression(parser, context, /* assignable */ 1, 1, parser.tokenIndex));
        }

        parser.assignable = AssignmentKind.CannotAssign;

        expr = finishNode(parser, context, idxStart, {
          type: 'SequenceExpression',
          expressions
        });
      }
      consume(parser, context, Token.RightParen);

      parser.destructible = destructible;

      return expr;
    }

    if (toplevelComma && (parser.token & Token.IsCommaOrRightParen) === Token.IsCommaOrRightParen) {
      expressions.push(expr);
    }

    if (!consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) break;

    if (!toplevelComma) {
      toplevelComma = 1;
      expressions = [expr];
    }

    if (parser.token === Token.RightParen) {
      destructible |= DestructuringKind.MustDestruct;
      break;
    }
  }

  if (toplevelComma) {
    parser.assignable = AssignmentKind.CannotAssign;

    expr = finishNode(parser, context, idxStart, {
      type: 'SequenceExpression',
      expressions
    });
  }

  destructible |=
    parser.destructible & DestructuringKind.Yield
      ? DestructuringKind.Yield
      : 0 | (parser.destructible & DestructuringKind.Await)
      ? DestructuringKind.Await
      : 0;

  consume(parser, context, Token.RightParen);

  if (destructible & DestructuringKind.CannotDestruct && destructible & DestructuringKind.MustDestruct)
    report(parser, Errors.InvalidLHSValidRHS);

  if (parser.token === Token.Arrow) {
    if (isComplex) parser.flags |= Flags.SimpleParameterList;
    if (!assignable) report(parser, Errors.IllegalArrowFunctionParams);
    if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.IllegalArrowFunctionParams);
    if (destructible & DestructuringKind.AssignableDestruct) report(parser, Errors.InvalidArrowDestructLHS);
    if (context & (Context.InAwaitContext | Context.Module) && destructible & DestructuringKind.Await)
      report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield) {
      report(parser, Errors.YieldInParameter);
    }

    return parseArrowFunctionExpression(parser, context, toplevelComma ? expressions : [expr], /* isAsync */ 0, start);
  } else if (destructible & DestructuringKind.MustDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  parser.destructible = destructible;

  return context & Context.OptionsParenthesized
    ? finishNode(parser, context, idxStart, {
        type: 'ParenthesizedExpression',
        expression: expr
      } as any)
    : expr;
}

/**
 * Parses either an identifier or an arrow function
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param expr ESTree AST node
 */
export function parseIdentifierOrArrow(
  parser: ParserState,
  context: Context,
  expr: ESTree.Identifier,
  start: number
): ESTree.Identifier | ESTree.ArrowFunctionExpression {
  if (parser.token === Token.Arrow) {
    parser.flags &= ~Flags.SimpleParameterList;
    return parseArrowFunctionExpression(parser, context, [expr], /* isAsync */ 0, start);
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
 */
export function parseArrowFunctionExpression(
  parser: ParserState,
  context: Context,
  params: ESTree.Pattern[],
  isAsync: 0 | 1,
  start: number
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

  // @ts-ignore
  context = (context & ~0xf00000) | (isAsync << 22);

  const expression = parser.token !== Token.LeftBrace;

  let body: ESTree.BlockStatement | ESTree.Expression;

  if (expression) {
    // Single-expression body
    body = parseExpression(parser, context, /* assignable */ 1, 0, parser.tokenIndex);
  } else {
    body = parseFunctionBody(
      parser,
      context & ~(0x8001000 | Context.InGlobal | Context.InClass),
      BindingOrigin.Arrow,
      void 0
    );

    switch (parser.token) {
      case Token.Period:
      case Token.LeftBracket:
      case Token.TemplateTail:
        report(parser, Errors.InvalidAccessedBlockBodyArrow);
      case Token.LeftParen:
        report(parser, Errors.InvalidInvokedBlockBodyArrow);
      default: // ignore
    }
    if ((parser.token & Token.IsBinaryOp) === Token.IsBinaryOp && (parser.flags & Flags.NewLine) === 0)
      report(parser, Errors.InvalidArrowPostfix);
    if ((parser.token & Token.IsUpdateOp) === Token.IsUpdateOp) report(parser, Errors.InvalidArrowPostfix);
  }

  parser.assignable = AssignmentKind.CannotAssign;

  return finishNode(parser, context, start, {
    type: 'ArrowFunctionExpression',
    body,
    params,
    async: !!isAsync,
    expression
  });
}

/**
 * Parses formal parameters
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseFormalParametersOrFormalList(parser: ParserState, context: Context, type: BindingType): any[] {
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

  parser.flags &= ~Flags.SimpleParameterList;

  const params: ESTree.Expression[] = [];

  let isComplex: 0 | 1 = 0;

  while (parser.token !== Token.RightParen) {
    let left: any;
    let tokenIndex = parser.tokenIndex;
    if (parser.token & Token.IsIdentifier) {
      if (
        (context & Context.Strict) === 0 &&
        ((parser.token & Token.FutureReserved) === Token.FutureReserved ||
          (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      ) {
        isComplex = 1;
      }
      left = parseAndClassifyIdentifier(parser, context, type, tokenIndex);
    } else {
      if (parser.token === Token.LeftBrace) {
        left = parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 1, /* inGroup */ 0, type, tokenIndex);
      } else if (parser.token === Token.LeftBracket) {
        left = parseArrayExpressionOrPattern(
          parser,
          context,
          /* skipInitializer */ 1,
          /* inGroup */ 0,
          type,
          tokenIndex
        );
      } else if (parser.token === Token.Ellipsis) {
        left = parseRestOrSpreadElement(
          parser,
          context,
          Token.RightParen,
          type,
          /* isAsync */ 0,
          /* inGroup */ 0,
          tokenIndex
        );
      } else {
        report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
      }

      isComplex = 1;

      reinterpretToPattern(parser, left);

      if (parser.destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidBindingDestruct);

      if (type && parser.destructible & DestructuringKind.AssignableDestruct)
        report(parser, Errors.InvalidBindingDestruct);
    }

    if (parser.token === Token.Assign) {
      nextToken(parser, context | Context.AllowRegExp);

      isComplex = 1;

      const right = parseExpression(parser, context & ~Context.DisallowIn, /* assignable */ 1, 0, parser.tokenIndex);

      left = finishNode(parser, context, tokenIndex, {
        type: 'AssignmentPattern',
        left,
        right
      } as any);
    }

    params.push(left);

    if (parser.token !== Token.RightParen) consume(parser, context, Token.Comma);
  }

  if (isComplex) parser.flags |= Flags.SimpleParameterList;

  consume(parser, context, Token.RightParen);
  return params;
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
  start: number
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
  const id = parseIdentifier(parser, context | Context.AllowRegExp, start);
  let startIdx = parser.tokenIndex;
  if (consumeOpt(parser, context, Token.Period)) {
    if (context & Context.AllowNewTarget && parser.token === Token.Target) {
      parser.assignable = AssignmentKind.CannotAssign;
      return parseMetaProperty(parser, context, id, start);
    }
    report(parser, Errors.InvalidNewTarget);
  }
  parser.assignable = AssignmentKind.CannotAssign;
  let callee = parsePrimaryExpressionExtended(parser, context, BindingType.None, 1, 0, inGroup, startIdx);
  callee = parseMemberOrUpdateExpression(parser, context, callee, /* inNewExpression*/ 1, 0, inGroup, startIdx);
  parser.assignable = AssignmentKind.CannotAssign;
  return finishNode(parser, context, start, {
    type: 'NewExpression',
    callee,
    arguments:
      parser.token === Token.LeftParen
        ? parseArguments(parser, context & ~Context.DisallowIn, /* isImportCall */ 0, inGroup)
        : []
  } as ESTree.NewExpression);
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
  start: number
): ESTree.MetaProperty {
  const property = parseIdentifier(parser, context, parser.tokenIndex);
  return finishNode(parser, context, start, {
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
export function parseAsyncExpression(
  parser: ParserState,
  context: Context,
  expr: ESTree.Identifier,
  inNewExpression: 0 | 1,
  assignable: 0 | 1,
  start: number
): ESTree.Expression {
  const isNewLine = parser.flags & Flags.NewLine;

  if (!isNewLine) {
    // async function ...
    if (parser.token === Token.FunctionKeyword) return parseFunctionExpression(parser, context, /* isAsync */ 1, start);

    // async Identifier => ...
    if ((parser.token & Token.IsIdentifier) === Token.IsIdentifier) {
      if (parser.assignable & AssignmentKind.CannotAssign) report(parser, Errors.InvalidAsyncParamList);
      if (parser.token === Token.AwaitKeyword) report(parser, Errors.AwaitInParameter);

      // This has to be an async arrow, so let the caller throw on missing arrows etc
      return parseArrowFunctionExpression(
        parser,
        context,
        [parseIdentifier(parser, context, parser.tokenIndex)],
        /* isAsync */ 1,
        start
      );
    }
  }

  // async (...) => ...
  if (!inNewExpression && parser.token === Token.LeftParen) {
    return parseAsyncArrowOrCallExpression(parser, context & ~Context.DisallowIn, expr, assignable, isNewLine, start);
  }

  // async => ...
  if (parser.token === Token.Arrow) {
    if (inNewExpression) report(parser, Errors.InvalidAsyncArrow);
    return parseArrowFunctionExpression(parser, context, [expr], 0, start);
  }

  parser.assignable = AssignmentKind.IsAssignable;

  return expr;
}

/**
 * Parses async arrow or call expressions
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param callee  ESTree AST node
 * @param assignable
 * @param asyncNewLine
 */
export function parseAsyncArrowOrCallExpression(
  parser: ParserState,
  context: Context,
  callee: ESTree.Identifier | void,
  assignable: 0 | 1,
  asyncNewLine: number,
  start: number
): any {
  nextToken(parser, context | Context.AllowRegExp);

  if (consumeOpt(parser, context, Token.RightParen)) {
    if (parser.token === Token.Arrow) {
      if (asyncNewLine) report(parser, Errors.InvalidLineBreak);
      if (!assignable) report(parser, Errors.InvalidAsyncParamList);
      return parseArrowFunctionExpression(parser, context, [], /* isAsync */ 1, start);
    }

    return finishNode(parser, context, start, {
      type: 'CallExpression',
      callee,
      arguments: []
    } as any);
  }

  let destructible: AssignmentKind | DestructuringKind = 0;
  let expr: any;
  let isComplex: 0 | 1 = 0;

  parser.destructible &= ~(DestructuringKind.Yield | DestructuringKind.Await);

  const params: ESTree.Expression[] = [];

  while (parser.token !== Token.RightParen) {
    const idxAfterLeftParen = parser.tokenIndex;
    if (parser.token & (Token.IsIdentifier | Token.Keyword)) {
      if (
        (parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments ||
        (parser.token & Token.FutureReserved) === Token.FutureReserved
      ) {
        isComplex = 1;
      }

      expr = parsePrimaryExpressionExtended(parser, context, BindingType.None, 0, 1, 1, parser.tokenIndex);

      if (consumeOpt(parser, context | Context.AllowRegExp, Token.Assign)) {
        isComplex = 1;

        const right = parseExpression(parser, context, /* assignable */ 1, 1, parser.tokenIndex);
        parser.assignable = AssignmentKind.CannotAssign;
        expr = finishNode(parser, context, idxAfterLeftParen, {
          type: 'AssignmentExpression',
          left: expr,
          operator: '=',
          right
        });
      } else {
        destructible |=
          (parser.token & Token.IsCommaOrRightParen) === Token.IsCommaOrRightParen
            ? parser.assignable & AssignmentKind.CannotAssign
              ? DestructuringKind.CannotDestruct
              : 0
            : DestructuringKind.CannotDestruct;

        expr = parseMemberOrUpdateExpression(parser, context, expr, /* assignable */ 0, 0, 1, parser.tokenIndex);

        expr = parseAssignmentExpression(parser, context, 1, parser.tokenIndex, expr);

        destructible |= parser.assignable;
      }
    } else if (parser.token & Token.IsPatternStart) {
      expr =
        parser.token === Token.LeftBrace
          ? parseObjectLiteralOrPattern(parser, context, 0, 1, BindingType.None, idxAfterLeftParen)
          : parseArrayExpressionOrPattern(parser, context, 0, 1, BindingType.None, idxAfterLeftParen);

      destructible |= parser.destructible;

      isComplex = 1;

      parser.assignable = AssignmentKind.CannotAssign;

      if ((parser.token & Token.IsCommaOrRightParen) !== Token.IsCommaOrRightParen) {
        if (destructible & DestructuringKind.MustDestruct) report(parser, Errors.InvalidPatternTail);

        expr = parseMemberOrUpdateExpression(parser, context, expr, /* assignable */ 0, 0, 0, idxAfterLeftParen);

        destructible |= DestructuringKind.CannotDestruct;

        if ((parser.token & Token.IsCommaOrRightParen) !== Token.IsCommaOrRightParen)
          expr = parseAssignmentExpression(parser, context, 0, parser.tokenIndex, expr);
      }
    } else if (parser.token === Token.Ellipsis) {
      expr = parseRestOrSpreadElement(
        parser,
        context,
        Token.RightParen,
        BindingType.ArgumentList,
        1,
        1,
        idxAfterLeftParen
      );

      destructible |= parser.destructible;

      isComplex = 1;
      if (parser.token !== Token.RightParen) parser.destructible |= DestructuringKind.CannotDestruct;
    } else {
      expr = parseExpression(parser, context, /* assignable */ 1, 0, idxAfterLeftParen);

      destructible = parser.assignable;

      params.push(expr);

      while (consumeOpt(parser, context | Context.AllowRegExp, Token.Comma)) {
        params.push(parseExpression(parser, context, /* assignable */ 1, 0, idxAfterLeftParen));
        parser.assignable = AssignmentKind.CannotAssign;
      }

      destructible |= parser.assignable;

      consume(parser, context, Token.RightParen);

      parser.destructible = destructible | DestructuringKind.CannotDestruct;

      return finishNode(parser, context, start, {
        type: 'CallExpression',
        callee,
        arguments: params
      } as any);
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
    if (destructible & DestructuringKind.CannotDestruct) report(parser, Errors.InvalidLHSInAsyncArrow);
    if (destructible & DestructuringKind.AssignableDestruct) report(parser, Errors.InvalidArrowDestructLHS);
    if (parser.flags & Flags.NewLine || asyncNewLine) report(parser, Errors.InvalidLineBreak);
    if (destructible & DestructuringKind.Await) report(parser, Errors.AwaitInParameter);
    if (context & (Context.Strict | Context.InYieldContext) && destructible & DestructuringKind.Yield)
      report(parser, Errors.YieldInParameter);
    return parseArrowFunctionExpression(parser, context, params as any, /* isAsync */ 1, start) as any;
  } else if (destructible & DestructuringKind.MustDestruct) {
    report(parser, Errors.InvalidShorthandPropInit);
  }

  return finishNode(parser, context, start, {
    type: 'CallExpression',
    callee,
    arguments: params
  } as any);
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
export function parseRegExpLiteral(parser: ParserState, context: Context, start: number): ESTree.RegExpLiteral {
  const { tokenRaw: raw, tokenRegExp: regex, tokenValue: value } = parser;
  nextToken(parser, context);
  return context & Context.OptionsRaw
    ? finishNode(parser, context, start, {
        type: 'Literal',
        value,
        regex,
        raw
      })
    : finishNode(parser, context, start, {
        type: 'Literal',
        value,
        regex
      } as any);
}

/**
 * Parse class expression
 *
 * @param parser  Parser object
 * @param context Context masks
 * @param isExportDefault
 */
export function parseClassDeclaration(
  parser: ParserState,
  context: Context,
  isExportDefault: 0 | 1,
  start: number
): ESTree.ClassDeclaration {
  // ClassDeclaration ::
  //   'class' Identifier ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   'class' ('extends' LeftHandSideExpression)? '{' ClassBody '}'
  //   DecoratorList[?Yield, ?Await]optclassBindingIdentifier[?Yield, ?Await]ClassTail[?Yield, ?Await]
  //   DecoratorList[?Yield, ?Await]optclassClassTail[?Yield, ?Await]
  //
  context = (context & ~Context.InConstructor) | Context.Strict;

  let id: ESTree.Expression | null = null;
  let superClass: ESTree.Expression | null = null;

  const decorators: ESTree.Decorator[] =
    context & Context.OptionsNext ? parseDecorators(parser, context | Context.InDecoratorContext) : [];

  nextToken(parser, context);

  const idxClass = parser.tokenIndex;

  if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
    if (isStrictReservedWord(parser, context, parser.token)) report(parser, Errors.UnexpectedStrictReserved);
    if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      report(parser, Errors.StrictEvalArguments);
    id = parseIdentifier(parser, context, idxClass);
  } else if (!isExportDefault) {
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
    report(parser, Errors.DeclNoName, 'Class');
  }

  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, /* assignable */ 0, 0, parser.tokenIndex);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(parser, inheritedContext, context, BindingType.None, BindingOrigin.Declaration, 0);

  return context & Context.OptionsNext
    ? finishNode(parser, context, start, {
        type: 'ClassDeclaration',
        id,
        superClass,
        decorators,
        body
      })
    : finishNode(parser, context, start, {
        type: 'ClassDeclaration',
        id,
        superClass,
        body
      });
}

/**
 * Parse class expression
 *
 * @param parser  Parser object
 * @param context Context masks
 */
export function parseClassExpression(
  parser: ParserState,
  context: Context,
  inGroup: 0 | 1,
  start: number
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

  const decorators: ESTree.Decorator[] =
    context & Context.OptionsNext ? parseDecorators(parser, context | Context.InDecoratorContext) : [];

  nextToken(parser, context);

  if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
    if (isStrictReservedWord(parser, context, parser.token)) report(parser, Errors.UnexpectedStrictReserved);
    if ((parser.token & Token.IsEvalOrArguments) === Token.IsEvalOrArguments)
      report(parser, Errors.StrictEvalArguments);
    id = parseIdentifier(parser, context, parser.tokenIndex);
  }

  // Second set of context masks to fix 'super' edge cases
  let inheritedContext = context;

  if (consumeOpt(parser, context | Context.AllowRegExp, Token.ExtendsKeyword)) {
    superClass = parseLeftHandSideExpression(parser, context, /* assignable */ 0, inGroup, parser.tokenIndex);
    inheritedContext |= Context.SuperCall;
  } else {
    inheritedContext = (inheritedContext | Context.SuperCall) ^ Context.SuperCall;
  }

  const body = parseClassBody(parser, inheritedContext, context, BindingType.None, BindingOrigin.None, inGroup);

  parser.assignable = AssignmentKind.CannotAssign;

  return context & Context.OptionsNext
    ? finishNode(parser, context, start, {
        type: 'ClassExpression',
        id,
        superClass,
        decorators,
        body
      })
    : finishNode(parser, context, start, {
        type: 'ClassExpression',
        id,
        superClass,
        body
      });
}

/**
 * Parses a list of decorators
 *
 * @param parser Parser object
 * @param context Context masks
 */
export function parseDecorators(parser: ParserState, context: Context): ESTree.Decorator[] {
  let list: ESTree.Decorator[] = [];

  while (parser.token === Token.Decorator) {
    list.push(parseDecoratorList(parser, context, parser.tokenIndex));
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

export function parseDecoratorList(parser: ParserState, context: Context, start: number): ESTree.Decorator {
  nextToken(parser, context | Context.AllowRegExp);

  let expression = parsePrimaryExpressionExtended(parser, context, BindingType.None, 0, 1, 0, start);

  expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, 0, start);

  return finishNode(parser, context, start, {
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
 * @param type Binding type
 * @param origin  Binding origin
 * @param decorators
 */

export function parseClassBody(
  parser: ParserState,
  context: Context,
  inheritedContext: Context,
  type: BindingType,
  origin: BindingOrigin,
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
   *   * ClassElementName ( FormalParameterList ) { FunctionBody }
   *   get ClassElementName ( ) { FunctionBody }
   *   set ClassElementName ( PropertySetParameterList ) { FunctionBody }
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
  const startt = parser.tokenIndex;
  consume(parser, context | Context.AllowRegExp, Token.LeftBrace);

  parser.flags = (parser.flags | Flags.HasConstructor) ^ Flags.HasConstructor;

  const body: (ESTree.MethodDefinition | ESTree.FieldDefinition)[] = [];
  let decorators: ESTree.Decorator[] = [];

  if (context & Context.OptionsNext) {
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
        parseClassElementList(parser, context, inheritedContext, type, decorators, 0, inGroup, parser.tokenIndex)
      );
    }
  } else {
    while (parser.token !== Token.RightBrace) {
      if (consumeOpt(parser, context, Token.Semicolon)) {
        continue;
      }
      body.push(
        parseClassElementList(parser, context, inheritedContext, type, decorators, 0, inGroup, parser.tokenIndex)
      );
    }
  }
  consume(parser, origin & BindingOrigin.Declaration ? context | Context.AllowRegExp : context, Token.RightBrace);

  return finishNode(parser, context, startt, {
    type: 'ClassBody',
    body
  } as any);
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
  inheritedContext: Context,
  type: BindingType,
  decorators: ESTree.Decorator[],
  isStatic: 0 | 1,
  inGroup: 0 | 1,
  start: number
): ESTree.MethodDefinition | ESTree.FieldDefinition {
  let kind: PropertyKind = isStatic ? PropertyKind.Static : PropertyKind.None;
  let key: ESTree.Expression | null = null;

  const { token, tokenIndex } = parser;

  if (token & (Token.IsIdentifier | Token.FutureReserved)) {
    key = parseIdentifier(parser, context, tokenIndex);

    switch (token) {
      case Token.StaticKeyword:
        if (!isStatic && parser.token !== Token.LeftParen) {
          return parseClassElementList(parser, context, inheritedContext, type, decorators, 1, inGroup, start);
        }
        break;

      case Token.AsyncKeyword:
        if (parser.token !== Token.LeftParen && (parser.flags & Flags.NewLine) < 1) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex);
          }

          kind |= PropertyKind.Async | (optionalBit(parser, context, Token.Multiply) ? PropertyKind.Generator : 0);
        }
        break;

      case Token.GetKeyword:
        if (parser.token !== Token.LeftParen) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex);
          }
          kind |= PropertyKind.Getter;
        }
        break;

      case Token.SetKeyword:
        if (parser.token !== Token.LeftParen) {
          if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
            return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex);
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
    key = parseLiteral(parser, context, tokenIndex);
  } else if (token === Token.Multiply) {
    kind |= PropertyKind.Generator;
    nextToken(parser, context); // skip: '*'
  } else if (context & Context.OptionsNext && parser.token === Token.PrivateField) {
    kind |= PropertyKind.PrivateField;
    key = parsePrivateName(parser, context, tokenIndex);
    context = context | Context.InClass;
  } else if (context & Context.OptionsNext && (parser.token & Token.IsClassField) === Token.IsClassField) {
    kind |= PropertyKind.ClassField;
    context = context | Context.InClass;
  } else {
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);
  }

  if (kind & (PropertyKind.Generator | PropertyKind.Async | PropertyKind.GetSet)) {
    if (parser.token & Token.IsIdentifier) {
      key = parseIdentifier(parser, context, parser.tokenIndex);
    } else if ((parser.token & Token.IsStringOrNumber) === Token.IsStringOrNumber) {
      key = parseLiteral(parser, context, parser.tokenIndex);
    } else if (parser.token === Token.LeftBracket) {
      kind |= PropertyKind.Computed;
      key = parseComputedPropertyName(parser, context, /* inGroup */ 0);
    } else if (context & Context.OptionsNext && parser.token === Token.PrivateField) {
      kind |= PropertyKind.PrivateField;
      key = parsePrivateName(parser, context, tokenIndex);
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
    return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex);
  }

  const value = parseMethodDefinition(parser, context, kind, parser.tokenIndex);

  return context & Context.OptionsNext
    ? finishNode(parser, context, start, {
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
      } as any)
    : finishNode(parser, context, start, {
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
      } as any);
}

/**
 * Parses private name
 *
 * @param parser Parser object
 * @param context Context masks
 */
function parsePrivateName(parser: ParserState, context: Context, start: number): ESTree.PrivateName {
  // PrivateName::
  //    #IdentifierName
  nextToken(parser, context); // skip: '#'
  const { tokenValue: name } = parser;
  if (name === 'constructor') report(parser, Errors.InvalidStaticClassFieldConstructor);
  nextToken(parser, context);

  return finishNode(parser, context, start, {
    type: 'PrivateName',
    name
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
  start: number
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

    const idxAfterAssign = parser.tokenIndex;

    if (parser.token === Token.Arguments) report(parser, Errors.StrictEvalArguments);

    value = parsePrimaryExpressionExtended(
      parser,
      context | Context.InClass,
      BindingType.None,
      0,
      1,
      0,
      idxAfterAssign
    );

    if ((parser.token & Token.IsClassField) !== Token.IsClassField) {
      value = parseMemberOrUpdateExpression(parser, context | Context.InClass, value as any, 0, 0, 0, idxAfterAssign);
      if ((parser.token & Token.IsClassField) !== Token.IsClassField) {
        value = parseAssignmentExpression(parser, context | Context.InClass, 0, idxAfterAssign, value as any);
      }
    }
  }

  return finishNode(parser, context, start, {
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
 * @param type Binding type
 */
export function parseBindingPattern(
  parser: ParserState,
  context: Context,
  type: BindingType,
  start: number
): ESTree.Pattern | ESTree.Identifier {
  // Pattern ::
  //   Identifier
  //   ArrayLiteral
  //   ObjectLiteral

  if (parser.token & Token.IsIdentifier) return parseAndClassifyIdentifier(parser, context, type, start);

  if ((parser.token & Token.IsPatternStart) !== Token.IsPatternStart)
    report(parser, Errors.UnexpectedToken, KeywordDescTable[parser.token & Token.Type]);

  const left =
    parser.token === Token.LeftBracket
      ? parseArrayExpressionOrPattern(parser, context, /* skipInitializer */ 1, /* inGroup */ 0, type, start)
      : parseObjectLiteralOrPattern(parser, context, /* skipInitializer */ 1, /* inGroup */ 0, type, start);

  reinterpretToPattern(parser, left);

  if (parser.destructible & DestructuringKind.CannotDestruct) {
    report(parser, Errors.InvalidBindingDestruct);
  }

  if (type && parser.destructible & DestructuringKind.AssignableDestruct) {
    report(parser, Errors.InvalidBindingDestruct);
  }

  return left as any;
}

/**
 * Classify and parse identifier if of valid type
 *
 * @param parser Parser object
 * @param context  Context masks
 * @param type Binding type
 */
function parseAndClassifyIdentifier(
  parser: ParserState,
  context: Context,
  type: BindingType,
  start: number
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
    if (type & (BindingType.Let | BindingType.Const)) report(parser, Errors.InvalidLetConstBinding);
  }
  if (context & (Context.InAwaitContext | Context.Module) && token === Token.AwaitKeyword) {
    report(parser, Errors.AwaitOutsideAsync);
  }
  if (token === Token.EscapedReserved) {
    report(parser, Errors.InvalidEscapedKeyword);
  }

  nextToken(parser, context);
  return finishNode(parser, context, start, {
    type: 'Identifier',
    name: tokenValue
  });
}
