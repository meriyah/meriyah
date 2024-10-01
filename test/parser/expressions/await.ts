import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    'async function a() { await target }',
    'async function a() { await meta }'
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
    `x = await`
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
    `(class { static async method({ } = await) {} })`
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
    'var e = {await};'
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
    'const { [f]: ...await f } = {};'
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
      Context.None
    ],
    [
      `async function f() {
      let { a: await b } = { a: 1 };
      return b;
    }`,
      Context.None
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
    ['async function af() { (b = (c = await => {}) => {}) => {}; }', Context.None]
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
    'const { [f]: ...await f } = {};'
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
      }`
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
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AwaitExpression',
              argument: {
                type: 'CallExpression',
                callee: {
                  type: 'Identifier',
                  name: 'f'
                },
                arguments: []
              }
            }
          }
        ]
      }
    ],
    [
      'await 5;',
      Context.Module | Context.Strict,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AwaitExpression',
              argument: {
                type: 'Literal',
                value: 5
              }
            }
          }
        ]
      }
    ],
    [
      'const foo = (await bar)',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: {
                  type: 'AwaitExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'async function f(){ if (await \n x) {} }',
      Context.None,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  alternate: null,
                  consequent: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  test: {
                    argument: {
                      name: 'x',
                      type: 'Identifier'
                    },
                    type: 'AwaitExpression'
                  },
                  type: 'IfStatement'
                }
              ],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'f',
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
      'async function a(){     async ([y] = [{m: 5 + t(await bar)}]);     }',
      Context.None,
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'y'
                            }
                          ]
                        },
                        operator: '=',
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'm'
                                  },
                                  value: {
                                    type: 'BinaryExpression',
                                    left: {
                                      type: 'Literal',
                                      value: 5
                                    },
                                    right: {
                                      type: 'CallExpression',
                                      callee: {
                                        type: 'Identifier',
                                        name: 't'
                                      },
                                      arguments: [
                                        {
                                          type: 'AwaitExpression',
                                          argument: {
                                            type: 'Identifier',
                                            name: 'bar'
                                          }
                                        }
                                      ]
                                    },
                                    operator: '+'
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: true,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'async function f(){ await \n x; }',
      Context.None,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  expression: {
                    argument: {
                      name: 'x',
                      type: 'Identifier'
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
              name: 'f',
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
      'async function f(){ if (await \n x) {} }',
      Context.None,
      {
        body: [
          {
            async: true,
            body: {
              body: [
                {
                  alternate: null,
                  consequent: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  test: {
                    argument: {
                      name: 'x',
                      type: 'Identifier'
                    },
                    type: 'AwaitExpression'
                  },
                  type: 'IfStatement'
                }
              ],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'f',
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
      'let o = {await(){}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 19,
            range: [0, 19],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 19,
                range: [4, 19],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'o'
                },
                init: {
                  type: 'ObjectExpression',
                  start: 8,
                  end: 19,
                  range: [8, 19],
                  properties: [
                    {
                      type: 'Property',
                      start: 9,
                      end: 18,
                      range: [9, 18],
                      method: true,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 9,
                        end: 14,
                        range: [9, 14],
                        name: 'await'
                      },
                      kind: 'init',
                      value: {
                        type: 'FunctionExpression',
                        start: 14,
                        end: 18,
                        range: [14, 18],
                        id: null,
                        generator: false,
                        async: false,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 16,
                          end: 18,
                          range: [16, 18],
                          body: []
                        }
                      }
                    }
                  ]
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'class x {await(){}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 19,
            range: [0, 19],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 19,
              range: [8, 19],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 9,
                  end: 18,
                  range: [9, 18],
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 9,
                    end: 14,
                    range: [9, 14],
                    name: 'await'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 14,
                    end: 18,
                    range: [14, 18],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 16,
                      end: 18,
                      range: [16, 18],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'class x {async *await(){}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 26,
            range: [0, 26],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 26,
              range: [8, 26],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 9,
                  end: 25,
                  range: [9, 25],
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 16,
                    end: 21,
                    range: [16, 21],
                    name: 'await'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 25,
                    range: [21, 25],
                    id: null,
                    generator: true,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 23,
                      end: 25,
                      range: [23, 25],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function f() { await 3; }',
      Context.Strict | Context.Module,
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
                    type: 'AwaitExpression',
                    argument: {
                      type: 'Literal',
                      value: 3
                    }
                  }
                }
              ]
            },
            async: true,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(x = await){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'x'
                },
                right: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,

            generator: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async function a(){     async ({r} = await bar);     }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 54,
        range: [0, 54],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 54,
            range: [0, 54],
            id: {
              type: 'Identifier',
              start: 15,
              end: 16,
              range: [15, 16],
              name: 'a'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 18,
              end: 54,
              range: [18, 54],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 24,
                  end: 48,
                  range: [24, 48],
                  expression: {
                    type: 'CallExpression',
                    start: 24,
                    end: 47,
                    range: [24, 47],
                    callee: {
                      type: 'Identifier',
                      start: 24,
                      end: 29,
                      range: [24, 29],
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        start: 31,
                        end: 46,
                        range: [31, 46],
                        operator: '=',
                        left: {
                          type: 'ObjectPattern',
                          start: 31,
                          end: 34,
                          range: [31, 34],
                          properties: [
                            {
                              type: 'Property',
                              start: 32,
                              end: 33,
                              range: [32, 33],
                              method: false,
                              shorthand: true,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 32,
                                end: 33,
                                range: [32, 33],
                                name: 'r'
                              },
                              kind: 'init',
                              value: {
                                type: 'Identifier',
                                start: 32,
                                end: 33,
                                range: [32, 33],
                                name: 'r'
                              }
                            }
                          ]
                        },
                        right: {
                          type: 'AwaitExpression',
                          start: 37,
                          end: 46,
                          range: [37, 46],
                          argument: {
                            type: 'Identifier',
                            start: 43,
                            end: 46,
                            range: [43, 46],
                            name: 'bar'
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'await()',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'await'
              },
              arguments: []
            }
          }
        ]
      }
    ],

    [
      'await[x]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'await'
              },
              computed: true,
              property: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'await = 1',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'await'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 1
              }
            }
          }
        ]
      }
    ],
    [
      'await - 25',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'BinaryExpression',
              left: {
                type: 'Identifier',
                name: 'await'
              },
              right: {
                type: 'Literal',
                value: 25
              },
              operator: '-'
            }
          }
        ]
      }
    ],
    [
      'call(await)',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 11
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 11
              }
            },
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 11
                }
              },
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 4
                  }
                },
                name: 'call'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 5,
                  end: 10,
                  range: [5, 10],
                  loc: {
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 10
                    }
                  },
                  name: 'await'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'call(await[1])',
      Context.OptionsLoc | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 14
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 14
              }
            },
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              loc: {
                start: {
                  line: 1,
                  column: 0
                },
                end: {
                  line: 1,
                  column: 14
                }
              },
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                loc: {
                  start: {
                    line: 1,
                    column: 0
                  },
                  end: {
                    line: 1,
                    column: 4
                  }
                },
                name: 'call'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  start: 5,
                  end: 13,
                  range: [5, 13],
                  loc: {
                    start: {
                      line: 1,
                      column: 5
                    },
                    end: {
                      line: 1,
                      column: 13
                    }
                  },
                  object: {
                    type: 'Identifier',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    loc: {
                      start: {
                        line: 1,
                        column: 5
                      },
                      end: {
                        line: 1,
                        column: 10
                      }
                    },
                    name: 'await'
                  },
                  property: {
                    type: 'Literal',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    loc: {
                      start: {
                        line: 1,
                        column: 11
                      },
                      end: {
                        line: 1,
                        column: 12
                      }
                    },
                    value: 1
                  },
                  computed: true
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'call(await.foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'call'
              },
              arguments: [
                {
                  type: 'MemberExpression',
                  object: {
                    type: 'Identifier',
                    name: 'await'
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'foo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(function call(await){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [
                {
                  type: 'Identifier',
                  name: 'await'
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,

              id: {
                type: 'Identifier',
                name: 'call'
              }
            }
          }
        ]
      }
    ],
    [
      '(function call(foo=await){})',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 28
          }
        },
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 28
              }
            },
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 27,
              range: [1, 27],
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 27
                }
              },
              id: {
                type: 'Identifier',
                start: 10,
                end: 14,
                range: [10, 14],
                loc: {
                  start: {
                    line: 1,
                    column: 10
                  },
                  end: {
                    line: 1,
                    column: 14
                  }
                },
                name: 'call'
              },
              generator: false,
              async: false,
              params: [
                {
                  type: 'AssignmentPattern',
                  start: 15,
                  end: 24,
                  range: [15, 24],
                  loc: {
                    start: {
                      line: 1,
                      column: 15
                    },
                    end: {
                      line: 1,
                      column: 24
                    }
                  },
                  left: {
                    type: 'Identifier',
                    start: 15,
                    end: 18,
                    range: [15, 18],
                    loc: {
                      start: {
                        line: 1,
                        column: 15
                      },
                      end: {
                        line: 1,
                        column: 18
                      }
                    },
                    name: 'foo'
                  },
                  right: {
                    type: 'Identifier',
                    start: 19,
                    end: 24,
                    range: [19, 24],
                    loc: {
                      start: {
                        line: 1,
                        column: 19
                      },
                      end: {
                        line: 1,
                        column: 24
                      }
                    },
                    name: 'await'
                  }
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 25,
                end: 27,
                range: [25, 27],
                loc: {
                  start: {
                    line: 1,
                    column: 25
                  },
                  end: {
                    line: 1,
                    column: 27
                  }
                },
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'y = async x => await x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'y'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'AwaitExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ],

                async: true,
                expression: true
              }
            }
          }
        ]
      }
    ],
    [
      '(async function f(){ await \n x; })',
      Context.None,
      {
        body: [
          {
            expression: {
              async: true,
              body: {
                body: [
                  {
                    expression: {
                      argument: {
                        name: 'x',
                        type: 'Identifier'
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
                name: 'f',
                type: 'Identifier'
              },
              params: [],
              type: 'FunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '(function *await(){})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'FunctionExpression',
              params: [],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: true,

              id: {
                type: 'Identifier',
                name: 'await'
              }
            }
          }
        ]
      }
    ],
    [
      'o = {await(){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'await'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
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
      'o = {async await(){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'await'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
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
      'async function foo(){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: true,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'foo'
            }
          }
        ]
      }
    ],
    [
      'o = {*await(){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'await'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
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
      'o = {async *await(){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'await'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
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
      'o = {f(await){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'f'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'await'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
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
      'o = {*f(await){}}',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'o',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                properties: [
                  {
                    computed: false,
                    key: {
                      name: 'f',
                      type: 'Identifier'
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false,
                    type: 'Property',
                    value: {
                      async: false,
                      body: {
                        body: [],
                        type: 'BlockStatement'
                      },
                      generator: true,
                      id: null,
                      params: [
                        {
                          name: 'await',
                          type: 'Identifier'
                        }
                      ],
                      type: 'FunctionExpression'
                    }
                  }
                ],
                type: 'ObjectExpression'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'o = (await) => x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'x'
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'await'
                  }
                ],

                async: false,
                expression: true
              }
            }
          }
        ]
      }
    ],
    [
      'x = function f(foo = await){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'FunctionExpression',
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'await'
                    }
                  }
                ],
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                async: false,
                generator: false,

                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'async function f(){ await await foo; }',
      Context.None,
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
                      type: 'AwaitExpression',
                      argument: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  }
                }
              ]
            },
            async: true,

            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(await){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'await'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,

            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(await) => x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'await'
                }
              ],

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'let x = function *f(foo = await){}',
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'x',
                  type: 'Identifier'
                },
                init: {
                  async: false,

                  body: {
                    body: [],
                    type: 'BlockStatement'
                  },
                  generator: true,
                  id: {
                    name: 'f',
                    type: 'Identifier'
                  },
                  params: [
                    {
                      left: {
                        name: 'foo',
                        type: 'Identifier'
                      },
                      right: {
                        name: 'await',
                        type: 'Identifier'
                      },
                      type: 'AssignmentPattern'
                    }
                  ],
                  type: 'FunctionExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'let',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'let o = {f(foo = await){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'await'
                            }
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'function *f(){  (await) => x  }',
      Context.None,
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
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'await'
                      }
                    ],

                    async: false,
                    expression: true
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){  foo(await)  }',
      Context.None,
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'await'
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'async function a(){     async ([v] = await bar);     }',
      Context.None,
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'v'
                            }
                          ]
                        },
                        operator: '=',
                        right: {
                          type: 'AwaitExpression',
                          argument: {
                            type: 'Identifier',
                            name: 'bar'
                          }
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: true,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      'async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }',
      Context.None,
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    arguments: [
                      {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        operator: '=',
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'm'
                                  },
                                  value: {
                                    type: 'BinaryExpression',
                                    left: {
                                      type: 'Literal',
                                      value: 5
                                    },
                                    right: {
                                      type: 'CallExpression',
                                      callee: {
                                        type: 'Identifier',
                                        name: 't'
                                      },
                                      arguments: [
                                        {
                                          type: 'AwaitExpression',
                                          argument: {
                                            type: 'Identifier',
                                            name: 'bar'
                                          }
                                        }
                                      ]
                                    },
                                    operator: '+'
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            async: true,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'a'
            }
          }
        ]
      }
    ],
    [
      '(await) => x',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'await'
                }
              ],

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'function *f(){  foo(await)  }',
      Context.None,
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
                    type: 'CallExpression',
                    callee: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    arguments: [
                      {
                        type: 'Identifier',
                        name: 'await'
                      }
                    ]
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f(foo = await){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'AssignmentPattern',
                left: {
                  type: 'Identifier',
                  name: 'foo'
                },
                right: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'let o = {*f(await){}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'await'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,

                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'foo[await 1]',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: true,
              property: {
                type: 'AwaitExpression',
                argument: {
                  type: 'Literal',
                  value: 1
                }
              }
            }
          }
        ]
      }
    ],
    [
      'foo(await bar)',
      Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'foo'
              },
              arguments: [
                {
                  type: 'AwaitExpression',
                  argument: {
                    type: 'Identifier',
                    name: 'bar'
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  ]);
});
