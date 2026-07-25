import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail, pass } from '../../test-utils.ts';

describe('Next - Nullish Coalescing', () => {
  for (const text of [
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
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { lexical: true });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true, lexical: true });
      });
    });
  }

  fail('Expressions - Nullish Coalescing (fail)', [
    { code: 'c && d ?? e' },
    { code: 'a??x = true?.(123)' },
    { code: 'a??x = (true?.(123))' },
    { code: '({a:let??foo} = 0);' },
    { code: 'obj.??(defObj)' },
    { code: '[a ?? b, c] = f(() => {  }); ' },
    { code: '[a, x ?? z] = f(() => { [a, b.c] = [d.e, (f.g) = h]; }); ' },
    { code: 'a.??(nil).b.c.d.??(null)' },
    { code: 'c && d ?? e', options: { webcompat: true } },
    { code: '0 && 1 ?? 2', options: { sourceType: 'module' } },
    { code: '0 && 1 ?? 2', options: { webcompat: true } },
    { code: '0 ?? 1 || 2', options: { sourceType: 'module' } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module' } },
    { code: 'a ?? b || c', options: { sourceType: 'module' } },
    { code: 'a || b ?? c', options: { sourceType: 'module' } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module' } },

    {
      code: '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
    },
    { code: 'e ?? f ?? g || h;', options: { sourceType: 'module' } },
    { code: 'c && d ?? e', options: { sourceType: 'module' } },
  ]);

  pass('Next - Null Coalescing (pass)', [
    { code: "({ x: 'hi' } ?? 3).x" },
    { code: "'hi' ?? 3" },
    { code: 'undefined ?? 3' },
    { code: '1 << null ?? 3' },
    { code: '1 / null ?? 3' },
    { code: 'a ?? (b && c);' },
    {
      code: outdent`
        a
          ?? b
          ?? c;
      `,
    },
    { code: 'foo ?? 1;' },
    { code: 'a ?? b ?? c;' },
    { code: 'a ?? (b || c);' },
    { code: '(a || b) ?? c;' },
    { code: '(a && b) ?? c' },
  ]);
});
