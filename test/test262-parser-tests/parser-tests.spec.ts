import runTest from '../../scripts/run-test262';
import { describe, it, expect } from 'bun:test';

describe('Test262', function () {
  it(
    'Should pass tests',
    async () => {
      const exitCode = await runTest();
      expect(exitCode).toBe(0);
    },
    Infinity
  );
});
