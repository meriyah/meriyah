import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';

describe('Statements - While', () => {
  fail('Statements - While (fail)', [
    ['while 1 break;', Context.None],
    ['while "hood" break;', Context.None],
    ['while (false) function f() {}', Context.None],
    ['while (false) let x = 1;', Context.None],
    ['while 1 break;', Context.None],
    [`while '' break;`, Context.None],
    ['while (false) label1: label2: function f() {}', Context.None],
    [
      `while({1}){
    break ;
 };`,
      Context.Module
    ]
  ]);

  pass('Statements - While (pass)', [
    [
      'while (1) /foo/',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                regex: {
                  flags: '',
                  pattern: 'foo'
                },
                type: 'Literal',
                value: /foo/
              },
              type: 'ExpressionStatement'
            },
            test: {
              type: 'Literal',
              value: 1
            },
            type: 'WhileStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'while (x < 10) { x++; y--; }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'Literal',
                value: 10
              }
            },
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    prefix: false
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '--',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    prefix: false
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'while (i-->1) {}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'BinaryExpression',
              operator: '>',
              left: {
                type: 'UpdateExpression',
                operator: '--',
                argument: {
                  type: 'Identifier',
                  name: 'i'
                },
                prefix: false
              },
              right: {
                type: 'Literal',
                value: 1
              }
            },
            body: {
              type: 'BlockStatement',
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a: while (true) continue a;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'a'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'ContinueStatement',
                label: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'while (foo) bar;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'WhileStatement',
            test: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'bar'
              }
            }
          }
        ]
      }
    ]
  ]);
});
