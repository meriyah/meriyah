import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail } from '../../test-utils.ts';

describe('Miscellaneous - Regular expressions', () => {
  for (const text of [
    //    '/(?<abc𝟐def>foo\\k<abc𝟐def>)/',
    //    '/(?<輸xyz>foo)met\\k<輸xyz>/',
    String.raw`x = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;`,
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

  fail('Miscellaneous - Regular expressions (fail)', [
    'function *f(){   s = {foo: yield / x}   }',
    { code: 's = {foo: yield / x}', options: { impliedStrict: true } },
    'function *f(){   s = {"foo": yield / x}   }',
    String.raw`/(?<a>.)\k<a/`,
    String.raw`/\k<a(?<a>a)/`,
    '/(?<42a>a)/',
    '/(?<𝟐rest>foo)/',
    '/(?<𝟐>foo)/',
    { code: String.raw`/(?<\uD835\uDFD0rest>foo)/`, options: { webcompat: true } },
    { code: String.raw`/(?<abc\uD835\uDFD0def>foo\k<abc\uD835def>)/`, options: { sourceType: 'module' } },
    // Nodejs v18 now accepts unicode in capture group name
    // ['/(?<\\ud87e\\udddfrest>foo)/', Context.OptionsNext | Context.OptionsWebCompat],
    {
      code: outdent`
        function* f(){ yield
        /foo }
      `,
      options: { sourceType: 'module' },
    },
    { code: 'function l(){((/)/))(/]/)};', options: { sourceType: 'module' } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module' } },
    '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
    { code: 'e ?? f ?? g || h;', options: { sourceType: 'module' } },
    { code: 'c && d ?? e', options: { sourceType: 'module' } },
  ]);
});
