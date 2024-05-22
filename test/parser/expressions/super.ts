import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    '() => new super.x();'
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
    'var f = function*() { super(); }'
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
    'class a { foo(){   class x { [super.foo](){} }    }}'
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
    'new new super()()'
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
    'z.super'
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
    ['super()', Context.None]
  ]);

  pass('Expressions - Super (pass)', [
    [
      'class C { constructor() {new super.x; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 41,
        range: [0, 41],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 41,
            range: [0, 41],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'C'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 41,
              range: [8, 41],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 39,
                  range: [10, 39],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 39,
                    range: [21, 39],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 24,
                      end: 39,
                      range: [24, 39],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 25,
                          end: 37,
                          range: [25, 37],
                          expression: {
                            type: 'NewExpression',
                            start: 25,
                            end: 36,
                            range: [25, 36],
                            callee: {
                              type: 'MemberExpression',
                              start: 29,
                              end: 36,
                              range: [29, 36],
                              object: {
                                type: 'Super',
                                start: 29,
                                end: 34,
                                range: [29, 34]
                              },
                              property: {
                                type: 'Identifier',
                                start: 35,
                                end: 36,
                                range: [35, 36],
                                name: 'x'
                              },
                              computed: false
                            },
                            arguments: []
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
      'class x extends y { }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 21,
        range: [0, 21],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 21,
            range: [0, 21],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 21,
              range: [18, 21],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'class x extends y { f(){} }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 27,
            range: [0, 27],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 27,
              range: [18, 27],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 20,
                  end: 25,
                  range: [20, 25],
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 20,
                    end: 21,
                    range: [20, 21],
                    name: 'f'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 25,
                    range: [21, 25],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 23,
                      end: 25,
                      range: [23, 25],
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
      'class x extends y { constructor() { super(); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { constructor(){ super.foo; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 38,
        range: [0, 38],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 38,
            range: [0, 38],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 38,
              range: [8, 38],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 37,
                  range: [10, 37],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 37,
                    range: [21, 37],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 23,
                      end: 37,
                      range: [23, 37],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 25,
                          end: 35,
                          range: [25, 35],
                          expression: {
                            type: 'MemberExpression',
                            start: 25,
                            end: 34,
                            range: [25, 34],
                            object: {
                              type: 'Super',
                              start: 25,
                              end: 30,
                              range: [25, 30]
                            },
                            property: {
                              type: 'Identifier',
                              start: 31,
                              end: 34,
                              range: [31, 34],
                              name: 'foo'
                            },
                            computed: false
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
      'class x { foo(){ super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Super'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { foo(x=super.foo){ }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Super'
                          },
                          computed: false,
                          property: {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x={ foo(){ super.foo; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 24,
              range: [0, 24],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 2,
                end: 24,
                range: [2, 24],
                properties: [
                  {
                    type: 'Property',
                    start: 4,
                    end: 23,
                    range: [4, 23],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 4,
                      end: 7,
                      range: [4, 7],
                      name: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 7,
                      end: 23,
                      range: [7, 23],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 9,
                        end: 23,
                        range: [9, 23],
                        body: [
                          {
                            type: 'ExpressionStatement',
                            start: 11,
                            end: 21,
                            range: [11, 21],
                            expression: {
                              type: 'MemberExpression',
                              start: 11,
                              end: 20,
                              range: [11, 20],
                              object: {
                                type: 'Super',
                                start: 11,
                                end: 16,
                                range: [11, 16]
                              },
                              property: {
                                type: 'Identifier',
                                start: 17,
                                end: 20,
                                range: [17, 20],
                                name: 'foo'
                              },
                              computed: false
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
        sourceType: 'script'
      }
    ],
    [
      'x={ foo(a = super.foo){ }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
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
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Super'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'class x { constructor(){ super[foo]; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 39,
            range: [0, 39],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 39,
              range: [8, 39],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 38,
                  range: [10, 38],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 21,
                    end: 38,
                    range: [21, 38],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 23,
                      end: 38,
                      range: [23, 38],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 25,
                          end: 36,
                          range: [25, 36],
                          expression: {
                            type: 'MemberExpression',
                            start: 25,
                            end: 35,
                            range: [25, 35],
                            object: {
                              type: 'Super',
                              start: 25,
                              end: 30,
                              range: [25, 30]
                            },
                            property: {
                              type: 'Identifier',
                              start: 31,
                              end: 34,
                              range: [31, 34],
                              name: 'foo'
                            },
                            computed: true
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
      'class x { foo(){ super[foo]; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Super'
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { foo(x=super[foo]){ }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'MemberExpression',
                          object: {
                            type: 'Super'
                          },
                          computed: true,
                          property: {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x={ foo(){ super[foo]; }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
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
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: true,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            }
                          }
                        ]
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'x={ foo(a = super[foo]){ }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
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
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Super'
                            },
                            computed: true,
                            property: {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          }
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return () => super(); }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Super'
                              },
                              arguments: []
                            },
                            params: [],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return (a=super()) => a; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'CallExpression',
                                  callee: {
                                    type: 'Super'
                                  },
                                  arguments: []
                                }
                              }
                            ],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return () => () => super(); }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'CallExpression',
                                callee: {
                                  type: 'Super'
                                },
                                arguments: []
                              },
                              params: [],

                              async: false,
                              expression: true
                            },
                            params: [],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return () => super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            params: [],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return () => super[foo]; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: true,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            params: [],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,

                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { constructor(){ return () => super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            params: [],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo'
                                  }
                                }
                              }
                            ],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(){ return (a=super.foo) => a; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 64,
        range: [0, 64],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 64,
            range: [0, 64],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 64,
              range: [18, 64],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 20,
                  end: 63,
                  range: [20, 63],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 20,
                    end: 31,
                    range: [20, 31],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 31,
                    end: 63,
                    range: [31, 63],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 33,
                      end: 63,
                      range: [33, 63],
                      body: [
                        {
                          type: 'ReturnStatement',
                          start: 35,
                          end: 61,
                          range: [35, 61],
                          argument: {
                            type: 'ArrowFunctionExpression',
                            start: 42,
                            end: 60,
                            range: [42, 60],
                            expression: true,
                            async: false,
                            params: [
                              {
                                type: 'AssignmentPattern',
                                start: 43,
                                end: 54,
                                range: [43, 54],
                                left: {
                                  type: 'Identifier',
                                  start: 43,
                                  end: 44,
                                  range: [43, 44],
                                  name: 'a'
                                },
                                right: {
                                  type: 'MemberExpression',
                                  start: 45,
                                  end: 54,
                                  range: [45, 54],
                                  object: {
                                    type: 'Super',
                                    start: 45,
                                    end: 50,
                                    range: [45, 50]
                                  },
                                  property: {
                                    type: 'Identifier',
                                    start: 51,
                                    end: 54,
                                    range: [51, 54],
                                    name: 'foo'
                                  },
                                  computed: false
                                }
                              }
                            ],
                            body: {
                              type: 'Identifier',
                              start: 59,
                              end: 60,
                              range: [59, 60],
                              name: 'a'
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
        sourceType: 'script'
      }
    ],
    [
      'class x extends y { constructor(){ return () => () => super.foo; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 67,
        range: [0, 67],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 67,
            range: [0, 67],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 67,
              range: [18, 67],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 20,
                  end: 66,
                  range: [20, 66],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 20,
                    end: 31,
                    range: [20, 31],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 31,
                    end: 66,
                    range: [31, 66],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 33,
                      end: 66,
                      range: [33, 66],
                      body: [
                        {
                          type: 'ReturnStatement',
                          start: 35,
                          end: 64,
                          range: [35, 64],
                          argument: {
                            type: 'ArrowFunctionExpression',
                            start: 42,
                            end: 63,
                            range: [42, 63],
                            expression: true,
                            async: false,
                            params: [],
                            body: {
                              type: 'ArrowFunctionExpression',
                              start: 48,
                              end: 63,
                              range: [48, 63],
                              expression: true,
                              async: false,
                              params: [],
                              body: {
                                type: 'MemberExpression',
                                start: 54,
                                end: 63,
                                range: [54, 63],
                                object: {
                                  type: 'Super',
                                  start: 54,
                                  end: 59,
                                  range: [54, 59]
                                },
                                property: {
                                  type: 'Identifier',
                                  start: 60,
                                  end: 63,
                                  range: [60, 63],
                                  name: 'foo'
                                },
                                computed: false
                              }
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
        sourceType: 'script'
      }
    ],
    [
      'class x { constructor(){ return () => () => super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Super'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'foo'
                                }
                              },
                              params: [],

                              async: false,
                              expression: true
                            },
                            params: [],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { fo(){ return () => super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'fo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'MemberExpression',
                              object: {
                                type: 'Super'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            params: [],

                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { dsda(){ return (a=super.foo) => a; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'dsda'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo'
                                  }
                                }
                              }
                            ],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x { dsda(){ return (a=super.foo) => a; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'dsda'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            params: [
                              {
                                type: 'AssignmentPattern',
                                left: {
                                  type: 'Identifier',
                                  name: 'a'
                                },
                                right: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo'
                                  }
                                }
                              }
                            ],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { foo(){ return () => () => super.foo; }}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'ArrowFunctionExpression',
                            body: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Super'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'foo'
                                }
                              },
                              params: [],

                              async: false,
                              expression: true
                            },
                            params: [],
                            async: false,
                            expression: true
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x={ fo(){ return () => super.foo; }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'fo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Super'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'foo'
                                }
                              },
                              params: [],

                              async: false,
                              expression: true
                            }
                          }
                        ]
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'x={ dsda(){ return (a=super.foo) => a; }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'dsda'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'Identifier',
                                name: 'a'
                              },
                              params: [
                                {
                                  type: 'AssignmentPattern',
                                  left: {
                                    type: 'Identifier',
                                    name: 'a'
                                  },
                                  right: {
                                    type: 'MemberExpression',
                                    object: {
                                      type: 'Super'
                                    },
                                    computed: false,
                                    property: {
                                      type: 'Identifier',
                                      name: 'foo'
                                    }
                                  }
                                }
                              ],
                              async: false,
                              expression: true
                            }
                          }
                        ]
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'x={ foo(){ return () => () => super.foo; }}',
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
                name: 'x'
              },
              operator: '=',
              right: {
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
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [
                          {
                            type: 'ReturnStatement',
                            argument: {
                              type: 'ArrowFunctionExpression',
                              body: {
                                type: 'ArrowFunctionExpression',
                                body: {
                                  type: 'MemberExpression',
                                  object: {
                                    type: 'Super'
                                  },
                                  computed: false,
                                  property: {
                                    type: 'Identifier',
                                    name: 'foo'
                                  }
                                },
                                params: [],
                                async: false,
                                expression: true
                              },
                              params: [],
                              async: false,
                              expression: true
                            }
                          }
                        ]
                      },
                      async: false,
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
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { log(this); super(); } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 59,
        range: [0, 59],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 59,
            range: [0, 59],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 59,
              range: [18, 59],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 20,
                  end: 57,
                  range: [20, 57],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 20,
                    end: 31,
                    range: [20, 31],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 31,
                    end: 57,
                    range: [31, 57],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 34,
                      end: 57,
                      range: [34, 57],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 36,
                          end: 46,
                          range: [36, 46],
                          expression: {
                            type: 'CallExpression',
                            start: 36,
                            end: 45,
                            range: [36, 45],
                            callee: {
                              type: 'Identifier',
                              start: 36,
                              end: 39,
                              range: [36, 39],
                              name: 'log'
                            },
                            arguments: [
                              {
                                type: 'ThisExpression',
                                start: 40,
                                end: 44,
                                range: [40, 44]
                              }
                            ]
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 47,
                          end: 55,
                          range: [47, 55],
                          expression: {
                            type: 'CallExpression',
                            start: 47,
                            end: 54,
                            range: [47, 54],
                            callee: {
                              type: 'Super',
                              start: 47,
                              end: 52,
                              range: [47, 52]
                            },
                            arguments: []
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
      'class x extends y { constructor() { log(super.foo); super(); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'log'
                            },
                            arguments: [
                              {
                                type: 'MemberExpression',
                                object: {
                                  type: 'Super'
                                },
                                computed: false,
                                property: {
                                  type: 'Identifier',
                                  name: 'foo'
                                }
                              }
                            ]
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(x = super()) { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Super'
                          },
                          arguments: []
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(x = this) { super(); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'ThisExpression'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor(x = super(), y = this) { } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'CallExpression',
                          callee: {
                            type: 'Super'
                          },
                          arguments: []
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        right: {
                          type: 'ThisExpression'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { super(); super(); } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 57,
        range: [0, 57],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 57,
            range: [0, 57],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              start: 16,
              end: 17,
              range: [16, 17],
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              start: 18,
              end: 57,
              range: [18, 57],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 20,
                  end: 55,
                  range: [20, 55],
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 20,
                    end: 31,
                    range: [20, 31],
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 31,
                    end: 55,
                    range: [31, 55],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 34,
                      end: 55,
                      range: [34, 55],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 36,
                          end: 44,
                          range: [36, 44],
                          expression: {
                            type: 'CallExpression',
                            start: 36,
                            end: 43,
                            range: [36, 43],
                            callee: {
                              type: 'Super',
                              start: 36,
                              end: 41,
                              range: [36, 41]
                            },
                            arguments: []
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          start: 45,
                          end: 53,
                          range: [45, 53],
                          expression: {
                            type: 'CallExpression',
                            start: 45,
                            end: 52,
                            range: [45, 52],
                            callee: {
                              type: 'Super',
                              start: 45,
                              end: 50,
                              range: [45, 50]
                            },
                            arguments: []
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
      'class x extends y { constructor() { super(this); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: [
                              {
                                type: 'ThisExpression'
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { let xx = x + x; super(); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
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
                              init: {
                                type: 'BinaryExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                right: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                operator: '+'
                              },
                              id: {
                                type: 'Identifier',
                                name: 'xx'
                              }
                            }
                          ]
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { constructor() { f(x); super(); } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            superClass: {
              type: 'Identifier',
              name: 'y'
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'constructor',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'constructor'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'f'
                            },
                            arguments: [
                              {
                                type: 'Identifier',
                                name: 'x'
                              }
                            ]
                          }
                        },
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Super'
                            },
                            arguments: []
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'class x extends y { a = () => super.a(); }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 39,
                  key: {
                    end: 21,
                    name: 'a',
                    range: [20, 21],
                    start: 20,
                    type: 'Identifier'
                  },
                  range: [20, 39],
                  start: 20,
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    async: false,
                    body: {
                      arguments: [],
                      callee: {
                        computed: false,
                        end: 37,
                        object: {
                          end: 35,
                          range: [30, 35],
                          start: 30,
                          type: 'Super'
                        },
                        property: {
                          end: 37,
                          name: 'a',
                          range: [36, 37],
                          start: 36,
                          type: 'Identifier'
                        },
                        range: [30, 37],
                        start: 30,
                        type: 'MemberExpression'
                      },
                      end: 39,
                      range: [30, 39],
                      start: 30,
                      type: 'CallExpression'
                    },
                    end: 39,
                    expression: true,
                    params: [],
                    range: [24, 39],
                    start: 24,
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              end: 42,
              range: [18, 42],
              start: 18,
              type: 'ClassBody'
            },
            decorators: [],
            end: 42,
            id: {
              end: 7,
              name: 'x',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 42],
            start: 0,
            superClass: {
              end: 17,
              name: 'y',
              range: [16, 17],
              start: 16,
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        end: 42,
        range: [0, 42],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'class x extends y { a = () => { super.a(); }}',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 44,
                  key: {
                    end: 21,
                    name: 'a',
                    range: [20, 21],
                    start: 20,
                    type: 'Identifier'
                  },
                  range: [20, 44],
                  start: 20,
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [
                        {
                          end: 42,
                          expression: {
                            arguments: [],
                            callee: {
                              computed: false,
                              end: 39,
                              object: {
                                end: 37,
                                range: [32, 37],
                                start: 32,
                                type: 'Super'
                              },
                              property: {
                                end: 39,
                                name: 'a',
                                range: [38, 39],
                                start: 38,
                                type: 'Identifier'
                              },
                              range: [32, 39],
                              start: 32,
                              type: 'MemberExpression'
                            },
                            end: 41,
                            range: [32, 41],
                            start: 32,
                            type: 'CallExpression'
                          },
                          range: [32, 42],
                          start: 32,
                          type: 'ExpressionStatement'
                        }
                      ],
                      end: 44,
                      range: [30, 44],
                      start: 30,
                      type: 'BlockStatement'
                    },
                    end: 44,
                    expression: false,
                    params: [],
                    range: [24, 44],
                    start: 24,
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              end: 45,
              range: [18, 45],
              start: 18,
              type: 'ClassBody'
            },
            decorators: [],
            end: 45,
            id: {
              end: 7,
              name: 'x',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 45],
            start: 0,
            superClass: {
              end: 17,
              name: 'y',
              range: [16, 17],
              start: 16,
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        end: 45,
        range: [0, 45],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'class x extends y { a = async () => await super.a(); }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 51,
                  key: {
                    end: 21,
                    name: 'a',
                    range: [20, 21],
                    start: 20,
                    type: 'Identifier'
                  },
                  range: [20, 51],
                  start: 20,
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    async: true,
                    body: {
                      argument: {
                        arguments: [],
                        callee: {
                          computed: false,
                          end: 49,
                          object: {
                            end: 47,
                            range: [42, 47],
                            start: 42,
                            type: 'Super'
                          },
                          property: {
                            end: 49,
                            name: 'a',
                            range: [48, 49],
                            start: 48,
                            type: 'Identifier'
                          },
                          range: [42, 49],
                          start: 42,
                          type: 'MemberExpression'
                        },
                        end: 51,
                        range: [42, 51],
                        start: 42,
                        type: 'CallExpression'
                      },
                      end: 51,
                      range: [36, 51],
                      start: 36,
                      type: 'AwaitExpression'
                    },
                    end: 51,
                    expression: true,
                    params: [],
                    range: [24, 51],
                    start: 24,
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              end: 54,
              range: [18, 54],
              start: 18,
              type: 'ClassBody'
            },
            decorators: [],
            end: 54,
            id: {
              end: 7,
              name: 'x',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 54],
            start: 0,
            superClass: {
              end: 17,
              name: 'y',
              range: [16, 17],
              start: 16,
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        end: 54,
        range: [0, 54],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'class x extends y { a = async () => { await super.a(); }}',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 56,
                  key: {
                    end: 21,
                    name: 'a',
                    range: [20, 21],
                    start: 20,
                    type: 'Identifier'
                  },
                  range: [20, 56],
                  start: 20,
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [
                        {
                          end: 54,
                          expression: {
                            argument: {
                              arguments: [],
                              callee: {
                                computed: false,
                                end: 51,
                                object: {
                                  end: 49,
                                  range: [44, 49],
                                  start: 44,
                                  type: 'Super'
                                },
                                property: {
                                  end: 51,
                                  name: 'a',
                                  range: [50, 51],
                                  start: 50,
                                  type: 'Identifier'
                                },
                                range: [44, 51],
                                start: 44,
                                type: 'MemberExpression'
                              },
                              end: 53,
                              range: [44, 53],
                              start: 44,
                              type: 'CallExpression'
                            },
                            end: 53,
                            range: [38, 53],
                            start: 38,
                            type: 'AwaitExpression'
                          },
                          range: [38, 54],
                          start: 38,
                          type: 'ExpressionStatement'
                        }
                      ],
                      end: 56,
                      range: [36, 56],
                      start: 36,
                      type: 'BlockStatement'
                    },
                    end: 56,
                    expression: false,
                    params: [],
                    range: [24, 56],
                    start: 24,
                    type: 'ArrowFunctionExpression'
                  }
                }
              ],
              end: 57,
              range: [18, 57],
              start: 18,
              type: 'ClassBody'
            },
            decorators: [],
            end: 57,
            id: {
              end: 7,
              name: 'x',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 57],
            start: 0,
            superClass: {
              end: 17,
              name: 'y',
              range: [16, 17],
              start: 16,
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        end: 57,
        range: [0, 57],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ],
    [
      'class x extends y { static properties = { ...super.constructor.properties }; }',
      Context.OptionsNext | Context.OptionsWebCompat | Context.OptionsRanges,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  end: 75,
                  key: {
                    end: 37,
                    name: 'properties',
                    range: [27, 37],
                    start: 27,
                    type: 'Identifier'
                  },
                  range: [27, 75],
                  start: 27,
                  static: true,
                  type: 'PropertyDefinition',
                  value: {
                    end: 75,
                    properties: [
                      {
                        argument: {
                          computed: false,
                          end: 73,
                          object: {
                            computed: false,
                            end: 62,
                            object: {
                              end: 50,
                              range: [45, 50],
                              start: 45,
                              type: 'Super'
                            },
                            property: {
                              end: 62,
                              name: 'constructor',
                              range: [51, 62],
                              start: 51,
                              type: 'Identifier'
                            },
                            range: [45, 62],
                            start: 45,
                            type: 'MemberExpression'
                          },
                          property: {
                            end: 73,
                            name: 'properties',
                            range: [63, 73],
                            start: 63,
                            type: 'Identifier'
                          },
                          range: [45, 73],
                          start: 45,
                          type: 'MemberExpression'
                        },
                        end: 73,
                        range: [42, 73],
                        start: 42,
                        type: 'SpreadElement'
                      }
                    ],
                    range: [40, 75],
                    start: 40,
                    type: 'ObjectExpression'
                  }
                }
              ],
              end: 78,
              range: [18, 78],
              start: 18,
              type: 'ClassBody'
            },
            decorators: [],
            end: 78,
            id: {
              end: 7,
              name: 'x',
              range: [6, 7],
              start: 6,
              type: 'Identifier'
            },
            range: [0, 78],
            start: 0,
            superClass: {
              end: 17,
              name: 'y',
              range: [16, 17],
              start: 16,
              type: 'Identifier'
            },
            type: 'ClassDeclaration'
          }
        ],
        end: 78,
        range: [0, 78],
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    ]
  ]);
});
