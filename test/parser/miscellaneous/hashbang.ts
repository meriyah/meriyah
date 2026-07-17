import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';

describe('Miscellaneous - Hashbang', () => {
  for (const text of [
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
    ' #!---IGNORED---\n',
  ]) {
    it(text, () => {
      t.throws(() => {
        parseSource(text, { next: true, webcompat: true });
      });
    });
    it(text, () => {
      t.throws(() => {
        parseSource(text, { next: true });
      });
    });
    it(text, () => {
      t.throws(() => {
        parseSource(text, { sourceType: 'module', next: true });
      });
    });
  }

  for (const text of [
    '#!\n',
    '#!---IGNORED---\n',
    '#!---IGNORED---\r',
    '#!---IGNORED---\xE2\x80\xA8',
    '#!---IGNORED---\xE2\x80\xA9',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true, webcompat: true });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { sourceType: 'module', next: true });
      });
    });
  }
});
