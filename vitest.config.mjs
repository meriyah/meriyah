import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(process.env.CI);
const SHOULD_RUN_PRODUCTION_TEST = IS_CI || Boolean(process.env.PRODUCTION_TEST);
const SHOULD_RUN_CONFORMANCE_TEST =
  IS_CI || Boolean(process.env.TEST262) || Boolean(process.env.TEST262_FILE) || Boolean(process.env.TEST_JSX_FILE);

export default defineConfig({
  test: {
    include: ['test/**/*.ts'],
    exclude: [
      'test/test-utils.ts',
      // Skip production test on local by default
      ...(SHOULD_RUN_PRODUCTION_TEST ? [] : ['test/production/production-tests.ts']),
      // Skip conformance test on local by default
      ...(SHOULD_RUN_CONFORMANCE_TEST
        ? []
        : [
            'test/conformance/test262-parser-tests.ts',
            'test/conformance/ast-alignment-test.ts',
            'test/conformance/jsx-ast-alignment-test.ts',
          ]),
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
