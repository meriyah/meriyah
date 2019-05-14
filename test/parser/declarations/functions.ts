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
        parseSource(`(function() {${arg}})()`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() { {${arg}}})()`, undefined, Context.OptionsWebCompat);
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
    ['function test({...x = 1}) {}', Context.None],
    ['function foo() { "use strict"; 00004; }', Context.Strict],
    ['function foo() { 00004; }', Context.Strict],
    ['function 00004() { "use strict"; 00004; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],

    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None],
    ['function foo(001, 003) { "use strict"; }', Context.None]
  ]);

  for (const arg of [
    'if (true) function foo() {}',
    'if (false) {} else function f() { };',
    'function f() { ++(yield); }',
    'function f(arg) {function h() { g(arg) }; return h}',
    'function f(arg, ...arguments) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg, arguments=[]) {g(arg); arguments[0] = 42; g(arg)}',
    'function f(arg) {g(arg); arg = 42; g(arg)}',
    'function f(arg=1) {g(arg); arg = 42; g(arg)}',
    "function f(arg) {g(arg); g(function() {eval('arg = 42')}); g(arg)}",
    "function f(arg) {g(arg); g(() => eval('arg = 42')); g(arg)}",
    'function f(arg) {g(arg); arguments[0] = 42; g(arg)}',
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
    `if (0) function a(){}`,
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
    'async function* a() { for (let m in ((yield))) x;  (r = a) => {} }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  pass('Declarations - Function (pass)', [
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
            expression: false,
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
                id: null,
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
            expression: false,
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
                name: 'a'
              },
              {
                type: 'Identifier',
                name: 'b'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'IfStatement',
                  test: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    right: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    operator: '!=='
                  },
                  consequent: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: null
                      }
                    ]
                  },
                  alternate: null
                },
                {
                  type: 'ForStatement',
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          computed: true,
                          property: {
                            type: 'Literal',
                            value: 0
                          }
                        }
                      }
                    ]
                  },
                  init: {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Literal',
                          value: 0
                        },
                        id: {
                          type: 'Identifier',
                          name: 'i'
                        }
                      }
                    ]
                  },
                  test: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'i'
                    },
                    right: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    operator: '<'
                  },
                  update: {
                    type: 'UpdateExpression',
                    argument: {
                      type: 'Identifier',
                      name: 'i'
                    },
                    operator: '++',
                    prefix: false
                  }
                }
              ]
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'compareArray'
            }
          }
        ]
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
                name: 'func'
              },
              {
                type: 'Identifier',
                name: 'errorMessage'
              }
            ],
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: false
                      },
                      id: {
                        type: 'Identifier',
                        name: 'errorThrown'
                      }
                    }
                  ]
                },
                {
                  type: 'VariableDeclaration',
                  kind: 'var',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      init: {
                        type: 'Literal',
                        value: null
                      },
                      id: {
                        type: 'Identifier',
                        name: 'error'
                      }
                    }
                  ]
                },
                {
                  type: 'TryStatement',
                  block: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'func'
                          },
                          arguments: []
                        }
                      }
                    ]
                  },
                  handler: {
                    type: 'CatchClause',
                    param: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'errorThrown'
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: true
                            }
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'Identifier',
                              name: 'error'
                            },
                            operator: '=',
                            right: {
                              type: 'Identifier',
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
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'shouldThrow'
            }
          }
        ]
      }
    ],
    [
      'function f([foo,,bar] = x){}',
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
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
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
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
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
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
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
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){} function f(){}',
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
              body: []
            },
            generator: false,
            expression: false,
            async: false
          },
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'f'
            },
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            generator: false,
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function g() {  function f(){} function f(){} }',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'FunctionDeclaration',
            id: {
              type: 'Identifier',
              name: 'g'
            },
            params: [],
            body: {
              type: 'BlockStatement',
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
                    body: []
                  },
                  generator: false,
                  expression: false,
                  async: false
                },
                {
                  type: 'FunctionDeclaration',
                  id: {
                    type: 'Identifier',
                    name: 'f'
                  },
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  generator: false,
                  expression: false,
                  async: false
                }
              ]
            },
            generator: false,
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(x) { { const x = y } }',
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
                          init: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        }
                      ],
                      kind: 'const'
                    }
                  ]
                }
              ]
            },
            generator: false,
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(){ foo = new.target }',
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
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    right: {
                      type: 'MetaProperty',
                      meta: {
                        type: 'Identifier',
                        name: 'new'
                      },
                      property: {
                        type: 'Identifier',
                        name: 'target'
                      }
                    }
                  }
                }
              ]
            },
            generator: false,
            expression: false,
            async: false
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f(x) {var x}',
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
            },
            generator: false,
            expression: false,
            async: false
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
            expression: false,
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
                    expression: false,
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
