import { report } from './errors';
export function initblockScope() {
    return {
        var: {},
        lexicalVariables: {},
        lexicals: { funcs: [] }
    };
}
export function inheritScope(scope, type) {
    return {
        var: scope.var,
        lexicalVariables: {
            $: scope.lexicalVariables
        },
        lexicals: {
            $: scope.lexicals,
            type,
            funcs: []
        }
    };
}
export function declareName(parser, context, scope, name, bindingType, dupeChecks, isVarDecl) {
    if (scope === null)
        return;
    const hashed = '$' + name;
    if (bindingType & 1) {
        let lex = scope.lexicals;
        while (lex !== undefined) {
            if (lex[hashed] !== undefined) {
                if (lex.type & 4) {
                    if (!isVarDecl || (context & 256) === 0) {
                        report(parser, 156, name);
                    }
                }
                else if (lex.type & 1) {
                    report(parser, 156, name);
                }
                else if ((lex.type & 16) === 0 &&
                    ((context & 256) === 0 ||
                        (scope.lexicals.funcs[hashed] & 2) === 0 ||
                        context & 1024))
                    report(parser, 156, name);
            }
            lex = lex['$'];
        }
        scope.var[hashed] = scope.var[hashed] ? 2 : 1;
        let lexicalVariables = scope.lexicalVariables;
        while (lexicalVariables !== undefined) {
            lexicalVariables[hashed] = 1;
            lexicalVariables = lexicalVariables['$'];
        }
    }
    else {
        const lex = scope.lexicals;
        if (dupeChecks) {
            const lexParent = scope.lexicals['$'];
            if (lexParent && lexParent.type & (16 | 4) && lexParent[hashed]) {
                report(parser, 156, name);
            }
            else if (scope.lexicalVariables[hashed]) {
                if ((context & 256) === 0 ||
                    (scope.lexicals.funcs[hashed] & 2) === 0 ||
                    (context & 1024) !== 0) {
                    report(parser, 156, name);
                }
            }
            if (lex[hashed] !== undefined &&
                ((context & 256) === 0 ||
                    (scope.lexicals.funcs[hashed] & 2) === 0 ||
                    context & 1024)) {
                report(parser, 156, name);
            }
        }
        lex[hashed] = lex[hashed] ? 2 : 1;
    }
}
export function declareAndDedupe(parser, context, scope, name, type, isVarDecl) {
    declareName(parser, context, scope, name, type, 1, isVarDecl);
    if (scope === null)
        return;
    if (context & 256)
        scope.lexicals.funcs['$' + name] = 1;
}
export function declareUnboundVariable(parser, context, scope, name, type) {
    declareName(parser, context, scope, name, type, 1, 0);
}
export function addFunctionName(parser, context, scope, name, type, isVarDecl) {
    declareName(parser, context, scope, name, type, 1, isVarDecl);
    if (context & 256 && !('$' + name in scope.lexicals.funcs)) {
        scope.lexicals.funcs['$' + name] = 2;
    }
}
export function checkConflictingLexicalDeclarations(parser, context, scope, checkParent) {
    for (const key in scope.lexicals) {
        if (key[0] === '$' && key.length > 1) {
            if (scope.lexicals[key] > 1)
                report(parser, 156, key);
            if (checkParent) {
                if (scope.lexicals['$'] &&
                    scope.lexicals['$'].type & (16 | 4) &&
                    scope.lexicals['$'][key]) {
                    report(parser, 156, key.slice(1));
                }
                else if (((context & 256) === 0 ||
                    (context & 1024) !== 0 ||
                    !scope.lexicals.funcs[key]) &&
                    scope.lexicalVariables[key]) {
                    report(parser, 156, key.slice(1));
                }
            }
        }
    }
    return false;
}
export function verifyArguments(parser, lex) {
    for (const key in lex) {
        if (key[0] === '$' && key.length > 1 && lex[key] > 1) {
            report(parser, 156, key.slice(1));
        }
    }
}
export function updateExportsList(parser, name) {
    if (parser.exportedNames !== undefined && name !== '') {
        if (parser.exportedNames['$' + name]) {
            report(parser, 157, name);
        }
        parser.exportedNames['$' + name] = 2;
    }
}
export function addBindingToExports(parser, name) {
    if (parser.exportedBindings !== undefined && name !== '') {
        parser.exportedBindings['$' + name] = 2;
    }
}
//# sourceMappingURL=scope.js.map