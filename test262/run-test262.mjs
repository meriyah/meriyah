import * as path from 'path';
import * as fs from 'fs';
import url from 'url';
import { regexFeatures } from '../scripts/shared.mjs';
import run from 'test262-parser-runner';
import downloadTest262 from './download-test262.mjs';

function loadList(filename) {
  const file = new URL(`./${filename}`, import.meta.url);
  return fs.existsSync(file)
    ? fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
    : [];
}

const unsupportedFeatures = new Set(loadList('unsupported-features.txt'));
if (!regexFeatures.unicodeSets) {
  unsupportedFeatures.add('regexp-v-flag');
}
if (!regexFeatures.modifiers) {
  unsupportedFeatures.add('regexp-modifiers');
}
if (!regexFeatures.duplicateNamedCapturingGroups) {
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
      testsDirectory: url.fileURLToPath(new URL('./test262/', import.meta.url)),
      skip: shouldSkip,
      whitelist: path.sep === '/' ? whitelist : whitelist.map((file) => file.replaceAll('/', path.sep)),
    },
  );

  const { exitCode } = process;
  process.exitCode = 0;

  return exitCode;
}

export default runTest;
