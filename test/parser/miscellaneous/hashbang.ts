import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Hashbang', () => {
  for (const arg of [
    '/**/ #!\n',
    '//---\n #!\n',
    'function fn() { #!\n }',
    '() => { #!\n }',
    'async function fn(a = #!\n ) {}',
    'class k { #!\n }',
    '[ #!\n ]',
    '() => #!\n',
    '/**/ #!\n',
    '#\\x21\n',
    '#\\041\n',
    '\\u0023!\n',
    '\\u{23}!\n',
    '\\x23!\n',
    '\\043!\n',
    '\\u0023\\u0021\n',
    '\n#!---IGNORED---\n',
    ' #!---IGNORED---\n'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    '#!\n',
    '#!---IGNORED---\n',
    '#!---IGNORED---\r',
    '#!---IGNORED---\xE2\x80\xA8',
    '#!---IGNORED---\xE2\x80\xA9'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsNext);
      });
    });
  }
});
