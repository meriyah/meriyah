import fs from 'node:fs/promises';
import url from 'node:url';
import path from 'node:path';
import * as t from 'assert';

const DIST_DIRECTORY = new URL('../../dist/', import.meta.url);

describe('Production test', async function () {
  const files = await fs.readdir(DIST_DIRECTORY, { withFileTypes: true });

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

const glob = (pattern: string): Promise<string[]> =>
  // @ts-expect-error -- Safe
  Array.fromAsync(fs.glob(pattern, { cwd: url.fileURLToPath(DIST_DIRECTORY) }));

describe('Types', () => {
  it('Should emit `.d.ts` files', async () => {
    const files = await glob('**/*.d.ts');
    t.ok(files.length > 0);
  });

  it('Should not emit `.d.ts.map` files', async () => {
    const files = await glob('**/*.d.ts.map');
    t.deepEqual(files, []);
  });
});
