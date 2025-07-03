import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(process.env.CI);
const SHOULD_RUN_PRODUCTION_TEST = IS_CI || Boolean(process.env.PRODUCTION_TEST);
const SHOULD_RUN_TEST262 = IS_CI || Boolean(process.env.SHOULD_RUN_TEST262) || Boolean(process.env.TEST262_FILE);

export default defineConfig({
  test: {
    include: ['test/**/*.ts'],
    exclude: [
      'test/test-utils.ts',
      // Skip production test on local by default
      ...(SHOULD_RUN_PRODUCTION_TEST ? [] : ['test/production/production-tests.ts']),
      // Skip test 262 on local by default
      ...(SHOULD_RUN_TEST262
        ? []
        : ['test/test262-parser-tests/parser-tests.ts', 'test/test262-parser-tests/ast-alignment-test.ts']),
    ],
    watch: false,
    coverage: {
      enabled: IS_CI,
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts'],
    },
  },
});
