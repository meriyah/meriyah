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
            expression: false,
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
            expression: false,
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
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ return _ => new.target }',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  argument: {
                    async: false,
                    body: {
                      meta: {
                        name: 'new',
                        type: 'Identifier'
                      },
                      property: {
                        name: 'target',
                        type: 'Identifier'
                      },
                      type: 'MetaProperty'
                    },
                    expression: true,
                    id: null,
                    params: [
                      {
                        name: '_',
                        type: 'Identifier'
                      }
                    ],
                    type: 'ArrowFunctionExpression'
                  },
                  type: 'ReturnStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: false,
            expression: false,
            id: {
              name: 'f',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'function f(){ _ => _ => new.target }',
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
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'ArrowFunctionExpression',
                      body: {
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
                      params: [
                        {
                          type: 'Identifier',
                          name: '_'
                        }
                      ],
                      id: null,
                      async: false,
                      expression: true
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: '_'
                      }
                    ],
                    id: null,
                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
                expression: false,
                generator: false,
                id: null
              },
              params: [
                {
                  type: 'Identifier',
                  name: '_'
                }
              ],
              id: null,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                  expression: false,
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
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'a'
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
      'function f(){ [...new.target] }',
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
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'SpreadElement',
                        argument: {
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
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ class x extends new.target {} }',
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
                  type: 'ClassDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  superClass: {
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
                  body: {
                    type: 'ClassBody',
                    body: []
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(){ x({[new.target]:y}) }',
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
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
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
            expression: false,
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
