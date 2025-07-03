import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Unicode', () => {
  for (const arg of [
    String.raw`var foob\u123r = 0;`,
    String.raw`var \u123roo = 0;`,
    String.raw`/regex/\u0069g`,
    String.raw`var foob\u{c481r = 0;`,
    String.raw`var foob\uc481}r = 0;`,
    String.raw`var \u{0052oo = 0;`,
    String.raw`var \u0052}oo = 0;`,
    String.raw`var foob\u{}ar = 0;`,
    String.raw`\u{110000`,
    String.raw`var foob\v1234r = 0;`,
    String.raw`var foob\U1234r = 0;`,
    String.raw`var foob\v{1234}r = 0;`,
    String.raw`var foob\U{1234}r = 0;`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    String.raw`var \u0052oo = 0;`,
    String.raw`var \u{00000000052}oo = 0;`,
    String.raw`var \u{0052}oo = 0;`,
    String.raw`var \u{52}oo = 0;`,
    String.raw`var foob\uc481r = 0;`,
    String.raw`var foob\u{c481}r = 0;`,
    String.raw`foob\uc481r`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }
});
