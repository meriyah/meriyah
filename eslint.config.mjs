import eslintJs from '@eslint/js';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginN from 'eslint-plugin-n';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginInternal from './scripts/internal-eslint-plugin/index.mjs';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginInternal,
  {
    languageOptions: { globals: { ...globals.builtin } },
    plugins: {
      '@stylistic': eslintPluginStylistic,
      'import-x': eslintPluginImportX,
      'simple-import-sort': eslintPluginSimpleImportSort,
      unicorn: eslintPluginUnicorn,
    },
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

      '@stylistic/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // https://github.com/lydell/eslint-plugin-simple-import-sort/blob/20e25f3b83c713825f96b8494e2091e6600954d6/src/imports.js#L5-L19
            // Side effect imports.
            [String.raw`^\u0000`],
            // Remove blank lines between groups
            // https://github.com/lydell/eslint-plugin-simple-import-sort#how-do-i-remove-all-blank-lines-between-imports
            [
              // Node.js builtins prefixed with `node:`.
              '^node:',
              // Packages.
              // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
              String.raw`^@?\w`,
              // Absolute imports and other imports such as Vue-style `@/foo`.
              // Anything not matched in another group.
              '^',
              // Relative imports.
              // Anything that starts with a dot.
              String.raw`^\.`,
            ],
          ],
        },
      ],
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
      'unicorn/template-indent': 'error',

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
    settings: {
      node: { version: 24 },
    },
    rules: {
      'n/no-unsupported-features/es-syntax': 'error',
      'n/no-extraneous-import': 0,
      'n/no-unpublished-import': 0,
      'n/no-extraneous-require': 0,
      'n/no-unpublished-require': 0,
      'n/hashbang': 0,
      'n/prefer-node-protocol': 'error',
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
    ignores: ['dist', 'src/unicode.ts', 'test262/test262', 'coverage'],
  },
];
