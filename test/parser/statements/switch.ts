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
      `switch (X) {
        case k:
          foo: bar: function f(){}
      }`,
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'X'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Identifier',
                  name: 'k'
                },
                consequent: [
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
        ]
      }
    ],
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
                            expression: {
                              left: {
                                name: 'a',
                                start: 87,
                                end: 88,
                                range: [87, 88],
                                type: 'Identifier'
                              },
                              operator: '=',
                              right: {
                                start: 91,
                                end: 92,
                                range: [91, 92],
                                type: 'Literal',
                                value: 3
                              },
                              start: 87,
                              end: 92,
                              range: [87, 92],
                              type: 'AssignmentExpression'
                            },
                            start: 87,
                            end: 93,
                            range: [87, 93],
                            type: 'ExpressionStatement'
                          },
                          label: {
                            name: 'foo',
                            start: 83,
                            end: 86,
                            range: [83, 86],
                            type: 'Identifier'
                          },
                          start: 83,
                          end: 93,
                          range: [83, 93],
                          type: 'LabeledStatement'
                        },
                        {
                          label: null,
                          start: 108,
                          end: 114,
                          range: [108, 114],
                          type: 'BreakStatement'
                        }
                      ],
                      start: 61,
                      end: 114,
                      range: [61, 114],
                      test: {
                        start: 66,
                        end: 67,
                        range: [66, 67],
                        type: 'Literal',
                        value: 2
                      },
                      type: 'SwitchCase'
                    }
                  ],
                  discriminant: {
                    name: 'a',
                    start: 46,
                    end: 47,
                    range: [46, 47],
                    type: 'Identifier'
                  },
                  start: 38,
                  end: 124,
                  range: [38, 124],
                  type: 'SwitchStatement'
                }
              ],
              start: 28,
              end: 130,
              range: [28, 130],
              type: 'BlockStatement'
            },
            init: {
              declarations: [
                {
                  id: {
                    name: 'i',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    type: 'Identifier'
                  },
                  init: {
                    start: 13,
                    end: 14,
                    range: [13, 14],
                    type: 'Literal',
                    value: 0
                  },
                  start: 9,
                  end: 14,
                  range: [9, 14],
                  type: 'VariableDeclarator'
                }
              ],
              kind: 'let',
              start: 5,
              end: 14,
              range: [5, 14],
              type: 'VariableDeclaration'
            },
            start: 0,
            end: 130,
            range: [0, 130],
            test: {
              left: {
                name: 'i',
                start: 16,
                end: 17,
                range: [16, 17],
                type: 'Identifier'
              },
              operator: '<',
              right: {
                start: 20,
                end: 21,
                range: [20, 21],
                type: 'Literal',
                value: 1
              },
              start: 16,
              end: 21,
              range: [16, 21],
              type: 'BinaryExpression'
            },
            type: 'ForStatement',
            update: {
              argument: {
                name: 'i',
                start: 25,
                end: 26,
                range: [25, 26],
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              start: 23,
              end: 26,
              range: [23, 26],
              type: 'UpdateExpression'
            }
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 130,
        range: [0, 130],
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
        range: [0, 14],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 10,
              range: [7, 10],
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
        range: [0, 36],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 36,
            range: [0, 36],
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 9,
              range: [8, 9],
              name: 'A'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 12,
                end: 23,
                range: [12, 23],
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 21,
                    end: 23,
                    range: [21, 23],
                    expression: {
                      type: 'Identifier',
                      start: 21,
                      end: 22,
                      range: [21, 22],
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
                range: [24, 34],
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 32,
                    end: 34,
                    range: [32, 34],
                    expression: {
                      type: 'Identifier',
                      start: 32,
                      end: 33,
                      range: [32, 33],
                      name: 'C'
                    }
                  }
                ],
                test: {
                  type: 'Identifier',
                  start: 29,
                  end: 30,
                  range: [29, 30],
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
        range: [0, 55],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 55,
            range: [0, 55],
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 14,
              range: [8, 14],
              name: 'answer'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 18,
                end: 38,
                range: [18, 38],
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    start: 26,
                    end: 31,
                    range: [26, 31],
                    expression: {
                      type: 'CallExpression',
                      start: 26,
                      end: 30,
                      range: [26, 30],
                      callee: {
                        type: 'Identifier',
                        start: 26,
                        end: 28,
                        range: [26, 28],
                        name: 'hi'
                      },
                      arguments: []
                    }
                  },
                  {
                    type: 'BreakStatement',
                    start: 32,
                    end: 38,
                    range: [32, 38],
                    label: null
                  }
                ],
                test: {
                  type: 'Literal',
                  start: 23,
                  end: 24,
                  range: [23, 24],
                  value: 0
                }
              },
              {
                type: 'SwitchCase',
                start: 39,
                end: 53,
                range: [39, 53],
                consequent: [
                  {
                    type: 'BreakStatement',
                    start: 48,
                    end: 53,
                    range: [48, 53],
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
        range: [0, 18],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            discriminant: {
              type: 'Identifier',
              start: 7,
              end: 8,
              range: [7, 8],
              name: 'a'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 10,
                end: 17,
                range: [10, 17],
                consequent: [],
                test: {
                  type: 'Literal',
                  start: 15,
                  end: 16,
                  range: [15, 16],
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
                        id: {
                          elements: [
                            {
                              name: 'x',
                              start: 26,
                              end: 27,
                              range: [26, 27],
                              type: 'Identifier'
                            }
                          ],
                          start: 25,
                          end: 28,
                          range: [25, 28],
                          type: 'ArrayPattern'
                        },
                        init: {
                          start: 31,
                          end: 32,
                          range: [31, 32],
                          name: 'y',
                          type: 'Identifier'
                        },
                        start: 25,
                        end: 32,
                        range: [25, 32],
                        type: 'VariableDeclarator'
                      }
                    ],
                    kind: 'let',
                    start: 21,
                    end: 32,
                    range: [21, 32],
                    type: 'VariableDeclaration'
                  }
                ],
                start: 13,
                end: 32,
                range: [13, 32],
                test: {
                  name: 'b',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  type: 'Identifier'
                },
                type: 'SwitchCase'
              }
            ],
            discriminant: {
              name: 'a',
              start: 8,
              end: 9,
              range: [8, 9],
              type: 'Identifier'
            },
            start: 0,
            end: 34,
            range: [0, 34],
            type: 'SwitchStatement'
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 34,
        range: [0, 34],
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
        range: [0, 34],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 34,
            range: [0, 34],
            discriminant: {
              type: 'Identifier',
              start: 8,
              end: 14,
              range: [8, 14],
              name: 'answer'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 18,
                end: 32,
                range: [18, 32],
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 26,
                    end: 32,
                    range: [26, 32],
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 30,
                        end: 31,
                        range: [30, 31],
                        id: {
                          type: 'Identifier',
                          start: 30,
                          end: 31,
                          range: [30, 31],
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
                  range: [23, 24],
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
        range: [0, 44],
        body: [
          {
            type: 'SwitchStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            discriminant: {
              type: 'Literal',
              start: 8,
              end: 9,
              range: [8, 9],
              value: 0,
              raw: '0'
            },
            cases: [
              {
                type: 'SwitchCase',
                start: 13,
                end: 27,
                range: [13, 27],
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 21,
                    end: 27,
                    range: [21, 27],
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 25,
                        end: 26,
                        range: [25, 26],
                        id: {
                          type: 'Identifier',
                          start: 25,
                          end: 26,
                          range: [25, 26],
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
                  range: [18, 19],
                  value: 1,
                  raw: '1'
                }
              },
              {
                type: 'SwitchCase',
                start: 28,
                end: 42,
                range: [28, 42],
                consequent: [
                  {
                    type: 'VariableDeclaration',
                    start: 37,
                    end: 42,
                    range: [37, 42],
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 41,
                        end: 42,
                        range: [41, 42],
                        id: {
                          type: 'Identifier',
                          start: 41,
                          end: 42,
                          range: [41, 42],
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
