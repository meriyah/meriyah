import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Declarations - Async Function', () => {
  for (const arg of [
    'async function f() { for await ([x] in y) {} }',
    'async function f() { for await ("foo".x in y) {} }',
    'async function f() { for await ((x) in y) {} }',
    'async function f() { for await (var x in y) {} }',
    'async function f() { for await (let x in y) {} }',
    'async function f() { for await (const x in y) {} }',
    String.raw`async function foo(p\u0061ckage) { "use strict" }`,
    'async function foo(package) { "use strict" }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'async function wrap() {\n({a = await b} = obj)\n}',
    'async function wrap() {\n(a = await b)\n}',
    'async function foo(a = class {async bar() { await b }}) {}',
    'async function foo(a = {async bar() { await b }}) {}',
    'async function foo(a = async () => await b) {}',
    'async function foo(a = async function foo() { await b }) {}',
    'async function foo() { await + 1 }',
    'async function f() { for await ([a] of []); }',
    'async function f() { for await ([a = 1] of []); }',
    "async function f() { 'use strict'; for await ({a} of []); }",
    'async function * f() { for await ({a: a} of []); }',
    'async function * f() { for await ({0: a} of []); }',
    'async function * f() { for await ({0: a = 1} of []); }',
    'async function x({x}) { var y = x; var x = 2; return y; }',
    'async function x({x}) { { var y = x; var x = 2; } return y; }',
    'async function x({x}, g = () => x) { { var x = 2; } return g(); }',
    'async function x({x}) { var g = () => x; var x = 2; return g(); }',
    'async function x({x}) { { var g = () => x; var x = 2; } return g(); }',
    'async function x({x}, g = () => eval("x")) { var x = 2; return g(); }',
    'async function x(y, g = () => y) { var y = 2; return g(); }',
    'async function x({x}, y) { var z = y; var y = 2; return z; }',
    'async function x({x}, y, [z], v) { var x, y, z; return x*y*z*v }',
    'async function x({x}) { function x() { return 2 }; return x(); }',
    'async function x(x = (y = 1)) { z = 1; await undefined; w = 1; };',
    'async function x(a, b, c) { await a; }',
    'async function a({x}) { var x = 2; return x }',
    'async function a() { await 4; } var await = 5',
    'async function a() { var k = { async: 4 } }',
    'async function a() { await 4; }',
    'async function a() { var t = !await 1 }',
    'async function a() { var t = ~await 1; }',
    'async function a() { var t = !(await 1); }',
    'async function a() { var t = ~(await 1);  }',
    'async function a() { var t = typeof (await 1); }',
    'async function a() { var t = typeof typeof await 1;  }',
    'async function a() { var t = void void await 1;  }',
    'async function a() { await 2 + 3; }',
    '(async function a() {}.constructor)',
    '"use strict"; async function a() { var t = +(await 1); }',
    '"use strict"; async function a() { var t = void (await 1); }',
    '"use strict"; async function a() { var t = !void void await 1; }',
    '"use strict"; async function a() { var t = +(await 1); }',
    '"use strict"; async function a() { var t = +(await 1); }',
    'async function foo({x}) { { var x = 2; } return x; }',
    'async function foo(a = x) { var x = 2; return a; }',
    'async function foo(a = x) { function x() {}; return a; }',
    'async function foo(a = eval("x")) { var x; return a; }',
    'async function foo(a = function() { return x }) { var x; return a(); }',
    'async function foo(a = () => x) { var x; return a(); }',
    'async function foo(a = () => eval("x")) { var x; return a(); }',
    'async function foo(x, y = () => x) { return x + y(); }',
    'async function foo(x = {a: 1, m() { return 2 }}) { return x.a + x.m(); }',
    'async function foo(x = () => 1) { return x() }',
    'async function async(x, y) { return x - y; }',
    'async function async() { return 12; }',
    'async function foo(a, b = () => a, c = b) { function b() { return a; } var a = 2; return [b, c]; }',
    'async function foo(a = x) { let x = 2; return a; }',
    'async function foo(a = () => eval("x")) { var x; return a(); }',
    'async function foo(x = (y = 1)) { z = 1; await undefined; w = 1; };',
    'async function f() { let a = function(a = await) {}; }',
    'async function f(a = async function() { await 1; }) {}',
    'async function foo(y = eval("var x = 2")) { with ({}) { return x; } }',
    'async function foo(y = eval("var x = 2"), z = x) { return z; }',
    'async function foo(y = eval("var x = 2"), z = eval("x")) { return z; }',
    'async function foo(z = eval("var y = 2")) { return y; }',
    'async function foo(f = () => x) { eval("var x = 2"); return f() }',
    'async function foo() { return await bar() + await z(); }',
    'async function foo(a, b) { await a + await b }',
    'async function foo(a) { return a ? await bar() : await z(); }',
    'async function af(x) { var x = 0; with (obj) { x = await af(); } return x; }',
    'async function * foo() { yield ()=>{}; }',
    'async function af1(a) { await a; return await foo.call({ x : 100 }); /** comment**/ }',
    'async function f2(d, e, f) { let x = await f1(d + 10, e + 20, f + 30); return x; }',
    '(async function(x = 1) {})',
    '(async function(x = 1, ...a) {})',
    '(async function(x, y = 1, z, v = 2, ...a) {})',
    '(async function(x, y = 1, z, v = 2) {})',
    '(async function(x, y = 1, z) {})',
    '(async function(x, y = 1, ...a) {})',
    '(async () => { return !await Promise.resolve(false); })();',
    'async function f(x = async function(){await x}){}',
    'async function f(x = async () => await x){}',
    'async function f(){ async(await x); }',
    'function f() { async function yield() {} }',
    'async (a = async () => { await 1; }) => {}',
    'async function yield() {}',
    '(async function yield() {});',
    'function f() { (async function yield() {}); }',
    'function* g() { (async function yield() {}); }',
    '({ async yield() {} });',
    'function f() { ({ async yield() {} }); }',
    'function* g() { ({ async yield() {} }); }',
    '({ async [yield]() {} });',
    'function f() { ({ async [yield]() {} }); }',
    'function* g() { ({ async [yield]() {} }); }',
    'async function* a() { yield; (r = a) => {} }',
    'async function* x(a, b, ...c) { await 1; }',
    'async function* x(a, b = 2) { await 1; }',
    'async function* x(a) { yield 1; }',
    'async function* x(a, b = 2) { yield 1; }',
    'async function* x(a, b, ...c) { yield 1; }',
    'async function x() { let x = await 1; eval("var i = 5"); let y = await 2; debugger; }',
    'new (async function*() {})',
    '(async function*() {}).caller',
    '(async function*() {}).arguments',
    'async function fib(n) { return (n == 0 || n == 1) ? n : await fib(n - 1) + await fib(n - 2); }',
    'var hardcoreFib = async function fib2(n) { return (n == 0 || n == 1) ? n : await fib2(n - 1) + await fib2(n - 2); }',
    '() => class extends (async function() {}) {}',
    'async function f() {   class x { foo(x=new (await)()){} }   }',
    'async function f() {   class x extends await y { }   }',
    'async function yield() {}',
    'async function x () { a = { a: await(a) } }',
    'async function* a(){}',
    'async function f() {   class x { await(){} }   }',
    'async function f() {   class x { foo(x=await){} }   }',
    'function f() {   class x { [await](){} }   }',
    '(async function* (){})',
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }',
    'async function f() {   class x { foo(await){} }   }',
    'function f() {   class x { await(){} }   }',
    'async function f() {   class x extends feh(await y) { }   }',
    'function f() {   class x { foo(x=new (await)()){} }   }',
    'async function fn() { const x = await import([a]); }',
    'async function fn() { const x = await import([]); }',
    'async function fn() { const x = await import(() => {}); }',
    'async function fn() { const x = await import(await a); }',
    'async function fn() { const x = await getpromise(); }',
    'async function fn() { const x = await import(a()()); }',
    'async function fn() { const x = await import(a()[0]); }',
    'async function fn() { const x = await import(a().x); }',
    'async function fn() { const x = await import(b()); }',
    'async function fn() { const x = await import((((((("./foo"))))))); }',
    'async function fn() { const x = await import(x += a); }',
    'async function fn() { const x = await import(x = a); }',
    'async function fn() { const x = await import(delete void typeof +-~! 0 && b); }',
    'async function fn() { const x = await import(false || b); }',
    'async function fn() { const x = await import({}); }',
    'async function fn() { const x = await import({}); }',

    'async function fn() { (await x)[a] += y; }',
    'async function fn() { x[await a] += y; }',
    'async function fn() { (await x).a += await y; }',
    'async function fn() { (await x)[a] += await y; }',
    'async function fn() { x[await a] += await y; }',
    'async function fn() { (await x) ** y; }',
    'async function fn() { return (await x), y; }',
    'async function fn() { return x, await y; }',
    'async function fn() { x.a.b = await y; }',
    'async function fn() {  x[z] = await y; }',
    'async function fn() {x[z].b = await y; }',
    'async function fn() { const x = await import({}); }',
    'async function fn() { x.a[z] = await y;; }',
    'async function fn() { (await x) && y; }',
    'async function fn() { x && await y; }',
    'async function fn() {  x = await y; }',
    'async function fn() { x + await y; }',
    'async function fn() {(await x) + y; }',
    'async function fn() {(await x).a = y; }',
    'async function fn() {  (await x.a).b = y; }',
    'async function fn() { (await x)[z] = y; }',
    'async function fn() { x[await z].b = y;}',
    'async function fn() { (await x[z]).b = y; }',
    'async function * fn() { return import(yield 42); }',
    'async function f() { let\narguments }',
    'async function f() { let\ninterface }',
    'async function f() { let\npackage }',
    'async function f() { for await (x[a in b] of y); }',
    'async function a() { await a.b[c](d).e; }',
    'await.b[c](d).e;',
    'function *a(){yield*a}',
    'async function * fn() { import(yield * ["Mr. X", "Mr. Y", "Mr. Z"]); }',
    'async function* f(a = async function*() { await 1; }) {}',
    'function f() { return await; }',
    outdent`
      async function *gen() {
        yield {
            ...yield,
            y: 1,
            ...yield yield,
          };
      }
    `,
    outdent`
      async function *gen() {
        yield [...yield];
      }
    `,
    outdent`
      async function *gen() {
        yield [...yield yield];
      }
    `,
    outdent`
      "use strict"; async function * fn() {
        for await ([ {} = yield ] of [iterable]) {
        }
      }
    `,
    outdent`
      async function f() {
        let x = await y;
              const a = (b) => {};
      }
    `,
    outdent`
      async function f() {
        (((x = await y)));
              const a = (b) => {};
      }
    `,
    outdent`
      async function f() {
        let x = await y;
              async (b) => {};
      }
    `,
    outdent`
      async function f() {
        (((x = await y)));
              async (b) => {};
      }
    `,
    'async function foo(package) { }',
    String.raw`async function foo(p\u0061ckage) { }`,
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
  }

  for (const arg of [
    'async function f() { var await = { await : async function foo() {} } }',
    'async function f() { class x { foo(x=await y){} }   }',
    'async function f() { class x { foo(x=new (await y)()){} }   }',
    'async function f(async, await) { var x = await async; return x; }',
    'async function f() { class x { foo(await y){} }   }',
    'function f() { class x { foo(x=await y){} }   }',
    'async function foo() { async function bar(a = await baz()) {} }',
    'async function wrap() {\n({a = await b} = obj) => a\n}',
    'function f() { class x { foo(x=new (await y)()){} }   }',
    'async function wrap() {\n(a = await b) => a\n}',
    'async function f() { class x extends await { }   }',
    'function f() { class x { await y(){} }   }',
    'async function f() { class await { }   }',
    'function f() { class x { [await y](){} }   }',
    'async function * f() { for await ({0: a} = 1 of []); }',
    'async function * f() { for await ({0: a = 1} = 1 of []); }',
    'async function f() {   class x extends feh(await) { }   }',
    'async function * f() { for await ({a: a} = 1 of []); }',
    "async function f() { 'use strict'; for await ({a} = 1 of []); }",
    'async function foo() { await }',
    'async function a(k = await 3) {}',
    'async function a() { async function b(k = await 3) {} }',
    'async function a() { async function b(k = [await 3]) {} }',
    'async function a() { async function b([k = await 3]) {} }',
    'async function a() { async function b([k = [await 3]]) {} }',
    'async function a() { async function b({k = await 3}) {} }',
    'async function a() { async function b({k = [await 3]}) {} }',
    'async function f() { for await ([a = 1] = 1 of []); }',
    'async function f() { for await ([a] = 1 of []); }',
    'async function fn() { var await; }',
    'async function fn() { var await; }',
    'async function fn() { void await; }',
    'async function a(){ (foo = await bar) => {}     }',
    'async function f(){ (fail = class A {[await foo](){}; "x"(){}}) => {}    }',
    'async function fn() { await: ; }',
    'async function foo (foo = super()) { var bar; }',
    'async function fn() { void await; }',
    'async function fn() { void await; }',
    'async function fn() { await: ; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { var a = (x = await 0) => { }; }',
    'async function af() { var a = (x, y = await 0, z = 0) => { }; }',
    'async function af() { var a = (x, y, z = await 0) => { }; }',
    'async function foo (x = await) {  }',
    'async function foo (await) {  }',
    '(async function await() {})',
    'function* a() { await 4; }',
    'async function a(k = await 3) {}',
    'async function a() { async function b(k = [await 3]) {} }',
    'async function a() { async function b([k = await 3]) {} }',
    'async function a() { async function b([k = [await 3]]) {} }',
    'async function a() { async function b({k = await 3}) {} }',
    'async function a() { async function b({k = [await 3]}) {} }',
    'async function a() { var await = 4; }',
    'async function a() { return await; }',
    'async function af() { var a = (x, y, await) => { }; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { (b = (c = await => {}) => {}) => {}; }',
    'async function foo (foo) { super() };',
    'async function foo() { (async function await() { }) }',
    '(async function() { 0, { await } = {};  });',
    'async function f(){ (x = new (await x)) => {}   }',
    'async function f(){ (x = new f[await x]) => {}   }',
    'async function f(x = () => await x){}',
    'async function f(){ (x = class A {[await foo](){}; "x"(){}}) => {} }',
    'async function x({await}) { return 1 }',
    'async function f() { return {await}; }',
    'async function f() { return {await = 0} = {}; }',
    'async (a = await => {}) => {}',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`() =>${arg}`, () => {
      t.throws(() => {
        parseSource(`() =>${arg}`);
      });
    });

    it(`function foo() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() {${arg}}`);
      });
    });
  }

  for (const arg of [
    'var await = 1;',
    'var { await } = 1;',
    'var [ await ] = 1;',
    'return async (await) => {};',
    'var O = { async [await](a, a) {} }',
    'await;',
    'function await() {}',
    'var f = await => 42;',
    'var f = (await) => 42;',
    'var f = (await, a) => 42;',
    'var f = (...await) => 42;',
    'var e = (await);',
    'var e = (await, f);',
    'var e = (await = 42)',
    'var e = [await];',
    'var e = {await};',
  ]) {
    it(`async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`async function f() {${arg}}`, { webcompat: true });
      });
    });

    it(`var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var f = async() => {${arg}}`);
      });
    });

    it(`var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var O = { async method() {${arg}}`);
      });
    });

    it(`'use strict'; async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() {${arg}}`);
      });
    });

    it(`'use strict'; var f = async function() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async function() {${arg}}`);
      });
    });

    it(`'use strict'; var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async() => {${arg}}`);
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`, { webcompat: true });
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`);
      });
    });
  }

  fail('Declarations - Async Function (fail)', [
    'async function f() { delete await; }',
    { code: 'delete await;', options: { sourceType: 'module' } },
    'async function foo (foo = super()) { let bar; }',
    'async function foo (foo = super()) { let bar; }',
    'async function foo (foo = super()) { let bar; }',
    String.raw`\u0061sync function f(){}`,
    'abc: async function a() {}',
    'async function wrap() {\nasync function await() { }\n}',
    'async function foo(await) { }',
    '(async function await() { })',
    '(async function foo(await) { })',
    '(async function foo() { return {await} })',
    { code: 'async function* a() { for (let m in ((await))) x;  (r = a) => {} }', options: { impliedStrict: true } },
    'async function* g() { await; }; f = ([...[,]] = g()) => {};',
    'async ({a = b})',
    'async await => 1"',
    'async function f() { for await (let.x of a); }',
    'async function fn() { for await (const [x] = 1 of []) {} }',
    'async function fn() { for await (const {x} = 1 of []) {} }',
    'async function fn() { for await (let [x] = 1 of []) {} }',
    'async function fn() { for await (let {x} = 1 of []) {} }',
    'async function fn() { for await (var [x] = 1 of []) {} }',
    'async function fn() { for await (var {x} = 1 of []) {} }',
    'async function fn() { for await (const x = 1 of []) {} }',
    'async function fn() { for await (let x = 1 of []) {} }',
    'async function fn() { for await (var x = 1 of []) {} }',
    'async function fn() { for (const {x} = 1 of []) {} }',
    'async function fn() { for (let {x} = 1 of []) {} }',
    'async function fn() { for (let x = 1 of []) {} }',
    'async function fn() { for (var x = 1 of []) {} }',
    'async (a = await) => {}',
    'async (...await) => 1',
    'async ([await]) => 1',
    'async function f() { let\nyield 0 }',
    'async function f() { "use strict"; let\nawait 0 }',
    'async ([...await]) => 1',
    'async (b = {await}) => 1',
    'async (b = {a: await}) => 1',
    'async (b = [await]) => 1',
    'async function* f(a = await) {}',
    'function f(a = async function*(a = await) {}) {}',
    'function f() { a = async function*(a = await) {}; }',
    'async function a(k = await 3) {}',
    'async function a() { async function b(k = await 3) {} }',
    'async function a() { async function b(k = [await 3]) {} }',
    'async function k() { function a() { await 4; } }',
    'async (b = [...await]) => 1',
    { code: 'async (b = class await {}) => 1', options: { sourceType: 'module' } },
    'async (b = (await) => {}) => 1',
    'async (await, b = async()) => 2',
    'async (await, b = async () => {}) => 1',
    'async function* a() { await;  (r = a) => {} }',
    'async function* a() { (await) => {} }',
    { code: '{ async function f() {} async function f() {} }', options: { lexical: true } },
    { code: 'switch (0) { case 1: async function f() {} default: function f() {} }', options: { lexical: true } },
    { code: '{ function* f() {} async function f() {} }', options: { lexical: true, impliedStrict: true } },
    { code: '{ function* f() {} async function f() {} }', options: { lexical: true, webcompat: true } },
    'async function* f() { a = async function*(a = await) {}; }',
    'function f(a = async function(a = await) {}) {}',
    outdent`
      async function x(a=class b{
        [a = class b{
            [await 0](){}
        }](){}
      }) {
      }
    `,
    '({async get foo() { }})',
    '({async set foo(value) { }})',
    '({async foo() { var await }})',
    'function f() { a = async function(a = await) {}; }',
    'async function f() { a = async function(a = await) {}; }',
    'async (a = await) => {}',
    'async function foo (foo) { super.prop };',
    'async function foo (foo) { super.prop };',
    '"use strict"; async function eval () {  }',
    'async function f() { let\narguments.length }',
    'async function f() { let\narguments.await }',
    'async function f() { let\narguments.package }',
    'async function f() { let\narguments.yield }',
    'async function foo (foo = super()) { let bar; }',
    'async function a(){ (foo = +await bar) => {} }',
    'async function a(){  (foo = [{m: 5 + t(+await bar)}]) => {}     }',
    'async function a(){ ([await]) => 1 }',
    'async function a(){ (x = delete ((await) = f)) => {} }',
    'async function a(){ (await) => x }',
    'async function a(){ (e=await)=>l }',
    'async function af() { var a = (x, y, z = await 0) => { }; }',
    'async function af() { var a = (x, y = await 0, z = 0) => { }; }',
    'async function af() { var a = (x = await 0) => { }; }',
    'async function af() { var a = (x, await, y) => { }; }',
    'async function af() { var a = (x, y, await) => { }; }',
    'async function af() { var a = (await) => { }; }',
    'async function af() { var a = await => { }; }',
    'async function a(){ async ([a=await]) => 1 }',
    String.raw`\u0061sync function f(){}`,
    '({async foo() { var await }})',
    '({async foo(await) { }})',
    '({async foo() { return {await} }})',
    'async function f(a = await) {}',
    '({async foo: 1})',
    'async function* g(){ ({[await]: a}) => 0; }',
    'class A {async constructor() { }}',
    { code: 'await', options: { sourceType: 'module' } },
    'class A {async foo() { return {await} }}',
    'async function foo() { await }',
    '(async function foo() { await })',
    '({async foo() { await }})',
    'async function foo(a = await b) {}',
    '(async function foo(a = await b) {})',
    'async (a = await b) => {}',
    'async function wrapper() {\nasync (a = await b) => {}\n}',
    '({async foo(a = await b) {}})',
    'async function wrap() {\n(a = await b) => a\n}',
    'async function wrap() {\n({a = await b} = obj) => a\n}',
    'function* wrap() {\nasync(a = yield b) => a\n}',
    'async function f(){ (x = new x(await x)) => {}   }',
    'async function arguments() { "use strict"; }',
    'async function fn(eval) { "use strict"; }',
    'async function method() { var await = 1; }',
    'async function method(await;) { }',
    'async function method() { var x = await; }',
    'async function af(a, b = await a) { }',
    'async function af(a, b = await a) { "use strict"; }',
    'async function af(x) { function f(a = await x) { } f(); } af();',
    'async function af(arguments) { "use strict"; }',
    'async function af(eval) { "use strict"; }',
  ]);

  pass('Declarations - Async function (pass)', [
    'async\nfunction foo() { }',
    { code: 'async function *gen() { yield [...yield]; }', options: { impliedStrict: true, ranges: true } },
    {
      code: '"use strict"; async function foo() { function bar() { await = 1; } bar(); }',
      options: { impliedStrict: true, ranges: true, raw: true },
    },
    { code: 'export async function foo() { }', options: { sourceType: 'module' } },
    { code: 'async function await() { }', options: { ranges: true } },
    { code: '(async function foo() { })', options: { ranges: true } },
    { code: 'async ({a: b = c})', options: { loc: true, ranges: true } },
    { code: '({async await() { }})', options: { ranges: true } },
    { code: 'async function foo(a, b) { await a }', options: { ranges: true } },
    { code: '(async function foo(a) { await a })', options: { ranges: true } },
    '(async (a) => await a)',
    '({async foo(a) { await a }})',
    { code: 'async function foo(a, b) { await a + await b }', options: { ranges: true } },
    { code: 'function foo() { await + 1 }', options: { loc: true, ranges: true } },
    { code: 'async function foo(a = async function foo() { await b }) {}', options: { loc: true, ranges: true } },
    'async function foo(a = async () => await b) {}',
    { code: 'async function foo(a = {async bar() { await b }}) {}', options: { ranges: true } },
    { code: 'async function foo(a = class {async bar() { await b }}) {}', options: { ranges: true } },
    {
      code: 'f = ({ w = counter(), x = counter(), y = counter(), z = counter() } = { w: null, x: 0, y: false, z: "" }) => {}',
      options: { loc: true, ranges: true },
    },
    { code: '({async = 0} = {})', options: { ranges: true } },
    { code: '({async 100(){}})', options: { ranges: true } },
  ]);
});
