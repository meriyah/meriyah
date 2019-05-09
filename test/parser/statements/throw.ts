import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Throw', () => {
  const inValids: [string, Context][] = [
    [
      `throw
    x;`,
      Context.None
    ]
  ];

  fail('Statements - Throw', inValids);

  pass('Statements - Throw (pass)', [
    [
      'throw foo;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw foo',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw 12',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'Literal',
              value: 12
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw x * y',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'BinaryExpression',
              operator: '*',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'throw foo;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ]
  ]);
});
