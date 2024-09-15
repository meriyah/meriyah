import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Directives', () => {
  for (const arg of [
    '"\\1;" "use strict";',
    '"\\2;" "use strict";',
    '"\\3;" "use strict";',
    '"\\4;" "use strict";',
    '"\\5;" "use strict";',
    '"\\6;" "use strict";',
    '"\\7;" "use strict";',
    '"\\8;" "use strict";',
    '"\\9;" "use strict";',
    '"use strict"; function f(){"\\1";}',
    '"\\1;" "use strict"; null',
    '"use strict"; with (a) b = c;',
    '"use strict"; "\\1;"',
    '"use strict"; "\\2;"',
    '"use strict"; "\\3;"',
    '"use strict"; "\\4;"',
    '"use strict"; "\\5;"',
    '"use strict"; "\\6;"',
    '"use strict"; "\\7;"',
    '"use strict"; "\\8;"',
    '"use strict"; "\\9;"',
    '"use strict"; "\\1;" null',
    '"random\\x0\nnewline"',
    '"random\\u\nnewline"',
    '"random\\u0\nnewline"',
    '"random\\ua\u2029newline"',
    '"random\\ua\rnewline"',
    '"random\\u0a\nnewline"',
    '"random\\u000\nnewline"',
    '"random\\u00a\nnewline"',
    '"random\\u{0\nnewline"',
    '"random\\u{a\nnewline"',
    "'random\\x foo'",
    '"random\\u{a\rnewline"',
    "'random\\u foo'",
    "'random\\u0 foo'",
    "'random\\u00 foo'",
    "'random\\u0a foo'",
    "'random\\x0\\ foo'",
    "'random\\ua\\ foo'",
    "'random\\x0\\ foo'",
    "'random\\u0a\\ foo'",
    "'random\\xx foo'",
    "'random\\u00a\\ foo'",
    "'random\\uax foo'",
    "'random\\u0au foo'",
    '"use strict" ++',
    '"use strict" \\1',
    '"use strict" "\\1"',
    '"use strict"; "\\1";',
    '"use strict" ++',
    `function foo() { "use strict"; with (a) b = c; }`,
    '"use strict"; function foo() { with (a) b = c; }',
    '"use strict"; function hello() { "\\000"; }',
    '"use strict"; function hello() { "\\00"; }',
    '"use strict"; function hello() { "\\0123"; }',
    'function hello() { "use strict"; "\\000"; }',
    'function hello() { "use strict"; "\\00"; }',
    'function hello() { "use strict"; "\\0123"; }',
    'function hello("\\000008") { "use strict"; }',
    ` function fun() {
                "use strict";
                       var public = 1;
            }`,
    ` function fun() {
              "use strict"
                     var public = 1;
          }`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`/* comment in front */ ${arg}`, () => {
      t.throws(() => {
        parseSource(`/* comment in front */ ${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg} }`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    '("use strict")',
    '"\\n\\r\\t\\v\\b\\f\\\\\\\'\\"\\0"',
    '"use some future directive"',
    '"use some future directive";',
    '"use some future directive"; "use strict";',
    '"Hello\\312World"',
    '"use strict"',
    "'use\\x20strict'",
    '"use\\x20strict"',
    "'use asm'",
    "'use asm'; 'use strict'",
    "'use asm' \n 'use strict'",
    '"use asm" \n "use strict"',
    "'use asm' \r 'use strict'",
    '"use asm" \r "use strict"',
    "'use asm' \r\n 'use strict'",
    '"use asm" \r\n "use strict"',
    "'use asm' \u2028 'use strict'",
    '"use asm" \u2028 "use strict"',
    "'use asm' \u2029 'use strict'",
    '"use asm" \u2029 "use strict"',
    'function foo() { "use \\u0020strict"; with (a) b = c; }',
    '"use \\u0020strict"; function foo() { with (a) b = c; }',
    '"use strict"\n foo',
    "'use strict'; foo",
    'function foo() { "use strict"\n bar }',
    '!function foo() { "use strict"\n bar }',
    '() => { "use strict"\n foo }',
    '() => "use strict"',
    '({ wrap() { "use strict"; foo } })',
    '"\\u0075se strict"',
    '"use asm"; "use strict"; foo',
    'function wrap() { "use asm"; "use strict"; foo }',
    '"use strict"; foo; "use asm"',
    'function wrap() { "use asm"; foo; "use strict" }',
    '{ "use strict"; }',
    'function wrap() { { "use strict" } foo }',
    '("use strict"); foo',
    'function wrap() { ("use strict"); foo }',
    'function a() { "use strict" } "use strict"; foo',
    'try { "use strict"; var public = 1; } catch (e) {}',
    '"use asm" \u2029 "use strict"',
    '"\\n\\r\\t\\v\\b\\f\\\\\\\'\\"\\0"',
    '"Hello\\312World"',
    `"use strict"; + 1`,
    `function wrap() { "use strict"\n foo }`,
    `"\\u0075se strict"`,
    'function wrap() { { "use strict" } foo }',
    '"Hello\\0World"',
    '("use strict"); foo = 42;',
    '("use strict"); eval = 42;',
    '"USE STRICT";  var public = 1;',
    'function wrap() { "use asm"; "use strict"; foo }',
    '{ "use strict"; }',
    'function a() { "use strict" } "use strict"; foo;',
    'function foo() { "use \\u0020strict"; with (a) b = c; }',
    '"use \\u0020strict"; with (a) b = c;',
    `function foo()
    {
       "bogus directive";
       "use strict";
       return (this === undefined);
    }`,
    '"use strict", "Hello\\312World"',
    '"use strict" + "Hello\\312World"',
    '"use strict", "Hello\\312World"',
    '"use strict", "Hello\\312World"',
    'function foo() { "use strict" .foo }',
    '"use strict"; "\\0";',
    '"\\0"; "use strict";',
    'function a() {"use strict"; "\\0";}',
    'function a() {"\\0"; "use strict";}'
  ]) {
    it(`/* comment in front */ ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`/* comment in front */ ${arg}`, undefined, Context.OptionsRaw);
      });
    });

    it(`/* comment in front */ ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`/* comment in front */ ${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsRaw);
      });
    });
  }

  for (const arg of ['.foo', '[foo]', '()', '`x`', ' + x', '/f', '/f/g']) {
    t.throws(() => {
      parseSource(`function f(){ "use strict" \n /* suffix = */   ${arg} ; eval = 1; }`, undefined, Context.Strict);
    });
  }

  for (const arg of ['foo', '++x', '--x', 'function f(){}', '{x}', ';', '25', 'true']) {
    t.throws(() => {
      parseSource(`function f(){ "use strict" \n  ${arg} ; eval = 1; }`, undefined, Context.None);
    });
  }

  fail('Miscellaneous - Directives (fail)', [
    ['"use strict"; var static;', Context.None],
    ['\\u0061sync function f(){}', Context.None],
    ['"use strict" "Hello\\312World"', Context.None],
    ['"use strict" \n "Hello\\312World"', Context.None],
    ['function a() { "use strict" "Hello\\312World" }', Context.None],
    ['function a() { "use strict" \n "Hello\\312World" }', Context.None]
  ]);

  pass('Miscellaneous - Directives (pass)', [
    [
      '"use strict" + "Hello\\312World"',
      Context.Module | Context.OptionsRanges | Context.OptionsRaw,
      {
        body: [
          {
            expression: {
              left: {
                raw: '"use strict"',
                start: 0,
                end: 12,
                range: [0, 12],
                type: 'Literal',
                value: 'use strict'
              },
              operator: '+',
              right: {
                raw: '"Hello\\312World"',
                start: 15,
                end: 31,
                range: [15, 31],
                type: 'Literal',
                value: 'HelloÊWorld'
              },
              start: 0,
              end: 31,
              range: [0, 31],
              type: 'BinaryExpression'
            },
            start: 0,
            end: 31,
            range: [0, 31],
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        start: 0,
        end: 31,
        range: [0, 31],
        type: 'Program'
      }
    ],
    [
      '("use strict"); foo = 42;',
      Context.Module | Context.OptionsRanges | Context.OptionsRaw,
      {
        body: [
          {
            expression: {
              raw: '"use strict"',
              start: 1,
              end: 13,
              range: [1, 13],
              type: 'Literal',
              value: 'use strict'
            },
            start: 0,
            end: 15,
            range: [0, 15],
            type: 'ExpressionStatement'
          },
          {
            expression: {
              left: {
                name: 'foo',
                start: 16,
                end: 19,
                range: [16, 19],
                type: 'Identifier'
              },
              operator: '=',
              right: {
                raw: '42',
                start: 22,
                end: 24,
                range: [22, 24],
                type: 'Literal',
                value: 42
              },
              start: 16,
              end: 24,
              range: [16, 24],
              type: 'AssignmentExpression'
            },
            start: 16,
            end: 25,
            range: [16, 25],
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        start: 0,
        end: 25,
        range: [0, 25],
        type: 'Program'
      }
    ],
    [
      '"use strict", "Hello\\312World"',
      Context.None | Context.OptionsRanges | Context.OptionsRaw,
      {
        body: [
          {
            expression: {
              expressions: [
                {
                  start: 0,
                  end: 12,
                  range: [0, 12],
                  type: 'Literal',
                  value: 'use strict',
                  raw: '"use strict"'
                },
                {
                  start: 14,
                  end: 30,
                  range: [14, 30],
                  type: 'Literal',
                  value: 'HelloÊWorld',
                  raw: '"Hello\\312World"'
                }
              ],
              start: 0,
              end: 30,
              range: [0, 30],
              type: 'SequenceExpression'
            },
            start: 0,
            end: 30,
            range: [0, 30],
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 30,
        range: [0, 30],
        type: 'Program'
      }
    ],
    [
      '"use asm" \n "use strict"',
      Context.None | Context.OptionsRanges | Context.OptionsRaw,
      {
        body: [
          {
            expression: {
              start: 0,
              end: 9,
              range: [0, 9],
              type: 'Literal',
              value: 'use asm',
              raw: '"use asm"'
            },
            directive: 'use asm',
            start: 0,
            end: 9,
            range: [0, 9],
            type: 'ExpressionStatement'
          },
          {
            expression: {
              start: 12,
              end: 24,
              range: [12, 24],
              type: 'Literal',
              value: 'use strict',
              raw: '"use strict"'
            },
            directive: 'use strict',
            start: 12,
            end: 24,
            range: [12, 24],
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 24,
        range: [0, 24],
        type: 'Program'
      }
    ],
    [
      '"use strict"; + 1',
      Context.None | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict',
              start: 0,
              end: 12,
              range: [0, 12]
            },
            directive: 'use strict',
            start: 0,
            end: 13,
            range: [0, 13]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '+',
              argument: {
                type: 'Literal',
                value: 1,
                start: 16,
                end: 17,
                range: [16, 17]
              },
              prefix: true,
              start: 14,
              end: 17,
              range: [14, 17]
            },
            start: 14,
            end: 17,
            range: [14, 17]
          }
        ],
        start: 0,
        end: 17,
        range: [0, 17]
      }
    ],
    [
      '("use strict"); foo = 42;',
      Context.None | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict',
              start: 1,
              end: 13,
              range: [1, 13]
            },
            start: 0,
            end: 15,
            range: [0, 15]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'foo',
                start: 16,
                end: 19,
                range: [16, 19]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 42,
                start: 22,
                end: 24,
                range: [22, 24]
              },
              start: 16,
              end: 24,
              range: [16, 24]
            },
            start: 16,
            end: 25,
            range: [16, 25]
          }
        ],
        start: 0,
        end: 25,
        range: [0, 25]
      }
    ],
    [
      '"\\u0061b"\n"c\\u0064"',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'ab'
            },
            directive: '\\u0061b'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'cd'
            },
            directive: 'c\\u0064'
          }
        ]
      }
    ],
    [
      '"\\u0061b"\n"c\\u0064"',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'ab'
            },
            directive: '\\u0061b'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'cd'
            },
            directive: 'c\\u0064'
          }
        ]
      }
    ]
  ]);
});
