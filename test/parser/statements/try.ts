import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Statements - Try', () => {
  fail('Statements - Try (fail)', [
    ['function f() { try {}  }', Context.None],
    ['try {} catch(x, f){}', Context.None],
    ['try {} catch(x = b){}', Context.None],
    ['try {} catch(x,){}', Context.None],
    ['try {} catch({x},){}', Context.None],
    ['try {} catch({x}=x){}', Context.None],
    ['try {} catch([x],){}', Context.None],
    ['try {} catch(e=x){}', Context.None],
    ['try {} catch([e]=x){}', Context.None],
    ['try { }', Context.None],
    ['try { } foo();', Context.None],
    ['try { } catch (e) foo();', Context.None],
    ['try { } finally foo();', Context.None],
    ['try { throw []; } catch ([...[ x ] = []]) {}', Context.None],
    ['try { throw []; } catch ([...x = []]) {}', Context.None],
    ['try { throw [1, 2, 3]; } catch ([...{ x }, y]) {}', Context.None],
    ['try { throw [1, 2, 3]; } catch ([...[x], y]) { }', Context.None],
    ['try {} catch ({foo = "bar"} = {}) {}', Context.None],
    ['try {} catch [] {}', Context.None],
    ['try {} catch foo {}', Context.None],
    ['try {} catch({e},){}', Context.None],
    ['try {} catch(){}', Context.None]
  ]);

  for (const binding of ['var e', 'var {e}', 'var {f, e}', 'var [e]', 'var {f:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
        try {
          throw 0;
        } catch (x) {
          for (${binding} of []);
        }
      `,
          undefined,
          Context.Strict
        );
      });
    });
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
          try {
            throw 0;
          } catch (x) {
            for (${binding} of []);
          }
        `,
          undefined,
          Context.OptionsWebCompat
        );
      });
    });
  }

  // Check that the above applies even for nested catches.
  for (const binding of ['var e', 'var {e}', 'var {g, e}', 'var [e]', 'var {g:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (x) {
        try {
          throw 1;
        } catch (f) {
          try {
            throw 2;
          } catch ({}) {
            for (${binding} of []);
          }
        }
      }
    `,
          undefined,
          Context.OptionsWebCompat
        );
      });
    });
  }

  // Check that the above applies if a declaration scope is between the
  // catch and the loop.
  for (const binding of ['var e', 'var {e}', 'var {f, e}', 'var [e]', 'var {f:e}', 'var [[[], e]]']) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (x) {
        (()=>{for (${binding} of []);})();
      }
    `,
          undefined,
          Context.OptionsWebCompat
        );
      });
    });

    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
    try {
      throw 0;
    } catch (x) {
      (function() {
        for (${binding} of []);
      })();
    }
  `,
          undefined,
          Context.OptionsWebCompat
        );
      });
    });
  }

  // Check that there is no error when not declaring a var named e.
  for (const binding of [
    'var f',
    'var {}',
    'var {x:f}',
    'x',
    '{x}',
    'let x',
    'const x',
    'let {x}',
    'const {x}',
    'let [x]',
    'const [x]',
    'let {x:y}',
    'const {x:y}'
  ]) {
    it(`${binding}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `
      try {
        throw 0;
      } catch (e) {
        for (${binding} of []);
      }
    `,
          undefined,
          Context.OptionsWebCompat
        );
      });
    });
  }

  pass('Statements - Try (pass)', [
    [
      'try {} catch(e){}',
      Context.OptionsWebCompat,
      {
        body: [
          {
            block: {
              body: [],
              type: 'BlockStatement'
            },
            finalizer: null,
            handler: {
              body: {
                body: [],
                type: 'BlockStatement'
              },
              param: {
                name: 'e',
                type: 'Identifier'
              },
              type: 'CatchClause'
            },
            type: 'TryStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'try { } catch (e) { foo: bar: third: function f(){} }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'LabeledStatement',
                    label: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    body: {
                      type: 'LabeledStatement',
                      label: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      body: {
                        type: 'LabeledStatement',
                        label: {
                          type: 'Identifier',
                          name: 'third'
                        },
                        body: {
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
                            name: 'f'
                          }
                        }
                      }
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch({e}){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    method: false,
                    shorthand: true
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch([e]){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'e'
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch({e=x}){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    method: false,
                    shorthand: true
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch([e=x]){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch {}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: null,
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch {} finally {}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: null,
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ],
    [
      'try {} catch \n {}',
      Context.OptionsWebCompat,
      {
        body: [
          {
            block: {
              body: [],
              type: 'BlockStatement'
            },
            finalizer: null,
            handler: {
              body: {
                body: [],
                type: 'BlockStatement'
              },
              param: null,
              type: 'CatchClause'
            },
            type: 'TryStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'try { } catch (e) { var x; for (var y of []) {} }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: null,
                        id: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  },
                  {
                    type: 'ForOfStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'var',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'ArrayExpression',
                      elements: []
                    },
                    await: false
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'function __f_3() { try { __f_3(); } catch(e) { eval("let fun = ({a} = {a: 30}) => {"); } }',
      Context.OptionsWebCompat,
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
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: '__f_3'
                          },
                          arguments: []
                        }
                      }
                    ]
                  },
                  handler: {
                    type: 'CatchClause',
                    param: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    body: {
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
                                value: 'let fun = ({a} = {a: 30}) => {'
                              }
                            ]
                          }
                        }
                      ]
                    }
                  },
                  finalizer: null
                }
              ]
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: '__f_3'
            }
          }
        ]
      }
    ],
    [
      'try { throw null; } catch (f) {if (false) ; else function f() { return 123; }}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'Literal',
                    value: null
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'f'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'IfStatement',
                    test: {
                      type: 'Literal',
                      value: false
                    },
                    consequent: {
                      type: 'EmptyStatement'
                    },
                    alternate: {
                      type: 'FunctionDeclaration',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'Literal',
                              value: 123
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
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try{}catch(a){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'a'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { } catch (eval) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'eval'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { } catch (e) { say(e) }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'say'
                      },
                      arguments: [
                        {
                          type: 'Identifier',
                          name: 'e'
                        }
                      ]
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { } catch ([a = 0]) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Literal',
                      value: 0
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { } catch (e) { let a; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: null,
                        id: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { } catch ([]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: []
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try { throw [1, 2, 3]; } catch ([...x]) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Literal',
                        value: 1
                      },
                      {
                        type: 'Literal',
                        value: 2
                      },
                      {
                        type: 'Literal',
                        value: 3
                      }
                    ]
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch([e=x]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch({e=x}){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    computed: false,
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    method: false,
                    shorthand: true
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch([e]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'e'
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} finally {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
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
          }
        ]
      }
    ],
    [
      'try {} finally {}\n/foo/g',
      Context.None,
      {
        body: [
          {
            block: {
              body: [],
              type: 'BlockStatement'
            },
            finalizer: {
              body: [],
              type: 'BlockStatement'
            },
            handler: null,
            type: 'TryStatement'
          },
          {
            expression: {
              regex: {
                flags: 'g',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/g
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'try {try { let e; } catch { let e; } finally { let e; }} catch (e) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            init: null,
                            id: {
                              type: 'Identifier',
                              name: 'e'
                            }
                          }
                        ]
                      }
                    ]
                  },
                  handler: {
                    type: 'CatchClause',
                    param: null,
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: [
                            {
                              type: 'VariableDeclarator',
                              init: null,
                              id: {
                                type: 'Identifier',
                                name: 'e'
                              }
                            }
                          ]
                        }
                      ]
                    }
                  },
                  finalizer: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'VariableDeclaration',
                        kind: 'let',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            init: null,
                            id: {
                              type: 'Identifier',
                              name: 'e'
                            }
                          }
                        ]
                      }
                    ]
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {try { } catch { } finally { }} catch ({e}) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: []
                  },
                  handler: {
                    type: 'CatchClause',
                    param: null,
                    body: {
                      type: 'BlockStatement',
                      body: []
                    }
                  },
                  finalizer: {
                    type: 'BlockStatement',
                    body: []
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    kind: 'init',
                    key: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    method: false,
                    shorthand: true
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch(x) { x = 0; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'x'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '=',
                      right: {
                        type: 'Literal',
                        value: 0
                      }
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch(x) { with ({}) { x = 1; } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'x'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'WithStatement',
                    object: {
                      type: 'ObjectExpression',
                      properties: []
                    },
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 1
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch ([a,b,c]) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    name: 'c'
                  }
                ]
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (foo) {} var foo;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'foo'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          },
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: null
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try { throw null; } catch ({}) {}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'Literal',
                    value: null
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ObjectPattern',
                properties: []
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try { } catch (a) { { const a = b; } }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'a'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'VariableDeclaration',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            init: {
                              type: 'Identifier',
                              name: 'b'
                            }
                          }
                        ],
                        kind: 'const'
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch(e) { try {} catch (e) {} }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'TryStatement',
                    block: {
                      type: 'BlockStatement',
                      body: []
                    },
                    handler: {
                      type: 'CatchClause',
                      param: {
                        type: 'Identifier',
                        name: 'e'
                      },
                      body: {
                        type: 'BlockStatement',
                        body: []
                      }
                    },
                    finalizer: null
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch (foo) { { let foo; } }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'foo'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'VariableDeclaration',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            init: null
                          }
                        ],
                        kind: 'let'
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var foo; try {} catch (_) { let foo; }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: null
              }
            ],
            kind: 'var'
          },
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: '_'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        id: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        init: null
                      }
                    ],
                    kind: 'let'
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch (e) { { let e = x; } }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'VariableDeclaration',
                        declarations: [
                          {
                            type: 'VariableDeclarator',
                            id: {
                              type: 'Identifier',
                              name: 'e'
                            },
                            init: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          }
                        ],
                        kind: 'let'
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch (foo) {} let foo;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'foo'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          },
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: null
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'try {} catch (e) { let b = x; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'let',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        id: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { var e = x; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        id: {
                          type: 'Identifier',
                          name: 'e'
                        }
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (a) { }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'a'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (const e in y) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForInStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (let e of y) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForOfStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    await: false
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (const e of y) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForOfStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    await: false
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (var e in y) {} }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForInStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'var',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (let e of y) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForOfStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'let',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    await: false
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch (e) { for (const e of y) {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ForOfStatement',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    left: {
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'e'
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    await: false
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'var foo; try {} catch (_) { const foo = 1; }',
      Context.None,
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
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: '_'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Literal',
                          value: 1
                        },
                        id: {
                          type: 'Identifier',
                          name: 'foo'
                        }
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      `try {
      var x = 2;
      probeTry = function() { return x; };
      throw [];
    } catch ([_ = (eval('var x = 3;'), probeParam = function() { return x; })]) {
      var x = 4;
      probeBlock = function() { return x; };
    }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: 2
                      },
                      id: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'probeTry'
                    },
                    operator: '=',
                    right: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'Identifier',
                              name: 'x'
                            }
                          }
                        ]
                      },
                      async: false,
                      generator: false,

                      id: null
                    }
                  }
                },
                {
                  type: 'ThrowStatement',
                  argument: {
                    type: 'ArrayExpression',
                    elements: []
                  }
                }
              ]
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: '_'
                    },
                    right: {
                      type: 'SequenceExpression',
                      expressions: [
                        {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'eval'
                          },
                          arguments: [
                            {
                              type: 'Literal',
                              value: 'var x = 3;'
                            }
                          ]
                        },
                        {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'Identifier',
                            name: 'probeParam'
                          },
                          operator: '=',
                          right: {
                            type: 'FunctionExpression',
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              body: [
                                {
                                  type: 'ReturnStatement',
                                  argument: {
                                    type: 'Identifier',
                                    name: 'x'
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
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Literal',
                          value: 4
                        },
                        id: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'probeBlock'
                      },
                      operator: '=',
                      right: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'ReturnStatement',
                              argument: {
                                type: 'Identifier',
                                name: 'x'
                              }
                            }
                          ]
                        },
                        async: false,

                        generator: false,
                        id: null
                      }
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'try {} catch(e) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'e'
              },
              body: {
                type: 'BlockStatement',
                body: []
              }
            },
            finalizer: null
          }
        ]
      }
    ]
  ]);
});
