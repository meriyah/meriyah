import { defineConfig } from 'vitest/config';

const IS_CI = Boolean(process.env.CI);

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.ts'],
    exclude: [
      'test/test-utils.ts',
      // Skip production test on local
      ...(IS_CI ? [] : ['test/production/production-tests.ts'])
    ],
    watch: false,
    pool: 'threads',
    coverage: {
      enabled: IS_CI,
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts']
    }
  }
});
