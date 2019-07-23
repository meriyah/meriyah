import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - New', () => {
  for (const arg of [
    'new x(1);',
    'new x;',
    'new new x;',
    'new new x.y;',
    'new (function(foo){this.foo=foo;})(1);',
    'new (function(foo){this.foo=foo;})();',
    'new (function test(foo){this.foo=foo;})(1);',
    'new (function test(foo){this.foo=foo;})();',
    'new true;',
    'new (0);',
    'new (!0);',
    'new (bar = function(foo) {this.foo=foo;})(123);',
    'new (bar = function(foo) {this.foo=foo;})();',
    'new x(1);',
    'new x();',
    'new x();',
    'new x()()()()()()();',
    'new (x()()()()()()());',
    'new new x()();',
    'new function(foo) {\n    this.foo = foo;\n}(1);',
    'new function(foo) {\n    this.foo = foo;\n}();',
    'new function test(foo) {\n    this.foo = foo;\n}(1);',
    'new function test(foo) {\n    this.foo = foo;\n}();',
    'new true();',
    'new async()()',
    'new a()().b.c[d];',
    'new async()().b.c[d];',
    'new (a()().b.c[d]);',
    'new (b());',
    'new (async(await));',
    'new async / b',
    'new async / await',
    'new async / await()',
    'new async / await(async = foo)',
    'new async / await(async,)',
    'new async / await(foo, async)',
    'new async / await("foo", async)',
    'new async / await(123, async)',
    'new async / await(foo, async)',
    'new 0();',
    'new (!0)();',
    'new (bar = function(foo) {\n    this.foo = foo;\n})(123);',
    'new (bar = function(foo) {\n    this.foo = foo;\n})();'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }
  fail('Expressions - New (fail)', [
    ['function f(){ new.foo }', Context.None],
    ['new.target', Context.None],
    ['_ => new.target', Context.None],
    ['function f(){ ++new.target }', Context.None],
    ['function f(){ new.target-- }', Context.None],
    ['(f=new.target) => {}', Context.None],
    ['new x() = y', Context.None],
    ['new a.b.c.(d).e.f.g[(b)]();', Context.None],
    ['new a.async.c.(d).e.f.g[(async)]();', Context.None],
    ['new async = async.await', Context.None],
    ['++new x()', Context.None],
    ['new x()++', Context.None],
    ['new new .target', Context.None],
    ['new typeof x', Context.None],
    ['new typeof x.y', Context.None],
    ['new typeof x().y', Context.None],
    ['new ++x', Context.None],
    ['new ++x.y', Context.None],
    ['new ++x().y', Context.None],
    ['new ()=>{}', Context.None],
    ['new x=>{}', Context.None],
    ['new (x)=>{}', Context.None],
    ['new a = b', Context.None],
    ['function *f(){ new yield }', Context.None],
    ['"use strict"; new yield()', Context.None],
    ['function *f(){ new yield }', Context.None],
    ['function *f(){ new yield x }', Context.None],
    ['function *f(){ new yield x(); }', Context.None],
    ['new x++', Context.None],
    ['new x.y++', Context.None],
    [
      `function f() {
      new.target++;
      new.target = b;
      for (new.target in b);
      for (new.target of b);
    }`,
      Context.None
    ],
    ['new async x => x', Context.None],
    ['new async => x', Context.None],
    ['let x = typeof async (x) => x', Context.None],
    ['let x = [typeof async \n (x) => x]', Context.None],
    ['let x = [typeof async (x) \n => x]', Context.None],
    ['let x = [delete async \n (x) => x]', Context.None],
    ['let x = [delete async (x) \n => x]', Context.None],
    ['new x\n/y/', Context.None],
    ['let x = new async \n (x) => x', Context.None],
    ['let x = new async (x) \n => x', Context.None],
    ['typeof async () => x', Context.None],
    ['typeof async \n () => x', Context.None],
    ['typeof async () \n => x', Context.None],
    ['let x = typeof async \n (x) => x', Context.None],
    ['let x = typeof async (x) \n => x', Context.None],
    ['delete async () => x', Context.None],
    ['delete async \n () => x', Context.None],
    ['delete async () \n => x', Context.None],
    ['new ++x.y', Context.None],
    ['let x = delete async \n (x) => x', Context.None],
    ['let x = delete async (x) \n => x', Context.None],
    ['async () => new await x', Context.None],
    ['async () => new await x()', Context.None],
    ['async () => new await x()()', Context.None],
    ['async function f(){ new await foo }', Context.None],
    ['new class', Context.None],
    ['new class extends{}', Context.None],
    ['new delete', Context.None],
    ['new function', Context.None],
    ['new function()', Context.None],
    ['new new', Context.None],
    ['new super', Context.None],
    ['class x { constructor() { new super }}', Context.None],
    ['class x extends y { constructor() { new super }}', Context.None],
    ['new typeof', Context.None],
    ['new typeof x', Context.None],
    ['new typeof x()', Context.None],
    ['new void', Context.None],
    ['new void x', Context.None],
    ['delete () => foo', Context.None],
    ['delete async() => foo', Context.None],
    ['function f(){ new.foo }', Context.None],
    ['new.target', Context.None],
    ['_ => _ => _ => _ => new.target', Context.None],
    ['function f(){ ++new.target }', Context.None],
    ['function f(){ new.target-- }', Context.None],
    ['new x(await foo);', Context.None],
    ['new (await foo);', Context.None],
    ['new await foo;', Context.None],
    ['new x(await foo);', Context.None],
    ['new x(await foo);', Context.None],
    ['new x(await foo);', Context.None],
    ['new.target[await x]', Context.None],
    ['new await x()()', Context.None],
    ['new await x()', Context.None],
    ['new await x', Context.None]
  ]);

  pass('Expressions - New (pass)', [
    [
      'new await()()',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'await'
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
      'new foo()();',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'foo'
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
      'new (foo)();',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new (foo);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new a ? b : c',
      Context.None,
      {
        body: [
          {
            expression: {
              alternate: {
                name: 'c',
                type: 'Identifier'
              },
              consequent: {
                name: 'b',
                type: 'Identifier'
              },
              test: {
                arguments: [],
                callee: {
                  name: 'a',
                  type: 'Identifier'
                },
                type: 'NewExpression'
              },
              type: 'ConditionalExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'new Foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new a.b.c.d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
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
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'c'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new async(x)(y)',
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
                type: 'NewExpression',
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
              arguments: [
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
      'new Foo["bar"]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"]()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo(X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar(X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"](X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo(X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar(X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"](X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new x().y',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'new x()[y]',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              computed: true,
              property: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'new x()();',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              arguments: []
            }
          }
        ]
      }
    ],
    //['new x()`y`', Context.None,  {}],
    [
      'new a.b.c.d()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
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
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'c'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'd'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"]()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new Foo(X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar(X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"](X)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo(X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'Foo'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo.Bar(X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'Bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new Foo["bar"](X, Y, Z)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'Foo'
                },
                computed: true,
                property: {
                  type: 'Literal',
                  value: 'bar'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'X'
                },
                {
                  type: 'Identifier',
                  name: 'Y'
                },
                {
                  type: 'Identifier',
                  name: 'Z'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new x().y',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'new x()[y]',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              computed: true,
              property: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'new x()();',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
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
      'new x().y = z',
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
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      'new x().y + z',
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
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'new x()[y] = z',
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
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      'new x()[y] + z',
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
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      '++new x().y',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
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
      'new x().y++',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
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
      'delete new x()',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
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
      'delete new x().y',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
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
      'typeof new x()',
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
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
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
      'new new A().foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'A'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new new A.foo()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'NewExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'A'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'foo'
                  }
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
      'new "foo".__proto__.constructor',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 'foo'
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
                  name: 'constructor'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new 1..__proto__.constructor',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 1
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
                  name: 'constructor'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new 0x2.__proto__.constructor',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: 2
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
                  name: 'constructor'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new true.__proto__.constructor',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
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
                  name: 'constructor'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'typeof new x().y',
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
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  arguments: []
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
      'new new x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
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
      '[...new A()]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'NewExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'A'
                    },
                    arguments: []
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends new A() {}',
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
            superClass: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'A'
              },
              arguments: []
            },
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      'x({[new A()]:y})',
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
                name: 'x'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'NewExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'A'
                        },
                        arguments: []
                      },
                      value: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      kind: 'init',
                      computed: true,
                      method: false,
                      shorthand: false
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
      'f(new /z/())',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'Literal',
                    value: /z/,
                    regex: {
                      pattern: 'z',
                      flags: ''
                    }
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
      'f(new /z/)',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'Literal',
                    value: /z/,
                    regex: {
                      pattern: 'z',
                      flags: ''
                    }
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
      'f(new /z/.foo)',
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
                  type: 'NewExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: /z/,
                      regex: {
                        pattern: 'z',
                        flags: ''
                      }
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'foo'
                    }
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
      'new arguments',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'arguments'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new async',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new async (x, y)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'new async (...x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'async'
              },
              arguments: [
                {
                  type: 'SpreadElement',
                  argument: {
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
      'new async function(){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
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
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'typeof async',
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
                name: 'async'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof async ()',
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
                arguments: []
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'typeof async function(){}',
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
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'new await',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'await'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new class{}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'ClassExpression',
                id: null,
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: []
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new class extends x{}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'ClassExpression',
                id: null,
                superClass: {
                  type: 'Identifier',
                  name: 'x'
                },
                body: {
                  type: 'ClassBody',
                  body: []
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'class x extends (x) {}',
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
            superClass: {
              type: 'Identifier',
              name: 'x'
            },
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      'new eval()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'eval'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new false.__proto__.constructor',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Literal',
                    value: false
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
                  name: 'constructor'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new function(){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
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
    [
      'new function(){}(x)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
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
              arguments: [
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
      'class x extends y { constructor() { new super.foo }}',
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
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
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
                            type: 'NewExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            arguments: []
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
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { new super() }}',
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
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
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
                            type: 'NewExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
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
          }
        ]
      }
    ],
    [
      'new this',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'ThisExpression'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'new let',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NewExpression',
              callee: {
                type: 'Identifier',
                name: 'let'
              },
              arguments: []
            }
          }
        ]
      }
    ]
  ]);
});
