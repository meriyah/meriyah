import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Expressions - Super', () => {
  for (const arg of ['new super;', 'new super();', '() => new super;', '() => new super();']) {
    it(`class C { method() { ${arg} } }`, () => {
      t.throws(() => {
        parseSource(`class C { method() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { *method() { ${arg} } }`, () => {
      t.throws(() => {
        parseSource(`class C { *method() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { get x() { ${arg} } }`, () => {
      t.throws(() => {
        parseSource(`class C { get x() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { get x() { ${arg} } }`, () => {
      t.throws(() => {
        parseSource(`class C { get x() { ${arg} } }`, undefined, Context.OptionsLexical);
      });
    });

    it(`class C { set x(_) { ${arg} } }`, () => {
      t.throws(() => {
        parseSource(`class C { set x(_) { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`({ method() { ${arg} } })`, () => {
      t.throws(() => {
        parseSource(`({ method() { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`(function() { ${arg} } )`, () => {
      t.throws(() => {
        parseSource(`(function() { ${arg} } )`, undefined, Context.None);
      });
    });

    it(`var f = function() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`var f = function() { ${arg} }`, undefined, Context.None);
      });
    });

    it(`({ f: function*() {${arg} } })`, () => {
      t.throws(() => {
        parseSource(`({ f: function*() { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`(function*() { ${arg} })`, () => {
      t.throws(() => {
        parseSource(`(function*() { ${arg} })`, undefined, Context.None);
      });
    });

    it(`var f = function*() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`var f = function*() { ${arg} }`, undefined, Context.None);
      });
    });
  }

  // Testing valid use of super property
  for (const arg of ['new super.x;', 'new super.x();', '() => new super.x;', '() => new super.x();']) {
    it(`class C { constructor() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { constructor() {${arg}}}`, undefined, Context.None);
      });
    });

    it(`class C { *method() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { *method() {${arg}}}`, undefined, Context.None);
      });
    });

    it(`({ method() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ method() {${arg}}})`, undefined, Context.None);
      });
    });

    it(`({ *method() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ *method() {${arg}}})`, undefined, Context.None);
      });
    });

    it(`({ get x() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ get x() {${arg}}})`, undefined, Context.None);
      });
    });

    it(`({ set x(_) {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ set x(_) {${arg}}})`, undefined, Context.None);
      });
    });

    it(`class C { set x(_) {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { set x(_) {${arg}}}`, undefined, Context.None);
      });
    });

    it(`class C { get x() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { get x() {${arg}}}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'super',
    'super = x',
    'y = super',
    'foo(super)',
    'super.x',
    'super[27]',
    'super.x()',
    'super[27]()',
    'super()',
    'new super.x',
    'new super.x()',
    'new super[27]',
    'new super[27]()',
    '() => new super.x;',
    '() => new super.x();',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`parseSource = ${arg}`, () => {
      t.throws(() => {
        parseSource(`parseSource = ${arg}`, undefined, Context.None);
      });
    });

    it(`foo(${arg})`, () => {
      t.throws(() => {
        parseSource(`foo(${arg})`, undefined, Context.None);
      });
    });

    it(`if (${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`if (${arg}) {}`, undefined, Context.None);
      });
    });

    it(`if (false) {} else {${arg}}`, () => {
      t.throws(() => {
        parseSource(`if (false) {} else {${arg}}`, undefined, Context.None);
      });
    });

    it(`class C { m() { function f() {${arg}} } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { function f() {${arg}} } }`, undefined, Context.None);
      });
    });

    it(`({ m() { function f() {${arg}} } })`, () => {
      t.throws(() => {
        parseSource(`({ m() { function f() {${arg}} } })`, undefined, Context.None);
      });
    });

    it(`while (true) {${arg}}`, () => {
      t.throws(() => {
        parseSource(`while (true) {${arg}}`, undefined, Context.None);
      });
    });

    it(`class C extends (${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`class C extends (${arg}) {}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'class C { constructor() { super(); } }',
    'class C { method() { super(); } }',
    'class C { method() { () => super(); } }',
    'class C { *method() { super(); } }',
    'class C { get x() { super(); } }',
    'class C { set x(_) { super(); } }',
    '({ method() { super(); } })',
    '({ *method() { super(); } })',
    '({ get x() { super(); } })',
    '({ set x(_) { super(); } })',
    '({ f: function() { super(); } })',
    '(function() { super(); })',
    'var f = function() { super(); }',
    '({ f: function*() { super(); } })',
    '(function*() { super(); })',
    'var f = function*() { super(); }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'class a extends b { c() { [super.d] = e } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => super.foo) { return y(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => {return super.foo}) { return y(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { x(y = () => {return () => super.foo}) { return y()(); } }',
    'class C { constructor() { this._x = 45; } get foo() { return this._x;} } class D extends C { constructor(x = () => super.foo) { super(); this._x_f = x; } x() { return this._x_f(); } }',
    'class a extends b { constructor(){   class x extends y { [super()](){} }    }}',
    'class a extends b { constructor(){      class x extends super() {}    }}',
    'class a extends b { constructor(){   class x { [super()](){} }    }}',
    'class a extends b { foo(){      class x extends super.foo {}    }}',
    'class a { foo(){      class x extends super.foo {}    }}',
    'class a extends b { foo(){   class x extends y { [super.foo](){} }    }}',
    'class a extends b { foo(){   class x { [super.foo](){} }    }}',
    'class a { foo(){   class x extends y { [super.foo](){} }    }}',
    'class f extends bar { constructor(){  class x { [super()](){} }  }}',
    'class f extends bar { constructor(){  class x extends feh(super()) { }  }}',
    'class f extends bar { constructor(){  class x extends super() { }  }}',
    'class f extends bar { xxx(){  class x { [super.foo](){} }  }}',
    'class f extends bar { xxx(){  class x { foo(x=new (super.foo)()){} }  }}',
    'class f extends bar { xxx(){  class x { foo(x=super.foo){} }  }}',
    'class f extends bar { xxx(){  class x extends feh(super.foo) { }  }}',
    'class f extends bar { xxx(){  class x extends super.foo { }  }}',
    'class f extends bar { constructor(){  class x { [super.foo](){} }  }}',
    'class f extends bar { constructor(){  class x { foo(x=new (super.foo)()){} }  }}',
    'class f extends bar { constructor(){  class x { foo(x=super.foo){} }  }}',
    'class f extends bar { constructor(){  class x extends feh(super.foo) { }  }}',
    'class f extends bar { constructor(){  class x extends super.foo { }  }}',
    'class f { bar(){  class x { [super.foo](){} }  }}',
    'class f { bar(){  class x { foo(x=new (super.foo)()){} }  }}',
    'class f { bar(){  class x { foo(x=super.foo){} }  }}',
    'class f { bar(){  class x extends feh(super.foo) { }  }}',
    'class f { bar(){  class x extends super.foo { }  }}',
    'class f { constructor(){  class x { [super.foo](){} }  }}',
    'class f { constructor(){  class x { foo(x=new (super.foo)()){} }  }}',
    'class f { constructor(){  class x { foo(x=super.foo){} }  }}',
    'class f { constructor(){  class x extends feh(super.foo) { }  }}',
    'class f { constructor(){  class x extends super.foo { }  }}',
    'class x { foo(x=new (super.foo)()){} }',
    'class x { foo(x=super.foo){} }',
    'class f extends bar { xxx(){  class x { super(){} }  }}',
    'class f extends bar { constructor(){  class x { super(){} }  }}',
    'class f { bar(){  class x { super(){} }  }}',
    'class f { constructor(){  class x { super(){} }  }}',
    'class a { foo(){   class x { [super.foo](){} }    }}',
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
    'super',
    'super = x',
    'y = super',
    'f(super)',
    'new super',
    'new super()',
    'new super(12, 45)',
    'new new super',
    'new new super()',
    'new new super()()',
  ]) {
    it(`class C { m() { ${arg}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { ${arg}; } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { k = ${arg}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { k = ${arg}; } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { foo(${arg}); } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { foo(${arg}); } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { () => ${arg}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { () => ${arg}; } }`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['new super.x;', 'new super.x();', '() => new super.x;', '() => new super.x();']) {
    it(`class C { constructor() { ${arg} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { constructor() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { *method() { ${arg} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { *method() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { get x() { ${arg} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { get x() { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`class C { set x(_) { ${arg} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { set x(_) { ${arg} } }`, undefined, Context.None);
      });
    });

    it(`({ method() { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ method() { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`({ *method() { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ *method() { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`(class C { get x() { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { get x() { ${arg} } })`, undefined, Context.None);
      });
    });

    it(`(class C { set x(_) { ${arg} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { set x(_) { ${arg} } })`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'super.x',
    'super[27]',
    'new super.x',
    'new super.x()',
    'new super[27]',
    'new super[27]()',
    'z.super',
  ]) {
    it(`class C { m() { ${arg}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { ${arg}; } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { k = ${arg}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { k = ${arg}; } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { foo(${arg}); } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { foo(${arg}); } }`, undefined, Context.None);
      });
    });

    it(`class C { m() { () => ${arg}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { () => ${arg}; } }`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Super (fail)', [
    ['super', Context.None],
    ['super[]', Context.None],
    ['super()', Context.None],
    ['async function* x() { super(); }', Context.None],
    ['ref = async function*() { super(); }', Context.None],
    ['(async function*() { super(); })', Context.None],
    ['var gen = { async *method() { super(); } }', Context.None],
    ['var C = class { async *method() { super(); } }', Context.None],
    ['var C = class { static async *method() { var x = function () { super(); } } }', Context.None],
    ['async function* x() { var x = { y: function () { super(); } } }', Context.None],
    ['var gen = { async *method() { var x = { y: function () { super(); } } } }', Context.None],
    ['var C = class { async *method() { var x = { y: function () { super(); } } } }', Context.None],
    ['var C = class { static async *method() { var x = { y: function () { super(); } } } }', Context.None],
    ['let f = (a=super.foo) => a;', Context.None],
    ['let f = () => super.foo;', Context.None],
    ['x={ foo(){ return () => () => super(); }}', Context.None],
    ['x={ dsda(){ return (a=super()) => a; }}', Context.None],
    ['x={ fo(){ return () => super(); }}', Context.None],
    ['class x extends y { foo(){ return () => () => super(); }}', Context.None],
    ['class x extends y { dsda(){ return (a=super()) => a; }}', Context.None],
    ['class x extends y { fo(){ return () => super(); }}', Context.None],
    ['class x { constructor(){ return () => () => super(); }}', Context.None],
    ['let f = (a=super()) => a;', Context.None],
    ['let f = () => super();', Context.None],
    ['var foo = function*(a = 1 + (yield 2)) { super.foo() ', Context.None],
    ['function* foo(a = 1 + (yield 2)) { super.foo() }', Context.None],
    ['function x(){function x(){super();}}', Context.None],
    ['class A extends B { *g2(a = 1 + (yield 2)) { } }', Context.None],
    ['class x { foo(){ function f(){ super.foo; } }}', Context.None],
    ['class x { constructor(){ function f(){ super.foo; } }}', Context.None],
    ['x = function(){ super.foo; }', Context.None],
    ['super.foo;', Context.None],
    ['function f(x=super.foo){ }', Context.None],
    ['function f(){ super.foo; }', Context.None],
    ['class super { }', Context.None],
    ['class x extends super { }', Context.None],
    ['class x extends super y { }', Context.None],
    ['class x extends foo(super) { }', Context.None],
    ['class x extends foo(super y) { }', Context.None],
    ['class x { foo(super){} }', Context.None],
    ['class x { foo(x=super){} }', Context.None],
    ['class x { foo(x=super y){} }', Context.None],
    ['class x { foo(x=new (super)()){} }', Context.None],
    ['class x { [super](){} }', Context.None],
    ['class x { [super y](){} }', Context.None],
    ['class f { constructor(){  class super { }  }}', Context.None],
    ['class f { constructor(){  class x extends super { }  }}', Context.None],
    ['class f { constructor(){  class x extends super y { }  }}', Context.None],
    ['class f { constructor(){  class x extends feh(super) { }  }}', Context.None],
    ['class f { constructor(){  class x extends feh(super y) { }  }}', Context.None],
    ['class f { constructor(){  class x { foo(super){} }  }}', Context.None],
    ['class f { constructor(){  class x { foo(x=super){} }  }}', Context.None],
    ['class f { constructor(){  class x { foo(x=super y){} }  }}', Context.None],
    ['class f { constructor(){  class x { foo(x=new (super)()){} }  }}', Context.None],
    ['class f { constructor(){  class x { [super](){} }  }}', Context.None],
    ['class f { constructor(){  class x { [super y](){} }  }}', Context.None],
    ['class f { bar(){ class super {} }}', Context.None],
    ['class f { bar(){ class x extends super { }  }}', Context.None],
    ['class f { bar(){ class x extends super y { }  }}', Context.None],
    ['class f { bar(){ class x extends feh(super) { }  }}', Context.None],
    ['class f { bar(){ class x extends feh(super y) { }  }}', Context.None],
    ['class f { bar(){ class x { foo(super){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=super){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=super y){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=new (super)()){} }  }}', Context.None],
    ['class f { bar(){ class x { [super](){} }  }}', Context.None],
    ['class f { bar(){ class x { [super y](){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class super { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends super { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends super y { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends feh(super) { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends feh(super y) { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(super){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(x=super){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(x=super y){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(x=new (super)()){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { [super](){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { [super y](){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class super {} }}', Context.None],
    ['class f extends bar { xxx(){ class x extends super { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends super y { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends feh(super) { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends feh(super y) { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(super){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=super){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=super y){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=new (super)()){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { [super](){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { [super y](){} }  }}', Context.None],
    ['class super.foo { }', Context.None],
    ['class x extends super.foo { }', Context.None],
    ['class x extends super.foo y { }', Context.None],
    ['class x extends feh(super.foo) { }', Context.None],
    ['class x extends feh(super.foo y) { }', Context.None],
    ['class x { foo(super.foo){} }', Context.None],
    ['class x { super.foo(){} }', Context.None],
    ['class x { [super.foo](){} }', Context.None],
    ['class x { [super.foo y](){} }', Context.None],
    ['class f { constructor(){ class super.foo { }  }}', Context.None],
    ['class f { constructor(){ class x extends super.foo y { }  }}', Context.None],
    ['class f { constructor(){ class x extends feh(super.foo y) { }  }}', Context.None],
    ['class f { constructor(){ class x { foo(super.foo){} }  }}', Context.None],
    ['x={ foo: function(){ super.foo; }}', Context.None],
    ['g=function f(x = super()){ }', Context.None],
    ['g={f: function f(){ super() }]', Context.None],
    ['x={constructor(){ super(); }}', Context.None],
    ['function f(x = super()){ }', Context.None],
    ['function f(){ super(); }', Context.None],
    ['const x = 5 + super();', Context.None],
    ['let x = { foo(){ super(); } }', Context.None],
    ['class x { foo(){ super(); } }', Context.None],
    ['class x extends y { foo(){ super(); } }', Context.None],
    ['async(foo) => { super.prop };', Context.None],
    ['!{ a() { !function* (a = super.b()){} } };', Context.None],
    ['async(foo) => { super() };', Context.None],
    ['super.property;', Context.None],
    ['(async function*() { super(); });', Context.None],
    ['function* a(b){ super.c }', Context.None],
    ['class A extends B { constructor() { (super)() } }', Context.None],
    ['function wrap() { function foo(a = super(), b = super.foo()) {}}', Context.None],
    ['({ a() { (super).b(); } });', Context.None],
    ['class X { x(){class X { constructor(){super();} }} }', Context.None],
    ['!{ a() { !function* (a = super.b()){} } };', Context.None],
    ['({ f: function*() {() => new super; } })', Context.None],
    ['async function* x() { super(); }', Context.None],
    ['var C = class { static async *method() { var x = function () { super(); } } }', Context.None],
    ['var C = class { async *method() { var x = { y: function () { super(); } } } }', Context.None],
    ['let x = { foo(){ super(); } }', Context.None],
    ['function* a(b){ super.c }', Context.None],
    ['class C { constructor() { super(); } }', Context.None],
    ['class C { method() { () => super(); } }', Context.None],
    ['({ get x() { super(); } })', Context.None],
    ['({ set x(_) { super(); } })', Context.None],
    ['({ f: function() { super(); } })', Context.None],
    ['(function() { super(); })', Context.None],
    ['({ f: function*() { super(); } })', Context.None],
    ['(function*() { super(); })', Context.None],
    ['var f = function*() { super(); }', Context.None],
    ['class f { constructor(){ class x { foo(x=super.foo y){} } }}', Context.None],
    ['class f { constructor(){ class x { super.foo(){} } }}', Context.None],
    ['class f { constructor(){ class x { [super.foo y](){} } }}', Context.None],
    ['class f { bar(){ class super.foo { } }}', Context.None],
    ['class f { bar(){ class x extends super.foo y {} }}', Context.None],
    ['class f { bar(){ class x extends feh(super.foo y) {} }}', Context.None],
    ['class f { bar(){ class x { foo(super.foo){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=super.foo y){} }  }}', Context.None],
    ['class f { bar(){ class x { super.foo(){} }  }}', Context.None],
    ['class f { bar(){ class x { [super.foo y](){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class super.foo { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends super.foo y { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x extends feh(super.foo y) { }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(super.foo){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(x=super.foo y){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { super.foo(){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class x { [super.foo y](){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class super.foo { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends super.foo y { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends feh(super.foo y) { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=super.foo y){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { super.foo(){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { [super.foo y](){} }  }}', Context.None],
    ['class x extends super() { }', Context.None],
    ['class x { foo(x=new (super)()){} }', Context.None],
    ['class x extends super() y { }', Context.None],
    ['class x extends feh(super()) { }', Context.None],
    ['class x extends feh(super() y) { }', Context.None],
    ['class x { foo(super()){} }', Context.None],
    ['class x { foo(x=super()){} }', Context.None],
    ['class x { foo(x=super() y){} }', Context.None],
    ['class x { foo(x=new (super())()){} }', Context.None],
    ['class x { super()(){} }', Context.None],
    ['class x { [super()](){} }', Context.None],
    ['class x { [super() y](){} }', Context.None],
    ['class f { constructor(){ class super() { } }}', Context.None],
    ['class f { constructor(){ class x extends super() {} }}', Context.None],
    ['class f { constructor(){ class x extends super() y {} }}', Context.None],
    ['class f { constructor(){ class x { foo(super()){} } }}', Context.None],
    ['class f { constructor(){ class x { foo(x=super()){} } }}', Context.None],
    ['class f { constructor(){ class x { foo(x=super() y){} } }}', Context.None],
    ['class f { constructor(){ class x { foo(x=new (super())()){} } }}', Context.None],
    ['class f { constructor(){ class x { super()(){} } }}', Context.None],
    ['class f { constructor(){ class x { [super()](){} } }}', Context.None],
    ['class f { constructor(){ class x { [super() y](){} } }}', Context.None],
    ['class f { bar(){ class super() {}  }}', Context.None],
    ['class f { bar(){ class x extends super() {} }}', Context.None],
    ['class f { bar(){ class x extends super() y {} }}', Context.None],
    ['class f { bar(){ class x extends feh(super()) {} }}', Context.None],
    ['class f { bar(){ class x extends feh(super() y) {} }}', Context.None],
    ['class f { bar(){ class x { foo(super()){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=super()){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=super() y){} }  }}', Context.None],
    ['class f { bar(){ class x { foo(x=new (super())()){} } }}', Context.None],
    ['class f { bar(){ class x { [super()](){} }  }}', Context.None],
    ['class f extends bar { constructor(){ class super() {} }}', Context.None],
    ['class f extends bar { constructor(){ class x extends super() y {} }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(super()){} } }}', Context.None],
    ['class f extends bar { constructor(){ class x { foo(x=super()){} } }}', Context.None],
    ['class f extends bar { constructor(){ class x { super()(){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class super() {} }}', Context.None],
    ['class f extends bar { xxx(){ class x extends super() { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends super() y { }  }}', Context.None],
    ['class f extends bar { xxx(){ class x extends feh(super()) {} }}', Context.None],
    ['class f extends bar { xxx(){ class x extends feh(super() y) { } }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(super()){} }  }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=super() y){} } }}', Context.None],
    ['class f extends bar { xxx(){ class x { foo(x=new (super())()){} } }}', Context.None],
    ['class f extends bar { xxx(){ class x { super()(){} } }}', Context.None],
    ['class f extends bar { xxx(){ class x { [super()](){} } }}', Context.None],
    ['class f extends bar { xxx(){ class x { [super() y](){} } }}', Context.None],
    ['super', Context.None],
    ['super[]', Context.None],
    ['super()', Context.None],
  ]);

  pass('Expressions - Super (pass)', [
    [
      'class C { constructor() {new super.x; } }',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { }',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { f(){} }',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { constructor() { super(); } }',
      Context.None,
      
    ],
    [
      'class x { constructor(){ super.foo; }}',
      Context.OptionsRanges,
      
    ],
    [
      'class x { foo(){ super.foo; }}',
      Context.None,
      
    ],
    [
      'class x { foo(x=super.foo){ }}',
      Context.None,
      
    ],
    [
      'x={ foo(){ super.foo; }}',
      Context.OptionsRanges,
      
    ],
    [
      'x={ foo(a = super.foo){ }}',
      Context.None,
      
    ],
    [
      'class x { constructor(){ super[foo]; }}',
      Context.OptionsRanges,
      
    ],
    [
      'class x { foo(){ super[foo]; }}',
      Context.None,
      
    ],
    [
      'class x { foo(x=super[foo]){ }}',
      Context.None,
      
    ],
    [
      'x={ foo(){ super[foo]; }}',
      Context.None,
      
    ],
    [
      'x={ foo(a = super[foo]){ }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return () => super(); }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return (a=super()) => a; }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return () => () => super(); }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return () => super.foo; }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return () => super[foo]; }}',
      Context.None,
      
    ],
    [
      'class x { constructor(){ return () => super.foo; }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { constructor(){ return () => () => super.foo; }}',
      Context.OptionsRanges,
      
    ],
    [
      'class x { constructor(){ return () => () => super.foo; }}',
      Context.None,
      
    ],
    [
      'class x { fo(){ return () => super.foo; }}',
      Context.None,
      
    ],
    [
      'class x extends y { dsda(){ return (a=super.foo) => a; }}',
      Context.None,
      
    ],
    [
      'class x { dsda(){ return (a=super.foo) => a; }}',
      Context.None,
      
    ],
    [
      'class x extends y { foo(){ return () => () => super.foo; }}',
      Context.None,
      
    ],
    [
      'x={ fo(){ return () => super.foo; }}',
      Context.None,
      
    ],
    [
      'x={ dsda(){ return (a=super.foo) => a; }}',
      Context.None,
      
    ],
    [
      'x={ foo(){ return () => () => super.foo; }}',
      Context.None,
      
    ],
    [
      'class x extends y { constructor() { } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor() { log(this); super(); } }',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { constructor() { log(super.foo); super(); } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(x = super()) { } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(x = this) { super(); } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor(x = super(), y = this) { } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor() { super(); super(); } }',
      Context.OptionsRanges,
      
    ],
    [
      'class x extends y { constructor() { super(this); } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor() { let xx = x + x; super(); } }',
      Context.None,
      
    ],
    [
      'class x extends y { constructor() { f(x); super(); } }',
      Context.None,
      
    ],
    [
      'class x extends y { a = () => super.a(); }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'class x extends y { a = () => { super.a(); }}',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'class x extends y { a = async () => await super.a(); }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'class x extends y { a = async () => { await super.a(); }}',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
    [
      'class x extends y { static properties = { ...super.constructor.properties }; }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      
    ],
  ]);
});
