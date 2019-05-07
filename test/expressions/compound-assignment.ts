import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

describe('Expressions - Compound assignment', () => {
  for (const arg of [
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
                  name: 'base'
                },
                computed: true,
                property: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'prop'
                  },
                  arguments: []
                }
              },
              operator: '/=',
              right: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'expr'
                },
                arguments: []
              }
            }
          }
        ]
      }
    ],
    [
      'null && (x += null)',
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
                type: 'Literal',
                value: null
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                operator: '+=',
                right: {
                  type: 'Literal',
                  value: null
                }
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'y1 = (y %= 2);',
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
                operator: '%=',
                right: {
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
              operator: '^=',
              right: {
                type: 'NewExpression',
                callee: {
                  type: 'Identifier',
                  name: 'String'
                },
                arguments: [
                  {
                    type: 'Literal',
                    value: '1'
                  }
                ]
              }
            }
          }
        ]
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
                  name: 'prop'
                }
              },
              operator: '>>=',
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
                  operator: '*=',
                  right: {
                    type: 'UnaryExpression',
                    operator: '-',
                    argument: {
                      type: 'Literal',
                      value: 1
                    },
                    prefix: true
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
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'NewExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  arguments: []
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'bar'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'a.b.c(2020)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'c'
                }
              },
              arguments: [
                {
                  type: 'Literal',
                  value: 2020
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'a(0).b(14, 3, 77).c',
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
                type: 'CallExpression',
                callee: {
                  type: 'MemberExpression',
                  object: {
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 0
                      }
                    ]
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                arguments: [
                  {
                    type: 'Literal',
                    value: 14
                  },
                  {
                    type: 'Literal',
                    value: 3
                  },
                  {
                    type: 'Literal',
                    value: 77
                  }
                ]
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      'x >>= 1;',
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
                value: 1
              }
            }
          }
        ]
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
