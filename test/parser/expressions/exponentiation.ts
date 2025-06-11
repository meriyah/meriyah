import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Expressions - Exponentiation', () => {
  for (const arg of [
    'delete O.p ** 10',
    'delete x ** 10',
    '~O.p ** 10',
    '~x ** 10',
    '!O.p ** 10',
    '!x ** 10',
    '+O.p ** 10',
    '+x ** 10',
    '-O.p ** 10',
    '-x ** 10',
    '!1 ** 2',
    'void 1 ** 2;',
    'typeof 1 ** 2;',
    'typeof O.p ** 10',
    'typeof x ** 10',
    'void ** 10',
    'void O.p ** 10',
    'void x ** 10',
    '-x ** y',
    '++delete O.p ** 10',
    '--delete O.p ** 10',
    '++~O.p ** 10',
    '++~x ** 10',
    '--!O.p ** 10',
    '--!x ** 10',
    '++-O.p ** 10',
    '++-x ** 10',
    '--+O.p ** 10',
    '--+x ** 10',
    '[ x ] **= [ 2 ]',
    '[ x **= 2 ] = [ 2 ]',
    '{ x } **= { x: 2 }',
    '{ x: x **= 2 ] = { x: 2 }',
  ]) {
    it(`let O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.throws(() => {
        parseSource(
          `let O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
          undefined,
          Context.OptionsNext | Context.Module,
        );
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Strict);
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Exponentiation (fail)', [
    ['+1 ** 2;', Context.None],
    ['-3 ** 2;', Context.None],
    ['!1 ** 2;', Context.None],
    ['delete o.p ** 2;', Context.None],
    ['~3 ** 2;', Context.None],
    ['(a * +a ** a ** 3)', Context.None],
    ['typeof 3 ** 2;', Context.None],
    ['delete 3 ** 2;', Context.None],
    ['!3 ** 2;', Context.None],
    ['-x ** 2;', Context.None],
    ['+x ** 2;', Context.None],
    ['(~3 ** 2)', Context.None],
    ['(typeof 3 ** 2)', Context.None],
    ['(delete 3 ** 2)', Context.None],
    ['(!3 ** 2)', Context.None],
    ['(+x ** 2)', Context.None],
    ['(a * +a ** a ** 3)', Context.None],
    ['for (var import.meta of [1]) {}', Context.None],
    ['async function f() { await 2 ** 2; }', Context.None],
  ]);

  for (const arg of [
    '(delete O.p) ** 10',
    '(~O.p) ** 10',
    '(~x) ** 10',
    '(!O.p) ** 10',
    '(!x) ** 10',
    '(+O.p) ** 10',
    '(+x) ** 10',
    '(-O.p) ** 10',
    'x ** y ** z',
    '++x ** y',
    '(-x) ** y',
    '-(x ** y)',
    '(-x) ** 10',
    '(typeof O.p) ** 10',
    '(typeof x) ** 10',
    '(void 0) ** 10',
    '(void O.p) ** 10',
    '(void x) ** 10',
    '2 ** ++exponent, 8',
    '2 ** -1 * 2, 1',
    '2 ** (3 ** 2)',
    '2 ** 3 ** 2, 512',
    '16 / 2 ** 2, 4',
    '++O.p ** 10',
    '++x ** 10',
    '--O.p ** 10',
    '--base ** 2',
    '2 ** !s',
    '2 ** +n',
    '!(3 ** 2)',
    '-(3 ** 2)',
    '--x ** 10',
    'O.p++ ** 10',
    'x++ ** 10',
    'O.p-- ** 10',
    'x-- ** 10',
  ]) {
    it(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`,
          undefined,
          Context.OptionsNext | Context.Module,
        );
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, undefined, Context.OptionsNext | Context.Strict);
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Exponentiation (pass)', [
    ['(base **= 3) === -27', Context.OptionsRanges],
    ['2 ** 4', Context.OptionsRanges],
    ['new x ** 2;', Context.OptionsRanges],
    ['true ** a', Context.None],
    ['++x ** a', Context.None],
    ['--x ** a', Context.None],
    ['x++ ** a', Context.None],
    ['x-- ** a', Context.None],
    ['+a * b ** c ** 3', Context.None],
    ['(2 ** 4)', Context.None],
    ['(new x ** 2)', Context.OptionsRanges],
    ['(true ** a)', Context.None],
    ['(++x ** a)', Context.OptionsRanges],
    ['(+c * b ** a ** 3)', Context.None],
    ['(+1) ** 2', Context.None],
    ['async function f() { (await 2) ** 2; }', Context.None],
    ['async function f() { await (2 ** 2); }', Context.None],
  ]);
});
