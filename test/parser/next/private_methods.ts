import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Private methods', () => {
  fail('Private methods (fail)', [
    ['class A { #a }', Context.OptionsWebCompat],
    ['class A { #a }', Context.None],
    ['a = { #ab() {} }', Context.OptionsNext],
    ['class A { [{#ab() {}}]() {} }', Context.OptionsNext],
    ['class A{ # a() {}}', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['var o = { #m() {} };', Context.OptionsNext],
    ['var o = { async #m() {} };', Context.OptionsNext],
    ['var o = { *#m() {} };', Context.OptionsNext],
    ['class A { constructor = 4 }', Context.OptionsNext],
    ['class A { #constructor = 4 }', Context.OptionsNext],
    ['class A { a = () => super() }', Context.OptionsNext],
    ['class A { # a }', Context.OptionsNext],
    ['class A { #a; a() { this.# a } }', Context.OptionsNext],
    ['class A {  #x; g = this.f; x = delete (g().#m); }', Context.OptionsNext],
    ['class A {  #x; x = delete (this.#m); }', Context.OptionsNext],
    ['class A {  #x; g = this.f; x = delete (g().#m); }', Context.OptionsNext],
    ['class A {  #x; x = delete (g().#m); async *#m() {} }', Context.OptionsNext],
    ['class A {  #x; x() { var g = this.f; delete g().#x; } }', Context.OptionsNext],
    ['class A {  #x; x() { delete ((this.#m ));  } async #m() {} }', Context.OptionsNext],
    ['class A { # x }', Context.OptionsNext],
    ['class A { #\\u0000; }', Context.OptionsNext],
    ['class A { * # m() {} }', Context.OptionsNext],
    ['class A { # x; }', Context.OptionsNext],
    ['class A { #x; m() { this.# x; }}', Context.OptionsNext],
    ['class A { # m() {} }', Context.OptionsNext],
    ['class A { static get # m() {} }', Context.OptionsNext],
    ['class A { * method() { super(); } }', Context.OptionsNext],
    ['class A { static async * prototype() {} }', Context.OptionsNext],
    ['class A { static async #method() { super(); } }', Context.OptionsNext],
    ['class A { method() { this.\\u0023field; } }', Context.OptionsNext],
    ['class C { static #x = super(); }', Context.OptionsNext],
    ['class C { async \\u0023m() {} } }', Context.OptionsNext],
    ['class C { static async *#gen() { var await; } }', Context.OptionsNext],
    ['class C { static async *#gen() { void await; } }', Context.OptionsNext],
    ['class C { static async *#gen() { var yield; } }', Context.OptionsNext],
    ['class C { static async *#gen() { void yield; } }', Context.OptionsNext],
    ['class C { static async *#gen() { yield: ; } }', Context.OptionsNext],
    ['class C { static async *#gen() {  void \\u0061wait; } }', Context.OptionsNext],
    ['class C { async \\u0023m() {} } }', Context.OptionsNext],
    ['class C { #method() { a() { foo().\\u0023field; } } }', Context.OptionsNext],
    ['class C { #method() { \\u0023field; } }', Context.OptionsNext],
    ['class C {  async \\u0023m() {} }', Context.OptionsNext],
    ['var C = class { x = 42  *gen() {} }', Context.OptionsNext],
    ['class Spaces { #  wrongSpaces() { return fail(); } }', Context.OptionsNext],
    ['class C{ #method() { #[m] = 1} }', Context.OptionsNext],
    ['class C{ #method() { #"p" = x } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['(class C extends Base { async #*a() { } })', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C { #x = () => arguments; }', Context.OptionsNext]
  ]);

  for (const arg of [
    '#a : 0',
    '#a =',
    '#*a = 0',
    '#*a',
    '#constructor',
    'static #constructor',
    '#constructor = function() {}',
    '# a = 0',
    '#0 = 0;',
    '#0;',
    "#'a' = 0;",
    "#'a';",
    "#['a']",
    "#['a'] = 1",
    '#[a]',
    '#[a] = 1',
    '#a = arguments',
    'foo() { delete this.#a }',
    'foo() { delete this.x.#a }',
    'foo() { delete this.x().#a }',
    'foo() { delete f.#a }',
    'foo() { delete f.x.#a }',
    'foo() { delete f.x().#a }',
    '#a = 0\n *b(){}',
    "#a = 0\n ['b'](){}",
    'const { x: x } = this;',
    'var C = class { #x = 1; destructureX() { const { #x: x } = this; } };',
    'get # m() {}',
    'set # m(_) {}',
    'async * # m() {}',
    'async # m() {}',
    'm() { this.f().# x; }',
    '# x = 1;',
    '# x;',
    '* # m() {}',
    '# m() {}',
    'static get # m() {}',
    'async #*a() { }',
    '#x = () => /*{ initializer }*/;',
    '#x = /*{ initializer }*/;',
    '#x = false ? {} : /*{ initializer }*/;',
    '#x = typeof /*{ initializer }*/;',
    'static #x = /*{ initializer }*/;',
    '#x = () => super();',
    '#x = super();',
    '#\\u0000;'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });

    it(`class C extends Base { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C extends Base { ${arg} }`, undefined, Context.OptionsNext);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.throws(() => {
        parseSource(`(class C { ${arg} })`, undefined, Context.OptionsNext);
      });
    });

    it(`(class C extends Base { ${arg} })`, () => {
      t.throws(() => {
        parseSource(`(class C extends Base { ${arg} })`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    '#a = 0;',
    '#a = 0; #b;',
    '#a = 0; b;',
    '#a = 0; b(){}',
    '#a = 0; *b(){}',
    "#a = 0; ['b'](){}",
    '#a;',
    '#a; #b;',
    '#a; b;',
    '#a; b(){}',
    '#a; *b(){}',
    "#a; ['b'](){}",
    'async #a() { }',
    'static #prototype() {}',
    'static * #prototype() {}',
    'async *#a() { }',
    '#a = 0;\n',
    '#a = 0;\n #b;',
    '#a = 0;\n b;',
    '#a = 0;\n b(){}',
    '#a;\n',
    '#a;\n #b;\n',
    '#a;\n b;\n',
    '#a;\n b(){}',
    '#a;\n *b(){}',
    "#a;\n ['b'](){}",
    '#a;\n get;',
    '#get;\n *a(){}',
    '#a;\n static;',
    '#a = function t() { arguments; }',
    '#a = () => function() { arguments; }',
    '#yield;',
    '#yield = 0;',
    '#yield;\n a;',
    '#async;',
    '#async = 0;',
    '#async;',
    '#async = 0;',
    '#async;\n a(){}',
    '#async;\n a;',
    '#await;',
    '* #foo() {}',
    'async * #foo() {}',
    ' get #bar() {}',
    'set #baz(taz) {}',
    'static async foo() {}',
    'static foo() {}',
    'static ["foo"]() {}',
    'async *#foo() {}',
    '#await = 0;',
    '#await;\n a;',
    'foo() { this.#m, (() => this)().#m }',
    ' #_;',
    '#\u2118;',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'method() { super.#x(); }'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });

    it(`class C extends Base { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C extends Base { ${arg} }`, undefined, Context.OptionsNext);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { ${arg} })`, undefined, Context.OptionsNext);
      });
    });

    it(`(class C extends Base { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C extends Base { ${arg} })`, undefined, Context.OptionsNext);
      });
    });
  }
  for (const arg of [
    '{ class C { #a() { class B { #a() {  } } new B; } } new C; }',
    '{ class A { #a() { class C extends A { #c() { } } new C; } } new A; }',
    '{ const C = class { #a() { } } }',
    '{ class A { constructor(arg) { return arg; } } class C extends A { #x() { } constructor(arg) { super(arg); } }  let c1 = new C({}); }',
    'class D extends class { #c() {} } { #d() {} }',
    'class E extends D { #e() {} }',
    'var C = class { *m() { return 42; } #m() {}; method() { return this.#m(); } }',
    'var C = class {  *m() { return 42; } static #$; static #_; static _(value) { this.#_ = value; return this.#_; }}',
    'var C = class { static async *m() { return 42; } static async * #$(value) {  yield * await value; } }',
    'var C = class {   static async *m() { return 42; } static async * #$(value) { yield * await value; } }',
    'var C = class { static async *m() { return 42; } static #$; static #_; }',
    'var C = class { static async m() { return 42; } #℘_; ℘(value) { this.#℘_ = value; return this.#℘; }}',
    'var C = class { static async m() { return 42; } static * #$(value) { yield * value; }  static * #_(value) {  yield * value; } }',
    'var C = class { static m() { return 42; } static #$ = 1; static #_ = 1; static _() { return this.#_; } }',
    'var C = class { var C = class { [obj1] = 42; [obj2] = 43; [obj3] = 44; } }',
    'var C = class { static m() { return 42; } static #$ = 1; static #_ = 1; static _() { return this.#_; } }',
    '{ class C { #a() { class B { #a() {  } } new B; } } new C; }',
    `{
      {\n
        class A {\n
          #a() { return 1; }\n
        }\n
      \n
        new A;\n
      }\n
      {\n
        class D {\n
          #d() {}\n
        }\n
      \n
        class E extends D {\n
          #e() {}\n
        }\n
      \n
        new D;\n
        new E;\n
      }\n}`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
  }
  pass('Next - Private methods (pass)', [
    [
      `class A { #key; }`,
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
                    name: 'key',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { static async #_(value) { return await value;} }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: '_',
                    type: 'PrivateName'
                  },
                  decorators: [],
                  kind: 'method',
                  static: true,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [
                        {
                          argument: {
                            argument: {
                              name: 'value',
                              type: 'Identifier'
                            },
                            type: 'AwaitExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [
                      {
                        name: 'value',
                        type: 'Identifier'
                      }
                    ],
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { #a; #b; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'a',
                    start: 10,
                    end: 12,
                    range: [10, 12]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 10,
                  end: 12,
                  range: [10, 12]
                },
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'b',
                    start: 14,
                    end: 16,
                    range: [14, 16]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 14,
                  end: 16,
                  range: [14, 16]
                }
              ],
              start: 8,
              end: 19,
              range: [8, 19]
            },
            start: 0,
            end: 19,
            range: [0, 19]
          }
        ],
        start: 0,
        end: 19,
        range: [0, 19]
      }
    ],
    [
      `class A { #yield = b[c]; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'yield',
                    start: 10,
                    end: 16,
                    range: [10, 16]
                  },
                  value: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'b',
                      start: 19,
                      end: 20,
                      range: [19, 20]
                    },
                    computed: true,
                    property: {
                      type: 'Identifier',
                      name: 'c',
                      start: 21,
                      end: 22,
                      range: [21, 22]
                    },
                    start: 19,
                    end: 23,
                    range: [19, 23]
                  },
                  computed: false,
                  static: false,
                  start: 10,
                  end: 23,
                  range: [10, 23]
                }
              ],
              start: 8,
              end: 26,
              range: [8, 26]
            },
            start: 0,
            end: 26,
            range: [0, 26]
          }
        ],
        start: 0,
        end: 26,
        range: [0, 26]
      }
    ],
    [
      `class A { #yield = foo + bar; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'yield',
                    start: 10,
                    end: 16,
                    range: [10, 16]
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'foo',
                      start: 19,
                      end: 22,
                      range: [19, 22]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'bar',
                      start: 25,
                      end: 28,
                      range: [25, 28]
                    },
                    operator: '+',
                    start: 19,
                    end: 28,
                    range: [19, 28]
                  },
                  computed: false,
                  static: false,
                  start: 10,
                  end: 28,
                  range: [10, 28]
                }
              ],
              start: 8,
              end: 31,
              range: [8, 31]
            },
            start: 0,
            end: 31,
            range: [0, 31]
          }
        ],
        start: 0,
        end: 31,
        range: [0, 31]
      }
    ],
    [
      `class A { #yield; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'yield',
                    start: 10,
                    end: 16,
                    range: [10, 16]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 10,
                  end: 16,
                  range: [10, 16]
                }
              ],
              start: 8,
              end: 19,
              range: [8, 19]
            },
            start: 0,
            end: 19,
            range: [0, 19]
          }
        ],
        start: 0,
        end: 19,
        range: [0, 19]
      }
    ],
    [
      `class C { static async *#gen() { yield { ...yield,  y: 1, ...yield yield, }; } static get gen() { return this.#gen; } }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: 'gen',
                    type: 'PrivateName'
                  },
                  kind: 'method',
                  static: true,
                  decorators: [],
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [
                        {
                          expression: {
                            argument: {
                              properties: [
                                {
                                  argument: {
                                    argument: null,
                                    delegate: false,
                                    type: 'YieldExpression'
                                  },
                                  type: 'SpreadElement'
                                },
                                {
                                  computed: false,
                                  key: {
                                    name: 'y',
                                    type: 'Identifier'
                                  },
                                  kind: 'init',
                                  method: false,
                                  shorthand: false,
                                  type: 'Property',
                                  value: {
                                    type: 'Literal',
                                    value: 1
                                  }
                                },
                                {
                                  argument: {
                                    argument: {
                                      argument: null,
                                      delegate: false,
                                      type: 'YieldExpression'
                                    },
                                    delegate: false,
                                    type: 'YieldExpression'
                                  },
                                  type: 'SpreadElement'
                                }
                              ],
                              type: 'ObjectExpression'
                            },
                            delegate: false,
                            type: 'YieldExpression'
                          },
                          type: 'ExpressionStatement'
                        }
                      ],
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
                    name: 'gen',
                    type: 'Identifier'
                  },
                  kind: 'get',
                  static: true,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: 'gen',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
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
              name: 'C',
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
      `class C { static *#gen() { yield [...yield yield]; } static get gen() { return this.#gen; } }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: 'gen',
                    type: 'PrivateName'
                  },
                  kind: 'method',
                  static: true,
                  decorators: [],
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          expression: {
                            argument: {
                              elements: [
                                {
                                  argument: {
                                    argument: {
                                      argument: null,
                                      delegate: false,
                                      type: 'YieldExpression'
                                    },
                                    delegate: false,
                                    type: 'YieldExpression'
                                  },
                                  type: 'SpreadElement'
                                }
                              ],
                              type: 'ArrayExpression'
                            },
                            delegate: false,
                            type: 'YieldExpression'
                          },
                          type: 'ExpressionStatement'
                        }
                      ],
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
                    name: 'gen',
                    type: 'Identifier'
                  },
                  kind: 'get',
                  static: true,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: 'gen',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
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
              name: 'C',
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
      `class C { get #℘() {} set #℘(x) {} a() { return this.#℘; } b(value) { this.#℘ = x; } };`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: '℘',
                    type: 'PrivateName'
                  },
                  kind: 'get',
                  static: false,
                  decorators: [],
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
                },
                {
                  computed: false,
                  key: {
                    name: '℘',
                    type: 'PrivateName'
                  },
                  kind: 'set',
                  static: false,
                  decorators: [],
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [
                      {
                        name: 'x',
                        type: 'Identifier'
                      }
                    ],
                    type: 'FunctionExpression'
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'a',
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
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: '℘',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'b',
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
                          expression: {
                            left: {
                              computed: false,
                              object: {
                                type: 'ThisExpression'
                              },
                              property: {
                                name: '℘',
                                type: 'PrivateName'
                              },
                              type: 'MemberExpression'
                            },
                            operator: '=',
                            right: {
                              name: 'x',
                              type: 'Identifier'
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
                    params: [
                      {
                        name: 'value',
                        type: 'Identifier'
                      }
                    ],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'C',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          },
          {
            type: 'EmptyStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class C { #m() { return 42; } get ref() { return this.#m; } }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'C'
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
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'm'
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
                            type: 'Literal',
                            value: 42
                          }
                        }
                      ]
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
                    type: 'Identifier',
                    name: 'ref'
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
                              type: 'PrivateName',
                              name: 'm'
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
      `class A { #foo = bar; }`,
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
                    name: 'foo',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    name: 'bar',
                    type: 'Identifier'
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class Cl {
        #privateField = "top secret string";

        constructor() {
          this.publicField = "not secret string";
        }

        get #privateFieldValue() {
          return this.#privateField;
        }

        set #privateFieldValue(newValue) {
          this.#privateField = newValue;
        }

        publicGetPrivateField() {
          return this.#privateFieldValue;
        }

        publicSetPrivateField(newValue) {
          this.#privateFieldValue = newValue;
        }

        get publicFieldValue() {
          return this.publicField;
        }

        set publicFieldValue(newValue) {
          this.publicField = newValue;
        }

        testUpdates() {
          this.#privateField = 0;
          this.publicField = 0;
          this.#privateFieldValue = this.#privateFieldValue++;
          this.publicFieldValue = this.publicFieldValue++;

          ++this.#privateFieldValue;
          ++this.publicFieldValue;

          this.#privateFieldValue += 1;
          this.publicFieldValue += 1;

          this.#privateFieldValue = -(this.#privateFieldValue ** this.#privateFieldValue);
          this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
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
              name: 'Cl'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'privateField'
                  },
                  value: {
                    type: 'Literal',
                    value: 'top secret string'
                  },
                  static: false,
                  computed: false,
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'publicField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 'not secret string'
                            }
                          }
                        }
                      ]
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
                    type: 'PrivateName',
                    name: 'privateFieldValue'
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
                              type: 'PrivateName',
                              name: 'privateField'
                            }
                          }
                        }
                      ]
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
                    type: 'PrivateName',
                    name: 'privateFieldValue'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'newValue'
                      }
                    ],
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
                                type: 'PrivateName',
                                name: 'privateField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'newValue'
                            }
                          }
                        }
                      ]
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
                    name: 'publicGetPrivateField'
                  },
                  decorators: [],
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
                              type: 'PrivateName',
                              name: 'privateFieldValue'
                            }
                          }
                        }
                      ]
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
                    name: 'publicSetPrivateField'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'newValue'
                      }
                    ],
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
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'newValue'
                            }
                          }
                        }
                      ]
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
                  key: {
                    type: 'Identifier',
                    name: 'publicFieldValue'
                  },
                  decorators: [],
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
                              type: 'Identifier',
                              name: 'publicField'
                            }
                          }
                        }
                      ]
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
                  key: {
                    type: 'Identifier',
                    name: 'publicFieldValue'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'newValue'
                      }
                    ],
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
                                type: 'Identifier',
                                name: 'publicField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'newValue'
                            }
                          }
                        }
                      ]
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
                    name: 'testUpdates'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'privateField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 0
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
                                type: 'Identifier',
                                name: 'publicField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 0
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
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'UpdateExpression',
                              argument: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'ThisExpression'
                                },
                                computed: false,
                                property: {
                                  type: 'PrivateName',
                                  name: 'privateFieldValue'
                                }
                              },
                              operator: '++',
                              prefix: false
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
                                type: 'Identifier',
                                name: 'publicFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'UpdateExpression',
                              argument: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'ThisExpression'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'publicFieldValue'
                                }
                              },
                              operator: '++',
                              prefix: false
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '++',
                            prefix: true
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'publicFieldValue'
                              }
                            },
                            operator: '++',
                            prefix: true
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
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '+=',
                            right: {
                              type: 'Literal',
                              value: 1
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
                                type: 'Identifier',
                                name: 'publicFieldValue'
                              }
                            },
                            operator: '+=',
                            right: {
                              type: 'Literal',
                              value: 1
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
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'UnaryExpression',
                              operator: '-',
                              argument: {
                                type: 'BinaryExpression',
                                left: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'PrivateName',
                                    name: 'privateFieldValue'
                                  }
                                },
                                right: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'PrivateName',
                                    name: 'privateFieldValue'
                                  }
                                },
                                operator: '**'
                              },
                              prefix: true
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
                                type: 'Identifier',
                                name: 'publicFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'UnaryExpression',
                              operator: '-',
                              argument: {
                                type: 'BinaryExpression',
                                left: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'publicFieldValue'
                                  }
                                },
                                right: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'publicFieldValue'
                                  }
                                },
                                operator: '**'
                              },
                              prefix: true
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
      `class Cl {
          #privateField = 0;

          get #privateFieldValue() {
            return this.#privateField;
          }

          constructor() {
            this.#privateFieldValue = 1;
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
              name: 'Cl'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'privateField'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: false,
                  computed: false,
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'get',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'privateFieldValue'
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
                              type: 'PrivateName',
                              name: 'privateField'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
                                name: 'privateFieldValue'
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
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class Cl {
            #privateField = "top secret string";

            constructor() {
              this.publicField = "not secret string";
            }

            get #privateFieldValue() {
              return this.#privateField;
            }

            set #privateFieldValue(newValue) {
              this.#privateField = newValue;
            }

            publicGetPrivateField() {
              return this.#privateFieldValue;
            }

            publicSetPrivateField(newValue) {
              this.#privateFieldValue = newValue;
            }
          } `,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Cl'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'privateField'
                  },
                  value: {
                    type: 'Literal',
                    value: 'top secret string'
                  },
                  static: false,
                  computed: false,
                  decorators: []
                },
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
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
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'publicField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 'not secret string'
                            }
                          }
                        }
                      ]
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
                    type: 'PrivateName',
                    name: 'privateFieldValue'
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
                              type: 'PrivateName',
                              name: 'privateField'
                            }
                          }
                        }
                      ]
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
                    type: 'PrivateName',
                    name: 'privateFieldValue'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'newValue'
                      }
                    ],
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
                                type: 'PrivateName',
                                name: 'privateField'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'newValue'
                            }
                          }
                        }
                      ]
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
                    name: 'publicGetPrivateField'
                  },
                  decorators: [],
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
                              type: 'PrivateName',
                              name: 'privateFieldValue'
                            }
                          }
                        }
                      ]
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
                    name: 'publicSetPrivateField'
                  },
                  decorators: [],
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'newValue'
                      }
                    ],
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
                                type: 'PrivateName',
                                name: 'privateFieldValue'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'newValue'
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
      `class A { #key() {} }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
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
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'key'
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
        ]
      }
    ],
    [
      `class A { #yield\n = 0; }`,
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
                    name: 'yield',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    type: 'Literal',
                    value: 0
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { #foo() { #bar } }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
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
                  decorators: [],
                  static: false,
                  computed: false,
                  key: {
                    type: 'PrivateName',
                    name: 'foo'
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
                            type: 'PrivateName',
                            name: 'bar'
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
      `class A { static #key; }`,
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
                    name: 'key',
                    type: 'PrivateName'
                  },
                  static: true,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { static #foo(bar) {} }`,
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
                    name: 'foo',
                    type: 'PrivateName'
                  },
                  kind: 'method',
                  static: true,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [
                      {
                        name: 'bar',
                        type: 'Identifier'
                      }
                    ],
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { m() {} #a; }`,
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
                    name: 'm',
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
                    name: 'a',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A {  #a; m() {} }`,
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
                    name: 'a',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'm',
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A {  #a; m() {} #b; }`,
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
                    name: 'a',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'm',
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
                    name: 'b',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { m() { return 42; } #a;  #__;  #NJ_;  #℘_ ; }`,
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
                    name: 'm',
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
                          argument: {
                            type: 'Literal',
                            value: 42
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'a',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: '__',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'NJ_',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: '℘_',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { #foo = () => 'bar';  method() {
        return this.#foo();
      } }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            decorators: [],
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'foo'
                  },
                  value: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Literal',
                      value: 'bar'
                    },
                    params: [],
                    async: false,
                    expression: true
                  },
                  computed: false,
                  static: false
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'method'
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
                            type: 'CallExpression',
                            callee: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'PrivateName',
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
      `class B { #x = 0; #y = 1; }`,
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'B'
            },
            superClass: null,
            decorators: [],
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  static: false,
                  computed: false,
                  decorators: []
                },
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'y'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
                  },
                  static: false,
                  computed: false,
                  decorators: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class A {
          static #x;
          static #y = 1;
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
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'x'
                  },
                  value: null,
                  static: true,
                  computed: false,
                  decorators: []
                },
                {
                  type: 'FieldDefinition',
                  key: {
                    type: 'PrivateName',
                    name: 'y'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
                  },
                  static: true,
                  computed: false,
                  decorators: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `class A {  #m = async function() { return 'foo'; };  method() { return this.#m(); } }`,
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
                    name: 'm',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                          argument: {
                            arguments: [],
                            callee: {
                              computed: false,
                              object: {
                                type: 'ThisExpression'
                              },
                              property: {
                                name: 'm',
                                type: 'PrivateName'
                              },
                              type: 'MemberExpression'
                            },
                            type: 'CallExpression'
                          },
                          type: 'ReturnStatement'
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
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { method() { return this.#m(); } #m = function () { return 'foo'; };  }`,
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
                          argument: {
                            arguments: [],
                            callee: {
                              computed: false,
                              object: {
                                type: 'ThisExpression'
                              },
                              property: {
                                name: 'm',
                                type: 'PrivateName'
                              },
                              type: 'MemberExpression'
                            },
                            type: 'CallExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'm',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          type: 'ReturnStatement'
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
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A {  #m() { return 42; } get bGetter() { return this.#b; } #b = this.#m(); get ref() { return this.#m; } constructor() {} }`,
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
                    name: 'm',
                    type: 'PrivateName'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: 42
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'bGetter',
                    type: 'Identifier'
                  },
                  kind: 'get',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: 'b',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'b',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: {
                    arguments: [],
                    callee: {
                      computed: false,
                      object: {
                        type: 'ThisExpression'
                      },
                      property: {
                        name: 'm',
                        type: 'PrivateName'
                      },
                      type: 'MemberExpression'
                    },
                    type: 'CallExpression'
                  }
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'ref',
                    type: 'Identifier'
                  },
                  kind: 'get',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: 'm',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
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
                    name: 'constructor',
                    type: 'Identifier'
                  },
                  kind: 'constructor',
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { #$_; #℘_; }`,
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
                    name: '$_',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
                },
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: '℘_',
                    type: 'PrivateName'
                  },
                  static: false,
                  type: 'FieldDefinition',
                  value: null
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { $(value) { this.#$_ = value; return this.#$; } }`,
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
                    name: '$',
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
                          expression: {
                            left: {
                              computed: false,
                              object: {
                                type: 'ThisExpression'
                              },
                              property: {
                                name: '$_',
                                type: 'PrivateName'
                              },
                              type: 'MemberExpression'
                            },
                            operator: '=',
                            right: {
                              name: 'value',
                              type: 'Identifier'
                            },
                            type: 'AssignmentExpression'
                          },
                          type: 'ExpressionStatement'
                        },
                        {
                          argument: {
                            computed: false,
                            object: {
                              type: 'ThisExpression'
                            },
                            property: {
                              name: '$',
                              type: 'PrivateName'
                            },
                            type: 'MemberExpression'
                          },
                          type: 'ReturnStatement'
                        }
                      ],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [
                      {
                        name: 'value',
                        type: 'Identifier'
                      }
                    ],
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `var C = class {
        static *m() { return 42; } #$_; #__;  #℘_;   set #$(value) { this.#$_ = value;
        }
        set #_(value) {
          this.#__ = value;
        }
      }`,
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
                  id: null,
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
                          name: 'm'
                        },
                        decorators: [],
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'Literal',
                                  value: 42
                                }
                              }
                            ]
                          },
                          async: false,
                          generator: true,
                          id: null
                        }
                      },
                      {
                        type: 'FieldDefinition',
                        key: {
                          type: 'PrivateName',
                          name: '$_'
                        },
                        value: null,
                        static: false,
                        computed: false,
                        decorators: []
                      },
                      {
                        type: 'FieldDefinition',
                        key: {
                          type: 'PrivateName',
                          name: '__'
                        },
                        value: null,
                        static: false,
                        computed: false,
                        decorators: []
                      },
                      {
                        type: 'FieldDefinition',
                        key: {
                          type: 'PrivateName',
                          name: '℘_'
                        },
                        value: null,
                        static: false,
                        computed: false,
                        decorators: []
                      },
                      {
                        type: 'MethodDefinition',
                        kind: 'set',
                        static: false,
                        computed: false,
                        decorators: [],
                        key: {
                          type: 'PrivateName',
                          name: '$'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'Identifier',
                              name: 'value'
                            }
                          ],
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
                                      type: 'PrivateName',
                                      name: '$_'
                                    }
                                  },
                                  operator: '=',
                                  right: {
                                    type: 'Identifier',
                                    name: 'value'
                                  }
                                }
                              }
                            ]
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
                          type: 'PrivateName',
                          name: '_'
                        },
                        value: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'Identifier',
                              name: 'value'
                            }
                          ],
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
                                      type: 'PrivateName',
                                      name: '__'
                                    }
                                  },
                                  operator: '=',
                                  right: {
                                    type: 'Identifier',
                                    name: 'value'
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
                },
                id: {
                  type: 'Identifier',
                  name: 'C'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class A { get #foo/*{ declareWith }*/() {} }`,
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
                    name: 'foo',
                    type: 'PrivateName'
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `var C = class {
        static async *m() { return 42; } #$_; #__;

        get #_() {
          return this.#__;
        }
        $(value) {
          this.#$_ = value;
          return this.#$;
        }
        _(value) {
          this.#__ = value;
          return this.#_;
        }

      }`,
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
                  id: null,
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
                          name: 'm'
                        },
                        decorators: [],
                        value: {
                          type: 'FunctionExpression',
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'Literal',
                                  value: 42
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: true,
                          id: null
                        }
                      },
                      {
                        type: 'FieldDefinition',
                        key: {
                          type: 'PrivateName',
                          name: '$_'
                        },
                        value: null,
                        static: false,
                        computed: false,
                        decorators: []
                      },
                      {
                        type: 'FieldDefinition',
                        key: {
                          type: 'PrivateName',
                          name: '__'
                        },
                        value: null,
                        static: false,
                        computed: false,
                        decorators: []
                      },
                      {
                        type: 'MethodDefinition',
                        kind: 'get',
                        static: false,
                        computed: false,
                        decorators: [],
                        key: {
                          type: 'PrivateName',
                          name: '_'
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
                                    type: 'PrivateName',
                                    name: '__'
                                  }
                                }
                              }
                            ]
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
                          name: '$'
                        },
                        decorators: [],
                        value: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'Identifier',
                              name: 'value'
                            }
                          ],
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
                                      type: 'PrivateName',
                                      name: '$_'
                                    }
                                  },
                                  operator: '=',
                                  right: {
                                    type: 'Identifier',
                                    name: 'value'
                                  }
                                }
                              },
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'PrivateName',
                                    name: '$'
                                  }
                                }
                              }
                            ]
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
                          name: '_'
                        },
                        decorators: [],
                        value: {
                          type: 'FunctionExpression',
                          params: [
                            {
                              type: 'Identifier',
                              name: 'value'
                            }
                          ],
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
                                      type: 'PrivateName',
                                      name: '__'
                                    }
                                  },
                                  operator: '=',
                                  right: {
                                    type: 'Identifier',
                                    name: 'value'
                                  }
                                }
                              },
                              {
                                type: 'ReturnStatement',
                                argument: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'ThisExpression'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'PrivateName',
                                    name: '_'
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
                },
                id: {
                  type: 'Identifier',
                  name: 'C'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `class Hotel {
        get #evil() {
          return ohNo();
        }
        set #evil(x) {
          return makeEvil(x);
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
              name: 'Hotel'
            },
            superClass: null,
            decorators: [],
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
                    type: 'PrivateName',
                    name: 'evil'
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
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'ohNo'
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
                },
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: false,
                  computed: false,
                  decorators: [],
                  key: {
                    type: 'PrivateName',
                    name: 'evil'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'makeEvil'
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
      `var C = class {
        ;;;;
        ;;;;;;;;;;;;;
        ;;;;
        static #x(value) {
          return value / 2;
        }
        static #y(value) {
          return value * 2;
        }
        static x() {
          return this.#x(84);
        }
        static y() {
          return this.#y(43);
        }
      } `,
      Context.OptionsNext,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'C',
                  type: 'Identifier'
                },
                init: {
                  body: {
                    body: [
                      {
                        computed: false,
                        decorators: [],
                        key: {
                          name: 'x',
                          type: 'PrivateName'
                        },
                        kind: 'method',
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: false,
                          body: {
                            body: [
                              {
                                argument: {
                                  left: {
                                    name: 'value',
                                    type: 'Identifier'
                                  },
                                  operator: '/',
                                  right: {
                                    type: 'Literal',
                                    value: 2
                                  },
                                  type: 'BinaryExpression'
                                },
                                type: 'ReturnStatement'
                              }
                            ],
                            type: 'BlockStatement'
                          },
                          generator: false,
                          id: null,
                          params: [
                            {
                              name: 'value',
                              type: 'Identifier'
                            }
                          ],
                          type: 'FunctionExpression'
                        }
                      },
                      {
                        computed: false,
                        decorators: [],
                        key: {
                          name: 'y',
                          type: 'PrivateName'
                        },
                        kind: 'method',
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: false,
                          body: {
                            body: [
                              {
                                argument: {
                                  left: {
                                    name: 'value',
                                    type: 'Identifier'
                                  },
                                  operator: '*',
                                  right: {
                                    type: 'Literal',
                                    value: 2
                                  },
                                  type: 'BinaryExpression'
                                },
                                type: 'ReturnStatement'
                              }
                            ],
                            type: 'BlockStatement'
                          },
                          generator: false,
                          id: null,
                          params: [
                            {
                              name: 'value',
                              type: 'Identifier'
                            }
                          ],
                          type: 'FunctionExpression'
                        }
                      },
                      {
                        computed: false,
                        decorators: [],
                        key: {
                          name: 'x',
                          type: 'Identifier'
                        },
                        kind: 'method',
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: false,
                          body: {
                            body: [
                              {
                                argument: {
                                  arguments: [
                                    {
                                      type: 'Literal',
                                      value: 84
                                    }
                                  ],
                                  callee: {
                                    computed: false,
                                    object: {
                                      type: 'ThisExpression'
                                    },
                                    property: {
                                      name: 'x',
                                      type: 'PrivateName'
                                    },
                                    type: 'MemberExpression'
                                  },
                                  type: 'CallExpression'
                                },
                                type: 'ReturnStatement'
                              }
                            ],
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
                          name: 'y',
                          type: 'Identifier'
                        },
                        kind: 'method',
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: false,
                          body: {
                            body: [
                              {
                                argument: {
                                  arguments: [
                                    {
                                      type: 'Literal',
                                      value: 43
                                    }
                                  ],
                                  callee: {
                                    computed: false,
                                    object: {
                                      type: 'ThisExpression'
                                    },
                                    property: {
                                      name: 'y',
                                      type: 'PrivateName'
                                    },
                                    type: 'MemberExpression'
                                  },
                                  type: 'CallExpression'
                                },
                                type: 'ReturnStatement'
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
                  id: null,
                  superClass: null,
                  type: 'ClassExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { static set #foo/*{ declareWith }*/(param) {} }`,
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
                    name: 'foo',
                    type: 'PrivateName'
                  },
                  kind: 'set',
                  static: true,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [
                      {
                        name: 'param',
                        type: 'Identifier'
                      }
                    ],
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
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
