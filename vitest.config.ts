import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.ts'],
    exclude: ['test/test-utils.ts'],
    watch: false,
    pool: 'threads',
    coverage: {
      enabled: Boolean(process.env.CI),
      provider: 'v8',
      reporter: ['lcov', 'text', 'html'],
      include: ['src/**/*.ts']
    }
  }
});
