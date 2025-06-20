import * as path from 'path';
import Test262Stream from 'test262-stream';
import downloadTest262 from './download-test262.mjs';
import { TEST262_DIRECTORY, shouldSkip, whitelist } from './shared.mjs';

const whitelistSet = new Set(whitelist);

// Based on https://github.com/adrianheine/test262-parser-runner
async function* getTest262Fixtures() {
  await downloadTest262();

  const stream = new Test262Stream(TEST262_DIRECTORY, { omitRuntime: true });

  stream.once('error', (error) => {
    console.error(error);
    throw error;
  });

  for await (const test of stream) {
    if (shouldSkip(test)) {
      continue;
    }

    const expectedError =
      test.attrs.negative && (test.attrs.negative.phase === 'parse' || test.attrs.negative.phase === 'early');
    if (expectedError) {
      continue;
    }

    let { file } = test;

    file = file.slice(5); // Strip leading 'test/'

    if (path.sep === '\\') {
      file = file.replaceAll(path.sep, '/');
    }

    const description = file + ' (' + test.scenario + ')';

    if (whitelistSet.has(description)) {
      continue;
    }

    yield {
      ...test,
      file,
    };
  }
}

getTest262Fixtures();

export default getTest262Fixtures;
