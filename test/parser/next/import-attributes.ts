import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Import Attributes', () => {
  for (const arg of [
    `import foo from 'bar' with { type: 'json' };`,
    `import foo from 'bar' with { type: 'json', 'data-type': 'json' };`,
    `import('module', { type: 'json' });`,
    `import('module', { lazy: true });`,
    `import('module', { dynamic: false });`,
    `import('module', { 'data-type': 'json' });`,
    `import('module', { 'data-version': '1.0' });`,
    `import('module', { type: 'text/javascript', version: '2.0' });`,
    `import('module', { 'type': 'module', 'import-attr': true });`,
    `'use strict'; import('module', { type: 'json' });`,
    `async function load() { return import('module', { type: 'json' }); }`,
    `(() => import('module', { type: 'json' }))()`,
    `let dynamicImport = import('module', { type: 'json' });`,
    `const importWithAttributes = import('module', { type: 'json' });`,
    `({ async load() { return import('module', { type: 'json' }); } })`,
    `function* gen() { yield import('module', { type: 'json' }); }`,
    `for await (let module of [import('module', { type: 'json' })]) {}`,
    `import('module', { type: 'json' }).then(module => { /* ... */ });`,
    `import('module', { 'data-type': 'json' }).then(module => { /* ... */ });`,
    `const result = await import('module', { type: 'json' });`,
    ``
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Strict | Context.Module);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.OptionsNext | Context.OptionsWebCompat | Context.Strict | Context.Module
        );
      });
    });
  }

  fail('Expressions - Import Attributes (fail)', [
    ['import("module", { type: "json" }, "extra")', Context.OptionsNext],
    ['import("module", { type: "json" }, "extra")', Context.None],
    ['import("module", { type: "json", "extra": })', Context.OptionsNext | Context.Strict | Context.Module],
    ['import("module", ...extra)', Context.OptionsNext | Context.Strict | Context.Module],
    ['import("module", { "extra": "value" } { type: "json" })', Context.OptionsNext | Context.Strict | Context.Module],
    ['import("module", { type: "json", "extra": "value" ', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import("module", { type: "json", "extra": "value" }, "another")',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    ['import("module", { type: "json" }, "extra")', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import foo from "bar" with { type: "json", "data-type": "json"',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    ['import foo from "bar" with { type: ', Context.OptionsNext | Context.Strict | Context.Module],
    ['import foo from "bar" with { type: "json", ', Context.OptionsNext | Context.Strict | Context.Module],
    ['import foo from "bar" with { type: "json", "data-type": ', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'import foo from "bar" with { type: "json", "data-type": "json" ',
      Context.OptionsNext | Context.Strict | Context.Module
    ]
  ]);

  pass('Next - Import Attributes (pass)', [
    [
      `import('module', { type: 'json' });`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ImportExpression',
              source: {
                type: 'Literal',
                value: 'module'
              },
              options: {
                type: 'ObjectExpression',
                properties: [
                  {
                    computed: false,
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'type'
                    },
                    value: {
                      type: 'Literal',
                      value: 'json'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      `import('module', { 'data-type': 'json' });`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ImportExpression',
              source: {
                type: 'Literal',
                value: 'module'
              },
              options: {
                type: 'ObjectExpression',
                properties: [
                  {
                    computed: false,
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'data-type'
                    },
                    value: {
                      type: 'Literal',
                      value: 'json'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      `async function load() { return import('module', { type: 'json' }); }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  argument: {
                    options: {
                      properties: [
                        {
                          computed: false,
                          key: {
                            name: 'type',
                            type: 'Identifier'
                          },
                          kind: 'init',
                          method: false,
                          shorthand: false,
                          type: 'Property',
                          value: {
                            type: 'Literal',
                            value: 'json'
                          }
                        }
                      ],
                      type: 'ObjectExpression'
                    },
                    source: {
                      type: 'Literal',
                      value: 'module'
                    },
                    type: 'ImportExpression'
                  },
                  type: 'ReturnStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: false,
            id: {
              name: 'load',
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
      `for await (let module of [import('module', { type: 'json' })]) {}`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ForOfStatement',
            left: {
              type: 'VariableDeclaration',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: {
                    type: 'Identifier',
                    name: 'module'
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            right: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'ImportExpression',
                  source: {
                    type: 'Literal',
                    value: 'module'
                  },
                  options: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        computed: false,
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'type'
                        },
                        value: {
                          type: 'Literal',
                          value: 'json'
                        },
                        kind: 'init',
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            await: true,
            body: {
              type: 'BlockStatement',
              body: []
            }
          }
        ]
      }
    ]
  ]);
});
