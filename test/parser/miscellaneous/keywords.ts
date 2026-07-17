import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { pass } from '../../test-utils.ts';

describe('Miscellaneous - Keywords', () => {
  for (const text of [
    'break = 1;',
    'case = 1;',
    'continue = 1;',
    'default = 1;',
    'function = 1;',
    'this = 1;',
    'var = 1;',
    'void = 1;',
    'with = 1;',
    'in = 1;',
    'var = 1;',
    'class',
    'if',
    'do = 1;',
    'continue',
    'for',
    'switch',
    'while = 1;',
    'try = 1;',
  ]) {
    it(text, () => {
      t.throws(() => {
        parseSource(text);
      });
    });

    it(`var ${text}`, () => {
      t.throws(() => {
        parseSource(`var ${text}`);
      });
    });

    it(`function () { ${text} }`, () => {
      t.throws(() => {
        parseSource(`function () { ${text} }`);
      });
    });
  }

  pass('Miscellaneous - Keywords (pass)', [
    'var foo = {}; foo.if;',
    'var foo = {}; foo.super;',
    'var foo = {}; foo.arguments;',
    'var foo = {}; foo.interface;',
    String.raw`function *a(){({yi\u0065ld: 0})}`,
  ]);
});
