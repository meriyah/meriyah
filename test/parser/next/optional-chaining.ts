import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Optional chaining', () => {
  for (const arg of [
    'func?.()',
    'func?.(a, b)',
    'a?.func?.()',
    'a?.func?.(a, b)',
    'a.func?.()',
    'obj?.[expr]',
    'obj?.[expr]?.[other]',
    `obj?.[true]`,
    'obj?.[true]?.[true]',
    'obj.a?.[expr]',
    `obj.a?.[true]`,
    `foo.bar?.baz`,
    `foo?.bar?.baz`,
    `foo?.bar`,
    'a.b?.c()',
    '(a?.b).c;',
    '(a?.b).c();',
    '(a?.b)?.c.d?.e;',
    `a?.b.c.d.e?.f`,
    `a.b.c?.d.e.f`,
    `if (a?.b?.c) {
      console.log(a?.b?.c);
    } else if (a?.b.c?.d?.e.f) {
      console.log(a?.b.c?.d?.e.f);
    }`,
    `if (a?.b?.c === 'foobar') {}
     if (a?.b()?.c) {}
     if (a?.b?.()?.c) {}`,
    `a?.b(...args);`,
    `a?.b(...args).c;`,
    `a?.b(...args).c(...args);`
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

  fail('Expressions - Optional chaining (fail)', [
    ['const a = { b(){ return super?.c; } }', Context.OptionsNext],
    ['class A{ b(){ return super?.b; } }', Context.OptionsWebCompat],
    ['new a?.();', Context.OptionsNext | Context.Module | Context.Strict],
    ['new C?.b.d()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a.?b.?()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a.?()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a.?()', Context.None]
  ]);

  pass('Next - Optional chaining (pass)', [
    [
      `a?.(...args);`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  argument: {
                    name: 'args',
                    type: 'Identifier'
                  },
                  type: 'SpreadElement'
                }
              ],
              callee: {
                name: 'a',
                type: 'Identifier'
              },
              optional: true,
              type: 'OptionalCallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A extends B {
      constructor(){
          super()?.b;
      }
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
                    name: 'constructor',
                    type: 'Identifier'
                  },
                  kind: 'constructor',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          expression: {
                            computed: false,
                            object: {
                              arguments: [],
                              callee: {
                                type: 'Super'
                              },
                              type: 'CallExpression'
                            },
                            optional: true,
                            property: {
                              name: 'b',
                              type: 'Identifier'
                            },
                            type: 'OptionalMemberExpression'
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
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: {
              name: 'B',
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a?.func?.()`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [],
              callee: {
                computed: false,
                object: {
                  name: 'a',
                  type: 'Identifier'
                },
                optional: true,
                property: {
                  name: 'func',
                  type: 'Identifier'
                },
                type: 'OptionalMemberExpression'
              },
              optional: true,
              type: 'OptionalCallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `func?.()`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [],
              callee: {
                name: 'func',
                type: 'Identifier'
              },
              optional: true,
              type: 'OptionalCallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `obj.a?.[true]`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: true,
              object: {
                computed: false,
                object: {
                  name: 'obj',
                  type: 'Identifier'
                },
                property: {
                  name: 'a',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              optional: true,
              property: {
                type: 'Literal',
                value: true
              },
              type: 'OptionalMemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `obj?.[expr]?.[other]`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: true,
              object: {
                computed: true,
                object: {
                  name: 'obj',
                  type: 'Identifier'
                },
                optional: true,
                property: {
                  name: 'expr',
                  type: 'Identifier'
                },
                type: 'OptionalMemberExpression'
              },
              optional: true,
              property: {
                name: 'other',
                type: 'Identifier'
              },
              type: 'OptionalMemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `a.b.c?.d.e.f`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: false,
              object: {
                computed: false,
                object: {
                  computed: false,
                  object: {
                    computed: false,
                    object: {
                      computed: false,
                      object: {
                        name: 'a',
                        type: 'Identifier'
                      },
                      property: {
                        name: 'b',
                        type: 'Identifier'
                      },
                      type: 'MemberExpression'
                    },
                    property: {
                      name: 'c',
                      type: 'Identifier'
                    },
                    type: 'MemberExpression'
                  },
                  optional: true,
                  property: {
                    name: 'd',
                    type: 'Identifier'
                  },
                  type: 'OptionalMemberExpression'
                },
                property: {
                  name: 'e',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              property: {
                name: 'f',
                type: 'Identifier'
              },
              type: 'MemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `foo?.bar`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              computed: false,
              object: {
                name: 'foo',
                type: 'Identifier'
              },
              optional: true,
              property: {
                name: 'bar',
                type: 'Identifier'
              },
              type: 'OptionalMemberExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
