import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Unary', () => {
  for (const arg of [
    'delete {}.x',
    'typeof x === "undefined"',
    'delete o["y"]',
    'delete Number(7)',
    'delete ((x) => x)',
    'delete ((x) => x).foo',
    'delete new Number(8)',
    'delete a[2]',
    'delete await;',
    'delete false;',
    'delete null;',
    'delete this;',
    'delete true;',
    'delete yield;',
    'delete o[Math.pow(2,30)]'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Unary (fail)', [
    ['(((x)))\n--;', Context.None],
    ['(x)\n--;', Context.None],
    ['if (a) a\n--;', Context.None],
    ['if (a\n--);', Context.None],
    ['let x = () => a\n--;', Context.Strict],
    ['a\n--', Context.None],
    ['function f(){ return a\n--; }', Context.None],
    ['x.foo++.bar', Context.None],
    ['(((x)))\n++;', Context.None],
    ['(x)\n++;', Context.None],
    ['if (a) a\n++;', Context.None],
    ['function *f() { delete yield; }', Context.None],
    ['class X extends Y { constructor() { delete super; } }', Context.None],
    ['function f(){ return a\n++; }', Context.None],
    ['if (a\n++b);', Context.None],
    ['if (a\n++\nb);', Context.None],
    ['delete (x=await)', Context.Strict | Context.Module],
    ['delete (await=x)', Context.Strict | Context.Module],
    ['delete x = await', Context.Strict | Context.Module],
    ['delete ("x"[(await)])', Context.Strict | Context.Module],
    ['delete ("x"[(yield)])', Context.Strict],
    ['delete (((((foo(yield)))))).bar', Context.Strict],
    ['delete (((((foo(await)))))).bar', Context.Strict | Context.Module],
    ['delete yield.foo', Context.Strict],
    ['delete async \n (...) => x', Context.Strict],
    ['delete await.foo', Context.Strict | Context.Module],
    ['delete async; () => x;', Context.Strict],
    ['(delete (((x))) \n x)', Context.Strict],
    ['delete (async \n () => x)', Context.Strict],
    ['delete async (x) => y', Context.Strict],
    ['delete ((a)) => b)', Context.Strict],
    ['delete (((x)) => x)', Context.Strict],
    ['delete ()=>bar', Context.Strict],
    ['typeof async({a = 1}, {b = 2}, {c = 3} = {});', Context.None],
    ['typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});', Context.None],
    ['typeof async({a = 1});', Context.None],
    ['delete x', Context.Strict],
    ['delete foo[await x]', Context.Strict],
    ['delete foo[yield x]', Context.Strict],
    ['delete foo=>bar', Context.Strict],
    ['delete (foo)=>bar', Context.Strict],
    ['delete x\nfoo', Context.Strict],
    ['delete (x)\n/f/', Context.Strict],
    ['delete x\n/f/', Context.Strict],
    ['delete x\nfoo', Context.Strict],
    ['delete x', Context.Strict],
    ['delete ((true)++)', Context.Strict],
    ['(async () \n ++)', Context.Strict],
    ['delete ((foo) \n ++)', Context.Strict],
    ['(foo \n ++)', Context.Strict],
    ['delete ((((true)))=x)', Context.Strict],
    ['delete ((true)=x)', Context.Strict],
    ['delete ()=b', Context.Strict],
    ['delete ((()=b))', Context.Strict],
    ['delete ([foo].bar)=>b)', Context.Strict],
    ['delete ((a))=>b)', Context.Strict],
    ['delete (a + b)=>b)', Context.Strict],
    ['delete foo => x;', Context.Strict],
    ['delete (foo) => x;', Context.Strict],
    ['delete (((foo)));', Context.Strict],
    ['delete foo', Context.Strict],
    ['typeof async({a = 1});', Context.Strict],
    ['typeof async({a = 1}, {b = 2}, {c = 3} = {});', Context.Strict],
    ['typeof async({a = 1}, {b = 2} = {}, {c = 3} = {});', Context.Strict],
    ['delete foo', Context.Strict]
  ]);

  pass('Expressions - Unary (pass)', [
    [
      'typeof async',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'Identifier',
                name: 'async'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof await',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'Identifier',
                name: 'await'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete true',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'Literal',
                value: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo.bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof async({a});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof x + y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'delete x.y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: []
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete typeof true',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: {
                  type: 'Literal',
                  value: true
                },
                prefix: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (foo.bar);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    /* [
      'delete foo.bar, z;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'UnaryExpression',
                  operator: 'delete',
                  argument: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  },
                  prefix: true
                },
                {
                  type: 'Identifier',
                  name: 'z'
                }
              ]
            }
          }
        ]
      }
    ],*/
    [
      'delete /foo/.bar;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: /foo/,
                  regex: {
                    pattern: 'foo',
                    flags: ''
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((foo).x)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'MemberExpression',
                start: 8,
                end: 15,
                range: [8, 15],
                object: {
                  type: 'Identifier',
                  start: 9,
                  end: 12,
                  range: [9, 12],
                  name: 'foo'
                },
                property: {
                  type: 'Identifier',
                  start: 14,
                  end: 15,
                  range: [14, 15],
                  name: 'x'
                },
                computed: false
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'delete ((((foo))).x)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 20,
              range: [0, 20],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'MemberExpression',
                start: 8,
                end: 19,
                range: [8, 19],
                object: {
                  type: 'Identifier',
                  start: 11,
                  end: 14,
                  range: [11, 14],
                  name: 'foo'
                },
                property: {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  name: 'x'
                },
                computed: false
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    /*[
      '(delete (((x))) \n x)',
      Context.None,
      {}], */
    [
      'delete (a, b).c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'c'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((a)=>b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'ArrowFunctionExpression',
                start: 8,
                end: 14,
                range: [8, 14],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'b'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'ArrowFunctionExpression',
                start: 8,
                end: 22,
                range: [8, 22],
                expression: true,
                async: false,
                params: [
                  {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'b'
                  },
                  {
                    type: 'ArrayPattern',
                    start: 15,
                    end: 18,
                    range: [15, 18],
                    elements: [
                      {
                        type: 'Identifier',
                        start: 16,
                        end: 17,
                        range: [16, 17],
                        name: 'c'
                      }
                    ]
                  }
                ],
                body: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'b'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'delete (((a)=>b).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    }
                  ],

                  async: false,
                  expression: true
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((()=>b))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [],

                async: false,
                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((foo).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((((foo))).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (a, b).c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'c'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((a)=>b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ]
                  }
                ],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((()=>b))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: true
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: '__proto__'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete "x".y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete [].x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo", "bar")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Literal',
                    value: 'foo'
                  },
                  {
                    type: 'Literal',
                    value: 'bar'
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 'foo'
                },
                right: {
                  type: 'Literal',
                  value: 'bar'
                },
                operator: '+'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 20
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((foo)++)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'foo'
                },
                operator: '++',
                prefix: false
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo.bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo[bar]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ( \n () => x)',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                async: false,
                body: {
                  name: 'x',
                  type: 'Identifier'
                },
                expression: true,

                params: [],
                type: 'ArrowFunctionExpression'
              },
              operator: 'delete',
              prefix: true,
              type: 'UnaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'delete ((foo).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((((foo))).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (a, b).c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'SequenceExpression',
                  expressions: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'c'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((a)=>b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((a, b, [c])=>b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ]
                  }
                ],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((()=>b))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'b'
                },
                params: [],

                async: false,

                expression: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: true
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: '__proto__'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete "x".y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete [].x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ArrayExpression',
                  elements: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo", "bar")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Literal',
                    value: 'foo'
                  },
                  {
                    type: 'Literal',
                    value: 'bar'
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 'foo'
                },
                right: {
                  type: 'Literal',
                  value: 'bar'
                },
                operator: '+'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 20
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((foo)++)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'foo'
                },
                operator: '++',
                prefix: false
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo.bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo[bar]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ( \n () => x)',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                async: false,
                body: {
                  name: 'x',
                  type: 'Identifier'
                },
                expression: true,

                params: [],
                type: 'ArrowFunctionExpression'
              },
              operator: 'delete',
              prefix: true,
              type: 'UnaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'delete x.y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete x.y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete (((a)=b).x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete true.__proto__.foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: true
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: '__proto__'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete "x".y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete [].x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'MemberExpression',
                start: 7,
                end: 11,
                range: [7, 11],
                object: {
                  type: 'ArrayExpression',
                  start: 7,
                  end: 9,
                  range: [7, 9],
                  elements: []
                },
                property: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  name: 'x'
                },
                computed: false
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'delete ("foo" + "bar")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 'foo'
                },
                right: {
                  type: 'Literal',
                  value: 'bar'
                },
                operator: '+'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ("foo".bar = 20)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: 20
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete ((foo)++)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'UnaryExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: 'delete',
              prefix: true,
              argument: {
                type: 'UpdateExpression',
                start: 8,
                end: 15,
                range: [8, 15],
                operator: '++',
                prefix: false,
                argument: {
                  type: 'Identifier',
                  start: 9,
                  end: 12,
                  range: [9, 12],
                  name: 'foo'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'delete foo.bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete foo[bar]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'foo'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'async x => delete (((((foo(await x)))))).bar',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        range: [0, 44],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            expression: {
              type: 'ArrowFunctionExpression',
              start: 0,
              end: 44,
              range: [0, 44],
              expression: true,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'x'
                }
              ],
              body: {
                type: 'UnaryExpression',
                start: 11,
                end: 44,
                range: [11, 44],
                operator: 'delete',
                prefix: true,
                argument: {
                  type: 'MemberExpression',
                  start: 18,
                  end: 44,
                  range: [18, 44],
                  object: {
                    type: 'CallExpression',
                    start: 23,
                    end: 35,
                    range: [23, 35],
                    callee: {
                      type: 'Identifier',
                      start: 23,
                      end: 26,
                      range: [23, 26],
                      name: 'foo'
                    },
                    arguments: [
                      {
                        type: 'AwaitExpression',
                        start: 27,
                        end: 34,
                        range: [27, 34],
                        argument: {
                          type: 'Identifier',
                          start: 33,
                          end: 34,
                          range: [33, 34],
                          name: 'x'
                        }
                      }
                    ]
                  },
                  property: {
                    type: 'Identifier',
                    start: 41,
                    end: 44,
                    range: [41, 44],
                    name: 'bar'
                  },
                  computed: false
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){ delete (((((foo(yield)))))).bar }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 48,
        range: [0, 48],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 48,
            range: [0, 48],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 48,
              range: [13, 48],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 15,
                  end: 46,
                  range: [15, 46],
                  expression: {
                    type: 'UnaryExpression',
                    start: 15,
                    end: 46,
                    range: [15, 46],
                    operator: 'delete',
                    prefix: true,
                    argument: {
                      type: 'MemberExpression',
                      start: 22,
                      end: 46,
                      range: [22, 46],
                      object: {
                        type: 'CallExpression',
                        start: 27,
                        end: 37,
                        range: [27, 37],
                        callee: {
                          type: 'Identifier',
                          start: 27,
                          end: 30,
                          range: [27, 30],
                          name: 'foo'
                        },
                        arguments: [
                          {
                            type: 'YieldExpression',
                            start: 31,
                            end: 36,
                            range: [31, 36],
                            delegate: false,
                            argument: null
                          }
                        ]
                      },
                      property: {
                        type: 'Identifier',
                        start: 43,
                        end: 46,
                        range: [43, 46],
                        name: 'bar'
                      },
                      computed: false
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){ delete (((((foo(yield y)))))).bar }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        arguments: [
                          {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            delegate: false
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    },
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async x => delete ("x"[(await x)])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'UnaryExpression',
                operator: 'delete',
                argument: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'x'
                  },
                  computed: true,
                  property: {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                },
                prefix: true
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],

              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'function *f(){ delete ("x"[(yield)]) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UnaryExpression',
                    operator: 'delete',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'YieldExpression',
                        argument: null,
                        delegate: false
                      }
                    },
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'typeof exports === "object"',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: {
                  type: 'Identifier',
                  name: 'exports'
                },
                prefix: true
              },
              right: {
                type: 'Literal',
                value: 'object'
              },
              operator: '==='
            }
          }
        ]
      }
    ],

    [
      '++this.x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(++this.x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '--this.x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              operator: '--',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '(this.x++)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      'function f(){ return ++a; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    operator: '++',
                    prefix: true
                  }
                }
              ]
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'let x = () => ++a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    operator: '++',
                    prefix: true
                  },
                  params: [],

                  async: false,
                  expression: true
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'if (++a);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '++',
              prefix: true
            },
            consequent: {
              type: 'EmptyStatement'
            },
            alternate: null
          }
        ]
      }
    ],
    [
      '++(x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '++(((x)));',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'if (a) --a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                },
                operator: '--',
                prefix: true
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      '(x)++;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      'a\n++b',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'b',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'let x = () => ++\na;',
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'x',
                  type: 'Identifier'
                },
                init: {
                  async: false,
                  body: {
                    argument: {
                      name: 'a',
                      type: 'Identifier'
                    },
                    operator: '++',
                    prefix: true,
                    type: 'UpdateExpression'
                  },
                  expression: true,

                  params: [],
                  type: 'ArrowFunctionExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'let',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '++\na',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a = typeof async (x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ]
                },
                prefix: true
              }
            }
          }
        ]
      }
    ],
    [
      'foo = !a',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 8,
              range: [0, 8],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              right: {
                type: 'UnaryExpression',
                start: 6,
                end: 8,
                range: [6, 8],
                operator: '!',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'a'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(typeof async (x))',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'a(void b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'a'
              },
              arguments: [
                {
                  type: 'UnaryExpression',
                  operator: 'void',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  prefix: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(delete a.b)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'foo = ~b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 8,
              range: [0, 8],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              right: {
                type: 'UnaryExpression',
                start: 6,
                end: 8,
                range: [6, 8],
                operator: '~',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'b'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '+null',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '+',
              argument: {
                type: 'Literal',
                value: null
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '-function(val){  return val }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '-',
              argument: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'val'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ReturnStatement',
                      argument: {
                        type: 'Identifier',
                        name: 'val'
                      }
                    }
                  ]
                },
                async: false,
                generator: false,

                id: null
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'foo = !42',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'foo'
              },
              operator: '=',
              right: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                  type: 'Literal',
                  value: 42
                },
                prefix: true
              }
            }
          }
        ]
      }
    ],
    [
      'a ? b : !c',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              test: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                start: 4,
                end: 5,
                range: [4, 5],
                name: 'b'
              },
              alternate: {
                type: 'UnaryExpression',
                start: 8,
                end: 10,
                range: [8, 10],
                operator: '!',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  name: 'c'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '![]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '!',
              argument: {
                type: 'ArrayExpression',
                elements: []
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'foo = (![])',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'foo'
              },
              operator: '=',
              right: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                  type: 'ArrayExpression',
                  elements: []
                },
                prefix: true
              }
            }
          }
        ]
      }
    ],
    [
      'a = ++a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                },
                operator: '++',
                prefix: true
              }
            }
          }
        ]
      }
    ],
    [
      'a = +a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                },
                prefix: true
              }
            }
          }
        ]
      }
    ],
    [
      'y = x--',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '=',
              right: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '--',
                prefix: false
              }
            }
          }
        ]
      }
    ],
    [
      '~false',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '~',
              argument: {
                type: 'Literal',
                value: false
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof [1,2,3] ',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 1
                  },
                  {
                    type: 'Literal',
                    value: 2
                  },
                  {
                    type: 'Literal',
                    value: 3
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof {hi: "world"}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'hi'
                    },
                    value: {
                      type: 'Literal',
                      value: 'world'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'delete lunch.beans;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'lunch'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'beans'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'console.log(Math.PI);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'console'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'log'
                }
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'Math'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'PI'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'typeof void 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'Literal',
                  value: 0
                },
                prefix: true
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'x == 5 || y == 5',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Literal',
                  value: 5
                },
                operator: '=='
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'y'
                },
                right: {
                  type: 'Literal',
                  value: 5
                },
                operator: '=='
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'void x !== undefined',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'Identifier',
                  name: 'x'
                },
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'undefined'
              },
              operator: '!=='
            }
          }
        ]
      }
    ],
    [
      'void (x = 1) !== undefined',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                },
                prefix: true
              },
              right: {
                type: 'Identifier',
                name: 'undefined'
              },
              operator: '!=='
            }
          }
        ]
      }
    ],
    [
      'isNaN(+(void 0)) !== true',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'isNaN'
                },
                arguments: [
                  {
                    type: 'UnaryExpression',
                    operator: '+',
                    argument: {
                      type: 'UnaryExpression',
                      operator: 'void',
                      argument: {
                        type: 'Literal',
                        value: 0
                      },
                      prefix: true
                    },
                    prefix: true
                  }
                ]
              },
              right: {
                type: 'Literal',
                value: true
              },
              operator: '!=='
            }
          }
        ]
      }
    ],
    [
      'typeof async (x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'let',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'let'
            }
          }
        ]
      }
    ],
    [
      '!love',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '!',
              argument: {
                type: 'Identifier',
                name: 'love'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '-a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '-',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'void love',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'void',
              argument: {
                type: 'Identifier',
                name: 'love'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof love',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'typeof',
              argument: {
                type: 'Identifier',
                name: 'love'
              },
              prefix: true
            }
          }
        ]
      }
    ]
  ]);
});
