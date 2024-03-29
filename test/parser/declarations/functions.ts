import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Declarations - Function', () => {
  for (const arg of ['package', 'public', 'instanceof']) {
    it(`function foo(${arg}) { 'use strict'; }`, () => {
      t.throws(() => {
        parseSource(`function foo(${arg}) { "use strict"; }`, undefined, Context.None);
      });
    });
    it(`function ${arg}() { 'use strict'; }`, () => {
      t.throws(() => {
        parseSource(`function ${arg}() { "use strict"; }`, undefined, Context.None);
      });
    });
    it(`(function ${arg}() { 'use strict'; })`, () => {
      t.throws(() => {
        parseSource(`(function ${arg}() { 'use strict'; })`, undefined, Context.None);
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
    'label: async function* f() { }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { 'use strict';${arg}})()`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { 'use strict'; {${arg}}})()`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { ;${arg}})()`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`(function() { ;${arg}})()`, undefined, Context.OptionsLexical);
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
    'label: label2: function f() { }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() {${arg}})()`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  fail('Declarations - Functions (fail)', [
    ['function a({x: {x: y}.length}){}', Context.None],
    ['function a({x: {}.length}){}', Context.None],
    ['function a({x: void x}){}', Context.None],
    ['function a({x: typeof x}){}', Context.None],
    ['function a({x: null}){}', Context.None],
    ['function a({x: false}){}', Context.None],
    ['function a({x: class{}}){}', Context.None],
    ['"use strict"; function eval() {}', Context.None],
    ['function eval() {"use strict";}', Context.None],
    ['function arguments() {"use strict";}', Context.None],
    ['function super() {"use strict";}', Context.None],
    ['function f(,,){}', Context.None],
    ['function f(x = package = 10) {}', Context.Strict],
    ['function f(x = let = 10) {}', Context.Strict],
    ['function f(x = yield = 10) {}', Context.Strict],
    ['function f(x = package = 10) { "use strict"; }', Context.None],
    ['function f(x= package =10){ "use strict"; }', Context.None],
    ['f = function f(x=package=10){ "use strict"; }', Context.None],
    ['f(x=package=10) => { "use strict"; }', Context.None],
    ['f(x = eval = 10) => { "use strict"; }', Context.None],
    ['o = {foo(x=package=y){ "use strict"; }}', Context.None],
    ['class c {foo(x=package=y){ "use strict"; }}', Context.None],
    ['o = {foo(x = package = y){ "use strict"; }}', Context.None],
    ['o = {foo(x = let = y){ "use strict"; }}', Context.None],
    ['o = {foo(x = implements = y){ "use strict"; }}', Context.None],
    ['o = {foo(x= eval = y){ "use strict"; }}', Context.None],
    ['function f(async function() {}) { }', Context.None],
    ['function foo(p\\u0061ckage) { "use strict"; }', Context.None],
    ['function foo(p\\u0061ckage) { }', Context.Strict],
    ['function await() {}', Context.Strict | Context.Module],
    ['function *await() {}', Context.Strict | Context.Module],
    ['function foo(package) { "use strict"; }', Context.None],
    ['function foo(p\\x61ckage) { }', Context.None],
    ['function foo(p\\x61ckage) { "use strict"; }', Context.None],
    ['function foo(p\\141ckage) { }', Context.None],
    ['function test({...x = 1}) {}', Context.None],
    ['function test({...[]}) {}', Context.None],
    ['function test({...x = 1}) {}', Context.None],
    ['function test({...{}}) {}', Context.None],
    ['function w(casecase){y:j:function casecase(){}}', Context.None],
    ['function test({...x = 1}) {}', Context.None],
    ['function foo() { "use strict"; 00004; }', Context.Strict],
    ['function foo() { 00004; }', Context.Strict],
    ['function 00004() { "use strict"; 00004; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function f([x=x()=x]){}', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function f() { class await { }   }', Context.Strict | Context.Module],
    ['function f() { class x extends await { }   }', Context.Strict | Context.Module],
    ['function f() { class x extends await y { }   }', Context.None],
    ['function f() { class x extends foo(await y) { }   }', Context.None],
    ['function f() { class x { foo(await y){} }   }', Context.None],
    ['function f() { class x { foo(x=await y){} }   }', Context.None],
    ['function *f(){ class x { foo(x=new (yield)()){} }  }', Context.None],
    ['function *f(){ class x { foo(x=yield y){} }  }', Context.None],
    ['function *f(){ class x { foo(x=yield){} }  }', Context.None],
    ['function *f(){ class x { foo(yield){} }  }', Context.None],
    ['function *f(){ class x extends yield y { }  }', Context.None],
    ['function *f(){ class x extends yield { }  }', Context.None],
    ['function *f(){ class yield { }  }', Context.None],
    ['function f(){ class x { [yield y](){} }  }', Context.None],
    ['function f(){ class x { [yield](){} }  }', Context.None],
    ['function f(){ class x { foo(x=new (yield)()){} }  }', Context.None],
    ['function f(){ class x { foo(x=yield y){} }  }', Context.None],
    ['function f(){ class x { foo(x=yield){} }  }', Context.None],
    ['function f(){ class x { foo(yield){} }  }', Context.None],
    ['function f(){ class x extends foo(yield y) { }  }', Context.None],
    ['function f(){ class x extends foo(yield) { }  }', Context.None],
    ['function f(){ class x extends yield y { }  }', Context.None],
    ['function f(){ class x extends yield { }  }', Context.None],
    ['function f(){ class yield { }  }', Context.None],
    ['function f(){ class yield { }  }', Context.None],
    ['function f(){ class x extends yield { }  }', Context.None],
    ['function f(){ class x extends yield y { }  }', Context.None],
    ['function f(){ class x extends foo(yield) { }  }', Context.None],
    ['function f(){ class x extends foo(yield y) { }  }', Context.None],
    ['function f(){ class x { foo(yield){} }  }', Context.None],
    ['function f(){ class x { foo(x=yield){} }  }', Context.None],
    ['function f(){ class x { foo(x=yield y){} }  }', Context.None],
    ['function f(){ class x { foo(x=new (yield)()){} }  }', Context.None],
    ['function f(){ class x { [yield](){} }  }', Context.None],
    ['function f(){ class x { [yield y](){} }  }', Context.None]
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
    `function bar() {foo = 42}; ext(bar); ext(foo)`,
    `function bar() { }`,
    `function a(b, c) { }`,
    `function makeArrayLength(x) { if(x < 1 || x > 4294967295 || x != x || isNaN(x) || !isFinite(x)) return 1; else return Math.floor(x); };`,
    `function foo () {"use strict";}`,
    `function __decl(){return 1;}`,
    `function __func__2(){b};`,
    `function x(...{ a }){}`,
    `function santa() { function package() {} function evdal() { "use strict"; }}`,
    `function foo(bar, eval) { function bar() { "use strict"; } }`,
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
    `function a() {
      return 'hello \
          world';
    }`,
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
    `function
    x
    (
    )
    {
    }
    ;`,
    `function                                                    y                                   (                                          )                                              {};
    y();
    `,
    `function
    z
    (
    )
    {
    }
    ;
    `,
    `function __func__3(){1};`,
    `function __func__4(){1+c};`,
    `function __func__5(){inc(d)};`,
    `function foo (a, b, c) { }`,
    `function __gunc(){return true};`,
    `function f(x = x) {}`,
    `function f([x] = []) {}`,
    `function f([{ x }] = [null]) {}`,
    `function f({ w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] }) {}`,
    `function test(t, t) { }`,
    `function arguments() { }`,
    `function a() { function a() {} function a() {} }`,
    `function j(...a) {}
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
    });`,
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
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }'
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

  pass('Declarations - Function (pass)', [
    [
      'function w(casecase){y:j:function casecase(){}}',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'Identifier',
                name: 'casecase',
                start: 11,
                end: 19,
                range: [11, 19]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'LabeledStatement',
                  label: {
                    type: 'Identifier',
                    name: 'y',
                    start: 21,
                    end: 22,
                    range: [21, 22]
                  },
                  body: {
                    type: 'LabeledStatement',
                    label: {
                      type: 'Identifier',
                      name: 'j',
                      start: 23,
                      end: 24,
                      range: [23, 24]
                    },
                    body: {
                      type: 'FunctionDeclaration',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                        start: 44,
                        end: 46,
                        range: [44, 46]
                      },
                      async: false,
                      generator: false,
                      id: {
                        type: 'Identifier',
                        name: 'casecase',
                        start: 34,
                        end: 42,
                        range: [34, 42]
                      },
                      start: 25,
                      end: 46,
                      range: [25, 46]
                    },
                    start: 23,
                    end: 46,
                    range: [23, 46]
                  },
                  start: 21,
                  end: 46,
                  range: [21, 46]
                }
              ],
              start: 20,
              end: 47,
              range: [20, 47]
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'w',
              start: 9,
              end: 10,
              range: [9, 10]
            },
            start: 0,
            end: 47,
            range: [0, 47]
          }
        ],
        start: 0,
        end: 47,
        range: [0, 47]
      }
    ],
    [
      'function* x() { for (const [j = yield] in (x) => {}) {} }',
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
                  type: 'ForInStatement',
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  left: {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: null,
                        id: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'j'
                              },
                              right: {
                                type: 'YieldExpression',
                                argument: null,
                                delegate: false
                              }
                            }
                          ]
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ArrowFunctionExpression',
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],

                    async: false,
                    expression: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      '"use strict"; function* g() { yield; }; f = ([...[,]] = g()) => {};',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            }
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'YieldExpression',
                    argument: null,
                    delegate: false
                  }
                }
              ]
            },
            async: false,
            generator: true,

            id: {
              type: 'Identifier',
              name: 'g'
            }
          },
          {
            type: 'EmptyStatement'
          },
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
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'ArrayPattern',
                            elements: [null]
                          }
                        }
                      ]
                    },
                    right: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'g'
                      },
                      arguments: []
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
      `function foo(package) {}`,
      Context.None,
      {
        body: [
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
            params: [
              {
                name: 'package',
                type: 'Identifier'
              }
            ],
            type: 'FunctionDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `function compareArray(a, b) {
        if (b.length !== a.length) {
            return;
        }
        for (var i = 0; i < a.length; i++) {
            b[0];
        }
    }`,
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 175,
        range: [0, 175],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 175,
            range: [0, 175],
            id: {
              type: 'Identifier',
              start: 9,
              end: 21,
              range: [9, 21],
              name: 'compareArray'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 22,
                end: 23,
                range: [22, 23],
                name: 'a'
              },
              {
                type: 'Identifier',
                start: 25,
                end: 26,
                range: [25, 26],
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 28,
              end: 175,
              range: [28, 175],
              body: [
                {
                  type: 'IfStatement',
                  start: 38,
                  end: 96,
                  range: [38, 96],
                  test: {
                    type: 'BinaryExpression',
                    start: 42,
                    end: 63,
                    range: [42, 63],
                    left: {
                      type: 'MemberExpression',
                      start: 42,
                      end: 50,
                      range: [42, 50],
                      object: {
                        type: 'Identifier',
                        start: 42,
                        end: 43,
                        range: [42, 43],
                        name: 'b'
                      },
                      property: {
                        type: 'Identifier',
                        start: 44,
                        end: 50,
                        range: [44, 50],
                        name: 'length'
                      },
                      computed: false
                    },
                    operator: '!==',
                    right: {
                      type: 'MemberExpression',
                      start: 55,
                      end: 63,
                      range: [55, 63],
                      object: {
                        type: 'Identifier',
                        start: 55,
                        end: 56,
                        range: [55, 56],
                        name: 'a'
                      },
                      property: {
                        type: 'Identifier',
                        start: 57,
                        end: 63,
                        range: [57, 63],
                        name: 'length'
                      },
                      computed: false
                    }
                  },
                  consequent: {
                    type: 'BlockStatement',
                    start: 65,
                    end: 96,
                    range: [65, 96],
                    body: [
                      {
                        type: 'ReturnStatement',
                        start: 79,
                        end: 86,
                        range: [79, 86],
                        argument: null
                      }
                    ]
                  },
                  alternate: null
                },
                {
                  type: 'ForStatement',
                  start: 105,
                  end: 169,
                  range: [105, 169],
                  init: {
                    type: 'VariableDeclaration',
                    start: 110,
                    end: 119,
                    range: [110, 119],
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        start: 114,
                        end: 119,
                        range: [114, 119],
                        id: {
                          type: 'Identifier',
                          start: 114,
                          end: 115,
                          range: [114, 115],
                          name: 'i'
                        },
                        init: {
                          type: 'Literal',
                          start: 118,
                          end: 119,
                          range: [118, 119],
                          value: 0,
                          raw: '0'
                        }
                      }
                    ],
                    kind: 'var'
                  },
                  test: {
                    type: 'BinaryExpression',
                    start: 121,
                    end: 133,
                    range: [121, 133],
                    left: {
                      type: 'Identifier',
                      start: 121,
                      end: 122,
                      range: [121, 122],
                      name: 'i'
                    },
                    operator: '<',
                    right: {
                      type: 'MemberExpression',
                      start: 125,
                      end: 133,
                      range: [125, 133],
                      object: {
                        type: 'Identifier',
                        start: 125,
                        end: 126,
                        range: [125, 126],
                        name: 'a'
                      },
                      property: {
                        type: 'Identifier',
                        start: 127,
                        end: 133,
                        range: [127, 133],
                        name: 'length'
                      },
                      computed: false
                    }
                  },
                  update: {
                    type: 'UpdateExpression',
                    start: 135,
                    end: 138,
                    range: [135, 138],
                    operator: '++',
                    prefix: false,
                    argument: {
                      type: 'Identifier',
                      start: 135,
                      end: 136,
                      range: [135, 136],
                      name: 'i'
                    }
                  },
                  body: {
                    type: 'BlockStatement',
                    start: 140,
                    end: 169,
                    range: [140, 169],
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 154,
                        end: 159,
                        range: [154, 159],
                        expression: {
                          type: 'MemberExpression',
                          start: 154,
                          end: 158,
                          range: [154, 158],
                          object: {
                            type: 'Identifier',
                            start: 154,
                            end: 155,
                            range: [154, 155],
                            name: 'b'
                          },
                          property: {
                            type: 'Literal',
                            start: 156,
                            end: 157,
                            range: [156, 157],
                            value: 0,
                            raw: '0'
                          },
                          computed: true
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
      `function shouldThrow(func, errorMessage) {
          var errorThrown = false;
          var error = null;
          try {
              func();
          } catch (e) {
              errorThrown = true;
              error = e;
          }
      }`,
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 246,
        range: [0, 246],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 246,
            range: [0, 246],
            id: {
              type: 'Identifier',
              start: 9,
              end: 20,
              range: [9, 20],
              name: 'shouldThrow'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 21,
                end: 25,
                range: [21, 25],
                name: 'func'
              },
              {
                type: 'Identifier',
                start: 27,
                end: 39,
                range: [27, 39],
                name: 'errorMessage'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 41,
              end: 246,
              range: [41, 246],
              body: [
                {
                  type: 'VariableDeclaration',
                  start: 53,
                  end: 77,
                  range: [53, 77],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 57,
                      end: 76,
                      range: [57, 76],
                      id: {
                        type: 'Identifier',
                        start: 57,
                        end: 68,
                        range: [57, 68],
                        name: 'errorThrown'
                      },
                      init: {
                        type: 'Literal',
                        start: 71,
                        end: 76,
                        range: [71, 76],
                        value: false,
                        raw: 'false'
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'VariableDeclaration',
                  start: 88,
                  end: 105,
                  range: [88, 105],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 92,
                      end: 104,
                      range: [92, 104],
                      id: {
                        type: 'Identifier',
                        start: 92,
                        end: 97,
                        range: [92, 97],
                        name: 'error'
                      },
                      init: {
                        type: 'Literal',
                        start: 100,
                        end: 104,
                        range: [100, 104],
                        value: null,
                        raw: 'null'
                      }
                    }
                  ],
                  kind: 'var'
                },
                {
                  type: 'TryStatement',
                  start: 116,
                  end: 238,
                  range: [116, 238],
                  block: {
                    type: 'BlockStatement',
                    start: 120,
                    end: 155,
                    range: [120, 155],
                    body: [
                      {
                        type: 'ExpressionStatement',
                        start: 136,
                        end: 143,
                        range: [136, 143],
                        expression: {
                          type: 'CallExpression',
                          start: 136,
                          end: 142,
                          range: [136, 142],
                          callee: {
                            type: 'Identifier',
                            start: 136,
                            end: 140,
                            range: [136, 140],
                            name: 'func'
                          },
                          arguments: []
                        }
                      }
                    ]
                  },
                  handler: {
                    type: 'CatchClause',
                    start: 156,
                    end: 238,
                    range: [156, 238],
                    param: {
                      type: 'Identifier',
                      start: 163,
                      end: 164,
                      range: [163, 164],
                      name: 'e'
                    },
                    body: {
                      type: 'BlockStatement',
                      start: 166,
                      end: 238,
                      range: [166, 238],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 182,
                          end: 201,
                          range: [182, 201],
                          expression: {
                            type: 'AssignmentExpression',
                            start: 182,
                            end: 200,
                            range: [182, 200],
                            operator: '=',
                            left: {
                              type: 'Identifier',
                              start: 182,
                              end: 193,
                              range: [182, 193],
                              name: 'errorThrown'
                            },
                            right: {
                              type: 'Literal',
                              start: 196,
                              end: 200,
                              range: [196, 200],
                              value: true,
                              raw: 'true'
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 216,
                          end: 226,
                          range: [216, 226],
                          expression: {
                            type: 'AssignmentExpression',
                            start: 216,
                            end: 225,
                            range: [216, 225],
                            operator: '=',
                            left: {
                              type: 'Identifier',
                              start: 216,
                              end: 221,
                              range: [216, 221],
                              name: 'error'
                            },
                            right: {
                              type: 'Identifier',
                              start: 224,
                              end: 225,
                              range: [224, 225],
                              name: 'e'
                            }
                          }
                        }
                      ]
                    }
                  },
                  finalizer: null
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f([foo,,bar] = x){}',
      Context.OptionsLoc,
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo',
                      loc: {
                        start: {
                          line: 1,
                          column: 12
                        },
                        end: {
                          line: 1,
                          column: 15
                        }
                      }
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'bar',
                      loc: {
                        start: {
                          line: 1,
                          column: 17
                        },
                        end: {
                          line: 1,
                          column: 20
                        }
                      }
                    }
                  ],
                  loc: {
                    start: {
                      line: 1,
                      column: 11
                    },
                    end: {
                      line: 1,
                      column: 21
                    }
                  }
                },
                right: {
                  type: 'Identifier',
                  name: 'x',
                  loc: {
                    start: {
                      line: 1,
                      column: 24
                    },
                    end: {
                      line: 1,
                      column: 25
                    }
                  }
                },
                loc: {
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 25
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [],
              loc: {
                start: {
                  line: 1,
                  column: 26
                },
                end: {
                  line: 1,
                  column: 28
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f',
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 28
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 28
          }
        }
      }
    ],
    [
      'function f(){ foo: bar: function f(){} }',
      Context.OptionsWebCompat,
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
                  type: 'LabeledStatement',
                  label: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  body: {
                    type: 'LabeledStatement',
                    label: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    body: {
                      type: 'FunctionDeclaration',
                      params: [],
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
      'function f(){ let f; }',
      Context.OptionsLoc,
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
                  type: 'VariableDeclaration',
                  kind: 'let',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: null,
                      id: {
                        type: 'Identifier',
                        name: 'f',
                        loc: {
                          start: {
                            line: 1,
                            column: 18
                          },
                          end: {
                            line: 1,
                            column: 19
                          }
                        }
                      },
                      loc: {
                        start: {
                          line: 1,
                          column: 18
                        },
                        end: {
                          line: 1,
                          column: 19
                        }
                      }
                    }
                  ],
                  loc: {
                    start: {
                      line: 1,
                      column: 14
                    },
                    end: {
                      line: 1,
                      column: 20
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 12
                },
                end: {
                  line: 1,
                  column: 22
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f',
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 22
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 22
          }
        }
      }
    ],
    [
      'function f() {let f}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      init: null
                    }
                  ],
                  kind: 'let'
                }
              ]
            },
            generator: false,

            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function* a( [ {  x  =  y  }  =  a ] )  { }',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          kind: 'init',
                          key: {
                            type: 'Identifier',
                            name: 'x',
                            loc: {
                              start: {
                                line: 1,
                                column: 18
                              },
                              end: {
                                line: 1,
                                column: 19
                              }
                            }
                          },
                          computed: false,
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'x',
                              loc: {
                                start: {
                                  line: 1,
                                  column: 18
                                },
                                end: {
                                  line: 1,
                                  column: 19
                                }
                              }
                            },
                            right: {
                              type: 'Identifier',
                              name: 'y',
                              loc: {
                                start: {
                                  line: 1,
                                  column: 24
                                },
                                end: {
                                  line: 1,
                                  column: 25
                                }
                              }
                            },
                            loc: {
                              start: {
                                line: 1,
                                column: 18
                              },
                              end: {
                                line: 1,
                                column: 25
                              }
                            }
                          },
                          method: false,
                          shorthand: true,
                          loc: {
                            start: {
                              line: 1,
                              column: 18
                            },
                            end: {
                              line: 1,
                              column: 25
                            }
                          }
                        }
                      ],
                      loc: {
                        start: {
                          line: 1,
                          column: 15
                        },
                        end: {
                          line: 1,
                          column: 28
                        }
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'a',
                      loc: {
                        start: {
                          line: 1,
                          column: 33
                        },
                        end: {
                          line: 1,
                          column: 34
                        }
                      }
                    },
                    loc: {
                      start: {
                        line: 1,
                        column: 15
                      },
                      end: {
                        line: 1,
                        column: 34
                      }
                    }
                  }
                ],
                loc: {
                  start: {
                    line: 1,
                    column: 13
                  },
                  end: {
                    line: 1,
                    column: 36
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [],
              loc: {
                start: {
                  line: 1,
                  column: 40
                },
                end: {
                  line: 1,
                  column: 43
                }
              }
            },
            async: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'a',
              loc: {
                start: {
                  line: 1,
                  column: 10
                },
                end: {
                  line: 1,
                  column: 11
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 43
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 43
          }
        }
      }
    ],
    [
      'function a( a = b  ) {} n => {  "use strict"; }',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },
            generator: false,
            id: {
              name: 'a',
              type: 'Identifier'
            },
            params: [
              {
                left: {
                  name: 'a',
                  type: 'Identifier'
                },
                right: {
                  name: 'b',
                  type: 'Identifier'
                },
                type: 'AssignmentPattern'
              }
            ],
            type: 'FunctionDeclaration'
          },
          {
            expression: {
              async: false,
              body: {
                body: [
                  {
                    expression: {
                      type: 'Literal',
                      value: 'use strict'
                    },
                    type: 'ExpressionStatement'
                  }
                ],
                type: 'BlockStatement'
              },
              expression: false,
              params: [
                {
                  name: 'n',
                  type: 'Identifier'
                }
              ],
              type: 'ArrowFunctionExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'function f() {var f}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: {
                        type: 'Identifier',
                        name: 'f'
                      },
                      init: null
                    }
                  ],
                  kind: 'var'
                }
              ]
            },
            generator: false,

            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function a([ { a = x }, {} = b]) {}',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a',
                          loc: {
                            start: {
                              line: 1,
                              column: 15
                            },
                            end: {
                              line: 1,
                              column: 16
                            }
                          }
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a',
                            loc: {
                              start: {
                                line: 1,
                                column: 15
                              },
                              end: {
                                line: 1,
                                column: 16
                              }
                            }
                          },
                          right: {
                            type: 'Identifier',
                            name: 'x',
                            loc: {
                              start: {
                                line: 1,
                                column: 19
                              },
                              end: {
                                line: 1,
                                column: 20
                              }
                            }
                          },
                          loc: {
                            start: {
                              line: 1,
                              column: 15
                            },
                            end: {
                              line: 1,
                              column: 20
                            }
                          }
                        },
                        method: false,
                        shorthand: true,
                        loc: {
                          start: {
                            line: 1,
                            column: 15
                          },
                          end: {
                            line: 1,
                            column: 20
                          }
                        }
                      }
                    ],
                    loc: {
                      start: {
                        line: 1,
                        column: 13
                      },
                      end: {
                        line: 1,
                        column: 22
                      }
                    }
                  },
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [],
                      loc: {
                        start: {
                          line: 1,
                          column: 24
                        },
                        end: {
                          line: 1,
                          column: 26
                        }
                      }
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b',
                      loc: {
                        start: {
                          line: 1,
                          column: 29
                        },
                        end: {
                          line: 1,
                          column: 30
                        }
                      }
                    },
                    loc: {
                      start: {
                        line: 1,
                        column: 24
                      },
                      end: {
                        line: 1,
                        column: 30
                      }
                    }
                  }
                ],
                loc: {
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 31
                  }
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [],
              loc: {
                start: {
                  line: 1,
                  column: 33
                },
                end: {
                  line: 1,
                  column: 35
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'a',
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 35
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 35
          }
        }
      }
    ],
    [
      'function f(){} function f(){}',
      Context.OptionsLoc,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [],
              loc: {
                start: {
                  line: 1,
                  column: 12
                },
                end: {
                  line: 1,
                  column: 14
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f',
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 14
              }
            }
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: [],
              loc: {
                start: {
                  line: 1,
                  column: 27
                },
                end: {
                  line: 1,
                  column: 29
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'f',
              loc: {
                start: {
                  line: 1,
                  column: 24
                },
                end: {
                  line: 1,
                  column: 25
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 15
              },
              end: {
                line: 1,
                column: 29
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 29
          }
        }
      }
    ],
    [
      'function g() {  function f(){} function f(){} }',
      Context.OptionsLoc,
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
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [],
                    loc: {
                      start: {
                        line: 1,
                        column: 28
                      },
                      end: {
                        line: 1,
                        column: 30
                      }
                    }
                  },
                  async: false,
                  generator: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                    loc: {
                      start: {
                        line: 1,
                        column: 25
                      },
                      end: {
                        line: 1,
                        column: 26
                      }
                    }
                  },
                  loc: {
                    start: {
                      line: 1,
                      column: 16
                    },
                    end: {
                      line: 1,
                      column: 30
                    }
                  }
                },
                {
                  type: 'FunctionDeclaration',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [],
                    loc: {
                      start: {
                        line: 1,
                        column: 43
                      },
                      end: {
                        line: 1,
                        column: 45
                      }
                    }
                  },
                  async: false,
                  generator: false,
                  id: {
                    type: 'Identifier',
                    name: 'f',
                    loc: {
                      start: {
                        line: 1,
                        column: 40
                      },
                      end: {
                        line: 1,
                        column: 41
                      }
                    }
                  },
                  loc: {
                    start: {
                      line: 1,
                      column: 31
                    },
                    end: {
                      line: 1,
                      column: 45
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 13
                },
                end: {
                  line: 1,
                  column: 47
                }
              }
            },
            async: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'g',
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 47
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 47
          }
        }
      }
    ],
    [
      'function f(x) { { const x = y } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 33,
        range: [0, 33],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 33,
            range: [0, 33],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
                name: 'x'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 14,
              end: 33,
              range: [14, 33],
              body: [
                {
                  type: 'BlockStatement',
                  start: 16,
                  end: 31,
                  range: [16, 31],
                  body: [
                    {
                      type: 'VariableDeclaration',
                      start: 18,
                      end: 29,
                      range: [18, 29],
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          start: 24,
                          end: 29,
                          range: [24, 29],
                          id: {
                            type: 'Identifier',
                            start: 24,
                            end: 25,
                            range: [24, 25],
                            name: 'x'
                          },
                          init: {
                            type: 'Identifier',
                            start: 28,
                            end: 29,
                            range: [28, 29],
                            name: 'y'
                          }
                        }
                      ],
                      kind: 'const'
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
      'function f(){ foo = new.target }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 32,
            range: [0, 32],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 12,
              end: 32,
              range: [12, 32],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 14,
                  end: 30,
                  range: [14, 30],
                  expression: {
                    type: 'AssignmentExpression',
                    start: 14,
                    end: 30,
                    range: [14, 30],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      name: 'foo'
                    },
                    right: {
                      type: 'MetaProperty',
                      start: 20,
                      end: 30,
                      range: [20, 30],
                      meta: {
                        type: 'Identifier',
                        start: 20,
                        end: 23,
                        range: [20, 23],
                        name: 'new'
                      },
                      property: {
                        type: 'Identifier',
                        start: 24,
                        end: 30,
                        range: [24, 30],
                        name: 'target'
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
      'function f(x) {var x}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 21,
            range: [0, 21],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'Identifier',
                start: 11,
                end: 12,
                range: [11, 12],
                name: 'x'
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 14,
              end: 21,
              range: [14, 21],
              body: [
                {
                  type: 'VariableDeclaration',
                  start: 15,
                  end: 20,
                  range: [15, 20],
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      start: 19,
                      end: 20,
                      range: [19, 20],
                      id: {
                        type: 'Identifier',
                        start: 19,
                        end: 20,
                        range: [19, 20],
                        name: 'x'
                      },
                      init: null
                    }
                  ],
                  kind: 'var'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(x) {{var x}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'f'
            },
            params: [
              {
                type: 'Identifier',
                name: 'x'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'VariableDeclaration',
                      declarations: [
                        {
                          type: 'VariableDeclarator',
                          id: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          init: null
                        }
                      ],
                      kind: 'var'
                    }
                  ]
                }
              ]
            },
            generator: false,

            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function foo() {}',
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
      'function f(){}\n/foo/',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },

            generator: false,
            id: {
              name: 'f',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          },
          {
            expression: {
              regex: {
                flags: '',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],

    [
      'function f(){}\n/foo/',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },
            generator: false,

            id: {
              name: 'f',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          },
          {
            expression: {
              regex: {
                flags: '',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'function f(){}\n/foo/g',
      Context.None,
      {
        body: [
          {
            async: false,
            body: {
              body: [],
              type: 'BlockStatement'
            },
            generator: false,

            id: {
              name: 'f',
              type: 'Identifier'
            },
            params: [],
            type: 'FunctionDeclaration'
          },
          {
            expression: {
              regex: {
                flags: 'g',
                pattern: 'foo'
              },
              type: 'Literal',
              value: /foo/g
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],

    [
      'typeof function f(){}\n/foo/g',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  argument: {
                    async: false,
                    body: {
                      body: [],
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
                  operator: 'typeof',
                  prefix: true,
                  type: 'UnaryExpression'
                },
                operator: '/',
                right: {
                  name: 'foo',
                  type: 'Identifier'
                },
                type: 'BinaryExpression'
              },
              operator: '/',
              right: {
                name: 'g',
                type: 'Identifier'
              },
              type: 'BinaryExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ]
  ]);
});
