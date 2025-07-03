import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Await', () => {
  for (const arg of [
    'await;',
    'class await {}',
    'function await(yield) {}',
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
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
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
    'x = await',
  ]) {
    it(`async function f( ${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function f( ${arg}) {}`);
      });
    });

    it(`async function f( ${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`async function f( ${arg}) {}`, { lexical: true });
      });
    });

    it(`'use strict'; function f() { ${arg}) }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; function f() { ${arg}) }`);
      });
    });

    it(`let f = () => {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`);
      });
    });

    it(`let f = () => {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`, { next: true });
      });
    });

    it(`'use strict'; async function* f() {${arg})`, () => {
      t.throws(() => {
        parseSource(`let f = () => {${arg})`);
      });
    });
  }

  for (const arg of [
    'async function f(await) {}',
    'async function f(...await) {}',
    'async function f(await = 1) {}',
    'async function f([await]) {}',
    'async function f([await = 1]) {}',
    'async function f({ await }) {}',
    'async function f({ await = 1 }) {}',
    'async function f({ } = await) {}',

    '(async function(await) {})',
    '(async function(...await) {})',
    '(async function(await = 1) {})',
    '(async function([await]) {})',
    '(async function([await = 1]) {})',
    '(async function({ await }) {})',
    '(async function({ await = 1 }) {})',
    '(async function({ } = await) {})',

    'var asyncArrow = async(await) => 1;',
    'var asyncArrow = async(await) => {};',
    'var asyncArrow = async(...await) => 1;',
    'var asyncArrow = async(...await) => {};',
    'var asyncArrow = async(await = 1) => 1;',
    'var asyncArrow = async(await = 1) => {};',
    'var asyncArrow = async([await]) => 1;',
    'var asyncArrow = async([await]) => {};',
    'var asyncArrow = async([await = 1]) => 1;',
    'var asyncArrow = async([await = 1]) => {};',
    'var asyncArrow = async([] = await) => 1;',
    'var asyncArrow = async([] = await) => {};',
    'var asyncArrow = async({ await }) => 1;',
    'var asyncArrow = async({ await } ) => {};',
    'var asyncArrow = async({ await = 1}) => 1;',
    'var asyncArrow = async({ await = 1}) => {};',
    'var asyncArrow = async({ } = await) => 1;',
    'var asyncArrow = async({ } = await) => {};',

    '({ async method(await) {} })',
    '({ async method(...await) {} })',
    '({ async method(await = 1) {} })',
    '({ async method([await]) {} })',
    '({ async method([await = 1]) {} })',
    '({ async method({ await }) {} })',
    '({ async method({ await = 1 }) {} })',
    '({ async method({ } = await) {} })',

    '(class { async method(await) {} })',
    '(class { async method(...await) {} })',
    '(class { async method(await = 1) {} })',
    '(class { async method([await]) {} })',
    '(class { async method([await = 1]) {} })',
    '(class { async method({ await }) {} })',
    '(class { async method({ await = 1 }) {} })',
    '(class { async method({ } = await) {} })',

    '(class { static async method(await) {} })',
    '(class { static async method(...await) {} })',
    '(class { static async method(await = 1) {} })',
    '(class { static async method([await]) {} })',
    '(class { static async method([await = 1]) {} })',
    '(class { static async method({ await }) {} })',
    '(class { static async method({ await = 1 }) {} })',
    '(class { static async method({ } = await) {} })',
  ]) {
    it(`async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`);
      });
    });

    it(`"use strict"; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; async function f() { ${arg} }`);
      });
    });

    it(`var await; var f = (async function() { ${arg} });`, () => {
      t.throws(() => {
        parseSource(`var await; var f = (async function() { ${arg} });`);
      });
    });

    it(`"use strict"; var await; var f = (async function() { ${arg} });`, () => {
      t.throws(() => {
        parseSource(`"use strict"; var await; var f = (async function() { ${arg} });`);
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
        parseSource(`async function f() { ${arg} }`);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`);
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function f() { ${arg} }`, { next: true });
      });
    });

    it(`'use strict'; var f = async function() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async function() { ${arg} }`);
      });
    });

    it(`'use strict'; var f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async() => { ${arg} }`);
      });
    });

    it(`'use strict'; var O = { async method() {${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() { ${arg} }`);
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
        parseSource(`let f = () => { ${arg} }`);
      });
    });

    it(`let f = () => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = () => { ${arg} }`, { sourceType: 'module' });
      });
    });

    it(`'use strict'; async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function* f() { ${arg} }`);
      });
    });

    it(`function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function* f() { ${arg} }`);
      });
    });

    it(`let f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = async() => { ${arg} }`);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, { sourceType: 'module' });
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() { ${arg} }`);
      });
    });
  }

  fail('Expressions - Await (fail)', [
    'await f();',
    outdent`
      async function f() {
        let [await b] = [];
        return b;
      }
    `,
    outdent`
      async function f() {
        let { a: await b } = { a: 1 };
        return b;
      }
    `,
    { code: 'var await = 5;', options: { sourceType: 'module' } },
    { code: 'await;', options: { sourceType: 'module' } },
    { code: 'function f() { await 5; }', options: { sourceType: 'module' } },
    { code: '() => { await 5; }', options: { sourceType: 'module' } },
    { code: 'export var await;', options: { sourceType: 'module' } },
    { code: 'await => 1;', options: { sourceType: 'module' } },
    { code: 'async function f() { function g() { await 3; } }', options: { sourceType: 'module' } },
    { code: 'export async function() {}', options: { sourceType: 'module' } },
    { code: 'export default async function() { yield; }', options: { sourceType: 'module' } },
    { code: 'export default async function() { yield = 1; }', options: { sourceType: 'module' } },
    'async await => 1;',
    'async function foo() { return {await} };',
    'async function wrap() { async function await() { } };',
    'function* wrap() { async(a = yield b) => a };',
    'async function f() { let await; }',
    'a = async function () { async function await() {} }',
    '(async function(await b){})',
    'async (foo = await bar) => {}',
    'await.b[c] => async',
    '(foo = await bar) => {}',
    '({x} = await bar) => {}',
    'async ({x} = await bar) => {}',
    '([x] = await bar) => {}',
    'async ([x] = await bar) => {}',
    '(foo = [{m: 5 + t(await bar)}]) => {}',
    '({o} = [{m: 5 + t(await bar)}]) => {}',
    'async ({await}) => 1;',
    '([p] = [{m: 5 + t(await bar)}]) => {}',
    'async ([p] = [{m: 5 + t(await bar)}]) => {}',
    '(foo = [{m: 5 + t(await bar)}]) => {}',
    '(foo = [{m: 5 + t(await bar)}]) => {}',
    'x = { async f() { let await } }',
    'async(e=await)=>l',
    'a = async function () { async function await() {} }',
    'async function f() { g(await) }',
    'a = async function () { async function await() {} }',
    'async f() { class X { async await(){} } }',
    'a = async function() { g(await) }',
    'function f(x) { await x }',
    'async await => 42',
    'async function f(await) {}',
    'x = { async f(await){} }',
    'async f() { x = { async await(){} } }',
    'function call(foo=await bar){}',
    'function call(foo=await bar=10){}',
    'async function x(){ function y(s=await foo){}}',
    'async(a = await => {}) => {};',
    'async function f(){ let y = x => await x; }',
    'let f = () => (y=await foo) => y;',
    'async function f(){ await foo\n/foo/ }',
    'async () => { var await; }',
    { code: 'class x {f(await){}}', options: { sourceType: 'module' } },
    { code: 'let o = {*f(await){}}', options: { sourceType: 'module' } },
    { code: 'let o = {f(await){}}', options: { sourceType: 'module' } },
    { code: 'class x {f(await){}}', options: { sourceType: 'module' } },
    { code: 'function f(await){}', options: { sourceType: 'module' } },
    'let o = {async *f(await){}}',
    'let o = {async f(await){}}',
    'let x = async function *f(await){}',
    { code: 'let x = function *f(await){}', options: { sourceType: 'module' } },
    'let x = async function f(await){}',
    { code: 'let x = function f(await){}', options: { sourceType: 'module' } },
    'async function *f(await){}',
    { code: 'function *f(await){}', options: { sourceType: 'module' } },
    'async function f(){  async (await) => x  }',
    'function *f(){  async (await) => x  }',
    { code: 'function *f(){  foo(await)  }', options: { sourceType: 'module' } },
    'async function f(foo = await bar){}',
    'function *f(foo = await bar){}',
    'async function *f(foo = await bar){}',
    'let x = function f(foo = await bar){}',
    'let x = async function f(foo = await bar){}',
    'let x = function *f(foo = await bar){}',
    'let x = async function *f(foo = await bar){}',
    'let o = {f(foo = await bar){}}',
    'let o = {async f(foo = await bar){}}',
    'let o = {*f(foo = await bar){}}',
    'let o = {async *f(foo = await bar){}}',
    'class x {async f(foo = await bar){}}',
    'async function f(){ new await x; }',
    'async function f(){ (fail = class extends await foo {}) => fail    }',
    'async function f(){ async function f(){   (a= {[await foo](){}, "x"(){}} ) => a    }    }',
    'async function f(){ (fail = class A extends await foo {}) => fail    }',
    'async function f(){ (fail = class A extends (await foo) {}) => fail    }',
    'async function f(){ (fail = class A {[await foo](){}; "x"(){}}) => {}    }',
    //     ['async function a(){     async ([y] = delete ((((foo))[await x]))) => {};     }', Context.None],
    //     ['async function a(){     async ([y] = delete ((foo[await x]))) => {};     }', Context.None],
    // ['async function a(){     async ([y] = delete foo[await x]) => {};     }', Context.None],
    'async function a(){     async ([y] = [{m: 5 + t(await bar)}]) => {}     }',
    'async function a(){     async ({g} = [{m: 5 + t(await bar)}]) => {}     }',
    'async function a(){     ({g} = [{m: 5 + t(await bar)}]) => {}     }',
    'class test { async get method(){} }',
    'var test = => { await test(); }',
    'async function a(){     async (foo = [{m: 5 + t(await bar)}]) => {}     }',
    'async function a(){     (foo = [{m: 5 + t(await bar)}]) => {}     }',
    'async function a(){ async ([v] = await bar) => {}     }',
    'async function a(){ ([v] = await bar) => {}     }',
    'async function a(){ async ({r} = await bar) => {}     }',
    'async function a(){ ({r} = await bar) => {}     }',
    'async function a(){ async (foo = await bar) => {}     }',
    'async function a(){ (foo = await bar) => {}     }',
    'sync function g(){class x {*f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){class x {async *f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){let o = {async *f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){class x {f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){let o = {f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){let o = {async f(foo = [h, {m: t(await bar)}]){}}    }',
    'async function g(){let x = function *f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){let x = async function f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){let x = function f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){async function *f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){function *f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){async function f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){    function f(foo = [h, {m: t(await bar)}]){}    }',
    'async function g(){class x {async *f(foo = await bar){}}    }',
    'async function g(){class x {*f(foo = await bar){}}    }',
    'async function af(a, b = await a) { }',
    'var o = { async\nam() { } };',
    'async function x({await}) { return 1 }',
    'async function f() { return {await}; }',
    'async function f() { return {await = 0} = {}; }',
    'async function g(){class x {async f(foo = await bar){}}    }',
    'async function g(){class x {f(foo = await bar){}}    }',
    'async function g(){let o = {async *f(foo = await bar){}}    }',
    'async function g(){let o = {*f(foo = await bar){}}    }',
    'async function g(){let o = {async f(foo = await bar){}}    }',
    'async function g(){let o = {f(foo = await bar){}}    }',
    'async function g(){let x = async function *f(foo = await bar){}    }',
    'async function g(){let x = async function f(foo = await bar){}    }',
    'async function g(){async function *f(foo = await bar){}    }',
    'async function g(){let x = function f(foo = await bar){}    }',
    'async function g(){    function f(foo = await bar){}    }',
    '([p] = [{m: 5 + t(await bar)}]) => {}',
    'sync ({o} = [{m: 5 + t(await bar)}]) => {}',
    '({o} = [{m: 5 + t(await bar)}]) => {}',
    'async (foo = [{m: 5 + t(await bar)}]) => {}',
    '(foo = [{m: 5 + t(await bar)}]) => {}',
    'async ([x] = await bar) => {}',
    '([x] = await bar) => {}',
    '({x} = await bar) => {}',
    'async (foo = await bar) => {}',
    '(foo = await bar) => {}',
    'class x {async *f(foo = [{m: t(await bar)}]){}}',
    'class x {*f(foo = [{m: t(await bar)}]){}}',
    'class x {async f(foo = [{m: t(await bar)}]){}}',
    'class x {f(foo = [{m: t(await bar)}]){}}',
    'let o = {async *f(foo = [{m: t(await bar)}]){}}',
    'let o = {*f(foo = [{m: t(await bar)}]){}}',
    'let x = function *f(foo = [{m: t(await bar)}]){}',
    'let x = async function *f(foo = [{m: t(await bar)}]){}',
    'let o = {f(foo = [{m: t(await bar)}]){}',
    'let x = async function f(foo = [{m: t(await bar)}]){}',
    'let x = function *f(foo = [{m: t(await bar)}]){}',
    'async function *f(foo = [{m: t(await bar)}]){}',
    'let x = function f(foo = [{m: t(await bar)}]){}',
    'function f(foo = [{m: t(await bar)}]){}',
    'async function f(foo = [{m: t(await bar)}]){}',
    'function *f(foo = [{m: t(await bar)}]){}',
    'async function *f(foo = [{m: t(await bar)}]){}',
    'class x {f(foo = await bar){}}',
    'class x {async f(foo = await bar){}}',
    'class x {async *f(foo = await bar){}}',
    'class x {*f(foo = await bar){}}',
    'let o = {f(foo = await bar){}}',
    'let o = {async f(foo = await bar){}}',
    'let x = function f(foo = await bar){}',
    'function *f(foo = await bar){}',
    'function f(foo = await bar){}',
    'async function f(){  async (await) => x  }',
    'async (await) => x',
    'async function method() { var await = 1; }',
    'async function method(await;) { }',
    'a[await p];',
    'async (foo = await x) => foo',
    'var lambdaParenNoArg = await () => x < y;',
    'var lambdaArgs = await async (a, b ,c) => a + b + c;',
    // ['var lambdaArgs = await (async (a, b ,c) => a + b + c);', Context.None],
    'function () { "use strict"; eval("async function af(a, b = await a) { }',
    'var af = async\nfunction () { }',
    'async function af() { var a = (await) => { }; }',
    'async function af() { var a = (x, y, await) => { }; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { var a = (x = await 0) => { }; }',
    'async function af() { var a = (x, y = await 0, z = 0) => { }; }',
    'async (a, await) => { }',
    'async await => { }',
    'a[await p];',
    'class A { async get foo() {} }',
    'class A { async static staticAsyncMethod() {} }',
    'class A { static async prototype() {} }',
    'async function method() { var x = await; }',
    'class A { async constructor() {} }',
    'class A { async set foo() {} }',
    'var result = await call();',
    'await call();',
    'await a;',
    'await a[0];',
    'await o.p;',
    'a + await p;',
    'await p + await q;',
    'async(a = (await) => {}) => {};',
    'foo(await p, await q);',
    'var lambdaParenNoArg = await () => x < y;',
    'var lambdaArgs = await async (a, b ,c) => a + b + c;',
    'function method() { var x = await call(); }',
    'async (a, await) => { }',
    'function () { a = async await => { } }',
    'async (a, b = await 1) => {}',
    'async () => { await => { }; }',
    'async () => { (a, await) => { }; }',
    'async () => { (x, y, z = await 0) => { }; }',
    'async function af() { (b = (c = await => {}) => {}) => {}; }',
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
        parseSource(`let f = () => { ${arg} }`);
      });
    });

    it(`'use strict'; async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function* f() { ${arg} }`);
      });
    });

    it(`function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function* f() { ${arg} }`, { webcompat: true });
      });
    });

    it(`let f = async() => { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`let f = async() => { ${arg} }`, { webcompat: true });
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`);
      });
    });

    it(`async function* f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`async function* f() { ${arg} }`, { sourceType: 'module' });
      });
    });

    it(`'use strict'; async function f() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() { ${arg} }`, { webcompat: true });
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
    outdent`
      async function f() {
        let { [await "a"]: a } = { a: 1 };
        return a;
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, { webcompat: true });
      });
    });

    it(`"use strict"; var O = { *method() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() {${arg}}`);
      });
    });

    it(`"use strict"; function* g() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; function* g() {${arg}}`);
      });
    });
  }

  pass('Expressions - Await (pass)', [
    { code: 'await f();', options: { sourceType: 'module' } },
    { code: 'await 5;', options: { sourceType: 'module' } },
    { code: 'const foo = (await bar)', options: { sourceType: 'module' } },
    'async function f(){ if (await \n x) {} }',
    'async function a(){     async ([y] = [{m: 5 + t(await bar)}]);     }',
    'async function f(){ await \n x; }',
    'async function f(){ if (await \n x) {} }',
    { code: 'let o = {await(){}}', options: { ranges: true } },
    { code: 'class x {await(){}}', options: { ranges: true } },
    { code: 'class x {async *await(){}}', options: { ranges: true } },
    { code: 'async function f() { await 3; }', options: { sourceType: 'module' } },
    'function f(x = await){}',
    { code: 'async function a(){     async ({r} = await bar);     }', options: { ranges: true } },
    'await()',

    'await[x]',
    'await = 1',
    'await - 25',
    { code: 'call(await)', options: { ranges: true, loc: true } },
    { code: 'call(await[1])', options: { ranges: true, loc: true } },
    'call(await.foo)',
    '(function call(await){})',
    { code: '(function call(foo=await){})', options: { ranges: true, loc: true } },
    'y = async x => await x',
    '(async function f(){ await \n x; })',
    '(function *await(){})',
    'o = {await(){}}',
    'o = {async await(){}}',
    'async function foo(){}',
    'o = {*await(){}}',
    'o = {async *await(){}}',
    'o = {f(await){}}',
    'o = {*f(await){}}',
    'o = (await) => x',
    'x = function f(foo = await){}',
    'async function f(){ await await foo; }',
    'function *f(await){}',
    '(await) => x',
    'let x = function *f(foo = await){}',
    'let o = {f(foo = await){}}',
    'function *f(){  (await) => x  }',
    'function *f(){  foo(await)  }',
    'async function a(){     async ([v] = await bar);     }',
    'async function a(){     async (foo = [{m: 5 + t(await bar)}]);     }',
    '(await) => x',
    'function *f(){  foo(await)  }',
    'function f(foo = await){}',
    'let o = {*f(await){}}',
    { code: 'foo[await 1]', options: { sourceType: 'module' } },
    { code: 'foo(await bar)', options: { sourceType: 'module' } },
  ]);
});
