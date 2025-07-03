import * as path from 'node:path';
import Test262Stream from 'test262-stream';
import downloadTest262 from './download-test262.mjs';
import { shouldSkip, TEST262_DIRECTORY, whitelist } from './shared.mjs';

const whitelistSet = new Set(whitelist);

// Based on https://github.com/adrianheine/test262-parser-runner
async function* getTest262Fixtures(paths) {
  await downloadTest262();

  const stream = new Test262Stream(TEST262_DIRECTORY, {
    paths: paths ? paths.map((file) => `test/${file}`) : undefined,
    omitRuntime: true,
  });

  stream.on('error', (error) => {
    console.error(error);
    throw error;
  });

  const seen = new Set();

  for await (const test of stream) {
    if (seen.has(test.file)) {
      continue;
    }

    seen.add(test.file);

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
      sourceType: test.attrs.flags.module ? 'module' : 'script',
    };
  }
}

export default getTest262Fixtures;
