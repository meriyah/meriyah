'use strict';

module.exports = {
  extends: [
    "eslint:recommended",
  ],
  overrides: [
    {
      files: ['**/*.ts'],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
      ],
      rules: {
        '@typescript-eslint/indent': 0
      }
    }
  ]
}