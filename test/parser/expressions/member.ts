import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Member', () => {
  fail('Expressions - Group (fail)', [['kleuver.123', Context.None]]);
  pass('Expressions - Member (pass)', [
    [
      'foo.bar',
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
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'bar'
              }
            }
          }
        ]
      }
    ],
    [
      '(a[b]||(c[d]=e))',
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
      'a&&(b=c)&&(d=e)',
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
              },
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'e'
                }
              },
              operator: '&&'
            }
          }
        ]
      }
    ],
    [
      'a.$._.B0',
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
                    name: '$'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: '_'
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'B0'
              }
            }
          }
        ]
      }
    ],
    [
      'a.if',
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
              computed: false,
              property: {
                type: 'Identifier',
                name: 'if'
              }
            }
          }
        ]
      }
    ],
    [
      'a().b',
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
                  type: 'Identifier',
                  name: 'a'
                },
                arguments: []
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'b'
              }
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
