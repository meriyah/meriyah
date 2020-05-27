import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - New target', () => {
  for (const arg of [
    'new.target',
    '{ new.target }',
    '() => new.target',
    'if (1) { new.target }',
    'if (1) {} else { new.target }',
    'while (0) { new.target }',
    'do { new.target } while (0)',
    'new new .target',
    'function f(x=() => new."target") {}',
    'new.target',
    'function f(){ new.foo }',
    '_ => new.target',
    '_ => _ => _ => _ => new.target',
    'function f(){ new.target = foo }',
    'function f(){ new.target-- }',
    '(f=new.target) => {}',
    `new await foo;`,
    `() => new.target`
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `function foo() { return new['target']; }`,
    'function foo(){with({}) {new.target;}}',
    'function foo(){{if(true){new.target;}}}',
    'function foo(){ var x = function() {new.target;}; x();}',
    'function foo(){ var o = { "foo" : function () { new.target}}; o.foo();}',
    `function f(x=() => new.target) {}`,
    'function x(){""[new.target]}',
    'function foo(){with({}) {new.target;}}',
    'function foo() { function parent(x) { new x();}; function child(){ with(new.target) {toString();}}; parent(child); }',
    'function a(){try { throw Error;} catch(e){new.target;}}',
    'function a(){var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}',
    'function a(){var x = function() {new.target;}; x();}',
    'function a(){var o = { "foo" : function () { new.target}}; o.foo();}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
  }

  for (const arg of [
    'new.target',
    '{ new.target }',
    '() => { new.target }',
    '() => new.target',
    'if (1) { new.target }',
    'if (1) {} else { new.target }',
    'while (0) { new.target }',
    'do { new.target } while (0)',
    'function a(b = new.target){}',
    'class C {get x() { { new.target } }}',
    'class C {get x() { () => new.target }}',
    'class C {get x() { do { new.target } while (0) }}',
    'function f() { new.target }',
    'function f() { () => new.target }',
    'function f() { if (1) { new.target } }',
    'function f() { while (0) { new.target } }',
    'function f() { do { new.target } while (0) }',
    `function a(){{if(true){new.target;}}}`,
    `function abc(){ var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}`,
    `function a(){ var o = { "foo" : function () { new.target}}; o.foo();}`,
    '({ set a(b = new.target){} })',
    '(function a(b = new.target){})',
    'function f() { let x = new.target; }',
    'function f() { new new.target()(); }',
    'function f() { new.target(); }'
  ]) {
    it(`function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`'use strict'; function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`var f = function() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`var f = function() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`({set x(_) {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({set x(_) {${arg}}})`, undefined, Context.OptionsNext);
      });
    });

    it(`'use strict'; ({get x() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({get x() {${arg}}})`, undefined, Context.None);
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`'use strict'; ({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`class C {m() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {m() {${arg}}}`, undefined, Context.None);
      });
    });

    it(`class C {set x(_) {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {set x(_) {${arg}}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
  }

  pass('Expressions - New target (pass)', [
    [
      'class C {set x(_) {do { new.target } while (0)}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
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
                  kind: 'set',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'x'
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
                      body: [
                        {
                          type: 'DoWhileStatement',
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  meta: {
                                    type: 'Identifier',
                                    name: 'new'
                                  },
                                  type: 'MetaProperty',
                                  property: {
                                    type: 'Identifier',
                                    name: 'target'
                                  }
                                }
                              }
                            ]
                          },
                          test: {
                            type: 'Literal',
                            value: 0
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
      'function f(){ new new .target; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    type: 'NewExpression',
                    callee: {
                      meta: {
                        type: 'Identifier',
                        name: 'new'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'target'
                      }
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
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ new.target }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    meta: {
                      type: 'Identifier',
                      name: 'new'
                    },
                    type: 'MetaProperty',
                    property: {
                      type: 'Identifier',
                      name: 'target'
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ new . target }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 28,
            range: [0, 28],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 28,
              range: [12, 28],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 26,
                  range: [14, 26],
                  expression: {
                    type: 'MetaProperty',
                    start: 14,
                    end: 26,
                    range: [14, 26],
                    meta: {
                      type: 'Identifier',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      name: 'new'
                    },
                    property: {
                      type: 'Identifier',
                      start: 20,
                      end: 26,
                      range: [20, 26],
                      name: 'target'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ return _ => new.target }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 38,
        range: [0, 38],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 38,
            range: [0, 38],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 38,
              range: [12, 38],
              body: [
                {
                  type: 'ReturnStatement',
                  start: 14,
                  end: 36,
                  range: [14, 36],
                  argument: {
                    type: 'ArrowFunctionExpression',
                    start: 21,
                    end: 36,
                    range: [21, 36],
                    expression: true,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 21,
                        end: 22,
                        range: [21, 22],
                        name: '_'
                      }
                    ],
                    body: {
                      type: 'MetaProperty',
                      start: 26,
                      end: 36,
                      range: [26, 36],
                      meta: {
                        type: 'Identifier',
                        start: 26,
                        end: 29,
                        range: [26, 29],
                        name: 'new'
                      },
                      property: {
                        type: 'Identifier',
                        start: 30,
                        end: 36,
                        range: [30, 36],
                        name: 'target'
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ _ => _ => new.target }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        range: [0, 36],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 36,
            range: [0, 36],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 36,
              range: [12, 36],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 34,
                  range: [14, 34],
                  expression: {
                    type: 'ArrowFunctionExpression',
                    start: 14,
                    end: 34,
                    range: [14, 34],
                    expression: true,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: '_'
                      }
                    ],
                    body: {
                      type: 'ArrowFunctionExpression',
                      start: 19,
                      end: 34,
                      range: [19, 34],
                      expression: true,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          range: [19, 20],
                          name: '_'
                        }
                      ],
                      body: {
                        type: 'MetaProperty',
                        start: 24,
                        end: 34,
                        range: [24, 34],
                        meta: {
                          type: 'Identifier',
                          start: 24,
                          end: 27,
                          range: [24, 27],
                          name: 'new'
                        },
                        property: {
                          type: 'Identifier',
                          start: 28,
                          end: 34,
                          range: [28, 34],
                          name: 'target'
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '_ => function(){ new.target }',
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
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        meta: {
                          type: 'Identifier',
                          name: 'new'
                        },
                        type: 'MetaProperty',
                        property: {
                          type: 'Identifier',
                          name: 'target'
                        }
                      }
                    }
                  ]
                },
                async: false,
                generator: false,
                id: null
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
        ]
      }
    ],
    [
      'function f(){ new.target + foo }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    type: 'BinaryExpression',
                    left: {
                      meta: {
                        type: 'Identifier',
                        name: 'new'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'target'
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ foo + new.target }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    right: {
                      meta: {
                        type: 'Identifier',
                        name: 'new'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'target'
                      }
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ foo = new.target }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
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
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    operator: '=',
                    right: {
                      meta: {
                        type: 'Identifier',
                        name: 'new'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'target'
                      }
                    }
                  }
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'foo({bar(){ new.target }})',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
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
                                meta: {
                                  type: 'Identifier',
                                  name: 'new'
                                },
                                type: 'MetaProperty',
                                property: {
                                  type: 'Identifier',
                                  name: 'target'
                                }
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class X { constructor() { new.target }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 39,
            range: [0, 39],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'X'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 39,
              range: [8, 39],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 38,
                  range: [10, 38],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 38,
                    range: [21, 38],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 24,
                      end: 38,
                      range: [24, 38],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 26,
                          end: 36,
                          range: [26, 36],
                          expression: {
                            type: 'MetaProperty',
                            start: 26,
                            end: 36,
                            range: [26, 36],
                            meta: {
                              type: 'Identifier',
                              start: 26,
                              end: 29,
                              range: [26, 29],
                              name: 'new'
                            },
                            property: {
                              type: 'Identifier',
                              start: 30,
                              end: 36,
                              range: [30, 36],
                              name: 'target'
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'class X { foo() { new.target }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'X'
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
                            meta: {
                              type: 'Identifier',
                              name: 'new'
                            },
                            type: 'MetaProperty',
                            property: {
                              type: 'Identifier',
                              name: 'target'
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
      'class X { static foo() { new.target }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'X'
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
                            meta: {
                              type: 'Identifier',
                              name: 'new'
                            },
                            type: 'MetaProperty',
                            property: {
                              type: 'Identifier',
                              name: 'target'
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
      'function f(f=new.target){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'f'
                },
                right: {
                  meta: {
                    type: 'Identifier',
                    name: 'new'
                  },
                  type: 'MetaProperty',
                  property: {
                    type: 'Identifier',
                    name: 'target'
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'foo(function f(f=new.target){})',
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
                  type: 'FunctionExpression',
                  params: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      right: {
                        meta: {
                          type: 'Identifier',
                          name: 'new'
                        },
                        type: 'MetaProperty',
                        property: {
                          type: 'Identifier',
                          name: 'target'
                        }
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,

                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({foo(x=new.target){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          meta: {
                            type: 'Identifier',
                            name: 'new'
                          },
                          type: 'MetaProperty',
                          property: {
                            type: 'Identifier',
                            name: 'target'
                          }
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      'class A {constructor(x=new.target){}}',
      Context.None,
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
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          meta: {
                            type: 'Identifier',
                            name: 'new'
                          },
                          type: 'MetaProperty',
                          property: {
                            type: 'Identifier',
                            name: 'target'
                          }
                        }
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
      'class A {a(x=new.target){}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 27,
            range: [0, 27],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'A'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 27,
              range: [8, 27],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 9,
                  end: 26,
                  range: [9, 26],
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 10,
                    end: 26,
                    range: [10, 26],
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: 'AssignmentPattern',
                        start: 11,
                        end: 23,
                        range: [11, 23],
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'x'
                        },
                        right: {
                          type: 'MetaProperty',
                          start: 13,
                          end: 23,
                          range: [13, 23],
                          meta: {
                            type: 'Identifier',
                            start: 13,
                            end: 16,
                            range: [13, 16],
                            name: 'new'
                          },
                          property: {
                            type: 'Identifier',
                            start: 17,
                            end: 23,
                            range: [17, 23],
                            name: 'target'
                          }
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 24,
                      end: 26,
                      range: [24, 26],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ [...new.target] }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        range: [0, 31],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 31,
            range: [0, 31],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 31,
              range: [12, 31],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 29,
                  range: [14, 29],
                  expression: {
                    type: 'ArrayExpression',
                    start: 14,
                    end: 29,
                    range: [14, 29],
                    elements: [
                      {
                        type: 'SpreadElement',
                        start: 15,
                        end: 28,
                        range: [15, 28],
                        argument: {
                          type: 'MetaProperty',
                          start: 18,
                          end: 28,
                          range: [18, 28],
                          meta: {
                            type: 'Identifier',
                            start: 18,
                            end: 21,
                            range: [18, 21],
                            name: 'new'
                          },
                          property: {
                            type: 'Identifier',
                            start: 22,
                            end: 28,
                            range: [22, 28],
                            name: 'target'
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ class x extends new.target {} }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 45,
        range: [0, 45],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 45,
            range: [0, 45],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 45,
              range: [12, 45],
              body: [
                {
                  type: 'ClassDeclaration',
                  start: 14,
                  end: 43,
                  range: [14, 43],
                  id: {
                    type: 'Identifier',
                    start: 20,
                    end: 21,
                    range: [20, 21],
                    name: 'x'
                  },
                  superClass: {
                    type: 'MetaProperty',
                    start: 30,
                    end: 40,
                    range: [30, 40],
                    meta: {
                      type: 'Identifier',
                      start: 30,
                      end: 33,
                      range: [30, 33],
                      name: 'new'
                    },
                    property: {
                      type: 'Identifier',
                      start: 34,
                      end: 40,
                      range: [34, 40],
                      name: 'target'
                    }
                  },
                  body: {
                    type: 'ClassBody',
                    start: 41,
                    end: 43,
                    range: [41, 43],
                    body: []
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ x({[new.target]:y}) }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        range: [0, 35],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 35,
            range: [0, 35],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 35,
              range: [12, 35],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 33,
                  range: [14, 33],
                  expression: {
                    type: 'CallExpression',
                    start: 14,
                    end: 33,
                    range: [14, 33],
                    callee: {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'x'
                    },
                    arguments: [
                      {
                        type: 'ObjectExpression',
                        start: 16,
                        end: 32,
                        range: [16, 32],
                        properties: [
                          {
                            type: 'Property',
                            start: 17,
                            end: 31,
                            range: [17, 31],
                            method: false,
                            shorthand: false,
                            computed: true,
                            key: {
                              type: 'MetaProperty',
                              start: 18,
                              end: 28,
                              range: [18, 28],
                              meta: {
                                type: 'Identifier',
                                start: 18,
                                end: 21,
                                range: [18, 21],
                                name: 'new'
                              },
                              property: {
                                type: 'Identifier',
                                start: 22,
                                end: 28,
                                range: [22, 28],
                                name: 'target'
                              }
                            },
                            value: {
                              type: 'Identifier',
                              start: 30,
                              end: 31,
                              range: [30, 31],
                              name: 'y'
                            },
                            kind: 'init'
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function a(b = new.target){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  meta: {
                    type: 'Identifier',
                    name: 'new'
                  },
                  type: 'MetaProperty',
                  property: {
                    type: 'Identifier',
                    name: 'target'
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ]
  ]);
});
