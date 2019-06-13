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
      `import("lib.js").then(doThis);`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        body: [
          {
            end: 30,
            expression: {
              arguments: [
                {
                  end: 28,
                  name: 'doThis',
                  start: 22,
                  type: 'Identifier'
                }
              ],
              callee: {
                computed: false,
                end: 21,
                object: {
                  end: 16,
                  source: {
                    end: 15,
                    start: 7,
                    type: 'Literal',
                    value: 'lib.js'
                  },
                  start: 0,
                  type: 'ImportExpression'
                },
                property: {
                  end: 21,
                  name: 'then',
                  start: 17,
                  type: 'Identifier'
                },
                start: 0,
                type: 'MemberExpression'
              },
              end: 29,
              start: 0,
              type: 'CallExpression'
            },
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        end: 30,
        sourceType: 'module',
        start: 0,
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
    ]
  ]);
});
