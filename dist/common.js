import { KeywordDescTable } from './token';
import { report } from './errors';
import { nextToken } from './lexer/scan';
export function consumeSemicolon(parser, context) {
    if ((parser.flags & 1) === 0 && (parser.token & 1048576) !== 1048576) {
        report(parser, 29, KeywordDescTable[parser.token & 255]);
    }
    consumeOpt(parser, context, -2146435055);
}
export function optionalBit(parser, context, t) {
    if (parser.token !== t)
        return 0;
    nextToken(parser, context);
    return 1;
}
export function consumeOpt(parser, context, t) {
    if (parser.token !== t)
        return false;
    nextToken(parser, context);
    return true;
}
export function consume(parser, context, t) {
    if (parser.token !== t)
        report(parser, 23, KeywordDescTable[t & 255]);
    nextToken(parser, context);
}
export function reinterpretToPattern(state, node) {
    switch (node.type) {
        case 'ArrayExpression':
            node.type = 'ArrayPattern';
            const elements = node.elements;
            for (let i = 0, n = elements.length; i < n; ++i) {
                const element = elements[i];
                if (element)
                    reinterpretToPattern(state, element);
            }
            return;
        case 'ObjectExpression':
            node.type = 'ObjectPattern';
            const properties = node.properties;
            for (let i = 0, n = properties.length; i < n; ++i) {
                reinterpretToPattern(state, properties[i]);
            }
            return;
        case 'AssignmentExpression':
            node.type = 'AssignmentPattern';
            if (node.operator !== '=')
                report(state, 72);
            delete node.operator;
            reinterpretToPattern(state, node.left);
            return;
        case 'Property':
            reinterpretToPattern(state, node.value);
            return;
        case 'SpreadElement':
            node.type = 'RestElement';
            reinterpretToPattern(state, node.argument);
        default:
    }
}
export function validateBindingIdentifier(parser, context, type, t, skipEvalArgCheck) {
    if ((t & 4096) !== 4096)
        return;
    if (context & 1024) {
        if (t === 36969) {
            report(parser, 103);
        }
        if ((t & 36864) === 36864) {
            report(parser, 105);
        }
        if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
            report(parser, 129);
        }
        if (t === 143479) {
            report(parser, 101);
        }
    }
    if ((t & 20480) === 20480) {
        report(parser, 110);
    }
    if (type & (8 | 16) && t === 268677192) {
        report(parser, 108);
    }
    if (context & (4194304 | 2048) && t === 209005) {
        report(parser, 106);
    }
    if (context & (2097152 | 1024) && t === 241770) {
        report(parser, 104, 'yield');
    }
    if (t === 143478) {
        report(parser, 101);
    }
}
export function isStrictReservedWord(parser, context, t) {
    if (t === 209005) {
        if (context & (4194304 | 2048))
            report(parser, 106);
        parser.destructible |= 128;
    }
    if (t === 241770 && context & 2097152)
        report(parser, 104, 'yield');
    return ((t & 20480) === 20480 ||
        (t & 36864) === 36864 ||
        t == 143479);
}
export function isPropertyWithPrivateFieldKey(expr) {
    return !expr.property ? false : expr.property.type === 'PrivateName';
}
export function isValidLabel(parser, labels, name, isIterationStatement) {
    while (labels) {
        if (labels['$' + name]) {
            if (isIterationStatement)
                report(parser, 149);
            return 1;
        }
        if (isIterationStatement && labels.loop)
            isIterationStatement = 0;
        labels = labels['$'];
    }
    return 0;
}
export function validateAndDeclareLabel(parser, labels, name) {
    let set = labels;
    do {
        if (set['$' + name])
            report(parser, 148, name);
        set = set['$'];
    } while (set);
    labels['$' + name] = 1;
}
export function finishNode(parser, context, start, line, column, node) {
    if (context & 2) {
        node.start = start;
        node.end = parser.startIndex;
    }
    if (context & 4) {
        node.loc = {
            start: {
                line,
                column,
            },
            end: {
                line: parser.startLine,
                column: parser.startColumn,
            }
        };
        if (parser.sourceFile) {
            node.loc.source = parser.sourceFile;
        }
    }
    return node;
}
//# sourceMappingURL=common.js.map