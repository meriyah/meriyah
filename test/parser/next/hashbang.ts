import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Hashbang grammar', () => {
  fail('Next - Hashbang grammar', [
    ['\x20#!', Context.OptionsNext],
    ['\r\n#!\n', Context.OptionsNext],
    ['\r#!\n', Context.OptionsNext],
    ['\n#!', Context.OptionsNext],
    ['\\u0023!', Context.OptionsWebCompat],
    ['#\\u{21}', Context.None],
    ['\\x23!', Context.OptionsNext],
    [`#!\n#!`, Context.OptionsNext],
    ['/*\n*/#!', Context.OptionsNext],
    ['"use strict"\n#!', Context.OptionsNext],
    ['\\u0023\\u0021', Context.OptionsNext],
    [';#!', Context.OptionsNext],
    ['//\n#!', Context.OptionsNext],
    ['{ #! }', Context.OptionsNext]
  ]);

  for (const arg of [
    '#!\n',
    '#!\n1',
    '#!2\n',
    '#!2\r',
    '#! these characters should be treated as a comment',
    '#!',
    // Hashbang comments should not be interpreted and should not generate DirectivePrologues
    '#!"use strict" with ({}) {}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    // Should pass in strict mode and module code

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Strict | Context.Module);
      });
    });
  }
});
