import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Async Generator', () => {
  for (const arg of [
    '(async function *foo() { var await; });',
    '(async function *foo() { void await; });',
    '(async function *foo() { await: ; });',
    '(async function *foo(x = 1) {"use strict"})',
    '(async function *foo(foo) { super() })',
    '(async function *foo(foo) { super.prop });',
    '(async function *foo(foo = super()) { var bar; });',
    '(async function*([...x, y]) {})',
    '(async function*([...x, y] = [1, 2, 3]) {})',
    '(async function* h([...{ x } = []]) {})',
    '(async function* h([...{ x } = []] = []) {})',
    '(async function*(x = await 1) { });',
    '(async function*() { await: 1; });',
    '(async function *foo(...a,) {})',
    '(async function *foo([...[ x ] = []])',
    '(async function *foo([...{ x } = []]) {})',
    '(async function *foo([...{ x } = []] = []) {})',
    '(async function *foo([...x, y]) {})',
    '(async function *foo([...x = []] = []) {})',
    '(async function *foo(...a,) {})',
    '(async function *foo([...[x], y] = [1, 2, 3]) {})',
    '(async function *foo([...{ x }, y] = [1, 2, 3])',
    '(async function *foo([...{ x }, y])',
    '(async function *foo([...{ x } = []] = [])',
    '(async function *foo([...{ x } = []])'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '(async function *foo() { }.prototype)',
    '(async function *foo(x, y = x, z = y) { })',
    '(async function *foo(x = y, y) { })',
    '(async function *foo(a, b = 39,) { })',
    '(async function *foo(a, b,) { })',
    '(async function *foo(_ = (function() {}())) { })',
    '(async function *([x = 23]) { })',
    '(async function *([{ x }]) { })',
    '(async function *(x = x) { })',
    '(async function*([...[...x]]) { })',
    '(async function *foo([...x] = 123) { })',
    '(async function *foo({ cls = class {}, xCls = class X {}, xCls2 = class { static name() {} } } = {}) {})',
    '(async function*({ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }) { })',
    '(async function*({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) { })',
    '(async function* h([[,] = g()]) { })',
    '(async function* g([[x]]) { })',
    '(async function* h([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) { })',
    '(async function* h([fn = function () {}, xFn = function x() {}]) { })',
    '(async function* h([{ x, y, z } = { x: 44, y: 55, z: 66 }]) { })',
    '(async function* h([]) { })',
    '(async function* h([...[,]]) { })',
    '(async function* g([...x]) { })',
    '(async function* h([fn = function () {}, xFn = function x() {}] = []) { })',
    '(async function* h([x] = []) { })',
    '(async function* h({} = null) { })',
    'var gen = async function *() { yield [...yield]; };',
    '(async function* h({a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3}) { })',
    '(async function* h({ x, }) { })',
    '(async function* h({ w: [x, y, z] = [4, 5, 6] }) { })',
    '(async function*({}) { })',
    '(async function*({ x, }) { })',
    '(async function*({ x: y = 33 }) { })',
    `var gen = async function *g() {
      yield [...yield];
    };`,
    `var gen = async function *() {
      yield {
           ...yield yield,
           ...(function(arg) {
              var yield = arg;
              return {...yield};
           }(yield)),
           ...yield,
        }
    };`,
    `var gen = async function *g() {
      return (function(arg) {
          var yield = arg + 1;
          return yield;
        }(yield))
    };
    `
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`, undefined, Context.OptionsNext);
      });
    });
  }
  fail('Expressions - Async Generator (pass)', [
    ['(async function*(a = super()) { });', Context.None],
    ['0, async function* g(...a,) {};', Context.None],
    ['(async function* yield() { });', Context.None],
    ['(async function* g() { var await; });', Context.None],
    [
      `"use strict";
    async function *g() {
    return {
         ...(function() {
            var yield;
         }()),
      }
  };`,
      Context.None
    ],
    ['(async function* g() { var yield; });', Context.None],
    ['(async function*(a = super()) { });', Context.None],
    ['(async function*() { } = 1);', Context.None],
    ['(async function *() { var await; })', Context.None],
    ['(async function*([...x, y] = [1, 2, 3]) {})', Context.None],
    ['(async function* h([...{ x } = []]) {})', Context.None],
    ['(async.foo6 => 1)', Context.None],
    ['(async function* h([...{ x } = []] = []) {})', Context.None],
    ['(async function*(x = await 1) { });', Context.None],
    ['(async function*() { await: 1; });', Context.None],
    ['(async function *foo(...a,) {})', Context.None],
    ['(async function *foo([...[ x ] = []])', Context.None],
    ['(async function *foo([...{ x } = []]) {})', Context.None],
    ['(async function *foo([...{ x } = []] = []) {})', Context.None],
    ['(async function *foo([...x, y]) {})', Context.None],
    ['(async function *foo([...x = []] = []) {})', Context.None],
    ['(async function *foo(...a,) {})', Context.None],
    ['(async function *foo([...[x], y] = [1, 2, 3]) {})', Context.None],
    ['(async function *foo([...{ x }, y] = [1, 2, 3])', Context.None],
    ['(async function *foo([...{ x }, y])', Context.None],
    ['(async function *foo([...{ x } = []] = [])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function* yield() { });', Context.None],
    ['(async function* g() { var await; });', Context.None],
    ['(async function* g() { void await; });', Context.Module | Context.Strict],
    ['(async function* g() { void yield; });', Context.None],
    ['0, async function* g(...x = []) {}', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None],
    ['(async function *foo([...{ x } = []])', Context.None]
  ]);

  pass('Expressions - Async Generator (pass)', [
    [
      '(async function* h([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) { })',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'cls'
                      },
                      right: {
                        type: 'ClassExpression',
                        id: null,
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: []
                        }
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'xCls'
                      },
                      right: {
                        type: 'ClassExpression',
                        id: {
                          type: 'Identifier',
                          name: 'X'
                        },
                        superClass: null,
                        body: {
                          type: 'ClassBody',
                          body: []
                        }
                      }
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'xCls2'
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
                              static: true,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                name: 'name'
                              },
                              value: {
                                type: 'FunctionExpression',
                                params: [],
                                body: {
                                  type: 'BlockStatement',
                                  body: []
                                },
                                async: false,
                                generator: false,
                                id: null
                              }
                            }
                          ]
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

              id: {
                type: 'Identifier',
                name: 'h'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function* h([fn = function () {}, xFn = function x() {}] = []) { })',
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

                          id: {
                            type: 'Identifier',
                            name: 'x'
                          }
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
                name: 'h'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function* h([{ x, y, z } = { x: 44, y: 55, z: 66 }]) { })',
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

              id: {
                type: 'Identifier',
                name: 'h'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function *([{ x }]) { })',
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

              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function*({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) { })',
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
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'w'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'undefined'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
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

              id: null
            }
          }
        ]
      }
    ],
    [
      '(async function *foo() { }.prototype)',
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
                generator: true,

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
      '(async function *foo([...x] = 123) { })',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'Literal',
                    value: 123
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '(async function *foo(x, y = x, z = y) { })',
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
                  name: 'x'
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y'
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
                name: 'foo'
              }
            }
          }
        ]
      }
    ],

    [
      '(async function* h([]) { })',
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
                  type: 'ArrayPattern',
                  elements: []
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
                name: 'h'
              }
            }
          }
        ]
      }
    ]
  ]);
});
