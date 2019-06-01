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
    ['var C = class { x = () => arguments); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['var C = class { x = () => eval); }', Context.OptionsWebCompat | Context.OptionsNext],
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
      `var C = class { static async #prototype() {} };`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        body: [
          {
            declarations: [
              {
                end: 46,
                id: {
                  end: 5,
                  name: 'C',
                  start: 4,
                  type: 'Identifier'
                },
                init: {
                  body: {
                    body: [
                      {
                        computed: false,
                        decorators: [],
                        end: 44,
                        key: {
                          end: 39,
                          name: 'prototype',
                          start: 23,
                          type: 'PrivateName'
                        },
                        kind: 'method',
                        start: 16,
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: true,
                          body: {
                            body: [],
                            end: 44,
                            start: 42,
                            type: 'BlockStatement'
                          },
                          end: 44,
                          generator: false,
                          id: null,
                          params: [],
                          start: 39,
                          type: 'FunctionExpression'
                        }
                      }
                    ],
                    end: 46,
                    start: 14,
                    type: 'ClassBody'
                  },
                  decorators: [],
                  end: 46,
                  id: null,
                  start: 8,
                  superClass: null,
                  type: 'ClassExpression'
                },
                start: 4,
                type: 'VariableDeclarator'
              }
            ],
            end: 47,
            kind: 'var',
            start: 0,
            type: 'VariableDeclaration'
          }
        ],
        end: 47,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
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
      `{ class X { static p = function() { return arguments[0]; } } }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                decorators: [],
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 8,
                  end: 9
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
                        name: 'p',
                        start: 19,
                        end: 20
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Identifier',
                                  name: 'arguments',
                                  start: 43,
                                  end: 52
                                },
                                computed: true,
                                property: {
                                  type: 'Literal',
                                  value: 0,
                                  start: 53,
                                  end: 54
                                },
                                start: 43,
                                end: 55
                              },
                              start: 36,
                              end: 56
                            }
                          ],
                          start: 34,
                          end: 58
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 23,
                        end: 58
                      },
                      computed: false,
                      static: true,
                      start: 19,
                      end: 58
                    }
                  ],
                  start: 10,
                  end: 60
                },
                start: 2,
                end: 60
              }
            ],
            start: 0,
            end: 62
          }
        ],
        start: 0,
        end: 62
      }
    ],
    [
      `class A { ['a'] = 0; b; }`,
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
                    type: 'Literal',
                    value: 'a',
                    start: 11,
                    end: 14
                  },
                  value: {
                    type: 'Literal',
                    value: 0,
                    start: 18,
                    end: 19
                  },
                  computed: true,
                  static: false,
                  start: 10,
                  end: 19
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'b',
                    start: 21,
                    end: 22
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 21,
                  end: 22
                }
              ],
              start: 8,
              end: 25
            },
            start: 0,
            end: 25
          }
        ],
        start: 0,
        end: 25
      }
    ],
    [
      'class Some { render=( )=>{ return null; }}',
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
              name: 'Some',
              start: 6,
              end: 10
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
                    name: 'render',
                    start: 13,
                    end: 19
                  },
                  value: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Literal',
                            value: null,
                            start: 34,
                            end: 38
                          },
                          start: 27,
                          end: 39
                        }
                      ],
                      start: 25,
                      end: 41
                    },
                    params: [],
                    async: false,
                    expression: false,
                    start: 20,
                    end: 41
                  },
                  computed: false,
                  static: false,
                  start: 13,
                  end: 41
                }
              ],
              start: 11,
              end: 42
            },
            start: 0,
            end: 42
          }
        ],
        start: 0,
        end: 42
      }
    ],
    [
      `{
        class X {
          static p = function() { return arguments[0]; }
        }
      }

      {
        class X {
          static t = () => {
            function p() { return arguments[0]; };
            return p;
          }
        }

        let p = X.t();
      }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 16,
                  end: 17
                },
                superClass: null,
                decorators: [],
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'FieldDefinition',
                      key: {
                        type: 'Identifier',
                        name: 'p',
                        start: 37,
                        end: 38
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Identifier',
                                  name: 'arguments',
                                  start: 61,
                                  end: 70
                                },
                                computed: true,
                                property: {
                                  type: 'Literal',
                                  value: 0,
                                  start: 71,
                                  end: 72
                                },
                                start: 61,
                                end: 73
                              },
                              start: 54,
                              end: 74
                            }
                          ],
                          start: 52,
                          end: 76
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 41,
                        end: 76
                      },
                      static: true,
                      computed: false,
                      decorators: [],
                      start: 37,
                      end: 76
                    }
                  ],
                  start: 18,
                  end: 86
                },
                start: 10,
                end: 86
              }
            ],
            start: 0,
            end: 94
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 118,
                  end: 119
                },
                superClass: null,
                decorators: [],
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'FieldDefinition',
                      key: {
                        type: 'Identifier',
                        name: 't',
                        start: 139,
                        end: 140
                      },
                      value: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'FunctionDeclaration',
                              params: [],
                              body: {
                                type: 'BlockStatement',
                                body: [
                                  {
                                    type: 'ReturnStatement',
                                    argument: {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Identifier',
                                        name: 'arguments',
                                        start: 185,
                                        end: 194
                                      },
                                      computed: true,
                                      property: {
                                        type: 'Literal',
                                        value: 0,
                                        start: 195,
                                        end: 196
                                      },
                                      start: 185,
                                      end: 197
                                    },
                                    start: 178,
                                    end: 198
                                  }
                                ],
                                start: 176,
                                end: 200
                              },
                              async: false,
                              generator: false,
                              id: {
                                type: 'Identifier',
                                name: 'p',
                                start: 172,
                                end: 173
                              },
                              start: 163,
                              end: 200
                            },
                            {
                              type: 'EmptyStatement',
                              start: 200,
                              end: 201
                            },
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'Identifier',
                                name: 'p',
                                start: 221,
                                end: 222
                              },
                              start: 214,
                              end: 223
                            }
                          ],
                          start: 149,
                          end: 235
                        },
                        params: [],
                        async: false,
                        expression: false,
                        start: 143,
                        end: 235
                      },
                      static: true,
                      computed: false,
                      decorators: [],
                      start: 139,
                      end: 235
                    }
                  ],
                  start: 120,
                  end: 245
                },
                start: 112,
                end: 245
              },
              {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    init: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'X',
                          start: 263,
                          end: 264
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 't',
                          start: 265,
                          end: 266
                        },
                        start: 263,
                        end: 266
                      },
                      arguments: [],
                      start: 263,
                      end: 268
                    },
                    id: {
                      type: 'Identifier',
                      name: 'p',
                      start: 259,
                      end: 260
                    },
                    start: 259,
                    end: 268
                  }
                ],
                start: 255,
                end: 269
              }
            ],
            start: 102,
            end: 277
          }
        ],
        start: 0,
        end: 277
      }
    ],
    [
      'class X { static p = eval("(function() { return arguments[0]; })(1)"); }',
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
                    name: 'p',
                    type: 'Identifier'
                  },
                  static: true,
                  type: 'FieldDefinition',
                  value: {
                    arguments: [
                      {
                        type: 'Literal',
                        value: '(function() { return arguments[0]; })(1)'
                      }
                    ],
                    callee: {
                      name: 'eval',
                      type: 'Identifier'
                    },
                    type: 'CallExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'X',
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
                    type: 'Literal',
                    value: 'a',
                    start: 22,
                    end: 25
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 22,
                  end: 25
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'b',
                    start: 27,
                    end: 30
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 27,
                  end: 30
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'c',
                    start: 32,
                    end: 35
                  },
                  value: {
                    type: 'Literal',
                    value: 39,
                    start: 38,
                    end: 40
                  },
                  computed: false,
                  static: false,
                  start: 32,
                  end: 40
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'd',
                    start: 43,
                    end: 46
                  },
                  value: {
                    type: 'Literal',
                    value: 42,
                    start: 49,
                    end: 51
                  },
                  computed: false,
                  static: false,
                  start: 43,
                  end: 51
                }
              ],
              start: 8,
              end: 66
            },
            start: 0,
            end: 66
          }
        ],
        start: 0,
        end: 66
      }
    ],
    [
      `class A { foo; }`,
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
                    name: 'foo',
                    start: 10,
                    end: 13
                  },
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
    ]
  ]);
});
