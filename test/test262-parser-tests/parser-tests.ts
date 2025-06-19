import runTest from '../../test262/run-test262.mjs';
import * as meriyah from '../../src/meriyah';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
describe('Test262', function () {
  it(
    'Should pass tests',
    async () => {
      const exitCode = await runTest(meriyah);
      t.equal(exitCode, 0);
    },
    Infinity,
  );
});
