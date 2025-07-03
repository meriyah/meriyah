import * as t from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it } from 'vitest';

const DIST_DIRECTORY = new URL('../../dist/', import.meta.url);

describe('Production test', async function () {
  const files = (await fs.readdir(DIST_DIRECTORY, { recursive: true, withFileTypes: true }))
    .filter((dirent) => dirent.isFile())
    .map((dirent) => {
      const url = pathToFileURL(path.join(dirent.parentPath, dirent.name));
      const relativePath = url.href.slice(DIST_DIRECTORY.href.length);
      return { url, relativePath };
    });

  for (const { relativePath, url } of files.filter((file) => !file.relativePath.startsWith('types'))) {
    it(relativePath, async () => {
      const meriyah = await import(url.href);

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
    t.ok(files.every((file) => !file.relativePath.endsWith('.d.ts.map')));

    const declarationFiles = files.filter((file) => file.relativePath.endsWith('.d.ts'));
    // Should emit `.d.ts` files
    t.ok(declarationFiles.length > 0);

    // `.d.ts` files should be emitted in `types/` directory
    t.ok(declarationFiles.every((file) => file.relativePath.startsWith('types/')));
  });
});
