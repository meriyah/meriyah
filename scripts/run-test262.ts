import { parseScript, parseModule } from '../src/meriyah';
import * as path from 'path';
import * as fs from 'fs';
import run = require('test262-parser-runner');

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
const whitelist = loadList('whitelist.txt');
// Ignore regexp tests like Babel
// https://github.com/babel/babel/blob/d65873827b00e4a0a3ed8fe59000cebd5d1dd82e/scripts/parser-tests/test262/index.js#L31
const ignoredTests = ['built-ins/RegExp/', 'language/literals/regexp/'];

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
  // strip `test/`
  const file = test.file.slice(5).replace(/\\/g, '/');
  if (file.endsWith('.md') || ignoredTests.some((start) => file.startsWith(start))) {
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
