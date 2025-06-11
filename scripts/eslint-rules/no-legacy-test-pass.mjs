export default {
  create(context) {
    return {
      CallExpression(callExpression) {
        if (
          !(
            !callExpression.optional &&
            callExpression.callee.type === 'Identifier' &&
            callExpression.callee.name === 'pass' &&
            callExpression.arguments.length === 2
          )
        ) {
          return;
        }

        const testCases = callExpression.arguments[1];

        if (!(testCases.type === 'ArrayExpression')) {
          return;
        }

        for (const testCase of testCases.elements) {
          if (!(testCase.type === 'ArrayExpression' && testCase.elements.length === 3)) {
            continue;
          }

          const node = testCase.elements[2];
          context.report({
            node,
            message: 'Remove this',
            *fix(fixer) {
              yield fixer.remove(node);

              const nextToken = context.sourceCode.getTokenAfter(node);
              if (nextToken.value === ',') {
                yield fixer.remove(nextToken);
              }
            },
          });
        }
      },
    };
  },
  meta: {
    fixable: 'code',
  },
};
