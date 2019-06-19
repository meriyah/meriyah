import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - While', () => {
  fail('Statements - While (fail)', [
    ['while 1 break;', Context.None],
    ['while "hood" break;', Context.None],
    ['while (false) function f() {}', Context.None],
    ['while (false) let x = 1;', Context.None],
    ['while 1 break;', Context.None],
    [`while '' break;`, Context.None],
    [`while '' break;`, Context.OptionsWebCompat],
    ['while(0) !function(){ break; };', Context.None],
    ['while(0) { function f(){ break; } }', Context.None],
    ['while (false) label1: label2: function f() {}', Context.None],
    ['while (false) async function f() {}', Context.None],
    ['while (false) const x = null;', Context.None],
    ['while (false) function* g() {}', Context.None],
    ['while true break;', Context.None],
    ['while({1}){ break ; };', Context.None],
    ['while({1}){ break ; };', Context.OptionsWebCompat]
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
      `var i = 0;
      woohoo:{
        while(true){
          i++;
          if ( i == 10 ) {
            break woohoo;
          }
        }
      }`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Literal',
                  value: 0
                },
                id: {
                  type: 'Identifier',
                  name: 'i'
                }
              }
            ]
          },
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'woohoo'
            },
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'WhileStatement',
                  test: {
                    type: 'Literal',
                    value: true
                  },
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'UpdateExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          operator: '++',
                          prefix: false
                        }
                      },
                      {
                        type: 'IfStatement',
                        test: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'i'
                          },
                          right: {
                            type: 'Literal',
                            value: 10
                          },
                          operator: '=='
                        },
                        consequent: {
                          type: 'BlockStatement',
                          body: [
                            {
                              type: 'BreakStatement',
                              label: {
                                type: 'Identifier',
                                name: 'woohoo'
                              }
                            }
                          ]
                        },
                        alternate: null
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `while (false) let // ASI
      x = 1;`,
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'WhileStatement'
          },
          {
            expression: {
              left: {
                name: 'x',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `while (false) let // ASI
  {}`,
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'WhileStatement'
          },
          {
            body: [],
            type: 'BlockStatement'
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
      'while (this) try {} catch (h) {}',
      Context.None,
      {
        body: [
          {
            body: {
              block: {
                body: [],
                type: 'BlockStatement'
              },
              finalizer: null,
              handler: {
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                param: {
                  name: 'h',
                  type: 'Identifier'
                },
                type: 'CatchClause'
              },
              type: 'TryStatement'
            },
            test: {
              type: 'ThisExpression'
            },
            type: 'WhileStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
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
