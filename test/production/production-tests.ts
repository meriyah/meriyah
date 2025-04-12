import { describe } from 'vitest';
import fs from 'node:fs/promises';
import url from 'node:url';
import path from 'node:path';
import * as t from 'assert';

const DIST_DIRECTORY = new URL('../../dist/', import.meta.url);

const glob = (pattern: string): Promise<string[]> =>
  // @ts-expect-error -- Safe
  Array.fromAsync(fs.glob(pattern, { cwd: url.fileURLToPath(DIST_DIRECTORY) }));

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

  it('Package structure', async () => {
    const files = [...(await glob('**/*'))].map((file) => file.replaceAll('\\', '/')).sort();

    // Should not emit `.d.ts.map` files
    t.ok(files.every((file) => !file.endsWith('.d.ts.map')));

    // Should emit `.d.ts` files
    t.ok(files.some((file) => file.endsWith('.d.ts')));

    // `.d.ts` files should be emitted in `types/` directory
    t.ok(files.every((file) => !file.endsWith('.d.ts') || file.startsWith('types/')));
  });
});
