import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - None', () => {
  fail('Statements - If (fail)', [
    // Esprima issue: https://github.com/jquery/esprima/issues/1866
    ['if (true) class C {} else class D {}', Context.None],
    ['if true;', Context.None],
    ['if(!(1))', Context.None],
    ['if(!(true))', Context.None],
    ['if(!("A"))', Context.None],
    ['if (x); else foo: bar: function f(){}', Context.None],
    ['if (false) ; else function* g() {  }', Context.None],
    ['if (true) let x; else let y;', Context.None],
    ['if (false) ; else class C {}', Context.None],
    ['"use strict"; if (true) function f() {  } else function _f() {}', Context.None],
    ['"use strict"; if (true) function f() {  } else function _f() {}', Context.OptionsWebCompat],
    ['if (true) const x = null;', Context.None],
    ['if();', Context.None],
    ['if (1) let x = 10;', Context.None],
    [
      `if({1})
    {
      ;
    }else
    {
      ;
    }`,
      Context.None
    ],
    ['if (a) function(){}', Context.None],
    ['if (a) class A {}', Context.None],
    ['if (true) function* g() {  } else function* _g() {}', Context.None],
    ['if (true) function* g() {  } else ;', Context.None],
    ['if (true) function* g() {  }', Context.None],
    ['if (false) ; else function* g() {  }', Context.None]
  ]);

  pass('Statements - If (pass)', [
    [
      'if (yield === void 0) { async = false; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'yield'
              },
              right: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'Literal',
                  value: 0
                },
                prefix: true
              },
              operator: '==='
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: false
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (await === void 0) { async = false; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'await'
              },
              right: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'Literal',
                  value: 0
                },
                prefix: true
              },
              operator: '==='
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: false
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (async === void 0) { async = false; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'async'
              },
              right: {
                type: 'UnaryExpression',
                operator: 'void',
                argument: {
                  type: 'Literal',
                  value: 0
                },
                prefix: true
              },
              operator: '==='
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: false
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (a) b()',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'b'
                },
                arguments: []
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if(a)b;else c;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'b'
              }
            },
            alternate: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'function f() { if (1) { return () => { while (true) hi(); } } }',
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
                  type: 'IfStatement',
                  test: {
                    type: 'Literal',
                    value: 1
                  },
                  consequent: {
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
                                type: 'WhileStatement',
                                test: {
                                  type: 'Literal',
                                  value: true
                                },
                                body: {
                                  type: 'ExpressionStatement',
                                  expression: {
                                    type: 'CallExpression',
                                    callee: {
                                      type: 'Identifier',
                                      name: 'hi'
                                    },
                                    arguments: []
                                  }
                                }
                              }
                            ]
                          },
                          params: [],

                          async: false,
                          expression: false
                        }
                      }
                    ]
                  },
                  alternate: null
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
      'if (1) { eval(42) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Literal',
              value: 1
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'eval'
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 42
                      }
                    ]
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (true) if (false) {} else ; else {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Literal',
              value: true
            },
            consequent: {
              type: 'IfStatement',
              test: {
                type: 'Literal',
                value: false
              },
              consequent: {
                type: 'BlockStatement',
                body: []
              },
              alternate: {
                type: 'EmptyStatement'
              }
            },
            alternate: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ],
    [
      'if (true) try {} finally {} else {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Literal',
              value: true
            },
            consequent: {
              type: 'TryStatement',
              block: {
                type: 'BlockStatement',
                body: []
              },
              handler: null,
              finalizer: {
                type: 'BlockStatement',
                body: []
              }
            },
            alternate: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ],
    [
      'if(a)b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'a'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'b'
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if(1)/  foo/',
      Context.OptionsWebCompat,
      {
        body: [
          {
            alternate: null,
            consequent: {
              expression: {
                regex: {
                  flags: '',
                  pattern: '  foo'
                },
                type: 'Literal',
                // eslint-disable-next-line no-regex-spaces
                value: /  foo/
              },
              type: 'ExpressionStatement'
            },
            test: {
              type: 'Literal',
              value: 1
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'if (foo) bar;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (foo) a; if (bar) b; else c;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'a'
              }
            },
            alternate: null
          },
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'bar'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'b'
              }
            },
            alternate: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'if (a > 2) {b = c }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Literal',
                value: 2
              },
              operator: '>'
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'c'
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if(foo) a = b;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if(1)/  foo/',
      Context.OptionsWebCompat,
      {
        body: [
          {
            alternate: null,
            consequent: {
              expression: {
                regex: {
                  flags: '',
                  pattern: '  foo'
                },
                type: 'Literal',
                // eslint-disable-next-line no-regex-spaces
                value: /  foo/
              },
              type: 'ExpressionStatement'
            },
            test: {
              type: 'Literal',
              value: 1
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],

    // Should only pass with AnnexB
    [
      'if (a) function a(){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'a'
            },
            consequent: {
              type: 'FunctionDeclaration',
              params: [],
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
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (foo) bar;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'if (foo) bar; else doo;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar'
              }
            },
            alternate: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'doo'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
