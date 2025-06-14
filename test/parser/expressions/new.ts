import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Expressions - New', () => {
  for (const arg of [
    'new x(1);',
    'new x;',
    'new new x;',
    'new new x.y;',
    'new (function(foo){this.foo=foo;})(1);',
    'new (function(foo){this.foo=foo;})();',
    'new (function test(foo){this.foo=foo;})(1);',
    'new (function test(foo){this.foo=foo;})();',
    'new true;',
    'new (0);',
    'new (!0);',
    'new (bar = function(foo) {this.foo=foo;})(123);',
    'new (bar = function(foo) {this.foo=foo;})();',
    'new x(1);',
    'new x();',
    'new x();',
    'new x()()()()()()();',
    'new (x()()()()()()());',
    'new new x()();',
    'new function(foo) {\n    this.foo = foo;\n}(1);',
    'new function(foo) {\n    this.foo = foo;\n}();',
    'new function test(foo) {\n    this.foo = foo;\n}(1);',
    'new function test(foo) {\n    this.foo = foo;\n}();',
    'new true();',
    'new async()()',
    'new a()().b.c[d];',
    'new async()().b.c[d];',
    'new (a()().b.c[d]);',
    'new (b());',
    'new (async(await));',
    'new async / b',
    'new async / await',
    'new async / await()',
    'new async / await(async = foo)',
    'new async / await(async,)',
    'new async / await(foo, async)',
    'new async / await("foo", async)',
    'new async / await(123, async)',
    'new async / await(foo, async)',
    'new 0();',
    'new (!0)();',
    'new (bar = function(foo) {\n    this.foo = foo;\n})(123);',
    'new (bar = function(foo) {\n    this.foo = foo;\n})();',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }
  fail('Expressions - New (fail)', [
    ['function f(){ new.foo }', Context.None],
    ['new.target', Context.None],
    ['_ => new.target', Context.None],
    ['function f(){ ++new.target }', Context.None],
    ['function f(){ new.target-- }', Context.None],
    ['(f=new.target) => {}', Context.None],
    ['new x() = y', Context.None],
    ['new a.b.c.(d).e.f.g[(b)]();', Context.None],
    ['new a.async.c.(d).e.f.g[(async)]();', Context.None],
    ['new async = async.await', Context.None],
    ['++new x()', Context.None],
    ['new x()++', Context.None],
    ['new new .target', Context.None],
    ['new typeof x', Context.None],
    ['new typeof x.y', Context.None],
    ['new typeof x().y', Context.None],
    ['new ++x', Context.None],
    ['new ++x.y', Context.None],
    ['new ++x().y', Context.None],
    ['new ()=>{}', Context.None],
    ['new x=>{}', Context.None],
    ['new (x)=>{}', Context.None],
    ['new a = b', Context.None],
    ['function *f(){ new yield }', Context.None],
    ['"use strict"; new yield()', Context.None],
    ['function *f(){ new yield }', Context.None],
    ['function *f(){ new yield x }', Context.None],
    ['function *f(){ new yield x(); }', Context.None],
    ['new x++', Context.None],
    ['new x.y++', Context.None],
    [
      `function f() {
      new.target++;
      new.target = b;
      for (new.target in b);
      for (new.target of b);
    }`,
      Context.None,
    ],
    ['new async x => x', Context.None],
    ['new async => x', Context.None],
    ['let x = typeof async (x) => x', Context.None],
    ['let x = [typeof async \n (x) => x]', Context.None],
    ['let x = [typeof async (x) \n => x]', Context.None],
    ['let x = [delete async \n (x) => x]', Context.None],
    ['let x = [delete async (x) \n => x]', Context.None],
    ['new x\n/y/', Context.None],
    ['let x = new async \n (x) => x', Context.None],
    ['let x = new async (x) \n => x', Context.None],
    ['typeof async () => x', Context.None],
    ['typeof async \n () => x', Context.None],
    ['typeof async () \n => x', Context.None],
    ['let x = typeof async \n (x) => x', Context.None],
    ['let x = typeof async (x) \n => x', Context.None],
    ['delete async () => x', Context.None],
    ['delete async \n () => x', Context.None],
    ['delete async () \n => x', Context.None],
    ['new ++x.y', Context.None],
    ['let x = delete async \n (x) => x', Context.None],
    ['let x = delete async (x) \n => x', Context.None],
    ['async () => new await x', Context.None],
    ['async () => new await x()', Context.None],
    ['async () => new await x()()', Context.None],
    ['async function f(){ new await foo }', Context.None],
    ['new class', Context.None],
    ['new class extends{}', Context.None],
    ['new delete', Context.None],
    ['new function', Context.None],
    ['new function()', Context.None],
    ['new new', Context.None],
    ['new super', Context.None],
    ['class x { constructor() { new super }}', Context.None],
    ['class x extends y { constructor() { new super }}', Context.None],
    ['new typeof', Context.None],
    ['new typeof x', Context.None],
    ['new typeof x()', Context.None],
    ['new void', Context.None],
    ['new void x', Context.None],
    ['delete () => foo', Context.None],
    ['delete async() => foo', Context.None],
    ['function f(){ new.foo }', Context.None],
    ['new.target', Context.None],
    ['_ => _ => _ => _ => new.target', Context.None],
    ['function f(){ ++new.target }', Context.None],
    ['function f(){ new.target-- }', Context.None],
    ['new x(await foo);', Context.None],
    ['new (await foo);', Context.None],
    ['new await foo;', Context.None],
    ['new x(await foo);', Context.None],
    ['new x(await foo);', Context.None],
    ['new x(await foo);', Context.None],
    ['new.target[await x]', Context.None],
    ['new await x()()', Context.None],
    ['new await x()', Context.None],
    ['new await x', Context.None],
  ]);

  pass('Expressions - New (pass)', [
    ['new await()()', Context.None],
    ['new foo()();', Context.None],
    ['new (foo)();', Context.None],
    ['new (foo);', Context.None],
    ['new a ? b : c', Context.None],
    ['new Foo', Context.None],
    ['new Foo.Bar', Context.None],
    ['new a.b.c.d', Context.None],
    ['new async(x)(y)', Context.None],
    ['new Foo["bar"]', Context.None],
    ['new Foo()', Context.None],
    ['new Foo.Bar()', Context.None],
    ['new Foo["bar"]()', Context.None],
    ['new Foo(X)', Context.None],
    ['new Foo.Bar(X)', Context.None],
    ['new Foo["bar"](X)', Context.None],
    ['new Foo(X, Y, Z)', Context.None],
    ['new Foo.Bar(X, Y, Z)', Context.None],
    ['new Foo["bar"](X, Y, Z)', Context.None],
    ['new x().y', Context.None],
    ['new x()[y]', Context.None],
    ['new x()();', Context.None],
    //['new x()`y`', Context.None,  {}],
    ['new a.b.c.d()', Context.None],
    ['new Foo["bar"]()', Context.None],
    ['new Foo(X)', Context.None],
    ['new Foo.Bar(X)', Context.None],
    ['new Foo["bar"](X)', Context.None],
    ['new Foo(X, Y, Z)', Context.None],
    ['new Foo.Bar(X, Y, Z)', Context.None],
    ['new Foo["bar"](X, Y, Z)', Context.None],
    ['new x().y', Context.None],
    ['new x()[y]', Context.None],
    ['new x()();', Context.None],
    ['new x().y = z', Context.None],
    ['new x().y + z', Context.None],
    ['new x()[y] = z', Context.None],
    ['new x()[y] + z', Context.None],
    ['++new x().y', Context.None],

    ['new x().y++', Context.None],
    ['delete new x()', Context.None],
    ['delete new x().y', Context.None],
    ['typeof new x()', Context.None],
    ['new new A().foo', Context.None],
    ['new new A.foo()', Context.None],
    ['new "foo".__proto__.constructor', Context.None],
    ['new 1..__proto__.constructor', Context.None],
    ['new 0x2.__proto__.constructor', Context.None],
    ['new true.__proto__.constructor', Context.None],
    ['typeof new x().y', Context.None],
    ['new new x', Context.None],

    ['[...new A()]', Context.None],
    ['class x extends new A() {}', Context.None],
    ['x({[new A()]:y})', Context.None],
    ['f(new /z/())', Context.None],
    ['f(new /z/)', Context.None],
    ['f(new /z/.foo)', Context.None],
    ['new arguments', Context.None],
    ['new async', Context.None],
    ['new async (x, y)', Context.None],
    ['new async (...x)', Context.None],
    ['new async function(){}', Context.None],
    ['typeof async', Context.None],
    ['typeof async ()', Context.None],
    ['typeof async function(){}', Context.None],
    ['new await', Context.None],
    ['new class{}', Context.None],
    ['new class extends x{}', Context.None],
    ['class x extends (x) {}', Context.None],
    ['new eval()', Context.None],
    ['new false.__proto__.constructor', Context.None],
    ['new function(){}', Context.None],
    ['new function(){}(x)', Context.None],
    ['class x extends y { constructor() { new super.foo }}', Context.None],
    ['class x extends y { constructor() { new super() }}', Context.None],
    ['new this', Context.None],
    ['new let', Context.None],
  ]);
});
