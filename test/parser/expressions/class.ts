import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

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
        parseSource(`(class {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`class {${arg}}`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class extends Base {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class extends Base {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`bar, (class {${arg}})`, undefined, Context.None);
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
        parseSource(`class C { get name(${arg}) {} }`, undefined, Context.None);
      });
    });

    it(`class C { get name(${arg}) {} }`, () => {
      t.throws(() => {
        parseSource(`class C { get name(${arg}) {} }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; class C { get name(${arg}) {} }`, () => {
      t.throws(() => {
        parseSource(`"use strict"; class C { get name(${arg}) {} }`, undefined, Context.None);
      });
    });

    it(`(class C { get name(${arg}) {} })`, () => {
      t.throws(() => {
        parseSource(`(class C { get name(${arg}) {} })`, undefined, Context.None);
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
        parseSource(`class C {${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.OptionsWebCompat);
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
        parseSource(`class C {${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.OptionsWebCompat);
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`if (true) { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`if (true) { ${arg} }`, undefined, Context.None);
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
        parseSource(`bar, ${arg};`, undefined, Context.None);
      });
    });

    it(`var foo = ${arg};`, () => {
      t.throws(() => {
        parseSource(`var foo = ${arg};`, undefined, Context.None);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, undefined, Context.None);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, undefined, Context.OptionsWebCompat);
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, undefined, Context.None);
      });
    });

    it(`(${arg})`, () => {
      t.throws(() => {
        parseSource(`(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of ['constructor() {}; constructor() {}']) {
    it(`class C {${arg}}`, () => {
      t.throws(() => {
        parseSource(`class C {${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.OptionsWebCompat);
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
        parseSource(`class C {${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'constructor() {}',
    'static constructor() {}',
    'static get constructor() {}',
    'static set constructor(_) {}',
    'static *constructor() {}',
    `method() {
       new class { constructor() {} }
     }
     constructor() {}`,
    `method() {
       new class {
         method() {
           new class { constructor() {} }
         }
         constructor() {}
       }
     }
     constructor() {}`,
  ]) {
    it(`class C {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C {${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C {${arg}})`, undefined, Context.None);
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
        parseSource(`(class {${arg}})`, undefined, Context.None);
      });
    });
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`(class {${arg}})`, undefined, Context.None);
      });
    });

    it(`(class {${arg}})`, () => {
      t.throws(() => {
        parseSource(`bar, class {${arg}}`, undefined, Context.None);
      });
    });

    it(`var foo =  class {${arg}}`, () => {
      t.throws(() => {
        parseSource(`var foo = class {${arg}}`, undefined, Context.None);
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
        parseSource(`(${arg})`, undefined, Context.None);
      });
    });

    it(`bar, ${arg};`, () => {
      t.doesNotThrow(() => {
        parseSource(`bar, ${arg};`, undefined, Context.None);
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
        parseSource(`(class {${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`(class { get ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { get ${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`(class { static ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static ${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`(class { static get ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static get ${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`(class { static *${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static *${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`class C {${arg}() {}};`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {${arg}() {}}`, undefined, Context.None);
      });
    });

    it(`class C { static set ${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { static set ${arg}(v) {}}`, undefined, Context.None);
      });
    });
  }

  fail('Expressions - Class', [
    ['0, class { static method(...x = []) { } };', Context.None],
    ['(class { get [yield]() { return "get yield"; }})', Context.Strict],
    ['(class { get [yield]() { return "get yield"; }}) (class { get [yield]() { return "get yield"; }})', Context.None],
    ['function foo() { (class { get [yield]() { return get yield"; }}) }', Context.None],
    [
      '(class { set [yield](param) { yieldSet = param; }}) (class { set [yield](param) { yieldSet = param; }})',
      Context.None,
    ],
    ['function foo() { (class { set [yield](param) { yieldSet = param; }}', Context.None],
    ['class foo { *async x(){} }', Context.None],
    ['class foo { async *(){} }', Context.None],
    ['class foo { async get x(){} }', Context.None],
    ['class foo { async set x(y){} }', Context.None],
    ['class foo { async x : 0 }', Context.None],
    ['class foo { async : 0 }', Context.None],
    ['class foo { async static x(){} }', Context.None],
    ['class foo { "static *async x(){} }', Context.None],
    ['class foo { static async *(){} }', Context.None],
    ['class foo { static async get x(){} }', Context.None],
    ['class foo { static async set x(y){} }', Context.None],
    ['class foo { static async x : 0 }', Context.None],
    ['class A extends (() => { with (a) {} }) {}', Context.None],
    ['class public {}', Context.None],
    ['class static {}', Context.None],
    ['class l\u0065t {};', Context.None],
    ['class A { async* f() { () => yield a; } }', Context.None],
    ['class foo { static async : 0 }', Context.None],
    ['class E0 { 0123() {} }', Context.None],
    ['class E1 { 0123.1() {} }', Context.None],
    ['class yield { }', Context.None],
    ['class x { x = new y<a>() }', Context.OptionsNext],
    ['class x { x = new y<a,>() }', Context.OptionsNext],
    ['class x { x = new y<a,b>() }', Context.OptionsNext],
    ['class x { x = y<a>() }', Context.OptionsNext],
    ['class x { x = new y<a,>() }', Context.OptionsNext],
    ['class x { x = new y<a,b>() }', Context.OptionsNext],
    ['class x { x = new y<a>() }', Context.None],
    ['class x { x = new y<a,>() }', Context.None],
    ['class x { x = new y<a,b>() }', Context.None],
    ['class eval { }', Context.None],
    ['class switch() {}', Context.None],
    ['class let { }', Context.None],
    [String.raw`class impl\u0065ments {}`, Context.None],
    ['classfunction yield(yield) { yield: yield (yield + yield(0)); }', Context.None],
    [String.raw`class l\u0065t { }`, Context.None],
    ['class E0 { static prototype() {} }', Context.None],
    ['class E1 { static get prototype() {} }', Context.None],
    ['class E2 { static set prototype(x) {} }', Context.None],
    ['function () { class A extends 0       { } }', Context.None],
    ['function () { class A extends "test"  { } }', Context.None],
    ['function () { class A extends {}      { } }', Context.None],
    ['function () { class A extends undefined { } }', Context.None],
    ['super[1];', Context.None],
    ['class x{[x](a=await y){}}', Context.None],
    ['class C extends --x {}', Context.None],
    ['class C extends a !== b {}', Context.None],
    ['class C extends a *= b {}', Context.None],
    ['class C extends a => b {}', Context.None],
    ['class C extends a => {} {}', Context.None],
    ['class C extends async a => b {}', Context.None],
    ['class C extends delete x {}', Context.None],
    ['class C extends x,y {}', Context.None],
    ['class C extends s ** y {}', Context.None],
    ['class C extends super() {}', Context.None],
    ['class C extends super.foo {}', Context.None],
    ['class C extends typeof x {}', Context.None],
    ['class C extends void x {}', Context.None],
    ['class C extends [...x=y] = b {}', Context.None],
    ['class x { foo(x=new (yield)()){} }', Context.None],
    ['class x { foo(x=yield y){} }', Context.None],
    ['class x { foo(x=yield){} }', Context.None],
    ['class x { foo(yield){} }', Context.None],
    ['class x extends feh(yield y) { }', Context.None],
    ['class x extends feh(yield) { }', Context.None],
    ['class x extends yield y { }', Context.None],
    ['class x extends yield { }', Context.None],
    ['class yield { }', Context.None],
    ['class x { [yield](){} }', Context.None],
    ['class x { [yield y](){} }', Context.None],
    ['function *f(){  class yield { }  }', Context.None],
    ['function *f(){  class x extends yield { }  }', Context.None],
    ['function *f(){  class x extends yield y { }  }', Context.None],
    ['function *f(){  class x { foo(yield){} }  }', Context.None],
    ['function *f(){  class x { foo(x=yield){} }  }', Context.None],
    ['function *f(){  class x { foo(x=yield y){} }  }', Context.None],
    ['function *f(){  class x { foo(x=new (yield)()){} }  }', Context.None],
    ['class x extends await y { }', Context.Strict],
    ['class x extends feh(await y) { }', Context.Strict],
    ['async function f() {   class x { await y(){} }   }', Context.None],
    ['async function f() {   class x { [await](){} }   }', Context.None],
    ['class arguments {};', Context.None],
    ['var x = class eval {};', Context.None],
    ['function() { class A { m() { A = 0; } }; new A().m(); }', Context.None],
    ['function() { new (class A { m() { A = 0; } }).m(); }', Context.None],
    ['function() { class A { get x() { A = 0; } }; new A().x; }', Context.None],
    ['function() { (new (class A { get x() { A = 0; } })).x; }', Context.None],
    ['function() { class A { set x(_) { A = 0; } }; new A().x = 15; }', Context.None],
    ['function() { (new (class A { set x(_) { A = 0; } })).x = 15; }', Context.None],
    ['function () { class A { constructor() { A = 0; } }; new A(); }', Context.None],
    ['(class { adf&/()})', Context.None],
    ['(class { adf &/()})', Context.None],
    //['class aw\\u0061it {}', Context.Strict | Context.Module],
    ['(class b {)', Context.None],
    ['(class b )', Context.None],
    ['(class b {-})', Context.None],
    ['(class b {a:})', Context.None],
    ['(class b {#a:})', Context.None],
    ['(class extends a,b {)', Context.None],
    ['(class {a:0})', Context.None],
    ['(class switch() {})', Context.None],
    ['(class eval {a:0})', Context.None],
    ['(class yield {a:0})', Context.None],
    ['class x{async *%x(a){}}', Context.None],
    ['(class x{async *%x(a){}})`;', Context.None],
    ['(class x extends a = b {})', Context.None],
    ['(class x {[x]z){}})', Context.None],
    ['(class x {foo, bar(){}})', Context.None],
    ['(class x {foo: x})', Context.None],
    ['(class x { async [x]s){}})', Context.None],
    ['(class x { `constructor`(){} })', Context.None],
    ['class x extends a = b {}', Context.None],
    ['class x {[x]z){}}', Context.None],
    ['class x {foo, bar(){}}', Context.None],
    ['class x {foo: x}', Context.None],
    ['class x { async [x]s){}}', Context.None],
    ['class x { [yield y](){} }', Context.None],
    ['class x { [yield](){} }', Context.None],
    ['class x extends () => x {}', Context.None],
    ['class X extends function(){ with(obj); } {}', Context.None],
    ['class let {}`;', Context.None],
    ['(class A {get constructor(){}})', Context.None],
    ['(class A {set constructor(x){}})', Context.None],
    ['(class A {*constructor(){}})', Context.None],
    ['(class A {async get foo(){}})', Context.None],
    ['(class A {* get foo(){}})', Context.None],
    ['(class A {async set foo(x){}})', Context.None],
    ['(class A {* set foo(x){}})', Context.None],
    ['var C = class await {};', Context.Strict | Context.Module],
    ['(class A {async get "foo"(){}})', Context.None],
    ['(class A {* get "foo"(){}})', Context.None],
    ['(class A {async set "foo"(x){}})', Context.None],
    ['(class A {* set "foo"(x){}})', Context.None],
    ['(class A {async get 7(){}})', Context.None],
    ['(class A {* get 8(){}})', Context.None],
    ['(class A {async set 11(x){}})', Context.None],
    ['(class A {* set 12(x){}})', Context.None],
    ['var C = class { static async *gen() { yield: ; }}', Context.None],
    ['(class A {* set 12(x){}})', Context.None],

    ['class x { static set prototype(x){} }', Context.None],
    ['class x { static *prototype(){} }', Context.None],
    ['class x { static prototype(){} }', Context.None],
    ['class x { static async *prototype(){} }', Context.None],
    [String.raw`class x { static async *prot\u006ftype(){} }`, Context.None],
    ['class x { static "prototype"(){} }', Context.None],
    ['class w {  t.x(){}  }', Context.None],
    ['class x extends ()=>1 {}', Context.None],
    ['class X {    async constructor() {}   }', Context.None],
    ['class x{   async static static(){}    }', Context.None],
    ['class x {    static static f(){}    }', Context.None],
    ['class x {    * * f(){}    }', Context.None],
    ['class x {    set set f(x){}    }', Context.None],
    ['class x {    static prototype(){}    }', Context.None],
    ['class x { async get foo(){ }}', Context.None],
    ['class x { static / foo(){} }', Context.None],
    ['class x{[yield](a){}}', Context.None],
    ['class x{*[yield](a){}}', Context.None],
    ['class x extends yield {}', Context.None],
    ['function *f(){   class x extends yield {}    }', Context.None],
    ['for (class x extends a in b {} in c);', Context.None],
    ['for (class x { [a](){} } in c);', Context.None],
    ['class x extends y { [super.foo](){} }', Context.None],
    ['class x extends super.foo {}', Context.None],
    ['class x { [super()](){} }', Context.None],
    //    ['class x extends y { [super()](){} }', Context.None],
    ['class a { constructor(){   class x { [super()](){} }    }}', Context.None],
    //['class a { constructor(){   class x extends y { [super()](){} }    }}', Context.None],
    ['class a { constructor(){      class x extends super() {}    }}', Context.None],
    ['class x \n /foo/ {}', Context.None],
    ['class x { x \n /foo/ }', Context.None],
    ['class x { set \n /foo/ }', Context.None],
    ['class x { y(z, \n /foo/){} }', Context.None],
    ['class x { y()\n /foo/{} }', Context.None],
    ['class x { y() {}\n /foo/ }', Context.None],
    ['let c = class x { \n /foo/ }', Context.None],
    ['let c = class x { get \n /foo/ }', Context.None],
    ['class A {"x"){}}', Context.None],
    ['class A {"x"{}}', Context.None],
    ['(class A {constructor(){}; constructor(){}})', Context.None],
    ['(class A {a(){}; constructor(){}; constructor(){}})', Context.None],
    ['(class A {a(){}; constructor(){}; a(){}; a(){}; a(){}; constructor(){}; a(){}})', Context.None],
    ['(class A {static constructor(){}; constructor(){}; constructor(){}})', Context.None],
    ['(class A {foo, bar(){}})', Context.None],
    ['class A {async get foo(){}}', Context.None],
    ['(class A {set constructor(x){}})', Context.None],
    ['(class A {async constructor(){}})', Context.None],
    ['class a {**=f(){}', Context.None],
    ['class a {*=f(){}}', Context.None],
    ['class A {async *=f(){}}', Context.None],
    ['(class A {async *constructor(){}})', Context.None],
    ['(class A {get "constructor"(){}})', Context.None],
    ['(class A {async "constructor"(){}})', Context.None],
    ['(class A {constructor(){}; constructor(){};})', Context.None],
    ['(class A {get "constructor"(){}})', Context.None],
    ['None class{}\n/foo/', Context.None],
    [
      `class C extends (function B() {
     with ({});
     return B;
   }()) {}`,
      Context.None,
    ],
    ['async function f(){   (fail = class extends (await x) {}) => {}   }', Context.None],
    ['C = class let {};', Context.None],
    ['class A {* get [x](){}}', Context.None],
    ['class A {async get [x](){}}', Context.None],
    ['class x extends yield {}', Context.None],
    ['class x { await y(){} }', Context.None],
    ['class x { foo(x=new (await y)()){} }', Context.None],
    ['class x { foo(x=new (await y)()){} }', Context.Strict | Context.Module],
    ['class x { foo(x=await y){} }', Context.None],
    ['class A {...', Context.None],
    ['(class A {* set [foo](x){}})', Context.None],
    ['(class A {async get [foo](){}})', Context.None],
    ['(class x{get *foo(){}})', Context.None],
    ['(class x{get *[x](){}})', Context.None],
    ['(class x{get *"foo"(){}})', Context.None],
    ['(class x{get *555(){}})', Context.None],
    ['(class x{set *foo(a){})', Context.None],
    ['(class x{set *[x](a){}})', Context.None],
    ['(class x{set *"foo"(a){}})', Context.None],
    ['(class x{set *555(a){}})', Context.None],
    ['(class x{set *%x(a){}})', Context.None],
    ['(class x{static *%x(){}})', Context.None],
    ['(class v extends.foo {})', Context.None],
    ['(class x{static get *foo(){}})', Context.None],
    ['(class x{static get *[x](){}}`);', Context.None],
    ['(class x{static get *"foo"(){}})', Context.None],
    ['(class x{static get *555(){}})', Context.None],
    ['0, class { static method(...x = []) {} };', Context.None],
    ['0, class { static method(...a,) {} };', Context.None],
    ['class x{static get *%x(){}}', Context.None],
    ['(class x{static set *foo(a){}})', Context.None],
    ['(class x{static set *[x](a){}})', Context.None],
    ['(class x{static set *"foo"(a){}})', Context.None],
    ['(class x{static set *555(a){}})', Context.None],
    ['(class x{static set *%x(a){}})', Context.None],
    ['(class A extends B { method() { super() } })', Context.None],
    ['(class A extends B { method() { super() } })', Context.OptionsWebCompat],
    ['(class x{static async *%x(a){}})', Context.None],
    ['(class x{static async *%x(a){}})', Context.None],
    ['(class x{async *get 8(){}})', Context.None],
    ['(class x{static *async 8(){}})', Context.None],
    ['(class x{static *get 8(){}})', Context.None],
    ['(class x{static *set 8(y){}})', Context.None],
    ['(class x{static *async "x"(){}})', Context.None],
    ['(class x{static *get "x"(){}}', Context.None],
    ['(class { static *get [x](){}})', Context.None],
    ['(class { static *get [x](){}}) (class { static *get [x](){}})', Context.None],
    ['var foo = (class { static *get [x](){}})', Context.None],
    ['(class { static *set [x](y){}})', Context.None],
    ['function foo() { (class { static *get [x](){}}) }', Context.None],
    ['(class { static *set [x](y){}}) (class { static *set [x](y){}})', Context.None],
    ['var foo = (class { static *set [x](y){}})', Context.None],
    ['function foo() { (class { static *set [x](y){}}) }', Context.None],
    ['(class A { ["async"] a() {} })', Context.None],
    ['(class A { ["get"] a() {} })', Context.None],
    ['(class A { static *prototype() {} })', Context.None],
    ['(class A { static prototype() {} })', Context.None],
    ['(class A { static get prototype() {} })', Context.None],
    ['(class A { static set prototype(_) {} })', Context.None],
    ['(class A { static *prototype() {} })', Context.None],
    ['(class A { static prototype() {} })', Context.None],
    ['(class A { static *prototype() {} })', Context.None],
    ['(class A { static prototype() {} })', Context.None],
    ['(class A { static *get [x](){} })', Context.None],
    ['(class A { static *set [x](y){}})', Context.None],
    ['async function f(foo = class y extends (await f) {}){}', Context.None],
    ['new class { constructor() {} start() { new class { constructor() {}}} constructor() {}}', Context.None],
    ['new class { constructor() {} start() { new class { } } constructor() {}}', Context.None],
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
    `static async *gen() {
      yield {
          ...yield,
          y: 1,
          ...yield yield,
        };
  }`,
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
        parseSource(`(class { ${arg}})`, undefined, Context.None);
      });
    });

    it(`class C { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg}}`, undefined, Context.None);
      });
    });

    it(`(class { ${arg}}) (class { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { ${arg}}) (class { ${arg}})`, undefined, Context.None);
      });
    });

    it(`function foo() { (class { ${arg}}) }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { (class { ${arg}}) }`, undefined, Context.None);
      });
    });

    it(`(class extends Base  { ${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class extends Base  { ${arg}})`, undefined, Context.None);
      });
    });

    it(`class extends Base  { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C extends Base  { ${arg}}`, undefined, Context.None);
      });
    });
  }

  for (const arg of ['async', 'this', 'null', 'true', 'false', 'eval', 'arguments', 'get', 'set']) {
    it(`(class x {${arg} : x})`, () => {
      t.throws(() => {
        parseSource(`(class x {${arg} : x})`, undefined, Context.None);
      });
    });
    it(`(class x {${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {${arg}(){}})`, undefined, Context.None);
      });
    });
    it(`(class x { static ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { static * ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static * ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { static async ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static async ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { static async *${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static async *${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { static get ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static get ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { static set ${arg}(x){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { static set ${arg}(x){}})`, undefined, Context.None);
      });
    });

    it(`(class x { async ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { async ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x { async *${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x { async *${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x {*${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {*${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x {get ${arg}(){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {get ${arg}(){}})`, undefined, Context.None);
      });
    });

    it(`(class x {set ${arg}(x){}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class x {set ${arg}(x){}})`, undefined, Context.None);
      });
    });
  }
  pass('Expressions - Class (pass)', [
    [
      `class A {
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
      }`,
      Context.None,
    ],
    [
      `class SimpleParent {
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
      };`,
      Context.None,
    ],
    ['class await { }', Context.None | Context.OptionsRanges],
    ['class x extends await { }', Context.None | Context.OptionsRanges],
    ['class a extends [] { static set [a] ({w=a}) { for (;;) a } }', Context.None],
    ['class x extends {} {}', Context.None],

    ['class x{[x](a=await){}}', Context.None],
    ['class x{[x](a=await){}}', Context.None],
    ['class x{[x](await){}}', Context.None],
    ['(class x {}.foo)', Context.None],
    [
      `var C = class { static async *gen() {
        callCount += 1;
        yield [...yield];
    }}`,
      Context.None,
    ],
    [
      `var gen = {
          async *method() {
            callCount += 1;
            yield [...yield];
          }
        }.method;`,
      Context.None,
    ],
    [
      `class C { async *gen() {
            yield {
                ...yield,
                y: 1,
                ...yield yield,
              };
        }}`,
      Context.None,
    ],
    ['(class x {}.foo())', Context.None],
    ['(class x {}())', Context.None],
    ['f = ([xCls = class X {}]) => {}', Context.None],
    ['(class A extends B { constructor() { super() } })', Context.None],

    ['class x { foo(x=new (await)()){} }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['class x { foo(x=await){} }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['class x extends feh(await) { }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['class x { foo(await){} }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['class v extends[x] {}', Context.OptionsWebCompat],
    ['class v extends.9 {}', Context.OptionsWebCompat],
    ['(class A extends B { constructor() { super() } })', Context.OptionsWebCompat | Context.OptionsRanges],
    ['f = ([cls = class {}]) => {}', Context.None],
    ['f = ([xCls2 = class { name() {} }]) => {}', Context.None],
    ['(class x{}())', Context.OptionsRanges],
    ['(class x{}.foo)', Context.OptionsRanges],
    ['(class x{}.foo())', Context.OptionsRanges],
    /*[
      'class a\\u{77}ait {}',
      Context.None,
      {}], */
    ['class await {}', Context.OptionsRanges],
    ['class x { [await](){} }', Context.OptionsRanges],
    ['class async {}', Context.OptionsRanges],
    ['x = class{} / x', Context.OptionsRanges],
    ['(class{} \n / foo / g)', Context.None],
    ['f = ([xCls2 = class { static name() {} }]) => {}', Context.None],
    ['f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}', Context.None],
    ['(class A {})', Context.None],
    ['(class A {; ;; ;})', Context.OptionsRanges],
    ['(class A extends B {})', Context.OptionsRanges],
    ['(class A extends foo() {})', Context.OptionsRanges],
    ['(class A extends {} {})', Context.None],
    ['(class A {a(){}})', Context.OptionsRanges],
    ['(class A {constructor(){}})', Context.OptionsRanges],
    ['(class A {static constructor(){}})', Context.OptionsRanges],
    ['(class A {async foo(){}})', Context.OptionsRanges],
    ['(class A {*foo(){}})', Context.OptionsRanges],

    ['(class A {get foo(){}})', Context.OptionsRanges],
    ['(class o {f(){ function x(){}}})', Context.OptionsRanges],
    ['(class o {f(f) { }})', Context.None],
    ['(class M { static foo() {} get foo() {} set foo(x) {}})', Context.OptionsRanges],
    ['(class OnlyStaticSetter { static set setter(x) { p("ssetter " + x) } })', Context.OptionsRanges],
    ['(class A {set foo(x){}})', Context.None],
    ['(class A {set get(x){}})', Context.None],
    ['(class A {set(){} get(){} async(){}})', Context.OptionsRanges],
    ['(class A {"x"(){}})', Context.OptionsRanges],
    ['(class A {"constructor"(){}})', Context.None],
    ['(class A {async "foo"(){}})', Context.OptionsRanges],
    ['(class A {*"foo"(){}})', Context.OptionsRanges],
    ['(class A {get "foo"(){}})', Context.None],
    ['(class A {get "set"(){}})', Context.None],
    ['(class A {set "foo"(x){}})', Context.None],
    ['(class A {set "get"(x){}})', Context.OptionsRanges],
    ['(class A {"set"(){} "get"(){} "async"(){}})', Context.OptionsRanges],
    ['(class A {1(){}})', Context.OptionsRanges],
    ['(class A {async 3(){}})', Context.OptionsRanges],
    ['(class A {*4(){}})', Context.OptionsRanges],
    ['(class A {async * 34(){}})', Context.None],
    ['(class A {get 5(){}})', Context.None],
    ['(class A {set 9(x){}})', Context.None],
    ['(class A {[a](){}})', Context.OptionsRanges],
    ['(class A {*[foo](){}})', Context.OptionsRanges],
    ['(class A {get [foo](){}})', Context.None],
    ['(class A {set [foo](x){}})', Context.OptionsRanges],
    ['(class x { *[y](){}})', Context.None],
    ['(class x { get [y](){}})', Context.None],
    ['(class x { set [y](z){}})', Context.None],
    ['(class x { async *[y](){}})', Context.None],
    ['(class x{*foo(){}})', Context.None],
    ['(class x{*[x](){}})', Context.None],
    ['(class x{*"foo"(){}})', Context.None],
    ['(class x{*555(){}})', Context.None],
    ['(class x{async *foo(a){}})', Context.None],
    ['(class x{async *[x](a){}})', Context.None],
    ['(class x{async *"foo"(a){}})', Context.None],
    ['(class x{async *555(a){}})', Context.None],

    ['(class A {static a(){}})', Context.None],
    ['(class A {static constructor(){}})', Context.None],
    ['(class A {static get foo(){}})', Context.None],
    ['(class A {static set foo(x){}})', Context.None],
    ['(class A {static "x"(){}})', Context.None],
    ['(class A {static "constructor"(){}})', Context.None],
    ['(class A {static get "foo"(){}})', Context.None],
    ['(class A {static set "foo"(x){}})', Context.None],
    ['(class A {static 2(){}})', Context.None],
    ['(class A {async foo(){}})', Context.None],
    ['(class A {*foo(){}})', Context.None],
    ['(class A {get foo(){}})', Context.None],
    ['(class A {get set(){}})', Context.None],
    ['(class A {set foo(x){}})', Context.None],
    ['(class A {set get(x){}})', Context.None],
    ['(class A {set(){} get(){} async(){}})', Context.None],
    ['(class A {"x"(){}})', Context.None],
    ['(class A {"constructor"(){}})', Context.None],
    ['(class A {async "foo"(){}})', Context.None],
    ['(class A {*"foo"(){}})', Context.None],
    ['(class A {get "foo"(){}})', Context.None],
    ['(class A {get "set"(){}})', Context.None],
    ['(class A {set "foo"(x){}})', Context.None],
    ['(class A {set "get"(x){}})', Context.None],
    ['(class A {"set"(){} "get"(){} "async"(){}})', Context.None],
    ['(class A {static "constructor"(){}})', Context.None],
    ['(class A {static get "foo"(){}})', Context.None],
    ['(class A {static set "foo"(x){}})', Context.None],
    ['(class A {static 2(){}})', Context.None],
    ['(class A {async foo(){}})', Context.None],
    ['(class A {*foo(){}})', Context.None],
    ['(class A {get foo(){}})', Context.None],
    ['(class A {get set(){}})', Context.None],
    ['(class A {set foo(x){}})', Context.None],
    ['(class A {set get(x){}})', Context.None],
    ['(class A {set(){} get(){} async(){}})', Context.None],
    ['(class A {"x"(){}})', Context.None],
    ['(class A {"constructor"(){}})', Context.None],
    ['(class A {async "foo"(){}})', Context.None],
    ['var C = class { static async *gen() { yield { ...yield, y: 1, ...yield yield, };}}', Context.None],
    [
      'class c { static *[false]() { "use strict"; } set [this] (q) { "use strict"; } set [true] (u) { "use strict"; } }',
      Context.OptionsRanges,
    ],
    ['var C = class { static async *gen() { yield [...yield yield]; }}', Context.OptionsRanges],
    ['(class A {*"foo"(){}})', Context.None],
    ['(class A {get "foo"(){}})', Context.None],
    ['(class A {get "set"(){}})', Context.None],
    ['(class A {set "foo"(x){}})', Context.None],
    ['(class A {set "get"(x){}})', Context.None],
    ['(class A {"set"(){} "get"(){} "async"(){}})', Context.None],
    ['(class A {async * 34(){}})', Context.None],
    ['(class A {get 5(){}})', Context.None],
    ['(class A {set 9(x){}})', Context.None],
    ['(class A {[a](){}})', Context.None],
    ['(class A {*[foo](){}})', Context.None],
    ['(class A {get [foo](){}})', Context.None],
    ['(class A {set [foo](x){}})', Context.None],
    ['(class x { *[y](){}})', Context.None],
    ['(class x { get [y](){}})', Context.None],
    ['(class x { set [y](z){}})', Context.None],
    ['(class x { async *[y](){}})', Context.None],
    ['(class x{*foo(){}})', Context.None],
    ['(class x{*[x](){}})', Context.None],
    ['(class x{*"foo"(){}})', Context.None],
    ['(class A {async * 34(){}})', Context.None],
    ['(class A {get 5(){}})', Context.None],
    ['(class A {set 9(x){}})', Context.None],
    ['(class A {[a](){}})', Context.None],
    ['(class A {*[foo](){}})', Context.None],
    ['(class A {get [foo](){}})', Context.None],
    ['(class A {set [foo](x){}})', Context.None],
    ['(class x { *[y](){}})', Context.None],
    ['(class x { get [y](){}})', Context.None],
    ['(class x { set [y](z){}})', Context.None],
    ['(class x { async *[y](){}})', Context.None],
    ['(class x{*foo(){}})', Context.None],
    ['(class x{*[x](){}})', Context.None],
    ['(class x{*"foo"(){}})', Context.None],
    ['(class A {set(){} get(){} async(){}})', Context.None],
    ['(class A {"x"(){}})', Context.None],
    ['(class A {"constructor"(){}})', Context.None],
    ['(class A {async "foo"(){}})', Context.None],
    ['(class A {*"foo"(){}})', Context.None],
    ['(class A {get "foo"(){}})', Context.None],
    ['(class A {get "set"(){}})', Context.None],
    ['(class A {set "foo"(x){}})', Context.None],
    ['(class A {set "get"(x){}})', Context.None],
    ['(class A {"set"(){} "get"(){} "async"(){}})', Context.None],
    ['(class A {1(){}})', Context.None],
    ['(class x { get [y](){}})', Context.None],
    ['(class x { set [y](z){}})', Context.None],
    ['(class x { async *[y](){}})', Context.None],
    ['(class x{*foo(){}})', Context.None],
    ['(class x{*[x](){}})', Context.None],
    ['(class x{*"foo"(){}})', Context.None],
    ['(class x{*555(){}})', Context.None],
    ['(class x{async *foo(a){}})', Context.None],
    ['(class x{async *[x](a){}})', Context.None],
    ['(class x{async *"foo"(a){}})', Context.None],
    ['(class x{async *555(a){}})', Context.None],

    ['(class A {static a(){}})', Context.None],
    ['(class A {static constructor(){}})', Context.None],
    ['(class A {static get "foo"(){}})', Context.None],
    ['(class A {static set "foo"(x){}})', Context.None],
    ['(class A {static 2(){}})', Context.None],
    ['class A extends B { *get() {} }', Context.None],
    ['class a { async *get(){} }', Context.None],
    [`class A { [1n](){} }`, Context.None],
    [`class A { static }`, Context.OptionsNext | Context.Module],
    [`class A { static; }`, Context.OptionsNext | Context.Module],
    [`class A { static = 1 }`, Context.OptionsNext | Context.Module],
    [
      `new class {
        start() {
          new class {
            constructor() {}
          }
        }
        constructor() {}
      }`,
      Context.None,
    ],
  ]);
});
