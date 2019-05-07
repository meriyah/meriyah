import { Context } from '../../src/common';
import { pass } from '../test-utils';

describe('Expressions - Additive', () => {
  pass('Expressions - Additive (pass)', [
    [
      'd = a + b;  a = b;',
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
                name: 'd'
              },
              operator: '=',
              right: {
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
              }
            }
          },
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
      '--a',
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
                name: 'a'
              },
              operator: '--',
              prefix: true
            }
          }
        ]
      }
    ]
  ]);
});
