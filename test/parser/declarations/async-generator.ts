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
                        expression: false,
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
                      id: null,
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
      'async function* f([fn = function () {}, xFn = function x() {}]) {  }',
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
                      name: 'fn'
                    },
                    right: {
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
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'xFn'
                    },
                    right: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      expression: false,
                      id: {
                        type: 'Identifier',
                        name: 'x'
                      }
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
      'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {  }',
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
                            name: 'x'
                          },
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            value: 44
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            value: 55
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            value: 66
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
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
      'async function* f([{ x }]) {  }',
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
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
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
      'async function* f([ , , ...x]) {  }',
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
                  null,
                  null,
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
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
                        id: null,
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
      'async function* f([[x]] = [null]) {}',
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
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ]
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: null
                    }
                  ]
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
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async function* f([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
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
                              name: 'x'
                            },
                            method: false,
                            shorthand: true
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            method: false,
                            shorthand: true
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'Literal',
                              value: 44
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Literal',
                              value: 55
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            value: {
                              type: 'Literal',
                              value: 66
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
                    }
                  ]
                },
                right: {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            value: 11
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            value: 22
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            value: 33
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  ]
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
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async function* f({ fn = function () {}, xFn = function x() {} } = {}) {}',
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
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'fn'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'fn'
                        },
                        right: {
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
                        }
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'xFn'
                      },
                      computed: false,
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xFn'
                        },
                        right: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: []
                          },
                          async: false,
                          generator: false,
                          expression: false,
                          id: {
                            type: 'Identifier',
                            name: 'x'
                          }
                        }
                      },
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  properties: []
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
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async function* f({ x: y = 33 } = { }) {}',
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
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        right: {
                          type: 'Literal',
                          value: 33
                        }
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                right: {
                  type: 'ObjectExpression',
                  properties: []
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
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
      'async function* f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
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
                      name: 'w'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
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
                              name: 'x'
                            },
                            method: false,
                            shorthand: true
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            method: false,
                            shorthand: true
                          },
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            computed: false,
                            value: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      right: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'Literal',
                              value: 4
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Literal',
                              value: 5
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          },
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            value: {
                              type: 'Literal',
                              value: 6
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      }
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
      'async function* f({...x}) {}',
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
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
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
                expression: false,
                id: null
              }
            }
          }
        ]
      }
    ],
    [
      'obj = { async* f() { await a; yield b; } }',
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
                name: 'obj'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'f'
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
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'class A { async* f() { await a; yield b; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
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
                    name: 'f'
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
              ]
            }
          }
        ]
      }
    ],
    [
      'class A { static async* f() { await a; yield b; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
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
                    name: 'f'
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
              ]
            }
          }
        ]
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
            expression: false,
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
              expression: false,
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
