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
    ['label: function* g() {}', Context.None],
    ['label: const x = null;', Context.None],
    ['label: function g() {}', Context.Strict],
    ['label: let x;', Context.None],
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
    ['aw\\u0061it: 1;', Context.None],
    ['aw\\u0061it: 1;', Context.Module | Context.Strict],
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
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {
                    type: 'Identifier',
                    name: 'await'
                  },
                  body: {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'await: while (await) { continue await; }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'await'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Identifier',
                name: 'await'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ContinueStatement',
                    label: {
                      type: 'Identifier',
                      name: 'await'
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
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  name: 'let'
                },
                {
                  type: 'Identifier',
                  name: 'let'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'let: foo',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'let'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'foo: function bar() {}',
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
                name: 'bar'
              }
            }
          }
        ]
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
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'start'
            },
            body: {
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'BreakStatement',
                label: {
                  type: 'Identifier',
                  name: 'start'
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
              type: 'WhileStatement',
              test: {
                type: 'Literal',
                value: true
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'BreakStatement',
                    label: {
                      type: 'Identifier',
                      name: '__proto__'
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
