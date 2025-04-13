import eslintJs from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import globals from 'globals';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.builtin } },
    plugins: { 'import-x': eslintPluginImportX },
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
      'no-restricted-imports': ['error', 'assert', 'node:assert'],

      // TODO: enable it when all problems addressed
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/class-name-casing': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-require-imports': 0,
      'no-fallthrough': 0,
      'import-x/no-rename-default': 0
    }
  },
  {
    files: ['**/*.mjs'],
    ...eslintPluginN.configs['flat/recommended-module']
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'n/no-unsupported-features/es-syntax': 'error',
      'n/no-extraneous-import': 0,
      'n/no-unpublished-import': 0,
      'n/no-extraneous-require': 0,
      'n/no-unpublished-require': 0,
      'n/hashbang': 0
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
    ignores: ['dist', 'src/unicode.ts']
  }
];
