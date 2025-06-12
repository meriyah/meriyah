import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

pass('p', [
  [
    '((a))',
    Context.OptionsPreserveParens | Context.OptionsLoc,
    {
      body: [
        {
          expression: {
            expression: {
              loc: {
                end: {
                  column: 3,
                  line: 1,
                },
                start: {
                  column: 2,
                  line: 1,
                },
              },
              name: 'a',
              type: 'Identifier',
            },
            loc: {
              end: {
                column: 4,
                line: 1,
              },
              start: {
                column: 1,
                line: 1,
              },
            },
            type: 'ParenthesizedExpression',
          },
          loc: {
            end: {
              column: 5,
              line: 1,
            },
            start: {
              column: 0,
              line: 1,
            },
          },
          type: 'ExpressionStatement',
        },
      ],
      loc: {
        end: {
          column: 5,
          line: 1,
        },
        start: {
          column: 0,
          line: 1,
        },
      },
      sourceType: 'script',
      type: 'Program',
    },
  ],
]);
