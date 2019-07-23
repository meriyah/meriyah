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
    ['do;while(0) 0;', Context.None],
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
                  end: 11
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 6,
                    end: 7
                  }
                ],
                async: false,
                expression: false,
                start: 6,
                end: 11
              },
              consequent: {
                type: 'EmptyStatement',
                start: 12,
                end: 13
              },
              alternate: {
                type: 'ExpressionStatement',
                expression: {
                  type: 'Identifier',
                  name: 'n',
                  start: 18,
                  end: 19
                },
                start: 18,
                end: 19
              },
              start: 3,
              end: 19
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 32,
              end: 33
            },
            start: 0,
            end: 34
          }
        ],
        start: 0,
        end: 34
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
                  end: 17
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x',
                    start: 12,
                    end: 13
                  }
                ],
                async: false,
                expression: false,
                start: 12,
                end: 17
              },
              consequent: {
                type: 'EmptyStatement',
                start: 18,
                end: 19
              },
              alternate: null,
              start: 9,
              end: 19
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 30,
              end: 31
            },
            start: 0,
            end: 32
          }
        ],
        start: 0,
        end: 32
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
                  end: 31
                },
                start: 30,
                end: 31
              },
              init: {
                type: 'FunctionExpression',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: [],
                  start: 24,
                  end: 26
                },
                async: false,
                generator: false,
                id: null,
                start: 14,
                end: 26
              },
              test: null,
              update: null,
              start: 9,
              end: 31
            },
            test: {
              type: 'Identifier',
              name: 'x',
              start: 42,
              end: 43
            },
            start: 0,
            end: 45
          }
        ],
        start: 0,
        end: 45
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
                  end: 24
                },
                async: false,
                generator: false,
                id: null,
                start: 12,
                end: 24
              },
              start: 11,
              end: 25
            },
            test: {
              type: 'Identifier',
              name: 'y',
              start: 38,
              end: 39
            },
            start: 0,
            end: 40
          }
        ],
        start: 0,
        end: 40
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
      'do foo; while (bar);',
      Context.OptionsWebCompat | Context.OptionsRanges,
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
