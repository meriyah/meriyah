import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';

describe('Expressions - Compound assignment', () => {
  for (const arg of [
    `[a >>>= a];`,
    `[a >>>= a += a];`,
    `[a >>>= (a += a)];`,
    `[a >>>= (a += (a))];`,
    `[a >>>= a += {a}];`,
    `[a >>>= a += {a}];`,
    `[a >>>= a += a];`,
    `([a += a] );`,
    `([...a += a] );`,
    `[a >>>= (a)];`,
    `([...a += a += a += (a) >>>= 2]);`,
    '[...a %= (a)];',
    `obj.prop >>= 20;`,
    `a |= 2;`,
    `obj.prop &= 20;`,
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '({a *= -1})',
    '({a} *= -1)',
    '({a}) *=	-1',
    '({a} += a);',
    '([a] += a);',
    `({a} += {a});`,
    `[a >>>= {a} += {a}];`,
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
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Compound assignment (pass)', [
    ['base[prop()] /= expr();', Context.OptionsRanges],
    ['null && (x += null)', Context.OptionsRanges],
    ['y1 = (y %= 2);', Context.OptionsRanges],
    ['y1 = (y <<= 1);', Context.None],
    ['x ^= new String("1");', Context.OptionsRanges],
    ['x *= "1";', Context.None],
    ['obj.prop >>= 20;', Context.OptionsRanges],
    ['arguments &= 20;', Context.None],
    ['var z = (x *= -1);', Context.OptionsRanges],
    ['var z = (x %= y);', Context.None],
    ['x *= undefined;', Context.None],
    ['x -= 1;', Context.None],
    ['(new foo).bar()', Context.OptionsRanges],
    ['a.b.c(2020)', Context.OptionsRanges],
    ['a(0).b(14, 3, 77).c', Context.OptionsRanges],
    ['x >>= 1;', Context.OptionsRanges],
    ['var x1 = (x <<= 1);', Context.None],
    ['x |= 1;', Context.None],
    ['x /= true;', Context.None],
    ['obj.len &= 10;', Context.None],
    ['var x = 4;', Context.None],
    ['(x + y) >= z', Context.None],
    ['(x + y) <= z', Context.None],
    ['x *= undefined;', Context.None],
    ['x *= null;', Context.None],
    ['x |= "1";', Context.None],
    ['z = (x %= y);', Context.None],
    ['x += "1";', Context.None],
    ['x >>= true;', Context.None],

    ['x |= true', Context.None],

    ['x |= "1"', Context.None],
    ['x |= 1', Context.None],
    ['x += true', Context.None],
  ]);
});
