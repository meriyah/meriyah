export default {
  meta: { fixable: 'code' },
  create(context) {
    return {
      CallExpression(callExpression) {
        // `parseSource(..., undefined, ...)`
        if (
          !(
            !callExpression.optional &&
            callExpression.callee.type === 'Identifier' &&
            callExpression.callee.name === 'parseSource' &&
            callExpression.arguments.length === 3 &&
            callExpression.arguments.every((node) => node.type !== 'SpreadElement') &&
            callExpression.arguments[1].type === 'Identifier' &&
            callExpression.arguments[1].name === 'undefined'
          )
        ) {
          return;
        }

        const contextNode = callExpression.arguments[2];

        const flags = new Set();
        const nodes = [contextNode];
        while (nodes.length) {
          const node = nodes.shift();
          if (node.type === 'MemberExpression') {
            if (!(node.object.name === 'Context' && !node.computed && !node.optional)) {
              return;
            }
            flags.add(node.property.name);
          } else if (node.type === 'BinaryExpression' && node.operator === '|') {
            nodes.push(node.left, node.right);
          } else {
            return;
          }
        }

        if (flags.size === 0) {
          throw new Error('Unexpected error');
        }

        const originalSize = flags.size;
        const options = {};
        flags.delete('None');

        if (flags.has('Module') && flags.has('Strict')) {
          flags.delete('Module');
          flags.delete('Strict');
          options.module = true;
        }

        const flagToOptions = {
          Strict: 'impliedStrict',
        };

        if (flags.size === originalSize && [...flags].every((flag) => !Object.hasOwn(flagToOptions, flag))) {
          return;
        }

        for (const [flagName, optionName] of Object.entries(flagToOptions)) {
          if (flags.has(flagName)) {
            flags.delete(flagName);
            options[optionName] = true;
          }
        }

        const contexts = [...flags];

        context.report({
          node: contextNode,
          message: 'Prefer use `options` instead of `context`.',
          *fix(fixer) {
            if (contexts.length !== 0) {
              yield fixer.replaceText(contextNode, contexts.map((flag) => `Context.${flag}`).join(' | '));
            } else {
              yield fixer.remove(contextNode);
              const commaToken = context.sourceCode.getTokenBefore(contextNode, (token) => token.value === ',');
              yield fixer.remove(commaToken);
            }

            const optionsNode = callExpression.arguments[1];

            if (Object.keys(options).length !== 0) {
              yield fixer.replaceText(optionsNode, JSON.stringify(options));
            } else if (contexts.length === 0) {
              yield fixer.remove(optionsNode);
              const commaToken = context.sourceCode.getTokenBefore(optionsNode, (token) => token.value === ',');
              yield fixer.remove(commaToken);
            }
          },
        });
      },
    };
  },
};
