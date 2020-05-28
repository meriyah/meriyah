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
      'throw ((((((d = null)))) ? (((--r))) : ((/|[--]*||[^\u2B7a+-?]+|(?!)/giy))));',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ThrowStatement',
            argument: {
              type: 'ConditionalExpression',
              test: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'd'
                },
                operator: '=',
                right: {
                  type: 'Literal',
                  value: null
                }
              },
              consequent: {
                type: 'UpdateExpression',
                argument: {
                  type: 'Identifier',
                  name: 'r'
                },
                operator: '--',
                prefix: true
              },
              alternate: {
                type: 'Literal',
                value: /|[--]*||[^⭺+-?]+|(?!)/giy,
                regex: {
                  pattern: '|[--]*||[^⭺+-?]+|(?!)',
                  flags: 'giy'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'throw /(?=[^\x4f-\xF5(-)])/imy',
      Context.None,
      {
        body: [
          {
            argument: {
              regex: {
                flags: 'imy',
                pattern: '(?=[^O-õ(-)])'
              },
              type: 'Literal',
              value: /(?=[^O-õ(-)])/imy
            },
            type: 'ThrowStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'throw foo;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ThrowStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            argument: {
              type: 'Identifier',
              start: 6,
              end: 9,
              range: [6, 9],
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
