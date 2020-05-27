import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - Logical', () => {
  pass('Expressions - Logical (pass)', [
    [
      'a&&b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '&&'
            }
          }
        ]
      }
    ],

    [
      'a == b != c === d !== e',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              left: {
                type: 'BinaryExpression',
                start: 0,
                end: 17,
                range: [0, 17],
                left: {
                  type: 'BinaryExpression',
                  start: 0,
                  end: 11,
                  range: [0, 11],
                  left: {
                    type: 'BinaryExpression',
                    start: 0,
                    end: 6,
                    range: [0, 6],
                    left: {
                      type: 'Identifier',
                      start: 0,
                      end: 1,
                      range: [0, 1],
                      name: 'a'
                    },
                    operator: '==',
                    right: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'b'
                    }
                  },
                  operator: '!=',
                  right: {
                    type: 'Identifier',
                    start: 10,
                    end: 11,
                    range: [10, 11],
                    name: 'c'
                  }
                },
                operator: '===',
                right: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'd'
                }
              },
              operator: '!==',
              right: {
                type: 'Identifier',
                start: 22,
                end: 23,
                range: [22, 23],
                name: 'e'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a & b == c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '=='
              },
              operator: '&'
            }
          }
        ]
      }
    ],
    [
      'a == b != c === d !== e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '=='
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '!='
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '==='
              },
              right: {
                type: 'Identifier',
                name: 'e'
              },
              operator: '!=='
            }
          }
        ]
      }
    ],
    [
      'a !== b === c != d == e',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '!=='
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '==='
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '!='
              },
              right: {
                type: 'Identifier',
                name: 'e'
              },
              operator: '=='
            }
          }
        ]
      }
    ],
    [
      'a == b & c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '=='
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '&'
            }
          }
        ]
      }
    ],
    [
      'a & b == c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '=='
              },
              operator: '&'
            }
          }
        ]
      }
    ],

    [
      'x / z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      'a||b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a < b == c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '<'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '=='
            }
          }
        ]
      }
    ],
    [
      'a << b < c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '<<'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '<'
            }
          }
        ]
      }
    ],
    [
      'a < b << c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '<<'
              },
              operator: '<'
            }
          }
        ]
      }
    ],
    [
      'a << b >> c >>> d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '<<'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '>>'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '>>>'
            }
          }
        ]
      }
    ],
    [
      'a >>> b >> c << d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '>>>'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '>>'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '<<'
            }
          }
        ]
      }
    ],
    [
      'a << b + c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '+'
              },
              operator: '<<'
            }
          }
        ]
      }
    ],
    [
      'a + b - c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '-'
            }
          }
        ]
      }
    ],
    [
      'a - b + c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '-'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a * b / c % d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '/'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '%'
            }
          }
        ]
      }
    ],
    [
      'a % b / c * d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  operator: '%'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '/'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      'a ** b * c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '**'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '*'
            }
          }
        ]
      }
    ],
    [
      'a ** b ** c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '**'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'a ** b ** c + d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '**'
                },
                operator: '**'
              },
              right: {
                type: 'Identifier',
                name: 'd'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a ** b + c ** d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '**'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '**'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a + b ** c ** d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  operator: '**'
                },
                operator: '**'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a + b ** c ** d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'd'
                  },
                  operator: '**'
                },
                operator: '**'
              },
              operator: '+'
            }
          }
        ]
      }
    ],

    [
      'a ** b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'x() ** b',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'x'
                },
                arguments: []
              },
              right: {
                type: 'Identifier',
                name: 'b'
              },
              operator: '**'
            }
          }
        ]
      }
    ],
    [
      'a + b + c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a + b * c * d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a * b + c * d',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '*'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                right: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '*'
              },
              operator: '+'
            }
          }
        ]
      }
    ],
    [
      'a && b || c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '&&'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a || b && c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'LogicalExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '&&'
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a | b && c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '|'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'a && b | c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '|'
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'x ? g / f : f * g',
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
                name: 'x'
              },
              consequent: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'g'
                },
                right: {
                  type: 'Identifier',
                  name: 'f'
                },
                operator: '/'
              },
              alternate: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'f'
                },
                right: {
                  type: 'Identifier',
                  name: 'g'
                },
                operator: '*'
              }
            }
          }
        ]
      }
    ],
    [
      'x * y / z ? a : b',
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
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  operator: '*'
                },
                right: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '/'
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
      'a ^ b | c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'a'
                },
                right: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '^'
              },
              right: {
                type: 'Identifier',
                name: 'c'
              },
              operator: '|'
            }
          }
        ]
      }
    ],
    [
      'a | b ^ c',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '^'
              },
              operator: '|'
            }
          }
        ]
      }
    ],

    [
      'x.y / z',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'x'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'y'
                }
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      'a[b, c]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'a'
              },
              computed: true,
              property: {
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    name: 'c'
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'a[b]||(c[d]=e)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: true,
                property: {
                  type: 'Identifier',
                  name: 'b'
                }
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  computed: true,
                  property: {
                    type: 'Identifier',
                    name: 'd'
                  }
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'e'
                }
              },
              operator: '||'
            }
          }
        ]
      }
    ],
    [
      'a&&(b=c)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a'
              },
              right: {
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
              operator: '&&'
            }
          }
        ]
      }
    ]
  ]);
});
