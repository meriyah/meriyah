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

describe('Hashbang before HTML close comments', () => {
  for (const [name, text, column] of [
    ['LF', '#!x\n-->y', 0],
    ['CR', '#!x\r-->y', 0],
    ['CRLF', '#!x\r\n-->y', 0],
    ['LS', '#!x\u2028-->y', 0],
    ['PS', '#!x\u2029-->y', 0],
    ['whitespace', '#!x\n  -->y', 2],
    ['block comment', '#!x\n/*a*/-->y', 5],
    ['empty hashbang', '#!\n-->y', 0],
    ['empty HTML close comment', '#!x\n-->', 0],
  ] as const) {
    it(`accepts an HTML close comment after ${name}`, () => {
      t.doesNotThrow(() => parseSource(text, { webcompat: true }));
    });

    it(`requires webcompat after ${name}`, () => {
      t.throws(() => parseSource(text, { webcompat: false }), {
        message: `[2:${column}-2:${column + 2}]: HTML comments are only allowed with web compatibility (Annex B)`,
      });
    });

    it(`rejects an HTML close comment in a module after ${name}`, () => {
      t.throws(() => parseSource(text, { sourceType: 'module', webcompat: true }), {
        message: `[2:${column}-2:${column + 3}]: Unexpected token`,
      });
    });
  }

  it('keeps a decrement after a hashbang', () => {
    t.deepEqual(parseSource('#!x\n--y').body, [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'UpdateExpression',
          argument: { type: 'Identifier', name: 'y' },
          operator: '--',
          prefix: true,
        },
      },
    ]);
  });
});
