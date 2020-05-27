import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Statements - Labeled', () => {
  for (const arg of [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'null',
    'true',
    'false',
    'enum'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.Strict);
      });
    });
  }

  fail('Statements - Labeled (fail)', [
    ['label: class C {};', Context.None],
    ['label: let x;', Context.None],
    ['a: async function* a(){}', Context.None],
    ['if (false) label1: label2: function test262() {} else ;', Context.None],
    ['label: function* g() {}', Context.None],
    ['label: const x = null;', Context.None],
    ['label: function g() {}', Context.Strict],
    ['label: let x;', Context.None],
    ['await: 1;', Context.Module],
    ['bar: function* x() {}', Context.None],
    ['await: 1;', Context.Strict | Context.Module],
    ['yield: 1;', Context.Strict],
    ['foo:for;', Context.None],
    ['super: while(true) { break super; }"', Context.None],
    ['function test_func() { super: while(true) { break super; }}"', Context.None],
    ['() => {super: while(true) { break super; }}"', Context.None],
    ['do { test262: { continue test262; } } while (false)', Context.None],
    ['"use strict"; super: while(true) { break super; }', Context.None],
    ['"use strict"; package: while(true) { break package; }', Context.None],
    ['false: ;', Context.None],
    ['true: ;', Context.None],
    ['(async function*() { yield: 1; });', Context.None],
    ['function *gen() { yield: ;}', Context.None],
    ['function *gen() { yield: ;}', Context.Strict],
    ['var obj = { *method() { yield: ; } };', Context.None],
    ['var obj = { *method() { yield: ; } };', Context.Strict],
    ['foo: function f() {}', Context.None],
    ['async () => { \\u{61}wait: x }', Context.None],
    ['async () => { aw\\u{61}it: x }', Context.None],
    ['async () => { \\u{61}wait: x }', Context.Strict | Context.Module],
    ['async () => { aw\\u{61}it: x }', Context.None],
    ['function *f(){ await: x; }', Context.Module],
    ['await: x', Context.Strict | Context.Module],
    ['await: 1;', Context.Strict | Context.Module],
    ['false: x', Context.None],
    ['implements: x', Context.Strict],
    ['package: x', Context.Strict],
    ['let: x', Context.Strict],
    ['yield: x', Context.Strict],
    ['function *f(){ yield: x; }', Context.Strict],
    ['yield: { function *f(){ break await; } }', Context.Strict],
    ['bar: foo: ding: foo: x', Context.None],
    ['foo: bar: foo: x', Context.None],
    ['a: { a: x }', Context.None],
    ['yield: { function *f(){ break await; } }', Context.None],
    ['yield: { function *f(){ break await; } }', Context.None]
  ]);

  pass('Statements - Labeled (pass)', [
    [
      'function *f(){ await: x; }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 26,
            range: [0, 26],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 26,
              range: [13, 26],
              body: [
                {
                  type: 'LabeledStatement',
                  start: 15,
                  end: 24,
                  range: [15, 24],
                  body: {
                    type: 'ExpressionStatement',
                    start: 22,
                    end: 24,
                    range: [22, 24],
                    expression: {
                      type: 'Identifier',
                      start: 22,
                      end: 23,
                      range: [22, 23],
                      name: 'x'
                    }
                  },
                  label: {
                    type: 'Identifier',
                    start: 15,
                    end: 20,
                    range: [15, 20],
                    name: 'await'
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
      'await: while (await) { continue await; }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 40,
        range: [0, 40],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 40,
            range: [0, 40],
            body: {
              type: 'WhileStatement',
              start: 7,
              end: 40,
              range: [7, 40],
              test: {
                type: 'Identifier',
                start: 14,
                end: 19,
                range: [14, 19],
                name: 'await'
              },
              body: {
                type: 'BlockStatement',
                start: 21,
                end: 40,
                range: [21, 40],
                body: [
                  {
                    type: 'ContinueStatement',
                    start: 23,
                    end: 38,
                    range: [23, 38],
                    label: {
                      type: 'Identifier',
                      start: 32,
                      end: 37,
                      range: [32, 37],
                      name: 'await'
                    }
                  }
                ]
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 5,
              range: [0, 5],
              name: 'await'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async: while (async) { continue async; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'async'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Identifier',
                name: 'async'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ContinueStatement',
                    label: {
                      type: 'Identifier',
                      name: 'async'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'let, let, let, let',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'SequenceExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              expressions: [
                {
                  type: 'Identifier',
                  start: 0,
                  end: 3,
                  range: [0, 3],
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  start: 5,
                  end: 8,
                  range: [5, 8],
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  start: 10,
                  end: 13,
                  range: [10, 13],
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  start: 15,
                  end: 18,
                  range: [15, 18],
                  name: 'let'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let: foo',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            body: {
              type: 'ExpressionStatement',
              start: 5,
              end: 8,
              range: [5, 8],
              expression: {
                type: 'Identifier',
                start: 5,
                end: 8,
                range: [5, 8],
                name: 'foo'
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 3,
              range: [0, 3],
              name: 'let'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'foo: function bar() {}',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            body: {
              type: 'FunctionDeclaration',
              start: 5,
              end: 22,
              range: [5, 22],
              id: {
                type: 'Identifier',
                start: 14,
                end: 17,
                range: [14, 17],
                name: 'bar'
              },
              generator: false,
              async: false,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 20,
                end: 22,
                range: [20, 22],
                body: []
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 3,
              range: [0, 3],
              name: 'foo'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'yield: await',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'yield'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'await'
              }
            }
          }
        ]
      }
    ],
    [
      'a:package',
      Context.None,
      {
        body: [
          {
            body: {
              expression: {
                name: 'package',
                type: 'Identifier'
              },
              type: 'ExpressionStatement'
            },
            label: {
              name: 'a',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '__proto__: test',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: '__proto__'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'test'
              }
            }
          }
        ]
      }
    ],
    [
      'a:{break a;}',
      Context.None | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            body: {
              type: 'BlockStatement',
              start: 2,
              end: 12,
              range: [2, 12],
              body: [
                {
                  type: 'BreakStatement',
                  start: 3,
                  end: 11,
                  range: [3, 11],
                  label: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'a'
                  }
                }
              ]
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 1,
              range: [0, 1],
              name: 'a'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async: await',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'async'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'await'
              }
            }
          }
        ]
      }
    ],
    [
      'start: while (true) break start',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        range: [0, 31],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 31,
            range: [0, 31],
            body: {
              type: 'WhileStatement',
              start: 7,
              end: 31,
              range: [7, 31],
              test: {
                type: 'Literal',
                start: 14,
                end: 18,
                range: [14, 18],
                value: true
              },
              body: {
                type: 'BreakStatement',
                start: 20,
                end: 31,
                range: [20, 31],
                label: {
                  type: 'Identifier',
                  start: 26,
                  end: 31,
                  range: [26, 31],
                  name: 'start'
                }
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 5,
              range: [0, 5],
              name: 'start'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (false) {\n L: let\nx = 1; \n }',
      Context.None,
      {
        body: [
          {
            alternate: null,
            consequent: {
              body: [
                {
                  body: {
                    expression: {
                      name: 'let',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  },
                  label: {
                    name: 'L',
                    type: 'Identifier'
                  },
                  type: 'LabeledStatement'
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
              type: 'BlockStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'foo: bar: function f(){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'LabeledStatement',
              label: {
                type: 'Identifier',
                name: 'bar'
              },
              body: {
                type: 'FunctionDeclaration',
                params: [],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,
                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'foo: bar: third: function f(){}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'foo'
            },
            body: {
              type: 'LabeledStatement',
              label: {
                type: 'Identifier',
                name: 'bar'
              },
              body: {
                type: 'LabeledStatement',
                label: {
                  type: 'Identifier',
                  name: 'third'
                },
                body: {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  }
                }
              }
            }
          }
        ]
      }
    ],
    [
      'L: let\nx',
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
            label: {
              name: 'L',
              type: 'Identifier'
            },
            type: 'LabeledStatement'
          },
          {
            expression: {
              name: 'x',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '__proto__: while (true) { break __proto__; }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        range: [0, 44],
        body: [
          {
            type: 'LabeledStatement',
            start: 0,
            end: 44,
            range: [0, 44],
            body: {
              type: 'WhileStatement',
              start: 11,
              end: 44,
              range: [11, 44],
              test: {
                type: 'Literal',
                start: 18,
                end: 22,
                range: [18, 22],
                value: true
              },
              body: {
                type: 'BlockStatement',
                start: 24,
                end: 44,
                range: [24, 44],
                body: [
                  {
                    type: 'BreakStatement',
                    start: 26,
                    end: 42,
                    range: [26, 42],
                    label: {
                      type: 'Identifier',
                      start: 32,
                      end: 41,
                      range: [32, 41],
                      name: '__proto__'
                    }
                  }
                ]
              }
            },
            label: {
              type: 'Identifier',
              start: 0,
              end: 9,
              range: [0, 9],
              name: '__proto__'
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a:{break a;}',
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
              type: 'BlockStatement',
              body: [
                {
                  type: 'BreakStatement',
                  label: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
