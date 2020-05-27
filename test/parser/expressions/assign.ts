import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Assign', () => {
  fail('Expressions - Assign (fail)', [
    ['a = b + c = d', Context.None],
    ['(({a})=0);', Context.None],
    ['(([a])=0);', Context.None],
    ['([(a = b)] = []', Context.None],
    ['42 = 42;', Context.None],
    ['"x" = 42;', Context.None],
    ['[(a = 0)] = 1', Context.None]
  ]);

  for (const arg of [
    '[v2 = 10, vNull = 11, vHole = 12, vUndefined = 13, vOob = 14] = [2, null, , undefined];',
    ' [ xFn = function x() {}, fn = function() {} ] = []',
    '0, [ x = y ] = [];',
    '[a,b] = [b,a];',
    'a = (b, c)',
    'x <<= 42',
    'x &= 42;',
    'x /= 42',
    'arguments = 42',
    'x >>>= 42',
    'a=0;',
    '(a)=(0);',
    'x *= 0',
    'x.x *= 0',
    'x /= 0',
    'x **= 0',
    '((((((((((((((((((((((((((((((((((((((((a)))))))))))))))))))))))))))))))))))))))) = 0;',
    '[0].length = 0',
    '(a**b).c=0',
    'x = [ x = yield ] = [];',
    '0, [[ _ ]] = [ , ];',
    '0, [[ x ]] = [undefined];',
    'x = [[{}[yield]]] = [[22]];',
    'a = [{ x = yield }] =  [{}];',
    '0, [ c ] = [1];',
    'x = [] = "string literal";',
    'x = [...[x]] = [];',
    'x = [...[x]] = [1, 2, 3]',
    'x = [...{ 0: x, length }] = [null];',
    'x = [...x[yield]] = [33, 44, 55];',
    'x = { yield } = { yield: 3 };',
    'x = { xFn = function x() {}, fn = function() {} } = {}',
    'x = { x: arrow = () => {} } = {};',
    'x = { x: xCover = (0, function() {}), x: cover = (function() {}) } = {};',
    '0, { x: x = y } = {};',
    '0, { x: [ x ] } = { x: null };',
    '0, { x: [ x ] } = {};',
    '0, { a: c } = { a: 2 };',
    'x = { xy: x.y } = { xy: 4 };',
    'from === undefined',
    'of = 42',
    'if (from === undefined) {}',
    '([target()[targetKey()]] = source());',
    'x = { __proto__: x, __proto__: y } = value;',
    'x = x = y = null;',
    'x = ({ __proto__: x, __proto__: y } = value);',
    'arrow = () => {};'
  ]) {
    it(`${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  pass('Expressions - Assign (pass)', [
    [
      'a *= b',
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
              operator: '*=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a /= b',
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
              operator: '/=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a %= b',
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
              operator: '%=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a += b',
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
              operator: '+=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a -= b',
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
              operator: '-=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a <<= b',
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
              operator: '<<=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a >>= b',
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
              operator: '>>=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a >>>= b',
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
              operator: '>>>=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a |= b',
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
              operator: '|=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a ^= b',
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
              operator: '^=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a |= b',
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
              operator: '|=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a **= b',
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
              operator: '**=',
              right: {
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'a = b = c',
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
          }
        ]
      }
    ],
    [
      'a = b = c = d',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'b'
                },
                operator: '=',
                right: {
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
          }
        ]
      }
    ],
    [
      '(a) = b;',
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
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      '((a)) = b;',
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
                type: 'Identifier',
                name: 'b'
              }
            }
          }
        ]
      }
    ],
    [
      'x = ((y)) = z',
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
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = ((b)) = c;',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 14
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 14
              }
            },
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 13
                }
              },
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 1
                  }
                },
                name: 'a'
              },
              right: {
                type: 'AssignmentExpression',
                start: 4,
                end: 13,
                range: [4, 13],
                loc: {
                  start: {
                    line: 1,
                    column: 4
                  },
                  end: {
                    line: 1,
                    column: 13
                  }
                },
                operator: '=',
                left: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  loc: {
                    start: {
                      line: 1,
                      column: 6
                    },
                    end: {
                      line: 1,
                      column: 7
                    }
                  },
                  name: 'b'
                },
                right: {
                  type: 'Identifier',
                  start: 12,
                  end: 13,
                  range: [12, 13],
                  loc: {
                    start: {
                      line: 1,
                      column: 12
                    },
                    end: {
                      line: 1,
                      column: 13
                    }
                  },
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
