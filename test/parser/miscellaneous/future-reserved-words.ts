import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Future reserved words', () => {
  describe('Failure', () => {
    for (const arg of ['var package = 1;', 'var private = 1;', 'var yield = 1;', 'var interface = 1;']) {
      it(`"use strict"; ${arg}`, () => {
        t.throws(() => {
          parseSource(`"use strict"; ${arg}`);
        });
      });

      it(`"use strict"; ${arg}`, () => {
        t.throws(() => {
          parseSource(`"use strict"; ${arg}`, { webcompat: true });
        });
      });

      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`, { sourceType: 'module' });
        });
      });
    }

    for (const arg of [
      'var class = 1;',
      'var const = 1;',
      'var debugger = 1;',
      'var export = 1;',
      'var import = 1;',
      'var class = 1;',
      'var super = 1;',
      'var class = 1;',
      'var class = 1;',
    ]) {
      it(`${arg}`, () => {
        t.throws(() => {
          parseSource(`${arg}`);
        });
      });
    }
  });
});
