import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements  Switch', () => {
  fail('Statements  Switch (fail)', [
    ['switch(x) { default: default: }', Context.None],
    ['switch(x) { default: break; default: break; }', Context.None],
    ['switch(x) { case y: break; case z: break; default: default: }', Context.None],
    ['switch(x) { default: default: case y: break; case z: break; }', Context.None],
    ['switch(0) { case 0: !function(){ break; }; }', Context.None],
    ['switch (a) { case b: let [x] }', Context.None],
    ['switch(0) { case 0: function f(){ break; } }', Context.None],
    ['switch(0) { default: !function(){ break; }; }', Context.None],
    ['switch(0) { default: function f(){ break; } }', Context.None],
    ['switch(x) { default: break; case y: break; case z: break; default: break; }', Context.None],
    ['do {} while(x) x', Context.None]
  ]);

  pass('Statements  Switch (pass)', [
    [
      `for (let i = 0; i < 1; ++i) {
        switch (a) {
          case 2:
              foo:a = 3;
              break;
        }
    }`,
      Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  cases: [
                    {
                      consequent: [
                        {
                          body: {
                            end: 93,
                            expression: {
                              end: 92,
                              left: {
                                end: 88,
                                name: 'a',
                                start: 87,
                                type: 'Identifier'
                              },
                              operator: '=',
                              right: {
                                end: 92,
                                start: 91,
                                type: 'Literal',
                                value: 3
                              },
                              start: 87,
                              type: 'AssignmentExpression'
                            },
                            start: 87,
                            type: 'ExpressionStatement'
                          },
                          end: 93,
                          label: {
                            end: 86,
                            name: 'foo',
                            start: 83,
                            type: 'Identifier'
                          },
                          start: 83,
                          type: 'LabeledStatement'
                        },
                        {
                          end: 114,
                          label: null,
                          start: 108,
                          type: 'BreakStatement'
                        }
                      ],
                      end: 114,
                      start: 61,
                      test: {
                        end: 67,
                        start: 66,
                        type: 'Literal',
                        value: 2
                      },
                      type: 'SwitchCase'
                    }
                  ],
                  discriminant: {
                    end: 47,
                    name: 'a',
                    start: 46,
                    type: 'Identifier'
                  },
                  end: 124,
                  start: 38,
                  type: 'SwitchStatement'
                }
              ],
              end: 130,
              start: 28,
              type: 'BlockStatement'
            },
            end: 130,
            init: {
              declarations: [
                {
                  end: 14,
                  id: {
                    end: 10,
                    name: 'i',
                    start: 9,
                    type: 'Identifier'
                  },
                  init: {
                    end: 14,
                    start: 13,
                    type: 'Literal',
                    value: 0
                  },
                  start: 9,
                  type: 'VariableDeclarator'
                }
              ],
              end: 14,
              kind: 'let',
              start: 5,
              type: 'VariableDeclaration'
            },
            start: 0,
            test: {
              end: 21,
              left: {
                end: 17,
                name: 'i',
                start: 16,
                type: 'Identifier'
              },
              operator: '<',
              right: {
                end: 21,
                start: 20,
                type: 'Literal',
                value: 1
              },
              start: 16,
              type: 'BinaryExpression'
            },
            type: 'ForStatement',
            update: {
              argument: {
                end: 26,
                name: 'i',
                start: 25,
                type: 'Identifier'
              },
              end: 26,
              operator: '++',
              prefix: true,
              start: 23,
              type: 'UpdateExpression'
            }
          }
        ],
        end: 130,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'switch(foo) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 14,
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 10,
              name: 'foo'
            },
            cases: []
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (A) {default: D; case B: C; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 36,
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 9,
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 12,
                end: 23,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 21,
                    end: 23,
                    expression: {
                      type: 'Identifier',
                      start: 21,
                      end: 22,
                      name: 'D'
                    }
                  }
                ],
                test: null
              },
              {
                type: 'SwitchCase',
                start: 24,
                end: 34,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 32,
                    end: 34,
                    expression: {
                      type: 'Identifier',
                      start: 32,
                      end: 33,
                      name: 'C'
                    }
                  }
                ],
                test: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  name: 'B'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch(a){case 1:default:}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Literal',
                  value: 1
                },
                consequent: []
              },
              {
                type: 'SwitchCase',
                test: null,
                consequent: []
              }
            ]
          }
        ]
      }
    ],
    [
      'switch(a){default:case 2:}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: []
              },
              {
                type: 'SwitchCase',
                test: {
                  type: 'Literal',
                  value: 2
                },
                consequent: []
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (answer) { case 0: hi(); break; default: break }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 55,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 55,
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 14,
              name: 'answer'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 18,
                end: 38,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 26,
                    end: 31,
                    expression: {
                      type: 'CallExpression',
                      start: 26,
                      end: 30,
                      callee: {
                        type: 'Identifier',
                        start: 26,
                        end: 28,
                        name: 'hi'
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'BreakStatement',
                    start: 32,
                    end: 38,
                    label: null
                  }
                ],
                test: {
                  type: 'Literal',
                  start: 23,
                  end: 24,
                  value: 0
                }
              },
              {
                type: 'SwitchCase',
                start: 39,
                end: 53,
                consequent: [
                  {
                    type: 'BreakStatement',
                    start: 48,
                    end: 53,
                    label: null
                  }
                ],
                test: null
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch(a){case 1:}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 18,
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 8,
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 10,
                end: 17,
                consequent: [],
                test: {
                  type: 'Literal',
                  start: 15,
                  end: 16,
                  value: 1
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (a) { case b: let [x] = y }',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        body: [
          {
            cases: [
              {
                consequent: [
                  {
                    declarations: [
                      {
                        end: 32,
                        id: {
                          elements: [
                            {
                              end: 27,
                              name: 'x',
                              start: 26,
                              type: 'Identifier'
                            }
                          ],
                          end: 28,
                          start: 25,
                          type: 'ArrayPattern'
                        },
                        init: {
                          end: 32,
                          name: 'y',
                          start: 31,
                          type: 'Identifier'
                        },
                        start: 25,
                        type: 'VariableDeclarator'
                      }
                    ],
                    end: 32,
                    kind: 'let',
                    start: 21,
                    type: 'VariableDeclaration'
                  }
                ],
                end: 32,
                start: 13,
                test: {
                  end: 19,
                  name: 'b',
                  start: 18,
                  type: 'Identifier'
                },
                type: 'SwitchCase'
              }
            ],
            discriminant: {
              end: 9,
              name: 'a',
              start: 8,
              type: 'Identifier'
            },
            end: 34,
            start: 0,
            type: 'SwitchStatement'
          }
        ],
        end: 34,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'switch (answer) { case 0: let a; }',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 34,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 34,
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 14,
              name: 'answer'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 18,
                end: 32,
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 26,
                    end: 32,
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 30,
                        end: 31,
                        id: {
                          type: 'Identifier',
                          start: 30,
                          end: 31,
                          name: 'a'
                        },
                        init: null
                      }
                    ],
                    kind: 'let'
                  }
                ],
                test: {
                  type: 'Literal',
                  start: 23,
                  end: 24,
                  value: 0,
                  raw: '0'
                }
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (A) {default: B;}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (0) { case 1: var f; default: var f }',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 44,
            discriminant: {
              type: 'Literal',
              start: 8,
              end: 9,
              value: 0,
              raw: '0'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 13,
                end: 27,
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 21,
                    end: 27,
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 25,
                        end: 26,
                        id: {
                          type: 'Identifier',
                          start: 25,
                          end: 26,
                          name: 'f'
                        },
                        init: null
                      }
                    ],
                    kind: 'var'
                  }
                ],
                test: {
                  type: 'Literal',
                  start: 18,
                  end: 19,
                  value: 1,
                  raw: '1'
                }
              },
              {
                type: 'SwitchCase',
                start: 28,
                end: 42,
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 37,
                    end: 42,
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 41,
                        end: 42,
                        id: {
                          type: 'Identifier',
                          start: 41,
                          end: 42,
                          name: 'f'
                        },
                        init: null
                      }
                    ],
                    kind: 'var'
                  }
                ],
                test: null
              }
            ]
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'switch (A) {default: B; break;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  },
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (A) {case B: C; break; case D: E; break;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'B'
                },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'C'
                    }
                  },
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              },
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'D'
                },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'E'
                    }
                  },
                  {
                    type: 'BreakStatement',
                    label: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (A) {default: D; case B: C; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'D'
                    }
                  }
                ]
              },
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'B'
                },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'C'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (A) {case B: C; default: D;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'B'
                },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'C'
                    }
                  }
                ]
              },
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'D'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'switch (A) {default: B;}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'B'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  ]);
});
