import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail, pass } from '../../test-utils.ts';

describe('Expressions - Super', () => {
  for (const text of ['new super;', 'new super();', '() => new super;', '() => new super();']) {
    it(`class C { method() { ${text} } }`, () => {
      t.throws(() => {
        parseSource(`class C { method() { ${text} } }`);
      });
    });

    it(`class C { *method() { ${text} } }`, () => {
      t.throws(() => {
        parseSource(`class C { *method() { ${text} } }`);
      });
    });

    it(`class C { get x() { ${text} } }`, () => {
      t.throws(() => {
        parseSource(`class C { get x() { ${text} } }`);
      });
    });

    it(`class C { get x() { ${text} } }`, () => {
      t.throws(() => {
        parseSource(`class C { get x() { ${text} } }`, { lexical: true });
      });
    });

    it(`class C { set x(_) { ${text} } }`, () => {
      t.throws(() => {
        parseSource(`class C { set x(_) { ${text} } }`);
      });
    });

    it(`({ method() { ${text} } })`, () => {
      t.throws(() => {
        parseSource(`({ method() { ${text} } })`);
      });
    });

    it(`(function() { ${text} } )`, () => {
      t.throws(() => {
        parseSource(`(function() { ${text} } )`);
      });
    });

    it(`var f = function() { ${text} }`, () => {
      t.throws(() => {
        parseSource(`var f = function() { ${text} }`);
      });
    });

    it(`({ f: function*() {${text} } })`, () => {
      t.throws(() => {
        parseSource(`({ f: function*() { ${text} } })`);
      });
    });

    it(`(function*() { ${text} })`, () => {
      t.throws(() => {
        parseSource(`(function*() { ${text} })`);
      });
    });

    it(`var f = function*() { ${text} }`, () => {
      t.throws(() => {
        parseSource(`var f = function*() { ${text} }`);
      });
    });
  }

  // Testing valid use of super property
  for (const text of ['new super.x;', 'new super.x();', '() => new super.x;', '() => new super.x();']) {
    it(`class C { constructor() {${text}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { constructor() {${text}}}`);
      });
    });

    it(`class C { *method() {${text}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { *method() {${text}}}`);
      });
    });

    it(`({ method() {${text}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ method() {${text}}})`);
      });
    });

    it(`({ *method() {${text}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ *method() {${text}}})`);
      });
    });

    it(`({ get x() {${text}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ get x() {${text}}})`);
      });
    });

    it(`({ set x(_) {${text}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ set x(_) {${text}}})`);
      });
    });

    it(`class C { set x(_) {${text}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { set x(_) {${text}}}`);
      });
    });

    it(`class C { get x() {${text}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { get x() {${text}}}`);
      });
    });
  }

  for (const text of [
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
    it(text, () => {
      t.throws(() => {
        parseSource(text);
      });
    });

    it(`parseSource = ${text}`, () => {
      t.throws(() => {
        parseSource(`parseSource = ${text}`);
      });
    });

    it(`foo(${text})`, () => {
      t.throws(() => {
        parseSource(`foo(${text})`);
      });
    });

    it(`if (${text}) {}`, () => {
      t.throws(() => {
        parseSource(`if (${text}) {}`);
      });
    });

    it(`if (false) {} else {${text}}`, () => {
      t.throws(() => {
        parseSource(`if (false) {} else {${text}}`);
      });
    });

    it(`class C { m() { function f() {${text}} } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { function f() {${text}} } }`);
      });
    });

    it(`({ m() { function f() {${text}} } })`, () => {
      t.throws(() => {
        parseSource(`({ m() { function f() {${text}} } })`);
      });
    });

    it(`while (true) {${text}}`, () => {
      t.throws(() => {
        parseSource(`while (true) {${text}}`);
      });
    });

    it(`class C extends (${text}) {}`, () => {
      t.throws(() => {
        parseSource(`class C extends (${text}) {}`);
      });
    });
  }

  for (const text of [
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
    it(text, () => {
      t.throws(() => {
        parseSource(text);
      });
    });
  }

  for (const text of [
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
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true });
      });
    });
  }

  for (const text of [
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
    it(`class C { m() { ${text}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { ${text}; } }`);
      });
    });

    it(`class C { m() { k = ${text}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { k = ${text}; } }`);
      });
    });

    it(`class C { m() { foo(${text}); } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { foo(${text}); } }`);
      });
    });

    it(`class C { m() { () => ${text}; } }`, () => {
      t.throws(() => {
        parseSource(`class C { m() { () => ${text}; } }`);
      });
    });
  }

  for (const text of ['new super.x;', 'new super.x();', '() => new super.x;', '() => new super.x();']) {
    it(`class C { constructor() { ${text} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { constructor() { ${text} } }`);
      });
    });

    it(`class C { *method() { ${text} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { *method() { ${text} } }`);
      });
    });

    it(`class C { get x() { ${text} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { get x() { ${text} } }`);
      });
    });

    it(`class C { set x(_) { ${text} } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { set x(_) { ${text} } }`);
      });
    });

    it(`({ method() { ${text} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ method() { ${text} } })`);
      });
    });

    it(`({ *method() { ${text} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ *method() { ${text} } })`);
      });
    });

    it(`(class C { get x() { ${text} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { get x() { ${text} } })`);
      });
    });

    it(`(class C { set x(_) { ${text} } })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { set x(_) { ${text} } })`);
      });
    });
  }

  for (const text of [
    'super.x',
    'super[27]',
    'new super.x',
    'new super.x()',
    'new super[27]',
    'new super[27]()',
    'z.super',
  ]) {
    it(`class C { m() { ${text}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { ${text}; } }`);
      });
    });

    it(`class C { m() { k = ${text}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { k = ${text}; } }`);
      });
    });

    it(`class C { m() { foo(${text}); } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { foo(${text}); } }`);
      });
    });

    it(`class C { m() { () => ${text}; } }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { m() { () => ${text}; } }`);
      });
    });
  }

  fail('Expressions - Super (fail)', [
    'super',
    'super[]',
    'super()',
    'async function* x() { super(); }',
    'ref = async function*() { super(); }',
    '(async function*() { super(); })',
    'var gen = { async *method() { super(); } }',
    'var C = class { async *method() { super(); } }',
    'var C = class { static async *method() { var x = function () { super(); } } }',
    'async function* x() { var x = { y: function () { super(); } } }',
    'var gen = { async *method() { var x = { y: function () { super(); } } } }',
    'var C = class { async *method() { var x = { y: function () { super(); } } } }',
    'var C = class { static async *method() { var x = { y: function () { super(); } } } }',
    'let f = (a=super.foo) => a;',
    'let f = () => super.foo;',
    'x={ foo(){ return () => () => super(); }}',
    'x={ dsda(){ return (a=super()) => a; }}',
    'x={ fo(){ return () => super(); }}',
    'class x extends y { foo(){ return () => () => super(); }}',
    'class x extends y { dsda(){ return (a=super()) => a; }}',
    'class x extends y { fo(){ return () => super(); }}',
    'class x { constructor(){ return () => () => super(); }}',
    'let f = (a=super()) => a;',
    'let f = () => super();',
    'var foo = function*(a = 1 + (yield 2)) { super.foo() ',
    'function* foo(a = 1 + (yield 2)) { super.foo() }',
    'function x(){function x(){super();}}',
    'class A extends B { *g2(a = 1 + (yield 2)) { } }',
    'class x { foo(){ function f(){ super.foo; } }}',
    'class x { constructor(){ function f(){ super.foo; } }}',
    'x = function(){ super.foo; }',
    'super.foo;',
    'function f(x=super.foo){ }',
    'function f(){ super.foo; }',
    'class super { }',
    'class x extends super { }',
    'class x extends super y { }',
    'class x extends foo(super) { }',
    'class x extends foo(super y) { }',
    'class x { foo(super){} }',
    'class x { foo(x=super){} }',
    'class x { foo(x=super y){} }',
    'class x { foo(x=new (super)()){} }',
    'class x { [super](){} }',
    'class x { [super y](){} }',
    'class f { constructor(){  class super { }  }}',
    'class f { constructor(){  class x extends super { }  }}',
    'class f { constructor(){  class x extends super y { }  }}',
    'class f { constructor(){  class x extends feh(super) { }  }}',
    'class f { constructor(){  class x extends feh(super y) { }  }}',
    'class f { constructor(){  class x { foo(super){} }  }}',
    'class f { constructor(){  class x { foo(x=super){} }  }}',
    'class f { constructor(){  class x { foo(x=super y){} }  }}',
    'class f { constructor(){  class x { foo(x=new (super)()){} }  }}',
    'class f { constructor(){  class x { [super](){} }  }}',
    'class f { constructor(){  class x { [super y](){} }  }}',
    'class f { bar(){ class super {} }}',
    'class f { bar(){ class x extends super { }  }}',
    'class f { bar(){ class x extends super y { }  }}',
    'class f { bar(){ class x extends feh(super) { }  }}',
    'class f { bar(){ class x extends feh(super y) { }  }}',
    'class f { bar(){ class x { foo(super){} }  }}',
    'class f { bar(){ class x { foo(x=super){} }  }}',
    'class f { bar(){ class x { foo(x=super y){} }  }}',
    'class f { bar(){ class x { foo(x=new (super)()){} }  }}',
    'class f { bar(){ class x { [super](){} }  }}',
    'class f { bar(){ class x { [super y](){} }  }}',
    'class f extends bar { constructor(){ class super { }  }}',
    'class f extends bar { constructor(){ class x extends super { }  }}',
    'class f extends bar { constructor(){ class x extends super y { }  }}',
    'class f extends bar { constructor(){ class x extends feh(super) { }  }}',
    'class f extends bar { constructor(){ class x extends feh(super y) { }  }}',
    'class f extends bar { constructor(){ class x { foo(super){} }  }}',
    'class f extends bar { constructor(){ class x { foo(x=super){} }  }}',
    'class f extends bar { constructor(){ class x { foo(x=super y){} }  }}',
    'class f extends bar { constructor(){ class x { foo(x=new (super)()){} }  }}',
    'class f extends bar { constructor(){ class x { [super](){} }  }}',
    'class f extends bar { constructor(){ class x { [super y](){} }  }}',
    'class f extends bar { xxx(){ class super {} }}',
    'class f extends bar { xxx(){ class x extends super { }  }}',
    'class f extends bar { xxx(){ class x extends super y { }  }}',
    'class f extends bar { xxx(){ class x extends feh(super) { }  }}',
    'class f extends bar { xxx(){ class x extends feh(super y) { }  }}',
    'class f extends bar { xxx(){ class x { foo(super){} }  }}',
    'class f extends bar { xxx(){ class x { foo(x=super){} }  }}',
    'class f extends bar { xxx(){ class x { foo(x=super y){} }  }}',
    'class f extends bar { xxx(){ class x { foo(x=new (super)()){} }  }}',
    'class f extends bar { xxx(){ class x { [super](){} }  }}',
    'class f extends bar { xxx(){ class x { [super y](){} }  }}',
    'class super.foo { }',
    'class x extends super.foo { }',
    'class x extends super.foo y { }',
    'class x extends feh(super.foo) { }',
    'class x extends feh(super.foo y) { }',
    'class x { foo(super.foo){} }',
    'class x { super.foo(){} }',
    'class x { [super.foo](){} }',
    'class x { [super.foo y](){} }',
    'class f { constructor(){ class super.foo { }  }}',
    'class f { constructor(){ class x extends super.foo y { }  }}',
    'class f { constructor(){ class x extends feh(super.foo y) { }  }}',
    'class f { constructor(){ class x { foo(super.foo){} }  }}',
    'x={ foo: function(){ super.foo; }}',
    'g=function f(x = super()){ }',
    'g={f: function f(){ super() }]',
    'x={constructor(){ super(); }}',
    'function f(x = super()){ }',
    'function f(){ super(); }',
    'const x = 5 + super();',
    'let x = { foo(){ super(); } }',
    'class x { foo(){ super(); } }',
    'class x extends y { foo(){ super(); } }',
    'async(foo) => { super.prop };',
    '!{ a() { !function* (a = super.b()){} } };',
    'async(foo) => { super() };',
    'super.property;',
    '(async function*() { super(); });',
    'function* a(b){ super.c }',
    'class A extends B { constructor() { (super)() } }',
    'function wrap() { function foo(a = super(), b = super.foo()) {}}',
    '({ a() { (super).b(); } });',
    'class X { x(){class X { constructor(){super();} }} }',
    '!{ a() { !function* (a = super.b()){} } };',
    '({ f: function*() {() => new super; } })',
    'async function* x() { super(); }',
    'var C = class { static async *method() { var x = function () { super(); } } }',
    'var C = class { async *method() { var x = { y: function () { super(); } } } }',
    'let x = { foo(){ super(); } }',
    'function* a(b){ super.c }',
    'class C { constructor() { super(); } }',
    'class C { method() { () => super(); } }',
    '({ get x() { super(); } })',
    '({ set x(_) { super(); } })',
    '({ f: function() { super(); } })',
    '(function() { super(); })',
    '({ f: function*() { super(); } })',
    '(function*() { super(); })',
    'var f = function*() { super(); }',
    'class f { constructor(){ class x { foo(x=super.foo y){} } }}',
    'class f { constructor(){ class x { super.foo(){} } }}',
    'class f { constructor(){ class x { [super.foo y](){} } }}',
    'class f { bar(){ class super.foo { } }}',
    'class f { bar(){ class x extends super.foo y {} }}',
    'class f { bar(){ class x extends feh(super.foo y) {} }}',
    'class f { bar(){ class x { foo(super.foo){} }  }}',
    'class f { bar(){ class x { foo(x=super.foo y){} }  }}',
    'class f { bar(){ class x { super.foo(){} }  }}',
    'class f { bar(){ class x { [super.foo y](){} }  }}',
    'class f extends bar { constructor(){ class super.foo { }  }}',
    'class f extends bar { constructor(){ class x extends super.foo y { }  }}',
    'class f extends bar { constructor(){ class x extends feh(super.foo y) { }  }}',
    'class f extends bar { constructor(){ class x { foo(super.foo){} }  }}',
    'class f extends bar { constructor(){ class x { foo(x=super.foo y){} }  }}',
    'class f extends bar { constructor(){ class x { super.foo(){} }  }}',
    'class f extends bar { constructor(){ class x { [super.foo y](){} }  }}',
    'class f extends bar { xxx(){ class super.foo { }  }}',
    'class f extends bar { xxx(){ class x extends super.foo y { }  }}',
    'class f extends bar { xxx(){ class x extends feh(super.foo y) { }  }}',
    'class f extends bar { xxx(){ class x { foo(x=super.foo y){} }  }}',
    'class f extends bar { xxx(){ class x { super.foo(){} }  }}',
    'class f extends bar { xxx(){ class x { [super.foo y](){} }  }}',
    'class x extends super() { }',
    'class x { foo(x=new (super)()){} }',
    'class x extends super() y { }',
    'class x extends feh(super()) { }',
    'class x extends feh(super() y) { }',
    'class x { foo(super()){} }',
    'class x { foo(x=super()){} }',
    'class x { foo(x=super() y){} }',
    'class x { foo(x=new (super())()){} }',
    'class x { super()(){} }',
    'class x { [super()](){} }',
    'class x { [super() y](){} }',
    'class f { constructor(){ class super() { } }}',
    'class f { constructor(){ class x extends super() {} }}',
    'class f { constructor(){ class x extends super() y {} }}',
    'class f { constructor(){ class x { foo(super()){} } }}',
    'class f { constructor(){ class x { foo(x=super()){} } }}',
    'class f { constructor(){ class x { foo(x=super() y){} } }}',
    'class f { constructor(){ class x { foo(x=new (super())()){} } }}',
    'class f { constructor(){ class x { super()(){} } }}',
    'class f { constructor(){ class x { [super()](){} } }}',
    'class f { constructor(){ class x { [super() y](){} } }}',
    'class f { bar(){ class super() {}  }}',
    'class f { bar(){ class x extends super() {} }}',
    'class f { bar(){ class x extends super() y {} }}',
    'class f { bar(){ class x extends feh(super()) {} }}',
    'class f { bar(){ class x extends feh(super() y) {} }}',
    'class f { bar(){ class x { foo(super()){} }  }}',
    'class f { bar(){ class x { foo(x=super()){} }  }}',
    'class f { bar(){ class x { foo(x=super() y){} }  }}',
    'class f { bar(){ class x { foo(x=new (super())()){} } }}',
    'class f { bar(){ class x { [super()](){} }  }}',
    'class f extends bar { constructor(){ class super() {} }}',
    'class f extends bar { constructor(){ class x extends super() y {} }}',
    'class f extends bar { constructor(){ class x { foo(super()){} } }}',
    'class f extends bar { constructor(){ class x { foo(x=super()){} } }}',
    'class f extends bar { constructor(){ class x { super()(){} }  }}',
    'class f extends bar { xxx(){ class super() {} }}',
    'class f extends bar { xxx(){ class x extends super() { }  }}',
    'class f extends bar { xxx(){ class x extends super() y { }  }}',
    'class f extends bar { xxx(){ class x extends feh(super()) {} }}',
    'class f extends bar { xxx(){ class x extends feh(super() y) { } }}',
    'class f extends bar { xxx(){ class x { foo(super()){} }  }}',
    'class f extends bar { xxx(){ class x { foo(x=super() y){} } }}',
    'class f extends bar { xxx(){ class x { foo(x=new (super())()){} } }}',
    'class f extends bar { xxx(){ class x { super()(){} } }}',
    'class f extends bar { xxx(){ class x { [super()](){} } }}',
    'class f extends bar { xxx(){ class x { [super() y](){} } }}',
    'super',
    'super[]',
    'super()',
  ]);

  pass('Expressions - Super (pass)', [
    { code: 'class C { constructor() {new super.x; } }', options: { ranges: true } },
    { code: 'class x extends y { }', options: { ranges: true } },
    { code: 'class x extends y { f(){} }', options: { ranges: true } },
    'class x extends y { constructor() { super(); } }',
    { code: 'class x { constructor(){ super.foo; }}', options: { ranges: true } },
    'class x { foo(){ super.foo; }}',
    'class x { foo(x=super.foo){ }}',
    { code: 'x={ foo(){ super.foo; }}', options: { ranges: true } },
    'x={ foo(a = super.foo){ }}',
    { code: 'class x { constructor(){ super[foo]; }}', options: { ranges: true } },
    'class x { foo(){ super[foo]; }}',
    'class x { foo(x=super[foo]){ }}',
    'x={ foo(){ super[foo]; }}',
    'x={ foo(a = super[foo]){ }}',
    'class x extends y { constructor(){ return () => super(); }}',
    'class x extends y { constructor(){ return (a=super()) => a; }}',
    'class x extends y { constructor(){ return () => () => super(); }}',
    'class x extends y { constructor(){ return () => super.foo; }}',
    'class x extends y { constructor(){ return () => super[foo]; }}',
    'class x { constructor(){ return () => super.foo; }}',
    'class x extends y { constructor(){ return (a=super.foo) => a; }}',
    { code: 'class x extends y { constructor(){ return (a=super.foo) => a; }}', options: { ranges: true } },
    { code: 'class x extends y { constructor(){ return () => () => super.foo; }}', options: { ranges: true } },
    'class x { constructor(){ return () => () => super.foo; }}',
    'class x { fo(){ return () => super.foo; }}',
    'class x extends y { dsda(){ return (a=super.foo) => a; }}',
    'class x { dsda(){ return (a=super.foo) => a; }}',
    'class x extends y { foo(){ return () => () => super.foo; }}',
    'x={ fo(){ return () => super.foo; }}',
    'x={ dsda(){ return (a=super.foo) => a; }}',
    'x={ foo(){ return () => () => super.foo; }}',
    'class x extends y { constructor() { } }',
    { code: 'class x extends y { constructor() { log(this); super(); } }', options: { ranges: true } },
    'class x extends y { constructor() { log(super.foo); super(); } }',
    'class x extends y { constructor(x = super()) { } }',
    'class x extends y { constructor(x = this) { super(); } }',
    'class x extends y { constructor(x = super(), y = this) { } }',
    { code: 'class x extends y { constructor() { super(); super(); } }', options: { ranges: true } },
    'class x extends y { constructor() { super(this); } }',
    'class x extends y { constructor() { let xx = x + x; super(); } }',
    'class x extends y { constructor() { f(x); super(); } }',
    { code: 'class x extends y { a = () => super.a(); }', options: { next: true, webcompat: true, ranges: true } },
    { code: 'class x extends y { a = () => { super.a(); }}', options: { next: true, webcompat: true, ranges: true } },
    {
      code: 'class x extends y { a = async () => await super.a(); }',
      options: { next: true, webcompat: true, ranges: true },
    },
    {
      code: 'class x extends y { a = async () => { await super.a(); }}',
      options: { next: true, webcompat: true, ranges: true },
    },
    {
      code: 'class x extends y { static properties = { ...super.constructor.properties }; }',
      options: { next: true, webcompat: true, ranges: true },
    },
  ]);
});
