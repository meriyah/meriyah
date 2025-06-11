import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Next - Nullish Coalescing', () => {
  for (const arg of [
    'var foo = object.foo ?? "default";',
    'undefined ?? 3',
    'null ?? 3',
    '(a ?? b) && c',
    'a && (b ?? c)',
    '(a ?? b) || c',
    'true ?? 3',
    'false ?? 3',
    'async ?? 3',
    'yield ?? 3',
    'package ?? 3',
    'private ?? 3',
    `0 ?? 3`,
    '(a || b)',
    '1 | null ?? 3',
    '1 ^ null ?? 3',
    '1 & null ?? 3',
    '3 == null ?? 3',
    '3 != null ?? 3',
    '3 === null ?? 3',
    '3 !== null ?? 3',
    'x.y = z.y ?? "string";',
    'a.b ?? -1;',
    '1 < null ?? 3',
    '1 > null ?? 3',
    '1 <= null ?? 3',
    '1 >= null ?? 3',
    '1 << null ?? 3',
    '1 >> null ?? 3',
    '1 >>> null ?? 3',
    '1 + null ?? 3',
    '1 - null ?? 3',
    '1 * null ?? 3',
    '1 / null ?? 3',
    'isNaN(1 % null ?? 3)',
    '1 ** null ?? 3',
    '1 ?? 3',
    `foo ||bar;
    (x => x)|| bar;
    (function a(x){return x;})|| 2;
    0||(function(){return alpha;});
    a ?? (b || c);`,
    'var result = obj??key;',
    'arr??[idx]',
    'async??[idx]',
    'func??(arg)',
    `({} ?? 3) instanceof Object`,
    `([] ?? 3) instanceof Array`,
    `async([] ?? 3) instanceof Array`,
    `foo(async bar =>x, "string", async ?? b)`,
    `foo(async,"string", async()=>x ?? b)`,
    `async(async,"string", async()=>x ?? b)`,
    `async(async,"string", async()=>yield ?? b)`,
    `yield(async,"string", async()=>x ?? b)`,
    `(['hi'] ?? 3)[0]`,
    `(makeMasquerader() ?? 3) == null`,
    '1 | null ?? 3',
    `1 ^ null ?? 3`,
    `1 & null ?? 3`,
    `3 != null ?? 3`,
    '1 > null ?? 3',
    '1 <= null ?? 3',
    '1 >> null ?? 3',
    `isNaN(1 % null ?? 3)`,
    `1 ** null ?? 3`,
    `(0 || 1) ?? 2`,
    `(0 && 1) ?? 2`,
    `0 && (1 ?? 2)`,
    `(0 ?? 1) || 2`,
    `(0 ?? 1) || 2`,
    `(0 ?? 1) && 2`,
    `0 ?? (1 && 2)`,
    'null ?? "hello"',
    `0 || 1 && 2 | 3 ^ 4 & 5 == 6 != 7 === 8 !== 9 < 0 > 1 <= 2 >= 3 << 4 >> 5 >>> 6 + 7 - 8 * 9 / 0 % 1 ** 2`,
    'a.b ?? c.d ?? e ()',
    'async.await??c.d??async ()',
    'a.b??c.d??e ()',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  fail('Expressions - Nullish Coalescing (fail)', [
    ['c && d ?? e', Context.OptionsNext],
    ['a??x = true?.(123)', Context.OptionsNext],
    ['a??x = (true?.(123))', Context.OptionsNext],
    ['({a:let??foo} = 0);', Context.OptionsNext],
    ['obj.??(defObj)', Context.OptionsNext],
    ['[a ?? b, c] = f(() => {  }); ', Context.OptionsNext],
    ['[a, x ?? z] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }); ', Context.OptionsNext],
    ['a.??(nil).b.c.d.??(null)', Context.OptionsNext],
    ['c && d ?? e', Context.OptionsWebCompat],
    ['0 && 1 ?? 2', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 && 1 ?? 2', Context.OptionsNext | Context.OptionsWebCompat],
    ['0 ?? 1 || 2', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 ?? 1 && 2', Context.OptionsNext | Context.Module | Context.Strict],
    ['a ?? b || c', Context.OptionsNext | Context.Module | Context.Strict],
    ['a || b ?? c', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 ?? 1 && 2', Context.OptionsNext | Context.Module | Context.Strict],

    [
      '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
      Context.OptionsNext,
    ],
    ['e ?? f ?? g || h;', Context.OptionsNext | Context.Module | Context.Strict],
    ['c && d ?? e', Context.OptionsNext | Context.Module | Context.Strict],
  ]);

  pass('Next - Null Coalescing (pass)', [
    [`({ x: 'hi' } ?? 3).x`, Context.OptionsNext],
    [`'hi' ?? 3`, Context.OptionsNext],
    [`undefined ?? 3`, Context.OptionsNext],
    [`1 << null ?? 3`, Context.OptionsNext],
    [`1 / null ?? 3`, Context.OptionsNext],
    [`a ?? (b && c);`, Context.OptionsNext],
    [
      `a
        ?? b
        ?? c;`,
      Context.OptionsNext,
    ],
    [`foo ?? 1;`, Context.OptionsNext],
    [`a ?? b ?? c;`, Context.OptionsNext],
    [`a ?? (b || c);`, Context.OptionsNext],
    [`(a || b) ?? c;`, Context.OptionsNext],
    [`(a && b) ?? c`, Context.OptionsNext],
  ]);
});
