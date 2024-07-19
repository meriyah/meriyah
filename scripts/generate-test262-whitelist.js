const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const WHITELIST_FILE = path.join(__dirname, '../test/test262-parser-tests/whitelist.txt');
fs.writeFileSync(WHITELIST_FILE, '');

const stdout = childProcess.execSync('ts-node ./scripts/run-test262-cli.ts', { encoding: 'utf8' });
const lines = stdout
  .split('\n')
  .map((line) => line.trim().replaceAll('\\', '/'))
  .filter((line) => line.startsWith('language/'))
  .sort();

fs.writeFileSync(WHITELIST_FILE, lines.join('\n') + '\n');
