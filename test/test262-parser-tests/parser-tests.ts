import runTest from '../../scripts/run-test262.mjs';
import * as meriyah from '../../src/meriyah';
import * as t from 'node:assert/strict';

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
