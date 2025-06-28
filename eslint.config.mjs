import eslintJs from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.builtin } },
    plugins: { 'import-x': eslintPluginImportX, unicorn: eslintPluginUnicorn },
    settings: eslintPluginImportX.flatConfigs.typescript.settings,
    rules: {
      ...eslintPluginImportX.flatConfigs.errors.rules,
      ...eslintPluginImportX.flatConfigs.warnings.rules,
      ...eslintPluginImportX.flatConfigs.typescript.rules,
      '@typescript-eslint/no-use-before-define': [2, { functions: false }], // https://github.com/eslint/eslint/issues/11903
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/indent': 0,
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true,
          },
          AssignmentExpression: {
            array: false,
            object: false,
          },
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      'no-undef': 'error',
      'no-restricted-imports': ['error', 'assert', 'node:assert'],

      // TODO: enable it when all problems addressed
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/class-name-casing': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-require-imports': 0,
      'no-fallthrough': 0,
      'import-x/no-rename-default': 0,
    },
  },
  {
    ignores: ['src/**/*'],
    rules: {
      'unicorn/prefer-string-raw': 'error',
    },
  },
  {
    files: ['**/*.mjs'],
    ...eslintPluginN.configs['flat/recommended-module'],
  },
  {
    files: ['test/**/*.ts', 'scripts/**/*.mjs', 'vitest.config.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['scripts/**/*.mjs', 'test262/**/*.mjs'],
    rules: {
      'n/no-unsupported-features/es-syntax': 'error',
      'n/no-extraneous-import': 0,
      'n/no-unpublished-import': 0,
      'n/no-extraneous-require': 0,
      'n/no-unpublished-require': 0,
      'n/hashbang': 0,
      'import-x/no-unresolved': 0,
    },
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import-x/no-unresolved': 0,
      'import-x/namespace': 0,
      'import-x/default': 0,
      'import-x/no-named-as-default': 0,
      'import-x/no-named-as-default-member': 0,
    },
  },
  {
    ignores: ['dist', 'src/unicode.ts', 'test262/test262'],
  },
  {
    plugins: {
      'meriyah-internal': {
        rules: {
          'fail-refactor': {
            meta: { fixable: 'code' },
            create(context) {
              return {
                'CallExpression[callee.name=fail][arguments.length=2][arguments.1.type=ArrayExpression]'(
                  callExpression,
                ) {
                  for (const testCase of callExpression.arguments[1].elements) {
                    if (testCase?.type !== 'ArrayExpression') {
                      continue;
                    }

                    const contextNode = testCase.elements[1];
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

                    const options = {};
                    const contexts = [];
                    flags.delete('None');

                    if (flags.has('Module') && flags.has('Strict')) {
                      flags.delete('Module');
                      flags.delete('Strict');
                      options.module = true;
                    }

                    if (flags.has('Module')) {
                      flags.delete('Module');
                      contexts.push('Module');
                    }

                    const flagToOptions = {
                      Strict: 'impliedStrict',
                      OptionsWebCompat: 'webcompat',
                      OptionsNext: 'next',
                    };

                    for (const [flagName, optionName] of Object.entries(flagToOptions)) {
                      if (flags.has(flagName)) {
                        flags.delete(flagName);
                        options[optionName] = true;
                      }
                    }

                    if (flags.size > 0) {
                      throw new Error(`Unmapped bitmap flags: ${[...flags]}`);
                    }

                    context.report({
                      node: testCase,
                      message: 'Whatever',
                      fix(fixer) {
                        const fixed = { code: context.sourceCode.getText(testCase.elements[0]) };
                        if (Object.keys(options).length !== 0) {
                          fixed.options = options;
                        }

                        if (contexts.length !== 0) {
                          fixed.context = contexts.map((flag) => `Context.${flag}`).join(' | ');
                        }

                        return fixer.replaceText(
                          testCase,
                          !fixed.options && !fixed.context
                            ? fixed.code
                            : (() => {
                                const code = [];
                                code.push(`code:${fixed.code}`);
                                if (fixed.options) code.push(`options:${JSON.stringify(fixed.options)}`);
                                if (fixed.context) code.push(`context:${fixed.context}`);
                                return `{${code.join(',')}}`;
                              })(),
                        );
                      },
                    });
                  }
                },
              };
            },
          },
        },
      },
    },
    rules: {
      'meriyah-internal/fail-refactor': 'error',
    },
  },
];
