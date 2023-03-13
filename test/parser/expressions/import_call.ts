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
    ['[import(import(x))] = [1];', Context.None],
    ['import("") ++', Context.None],
    ['import("") += 5', Context.None],
    ['import("") -= 5', Context.None],
    ['import("") --', Context.None],
    ['import("") = 2', Context.None],
    ['import("") <<= 2', Context.None],
    ['import("") >>= 2', Context.None],
    ['import("") >>>= 2', Context.None],
    ['import("") **= 2', Context.None],
    ['new import(x);', Context.None]
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
    'function loadImport(file) { return import(file).then(() => {}), console.log("Done."); }',
    'function loadImport(file) { import(file).then(() => {}), console.log("Done."); }',
    '() => { import(x) }',
    '(import(y=x))',
    '{import(y=x)}',
    'import(delete obj.prop);',
    'import(void 0);',
    'import(typeof {});',
    'import(a + b);',
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
    'foo(import("foo").den());',
    'import(/foo/)',
    'var x = import(x)',
    'let x = import(x)',
    'new (import(x));',
    'new (import(x));',
    'foo(import("foo").den());',
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
      `import("lib.js").then(doThis);`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        body: [
          {
            start: 0,
            end: 30,
            range: [0, 30],
            expression: {
              arguments: [
                {
                  start: 22,
                  end: 28,
                  range: [22, 28],
                  name: 'doThis',
                  type: 'Identifier'
                }
              ],
              callee: {
                computed: false,
                start: 0,
                end: 21,
                range: [0, 21],
                object: {
                  start: 0,
                  end: 16,
                  range: [0, 16],
                  source: {
                    start: 7,
                    end: 15,
                    range: [7, 15],
                    type: 'Literal',
                    value: 'lib.js'
                  },
                  type: 'ImportExpression'
                },
                property: {
                  start: 17,
                  end: 21,
                  range: [17, 21],
                  name: 'then',
                  type: 'Identifier'
                },
                type: 'MemberExpression'
              },
              start: 0,
              end: 29,
              range: [0, 29],
              type: 'CallExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        start: 0,
        end: 30,
        range: [0, 30],
        type: 'Program'
      }
    ],
    [
      `async function bar(){ await import("./nchanged") }`,
      Context.OptionsNext,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  expression: {
                    argument: {
                      source: {
                        type: 'Literal',
                        value: './nchanged'
                      },
                      type: 'ImportExpression'
                    },
                    type: 'AwaitExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: false,
            id: {
              name: 'bar',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'function loadImport(file) { import(file).then(() => {}), console.log("Done."); }',
      Context.OptionsNext,
      {
        body: [
          {
            async: false,
            body: {
              body: [
                {
                  expression: {
                    expressions: [
                      {
                        arguments: [
                          {
                            async: false,
                            body: {
                              body: [],
                              type: 'BlockStatement'
                            },
                            expression: false,
                            params: [],
                            type: 'ArrowFunctionExpression'
                          }
                        ],
                        callee: {
                          computed: false,
                          object: {
                            source: {
                              name: 'file',
                              type: 'Identifier'
                            },
                            type: 'ImportExpression'
                          },
                          property: {
                            name: 'then',
                            type: 'Identifier'
                          },
                          type: 'MemberExpression'
                        },
                        type: 'CallExpression'
                      },
                      {
                        arguments: [
                          {
                            type: 'Literal',
                            value: 'Done.'
                          }
                        ],
                        callee: {
                          computed: false,
                          object: {
                            name: 'console',
                            type: 'Identifier'
                          },
                          property: {
                            name: 'log',
                            type: 'Identifier'
                          },
                          type: 'MemberExpression'
                        },
                        type: 'CallExpression'
                      }
                    ],
                    type: 'SequenceExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            generator: false,
            id: {
              name: 'loadImport',
              type: 'Identifier'
            },
            params: [
              {
                name: 'file',
                type: 'Identifier'
              }
            ],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
