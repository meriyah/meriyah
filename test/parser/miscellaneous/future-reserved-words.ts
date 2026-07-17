import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';

describe('Miscellaneous - Future reserved words', () => {
  describe('Failure', () => {
    for (const text of ['var package = 1;', 'var private = 1;', 'var yield = 1;', 'var interface = 1;']) {
      it(`"use strict"; ${text}`, () => {
        t.throws(() => {
          parseSource(`"use strict"; ${text}`);
        });
      });

      it(`"use strict"; ${text}`, () => {
        t.throws(() => {
          parseSource(`"use strict"; ${text}`, { webcompat: true });
        });
      });

      it(text, () => {
        t.throws(() => {
          parseSource(text, { sourceType: 'module' });
        });
      });
    }

    for (const text of [
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
      it(text, () => {
        t.throws(() => {
          parseSource(text);
        });
      });
    }
  });
});
