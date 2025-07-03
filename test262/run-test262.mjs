import * as path from 'node:path';
import run from 'test262-parser-runner';
import downloadTest262 from './download-test262.mjs';
import { shouldSkip, TEST262_DIRECTORY, whitelist } from './shared.mjs';

async function runTest(meriyah) {
  await downloadTest262();

  await run(
    (content, { sourceType }) => {
      meriyah.parse(content, {
        webcompat: true,
        lexical: true,
        next: true,
        module: sourceType === 'module',
      });
    },
    {
      testsDirectory: TEST262_DIRECTORY,
      skip: shouldSkip,
      whitelist: path.sep === '/' ? whitelist : whitelist.map((file) => file.replaceAll('/', path.sep)),
    },
  );

  const { exitCode } = process;
  process.exitCode = 0;

  return exitCode;
}

export default runTest;
