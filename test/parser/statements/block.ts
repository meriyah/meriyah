import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Block', () => {
  fail('Expressions - Array (fail)', [
    ['{ let {x} }', Context.None],
    ['{ let {} }', Context.None],
    ['{ let [] }', Context.None]
  ]);
  pass('Expressions - Block (pass)', [
    [
      '{}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: []
          }
        ]
      }
    ],
    [
      '{ let x }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
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
                      name: 'x',
                      start: 6,
                      end: 7,
                      range: [6, 7]
                    },
                    start: 6,
                    end: 7,
                    range: [6, 7]
                  }
                ],
                start: 2,
                end: 7,
                range: [2, 7]
              }
            ],
            start: 0,
            end: 9,
            range: [0, 9]
          }
        ],
        start: 0,
        end: 9,
        range: [0, 9]
      }
    ],
    [
      '{ foo: bar: function f(){} }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
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
            ]
          }
        ]
      }
    ],
    [
      '{ let [] = y }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            body: [
              {
                type: 'VariableDeclaration',
                start: 2,
                end: 12,
                range: [2, 12],
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    start: 6,
                    end: 12,
                    range: [6, 12],
                    id: {
                      type: 'ArrayPattern',
                      start: 6,
                      end: 8,
                      range: [6, 8],
                      elements: []
                    },
                    init: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'y'
                    }
                  }
                ],
                kind: 'let'
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ let {x} = y }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
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
                      name: 'y',
                      start: 12,
                      end: 13,
                      range: [12, 13]
                    },
                    id: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x',
                            start: 7,
                            end: 8,
                            range: [7, 8]
                          },
                          value: {
                            type: 'Identifier',
                            name: 'x',
                            start: 7,
                            end: 8,
                            range: [7, 8]
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true,
                          start: 7,
                          end: 8,
                          range: [7, 8]
                        }
                      ],
                      start: 6,
                      end: 9,
                      range: [6, 9]
                    },
                    start: 6,
                    end: 13,
                    range: [6, 13]
                  }
                ],
                start: 2,
                end: 13,
                range: [2, 13]
              }
            ],
            start: 0,
            end: 15,
            range: [0, 15]
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15]
      }
    ],
    [
      '{debugger;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            body: [
              {
                type: 'DebuggerStatement',
                start: 1,
                end: 10,
                range: [1, 10]
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f() {} var f;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 15,
            range: [0, 15],
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
              start: 13,
              end: 15,
              range: [13, 15],
              body: []
            }
          },
          {
            type: 'VariableDeclaration',
            start: 16,
            end: 22,
            range: [16, 22],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 20,
                end: 21,
                range: [20, 21],
                id: {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  range: [20, 21],
                  name: 'f'
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
      'var f; function f() {}',
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
                  name: 'f'
                }
              }
            ]
          },
          {
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
        ]
      }
    ],
    [
      'function x() { { var f; var f } }',
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
                            name: 'f'
                          }
                        }
                      ]
                    },
                    {
                      type: 'VariableDeclaration',
                      kind: 'var',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          init: null,
                          id: {
                            type: 'Identifier',
                            name: 'f'
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '{}\n/foo/',
      Context.None,
      {
        body: [
          {
            body: [],
            type: 'BlockStatement'
          },
          {
            expression: {
              regex: {
                flags: '',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '{}\n/foo/g',
      Context.None,
      {
        body: [
          {
            body: [],
            type: 'BlockStatement'
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
      '{a}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{if (false) {} else ;}',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            body: [
              {
                type: 'IfStatement',
                start: 1,
                end: 21,
                range: [1, 21],
                test: {
                  type: 'Literal',
                  start: 5,
                  end: 10,
                  range: [5, 10],
                  value: false,
                  raw: 'false'
                },
                consequent: {
                  type: 'BlockStatement',
                  start: 12,
                  end: 14,
                  range: [12, 14],
                  body: []
                },
                alternate: {
                  type: 'EmptyStatement',
                  start: 20,
                  end: 21,
                  range: [20, 21]
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{for (;;) ;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            body: [
              {
                type: 'ForStatement',
                start: 1,
                end: 11,
                range: [1, 11],
                init: null,
                test: null,
                update: null,
                body: {
                  type: 'EmptyStatement',
                  start: 10,
                  end: 11,
                  range: [10, 11]
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{with ({}) {}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            body: [
              {
                type: 'WithStatement',
                start: 1,
                end: 13,
                range: [1, 13],
                object: {
                  type: 'ObjectExpression',
                  start: 7,
                  end: 9,
                  range: [7, 9],
                  properties: []
                },
                body: {
                  type: 'BlockStatement',
                  start: 11,
                  end: 13,
                  range: [11, 13],
                  body: []
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ { var f; } var f }',
      Context.None,
      {
        body: [
          {
            body: [
              {
                body: [
                  {
                    declarations: [
                      {
                        id: {
                          name: 'f',
                          type: 'Identifier'
                        },
                        init: null,
                        type: 'VariableDeclarator'
                      }
                    ],
                    kind: 'var',
                    type: 'VariableDeclaration'
                  }
                ],
                type: 'BlockStatement'
              },
              {
                declarations: [
                  {
                    id: {
                      name: 'f',
                      type: 'Identifier'
                    },
                    init: null,
                    type: 'VariableDeclarator'
                  }
                ],
                kind: 'var',
                type: 'VariableDeclaration'
              }
            ],
            type: 'BlockStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '{ a(); bt(); }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            body: [
              {
                type: 'ExpressionStatement',
                start: 2,
                end: 6,
                range: [2, 6],
                expression: {
                  type: 'CallExpression',
                  start: 2,
                  end: 5,
                  range: [2, 5],
                  callee: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'a'
                  },
                  arguments: []
                }
              },
              {
                type: 'ExpressionStatement',
                start: 7,
                end: 12,
                range: [7, 12],
                expression: {
                  type: 'CallExpression',
                  start: 7,
                  end: 11,
                  range: [7, 11],
                  callee: {
                    type: 'Identifier',
                    start: 7,
                    end: 9,
                    range: [7, 9],
                    name: 'bt'
                  },
                  arguments: []
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ var {foo=3} = {}; };',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 21,
            range: [0, 21],
            body: [
              {
                type: 'VariableDeclaration',
                start: 2,
                end: 19,
                range: [2, 19],
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    start: 6,
                    end: 18,
                    range: [6, 18],
                    id: {
                      type: 'ObjectPattern',
                      start: 6,
                      end: 13,
                      range: [6, 13],
                      properties: [
                        {
                          type: 'Property',
                          start: 7,
                          end: 12,
                          range: [7, 12],
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 7,
                            end: 10,
                            range: [7, 10],
                            name: 'foo'
                          },
                          kind: 'init',
                          value: {
                            type: 'AssignmentPattern',
                            start: 7,
                            end: 12,
                            range: [7, 12],
                            left: {
                              type: 'Identifier',
                              start: 7,
                              end: 10,
                              range: [7, 10],
                              name: 'foo'
                            },
                            right: {
                              type: 'Literal',
                              start: 11,
                              end: 12,
                              range: [11, 12],
                              value: 3
                            }
                          }
                        }
                      ]
                    },
                    init: {
                      type: 'ObjectExpression',
                      start: 16,
                      end: 18,
                      range: [16, 18],
                      properties: []
                    }
                  }
                ],
                kind: 'var'
              }
            ]
          },
          {
            type: 'EmptyStatement',
            start: 21,
            end: 22,
            range: [21, 22]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ var foo = 0; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            body: [
              {
                type: 'VariableDeclaration',
                start: 2,
                end: 14,
                range: [2, 14],
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    start: 6,
                    end: 13,
                    range: [6, 13],
                    id: {
                      type: 'Identifier',
                      start: 6,
                      end: 9,
                      range: [6, 9],
                      name: 'foo'
                    },
                    init: {
                      type: 'Literal',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      value: 0
                    }
                  }
                ],
                kind: 'var'
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ async function foo() {}; };',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 29,
        range: [0, 29],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            body: [
              {
                type: 'FunctionDeclaration',
                start: 2,
                end: 25,
                range: [2, 25],
                id: {
                  type: 'Identifier',
                  start: 17,
                  end: 20,
                  range: [17, 20],
                  name: 'foo'
                },
                generator: false,
                async: true,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 23,
                  end: 25,
                  range: [23, 25],
                  body: []
                }
              },
              {
                type: 'EmptyStatement',
                start: 25,
                end: 26,
                range: [25, 26]
              }
            ]
          },
          {
            type: 'EmptyStatement',
            start: 28,
            end: 29,
            range: [28, 29]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{\n  debugger;\n}',
      Context.None,
      {
        body: [
          {
            body: [
              {
                type: 'DebuggerStatement'
              }
            ],
            type: 'BlockStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '{}\n/foo/',
      Context.None,
      {
        body: [
          {
            body: [],
            type: 'BlockStatement'
          },
          {
            expression: {
              regex: {
                flags: '',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '{ function a() {} ; function b() {} }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 37,
        range: [0, 37],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 37,
            range: [0, 37],
            body: [
              {
                type: 'FunctionDeclaration',
                start: 2,
                end: 17,
                range: [2, 17],
                id: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'a'
                },
                generator: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 15,
                  end: 17,
                  range: [15, 17],
                  body: []
                }
              },
              {
                type: 'EmptyStatement',
                start: 18,
                end: 19,
                range: [18, 19]
              },
              {
                type: 'FunctionDeclaration',
                start: 20,
                end: 35,
                range: [20, 35],
                id: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  range: [29, 30],
                  name: 'b'
                },
                generator: false,
                async: false,
                params: [],
                body: {
                  type: 'BlockStatement',
                  start: 33,
                  end: 35,
                  range: [33, 35],
                  body: []
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{ function f() {} ; function f() {} }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
            body: [
              {
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
              },
              {
                type: 'EmptyStatement'
              },
              {
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
            ]
          }
        ]
      }
    ],
    [
      '{foo = b}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            body: [
              {
                type: 'ExpressionStatement',
                start: 1,
                end: 8,
                range: [1, 8],
                expression: {
                  type: 'AssignmentExpression',
                  start: 1,
                  end: 8,
                  range: [1, 8],
                  operator: '=',
                  left: {
                    type: 'Identifier',
                    start: 1,
                    end: 4,
                    range: [1, 4],
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'b'
                  }
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{var foo;}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'BlockStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            body: [
              {
                type: 'VariableDeclaration',
                start: 1,
                end: 9,
                range: [1, 9],
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    start: 5,
                    end: 8,
                    range: [5, 8],
                    id: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      name: 'foo'
                    },
                    init: null
                  }
                ],
                kind: 'var'
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '{}\n/foo/g',
      Context.None,
      {
        body: [
          {
            body: [],
            type: 'BlockStatement'
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
    ]
  ]);
});
