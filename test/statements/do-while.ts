import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    ['do foo while (bar);', Context.None],
    ['do async \n f(){}; while (y)', Context.None],
    ['do async \n () => x; while(y)', Context.None],
    ['do async () \n => x; while(y)', Context.None]
  ]);

  pass('Statements - Do while (pass)', [
    [
      'do async \n while (y)',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'async',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            test: {
              name: 'y',
              type: 'Identifier'
            },
            type: 'DoWhileStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'do async \n () \n while (y)',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                arguments: [],
                callee: {
                  name: 'async',
                  type: 'Identifier'
                },
                type: 'CallExpression'
              },
              type: 'ExpressionStatement'
            },
            test: {
              name: 'y',
              type: 'Identifier'
            },
            type: 'DoWhileStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],

    [
      'do foo; while (bar);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo'
              }
            },
            test: {
              type: 'Identifier',
              name: 'bar'
            }
          }
        ]
      }
    ]
  ]);
});
