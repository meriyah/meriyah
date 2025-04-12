import fs from 'node:fs/promises';
import url from 'node:url';
import path from 'node:path';
import * as t from 'assert';

describe('Production test', async function () {
  const directory = new URL('../../dist/', import.meta.url);
  const files = await fs.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    if (!file.isFile()) {
      continue;
    }

    it(file.name, async () => {
      const meriyah = await import(url.pathToFileURL(path.join(file.path, file.name)).href);

      t.equal(typeof meriyah.version, 'string');
      t.doesNotThrow(() => {
        meriyah.parse('foo()');
        meriyah.parseModule('import foo from "foo"');
        meriyah.parseScript('foo()');
      });
    });
  }
});
