import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Switch', () => {
  fail('Statements - Switch (fail)', [
    ['switch(x) { default: default: }', Context.None],
    ['switch(x) { default: break; default: break; }', Context.None],
    ['switch(x) { case y: break; case z: break; default: default: }', Context.None],
    ['switch(x) { default: default: case y: break; case z: break; }', Context.None],
    ['switch(0) { case 0: !function(){ break; }; }', Context.None],
    ['switch(0) { case 0: function f(){ break; } }', Context.None],
    ['switch(0) { default: !function(){ break; }; }', Context.None],
    ['switch(0) { default: function f(){ break; } }', Context.None],
    ['switch(x) { default: break; case y: break; case z: break; default: break; }', Context.None],
    ['do {} while(x) x', Context.None]
  ]);

  pass('Statements - Switch (pass)', [
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
      'switch (answer) { case /(?=\x2d?)/gmy: }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'SwitchStatement',
            discriminant: {
              type: 'Identifier',
              name: 'answer'
            },
            cases: [
              {
                type: 'SwitchCase',
                test: {
                  type: 'Literal',
                  value: /(?=-?)/gmy,
                  regex: {
                    pattern: '(?=-?)',
                    flags: 'gmy'
                  }
                },
                consequent: []
              }
            ]
          }
        ]
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
