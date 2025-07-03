import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Declarations - Function', () => {
  for (const arg of ['package', 'public', 'instanceof']) {
    it(`function foo(${arg}) { 'use strict'; }`, () => {
      t.throws(() => {
        parseSource(`function foo(${arg}) { "use strict"; }`);
      });
    });
    it(`function ${arg}() { 'use strict'; }`, () => {
      t.throws(() => {
        parseSource(`function ${arg}() { "use strict"; }`);
      });
    });
    it(`(function ${arg}() { 'use strict'; })`, () => {
      t.throws(() => {
        parseSource(`(function ${arg}() { 'use strict'; })`);
      });
    });
  }

  for (const arg of [
    'function 10() {}',
    'function 0x7F() {}',
    'function "str"() {}',
    'try function foo() {} catch (e) {}',
    'do function foo() {} while (0);',
    'for (;false;) function foo() {}',
    'for (var i = 0; i < 1; i++) function f() { };',
    'for (var x in {a: 1}) function f() { };',
    'for (var x in {}) function f() { };',
    'for (var x in {}) function foo() {}',
    'for (x in {a: 1}) function f() { };',
    'for (x in {}) function f() { };',
    'var x; for (x in {}) function foo() {}',
    'with ({}) function f() { };',
    'do label: function foo() {} while (0);',
    'for (;false;) label: function foo() {}',
    'for (var i = 0; i < 1; i++) label: function f() { };',
    'for (var x in {a: 1}) label: function f() { };',
    'for (var x in {}) label: function f() { };',
    'for (var x in {}) label: function foo() {}',
    'for (x in {a: 1}) label: function f() { };',
    'for (x in {}) label: function f() { };',
    'var x; for (x in {}) label: function foo() {}',
    'with ({}) label: function f() { };',
    'if (true) label: function f() {}',
    'if (true) {} else label: function f() {}',
    'if (true) function* f() { }',
    'label: function* f() { }',
    'if (true) async function f() { }',
    'label: async function f() { }',
    'if (true) async function* f() { }',
    'label: async function* f() { }',
    'try function foo() {} catch (e) {}',
    'do function foo() {} while (0);',
    'for (;false;) function foo() {}',
    'for (var i = 0; i < 1; i++) function f() { };',
    'for (var x in {a: 1}) function f() { };',
    'for (var x in {}) function f() { };',
    'for (var x in {}) function foo() {}',
    'for (x in {a: 1}) function f() { };',
    'for (x in {}) function f() { };',
    'var x; for (x in {}) function foo() {}',
    'with ({}) function f() { };',
    'do label: function foo() {} while (0);',
    'for (;false;) label: function foo() {}',
    'for (var i = 0; i < 1; i++) label: function f() { };',
    'for (var x in {a: 1}) label: function f() { };',
    'for (var x in {}) label: function f() { };',
    'for (var x in {}) label: function foo() {}',
    'for (x in {a: 1}) label: function f() { };',
    'for (x in {}) label: function f() { };',
    'var x; for (x in {}) label: function foo() {}',
    'with ({}) label: function f() { };',
    'if (true) label: function f() {}',
    'if (true) {} else label: function f() {}',
    'if (true) function* f() { }',
    'label: function* f() { }',
    'label: async function f() { }',
    'label: async function* f() { }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { 'use strict';${arg}})()`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { 'use strict'; {${arg}}})()`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { ;${arg}})()`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { ;${arg}})()`, { lexical: true });
      });
    });
  }

  // Valid only in sloppy mode and with the 'WebCompat' option on
  for (const arg of [
    'if (true) function foo() {}',
    'if (false) {} else function f() { };',
    'label: function f() { }',
    'label: if (true) function f() { }',
    'label: if (true) {} else function f() { }',
    'label: label2: function f() { }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() {${arg}})()`, { webcompat: true, lexical: true });
      });
    });
  }

  fail('Declarations - Functions (fail)', [
    'function a({x: {x: y}.length}){}',
    'function a({x: {}.length}){}',
    'function a({x: void x}){}',
    'function a({x: typeof x}){}',
    'function a({x: null}){}',
    'function a({x: false}){}',
    'function a({x: class{}}){}',
    '"use strict"; function eval() {}',
    'function eval() {"use strict";}',
    'function arguments() {"use strict";}',
    'function super() {"use strict";}',
    'function f(,,){}',
    { code: 'function f(x = package = 10) {}', options: { impliedStrict: true } },
    { code: 'function f(x = let = 10) {}', options: { impliedStrict: true } },
    { code: 'function f(x = yield = 10) {}', options: { impliedStrict: true } },
    'function f(x = package = 10) { "use strict"; }',
    'function f(x= package =10){ "use strict"; }',
    'f = function f(x=package=10){ "use strict"; }',
    'f(x=package=10) => { "use strict"; }',
    'f(x = eval = 10) => { "use strict"; }',
    'o = {foo(x=package=y){ "use strict"; }}',
    'class c {foo(x=package=y){ "use strict"; }}',
    'o = {foo(x = package = y){ "use strict"; }}',
    'o = {foo(x = let = y){ "use strict"; }}',
    'o = {foo(x = implements = y){ "use strict"; }}',
    'o = {foo(x= eval = y){ "use strict"; }}',
    'function f(async function() {}) { }',
    { code: 'function await() {}', options: { sourceType: 'module' } },
    { code: 'function *await() {}', options: { sourceType: 'module' } },
    'function foo(package) { "use strict"; }',
    String.raw`function foo(p\x61ckage) { }`,
    String.raw`function foo(p\x61ckage) { "use strict"; }`,
    String.raw`function foo(p\141ckage) { }`,
    'function test({...x = 1}) {}',
    'function test({...[]}) {}',
    'function test({...x = 1}) {}',
    'function test({...{}}) {}',
    'function w(casecase){y:j:function casecase(){}}',
    'function test({...x = 1}) {}',
    { code: 'function foo() { "use strict"; 00004; }', options: { impliedStrict: true } },
    { code: 'function foo() { 00004; }', options: { impliedStrict: true } },
    'function 00004() { "use strict"; 00004; }',
    'function foo(001, 003) { "use strict"; }',
    'function f([x=x()=x]){}',
    'function foo(001, 003) { "use strict"; }',
    { code: 'function f() { class await { }   }', options: { sourceType: 'module' } },
    { code: 'function f() { class x extends await { }   }', options: { sourceType: 'module' } },
    'function f() { class x extends await y { }   }',
    'function f() { class x extends foo(await y) { }   }',
    'function f() { class x { foo(await y){} }   }',
    'function f() { class x { foo(x=await y){} }   }',
    'function *f(){ class x { foo(x=new (yield)()){} }  }',
    'function *f(){ class x { foo(x=yield y){} }  }',
    'function *f(){ class x { foo(x=yield){} }  }',
    'function *f(){ class x { foo(yield){} }  }',
    'function *f(){ class x extends yield y { }  }',
    'function *f(){ class x extends yield { }  }',
    'function *f(){ class yield { }  }',
    'function f(){ class x { [yield y](){} }  }',
    'function f(){ class x { [yield](){} }  }',
    'function f(){ class x { foo(x=new (yield)()){} }  }',
    'function f(){ class x { foo(x=yield y){} }  }',
    'function f(){ class x { foo(x=yield){} }  }',
    'function f(){ class x { foo(yield){} }  }',
    'function f(){ class x extends foo(yield y) { }  }',
    'function f(){ class x extends foo(yield) { }  }',
    'function f(){ class x extends yield y { }  }',
    'function f(){ class x extends yield { }  }',
    'function f(){ class yield { }  }',
    'function f(){ class yield { }  }',
    'function f(){ class x extends yield { }  }',
    'function f(){ class x extends yield y { }  }',
    'function f(){ class x extends foo(yield) { }  }',
    'function f(){ class x extends foo(yield y) { }  }',
    'function f(){ class x { foo(yield){} }  }',
    'function f(){ class x { foo(x=yield){} }  }',
    'function f(){ class x { foo(x=yield y){} }  }',
    'function f(){ class x { foo(x=new (yield)()){} }  }',
    'function f(){ class x { [yield](){} }  }',
    'function f(){ class x { [yield y](){} }  }',
    String.raw`function foo(p\u0061ckage) { "use strict"; }`,
  ]);

  for (const arg of [
    'function f() { ++(yield); }',
    'function f(arg) {function h() { g(arg) }; return h}',
    'function f(arg, ...arguments) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, arguments=[]) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); arg = 42; g(arg)}',
    'function f(arg=1) {g(arg); arg = 42; g(arg)}',
    "function f(arg) {g(arg); g(function() {eval('arg = 42')}); g(arg)}",
    "function f(arg) {g(arg); g(() => eval('arg = 42')); g(arg)}",
    'function f(arg) {g(arg); arguments[0] = 42; g(arg)}',
    'function *f(){  class x extends foo(yield y) { }  }',
    'function *f(){  class x extends foo(yield) { }  }',
    'function f(a, a) {}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    'function f([foo] = x, b = y){}',
    'function f(x, [foo]){}',
    'function f([foo=a,bar=b] = x){}',
    'function f([...bar] = obj){}',
    'function f([foo, ...bar] = obj){}',
    'function f({foo} = x, b){}',
    'function f({foo} = x, b = y){}',
    'function f(x, {foo} = y){}',
    'function f(x = y, {foo} = z){}',
    'function f({foo=a} = x){}',
    'function f({foo=a,bar} = x){}',
    'function f({foo,bar=b} = x){}',
    'function f({foo=a,bar=b} = x){}',
    'function f({foo:a} = x){}',
    'function f({foo:a,bar} = x){}',
    'function f({foo,bar:b} = x){}',
    'function f({foo:a,bar:b} = x){}',
    'function f({a}, {b}, {c = ""}) { return [a, b, c] }',
    'function g({a}, {b} = {b: 2}) { return [a, b] }',
    'function h({a}, {b} = {b: 2}, c) { return [a, b, c] }',
    'function i({a}, {b}, c, ...rest) { return [a, b, c, rest] }',
    'function f({a}, {b}, {c = ""}) { return [a, b, c] }',
    'function f({a}, {b}, {c = ""}) { return [a, b, c] }',
    'function f({a}, {b}, {c = ""}) { return [a, b, c] }',
    'function f({foo:a,bar:b} = x){}',
    'function f({foo:a=b} = x){}',
    'function f({foo:a=b, bar:c=d} = x){}',
    'function f({foo}){}',
    'function f({foo=a}){}',
    'function f({foo:a}){}',
    'function f({foo:a=b}){}',
    'function f({foo}, bar){}',
    'function f(foo, {bar}){}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([foo,bar]){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f() {   class x { foo(x=new (await)()){} }   }',
    "function f(arg) {g(arg); g(function() {eval('arg = 42')}); g(arg)}",
    'function f(arg) {g(arg); g(() => arg = 42); g(arg)}',
    "function f(arg) {g(arg); g(() => eval('arg = 42')); g(arg)}",
    "function f(...arg) {g(arg); eval('arg = 42'); g(arg)}",
    'function f(arg) {}',
    'function f(arg) {g(arg)}',
    'function f(arg) {function h() { g(arg) }; h()}',
    'function f(arg) {function h() { g(arg) }; return h}',
    'function f(arg=1) {}',
    'function f(arg=1) {g(arg)}',
    'function f(arg, arguments) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, ...arguments) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, arguments=[]) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(...arg) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); g(function() {arguments[0] = 42}); g(arg)}',
    'function f(arg) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); h(arguments); g(arg)}',
    "function f(arg) {g(arg); eval('arguments[0] = 42'); g(arg)}",
    'function f(arg) {g(arg); g(() => arguments[0] = 42); g(arg)}',
    'function f([]){}',
    'function f([] = x){}',
    'function f([,]){}',
    'function f([,] = x){}',
    'function f([,,]){}',
    'function f([,,] = x){}',
    'function f([foo]){}',
    'function f([foo] = x){}',
    'function f([foo,]){}',
    'function f([foo,] = x){}',
    'function f([foo,,]){}',
    'function f([foo,,] = x){}',
    'function fn1([a, b = 42]) {}',
    'function fn2([a = 42, b,]) {}',
    'function fn3([a,, b = a, c = 42]) {}',
    'function fn1([{}]) {}',
    'function fn2([{} = 42]) {}',
    'function fn3([a, {b: c}]) {}',
    'function fn4([a, {b: []}]) {}',
    'function fn2([a, b,]) {}',
    'function fn2([,,]) {}',
    'function fn([]) {}',
    'function fn2([,,,,,,,...args]) {}',
    'function fn1([...args]) {}',
    'function fn3([x, {y}, ...z]) {}',
    'function fn4([,x, {y}, , ...z]) {}',
    'function fn5({x: [...y]}) {}',
    'function fnc({x: {}}) {}',
    'function fnd({x: {y}}) {}',
    'function fne({x: {} = 42}) {}',
    'function fnf({x: {y} = 42}) {}',
    'function fna({x: y}) {}',
    'function fn2({a: {p: q, }, }) {}',
    'function fn1({x,}) {}',
    'function fna({x}) {}',
    'function fnb({x, y}) {}',
    'function fnc({x = 42}) {}',
    'function fnd({x, y = 42}) {} ',
    'function fn1({a: {p: q}, b: {r}, c: {s = 0}, d: {}}) {}',
    'function fn2(x, {a: r, b: s, c: t}, y) {}',
    'function fn3({x: {y: {z: {} = 42}}}) {}',
    'function fn4([], [[]], [[[[[[[[[x]]]]]]]]]) {}',
    'function fn4([[x, y, ...z]]) {}',
    'function fn3({a: [,,,] = 42}) {}',
    'function fn2([{a: [{}]}]) {}',
    'function fn1([{}]) {}',
    'function f([,foo]){}',
    'function f([,foo] = x){}',
    'function f([,,foo]){}',
    'function f([,,foo] = x){}',
    'function f([foo,bar]){}',
    'function f([foo,bar] = x){}',
    'function f([foo,,bar]){}',
    'function f([foo,,bar] = x){}',
    'function f([foo], b){}',
    'function f([foo] = x, b){}',
    'function f([foo], b = y){}',
    'function f([foo] = x, b = y){}',
    'function f(x, [foo]){}',
    'function f(x, [foo] = y){}',
    'function f(x = y, [foo] = z){}',
    'function f(x = y, [foo]){}',
    'function f([foo=a]){}',
    'function f([foo=a] = c){}',
    'function f([foo=a,bar]){}',
    'function f([foo=a,bar] = x){}',
    'function f([foo,bar=b]){}',
    'function f([foo,bar=b] = x){}',
    'function f([foo=a,bar=b]){}',
    'function bar() {foo = 42}; ext(bar); ext(foo)',
    'function bar() { }',
    'function a(b, c) { }',
    'function makeArrayLength(x) { if(x < 1 || x > 4294967295 || x != x || isNaN(x) || !isFinite(x)) return 1; else return Math.floor(x); };',
    'function foo () {"use strict";}',
    'function __decl(){return 1;}',
    'function __func__2(){b};',
    'function x(...{ a }){}',
    'function santa() { function package() {} function evdal() { "use strict"; }}',
    'function foo(bar, eval) { function bar() { "use strict"; } }',
    '(function(){})',
    'function test() { "use strict" + 42; }',
    'function test(t, t) { }',
    'function hello() { z(); }',
    'function f() {} function* f() {}',
    'function* f() {} function f() {}',
    'function __func(){};',
    '"use strict"; (function(){}).hasOwnProperty("icefapper");',
    'function __func(){ delete arguments; return arguments; }',
    'function hello() { say_hi_to_ariya(); }',
    'function arguments() { }',
    'function hello(a, b) { sayHi(); }',
    'function f() { var o = { get await() { } } }',
    'function f() { var o = { *await() { } } }',
    'function f() { var await = 10; var o = { await }; }',
    'function f() { class C { await() { } } }',
    'function f() { class C { *await() { } } }',
    'function f() { var fe = function await() { } }',
    'function f() { function await() { } }',
    'function f() { const await = 10; }',
    'function f(a = async function (x) { await x; }) { a(); } f();',
    'function f() {async = 1, a = 2;}',
    'function f() {a = 1, async = 2;}',
    'function f() {var async = 1; return async;}',
    'function f() {let async = 1; return async;}',
    'function f() {const async = 1; return async;}',
    'function f() {function async() {} return async();}',
    'function f() {var async = async => async; return async();}',
    'function f() {function foo() { var await = 1; return await; }}',
    'function f() {function foo(await) { return await; }}',
    'function f() {function* foo() { var await = 1; return await; }}',
    'function f() {function* foo(await) { return await; }}',
    'function f() {var f = () => { var await = 1; return await; }}',
    "'use strict'; var O = { method() { var asyncFn = async function*() {}} }",
    "'use strict'; var f = () => {async function* f() {}}",
    "'use strict'; var f = () => {var O = { async *method() {} };}",
    'var hi = function arguments() { };',
    'function f(a, a) { function f(a, a) {} }',
    'function f(arg, ...arguments) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, arguments=[]) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(...arg) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); g(function() {arguments[0] = 42}); g(arg)}',
    'function f(arg, x=1) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg=1) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); arg = 42; g(arg)}',
    'function f(arg=1) {g(arg); arg = 42; g(arg)}',
    'function f(arg) {g(arg); g(() => arg = 42); g(arg)}',
    'function f(arg) {g(arg); h(arguments); g(arg)}',
    'function f(arg) {g(arg); g(() => arguments[0] = 42); g(arg)}',
    'function f() { ++(yield); }',
    'function f(a, a) {}',
    'function foo () {"use strict";}',
    'function f() {} function f() {}',
    'var f; function f() {}',
    'function f() {} var f;',
    'function* f() {} function* f() {}',
    'var f; function* f() {}',
    'function* f() {} var f;',
    'function hello(a) { z(); }',
    'function eval() { function inner() { "use strict" } }',
    'function hello(a, b) { z(); }',
    'function test() { "use strict"\n + 0; }',
    'function a() {} function a() {}',
    'function a() { function a() {} function a() {} }',
    'function arguments() { }',
    'function arguments() { function foo() { "use strict"; } }',
    'function arguments(eval) { function foo() { "use strict"; } }',
    'function arguments(eval) { function foo() { "use strict"; } function eval() {} }',
    'function arguments() { eval = arguments; function foo() { "use strict"; } }',
    'function arguments(eval) { eval = arguments; function foo() { "use strict"; } }',
    'function arguments(eval) { eval = arguments; function foo() { "use strict"; } "use strict"; }',
    'function arguments(eval) { function foo() { "use strict"; } eval = arguments;  }',
    outdent`
      function a() {
        return 'hello \
            world';
      }
    `,
    'function f([x]) {}',
    'function f([[,] = g()]) {}',
    'function f([[...x] = function() {}()]) {}',
    'function f([x = 23]) {}',
    'function f([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {}',
    'function f([...x]) {}',
    'function f([x = 23] = []) {}',
    'function f([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
    'function f([...[]] = function*() {}) {}',
    'function f({ x, } = { x: 23 }) {}',
    'function f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: { x: undefined, z: 7 } }) {}',
    'function f({ x, }) {}',
    'function f({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
    outdent`
      function
      x
      (
      )
      {
      }
      ;
    `,
    outdent`
      function                                                    y                                   (                                          )                                              {};
      y();
    `,
    outdent`
      function
      z
      (
      )
      {
      }
      ;
    `,
    'function __func__3(){1};',
    'function __func__4(){1+c};',
    'function __func__5(){inc(d)};',
    'function foo (a, b, c) { }',
    'function __gunc(){return true};',
    'function f(x = x) {}',
    'function f([x] = []) {}',
    'function f([{ x }] = [null]) {}',
    'function f({ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }) {}',
    'function test(t, t) { }',
    'function arguments() { }',
    'function a() { function a() {} function a() {} }',
    outdent`
      function j(...a) {}
      function k() {}
      var l = function () {};
      var m = function (a = 1, b, c) {};
      function* o() {
        yield 42;
      }
      function* p() {
        yield 42;
        yield 7;
        return "answer";
      }
      let q = function* () {};
      let r = a => a;
      let s = (a, b) => a + b;
      let t = (a, b = 0) => a + b;
      let u = (a, b) => {};
      let v = () => {};
      let w = () => ({});
      let x = () => {
        let a = 42;
        return a;
      };
      let y = () => ({
        a: 1,
        b: 2
      });
    `,
    'function ref(a,) {}',
    'function eval() { }',
    'function interface() { }',
    'function yield() { }',
    'function f(arg, x=1) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, ...x) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg=1) {g(arg); arguments[0] = 42; g(arg)}',
    "function f(arg) {'use strict'; g(arg); arguments[0] = 42; g(arg)}",
    'function f(arg) {g(arg); f.arguments[0] = 42; g(arg)}',
    'function f(arg, args=arguments) {g(arg); args[0] = 42; g(arg)}',
    'function f(arg) {g(arg); arg = 42; g(arg)}',
    "function f(arg) {g(arg); eval('arg = 42'); g(arg)}",
    'function f(arg) {g(arg); var arg = 42; g(arg)}',
    'function f(arg, x=1) {g(arg); arg = 42; g(arg)}',
    'function f(arg, ...x) {g(arg); arg = 42; g(arg)}',
    'function f(arg=1) {g(arg); arg = 42; g(arg)}',
    "function f(arg) {'use strict'; g(arg); arg = 42; g(arg)}",
    'function f(arg, {a=(g(arg), arg=42)}) {g(arg)}',
    'function f(arg) {g(arg); g(function() {arg = 42}); g(arg)}',
    'function f([foo,,bar] = x){}',
    'function f(x, [foo] = y){}',
    'function f(x = y, [foo] = z){}',
    'function f(x = y, [foo]){}',
    'function f([foo=a]){}',
    'function f([foo=a] = c){}',
    'function f([foo=a,bar]){}',
    'function f([foo=a,bar] = x){}',
    'function f([foo,bar=b]){}',
    'function f([foo,bar=b] = x){}',
    'function f([foo=a,bar=b]){}',
    'function f([foo=a,bar=b] = x){}',
    '(function({x, ...y}) { })',
    'function f() { class x { foo(x=await){} }   }',
    'function f() { class x { foo(await){} }   }',
    'function f() { class x extends foo(await) { }   }',
    'function f() { class x extends await { }   }',
    'function f() { class await { }   }',
    'function *f(){ class x { [yield y](){} }  }',
    'function *f(){ class x { [yield](){} }  }',
    'function *f(){ class x { yield(){} }  }',
    'function f() { throw `${delete(y)}`; }',
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }',
    String.raw`function foo(p\u0061ckage) { }`,
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

  pass('Declarations - Function (pass)', [
    { code: 'function w(casecase){y:j:function casecase(){}}', options: { webcompat: true, ranges: true } },
    'function* x() { for (const [j = yield] in (x) => {}) {} }',
    '"use strict"; function* g() { yield; }; f = ([...[,]] = g()) => {};',
    'function foo(package) {}',
    {
      code: outdent`
        function compareArray(a, b) {
            if (b.length !== a.length) {
                return;
            }
            for (var i = 0; i < a.length; i++) {
                b[0];
            }
        }
      `,
      options: { ranges: true, raw: true },
    },
    {
      code: outdent`
        function shouldThrow(func, errorMessage) {
            var errorThrown = false;
            var error = null;
            try {
                func();
            } catch (e) {
                errorThrown = true;
                error = e;
            }
        }
      `,
      options: { ranges: true, raw: true },
    },
    { code: 'function f([foo,,bar] = x){}', options: { loc: true } },
    { code: 'function f(){ foo: bar: function f(){} }', options: { webcompat: true } },
    { code: 'function f(){ let f; }', options: { loc: true } },
    'function f() {let f}',
    { code: 'function* a( [ {  x  =  y  }  =  a ] )  { }', options: { loc: true } },
    'function a( a = b  ) {} n => {  "use strict"; }',
    'function f() {var f}',
    { code: 'function a([ { a = x }, {} = b]) {}', options: { loc: true } },
    { code: 'function f(){} function f(){}', options: { loc: true } },
    { code: 'function g() {  function f(){} function f(){} }', options: { loc: true } },
    { code: 'function f(x) { { const x = y } }', options: { ranges: true } },
    { code: 'function f(){ foo = new.target }', options: { ranges: true } },
    { code: 'function f(x) {var x}', options: { ranges: true } },
    'function f(x) {{var x}}',
    'function foo() {}',
    'function f(){}\n/foo/',

    'function f(){}\n/foo/',
    'function f(){}\n/foo/g',

    'typeof function f(){}\n/foo/g',
  ]);
});
