import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    ['do foo while (bar);', Context.None],
    ['do async \n f(){}; while (y)', Context.None],
    ['do async \n () => x; while(y)', Context.None],
    ['do async () \n => x; while(y)', Context.None],

    ['do switch(x){} while(x) x', Context.None],
    ['do try {} catch {} while(x) x', Context.None],
    ['do try {} catch {} while(x) x', Context.None],
    ['do if (x) {} while(x) x', Context.None],
    ['do debugger; while(x) x', Context.None],
    ['do debugger while(x) x', Context.None]
  ]);

  pass('Statements - Do while (pass)', [
    [
      `do x
    while ({ [y]: {} ? null : false  })`,
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'x',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            test: {
              properties: [
                {
                  computed: true,
                  key: {
                    name: 'y',
                    type: 'Identifier'
                  },
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    alternate: {
                      type: 'Literal',
                      value: false
                    },
                    consequent: {
                      type: 'Literal',
                      value: null
                    },
                    test: {
                      properties: [],
                      type: 'ObjectExpression'
                    },
                    type: 'ConditionalExpression'
                  }
                }
              ],
              type: 'ObjectExpression'
            },
            type: 'DoWhileStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
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
      'do while (x) continue \n while (x);',
      Context.None,
      {
        body: [
          {
            body: {
              body: {
                label: null,
                type: 'ContinueStatement'
              },
              test: {
                name: 'x',
                type: 'Identifier'
              },
              type: 'WhileStatement'
            },
            test: {
              name: 'x',
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
