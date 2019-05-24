import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';
describe('Expressions - Rest', () => {
  for (const arg of [
    'let { ...x = y } = z;',
    'let { a, ...b, c } = x;',
    'let {...obj1,...obj2} = foo',
    'let {...obj1,a} = foo',
    'let {...(obj)} = foo',
    '({...(a,b)}) => {}',
    'let {...obj1,} = foo',
    'let {...(a,b)} = foo',
    '({...x = 1} = {})',
    'var {...x = 1} = {}',
    'function test({...x = 1}) {}',
    '({...[]} = {})',
    '({...{}} = {})',
    '({...(obj)}) => {}',
    '({...(a,b)}) => {}',
    '({...[a,b]} = foo)',
    '({...{a,b}} = foo)',
    '({...(a,b)} = foo)',
    'let {...(a,b)} = foo',
    'let {...(obj)} = foo',
    'let {...obj1,...obj2} = foo',
    'let {...obj1,a} = foo',
    'let {...obj1,} = foo',
    'let { ...x = y } = z;',
    'let { a, ...b, c } = x;',
    // Object rest element needs to be the last AssignmenProperty in ObjectAssignmentPattern.
    '{...rest, b}',
    'function test({...[]}) {}',
    'var {...[]} = {}',
    'function test({...{a}}) {}',
    // Babylon PR: https://github.com/babel/babylon/issues/667
    ' ( {...{}} = {} ) ',
    // Babylon issue: https://github.com/babel/babylon/issues/661
    'let {...{}} = {};',
    '({...[a,b]}) => {}',
    '({...obj1,a} = foo)',
    '({...obj1,} = foo)',
    'let {...[a,b]} = foo',
    'let {...{a,b}} = foo'
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

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '({...obj} = foo)',
    '({a,...obj} = foo)',
    '({a:b,...obj} = foo)',
    '({...obj}) => {}',
    '({...obj} = {}) => {}',
    '({a,...obj}) => {}',
    '({a:b,...obj}) => {}',
    '({...rest})',
    'let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };',
    'let { ...x } = y;',
    '({a, b, ...{c, e}})',
    '({ x, ...{y , z} })',
    'function f({ x, y, ...z }) {}',
    '({...(obj)} = foo)'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['function f(a, ...b, c) {}']) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'function empty(...{}) {}',
    'function emptyWithArray(...{p: []}) {}',
    'function emptyWithObject(...{p: {}}) {}',
    'function emptyWithLeading(x, ...{}) {}',
    'function singleElement(...{a: b}) {}',
    'function singleElementWithInitializer(...{a: b = 0}) {}',
    'function singleElementWithArray(...{p: [a]}) {}',
    'function singleElementWithObject(...{p: {a: b}}) {}',
    'function singleElementWithLeading(x, ...{a: b}) {}',
    'function multiElement(...{a: r, b: s, c: t}) {}',
    'function multiElementWithInitializer(...{a: r = 0, b: s, c: t = 1}) {}',
    'function multiElementWithArray(...{p: [a], b, q: [c]}) {}',
    'function multiElementWithObject(...{a: {p: q}, b: {r}, c: {s = 0}}) {}',
    'function multiElementWithLeading(x, y, ...{a: r, b: s, c: t}) {}',
    'function empty(...[]) {}',
    'function emptyWithArray(...[[]]) {}',
    'function emptyWithObject(...[{}]) {}',
    'function emptyWithRest(...[...[]]) {}',
    'function emptyWithLeading(x, ...[]) {}',
    'function singleElement(...[a]) {}',
    'function singleElementWithInitializer(...[a = 0]) {}',
    'function singleElementWithArray(...[[a]]) {}',
    'function singleElementWithObject(...[{p: q}]) {}',
    'function singleElementWithRest(...[...a]) {}',
    'function singleElementWithLeading(x, ...[a]) {}',
    'function multiElement(...[a, b, c]) {}',
    'function multiElementWithInitializer(...[a = 0, b, c = 1]) {}',
    'function multiElementWithArray(...[[a], b, [c]]) {}',
    'function multiElementWithObject(...[{p: q}, {r}, {s = 0}]) {}',
    'function multiElementWithRest(...[a, b, ...c]) {}',
    'function multiElementWithLeading(x, y, ...[a, b, c]) {}',
    'function af(...a) {}',
    'function bf(a, ...b) {}'
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

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
  }

  fail('Expressions - Rest (fail)', [
    ['function foo(...[a], ...b) {}', Context.None],
    ['function foo(...a, ...[b]) {}', Context.None],
    ['function foo(a, ...b, c) => {}', Context.None],
    ['function foo(a, ...[b], c) => {}', Context.None],
    ['var obj = class { method(a, b = 1, ...c = [2,3]) {} };', Context.None],
    ['function f(a, ...b) { "use strict"; }', Context.None],
    ['function f(a, ...[b]) { "use strict"; }', Context.None],
    ['var x = { set setter(...[x]) {} }', Context.None],
    ['var x = class { set setter(...x) {} }', Context.None],
    ['var x = class { set setter(...[x]) {} }', Context.None],
    ['(a = ...NaN, b = [...[1,2,3]], ...rest) => {};', Context.None],
    ['(a = (...NaN), ...b = [...[1,2,3]], rest) => {};', Context.None],
    ['(a = [...NaN], ...b = [...[1,2,3]], rest) => {};', Context.None],
    ['(a, ...b, ...rest) => {};', Context.None],
    ['(...rest = ...NaN) => {};', Context.None],
    ['[...x,] = [1,2,3];', Context.None],
    ['[...x, y] = [1,2,3];', Context.None],
    ['function foo(...[a],) {}', Context.None]
  ]);

  pass('Expressions - Rest (pass)', [
    [
      'var obj = { method(a, b, c, ...[d]) { return [a, b, c, d]; } };',
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
                            type: 'Identifier',
                            name: 'c'
                          },
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'ArrayPattern',
                              elements: [
                                {
                                  type: 'Identifier',
                                  name: 'd'
                                }
                              ]
                            }
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'Identifier',
                                    name: 'a'
                                  },
                                  {
                                    type: 'Identifier',
                                    name: 'b'
                                  },
                                  {
                                    type: 'Identifier',
                                    name: 'c'
                                  },
                                  {
                                    type: 'Identifier',
                                    name: 'd'
                                  }
                                ]
                              }
                            }
                          ]
                        },
                        async: false,
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
                  name: 'obj'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      "function objRest(...{'0': a, '1': b, length}) { return [a, b, length]; }",
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'RestElement',
                argument: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Literal',
                        value: '0'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Literal',
                        value: '1'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'length'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'length'
                      },
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        name: 'length'
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
              name: 'objRest'
            }
          }
        ]
      }
    ],
    [
      'function singleRest(...[d]) { return d; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'RestElement',
                argument: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'Identifier',
                    name: 'd'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'singleRest'
            }
          }
        ]
      }
    ],
    [
      'function foo(a, b, c, ...[d]) { arguments; return [a, b, c, d]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
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
                type: 'Identifier',
                name: 'c'
              },
              {
                type: 'RestElement',
                argument: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'd'
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'arguments'
                  }
                },
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        name: 'c'
                      },
                      {
                        type: 'Identifier',
                        name: 'd'
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
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'class restClass { method(a, b, c, ...[d]) { arguments; return [a, b, c, d]; } };',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'restClass'
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
                    name: 'method'
                  },
                  value: {
                    type: 'FunctionExpression',
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
                        type: 'Identifier',
                        name: 'c'
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'd'
                            }
                          ]
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'Identifier',
                            name: 'arguments'
                          }
                        },
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrayExpression',
                            elements: [
                              {
                                type: 'Identifier',
                                name: 'a'
                              },
                              {
                                type: 'Identifier',
                                name: 'b'
                              },
                              {
                                type: 'Identifier',
                                name: 'c'
                              },
                              {
                                type: 'Identifier',
                                name: 'd'
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          },
          {
            type: 'EmptyStatement'
          }
        ]
      }
    ],
    [
      'function fooInline(a, b, c, ...rest) { arguments; this; return [a, b, c, ...rest]; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
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
                type: 'Identifier',
                name: 'c'
              },
              {
                type: 'RestElement',
                argument: {
                  type: 'Identifier',
                  name: 'rest'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'Identifier',
                    name: 'arguments'
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'ThisExpression'
                  }
                },
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        name: 'c'
                      },
                      {
                        type: 'SpreadElement',
                        argument: {
                          type: 'Identifier',
                          name: 'rest'
                        }
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
              name: 'fooInline'
            }
          }
        ]
      }
    ],
    [
      'var func5 = function (...[argArr13]) { function foo() { eval(); } };',
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
                  type: 'FunctionExpression',
                  params: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'argArr13'
                          }
                        ]
                      }
                    }
                  ],
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
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'Identifier',
                                  name: 'eval'
                                },
                                arguments: []
                              }
                            }
                          ]
                        },
                        async: false,
                        generator: false,

                        id: {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,

                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'func5'
                }
              }
            ]
          }
        ]
      }
    ]
  ]);
});
