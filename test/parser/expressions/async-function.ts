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
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
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
    'var O = { async method(foo, bar) {} }',
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
  function f(){}`,
    'a = async package => 1',
    'a = async package => { }',
    'a = async p\\u0061ckage => { }',
    'a = (async package => 1)',
    'a = (async package => { })',
    'a = (async p\\u0061ckage => { })'
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
    ['(async function foo4() { } => 1)', Context.Module],
    ['(async function() { } foo5 => 1)', Context.Module],
    ['(async function() { } () => 1)', Context.Module],
    ['(async function() { } => 1)', Context.Module],
    ['"use strict"; async function asyncFunctionDeclaration(await) {}', Context.Module],
    ['"use strict"; (async function foo() { } bar => 1)', Context.Module],
    ['"use strict"; (async function foo() { } () => 1)', Context.Module],
    ['"use strict"; (async function foo() { } => 1)', Context.Module],
    ['"use strict"; (async function() { } () => 1)', Context.Module],
    ['"use strict"; (async function() { } => 1)', Context.Module],
    ['"use strict"; (async.foo bar => 1)', Context.Module],
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
    //['async function f(){ (x = new x(await x)) => {} }', Context.Module],
    ['async function f() { function g() { await 3; } }', Context.Module],
    ['async function f(){ new await x; }', Context.None],
    ['async function f(){ [new await foo] }', Context.None],
    ['async function f(){ (new await foo) }', Context.None],
    ['async function *f(){ new await; }', Context.None],
    ['async function f(await){}', Context.None],
    ['async function *f(await){}', Context.None],
    ['async(...a, b) => b', Context.None],
    ['(async function(...x = []) {})', Context.None],
    ['a = async package => { "use strict" }', Context.None],
    ['a = async p\\u0061ckage => { "use strict" }', Context.None],
    ['a = async (package) => { "use strict" }', Context.None],
    ['a = async (p\\u0061ckage) => { "use strict" }', Context.None],
    ['a = (async (package) => { "use strict" })', Context.None],
    ['a = (async (p\\u0061ckage) => { "use strict" })', Context.None]
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 49,
        range: [0, 49],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 49,
            range: [0, 49],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'g'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 49,
              range: [13, 49],
              body: [
                {
                  type: 'FunctionDeclaration',
                  start: 17,
                  end: 38,
                  range: [17, 38],
                  id: {
                    type: 'Identifier',
                    start: 32,
                    end: 33,
                    range: [32, 33],
                    name: 'f'
                  },
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 36,
                    end: 38,
                    range: [36, 38],
                    body: []
                  }
                },
                {
                  type: 'VariableDeclaration',
                  start: 39,
                  end: 45,
                  range: [39, 45],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 43,
                      end: 44,
                      range: [43, 44],
                      id: {
                        type: 'Identifier',
                        start: 43,
                        end: 44,
                        range: [43, 44],
                        name: 'f'
                      },
                      init: null
                    }
                  ],
                  kind: 'var'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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

              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function foo() { }.prototype)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        range: [0, 36],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 36,
            range: [0, 36],
            expression: {
              type: 'MemberExpression',
              start: 1,
              end: 35,
              range: [1, 35],
              object: {
                type: 'FunctionExpression',
                start: 1,
                end: 25,
                range: [1, 25],
                id: {
                  type: 'Identifier',
                  start: 16,
                  end: 19,
                  range: [16, 19],
                  name: 'foo'
                },
                generator: false,
                async: true,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 22,
                  end: 25,
                  range: [22, 25],
                  body: []
                }
              },
              property: {
                type: 'Identifier',
                start: 26,
                end: 35,
                range: [26, 35],
                name: 'prototype'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = class {async bar() { await b }}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 58,
        range: [0, 58],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 58,
            range: [0, 58],
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              range: [15, 18],
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 54,
                range: [19, 54],
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  range: [19, 20],
                  name: 'a'
                },
                right: {
                  type: 'ClassExpression',
                  start: 23,
                  end: 54,
                  range: [23, 54],
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 29,
                    end: 54,
                    range: [29, 54],
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 30,
                        end: 53,
                        range: [30, 53],
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 36,
                          end: 39,
                          range: [36, 39],
                          name: 'bar'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 39,
                          end: 53,
                          range: [39, 53],
                          id: null,
                          generator: false,
                          async: true,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 42,
                            end: 53,
                            range: [42, 53],
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 44,
                                end: 51,
                                range: [44, 51],
                                expression: {
                                  type: 'AwaitExpression',
                                  start: 44,
                                  end: 51,
                                  range: [44, 51],
                                  argument: {
                                    type: 'Identifier',
                                    start: 50,
                                    end: 51,
                                    range: [50, 51],
                                    name: 'b'
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 56,
              end: 58,
              range: [56, 58],
              body: []
            }
          }
        ],
        sourceType: 'script'
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

                    id: {
                      type: 'Identifier',
                      name: 'yield'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 32,
            range: [0, 32],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 32,
              range: [0, 32],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'FunctionExpression',
                  start: 2,
                  end: 31,
                  range: [2, 31],
                  id: null,
                  generator: false,
                  async: true,
                  params: [
                    {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      name: 'x'
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    start: 20,
                    end: 31,
                    range: [20, 31],
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 22,
                        end: 29,
                        range: [22, 29],
                        expression: {
                          type: 'AwaitExpression',
                          start: 22,
                          end: 29,
                          range: [22, 29],
                          argument: {
                            type: 'Identifier',
                            start: 28,
                            end: 29,
                            range: [28, 29],
                            name: 'x'
                          }
                        }
                      }
                    ]
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
      '(function* g() { (async function yield() {}); })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 48,
        range: [0, 48],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 48,
            range: [0, 48],
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 47,
              range: [1, 47],
              id: {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
                name: 'g'
              },
              generator: true,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 15,
                end: 47,
                range: [15, 47],
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 17,
                    end: 45,
                    range: [17, 45],
                    expression: {
                      type: 'FunctionExpression',
                      start: 18,
                      end: 43,
                      range: [18, 43],
                      id: {
                        type: 'Identifier',
                        start: 33,
                        end: 38,
                        range: [33, 38],
                        name: 'yield'
                      },
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 41,
                        end: 43,
                        range: [41, 43],
                        body: []
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
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
            },
            directive: 'use strict'
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

                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'class X { static async await(){} }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 34,
        range: [0, 34],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 34,
            range: [0, 34],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'X'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 34,
              range: [8, 34],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 32,
                  range: [10, 32],
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 23,
                    end: 28,
                    range: [23, 28],
                    name: 'await'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 28,
                    end: 32,
                    range: [28, 32],
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 30,
                      end: 32,
                      range: [30, 32],
                      body: []
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        range: [0, 36],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 36,
            range: [0, 36],
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 35,
              range: [1, 35],
              id: {
                type: 'Identifier',
                start: 16,
                end: 19,
                range: [16, 19],
                name: 'foo'
              },
              generator: false,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  range: [20, 21],
                  name: 'a'
                },
                {
                  type: 'AssignmentPattern',
                  start: 23,
                  end: 29,
                  range: [23, 29],
                  left: {
                    type: 'Identifier',
                    start: 23,
                    end: 24,
                    range: [23, 24],
                    name: 'b'
                  },
                  right: {
                    type: 'Literal',
                    start: 27,
                    end: 29,
                    range: [27, 29],
                    value: 39
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 32,
                end: 35,
                range: [32, 35],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async function*(a = b +=1, c = d += 1, e = f += 1, g = h += 1, i = j += 1, k = l +=1) {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 90,
        range: [0, 90],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 90,
            range: [0, 90],
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 89,
              range: [1, 89],
              id: null,
              generator: true,
              async: true,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 17,
                  end: 26,
                  range: [17, 26],
                  left: {
                    type: 'Identifier',
                    start: 17,
                    end: 18,
                    range: [17, 18],
                    name: 'a'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 21,
                    end: 26,
                    range: [21, 26],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 21,
                      end: 22,
                      range: [21, 22],
                      name: 'b'
                    },
                    right: {
                      type: 'Literal',
                      start: 25,
                      end: 26,
                      range: [25, 26],
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 28,
                  end: 38,
                  range: [28, 38],
                  left: {
                    type: 'Identifier',
                    start: 28,
                    end: 29,
                    range: [28, 29],
                    name: 'c'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 32,
                    end: 38,
                    range: [32, 38],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 32,
                      end: 33,
                      range: [32, 33],
                      name: 'd'
                    },
                    right: {
                      type: 'Literal',
                      start: 37,
                      end: 38,
                      range: [37, 38],
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 40,
                  end: 50,
                  range: [40, 50],
                  left: {
                    type: 'Identifier',
                    start: 40,
                    end: 41,
                    range: [40, 41],
                    name: 'e'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 44,
                    end: 50,
                    range: [44, 50],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 44,
                      end: 45,
                      range: [44, 45],
                      name: 'f'
                    },
                    right: {
                      type: 'Literal',
                      start: 49,
                      end: 50,
                      range: [49, 50],
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 52,
                  end: 62,
                  range: [52, 62],
                  left: {
                    type: 'Identifier',
                    start: 52,
                    end: 53,
                    range: [52, 53],
                    name: 'g'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 56,
                    end: 62,
                    range: [56, 62],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 56,
                      end: 57,
                      range: [56, 57],
                      name: 'h'
                    },
                    right: {
                      type: 'Literal',
                      start: 61,
                      end: 62,
                      range: [61, 62],
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 64,
                  end: 74,
                  range: [64, 74],
                  left: {
                    type: 'Identifier',
                    start: 64,
                    end: 65,
                    range: [64, 65],
                    name: 'i'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 68,
                    end: 74,
                    range: [68, 74],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 68,
                      end: 69,
                      range: [68, 69],
                      name: 'j'
                    },
                    right: {
                      type: 'Literal',
                      start: 73,
                      end: 74,
                      range: [73, 74],
                      value: 1
                    }
                  }
                },
                {
                  type: 'AssignmentPattern',
                  start: 76,
                  end: 85,
                  range: [76, 85],
                  left: {
                    type: 'Identifier',
                    start: 76,
                    end: 77,
                    range: [76, 77],
                    name: 'k'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    start: 80,
                    end: 85,
                    range: [80, 85],
                    operator: '+=',
                    left: {
                      type: 'Identifier',
                      start: 80,
                      end: 81,
                      range: [80, 81],
                      name: 'l'
                    },
                    right: {
                      type: 'Literal',
                      start: 84,
                      end: 85,
                      range: [84, 85],
                      value: 1
                    }
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 87,
                end: 89,
                range: [87, 89],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
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
