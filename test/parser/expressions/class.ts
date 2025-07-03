import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Expressions - Class', () => {
  for (const arg of [
    '*async x(){}',
    'async *(){}',
    'async get x(){}',
    'async set x(y){}',
    'async x : 0',
    'async : 0',
    'async static x(){}',
    'static *async x(){}',
    'static async *(){}',
    'static get *(){}',
    'static set *(){}',
    'static async get x(){}',
    'static async set x(y){}',
    'static async x : 0',
    'static async : 0',
  ]) {
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, { webcompat: true });
      });
    });

    it(`class {${arg}}`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`);
      });
    });

    it(`(class extends Base {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class extends Base {${arg}})`);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`bar, (class {${arg}})`);
      });
    });
  }

  for (const arg of [
    'arguments',
    'eval',
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'var',
    'yield',
  ]) {
    it(`class C { get name(${arg}) {} }`, () => {
      t.throws(() => {
        parseSource(`class C { get name(${arg}) {} }`);
      });
    });

    it(`class C { get name(${arg}) {} }`, () => {
      t.throws(() => {
        parseSource(`class C { get name(${arg}) {} }`, { webcompat: true });
      });
    });

    it(`"use strict"; class C { get name(${arg}) {} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; class C { get name(${arg}) {} }`);
      });
    });

    it(`(class C { get name(${arg}) {} })`, () => {
      t.throws(() => {
        parseSource(`(class C { get name(${arg}) {} })`);
      });
    });
  }

  for (const arg of [
    'static prototype() {}',
    'static get prototype() {}',
    'static set prototype(_) {}',
    'static *prototype() {}',
    "static 'prototype'() {}",
    "static *'prototype'() {}",
    String.raw`static prot\u006ftype() {}`,
    String.raw`static 'prot\u006ftype'() {}`,
    String.raw`static get 'prot\u006ftype'() {}`,
    String.raw`static set 'prot\u006ftype'(_) {}`,
    String.raw`static *'prot\u006ftype'() {}`,
  ]) {
    it(`class C {${arg}}`, () => {
      t.throws(() => {
        parseSource(`class C {${arg}}`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'get constructor() {}',
    'get constructor(_) {}',
    '*constructor() {}',
    "get 'constructor'() {}",
    "*'constructor'() {}",
    String.raw`get c\u006fnstructor() {}`,
    String.raw`*c\u006fnstructor() {}`,
    String.raw`get 'c\u006fnstructor'() {}`,
    String.raw`get 'c\u006fnstructor'(_) {}`,
    String.raw`*'c\u006fnstructor'() {}`,
  ]) {
    it(`class C {${arg}}`, () => {
      t.throws(() => {
        parseSource(`class C {${arg}}`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'class',
    'class name',
    'class name extends',
    'class extends',
    'class name {',
    'class name { m: 1 }',
    'class name { m(); n() }',
    'class name { get x }',
    'class name { get x() }',
    'class name { set x() {) }', // missing required param
    'class {}', // Name is required for declaration
    'class extends base {}',
    'class name { *',
    'class name { * }',
    'class name { *; }',
    'class name { *get x() {} }',
    'class name { *set x(_) {} }',
    'class name { *static m() {} }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`if (true) { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`if (true) { ${arg} }`);
      });
    });
  }
  for (const arg of [
    'class',
    'class name',
    'class name extends',
    'class extends',
    'class {',
    'class { m: 1 }',
    'class { m(); n() }',
    'class { get m }',
    'class { get m() }',
    'class { get m() { }',
    'class { set m() {} }', // Missing required parameter.
    'class { m() {}, n() {} }', // No commas allowed.
  ]) {
    it(`bar, ${arg};`, () => {
      t.throws(() => {
        parseSource(`bar, ${arg};`);
      });
    });

    it(`var foo = ${arg};`, () => {
      t.throws(() => {
        parseSource(`var foo = ${arg};`);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'class C { method() { with ({}) {} } }',
    'class C extends function() { with ({}) {} } {}',
    'class C { *method() { with ({}) {} } }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, { webcompat: true });
      });
    });
  }

  for (const arg of ['constructor() {}; constructor() {}']) {
    it(`class C {${arg}}`, () => {
      t.throws(() => {
        parseSource(`class C {${arg}}`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'constructor() {}; static constructor() {}',
    'm() {}; static m() {}',
    'm() {}; m() {}',
    'static m() {}; static m() {}',
    'get m() {}; set m(_) {}; get m() {}; set m(_) {};',
  ]) {
    it(`class C {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {${arg}}`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    'constructor() {}',
    'static constructor() {}',
    'static get constructor() {}',
    'static set constructor(_) {}',
    'static *constructor() {}',
    outdent`
      method() {
        new class { constructor() {} }
      }
      constructor() {}
    `,
    outdent`
      method() {
        new class {
          method() {
            new class { constructor() {} }
          }
          constructor() {}
        }
      }
      constructor() {}
    `,
  ]) {
    it(`class C {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {${arg}}`);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`);
      });
    });
  }

  for (const arg of [
    '3:0',
    '[3]:0',
    '[a,b](){}',
    '[3]:0',
    '[a,b](){}',
    '[3]:0',
    'class name {',
    '"constructor"() {} constructor() {}',
    'constructor() {} constructor() {}',
    '"constructor"() {} "constructor"() {}',
    '"constructor"(){}; constructor(){};',
    '\'constructor\'(){}; "constructor"(){};',
    '`constructor`(){} }',
    '"constructor"(){}; constructor(){}; }',
    '"constructor"() {} foo() {} bar() {} constructor() {} }',
    '*"constructor"(){}',
    'static *method([...[ x ] = []]) {}',
    '*method([...{ x }, y] = [1, 2, 3]) {}',
    '*method([...x = []] = []) {}',
    '*method([...{ x }, y]) {}',
    '*method([...[x], y]) {}',
    'async "constructor"(){}',
    'static async *gen() { var await; }',
    'static async *gen() { await: ; }',
    'static async *method([...{ x }, y] = [1, 2, 3]) {}',
    'static async *method([...x, y] = [1, 2, 3]) {}',
    'static async *method([...[x], y] = [1, 2, 3]) {}',
    'static async *method([...{ x } = []] = []) {}',
    'static async *method([...x = []] = []) {}',
    'static async *method([...[ x ] = []] = []) {}',
    'static async *method([...{ x }, y]) {}',
    'static async *method([...x, y]) {}',
    'static async *method([...[ x ] = []]) {}',
    'async *method([...[ x ] = []] = []) {}',
    'async *method([...x = []] = []) {}',
    'async *method([...{ x } = []] = []) {}',
    'async *method([...[x], y] = [1, 2, 3]) {}',
    'async *method([...x, y] = [1, 2, 3]) {}',
    'async *method([...{ x }, y] = [1, 2, 3]) {}',
    'async *method([...{ x }, y]) {}',
    'static async method(...a,) {}',
    'async *method([...[ x ] = []]) {}',
    'async *method([...x = []]) {}',
    'async *method([...{ x }, y]) {}',
    'async *method([...[ x ] = []] = []) {}',
    'async *method([...x, y] = [1, 2, 3]) {}',
    'static async *method([...[ x ] = []]) {}',
    'static async *method([...{ x } = []]) {}',
    'static async *method([...x = []] = []) {}',
    '*method([...[ x ] = []] = []) {}',
    '*method([...x, y] = [1, 2, 3]) {}',
    'static async method(...x = []) {}',
    'constructor() { class B extends super() {} }',
    'constructor() { super(); }',
  ]) {
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`);
      });
    });
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, { webcompat: true });
      });
    });
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`bar, class {${arg}}`);
      });
    });

    it(`var foo =  class {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var foo = class {${arg}}`);
      });
    });
  }

  for (const arg of [
    'class {}',
    'class name {}',
    'class extends F {}',
    'class name extends F {}',
    'class extends (F, G) {}',
    'class name extends (F, G) {}',
    'class extends class {} {}',
    'class name extends class {} {}',
    'class extends class base {} {}',
    'class name extends class base {} {}',
    '(class A {get prototype(){}})',
    '(class A {set prototype(x){}})',
    '(class A {*prototype(){}})',
    'class x { get prototype(){} }',
    '(class x { async prototype(){} })',
    '(class A {async prototype(){}})',
    '(class A {async *prototype(){}})',
  ]) {
    it(`(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg})`);
      });
    });

    it(`bar, ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar, ${arg};`);
      });
    });
  }

  for (const arg of [
    '42',
    '42.5',
    '42e2',
    '42e+2',
    '42e-2',
    'null',
    'false',
    'true',
    "'str'",
    '"str"',
    'static',
    'get',
    'set',
    'var',
    'const',
    'let',
    'this',
    'class',
    'function',
    'yield',
    'if',
    'else',
    'for',
    'while',
    'do',
    'try',
    'catch',
    'finally',
  ]) {
    it(`(class {${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class {${arg}() {}});`);
      });
    });

    it(`(class { get ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { get ${arg}() {}});`);
      });
    });

    it(`(class { static ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static ${arg}() {}});`);
      });
    });

    it(`(class { static get ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static get ${arg}() {}});`);
      });
    });

    it(`(class { static *${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static *${arg}() {}});`);
      });
    });

    it(`class C {${arg}() {}};`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {${arg}() {}}`);
      });
    });

    it(`class C { static set ${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { static set ${arg}(v) {}}`);
      });
    });
  }

  fail('Expressions - Class', [
    '0, class { static method(...x = []) { } };',
    { code: '(class { get [yield]() { return "get yield"; }})', options: { impliedStrict: true } },
    '(class { get [yield]() { return "get yield"; }}) (class { get [yield]() { return "get yield"; }})',
    'function foo() { (class { get [yield]() { return get yield"; }}) }',
    '(class { set [yield](param) { yieldSet = param; }}) (class { set [yield](param) { yieldSet = param; }})',
    'function foo() { (class { set [yield](param) { yieldSet = param; }}',
    'class foo { *async x(){} }',
    'class foo { async *(){} }',
    'class foo { async get x(){} }',
    'class foo { async set x(y){} }',
    'class foo { async x : 0 }',
    'class foo { async : 0 }',
    'class foo { async static x(){} }',
    'class foo { "static *async x(){} }',
    'class foo { static async *(){} }',
    'class foo { static async get x(){} }',
    'class foo { static async set x(y){} }',
    'class foo { static async x : 0 }',
    'class A extends (() => { with (a) {} }) {}',
    'class public {}',
    'class static {}',
    'class l\u0065t {};',
    'class A { async* f() { () => yield a; } }',
    'class foo { static async : 0 }',
    'class E0 { 0123() {} }',
    'class E1 { 0123.1() {} }',
    'class yield { }',
    { code: 'class x { x = new y<a>() }', options: { next: true } },
    { code: 'class x { x = new y<a,>() }', options: { next: true } },
    { code: 'class x { x = new y<a,b>() }', options: { next: true } },
    { code: 'class x { x = y<a>() }', options: { next: true } },
    { code: 'class x { x = new y<a,>() }', options: { next: true } },
    { code: 'class x { x = new y<a,b>() }', options: { next: true } },
    'class x { x = new y<a>() }',
    'class x { x = new y<a,>() }',
    'class x { x = new y<a,b>() }',
    'class eval { }',
    'class switch() {}',
    'class let { }',
    String.raw`class impl\u0065ments {}`,
    'classfunction yield(yield) { yield: yield (yield + yield(0)); }',
    String.raw`class l\u0065t { }`,
    'class E0 { static prototype() {} }',
    'class E1 { static get prototype() {} }',
    'class E2 { static set prototype(x) {} }',
    'function () { class A extends 0       { } }',
    'function () { class A extends "test"  { } }',
    'function () { class A extends {}      { } }',
    'function () { class A extends undefined { } }',
    'super[1];',
    'class x{[x](a=await y){}}',
    'class C extends --x {}',
    'class C extends a !== b {}',
    'class C extends a *= b {}',
    'class C extends a => b {}',
    'class C extends a => {} {}',
    'class C extends async a => b {}',
    'class C extends delete x {}',
    'class C extends x,y {}',
    'class C extends s ** y {}',
    'class C extends super() {}',
    'class C extends super.foo {}',
    'class C extends typeof x {}',
    'class C extends void x {}',
    'class C extends [...x=y] = b {}',
    'class x { foo(x=new (yield)()){} }',
    'class x { foo(x=yield y){} }',
    'class x { foo(x=yield){} }',
    'class x { foo(yield){} }',
    'class x extends feh(yield y) { }',
    'class x extends feh(yield) { }',
    'class x extends yield y { }',
    'class x extends yield { }',
    'class yield { }',
    'class x { [yield](){} }',
    'class x { [yield y](){} }',
    'function *f(){  class yield { }  }',
    'function *f(){  class x extends yield { }  }',
    'function *f(){  class x extends yield y { }  }',
    'function *f(){  class x { foo(yield){} }  }',
    'function *f(){  class x { foo(x=yield){} }  }',
    'function *f(){  class x { foo(x=yield y){} }  }',
    'function *f(){  class x { foo(x=new (yield)()){} }  }',
    { code: 'class x extends await y { }', options: { impliedStrict: true } },
    { code: 'class x extends feh(await y) { }', options: { impliedStrict: true } },
    'async function f() {   class x { await y(){} }   }',
    'async function f() {   class x { [await](){} }   }',
    'class arguments {};',
    'var x = class eval {};',
    'function() { class A { m() { A = 0; } }; new A().m(); }',
    'function() { new (class A { m() { A = 0; } }).m(); }',
    'function() { class A { get x() { A = 0; } }; new A().x; }',
    'function() { (new (class A { get x() { A = 0; } })).x; }',
    'function() { class A { set x(_) { A = 0; } }; new A().x = 15; }',
    'function() { (new (class A { set x(_) { A = 0; } })).x = 15; }',
    'function () { class A { constructor() { A = 0; } }; new A(); }',
    '(class { adf&/()})',
    '(class { adf &/()})',
    //['class aw\\u0061it {}', Context.Strict | Context.Module],
    '(class b {)',
    '(class b )',
    '(class b {-})',
    '(class b {a:})',
    '(class b {#a:})',
    '(class extends a,b {)',
    '(class {a:0})',
    '(class switch() {})',
    '(class eval {a:0})',
    '(class yield {a:0})',
    'class x{async *%x(a){}}',
    '(class x{async *%x(a){}})`;',
    '(class x extends a = b {})',
    '(class x {[x]z){}})',
    '(class x {foo, bar(){}})',
    '(class x {foo: x})',
    '(class x { async [x]s){}})',
    '(class x { `constructor`(){} })',
    'class x extends a = b {}',
    'class x {[x]z){}}',
    'class x {foo, bar(){}}',
    'class x {foo: x}',
    'class x { async [x]s){}}',
    'class x { [yield y](){} }',
    'class x { [yield](){} }',
    'class x extends () => x {}',
    'class X extends function(){ with(obj); } {}',
    'class let {}`;',
    '(class A {get constructor(){}})',
    '(class A {set constructor(x){}})',
    '(class A {*constructor(){}})',
    '(class A {async get foo(){}})',
    '(class A {* get foo(){}})',
    '(class A {async set foo(x){}})',
    '(class A {* set foo(x){}})',
    { code: 'var C = class await {};', options: { sourceType: 'module' } },
    '(class A {async get "foo"(){}})',
    '(class A {* get "foo"(){}})',
    '(class A {async set "foo"(x){}})',
    '(class A {* set "foo"(x){}})',
    '(class A {async get 7(){}})',
    '(class A {* get 8(){}})',
    '(class A {async set 11(x){}})',
    '(class A {* set 12(x){}})',
    'var C = class { static async *gen() { yield: ; }}',
    '(class A {* set 12(x){}})',

    'class x { static set prototype(x){} }',
    'class x { static *prototype(){} }',
    'class x { static prototype(){} }',
    'class x { static async *prototype(){} }',
    String.raw`class x { static async *prot\u006ftype(){} }`,
    'class x { static "prototype"(){} }',
    'class w {  t.x(){}  }',
    'class x extends ()=>1 {}',
    'class X {    async constructor() {}   }',
    'class x{   async static static(){}    }',
    'class x {    static static f(){}    }',
    'class x {    * * f(){}    }',
    'class x {    set set f(x){}    }',
    'class x {    static prototype(){}    }',
    'class x { async get foo(){ }}',
    'class x { static / foo(){} }',
    'class x{[yield](a){}}',
    'class x{*[yield](a){}}',
    'class x extends yield {}',
    'function *f(){   class x extends yield {}    }',
    'for (class x extends a in b {} in c);',
    'for (class x { [a](){} } in c);',
    'class x extends y { [super.foo](){} }',
    'class x extends super.foo {}',
    'class x { [super()](){} }',
    //    ['class x extends y { [super()](){} }', Context.None],
    'class a { constructor(){   class x { [super()](){} }    }}',
    //['class a { constructor(){   class x extends y { [super()](){} }    }}', Context.None],
    'class a { constructor(){      class x extends super() {}    }}',
    'class x \n /foo/ {}',
    'class x { x \n /foo/ }',
    'class x { set \n /foo/ }',
    'class x { y(z, \n /foo/){} }',
    'class x { y()\n /foo/{} }',
    'class x { y() {}\n /foo/ }',
    'let c = class x { \n /foo/ }',
    'let c = class x { get \n /foo/ }',
    'class A {"x"){}}',
    'class A {"x"{}}',
    '(class A {constructor(){}; constructor(){}})',
    '(class A {a(){}; constructor(){}; constructor(){}})',
    '(class A {a(){}; constructor(){}; a(){}; a(){}; a(){}; constructor(){}; a(){}})',
    '(class A {static constructor(){}; constructor(){}; constructor(){}})',
    '(class A {foo, bar(){}})',
    'class A {async get foo(){}}',
    '(class A {set constructor(x){}})',
    '(class A {async constructor(){}})',
    'class a {**=f(){}',
    'class a {*=f(){}}',
    'class A {async *=f(){}}',
    '(class A {async *constructor(){}})',
    '(class A {get "constructor"(){}})',
    '(class A {async "constructor"(){}})',
    '(class A {constructor(){}; constructor(){};})',
    '(class A {get "constructor"(){}})',
    'None class{}\n/foo/',
    outdent`
      class C extends (function B() {
        with ({});
        return B;
      }()) {}
    `,
    'async function f(){   (fail = class extends (await x) {}) => {}   }',
    'C = class let {};',
    'class A {* get [x](){}}',
    'class A {async get [x](){}}',
    'class x extends yield {}',
    'class x { await y(){} }',
    'class x { foo(x=new (await y)()){} }',
    { code: 'class x { foo(x=new (await y)()){} }', options: { sourceType: 'module' } },
    'class x { foo(x=await y){} }',
    'class A {...',
    '(class A {* set [foo](x){}})',
    '(class A {async get [foo](){}})',
    '(class x{get *foo(){}})',
    '(class x{get *[x](){}})',
    '(class x{get *"foo"(){}})',
    '(class x{get *555(){}})',
    '(class x{set *foo(a){})',
    '(class x{set *[x](a){}})',
    '(class x{set *"foo"(a){}})',
    '(class x{set *555(a){}})',
    '(class x{set *%x(a){}})',
    '(class x{static *%x(){}})',
    '(class v extends.foo {})',
    '(class x{static get *foo(){}})',
    '(class x{static get *[x](){}}`);',
    '(class x{static get *"foo"(){}})',
    '(class x{static get *555(){}})',
    '0, class { static method(...x = []) {} };',
    '0, class { static method(...a,) {} };',
    'class x{static get *%x(){}}',
    '(class x{static set *foo(a){}})',
    '(class x{static set *[x](a){}})',
    '(class x{static set *"foo"(a){}})',
    '(class x{static set *555(a){}})',
    '(class x{static set *%x(a){}})',
    '(class A extends B { method() { super() } })',
    { code: '(class A extends B { method() { super() } })', options: { webcompat: true } },
    '(class x{static async *%x(a){}})',
    '(class x{static async *%x(a){}})',
    '(class x{async *get 8(){}})',
    '(class x{static *async 8(){}})',
    '(class x{static *get 8(){}})',
    '(class x{static *set 8(y){}})',
    '(class x{static *async "x"(){}})',
    '(class x{static *get "x"(){}}',
    '(class { static *get [x](){}})',
    '(class { static *get [x](){}}) (class { static *get [x](){}})',
    'var foo = (class { static *get [x](){}})',
    '(class { static *set [x](y){}})',
    'function foo() { (class { static *get [x](){}}) }',
    '(class { static *set [x](y){}}) (class { static *set [x](y){}})',
    'var foo = (class { static *set [x](y){}})',
    'function foo() { (class { static *set [x](y){}}) }',
    '(class A { ["async"] a() {} })',
    '(class A { ["get"] a() {} })',
    '(class A { static *prototype() {} })',
    '(class A { static prototype() {} })',
    '(class A { static get prototype() {} })',
    '(class A { static set prototype(_) {} })',
    '(class A { static *prototype() {} })',
    '(class A { static prototype() {} })',
    '(class A { static *prototype() {} })',
    '(class A { static prototype() {} })',
    '(class A { static *get [x](){} })',
    '(class A { static *set [x](y){}})',
    'async function f(foo = class y extends (await f) {}){}',
    'new class { constructor() {} start() { new class { constructor() {}}} constructor() {}}',
    'new class { constructor() {} start() { new class { } } constructor() {}}',
  ]);

  for (const arg of [
    ';;;\n;\n',
    'yield() {}',
    'await() {}',
    'async() {}',
    'static set ["prototype"](x) {}',
    'static get ["prototype"]() {}',
    '["prototype"]() {}',
    'static get ["prototype"]() {}',
    'static set ["prototype"](x) {}',
    'static async *method(a, b = 39,) {}',
    'static *method({ x: y = 33 }) {}',
    'static *method({ x: y = function a() {} }) {}',
    'static *method({ w: [x, y, z] = [4, 5, 6] }) {}',
    'static *method({ cover = (function () {}), xCover = (0, function() {})  }) {}',
    'static *method({}) {}',
    'static *method({...rest} = {a: 3, b: 4}) {}',
    'static *method({ x, } = { x: 23 }) {}',
    'static *method({} = null) {}',
    'static *method([cover = (function () {}), xCover = (0, function() {})] = []) {}',
    'static *method([[x, y, z] = [4, 5, 6]] = []) {}',
    'static *method([, ...x]) {}',
    'static *method([,]) {}',
    'static *method([x]) {}',
    'static *method([[x, y, z] = [4, 5, 6]]) {}',
    'static *"x"(){}',
    'static get 0x10() { return "get string"; }',
    'static set 0x10(param) { stringSet = param; }',
    'static get 1E+9() { return "get string"; }',
    'static set 1E+9(param) { stringSet = param; }',
    'static get 0o10() { return "get string"; }',
    'static set 0o10(param) { stringSet = param; }',
    'static get 0() { return "get string"; }',
    'static set 0(param) { stringSet = param; }',
    'static get ""() { return "get string"; }',
    'static set ""(param) { stringSet = param; }',
    'static get [_ = "str" + "ing"]() { return "get string"; }',
    'static set [_ = "str" + "ing"](param) { stringSet = param; }',
    ' *method({ x, }) {}',
    '*method({ cls = class {}, xCls = class X {}, xCls2 = class { static name() {} } }) {}',
    '*method({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    '*method({} = null) {}',
    '*method([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] = []) {}',
    '*method([[x]] = [null]) {}',
    '*method([...{ length }]) {}',
    '*method([...[,]]) {}',
    '*g() {};',
    '; *g() {}',
    '*g() {}; *h(x) {}',
    'async *x(){}',
    'static() {}',
    'get static() {}',
    'set static(v) {}',
    'static m() {}',
    'static get x() {}',
    'static set x(v) {}',
    'static get() {}',
    'static set() {}',
    'static static() {}',
    'static get static() {}',
    'static set static(v) {}',
    '*static() {}',
    'static *static() {}',
    '*get() {}',
    '*set() {}',
    'static *g() {}',
    'async(){}',
    '*async(){}',
    'static async(){}',
    'static *async(){}',
    'static async *x(){}',
    // static-as-PropertyName is.
    String.raw`st\u0061tic() {}`,
    String.raw`get st\u0061tic() {}`,
    String.raw`set st\u0061tic(v) {}`,
    String.raw`static st\u0061tic() {}`,
    String.raw`static get st\u0061tic() {}`,
    String.raw`static set st\u0061tic(v) {}`,
    String.raw`*st\u0061tic() {}`,
    String.raw`static *st\u0061tic() {}`,
    'static async x(){}',
    'static async(){}',
    'static *async(){}',
    'async x(){}',
    'async 0(){}',
    'async get(){}',
    'async set(){}',
    'async static(){}',
    'async async(){}',
    'async(){}',
    '*async(){}',
    'async *hunya({ w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined }) {}',
    'async *method({ w: [x, y, z] = [4, 5, 6] }) {}',
    'async *method({ w: { x, y, z } = undefined }) {}',
    'static async *method([[x, y, z] = [4, 5, 6]]) {}',
    'static async *method([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }]) {}',
    '*method([,] = g()) {}',
    '*method([ , , ...x] = [1, 2, 3, 4, 5]) {}',
    '*method([...{ 0: v, 1: w, 2: x, 3: y, length: z }] = [7, 8, 9]) {}',
    '*method({ a, b = thrower(), c = ++a } = {}) {}',
    '*method({ x: y = 33 } = { }) {}',
    '*method({ cover = (function () {}), b = (0, function() {})  }) {}',
    '*method({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
    'static *method([[...x] = function() { a += 1; }()]) {}',
    'static *method([cover = (function () {}), b = (0, function() {})]) {}',
    'static *method([x]) {}',
    'static *method({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    'static *method({ x: y, } = { x: 23 }) {}',
    'static *method({ cls = class {}, xCls = class X {}, xCls2 = class { static name() {} } }) {}',
    'static *method({...x}) {}',
    'method([[...x] = values]) {}',
    "static set ['x' in empty](param) { value = param; }",
    "get .1() { return 'get string'; }",
    'set .1(param) { stringSet = param; }',
    "set 'singleQuote'(param) { stringSet = param; }",
    String.raw`get 'hex\x45scape'() { return 'get string'; }`,
    "set 'character\tescape'(param) { stringSet = param; }",
    'set 0(param) { stringSet = param; }',
    'set 1E+9(param) { stringSet = param; }',
    '*method() {}',
    'static async *method(a,) {}',
    'static async *gen() { yield * []; }',
    'static async *gen() { yield [...yield yield]; }',
    outdent`
      static async *gen() {
          yield {
              ...yield,
              y: 1,
              ...yield yield,
            };
      }
    `,
    'static async *gen() { yield* isiah(); }',
    'async method(a = b +=1, c = d += 1, e = f += 1, g = h += 1, i = j += 1,k = l +=1) {}',
    'async method(a, b = 39,) {}',
    'static async method(a,) {}',
    'static async *gen() {}',
    'method([x]) {}',
    'static *method({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
    'static async *method() {}',
    'static async *method(x = y, y) {}',
    'static async *method(a,) {}',
    'static async *gen() { yield* obj; }',
    'static async *gen() { yield this.foo; }',
    'async *gen() { yield * readFile();}',
    'async *method([x, y, z]) {}',
    'async *method([x = 23]) {}',
    'async *method([x]) {}',
    'async *method([,]) {}',
    'async *method([, ...x]) {}',
    'async *method([ , , ...x]) {}',
    'async *method([...x]) {}',
    'async *method([...{ length }]) {}',
    'async *method([arrow = () => {}] = []) {}',
    'async *method([ x = y ] = []) {}',
    'async *method([{ x }] = []) {}',
    'async *method([,] = function*() {}()) {}',
    'async *method([...{ 0: v, 1: w, 2: x, 3: y, length: z }] = [7, 8, 9]) {}',
    'async *method({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    'async *method({ x: y = go_to_hell } = {}) {}',
    'async *method({ x: y } = { x: 23 }) {}',
    'async *method({}) {}',
    'static async *method([[] = function() { a += 1; }()]) {}',
    'static async *method([[...x] = function() { a += 1; }()]) {}',
    'static async *method([x]) {}',
    'static async *method([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {}',
    'static async *method([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }]) {}',
    'static async *method([ , , ...x]) {}',
    'static async *method([...{ length }]) {}',
    'static async *method([[...x] = [2, 1, 3]] = []) {}',
    'static async *method({ [function(){}]: x } = {}) {}',
    'static async *method({...rest} = {a: 3, b: 4}) {}',
    'static async *method({ x: [y], }) {}',
    'static async *method({ x: y, }) {}',
    'static x(){}',
    'static *x(){}',
    'static async x(){}',
    'static get x(){}',
    'static set x(y){}',
    'static [x](){}',
    'static async [x](){}',
    'static get [x](){}',
    'static set [x](y){}',
    'static *[x](){}',
    'static 8(){}',
    'static async 8(){}',
    'static get 8(){}',
    'static set 8(y){}',
    'static *8(){}',
    'static "x"(){}',
    'static async "x"(){}',
    'static get "x"(){}',
    'static set "x"(y){}',
    '*method([x]) {}',
    '*method([[] = function() { a += 1; return function*() {}; }()]) {}',
    '*method([x = 23]) {}',
    '*method([_, x]) {}',
    '*method([, ...x]) {}',
    '*method([[,] = g()] = [[]]) {}',
    '*method([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] = []) {}',
    '*method([x] = g) {}',
    "['prototype']() {}",
    'get foo() { }',
    'prototype() {} ',
    '[foo](){}',
    '*ident(){}',
    '*"str"(){}',
    '*15(){}',
    '*[expr](){}',
    'static(){}',
  ]) {
    it(`(class { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { ${arg}})`);
      });
    });

    it(`class C { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg}}`);
      });
    });

    it(`(class { ${arg}}) (class { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { ${arg}}) (class { ${arg}})`);
      });
    });

    it(`function foo() { (class { ${arg}}) }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { (class { ${arg}}) }`);
      });
    });

    it(`(class extends Base  { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class extends Base  { ${arg}})`);
      });
    });

    it(`class extends Base  { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C extends Base  { ${arg}}`);
      });
    });
  }

  for (const arg of ['async', 'this', 'null', 'true', 'false', 'eval', 'arguments', 'get', 'set']) {
    it(`(class x {${arg} : x})`, () => {
      t.throws(() => {
        parseSource(`(class x {${arg} : x})`);
      });
    });
    it(`(class x {${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {${arg}(){}})`);
      });
    });
    it(`(class x { static ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static ${arg}(){}})`);
      });
    });

    it(`(class x { static * ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static * ${arg}(){}})`);
      });
    });

    it(`(class x { static async ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static async ${arg}(){}})`);
      });
    });

    it(`(class x { static async *${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static async *${arg}(){}})`);
      });
    });

    it(`(class x { static get ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static get ${arg}(){}})`);
      });
    });

    it(`(class x { static set ${arg}(x){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static set ${arg}(x){}})`);
      });
    });

    it(`(class x { async ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { async ${arg}(){}})`);
      });
    });

    it(`(class x { async *${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { async *${arg}(){}})`);
      });
    });

    it(`(class x {*${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {*${arg}(){}})`);
      });
    });

    it(`(class x {get ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {get ${arg}(){}})`);
      });
    });

    it(`(class x {set ${arg}(x){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {set ${arg}(x){}})`);
      });
    });
  }
  pass('Expressions - Class (pass)', [
    outdent`
      class A {
        constructor() {
          count++;
        }
        increment() {
          count++;
        }
        decrement() {
          count--;
        }
        getCount()
        {
          return count;
        }
        1() { return 1; }
        2() { return 2; }
        1.1() { return 1.1; }
        2.2() { return 2.2; }
        static [1+3]() { return 4; }
        [1.1+1]() { return 2.1; }
        ["foo"+1]() { return "foo1"; }
        [sym1](){return "bart";}
      }
    `,
    outdent`
      class SimpleParent {
          constructor() {
              this.foo = 'SimpleParent';
          }
      }

      let calls_to_ConstructorCountingParent = 0;
      class ConstructorCountingParent {
          constructor() {
              calls_to_ConstructorCountingParent++;
          }
      }

      class UninitializedThisReturningArgumentConstructor extends SimpleParent {
          constructor(arg) {
              return arg;
          }
      };

      class InitializedThisReturningArgumentConstructor extends SimpleParent {
          constructor(arg) {
              super();
              return arg;
          }
      };
    `,
    { code: 'class await { }', options: { ranges: true } },
    { code: 'class x extends await { }', options: { ranges: true } },
    'class a extends [] { static set [a] ({w=a}) { for (;;) a } }',
    'class x extends {} {}',

    'class x{[x](a=await){}}',
    'class x{[x](a=await){}}',
    'class x{[x](await){}}',
    '(class x {}.foo)',
    outdent`
      var C = class { static async *gen() {
          callCount += 1;
          yield [...yield];
      }}
    `,
    outdent`
      var gen = {
        async *method() {
          callCount += 1;
          yield [...yield];
        }
      }.method;
    `,
    outdent`
      class C { async *gen() {
          yield {
              ...yield,
              y: 1,
              ...yield yield,
            };
      }}
    `,
    '(class x {}.foo())',
    '(class x {}())',
    'f = ([xCls = class X {}]) => {}',
    '(class A extends B { constructor() { super() } })',

    { code: 'class x { foo(x=new (await)()){} }', options: { webcompat: true, ranges: true } },
    { code: 'class x { foo(x=await){} }', options: { webcompat: true, ranges: true } },
    { code: 'class x extends feh(await) { }', options: { webcompat: true, ranges: true } },
    { code: 'class x { foo(await){} }', options: { webcompat: true, ranges: true } },
    { code: 'class v extends[x] {}', options: { webcompat: true } },
    { code: 'class v extends.9 {}', options: { webcompat: true } },
    { code: '(class A extends B { constructor() { super() } })', options: { webcompat: true, ranges: true } },
    'f = ([cls = class {}]) => {}',
    'f = ([xCls2 = class { name() {} }]) => {}',
    { code: '(class x{}())', options: { ranges: true } },
    { code: '(class x{}.foo)', options: { ranges: true } },
    { code: '(class x{}.foo())', options: { ranges: true } },
    /*[
      'class a\\u{77}ait {}',
      Context.None,
      {}], */
    { code: 'class await {}', options: { ranges: true } },
    { code: 'class x { [await](){} }', options: { ranges: true } },
    { code: 'class async {}', options: { ranges: true } },
    { code: 'x = class{} / x', options: { ranges: true } },
    '(class{} \n / foo / g)',
    'f = ([xCls2 = class { static name() {} }]) => {}',
    'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
    '(class A {})',
    { code: '(class A {; ;; ;})', options: { ranges: true } },
    { code: '(class A extends B {})', options: { ranges: true } },
    { code: '(class A extends foo() {})', options: { ranges: true } },
    '(class A extends {} {})',
    { code: '(class A {a(){}})', options: { ranges: true } },
    { code: '(class A {constructor(){}})', options: { ranges: true } },
    { code: '(class A {static constructor(){}})', options: { ranges: true } },
    { code: '(class A {async foo(){}})', options: { ranges: true } },
    { code: '(class A {*foo(){}})', options: { ranges: true } },

    { code: '(class A {get foo(){}})', options: { ranges: true } },
    { code: '(class o {f(){ function x(){}}})', options: { ranges: true } },
    '(class o {f(f) { }})',
    { code: '(class M { static foo() {} get foo() {} set foo(x) {}})', options: { ranges: true } },
    { code: '(class OnlyStaticSetter { static set setter(x) { p("ssetter " + x) } })', options: { ranges: true } },
    '(class A {set foo(x){}})',
    '(class A {set get(x){}})',
    { code: '(class A {set(){} get(){} async(){}})', options: { ranges: true } },
    { code: '(class A {"x"(){}})', options: { ranges: true } },
    '(class A {"constructor"(){}})',
    { code: '(class A {async "foo"(){}})', options: { ranges: true } },
    { code: '(class A {*"foo"(){}})', options: { ranges: true } },
    '(class A {get "foo"(){}})',
    '(class A {get "set"(){}})',
    '(class A {set "foo"(x){}})',
    { code: '(class A {set "get"(x){}})', options: { ranges: true } },
    { code: '(class A {"set"(){} "get"(){} "async"(){}})', options: { ranges: true } },
    { code: '(class A {1(){}})', options: { ranges: true } },
    { code: '(class A {async 3(){}})', options: { ranges: true } },
    { code: '(class A {*4(){}})', options: { ranges: true } },
    '(class A {async * 34(){}})',
    '(class A {get 5(){}})',
    '(class A {set 9(x){}})',
    { code: '(class A {[a](){}})', options: { ranges: true } },
    { code: '(class A {*[foo](){}})', options: { ranges: true } },
    '(class A {get [foo](){}})',
    { code: '(class A {set [foo](x){}})', options: { ranges: true } },
    '(class x { *[y](){}})',
    '(class x { get [y](){}})',
    '(class x { set [y](z){}})',
    '(class x { async *[y](){}})',
    '(class x{*foo(){}})',
    '(class x{*[x](){}})',
    '(class x{*"foo"(){}})',
    '(class x{*555(){}})',
    '(class x{async *foo(a){}})',
    '(class x{async *[x](a){}})',
    '(class x{async *"foo"(a){}})',
    '(class x{async *555(a){}})',

    '(class A {static a(){}})',
    '(class A {static constructor(){}})',
    '(class A {static get foo(){}})',
    '(class A {static set foo(x){}})',
    '(class A {static "x"(){}})',
    '(class A {static "constructor"(){}})',
    '(class A {static get "foo"(){}})',
    '(class A {static set "foo"(x){}})',
    '(class A {static 2(){}})',
    '(class A {async foo(){}})',
    '(class A {*foo(){}})',
    '(class A {get foo(){}})',
    '(class A {get set(){}})',
    '(class A {set foo(x){}})',
    '(class A {set get(x){}})',
    '(class A {set(){} get(){} async(){}})',
    '(class A {"x"(){}})',
    '(class A {"constructor"(){}})',
    '(class A {async "foo"(){}})',
    '(class A {*"foo"(){}})',
    '(class A {get "foo"(){}})',
    '(class A {get "set"(){}})',
    '(class A {set "foo"(x){}})',
    '(class A {set "get"(x){}})',
    '(class A {"set"(){} "get"(){} "async"(){}})',
    '(class A {static "constructor"(){}})',
    '(class A {static get "foo"(){}})',
    '(class A {static set "foo"(x){}})',
    '(class A {static 2(){}})',
    '(class A {async foo(){}})',
    '(class A {*foo(){}})',
    '(class A {get foo(){}})',
    '(class A {get set(){}})',
    '(class A {set foo(x){}})',
    '(class A {set get(x){}})',
    '(class A {set(){} get(){} async(){}})',
    '(class A {"x"(){}})',
    '(class A {"constructor"(){}})',
    '(class A {async "foo"(){}})',
    'var C = class { static async *gen() { yield { ...yield, y: 1, ...yield yield, };}}',
    {
      code: 'class c { static *[false]() { "use strict"; } set [this] (q) { "use strict"; } set [true] (u) { "use strict"; } }',
      options: { ranges: true },
    },
    { code: 'var C = class { static async *gen() { yield [...yield yield]; }}', options: { ranges: true } },
    '(class A {*"foo"(){}})',
    '(class A {get "foo"(){}})',
    '(class A {get "set"(){}})',
    '(class A {set "foo"(x){}})',
    '(class A {set "get"(x){}})',
    '(class A {"set"(){} "get"(){} "async"(){}})',
    '(class A {async * 34(){}})',
    '(class A {get 5(){}})',
    '(class A {set 9(x){}})',
    '(class A {[a](){}})',
    '(class A {*[foo](){}})',
    '(class A {get [foo](){}})',
    '(class A {set [foo](x){}})',
    '(class x { *[y](){}})',
    '(class x { get [y](){}})',
    '(class x { set [y](z){}})',
    '(class x { async *[y](){}})',
    '(class x{*foo(){}})',
    '(class x{*[x](){}})',
    '(class x{*"foo"(){}})',
    '(class A {async * 34(){}})',
    '(class A {get 5(){}})',
    '(class A {set 9(x){}})',
    '(class A {[a](){}})',
    '(class A {*[foo](){}})',
    '(class A {get [foo](){}})',
    '(class A {set [foo](x){}})',
    '(class x { *[y](){}})',
    '(class x { get [y](){}})',
    '(class x { set [y](z){}})',
    '(class x { async *[y](){}})',
    '(class x{*foo(){}})',
    '(class x{*[x](){}})',
    '(class x{*"foo"(){}})',
    '(class A {set(){} get(){} async(){}})',
    '(class A {"x"(){}})',
    '(class A {"constructor"(){}})',
    '(class A {async "foo"(){}})',
    '(class A {*"foo"(){}})',
    '(class A {get "foo"(){}})',
    '(class A {get "set"(){}})',
    '(class A {set "foo"(x){}})',
    '(class A {set "get"(x){}})',
    '(class A {"set"(){} "get"(){} "async"(){}})',
    '(class A {1(){}})',
    '(class x { get [y](){}})',
    '(class x { set [y](z){}})',
    '(class x { async *[y](){}})',
    '(class x{*foo(){}})',
    '(class x{*[x](){}})',
    '(class x{*"foo"(){}})',
    '(class x{*555(){}})',
    '(class x{async *foo(a){}})',
    '(class x{async *[x](a){}})',
    '(class x{async *"foo"(a){}})',
    '(class x{async *555(a){}})',

    '(class A {static a(){}})',
    '(class A {static constructor(){}})',
    '(class A {static get "foo"(){}})',
    '(class A {static set "foo"(x){}})',
    '(class A {static 2(){}})',
    'class A extends B { *get() {} }',
    'class a { async *get(){} }',
    'class A { [1n](){} }',
    { code: 'class A { static }', options: { next: true, sourceType: 'module' } },
    { code: 'class A { static; }', options: { next: true, sourceType: 'module' } },
    { code: 'class A { static = 1 }', options: { next: true, sourceType: 'module' } },
    outdent`
      new class {
        start() {
          new class {
            constructor() {}
          }
        }
        constructor() {}
      }
    `,
    {
      code: 'class C {\nstatic accessor = 42;\nstatic set = 42;\nstatic get = 42;\nstatic async = 42;\nstatic static = 42;}',
      options: { next: true, loc: true, ranges: true },
    },
  ]);
});
