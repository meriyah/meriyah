import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    ['do foo while (bar);', Context.None],
    ['do async \n f(){}; while (y)', Context.None],
    ['do async \n () => x; while(y)', Context.None],
    ['do async () \n => x; while(y)', Context.None],
    ['do let x = 1; while (false)', Context.None],
    ['do switch(x){} while(x) x', Context.None],
    ['do try {} catch {} while(x) x', Context.None],
    ['do try {} catch {} while(x) x', Context.None],
    ['do if (x) {} while(x) x', Context.None],
    ['do debugger; while(x) x', Context.None],
    ['do debugger while(x) x', Context.None],
    ['do;while(0) 0;', Context.None]
  ]);

  pass('Statements - Do while (pass)', [
    [
      `do;while(0) 0;`,
      Context.OptionsSpecDeviation,
      {
        body: [
          {
            body: {
              type: 'EmptyStatement'
            },
            test: {
              type: 'Literal',
              value: 0
            },
            type: 'DoWhileStatement'
          },
          {
            expression: {
              type: 'Literal',
              value: 0
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `do x
    while ({ [y]: {} ? null : false  })`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        body: [
          {
            type: 'DoWhileStatement',
            start: 0,
            end: 44,
            body: {
              type: 'ExpressionStatement',
              start: 3,
              end: 4,
              expression: {
                type: 'Identifier',
                start: 3,
                end: 4,
                name: 'x'
              }
            },
            test: {
              type: 'ObjectExpression',
              start: 16,
              end: 43,
              properties: [
                {
                  type: 'Property',
                  start: 18,
                  end: 40,
                  method: false,
                  shorthand: false,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    start: 19,
                    end: 20,
                    name: 'y'
                  },
                  value: {
                    type: 'ConditionalExpression',
                    start: 23,
                    end: 40,
                    test: {
                      type: 'ObjectExpression',
                      start: 23,
                      end: 25,
                      properties: []
                    },
                    consequent: {
                      type: 'Literal',
                      start: 28,
                      end: 32,
                      value: null
                    },
                    alternate: {
                      type: 'Literal',
                      start: 35,
                      end: 40,
                      value: false
                    }
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        body: [
          {
            type: 'DoWhileStatement',
            start: 0,
            end: 20,
            body: {
              type: 'ExpressionStatement',
              start: 3,
              end: 7,
              expression: {
                type: 'Identifier',
                start: 3,
                end: 6,
                name: 'foo'
              }
            },
            test: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'bar'
            }
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
