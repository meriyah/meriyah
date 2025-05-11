import * as path from 'path';
import * as fs from 'fs';
import module from 'module';
import { supportsUnicodeSets, supportsDuplicateNamedCapturingGroups, supportsModifiers } from './shared.mjs';
import run from 'test262-parser-runner';

function loadList(filename) {
  const file = new URL(`../test/test262-parser-tests/${filename}`, import.meta.url);
  return fs.existsSync(file)
    ? fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
    : [];
}

const unsupportedFeatures = new Set(loadList('unsupported-features.txt'));
if (!supportsUnicodeSets) {
  unsupportedFeatures.add('regexp-v-flag');
}
if (!supportsModifiers) {
  unsupportedFeatures.add('regexp-modifiers');
}
if (!supportsDuplicateNamedCapturingGroups) {
  unsupportedFeatures.add('regexp-duplicate-named-groups');
}
const whitelist = loadList('whitelist.txt');

function shouldSkip(test) {
  if (test.file.endsWith('.md') || test.file.endsWith('.py')) {
    return true;
  }

  const features = test.attrs.features ?? [];
  return features.some((feature) => unsupportedFeatures.has(feature));
}

async function runTest(meriyah) {
  const require = module.createRequire(import.meta.url);
  await run(
    (content, { sourceType }) =>
      (sourceType === 'module' ? meriyah.parseModule : meriyah.parseScript)(content, {
        webcompat: true,
        lexical: true,
        next: true
      }),
    {
      testsDirectory: path.dirname(require.resolve('test262/package.json')),
      skip: shouldSkip,
      whitelist: path.sep === '/' ? whitelist : whitelist.map((file) => file.replaceAll('/', path.sep))
    }
  );

  const { exitCode } = process;
  process.exitCode = 0;

  return exitCode;
}

export default runTest;
