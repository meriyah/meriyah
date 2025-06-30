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
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
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
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });
  }

  fail('Expressions - Async (fail)', [
    { code: 'await => { let x; }', context: Context.InAwaitContext },
    'async while (1) {}',
    '(async function(...x = []) {})',
    '"use strict"; (async function arguments () {  })',
    '"use strict"; (async function eval () { })',
    'var O = { async method() {var [ await ] = 1;}',
    'let async => async',
    'f(async\nfoo=>c)',
    'async let x',
    'async let []',
    'async let [] = y',
    'async let [x]',
    'async let [x]',
    'async let [x] = y',
    'async let {}',
    'async let {} = y',
    'async let {x} = y',
    { code: 'function f() {for (let in {}) {}}', options: { impliedStrict: true } },
    'f(async\nfunction(){})',
    'async function f(){ return await => {}; }',
    'foo(async[])',
    'class X { async(async => {}) {} }',
    'async\nfunction f(){await x}',
    'async\nfunction f(){await x}',
    { code: 'async\nfunction f(){await x}', options: { impliedStrict: true } },
    { code: 'async\nfunction f(){await x}', options: { impliedStrict: true } },
    'let f = async\nfunction g(){await x}',
    'async (a, ...b=fail) => a;',
    { code: 'async(yield);', options: { impliedStrict: true } },
    { code: 'async(await);', options: { module: true } },
    'async (a, ...b+b=c) => a;',
    'async (a, ...b=true) => a;',
    'async (a, ...true=b) => a;',
    'async (a, ...b=fail) => a;',
    'async (a, ...true) => a;',
    { code: 'await/x', options: { module: true } },
    { code: 'await \n / x', options: { module: true } },
  ]);
  pass('Expressions - Async (pass)', [
    'async(), x',
    { code: 'async/x', options: { ranges: true } },
    { code: 'x / async', options: { ranges: true } },
    'async \n / x / g',
    'async \n / x',

    'function *f(){ async(x); }',
    'async g => (x = [await y])',
    { code: 'true ? async.waterfall() : null;', options: { module: true } },
    'async r => result = [...{ x = await x }] = y;',
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
    `const a = {
        foo: () => {
        },
        bar: async event => {
        }
      }`,
    'function f() {for (let in {}) {}}',
    '({async foo () \n {}})',
    'class x {async foo() {}}',
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
    'class x {\nasync foo() {}}',
    'class x {async foo \n () {}}',
    { code: 'foo, async()', options: { ranges: true } },
    { code: 'foo(async())', options: { ranges: true } },
    `async function test(){
        const someVar = null;
        async foo => {}
      }`,
    `const someVar = null;
          const done = async foo => {}`,
    `async function test(){
        const someVar = null;
        const done = async foo => {}
      }`,
    { code: 'foo(async(), x)', options: { ranges: true } },
    { code: 'foo(async(x,y,z))', options: { ranges: true } },
    { code: 'foo(async(x,y,z), a, b)', options: { ranges: true } },
    { code: 'foo(async[x])', options: { ranges: true } },
    'foo(async)',
    { code: 'foo(async.foo)', options: { ranges: true } },
    'f(async ()=>c)',
    'f(async foo=>c)',
    'f(async function(){})',
    'f(async ())',
    'f(async)',
    'f(async => x)',
    'async: foo',
    'async\n: foo',
    'async = 5 + 5;',
    'async + 10;',
    'x + async',
    'async foo => bar;',
    // ['(async\nfunction f(){await x})', Context.None, {}],
    'f = async function g(){}',
    { code: 'f = a + b + async() + d', options: { ranges: true } },
    'f = a + b + async\n() + d',
    { code: 'async in {}', options: { ranges: true } },
    'async instanceof {}',
    { code: 'f(async in {})', options: { ranges: true } },
    'f(async instanceof {})',
    { code: 'f(a + async in b)', options: { ranges: true } },
    'f(a + async instanceof b)',
    { code: 'log(async().foo);', options: { ranges: true } },
    { code: 'log(async()[foo]);', options: { ranges: true } },
    'foo(async () => foo)',
    '(async (a, ...b) => a)',
    'async(...a);',
    'async(a, ...b);',
    { code: 'async(...a, b);', options: { ranges: true } },
    'async \n (x, y)',
    '(async () => {})',
    '(async x => x)',
    'async() * b',
    'f(a, b) * c',
    'async(a, b) * c',
    'foo, async()',
    'async (x) + 2',
    'x = async () => x, y',
    '({async foo() {}})',
    '(async(bullshit) => {})',
  ]);
});
