import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Async function', () => {
  for (const arg of [
    '(async function () { var await; });',
    '(async function () { void await; });',
    '(async function () { await: ; });',
    '(async function foo (foo) { super() })',
    '(async function foo (foo) { super.prop });',
    '(async function foo (foo = super()) { var bar; });',
    '(async function*(await) { });',
    '(async function foo(await) { })',
    '(async\nfunction foo() { })',
    'async ()\n=> a',
    `async while (1) {}`,
    `(async
               function f() {})`,
    '0, async function*(...x = []) {};',
    '(async function f(...a,) {})',
    '(async function foo1() { } foo2 => 1)',
    'var f = async() => ((async(x = await 1) => x)();',
    'class C { async constructor() {} }',
    'class C {}; class C2 extends C { async constructor() {} }',
    'class C { static async prototype() {} }',
    'class C {}; class C2 extends C { static async prototype() {} }',
    '(async function foo3() { } () => 1)',
    '(async function foo4() { } => 1)',
    '(async function() { } foo5 => 1)',
    '(async function() { } () => 1)',
    '(async function() { } => 1)',
    '(async function(...a,) {})',
    '(async function *() { var await; })',
    '"use strict"; (async function *() { var await; })',
    `async function wrap() { async function await() { } };`,
    '(async.foo6 => 1)',
    '(async.foo7 foo8 => 1)',
    '(async.foo9 () => 1)',
    '(async().foo10 => 1)',
    '(async().foo11 foo12 => 1)',
    '(async().foo13 () => 1)',
    "(async['foo14'] => 1)",
    "(async['foo15'] foo16 => 1)",
    "(async['foo17'] () => 1)",
    "(async()['foo18'] => 1)",
    "(async()['foo19'] foo20 => 1)",
    "(async()['foo21'] () => 1)",
    '(async`foo22` => 1)',
    '(async`foo23` foo24 => 1)',
    '(async`foo25` () => 1)',
    '(async`foo26`.bar27 => 1)',
    '(async`foo28`.bar29 foo30 => 1)',
    '(async`foo31`.bar32 () => 1)',
    'var f = async() => await;',
    'var O = { *async method() {} };',
    'var O = { async method*() {} };',
    'async(...a = b) => b',
    'async(...a,) => b',
    'async(...a, b) => b',
    `(async
                function f() {})`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Module);
      });
    });
  }

  for (const arg of [
    '(async function foo() { }.prototype)',
    '(async function foo(x, y = x, z = y) { })',
    '(async function foo(x = y, y) { })',
    '(async function foo(a, b = 39,) { })',
    '(async function foo(a, b,) { })',
    '(async function foo(_ = (function() {}())) { })',
    '(async function foo(x = x) { })',
    'var O = { async method(eval) {} }',
    "var O = { async ['meth' + 'od'](eval) {} }",
    "var O = { async 'method'(eval) {} }",
    'var O = { async 0(eval) {} }',
    'var O = { async method(arguments) {} }',
    "var O = { async ['meth' + 'od'](arguments) {} }",
    "var O = { async 'method'(arguments) {} }",
    'var O = { async 0(arguments) {} }',
    'var O = { async method(dupe, dupe) {} }',
    'async function await() {}',
    'class X { static async await(){} }',
    `(async function ref(a, b = 39,) {});`,
    `x = async function(a) { await a }`,
    'f(async function(x) { await x })',
    'f(b, async function(b) { await b }, c)',
    'async function foo(a = async () => await b) {}',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = class {async bar() { await b }}) {}',
    '(function f() { async function yield() {} })',
    '(function f() { ({ async yield() {} }); })',
    '({ async [yield]() {} });',
    'f(async function(x) { await x })',
    'f(b, async function(b) { await b }, c)',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = class {async bar() { await b }}) {}',
    'async function foo(a, b) { await a }',
    '(function* g() { (async function yield() {}); })',
    '"use strict"; ({ async yield() {} });',
    '(function f() { ({ async [yield]() {} }); })',
    `a = async
  function f(){}`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`() => { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Async function (fail)', [
    ['async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['async function f(){    (fail = class A {[await foo](){}; "x"(){}}) => {}    }', Context.None],
    ['class C { async constructor() {} }', Context.None],
    ['(async function(...x = []) {})', Context.None],
    ['(async function f (...a,) {  })', Context.None],
    ['export async function() {}', Context.Strict | Context.Module],
    ['async while (1) {}', Context.None],
    ['(async function() { } () => 1)', Context.None],
    ['(async function *() { var await; })', Context.None],
    ['(async \n function(){})', Context.None],
    ['if (async \n () => x) x', Context.None],
    ['async function(){}', Context.None],
    ['async function wrap() { async function await() { } };', Context.None],
    ['(async.foo6 => 1)', Context.None],
    ['(async.foo7 foo8 => 1)', Context.None],
    ['(async function arguments () { "use strict"; })', Context.None],
    ['(async function (x = 1) {"use strict"})', Context.None],
    ['async function wrap() {\nasync function await() { }\n}', Context.None],
    ['async function foo(await) { }', Context.None],
    ['async function foo() { return {await} }', Context.None],
    ['(async function await() { })', Context.None],
    ['(async function foo(await) { })', Context.None],
    ['(async function foo() { return {await} })', Context.None],
    ['async function a(k = await 3) {}', Context.None],
    ['(async function(k = await 3) {})', Context.None],
    ['(async function a(k = await 3) {})', Context.None],
    ["'use strict'; (async function eval() {})", Context.None],
    ['(async function(k = super.prop) {})', Context.None],
    ['(async function a(k = super.prop) {})', Context.None],
    ['(async function a() { super.prop(); })', Context.None],
    ['(async function a(k = super()) {})', Context.None],
    ['(async function(k = super()) {})', Context.None],
    ['async function a() { super(); }', Context.None],
    ['(async function a() { super(); })', Context.None],
    ['({async async: 0})', Context.None],
    ['({async async})', Context.None],
    ['({async async = 0} = {})', Context.None],
    ['function f() { await 5; }', Context.Module],
    ['async function f() { function g() { await 3; } }', Context.Module],
    ['async function f(){ new await x; }', Context.None],
    ['async function f(){ [new await foo] }', Context.None],
    ['async function f(){ (new await foo) }', Context.None],
    ['async function *f(){ new await; }', Context.None],
    ['async function f(await){}', Context.None],
    ['async function *f(await){}', Context.None],
    ['async(...a, b) => b', Context.None],
    ['(async function(...x = []) {})', Context.None]
  ]);
  pass('Expressions - Async function (pass)', [
    [
      '(async function foo(a, b = 39,) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    value: 39
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,
              expression: false,
              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'async function f() { let y = await x * x }',
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
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'AwaitExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x'
                          }
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '*'
                      },
                      id: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                }
              ]
            },
            async: true,
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
      'async function f() {} var f;',
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
              body: []
            },
            async: true,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'function g() {   async function f() {} var f;   }',
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
                  type: 'FunctionDeclaration',
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
                    name: 'f'
                  }
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: null,
                      id: {
                        type: 'Identifier',
                        name: 'f'
                      }
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'g'
            }
          }
        ]
      }
    ],
    [
      '(async function(){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
          }
        ]
      }
    ],
    [
      '(async function foo() { }.prototype)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
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
                  name: 'foo'
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'prototype'
              }
            }
          }
        ]
      }
    ],
    [
      'async function foo(a = class {async bar() { await b }}) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'ClassExpression',
                  id: null,
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
                          name: 'bar'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'AwaitExpression',
                                  argument: {
                                    type: 'Identifier',
                                    name: 'b'
                                  }
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: false,
                          id: null
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      '(function f() { async function yield() {} })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'FunctionDeclaration',
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
                      name: 'yield'
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
          }
        ]
      }
    ],
    [
      '({ async [yield]() {} });',
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
                    name: 'yield'
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
                  computed: true,
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
      'f(async function(x) { await x })',
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
                  params: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'AwaitExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'x'
                          }
                        }
                      }
                    ]
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
      '(function* g() { (async function yield() {}); })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
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
                        name: 'yield'
                      }
                    }
                  }
                ]
              },
              async: false,
              generator: true,
              expression: false,
              id: {
                type: 'Identifier',
                name: 'g'
              }
            }
          }
        ]
      }
    ],
    [
      '"use strict"; ({ async yield() {} });',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'yield'
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
      '(function f() { ({ async [yield]() {} }); })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
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
                            name: 'yield'
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
                          computed: true,
                          method: true,
                          shorthand: false
                        }
                      ]
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
          }
        ]
      }
    ],
    [
      'x = async function(a) { await a }',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AwaitExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      }
                    }
                  ]
                },
                async: true,
                generator: false,
                expression: false,
                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'class X { static async await(){} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'X'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'await'
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
      'var O = { async 0(eval) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 0
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'eval'
                          }
                        ],
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
                },
                id: {
                  type: 'Identifier',
                  name: 'O'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '(async function foo(a, b = 39,) { })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    value: 39
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,
              expression: false,
              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function*(a = b +=1, c = d += 1, e = f += 1, g = h += 1, i = j += 1, k = l +=1) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'e'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'f'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'g'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'h'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'i'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'j'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'k'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'l'
                    },
                    operator: '+=',
                    right: {
                      type: 'Literal',
                      value: 1
                    }
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: true,
              expression: false,
              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function foo(a,) {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,
              expression: false,
              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],

    [
      '(async function foo(_ = (function() {}())) { })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: '_'
                  },
                  right: {
                    type: 'CallExpression',
                    callee: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      expression: false,
                      id: null
                    },
                    arguments: []
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: true,
              generator: false,
              expression: false,
              id: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ]
  ]);
});
