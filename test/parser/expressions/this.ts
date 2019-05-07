import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Expressions - This', () => {
  pass('Expressions - This (pass)', [
    [
      'this._global = _global;',
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
                  type: 'ThisExpression'
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: '_global'
                }
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: '_global'
              }
            }
          }
        ]
      }
    ],
    [
      'this\n/foo;',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                type: 'ThisExpression'
              },
              operator: '/',
              right: {
                name: 'foo',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'this\n/foo/g;',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  type: 'ThisExpression'
                },
                operator: '/',
                right: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'BinaryExpression'
              },
              operator: '/',
              right: {
                name: 'g',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
