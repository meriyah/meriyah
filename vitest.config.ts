import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(process.env.CI);
const SHOULD_RUN_PRODUCTION_TEST = IS_CI || Boolean(process.env.PRODUCTION_TEST);

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.ts'],
    exclude: [
      'test/test-utils.ts',
      // Skip production test on local by default
      ...(SHOULD_RUN_PRODUCTION_TEST ? [] : ['test/production/production-tests.ts']),
    ],
    watch: false,
    pool: 'threads',
    coverage: {
      enabled: IS_CI,
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts'],
    },
  },
});
