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
const whitelist = [
  ...loadList('whitelist.txt'),
  // Can't construct these regexps on Node.js v16
  ...(process.version.startsWith('v16.')
    ? [
        'built-ins/RegExp/named-groups/non-unicode-property-names-valid.js (default)',
        'built-ins/RegExp/named-groups/non-unicode-property-names-valid.js (strict mode)',
        'built-ins/RegExp/property-escapes/generated/Script_-_Kawi.js (default)',
        'built-ins/RegExp/property-escapes/generated/Script_-_Kawi.js (strict mode)',
        'built-ins/RegExp/property-escapes/generated/Script_-_Nag_Mundari.js (default)',
        'built-ins/RegExp/property-escapes/generated/Script_-_Nag_Mundari.js (strict mode)',
        'built-ins/RegExp/property-escapes/generated/Script_Extensions_-_Kawi.js (default)',
        'built-ins/RegExp/property-escapes/generated/Script_Extensions_-_Kawi.js (strict mode)',
        'built-ins/RegExp/property-escapes/generated/Script_Extensions_-_Nag_Mundari.js (default)',
        'built-ins/RegExp/property-escapes/generated/Script_Extensions_-_Nag_Mundari.js (strict mode)'
      ]
    : [])
];

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

export default runTest;
