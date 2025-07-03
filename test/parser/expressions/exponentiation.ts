import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`let O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, { next: true, sourceType: 'module' });
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, { next: true, impliedStrict: true });
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.throws(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, { webcompat: true });
      });
    });
  }

  fail('Expressions - Exponentiation (fail)', [
    '+1 ** 2;',
    '-3 ** 2;',
    '!1 ** 2;',
    'delete o.p ** 2;',
    '~3 ** 2;',
    '(a * +a ** a ** 3)',
    'typeof 3 ** 2;',
    'delete 3 ** 2;',
    '!3 ** 2;',
    '-x ** 2;',
    '+x ** 2;',
    '(~3 ** 2)',
    '(typeof 3 ** 2)',
    '(delete 3 ** 2)',
    '(!3 ** 2)',
    '(+x ** 2)',
    '(a * +a ** a ** 3)',
    'for (var import.meta of [1]) {}',
    'async function f() { await 2 ** 2; }',
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
        parseSource(`var O = { p: 1 }, x = 10; ; if (${arg}) { foo(); }`, { next: true, sourceType: 'module' });
      });
    });

    it(`var O = { p: 1 }, x = 10; ; (${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; ; (${arg})`, { next: true, impliedStrict: true });
      });
    });

    it(`var O = { p: 1 }, x = 10; foo(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`var O = { p: 1 }, x = 10; foo(${arg})`, { webcompat: true });
      });
    });
  }

  pass('Expressions - Exponentiation (pass)', [
    { code: '(base **= 3) === -27', options: { ranges: true } },
    { code: '2 ** 4', options: { ranges: true } },
    { code: 'new x ** 2;', options: { ranges: true } },
    'true ** a',
    '++x ** a',
    '--x ** a',
    'x++ ** a',
    'x-- ** a',
    '+a * b ** c ** 3',
    '(2 ** 4)',
    { code: '(new x ** 2)', options: { ranges: true } },
    '(true ** a)',
    { code: '(++x ** a)', options: { ranges: true } },
    '(+c * b ** a ** 3)',
    '(+1) ** 2',
    'async function f() { (await 2) ** 2; }',
    'async function f() { await (2 ** 2); }',
  ]);
});
