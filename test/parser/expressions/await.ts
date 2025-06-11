import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Expressions - Await', () => {
  for (const arg of [
    `await;`,
    'class await {}',
    `function await(yield) {}`,
    'var await = 1',
    '({ await: async })',
    'await => {}',
    'await => async',
    'await => async.await[foo]',
    'await => async.await[async = bar / (async + 1)]',
    'await => async.await[async / (async => foo)]',
    'await => async.await[async / (async => foo.bar)]',
    'await => async.await[async / ((async) => foo.bar)]',
    'await => async.await[async / (async = async(async, await, bar))]',
    'class X { await(){} }',
    'f(x, await(y, z))',
    'class X { static await(){} }',
    'x = await(y);',
    'class X { await() {} }',
    'let async = await;',
    'x = { await: false }',
    'class test{ async method (param){ await foo();  }  method2(){}  }',
    'async function test() { await foo(); }',
    'var a = async function test() { await foo(); }',
    'var test = async a => await test();',
    '({ async* f(a, b, ...c) { await 1; } })',
    '({ async* f(a, b = 2) { await 1; } })',
    '({ async* f(a, b) { await 1; } })',
    '({ async* f(a) { await 1; } })',
    '({ async* f(a, b, ...c) { yield 1; } })',
    '({ async* f(a, b = 2) { yield 1; } })',
    '({ async* f(a, b) { yield 1; } })',
    '({ async* f(a) { yield 1; } })',
    '(x = class A {[await](){}; "x"(){}}) => {}',
    'async function a() { await as }',
    'async function a() { await from }',
    'async function a() { await get }',
    'async function a() { await set }',
    'async function a() { await of }',
    'async function a() { await target }',
    'async function a() { await meta }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    '[await]',
    '[await] = []',
    '[await = 1]',
    '[await = 1] = []',
    '...await',
    'await',
    'await = 1',
    '...[await]',
    'var [await f] = [];',
    'let [await f] = [];',
    'const [await f] = [];',
    'e=await',
    'var [...await f] = [];',
    'let [...await f] = [];',
    'const [...await f] = [];',
    'var { await f } = {};',
    'let { await f } = {};',
    'const { await f } = {};',
    'var { ...await f } = {};',
    'let { ...await f } = {};',
    'const { ...await f } = {};',
    'var { f: await f } = {};',
    'let { f: await f } = {};',
    'const { f: await f } = {};',
    'x = await',
    '1) => 1',
    "'str') => 1",
    '/foo/) => 1',
    '{ foo = async(1) => 1 }) => 1',
    '{ foo = async(a) => 1 })',
    'x = async(await)',
    'x = { [await]: 1 }',
    'x = class extends (await) { }',
    'x = class { static [await]() {} }',
    '{ x = await }',
    'class await {}',
    'x = class await {}',
    'x = 1 ? class await {} : 0',
    'x = async function await() {}',
    'x = y[await]',
    'x = `${await}`',
    'x = y()[await]',
    'var { f: ...await f } = {};',
    'let { f: ...await f } = {};',
    'const { f: ...await f } = {};',
    'var { [f]: await f } = {};',
    'let { [f]: await f } = {};',
    'const { [f]: await f } = {};',
    'var { [f]: ...await f } = {};',
    'let { [f]: ...await f } = {};',
    'const { [f]: ...await f } = {};',
    `x = await`,
  ]) {
    it(`async function f( ${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function f( ${arg}) {}`, undefined, Context.None);
      });
    });

    it(`async function f( ${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function f( ${arg}) {}`, undefined, Context.OptionsLexical);
      });
    });

    it(`'use strict'; function f() { ${arg}) }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; function f() { ${arg}) }`, undefined, Context.None);
      });
    });

    it(`let f = () => {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`, undefined, Context.None);
      });
    });

    it(`let f = () => {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`, undefined, Context.OptionsNext);
      });
    });

    it(`'use strict'; async function* f() {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `async function f(await) {}`,
    `async function f(...await) {}`,
    `async function f(await = 1) {}`,
    `async function f([await]) {}`,
    `async function f([await = 1]) {}`,
    `async function f({ await }) {}`,
    `async function f({ await = 1 }) {}`,
    `async function f({ } = await) {}`,

    `(async function(await) {})`,
    `(async function(...await) {})`,
    `(async function(await = 1) {})`,
    `(async function([await]) {})`,
    `(async function([await = 1]) {})`,
    `(async function({ await }) {})`,
    `(async function({ await = 1 }) {})`,
    `(async function({ } = await) {})`,

    `var asyncArrow = async(await) => 1;`,
    `var asyncArrow = async(await) => {};`,
    `var asyncArrow = async(...await) => 1;`,
    `var asyncArrow = async(...await) => {};`,
    `var asyncArrow = async(await = 1) => 1;`,
    `var asyncArrow = async(await = 1) => {};`,
    `var asyncArrow = async([await]) => 1;`,
    `var asyncArrow = async([await]) => {};`,
    `var asyncArrow = async([await = 1]) => 1;`,
    `var asyncArrow = async([await = 1]) => {};`,
    `var asyncArrow = async([] = await) => 1;`,
    `var asyncArrow = async([] = await) => {};`,
    `var asyncArrow = async({ await }) => 1;`,
    `var asyncArrow = async({ await } ) => {};`,
    `var asyncArrow = async({ await = 1}) => 1;`,
    `var asyncArrow = async({ await = 1}) => {};`,
    `var asyncArrow = async({ } = await) => 1;`,
    `var asyncArrow = async({ } = await) => {};`,

    `({ async method(await) {} })`,
    `({ async method(...await) {} })`,
    `({ async method(await = 1) {} })`,
    `({ async method([await]) {} })`,
    `({ async method([await = 1]) {} })`,
    `({ async method({ await }) {} })`,
    `({ async method({ await = 1 }) {} })`,
    `({ async method({ } = await) {} })`,

    `(class { async method(await) {} })`,
    `(class { async method(...await) {} })`,
    `(class { async method(await = 1) {} })`,
    `(class { async method([await]) {} })`,
    `(class { async method([await = 1]) {} })`,
    `(class { async method({ await }) {} })`,
    `(class { async method({ await = 1 }) {} })`,
    `(class { async method({ } = await) {} })`,

    `(class { static async method(await) {} })`,
    `(class { static async method(...await) {} })`,
    `(class { static async method(await = 1) {} })`,
    `(class { static async method([await]) {} })`,
    `(class { static async method([await = 1]) {} })`,
    `(class { static async method({ await }) {} })`,
    `(class { static async method({ await = 1 }) {} })`,
    `(class { static async method({ } = await) {} })`,
  ]) {
    it(`async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`"use strict"; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; async function f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`var await; var f = (async function() { ${arg} });`, () => {
      t.throws(() => {
        parseSource(`var await; var f = (async function() { ${arg} });`, undefined, Context.None);
      });
    });

    it(`"use strict"; var await; var f = (async function() { ${arg} });`, () => {
      t.throws(() => {
        parseSource(`"use strict"; var await; var f = (async function() { ${arg} });`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'await',
    'var f = await => 42;',
    'var { await } = 1;',
    'var [ await ] = 1;',
    'return async (await) => {};',
    'var O = { async [await](a, a) {} }',
    'await;',
    'function await() {}',
    '(a = await b) => a',
    'var f = await => 42;',
    'var f = (await) => 42;',
    'var f = (await, a) => 42;',
    'var f = (...await) => 42;',
    'var e = (await);',
    'var e = (await, f);',
    'var e = (await = 42)',
    '(await 1) = 1',
    'var e = [await];',
    'var e = {await};',
  ]) {
    it(`async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, undefined, Context.OptionsNext);
      });
    });

    it(`'use strict'; var f = async function() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async function() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; var f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async() => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; var O = { async method() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'var [await f] = [];',
    'let [await f] = [];',
    'const [await f] = [];',
    'var [...await f] = [];',
    'let [...await f] = [];',
    'const [...await f] = [];',
    'var { await f } = {};',
    'let { await f } = {};',
    'const { await f } = {};',
    'var { ...await f } = {};',
    'let { ...await f } = {};',
    'const { ...await f } = {};',
    'var { f: await f } = {};',
    'let { f: await f } = {};',
    'const { f: await f } = {};',
    'var { [f]: await f } = {};',
    'let { [f]: await f } = {};',
    'const { [f]: await f } = {};',
    'var { f: ...await f } = {};',
    'let { f: ...await f } = {};',
    'const { f: ...await f } = {};',
    'var { [f]: ...await f } = {};',
    'let { [f]: ...await f } = {};',
    'const { [f]: ...await f } = {};',
  ]) {
    it(`let f = () => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = () => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`let f = () => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = () => { ${arg} }`, undefined, Context.Module);
      });
    });

    it(`'use strict'; async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function* f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function* f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`let f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = async() => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, undefined, Context.Module);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Await (fail)', [
    ['await f();', Context.None],
    [
      `async function f() {
      let [await b] = [];
      return b;
    }`,
      Context.None,
    ],
    [
      `async function f() {
      let { a: await b } = { a: 1 };
      return b;
    }`,
      Context.None,
    ],
    ['var await = 5;', Context.Module | Context.Strict],
    ['await;', Context.Module | Context.Strict],
    ['function f() { await 5; }', Context.Module | Context.Strict],
    ['() => { await 5; }', Context.Module | Context.Strict],
    ['export var await;', Context.Module | Context.Strict],
    ['await => 1;', Context.Module | Context.Strict],
    ['async function f() { function g() { await 3; } }', Context.Module | Context.Strict],
    ['export async function() {}', Context.Module | Context.Strict],
    ['export default async function() { yield; }', Context.Module | Context.Strict],
    ['export default async function() { yield = 1; }', Context.Module | Context.Strict],
    ['async await => 1;', Context.None],
    ['async function foo() { return {await} };', Context.None],
    ['async function wrap() { async function await() { } };', Context.None],
    ['function* wrap() { async(a = yield b) => a };', Context.None],
    ['async function f() { let await; }', Context.None],
    ['a = async function () { async function await() {} }', Context.None],
    ['(async function(await b){})', Context.None],
    ['async (foo = await bar) => {}', Context.None],
    ['await.b[c] => async', Context.None],
    ['(foo = await bar) => {}', Context.None],
    ['({x} = await bar) => {}', Context.None],
    ['async ({x} = await bar) => {}', Context.None],
    ['([x] = await bar) => {}', Context.None],
    ['async ([x] = await bar) => {}', Context.None],
    ['(foo = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['({o} = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['async ({await}) => 1;', Context.None],
    ['([p] = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['async ([p] = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['(foo = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['(foo = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['x = { async f() { let await } }', Context.None],
    ['async(e=await)=>l', Context.None],
    ['a = async function () { async function await() {} }', Context.None],
    ['async function f() { g(await) }', Context.None],
    ['a = async function () { async function await() {} }', Context.None],
    ['async f() { class X { async await(){} } }', Context.None],
    ['a = async function() { g(await) }', Context.None],
    ['function f(x) { await x }', Context.None],
    ['async await => 42', Context.None],
    ['async function f(await) {}', Context.None],
    ['x = { async f(await){} }', Context.None],
    ['async f() { x = { async await(){} } }', Context.None],
    ['function call(foo=await bar){}', Context.None],
    ['function call(foo=await bar=10){}', Context.None],
    ['async function x(){ function y(s=await foo){}}', Context.None],
    ['async(a = await => {}) => {};', Context.None],
    ['async function f(){ let y = x => await x; }', Context.None],
    ['let f = () => (y=await foo) => y;', Context.None],
    ['async function f(){ await foo\n/foo/ }', Context.None],
    ['async () => { var await; }', Context.None],
    ['class x {f(await){}}', Context.Module],
    ['let o = {*f(await){}}', Context.Module],
    ['let o = {f(await){}}', Context.Module],
    ['class x {f(await){}}', Context.Module],
    ['function f(await){}', Context.Module],
    ['let o = {async *f(await){}}', Context.None],
    ['let o = {async f(await){}}', Context.None],
    ['let x = async function *f(await){}', Context.None],
    ['let x = function *f(await){}', Context.Module],
    ['let x = async function f(await){}', Context.None],
    ['let x = function f(await){}', Context.Module],
    ['async function *f(await){}', Context.None],
    ['function *f(await){}', Context.Module],
    ['async function f(){  async (await) => x  }', Context.None],
    ['function *f(){  async (await) => x  }', Context.None],
    ['function *f(){  foo(await)  }', Context.Module],
    ['async function f(foo = await bar){}', Context.None],
    ['function *f(foo = await bar){}', Context.None],
    ['async function *f(foo = await bar){}', Context.None],
    ['let x = function f(foo = await bar){}', Context.None],
    ['let x = async function f(foo = await bar){}', Context.None],
    ['let x = function *f(foo = await bar){}', Context.None],
    ['let x = async function *f(foo = await bar){}', Context.None],
    ['let o = {f(foo = await bar){}}', Context.None],
    ['let o = {async f(foo = await bar){}}', Context.None],
    ['let o = {*f(foo = await bar){}}', Context.None],
    ['let o = {async *f(foo = await bar){}}', Context.None],
    ['class x {async f(foo = await bar){}}', Context.None],
    ['async function f(){ new await x; }', Context.None],
    ['async function f(){ (fail = class extends await foo {}) => fail    }', Context.None],
    ['async function f(){ async function f(){   (a= {[await foo](){}, "x"(){}} ) => a    }    }', Context.None],
    ['async function f(){ (fail = class A extends await foo {}) => fail    }', Context.None],
    ['async function f(){ (fail = class A extends (await foo) {}) => fail    }', Context.None],
    ['async function f(){ (fail = class A {[await foo](){}; "x"(){}}) => {}    }', Context.None],
    //     ['async function a(){     async ([y] = delete ((((foo))[await x]))) => {};     }', Context.None],
    //     ['async function a(){     async ([y] = delete ((foo[await x]))) => {};     }', Context.None],
    // ['async function a(){     async ([y] = delete foo[await x]) => {};     }', Context.None],
    ['async function a(){     async ([y] = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['async function a(){     async ({g} = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['async function a(){     ({g} = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['class test { async get method(){} }', Context.None],
    ['var test = => { await test(); }', Context.None],
    ['async function a(){     async (foo = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }', Context.None],
    ['async function a(){ async ([v] = await bar) => {}     }', Context.None],
    ['async function a(){ ([v] = await bar) => {}     }', Context.None],
    ['async function a(){ async ({r} = await bar) => {}     }', Context.None],
    ['async function a(){ ({r} = await bar) => {}     }', Context.None],
    ['async function a(){ async (foo = await bar) => {}     }', Context.None],
    ['async function a(){ (foo = await bar) => {}     }', Context.None],
    ['sync function g(){class x {*f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){class x {async *f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){let o = {async *f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){class x {f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){let o = {f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){let o = {async f(foo = [h, {m: t(await bar)}]){}}    }', Context.None],
    ['async function g(){let x = function *f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){let x = async function f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){let x = function f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){async function *f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){function *f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){async function f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){    function f(foo = [h, {m: t(await bar)}]){}    }', Context.None],
    ['async function g(){class x {async *f(foo = await bar){}}    }', Context.None],
    ['async function g(){class x {*f(foo = await bar){}}    }', Context.None],
    ['async function af(a, b = await a) { }', Context.None],
    ['var o = { async\nam() { } };', Context.None],
    ['async function x({await}) { return 1 }', Context.None],
    ['async function f() { return {await}; }', Context.None],
    ['async function f() { return {await = 0} = {}; }', Context.None],
    ['async function g(){class x {async f(foo = await bar){}}    }', Context.None],
    ['async function g(){class x {f(foo = await bar){}}    }', Context.None],
    ['async function g(){let o = {async *f(foo = await bar){}}    }', Context.None],
    ['async function g(){let o = {*f(foo = await bar){}}    }', Context.None],
    ['async function g(){let o = {async f(foo = await bar){}}    }', Context.None],
    ['async function g(){let o = {f(foo = await bar){}}    }', Context.None],
    ['async function g(){let x = async function *f(foo = await bar){}    }', Context.None],
    ['async function g(){let x = async function f(foo = await bar){}    }', Context.None],
    ['async function g(){async function *f(foo = await bar){}    }', Context.None],
    ['async function g(){let x = function f(foo = await bar){}    }', Context.None],
    ['async function g(){    function f(foo = await bar){}    }', Context.None],
    ['([p] = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['sync ({o} = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['({o} = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['async (foo = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['(foo = [{m: 5 + t(await bar)}]) => {}', Context.None],
    ['async ([x] = await bar) => {}', Context.None],
    ['([x] = await bar) => {}', Context.None],
    ['({x} = await bar) => {}', Context.None],
    ['async (foo = await bar) => {}', Context.None],
    ['(foo = await bar) => {}', Context.None],
    ['class x {async *f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['class x {*f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['class x {async f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['class x {f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['let o = {async *f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['let o = {*f(foo = [{m: t(await bar)}]){}}', Context.None],
    ['let x = function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['let x = async function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['let o = {f(foo = [{m: t(await bar)}]){}', Context.None],
    ['let x = async function f(foo = [{m: t(await bar)}]){}', Context.None],
    ['let x = function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['async function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['let x = function f(foo = [{m: t(await bar)}]){}', Context.None],
    ['function f(foo = [{m: t(await bar)}]){}', Context.None],
    ['async function f(foo = [{m: t(await bar)}]){}', Context.None],
    ['function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['async function *f(foo = [{m: t(await bar)}]){}', Context.None],
    ['class x {f(foo = await bar){}}', Context.None],
    ['class x {async f(foo = await bar){}}', Context.None],
    ['class x {async *f(foo = await bar){}}', Context.None],
    ['class x {*f(foo = await bar){}}', Context.None],
    ['let o = {f(foo = await bar){}}', Context.None],
    ['let o = {async f(foo = await bar){}}', Context.None],
    ['let x = function f(foo = await bar){}', Context.None],
    ['function *f(foo = await bar){}', Context.None],
    ['function f(foo = await bar){}', Context.None],
    ['async function f(){  async (await) => x  }', Context.None],
    ['async (await) => x', Context.None],
    ['async function method() { var await = 1; }', Context.None],
    ['async function method(await;) { }', Context.None],
    ['a[await p];', Context.None],
    ['async (foo = await x) => foo', Context.None],
    ['var lambdaParenNoArg = await () => x < y;', Context.None],
    ['var lambdaArgs = await async (a, b ,c) => a + b + c;', Context.None],
    // ['var lambdaArgs = await (async (a, b ,c) => a + b + c);', Context.None],
    ['function () { "use strict"; eval("async function af(a, b = await a) { }', Context.None],
    ['var af = async\nfunction () { }', Context.None],
    ['async function af() { var a = (await) => { }; }', Context.None],
    ['async function af() { var a = (x, y, await) => { }; }', Context.None],
    ['async function af() { var a = (x, await, y) => { }; }', Context.None],
    ['async function af() { var a = (x = await 0) => { }; }', Context.None],
    ['async function af() { var a = (x, y = await 0, z = 0) => { }; }', Context.None],
    ['async (a, await) => { }', Context.None],
    ['async await => { }', Context.None],
    ['a[await p];', Context.None],
    ['class A { async get foo() {} }', Context.None],
    ['class A { async static staticAsyncMethod() {} }', Context.None],
    ['class A { static async prototype() {} }', Context.None],
    ['async function method() { var x = await; }', Context.None],
    ['class A { async constructor() {} }', Context.None],
    ['class A { async set foo() {} }', Context.None],
    ['var result = await call();', Context.None],
    ['await call();', Context.None],
    ['await a;', Context.None],
    ['await a[0];', Context.None],
    ['await o.p;', Context.None],
    ['a + await p;', Context.None],
    ['await p + await q;', Context.None],
    ['async(a = (await) => {}) => {};', Context.None],
    ['foo(await p, await q);', Context.None],
    ['var lambdaParenNoArg = await () => x < y;', Context.None],
    ['var lambdaArgs = await async (a, b ,c) => a + b + c;', Context.None],
    ['function method() { var x = await call(); }', Context.None],
    ['async (a, await) => { }', Context.None],
    ['function () { a = async await => { } }', Context.None],
    ['async (a, b = await 1) => {}', Context.None],
    ['async () => { await => { }; }', Context.None],
    ['async () => { (a, await) => { }; }', Context.None],
    ['async () => { (x, y, z = await 0) => { }; }', Context.None],
    ['async function af() { (b = (c = await => {}) => {}) => {}; }', Context.None],
  ]);

  for (const arg of [
    'var [await f] = [];',
    'let [await f] = [];',
    'const [await f] = [];',
    'var [...await f] = [];',
    'let [...await f] = [];',
    'const [...await f] = [];',
    'var { await f } = {};',
    'let { await f } = {};',
    'const { await f } = {};',
    'var { ...await f } = {};',
    'let { ...await f } = {};',
    'const { ...await f } = {};',
    'var { f: await f } = {};',
    'let { f: await f } = {};',
    'const { f: await f } = {};',
    'var { [f]: await f } = {};',
    'let { [f]: await f } = {};',
    'const { [f]: await f } = {};',
    'var { f: ...await f } = {};',
    'let { f: ...await f } = {};',
    'const { f: ...await f } = {};',
    'var { [f]: ...await f } = {};',
    'let { [f]: ...await f } = {};',
    'const { [f]: ...await f } = {};',
  ]) {
    it(`let f = () => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = () => { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function* f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function* f() { ${arg} }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`let f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = async() => { ${arg} }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, undefined, Context.Module);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() { ${arg} }`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'var asyncFn = async function() { await 1; };',
    'var asyncFn = async function withName() { await 1; };',
    "var asyncFn = async () => await 'test';",
    'async function asyncFn() { await 1; }',
    'var O = { async method() { await 1; } }',
    "var O = { async ['meth' + 'od']() { await 1; } }",
    "var O = { async 'method'() { await 1; } }",
    'function f() { var await; }',
    'function f() { class await { } }',
    'function f() { var o = { await: 10 } }',
    'function f() { var o = { get await() { } } }',
    'function f() { var o = { *await() { } } }',
    'function f() { class C { *await() { } } }',
    'var O = { async 0() { await 1; } }',
    'var asyncFn = async({ foo = 1 }) => foo;',
    'var asyncFn = async({ foo = 1 } = {}) => foo;',
    'function* g() { var f = async(yield); }',
    'function* g() { var f = async(x = yield); }',
    'function foo() { var await = 1; return await; }',
    'function foo(await) { return await; }',
    'function* foo() { var await = 1; return await; }',
    'var f = () => { var await = 1; return await; }',
    'var O = { method() { var await = 1; return await; } };',
    'var O = { method(await) { return await; } };',
    'var O = { *method() { var await = 1; return await; } };',
    'async function foo(a, b) { await a + await b };',
    'async function wrap() { (a = await b) };',
    'async function foo(a, b) { await a };',
    'var O = { *method(await) { return await; } };',
    'var O = { *method(await) { return await; } };',
    'var O = { *method(await) { return await; } };',
    'var O = { *method(await) { return await; } };',
    'function f() { var await; }',
    'function f() { let await; }',
    'function f() { const await = 10; }',
    'function f() { function await() { } }',
    'function f() { function* await() { } }',
    'function f() { var fe = function await() { } }',
    'function f() { class await { } }',
    'function f() { var o = { await: 10 } }',
    'function f() { var o = { get await() { } } }',
    'function f() { var o = { *await() { } } }',
    'function f() { var await = 10; var o = { await }; }',
    'function f() { class C { await() { } } }',
    'class x {*f(await){}}',
    'function *f(){  (await) => x  }',
    'function *f(){  foo(await)  }',
    'function *f(foo = await){}',
    'let x = function *f(foo = await){}',
    'let o = {*f(foo = await){}}',
    'class x {f(foo = await){}}',
    'class x {*f(foo = await){}}',
    'function *await(){}',
    'async function f(){ new (await foo) }',
    'async function f(){ await \n x; }',
    'async function f(){ await foo\n/foo/g }',
    'function f() { var await; }',
    'function call(foo=await){}',
    'function call(await){}',
    `async function f() {
        let { [await "a"]: a } = { a: 1 };
        return a;
      }`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; var O = { *method() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() {${arg}}`, undefined, Context.None);
      });
    });

    it(`"use strict"; function* g() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; function* g() {${arg}}`, undefined, Context.None);
      });
    });
  }

  pass('Expressions - Await (pass)', [
    [
      'await f();',
      Context.Module,
      
    ],
    [
      'await 5;',
      Context.Module | Context.Strict,
      
    ],
    [
      'const foo = (await bar)',
      Context.Module,
      
    ],
    [
      'async function f(){ if (await \n x) {} }',
      Context.None,
      
    ],
    [
      'async function a(){     async ([y] = [{m: 5 + t(await bar)}]);     }',
      Context.None,
      
    ],
    [
      'async function f(){ await \n x; }',
      Context.None,
      
    ],
    [
      'async function f(){ if (await \n x) {} }',
      Context.None,
      
    ],
    [
      'let o = {await(){}}',
      Context.OptionsRanges,
      
    ],
    [
      'class x {await(){}}',
      Context.OptionsRanges,
      
    ],
    [
      'class x {async *await(){}}',
      Context.OptionsRanges,
      
    ],
    [
      'async function f() { await 3; }',
      Context.Strict | Context.Module,
      
    ],
    [
      'function f(x = await){}',
      Context.None,
      
    ],
    [
      'async function a(){     async ({r} = await bar);     }',
      Context.OptionsRanges,
      
    ],
    [
      'await()',
      Context.None,
      
    ],

    [
      'await[x]',
      Context.None,
      
    ],
    [
      'await = 1',
      Context.None,
      
    ],
    [
      'await - 25',
      Context.None,
      
    ],
    [
      'call(await)',
      Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      'call(await[1])',
      Context.OptionsLoc | Context.OptionsRanges,
      
    ],
    [
      'call(await.foo)',
      Context.None,
      
    ],
    [
      '(function call(await){})',
      Context.None,
      
    ],
    [
      '(function call(foo=await){})',
      Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      'y = async x => await x',
      Context.None,
      
    ],
    [
      '(async function f(){ await \n x; })',
      Context.None,
      
    ],
    [
      '(function *await(){})',
      Context.None,
      
    ],
    [
      'o = {await(){}}',
      Context.None,
      
    ],
    [
      'o = {async await(){}}',
      Context.None,
      
    ],
    [
      'async function foo(){}',
      Context.None,
      
    ],
    [
      'o = {*await(){}}',
      Context.None,
      
    ],
    [
      'o = {async *await(){}}',
      Context.None,
      
    ],
    [
      'o = {f(await){}}',
      Context.None,
      
    ],
    [
      'o = {*f(await){}}',
      Context.None,
      
    ],
    [
      'o = (await) => x',
      Context.None,
      
    ],
    [
      'x = function f(foo = await){}',
      Context.None,
      
    ],
    [
      'async function f(){ await await foo; }',
      Context.None,
      
    ],
    [
      'function *f(await){}',
      Context.None,
      
    ],
    [
      '(await) => x',
      Context.None,
      
    ],
    [
      'let x = function *f(foo = await){}',
      Context.None,
      
    ],
    [
      'let o = {f(foo = await){}}',
      Context.None,
      
    ],
    [
      'function *f(){  (await) => x  }',
      Context.None,
      
    ],
    [
      'function *f(){  foo(await)  }',
      Context.None,
      
    ],
    [
      'async function a(){     async ([v] = await bar);     }',
      Context.None,
      
    ],
    [
      'async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }',
      Context.None,
      
    ],
    [
      '(await) => x',
      Context.None,
      
    ],
    [
      'function *f(){  foo(await)  }',
      Context.None,
      
    ],
    [
      'function f(foo = await){}',
      Context.None,
      
    ],
    [
      'let o = {*f(await){}}',
      Context.None,
      
    ],
    [
      'foo[await 1]',
      Context.Module,
      
    ],
    [
      'foo(await bar)',
      Context.Module,
      
    ],
  ]);
});
