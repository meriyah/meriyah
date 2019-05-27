import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Import', () => {
  fail('Next - Import', [
    ['function failsParse() { return import.then(); }', Context.None],
    ['import(x, y).then(z);', Context.None],
    ['import.then(doLoad);', Context.None],
    ['import(', Context.None],
    ['import)', Context.None],
    ['import()', Context.None],
    ["import('x", Context.None],
    ["import('x']", Context.None],
    ["import['x')", Context.None],
    ['import = x', Context.None],
    ['import[', Context.None],
    ['import[]', Context.None],
    ['import]', Context.None],
    ['import[x]', Context.None],
    ['import{', Context.None],
    ['import{x', Context.None],
    ['import{x}', Context.None],
    ['import(x, y)', Context.None],
    ['import(...y)', Context.None],
    ['import(x,)', Context.None],
    ['import(,)', Context.None],
    ['import(,y)', Context.None],
    ['import(;)', Context.None],
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
    ['do { import(...[""]); } while (false);', Context.None],
    ['function fn() { new import(""); }', Context.None],
    ['if (true) { import(...[""]); }', Context.None],
    ['(async () => await import())', Context.None],
    ['with (import(...[""])) {}', Context.None],
    ['import();', Context.None],
    ['import("", "");', Context.None],
    ['import("",);', Context.None]
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
    'import("lib.js").then(doThis);',
    'function* a() { yield import("http"); }',
    '"use strict"; import("test.js");',
    'function loadImport(file) { return import(`test/${file}.js`); }',
    '() => { import(x) }',
    '(import(y=x))',
    '{import(y=x)}',
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
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
  }

  pass('Next - Import (pass)', [
    [
      `function* a() { yield import("http"); }`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  expression: {
                    argument: {
                      arguments: [
                        {
                          type: 'Literal',
                          value: 'http'
                        }
                      ],
                      callee: {
                        type: 'Import'
                      },
                      type: 'CallExpression'
                    },
                    delegate: false,
                    type: 'YieldExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: true,
            id: {
              name: 'a',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `import foo, * as namespace from "./namespace/drink.js"`,
      Context.Strict | Context.Module | Context.OptionsNext,
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
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            await: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },
            left: {
              name: 'x',
              type: 'Identifier'
            },
            right: {
              arguments: [
                {
                  name: 'x',
                  type: 'Identifier'
                }
              ],
              callee: {
                type: 'Import'
              },
              type: 'CallExpression'
            },
            type: 'ForOfStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
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
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  properties: [
                    {
                      computed: true,
                      key: {
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
                      kind: 'init',
                      method: false,
                      shorthand: false,
                      type: 'Property',
                      value: {
                        name: 'x',
                        type: 'Identifier'
                      }
                    }
                  ],
                  type: 'ObjectPattern'
                },
                init: {
                  properties: [],
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `import("lib.js").then(doThis);`,
      Context.Strict | Context.Module | Context.OptionsNext,
      {
        body: [
          {
            expression: {
              arguments: [
                {
                  name: 'doThis',
                  type: 'Identifier'
                }
              ],
              callee: {
                computed: false,
                object: {
                  arguments: [
                    {
                      type: 'Literal',
                      value: 'lib.js'
                    }
                  ],
                  callee: {
                    type: 'Import'
                  },
                  type: 'CallExpression'
                },
                property: {
                  name: 'then',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
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
