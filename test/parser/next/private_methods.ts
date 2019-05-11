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
    // ['class C{ #method() { super.#x(); } }', Context.OptionsNext],
    ['class C { async \\u0023m() {} } }', Context.OptionsNext],
    ['class C { #method() { a() { foo().\\u0023field; } } }', Context.OptionsNext],
    ['class C { #method() { \\u0023field; } }', Context.OptionsNext],
    ['class C {  async \\u0023m() {} }', Context.OptionsNext],
    ['class Foo { *#m () {} }', Context.OptionsNext],
    ['class Spaces { #  wrongSpaces() { return fail(); } }', Context.OptionsNext],
    ['class C{ #method() { #[m] = 1} }', Context.OptionsNext],
    ['class C{ #method() { #"p" = x } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext],
    ['class C{ #method() { super(); } }', Context.OptionsNext]
  ]);

  for (const arg of [
    '#a : 0',
    '#a =',
    '#*a = 0',
    '#*a',
    //'#get a',
    //'#yield a',
    //'#async a = 0',
    //'#async a',
    // "#a; #a",
    // "#a = 1; #a",
    // "#a; #a = 1;",
    '#constructor',
    'static #constructor',
    '#constructor = function() {}',
    '# a = 0',
    // 'async #a() { }',
    // 'async *#a() { }',
    // 'async #*a() { }',
    '#0 = 0;',
    '#0;',
    "#'a' = 0;",
    "#'a';",
    "#['a']",
    "#['a'] = 1",
    '#[a]',
    '#[a] = 1',
    '#a = arguments',
    // 'foo() { delete this.#a }',
    // 'foo() { delete this.x.#a }',
    // 'foo() { delete this.x().#a }',

    // 'foo() { delete f.#a }',
    // 'foo() { delete f.x.#a }',
    // 'foo() { delete f.x().#a }',

    // ASI requires a linebreak
    //'#a b',
    //'#a = 0 b',

    // ASI requires that the next token is not part of any legal production
    '#a = 0\n *b(){}',
    "#a = 0\n ['b'](){}",

    'const { x: x } = this;',
    'var C = class { #x = 1; destructureX() { const { #x: x } = this; } };',

    // Whitespace cases
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

    // Misc cases

    '#x = () => /*{ initializer }*/;',
    '#x = /*{ initializer }*/;',
    '#x = false ? {} : /*{ initializer }*/;',
    '#x = typeof /*{ initializer }*/;',
    ' static #x = /*{ initializer }*/;',
    // '#x = () => arguments;',
    // '#x = () => super();',
    // '#x = super();',
    // '#x = true ? {} : arguments;',
    // '#x = true ? {} : super();',
    // '#x = typeof arguments;',
    // 'static #x = arguments;',

    '#\u0000;',
    '#\u200D_ZWJ;'
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
    '#a, #b',
    '#a = 0;',
    //"#a = 0; #b",
    //   "#a = 0; b",
    '#a = 0; b(){}',
    '#a = 0; *b(){}',
    "#a = 0; ['b'](){}",
    // "#a;",
    '#a; #b;',
    // "#a; b;",
    '#a; b(){}',
    '#a; *b(){}',
    "#a; ['b'](){}",

    // ASI
    '#a = 0\n',
    '#a = 0\n #b',
    //"#a = 0\n b",
    '#a = 0\n b(){}',
    '#a\n',
    '#a\n #b\n',

    //"#a\n b\n",
    '#a\n b(){}',
    '#a\n *b(){}',
    "#a\n ['b'](){}",

    // ASI edge cases
    // "#a\n get",
    '#get\n *a(){}',
    // "#a\n static",

    '#a = function t() { arguments; }',
    '#a = () => function() { arguments; }',

    // Misc edge cases
    '#yield',
    '#yield = 0',
    //"#yield\n a",
    '#async;',
    '#async = 0;',
    '#async',
    '#async = 0',
    '#async\n a(){}', // a field named async, and a method named a.
    '#async\n a',
    '#await;',
    '#await = 0;',
    //"#await\n a",
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }'
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
  pass('Next - Decorators (pass)', [
    [
      `class A { #key }`,
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
      `class A { #a, #b }`,
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
      `class A { #yield }`,
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
      `class A { #foo = bar }`,
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
      `class A { static #key }`,
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
                    id: null,
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
          static #x
          static #y = 1
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
                    expression: false,
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
                    expression: false,
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
      `class A { static set #foo/*{ declareWith }*/(param) {} }`,
      Context.OptionsNext,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
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
