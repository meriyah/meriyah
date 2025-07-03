import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Assign', () => {
  fail('Expressions - Assign (fail)', [
    'a = b + c = d',
    '(({a})=0);',
    '(([a])=0);',
    '([(a = b)] = []',
    '42 = 42;',
    '"x" = 42;',
    '[(a = 0)] = 1',
  ]);

  for (const arg of [
    '[v2 = 10, vNull = 11, vHole = 12, vUndefined = 13, vOob = 14] = [2, null, , undefined];',
    ' [ xFn = function x() {}, fn = function() {} ] = []',
    '0, [ x = y ] = [];',
    '[a,b] = [b,a];',
    'a = (b, c)',
    'x <<= 42',
    'x &= 42;',
    'x /= 42',
    'arguments = 42',
    'x >>>= 42',
    'a=0;',
    '(a)=(0);',
    'x *= 0',
    'x.x *= 0',
    'x /= 0',
    'x **= 0',
    '((((((((((((((((((((((((((((((((((((((((a)))))))))))))))))))))))))))))))))))))))) = 0;',
    '[0].length = 0',
    '(a**b).c=0',
    'x = [ x = yield ] = [];',
    '0, [[ _ ]] = [ , ];',
    '0, [[ x ]] = [undefined];',
    'x = [[{}[yield]]] = [[22]];',
    'a = [{ x = yield }] =  [{}];',
    '0, [ c ] = [1];',
    'x = [] = "string literal";',
    'x = [...[x]] = [];',
    'x = [...[x]] = [1, 2, 3]',
    'x = [...{ 0: x, length }] = [null];',
    'x = [...x[yield]] = [33, 44, 55];',
    'x = { yield } = { yield: 3 };',
    'x = { xFn = function x() {}, fn = function() {} } = {}',
    'x = { x: arrow = () => {} } = {};',
    'x = { x: xCover = (0, function() {}), x: cover = (function() {}) } = {};',
    '0, { x: x = y } = {};',
    '0, { x: [ x ] } = { x: null };',
    '0, { x: [ x ] } = {};',
    '0, { a: c } = { a: 2 };',
    'x = { xy: x.y } = { xy: 4 };',
    'from === undefined',
    'of = 42',
    'if (from === undefined) {}',
    '([target()[targetKey()]] = source());',
    'x = { __proto__: x, __proto__: y } = value;',
    'x = x = y = null;',
    'x = ({ __proto__: x, __proto__: y } = value);',
    'arrow = () => {};',
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  pass('Expressions - Assign (pass)', [
    'a *= b',
    'a /= b',
    'a %= b',
    'a += b',
    'a -= b',
    'a <<= b',
    'a >>= b',
    'a >>>= b',
    'a |= b',
    'a ^= b',
    'a |= b',
    'a **= b',
    'a = b = c',
    'a = b = c = d',
    '(a) = b;',
    '((a)) = b;',
    'x = ((y)) = z',
    { code: 'a = ((b)) = c;', options: { ranges: true, loc: true } },
    'a ||= b',
    'a &&= b',
    { code: 'a ??= b', options: { ranges: true, loc: true } },
  ]);
});
