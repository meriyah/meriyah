'use strict';

module.exports = {
  overrides: [
    {
      files: ['**/*.js'],
      extends: ['eslint:recommended', 'plugin:node/recommended'],
      parserOptions: { ecmaVersion: 10 }
    },
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript'
      ],
      rules: {
        '@typescript-eslint/no-use-before-define': [2, { functions: false }], // https://github.com/eslint/eslint/issues/11903
        '@typescript-eslint/indent': 0,
        'prefer-const': ['error', { destructuring: 'all' }],

        // TODO: enable it when all problems addressed
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/class-name-casing': 0,
        '@typescript-eslint/camelcase': 0
      }
    },
    {
      files: ['scripts/*.js'],
      rules:
        {
          "node/no-unsupported-features/es-syntax": ["error", {"version": "10.0", "ignores": []}]
        }
    }
  ]
};
