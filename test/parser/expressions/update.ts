import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Update', () => {
  fail('Expressions - Update (fail)', [
    ['foo\n++', Context.None],
    ['if (foo\n++);', Context.None]
    /*['++[]', Context.None],
    ['++([])', Context.None],
    ['(++[])', Context.None],
    ['++[a]', Context.None],
    ['[a]++', Context.None],
    ['[]++', Context.None]*/
  ]);
  pass('Expressions - Update (pass)', [
    [
      'foo\n++\nbar',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'bar',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '++\nfoo;',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                name: 'foo',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'foo\n++bar',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'bar',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '++\nfoo;',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                name: 'foo',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '"foo"\n++bar',
      Context.None,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              value: 'foo'
            },
            directive: 'foo',
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'bar',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '+a++ / 1',
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
                type: 'UnaryExpression',
                operator: '+',
                argument: {
                  type: 'UpdateExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  operator: '++',
                  prefix: false
                },
                prefix: true
              },
              right: {
                type: 'Literal',
                value: 1
              },
              operator: '/'
            }
          }
        ]
      }
    ],
    [
      'a=b\n++c',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                name: 'b',
                type: 'Identifier'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'c',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a,b\n++c',
      Context.None,
      {
        body: [
          {
            expression: {
              expressions: [
                {
                  name: 'a',
                  type: 'Identifier'
                },
                {
                  name: 'b',
                  type: 'Identifier'
                }
              ],
              type: 'SequenceExpression'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'c',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a++\nb',
      Context.None,
      {
        body: [
          {
            expression: {
              argument: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '++',
              prefix: false,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              name: 'b',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a\n++\nb',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'b',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'a.a--',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              operator: '--',
              prefix: false
            }
          }
        ]
      }
    ],
    [
      '++a.a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'foo\n++bar',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              argument: {
                name: 'bar',
                type: 'Identifier'
              },
              operator: '++',
              prefix: true,
              type: 'UpdateExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '--a.a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'a'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              operator: '--',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      '++foo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'foo'
              },
              operator: '++',
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'bar++',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UpdateExpression',
              argument: {
                type: 'Identifier',
                name: 'bar'
              },
              operator: '++',
              prefix: false
            }
          }
        ]
      }
    ]
  ]);
});
