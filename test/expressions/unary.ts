import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';

describe('Expressions - Unary', () => {
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
                id: null,
                async: false,
                generator: false,
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
                id: null,
                async: false,
                generator: false,
                expression: true
              },
              prefix: true
            }
          }
        ]
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
                  id: null,
                  async: false,
                  generator: false,
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
                id: null,
                async: false,
                generator: false,
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
      'async x => delete (((((foo(await x)))))).bar',
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    arguments: [
                      {
                        type: 'AwaitExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'x'
                        }
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
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: true,
              generator: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'function *f(){ delete (((((foo(yield)))))).bar }',
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
                            argument: null,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
            expression: false,
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
              id: null,
              async: true,
              generator: false,
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
            expression: false,
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
            expression: false,
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
                  id: null,
                  async: false,
                  generator: false,
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
                  generator: false,
                  id: null,
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
                operator: '~',
                argument: {
                  type: 'Identifier',
                  name: 'b'
                },
                prefix: true
              }
            }
          }
        ]
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
      '+true  ',
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
                value: true
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
                expression: false,
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
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                  type: 'Identifier',
                  name: 'c'
                },
                prefix: true
              }
            }
          }
        ]
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
    /* ['void x !== undefined', Context.None, {
      "type": "Program",
      "sourceType": "script",
      "body": [
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "BinaryExpression",
            "left": {
              "type": "UnaryExpression",
              "operator": "void",
              "argument": {
                "type": "Identifier",
                "name": "x"
              },
              "prefix": true
            },
            "right": {
              "type": "Identifier",
              "name": "undefined"
            },
            "operator": "!=="
          }
        }
      ]
    }],
     ['void (x = 1) !== undefined', Context.None, {
      "type": "Program",
      "sourceType": "script",
      "body": [
        {
          "type": "ExpressionStatement",
          "expression": {
            "type": "BinaryExpression",
            "left": {
              "type": "UnaryExpression",
              "operator": "void",
              "argument": {
                "type": "AssignmentExpression",
                "left": {
                  "type": "Identifier",
                  "name": "x"
                },
                "operator": "=",
                "right": {
                  "type": "Literal",
                  "value": 1
                }
              },
              "prefix": true
            },
            "right": {
              "type": "Identifier",
              "name": "undefined"
            },
            "operator": "!=="
          }
        }
      ]
    }],*/
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
