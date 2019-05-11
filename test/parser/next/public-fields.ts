import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Public fields', () => {
  for (const arg of [
    'static a : 0',
    'static a =',
    // "static constructor",
    // "static prototype",
    // "static *a = 0",
    //   "static *a",
    // "static get a",
    // "static get\n a",
    // "static yield a",
    // "static async a = 0",
    // "static async a",
    // "static a = arguments",
    // "static a = () => arguments",
    // "static a = () => { arguments }",
    'static a = arguments[0]',
    // "static a = delete arguments[0]",
    // "static a = f(arguments)",
    // "static a = () => () => arguments",
    //  "static a b",
    //  "static a = 0 b",
    'static c = [1] = [c]',

    // ASI requires that the next token is not part of any legal production
    'static a = 0\n *b(){}',
    "static a = 0\n ['b'](){}",
    'a : 0',
    'a =',
    // "constructor",
    '*a = 0',
    '*a',
    // "get a",
    // "yield a",
    // "async a = 0",
    // "async a",
    'c = [1] = [c]',
    'a = 0\n *b(){}',
    "a = 0\n ['b'](){}"
    //"get\n a",
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    'a = 0;',
    'a = 0; b',
    'a = 0; b(){}',
    'a = 0; *b(){}',
    "a = 0; ['b'](){}",
    'a;',
    'a; b;',
    'a; b(){}',
    'a; *b(){}',
    "a; ['b'](){}",
    "['a'] = 0;",
    "['a'] = 0; b",
    "['a'] = 0; b(){}",
    "['a'] = 0; *b(){}",
    "['a'] = 0; ['b'](){}",
    "['a'];",
    "['a']; b;",
    "['a']; b(){}",
    "['a']; *b(){}",
    "['a']; ['b'](){}",

    '0 = 0;',
    '0;',
    "'a' = 0;",
    "'a';",

    'c = [c] = c',

    // ASI
    'a = 0\n',
    'a = 0\n b',
    'a = 0\n b(){}',
    'a\n',
    'a\n b\n',
    'a\n b(){}',
    'a\n *b(){}',
    "a\n ['b'](){}",
    "['a'] = 0\n",
    "['a'] = 0\n b",
    "['a'] = 0\n b(){}",
    "['a']\n",
    "['a']\n b\n",
    "['a']\n b(){}",
    "['a']\n *b(){}",
    "['a']\n ['b'](){}",

    // ASI edge cases
    'a\n get',
    'get\n *a(){}',
    'a\n static',

    'a = function t() { arguments; }',
    'a = () => function() { arguments; }',

    // Misc edge cases
    'async',
    'async;',
    'async = await',
    'yield',
    'yield = 0',
    'yield\n a',
    'async;',
    'async = 0;',
    'async',
    'async = 0',
    'async\n a(){}', // a field named async, and a method named a.
    'async\n a',
    'await;',
    'await = 0;',
    'await\n a',
    `\nx\ny\n\n`
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }
  pass('Next - Public fields (pass)', [
    [
      `class A { a = 0; }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'a',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 0
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    //[`['a'] = 0; b`, Context.OptionsNext, {}],
    [
      `class A { ['a'] = 0; b }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: true,
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'a'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 0
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'b',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    // [`class A { foo }`, Context.OptionsNext, {}],
    // [`class A { foo }`, Context.OptionsNext, {}],
    // [`class A { foo }`, Context.OptionsNext, {}],
    // [`class A { foo }`, Context.OptionsNext, {}],
    //[`class A { foo }`, Context.OptionsNext, {}],
    // [`class A { foo }`, Context.OptionsNext, {}],

    [
      `class A { foo }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
