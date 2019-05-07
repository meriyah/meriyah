import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Miscellaneous - Literal', () => {
  for (const arg of [
    "('\\u{0000000000F8}')",
    "('\\u{00F8}')",
    "('\\7a')",
    "('\\5a')",
    "('\\2111')",
    "('\\1')",
    "('\u202a')",
    "('\\\u2028')",
    "('\\\n')",
    '("\\\\\\"")'
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
    "'use strict'; ('\\1')",
    "'use strict'; ('\\4')",
    "'use strict'; ('\\11')",
    "'use strict'; ('\\000')",
    "'use strict'; ('\\00')",
    "'use strict'; ('\\123')",
    "('\\x')",
    '(")',
    "('\\9')",
    '\\0009',
    '("\\u{FFFFFFF}")',
    "'",
    "(')",
    "('\n')"
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
      "('\\\\\\'')",
      Context.None,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              value: "\\'"
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '("x")',
      Context.None,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              value: 'x'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      "('\\0')",
      Context.None,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              value: '\u0000'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      "('\\7a')",
      Context.None,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              value: '\u0007a'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
