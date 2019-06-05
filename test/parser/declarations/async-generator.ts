import { Context } from '../../../src/common';
import * as t from 'assert';
import { pass, fail } from '../../test-utils';
import { parseSource } from '../../../src/parser';

describe('Declarations - Async Generator', () => {
  for (const arg of [
    'yield 2;',
    'yield * 2;',
    'yield * \n 2;',
    'yield * \r 2;',
    'yield * \t 2;',
    'yield * \n\f\r 2;',
    'yield * \f\n\r 2;',
    'yield yield 1;',
    'yield * yield * 1;',
    'yield 3 + (yield 4);',
    'yield 3 + (yield 4) + 4;',
    'yield * 3 + (yield * 4);',
    '(yield * 3) + (yield * 4);',
    'yield 3; yield 4;',
    'yield * 3; yield * 4;',
    '(function (yield) { })',
    '(function yield() { })',
    '(function (await) { })',
    '(function await() { })',
    'yield { yield: 12 }',
    'yield /* comment */ { yield: 12 }',
    'x = class extends (await 10) {}',
    'x = class extends f(await 10) {}',
    'x = class extends (null, await 10) { }',
    'x = class extends (a ? null : await 10) { }',
    'yield * \n { yield: 12 }',
    'yield /* comment */ * \n { yield: 12 }',
    'yield 1; return',
    'yield 1; return;',
    'yield * 1; return',
    'yield * 1; return;',
    'yield 1; return 7',
    'yield * 1; return 7',
    "yield 1; return 7; yield 'foo';",
    "yield * 1; return 3; yield * 'foo';",
    '({ yield: 1 })',
    '({ get yield() { } })',
    '({ await: 1 })',
    '({ get await() { } })',
    '({ [yield]: x } = { })',
    '({ [await 1]: x } = { })',
    'yield',
    'yield\n',
    'yield /* comment */',
    'yield // comment\n',
    'yield // comment\n\r\f',
    '(yield)',
    '[yield]',
    '{yield}',
    'yield, yield',
    'yield; yield',
    'yield; yield; yield; yield;',
    '(yield) ? yield : yield',
    '(yield) \n ? yield : yield',
    'yield\nfor (;;) {}',
    'await 10',
    'await 10; return',
    'await 10; return 20',
    "await 10; return 20; yield 'foo'",
    'await (yield 10)',
    'await (  yield     10  ) ',
    'await (yield 10); return',
    'await (yield 10); return 80',
    "await (yield 10); return 50; yield 'foo'",
    'yield await 10',
    'yield await 10; return',
    'yield await 10; return;',
    'yield await 10; return 10',
    "yield await 10; return 10; yield 'foo'",
    'await /* comment */ 10',
    'await // comment\n 10',
    'yield await /* comment\n */ 10',
    'yield await // comment\n 10',
    'await (yield /* comment */)',
    'await (yield // comment\n)',
    'for await (x of xs);',
    'for await (let x of xs);',
    'await a; yield b;',
    'class A { async f() { for await (x of xs); } }'
  ]) {
    it(`async function * gen() { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function * gen() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`(async function * () { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () { ${arg} })`, undefined, Context.None);
      });
    });

    it(`(async function * () { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () { ${arg} })`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`(async function * gen() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * gen() { ${arg} })`, undefined, Context.None);
      });
    });

    it(`({ async * gen () { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`(async function * () {${arg} }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`(async function * () {${arg} }) `, undefined, Context.None);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () {${arg} } }) `, undefined, Context.None);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.doesNotThrow(() => {
        parseSource(`({ async * gen () {${arg} } }) `, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'var yield;',
    'var await;',
    'var foo, yield;',
    'var foo, await;',
    'try { } catch (yield) { }',
    'try { } catch (await) { }',
    'function yield() { }',
    '(async function * yield() { })',
    '(async function * await() { })',
    'async function * foo(yield) { }',
    '(async function * foo(yield) { })',
    'async function * foo(await) { }',
    '(async function * foo(await) { })',
    '(async function * foo(await) { })',
    'yield = 1;',
    'await = 1;',
    'var foo = yield = 1;',
    'var foo = await = 1;',
    '++yield;',
    'yield++;',
    'await++;',
    'yield *',
    '(yield *)',
    'yield 3 + yield 4;',
    'yield: 34',
    'yield ? 1 : 2',
    'yield / yield',
    '+ yield',
    '+ yield 3',
    'yield\n*3',
    'var [yield] = [42];',
    'var [await] = [42];',
    'var {foo: yield} = {a: 42};',
    'yield\n{yield: 42}',
    'yield /* comment */\n {yield: 42}',
    'yield //comment\n {yield: 42}',
    'var {foo: await} = {a: 42};',
    '[yield] = [42];',
    '[await] = [42];',
    '({a: yield} = {a: 42});',
    '({a: await} = {a: 42});',
    'var [yield 24] = [42];',
    'var [await 24] = [42];',
    'var {foo: yield 24} = {a: 42};',
    'var {foo: await 24} = {a: 42};',
    '[yield 24] = [42];',
    '[await 24] = [42];',
    '({a: yield 24} = {a: 42});',
    '({a: await 24} = {a: 42});',
    '({ await })',
    'yield --> comment ',
    '(yield --> comment)',
    'yield /* comment */ --> comment ',
    'class C extends yield { }',
    '[yield 24] = [42];',
    '[await 24] = [42];',
    '({a: yield 24} = {a: 42});',
    '({a: await 24} = {a: 42});',
    "for (yield 'x' in {});",
    "for (await 'x' in {});",
    "for (yield 'x' of {});",
    "for (await 'x' of {});",
    "for (yield 'x' in {} in {});",
    "for (await 'x' in {} in {});",
    "for (yield 'x' in {} of {});",
    "for (await 'x' in {} of {});",
    'class C extends yield { }',
    'class C extends await { }'
  ]) {
    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `, undefined, Context.None);
      });
    });

    it(`"use strict"; async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`"use strict"; async function * gen() { ${arg} } `, undefined, Context.None);
      });
    });

    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `, undefined, Context.Strict | Context.Module);
      });
    });

    it(`async function * gen() { ${arg} } `, () => {
      t.throws(() => {
        parseSource(`async function * gen() { ${arg} } `, undefined, Context.Strict | Context.Module);
      });
    });

    it(`(async function * () {${arg} }) `, () => {
      t.throws(() => {
        parseSource(`(async function * () {${arg} }) `, undefined, Context.None);
      });
    });

    it(`({ async * gen () {${arg} } }) `, () => {
      t.throws(() => {
        parseSource(`({ async * gen () {${arg} } }) `, undefined, Context.None);
      });
    });
  }

  fail('Declarations - const (fail)', [
    ['({ yield })', Context.Strict],
    ['({async\n    foo() { }})', Context.None],
    ['void \\u0061sync function* f(){};', Context.None],
    ['for ( ; false; ) async function* g() {}', Context.None],
    ['class A { async* f() { () => await a; } }', Context.None],
    ['class A { async* f() { () => yield a; } }', Context.None],
    ['class A { *async f() {} }', Context.None],
    ['obj = { *async f() {}', Context.None],
    ['obj = { *async* f() {}', Context.None],
    ['obj = { async* f() { () => await a; } }', Context.None],
    ['obj = { async* f() { () => yield a; } }', Context.None],
    ['f = async function*() { () => yield a; }', Context.None],
    ['f = async function*() { () => await a; }', Context.None],
    ['async function* f([...x = []]) {  }', Context.None],
    ['async function* f([...x, y]) {}', Context.None],
    ['async function* f([...{ x }, y]) {}', Context.None],
    ['async function* f([...[x], y]) {}', Context.None],
    ['f = async function*() { () => await a; }', Context.None]
  ]);

  pass('Declarations - const (pass)', [
    [
      'async function* f([[] = function() {}()]) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ArrayPattern',
                      elements: []
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
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'async function* f([[x]]) {  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'var gen = async function *() { yield { ...yield, y: 1, ...yield yield, }; };',
      Context.Strict | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 76,
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 76,
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 75,
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 7,
                  name: 'gen'
                },
                init: {
                  type: 'FunctionExpression',
                  start: 10,
                  end: 75,
                  id: null,
                  generator: true,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 29,
                    end: 75,
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 31,
                        end: 73,
                        expression: {
                          type: 'YieldExpression',
                          start: 31,
                          end: 72,
                          delegate: false,
                          argument: {
                            type: 'ObjectExpression',
                            start: 37,
                            end: 72,
                            properties: [
                              {
                                type: 'SpreadElement',
                                start: 39,
                                end: 47,
                                argument: {
                                  type: 'YieldExpression',
                                  start: 42,
                                  end: 47,
                                  delegate: false,
                                  argument: null
                                }
                              },
                              {
                                type: 'Property',
                                start: 49,
                                end: 53,
                                method: false,
                                shorthand: false,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  start: 49,
                                  end: 50,
                                  name: 'y'
                                },
                                value: {
                                  type: 'Literal',
                                  start: 52,
                                  end: 53,
                                  value: 1
                                },
                                kind: 'init'
                              },
                              {
                                type: 'SpreadElement',
                                start: 55,
                                end: 69,
                                argument: {
                                  type: 'YieldExpression',
                                  start: 58,
                                  end: 69,
                                  delegate: false,
                                  argument: {
                                    type: 'YieldExpression',
                                    start: 64,
                                    end: 69,
                                    delegate: false,
                                    argument: null
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
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([arrow = () => {}]) {  }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'arrow'
                    },
                    right: {
                      type: 'ArrowFunctionExpression',
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      params: [],
                      async: false,
                      expression: false
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'async function* f([fn = function () {}, xFn = function x() {}]) {  }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 68,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 68,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ArrayPattern',
                start: 18,
                end: 62,
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 19,
                    end: 38,
                    left: {
                      type: 'Identifier',
                      start: 19,
                      end: 21,
                      name: 'fn'
                    },
                    right: {
                      type: 'FunctionExpression',
                      start: 24,
                      end: 38,
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 36,
                        end: 38,
                        body: []
                      }
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    start: 40,
                    end: 61,
                    left: {
                      type: 'Identifier',
                      start: 40,
                      end: 43,
                      name: 'xFn'
                    },
                    right: {
                      type: 'FunctionExpression',
                      start: 46,
                      end: 61,
                      id: {
                        type: 'Identifier',
                        start: 55,
                        end: 56,
                        name: 'x'
                      },
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 59,
                        end: 61,
                        body: []
                      }
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 64,
              end: 68,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {  }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 63,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 63,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ArrayPattern',
                start: 18,
                end: 57,
                elements: [
                  {
                    type: 'AssignmentPattern',
                    start: 19,
                    end: 56,
                    left: {
                      type: 'ObjectPattern',
                      start: 19,
                      end: 30,
                      properties: [
                        {
                          type: 'Property',
                          start: 21,
                          end: 22,
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 21,
                            end: 22,
                            name: 'x'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 21,
                            end: 22,
                            name: 'x'
                          }
                        },
                        {
                          type: 'Property',
                          start: 24,
                          end: 25,
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 24,
                            end: 25,
                            name: 'y'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 24,
                            end: 25,
                            name: 'y'
                          }
                        },
                        {
                          type: 'Property',
                          start: 27,
                          end: 28,
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 27,
                            end: 28,
                            name: 'z'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 27,
                            end: 28,
                            name: 'z'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 33,
                      end: 56,
                      properties: [
                        {
                          type: 'Property',
                          start: 35,
                          end: 40,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 35,
                            end: 36,
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            start: 38,
                            end: 40,
                            value: 44
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 42,
                          end: 47,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 42,
                            end: 43,
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            start: 45,
                            end: 47,
                            value: 55
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 49,
                          end: 54,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 49,
                            end: 50,
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            start: 52,
                            end: 54,
                            value: 66
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 59,
              end: 63,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([{ x }]) {  }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 31,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ArrayPattern',
                start: 18,
                end: 25,
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 19,
                    end: 24,
                    properties: [
                      {
                        type: 'Property',
                        start: 21,
                        end: 22,
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 21,
                          end: 22,
                          name: 'x'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 21,
                          end: 22,
                          name: 'x'
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 27,
              end: 31,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([ , , ...x]) {  }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 35,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ArrayPattern',
                start: 18,
                end: 29,
                elements: [
                  null,
                  null,
                  {
                    type: 'RestElement',
                    start: 24,
                    end: 28,
                    argument: {
                      type: 'Identifier',
                      start: 27,
                      end: 28,
                      name: 'x'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 31,
              end: 35,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([arrow = () => {}] = []) {}',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'arrow'
                      },
                      right: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        params: [],

                        async: false,
                        expression: false
                      }
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: []
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'async function* f([[x]] = [null]) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 36,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 18,
                end: 32,
                left: {
                  type: 'ArrayPattern',
                  start: 18,
                  end: 23,
                  elements: [
                    {
                      type: 'ArrayPattern',
                      start: 19,
                      end: 22,
                      elements: [
                        {
                          type: 'Identifier',
                          start: 20,
                          end: 21,
                          name: 'x'
                        }
                      ]
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  start: 26,
                  end: 32,
                  elements: [
                    {
                      type: 'Literal',
                      start: 27,
                      end: 31,
                      value: null
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 34,
              end: 36,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 89,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 89,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 18,
                end: 85,
                left: {
                  type: 'ArrayPattern',
                  start: 18,
                  end: 57,
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      start: 19,
                      end: 56,
                      left: {
                        type: 'ObjectPattern',
                        start: 19,
                        end: 30,
                        properties: [
                          {
                            type: 'Property',
                            start: 21,
                            end: 22,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 21,
                              end: 22,
                              name: 'x'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 21,
                              end: 22,
                              name: 'x'
                            }
                          },
                          {
                            type: 'Property',
                            start: 24,
                            end: 25,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 24,
                              end: 25,
                              name: 'y'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 24,
                              end: 25,
                              name: 'y'
                            }
                          },
                          {
                            type: 'Property',
                            start: 27,
                            end: 28,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 27,
                              end: 28,
                              name: 'z'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 27,
                              end: 28,
                              name: 'z'
                            }
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        start: 33,
                        end: 56,
                        properties: [
                          {
                            type: 'Property',
                            start: 35,
                            end: 40,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 35,
                              end: 36,
                              name: 'x'
                            },
                            value: {
                              type: 'Literal',
                              start: 38,
                              end: 40,
                              value: 44,
                              raw: '44'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 42,
                            end: 47,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 42,
                              end: 43,
                              name: 'y'
                            },
                            value: {
                              type: 'Literal',
                              start: 45,
                              end: 47,
                              value: 55,
                              raw: '55'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 49,
                            end: 54,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 49,
                              end: 50,
                              name: 'z'
                            },
                            value: {
                              type: 'Literal',
                              start: 52,
                              end: 54,
                              value: 66,
                              raw: '66'
                            },
                            kind: 'init'
                          }
                        ]
                      }
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  start: 60,
                  end: 85,
                  elements: [
                    {
                      type: 'ObjectExpression',
                      start: 61,
                      end: 84,
                      properties: [
                        {
                          type: 'Property',
                          start: 63,
                          end: 68,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 63,
                            end: 64,
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            start: 66,
                            end: 68,
                            value: 11,
                            raw: '11'
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 70,
                          end: 75,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 70,
                            end: 71,
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            start: 73,
                            end: 75,
                            value: 22,
                            raw: '22'
                          },
                          kind: 'init'
                        },
                        {
                          type: 'Property',
                          start: 77,
                          end: 82,
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 77,
                            end: 78,
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            start: 80,
                            end: 82,
                            value: 33,
                            raw: '33'
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 87,
              end: 89,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f({ fn = function () {}, xFn = function x() {} } = {}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 73,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 73,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 18,
                end: 69,
                left: {
                  type: 'ObjectPattern',
                  start: 18,
                  end: 64,
                  properties: [
                    {
                      type: 'Property',
                      start: 20,
                      end: 39,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 20,
                        end: 22,
                        name: 'fn'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 20,
                        end: 39,
                        left: {
                          type: 'Identifier',
                          start: 20,
                          end: 22,
                          name: 'fn'
                        },
                        right: {
                          type: 'FunctionExpression',
                          start: 25,
                          end: 39,
                          id: null,
                          generator: false,
                          async: false,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 37,
                            end: 39,
                            body: []
                          }
                        }
                      }
                    },
                    {
                      type: 'Property',
                      start: 41,
                      end: 62,
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 41,
                        end: 44,
                        name: 'xFn'
                      },
                      kind: 'init',
                      value: {
                        type: 'AssignmentPattern',
                        start: 41,
                        end: 62,
                        left: {
                          type: 'Identifier',
                          start: 41,
                          end: 44,
                          name: 'xFn'
                        },
                        right: {
                          type: 'FunctionExpression',
                          start: 47,
                          end: 62,
                          id: {
                            type: 'Identifier',
                            start: 56,
                            end: 57,
                            name: 'x'
                          },
                          generator: false,
                          async: false,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 60,
                            end: 62,
                            body: []
                          }
                        }
                      }
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  start: 67,
                  end: 69,
                  properties: []
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 71,
              end: 73,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f({ x: y = 33 } = { }) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 41,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 41,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 18,
                end: 37,
                left: {
                  type: 'ObjectPattern',
                  start: 18,
                  end: 31,
                  properties: [
                    {
                      type: 'Property',
                      start: 20,
                      end: 29,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 20,
                        end: 21,
                        name: 'x'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        start: 23,
                        end: 29,
                        left: {
                          type: 'Identifier',
                          start: 23,
                          end: 24,
                          name: 'y'
                        },
                        right: {
                          type: 'Literal',
                          start: 27,
                          end: 29,
                          value: 33
                        }
                      },
                      kind: 'init'
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  start: 34,
                  end: 37,
                  properties: []
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 39,
              end: 41,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f({ x: y }) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    method: false,
                    shorthand: false
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'async function* f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 63,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 63,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ObjectPattern',
                start: 18,
                end: 59,
                properties: [
                  {
                    type: 'Property',
                    start: 20,
                    end: 57,
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 20,
                      end: 21,
                      name: 'w'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 23,
                      end: 57,
                      left: {
                        type: 'ObjectPattern',
                        start: 23,
                        end: 34,
                        properties: [
                          {
                            type: 'Property',
                            start: 25,
                            end: 26,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 25,
                              end: 26,
                              name: 'x'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 25,
                              end: 26,
                              name: 'x'
                            }
                          },
                          {
                            type: 'Property',
                            start: 28,
                            end: 29,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 28,
                              end: 29,
                              name: 'y'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 28,
                              end: 29,
                              name: 'y'
                            }
                          },
                          {
                            type: 'Property',
                            start: 31,
                            end: 32,
                            method: false,
                            shorthand: true,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 31,
                              end: 32,
                              name: 'z'
                            },
                            kind: 'init',
                            value: {
                              type: 'Identifier',
                              start: 31,
                              end: 32,
                              name: 'z'
                            }
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        start: 37,
                        end: 57,
                        properties: [
                          {
                            type: 'Property',
                            start: 39,
                            end: 43,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 39,
                              end: 40,
                              name: 'x'
                            },
                            value: {
                              type: 'Literal',
                              start: 42,
                              end: 43,
                              value: 4,
                              raw: '4'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 45,
                            end: 49,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 45,
                              end: 46,
                              name: 'y'
                            },
                            value: {
                              type: 'Literal',
                              start: 48,
                              end: 49,
                              value: 5,
                              raw: '5'
                            },
                            kind: 'init'
                          },
                          {
                            type: 'Property',
                            start: 51,
                            end: 55,
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 51,
                              end: 52,
                              name: 'z'
                            },
                            value: {
                              type: 'Literal',
                              start: 54,
                              end: 55,
                              value: 6,
                              raw: '6'
                            },
                            kind: 'init'
                          }
                        ]
                      }
                    },
                    kind: 'init'
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 61,
              end: 63,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f({...x}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 28,
            id: {
              type: 'Identifier',
              start: 16,
              end: 17,
              name: 'f'
            },
            generator: true,
            async: true,
            params: [
              {
                type: 'ObjectPattern',
                start: 18,
                end: 24,
                properties: [
                  {
                    type: 'RestElement',
                    start: 19,
                    end: 23,
                    argument: {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
                      name: 'x'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 26,
              end: 28,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* f({a, b, ...rest}) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'rest'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
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
      'async function* f() { await a; yield b; }',
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
                    type: 'AwaitExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    delegate: false
                  }
                }
              ]
            },
            async: true,
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
      'f = async function*() { await a; yield b; }',
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
                    },
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'YieldExpression',
                        argument: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        delegate: false
                      }
                    }
                  ]
                },
                async: true,
                generator: true,

                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'obj = { async* f() { await a; yield b; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 42,
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 42,
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 3,
                name: 'obj'
              },
              right: {
                type: 'ObjectExpression',
                start: 6,
                end: 42,
                properties: [
                  {
                    type: 'Property',
                    start: 8,
                    end: 40,
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      name: 'f'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 16,
                      end: 40,
                      id: null,
                      generator: true,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 19,
                        end: 40,
                        body: [
                          {
                            type: 'ExpressionStatement',
                            start: 21,
                            end: 29,
                            expression: {
                              type: 'AwaitExpression',
                              start: 21,
                              end: 28,
                              argument: {
                                type: 'Identifier',
                                start: 27,
                                end: 28,
                                name: 'a'
                              }
                            }
                          },
                          {
                            type: 'ExpressionStatement',
                            start: 30,
                            end: 38,
                            expression: {
                              type: 'YieldExpression',
                              start: 30,
                              end: 37,
                              delegate: false,
                              argument: {
                                type: 'Identifier',
                                start: 36,
                                end: 37,
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
        sourceType: 'script'
      }
    ],
    [
      'class A { async* f() { await a; yield b; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 44,
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 44,
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 42,
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 17,
                    end: 18,
                    name: 'f'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 18,
                    end: 42,
                    id: null,
                    generator: true,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 21,
                      end: 42,
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 23,
                          end: 31,
                          expression: {
                            type: 'AwaitExpression',
                            start: 23,
                            end: 30,
                            argument: {
                              type: 'Identifier',
                              start: 29,
                              end: 30,
                              name: 'a'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 32,
                          end: 40,
                          expression: {
                            type: 'YieldExpression',
                            start: 32,
                            end: 39,
                            delegate: false,
                            argument: {
                              type: 'Identifier',
                              start: 38,
                              end: 39,
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
        ],
        sourceType: 'script'
      }
    ],
    [
      'class A { static async* f() { await a; yield b; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 51,
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 51,
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 51,
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 49,
                  kind: 'method',
                  static: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 24,
                    end: 25,
                    name: 'f'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 25,
                    end: 49,
                    id: null,
                    generator: true,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 28,
                      end: 49,
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 30,
                          end: 38,
                          expression: {
                            type: 'AwaitExpression',
                            start: 30,
                            end: 37,
                            argument: {
                              type: 'Identifier',
                              start: 36,
                              end: 37,
                              name: 'a'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 39,
                          end: 47,
                          expression: {
                            type: 'YieldExpression',
                            start: 39,
                            end: 46,
                            delegate: false,
                            argument: {
                              type: 'Identifier',
                              start: 45,
                              end: 46,
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
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function* x() {}',
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
            generator: true,

            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '(async function*() {})',
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
              generator: true,

              id: null
            }
          }
        ]
      }
    ],
    [
      'var gen = { async *method() {} }',
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
                        type: 'Identifier',
                        name: 'method'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: true,
                        generator: true,
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
                  name: 'gen'
                }
              }
            ]
          }
        ]
      }
    ]
  ]);
});
