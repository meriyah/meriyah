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
    'foo(async,)',
    'foo("", async)',
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

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  // Valid cases
  for (const arg of [
    'async: function f() {}',
    `var resumeAfterNormalArrow = async (value) => {
      log.push("start:" + value);
      value = await resolveLater(value + 1);
      log.push("resume:" + value);
      value = await resolveLater(value + 1);
      log.push("resume:" + value);
      return value + 1;
    };`,
    'x = { async: false }',
    `async function resumeAfterThrow(value) {
      log.push("start:" + value);
      try {
        value = await rejectLater("throw1");
      } catch (e) {
        log.push("resume:" + e);
      }
      try {
        value = await rejectLater("throw2");
      } catch (e) {
        log.push("resume:" + e);
      }
      return value + 1;
    }`,
    `async function gaga() {
      let i = 1;
      while (i-- > 0) { await 42 }
    }`,
    'async => 42;',
    'const answer = async => 42;',
    'async function await() {}',
    'class X { async await(){} }',
    'foo(async,)',
    'foo("", async)',
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

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  fail('Expressions - Async (fail)', [
    ['await => { let x; }', Context.InAwaitContext],
    ['async while (1) {}', Context.None],
    ['(async function(...x = []) {})', Context.None],
    ['"use strict"; (async function arguments () {  })', Context.None],
    ['"use strict"; (async function eval () { })', Context.None],
    ['var O = { async method() {var [ await ] = 1;}', Context.None],
    ['let async => async', Context.None],
    ['f(async\nfoo=>c)', Context.None],
    ['async let x', Context.None],
    ['async let []', Context.None],
    ['async let [] = y', Context.None],
    ['async let [x]', Context.None],
    ['async let [x]', Context.None],
    ['async let [x] = y', Context.None],
    ['async let {}', Context.None],
    ['async let {} = y', Context.None],
    ['async let {x} = y', Context.None],
    ['function f() {for (let in {}) {}}', Context.Strict],
    ['f(async\nfunction(){})', Context.None],
    ['async function f(){ return await => {}; }', Context.None],
    ['foo(async[])', Context.None],
    ['class X { async(async => {}) {} }', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['async\nfunction f(){await x}', Context.Strict],
    ['async\nfunction f(){await x}', Context.Strict],
    ['let f = async\nfunction g(){await x}', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async(yield);', Context.Strict],
    ['async(await);', Context.Strict | Context.Module],
    ['async (a, ...b+b=c) => a;', Context.None],
    ['async (a, ...b=true) => a;', Context.None],
    ['async (a, ...true=b) => a;', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async (a, ...true) => a;', Context.None],
    ['await/x', Context.Module],
    ['await \n / x', Context.Module]
  ]);
  pass('Expressions - Async (pass)', [
    [
      'async(), x',
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
      'async/x',
      Context.OptionsRanges,
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
                name: 'async',
                start: 0,
                end: 5,
                range: [0, 5]
              },
              right: {
                type: 'Identifier',
                name: 'x',
                start: 6,
                end: 7,
                range: [6, 7]
              },
              operator: '/',
              start: 0,
              end: 7,
              range: [0, 7]
            },
            start: 0,
            end: 7,
            range: [0, 7]
          }
        ],
        start: 0,
        end: 7,
        range: [0, 7]
      }
    ],
    [
      'x / async',
      Context.OptionsRanges,
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
                name: 'x',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              right: {
                type: 'Identifier',
                name: 'async',
                start: 4,
                end: 9,
                range: [4, 9]
              },
              operator: '/',
              start: 0,
              end: 9,
              range: [0, 9]
            },
            start: 0,
            end: 9,
            range: [0, 9]
          }
        ],
        start: 0,
        end: 9,
        range: [0, 9]
      }
    ],
    [
      'async \n / x / g',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  name: 'async',
                  type: 'Identifier'
                },
                operator: '/',
                right: {
                  name: 'x',
                  type: 'Identifier'
                },
                type: 'BinaryExpression'
              },
              operator: '/',
              right: {
                name: 'g',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'async \n / x',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'async',
                type: 'Identifier'
              },
              operator: '/',
              right: {
                name: 'x',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],

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

              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'true ? async.waterfall() : null;',
      Context.Module | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'waterfall'
                  }
                },
                arguments: []
              },
              alternate: {
                type: 'Literal',
                value: null
              }
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

              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      `const a = {
        foo: () => {
        },
        bar: async event => {
        },
        baz: async event => {
        }
      }

      const a = {
        foo: () => {
        },
        bar: async event => {
        }
      }
      `,
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'a',
                  type: 'Identifier'
                },
                init: {
                  properties: [
                    {
                      computed: false,
                      key: {
                        name: 'foo',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: false,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [],
                        type: 'ArrowFunctionExpression'
                      }
                    },
                    {
                      computed: false,
                      key: {
                        name: 'bar',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: true,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [
                          {
                            name: 'event',
                            type: 'Identifier'
                          }
                        ],
                        type: 'ArrowFunctionExpression'
                      }
                    },
                    {
                      computed: false,
                      key: {
                        name: 'baz',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: true,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [
                          {
                            name: 'event',
                            type: 'Identifier'
                          }
                        ],
                        type: 'ArrowFunctionExpression'
                      }
                    }
                  ],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          },
          {
            declarations: [
              {
                id: {
                  name: 'a',
                  type: 'Identifier'
                },
                init: {
                  properties: [
                    {
                      computed: false,
                      key: {
                        name: 'foo',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: false,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [],
                        type: 'ArrowFunctionExpression'
                      }
                    },
                    {
                      computed: false,
                      key: {
                        name: 'bar',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: true,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [
                          {
                            name: 'event',
                            type: 'Identifier'
                          }
                        ],
                        type: 'ArrowFunctionExpression'
                      }
                    }
                  ],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `const a = {
        foo: () => {
        },
        bar: async event => {
        }
      }`,
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'a',
                  type: 'Identifier'
                },
                init: {
                  properties: [
                    {
                      computed: false,
                      key: {
                        name: 'foo',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: false,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [],
                        type: 'ArrowFunctionExpression'
                      }
                    },
                    {
                      computed: false,
                      key: {
                        name: 'bar',
                        type: 'Identifier'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        async: true,
                        body: {
                          body: [],
                          type: 'BlockStatement'
                        },
                        expression: false,
                        params: [
                          {
                            name: 'event',
                            type: 'Identifier'
                          }
                        ],
                        type: 'ArrowFunctionExpression'
                      }
                    }
                  ],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'function f() {for (let in {}) {}}',
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
                  type: 'ForInStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'Identifier',
                    name: 'let'
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
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
    /*  [
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
    ],*/
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  range: [0, 3],
                  name: 'foo'
                },
                {
                  type: 'CallExpression',
                  start: 5,
                  end: 12,
                  range: [5, 12],
                  callee: {
                    type: 'Identifier',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(async())',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 4,
                  end: 11,
                  range: [4, 11],
                  callee: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  arguments: []
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `async function test(){
        const someVar = null;
        async foo => {}
      }`,
      Context.None,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  declarations: [
                    {
                      id: {
                        name: 'someVar',
                        type: 'Identifier'
                      },
                      init: {
                        type: 'Literal',
                        value: null
                      },
                      type: 'VariableDeclarator'
                    }
                  ],
                  kind: 'const',
                  type: 'VariableDeclaration'
                },
                {
                  expression: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    expression: false,
                    params: [
                      {
                        name: 'foo',
                        type: 'Identifier'
                      }
                    ],
                    type: 'ArrowFunctionExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: false,
            id: {
              name: 'test',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `const someVar = null;
          const done = async foo => {}`,
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'someVar',
                  type: 'Identifier'
                },
                init: {
                  type: 'Literal',
                  value: null
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          },
          {
            declarations: [
              {
                id: {
                  name: 'done',
                  type: 'Identifier'
                },
                init: {
                  async: true,
                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  expression: false,
                  params: [
                    {
                      name: 'foo',
                      type: 'Identifier'
                    }
                  ],
                  type: 'ArrowFunctionExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'const',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `async function test(){
        const someVar = null;
        const done = async foo => {}
      }`,
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
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: null
                      },
                      id: {
                        type: 'Identifier',
                        name: 'someVar'
                      }
                    }
                  ]
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'const',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ],
                        async: true,
                        expression: false
                      },
                      id: {
                        type: 'Identifier',
                        name: 'done'
                      }
                    }
                  ]
                }
              ]
            },
            async: true,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'test'
            }
          }
        ]
      }
    ],
    [
      'foo(async(), x)',
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
              type: 'CallExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 4,
                  end: 11,
                  range: [4, 11],
                  callee: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  arguments: []
                },
                {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'x'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(async(x,y,z))',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 4,
                  end: 16,
                  range: [4, 16],
                  callee: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'z'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(async(x,y,z), a, b)',
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
              type: 'CallExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'CallExpression',
                  start: 4,
                  end: 16,
                  range: [4, 16],
                  callee: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'y'
                    },
                    {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'z'
                    }
                  ]
                },
                {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'b'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo(async[x])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 4,
                  end: 12,
                  range: [4, 12],
                  object: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  property: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    name: 'x'
                  },
                  computed: true
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'foo'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 4,
                  end: 13,
                  range: [4, 13],
                  object: {
                    type: 'Identifier',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    name: 'async'
                  },
                  property: {
                    type: 'Identifier',
                    start: 10,
                    end: 13,
                    range: [10, 13],
                    name: 'foo'
                  },
                  computed: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
              type: 'AssignmentExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              right: {
                type: 'BinaryExpression',
                start: 4,
                end: 23,
                range: [4, 23],
                left: {
                  type: 'BinaryExpression',
                  start: 4,
                  end: 19,
                  range: [4, 19],
                  left: {
                    type: 'BinaryExpression',
                    start: 4,
                    end: 9,
                    range: [4, 9],
                    left: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'a'
                    },
                    operator: '+',
                    right: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'b'
                    }
                  },
                  operator: '+',
                  right: {
                    type: 'CallExpression',
                    start: 12,
                    end: 19,
                    range: [12, 19],
                    callee: {
                      type: 'Identifier',
                      start: 12,
                      end: 17,
                      range: [12, 17],
                      name: 'async'
                    },
                    arguments: []
                  }
                },
                operator: '+',
                right: {
                  type: 'Identifier',
                  start: 22,
                  end: 23,
                  range: [22, 23],
                  name: 'd'
                }
              }
            }
          }
        ],
        sourceType: 'script'
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
              type: 'BinaryExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              left: {
                type: 'Identifier',
                start: 0,
                end: 5,
                range: [0, 5],
                name: 'async'
              },
              operator: 'in',
              right: {
                type: 'ObjectExpression',
                start: 9,
                end: 11,
                range: [9, 11],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  start: 2,
                  end: 13,
                  range: [2, 13],
                  left: {
                    type: 'Identifier',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    name: 'async'
                  },
                  operator: 'in',
                  right: {
                    type: 'ObjectExpression',
                    start: 11,
                    end: 13,
                    range: [11, 13],
                    properties: []
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'BinaryExpression',
                  start: 2,
                  end: 16,
                  range: [2, 16],
                  left: {
                    type: 'BinaryExpression',
                    start: 2,
                    end: 11,
                    range: [2, 11],
                    left: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    operator: '+',
                    right: {
                      type: 'Identifier',
                      start: 6,
                      end: 11,
                      range: [6, 11],
                      name: 'async'
                    }
                  },
                  operator: 'in',
                  right: {
                    type: 'Identifier',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    name: 'b'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'log'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 4,
                  end: 15,
                  range: [4, 15],
                  object: {
                    type: 'CallExpression',
                    start: 4,
                    end: 11,
                    range: [4, 11],
                    callee: {
                      type: 'Identifier',
                      start: 4,
                      end: 9,
                      range: [4, 9],
                      name: 'async'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    start: 12,
                    end: 15,
                    range: [12, 15],
                    name: 'foo'
                  },
                  computed: false
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 3,
                range: [0, 3],
                name: 'log'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 4,
                  end: 16,
                  range: [4, 16],
                  object: {
                    type: 'CallExpression',
                    start: 4,
                    end: 11,
                    range: [4, 11],
                    callee: {
                      type: 'Identifier',
                      start: 4,
                      end: 9,
                      range: [4, 9],
                      name: 'async'
                    },
                    arguments: []
                  },
                  property: {
                    type: 'Identifier',
                    start: 12,
                    end: 15,
                    range: [12, 15],
                    name: 'foo'
                  },
                  computed: true
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
              type: 'CallExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                range: [0, 5],
                name: 'async'
              },
              arguments: [
                {
                  type: 'SpreadElement',
                  start: 6,
                  end: 10,
                  range: [6, 10],
                  argument: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  }
                },
                {
                  type: 'Identifier',
                  start: 12,
                  end: 13,
                  range: [12, 13],
                  name: 'b'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
              async: true,
              expression: false
            }
          }
        ]
      }
    ]
  ]);
});
