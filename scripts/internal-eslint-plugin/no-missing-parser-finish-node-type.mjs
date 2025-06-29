export default {
  meta: { fixable: 'code' },
  create(context) {
    return {
      CallExpression(callExpression) {
        if (
          !(
            !callExpression.typeArguments &&
            callExpression.arguments.length > 1 &&
            callExpression.arguments[0].type === 'ObjectExpression'
          )
        ) {
          return;
        }

        const { callee } = callExpression;
        // `parser.finishNode({type: 'Identifier'}, ...)`
        if (
          !(
            callee.type === 'MemberExpression' &&
            !callee.computed &&
            !callee.optional &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'parser' &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'finishNode'
          )
        ) {
          return;
        }

        const estreeTypePropertyNode = callExpression.arguments[0].properties.find(
          (property) =>
            !property.computed &&
            !property.shorthand &&
            property.key.type === 'Identifier' &&
            property.key.name === 'type' &&
            property.value.type === 'Literal' &&
            typeof property.value.value === 'string',
        );

        if (!estreeTypePropertyNode) {
          return;
        }

        context.report({
          node: callee,
          message: 'Type parameter for `parser.finishNode()` is required',
          fix: (fixer) => fixer.insertTextAfter(callee, `<ESTree.${estreeTypePropertyNode.value.value}>`),
        });
      },
    };
  },
};
