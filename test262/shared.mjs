import * as fs from 'node:fs';
import url from 'node:url';
import { regexFeatures } from '../scripts/shared.mjs';

const TEST262_DIRECTORY = url.fileURLToPath(new URL('./test262/', import.meta.url));

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

export { TEST262_DIRECTORY, shouldSkip, whitelist };
