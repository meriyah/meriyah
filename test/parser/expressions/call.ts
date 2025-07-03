import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of ['(...[1, 2, 3])', '......[1,2,3]']) {
    it(`function fn() { 'use strict';} fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { 'use strict';} fn(${arg});`);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.throws(() => {
        parseSource(`function fn() { } fn(${arg});`);
      });
    });
  }

  for (const arg of [
    'a()(a)',
    'async()()',
    'async(a)()',
    'async()(b)',
    'async(a)(b)',
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
        parseSource(`function fn() { 'use strict';} fn(${arg});`);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`);
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, { webcompat: true });
      });
    });

    it(`function fn() { } fn(${arg});`, () => {
      t.doesNotThrow(() => {
        parseSource(`function fn() { } fn(${arg});`, { sourceType: 'module' });
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
    'a(String, 2).v(123).length;',
    'a(b,c).abc(1).def',
    'a(b,c).abc(1)',
    'a(b,c).abc',
    'a(b,c)',
    'foo(bar, baz)',
    'async (...a, ...b);',
    'async (...a, b);',
    '(    foo  )()',
    'f(...a)',
    'f(...a, ...b)',
    'f(...a, ...b)',
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
    outdent`
      foo(...(function*() {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
      })())
    `,
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
    outdent`
      foo();
      foo("foo");
      foo("foo", "bar");
      foo(bar());
      foo(bar("test"));
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

    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, { sourceType: 'module' });
      });
    });
  }

  fail('Expressions - Call (pass)', [
    'a.b( c() ).d.e().().f.g.();',
    'a.b( c() ).d.e(()).f.g',
    'foo({a=1})',
    'foo({a=1}. {b=2}, {c=3} = {}))',
    'async({a=1})',
    'async({a=1}. {b=2}, {c=3} = {}))',
    'yield({a=1})',
    'yield({a=1}. {b=2}, {c=3} = {}))',
    { code: 'yield({c=3} = {})', options: { impliedStrict: true } },
    { code: 'yield({a})', options: { impliedStrict: true } },
    '(async((a), ...(b) = xxx))',
    '(async((a), ...[b] = xxx))',
    'foo(,)',
    //['(async(a, ...(b)))', Context.None],
    '(async((a), ...(b)))',
    'foo(a,b,,)',
    'foo()["bar"',
    'foo().bar.',
    'foo()`bar',
    'foo(',
    'foo(...)',
  ]);

  pass('Expressions - Call (pass)', [
    {
      code: outdent`
        obj
          .foo
              ["bar"]
                  .baz()
                      .foo
                          ["bar"]()
                              .baz()()
      `,
      options: { ranges: true },
    },
    'async(x,) => x',
    'async(x,)',
    { code: 'foo({c=3} = {})', options: { ranges: true } },
    { code: 'async({c=3} = {})', options: { ranges: true } },
    '"foo", async',
    'foo(async,)',
    'foo("abc", async)',
    'foo(1, async,)',
    'foo(async,await,)',
    'foo(async.await[foo])',
    'foo(async.abc = await)',
    'foo(123, async,await,)',
    'foo("string", async / 1 -2, await,)',
    { code: 'async({a})', options: { ranges: true } },
    { code: 'foo(x=1,y=x,x+y)', options: { ranges: true } },
    { code: 'foo(x,x=1);', options: { ranges: true } },
    { code: 'foo()(1, 2, 3, ...{})', options: { ranges: true } },
    { code: '(function(obj) {}({a: 1, b: 2, ...{c: 3, d: 4}}));', options: { ranges: true } },
    { code: 'a.b( c() ).d.e;', options: { ranges: true } },
    { code: 'i(a, b, ...c);', options: { ranges: true } },
    { code: '(function(obj) {}({a: 1, b: 2, ...null}));', options: { ranges: true } },
    { code: 'a.replace(/ /g, "")', options: { ranges: true } },
    'async(a)=> {}',
    { code: 'call(await[1])', options: { ranges: true } },
    { code: 'foo(a)', options: { ranges: true } },
    { code: 'foo(a)(b)', options: { ranges: true } },
    { code: 'foo(a, b, c)', options: { ranges: true } },
    'foo(a)(b)',
    'async(a)(b)',
    { code: 'async(a)(s)(y)(n)(c)', options: { ranges: true } },
    'async().a',
    'async()()',
    { code: 'async(async(async(async(async(async())))))', options: { ranges: true } },
    { code: 'a.b( o.bar )', options: { ranges: true } },
    { code: 'a.b( o["bar"] )', options: { ranges: true } },
    { code: 'a.b( foo() )', options: { ranges: true } },
    { code: 'a.b( c() ).d', options: { ranges: true } },
    'a.b( c() ).d.e',
    { code: 'foo()(1, 2, 3)', options: { ranges: true } },
    'foo(x,y,)',
    'foo(200)',
    'foo(a)(b)',
    'foo(a)(b)(c)(d)(e)',
  ]);
});
