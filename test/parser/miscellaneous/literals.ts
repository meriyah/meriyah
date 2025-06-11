import { Context } from '../../../src/common';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Miscellaneous - Literal', () => {
  for (const arg of [
    String.raw`('\u{0000000000F8}')`,
    String.raw`('\u{00F8}')`,
    String.raw`('\7a')`,
    String.raw`('\5a')`,
    String.raw`('\2111')`,
    String.raw`('\1')`,
    "('\u202a')",
    "('\\\u2028')",
    "('\\\n')",
    String.raw`("\\\"")`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    String.raw`'use strict'; ('\1')`,
    String.raw`'use strict'; ('\4')`,
    String.raw`'use strict'; ('\11')`,
    String.raw`'use strict'; ('\000')`,
    String.raw`'use strict'; ('\00')`,
    String.raw`'use strict'; ('\123')`,
    String.raw`('\x')`,
    '(")',
    String.raw`\0009`,
    String.raw`("\u{FFFFFFF}")`,
    "'",
    "(')",
    "('\n')",
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  pass('Miscellaneous - Literal (pass)', [
    [
      String.raw`('\\\'')`,
      Context.None,
      
    ],
    [
      '("x")',
      Context.None,
      
    ],
    [
      String.raw`('\0')`,
      Context.None,
      
    ],
    [
      String.raw`('\7a')`,
      Context.None,
      
    ],
  ]);
});
