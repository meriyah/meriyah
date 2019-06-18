import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions -In', () => {
  for (const arg of [
    'NaN in a',
    '"string" in a',
    '0 in a',
    'Math.pow(2,30)-1 in {}',
    '+0 in {}',
    '+0 in []',
    '0.001 in a[2]'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Expressions -In', [
    [
      'x in Number',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'x',
                type: 'Identifier'
              },
              operator: 'in',
              right: {
                name: 'Number',
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
      '(NUMBER = Number, "MAX_VALUE") in NUMBER',
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
                type: 'SequenceExpression',
                expressions: [
                  {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'NUMBER'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'Number'
                    }
                  },
                  {
                    type: 'Literal',
                    value: 'MAX_VALUE'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                name: 'NUMBER'
              },
              operator: 'in'
            }
          }
        ]
      }
    ],
    [
      '"valueOf" in __proto',
      Context.OptionsRaw | Context.OptionsDirectives,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Literal',
                value: 'valueOf',
                raw: '"valueOf"'
              },
              right: {
                type: 'Identifier',
                name: '__proto'
              },
              operator: 'in'
            },
            directive: 'valueOf'
          }
        ]
      }
    ]
  ]);
});
