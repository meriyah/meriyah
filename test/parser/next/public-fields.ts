import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Public fields', () => {
  fail('Public fields (fail)', [
    ['class A { "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { x = typeof super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext]
  ]);

  for (const arg of [
    'static a : 0',
    'static a =',
    'static constructor',
    'static prototype',
    'static *a = 0',
    'static *a',
    'static a = arguments[0]',
    'static c = [1] = [c]',
    'static a = 0\n *b(){}',
    "static a = 0\n ['b'](){}",
    'a : 0',
    'a =',
    'constructor',
    '*a = 0',
    '*a',
    'c = [1] = [c]',
    'a = 0\n *b(){}',
    "a = 0\n ['b'](){}",
    'static prototype',
    'static constructor'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    'a = 0;',
    'a = 0; b;',
    'a = 0; b(){}',
    'a = 0; *b(){}',
    "a = 0; ['b'](){}",
    'a;',
    'a; b;',
    'a; b(){}',
    'a; *b(){}',
    "a; ['b'](){}",
    "['a'] = 0;",
    "['a'] = 0; b;",
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
    'c = [c] = c;',
    'a = 0;\n',
    'a = 0;\n b;',
    'a = 0\n b(){}',
    'a;\n;',
    'a;\n b;\n',
    'a;\n b(){}',
    'a;\n *b(){}',
    "a;\n ['b'](){}",
    "['a'] = 0;\n",
    "['a'] = 0;\n b;",
    "['a'] = 0;\n b(){}",
    "['a'];\n",
    "['a'];\n b;\n",
    "['a'];\n b(){}",
    "['a'];\n *b(){}",
    "['a'];\n ['b'](){}",
    'a;\n get;',
    'get;\n *a(){}',
    'a = function t() { arguments; }',
    'a = () => function() { arguments; }',
    'async;',
    'async = await;',
    'yield;',
    'yield = 0;',
    'yield;\n a;',
    'async;',
    'async = 0;',
    'async;\n a(){}',
    'async;\n a;',
    'await;',
    'await = 0;',
    'await;\n a;',
    `\nx;\ny;\n\n`
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  pass('Next - Public fields (pass)', [
    [
      `class Foo { x = 1; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            decorators: [],
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo',
              start: 6,
              end: 9
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'x',
                    start: 12,
                    end: 13
                  },
                  value: {
                    type: 'Literal',
                    value: 1,
                    start: 16,
                    end: 17
                  },
                  decorators: [],
                  computed: false,
                  static: false,
                  start: 12,
                  end: 17
                }
              ],
              start: 10,
              end: 20
            },
            start: 0,
            end: 20
          }
        ],
        start: 0,
        end: 20
      }
    ],
    [
      `class A { set; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'set',
                    start: 10,
                    end: 13
                  },
                  decorators: [],
                  value: null,
                  computed: false,
                  static: false,
                  start: 10,
                  end: 13
                }
              ],
              start: 8,
              end: 16
            },
            start: 0,
            end: 16
          }
        ],
        start: 0,
        end: 16
      }
    ],
    [
      `class A { set = get; }`,
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
                    name: 'set',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    name: 'get',
                    type: 'Identifier'
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
    [
      `class A { ;;;;;;[x] = 42; [10] = "meep"; ["not initialized"];;;;;;; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'x',
                    start: 17,
                    end: 18
                  },
                  value: {
                    type: 'Literal',
                    value: 42,
                    start: 22,
                    end: 24
                  },
                  computed: true,
                  static: false,
                  start: 16,
                  end: 24
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 10,
                    start: 27,
                    end: 29
                  },
                  value: {
                    type: 'Literal',
                    value: 'meep',
                    start: 33,
                    end: 39
                  },
                  computed: true,
                  static: false,
                  start: 26,
                  end: 39
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'not initialized',
                    start: 42,
                    end: 59
                  },
                  value: null,
                  computed: true,
                  static: false,
                  start: 41,
                  end: 60
                }
              ],
              start: 8,
              end: 69
            },
            start: 0,
            end: 69
          }
        ],
        start: 0,
        end: 69
      }
    ],
    [
      `class A { ['a'] = 0; b; }`,
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
    [
      'class Some { render=( )=>{ return null; }}',
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
                    name: 'render',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: null
                          },
                          type: 'ReturnStatement'
                        }
                      ],
                      type: 'BlockStatement'
                    },
                    expression: false,
                    params: [],
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Some',
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
    [
      'class Some { render=(a,b)=>{ return null; } }',
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
                    name: 'render',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: null
                          },
                          type: 'ReturnStatement'
                        }
                      ],
                      type: 'BlockStatement'
                    },
                    expression: false,
                    params: [
                      {
                        name: 'a',
                        type: 'Identifier'
                      },
                      {
                        name: 'b',
                        type: 'Identifier'
                      }
                    ],
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Some',
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
    [
      `class A {  ;;;; ;;;;;;'a'; "b"; 'c' = 39;  "d" = 42;;;;;;;  ;;;; }`,
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
                    type: 'Literal',
                    value: 'a'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'b'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'c'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 39
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'd'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 42
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
    [
      `class A { foo; }`,
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
