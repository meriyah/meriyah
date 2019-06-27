import { nextToken, skipHashBang } from './lexer';
import { KeywordDescTable } from './token';
import { report, reportAt } from './errors';
import { scanTemplateTail } from './lexer/template';
import { declareName, declareAndDedupe, addBindingToExports, addFunctionName, updateExportsList, verifyArguments, checkConflictingLexicalDeclarations, initblockScope, inheritScope } from './scope';
import { consumeOpt, consume, reinterpretToPattern, validateBindingIdentifier, isStrictReservedWord, optionalBit, consumeSemicolon, isPropertyWithPrivateFieldKey, isValidLabel, validateAndDeclareLabel, finishNode } from './common';
export function create(source, sourceFile) {
    return {
        source,
        flags: 0,
        index: 0,
        line: 1,
        column: 0,
        startIndex: 0,
        end: source.length,
        tokenIndex: 0,
        startColumn: 0,
        colPos: 0,
        linePos: 0,
        startLine: 1,
        sourceFile,
        tokenValue: '',
        token: 1048576,
        tokenRaw: '',
        tokenRegExp: undefined,
        nextCP: source.charCodeAt(0),
        exportedNames: {},
        exportedBindings: {},
        assignable: 1,
        destructible: 0
    };
}
export function parseSource(source, options, context) {
    let sourceFile = '';
    if (options != null) {
        if (options.module)
            context |= 2048;
        if (options.next)
            context |= 1;
        if (options.loc)
            context |= 4;
        if (options.ranges)
            context |= 2;
        if (options.lexical)
            context |= 64;
        if (options.webCompat)
            context |= 256;
        if (options.directives)
            context |= 8 | 512;
        if (options.globalReturn)
            context |= 32;
        if (options.raw)
            context |= 512;
        if (options.parenthesizedExpr)
            context |= 128;
        if (options.impliedStrict)
            context |= 1024;
        if (options.source)
            sourceFile = options.source;
    }
    const parser = create(source, sourceFile);
    skipHashBang(parser);
    const scope = context & 64 ? initblockScope() : {};
    let body = [];
    let sourceType = 'script';
    if (context & 2048) {
        sourceType = 'module';
        body = parseModuleItemList(parser, context | 8192 | 16384, scope);
        if (context & 64) {
            for (const key in parser.exportedBindings) {
                if (key !== '$default' && (scope.var[key] === undefined && scope.lexicals[key] === undefined)) {
                    report(parser, 158, key.slice(1));
                }
            }
        }
    }
    else {
        body = parseStatementList(parser, context | 8192 | 16384, scope);
    }
    const node = {
        type: 'Program',
        sourceType,
        body
    };
    if (context & 2) {
        node.start = 0;
        node.end = source.length;
    }
    if (context & 4) {
        node.loc = {
            start: { line: 1, column: 0 },
            end: { line: parser.line, column: parser.column }
        };
        if (parser.sourceFile) {
            node.loc.source = sourceFile;
        }
    }
    return node;
}
export function parseStatementList(parser, context, scope) {
    nextToken(parser, context | 32768);
    const statements = [];
    while (parser.token === 134283267) {
        const { index, tokenIndex, tokenValue, linePos, colPos, token } = parser;
        const expr = parseLiteral(parser, context, tokenIndex, linePos, colPos);
        if (index - tokenIndex < 13 && tokenValue === 'use strict') {
            if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
                context |= 1024;
            }
        }
        statements.push(parseDirective(parser, context, expr, token, tokenIndex, linePos, colPos));
    }
    while (parser.token !== 1048576) {
        statements.push(parseStatementListItem(parser, context, scope, {}, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    return statements;
}
export function parseModuleItemList(parser, context, scope) {
    nextToken(parser, context | 32768);
    const statements = [];
    if (context & 8) {
        while (parser.token === 134283267) {
            const { index, tokenIndex, tokenValue, linePos, colPos, token } = parser;
            const expr = parseLiteral(parser, context, tokenIndex, linePos, colPos);
            if (index - tokenIndex < 13 && tokenValue === 'use strict') {
                if ((parser.token & 1048576) === 1048576) {
                    context |= 1024;
                }
            }
            statements.push(parseDirective(parser, context, expr, token, tokenIndex, linePos, colPos));
        }
    }
    while (parser.token !== 1048576) {
        statements.push(parseModuleItem(parser, context, scope, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    return statements;
}
export function parseModuleItem(parser, context, scope, start, line, column) {
    switch (parser.token) {
        case 20563:
            return parseExportDeclaration(parser, context, scope, start, line, column);
        case 86105:
            return parseImportDeclaration(parser, context, scope, start, line, column);
        default:
            return parseStatementListItem(parser, context, scope, {}, start, line, column);
    }
}
export function parseStatementListItem(parser, context, scope, labels, start, line, column) {
    switch (parser.token) {
        case 86103:
            return parseFunctionDeclaration(parser, context, scope, 1, 0, 0, start, line, column);
        case 133:
            if (context & 2048)
                return parseDecorators(parser, context);
        case 86093:
            return parseClassDeclaration(parser, context, scope, 0, start, line, column);
        case 268521545:
            return parseLexicalDeclaration(parser, context, scope, 16, 8, start, line, column);
        case 268677192:
            return parseLetIdentOrVarDeclarationStatement(parser, context, scope, start, line, column);
        case 20563:
            report(parser, 111, 'export');
        case 86105:
            nextToken(parser, context);
            switch (parser.token) {
                case 67174411:
                    return parseImportCallDeclaration(parser, context, start, line, column);
                default:
                    report(parser, 111, 'import');
            }
        case 143468:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, labels, 1, start, line, column);
        default:
            return parseStatement(parser, context, scope, labels, 1, start, line, column);
    }
}
export function parseStatement(parser, context, scope, labels, allowFuncDecl, start, line, column) {
    switch (parser.token) {
        case 2162700:
            return parseBlock(parser, context, scope, labels, start, line, column);
        case 268521543:
            return parseVariableStatement(parser, context, scope, 8, start, line, column);
        case 20571:
            return parseReturnStatement(parser, context, start, line, column);
        case 20568:
            return parseIfStatement(parser, context, scope, labels, start, line, column);
        case 20561:
            return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
        case 20577:
            return parseWhileStatement(parser, context, scope, labels, start, line, column);
        case 20566:
            return parseForStatement(parser, context, scope, labels, start, line, column);
        case 86109:
            return parseSwitchStatement(parser, context, scope, labels, start, line, column);
        case -2146435055:
            return parseEmptyStatement(parser, context, start, line, column);
        case 86111:
            return parseThrowStatement(parser, context, start, line, column);
        case 20554:
            return parseBreakStatement(parser, context, labels, start, line, column);
        case 20558:
            return parseContinueStatement(parser, context, labels, start, line, column);
        case 20576:
            return parseTryStatement(parser, context, scope, labels, start, line, column);
        case 20578:
            return parseWithStatement(parser, context, scope, labels, start, line, column);
        case 20559:
            return parseDebuggerStatement(parser, context, start, line, column);
        case 143468:
            return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, labels, 0, start, line, column);
        case 86103:
            report(parser, context & 1024
                ? 81
                : (context & 256) === 0
                    ? 83
                    : 82);
        case 86093:
            report(parser, 84);
        default:
            return parseExpressionOrLabelledStatement(parser, context, scope, labels, allowFuncDecl, start, line, column);
    }
}
export function parseExpressionOrLabelledStatement(parser, context, scope, labels, allowFuncDecl, start, line, column) {
    const { tokenValue, token } = parser;
    let expr;
    switch (token) {
        case 268677192:
            expr = parseIdentifier(parser, context, start, line, column);
            if (context & 1024)
                report(parser, 91);
            if (parser.token === 21)
                return parseLabelledStatement(parser, context, scope, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
            if (parser.token === 69271571) {
                report(parser, 90);
            }
            break;
        default:
            expr = parsePrimaryExpressionExtended(parser, context, 0, 0, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    if (token & 143360 && parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr);
    if (parser.token === -1073741806) {
        expr = parseSequenceExpression(parser, context, start, line, column, expr);
    }
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
export function parseBlock(parser, context, scope, labels, start, line, column) {
    const body = [];
    consume(parser, context | 32768, 2162700);
    if (context & 64)
        scope = inheritScope(scope, 2);
    while (parser.token !== -2146435057) {
        body.push(parseStatementListItem(parser, (context | 16384) ^ 16384, scope, { $: labels }, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    consume(parser, context | 32768, -2146435057);
    return finishNode(parser, context, start, line, column, {
        type: 'BlockStatement',
        body
    });
}
export function parseReturnStatement(parser, context, start, line, column) {
    if ((context & 32) === 0 && context & 8192)
        report(parser, 98);
    nextToken(parser, context | 32768);
    const argument = parser.flags & 1 || parser.token & 1048576
        ? null
        : parseExpressions(parser, context, 1, parser.tokenIndex, parser.line, parser.column);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ReturnStatement',
        argument
    });
}
export function parseExpressionStatement(parser, context, expression, start, line, column) {
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ExpressionStatement',
        expression
    });
}
export function parseLabelledStatement(parser, context, scope, labels, label, expr, token, allowFuncDecl, start, line, column) {
    validateBindingIdentifier(parser, context, 0, token, 1);
    validateAndDeclareLabel(parser, labels, label);
    nextToken(parser, context | 32768);
    const body = allowFuncDecl &&
        (context & 1024) === 0 &&
        context & 256 &&
        parser.token === 86103
        ? parseFunctionDeclaration(parser, context, scope, 0, 0, 0, parser.tokenIndex, parser.linePos, parser.colPos)
        : parseStatement(parser, (context | 16384) ^ 16384, scope, labels, allowFuncDecl, parser.tokenIndex, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'LabeledStatement',
        label: expr,
        body
    });
}
export function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, labels, allowFuncDecl, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, start, line, column);
    if (parser.token === 21) {
        return parseLabelledStatement(parser, context, scope, labels, tokenValue, expr, token, 1, start, line, column);
    }
    const asyncNewLine = parser.flags & 1;
    if (!asyncNewLine) {
        if (parser.token === 86103) {
            if (!allowFuncDecl)
                report(parser, 135);
            return parseFunctionDeclaration(parser, context, scope, 1, 0, 1, start, line, column);
        }
        if ((parser.token & 143360) === 143360) {
            if (parser.assignable & 2)
                report(parser, 48);
            if (parser.token === 209005)
                report(parser, 30);
            if (context & (1024 | 2097152) && parser.token === 241770) {
                report(parser, 31);
            }
            if ((parser.token & 537079808) === 537079808)
                parser.flags |= 128;
            if (context & 64) {
                scope = inheritScope(initblockScope(), 16);
                declareAndDedupe(parser, context, scope, parser.tokenValue, 2, 0);
            }
            const param = [parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos)];
            expr = parseArrowFunctionExpression(parser, context, scope, param, 1, start, line, column);
            if (parser.token === -1073741806)
                expr = parseSequenceExpression(parser, context, start, line, column, expr);
            return parseExpressionStatement(parser, context, expr, start, line, column);
        }
    }
    if (parser.token === 67174411) {
        expr = parseAsyncArrowOrCallExpression(parser, (context | 134217728) ^ 134217728, expr, 1, asyncNewLine, start, line, column);
    }
    else {
        if (parser.token === 10) {
            if (context & 64) {
                scope = inheritScope(initblockScope(), 16);
                declareAndDedupe(parser, context, scope, 'async', 2, 0);
            }
            expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
        }
        parser.assignable = 1;
    }
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    if (parser.token === -1073741806)
        expr = parseSequenceExpression(parser, context, start, line, column, expr);
    expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr);
    parser.assignable = 1;
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
export function parseDirective(parser, context, expression, token, start, line, column) {
    const { tokenRaw } = parser;
    if (token !== -2146435055) {
        parser.assignable = 2;
        expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
        if (parser.token !== -2146435055) {
            expression = parseAssignmentExpression(parser, context, 0, start, line, column, expression);
            if (parser.token === -1073741806) {
                expression = parseSequenceExpression(parser, context, start, line, column, expression);
            }
        }
        consumeSemicolon(parser, context | 32768);
    }
    return context & 8
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
export function parseEmptyStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'EmptyStatement'
    });
}
export function parseThrowStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    if (parser.flags & 1)
        report(parser, 96);
    const argument = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ThrowStatement',
        argument
    });
}
export function parseIfStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    parser.assignable = 1;
    const test = parseExpressions(parser, context, 1, parser.tokenIndex, parser.line, parser.colPos);
    consume(parser, context | 32768, 1073741840);
    const consequent = parseConsequentOrAlternate(parser, (context | 16384) ^ 16384, scope, labels, parser.tokenIndex, parser.linePos, parser.colPos);
    let alternate = null;
    if (parser.token === 20562) {
        nextToken(parser, context | 32768);
        alternate = parseConsequentOrAlternate(parser, (context | 16384) ^ 16384, scope, labels, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'IfStatement',
        test,
        consequent,
        alternate
    });
}
export function parseConsequentOrAlternate(parser, context, scope, labels, start, line, column) {
    return context & 1024 ||
        (context & 256) === 0 ||
        parser.token !== 86103
        ? parseStatement(parser, context, scope, { $: labels }, 0, parser.tokenIndex, parser.linePos, parser.colPos)
        : parseFunctionDeclaration(parser, context, scope, 0, 0, 0, start, line, column);
}
export function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const discriminant = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context, 1073741840);
    consume(parser, context, 2162700);
    const cases = [];
    let seenDefault = 0;
    if (context & 64)
        scope = inheritScope(scope, 8);
    while (parser.token !== -2146435057) {
        const { tokenIndex, linePos, colPos } = parser;
        let test = null;
        const consequent = [];
        if (consumeOpt(parser, context | 32768, 20555)) {
            test = parseExpressions(parser, (context | 134217728) ^ 134217728, 1, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        else {
            consume(parser, context | 32768, 20560);
            if (seenDefault)
                report(parser, 95);
            seenDefault = 1;
        }
        consume(parser, context | 32768, 21);
        while (parser.token !== 20555 &&
            parser.token !== -2146435057 &&
            parser.token !== 20560) {
            consequent.push(parseStatementListItem(parser, (context | 4096 | 16384) ^ 16384, scope, {
                $: labels
            }, parser.tokenIndex, parser.linePos, parser.colPos));
        }
        cases.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
            type: 'SwitchCase',
            test,
            consequent
        }));
    }
    consume(parser, context | 32768, -2146435057);
    return finishNode(parser, context, start, line, column, {
        type: 'SwitchStatement',
        discriminant,
        cases
    });
}
export function parseWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1073741840);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'WhileStatement',
        test,
        body
    });
}
export function parseIterationStatementBody(parser, context, scope, labels) {
    return parseStatement(parser, ((context | 16384 | 134217728) ^ (16384 | 134217728)) | 131072, scope, { loop: 1, $: labels }, 0, parser.tokenIndex, parser.linePos, parser.colPos);
}
export function parseContinueStatement(parser, context, labels, start, line, column) {
    if ((context & 131072) === 0)
        report(parser, 69);
    nextToken(parser, context);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue, tokenIndex, linePos, colPos } = parser;
        label = parseIdentifier(parser, context | 32768, tokenIndex, linePos, colPos);
        if (!isValidLabel(parser, labels, tokenValue, 1))
            report(parser, 150, tokenValue);
    }
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ContinueStatement',
        label
    });
}
export function parseBreakStatement(parser, context, labels, start, line, column) {
    nextToken(parser, context | 32768);
    let label = null;
    if ((parser.flags & 1) === 0 && parser.token & 143360) {
        const { tokenValue, tokenIndex, linePos, colPos } = parser;
        label = parseIdentifier(parser, context | 32768, tokenIndex, linePos, colPos);
        if (!isValidLabel(parser, labels, tokenValue, 0))
            report(parser, 150, tokenValue);
    }
    else if ((context & (4096 | 131072)) === 0) {
        report(parser, 70);
    }
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'BreakStatement',
        label
    });
}
export function parseWithStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    if (context & 1024)
        report(parser, 97);
    consume(parser, context | 32768, 67174411);
    const object = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1073741840);
    const body = parseStatement(parser, (context | 16384) ^ 16384, scope, labels, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'WithStatement',
        object,
        body
    });
}
export function parseDebuggerStatement(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'DebuggerStatement'
    });
}
export function parseTryStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const isLexical = context & 64;
    const block = parseBlock(parser, context, scope, { $: labels }, parser.tokenIndex, parser.linePos, parser.colPos);
    const { tokenIndex, linePos, colPos } = parser;
    const handler = consumeOpt(parser, context | 32768, 20556)
        ? parseCatchBlock(parser, context, scope, labels, isLexical, tokenIndex, linePos, colPos)
        : null;
    let finalizer = null;
    if (parser.token === 20565) {
        nextToken(parser, context | 32768);
        finalizer = parseBlock(parser, context, scope, { $: labels }, tokenIndex, linePos, colPos);
    }
    if (!handler && !finalizer) {
        report(parser, 94);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'TryStatement',
        block,
        handler,
        finalizer
    });
}
export function parseCatchBlock(parser, context, scope, labels, isLexical, start, line, column) {
    let param = null;
    if (consumeOpt(parser, context, 67174411)) {
        if (isLexical)
            scope = inheritScope(scope, 4);
        param = parseBindingPattern(parser, context, scope, 0, 0, 2, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        if (isLexical)
            checkConflictingLexicalDeclarations(parser, context, scope, 0);
        if (parser.token === -1073741806) {
            report(parser, 92);
        }
        else if (parser.token === -2143289315) {
            report(parser, 93);
        }
        consume(parser, context | 32768, 1073741840);
    }
    const body = parseBlock(parser, context, scope, { $: labels }, parser.tokenIndex, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'CatchClause',
        param,
        body
    });
}
export function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context | 32768);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    consume(parser, context, 20577);
    consume(parser, context | 32768, 67174411);
    const test = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1073741840);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'DoWhileStatement',
        body,
        test
    });
}
export function parseLetIdentOrVarDeclarationStatement(parser, context, scope, start, line, column) {
    const { token, tokenValue } = parser;
    let expr = parseIdentifier(parser, context, start, line, column);
    if ((parser.token & (143360 | 2097152)) === 0) {
        parser.assignable = 1;
        if (context & 1024)
            report(parser, 91);
        if (parser.token === 21) {
            return parseLabelledStatement(parser, context, scope, {}, tokenValue, expr, token, 0, start, line, column);
        }
        expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
        expr = parseAssignmentExpression(parser, context, 0, start, line, column, expr);
        if (parser.token === -1073741806) {
            expr = parseSequenceExpression(parser, context, start, line, column, expr);
        }
        return parseExpressionStatement(parser, context, expr, start, line, column);
    }
    const declarations = parseVariableDeclarationList(parser, context, scope, 1, 0, 8, 8);
    if (context & 64)
        checkConflictingLexicalDeclarations(parser, context, scope, 1);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: 'let',
        declarations
    });
}
function parseLexicalDeclaration(parser, context, scope, type, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, 0, 0, type, origin);
    if (context & 64)
        checkConflictingLexicalDeclarations(parser, context, scope, 1);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: type & 8 ? 'let' : 'const',
        declarations
    });
}
export function parseVariableStatement(parser, context, scope, origin, start, line, column) {
    nextToken(parser, context);
    const declarations = parseVariableDeclarationList(parser, context, scope, 0, 1, 1, origin);
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations
    });
}
export function parseVariableDeclarationList(parser, context, scope, verifyDuplicates, isVarDecl, type, origin) {
    let bindingCount = 1;
    const list = [
        parseVariableDeclaration(parser, context, scope, verifyDuplicates, isVarDecl, type, origin)
    ];
    while (consumeOpt(parser, context, -1073741806)) {
        bindingCount++;
        list.push(parseVariableDeclaration(parser, context, scope, verifyDuplicates, isVarDecl, type, origin));
    }
    if (bindingCount > 1 && origin & 4 && parser.token & 262144) {
        report(parser, 62, KeywordDescTable[parser.token & 255]);
    }
    return list;
}
function parseVariableDeclaration(parser, context, scope, verifyDuplicates, isVarDecl, type, origin) {
    const { token, tokenIndex, linePos, colPos } = parser;
    let init = null;
    const id = parseBindingPattern(parser, context, scope, verifyDuplicates, isVarDecl, type, origin, tokenIndex, linePos, colPos);
    if (parser.token === -2143289315) {
        nextToken(parser, context | 32768);
        init = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        if (origin & 4 || (token & 2097152) === 0) {
            if (parser.token === 274546 ||
                (parser.token === 8738609 &&
                    (token & 2097152 ||
                        (type & 1) === 0 ||
                        (context & 256) === 0 ||
                        context & 1024))) {
                reportAt(tokenIndex, parser.line, parser.index - 3, 61, parser.token === 274546 ? 'of' : 'in');
            }
        }
    }
    else if ((type & 16 || (token & 2097152) > 0) &&
        (parser.token & 262144) !== 262144) {
        report(parser, 60, type & 16 ? 'const' : 'destructuring');
    }
    return finishNode(parser, context, tokenIndex, linePos, colPos, {
        type: 'VariableDeclarator',
        init,
        id
    });
}
export function parseForStatement(parser, context, scope, labels, start, line, column) {
    nextToken(parser, context);
    const forAwait = (context & 4194304) > 0 && consumeOpt(parser, context, 209005);
    consume(parser, context | 32768, 67174411);
    if (context & 64)
        scope = inheritScope(scope, 1);
    let test = null;
    let update = null;
    let destructible = 0;
    let init = null;
    let isVarDecl = parser.token & 268435456;
    let right;
    const { token, tokenIndex, linePos, colPos } = parser;
    if (isVarDecl) {
        if (token === 268677192) {
            init = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
            if (parser.token & (143360 | 2097152)) {
                if (parser.token === 8738609) {
                    if (context & 1024)
                        report(parser, 68);
                }
                else {
                    init = finishNode(parser, context, tokenIndex, linePos, colPos, {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 1, 0, 8, 4)
                    });
                }
                if (context & 64)
                    checkConflictingLexicalDeclarations(parser, context, scope, 1);
                parser.assignable = 1;
            }
            else if (context & 1024) {
                report(parser, 68);
            }
            else {
                isVarDecl = 0;
                parser.assignable = 1;
                init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenIndex, linePos, colPos);
                if (parser.token === 274546)
                    report(parser, 125);
            }
        }
        else {
            nextToken(parser, context);
            const kind = KeywordDescTable[token & 255];
            init = finishNode(parser, context, tokenIndex, linePos, colPos, kind === 'var'
                ? {
                    type: 'VariableDeclaration',
                    kind,
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 0, 1, 1, 4)
                }
                : {
                    type: 'VariableDeclaration',
                    kind,
                    declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 0, 0, 16, 4)
                });
            if (context & 64 && kind === 'const')
                checkConflictingLexicalDeclarations(parser, context, scope, 1);
            parser.assignable = 1;
        }
    }
    else if (token === -2146435055) {
        if (forAwait)
            report(parser, 88);
    }
    else if ((token & 2097152) === 2097152) {
        init =
            token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 0, 4, tokenIndex, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 0, 4, tokenIndex, linePos, colPos);
        destructible = parser.destructible;
        if (context & 256 && destructible & 64) {
            report(parser, 64);
        }
        parser.assignable =
            destructible & 16 ? 2 : 1;
        init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    else {
        init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, tokenIndex, linePos, colPos);
    }
    if ((parser.token & 262144) === 262144) {
        const isOf = parser.token === 274546;
        if (parser.assignable & 2) {
            report(parser, 86, isOf && forAwait ? 'await' : isOf ? 'of' : 'in');
        }
        reinterpretToPattern(parser, init);
        nextToken(parser, context | 32768);
        if (!isOf) {
            if (forAwait)
                report(parser, 88);
            right = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        else {
            right = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        consume(parser, context | 32768, 1073741840);
        const body = parseIterationStatementBody(parser, context, scope, labels);
        return isOf
            ? finishNode(parser, context, start, line, column, {
                type: 'ForOfStatement',
                body,
                left: init,
                right,
                await: forAwait
            })
            : finishNode(parser, context, start, line, column, {
                type: 'ForInStatement',
                body,
                left: init,
                right
            });
    }
    if (forAwait) {
        report(parser, 88);
    }
    if (!isVarDecl) {
        if (destructible & 8 && parser.token !== -2143289315) {
            report(parser, 134);
        }
        init = parseAssignmentExpression(parser, context | 134217728, 0, tokenIndex, linePos, colPos, init);
    }
    if (parser.token === -1073741806)
        init = parseSequenceExpression(parser, context, parser.tokenIndex, parser.linePos, parser.colPos, init);
    consume(parser, context | 32768, -2146435055);
    if (parser.token !== -2146435055)
        test = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, -2146435055);
    if (parser.token !== 1073741840)
        update = parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 1073741840);
    const body = parseIterationStatementBody(parser, context, scope, labels);
    return finishNode(parser, context, start, line, column, {
        type: 'ForStatement',
        body,
        init,
        test,
        update
    });
}
function parseImportDeclaration(parser, context, scope, start, line, column) {
    nextToken(parser, context);
    let source;
    const isLexical = (context & 64) === 0 ? 0 : 1;
    if (parser.token === 67174411)
        return parseImportCallDeclaration(parser, context, start, line, column);
    const { tokenIndex, linePos, colPos } = parser;
    const specifiers = [];
    if (parser.token === 134283267) {
        source = parseLiteral(parser, context, tokenIndex, linePos, colPos);
    }
    else {
        if (parser.token & 143360) {
            validateBindingIdentifier(parser, context, 16, parser.token, 0);
            if (isLexical)
                declareName(parser, context, scope, parser.tokenValue, 16, 1, 0);
            const local = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
            specifiers.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
                type: 'ImportDefaultSpecifier',
                local
            }));
            if (consumeOpt(parser, context, -1073741806)) {
                switch (parser.token) {
                    case 8456755:
                        parseImportNamespaceSpecifier(parser, context, scope, isLexical, specifiers);
                        break;
                    case 2162700:
                        parseImportSpecifierOrNamedImports(parser, context, scope, isLexical, specifiers);
                        break;
                    default:
                        report(parser, 117);
                }
            }
        }
        else if (parser.token === 8456755) {
            parseImportNamespaceSpecifier(parser, context, scope, isLexical, specifiers);
        }
        else if (parser.token === 2162700) {
            parseImportSpecifierOrNamedImports(parser, context, scope, isLexical, specifiers);
        }
        else
            report(parser, 29, KeywordDescTable[parser.token & 255]);
        source = parseModuleSpecifier(parser, context);
    }
    consumeSemicolon(parser, context | 32768);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportDeclaration',
        specifiers,
        source
    });
}
function parseImportNamespaceSpecifier(parser, context, scope, isLexical, specifiers) {
    const { tokenIndex, linePos, colPos } = parser;
    nextToken(parser, context);
    consume(parser, context, 12395);
    if (parser.token & (143360 | 12288)) {
        validateBindingIdentifier(parser, context, 16, parser.token, 0);
    }
    else {
        reportAt(tokenIndex, parser.line, parser.index, 29, KeywordDescTable[parser.token & 255]);
    }
    if (isLexical)
        declareName(parser, context, scope, parser.tokenValue, 16, 1, 0);
    const local = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
    specifiers.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
        type: 'ImportNamespaceSpecifier',
        local
    }));
}
function parseModuleSpecifier(parser, context) {
    consumeOpt(parser, context, 12401);
    if (parser.token !== 134283267)
        report(parser, 115, 'Import');
    return parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
}
function parseImportSpecifierOrNamedImports(parser, context, scope, isLexical, specifiers) {
    nextToken(parser, context);
    while (parser.token & 143360) {
        let { token, tokenValue, tokenIndex, linePos, colPos } = parser;
        const imported = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
        let local;
        if (consumeOpt(parser, context, 12395)) {
            if ((parser.token & 134217728) === 134217728 || parser.token === -1073741806) {
                report(parser, 116);
            }
            else {
                validateBindingIdentifier(parser, context, 16, parser.token, 0);
            }
            tokenValue = parser.tokenValue;
            local = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        else {
            validateBindingIdentifier(parser, context, 16, token, 0);
            local = imported;
        }
        if (isLexical)
            declareName(parser, context, scope, tokenValue, 16, 1, 0);
        specifiers.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
            type: 'ImportSpecifier',
            local,
            imported
        }));
        if (parser.token !== -2146435057)
            consume(parser, context, -1073741806);
    }
    consume(parser, context, -2146435057);
    return specifiers;
}
function parseImportCallDeclaration(parser, context, start, line, column) {
    let expr = parseImportExpression(parser, context, 0, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
    return parseExpressionStatement(parser, context, expr, start, line, column);
}
function parseExportDeclaration(parser, context, scope, start, line, column) {
    nextToken(parser, context | 32768);
    const specifiers = [];
    let declaration = null;
    let source = null;
    let key;
    if (consumeOpt(parser, context | 32768, 20560)) {
        switch (parser.token) {
            case 86103: {
                declaration = parseFunctionDeclaration(parser, context, scope, 1, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
                break;
            }
            case 133:
            case 86093:
                declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenIndex, parser.linePos, parser.colPos);
                break;
            case 143468:
                const idxBeforeAsync = parser.tokenIndex;
                const lineBeforeAsync = parser.linePos;
                const columnBeforeAsync = parser.colPos;
                declaration = parseIdentifier(parser, context, idxBeforeAsync, lineBeforeAsync, columnBeforeAsync);
                const { flags } = parser;
                if ((flags & 1) === 0) {
                    if (parser.token === 86103) {
                        declaration = parseFunctionDeclaration(parser, context, scope, 1, 1, 1, idxBeforeAsync, lineBeforeAsync, columnBeforeAsync);
                    }
                    else {
                        if (parser.token === 67174411) {
                            declaration = parseAsyncArrowOrCallExpression(parser, (context | 134217728) ^ 134217728, declaration, 1, flags, idxBeforeAsync, lineBeforeAsync, columnBeforeAsync);
                            declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, idxBeforeAsync, lineBeforeAsync, columnBeforeAsync);
                            declaration = parseAssignmentExpression(parser, context, 0, parser.tokenIndex, lineBeforeAsync, columnBeforeAsync, declaration);
                        }
                        else if (parser.token & 143360) {
                            if (context & 64) {
                                scope = inheritScope(initblockScope(), 16);
                                declareAndDedupe(parser, context, scope, parser.tokenValue, 2, 0);
                            }
                            declaration = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                            declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, idxBeforeAsync, lineBeforeAsync, columnBeforeAsync);
                        }
                    }
                }
                break;
            default:
                declaration = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
                consumeSemicolon(parser, context | 32768);
        }
        if (context & 64)
            updateExportsList(parser, 'default');
        return finishNode(parser, context, start, line, column, {
            type: 'ExportDefaultDeclaration',
            declaration
        });
    }
    switch (parser.token) {
        case 8456755: {
            let ecma262PR = 0;
            nextToken(parser, context);
            if (context & 1 && consumeOpt(parser, context, 12395)) {
                ecma262PR = 1;
                specifiers.push(finishNode(parser, context, parser.tokenIndex, parser.linePos, parser.colPos, {
                    type: 'ExportNamespaceSpecifier',
                    specifier: parseIdentifier(parser, context, start, line, column)
                }));
            }
            consume(parser, context, 12401);
            if (parser.token !== 134283267)
                report(parser, 115, 'Export');
            source = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
            consumeSemicolon(parser, context | 32768);
            return finishNode(parser, context, start, line, column, ecma262PR
                ? {
                    type: 'ExportNamedDeclaration',
                    source,
                    specifiers
                }
                : {
                    type: 'ExportAllDeclaration',
                    source
                });
        }
        case 2162700: {
            nextToken(parser, context);
            const tmpExportedNames = [];
            const tmpExportedBindings = [];
            while (parser.token & 143360) {
                const { tokenIndex, tokenValue, linePos, colPos } = parser;
                const local = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
                let exported;
                if (parser.token === 12395) {
                    nextToken(parser, context);
                    if (context & 64) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(tokenValue);
                    }
                    exported = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else {
                    if (context & 64) {
                        tmpExportedNames.push(parser.tokenValue);
                        tmpExportedBindings.push(parser.tokenValue);
                    }
                    exported = local;
                }
                specifiers.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
                    type: 'ExportSpecifier',
                    local,
                    exported
                }));
                if (parser.token !== -2146435057)
                    consume(parser, context, -1073741806);
            }
            consume(parser, context, -2146435057);
            if (consumeOpt(parser, context, 12401)) {
                if (parser.token !== 134283267)
                    report(parser, 115, 'Export');
                source = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
            }
            else if (context & 64) {
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
            consumeSemicolon(parser, context | 32768);
            break;
        }
        case 86093:
            declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenIndex, parser.linePos, parser.colPos);
            break;
        case 86103:
            declaration = parseFunctionDeclaration(parser, context, scope, 1, 2, 0, parser.tokenIndex, parser.linePos, parser.colPos);
            break;
        case 268677192:
            declaration = parseLexicalDeclaration(parser, context, scope, 8, 16, parser.tokenIndex, parser.linePos, parser.colPos);
            break;
        case 268521545:
            declaration = parseLexicalDeclaration(parser, context, scope, 16, 16, parser.tokenIndex, parser.linePos, parser.colPos);
            break;
        case 268521543:
            declaration = parseVariableStatement(parser, context, scope, 16, parser.tokenIndex, parser.linePos, parser.colPos);
            break;
        case 143468:
            const idxAfterAsync = parser.tokenIndex;
            const lineAfterAsync = parser.linePos;
            const columnxAfterAsync = parser.colPos;
            nextToken(parser, context);
            if ((parser.flags & 1) === 0 && parser.token === 86103) {
                declaration = parseFunctionDeclaration(parser, context, scope, 1, 2, 1, idxAfterAsync, lineAfterAsync, columnxAfterAsync);
                if (context & 64) {
                    key = declaration.id ? declaration.id.name : '';
                    addBindingToExports(parser, key);
                    updateExportsList(parser, key);
                }
                break;
            }
        default:
            report(parser, 29, KeywordDescTable[parser.token & 255]);
    }
    return finishNode(parser, context, start, line, column, {
        type: 'ExportNamedDeclaration',
        source,
        specifiers,
        declaration
    });
}
export function parseExpression(parser, context, assignable, inGroup, start, line, column) {
    const expr = parseLeftHandSideExpression(parser, context, assignable, inGroup, start, line, column);
    return parseAssignmentExpression(parser, context, inGroup, start, line, column, expr);
}
export function parseSequenceExpression(parser, context, start, line, column, expr) {
    const expressions = [expr];
    while (consumeOpt(parser, context | 32768, -1073741806)) {
        expressions.push(parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    return finishNode(parser, context, start, line, column, {
        type: 'SequenceExpression',
        expressions
    });
}
export function parseExpressions(parser, context, assignable, start, line, column) {
    const expr = parseExpression(parser, context, assignable, 0, start, line, column);
    return parser.token === -1073741806 ? parseSequenceExpression(parser, context, start, line, column, expr) : expr;
}
export function parseAssignmentExpression(parser, context, inGroup, start, line, column, left) {
    if ((parser.token & 4194304) > 0) {
        if (parser.assignable & 2) {
            report(parser, 24);
        }
        if ((parser.token === -2143289315 && left.type === 'ArrayExpression') ||
            left.type === 'ObjectExpression') {
            reinterpretToPattern(parser, left);
        }
        const assignToken = parser.token;
        nextToken(parser, context | 32768);
        const right = parseExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
        left = finishNode(parser, context, start, line, column, {
            type: 'AssignmentExpression',
            left,
            operator: KeywordDescTable[assignToken & 255],
            right
        });
        parser.assignable = 2;
        return left;
    }
    if ((parser.token & 8454144) > 0) {
        left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, left);
    }
    if (consumeOpt(parser, context | 32768, 22)) {
        left = parseConditionalExpression(parser, context, left, start, line, column);
    }
    return left;
}
export function parseConditionalExpression(parser, context, test, start, line, column) {
    const consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context | 32768, 21);
    parser.assignable = 1;
    const alternate = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ConditionalExpression',
        test,
        consequent,
        alternate
    });
}
export function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, left) {
    const bit = -((context & 134217728) > 0) & 8738609;
    let t;
    let prec;
    parser.assignable = 2;
    while (parser.token & 8454144) {
        t = parser.token;
        prec = t & 3840;
        if (prec + ((t === 8457014) << 8) - ((bit === t) << 12) <= minPrec)
            break;
        nextToken(parser, context | 32768);
        left = finishNode(parser, context, start, line, column, {
            type: t & 524288 ? 'LogicalExpression' : 'BinaryExpression',
            left,
            right: parseBinaryExpression(parser, context, inGroup, parser.tokenIndex, parser.linePos, parser.colPos, prec, parseLeftHandSideExpression(parser, context, 0, inGroup, parser.tokenIndex, parser.linePos, parser.colPos)),
            operator: KeywordDescTable[t & 255]
        });
    }
    if (parser.token === -2143289315)
        report(parser, 24);
    return left;
}
export function parseUnaryExpression(parser, context, start, line, column, inGroup) {
    const unaryOperator = parser.token;
    nextToken(parser, context | 32768);
    const arg = parseLeftHandSideExpression(parser, context, 0, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
    if (parser.token === 8457014)
        report(parser, 32);
    if (context & 1024 && unaryOperator === 16863275) {
        if (arg.type === 'Identifier') {
            report(parser, 132);
        }
        else if (isPropertyWithPrivateFieldKey(arg)) {
            report(parser, 139);
        }
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'UnaryExpression',
        operator: KeywordDescTable[unaryOperator & 255],
        argument: arg,
        prefix: true
    });
}
export function parseYieldExpressionOrIdentifier(parser, context, start, line, column) {
    if (context & 2097152) {
        nextToken(parser, context | 32768);
        if (context & 8388608)
            report(parser, 31);
        if (parser.token === 22)
            report(parser, 136);
        let argument = null;
        let delegate = false;
        if ((parser.flags & 1) < 1) {
            delegate = consumeOpt(parser, context | 32768, 8456755);
            if (parser.token & 65536 || delegate) {
                argument = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
            }
        }
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'YieldExpression',
            argument,
            delegate
        });
    }
    if (context & 1024)
        report(parser, 121, 'Yield');
    return parseIdentifierOrArrow(parser, context, start, line, column);
}
export function parseAwaitExpressionOrIdentifier(parser, context, inNewExpression, start, line, column) {
    if (context & 4194304) {
        if (inNewExpression) {
            report(parser, 85);
        }
        else if (context & 8388608) {
            reportAt(parser.index, parser.line, parser.index, 30);
        }
        nextToken(parser, context | 32768);
        const argument = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'AwaitExpression',
            argument
        });
    }
    if (context & 2048)
        report(parser, 121, 'Await');
    const expr = parseIdentifierOrArrow(parser, context, start, line, column);
    return parseMemberOrUpdateExpression(parser, context, expr, inNewExpression, 0, start, line, column);
}
export function parseFunctionBody(parser, context, scope, origin, firstRestricted) {
    const { tokenIndex, linePos, colPos } = parser;
    consume(parser, context | 32768, 2162700);
    const body = [];
    const prevContext = context;
    if (parser.token !== -2146435057) {
        while (parser.token === 134283267) {
            const { index, tokenIndex, tokenValue, token } = parser;
            const expr = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
            if (index - tokenIndex < 13 && tokenValue === 'use strict') {
                if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
                    context |= 1024;
                    if (parser.flags & 128) {
                        reportAt(parser.index, parser.line, parser.tokenIndex, 67);
                    }
                    if (parser.flags & 64) {
                        reportAt(parser.index, parser.line, parser.tokenIndex, 8);
                    }
                }
            }
            body.push(parseDirective(parser, context, expr, token, tokenIndex, parser.linePos, parser.colPos));
        }
        if (context & 1024 &&
            firstRestricted &&
            ((firstRestricted & 537079808) === 537079808 ||
                (firstRestricted & 36864) === 36864)) {
            report(parser, 39);
        }
        if (context & 64 &&
            (prevContext & 1024) < 1 &&
            context & 1024 &&
            (context & 8192) === 0)
            verifyArguments(parser, scope.lexicals['$']);
    }
    while (parser.token !== -2146435057) {
        body.push(parseStatementListItem(parser, context, scope, {}, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    consume(parser, origin & (2 | 1) ? context | 32768 : context, -2146435057);
    parser.flags &= ~(128 | 64);
    if (parser.token === -2143289315)
        report(parser, 131);
    return finishNode(parser, context, tokenIndex, linePos, colPos, {
        type: 'BlockStatement',
        body
    });
}
export function parseSuperExpression(parser, context, start, line, column) {
    nextToken(parser, context);
    switch (parser.token) {
        case 67174411: {
            if ((context & 524288) === 0)
                report(parser, 27);
            if (context & 268435456)
                report(parser, 159);
            parser.assignable = 2;
            break;
        }
        case 69271571:
        case 67108877: {
            if ((context & 262144) === 0)
                report(parser, 28);
            if (context & 268435456)
                report(parser, 159);
            parser.assignable = 1;
            break;
        }
        default:
            report(parser, 29, 'super');
    }
    return finishNode(parser, context, start, line, column, { type: 'Super' });
}
export function parseLeftHandSideExpression(parser, context, allowAssign, inGroup, start, line, column) {
    const expression = parsePrimaryExpressionExtended(parser, context, 0, 0, allowAssign, inGroup, start, line, column);
    return parseMemberOrUpdateExpression(parser, context, expression, 0, inGroup, start, line, column);
}
export function parseMemberOrUpdateExpression(parser, context, expr, inNewExpression, inGroup, start, line, column) {
    if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) === 0) {
        if (parser.assignable & 2)
            report(parser, 56);
        const { token } = parser;
        nextToken(parser, context);
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'UpdateExpression',
            argument: expr,
            operator: KeywordDescTable[token & 255],
            prefix: false
        });
    }
    context = context & ~134217728;
    if ((parser.token & 67108864) === 67108864) {
        if (parser.token === 67108877) {
            nextToken(parser, context);
            if ((parser.token & (143360 | 4096)) === 0 && parser.token !== 131) {
                report(parser, 29, KeywordDescTable[parser.token & 255]);
            }
            parser.assignable = 1;
            const property = context & 1 && parser.token === 131
                ? parsePrivateName(parser, context, parser.tokenIndex, parser.linePos, parser.colPos)
                : parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
            expr = finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: false,
                property
            });
        }
        else if (parser.token === 69271571) {
            nextToken(parser, context | 32768);
            const idxAfterLeftBracket = parser.tokenIndex;
            const lineAfterLeftBracket = parser.linePos;
            const columnAfterLeftBracket = parser.colPos;
            let property = parseExpression(parser, context, 1, inGroup, idxAfterLeftBracket, lineAfterLeftBracket, columnAfterLeftBracket);
            if (parser.token === -1073741806)
                property = parseSequenceExpression(parser, context, idxAfterLeftBracket, lineAfterLeftBracket, columnAfterLeftBracket, property);
            consume(parser, context, 20);
            parser.assignable = 1;
            expr = finishNode(parser, context, start, line, column, {
                type: 'MemberExpression',
                object: expr,
                computed: true,
                property
            });
        }
        else if (inNewExpression) {
            parser.assignable = 2;
            return expr;
        }
        else if (parser.token === 67174411) {
            const args = parseArguments(parser, (context | 134217728) ^ 134217728, inGroup);
            parser.assignable = 2;
            expr = finishNode(parser, context, start, line, column, {
                type: 'CallExpression',
                callee: expr,
                arguments: args
            });
        }
        else {
            parser.assignable = 2;
            expr = finishNode(parser, context, parser.tokenIndex, parser.linePos, parser.colPos, {
                type: 'TaggedTemplateExpression',
                tag: expr,
                quasi: parser.token === 67174408
                    ? parseTemplate(parser, context | 65536, start, line, column)
                    : parseTemplateLiteral(parser, context, start, line, column)
            });
        }
        return parseMemberOrUpdateExpression(parser, context, expr, inNewExpression, 0, start, line, column);
    }
    else if (inNewExpression) {
        parser.assignable = 2;
    }
    return expr;
}
export function parsePrimaryExpressionExtended(parser, context, type, inNewExpression, allowAssign, inGroup, start, line, column) {
    const { token } = parser;
    if ((token & 16842752) === 16842752) {
        if (inNewExpression && (token !== 16863276 || token !== 16863274)) {
            report(parser, 66, KeywordDescTable[parser.token & 255]);
        }
        parser.assignable = 2;
        return parseUnaryExpression(parser, context, start, line, column, inGroup);
    }
    if ((token & 33619968) === 33619968) {
        if (inNewExpression)
            report(parser, 57);
        const { token } = parser;
        nextToken(parser, context | 32768);
        const arg = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        if (parser.assignable & 2) {
            report(parser, (parser.token & 537079808) === 537079808
                ? 124
                : 56);
        }
        parser.assignable = 2;
        return finishNode(parser, context, start, line, column, {
            type: 'UpdateExpression',
            argument: arg,
            operator: KeywordDescTable[token & 255],
            prefix: true
        });
    }
    if (token === 209005) {
        if (inGroup)
            parser.destructible |= 128;
        return parseAwaitExpressionOrIdentifier(parser, context, inNewExpression, start, line, column);
    }
    if (token === 241770) {
        if (inGroup)
            parser.destructible |= 256;
        if (allowAssign)
            return parseYieldExpressionOrIdentifier(parser, context, start, line, column);
        if (context & ((context & 2097152) | 1024))
            report(parser, 104, 'yield');
        return parseIdentifier(parser, context, start, line, column);
    }
    if (parser.token === 268677192) {
        if (context & 1024)
            report(parser, 123);
        if (type & (8 | 16))
            report(parser, 65);
    }
    if (context & 268435456 && parser.token === 537079925) {
        report(parser, 142);
    }
    if ((token & 143360) === 143360) {
        const tokenValue = parser.tokenValue;
        const expr = parseIdentifier(parser, context | 65536, start, line, column);
        if (token === 143468) {
            return parseAsyncExpression(parser, context, expr, inNewExpression, allowAssign, inGroup, start, line, column);
        }
        if (token === 143478)
            report(parser, 101);
        const IsEvalOrArguments = (token & 537079808) === 537079808;
        if (parser.token === 10) {
            if (IsEvalOrArguments) {
                if (context & 1024)
                    report(parser, 129);
                parser.flags |= 128;
            }
            else {
                parser.flags &= ~128;
            }
            if (!allowAssign)
                report(parser, 58);
            let scope = {};
            if (context & 64) {
                scope = inheritScope(initblockScope(), 16);
                declareAndDedupe(parser, context, scope, tokenValue, 2, 0);
            }
            return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
        }
        parser.assignable =
            context & 1024 && IsEvalOrArguments ? 2 : 1;
        return expr;
    }
    if ((token & 134217728) === 134217728) {
        parser.assignable = 2;
        return parseLiteral(parser, context, start, line, column);
    }
    switch (token) {
        case 86103:
            return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
        case 2162700:
            return parseObjectLiteral(parser, context, allowAssign ? 0 : 1, inGroup, start, line, column);
        case 69271571:
            return parseArrayLiteral(parser, context, allowAssign ? 0 : 1, inGroup, start, line, column);
        case 67174411:
            return parseParenthesizedExpression(parser, context & ~134217728, allowAssign, start, line, column);
        case 131:
            return parsePrivateName(parser, context, start, line, column);
        case 133:
        case 86093:
            return parseClassExpression(parser, context, inGroup, start, line, column);
        case 65540:
            return parseRegExpLiteral(parser, context, start, line, column);
        case 86110:
            return parseThisExpression(parser, context, start, line, column);
        case 86021:
        case 86022:
        case 86023:
            return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
        case 86108:
            return parseSuperExpression(parser, context, start, line, column);
        case 67174409:
            return parseTemplateLiteral(parser, context, start, line, column);
        case 67174408:
            return parseTemplate(parser, context, start, line, column);
        case 86106:
            return parseNewExpression(parser, context, inGroup, start, line, column);
        case 122:
            return parseBigIntLiteral(parser, context, start, line, column);
        case 86105:
            return parseImportCallExpression(parser, context, inNewExpression, inGroup, start, line, column);
        default:
            if (context & 1024
                ? (token & 143360) === 143360 || (token & 12288) === 12288
                : (token & 143360) === 143360 ||
                    (token & 12288) === 12288 ||
                    (token & 36864) === 36864) {
                return parseIdentifierOrArrow(parser, context, start, line, column);
            }
            report(parser, 29, KeywordDescTable[parser.token & 255]);
    }
}
function parseImportCallExpression(parser, context, inNewExpression, inGroup, start, line, column) {
    if (inNewExpression)
        report(parser, 153);
    nextToken(parser, context);
    let expr = parseImportExpression(parser, context, inGroup, start, line, column);
    expr = parseMemberOrUpdateExpression(parser, context, expr, 0, inGroup, start, line, column);
    parser.assignable = 2;
    return expr;
}
export function parseImportExpression(parser, context, inGroup, start, line, column) {
    consume(parser, context, 67174411);
    if (parser.token === 14)
        report(parser, 154);
    const source = parseExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context, 1073741840);
    return finishNode(parser, context, start, line, column, {
        type: 'ImportExpression',
        source
    });
}
export function parseBigIntLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
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
        });
}
export function parseTemplateLiteral(parser, context, start, line, column) {
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateLiteral',
        expressions: [],
        quasis: [parseTemplateTail(parser, context, start, line, column)]
    });
}
export function parseTemplateTail(parser, context, start, line, column) {
    const { tokenValue, tokenRaw } = parser;
    consume(parser, context, 67174409);
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateElement',
        value: {
            cooked: tokenValue,
            raw: tokenRaw
        },
        tail: true
    });
}
export function parseTemplate(parser, context, start, line, column) {
    const quasis = [parseTemplateSpans(parser, context, false, start, line, column)];
    consume(parser, context | 32768, 67174408);
    const expressions = [parseExpressions(parser, context, 1, parser.tokenIndex, parser.linePos, parser.colPos)];
    if (parser.token !== -2146435057)
        report(parser, 89);
    while ((parser.token = scanTemplateTail(parser, context)) !== 67174409) {
        const { tokenIndex, linePos, colPos } = parser;
        quasis.push(parseTemplateSpans(parser, context, false, tokenIndex, linePos, colPos));
        consume(parser, context | 32768, 67174408);
        expressions.push(parseExpressions(parser, context, 1, tokenIndex, linePos, colPos));
    }
    quasis.push(parseTemplateSpans(parser, context, true, parser.tokenIndex, parser.linePos, parser.colPos));
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateLiteral',
        expressions,
        quasis
    });
}
export function parseTemplateSpans(parser, context, tail, start, line, column) {
    return finishNode(parser, context, start, line, column, {
        type: 'TemplateElement',
        value: {
            cooked: parser.tokenValue,
            raw: parser.tokenRaw
        },
        tail
    });
}
function parseArgumentSpread(parser, context, start, line, column) {
    consume(parser, context | 32768, 14);
    const argument = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    parser.assignable = 1;
    return finishNode(parser, context, start, line, column, {
        type: 'SpreadElement',
        argument
    });
}
export function parseArguments(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const args = [];
    if (parser.token === 1073741840) {
        nextToken(parser, context);
        return args;
    }
    while (parser.token !== 1073741840) {
        if (parser.token === 14) {
            args.push(parseArgumentSpread(parser, context, parser.tokenIndex, parser.linePos, parser.colPos));
        }
        else {
            args.push(parseExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos));
        }
        if (parser.token !== -1073741806)
            break;
        nextToken(parser, context | 32768);
        if (parser.token === 1073741840)
            break;
    }
    consume(parser, context, 1073741840);
    return args;
}
export function parseIdentifier(parser, context, start, line, column) {
    const { tokenValue } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: tokenValue
    });
}
export function parseLiteral(parser, context, start, line, column) {
    const { tokenValue, tokenRaw } = parser;
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value: tokenValue,
            raw: tokenRaw
        }
        : {
            type: 'Literal',
            value: tokenValue
        });
}
export function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
    const raw = KeywordDescTable[parser.token & 255];
    const value = parser.token === 86023 ? null : raw === 'true';
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 512
        ? {
            type: 'Literal',
            value,
            raw
        }
        : {
            type: 'Literal',
            value
        });
}
export function parseThisExpression(parser, context, start, line, column) {
    nextToken(parser, context);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ThisExpression'
    });
}
export function parseFunctionDeclaration(parser, context, scope, allowGen, flags, isAsync, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = allowGen ? optionalBit(parser, context, 8456755) : 0;
    let id = null;
    let firstRestricted;
    let innerscope = context & 64 ? initblockScope() : {};
    if (parser.token === 67174411) {
        if ((flags & 1) === 0) {
            report(parser, 38, 'Function');
        }
        if (context & 64)
            addBindingToExports(parser, '');
    }
    else {
        const type = 1 - ((context & 0x1800) === 0x1000) * 8;
        validateBindingIdentifier(parser, context | ((context & 0xc00) << 11), type, parser.token, 0);
        if (context & 64) {
            if (!allowGen)
                scope = inheritScope(scope, 2);
            const mode = context & 16384 && (context & 2048) === 0 ? 1 : 8;
            addFunctionName(parser, context, scope, parser.tokenValue, mode, 1);
            innerscope = inheritScope(innerscope, 2);
            if (flags) {
                if (flags & 1) {
                    addBindingToExports(parser, parser.tokenValue);
                }
                else {
                    updateExportsList(parser, parser.tokenValue);
                }
            }
        }
        firstRestricted = parser.token;
        id = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    context = ((context | 0x1ec0000) ^ 0x1ec0000) | 67108864 | ((isAsync * 2 + isGenerator) << 21);
    if (context & 64)
        innerscope = inheritScope(innerscope, 16);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, innerscope, 0, 2);
    const body = parseFunctionBody(parser, (context | 0x8001000 | 8192 | 4096 | 131072) ^
        (0x8001000 | 8192 | 4096 | 131072), context & 64 ? inheritScope(innerscope, 2) : innerscope, 1, firstRestricted);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionDeclaration',
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1,
        id
    });
}
export function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
    nextToken(parser, context | 32768);
    const isGenerator = optionalBit(parser, context, 8456755);
    const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
    let id = null;
    let firstRestricted;
    let scope = context & 64 ? initblockScope() : {};
    if ((parser.token & (143360 | 4096 | 36864)) > 0) {
        validateBindingIdentifier(parser, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, 1, parser.token, 0);
        if (context & 64) {
            declareAndDedupe(parser, context, scope, parser.tokenValue, 1, 1);
            scope = inheritScope(scope, 2);
        }
        firstRestricted = parser.token;
        id = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    context = ((context | 0x1ec0000) ^ 0x1ec0000) | 67108864 | generatorAndAsyncFlags;
    if (context & 64)
        scope = inheritScope(scope, 16);
    const params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 2);
    const body = parseFunctionBody(parser, context &
        ~(0x8001000 | 8192 | 16384 | 4096 | 131072 | 268435456), 64 ? inheritScope(scope, 2) : scope, 0, firstRestricted);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        params,
        body,
        async: isAsync === 1,
        generator: isGenerator === 1,
        id
    });
}
function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseArrayExpressionOrPattern(parser, context, null, skipInitializer, inGroup, 0, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 64);
    }
    if (parser.destructible & 8) {
        report(parser, 63);
    }
    return expr;
}
export function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, type, origin, start, line, column) {
    nextToken(parser, context | 32768);
    const elements = [];
    let destructible = 0;
    context = context & ~134217728;
    while (parser.token !== 20) {
        if (consumeOpt(parser, context | 32768, -1073741806)) {
            elements.push(null);
        }
        else {
            let left;
            const { token, tokenIndex, linePos, colPos, tokenValue } = parser;
            if (token & 143360) {
                left = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, tokenIndex, linePos, colPos);
                if (consumeOpt(parser, context | 32768, -2143289315)) {
                    if (parser.assignable & 2) {
                        reportAt(parser.index, parser.line, parser.index - 3, 24);
                    }
                    else if (context & 64) {
                        declareName(parser, context, scope, tokenValue, type, 0, 0);
                        if (origin & 16) {
                            updateExportsList(parser, tokenValue);
                            addBindingToExports(parser, tokenValue);
                        }
                    }
                    const right = parseExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                    left = finishNode(parser, context, tokenIndex, linePos, colPos, {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left,
                        right
                    });
                }
                else if (parser.token === -1073741806 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                    else if (context & 64) {
                        declareName(parser, context, scope, tokenValue, type, 0, 0);
                        if (origin & 16) {
                            updateExportsList(parser, tokenValue);
                            addBindingToExports(parser, tokenValue);
                        }
                    }
                }
                else {
                    if (type)
                        destructible |= 16;
                    left = parseMemberOrUpdateExpression(parser, context, left, 0, inGroup, tokenIndex, linePos, colPos);
                    if (parser.assignable & 2)
                        destructible |= 16;
                    if (parser.token !== -1073741806 && parser.token !== 20) {
                        if (parser.token !== -2143289315)
                            destructible |= 16;
                        left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, left);
                    }
                    else if (parser.token !== -2143289315) {
                        destructible |=
                            type || parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
                destructible |=
                    parser.destructible & 256
                        ? 256
                        : 0 | (parser.destructible & 128)
                            ? 128
                            : 0;
            }
            else if (parser.token & 2097152) {
                left =
                    parser.token === 2162700
                        ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, type, origin, tokenIndex, linePos, colPos)
                        : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, type, origin, tokenIndex, linePos, colPos);
                destructible |= parser.destructible;
                parser.assignable =
                    parser.destructible & 16
                        ? 2
                        : 1;
                if (parser.token === -1073741806 || parser.token === 20) {
                    if (parser.assignable & 2) {
                        destructible |= 16;
                    }
                }
                else if (parser.destructible & 8) {
                    report(parser, 72);
                }
                else {
                    left = parseMemberOrUpdateExpression(parser, context, left, 0, inGroup, tokenIndex, linePos, colPos);
                    destructible = parser.assignable & 2 ? 16 : 0;
                    if (parser.token !== -1073741806 && parser.token !== 20) {
                        left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, left);
                    }
                    else if (parser.token !== -2143289315) {
                        destructible |=
                            type || parser.assignable & 2
                                ? 16
                                : 32;
                    }
                }
            }
            else if (parser.token === 14) {
                left = parseSpreadElement(parser, context, scope, 20, type, origin, 0, inGroup, tokenIndex, linePos, colPos);
                destructible |= parser.destructible;
                if (parser.token !== -1073741806 && parser.token !== 20)
                    report(parser, 29, KeywordDescTable[parser.token & 255]);
            }
            else {
                left = parseLeftHandSideExpression(parser, context, 1, 0, tokenIndex, linePos, colPos);
                if (parser.token !== -1073741806 && parser.token !== 20) {
                    left = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, left);
                    if (type && token === 67174411)
                        destructible |= 16;
                }
                else if (parser.assignable & 2) {
                    destructible |= 16;
                }
                else if (token === 67174411) {
                    destructible |=
                        parser.assignable & 1 && !type
                            ? 32
                            : token === 67174411 || parser.assignable & 2
                                ? 16
                                : 0;
                }
            }
            elements.push(left);
            if (consumeOpt(parser, context | 32768, -1073741806)) {
                if (parser.token === 20)
                    break;
            }
            else
                break;
        }
    }
    consume(parser, context, 20);
    const node = finishNode(parser, context, start, line, column, {
        type: 'ArrayExpression',
        elements
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, line, column, node) {
    if (parser.token !== -2143289315)
        report(parser, 24);
    nextToken(parser, context | 32768);
    if (destructible & 16)
        report(parser, 24);
    reinterpretToPattern(parser, node);
    const { tokenIndex, linePos, colPos } = parser;
    const right = parseExpression(parser, (context | 134217728) ^ 134217728, 1, inGroup, tokenIndex, linePos, colPos);
    parser.destructible =
        ((destructible | 64 | 8) ^
            (8 | 64)) |
            (parser.destructible & 128 ? 128 : 0) |
            (parser.destructible & 256 ? 256 : 0);
    return finishNode(parser, context, start, line, column, {
        type: 'AssignmentExpression',
        left: node,
        operator: '=',
        right
    });
}
function parseSpreadElement(parser, context, scope, closingToken, type, origin, isAsync, inGroup, start, line, column) {
    nextToken(parser, context | 32768);
    let argument;
    let destructible = 0;
    const { tokenIndex, linePos, colPos } = parser;
    if (parser.token & (4096 | 143360)) {
        parser.assignable = 1;
        const tokenValue = parser.tokenValue;
        argument = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, tokenIndex, linePos, colPos);
        const { token } = parser;
        argument = parseMemberOrUpdateExpression(parser, context, argument, 0, inGroup, tokenIndex, linePos, colPos);
        if (parser.token !== -1073741806 && parser.token !== closingToken) {
            if (parser.assignable & 2 && parser.token === -2143289315)
                report(parser, 72);
            destructible |= 16;
            argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, argument);
        }
        if (parser.assignable & 2) {
            destructible |= 16;
        }
        else if (token === closingToken || token === -1073741806) {
            if (context & 64) {
                declareName(parser, context, scope, tokenValue, type, 0, 0);
                if (origin & 16) {
                    updateExportsList(parser, tokenValue);
                    addBindingToExports(parser, tokenValue);
                }
            }
        }
        else {
            destructible |= 32;
        }
        destructible |= parser.destructible & 128 ? 128 : 0;
    }
    else if (parser.token === closingToken) {
        report(parser, 40);
    }
    else if (parser.token & 2097152) {
        argument =
            parser.token === 2162700
                ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, type, origin, tokenIndex, linePos, colPos)
                : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, type, origin, tokenIndex, linePos, colPos);
        const { token } = parser;
        if (token !== -2143289315 && token !== closingToken && token !== -1073741806) {
            if (parser.destructible & 8)
                report(parser, 72);
            argument = parseMemberOrUpdateExpression(parser, context, argument, 0, inGroup, tokenIndex, linePos, colPos);
            destructible |= parser.assignable & 2 ? 16 : 0;
            const { token } = parser;
            if (parser.token !== -1073741806 && parser.token !== closingToken) {
                argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, argument);
                if (token !== -2143289315)
                    destructible |= 16;
            }
            else if (token !== -2143289315) {
                destructible |=
                    type || parser.assignable & 2
                        ? 16
                        : 32;
            }
        }
        else {
            destructible |=
                closingToken === -2146435057 && token !== -2143289315
                    ? 16
                    : parser.destructible;
        }
    }
    else {
        if (type)
            report(parser, 41);
        argument = parseLeftHandSideExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
        const { token, tokenIndex } = parser;
        if (token === -2143289315 && token !== closingToken && token !== -1073741806) {
            if (parser.assignable & 2)
                report(parser, 41);
            argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, argument);
            destructible |= 16;
        }
        else {
            if (token === -1073741806) {
                destructible |= 16;
            }
            else if (token !== closingToken) {
                argument = parseAssignmentExpression(parser, context, inGroup, tokenIndex, linePos, colPos, argument);
            }
            destructible |=
                parser.assignable & 1
                    ? 32
                    : 16;
        }
        parser.destructible = destructible;
        return finishNode(parser, context, start, line, column, {
            type: 'SpreadElement',
            argument
        });
    }
    if (parser.token !== closingToken) {
        if (!isAsync && type & 2) {
            report(parser, parser.token === -1073741806
                ? 59
                : parser.token === -2143289315
                    ? 74
                    : 76);
        }
        if (consumeOpt(parser, context | 32768, -2143289315)) {
            if (destructible & 16)
                report(parser, 24);
            reinterpretToPattern(parser, argument);
            const right = parseExpression(parser, context, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
            argument = finishNode(parser, context, tokenIndex, linePos, colPos, {
                type: 'AssignmentExpression',
                left: argument,
                operator: '=',
                right
            });
            destructible = 16;
        }
        destructible |= 16;
    }
    parser.destructible = destructible;
    return finishNode(parser, context, start, line, column, {
        type: 'SpreadElement',
        argument
    });
}
export function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
    context =
        (context & ~((kind & 64) === 0 ? 0x1e80000 : 0xe00000)) | ((kind & 0x58) << 18) | 0x6040000;
    let scope = context & 64 ? inheritScope(initblockScope(), 16) : {};
    const params = parseMethodFormals(parser, context | 8388608, scope, kind, 2, inGroup);
    if (context & 64)
        scope = inheritScope(scope, 2);
    const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0);
    return finishNode(parser, context, start, line, column, {
        type: 'FunctionExpression',
        params,
        body,
        async: (kind & 16) > 0,
        generator: (kind & 8) > 0,
        id: null
    });
}
function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
    const expr = parseObjectLiteralOrPattern(parser, context, null, skipInitializer, inGroup, 0, 0, start, line, column);
    if (context & 256 && parser.destructible & 64) {
        report(parser, 64);
    }
    if (parser.destructible & 8) {
        report(parser, 63);
    }
    return expr;
}
export function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, type, origin, start, line, column) {
    nextToken(parser, context);
    const properties = [];
    let destructible = 0;
    let prototypeCount = 0;
    while (parser.token !== -2146435057) {
        const { token, tokenValue, linePos, colPos, tokenIndex } = parser;
        if (token === 14) {
            properties.push(parseSpreadElement(parser, context, scope, -2146435057, type, origin, 0, inGroup, tokenIndex, linePos, colPos));
        }
        else {
            let state = 0;
            let key = null;
            let value;
            if (token & (143360 | 4096)) {
                key = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
                if (parser.token === -1073741806 || parser.token === -2146435057 || parser.token === -2143289315) {
                    state |= 4;
                    if ((token & 537079808) === 537079808) {
                        if (context & 1024)
                            destructible |= 16;
                    }
                    else {
                        validateBindingIdentifier(parser, context, type, token, 0);
                    }
                    if (context & 64) {
                        declareName(parser, context, scope, tokenValue, type, 0, 0);
                        if (origin & 16) {
                            updateExportsList(parser, tokenValue);
                            addBindingToExports(parser, tokenValue);
                        }
                    }
                    if (consumeOpt(parser, context | 32768, -2143289315)) {
                        destructible |= 8;
                        const right = parseExpression(parser, (context | 134217728) ^ 134217728, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                        destructible |=
                            parser.destructible & 256
                                ? 256
                                : 0 | (parser.destructible & 128)
                                    ? 128
                                    : 0;
                        value = finishNode(parser, context, tokenIndex, linePos, colPos, {
                            type: 'AssignmentPattern',
                            left: key,
                            right
                        });
                    }
                    else {
                        destructible |= token === 209005 ? 128 : 0;
                        value = key;
                    }
                }
                else if (consumeOpt(parser, context | 32768, 21)) {
                    const idxAfterColon = parser.tokenIndex;
                    const lineAfterColon = parser.linePos;
                    const columnAfterColon = parser.colPos;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        const tokenAfterColon = parser.token;
                        const valueAfterColon = parser.tokenValue;
                        value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (token === -2143289315 || token === -2146435057 || token === -1073741806) {
                                destructible |= parser.destructible & 128 ? 128 : 0;
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (context & 64 &&
                                    (tokenAfterColon & 143360) === 143360) {
                                    declareName(parser, context, scope, valueAfterColon, type, 0, 0);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === -2143289315) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                            else if (token !== -2143289315) {
                                destructible |= 32;
                            }
                            else if (context & 64) {
                                declareName(parser, context, scope, valueAfterColon, type, 0, 0);
                            }
                            value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, type, origin, idxAfterColon, lineAfterColon, columnAfterColon)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, type, origin, idxAfterColon, lineAfterColon, columnAfterColon);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16
                                ? 2
                                : 1;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (parser.destructible & 8) {
                            report(parser, 72);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            const { token } = parser;
                            if (token !== -1073741806 && token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context & ~134217728, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                                if (token !== -2143289315)
                                    destructible |= 16;
                            }
                            else if (token !== -2143289315) {
                                destructible |=
                                    type || parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            const { token } = parser;
                            if (token !== -1073741806 && token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context & ~134217728, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                                if (token !== -2143289315)
                                    destructible |= 16;
                            }
                        }
                    }
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    if (token === 143468)
                        state |= 16;
                    state |=
                        (token === 12399
                            ? 256
                            : token === 12400
                                ? 512
                                : 1) | 2;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    destructible |= parser.assignable;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else if (parser.token & (143360 | 4096)) {
                    destructible |= 16;
                    if (token === 143468) {
                        if (parser.flags & 1)
                            report(parser, 144);
                        state |= 16;
                    }
                    key = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    if (token === 143478)
                        report(parser, 128);
                    state |=
                        token === 12399
                            ? 256
                            : token === 12400
                                ? 512
                                : 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else if (parser.token === 67174411) {
                    destructible |= 16;
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else if (parser.token === 8456755) {
                    destructible |= 16;
                    if (token === 143478)
                        report(parser, 22);
                    if (token === 12399 || token === 12400) {
                        report(parser, 42);
                    }
                    nextToken(parser, context);
                    state |=
                        8 | 1 | (token === 143468 ? 16 : 0);
                    if (parser.token & 143360) {
                        key = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    }
                    else if ((parser.token & 134217728) === 134217728) {
                        key = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    }
                    else if (parser.token === 69271571) {
                        state |= 2;
                        key = parseComputedPropertyName(parser, context, inGroup);
                        destructible |= parser.assignable;
                    }
                    else {
                        report(parser, 29, KeywordDescTable[parser.token & 255]);
                    }
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else if ((parser.token & 134217728) === 134217728) {
                    if (token === 143468)
                        state |= 16;
                    state |=
                        token === 12399
                            ? 256
                            : token === 12400
                                ? 512
                                : 1;
                    destructible |= 16;
                    key = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 145);
                }
            }
            else if ((token & 134217728) === 134217728) {
                key = parseLiteral(parser, context, tokenIndex, linePos, colPos);
                if (parser.token === 21) {
                    consume(parser, context | 32768, 21);
                    const idxAfterColon = parser.tokenIndex;
                    const lineAfterColon = parser.linePos;
                    const columnAfterColon = parser.colPos;
                    if (tokenValue === '__proto__')
                        prototypeCount++;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                        const { token, tokenValue: tv } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (token === -2143289315 || token === -2146435057 || token === -1073741806) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (context & 64) {
                                    declareName(parser, context, scope, tv, type, 0, 0);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === -2143289315) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                            value = parseAssignmentExpression(parser, context & ~134217728, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, context & ~134217728, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, type, origin, idxAfterColon, lineAfterColon, columnAfterColon)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, type, origin, idxAfterColon, lineAfterColon, columnAfterColon);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16
                                ? 2
                                : 1;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else if (parser.destructible & 8) {
                            report(parser, 72);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                            destructible = parser.assignable & 2 ? 16 : 0;
                            if (parser.token !== -1073741806 && parser.token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                            }
                            else if (parser.token !== -2143289315) {
                                destructible |=
                                    type || parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, idxAfterColon, lineAfterColon, columnAfterColon);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2) {
                                destructible |= 16;
                            }
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, idxAfterColon, lineAfterColon, columnAfterColon);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            const { token } = parser;
                            if (parser.token !== -1073741806 && parser.token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context & ~134217728, inGroup, idxAfterColon, lineAfterColon, columnAfterColon, value);
                                if (token !== -2143289315)
                                    destructible |= 16;
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                    destructible = parser.assignable | 16;
                }
                else {
                    report(parser, 146);
                }
            }
            else if (token === 69271571) {
                key = parseComputedPropertyName(parser, context, inGroup);
                destructible |= parser.destructible & 256 ? 256 : 0;
                state |= 2;
                if (parser.token === 21) {
                    nextToken(parser, context | 32768);
                    const { tokenIndex, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;
                    if (parser.token & 143360) {
                        value = parsePrimaryExpressionExtended(parser, context, type, 0, 1, inGroup, tokenIndex, linePos, colPos);
                        const { token } = parser;
                        value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, tokenIndex, linePos, colPos);
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (token === -2143289315 || token === -2146435057 || token === -1073741806) {
                                if (parser.assignable & 2) {
                                    destructible |= 16;
                                }
                                else if (context & 64 &&
                                    (tokenAfterColon & 143360) === 143360) {
                                    declareName(parser, context, scope, tokenValue, type, 0, 0);
                                }
                            }
                            else {
                                destructible |=
                                    parser.assignable & 1
                                        ? 32
                                        : 16;
                            }
                        }
                        else if (parser.token === -2143289315) {
                            destructible |=
                                parser.assignable & 2
                                    ? 16
                                    : token === -2143289315
                                        ? 0
                                        : 32;
                            value = parseAssignmentExpression(parser, (context | 134217728) ^ 134217728, inGroup, tokenIndex, linePos, colPos, value);
                        }
                        else {
                            destructible |= 16;
                            value = parseAssignmentExpression(parser, (context | 134217728) ^ 134217728, inGroup, tokenIndex, linePos, colPos, value);
                        }
                    }
                    else if ((parser.token & 2097152) === 2097152) {
                        value =
                            parser.token === 69271571
                                ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, type, origin, tokenIndex, linePos, colPos)
                                : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, type, origin, tokenIndex, linePos, colPos);
                        destructible = parser.destructible;
                        parser.assignable =
                            destructible & 16
                                ? 2
                                : 1;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else if (destructible & 8) {
                            report(parser, 63);
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, tokenIndex, linePos, colPos);
                            destructible =
                                parser.assignable & 2 ? destructible | 16 : 0;
                            const { token } = parser;
                            if (parser.token !== -1073741806 && parser.token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context & ~134217728, inGroup, tokenIndex, linePos, colPos, value);
                                if (token !== -2143289315)
                                    destructible |= 16;
                            }
                            else if (token !== -2143289315) {
                                destructible |=
                                    type || parser.assignable & 2
                                        ? 16
                                        : 32;
                            }
                        }
                    }
                    else {
                        value = parseLeftHandSideExpression(parser, context, 1, 0, tokenIndex, linePos, colPos);
                        destructible |=
                            parser.assignable & 1
                                ? 32
                                : 16;
                        if (parser.token === -1073741806 || parser.token === -2146435057) {
                            if (parser.assignable & 2)
                                destructible |= 16;
                        }
                        else {
                            value = parseMemberOrUpdateExpression(parser, context, value, 0, inGroup, tokenIndex, linePos, colPos);
                            destructible = parser.assignable & 1 ? 0 : 16;
                            const { token } = parser;
                            if (parser.token !== -1073741806 && parser.token !== -2146435057) {
                                value = parseAssignmentExpression(parser, context & ~134217728, inGroup, tokenIndex, linePos, colPos, value);
                                if (token !== -2143289315)
                                    destructible |= 16;
                            }
                        }
                    }
                }
                else if (parser.token === 67174411) {
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, linePos, colPos);
                    destructible = 16;
                }
                else {
                    report(parser, 43);
                }
            }
            else if (token === 8456755) {
                consume(parser, context | 32768, 8456755);
                state |= 8;
                if (parser.token & 143360) {
                    const { token, line, index } = parser;
                    key = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    state |= 1;
                    if (parser.token === 67174411) {
                        destructible |= 16;
                        value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                    }
                    else {
                        reportAt(index, line, index, token === 143468
                            ? 45
                            : token === 12399 || parser.token === 12400
                                ? 44
                                : 46, KeywordDescTable[token & 255]);
                    }
                }
                else if ((parser.token & 134217728) === 134217728) {
                    destructible |= 16;
                    key = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
                    state |= 1;
                    value = parseMethodDefinition(parser, context, state, inGroup, tokenIndex, linePos, colPos);
                }
                else if (parser.token === 69271571) {
                    destructible |= 16;
                    state |= 2 | 1;
                    key = parseComputedPropertyName(parser, context, inGroup);
                    value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
                }
                else {
                    report(parser, 138);
                }
            }
            else {
                report(parser, 29, KeywordDescTable[token & 255]);
            }
            destructible |= parser.destructible & 128 ? 128 : 0;
            parser.destructible = destructible;
            properties.push(finishNode(parser, context, tokenIndex, linePos, colPos, {
                type: 'Property',
                key: key,
                value,
                kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
                computed: (state & 2) > 0,
                method: (state & 1) > 0,
                shorthand: (state & 4) > 0
            }));
        }
        destructible |= parser.destructible;
        if (parser.token !== -1073741806)
            break;
        nextToken(parser, context);
    }
    consume(parser, context, -2146435057);
    if (prototypeCount > 1)
        destructible |= 64;
    const node = finishNode(parser, context, start, line, column, {
        type: 'ObjectExpression',
        properties
    });
    if (!skipInitializer && parser.token & 4194304) {
        return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, start, line, column, node);
    }
    parser.destructible = destructible;
    return node;
}
export function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
    consume(parser, context, 67174411);
    const params = [];
    parser.flags &= ~128;
    let setterArgs = 0;
    if (parser.token === 1073741840) {
        if (kind & 512) {
            report(parser, 36, 'Setter', 'one', '');
        }
        nextToken(parser, context);
        return params;
    }
    if (kind & 256) {
        report(parser, 36, 'Getter', 'no', 's');
    }
    if (kind & 512 && parser.token === 14) {
        report(parser, 37);
    }
    while (parser.token !== 1073741840) {
        let left;
        const { tokenIndex, tokenValue, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0 &&
                ((parser.token & 36864) === 36864 ||
                    (parser.token & 537079808) === 537079808)) {
                parser.flags |= 128;
            }
            if (context & 64) {
                declareName(parser, context, scope, tokenValue, type, 0, 0);
            }
            left = parseAndClassifyIdentifier(parser, context, type, tokenIndex, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, type, 0, tokenIndex, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, type, 0, tokenIndex, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadElement(parser, context, scope, 1073741840, type, 0, 0, inGroup, tokenIndex, linePos, colPos);
            }
            parser.flags |= 128;
            reinterpretToPattern(parser, left);
            if (parser.destructible & 16)
                report(parser, 51);
            if (type && parser.destructible & 32)
                report(parser, 51);
        }
        if (parser.token === -2143289315) {
            nextToken(parser, context | 32768);
            parser.flags |= 128;
            const right = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenIndex, linePos, colPos, {
                type: 'AssignmentPattern',
                left,
                right
            });
        }
        setterArgs++;
        params.push(left);
        if (parser.token !== 1073741840)
            consume(parser, context, -1073741806);
    }
    if (kind & 512 && setterArgs !== 1) {
        report(parser, 36, 'Setter', 'one', '');
    }
    if (context & 64)
        verifyArguments(parser, scope.lexicals);
    consume(parser, context, 1073741840);
    return params;
}
export function parseComputedPropertyName(parser, context, inGroup) {
    nextToken(parser, context | 32768);
    const key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
    consume(parser, context, 20);
    return key;
}
export function parseParenthesizedExpression(parser, context, assignable, start, line, column) {
    parser.flags &= ~128;
    nextToken(parser, context | 32768);
    const scope = context & 64 ? inheritScope(initblockScope(), 16) : {};
    if (consumeOpt(parser, context, 1073741840)) {
        if (!assignable)
            report(parser, 29, KeywordDescTable[parser.token & 255]);
        return parseArrowFunctionExpression(parser, context, scope, [], 0, start, line, column);
    }
    let destructible = 0;
    parser.destructible &= ~(256 | 128);
    let expr;
    let expressions = [];
    let toplevelComma = 0;
    let isComplex = 0;
    const idxStart = parser.tokenIndex;
    const lineStart = parser.linePos;
    const columnStart = parser.colPos;
    parser.assignable = 1;
    while (parser.token !== 1073741840) {
        const { token, tokenIndex, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (context & 64) {
                declareName(parser, context, scope, parser.tokenValue, 2, 0, 0);
            }
            expr = parsePrimaryExpressionExtended(parser, context, 0, 0, 1, 1, tokenIndex, linePos, colPos);
            if ((parser.token & 1073741824) === 1073741824) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isComplex = 1;
                }
                else if ((token & 537079808) === 537079808 ||
                    (token & 36864) === 36864) {
                    isComplex = 1;
                }
            }
            else {
                if (parser.token === -2143289315) {
                    isComplex = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, tokenIndex, linePos, colPos);
                if ((parser.token & 1073741824) !== 1073741824) {
                    expr = parseAssignmentExpression(parser, context, 1, tokenIndex, linePos, colPos, expr);
                }
            }
        }
        else if (token & 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, 0, tokenIndex, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, 0, tokenIndex, linePos, colPos);
            destructible |= parser.destructible;
            isComplex = 1;
            parser.assignable = 2;
            if ((parser.token & 1073741824) !== 1073741824) {
                if (destructible & 8)
                    report(parser, 133);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenIndex, linePos, colPos);
                destructible |= 16;
                if ((parser.token & 1073741824) !== 1073741824) {
                    expr = parseAssignmentExpression(parser, context, 0, tokenIndex, linePos, colPos, expr);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadElement(parser, context, scope, 1073741840, 2, 0, 0, 1, tokenIndex, linePos, colPos);
            if (parser.destructible & 16)
                report(parser, 77);
            isComplex = 1;
            if (toplevelComma && (parser.token & 1073741824) === 1073741824) {
                expressions.push(expr);
            }
            destructible |= 8;
            break;
        }
        else {
            destructible |= 16;
            expr = parseExpression(parser, context, 1, 1, tokenIndex, linePos, colPos);
            if (toplevelComma && (parser.token & 1073741824) === 1073741824) {
                expressions.push(expr);
            }
            if (parser.token === -1073741806) {
                if (!toplevelComma) {
                    toplevelComma = 1;
                    expressions = [expr];
                }
            }
            if (toplevelComma) {
                while (consumeOpt(parser, context | 32768, -1073741806)) {
                    expressions.push(parseExpression(parser, context, 1, 1, parser.tokenIndex, parser.linePos, parser.colPos));
                }
                parser.assignable = 2;
                expr = finishNode(parser, context, idxStart, lineStart, columnStart, {
                    type: 'SequenceExpression',
                    expressions
                });
            }
            consume(parser, context, 1073741840);
            parser.destructible = destructible;
            return expr;
        }
        if (toplevelComma && (parser.token & 1073741824) === 1073741824) {
            expressions.push(expr);
        }
        if (!consumeOpt(parser, context | 32768, -1073741806))
            break;
        if (!toplevelComma) {
            toplevelComma = 1;
            expressions = [expr];
        }
        if (parser.token === 1073741840) {
            destructible |= 8;
            break;
        }
    }
    if (toplevelComma) {
        parser.assignable = 2;
        expr = finishNode(parser, context, idxStart, lineStart, columnStart, {
            type: 'SequenceExpression',
            expressions
        });
    }
    consume(parser, context, 1073741840);
    if (destructible & 16 && destructible & 8)
        report(parser, 26);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (isComplex)
            parser.flags |= 128;
        if (!assignable)
            report(parser, 49);
        if (destructible & 16)
            report(parser, 49);
        if (destructible & 32)
            report(parser, 50);
        if (context & (4194304 | 2048) && destructible & 128)
            report(parser, 30);
        if (context & (1024 | 2097152) && destructible & 256) {
            report(parser, 31);
        }
        if (context & 64)
            checkConflictingLexicalDeclarations(parser, context, scope, 0);
        return parseArrowFunctionExpression(parser, context, scope, toplevelComma ? expressions : [expr], 0, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 155);
    }
    parser.destructible = ((parser.destructible | 256) ^ 256) | destructible;
    return context & 128
        ? finishNode(parser, context, idxStart, lineStart, columnStart, {
            type: 'ParenthesizedExpression',
            expression: expr
        })
        : expr;
}
export function parseIdentifierOrArrow(parser, context, start, line, column) {
    const { tokenValue } = parser;
    const expr = parseIdentifier(parser, context, start, line, column);
    parser.assignable = 1;
    if (parser.token === 10) {
        let scope = {};
        if (context & 64) {
            scope = inheritScope(initblockScope(), 16);
            declareAndDedupe(parser, context, scope, tokenValue, 2, 0);
        }
        parser.flags &= ~128;
        return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    return expr;
}
export function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
    if (parser.flags & 1)
        report(parser, 47);
    consume(parser, context | 32768, 10);
    for (let i = 0; i < params.length; ++i)
        reinterpretToPattern(parser, params[i]);
    context = ((context | 0xf00000) ^ 0xf00000) | (isAsync << 22);
    const expression = parser.token !== 2162700;
    let body;
    if (expression) {
        body = parseExpression(parser, context, 1, 0, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    else {
        if (context & 64)
            scope = inheritScope(scope, 2);
        body = parseFunctionBody(parser, (context | 0x8001000 | 8192 | 268435456) ^ (0x8001000 | 8192 | 268435456), scope, 2, void 0);
        switch (parser.token) {
            case 67108877:
            case 69271571:
            case 67174409:
            case 22:
                report(parser, 127);
            case 67174411:
                report(parser, 126);
            default:
        }
        if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) === 0)
            report(parser, 29, KeywordDescTable[parser.token & 255]);
        if ((parser.token & 33619968) === 33619968)
            report(parser, 137);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'ArrowFunctionExpression',
        body,
        params,
        async: isAsync === 1,
        expression
    });
}
export function parseFormalParametersOrFormalList(parser, context, scope, inGroup, type) {
    consume(parser, context, 67174411);
    parser.flags &= ~128;
    const params = [];
    let isComplex = 0;
    while (parser.token !== 1073741840) {
        let left;
        const { tokenIndex, linePos, colPos } = parser;
        if (parser.token & 143360) {
            if ((context & 1024) === 0 &&
                ((parser.token & 36864) === 36864 ||
                    (parser.token & 537079808) === 537079808)) {
                isComplex = 1;
            }
            if (context & 64 && (parser.token & 143360) === 143360) {
                declareName(parser, context, scope, parser.tokenValue, type, 0, 0);
            }
            left = parseAndClassifyIdentifier(parser, context, type, tokenIndex, linePos, colPos);
        }
        else {
            if (parser.token === 2162700) {
                left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, type, 0, tokenIndex, linePos, colPos);
            }
            else if (parser.token === 69271571) {
                left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, type, 0, tokenIndex, linePos, colPos);
            }
            else if (parser.token === 14) {
                left = parseSpreadElement(parser, context, scope, 1073741840, type, 0, 0, inGroup, tokenIndex, linePos, colPos);
            }
            else {
                report(parser, 29, KeywordDescTable[parser.token & 255]);
            }
            isComplex = 1;
            reinterpretToPattern(parser, left);
            if (parser.destructible & 16)
                report(parser, 51);
            if (type && parser.destructible & 32)
                report(parser, 51);
        }
        if (parser.token === -2143289315) {
            nextToken(parser, context | 32768);
            isComplex = 1;
            const right = parseExpression(parser, (context | 134217728) ^ 134217728, 1, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
            left = finishNode(parser, context, tokenIndex, linePos, colPos, {
                type: 'AssignmentPattern',
                left,
                right
            });
        }
        params.push(left);
        if (parser.token !== 1073741840)
            consume(parser, context, -1073741806);
    }
    if (isComplex)
        parser.flags |= 128;
    if (context & 64 && (isComplex || context & 1024)) {
        verifyArguments(parser, scope.lexicals);
    }
    consume(parser, context, 1073741840);
    return params;
}
export function parseNewExpression(parser, context, inGroup, start, line, column) {
    const id = parseIdentifier(parser, context | 32768, start, line, column);
    const startIdx = parser.tokenIndex;
    const lineIdx = parser.linePos;
    const columnIdx = parser.colPos;
    if (consumeOpt(parser, context, 67108877)) {
        if (context & 67108864 && parser.token === 143494) {
            parser.assignable = 2;
            return parseMetaProperty(parser, context, id, start, line, column);
        }
        report(parser, 100);
    }
    parser.assignable = 2;
    let callee = parsePrimaryExpressionExtended(parser, context, 0, 1, 0, inGroup, startIdx, lineIdx, columnIdx);
    callee = parseMemberOrUpdateExpression(parser, context, callee, 1, inGroup, startIdx, lineIdx, columnIdx);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'NewExpression',
        callee,
        arguments: parser.token === 67174411 ? parseArguments(parser, context & ~134217728, inGroup) : []
    });
}
export function parseMetaProperty(parser, context, meta, start, line, column) {
    const property = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, {
        type: 'MetaProperty',
        meta,
        property
    });
}
export function parseAsyncExpression(parser, context, expr, inNewExpression, assignable, inGroup, start, line, column) {
    const { flags } = parser;
    let scope = {};
    if ((flags & 1) === 0) {
        if (parser.token === 86103)
            return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
        if ((parser.token & 143360) === 143360) {
            if (parser.assignable & 2)
                report(parser, 48);
            if (parser.token === 209005)
                report(parser, 30);
            if (context & 64) {
                scope = inheritScope(initblockScope(), 16);
                declareAndDedupe(parser, context, scope, parser.tokenValue, 2, 0);
            }
            const param = [parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos)];
            return parseArrowFunctionExpression(parser, context, scope, param, 1, start, line, column);
        }
    }
    if (!inNewExpression && parser.token === 67174411) {
        return parseAsyncArrowOrCallExpression(parser, (context | 134217728) ^ 134217728, expr, assignable, flags, start, line, column);
    }
    if (parser.token === 10) {
        if (inNewExpression)
            report(parser, 52);
        if (context & 64) {
            scope = inheritScope(initblockScope(), 16);
            declareAndDedupe(parser, context, scope, parser.tokenValue, 2, 0);
        }
        return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
    }
    parser.assignable = 1;
    return expr;
}
export function parseAsyncArrowOrCallExpression(parser, context, callee, assignable, flags, start, line, column) {
    nextToken(parser, context | 32768);
    const scope = context & 64 ? inheritScope(initblockScope(), 16) : {};
    if (consumeOpt(parser, context, 1073741840)) {
        if (parser.token === 10) {
            if (flags & 1)
                report(parser, 47);
            if (!assignable)
                report(parser, 48);
            return parseArrowFunctionExpression(parser, context, scope, [], 1, start, line, column);
        }
        return finishNode(parser, context, start, line, column, {
            type: 'CallExpression',
            callee,
            arguments: []
        });
    }
    let destructible = 0;
    let expr;
    let isComplex = 0;
    parser.destructible &= ~(256 | 128);
    const params = [];
    while (parser.token !== 1073741840) {
        const { token, tokenIndex, linePos, colPos } = parser;
        if (token & (143360 | 4096)) {
            if (context & 64) {
                declareName(parser, context, scope, parser.tokenValue, 2, 0, 0);
            }
            expr = parsePrimaryExpressionExtended(parser, context, 0, 0, 1, 1, tokenIndex, linePos, colPos);
            if ((parser.token & 1073741824) === 1073741824) {
                if (parser.assignable & 2) {
                    destructible |= 16;
                    isComplex = 1;
                }
                else if ((token & 537079808) === 537079808 ||
                    (token & 36864) === 36864) {
                    isComplex = 1;
                }
            }
            else {
                if (parser.token === -2143289315) {
                    isComplex = 1;
                }
                else {
                    destructible |= 16;
                }
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, tokenIndex, linePos, colPos);
                if ((parser.token & 1073741824) !== 1073741824) {
                    expr = parseAssignmentExpression(parser, context, 1, tokenIndex, linePos, colPos, expr);
                }
            }
        }
        else if (token & 2097152) {
            expr =
                token === 2162700
                    ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, 0, tokenIndex, linePos, colPos)
                    : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, 0, tokenIndex, linePos, colPos);
            destructible |= parser.destructible;
            isComplex = 1;
            parser.assignable = 2;
            if ((parser.token & 1073741824) !== 1073741824) {
                if (destructible & 8)
                    report(parser, 133);
                expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenIndex, linePos, colPos);
                destructible |= 16;
                if ((parser.token & 1073741824) !== 1073741824) {
                    expr = parseAssignmentExpression(parser, context, 0, parser.tokenIndex, parser.linePos, parser.colPos, expr);
                }
            }
        }
        else if (token === 14) {
            expr = parseSpreadElement(parser, context, scope, 1073741840, 2, 0, 1, 1, tokenIndex, linePos, colPos);
            destructible |= (parser.token === 1073741840 ? 0 : 16) | parser.destructible;
            isComplex = 1;
        }
        else {
            expr = parseExpression(parser, context, 1, 0, tokenIndex, linePos, colPos);
            destructible = parser.assignable;
            params.push(expr);
            while (consumeOpt(parser, context | 32768, -1073741806)) {
                params.push(parseExpression(parser, context, 1, 0, tokenIndex, linePos, colPos));
            }
            destructible |= parser.assignable;
            consume(parser, context, 1073741840);
            parser.destructible = destructible | 16;
            parser.assignable = 2;
            return finishNode(parser, context, start, line, column, {
                type: 'CallExpression',
                callee,
                arguments: params
            });
        }
        params.push(expr);
        if (!consumeOpt(parser, context | 32768, -1073741806))
            break;
    }
    consume(parser, context, 1073741840);
    destructible |=
        parser.destructible & 256
            ? 256
            : 0 | (parser.destructible & 128)
                ? 128
                : 0;
    if (parser.token === 10) {
        if (isComplex)
            parser.flags |= 128;
        if (!assignable)
            report(parser, 49);
        if (destructible & 16)
            report(parser, 25);
        if (destructible & 32)
            report(parser, 50);
        if (parser.flags & 1 || flags & 1)
            report(parser, 47);
        if (destructible & 128)
            report(parser, 30);
        if (context & (1024 | 2097152) && destructible & 256)
            report(parser, 31);
        if (context & 64)
            checkConflictingLexicalDeclarations(parser, context, scope, 0);
        return parseArrowFunctionExpression(parser, context, scope, params, 1, start, line, column);
    }
    else if (destructible & 8) {
        report(parser, 63);
    }
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, {
        type: 'CallExpression',
        callee,
        arguments: params
    });
}
export function parseRegExpLiteral(parser, context, start, line, column) {
    const { tokenRaw, tokenRegExp, tokenValue } = parser;
    nextToken(parser, context);
    parser.assignable = 2;
    return context & 512
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
export function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
    context = (context | 16777216 | 1024) ^ 16777216;
    let id = null;
    let superClass = null;
    const decorators = context & 1 ? parseDecorators(parser, context) : [];
    nextToken(parser, context);
    const { tokenIndex, linePos, colPos, tokenValue } = parser;
    if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
        if (isStrictReservedWord(parser, context, parser.token)) {
            report(parser, 128);
        }
        if ((parser.token & 537079808) === 537079808) {
            report(parser, 129);
        }
        if (context & 64) {
            declareAndDedupe(parser, context, scope, tokenValue, 8, 0);
            if (flags) {
                if (flags & 1) {
                    addBindingToExports(parser, tokenValue);
                }
                else {
                    updateExportsList(parser, tokenValue);
                }
            }
        }
        id = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
    }
    else {
        if (flags & 1) {
            addBindingToExports(parser, '');
        }
        else {
            report(parser, 38, 'Class');
        }
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20564)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, 0, parser.tokenIndex, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, scope, 0, 1, 0);
    return finishNode(parser, context, start, line, column, context & 1
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
        });
}
export function parseClassExpression(parser, context, inGroup, start, line, column) {
    let id = null;
    let superClass = null;
    context = (context & ~16777216) | 1024;
    const decorators = context & 1 ? parseDecorators(parser, context) : [];
    nextToken(parser, context);
    if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
        if (isStrictReservedWord(parser, context, parser.token))
            report(parser, 128);
        if ((parser.token & 537079808) === 537079808)
            report(parser, 129);
        if (context & 64) {
            declareAndDedupe(parser, context, null, parser.tokenValue, 8, 0);
        }
        id = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
    }
    let inheritedContext = context;
    if (consumeOpt(parser, context | 32768, 20564)) {
        superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
        inheritedContext |= 524288;
    }
    else {
        inheritedContext = (inheritedContext | 524288) ^ 524288;
    }
    const body = parseClassBody(parser, inheritedContext, context, null, 0, 0, inGroup);
    parser.assignable = 2;
    return finishNode(parser, context, start, line, column, context & 1
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
        });
}
export function parseDecorators(parser, context) {
    const list = [];
    while (parser.token === 133) {
        list.push(parseDecoratorList(parser, context, parser.tokenIndex, parser.linePos, parser.colPos));
    }
    return list;
}
export function parseDecoratorList(parser, context, start, line, column) {
    nextToken(parser, context | 32768);
    let expression = parsePrimaryExpressionExtended(parser, context, 0, 0, 1, 0, start, line, column);
    expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
    return finishNode(parser, context, start, line, column, {
        type: 'Decorator',
        expression
    });
}
export function parseClassBody(parser, context, inheritedContext, scope, type, origin, inGroup) {
    const startt = parser.tokenIndex;
    const linee = parser.linePos;
    const columnn = parser.colPos;
    consume(parser, context | 32768, 2162700);
    parser.flags = (parser.flags | 32) ^ 32;
    const body = [];
    let decorators = [];
    if (context & 1) {
        while (parser.token !== -2146435057) {
            let length = 0;
            decorators = parseDecorators(parser, context);
            length = decorators.length;
            if (length > 0 && parser.tokenValue === 'constructor') {
                report(parser, 120);
            }
            if (parser.token === -2146435057)
                report(parser, 119);
            if (consumeOpt(parser, context, -2146435055)) {
                if (length > 0)
                    report(parser, 130);
                continue;
            }
            body.push(parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 0, inGroup, parser.tokenIndex, parser.linePos, parser.colPos));
        }
    }
    else {
        while (parser.token !== -2146435057) {
            if (consumeOpt(parser, context, -2146435055)) {
                continue;
            }
            body.push(parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 0, inGroup, parser.tokenIndex, parser.linePos, parser.colPos));
        }
    }
    consume(parser, origin & 1 ? context | 32768 : context, -2146435057);
    return finishNode(parser, context, startt, linee, columnn, {
        type: 'ClassBody',
        body
    });
}
function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
    let kind = isStatic ? 32 : 0;
    let key = null;
    const { token, tokenIndex, linePos, colPos } = parser;
    if (token & (143360 | 36864)) {
        key = parseIdentifier(parser, context, tokenIndex, linePos, colPos);
        switch (token) {
            case 36969:
                if (!isStatic && parser.token !== 67174411) {
                    return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
                }
                break;
            case 143468:
                if (parser.token !== 67174411 && (parser.flags & 1) < 1) {
                    if (context & 1 && (parser.token & -2147483648) === -2147483648) {
                        return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex, linePos, colPos);
                    }
                    kind |= 16 | (optionalBit(parser, context, 8456755) ? 8 : 0);
                }
                break;
            case 12399:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & -2147483648) === -2147483648) {
                        return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex, linePos, colPos);
                    }
                    kind |= 256;
                }
                break;
            case 12400:
                if (parser.token !== 67174411) {
                    if (context & 1 && (parser.token & -2147483648) === -2147483648) {
                        return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex, linePos, colPos);
                    }
                    kind |= 512;
                }
                break;
            default:
        }
    }
    else if (token === 69271571) {
        kind = 2;
        key = parseComputedPropertyName(parser, inheritedContext, inGroup);
    }
    else if ((token & 134217728) === 134217728) {
        key = parseLiteral(parser, context, tokenIndex, linePos, colPos);
    }
    else if (token === 8456755) {
        kind |= 8;
        nextToken(parser, context);
    }
    else if (context & 1 && parser.token === 131) {
        kind |= 4096;
        key = parsePrivateName(parser, context, tokenIndex, linePos, colPos);
        context = context | 268435456;
    }
    else if (context & 1 && (parser.token & -2147483648) === -2147483648) {
        kind |= 128;
        context = context | 268435456;
    }
    else {
        report(parser, 0);
    }
    if (kind & (8 | 16 | 768)) {
        if (parser.token & 143360) {
            key = parseIdentifier(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        else if ((parser.token & 134217728) === 134217728) {
            key = parseLiteral(parser, context, parser.tokenIndex, parser.linePos, parser.colPos);
        }
        else if (parser.token === 69271571) {
            kind |= 2;
            key = parseComputedPropertyName(parser, context, 0);
        }
        else if (context & 1 && parser.token === 131) {
            kind |= 4096;
            key = parsePrivateName(parser, context, tokenIndex, linePos, colPos);
        }
        else
            report(parser, 147);
    }
    if ((kind & 2) < 1) {
        if (parser.tokenValue === 'constructor') {
            if ((parser.token & -2147483648) === -2147483648) {
                report(parser, 141);
            }
            else if ((kind & 32) < 1 && parser.token === 67174411) {
                if (kind & (768 | 16 | 128 | 8)) {
                    report(parser, 54, 'accessor');
                }
                else if ((context & 524288) < 1) {
                    if (parser.flags & 32)
                        report(parser, 55);
                    else
                        parser.flags |= 32;
                }
            }
            kind |= 64;
        }
        else if ((kind & 4096) < 1 &&
            kind & (32 | 768 | 8 | 16) &&
            parser.tokenValue === 'prototype') {
            report(parser, 53);
        }
    }
    if (context & 1 && parser.token !== 67174411) {
        return parseFieldDefinition(parser, context, key, kind, decorators, tokenIndex, linePos, colPos);
    }
    const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenIndex, parser.linePos, parser.colPos);
    return finishNode(parser, context, start, line, column, context & 1
        ? {
            type: 'MethodDefinition',
            kind: (kind & 32) < 1 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            decorators,
            value
        }
        : {
            type: 'MethodDefinition',
            kind: (kind & 32) < 1 && kind & 64
                ? 'constructor'
                : kind & 256
                    ? 'get'
                    : kind & 512
                        ? 'set'
                        : 'method',
            static: (kind & 32) > 0,
            computed: (kind & 2) > 0,
            key,
            value
        });
}
function parsePrivateName(parser, context, start, line, column) {
    nextToken(parser, context);
    const { tokenValue } = parser;
    if (tokenValue === 'constructor')
        report(parser, 140);
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'PrivateName',
        name: tokenValue
    });
}
export function parseFieldDefinition(parser, context, key, state, decorators, start, line, column) {
    let value = null;
    if (state & 8)
        report(parser, 0);
    if (parser.token === -2143289315) {
        nextToken(parser, context | 32768);
        const idxAfterAssign = parser.tokenIndex;
        const lineAfterAssign = parser.linePos;
        const columnAfterAssign = parser.colPos;
        if (parser.token === 537079925)
            report(parser, 129);
        value = parsePrimaryExpressionExtended(parser, context | 268435456, 0, 0, 1, 0, idxAfterAssign, lineAfterAssign, columnAfterAssign);
        if ((parser.token & -2147483648) !== -2147483648) {
            value = parseMemberOrUpdateExpression(parser, context | 268435456, value, 0, 0, idxAfterAssign, lineAfterAssign, columnAfterAssign);
            if ((parser.token & -2147483648) !== -2147483648) {
                value = parseAssignmentExpression(parser, context | 268435456, 0, idxAfterAssign, lineAfterAssign, columnAfterAssign, value);
            }
        }
    }
    return finishNode(parser, context, start, line, column, {
        type: 'FieldDefinition',
        key,
        value,
        static: (state & 32) > 0,
        computed: (state & 2) > 0,
        decorators
    });
}
export function parseBindingPattern(parser, context, scope, dupeChecks, isVarDecl, type, origin, start, line, column) {
    if (parser.token & 143360) {
        if (context & 64) {
            declareName(parser, context, scope, parser.tokenValue, type, dupeChecks, isVarDecl);
            if (origin & 16) {
                updateExportsList(parser, parser.tokenValue);
                addBindingToExports(parser, parser.tokenValue);
            }
        }
        return parseAndClassifyIdentifier(parser, context, type, start, line, column);
    }
    if ((parser.token & 2097152) !== 2097152)
        report(parser, 29, KeywordDescTable[parser.token & 255]);
    const left = parser.token === 69271571
        ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, type, origin, start, line, column)
        : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, type, origin, start, line, column);
    reinterpretToPattern(parser, left);
    if (parser.destructible & 16) {
        report(parser, 51);
    }
    if (type && parser.destructible & 32) {
        report(parser, 51);
    }
    return left;
}
function parseAndClassifyIdentifier(parser, context, type, start, line, column) {
    const { tokenValue, token } = parser;
    if (context & 1024) {
        if ((token & 537079808) === 537079808) {
            report(parser, 129);
        }
        else if ((token & 36864) === 36864) {
            report(parser, 105);
        }
        else if (token === 143479) {
            report(parser, 101);
        }
    }
    if ((token & 20480) === 20480) {
        report(parser, 110);
    }
    if (context & (2048 | 2097152) && token === 241770) {
        report(parser, 31);
    }
    if (token === 268677192) {
        if (type & (8 | 16))
            report(parser, 108);
    }
    if (context & (4194304 | 2048) && token === 209005) {
        report(parser, 106);
    }
    if (token === 143478) {
        report(parser, 101);
    }
    nextToken(parser, context);
    return finishNode(parser, context, start, line, column, {
        type: 'Identifier',
        name: tokenValue
    });
}
//# sourceMappingURL=parser.js.map