import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Expressions - Compound assignment', () => {
  for (const arg of [
    '[a >>>= a];',
    '[a >>>= a += a];',
    '[a >>>= (a += a)];',
    '[a >>>= (a += (a))];',
    '[a >>>= a += {a}];',
    '[a >>>= a += {a}];',
    '[a >>>= a += a];',
    '([a += a] );',
    '([...a += a] );',
    '[a >>>= (a)];',
    '([...a += a += a += (a) >>>= 2]);',
    '[...a %= (a)];',
    'obj.prop >>= 20;',
    'a |= 2;',
    'obj.prop &= 20;',
    'obj.len ^= 10;',
    'var z = (x += 1);',
    'var z = (x <<= 1);',
    'x -= 1 ',
    'y1 = (y %= 2);',
    'y1 === -1',
    'x *= "1";',
    'x /= null;',
    'x >>>= true;',
    'if (scope.x !== 2) {}',
    'x /= y',
    'base[prop] /= expr();',
    'x	>>=	1, 0',
    'x	*=	-1',
    '({a: a *= -1})',
    '([a *= -1])',
    '([(a *= -1)])',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    '({a *= -1})',
    '({a} *= -1)',
    '({a}) *=	-1',
    '({a} += a);',
    '([a] += a);',
    '({a} += {a});',
    '[a >>>= {a} += {a}];',
    '[1 >>>= a];',
    '[a >>>= a] += 1;',
    '[a >>>= a] += a;',
    '({a: (b = 0)} = {})',
    '([(a = b)] = []',
    '({a: b += 0} = {})',
    '[a += b] = []',
    '0.toString',
    '0.toString',
    '1 >>>= 1;',
    '1 -= 1;',
    '1 &= 1;',
    '1 |= 1;',
    '1 = 1;',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true, sourceType: 'module' });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  pass('Expressions - Compound assignment (pass)', [
    { code: 'base[prop()] /= expr();', options: { ranges: true } },
    { code: 'null && (x += null)', options: { ranges: true } },
    { code: 'y1 = (y %= 2);', options: { ranges: true } },
    'y1 = (y <<= 1);',
    { code: 'x ^= new String("1");', options: { ranges: true } },
    'x *= "1";',
    { code: 'obj.prop >>= 20;', options: { ranges: true } },
    'arguments &= 20;',
    { code: 'var z = (x *= -1);', options: { ranges: true } },
    'var z = (x %= y);',
    'x *= undefined;',
    'x -= 1;',
    { code: '(new foo).bar()', options: { ranges: true } },
    { code: 'a.b.c(2020)', options: { ranges: true } },
    { code: 'a(0).b(14, 3, 77).c', options: { ranges: true } },
    { code: 'x >>= 1;', options: { ranges: true } },
    'var x1 = (x <<= 1);',
    'x |= 1;',
    'x /= true;',
    'obj.len &= 10;',
    'var x = 4;',
    '(x + y) >= z',
    '(x + y) <= z',
    'x *= undefined;',
    'x *= null;',
    'x |= "1";',
    'z = (x %= y);',
    'x += "1";',
    'x >>= true;',

    'x |= true',

    'x |= "1"',
    'x |= 1',
    'x += true',
  ]);
});
