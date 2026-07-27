#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.join(import.meta.dirname, '../');

for await (const snapshotRelativePath of fs.promises.glob('test/**/__snapshots__/*.ts.snap', { cwd: projectRoot })) {
  const snapshotFile = path.join(projectRoot, snapshotRelativePath);
  const scriptBaseName = path.basename(snapshotFile, '.snap');
  const scriptFile = path.join(snapshotFile, `../../${scriptBaseName}`);

  assert.ok(
    fs.existsSync(scriptFile),
    `Missing test file '${path.relative(projectRoot, scriptFile)}' for snapshot '${snapshotRelativePath}'.`,
  );
}
