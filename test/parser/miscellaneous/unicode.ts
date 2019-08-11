import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Unicode', () => {
  for (const arg of [
    'var foob\\u123r = 0;',
    'var \\u123roo = 0;',
    '/regex/\\u0069g',
    'var foob\\u{c481r = 0;',
    'var foob\\uc481}r = 0;',
    'var \\u{0052oo = 0;',
    'var \\u0052}oo = 0;',
    'var foob\\u{}ar = 0;',
    '\\u{110000',
    'var foob\\v1234r = 0;',
    'var foob\\U1234r = 0;',
    'var foob\\v{1234}r = 0;',
    'var foob\\U{1234}r = 0;'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'var \\u0052oo = 0;',
    'var \\u{00000000052}oo = 0;',
    'var \\u{0052}oo = 0;',
    'var \\u{52}oo = 0;',
    'var foob\\uc481r = 0;',
    'var foob\\u{c481}r = 0;',
    'foob\\uc481r'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }
});
