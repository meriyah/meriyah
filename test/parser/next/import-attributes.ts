import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Import Attributes', () => {
  for (const arg of [
    `import 'bar' with { type: 'what' };`,
    `import foo from 'bar' with { type: 'json' };`,
    `import foo from 'bar' with { type: 'json', 'data-type': 'json' };`,
    `import foo from 'bar' with { "type": 'json' };`,
    `import foo from 'bar' with { "type": 'json', 'data-type': 'json' };`,
    `import {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { type: 'json' };`,
    `import {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { "type": 'json' };`,
    `import * as ns from './json-via-namespace_FIXTURE.json' with { type: 'json' };`,
    `import * as ns from './json-via-namespace_FIXTURE.json' with { "type": 'json' };`,
    `import { random } from './random.ts' with { type: 'macro' };`,
    `import { random } from './random.ts' with { "type": 'macro' };`,
    `import { random as foo } from './random.ts' with { type: 'macro' };`,
    `import { "random" as foo } from './random.ts' with { type: 'macro' };`,
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
    `let dynamicImport = import('module', { "type": 'json' });`,
    `const importWithAttributes = import('module', { type: 'json' });`,
    `({ async load() { return import('module', { type: 'json' }); } })`,
    `({ async load() { return import('module', { "type": 'json' }); } })`,
    `function* gen() { yield import('module', { type: 'json' }); }`,
    `function* gen() { yield import('module', { "type": 'json' }); }`,
    `for await (let module of [import('module', { type: 'json' })]) {}`,
    `for await (let module of [import('module', { "type": 'json' })]) {}`,
    `import('module', { type: 'json' }).then(module => { /* ... */ });`,
    `import('module', { 'data-type': 'json' }).then(module => { /* ... */ });`,
    `const result = await import('module', { type: 'json' });`,
    `const result = await import('module', { "type": 'json' });`,
    `import x from './import-attribute-1_FIXTURE.js' with {};`,
    `import './import-attribute-2_FIXTURE.js' with {};`,
    `export * from './import-attribute-3_FIXTURE.js' with {};`,
    `(async function () { return import('./2nd-param_FIXTURE.js', await undefined);}())`,
    `var iter = function*() { beforeCount += 1, import('', yield), afterCount += 1;}();`,
    `var promise; for (promise = import('./2nd-param_FIXTURE.js', 'test262' in {} || undefined); false; );`,
    `export {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { type: 'json' };`,
    `export {default as viaStaticImport2} from './json-idempotency_FIXTURE.json' with { "type": 'json' };`,
    `export * as foo from './foo.json' with { "type": 'json' };`,
    // TODO: to follow up with spec
    // Current JSON modules spec didn't prevent following line.
    `export * from './foo.json' with { "type": 'json' };`,
    `export { random } from './random.ts' with { type: 'macro' };`,
    `export { random } from './random.ts' with { "type": 'macro' };`
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
    ],
    [
      `import {name} from './json-named-bindings_FIXTURE.json' with { type: 'json' };`,
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      `import {name} from './json-named-bindings_FIXTURE.json' with { "type": 'json' };`,
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      `import x from './import-attribute-1_FIXTURE.js' with {
      type: 'json',
      'typ\u0065': ''
    };`,
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      'import { default as a, foo } from "./foo.json" with { type: "json" };',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      'import a, { foo } from "./foo.json" with { type: "json" };',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [`import 'bar' with { type: 'json' };`, Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { 1: "foo" };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: 1 };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: [1] };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: null };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: undefined };', Context.OptionsNext | Context.Module],
    ['import foo from "bar" with { type: "json", foo: {} };', Context.OptionsNext | Context.Module],
    [`export { foo } from './foo.json' with { type: 'json' };`, Context.OptionsNext | Context.Module],
    [`export foo, { foo2 } from './foo.json' with { "type": 'json' };`, Context.OptionsNext | Context.Module]
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
    ],
    [
      'import foo from "bar" with { type: "json" };',
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: 'bar'
            },
            specifiers: [
              {
                local: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'ImportDefaultSpecifier'
              }
            ],
            type: 'ImportDeclaration',
            attributes: [
              {
                key: {
                  name: 'type',
                  type: 'Identifier'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                },
                type: 'ImportAttribute'
              }
            ]
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'import foo from "bar" with { type: "json", "data-type": "json" };',
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        body: [
          {
            source: {
              type: 'Literal',
              value: 'bar'
            },
            specifiers: [
              {
                local: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'ImportDefaultSpecifier'
              }
            ],
            type: 'ImportDeclaration',
            attributes: [
              {
                key: {
                  name: 'type',
                  type: 'Identifier'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                },
                type: 'ImportAttribute'
              },
              {
                key: {
                  type: 'Literal',
                  value: 'data-type'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                },
                type: 'ImportAttribute'
              }
            ]
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `var promise; for (promise = import('./2nd-param_FIXTURE.js', 'test262' in {} || undefined); false; );`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'promise',
                  type: 'Identifier'
                },
                init: null,
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          },
          {
            body: {
              type: 'EmptyStatement'
            },
            init: {
              left: {
                name: 'promise',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                options: {
                  left: {
                    left: {
                      type: 'Literal',
                      value: 'test262'
                    },
                    operator: 'in',
                    right: {
                      properties: [],
                      type: 'ObjectExpression'
                    },
                    type: 'BinaryExpression'
                  },
                  operator: '||',
                  right: {
                    name: 'undefined',
                    type: 'Identifier'
                  },
                  type: 'LogicalExpression'
                },
                source: {
                  type: 'Literal',
                  value: './2nd-param_FIXTURE.js'
                },
                type: 'ImportExpression'
              },
              type: 'AssignmentExpression'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'ForStatement',
            update: null
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `export * from './foo' with { type: 'json' }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportAllDeclaration',
            source: {
              type: 'Literal',
              value: './foo'
            },
            exported: null,
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `export * as foo from './foo' with { type: 'json' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportAllDeclaration',
            source: {
              type: 'Literal',
              value: './foo'
            },
            exported: {
              type: 'Identifier',
              name: 'foo'
            },
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'json'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `export {} from './foo' with { type: 'html' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [],
            source: {
              type: 'Literal',
              value: './foo'
            },
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'html'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `export { foo } from './foo' with { type: 'html' }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                },
                exported: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: './foo'
            },
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'html'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `export { foo, } from './foo' with { type: 'html' };`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            declaration: null,
            specifiers: [
              {
                type: 'ExportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                },
                exported: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: './foo'
            },
            attributes: [
              {
                type: 'ImportAttribute',
                key: {
                  type: 'Identifier',
                  name: 'type'
                },
                value: {
                  type: 'Literal',
                  value: 'html'
                }
              }
            ]
          }
        ]
      }
    ]
  ]);
});
