import runTest from '../../scripts/run-test262';
import * as t from 'node:assert/strict';

describe('Test262', function () {
  it(
    'Should pass tests',
    async () => {
      const exitCode = await runTest();
      t.equal(exitCode, 0);
    },
    Infinity
  );
});
