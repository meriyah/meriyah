import { fixupPluginRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import eslintPluginN from 'eslint-plugin-n';
import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { import: fixupPluginRules(eslintPluginImport) },
    settings: eslintPluginImport.configs.typescript.settings,
    rules: {
      ...eslintPluginImport.configs.errors.rules,
      ...eslintPluginImport.configs.warnings.rules,
      ...eslintPluginImport.configs.typescript.rules,
      '@typescript-eslint/no-use-before-define': [2, { functions: false }], // https://github.com/eslint/eslint/issues/11903
      '@typescript-eslint/indent': 0,
      'prefer-const': ['error', { destructuring: 'all' }],

      // TODO: enable it when all problems addressed
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/class-name-casing': 0,
      '@typescript-eslint/camelcase': 0,
      '@typescript-eslint/no-var-requires': 0,
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
      'import/no-unresolved': 0,
      'import/namespace': 0
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
      'import/no-unresolved': 0,
      'import/namespace': 0,
      'import/default': 0,
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0
    }
  },
  {
    ignores: ['dist']
  }
];
