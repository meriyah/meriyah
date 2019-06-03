import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Declarations - Async Function', () => {
  for (const arg of [
    'async function f() { for await ([x] in y) {} }',
    'async function f() { for await ("foo".x in y) {} }',
    'async function f() { for await ((x) in y) {} }',
    'async function f() { for await (var x in y) {} }',
    'async function f() { for await (let x in y) {} }',
    'async function f() { for await (const x in y) {} }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
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
    'async function f3({x}) { var y = x; var x = 2; return y; }',
    'async function f4({x}) { { var y = x; var x = 2; } return y; }',
    'async function f6({x}, g = () => x) { { var x = 2; } return g(); }',
    'async function f7({x}) { var g = () => x; var x = 2; return g(); }',
    'async function f8({x}) { { var g = () => x; var x = 2; } return g(); }',
    'async function f9({x}, g = () => eval("x")) { var x = 2; return g(); }',
    'async function f12(y, g = () => y) { var y = 2; return g(); }',
    'async function f11({x}, y) { var z = y; var y = 2; return z; }',
    'async function f13({x}, y, [z], v) { var x, y, z; return x*y*z*v }',
    'async function f20({x}) { function x() { return 2 }; return x(); }',
    'async function f1(x = (y = 1)) { z = 1; await undefined; w = 1; };',
    'async function f1({x}) { var x = 2; return x }',
    'async function a() { await 4; } var await = 5',
    'async function a() { function b() { return await; } }',
    'async function a() { var k = { async: 4 } }',
    'async function a() { await 4; }',
    'async function a() { var t = !await 1 }',
    'async function a() { var t = ~await 1; }',
    'async function a() { var t = !(await 1); }',
    'async function a() { var t = ~(await 1);  }',
    'async function a() { var t = typeof (await 1); }',
    'async function a() { var t = typeof typeof await 1;  }',
    'async function a() { var t = void void await 1;  }',
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
    `(async () => { return !await Promise.resolve(false); })();`,
    `async function f(x = async function(){await x}){}`,
    `async function f(x = async () => await x){}`,
    `async function f(){ async(await x); }`,
    `function f() { async function yield() {} }`,
    `async function yield() {}`,
    `(async function yield() {});`,
    `function f() { (async function yield() {}); }`,
    `function* g() { (async function yield() {}); }`,
    `({ async yield() {} });`,
    `function f() { ({ async yield() {} }); }`,
    `function* g() { ({ async yield() {} }); }`,
    `({ async [yield]() {} });`,
    `function f() { ({ async [yield]() {} }); }`,
    `function* g() { ({ async [yield]() {} }); }`,
    'async function* a() { yield; (r = a) => {} }',
    `async function yield() {}`,
    'async function x () { a = { a: await(a) } }',
    'async function* a(){}',
    '(async function* (){})',
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }',
    'function f() { return await; }',
    `async function *gen() {
      yield {
          ...yield,
          y: 1,
          ...yield yield,
        };
    }`,
    `async function *gen() {
      yield [...yield];
    }`,
    `async function *gen() {
      yield [...yield yield];
    }`,
    `"use strict"; async function * fn() {
      for await ([ {} = yield ] of [iterable]) {
      }
    }`,
    `async function f() {
      let x = await y;
            const a = (b) => {};
    }`,
    `async function f() {
      (((x = await y)));
            const a = (b) => {};
    }`,
    `async function f() {
      let x = await y;
            async (b) => {};
    }`,
    `async function f() {
      (((x = await y)));
            async (b) => {};
    }`
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'async function f() { var await = { await : async function foo() {} } }',
    'async function f(async, await) { var x = await async; return x; }',
    'async function foo() { async function bar(a = await baz()) {} }',
    'async function wrap() {\n({a = await b} = obj) => a\n}',
    'async function wrap() {\n(a = await b) => a\n}',
    'async function * f() { for await ({0: a} = 1 of []); }',
    'async function * f() { for await ({0: a = 1} = 1 of []); }',
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
    `async function foo (foo = super()) { var bar; }`,
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
    `(async function() { 0, { await } = {};  });`,
    //    'async function f(){ (x = new (await x)) => {}   }',
    //    'async function f(){ (x = new f[await x]) => {}   }',
    `async function f(x = () => await x){}`,
    'async function x({await}) { return 1 }',
    'async function f() { return {await}; }',
    'async function f() { return {await = 0} = {}; }',
    'async (a = await => {}) => {}'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`() =>${arg}`, () => {
      t.throws(() => {
        parseSource(`() =>${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`function foo() {${arg}}`, undefined, Context.None);
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
    'var e = {await};'
  ]) {
    it(`async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`async function f() {${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var f = async() => {${arg}}`, undefined, Context.None);
      });
    });

    it(`var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var O = { async method() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; async function f() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; async function f() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var f = async function() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async function() {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var f = async() => {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var f = async() => {${arg}}`, undefined, Context.None);
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`'use strict'; var O = { async method() {${arg}}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; var O = { async method() {${arg}}`, undefined, Context.None);
      });
    });
  }

  fail('Declarations - Async Function (fail)', [
    ['async function foo (foo = super()) { let bar; }', Context.None],
    ['\\u0061sync function f(){}', Context.None],
    ['abc: async function a() {}', Context.None],
    ['async function wrap() {\nasync function await() { }\n}', Context.None],
    ['async function foo(await) { }', Context.None],
    ['(async function await() { })', Context.None],
    ['(async function foo(await) { })', Context.None],
    ['(async function foo() { return {await} })', Context.None],
    ['async function* a() { for (let m in ((await))) x;  (r = a) => {} }', Context.Strict],
    ['async function* g() { await; }; f = ([...[,]] = g()) => {};', Context.None],
    ['async ({a = b})', Context.None],
    ['async await => 1"', Context.None],
    ['async function f() { for await (let.x of a); }', Context.None],
    ['async function fn() { for await (const [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (const {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var [x] = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for await (const x = 1 of []) {} }', Context.None],
    ['async function fn() { for await (let x = 1 of []) {} }', Context.None],
    ['async function fn() { for await (var x = 1 of []) {} }', Context.None],
    ['async function fn() { for (const {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for (let {x} = 1 of []) {} }', Context.None],
    ['async function fn() { for (let x = 1 of []) {} }', Context.None],
    ['async function fn() { for (var x = 1 of []) {} }', Context.None],
    ['async (...await) => 1', Context.None],
    ['async ([await]) => 1', Context.None],
    ['async ([...await]) => 1', Context.None],
    ['async (b = {await}) => 1', Context.None],
    ['async (b = {a: await}) => 1', Context.None],
    ['async (b = [await]) => 1', Context.None],
    ['async function* f(a = await) {}', Context.None],
    ['async (b = [...await]) => 1', Context.None],
    ['async (b = class await {}) => 1', Context.Strict | Context.Module],
    ['async (b = (await) => {}) => 1', Context.None],
    ['async (await, b = async()) => 2', Context.None],
    ['async (await, b = async () => {}) => 1', Context.None],
    ['async function* a() { await;  (r = a) => {} }', Context.None],
    ['async function* a() { (await) => {} }', Context.None],
    ['async function* f() { a = async function*(a = await) {}; }', Context.None],
    ['function f(a = async function(a = await) {}) {}', Context.None],
    ['({async\nfoo() { }})', Context.None],
    ['({async get foo() { }})', Context.None],
    ['({async set foo(value) { }})', Context.None],
    ['({async foo() { var await }})', Context.None],
    ['function f() { a = async function(a = await) {}; }', Context.None],
    ['async (a = await) => {}', Context.None],
    ['async function foo (foo) { super.prop };', Context.None],
    ['async function foo (foo) { super.prop };', Context.None],
    ['"use strict"; async function eval () {  }', Context.None],
    ['async function foo (foo = super()) { let bar; }', Context.None],
    ['async function a(){ (foo = +await bar) => {} }', Context.None],
    ['async function a(){  (foo = [{m: 5 + t(+await bar)}]) => {}     }', Context.None],
    ['async function a(){ ([await]) => 1 }', Context.None],
    ['async function a(){ (x = delete ((await) = f)) => {} }', Context.None],
    ['async function a(){ (await) => x }', Context.None],
    ['async function a(){ (e=await)=>l }', Context.None],
    ['async function af() { var a = (x, y, z = await 0) => { }; }', Context.None],
    ['async function af() { var a = (x, y = await 0, z = 0) => { }; }', Context.None],
    ['async function af() { var a = (x = await 0) => { }; }', Context.None],
    ['async function af() { var a = (x, await, y) => { }; }', Context.None],
    ['async function af() { var a = (x, y, await) => { }; }', Context.None],
    ['async function af() { var a = (await) => { }; }', Context.None],
    ['async function af() { var a = await => { }; }', Context.None],
    ['async function a(){ async ([a=await]) => 1 }', Context.None],
    ['\\u0061sync function f(){}', Context.None],
    ['({async foo() { var await }})', Context.None],
    ['({async foo(await) { }})', Context.None],
    ['({async foo() { return {await} }})', Context.None],
    ['async function f(a = await) {}', Context.None],
    ['({async foo: 1})', Context.None],
    ['class A {async\nfoo() { }}', Context.None],
    ['class A {static async\nfoo() { }}', Context.None],
    ['async function* g(){ ({[await]: a}) => 0; }', Context.None],
    ['class A {async constructor() { }}', Context.None],
    ['await', Context.Module],
    ['class A {async foo() { return {await} }}', Context.None],
    ['async function foo() { await }', Context.None],
    ['(async function foo() { await })', Context.None],
    ['({async foo() { await }})', Context.None],
    ['async function foo(a = await b) {}', Context.None],
    ['(async function foo(a = await b) {})', Context.None],
    ['async (a = await b) => {}', Context.None],
    ['async function wrapper() {\nasync (a = await b) => {}\n}', Context.None],
    ['({async foo(a = await b) {}})', Context.None],
    ['async function wrap() {\n(a = await b) => a\n}', Context.None],
    ['async function wrap() {\n({a = await b} = obj) => a\n}', Context.None],
    ['function* wrap() {\nasync(a = yield b) => a\n}', Context.None],
    //['async function f(){ (x = new x(await x)) => {}   }', Context.None],
    ['async function arguments() { "use strict"; }', Context.None],
    ['async function fn(eval) { "use strict"; }', Context.None],
    ['async function method() { var await = 1; }', Context.None],
    ['async function method(await;) { }', Context.None],
    ['async function method() { var x = await; }', Context.None],
    ['async function af(a, b = await a) { }', Context.None],
    ['async function af(a, b = await a) { "use strict"; }', Context.None],
    ['async function af(x) { function f(a = await x) { } f(); } af();', Context.None],
    ['async function af(arguments) { "use strict"; }', Context.None],
    ['async function af(eval) { "use strict"; }', Context.None]
  ]);

  pass('Declarations - Async function (pass)', [
    [
      'async\nfunction foo() { }',
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
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'foo',
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
      'async function *gen() { yield [...yield]; }',
      Context.Strict | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 43,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 43,
            id: {
              type: 'Identifier',
              start: 16,
              end: 19,
              name: 'gen'
            },
            generator: true,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 22,
              end: 43,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 24,
                  end: 41,
                  expression: {
                    type: 'YieldExpression',
                    start: 24,
                    end: 40,
                    delegate: false,
                    argument: {
                      type: 'ArrayExpression',
                      start: 30,
                      end: 40,
                      elements: [
                        {
                          type: 'SpreadElement',
                          start: 31,
                          end: 39,
                          argument: {
                            type: 'YieldExpression',
                            start: 34,
                            end: 39,
                            delegate: false,
                            argument: null
                          }
                        }
                      ]
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
      '"use strict"; async function foo() { function bar() { await = 1; } bar(); }',
      Context.Strict | Context.OptionsRanges | Context.OptionsDirectives | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 75,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            expression: {
              type: 'Literal',
              start: 0,
              end: 12,
              value: 'use strict',
              raw: '"use strict"'
            },
            directive: 'use strict'
          },
          {
            type: 'FunctionDeclaration',
            start: 14,
            end: 75,
            id: {
              type: 'Identifier',
              start: 29,
              end: 32,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 35,
              end: 75,
              body: [
                {
                  type: 'FunctionDeclaration',
                  start: 37,
                  end: 66,
                  id: {
                    type: 'Identifier',
                    start: 46,
                    end: 49,
                    name: 'bar'
                  },
                  generator: false,
                  async: false,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 52,
                    end: 66,
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 54,
                        end: 64,
                        expression: {
                          type: 'AssignmentExpression',
                          start: 54,
                          end: 63,
                          operator: '=',
                          left: {
                            type: 'Identifier',
                            start: 54,
                            end: 59,
                            name: 'await'
                          },
                          right: {
                            type: 'Literal',
                            start: 62,
                            end: 63,
                            value: 1,
                            raw: '1'
                          }
                        }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  start: 67,
                  end: 73,
                  expression: {
                    type: 'CallExpression',
                    start: 67,
                    end: 72,
                    callee: {
                      type: 'Identifier',
                      start: 67,
                      end: 70,
                      name: 'bar'
                    },
                    arguments: []
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
      'export async function foo() { }',
      Context.Module,
      {
        body: [
          {
            declaration: {
              async: true,
              body: {
                body: [],
                type: 'BlockStatement'
              },

              generator: false,
              id: {
                name: 'foo',
                type: 'Identifier'
              },
              params: [],
              type: 'FunctionDeclaration'
            },
            source: null,
            specifiers: [],
            type: 'ExportNamedDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      'async function await() { }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 26,
            id: {
              type: 'Identifier',
              start: 15,
              end: 20,
              name: 'await'
            },
            generator: false,
            async: true,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 23,
              end: 26,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async function foo() { })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 25,
              id: {
                type: 'Identifier',
                start: 16,
                end: 19,
                name: 'foo'
              },
              generator: false,
              async: true,
              params: [],
              body: {
                type: 'BlockStatement',
                start: 22,
                end: 25,
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async ({a: b = c})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 18,
              callee: {
                type: 'Identifier',
                start: 0,
                end: 5,
                name: 'async'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 7,
                  end: 17,
                  properties: [
                    {
                      type: 'Property',
                      start: 8,
                      end: 16,
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        start: 11,
                        end: 16,
                        operator: '=',
                        left: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          name: 'b'
                        },
                        right: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          name: 'c'
                        }
                      },
                      kind: 'init'
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async await() { }})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 21,
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 20,
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 19,
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 8,
                    end: 13,
                    name: 'await'
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 13,
                    end: 19,
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 16,
                      end: 19,
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
      'async function foo(a, b) { await a }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 36,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'Identifier',
                start: 19,
                end: 20,
                name: 'a'
              },
              {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 25,
              end: 36,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 27,
                  end: 34,
                  expression: {
                    type: 'AwaitExpression',
                    start: 27,
                    end: 34,
                    argument: {
                      type: 'Identifier',
                      start: 33,
                      end: 34,
                      name: 'a'
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
      '(async function foo(a) { await a })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 35,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 35,
            expression: {
              type: 'FunctionExpression',
              start: 1,
              end: 34,
              id: {
                type: 'Identifier',
                start: 16,
                end: 19,
                name: 'foo'
              },
              generator: false,
              async: true,
              params: [
                {
                  type: 'Identifier',
                  start: 20,
                  end: 21,
                  name: 'a'
                }
              ],
              body: {
                type: 'BlockStatement',
                start: 23,
                end: 34,
                body: [
                  {
                    type: 'ExpressionStatement',
                    start: 25,
                    end: 32,
                    expression: {
                      type: 'AwaitExpression',
                      start: 25,
                      end: 32,
                      argument: {
                        type: 'Identifier',
                        start: 31,
                        end: 32,
                        name: 'a'
                      }
                    }
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(async (a) => await a)',
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
                type: 'AwaitExpression',
                argument: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                }
              ],

              async: true,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({async foo(a) { await a }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AwaitExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          }
                        }
                      ]
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
        ]
      }
    ],
    [
      'async function foo(a, b) { await a + await b }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 46,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 46,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'Identifier',
                start: 19,
                end: 20,
                name: 'a'
              },
              {
                type: 'Identifier',
                start: 22,
                end: 23,
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 25,
              end: 46,
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 27,
                  end: 44,
                  expression: {
                    type: 'BinaryExpression',
                    start: 27,
                    end: 44,
                    left: {
                      type: 'AwaitExpression',
                      start: 27,
                      end: 34,
                      argument: {
                        type: 'Identifier',
                        start: 33,
                        end: 34,
                        name: 'a'
                      }
                    },
                    operator: '+',
                    right: {
                      type: 'AwaitExpression',
                      start: 37,
                      end: 44,
                      argument: {
                        type: 'Identifier',
                        start: 43,
                        end: 44,
                        name: 'b'
                      }
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
      'function foo() { await + 1 }',
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
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'await'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
                  }
                }
              ]
            },
            async: false,
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
      'async function foo(a = async function foo() { await b }) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 59,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 59,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 55,
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  name: 'a'
                },
                right: {
                  type: 'FunctionExpression',
                  start: 23,
                  end: 55,
                  id: {
                    type: 'Identifier',
                    start: 38,
                    end: 41,
                    name: 'foo'
                  },
                  generator: false,
                  async: true,
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    start: 44,
                    end: 55,
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 46,
                        end: 53,
                        expression: {
                          type: 'AwaitExpression',
                          start: 46,
                          end: 53,
                          argument: {
                            type: 'Identifier',
                            start: 52,
                            end: 53,
                            name: 'b'
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 57,
              end: 59,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = async () => await b) {}',
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
                  name: 'a'
                },
                right: {
                  type: 'ArrowFunctionExpression',
                  body: {
                    type: 'AwaitExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  },
                  params: [],

                  async: true,
                  expression: true
                }
              }
            ],
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
      'async function foo(a = {async bar() { await b }}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 52,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 52,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 48,
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  name: 'a'
                },
                right: {
                  type: 'ObjectExpression',
                  start: 23,
                  end: 48,
                  properties: [
                    {
                      type: 'Property',
                      start: 24,
                      end: 47,
                      method: true,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 30,
                        end: 33,
                        name: 'bar'
                      },
                      kind: 'init',
                      value: {
                        type: 'FunctionExpression',
                        start: 33,
                        end: 47,
                        id: null,
                        generator: false,
                        async: true,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 36,
                          end: 47,
                          body: [
                            {
                              type: 'ExpressionStatement',
                              start: 38,
                              end: 45,
                              expression: {
                                type: 'AwaitExpression',
                                start: 38,
                                end: 45,
                                argument: {
                                  type: 'Identifier',
                                  start: 44,
                                  end: 45,
                                  name: 'b'
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 50,
              end: 52,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'async function foo(a = class {async bar() { await b }}) {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 58,
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 58,
            id: {
              type: 'Identifier',
              start: 15,
              end: 18,
              name: 'foo'
            },
            generator: false,
            async: true,
            params: [
              {
                type: 'AssignmentPattern',
                start: 19,
                end: 54,
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  name: 'a'
                },
                right: {
                  type: 'ClassExpression',
                  start: 23,
                  end: 54,
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 29,
                    end: 54,
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 30,
                        end: 53,
                        kind: 'method',
                        static: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 36,
                          end: 39,
                          name: 'bar'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 39,
                          end: 53,
                          id: null,
                          generator: false,
                          async: true,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 42,
                            end: 53,
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 44,
                                end: 51,
                                expression: {
                                  type: 'AwaitExpression',
                                  start: 44,
                                  end: 51,
                                  argument: {
                                    type: 'Identifier',
                                    start: 50,
                                    end: 51,
                                    name: 'b'
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 56,
              end: 58,
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = ({ w = counter(), x = counter(), y = counter(), z = counter() } = { w: null, x: 0, y: false, z: "" }) => {}',
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
                name: 'f'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BlockStatement',
                  body: []
                },
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'w'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'w'
                            },
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'counter'
                              },
                              arguments: []
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'counter'
                              },
                              arguments: []
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'counter'
                              },
                              arguments: []
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            right: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'counter'
                              },
                              arguments: []
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'w'
                          },
                          value: {
                            type: 'Literal',
                            value: null
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          value: {
                            type: 'Literal',
                            value: 0
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Literal',
                            value: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          value: {
                            type: 'Literal',
                            value: ''
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                ],

                async: false,
                expression: false
              }
            }
          }
        ]
      }
    ],
    [
      '({async = 0} = {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 12,
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 11,
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 7,
                      name: 'async'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 2,
                      end: 11,
                      left: {
                        type: 'Identifier',
                        start: 2,
                        end: 7,
                        name: 'async'
                      },
                      right: {
                        type: 'Literal',
                        start: 10,
                        end: 11,
                        value: 0
                      }
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 15,
                end: 17,
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async 100(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 16,
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 15,
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 8,
                    end: 11,
                    value: 100
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 11,
                    end: 15,
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 13,
                      end: 15,
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
    ]
  ]);
});
