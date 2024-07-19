import { parseScript, parseModule } from '../../src/meriyah';
import * as path from 'path';
import * as fs from 'fs';
import * as t from 'assert';
import run = require('test262-parser-runner');

const unsupportedFeatures = new Set([
  'decorators',
  'explicit-resource-management',
  'regexp-modifiers',
  'import-assertions',
  'import-attributes'
]);

const whitelist = fs
  .readFileSync(path.join(__dirname, 'whitelist.txt'), 'utf8')
  .split('\n')
  .filter((line) => line && !line.startsWith('#'));

function parse(src: string, { sourceType }: { sourceType: 'module' | 'script' }) {
  return (sourceType === 'module' ? parseModule : parseScript)(src, { webcompat: true, lexical: true, next: true });
}

type Test = {
  file: string;
  contents: string;
  attrs: {
    features?: string[];
  };
};

function shouldSkip(test: Test) {
  const features = test.attrs.features ?? [];
  return features.some((feature) => unsupportedFeatures.has(feature));
}

async function runTest() {
  await run(parse, {
    skip: shouldSkip,
    whitelist: path.sep === '/' ? whitelist : whitelist.map((file) => file.replaceAll('/', path.sep))
  });

  const { exitCode } = process;
  process.exitCode = 0;

  return exitCode;
}

describe('Test262', function () {
  this.timeout(Infinity);

  it('Should pass tests', async () => {
    const exitCode = await runTest();
    t.equal(exitCode, 0);
  });
});
