import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Conditional', () => {
  fail('Expressions - Conditional (fail)', [
    ['a ? await x : c', Context.None],
    ['a ? b : await c', Context.None],
    ['a ? b : yield c', Context.None]
  ]);

  pass('Expressions - Conditional (pass)', [
    [
      'foo?.3:0',
      Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'foo'
              },
              consequent: {
                type: 'Literal',
                value: 0.3
              },
              alternate: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'foo?.3:0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'foo'
              },
              consequent: {
                type: 'Literal',
                value: 0.3
              },
              alternate: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'foo ? .3 : 0',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'foo'
              },
              consequent: {
                type: 'Literal',
                value: 0.3
              },
              alternate: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'a ? b : c = d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a ? b = d : c',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              test: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'a'
              },
              consequent: {
                type: 'AssignmentExpression',
                start: 4,
                end: 9,
                range: [4, 9],
                operator: '=',
                left: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'd'
                }
              },
              alternate: {
                type: 'Identifier',
                start: 12,
                end: 13,
                range: [12, 13],
                name: 'c'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = (0) ? 1 : 2',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ConditionalExpression',
                start: 4,
                end: 15,
                range: [4, 15],
                test: {
                  type: 'Literal',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  value: 0
                },
                consequent: {
                  type: 'Literal',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  value: 1
                },
                alternate: {
                  type: 'Literal',
                  start: 14,
                  end: 15,
                  range: [14, 15],
                  value: 2
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(y ? y : true)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'ConditionalExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              test: {
                type: 'Identifier',
                start: 1,
                end: 2,
                range: [1, 2],
                name: 'y'
              },
              consequent: {
                type: 'Identifier',
                start: 5,
                end: 6,
                range: [5, 6],
                name: 'y'
              },
              alternate: {
                type: 'Literal',
                start: 9,
                end: 13,
                range: [9, 13],
                value: true
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '"1" ? y : ""',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: '1'
              },
              consequent: {
                type: 'Identifier',
                name: 'y'
              },
              alternate: {
                type: 'Literal',
                value: ''
              }
            }
          }
        ]
      }
    ],
    [
      '("1" ? "" : "1")',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: '1'
              },
              consequent: {
                type: 'Literal',
                value: ''
              },
              alternate: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'Symbol() ? 1 : 2, 1',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              expressions: [
                {
                  type: 'ConditionalExpression',
                  start: 0,
                  end: 16,
                  range: [0, 16],
                  test: {
                    type: 'CallExpression',
                    start: 0,
                    end: 8,
                    range: [0, 8],
                    callee: {
                      type: 'Identifier',
                      start: 0,
                      end: 6,
                      range: [0, 6],
                      name: 'Symbol'
                    },
                    arguments: []
                  },
                  consequent: {
                    type: 'Literal',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    value: 1
                  },
                  alternate: {
                    type: 'Literal',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    value: 2
                  }
                },
                {
                  type: 'Literal',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  value: 1
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(false ? false : true)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: false
              },
              consequent: {
                type: 'Literal',
                value: false
              },
              alternate: {
                type: 'Literal',
                value: true
              }
            }
          }
        ]
      }
    ],
    [
      'foo => bar ? zoo : doo',
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
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'bar'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'zoo'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'doo'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'foo'
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
      'true ? foo : bar',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'Identifier',
                name: 'foo'
              },
              alternate: {
                type: 'Identifier',
                name: 'bar'
              }
            }
          }
        ]
      }
    ],
    [
      'a?b:c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'a === b ? c : d % e',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              test: {
                type: 'BinaryExpression',
                start: 0,
                end: 7,
                range: [0, 7],
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'a'
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'b'
                }
              },
              consequent: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
                name: 'c'
              },
              alternate: {
                type: 'BinaryExpression',
                start: 14,
                end: 19,
                range: [14, 19],
                left: {
                  type: 'Identifier',
                  start: 14,
                  end: 15,
                  range: [14, 15],
                  name: 'd'
                },
                operator: '%',
                right: {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  name: 'e'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a=b?c:d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a?b:c=d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'Identifier',
                name: 'b'
              },
              alternate: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x && y ? a : b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '&&'
              },
              consequent: {
                type: 'Identifier',
                name: 'a'
              },
              alternate: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a === b ? c : d % e',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              test: {
                type: 'BinaryExpression',
                start: 0,
                end: 7,
                range: [0, 7],
                left: {
                  type: 'Identifier',
                  start: 0,
                  end: 1,
                  range: [0, 1],
                  name: 'a'
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'b'
                }
              },
              consequent: {
                type: 'Identifier',
                start: 10,
                end: 11,
                range: [10, 11],
                name: 'c'
              },
              alternate: {
                type: 'BinaryExpression',
                start: 14,
                end: 19,
                range: [14, 19],
                left: {
                  type: 'Identifier',
                  start: 14,
                  end: 15,
                  range: [14, 15],
                  name: 'd'
                },
                operator: '%',
                right: {
                  type: 'Identifier',
                  start: 18,
                  end: 19,
                  range: [18, 19],
                  name: 'e'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'true ? y : false',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'Identifier',
                name: 'y'
              },
              alternate: {
                type: 'Literal',
                value: false
              }
            }
          }
        ]
      }
    ],
    [
      '"1" ? "" : "1"',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: '1'
              },
              consequent: {
                type: 'Literal',
                value: ''
              },
              alternate: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'true ? y : z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Literal',
                value: true
              },
              consequent: {
                type: 'Identifier',
                name: 'y'
              },
              alternate: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      'Symbol() ? 1 : 2, 1',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'ConditionalExpression',
                  test: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'Symbol'
                    },
                    arguments: []
                  },
                  consequent: {
                    type: 'Literal',
                    value: 1
                  },
                  alternate: {
                    type: 'Literal',
                    value: 2
                  }
                },
                {
                  type: 'Literal',
                  value: 1
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x && y ? 1 : 2',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '&&'
              },
              consequent: {
                type: 'Literal',
                value: 1
              },
              alternate: {
                type: 'Literal',
                value: 2
              }
            }
          }
        ]
      }
    ],
    [
      'a ? !b : !c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                  type: 'Identifier',
                  name: 'b'
                },
                prefix: true
              },
              alternate: {
                type: 'UnaryExpression',
                operator: '!',
                argument: {
                  type: 'Identifier',
                  name: 'c'
                },
                prefix: true
              }
            }
          }
        ]
      }
    ],

    [
      'a?b=c:d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
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
              },
              alternate: {
                type: 'Identifier',
                name: 'd'
              }
            }
          }
        ]
      }
    ],
    [
      'a === b ? c : d % e;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '==='
              },
              consequent: {
                type: 'Identifier',
                name: 'c'
              },
              alternate: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'd'
                },
                right: {
                  type: 'Identifier',
                  name: 'e'
                },
                operator: '%'
              }
            }
          }
        ]
      }
    ],
    [
      'a=b?c:d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b'
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c'
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a?b=c:d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'Identifier',
                name: 'a'
              },
              consequent: {
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
              },
              alternate: {
                type: 'Identifier',
                name: 'd'
              }
            }
          }
        ]
      }
    ],
    [
      'a ? !b : !c;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'ConditionalExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              test: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'a'
              },
              consequent: {
                type: 'UnaryExpression',
                start: 4,
                end: 6,
                range: [4, 6],
                operator: '!',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 5,
                  end: 6,
                  range: [5, 6],
                  name: 'b'
                }
              },
              alternate: {
                type: 'UnaryExpression',
                start: 9,
                end: 11,
                range: [9, 11],
                operator: '!',
                prefix: true,
                argument: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  name: 'c'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
