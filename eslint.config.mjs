import eslintJs from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'import-x': eslintPluginImportX },
    settings: eslintPluginImportX.configs.typescript.settings,
    rules: {
      ...eslintPluginImportX.configs.errors.rules,
      ...eslintPluginImportX.configs.warnings.rules,
      ...eslintPluginImportX.configs.typescript.rules,
      '@typescript-eslint/no-use-before-define': [2, { functions: false }], // https://github.com/eslint/eslint/issues/11903
      '@typescript-eslint/indent': 0,
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-destructuring': [
        'error',
        {
          VariableDeclarator: {
            array: false,
            object: true
          },
          AssignmentExpression: {
            array: false,
            object: false
          }
        },
        {
          enforceForRenamedProperties: false
        }
      ],

      // TODO: enable it when all problems addressed
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/class-name-casing': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-require-imports': 0,
      'no-fallthrough': 0
    }
  },
  {
    files: ['**/*.js'],
    ...eslintPluginN.configs['flat/recommended']
  },
  {
    files: ['bench/**/*'],
    rules: {
      'import-x/no-unresolved': 0,
      'import-x/namespace': 0
    }
  },
  {
    files: ['scripts/*.js'],
    rules: {
      'n/no-unsupported-features/es-syntax': ['error', { version: '10.0', ignores: [] }],
      'n/no-extraneous-require': 0,
      'n/no-unpublished-require': 0
    }
  },
  {
    files: ['eslint.config.mjs'],
    rules: {
      'import-x/no-unresolved': 0,
      'import-x/namespace': 0,
      'import-x/default': 0,
      'import-x/no-named-as-default': 0,
      'import-x/no-named-as-default-member': 0
    }
  },
  {
    ignores: ['dist']
  }
];
