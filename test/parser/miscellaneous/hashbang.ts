import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail } from '../../test-utils.ts';

describe('Hashbang grammar', () => {
  fail('Hashbang grammar (fail)', [
    '\x20#!',
    '\r\n#!\n',
    '\r#!\n',
    '\n#!',
    { code: String.raw`\u0023!`, options: { webcompat: true } },
    '#\\u0021\n',
    '#\\u{21}\n',
    '#\\041\n',
    String.raw`#\u{21}`,
    String.raw`\x23!`,
    '#!\n#!',
    '/*\n*/#!',
    '"use strict"\n#!',
    String.raw`\u0023\u0021`,
    ';#!',
    '//\n#!',
    '{ #! }',
    '#\n/*\n\n*/',
    'function fn(a = #\\u0021\n) {}',
    '() => #\n/*\n\n*/',
  ]);

  for (const text of [
    '#!\n',
    '#!\n1',
    '#!2\n',
    '#!2\r',
    '#! these characters should be treated as a comment',
    '#!',
    '#!\n/*\n\n*/',
    '#!---IGNORED---\n',
    '#!---IGNORED---\n',
    '#!---IGNORED---\r',
    String.raw`#!---IGNORED---\xE2\x80\xA8`,
    String.raw`#!---IGNORED---\xE2\x80\xA9`,
    // Hashbang comments should not be interpreted and should not generate DirectivePrologues
    '#!"use strict" with ({}) {}',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    // Should pass in strict mode and module code

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { sourceType: 'module' });
      });
    });
  }
});

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
        parseSource(text, { webcompat: true });
      });
    });
    it(text, () => {
      t.throws(() => {
        parseSource(text);
      });
    });
    it(text, () => {
      t.throws(() => {
        parseSource(text, { sourceType: 'module' });
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
        parseSource(text, { webcompat: true });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { sourceType: 'module' });
      });
    });
  }
});
