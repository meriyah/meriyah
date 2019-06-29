import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - If', () => {
  fail('Lexical - If (fail)', [
    ['if (x) var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['if (x) {} else var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['if (x) var foo = 1; else {} let foo = 1;', Context.OptionsLexical],
    ['if (x) var foo = 1; let foo = 1;', Context.OptionsLexical],

    ['if (x) {} else if (y) {} else var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['if (x) { if (y) var foo = 1; } let foo = 1;', Context.OptionsLexical],
    ['const x = a; function x(){};', Context.OptionsLexical],
    ['if (x) var foo = 1; let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical],
    ['if (x) var foo = 1; let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical],
    ['if (x) {} else var foo = 1; let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical],
    ['if (x) var foo = 1; else {} let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical],
    ['if (x) {} else if (y) {} else var foo = 1; let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical],
    ['if (x) { if (y) var foo = 1; } let foo = 1;', Context.OptionsWebCompat | Context.OptionsLexical]
  ]);

  for (const arg of ['if (x) var foo = 1; var foo = 1;']) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
});
