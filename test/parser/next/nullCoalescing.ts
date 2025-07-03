import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
    '0 ?? 3',
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
    outdent`
      foo ||bar;
      (x => x)|| bar;
      (function a(x){return x;})|| 2;
      0||(function(){return alpha;});
      a ?? (b || c);
    `,
    'var result = obj??key;',
    'arr??[idx]',
    'async??[idx]',
    'func??(arg)',
    '({} ?? 3) instanceof Object',
    '([] ?? 3) instanceof Array',
    'async([] ?? 3) instanceof Array',
    'foo(async bar =>x, "string", async ?? b)',
    'foo(async,"string", async()=>x ?? b)',
    'async(async,"string", async()=>x ?? b)',
    'async(async,"string", async()=>yield ?? b)',
    'yield(async,"string", async()=>x ?? b)',
    "(['hi'] ?? 3)[0]",
    '(makeMasquerader() ?? 3) == null',
    '1 | null ?? 3',
    '1 ^ null ?? 3',
    '1 & null ?? 3',
    '3 != null ?? 3',
    '1 > null ?? 3',
    '1 <= null ?? 3',
    '1 >> null ?? 3',
    'isNaN(1 % null ?? 3)',
    '1 ** null ?? 3',
    '(0 || 1) ?? 2',
    '(0 && 1) ?? 2',
    '0 && (1 ?? 2)',
    '(0 ?? 1) || 2',
    '(0 ?? 1) || 2',
    '(0 ?? 1) && 2',
    '0 ?? (1 && 2)',
    'null ?? "hello"',
    '0 || 1 && 2 | 3 ^ 4 & 5 == 6 != 7 === 8 !== 9 < 0 > 1 <= 2 >= 3 << 4 >> 5 >>> 6 + 7 - 8 * 9 / 0 % 1 ** 2',
    'a.b ?? c.d ?? e ()',
    'async.await??c.d??async ()',
    'a.b??c.d??e ()',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }

  fail('Expressions - Nullish Coalescing (fail)', [
    { code: 'c && d ?? e', options: { next: true } },
    { code: 'a??x = true?.(123)', options: { next: true } },
    { code: 'a??x = (true?.(123))', options: { next: true } },
    { code: '({a:let??foo} = 0);', options: { next: true } },
    { code: 'obj.??(defObj)', options: { next: true } },
    { code: '[a ?? b, c] = f(() => {  }); ', options: { next: true } },
    { code: '[a, x ?? z] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }); ', options: { next: true } },
    { code: 'a.??(nil).b.c.d.??(null)', options: { next: true } },
    { code: 'c && d ?? e', options: { webcompat: true } },
    { code: '0 && 1 ?? 2', options: { sourceType: 'module', next: true } },
    { code: '0 && 1 ?? 2', options: { webcompat: true, next: true } },
    { code: '0 ?? 1 || 2', options: { sourceType: 'module', next: true } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module', next: true } },
    { code: 'a ?? b || c', options: { sourceType: 'module', next: true } },
    { code: 'a || b ?? c', options: { sourceType: 'module', next: true } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module', next: true } },

    {
      code: '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
      options: { next: true },
    },
    { code: 'e ?? f ?? g || h;', options: { sourceType: 'module', next: true } },
    { code: 'c && d ?? e', options: { sourceType: 'module', next: true } },
  ]);

  pass('Next - Null Coalescing (pass)', [
    { code: "({ x: 'hi' } ?? 3).x", options: { next: true } },
    { code: "'hi' ?? 3", options: { next: true } },
    { code: 'undefined ?? 3', options: { next: true } },
    { code: '1 << null ?? 3', options: { next: true } },
    { code: '1 / null ?? 3', options: { next: true } },
    { code: 'a ?? (b && c);', options: { next: true } },
    {
      code: outdent`
        a
          ?? b
          ?? c;
      `,
      options: { next: true },
    },
    { code: 'foo ?? 1;', options: { next: true } },
    { code: 'a ?? b ?? c;', options: { next: true } },
    { code: 'a ?? (b || c);', options: { next: true } },
    { code: '(a || b) ?? c;', options: { next: true } },
    { code: '(a && b) ?? c', options: { next: true } },
  ]);
});
