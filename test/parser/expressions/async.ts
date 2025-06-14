import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';

describe('Expressions - Async', () => {
  // Async as identifier
  for (const arg of [
    'async: function f() {}',
    `async
  function f() {}`,
    'x = { async: false }',
    `a = async
  function f(){}`,
    'async => 42;',
    'const answer = async => 42;',
    'async function await() {}',
    'class X { async await(){} }',
    'foo(async,)',
    'foo("", async)',
    'f(x, async(y, z))',
    'class X { static async await(){} }',
    'x = async(y);',
    'class X { async() {} }',
    'let async = await;',
    'x = { async: false }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  // Valid cases
  for (const arg of [
    'async: function f() {}',
    `var resumeAfterNormalArrow = async (value) => {
      log.push("start:" + value);
      value = await resolveLater(value + 1);
      log.push("resume:" + value);
      value = await resolveLater(value + 1);
      log.push("resume:" + value);
      return value + 1;
    };`,
    'x = { async: false }',
    `async function resumeAfterThrow(value) {
      log.push("start:" + value);
      try {
        value = await rejectLater("throw1");
      } catch (e) {
        log.push("resume:" + e);
      }
      try {
        value = await rejectLater("throw2");
      } catch (e) {
        log.push("resume:" + e);
      }
      return value + 1;
    }`,
    `async function gaga() {
      let i = 1;
      while (i-- > 0) { await 42 }
    }`,
    'async => 42;',
    'const answer = async => 42;',
    'async function await() {}',
    'class X { async await(){} }',
    'foo(async,)',
    'foo("", async)',
    'f(x, async(y, z))',
    'class X { static async await(){} }',
    'x = async(y);',
    'class X { async() {} }',
    'let async = await;',
    'x = { async: false }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  fail('Expressions - Async (fail)', [
    ['await => { let x; }', Context.InAwaitContext],
    ['async while (1) {}', Context.None],
    ['(async function(...x = []) {})', Context.None],
    ['"use strict"; (async function arguments () {  })', Context.None],
    ['"use strict"; (async function eval () { })', Context.None],
    ['var O = { async method() {var [ await ] = 1;}', Context.None],
    ['let async => async', Context.None],
    ['f(async\nfoo=>c)', Context.None],
    ['async let x', Context.None],
    ['async let []', Context.None],
    ['async let [] = y', Context.None],
    ['async let [x]', Context.None],
    ['async let [x]', Context.None],
    ['async let [x] = y', Context.None],
    ['async let {}', Context.None],
    ['async let {} = y', Context.None],
    ['async let {x} = y', Context.None],
    ['function f() {for (let in {}) {}}', Context.Strict],
    ['f(async\nfunction(){})', Context.None],
    ['async function f(){ return await => {}; }', Context.None],
    ['foo(async[])', Context.None],
    ['class X { async(async => {}) {} }', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['async\nfunction f(){await x}', Context.None],
    ['async\nfunction f(){await x}', Context.Strict],
    ['async\nfunction f(){await x}', Context.Strict],
    ['let f = async\nfunction g(){await x}', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async(yield);', Context.Strict],
    ['async(await);', Context.Strict | Context.Module],
    ['async (a, ...b+b=c) => a;', Context.None],
    ['async (a, ...b=true) => a;', Context.None],
    ['async (a, ...true=b) => a;', Context.None],
    ['async (a, ...b=fail) => a;', Context.None],
    ['async (a, ...true) => a;', Context.None],
    ['await/x', Context.Module],
    ['await \n / x', Context.Module],
  ]);
  pass('Expressions - Async (pass)', [
    ['async(), x', Context.None],
    ['async/x', Context.OptionsRanges],
    ['x / async', Context.OptionsRanges],
    ['async \n / x / g', Context.None],
    ['async \n / x', Context.None],

    ['function *f(){ async(x); }', Context.None],
    ['async g => (x = [await y])', Context.None],
    ['true ? async.waterfall() : null;', Context.Module | Context.Strict],
    ['async r => result = [...{ x = await x }] = y;', Context.None],
    [
      `const a = {
        foo: () => {
        },
        bar: async event => {
        },
        baz: async event => {
        }
      }

      const a = {
        foo: () => {
        },
        bar: async event => {
        }
      }
      `,
      Context.None,
    ],
    [
      `const a = {
        foo: () => {
        },
        bar: async event => {
        }
      }`,
      Context.None,
    ],
    ['function f() {for (let in {}) {}}', Context.None],
    ['({async foo () \n {}})', Context.None],
    ['class x {async foo() {}}', Context.None],
    /*  [
      '\\u0061sync\np => {}',
      Context.None,
      {
        body: [
          {
            expression: {
              name: 'async',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              async: false,
              body: {
                body: [],
                type: 'BlockStatement'
              },

              params: [
                {
                  name: 'p',
                  type: 'Identifier'
                }
              ],
              type: 'ArrowFunctionExpression',generator: false,            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],*/
    ['class x {\nasync foo() {}}', Context.None],
    ['class x {async foo \n () {}}', Context.None],
    ['foo, async()', Context.OptionsRanges],
    ['foo(async())', Context.OptionsRanges],
    [
      `async function test(){
        const someVar = null;
        async foo => {}
      }`,
      Context.None,
    ],
    [
      `const someVar = null;
          const done = async foo => {}`,
      Context.None,
    ],
    [
      `async function test(){
        const someVar = null;
        const done = async foo => {}
      }`,
      Context.None,
    ],
    ['foo(async(), x)', Context.OptionsRanges],
    ['foo(async(x,y,z))', Context.OptionsRanges],
    ['foo(async(x,y,z), a, b)', Context.OptionsRanges],
    ['foo(async[x])', Context.OptionsRanges],
    ['foo(async)', Context.None],
    ['foo(async.foo)', Context.OptionsRanges],
    ['f(async ()=>c)', Context.None],
    ['f(async foo=>c)', Context.None],
    ['f(async function(){})', Context.None],
    ['f(async ())', Context.None],
    ['f(async)', Context.None],
    ['f(async => x)', Context.None],
    ['async: foo', Context.None],
    ['async\n: foo', Context.None],
    ['async = 5 + 5;', Context.None],
    ['async + 10;', Context.None],
    ['x + async', Context.None],
    ['async foo => bar;', Context.None],
    // ['(async\nfunction f(){await x})', Context.None, {}],
    ['f = async function g(){}', Context.None],
    ['f = a + b + async() + d', Context.OptionsRanges],
    ['f = a + b + async\n() + d', Context.None],
    ['async in {}', Context.OptionsRanges],
    ['async instanceof {}', Context.None],
    ['f(async in {})', Context.OptionsRanges],
    ['f(async instanceof {})', Context.None],
    ['f(a + async in b)', Context.OptionsRanges],
    ['f(a + async instanceof b)', Context.None],
    ['log(async().foo);', Context.OptionsRanges],
    ['log(async()[foo]);', Context.OptionsRanges],
    ['foo(async () => foo)', Context.None],
    ['(async (a, ...b) => a)', Context.None],
    ['async(...a);', Context.None],
    ['async(a, ...b);', Context.None],
    ['async(...a, b);', Context.OptionsRanges],
    ['async \n (x, y)', Context.None],
    ['(async () => {})', Context.None],
    ['(async x => x)', Context.None],
    ['async() * b', Context.None],
    ['f(a, b) * c', Context.None],
    ['async(a, b) * c', Context.None],
    ['foo, async()', Context.None],
    ['async (x) + 2', Context.None],
    ['x = async () => x, y', Context.None],
    ['({async foo() {}})', Context.None],
    ['(async(bullshit) => {})', Context.None],
  ]);
});
