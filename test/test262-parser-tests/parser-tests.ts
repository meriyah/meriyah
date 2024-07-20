import runTest from '../../scripts/run-test262';
import * as t from 'assert';

describe('Test262', function () {
  this.timeout(Infinity);

  it('Should pass tests', async () => {
    const exitCode = await runTest();
    t.equal(exitCode, 0);
  });
});
