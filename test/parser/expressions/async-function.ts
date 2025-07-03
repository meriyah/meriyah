import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Async function', () => {
  for (const arg of [
    '(async function () { var await; });',
    '(async function () { void await; });',
    '(async function () { await: ; });',
    '(async function foo (foo) { super() })',
    '(async function foo (foo) { super.prop });',
    '(async function foo (foo = super()) { var bar; });',
    '(async function*(await) { });',
    '(async function foo(await) { })',
    '(async\nfunction foo() { })',
    'async ()\n=> a',
    'async while (1) {}',
    outdent`
      (async
        function f() {})
    `,
    '0, async function*(...x = []) {};',
    '(async function f(...a,) {})',
    '(async function foo1() { } foo2 => 1)',
    'var f = async() => ((async(x = await 1) => x)();',
    'class C { async constructor() {} }',
    'class C {}; class C2 extends C { async constructor() {} }',
    'class C { static async prototype() {} }',
    'class C {}; class C2 extends C { static async prototype() {} }',
    '(async function foo3() { } () => 1)',
    '(async function foo4() { } => 1)',
    '(async function() { } foo5 => 1)',
    '(async function() { } () => 1)',
    '(async function() { } => 1)',
    '(async function(...a,) {})',
    '(async function *() { var await; })',
    '"use strict"; (async function *() { var await; })',
    'async function wrap() { async function await() { } };',
    '(async.foo6 => 1)',
    '(async.foo7 foo8 => 1)',
    '(async.foo9 () => 1)',
    '(async().foo10 => 1)',
    '(async().foo11 foo12 => 1)',
    '(async().foo13 () => 1)',
    "(async['foo14'] => 1)",
    "(async['foo15'] foo16 => 1)",
    "(async['foo17'] () => 1)",
    "(async()['foo18'] => 1)",
    "(async()['foo19'] foo20 => 1)",
    "(async()['foo21'] () => 1)",
    '(async`foo22` => 1)',
    '(async`foo23` foo24 => 1)',
    '(async`foo25` () => 1)',
    '(async`foo26`.bar27 => 1)',
    '(async`foo28`.bar29 foo30 => 1)',
    '(async`foo31`.bar32 () => 1)',
    'var f = async() => await;',
    'var O = { *async method() {} };',
    'var O = { async method*() {} };',
    'async(...a = b) => b',
    'async(...a,) => b',
    'async(...a, b) => b',
    outdent`
      (async
        function f() {})
    `,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    '(async function foo() { }.prototype)',
    '(async function foo(x, y = x, z = y) { })',
    '(async function foo(x = y, y) { })',
    '(async function foo(a, b = 39,) { })',
    '(async function foo(a, b,) { })',
    '(async function foo(_ = (function() {}())) { })',
    '(async function foo(x = x) { })',
    'var O = { async method(eval) {} }',
    "var O = { async ['meth' + 'od'](eval) {} }",
    "var O = { async 'method'(eval) {} }",
    'var O = { async 0(eval) {} }',
    'var O = { async method(arguments) {} }',
    "var O = { async ['meth' + 'od'](arguments) {} }",
    "var O = { async 'method'(arguments) {} }",
    'var O = { async 0(arguments) {} }',
    'var O = { async method(foo, bar) {} }',
    'async function await() {}',
    'class X { static async await(){} }',
    '(async function ref(a, b = 39,) {});',
    'x = async function(a) { await a }',
    'f(async function(x) { await x })',
    'f(b, async function(b) { await b }, c)',
    'async function foo(a = async () => await b) {}',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = class {async bar() { await b }}) {}',
    '(function f() { async function yield() {} })',
    '(function f() { ({ async yield() {} }); })',
    '({ async [yield]() {} });',
    'f(async function(x) { await x })',
    'f(b, async function(b) { await b }, c)',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = class {async bar() { await b }}) {}',
    'async function foo(a, b) { await a }',
    '(function* g() { (async function yield() {}); })',
    '"use strict"; ({ async yield() {} });',
    '(function f() { ({ async [yield]() {} }); })',
    outdent`
      a = async
      function f(){}
    `,
    'a = async package => 1',
    'a = async package => { }',
    String.raw`a = async p\u0061ckage => { }`,
    'a = (async package => 1)',
    'a = (async package => { })',
    String.raw`a = (async p\u0061ckage => { })`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`() => { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { ${arg} }`);
      });
    });

    it(`function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${arg}}`);
      });
    });
  }

  fail('Expressions - Async function (fail)', [
    'async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }',
    'class C { async constructor() {} }',
    '(async function(...x = []) {})',
    '(async function f (...a,) {  })',
    { code: 'export async function() {}', options: { sourceType: 'module' } },
    'async while (1) {}',
    '(async function() { } () => 1)',
    '(async function *() { var await; })',
    '(async \n function(){})',
    'if (async \n () => x) x',
    'async function(){}',
    'async function wrap() { async function await() { } };',
    '(async.foo6 => 1)',
    '(async.foo7 foo8 => 1)',
    { code: '(async function foo4() { } => 1)', options: { sourceType: 'module' } },
    { code: '(async function() { } foo5 => 1)', options: { sourceType: 'module' } },
    { code: '(async function() { } () => 1)', options: { sourceType: 'module' } },
    { code: '(async function() { } => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; async function asyncFunctionDeclaration(await) {}', options: { sourceType: 'module' } },
    { code: '"use strict"; (async function foo() { } bar => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; (async function foo() { } () => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; (async function foo() { } => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; (async function() { } () => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; (async function() { } => 1)', options: { sourceType: 'module' } },
    { code: '"use strict"; (async.foo bar => 1)', options: { sourceType: 'module' } },
    '(async function arguments () { "use strict"; })',
    '(async function (x = 1) {"use strict"})',
    'async function wrap() {\nasync function await() { }\n}',
    'async function foo(await) { }',
    'async function foo() { return {await} }',
    '(async function await() { })',
    '(async function foo(await) { })',
    '(async function foo() { return {await} })',
    'async function a(k = await 3) {}',
    '(async function(k = await 3) {})',
    '(async function a(k = await 3) {})',
    "'use strict'; (async function eval() {})",
    '(async function(k = super.prop) {})',
    '(async function a(k = super.prop) {})',
    '(async function a() { super.prop(); })',
    '(async function a(k = super()) {})',
    '(async function(k = super()) {})',
    'async function a() { super(); }',
    '(async function a() { super(); })',
    '({async async: 0})',
    '({async async})',
    '({async async = 0} = {})',
    { code: 'function f() { await 5; }', options: { sourceType: 'module' } },
    //['async function f(){ (x = new x(await x)) => {} }', Context.Module],
    { code: 'async function f() { function g() { await 3; } }', options: { sourceType: 'module' } },
    'async function f(){ new await x; }',
    'async function f(){ [new await foo] }',
    'async function f(){ (new await foo) }',
    'async function *f(){ new await; }',
    'async function f(await){}',
    'async function *f(await){}',
    'async(...a, b) => b',
    '(async function(...x = []) {})',
    'a = async package => { "use strict" }',
    String.raw`a = async p\u0061ckage => { "use strict" }`,
    'a = async (package) => { "use strict" }',
    String.raw`a = async (p\u0061ckage) => { "use strict" }`,
    'a = (async (package) => { "use strict" })',
    String.raw`a = (async (p\u0061ckage) => { "use strict" })`,
  ]);
  pass('Expressions - Async function (pass)', [
    '(async function foo(a, b = 39,) {})',
    'async function f() { let y = await x * x }',
    'async function f() {} var f;',
    { code: 'function g() {   async function f() {} var f;   }', options: { ranges: true } },
    '(async function(){})',
    { code: '(async function foo() { }.prototype)', options: { ranges: true } },
    { code: 'async function foo(a = class {async bar() { await b }}) {}', options: { ranges: true } },
    '(function f() { async function yield() {} })',
    '({ async [yield]() {} });',
    { code: 'f(async function(x) { await x })', options: { ranges: true } },
    { code: '(function* g() { (async function yield() {}); })', options: { ranges: true } },
    '"use strict"; ({ async yield() {} });',
    '(function f() { ({ async [yield]() {} }); })',
    'x = async function(a) { await a }',
    { code: 'class X { static async await(){} }', options: { ranges: true } },
    'var O = { async 0(eval) {} }',
    { code: '(async function foo(a, b = 39,) { })', options: { ranges: true } },
    {
      code: '(async function*(a = b +=1, c = d += 1, e = f += 1, g = h += 1, i = j += 1, k = l +=1) {})',
      options: { ranges: true },
    },
    '(async function foo(a,) {})',

    '(async function foo(_ = (function() {}())) { })',
  ]);
});
