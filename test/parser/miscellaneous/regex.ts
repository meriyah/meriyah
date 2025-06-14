import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Regular expressions', () => {
  for (const arg of [
    //    '/(?<abc𝟐def>foo\\k<abc𝟐def>)/',
    //    '/(?<輸xyz>foo)met\\k<輸xyz>/',
    String.raw`x = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;`,
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

  fail('Miscellaneous - Regular expressions (fail)', [
    ['function *f(){   s = {foo: yield / x}   }', Context.OptionsNext],
    ['s = {foo: yield / x}', Context.OptionsNext | Context.Strict],
    ['function *f(){   s = {"foo": yield / x}   }', Context.OptionsNext],
    [String.raw`/(?<a>.)\k<a/`, Context.OptionsNext],
    [String.raw`/\k<a(?<a>a)/`, Context.OptionsNext],
    ['/(?<42a>a)/', Context.OptionsNext],
    ['/(?<𝟐rest>foo)/', Context.OptionsNext],
    ['/(?<𝟐>foo)/', Context.OptionsNext],
    [String.raw`/(?<\uD835\uDFD0rest>foo)/`, Context.OptionsWebCompat],
    [String.raw`/(?<abc\uD835\uDFD0def>foo\k<abc\uD835def>)/`, Context.OptionsNext | Context.Module | Context.Strict],
    // Nodejs v18 now accepts unicode in capture group name
    // ['/(?<\\ud87e\\udddfrest>foo)/', Context.OptionsNext | Context.OptionsWebCompat],
    [
      `function* f(){ yield
      /foo }`,
      Context.OptionsNext | Context.Module | Context.Strict,
    ],
    ['function l(){((/)/))(/]/)};', Context.OptionsNext | Context.Module | Context.Strict],
    ['0 ?? 1 && 2', Context.OptionsNext | Context.Module | Context.Strict],
    [
      '3 ?? 2 ** 1 % 0 / 9 * 8 - 7 + 6 >>> 5 >> 4 << 3 >= 2 <= 1 > 0 < 9 !== 8 === 7 != 6 == 5 & 4 ^ 3 | 2 && 1 || 0',
      Context.OptionsNext,
    ],
    ['e ?? f ?? g || h;', Context.OptionsNext | Context.Module | Context.Strict],
    ['c && d ?? e', Context.OptionsNext | Context.Module | Context.Strict],
  ]);
});
