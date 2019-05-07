import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

describe('Expressions - Call', () => {
  // This fails on Acorn, Esprima and Babylon
  for (const arg of [
    'async(a)(b)async',
    '(a)(( async () => {}) => {})',
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #1
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #2
    'async(async() () => {})(async() () => {})(async() () => {})(async() () => {})(async() () => {})' // crazy #3
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  const invalidSpreadCall = ['(...[1, 2, 3])', '......[1,2,3]'];

  for (const arg of invalidSpreadCall) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `a()(a)`,
    `async()()`,
    `async(a)()`,
    `async()(b)`,
    `async(a)(b)`,
    '...([1, 2, 3])',
    "...'123', ...'456'",
    '...new Set([1, 2, 3]), 4',
    '1, ...[2, 3], 4',
    '...Array(...[1,2,3,4])',
    '...NaN',
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89'",
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89', 10",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9, ...[10]"
  ]) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a().b',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'g(a);',
    'h(a, b);',
    'i(a, b, ...c);',
    'j(...a);',
    'a.k();',
    '(a + b).l();',
    'a.m().n();',
    'new A();',
    'new A(a);',
    'new a.B();',
    'new a.b.C();',
    'new (a().B)();',
    'new new A()();',
    'new (A, B)();',
    'a.b( c() ).d.e((a)).f.g',
    'a.b( c() ).d.e((a = 123)).f.g',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({...{b: 2}, a: 3}));',
    "(function(obj) {}({...{a: 2, b: 3, c: 4, e: undefined, f: null, g: false}, a: 1, b: 7, d: 5, h: -0, i: Symbol('foo'), j: {a: 2, b: 3, c: 4, e: undefined, f: null, g: false}}));",
    '(function(obj) {}({...undefined}));',
    '(function(obj) {}(...target = [2, 3, 4]));',
    `a(String, 2).v(123).length;`,
    `a(b,c).abc(1).def`,
    `a(b,c).abc(1)`,
    `a(b,c).abc`,
    `a(b,c)`,
    `foo(bar, baz)`,
    `(    foo  )()`,
    `f(...a)`,
    `f(...a, ...b)`,
    `f(...a, ...b)`,
    'f();'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Call (pass)', [
    ['a.b( c() ).d.e().().f.g.();', Context.None],
    ['a.b( c() ).d.e(()).f.g', Context.None],
    ['foo({a=1})', Context.None],
    ['foo({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['async({a=1})', Context.None],
    ['async({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({a=1})', Context.None],
    ['yield({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({c=3} = {})', Context.Strict],
    ['yield({a})', Context.Strict]
  ]);

  pass('Expressions - Call (pass)', [
    [
      'async(x,) => x',
      Context.None,
      {
        body: [
          {
            expression: {
              async: true,
              body: {
                name: 'x',
                type: 'Identifier'
              },
              expression: true,
              generator: false,
              id: null,
              params: [
                {
                  name: 'x',
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
      'async(x,)',
      Context.None,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'x',
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
      'foo({c=3} = {})',
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
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'c'
                          },
                          right: {
                            type: 'Literal',
                            value: 3
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async({c=3} = {})',
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
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'c'
                          },
                          right: {
                            type: 'Literal',
                            value: 3
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async({a})',
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
            }
          }
        ]
      }
    ],
    [
      'foo(x=1,y=x,x+y)',
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
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  operator: '+'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(x,x=1);',
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
                  name: 'x'
                },
                {
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo()(1, 2, 3, ...{})',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: []
              },
              arguments: [
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
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
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
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'obj'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,
                expression: false,
                id: null
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
                        type: 'Literal',
                        value: 1
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
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        value: 2
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'c'
                            },
                            value: {
                              type: 'Literal',
                              value: 3
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
                              name: 'd'
                            },
                            value: {
                              type: 'Literal',
                              value: 4
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
              ]
            }
          }
        ]
      }
    ],
    [
      'a.b( c() ).d.e;',
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
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
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
                  arguments: [
                    {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      arguments: []
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ]
      }
    ],
    [
      'i(a, b, ...c);',
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
                name: 'i'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function(obj) {}({a: 1, b: 2, ...null}));',
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
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'Identifier',
                    name: 'obj'
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,
                expression: false,
                id: null
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
                        type: 'Literal',
                        value: 1
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
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        value: 2
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'Literal',
                        value: null
                      }
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
      'a.replace(/ /g, "")',
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
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'replace'
                }
              },
              arguments: [
                {
                  type: 'Literal',
                  value: / /g,
                  regex: {
                    pattern: ' ',
                    flags: 'g'
                  }
                },
                {
                  type: 'Literal',
                  value: ''
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async(a)=> {}',
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
                  name: 'a'
                }
              ],
              id: null,
              async: true,
              generator: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'call(await[1])',
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
                name: 'call'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'await'
                  },
                  computed: true,
                  property: {
                    type: 'Literal',
                    value: 1
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)',
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
                  name: 'a'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)(b)',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
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
      'foo(a, b, c)',
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
                  name: 'a'
                },
                {
                  type: 'Identifier',
                  name: 'b'
                },
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)(b)',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
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
      'async(a)(b)',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
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
      'async(a)(s)(y)(n)(c)',
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
                type: 'CallExpression',
                callee: {
                  type: 'CallExpression',
                  callee: {
                    type: 'CallExpression',
                    callee: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ]
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 's'
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'y'
                    }
                  ]
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'n'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'c'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async().a',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
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
                name: 'a'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async()()',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'async'
                },
                arguments: []
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'async(async(async(async(async(async())))))',
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
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'async'
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
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'async'
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
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Identifier',
                                    name: 'async'
                                  },
                                  arguments: []
                                }
                              ]
                            }
                          ]
                        }
                      ]
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
      'a.b( o.bar )',
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
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'o'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'a.b( o["bar"] )',
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
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'o'
                  },
                  computed: true,
                  property: {
                    type: 'Literal',
                    value: 'bar'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'a.b( foo() )',
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
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              arguments: [
                {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
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
      'a.b( c() ).d',
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
                type: 'CallExpression',
                callee: {
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
                arguments: [
                  {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    arguments: []
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'd'
              }
            }
          }
        ]
      }
    ],
    [
      'a.b( c() ).d.e',
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
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
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
                  arguments: [
                    {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      arguments: []
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'e'
              }
            }
          }
        ]
      }
    ],
    [
      'foo()(1, 2, 3)',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: []
              },
              arguments: [
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
            }
          }
        ]
      }
    ],
    [
      'foo(x,y,)',
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
                  name: 'x'
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
      'foo(200)',
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
                  type: 'Literal',
                  value: 200
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'foo(a)(b)',
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
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              arguments: [
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
      'foo(a)(b)(c)(d)(e)',
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
                type: 'CallExpression',
                callee: {
                  type: 'CallExpression',
                  callee: {
                    type: 'CallExpression',
                    callee: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ]
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ]
                  },
                  arguments: [
                    {
                      type: 'Identifier',
                      name: 'c'
                    }
                  ]
                },
                arguments: [
                  {
                    type: 'Identifier',
                    name: 'd'
                  }
                ]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'e'
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
