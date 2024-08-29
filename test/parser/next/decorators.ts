import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Decorators', () => {
  for (const arg of [
    'var foo = @dec class Bar { bam() { f(); } }',
    'class A { @dec *m(){} }',
    'class A { @a.b.c.d(e, f)     m(){}}',
    'class Bar{ @outer( @classDec class { @inner innerMethod() {} } ) outerMethod() {} }',
    `@(foo().bar) class Foo { @(member[expression]) method() {} @(foo + bar) method2() {} }`,
    `@foo('bar')
      class Foo {}`,
    `(class A { @foo get getter(){} })`,
    `class A { @foo get getter(){} }`,
    `class A { @foo set setter(bar){} }`,
    `class A { @foo async bar(){} }`, // allowed?
    '@foo class Foo {}',
    `@outer({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@({
        store: @inner class Foo {}
      })
      class Bar {
      }`,
    `@foo(@bar class Bar{})
      class Foo {}`,
    'class Foo { @foo @bar bar() {} }',
    'class Foo { @foo bar() {} }',
    'var foo = class Bar { @foo Zoo() {} }',
    `@foo('bar')
    class Foo {}`,
    `@abc class Foo {}`,
    `class A {
        @dec *m(){}
      }`,
    `(class A {
        @dec *m(){}
     })`,
    `class A {
      @a.b.c.d(e, f)
      m(){}
    }`,
    `class A { @foo async a(){} }`,
    `class Foo {
      @dec
      static bar() {}
    }`,
    `class A { accessor = 1}`,
    `class A { accessor x}`,
    `class A { accessor x = 1}`,
    `class A { @a.b accessor = 1}`,
    `class A { @dec accessor x}`,
    `class A { @dec accessor x = 1}`,
    `(class { @a.b accessor = 1})`,
    `(class { @dec accessor x})`,
    `(class { @dec accessor x = 1})`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });
  }

  fail('Next - Decorators (fail)', [
    ['class A { accessor a() {}}', Context.OptionsNext | Context.Module | Context.Strict],
    ['class A { @dec accessor a() {}}', Context.OptionsNext | Context.Module | Context.Strict],
    ['class A { accessor @dec a}', Context.OptionsNext | Context.Module | Context.Strict],
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    [`class A {  constructor(@foo x) {} }`, Context.OptionsNext | Context.Module | Context.Strict],
    //[`@decorate`, Context.OptionsNext],
    [`class A { @abc constructor(){} }`, Context.OptionsNext | Context.Module | Context.Strict],
    ['export @bar class Foo { }', Context.OptionsNext | Context.Module | Context.Strict],
    ['export default @decorator class Foo {}', Context.Module | Context.Strict],
    ['class Foo {@abc constructor(){}', Context.OptionsNext],
    ['class A { @dec }', Context.OptionsNext],
    ['class A { @dec ;}', Context.OptionsNext],
    ['var obj = { method(@foo x) {} };', Context.OptionsNext],
    ['class Foo { constructor(@foo x) {} }', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class Foo {  @a; m(){}}', Context.OptionsNext],
    ['class Foo { @abc constructor(){} }', Context.OptionsNext],
    ['class A { @foo && bar method() {}  }', Context.OptionsNext],
    ['class A { @foo && bar; method() {}  }', Context.OptionsNext],
    ['@bar export const foo = 1;', Context.OptionsNext | Context.Module],
    ['@bar export {Foo};', Context.OptionsNext | Context.Module],
    ['@bar export * from "./foo";', Context.OptionsNext | Context.Module],
    ['@bar export default function foo() {}', Context.OptionsNext | Context.Module],
    ['@bar export const lo = {a: class Foo {}};', Context.OptionsNext | Context.Module],
    ['@bar const foo = 1;', Context.OptionsNext],
    ['@bar function foo() {}', Context.OptionsNext],
    ['(@bar const foo = 1);', Context.OptionsNext],
    ['(@bar function foo() {})', Context.OptionsNext],
    ['@bar;', Context.OptionsNext],
    ['@bar();', Context.OptionsNext]
  ]);

  pass('Next - Decorators (pass)', [
    [
      `class A { @dec name = 0; }`,
      Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7,
              range: [6, 7],
              loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 7 } }
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'name',
                    start: 15,
                    end: 19,
                    range: [15, 19],
                    loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 19 } }
                  },
                  value: {
                    type: 'Literal',
                    value: 0,
                    start: 22,
                    end: 23,
                    range: [22, 23],
                    loc: { start: { line: 1, column: 22 }, end: { line: 1, column: 23 } }
                  },
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec',
                        start: 11,
                        end: 14,
                        range: [11, 14],
                        loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 14 } }
                      },
                      start: 10,
                      end: 14,
                      range: [10, 14],
                      loc: { start: { line: 1, column: 10 }, end: { line: 1, column: 14 } }
                    }
                  ],
                  start: 15,
                  end: 24,
                  range: [15, 24],
                  loc: { start: { line: 1, column: 15 }, end: { line: 1, column: 24 } }
                }
              ],
              start: 8,
              end: 26,
              range: [8, 26],
              loc: { start: { line: 1, column: 8 }, end: { line: 1, column: 26 } }
            },
            start: 0,
            end: 26,
            range: [0, 26],
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 26 } }
          }
        ],
        start: 0,
        end: 26,
        range: [0, 26],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 26 } }
      }
    ],
    [
      `class A {  @deco #prop; #foo = 2; test() {  this.#foo; }}`,
      Context.OptionsNext,
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
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'prop'
                  },
                  value: null,
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'deco'
                      }
                    }
                  ]
                },
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
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
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateIdentifier',
                              name: 'foo'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `(class A { @foo get getter(){} })`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            expression: {
              body: {
                body: [
                  {
                    computed: false,
                    decorators: [
                      {
                        expression: {
                          name: 'foo',
                          type: 'Identifier'
                        },
                        type: 'Decorator'
                      }
                    ],
                    key: {
                      name: 'getter',
                      type: 'Identifier'
                    },
                    kind: 'get',
                    static: false,
                    type: 'MethodDefinition',
                    value: {
                      async: false,
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
              decorators: [],
              id: {
                name: 'A',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `export default @id class Sample {
        method() {
          class Child {}
        }
      }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [
                  {
                    computed: false,
                    decorators: [],
                    key: {
                      name: 'method',
                      type: 'Identifier'
                    },
                    kind: 'method',
                    static: false,
                    type: 'MethodDefinition',
                    value: {
                      async: false,
                      body: {
                        body: [
                          {
                            body: {
                              body: [],
                              type: 'ClassBody'
                            },
                            decorators: [],
                            id: {
                              name: 'Child',
                              type: 'Identifier'
                            },
                            superClass: null,
                            type: 'ClassDeclaration'
                          }
                        ],
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
              decorators: [
                {
                  expression: {
                    name: 'id',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Sample',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `@bar export default
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'Foo',
                start: 36,
                end: 39,
                range: [36, 39],
                loc: { start: { line: 2, column: 16 }, end: { line: 2, column: 19 } }
              },
              superClass: null,
              decorators: [
                {
                  type: 'Decorator',
                  expression: {
                    type: 'Identifier',
                    name: 'bar',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 4 } }
                  },
                  start: 0,
                  end: 4,
                  range: [0, 4],
                  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 4 } }
                }
              ],
              body: {
                type: 'ClassBody',
                body: [],
                start: 40,
                end: 43,
                range: [40, 43],
                loc: { start: { line: 2, column: 20 }, end: { line: 2, column: 23 } }
              },
              start: 30,
              end: 43,
              range: [30, 43],
              loc: { start: { line: 2, column: 10 }, end: { line: 2, column: 23 } }
            },
            start: 5,
            end: 43,
            range: [5, 43],
            loc: { start: { line: 1, column: 5 }, end: { line: 2, column: 23 } }
          }
        ],
        start: 0,
        end: 43,
        range: [0, 43],
        loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 23 } }
      }
    ],
    [
      `export default
          @bar class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: {
              type: 'ClassDeclaration',
              id: {
                type: 'Identifier',
                name: 'Foo',
                start: 36,
                end: 39,
                range: [36, 39],
                loc: { start: { line: 2, column: 21 }, end: { line: 2, column: 24 } }
              },
              superClass: null,
              decorators: [
                {
                  type: 'Decorator',
                  expression: {
                    type: 'Identifier',
                    name: 'bar',
                    start: 26,
                    end: 29,
                    range: [26, 29],
                    loc: { start: { line: 2, column: 11 }, end: { line: 2, column: 14 } }
                  },
                  start: 25,
                  end: 29,
                  range: [25, 29],
                  loc: { start: { line: 2, column: 10 }, end: { line: 2, column: 14 } }
                }
              ],
              body: {
                type: 'ClassBody',
                body: [],
                start: 40,
                end: 43,
                range: [40, 43],
                loc: { start: { line: 2, column: 25 }, end: { line: 2, column: 28 } }
              },
              start: 30,
              end: 43,
              range: [30, 43],
              loc: { start: { line: 2, column: 15 }, end: { line: 2, column: 28 } }
            },
            start: 0,
            end: 43,
            range: [0, 43],
            loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 28 } }
          }
        ],
        start: 0,
        end: 43,
        range: [0, 43],
        loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 28 } }
      }
    ],
    [
      `export default @bar
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'bar',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Foo',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `@lo export default @bar
          class Foo { }`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'lo',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                },
                {
                  expression: {
                    name: 'bar',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Foo',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassDeclaration'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `@pushElement({
        kind: "initializer",
        placement: "own",
        initializer() {
          self = this;
        }
      })
      class A {}
      new A();`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  arguments: [
                    {
                      properties: [
                        {
                          computed: false,
                          key: {
                            name: 'kind',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          type: 'Property',
                          value: {
                            type: 'Literal',
                            value: 'initializer'
                          }
                        },
                        {
                          computed: false,
                          key: {
                            name: 'placement',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          type: 'Property',
                          value: {
                            type: 'Literal',
                            value: 'own'
                          }
                        },
                        {
                          computed: false,
                          key: {
                            name: 'initializer',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: true,
                          shorthand: false,
                          type: 'Property',
                          value: {
                            async: false,
                            body: {
                              body: [
                                {
                                  expression: {
                                    left: {
                                      name: 'self',
                                      type: 'Identifier'
                                    },
                                    operator: '=',
                                    right: {
                                      type: 'ThisExpression'
                                    },
                                    type: 'AssignmentExpression'
                                  },
                                  type: 'ExpressionStatement'
                                }
                              ],
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
                    }
                  ],
                  callee: {
                    name: 'pushElement',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          },
          {
            expression: {
              arguments: [],
              callee: {
                name: 'A',
                type: 'Identifier'
              },
              type: 'NewExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `@decorator
           class Foo {
            async f1() {}
            *f2() {}
            async *f3() {}
          }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f1',
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
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f2',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'f3',
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
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  name: 'decorator',
                  type: 'Identifier'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
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
      `export default (@decorator class Foo {})`,
      Context.OptionsNext | Context.Module | Context.Strict,
      {
        body: [
          {
            declaration: {
              body: {
                body: [],
                type: 'ClassBody'
              },
              decorators: [
                {
                  expression: {
                    name: 'decorator',
                    type: 'Identifier'
                  },
                  type: 'Decorator'
                }
              ],
              id: {
                name: 'Foo',
                type: 'Identifier'
              },
              superClass: null,
              type: 'ClassExpression'
            },
            type: 'ExportDefaultDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `class Foo {
        @A * b() {}
      }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [
                    {
                      expression: {
                        name: 'A',
                        type: 'Identifier'
                      },
                      type: 'Decorator'
                    }
                  ],
                  key: {
                    name: 'b',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Foo',
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
      `function deco() {}

      class Foo {
        @deco
        *generatorMethod() {}
      }`,
      Context.OptionsNext,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'deco',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          },
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [
                    {
                      expression: {
                        name: 'deco',
                        type: 'Identifier'
                      },
                      type: 'Decorator'
                    }
                  ],
                  key: {
                    name: 'generatorMethod',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Foo',
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
      `@deco1 @deco2() @deco3(foo, bar) @deco4({foo, bar}) class Foo {}`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  name: 'deco1',
                  type: 'Identifier'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [],
                  callee: {
                    name: 'deco2',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [
                    {
                      name: 'foo',
                      type: 'Identifier'
                    },
                    {
                      name: 'bar',
                      type: 'Identifier'
                    }
                  ],
                  callee: {
                    name: 'deco3',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              },
              {
                expression: {
                  arguments: [
                    {
                      properties: [
                        {
                          computed: false,
                          key: {
                            name: 'foo',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: true,
                          type: 'Property',
                          value: {
                            name: 'foo',
                            type: 'Identifier'
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
                          shorthand: true,
                          type: 'Property',
                          value: {
                            name: 'bar',
                            type: 'Identifier'
                          }
                        }
                      ],
                      type: 'ObjectExpression'
                    }
                  ],
                  callee: {
                    name: 'deco4',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
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
      `@foo('bar')
  class Foo {}`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: []
            },
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'bar'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `@foo('bar')
  class Foo {}`,
      Context.OptionsNext | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: []
            },
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'bar'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `(@foo('bar')
  class Foo {})`,
      Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'Foo',
                start: 21,
                end: 24,
                range: [21, 24],
                loc: { start: { line: 2, column: 8 }, end: { line: 2, column: 11 } }
              },
              superClass: null,
              decorators: [
                {
                  type: 'Decorator',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo',
                      start: 2,
                      end: 5,
                      range: [2, 5],
                      loc: { start: { line: 1, column: 2 }, end: { line: 1, column: 5 } }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 'bar',
                        start: 6,
                        end: 11,
                        range: [6, 11],
                        loc: { start: { line: 1, column: 6 }, end: { line: 1, column: 11 } }
                      }
                    ],
                    start: 1,
                    end: 12,
                    range: [1, 12],
                    loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 12 } }
                  },
                  start: 1,
                  end: 12,
                  range: [1, 12],
                  loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 12 } }
                }
              ],
              body: {
                type: 'ClassBody',
                body: [],
                start: 25,
                end: 27,
                range: [25, 27],
                loc: { start: { line: 2, column: 12 }, end: { line: 2, column: 14 } }
              },
              start: 15,
              end: 27,
              range: [15, 27],
              loc: { start: { line: 2, column: 2 }, end: { line: 2, column: 14 } }
            },
            start: 0,
            end: 28,
            range: [0, 28],
            loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 15 } }
          }
        ],
        start: 0,
        end: 28,
        range: [0, 28],
        loc: { start: { line: 1, column: 0 }, end: { line: 2, column: 15 } }
      }
    ],
    [
      `(@foo('bar')
  class Foo {})`,
      Context.OptionsNext | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'Foo'
              },
              superClass: null,
              decorators: [
                {
                  type: 'Decorator',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 'bar'
                      }
                    ]
                  }
                }
              ],
              body: {
                type: 'ClassBody',
                body: []
              }
            }
          }
        ]
      }
    ],
    [
      `class Foo {
    @dec
    static bar() {}
  }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
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
                    name: 'bar'
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
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `class A {
        @(({ key }) => { pn = key; })
        #x = 1;

        getX() {
          return this.#x;
        }
      }`,
      Context.OptionsNext,
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
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'pn'
                                },
                                operator: '=',
                                right: {
                                  type: 'Identifier',
                                  name: 'key'
                                }
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                value: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        ],
                        async: false,
                        expression: false
                      }
                    }
                  ]
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'getX'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateIdentifier',
                              name: 'x'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `@deco
        class A {
          get #get() {}

          set #set(_) {}

          get #getset() {}
          set #getset(_) {}

          test() {
            this.#get;
            this.#set = 2;
            this.#getset;
            this.#getset = 2;
          }
        }`,
      Context.OptionsNext,
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
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'Identifier',
                  name: 'deco'
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'get'
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
                },
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'set'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: '_'
                      }
                    ],
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
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'getset'
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
                },
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'getset'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: '_'
                      }
                    ],
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
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateIdentifier',
                              name: 'get'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateIdentifier',
                                name: 'set'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 2
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'ThisExpression'
                            },
                            computed: false,
                            property: {
                              type: 'PrivateIdentifier',
                              name: 'getset'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateIdentifier',
                                name: 'getset'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 2
                            }
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
      `@deco
          class A {
            static #foo() {}

            test() {
              A.#foo();
            }
          }`,
      Context.OptionsNext,
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
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'Identifier',
                  name: 'deco'
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  decorators: [],
                  static: true,
                  computed: false,
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'foo'
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
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'test'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Identifier',
                                name: 'A'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateIdentifier',
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
      `class A {
              @(({ key }) => { pn = key; })
              #x;
            }`,
      Context.OptionsNext,
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
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'x'
                  },
                  value: null,
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'AssignmentExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'pn'
                                },
                                operator: '=',
                                right: {
                                  type: 'Identifier',
                                  name: 'key'
                                }
                              }
                            }
                          ]
                        },
                        params: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                key: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                value: {
                                  type: 'Identifier',
                                  name: 'key'
                                },
                                kind: 'init',
                                computed: false,
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        ],
                        async: false,
                        expression: false
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
      `function writable(w) {
                return desc => {
                  desc.descriptor.writable = w;
                }
              }

              class A {
                @writable(false)
                #x = 2;

                @writable(true)
                @writable(false)
                #y = 2;

                testX() {
                  this.#x = 1;
                }

                testY() {
                  this.#y = 1;
                }
              }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'w'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ReturnStatement',
                  argument: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Identifier',
                                  name: 'desc'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'descriptor'
                                }
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'writable'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'w'
                            }
                          }
                        }
                      ]
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'desc'
                      }
                    ],
                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'writable'
            }
          },
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
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: false
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  computed: false,
                  static: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: true
                          }
                        ]
                      }
                    },
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'writable'
                        },
                        arguments: [
                          {
                            type: 'Literal',
                            value: false
                          }
                        ]
                      }
                    }
                  ]
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'testX'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateIdentifier',
                                name: 'x'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'testY'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateIdentifier',
                                name: 'y'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  decorators: []
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `class A {
                  @(_ => el = _)
                  static foo() {}
                }`,
      Context.OptionsNext,
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
            decorators: [],
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
                    name: 'foo'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'ArrowFunctionExpression',
                        body: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'el'
                          },
                          operator: '=',
                          right: {
                            type: 'Identifier',
                            name: '_'
                          }
                        },
                        params: [
                          {
                            type: 'Identifier',
                            name: '_'
                          }
                        ],
                        async: false,
                        expression: true
                      }
                    }
                  ],
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
        ]
      }
    ],
    [
      `@foo(class Bar{})
    class Foo {}`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [],
              type: 'ClassBody'
            },
            decorators: [
              {
                expression: {
                  arguments: [
                    {
                      body: {
                        body: [],
                        type: 'ClassBody'
                      },
                      decorators: [],
                      id: {
                        name: 'Bar',
                        type: 'Identifier'
                      },
                      superClass: null,
                      type: 'ClassExpression'
                    }
                  ],
                  callee: {
                    name: 'foo',
                    type: 'Identifier'
                  },
                  type: 'CallExpression'
                },
                type: 'Decorator'
              }
            ],
            id: {
              name: 'Foo',
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
      `class A {
          @foo get getter(){}
        }`,
      Context.OptionsNext,
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
                  kind: 'get',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'getter'
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
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ],
    [
      `@outer({
            store: @inner class Foo {}
          })
          class Bar {

          }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: []
            },
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'outer'
                  },
                  arguments: [
                    {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'store'
                          },
                          value: {
                            type: 'ClassExpression',
                            id: {
                              type: 'Identifier',
                              name: 'Foo'
                            },
                            superClass: null,
                            body: {
                              type: 'ClassBody',
                              body: []
                            },
                            decorators: [
                              {
                                type: 'Decorator',
                                expression: {
                                  type: 'Identifier',
                                  name: 'inner'
                                }
                              }
                            ]
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
            ]
          }
        ]
      }
    ],
    [
      `class Bar{
              @outer(
                @classDec class {
                  @inner
                  innerMethod() {}
                }
              )
              outerMethod() {}
            }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            decorators: [],
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
                    name: 'outerMethod'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Identifier',
                          name: 'outer'
                        },
                        arguments: [
                          {
                            type: 'ClassExpression',
                            id: null,
                            superClass: null,
                            decorators: [
                              {
                                type: 'Decorator',
                                expression: {
                                  type: 'Identifier',
                                  name: 'classDec'
                                }
                              }
                            ],
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
                                    name: 'innerMethod'
                                  },
                                  decorators: [
                                    {
                                      type: 'Decorator',
                                      expression: {
                                        type: 'Identifier',
                                        name: 'inner'
                                      }
                                    }
                                  ],
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
                        ]
                      }
                    }
                  ],
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
        ]
      }
    ],
    [
      `@({
                store: @inner class Foo {}
              })
              class Bar {

              }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Bar'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'store'
                      },
                      value: {
                        type: 'ClassExpression',
                        id: {
                          type: 'Identifier',
                          name: 'Foo'
                        },
                        superClass: null,
                        decorators: [
                          {
                            type: 'Decorator',
                            expression: {
                              type: 'Identifier',
                              name: 'inner'
                            }
                          }
                        ],
                        body: {
                          type: 'ClassBody',
                          body: []
                        }
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
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      `class A {
                    @dec #name = 0
                  }`,
      Context.OptionsNext,
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
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'name'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
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
      `class Foo {
                      @dec
                      static bar() {}
                    }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
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
                    name: 'bar'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ],
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
        ]
      }
    ],
    [
      `class A {
                        @dec static #name = 0
                      }`,
      Context.OptionsNext,
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
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'name'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: true,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
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
      `class Foo { @foo @bar bar() {} }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
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
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    }
                  ],
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
        ]
      }
    ],
    [
      `var Foo = @foo class Foo {}`,
      Context.OptionsNext,
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
                  type: 'ClassExpression',
                  id: {
                    type: 'Identifier',
                    name: 'Foo'
                  },
                  superClass: null,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ],
                  body: {
                    type: 'ClassBody',
                    body: []
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'Foo'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class Foo { @foo set bar(f) {} }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ],
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'f'
                      }
                    ],
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
        ]
      }
    ],
    [
      '@a(@b class C {}) @d(@e() class F {}) class G {}',
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'G'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  arguments: [
                    {
                      type: 'ClassExpression',
                      id: {
                        type: 'Identifier',
                        name: 'C'
                      },
                      superClass: null,
                      decorators: [
                        {
                          type: 'Decorator',
                          expression: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        }
                      ],
                      body: {
                        type: 'ClassBody',
                        body: []
                      }
                    }
                  ]
                }
              },
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  arguments: [
                    {
                      type: 'ClassExpression',
                      id: {
                        type: 'Identifier',
                        name: 'F'
                      },
                      superClass: null,
                      decorators: [
                        {
                          type: 'Decorator',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'e'
                            },
                            arguments: []
                          }
                        }
                      ],
                      body: {
                        type: 'ClassBody',
                        body: []
                      }
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      '@a(@b class C {}) @d(@e() class F {}) class G {}',
      Context.OptionsNext | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'G'
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  arguments: [
                    {
                      type: 'ClassExpression',
                      id: {
                        type: 'Identifier',
                        name: 'C'
                      },
                      superClass: null,
                      decorators: [
                        {
                          type: 'Decorator',
                          expression: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        }
                      ],
                      body: {
                        type: 'ClassBody',
                        body: []
                      }
                    }
                  ]
                }
              },
              {
                type: 'Decorator',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  arguments: [
                    {
                      type: 'ClassExpression',
                      id: {
                        type: 'Identifier',
                        name: 'F'
                      },
                      superClass: null,
                      decorators: [
                        {
                          type: 'Decorator',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'e'
                            },
                            arguments: []
                          }
                        }
                      ],
                      body: {
                        type: 'ClassBody',
                        body: []
                      }
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      '@a class G {}',
      Context.OptionsNext | Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'G',
              start: 9,
              end: 10,
              range: [9, 10],
              loc: { start: { line: 1, column: 9 }, end: { line: 1, column: 10 } }
            },
            superClass: null,
            decorators: [
              {
                type: 'Decorator',
                expression: {
                  type: 'Identifier',
                  name: 'a',
                  start: 1,
                  end: 2,
                  range: [1, 2],
                  loc: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } }
                },
                start: 0,
                end: 2,
                range: [0, 2],
                loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 2 } }
              }
            ],
            body: {
              type: 'ClassBody',
              body: [],
              start: 11,
              end: 13,
              range: [11, 13],
              loc: { start: { line: 1, column: 11 }, end: { line: 1, column: 13 } }
            },
            start: 3,
            end: 13,
            range: [3, 13],
            loc: { start: { line: 1, column: 3 }, end: { line: 1, column: 13 } }
          }
        ],
        start: 0,
        end: 13,
        range: [0, 13],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 13 } }
      }
    ],
    [
      'class A { @dec accessor a }',
      Context.OptionsNext | Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A',
              loc: {
                start: {
                  line: 1,
                  column: 6
                },
                end: {
                  line: 1,
                  column: 7
                }
              }
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'AccessorProperty',
                  key: {
                    type: 'Identifier',
                    name: 'a',
                    loc: {
                      start: {
                        line: 1,
                        column: 24
                      },
                      end: {
                        line: 1,
                        column: 25
                      }
                    }
                  },
                  value: null,
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec',
                        loc: {
                          start: {
                            line: 1,
                            column: 11
                          },
                          end: {
                            line: 1,
                            column: 14
                          }
                        }
                      },
                      loc: {
                        start: {
                          line: 1,
                          column: 10
                        },
                        end: {
                          line: 1,
                          column: 14
                        }
                      }
                    }
                  ],
                  loc: {
                    start: {
                      line: 1,
                      column: 15
                    },
                    end: {
                      line: 1,
                      column: 25
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 8
                },
                end: {
                  line: 1,
                  column: 27
                }
              }
            },
            decorators: [],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 27
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 27
          }
        }
      }
    ],
    [
      'class A { @dec accessor #a }',
      Context.OptionsNext,
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
                  type: 'AccessorProperty',
                  key: {
                    type: 'PrivateIdentifier',
                    name: 'a'
                  },
                  value: null,
                  static: false,
                  computed: false,
                  decorators: [
                    {
                      type: 'Decorator',
                      expression: {
                        type: 'Identifier',
                        name: 'dec'
                      }
                    }
                  ]
                }
              ]
            },
            decorators: []
          }
        ]
      }
    ]
  ]);
});
