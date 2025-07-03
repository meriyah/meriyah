import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Miscellaneous - Regular expressions', () => {
  for (const arg of [
    //    '/(?<abc𝟐def>foo\\k<abc𝟐def>)/',
    //    '/(?<輸xyz>foo)met\\k<輸xyz>/',
    String.raw`x = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;`,
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

  fail('Miscellaneous - Regular expressions (fail)', [
    { code: 'function *f(){   s = {foo: yield / x}   }', options: { next: true } },
    { code: 's = {foo: yield / x}', options: { impliedStrict: true, next: true } },
    { code: 'function *f(){   s = {"foo": yield / x}   }', options: { next: true } },
    { code: String.raw`/(?<a>.)\k<a/`, options: { next: true } },
    { code: String.raw`/\k<a(?<a>a)/`, options: { next: true } },
    { code: '/(?<42a>a)/', options: { next: true } },
    { code: '/(?<𝟐rest>foo)/', options: { next: true } },
    { code: '/(?<𝟐>foo)/', options: { next: true } },
    { code: String.raw`/(?<\uD835\uDFD0rest>foo)/`, options: { webcompat: true } },
    { code: String.raw`/(?<abc\uD835\uDFD0def>foo\k<abc\uD835def>)/`, options: { sourceType: 'module', next: true } },
    // Nodejs v18 now accepts unicode in capture group name
    // ['/(?<\\ud87e\\udddfrest>foo)/', Context.OptionsNext | Context.OptionsWebCompat],
    {
      code: outdent`
        function* f(){ yield
        /foo }
      `,
      options: { sourceType: 'module', next: true },
    },
    { code: 'function l(){((/)/))(/]/)};', options: { sourceType: 'module', next: true } },
    { code: '0 ?? 1 && 2', options: { sourceType: 'module', next: true } },
    {
      code: '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
      options: { next: true },
    },
    { code: 'e ?? f ?? g || h;', options: { sourceType: 'module', next: true } },
    { code: 'c && d ?? e', options: { sourceType: 'module', next: true } },
  ]);
});
