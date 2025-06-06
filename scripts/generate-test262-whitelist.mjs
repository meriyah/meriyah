#!/usr/bin/env node
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';

const WHITELIST_FILE = new URL('../test/test262-parser-tests/whitelist.txt', import.meta.url);

await fs.writeFile(WHITELIST_FILE, '');

const stdout = childProcess.execSync('node ./scripts/run-test262-cli.mjs', { encoding: 'utf8' });

const lines = stdout
  .split('\n')
  .filter((line) => /^[ ]{3}.* \(default|strict mode\)$/.test(line))
  .map((line) => line.trim().replaceAll('\\', '/'))
  .sort();

await fs.writeFile(WHITELIST_FILE, lines.join('\n') + '\n');

console.log(`✅ test262 whitelist updated.`);
