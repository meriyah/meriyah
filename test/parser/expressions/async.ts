import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Async', () => {
  // Async as identifier
  for (const arg of [
    'async: function f() {}',
    `async
  function f() {}`,
    'x = { async: false }',
    `a = async
  function f(){}`,
    'async => 42;',
    'const answer = async => 42;',
    'async function await() {}',
    'class X { async await(){} }',
    'f(x, async(y, z))',
    'class X { static async await(){} }',
    'x = async(y);',
    'class X { async() {} }',
    'let async = await;',
    'x = { async: false }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Expressions - Async (pass)', [
    ['await => { let x; }', Context.InAwaitContext],
    ['async while (1) {}', Context.None],
    ['(async function(...x = []) {})', Context.None],
    ['"use strict"; (async function arguments () {  })', Context.None],
    ['"use strict"; (async function eval () { })', Context.None],
    ['var O = { async method() {var [ await ] = 1;}', Context.None],
    ['let async => async', Context.None],
    ['f(async\nfoo=>c)', Context.None],
    ['f(async\nfunction(){})', Context.None],
    ['async function f(){ return await => {}; }', Context.None],
    ['foo(async[])', Context.None],
    ['class x {async \n foo() {}}', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['let f = async\nfunction g(){await x}', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async(yield);', Context.Strict],
    ['async(await);', Context.Strict | Context.Module],
    ['async (a, ...b+b=c) => a;', Context.None],
    ['async (a, ...b=true) => a;', Context.None],
    ['async (a, ...true=b) => a;', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async (a, ...true) => a;', Context.None],
    ['async (a, ...true=fail) => a;', Context.None]
  ]);
  pass('Expressions - Async (pass)', [
    [
      'function *f(){ async(x); }',
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
      'async g => (x = [await y])',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '=',
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'AwaitExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'g'
                }
              ],
              id: null,
              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'async r => result = [...{ x = await x }] = y;',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'result'
                },
                operator: '=',
                right: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              value: {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                right: {
                                  type: 'AwaitExpression',
                                  argument: {
                                    type: 'Identifier',
                                    name: 'x'
                                  }
                                }
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: true
                            }
                          ]
                        }
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'r'
                }
              ],
              id: null,
              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({async foo () \n {}})',
      Context.None,
      {
        body: [
          {
            expression: {
              properties: [
                {
                  computed: false,
                  key: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ObjectExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'class x {async foo() {}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '\\u0061sync\np => {}',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'async',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              async: false,
              body: {
                body: [],
                type: 'BlockStatement'
              },
              expression: false,
              id: null,
              params: [
                {
                  name: 'p',
                  type: 'Identifier'
                }
              ],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'class x {\nasync foo() {}}',
      Context.None,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            id: {
              name: 'x',
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
      'class x {async foo \n () {}}',
      Context.None,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            id: {
              name: 'x',
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
      'foo, async()',
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
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async())',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async(), x)',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: []
                },
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async(x,y,z))',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async(x,y,z), a, b)',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      name: 'z'
                    }
                  ]
                },
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async[x])',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  computed: true,
                  property: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async)',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'async'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(async.foo)',
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
                name: 'foo'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async ()=>c)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  params: [],
                  id: null,
                  async: true,
                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async foo=>c)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ],
                  id: null,
                  async: true,
                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async function(){})',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: true,
                  generator: false,
                  expression: false,
                  id: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async ())',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'async'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async => x)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'async'
                    }
                  ],
                  id: null,
                  async: false,
                  expression: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async: foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'async'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'async\n: foo',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'foo',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            label: {
              name: 'async',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async = 5 + 5;',
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
                name: 'async'
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Literal',
                  value: 5
                },
                right: {
                  type: 'Literal',
                  value: 5
                },
                operator: '+'
              }
            }
          }
        ]
      }
    ],
    [
      'async + 10;',
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
                type: 'Identifier',
                name: 'async'
              },
              right: {
                type: 'Literal',
                value: 10
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'x + async',
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
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Identifier',
                name: 'async'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'async foo => bar;',
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
                type: 'Identifier',
                name: 'bar'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'foo'
                }
              ],
              id: null,
              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    // ['(async\nfunction f(){await x})', Context.None, {}],
    [
      'f = async function g(){}',
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
                name: 'f'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: true,
                generator: false,
                expression: false,
                id: {
                  type: 'Identifier',
                  name: 'g'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'f = a + b + async() + d',
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
                name: 'f'
              },
              operator: '=',
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '+'
                  },
                  right: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: []
                  },
                  operator: '+'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '+'
              }
            }
          }
        ]
      }
    ],
    [
      'f = a + b + async\n() + d',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'f',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                left: {
                  left: {
                    left: {
                      name: 'a',
                      type: 'Identifier'
                    },
                    operator: '+',
                    right: {
                      name: 'b',
                      type: 'Identifier'
                    },
                    type: 'BinaryExpression'
                  },
                  operator: '+',
                  right: {
                    arguments: [],
                    callee: {
                      name: 'async',
                      type: 'Identifier'
                    },
                    type: 'CallExpression'
                  },
                  type: 'BinaryExpression'
                },
                operator: '+',
                right: {
                  name: 'd',
                  type: 'Identifier'
                },
                type: 'BinaryExpression'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async in {}',
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
                type: 'Identifier',
                name: 'async'
              },
              right: {
                type: 'ObjectExpression',
                properties: []
              },
              operator: 'in'
            }
          }
        ]
      }
    ],
    [
      'async instanceof {}',
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
                type: 'Identifier',
                name: 'async'
              },
              right: {
                type: 'ObjectExpression',
                properties: []
              },
              operator: 'instanceof'
            }
          }
        ]
      }
    ],
    [
      'f(async in {})',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  operator: 'in'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(async instanceof {})',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  operator: 'instanceof'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(a + async in b)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    operator: '+'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: 'in'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'f(a + async instanceof b)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    operator: '+'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: 'instanceof'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'log(async().foo);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'log'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  computed: false,
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    name: 'foo'
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
      'log(async()[foo]);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'log'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  computed: true,
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    name: 'foo'
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
      'foo(async () => foo)',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'ArrowFunctionExpression',
                  id: null,
                  params: [],
                  body: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  expression: true,
                  async: true
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async (a, ...b) => a)',
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
                type: 'Identifier',
                name: 'a'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'RestElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ],
              id: null,
              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'async(...a);',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async(a, ...b);',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async(...a, b);',
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
                name: 'async'
              },
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async \n (x, y)',
      Context.None,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'x',
                  type: 'Identifier'
                },
                {
                  name: 'y',
                  type: 'Identifier'
                }
              ],
              callee: {
                name: 'async',
                type: 'Identifier'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '(async () => {})',
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
                type: 'BlockStatement',
                body: []
              },
              params: [],
              id: null,
              async: true,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '(async x => x)',
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
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ],
              id: null,
              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'async() * b',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '*',
              left: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: []
              },
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f(a, b) * c',
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
                  name: 'f'
                },
                arguments: [
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
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      'async(a, b) * c',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '*',
              left: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
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
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo, async()',
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
                  type: 'Identifier',
                  name: 'foo'
                },
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async (x) + 2',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              operator: '+',
              left: {
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
              right: {
                type: 'Literal',
                value: 2
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = async () => x, y',
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
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    params: [],
                    id: null,
                    async: true,
                    expression: true
                  }
                },
                {
                  type: 'Identifier',
                  name: 'y'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async foo() {}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(async(bullshit) => {})',
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
                type: 'BlockStatement',
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'bullshit'
                }
              ],
              id: null,
              async: true,
              expression: false
            }
          }
        ]
      }
    ]
  ]);
});
