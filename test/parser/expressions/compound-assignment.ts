import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Compound assignment', () => {
  for (const arg of [
    `[a >>>= a];`,
    `[a >>>= a += a];`,
    `[a >>>= (a += a)];`,
    `[a >>>= (a += (a))];`,
    `[a >>>= a += {a}];`,
    `[a >>>= a += {a}];`,
    `[a >>>= a += a];`,
    `([a += a] );`,
    `([...a += a] );`,
    `[a >>>= (a)];`,
    `([...a += a += a += (a) >>>= 2]);`,
    '[...a %= (a)];',
    `obj.prop >>= 20;`,
    `a |= 2;`,
    `obj.prop &= 20;`,
    'obj.len ^= 10;',
    'var z = (x += 1);',
    'var z = (x <<= 1);',
    'x -= 1 ',
    'y1 = (y %= 2);',
    'y1 === -1',
    'x *= "1";',
    'x /= null;',
    'x >>>= true;',
    'if (scope.x !== 2) {}',
    'x /= y',
    'base[prop] /= expr();',
    'x	>>=	1, 0',
    'x	*=	-1',
    '({a: a *= -1})',
    '([a *= -1])',
    '([(a *= -1)])'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '({a *= -1})',
    '({a} *= -1)',
    '({a}) *=	-1',
    '({a} += a);',
    '([a] += a);',
    `({a} += {a});`,
    `[a >>>= {a} += {a}];`,
    '[1 >>>= a];',
    '[a >>>= a] += 1;',
    '[a >>>= a] += a;',
    '({a: (b = 0)} = {})',
    '([(a = b)] = []',
    '({a: b += 0} = {})',
    '[a += b] = []',
    '0.toString',
    '0.toString',
    '1 >>>= 1;',
    '1 -= 1;',
    '1 &= 1;',
    '1 |= 1;',
    '1 = 1;'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions - Compound assignment (pass)', [
    [
      'base[prop()] /= expr();',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 22,
              range: [0, 22],
              operator: '/=',
              left: {
                type: 'MemberExpression',
                start: 0,
                end: 12,
                range: [0, 12],
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 4,
                  range: [0, 4],
                  name: 'base'
                },
                property: {
                  type: 'CallExpression',
                  start: 5,
                  end: 11,
                  range: [5, 11],
                  callee: {
                    type: 'Identifier',
                    start: 5,
                    end: 9,
                    range: [5, 9],
                    name: 'prop'
                  },
                  arguments: []
                },
                computed: true
              },
              right: {
                type: 'CallExpression',
                start: 16,
                end: 22,
                range: [16, 22],
                callee: {
                  type: 'Identifier',
                  start: 16,
                  end: 20,
                  range: [16, 20],
                  name: 'expr'
                },
                arguments: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'null && (x += null)',
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
              type: 'LogicalExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              left: {
                type: 'Literal',
                start: 0,
                end: 4,
                range: [0, 4],
                value: null
              },
              operator: '&&',
              right: {
                type: 'AssignmentExpression',
                start: 9,
                end: 18,
                range: [9, 18],
                operator: '+=',
                left: {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  name: 'x'
                },
                right: {
                  type: 'Literal',
                  start: 14,
                  end: 18,
                  range: [14, 18],
                  value: null
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'y1 = (y %= 2);',
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
              type: 'AssignmentExpression',
              start: 0,
              end: 13,
              range: [0, 13],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 2,
                range: [0, 2],
                name: 'y1'
              },
              right: {
                type: 'AssignmentExpression',
                start: 6,
                end: 12,
                range: [6, 12],
                operator: '%=',
                left: {
                  type: 'Identifier',
                  start: 6,
                  end: 7,
                  range: [6, 7],
                  name: 'y'
                },
                right: {
                  type: 'Literal',
                  start: 11,
                  end: 12,
                  range: [11, 12],
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
      'y1 = (y <<= 1);',
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
                name: 'y1'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '<<=',
                right: {
                  type: 'Literal',
                  value: 1
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x ^= new String("1");',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            range: [0, 21],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 20,
              range: [0, 20],
              operator: '^=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'NewExpression',
                start: 5,
                end: 20,
                range: [5, 20],
                callee: {
                  type: 'Identifier',
                  start: 9,
                  end: 15,
                  range: [9, 15],
                  name: 'String'
                },
                arguments: [
                  {
                    type: 'Literal',
                    start: 16,
                    end: 19,
                    range: [16, 19],
                    value: '1'
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x *= "1";',
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
              operator: '*=',
              right: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'obj.prop >>= 20;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '>>=',
              left: {
                type: 'MemberExpression',
                start: 0,
                end: 8,
                range: [0, 8],
                object: {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  range: [0, 3],
                  name: 'obj'
                },
                property: {
                  type: 'Identifier',
                  start: 4,
                  end: 8,
                  range: [4, 8],
                  name: 'prop'
                },
                computed: false
              },
              right: {
                type: 'Literal',
                start: 13,
                end: 15,
                range: [13, 15],
                value: 20
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'arguments &= 20;',
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
                name: 'arguments'
              },
              operator: '&=',
              right: {
                type: 'Literal',
                value: 20
              }
            }
          }
        ]
      }
    ],
    [
      'var z = (x *= -1);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 18,
            range: [0, 18],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 17,
                range: [4, 17],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'z'
                },
                init: {
                  type: 'AssignmentExpression',
                  start: 9,
                  end: 16,
                  range: [9, 16],
                  operator: '*=',
                  left: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'x'
                  },
                  right: {
                    type: 'UnaryExpression',
                    start: 14,
                    end: 16,
                    range: [14, 16],
                    operator: '-',
                    prefix: true,
                    argument: {
                      type: 'Literal',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      value: 1
                    }
                  }
                }
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var z = (x %= y);',
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
                init: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '%=',
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'x *= undefined;',
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
              operator: '*=',
              right: {
                type: 'Identifier',
                name: 'undefined'
              }
            }
          }
        ]
      }
    ],
    [
      'x -= 1;',
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
              operator: '-=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      '(new foo).bar()',
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
              type: 'CallExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 13,
                range: [0, 13],
                object: {
                  type: 'NewExpression',
                  start: 1,
                  end: 8,
                  range: [1, 8],
                  callee: {
                    type: 'Identifier',
                    start: 5,
                    end: 8,
                    range: [5, 8],
                    name: 'foo'
                  },
                  arguments: []
                },
                property: {
                  type: 'Identifier',
                  start: 10,
                  end: 13,
                  range: [10, 13],
                  name: 'bar'
                },
                computed: false
              },
              arguments: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a.b.c(2020)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              callee: {
                type: 'MemberExpression',
                start: 0,
                end: 5,
                range: [0, 5],
                object: {
                  type: 'MemberExpression',
                  start: 0,
                  end: 3,
                  range: [0, 3],
                  object: {
                    type: 'Identifier',
                    start: 0,
                    end: 1,
                    range: [0, 1],
                    name: 'a'
                  },
                  property: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'b'
                  },
                  computed: false
                },
                property: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'c'
                },
                computed: false
              },
              arguments: [
                {
                  type: 'Literal',
                  start: 6,
                  end: 10,
                  range: [6, 10],
                  value: 2020
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a(0).b(14, 3, 77).c',
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
              type: 'MemberExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              object: {
                type: 'CallExpression',
                start: 0,
                end: 17,
                range: [0, 17],
                callee: {
                  type: 'MemberExpression',
                  start: 0,
                  end: 6,
                  range: [0, 6],
                  object: {
                    type: 'CallExpression',
                    start: 0,
                    end: 4,
                    range: [0, 4],
                    callee: {
                      type: 'Identifier',
                      start: 0,
                      end: 1,
                      range: [0, 1],
                      name: 'a'
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        value: 0
                      }
                    ]
                  },
                  property: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'b'
                  },
                  computed: false
                },
                arguments: [
                  {
                    type: 'Literal',
                    start: 7,
                    end: 9,
                    range: [7, 9],
                    value: 14
                  },
                  {
                    type: 'Literal',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    value: 3
                  },
                  {
                    type: 'Literal',
                    start: 14,
                    end: 16,
                    range: [14, 16],
                    value: 77
                  }
                ]
              },
              property: {
                type: 'Identifier',
                start: 18,
                end: 19,
                range: [18, 19],
                name: 'c'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x >>= 1;',
      Context.OptionsRanges,
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
                name: 'x',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              operator: '>>=',
              right: {
                type: 'Literal',
                value: 1,
                start: 6,
                end: 7,
                range: [6, 7]
              },
              start: 0,
              end: 7,
              range: [0, 7]
            },
            start: 0,
            end: 8,
            range: [0, 8]
          }
        ],
        start: 0,
        end: 8,
        range: [0, 8]
      }
    ],
    [
      'var x1 = (x <<= 1);',
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
                init: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '<<=',
                  right: {
                    type: 'Literal',
                    value: 1
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'x1'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'x |= 1;',
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
              operator: '|=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      'x /= true;',
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
              operator: '/=',
              right: {
                type: 'Literal',
                value: true
              }
            }
          }
        ]
      }
    ],
    [
      'obj.len &= 10;',
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
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'obj'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'len'
                }
              },
              operator: '&=',
              right: {
                type: 'Literal',
                value: 10
              }
            }
          }
        ]
      }
    ],
    [
      'var x = 4;',
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
          }
        ]
      }
    ],
    [
      '(x + y) >= z',
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
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '>='
            }
          }
        ]
      }
    ],
    [
      '(x + y) <= z',
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
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'y'
                },
                operator: '+'
              },
              right: {
                type: 'Identifier',
                name: 'z'
              },
              operator: '<='
            }
          }
        ]
      }
    ],
    [
      'x *= undefined;',
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
              operator: '*=',
              right: {
                type: 'Identifier',
                name: 'undefined'
              }
            }
          }
        ]
      }
    ],
    [
      'x *= null;',
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
              operator: '*=',
              right: {
                type: 'Literal',
                value: null
              }
            }
          }
        ]
      }
    ],
    [
      'x |= "1";',
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
              operator: '|=',
              right: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'z = (x %= y);',
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
                name: 'z'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '%=',
                right: {
                  type: 'Identifier',
                  name: 'y'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x += "1";',
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
              operator: '+=',
              right: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'x >>= true;',
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
              operator: '>>=',
              right: {
                type: 'Literal',
                value: true
              }
            }
          }
        ]
      }
    ],

    [
      'x |= true',
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
              operator: '|=',
              right: {
                type: 'Literal',
                value: true
              }
            }
          }
        ]
      }
    ],

    [
      'x |= "1"',
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
              operator: '|=',
              right: {
                type: 'Literal',
                value: '1'
              }
            }
          }
        ]
      }
    ],
    [
      'x |= 1',
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
              operator: '|=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      'x += true',
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
              operator: '+=',
              right: {
                type: 'Literal',
                value: true
              }
            }
          }
        ]
      }
    ]
  ]);
});
