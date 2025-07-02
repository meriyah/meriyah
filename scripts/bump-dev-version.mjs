#!/usr/bin/env node
import fs from 'node:fs/promises';
import packageJson from '../package.json' with { type: 'json' };

async function updateJson(file, process) {
  const json = JSON.parse(await fs.readFile(file));
  const updated = process(json);
  await fs.writeFile(file, JSON.stringify(updated, undefined, 2) + '\n');
}

async function run() {
  const versionRegExp = /(\d+)\.(\d+)\.(\d+)($|-)/;
  const match = packageJson.version.match(versionRegExp);
  if (match === null) {
    throw new Error(`package.json 'version' should match ${versionRegExp}`);
  }
  const major = match[1];
  const minor = match[2];
  const patch = match[3];
  console.log(`current version: ${major}.${minor}.${patch}`);

  const raw = new Date()
    .toISOString()
    .replace(/:|T|\.|-/g, '')
    .slice(0, 8);
  const y = raw.slice(0, 4);
  const m = raw.slice(4, 6);
  const d = raw.slice(6, 8);
  const dateStamp = `${y}${m}${d}`;
  const newVersion = `${major}.${minor}.${patch}-dev.${dateStamp}`;
  console.log(`new version: ${newVersion}`);

  await updateJson(new URL('../package.json', import.meta.url), (json) => ({ ...json, version: newVersion }));
}

await run();

console.log('Done.');
