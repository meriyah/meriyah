import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Hashbang grammar', () => {
  fail('Next - Hashbang grammar (fail)', [
    ['\x20#!', Context.None],
    ['\r\n#!\n', Context.None],
    ['\r#!\n', Context.None],
    ['\n#!', Context.None],
    ['\\u0023!', Context.OptionsWebCompat],
    ['#\\u0021\n', Context.None],
    ['#\\u{21}\n', Context.None],
    ['#\\041\n', Context.None],
    ['#\\u{21}', Context.None],
    ['\\x23!', Context.None],
    [`#!\n#!`, Context.None],
    ['/*\n*/#!', Context.None],
    ['"use strict"\n#!', Context.None],
    ['\\u0023\\u0021', Context.None],
    [';#!', Context.None],
    ['//\n#!', Context.None],
    ['{ #! }', Context.None],
    ['#\n/*\n\n*/', Context.None],
    ['function fn(a = #\\u0021\n) {}', Context.None],
    ['() => #\n/*\n\n*/', Context.None]
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
    '#!---IGNORED---\\xE2\\x80\\xA8',
    '#!---IGNORED---\\xE2\\x80\\xA9',
    // Hashbang comments should not be interpreted and should not generate DirectivePrologues
    '#!"use strict" with ({}) {}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    // Should pass in strict mode and module code

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }
});
