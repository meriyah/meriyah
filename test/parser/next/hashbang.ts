import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Next - Hashbang grammar', () => {
  fail('Next - Hashbang grammar (fail)', [
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

  for (const arg of [
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
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    // Should pass in strict mode and module code

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }
});
