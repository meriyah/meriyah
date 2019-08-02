import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Optional chaining', () => {
  for (const arg of [
    'func?.()',
    'obj?.prop ',
    'func?.(...args)',
    'a?.[x]',
    'a?.()',
    'x?.1:y',
    'a?.[++x]',
    'a?.b.c(++x).d',
    'a?.b[3].c?.(x).d',
    '(a?.b).c',
    'delete a?.b',
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

    'true?.valueOf()',
    '0?.valueOf()',
    '({})?.constructor',
    '[]?.length',
    'undefined?.["valueOf"]()',
    '1?.["valueOf"]()',
    '() => 0?.()',
    '() => 1?.()',
    '() => "hi"?.()',
    '() => ({})?.a["b"]',
    '() => (() => {})?.()()',
    '(() => {})?.()?.()',
    'null?.()().a["b"]',
    'delete undefined?.()',
    'delete null?.()',
    'undefined?.(...a)',
    'null?.(1, ...a)',
    '({}).a?.(...a)',
    '({ a: null }).a?.(...a)',
    'undefined?.(...a)?.(1, ...a)',
    '() => 5?.(...[])',
    'delete o1?.x',
    'o2.x?.["y"];',
    'a?.[foo(a)]',
    'a ?? a.b ?? (a?.b).c();',
    'a ?? foo.bar?.baz ?? a.c',
    'a ?? aobj?.[expr]?.[other] ?? foo.bar?.baz',
    'a?.b[3].c?.(x).d ?? aobj?.[expr]?.[other] ?? foo.bar?.baz',
    'const x = a?.b.c',
    '(null)?.b === null',
    'let a = b?.c',
    'a?.b',
    '!a ? a : a.b',
    'foo(null?.x)',
    'let a = b?? "default";',
    'let a = b.c ?? "default";',
    'let xn = x?.normalize("NFC")',
    'a?.b === undefined',
    'null?.foo === null',
    'var v = a?.b?.c?.d',
    'var v = (((a?.b)?.c)?.d)',
    'a?.b?.c?.d === undefined',
    'o3?.a === o4?.a === undefined',
    'o3?.a?.b === o4?.a?.b === undefined',
    'o3?.a?.b?.c === o4?.a?.b?.c === undefined',
    'x in (o3?.a)',
    'obj.func?.[arg].property;',
    'obj.func?.[arg.property];',
    'a?.b.c.e?.f.g?.h.t.c?.d()?.e;',
    'a?.d().f?.b',
    'obj.func?.[arg];',
    'a?.trim()?.indexOf("hello")',
    'foo?.x?.y?.z?()=>{foo}:bar;',
    `if (a?.b?.c === 'foobar') {}
     if (a?.b()?.c) {}
     if (a?.b?.()?.c) {}`,
    'new new class {}().constructor();',
    'System.global.navigator?.toString()',
    '(a?.b).c',
    `a?.b(...args);`,
    `a?.b(...args).c;`,
    '({ x: 1 }).x?.y.z;',
    `a?.b(...args).c(...args);`,
    'let a = b?.c;',
    'o.x?[y]+z:t',
    'var a = b.c("string")?.d.e || 0;'
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
    ['a.?2.3', Context.OptionsNext],
    ['a.?.2', Context.OptionsNext],
    ['a.?2.n', Context.OptionsNext],
    ['a.?2.3', Context.OptionsNext],
    ['a.?2.?n', Context.OptionsNext],
    ['a.? (?) [?]', Context.OptionsNext],
    ['a.?2.3', Context.OptionsNext],
    ['obj?.[expr] func?.(...args) new C?.(...args)', Context.OptionsNext],
    ['o.x?[y]+z', Context.OptionsNext],
    ['obj:?.prop', Context.OptionsNext],
    ['obj:?[expr]', Context.OptionsNext],
    ['func:?(...args)', Context.OptionsNext],
    ['a === null: a?.b.c === undefined', Context.OptionsNext],
    ['a === null: a?.b.c === undefined', Context.OptionsNext],
    ['?.a?.b?.c', Context.OptionsNext],
    ['?.(a.b.c)', Context.OptionsNext],
    ['?. ?[] ?() ?:', Context.OptionsNext],
    ['var b = condition ? a?.x.?y : a?.y?.z;', Context.OptionsNext],
    ['a.?[b.c].d', Context.OptionsNext],
    ['a[?b[c]]', Context.OptionsNext],
    ['delete ?a.b.c', Context.OptionsNext],
    ['delete ?a.b.c', Context.None],
    ['a?.b => (a == null ? a : a.b)', Context.OptionsNext],
    ['foo?.x?.y?.z?()=>foo;', Context.OptionsNext],
    ['const a = { b(){ return super?.c; } }', Context.OptionsNext],
    ['class A{ b(){ return super?.b; } }', Context.OptionsWebCompat],
    ['new a?.();', Context.OptionsNext | Context.Module | Context.Strict],
    ['new C?.b.d()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a.?b.?()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a.?()', Context.OptionsNext | Context.OptionsWebCompat],
    ['a?.b = c', Context.OptionsNext | Context.OptionsWebCompat],
    ['a?.[b] = c', Context.OptionsNext | Context.OptionsWebCompat],
    ['a?.{a} = c', Context.OptionsNext | Context.OptionsWebCompat],
    ['a?.(a) = c', Context.OptionsNext | Context.OptionsWebCompat],
    ['o3?.a in ()', Context.OptionsNext | Context.OptionsWebCompat],
    [
      'a?.b => (a == null ? void 0 : a.b) a?.b.c => (a == null ? void 0 : a.b.c)',
      Context.OptionsNext | Context.OptionsWebCompat
    ],
    ['class C {} class D extends C { foo() { return super?.bar; } }', Context.OptionsNext | Context.OptionsWebCompat],
    ['class C {} class D extends C { foo() { return super?.["bar"]; }', Context.OptionsNext | Context.OptionsWebCompat],
    ['class C {} class D extends C { constructor() { super?.(); } }', Context.OptionsNext | Context.OptionsWebCompat],
    ['const o = { C: class {} }; new o?.C();', Context.OptionsNext | Context.OptionsWebCompat],
    ['const o = { C: class {} }; new o?.["C"]();', Context.OptionsNext | Context.OptionsWebCompat],
    ['class C {} new C?.();', Context.OptionsNext | Context.OptionsWebCompat],
    ['function tag() {} tag?', Context.OptionsNext | Context.OptionsWebCompat],
    ['const o = { tag() {} }; o?.tag``', Context.OptionsNext | Context.OptionsWebCompat],
    ['import?.("foo")', Context.OptionsNext | Context.OptionsWebCompat],
    ['new new class {}()?.constructor?.();', Context.OptionsNext | Context.OptionsWebCompat],
    ['a?.{a} = c', Context.None],
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
