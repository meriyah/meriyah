import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { parseSource } from '../../../src/parser';

describe('Expressions - Call', () => {
  for (const arg of [
    'async(a)(b)async',
    '(a)(( async () => {}) => {})',
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #1
    'async(async() () => {})(async() () => {})(y)(n)(c)', // crazy #2
    'async(async() () => {})(async() () => {})(async() () => {})(async() () => {})(async() () => {})', // crazy #3
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['(...[1, 2, 3])', '......[1,2,3]']) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `a()(a)`,
    `async()()`,
    `async(a)()`,
    `async()(b)`,
    `async(a)(b)`,
    '...([1, 2, 3])',
    "...'123', ...'456'",
    '...new Set([1, 2, 3]), 4',
    '1, ...[2, 3], 4',
    '...Array(...[1,2,3,4])',
    '...NaN',
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89'",
    "0, 1, ...[2, 3, 4], 5, 6, 7, ...'89', 10",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9",
    "...[0, 1, 2], 3, 4, 5, 6, ...'7', 8, 9, ...[10]",
  ]) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.None);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, undefined, Context.Module | Context.Strict);
      });
    });
  }

  for (const arg of [
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a().b',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    'foo(...[],);',
    '(function(obj) {}(1, 2, 3, ...[]));',
    'foo(x=1,y=x,x+y)',
    'foo(x,x=1);',
    'a.b( o.bar );',
    'a.b( o["bar"] );',
    'a.b( foo() );',
    'a.b.c( foo() );',
    'a.b( foo() );',
    'a.b( c() ).d;',
    'eval(...{}, "x = 0;");',
    'foo()(1, 2, 3, ...{})',
    'foo(...[],)',
    '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));',
    'a.b( c() ).d.e;',
    'f();',
    'g(a);',
    'h(a, b);',
    'i(a, b, ...c);',
    'j(...a);',
    'a.k();',
    '(a + b).l();',
    'a.m().n();',
    'new A();',
    'new A(a);',
    'new a.B();',
    'new a.b.C();',
    'new (a().B)();',
    'new new A()();',
    'new (A, B)();',
    'a.b( c() ).d.e((a)).f.g',
    'a.b( c() ).d.e((a = 123)).f.g',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({a: 1, b: 2, ...null}));',
    '(function(obj) {}({...{b: 2}, a: 3}));',
    "(function(obj) {}({...{a: 2, b: 3, c: 4, e: undefined, f: null, g: false}, a: 1, b: 7, d: 5, h: -0, i: Symbol('foo'), j: {a: 2, b: 3, c: 4, e: undefined, f: null, g: false}}));",
    '(function(obj) {}({...undefined}));',
    '(function(obj) {}(...target = [2, 3, 4]));',
    `a(String, 2).v(123).length;`,
    `a(b,c).abc(1).def`,
    `a(b,c).abc(1)`,
    `a(b,c).abc`,
    `a(b,c)`,
    `foo(bar, baz)`,
    'async (...a, ...b);',
    'async (...a, b);',
    `(    foo  )()`,
    `f(...a)`,
    `f(...a, ...b)`,
    `f(...a, ...b)`,
    'f();',
    'foo(...[1.1, 2.2, 3.3, 4.4, 5.5])',
    'foo(...[1])',
    'foo(...[1, 2, 3])',
    'foo(...new Set([1]))',
    'foo(...new Set([1, 2, 3, 4, 5, 6]))',
    'foo(..."")',
    'foo(...[])',
    'foo(...new Set)',
    'foo(...(function*() { })())',
    'foo(...[1, 2, 3], 4)',
    'foo(...new Set([1, 2, 3, 4]))',
    `foo(...(function*() {
      yield 1;
      yield 2;
      yield 3;
      yield 4;
    })())`,
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8)',
    'foo.bar(...[1, 2, 3, 4, 5, 6])',
    'foo.bar(...new Set([1, 2]))',
    'foo.bar(..."")',
    'foo(...(function*(){ yield 1; yield 2; yield 3; })())',
    'foo(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'O.nested, O.nested["returnThis"](..."test")',
    'foo.bar("tes", ..."t!!")',
    'foo.bar(0, ...[1], 2, 3, ...[4, 5], 6, 7, 8, ...[9])',
    'fn(...b(), d())',
    'fn(a(), ...b())',
    'fn(async(), ...b())',
    'fn(a(), ...b(), ...c(), d(), e())',
    'foo(1, ...[2], 3)',
    'foo(...[1])',
    'foo(0)',
    'foo(NaN)',
    'foo("")',
    'foo(false)',
    'foo({})',
    'foo([])',
    'foo(1, ...[2], 3)',
    'foo(...a);',
    '(async(...a, ...b))',
    '(async(a, ...b))',
    '(async(a, ...b = y))',
    '(async(...b = y, d))',
    '(async(...b = y, ...d))',
    `foo();
     foo("foo");
     foo("foo", "bar");
     foo(bar());
     foo(bar("test"));`,
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

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  fail('Expressions - Call (pass)', [
    ['a.b( c() ).d.e().().f.g.();', Context.None],
    ['a.b( c() ).d.e(()).f.g', Context.None],
    ['foo({a=1})', Context.None],
    ['foo({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['async({a=1})', Context.None],
    ['async({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({a=1})', Context.None],
    ['yield({a=1}. {b=2}, {c=3} = {}))', Context.None],
    ['yield({c=3} = {})', Context.Strict],
    ['yield({a})', Context.Strict],
    ['(async((a), ...(b) = xxx))', Context.None],
    ['(async((a), ...[b] = xxx))', Context.None],
    ['foo(,)', Context.None],
    //['(async(a, ...(b)))', Context.None],
    ['(async((a), ...(b)))', Context.None],
    ['foo(a,b,,)', Context.None],
    ['foo()["bar"', Context.None],
    ['foo().bar.', Context.None],
    ['foo()`bar', Context.None],
    ['foo(', Context.None],
    ['foo(...)', Context.None],
  ]);

  pass('Expressions - Call (pass)', [
    [
      ` obj
                          .foo
                              ["bar"]
                                  .baz()
                                      .foo
                                          ["bar"]()
                                              .baz()()`,
      Context.OptionsRanges,
    ],
    ['async(x,) => x', Context.None],
    ['async(x,)', Context.None],
    ['foo({c=3} = {})', Context.OptionsRanges],
    ['async({c=3} = {})', Context.OptionsRanges],
    ['"foo", async', Context.None],
    ['foo(async,)', Context.None],
    ['foo("abc", async)', Context.None],
    ['foo(1, async,)', Context.None],
    ['foo(async,await,)', Context.None],
    ['foo(async.await[foo])', Context.None],
    ['foo(async.abc = await)', Context.None],
    ['foo(123, async,await,)', Context.None],
    ['foo("string", async / 1 -2, await,)', Context.None],
    ['async({a})', Context.OptionsRanges],
    ['foo(x=1,y=x,x+y)', Context.OptionsRanges],
    ['foo(x,x=1);', Context.OptionsRanges],
    ['foo()(1, 2, 3, ...{})', Context.OptionsRanges],
    ['(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));', Context.OptionsRanges],
    ['a.b( c() ).d.e;', Context.OptionsRanges],
    ['i(a, b, ...c);', Context.OptionsRanges],
    ['(function(obj) {}({a: 1, b: 2, ...null}));', Context.OptionsRanges],
    ['a.replace(/ /g, "")', Context.OptionsRanges],
    ['async(a)=> {}', Context.None],
    ['call(await[1])', Context.OptionsRanges],
    ['foo(a)', Context.OptionsRanges],
    ['foo(a)(b)', Context.OptionsRanges],
    ['foo(a, b, c)', Context.OptionsRanges],
    ['foo(a)(b)', Context.None],
    ['async(a)(b)', Context.None],
    ['async(a)(s)(y)(n)(c)', Context.OptionsRanges],
    ['async().a', Context.None],
    ['async()()', Context.None],
    ['async(async(async(async(async(async())))))', Context.OptionsRanges],
    ['a.b( o.bar )', Context.OptionsRanges],
    ['a.b( o["bar"] )', Context.OptionsRanges],
    ['a.b( foo() )', Context.OptionsRanges],
    ['a.b( c() ).d', Context.OptionsRanges],
    ['a.b( c() ).d.e', Context.None],
    ['foo()(1, 2, 3)', Context.OptionsRanges],
    ['foo(x,y,)', Context.None],
    ['foo(200)', Context.None],
    ['foo(a)(b)', Context.None],
    ['foo(a)(b)(c)(d)(e)', Context.None],
  ]);
});
