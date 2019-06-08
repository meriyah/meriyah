import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - ImportCall', () => {
  fail('Next - Import call (fail)', [
    ['function failsParse() { return import.then(); }', Context.None],
    ['import(x, y).then(z);', Context.None],
    ['import.then(doLoad);', Context.None],
    ['import(', Context.None],
    ['import)', Context.None],
    ['import()', Context.None],
    ['import("x', Context.None],
    ['import("x"]', Context.None],
    ['import["x")', Context.None],
    ['import = x', Context.None],
    ['import[', Context.None],
    ['import[]', Context.None],
    ['import]', Context.None],
    ['import[x]', Context.None],
    ['import{', Context.None],
    ['import[]', Context.Strict | Context.Module],
    ['import]', Context.Strict | Context.Module],
    ['import[x]', Context.Strict | Context.Module],
    ['import{', Context.Strict | Context.Module],
    ['import{x', Context.Strict | Context.Module],
    ['import{x}', Context.None],
    ['import(x, y)', Context.None],
    ['import(...y)', Context.None],
    ['import(x,)', Context.None],
    ['import(,)', Context.None],
    ['import(,y)', Context.None],
    ['import(;)', Context.None],
    ['[import]', Context.None],
    ['{import}', Context.None],
    ['import+', Context.None],
    ['import = 1', Context.None],
    ['import.wat', Context.None],
    ['new import(x)', Context.None],
    ['let f = () => import("", "");', Context.None],
    ['let f = () => { import(); };', Context.None],
    ['let f = () => { import(...[""]); }; new import(x)', Context.None],
    ['import("")++', Context.None],
    ['import("") -= 1;', Context.None],
    ['(async () => await import())', Context.None],
    ['(async () => { await import("", "") });', Context.None],
    ['async function f() { import(...[""]); }', Context.None],
    ['(async () => await import())', Context.None],
    ['async function * f() { await new import("") }', Context.None],
    ['label: { import(); };', Context.None],
    ['do { import(...[""]); } while (false);', Context.Strict | Context.Module],
    ['function fn() { new import(""); }', Context.None],
    ['if (true) { import(...[""]); }', Context.None],
    ['(async () => await import())', Context.None],
    ['with (import(...[""])) {}', Context.None],
    ['import();', Context.None],
    ['import("", "");', Context.None],
    ['import("", "");', Context.Module | Context.Strict],
    ['import("",);', Context.None],
    ['[import(1)] = [1];', Context.None],
    ['[import(x).then()] = [1];', Context.None],
    ['(a, import(foo)) => {}', Context.None],
    ['(1, import(1)) => {}', Context.None],
    ['({import(y=x)} = {"a": 1});', Context.None],
    ['({import(foo)} = {"a": 1});', Context.None],
    ['({import(1)} = {"a": 1});', Context.None],
    ['(import(foo)) => {}', Context.None],
    ['(import(1)) => {}', Context.None],
    ['(import(y=x)) => {}', Context.None],
    ['(a, import(x).then()) => {}', Context.None],
    ['(1, import(foo)) => {}', Context.None],
    ['function failsParse() { return import.then(); }', Context.None],
    ['var dynImport = import; dynImport("http");', Context.None],
    ['import()', Context.None],
    ['import(a, b)', Context.None],
    ['import(...[a])', Context.None],
    ['import(source,)', Context.None],
    ['new import(source)', Context.None],
    ['let f = () => import("",);', Context.None],
    ['let f = () => import("", "");', Context.None],
    ['if (false) {} else import("", "");', Context.None],
    ['new import(source)', Context.None],
    ['(import(foo)) => {}', Context.None],
    ['(import(y=x)) => {}', Context.None],
    ['(import(import(x))) => {}', Context.None],
    ['(1, import(x).then()) => {}', Context.None],
    ['[import(y=x)] = [1];', Context.None],
    ['[import(x).then()] = [1];', Context.None],
    ['[import(import(x))] = [1];', Context.None]
  ]);

  for (const arg of [
    'let f = () => { import("foo"); };',
    'f(...[import(y=x)])',
    'x = {[import(y=x)]: 1}',
    'var {[import(y=x)]: x} = {}',
    '({[import(y=x)]: x} = {})',
    'async () => { await import(x) }',
    'const importResult = import("test.js");',
    'let Layout = () => import("../foo/bar/zoo.js")',
    '"use strict"; import("test.js");',
    'function loadImport(file) { return import(`test/${file}.js`); }',
    '() => { import(x) }',
    '(import(y=x))',
    '{import(y=x)}',
    'import(delete obj.prop);',
    'import(void 0);',
    'import(typeof {});',
    'import(+void 0);',
    'import(-void 0);',
    'import(!void 0);',
    'import(~void 0);',
    'import(delete void typeof +-~! 0);',
    'let f = () => import("");',
    '(async () => await import(import(import("foo"))));',
    'async function * f() { await import(import(import("foo"))) }',
    'async function * f() { await import("foo") }',
    'if (false) { } else { import(import(import("foo"))); }',
    'if (true) import("foo");',
    'function fn() { return import("foo"); }',
    'let x = 0; while (!x) { x++;  import(import(import("foo"))); };',
    'import("foo");',
    `import('./module.js')`,
    'import(import(x))',
    'x = import(x)',
    'var x = import(x)',
    'let x = import(x)',
    'for(x of import(x)) {}',
    'import(x).then()'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext | Context.Module | Context.Strict);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, void 0, Context.OptionsNext);
      });
    });
  }

  pass('Next - ImportCall (pass)', [
    [
      `function* a() { yield import("http"); }`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Import',
                        start: 22,
                        end: 28
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: 'http',
                          start: 29,
                          end: 35
                        }
                      ],
                      start: 22,
                      end: 36
                    },
                    delegate: false,
                    start: 16,
                    end: 36
                  },
                  start: 16,
                  end: 37
                }
              ],
              start: 14,
              end: 39
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'a',
              start: 10,
              end: 11
            },
            start: 0,
            end: 39
          }
        ],
        start: 0,
        end: 39
      }
    ],
    [
      `import foo, * as namespace from "./namespace/drink.js"`,
      Context.Strict | Context.Module,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: './namespace/drink.js'
            },
            specifiers: [
              {
                local: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'ImportDefaultSpecifier'
              },
              {
                local: {
                  name: 'namespace',
                  type: 'Identifier'
                },
                type: 'ImportNamespaceSpecifier'
              }
            ],
            type: 'ImportDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `for(x of import(x)) {}`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'BlockStatement',
              body: [],
              start: 20,
              end: 22
            },
            left: {
              type: 'Identifier',
              name: 'x',
              start: 4,
              end: 5
            },
            right: {
              type: 'CallExpression',
              callee: {
                type: 'Import',
                start: 9,
                end: 15
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'x',
                  start: 16,
                  end: 17
                }
              ],
              start: 9,
              end: 18
            },
            await: false,
            start: 0,
            end: 22
          }
        ],
        start: 0,
        end: 22
      }
    ],
    [
      `(import(y=x))`,
      Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  left: {
                    name: 'y',
                    type: 'Identifier'
                  },
                  operator: '=',
                  right: {
                    name: 'x',
                    type: 'Identifier'
                  },
                  type: 'AssignmentExpression'
                }
              ],
              callee: {
                type: 'Import'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `var {[import(y=x)]: x} = {}`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [],
                  start: 25,
                  end: 27
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'CallExpression',
                        callee: {
                          type: 'Import',
                          start: 6,
                          end: 12
                        },
                        arguments: [
                          {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'y',
                              start: 13,
                              end: 14
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
                              name: 'x',
                              start: 15,
                              end: 16
                            },
                            start: 13,
                            end: 16
                          }
                        ],
                        start: 6,
                        end: 17
                      },
                      computed: true,
                      value: {
                        type: 'Identifier',
                        name: 'x',
                        start: 20,
                        end: 21
                      },
                      method: false,
                      shorthand: false,
                      start: 5,
                      end: 21
                    }
                  ],
                  start: 4,
                  end: 22
                },
                start: 4,
                end: 27
              }
            ],
            start: 0,
            end: 27
          }
        ],
        start: 0,
        end: 27
      }
    ],
    [
      `function* a() { yield import('http'); }`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Import',
                        start: 22,
                        end: 28
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: 'http',
                          start: 29,
                          end: 35
                        }
                      ],
                      start: 22,
                      end: 36
                    },
                    delegate: false,
                    start: 16,
                    end: 36
                  },
                  start: 16,
                  end: 37
                }
              ],
              start: 14,
              end: 39
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'a',
              start: 10,
              end: 11
            },
            start: 0,
            end: 39
          }
        ],
        start: 0,
        end: 39
      }
    ],
    [
      `import("lib.js").then(doThis);`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Import',
                    start: 0,
                    end: 6
                  },
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'lib.js',
                      start: 7,
                      end: 15
                    }
                  ],
                  start: 0,
                  end: 16
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'then',
                  start: 17,
                  end: 21
                },
                start: 0,
                end: 21
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'doThis',
                  start: 22,
                  end: 28
                }
              ],
              start: 0,
              end: 29
            },
            start: 0,
            end: 30
          }
        ],
        start: 0,
        end: 30
      }
    ],
    [
      `async function bar(){ await import("./nchanged") }`,
      Context.OptionsNext,
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Import'
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: './nchanged'
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: true,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'bar'
            }
          }
        ]
      }
    ]
  ]);
});
