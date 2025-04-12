import { Context } from '../../../src/common';
import { describe, it, expect } from 'bun:test';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Future reserved words', () => {
  describe('Failure', () => {
    for (const arg of ['var package = 1;', 'var private = 1;', 'var yield = 1;', 'var interface = 1;']) {
      it(`"use strict"; ${arg}`, () => {
        expect(() => {
          parseSource(`"use strict"; ${arg}`, undefined, Context.None);
        }).toThrow();
      });

      it(`"use strict"; ${arg}`, () => {
        expect(() => {
          parseSource(`"use strict"; ${arg}`, undefined, Context.OptionsWebCompat);
        }).toThrow();
      });

      it(`${arg}`, () => {
        expect(() => {
          parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
        }).toThrow();
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
      'var class = 1;'
    ]) {
      it(`${arg}`, () => {
        expect(() => {
          parseSource(`${arg}`, undefined, Context.None);
        }).toThrow();
      });
    }
  });
});
