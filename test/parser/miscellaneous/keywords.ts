import { Context } from '../../../src/common';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Miscellaneous - Keywords', () => {
  for (const arg of [
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
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`var ${arg}`, () => {
      t.throws(() => {
        parseSource(`var ${arg}`, undefined, Context.None);
      });
    });

    it(`function () { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function () { ${arg} }`, undefined, Context.None);
      });
    });
  }

  pass('Miscellaneous - Keywords (pass)', [
    [`var foo = {}; foo.if;`, Context.None],
    [`var foo = {}; foo.super;`, Context.None],
    [`var foo = {}; foo.arguments;`, Context.None],
    [`var foo = {}; foo.interface;`, Context.None],
    [`function *a(){({yi\\u0065ld: 0})}`, Context.None],
  ]);
});
