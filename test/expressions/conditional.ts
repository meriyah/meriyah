import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';

describe('Expressions - Conditional', () => {
  fail('Expressions - Conditional (fail)', [
    ['a ? await x : c', Context.None],
    ['a ? b : await c', Context.None],
    ['a ? b : yield c', Context.None]
  ]);

  pass('Expressions - Conditional (pass)', [
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
                  name: 'd'
                }
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
      'x = (0) ? 1 : 2',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Literal',
                  value: 0
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
          }
        ]
      }
    ],
    [
      '(y ? y : true)',
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
                name: 'y'
              },
              consequent: {
                type: 'Identifier',
                name: 'y'
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
              id: null,
              async: false,
              generator: false,
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
    ]
  ]);
});
