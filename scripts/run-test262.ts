import { parseScript, parseModule } from '../src/meriyah';
import * as path from 'path';
import * as fs from 'fs';
import run = require('test262-parser-runner');

const vFlagSupported = (() => {
  try {
    return new RegExp('', 'v').flags === 'v';
  } catch {
    return false;
  }
})();

function loadList(filename: string) {
  const file = path.join(__dirname, '../test/test262-parser-tests', filename);
  return fs.existsSync(file)
    ? fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
    : [];
}

const unsupportedFeatures = new Set(loadList('unsupported-features.txt'));
if (!vFlagSupported) {
  unsupportedFeatures.add('regexp-v-flag');
}
const whitelist = loadList('whitelist.txt');

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
  if (test.file.endsWith('.md')) {
    return true;
  }

  const features = test.attrs.features ?? [];
  return features.some((feature) => unsupportedFeatures.has(feature));
}

async function runTest() {
  await run(parse, {
    testsDirectory: path.dirname(require.resolve('test262/package.json')),
    skip: shouldSkip,
    whitelist: path.sep === '/' ? whitelist : whitelist.map((file) => file.replaceAll('/', path.sep))
  });

  const { exitCode } = process;
  process.exitCode = 0;

  return exitCode;
}

export default runTest;
