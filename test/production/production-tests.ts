import { describe } from 'vitest';
import fs from 'node:fs/promises';
import url from 'node:url';
import * as t from 'node:assert/strict';

const DIST_DIRECTORY = new URL('../../dist/', import.meta.url);

describe('Production test', async function () {
  const files = (await fs.readdir(DIST_DIRECTORY, { recursive: true, withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name.replaceAll('\\', '/'));

  for (const file of files.filter((file) => !file.startsWith('types'))) {
    it(file, async () => {
      const meriyah = await import(new URL(file, DIST_DIRECTORY).href);

      t.equal(typeof meriyah.version, 'string');
      t.doesNotThrow(() => {
        meriyah.parse('foo()');
        meriyah.parseModule('import foo from "foo"');
        meriyah.parseScript('foo()');
      });
    });
  }

  it('Package structure', async () => {
    // Should not emit `.d.ts.map` files
    t.ok(files.every((file) => !file.endsWith('.d.ts.map')));

    const declarationFiles = files.filter((file) => file.endsWith('.d.ts'));
    // Should emit `.d.ts` files
    t.ok(declarationFiles.length > 0);

    // `.d.ts` files should be emitted in `types/` directory
    t.ok(declarationFiles.every((file) => file.startsWith('types/')));
  });
});
