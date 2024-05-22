import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Public fields', () => {
  fail('Public fields (fail)', [
    ['class A { "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { x = typeof super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['var C = class { x = () => arguments); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['var C = class { x = () => eval); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    [
      'class C { #m = function() { return "bar"; }; Child = class extends C { access() { return super.#m; } method() { return super.#m(); } } }',
      Context.OptionsWebCompat | Context.OptionsNext
    ],
    [
      'class C { #m = function() { return "bar"; }; Child = class extends C { access = () => super.#m; method = () => super.#m(); } }',
      Context.OptionsWebCompat | Context.OptionsNext
    ],
    ['class A { a, b }', Context.None],
    ['class A { a, b }', Context.OptionsNext]
  ]);

  for (const arg of [
    'static a : 0',
    'static a =',
    'static constructor',
    'static prototype',
    'static *a = 0',
    'static *a',
    'static a = arguments[0]',
    'static c = [1] = [c]',
    'static a = 0\n *b(){}',
    "static a = 0\n ['b'](){}",
    'a : 0',
    'a =',
    'constructor',
    '*a = 0',
    '*a',
    'c = [1] = [c]',
    'a = 0\n *b(){}',
    "a = 0\n ['b'](){}",
    'static prototype',
    'static constructor',
    // 'field = 1 /* no ASI here */ method(){}',
    '#x = false ? {} : arguments;',
    'x = typeof arguments;',
    'x = {} == arguments;',
    'x = false ? {} : arguments;',
    //   'st\\u0061tic m() {}',
    '{ something.#x }',
    'class C { x = () => arguments; }'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    'a = 0;',
    'a = 0; b;',
    'a = 0; b(){}',
    'a = 0; *b(){}',
    "a = 0; ['b'](){}",
    'a;',
    'a; b;',
    'a; b(){}',
    'a; *b(){}',
    "a; ['b'](){}",
    "['a'] = 0;",
    "['a'] = 0; b;",
    "['a'] = 0; b(){}",
    "['a'] = 0; *b(){}",
    "['a'] = 0; ['b'](){}",
    "['a'];",
    "['a']; b;",
    "['a']; b(){}",
    "['a']; *b(){}",
    "['a']; ['b'](){}",
    '0 = 0;',
    '0;',
    "'a' = 0;",
    "'a';",
    'c = [c] = c;',
    'a = 0;\n',
    'a = 0;\n b;',
    'a = 0\n b(){}',
    'a;\n;',
    'a;\n b;\n',
    'a;\n b(){}',
    'a;\n *b(){}',
    "a;\n ['b'](){}",
    "['a'] = 0;\n",
    "['a'] = 0;\n b;",
    "['a'] = 0;\n b(){}",
    "['a'];\n",
    "['a'];\n b;\n",
    "['a'];\n b(){}",
    "['a'];\n *b(){}",
    "['a'];\n ['b'](){}",
    'a;\n get;',
    'get;\n *a(){}',
    'a = function t() { arguments; }',
    'a = () => function() { arguments; }',
    'async;',
    'async = await;',
    'yield;',
    'yield = 0;',
    'yield;\n a;',
    'async;',
    'async = 0;',
    'async;\n a(){}',
    'async;\n a;',
    'await;',
    'await = 0;',
    'await;\n a;',
    `\nx;\ny;\n\n`,
    `static ['constructor'];`,
    `constructor(props) {;([super.client] = props);}`,
    `foo(props) { ;({ client: super.client } = props) }`,
    `constructor(props) {;([super.client] = props);}`,
    `constructor(props) {;({ x, ...super.client } = props)}`,
    `#client
    constructor(props) {;([this.#client] = props);}`,
    `constructor(props) {;({ x, ...super.x } = props)}`, //
    `#x
    constructor(props) {;([this.#x] = props);}`,
    `#x
     constructor(props) {
      this.#x = 1;
      ;([this.x = this.#x, this.#x, this.y = this.#x] = props);
    }`,
    `#x
    constructor(props) { ;([this.#x] = props); }
    getx() { return this.#x; }`,
    `#x
    constructor(props) { let x;  ;([x, ...this.#x] = props); }`,
    `#x
    constructor(props) {;([x, ...this.#x] = props); }`,
    `#x
    constructor(props) {;({ x: this.#x } = props)}`,
    `#x
    constructor(props) {;({ x: this.#x } = props)}`,
    `#x
    constructor(props) {;([x, ...super.x] = props);}`,
    `#x
    constructor(props) {;([super.x] = props);}`,
    `#x
    constructor(props) { ;([this.#x] = props); }
    getx() { this.#x = 'foo'; ;({ x: this.x = this.#x, y: this.#x, z: this.z = this.#x } = props) }`
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  pass('Next - Public fields (pass)', [
    [
      `var C = class { static async #prototype() {} };`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'C',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  type: 'Identifier'
                },
                init: {
                  body: {
                    body: [
                      {
                        computed: false,
                        decorators: [],
                        key: {
                          name: 'prototype',
                          start: 23,
                          end: 39,
                          range: [23, 39],
                          type: 'PrivateIdentifier'
                        },
                        kind: 'method',
                        start: 16,
                        end: 44,
                        range: [16, 44],
                        static: true,
                        type: 'MethodDefinition',
                        value: {
                          async: true,
                          body: {
                            body: [],
                            start: 42,
                            end: 44,
                            range: [42, 44],
                            type: 'BlockStatement'
                          },
                          generator: false,
                          id: null,
                          params: [],
                          start: 39,
                          end: 44,
                          range: [39, 44],
                          type: 'FunctionExpression'
                        }
                      }
                    ],
                    start: 14,
                    end: 46,
                    range: [14, 46],
                    type: 'ClassBody'
                  },
                  decorators: [],
                  id: null,
                  start: 8,
                  end: 46,
                  range: [8, 46],
                  superClass: null,
                  type: 'ClassExpression'
                },
                start: 4,
                end: 46,
                range: [4, 46],
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            start: 0,
            end: 47,
            range: [0, 47],
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 47,
        range: [0, 47],
        type: 'Program'
      }
    ],
    [
      `class Foo { x = 1; }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            decorators: [],
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'Foo',
              start: 6,
              end: 9,
              range: [6, 9]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'x',
                    start: 12,
                    end: 13,
                    range: [12, 13]
                  },
                  value: {
                    type: 'Literal',
                    value: 1,
                    start: 16,
                    end: 17,
                    range: [16, 17]
                  },
                  decorators: [],
                  computed: false,
                  static: false,
                  start: 12,
                  end: 17,
                  range: [12, 17]
                }
              ],
              start: 10,
              end: 20,
              range: [10, 20]
            },
            start: 0,
            end: 20,
            range: [0, 20]
          }
        ],
        start: 0,
        end: 20,
        range: [0, 20]
      }
    ],
    [
      `class A { set; }`,
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
                  type: 'PropertyDefinition',
                  key: {
                    type: 'Identifier',
                    name: 'set',
                    start: 10,
                    end: 13,
                    range: [10, 13]
                  },
                  decorators: [],
                  value: null,
                  computed: false,
                  static: false,
                  start: 10,
                  end: 13,
                  range: [10, 13]
                }
              ],
              start: 8,
              end: 16,
              range: [8, 16]
            },
            start: 0,
            end: 16,
            range: [0, 16]
          }
        ],
        start: 0,
        end: 16,
        range: [0, 16]
      }
    ],
    [
      `class A { set = get; }`,
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
                    name: 'set',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    name: 'get',
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
      `const createClass = (k) => class { [k()] = 2 };`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'ClassExpression',
                    decorators: [],
                    id: null,
                    superClass: null,
                    body: {
                      type: 'ClassBody',
                      body: [
                        {
                          type: 'PropertyDefinition',
                          decorators: [],
                          key: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'k',
                              start: 36,
                              end: 37,
                              range: [36, 37]
                            },
                            arguments: [],
                            start: 36,
                            end: 39,
                            range: [36, 39]
                          },
                          value: {
                            type: 'Literal',
                            value: 2,
                            start: 43,
                            end: 44,
                            range: [43, 44]
                          },
                          computed: true,
                          static: false,
                          start: 35,
                          end: 44,
                          range: [35, 44]
                        }
                      ],
                      start: 33,
                      end: 46,
                      range: [33, 46]
                    },
                    start: 27,
                    end: 46,
                    range: [27, 46]
                  },
                  params: [
                    {
                      type: 'Identifier',
                      name: 'k',
                      start: 21,
                      end: 22,
                      range: [21, 22]
                    }
                  ],
                  async: false,
                  expression: true,
                  start: 20,
                  end: 46,
                  range: [20, 46]
                },
                id: {
                  type: 'Identifier',
                  name: 'createClass',
                  start: 6,
                  end: 17,
                  range: [6, 17]
                },
                start: 6,
                end: 46,
                range: [6, 46]
              }
            ],
            start: 0,
            end: 47,
            range: [0, 47]
          }
        ],
        start: 0,
        end: 47,
        range: [0, 47]
      }
    ],
    [
      `class A { a = 0; }`,
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
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
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
      `class A { ;;;;;;[x] = 42; [10] = "meep"; ["not initialized"];;;;;;; }`,
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
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'x',
                    start: 17,
                    end: 18,
                    range: [17, 18]
                  },
                  value: {
                    type: 'Literal',
                    value: 42,
                    start: 22,
                    end: 24,
                    range: [22, 24]
                  },
                  computed: true,
                  static: false,
                  start: 16,
                  end: 24,
                  range: [16, 24]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 10,
                    start: 27,
                    end: 29,
                    range: [27, 29]
                  },
                  value: {
                    type: 'Literal',
                    value: 'meep',
                    start: 33,
                    end: 39,
                    range: [33, 39]
                  },
                  computed: true,
                  static: false,
                  start: 26,
                  end: 39,
                  range: [26, 39]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'not initialized',
                    start: 42,
                    end: 59,
                    range: [42, 59]
                  },
                  value: null,
                  computed: true,
                  static: false,
                  start: 41,
                  end: 60,
                  range: [41, 60]
                }
              ],
              start: 8,
              end: 69,
              range: [8, 69]
            },
            start: 0,
            end: 69,
            range: [0, 69]
          }
        ],
        start: 0,
        end: 69,
        range: [0, 69]
      }
    ],
    [
      `{ class X { static p = function() { return arguments[0]; } } }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                decorators: [],
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 8,
                  end: 9,
                  range: [8, 9]
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: [
                    {
                      type: 'PropertyDefinition',
                      decorators: [],
                      key: {
                        type: 'Identifier',
                        name: 'p',
                        start: 19,
                        end: 20,
                        range: [19, 20]
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
                                  type: 'Identifier',
                                  name: 'arguments',
                                  start: 43,
                                  end: 52,
                                  range: [43, 52]
                                },
                                computed: true,
                                property: {
                                  type: 'Literal',
                                  value: 0,
                                  start: 53,
                                  end: 54,
                                  range: [53, 54]
                                },
                                start: 43,
                                end: 55,
                                range: [43, 55]
                              },
                              start: 36,
                              end: 56,
                              range: [36, 56]
                            }
                          ],
                          start: 34,
                          end: 58,
                          range: [34, 58]
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 23,
                        end: 58,
                        range: [23, 58]
                      },
                      computed: false,
                      static: true,
                      start: 19,
                      end: 58,
                      range: [19, 58]
                    }
                  ],
                  start: 10,
                  end: 60,
                  range: [10, 60]
                },
                start: 2,
                end: 60,
                range: [2, 60]
              }
            ],
            start: 0,
            end: 62,
            range: [0, 62]
          }
        ],
        start: 0,
        end: 62,
        range: [0, 62]
      }
    ],
    [
      `class A { ['a'] = 0; b; }`,
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
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'a',
                    start: 11,
                    end: 14,
                    range: [11, 14]
                  },
                  value: {
                    type: 'Literal',
                    value: 0,
                    start: 18,
                    end: 19,
                    range: [18, 19]
                  },
                  computed: true,
                  static: false,
                  start: 10,
                  end: 19,
                  range: [10, 19]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'b',
                    start: 21,
                    end: 22,
                    range: [21, 22]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 21,
                  end: 22,
                  range: [21, 22]
                }
              ],
              start: 8,
              end: 25,
              range: [8, 25]
            },
            start: 0,
            end: 25,
            range: [0, 25]
          }
        ],
        start: 0,
        end: 25,
        range: [0, 25]
      }
    ],
    [
      'class Some { render=( )=>{ return null; }}',
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
              name: 'Some',
              start: 6,
              end: 10,
              range: [6, 10]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'render',
                    start: 13,
                    end: 19,
                    range: [13, 19]
                  },
                  value: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Literal',
                            value: null,
                            start: 34,
                            end: 38,
                            range: [34, 38]
                          },
                          start: 27,
                          end: 39,
                          range: [27, 39]
                        }
                      ],
                      start: 25,
                      end: 41,
                      range: [25, 41]
                    },
                    params: [],
                    async: false,
                    expression: false,
                    start: 20,
                    end: 41,
                    range: [20, 41]
                  },
                  computed: false,
                  static: false,
                  start: 13,
                  end: 41,
                  range: [13, 41]
                }
              ],
              start: 11,
              end: 42,
              range: [11, 42]
            },
            start: 0,
            end: 42,
            range: [0, 42]
          }
        ],
        start: 0,
        end: 42,
        range: [0, 42]
      }
    ],
    [
      `{
        class X {
          static p = function() { return arguments[0]; }
        }
      }

      {
        class X {
          static t = () => {
            function p() { return arguments[0]; };
            return p;
          }
        }

        let p = X.t();
      }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 16,
                  end: 17,
                  range: [16, 17]
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
                        name: 'p',
                        start: 37,
                        end: 38,
                        range: [37, 38]
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
                                  type: 'Identifier',
                                  name: 'arguments',
                                  start: 61,
                                  end: 70,
                                  range: [61, 70]
                                },
                                computed: true,
                                property: {
                                  type: 'Literal',
                                  value: 0,
                                  start: 71,
                                  end: 72,
                                  range: [71, 72]
                                },
                                start: 61,
                                end: 73,
                                range: [61, 73]
                              },
                              start: 54,
                              end: 74,
                              range: [54, 74]
                            }
                          ],
                          start: 52,
                          end: 76,
                          range: [52, 76]
                        },
                        async: false,
                        generator: false,
                        id: null,
                        start: 41,
                        end: 76,
                        range: [41, 76]
                      },
                      static: true,
                      computed: false,
                      decorators: [],
                      start: 37,
                      end: 76,
                      range: [37, 76]
                    }
                  ],
                  start: 18,
                  end: 86,
                  range: [18, 86]
                },
                start: 10,
                end: 86,
                range: [10, 86]
              }
            ],
            start: 0,
            end: 94,
            range: [0, 94]
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ClassDeclaration',
                id: {
                  type: 'Identifier',
                  name: 'X',
                  start: 118,
                  end: 119,
                  range: [118, 119]
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
                        name: 't',
                        start: 139,
                        end: 140,
                        range: [139, 140]
                      },
                      value: {
                        type: 'ArrowFunctionExpression',
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
                                    type: 'ReturnStatement',
                                    argument: {
                                      type: 'MemberExpression',
                                      object: {
                                        type: 'Identifier',
                                        name: 'arguments',
                                        start: 185,
                                        end: 194,
                                        range: [185, 194]
                                      },
                                      computed: true,
                                      property: {
                                        type: 'Literal',
                                        value: 0,
                                        start: 195,
                                        end: 196,
                                        range: [195, 196]
                                      },
                                      start: 185,
                                      end: 197,
                                      range: [185, 197]
                                    },
                                    start: 178,
                                    end: 198,
                                    range: [178, 198]
                                  }
                                ],
                                start: 176,
                                end: 200,
                                range: [176, 200]
                              },
                              async: false,
                              generator: false,
                              id: {
                                type: 'Identifier',
                                name: 'p',
                                start: 172,
                                end: 173,
                                range: [172, 173]
                              },
                              start: 163,
                              end: 200,
                              range: [163, 200]
                            },
                            {
                              type: 'EmptyStatement',
                              start: 200,
                              end: 201,
                              range: [200, 201]
                            },
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'Identifier',
                                name: 'p',
                                start: 221,
                                end: 222,
                                range: [221, 222]
                              },
                              start: 214,
                              end: 223,
                              range: [214, 223]
                            }
                          ],
                          start: 149,
                          end: 235,
                          range: [149, 235]
                        },
                        params: [],
                        async: false,
                        expression: false,
                        start: 143,
                        end: 235,
                        range: [143, 235]
                      },
                      static: true,
                      computed: false,
                      decorators: [],
                      start: 139,
                      end: 235,
                      range: [139, 235]
                    }
                  ],
                  start: 120,
                  end: 245,
                  range: [120, 245]
                },
                start: 112,
                end: 245,
                range: [112, 245]
              },
              {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    init: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'X',
                          start: 263,
                          end: 264,
                          range: [263, 264]
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 't',
                          start: 265,
                          end: 266,
                          range: [265, 266]
                        },
                        start: 263,
                        end: 266,
                        range: [263, 266]
                      },
                      arguments: [],
                      start: 263,
                      end: 268,
                      range: [263, 268]
                    },
                    id: {
                      type: 'Identifier',
                      name: 'p',
                      start: 259,
                      end: 260,
                      range: [259, 260]
                    },
                    start: 259,
                    end: 268,
                    range: [259, 268]
                  }
                ],
                start: 255,
                end: 269,
                range: [255, 269]
              }
            ],
            start: 102,
            end: 277,
            range: [102, 277]
          }
        ],
        start: 0,
        end: 277,
        range: [0, 277]
      }
    ],
    [
      'class X { static p = eval("(function() { return arguments[0]; })(1)"); }',
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
                    name: 'p',
                    type: 'Identifier'
                  },
                  static: true,
                  type: 'PropertyDefinition',
                  value: {
                    arguments: [
                      {
                        type: 'Literal',
                        value: '(function() { return arguments[0]; })(1)'
                      }
                    ],
                    callee: {
                      name: 'eval',
                      type: 'Identifier'
                    },
                    type: 'CallExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'X',
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
      'class Some { render=(a,b)=>{ return null; } }',
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
                    name: 'render',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          argument: {
                            type: 'Literal',
                            value: null
                          },
                          type: 'ReturnStatement'
                        }
                      ],
                      type: 'BlockStatement'
                    },
                    expression: false,
                    params: [
                      {
                        name: 'a',
                        type: 'Identifier'
                      },
                      {
                        name: 'b',
                        type: 'Identifier'
                      }
                    ],
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'Some',
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
      `class A {  ;;;; ;;;;;;'a'; "b"; 'c' = 39;  "d" = 42;;;;;;;  ;;;; }`,
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
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'a',
                    start: 22,
                    end: 25,
                    range: [22, 25]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 22,
                  end: 25,
                  range: [22, 25]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'b',
                    start: 27,
                    end: 30,
                    range: [27, 30]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 27,
                  end: 30,
                  range: [27, 30]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'c',
                    start: 32,
                    end: 35,
                    range: [32, 35]
                  },
                  value: {
                    type: 'Literal',
                    value: 39,
                    start: 38,
                    end: 40,
                    range: [38, 40]
                  },
                  computed: false,
                  static: false,
                  start: 32,
                  end: 40,
                  range: [32, 40]
                },
                {
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Literal',
                    value: 'd',
                    start: 43,
                    end: 46,
                    range: [43, 46]
                  },
                  value: {
                    type: 'Literal',
                    value: 42,
                    start: 49,
                    end: 51,
                    range: [49, 51]
                  },
                  computed: false,
                  static: false,
                  start: 43,
                  end: 51,
                  range: [43, 51]
                }
              ],
              start: 8,
              end: 66,
              range: [8, 66]
            },
            start: 0,
            end: 66,
            range: [0, 66]
          }
        ],
        start: 0,
        end: 66,
        range: [0, 66]
      }
    ],
    [
      `class A { foo; }`,
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
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'foo',
                    start: 10,
                    end: 13,
                    range: [10, 13]
                  },
                  value: null,
                  computed: false,
                  static: false,
                  start: 10,
                  end: 13,
                  range: [10, 13]
                }
              ],
              start: 8,
              end: 16,
              range: [8, 16]
            },
            start: 0,
            end: 16,
            range: [0, 16]
          }
        ],
        start: 0,
        end: 16,
        range: [0, 16]
      }
    ],
    [
      `class A { a = b = c }`,
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
                  type: 'PropertyDefinition',
                  decorators: [],
                  key: {
                    type: 'Identifier',
                    name: 'a',
                    start: 10,
                    end: 11,
                    range: [10, 11]
                  },
                  value: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    start: 14,
                    end: 19,
                    range: [14, 19],
                    left: {
                      type: 'Identifier',
                      name: 'b',
                      start: 14,
                      end: 15,
                      range: [14, 15]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'c',
                      start: 18,
                      end: 19,
                      range: [18, 19]
                    }
                  },
                  computed: false,
                  static: false,
                  start: 10,
                  end: 19,
                  range: [10, 19]
                }
              ],
              start: 8,
              end: 21,
              range: [8, 21]
            },
            start: 0,
            end: 21,
            range: [0, 21]
          }
        ],
        start: 0,
        end: 21,
        range: [0, 21]
      }
    ],
    [
      `class A { a = b += c }`,
      Context.OptionsNext | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 20,
                  key: {
                    end: 11,
                    name: 'a',
                    range: [10, 11],
                    start: 10,
                    type: 'Identifier'
                  },
                  range: [10, 20],
                  start: 10,
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    end: 20,
                    left: {
                      end: 15,
                      name: 'b',
                      range: [14, 15],
                      start: 14,
                      type: 'Identifier'
                    },
                    operator: '+=',
                    range: [14, 20],
                    right: {
                      end: 20,
                      name: 'c',
                      range: [19, 20],
                      start: 19,
                      type: 'Identifier'
                    },
                    start: 14,
                    type: 'AssignmentExpression'
                  }
                }
              ],
              end: 22,
              range: [8, 22],
              start: 8,
              type: 'ClassBody'
            },
            decorators: [],
            end: 22,
            id: {
              end: 7,
              name: 'A',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 22],
            start: 0,
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        end: 22,
        range: [0, 22],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ]
  ]);
});
