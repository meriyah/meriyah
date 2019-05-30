import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Conditional', () => {
  pass('Expressions - Conditional (pass)', [
    [
      'a&b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 3,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 3,
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 3,
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              },
              operator: '&',
              right: {
                type: 'Identifier',
                start: 2,
                end: 3,
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a^b',
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
              operator: '^'
            }
          }
        ]
      }
    ],
    [
      '~a',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: '~',
              argument: {
                type: 'Identifier',
                name: 'a'
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      'a>>b',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 4,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 4,
            expression: {
              type: 'BinaryExpression',
              start: 0,
              end: 4,
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                name: 'a'
              },
              operator: '>>',
              right: {
                type: 'Identifier',
                start: 3,
                end: 4,
                name: 'b'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a|b',
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
              operator: '|'
            }
          }
        ]
      }
    ],

    [
      'a>>>b',
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
              operator: '>>>'
            }
          }
        ]
      }
    ],
    [
      'x != y',
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
                name: 'y'
              },
              operator: '!='
            }
          }
        ]
      }
    ],
    [
      'x <= y',
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
                name: 'y'
              },
              operator: '<='
            }
          }
        ]
      }
    ],
    [
      'x << y',
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
                name: 'y'
              },
              operator: '<<'
            }
          }
        ]
      }
    ]
  ]);
});
