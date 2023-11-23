import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Do while', () => {
  fail('Statements - Do while (fail)', [
    ['do foo while (bar);', Context.None],
    ['do async \n f(){}; while (y)', Context.None],
    ['do async \n () => x; while(y)', Context.None],
    ['do async () \n => x; while(y)', Context.None],
    ['do let x = 1; while (false)', Context.None],
    ['do x, y while (z)', Context.None],
    ['do foo while (bar);', Context.None],
    ['do ()=>x while(c)', Context.None],
    [
      `do
    a
    b
  while(c);`,
      Context.None
    ],
    ['do let {} = y', Context.None],
    ['do debugger while(x) x', Context.None],
    ['do x: function s(){}while(y)', Context.None],
    [
      `do throw function (v, h) {
      "use strict"
    } while ((""))`,
      Context.None
    ]
  ]);

  pass('Statements - Do while (pass)', [
    [
      `do;while(0) 0;`,
      Context.None,
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
        range: [0, 44],
        body: [
          {
            type: 'DoWhileStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            body: {
              type: 'ExpressionStatement',
              start: 3,
              end: 4,
              range: [3, 4],
              expression: {
                type: 'Identifier',
                start: 3,
                end: 4,
                range: [3, 4],
                name: 'x'
              }
            },
            test: {
              type: 'ObjectExpression',
              start: 16,
              end: 43,
              range: [16, 43],
              properties: [
                {
                  type: 'Property',
                  start: 18,
                  end: 40,
                  range: [18, 40],
                  method: false,
                  shorthand: false,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    start: 19,
                    end: 20,
                    range: [19, 20],
                    name: 'y'
                  },
                  value: {
                    type: 'ConditionalExpression',
                    start: 23,
                    end: 40,
                    range: [23, 40],
                    test: {
                      type: 'ObjectExpression',
                      start: 23,
                      end: 25,
                      range: [23, 25],
                      properties: []
                    },
                    consequent: {
                      type: 'Literal',
                      start: 28,
                      end: 32,
                      range: [28, 32],
                      value: null
                    },
                    alternate: {
                      type: 'Literal',
                      start: 35,
                      end: 40,
                      range: [35, 40],
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
      `do if(x=>{});else n
      while(y)`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'IfStatement',
              test: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 9,
                  end: 11,
                  range: [9, 11]
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 6,
                    end: 7,
                    range: [6, 7]
                  }
                ],
                async: false,
                expression: false,
                start: 6,
                end: 11,
                range: [6, 11]
              },
              consequent: {
                type: 'EmptyStatement',
                start: 12,
                end: 13,
                range: [12, 13]
              },
              alternate: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'n',
                  start: 18,
                  end: 19,
                  range: [18, 19]
                },
                start: 18,
                end: 19,
                range: [18, 19]
              },
              start: 3,
              end: 19,
              range: [3, 19]
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 32,
              end: 33,
              range: [32, 33]
            },
            start: 0,
            end: 34,
            range: [0, 34]
          }
        ],
        start: 0,
        end: 34,
        range: [0, 34]
      }
    ],
    [
      `do
      if(x=>{});
    while(y)`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'IfStatement',
              test: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 15,
                  end: 17,
                  range: [15, 17]
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 12,
                    end: 13,
                    range: [12, 13]
                  }
                ],
                async: false,
                expression: false,
                start: 12,
                end: 17,
                range: [12, 17]
              },
              consequent: {
                type: 'EmptyStatement',
                start: 18,
                end: 19,
                range: [18, 19]
              },
              alternate: null,
              start: 9,
              end: 19,
              range: [9, 19]
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 30,
              end: 31,
              range: [30, 31]
            },
            start: 0,
            end: 32,
            range: [0, 32]
          }
        ],
        start: 0,
        end: 32,
        range: [0, 32]
      }
    ],
    [
      `do
      for((function(){});;)x
    while(x);`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ForStatement',
              body: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'x',
                  start: 30,
                  end: 31,
                  range: [30, 31]
                },
                start: 30,
                end: 31,
                range: [30, 31]
              },
              init: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 24,
                  end: 26,
                  range: [24, 26]
                },
                async: false,
                generator: false,
                id: null,
                start: 14,
                end: 26,
                range: [14, 26]
              },
              test: null,
              update: null,
              start: 9,
              end: 31,
              range: [9, 31]
            },
            test: {
              type: 'Identifier',
              name: 'x',
              start: 42,
              end: 43,
              range: [42, 43]
            },
            start: 0,
            end: 45,
            range: [0, 45]
          }
        ],
        start: 0,
        end: 45,
        range: [0, 45]
      }
    ],
    [
      `do
        (function(){})
      while(y)`,
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 22,
                  end: 24,
                  range: [22, 24]
                },
                async: false,
                generator: false,
                id: null,
                start: 12,
                end: 24,
                range: [12, 24]
              },
              start: 11,
              end: 25,
              range: [11, 25]
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 38,
              end: 39,
              range: [38, 39]
            },
            start: 0,
            end: 40,
            range: [0, 40]
          }
        ],
        start: 0,
        end: 40,
        range: [0, 40]
      }
    ],
    [
      'do h(function(){});while(x)',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'h'
                },
                arguments: [
                  {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                ]
              }
            },
            test: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'do if(8)function s(){}while(y)',
      Context.OptionsWebCompat,
      {
        body: [
          {
            body: {
              alternate: null,
              consequent: {
                async: false,
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                generator: false,
                id: {
                  name: 's',
                  type: 'Identifier'
                },
                params: [],
                type: 'FunctionDeclaration'
              },
              test: {
                type: 'Literal',
                value: 8
              },
              type: 'IfStatement'
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
      `
do if(8)function s(){}
while(y)
`,
      Context.OptionsWebCompat,
      {
        body: [
          {
            body: {
              alternate: null,
              consequent: {
                async: false,
                body: {
                  body: [],
                  type: 'BlockStatement'
                },
                generator: false,
                id: {
                  name: 's',
                  type: 'Identifier'
                },
                params: [],
                type: 'FunctionDeclaration'
              },
              test: {
                type: 'Literal',
                value: 8
              },
              type: 'IfStatement'
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
      `do
      ()=>x
    while(c)`,
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'x',
                  start: 13,
                  end: 14,
                  range: [13, 14]
                },
                params: [],
                async: false,
                expression: true,
                start: 9,
                end: 14,
                range: [9, 14]
              },
              start: 9,
              end: 14,
              range: [9, 14]
            },
            test: {
              type: 'Identifier',
              name: 'c',
              start: 25,
              end: 26,
              range: [25, 26]
            },
            start: 0,
            end: 27,
            range: [0, 27]
          }
        ],
        start: 0,
        end: 27,
        range: [0, 27]
      }
    ],
    [
      'do foo; while (bar);',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'DoWhileStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            body: {
              type: 'ExpressionStatement',
              start: 3,
              end: 7,
              range: [3, 7],
              expression: {
                type: 'Identifier',
                start: 3,
                end: 6,
                range: [3, 6],
                name: 'foo'
              }
            },
            test: {
              type: 'Identifier',
              start: 15,
              end: 18,
              range: [15, 18],
              name: 'bar'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'do {} while (false) false',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            test: {
              type: 'Literal',
              value: false
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: false
            }
          }
        ]
      }
    ],
    [
      'do { } while (a); /^.*$/.test(b)',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'BlockStatement',
              body: []
            },
            test: {
              type: 'Identifier',
              name: 'a'
            }
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'Literal',
                  value: /^.*$/,
                  regex: {
                    pattern: '^.*$',
                    flags: ''
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'test'
                }
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
