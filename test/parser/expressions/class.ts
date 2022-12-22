import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    'static async : 0'
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
    'yield'
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
    'static prot\\u006ftype() {}',
    "static 'prot\\u006ftype'() {}",
    "static get 'prot\\u006ftype'() {}",
    "static set 'prot\\u006ftype'(_) {}",
    "static *'prot\\u006ftype'() {}"
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
    'get c\\u006fnstructor() {}',
    '*c\\u006fnstructor() {}',
    "get 'c\\u006fnstructor'() {}",
    "get 'c\\u006fnstructor'(_) {}",
    "*'c\\u006fnstructor'() {}"
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
    'class name { m }',
    'class name { m; n }',
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
    'class name { *static m() {} }'
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
    'class { m }',
    'class { m; n }',
    'class { m: 1 }',
    'class { m(); n() }',
    'class { get m }',
    'class { get m() }',
    'class { get m() { }',
    'class { set m() {} }', // Missing required parameter.
    'class { m() {}, n() {} }' // No commas allowed.
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
    'class C { *method() { with ({}) {} } }'
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
    'get m() {}; set m(_) {}; get m() {}; set m(_) {};'
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
    'static *constructor() {}'
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
    'a',
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
    'constructor() { super(); }'
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
    'class name extends class base {} {}'
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
    'finally'
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
      Context.None
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
    ['class impl\\u0065ments {}', Context.None],
    ['classfunction yield(yield) { yield: yield (yield + yield(0)); }', Context.None],
    ['class l\\u0065t { }', Context.None],
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
    ['(class x {foo})', Context.None],
    ['(class x {foo: x})', Context.None],
    ['(class x { async [x]s){}})', Context.None],
    ['(class x { y })', Context.None],
    ['(class x { y; })', Context.None],
    ['(class x { `constructor`(){} })', Context.None],
    ['class x extends a = b {}', Context.None],
    ['class x {[x]z){}}', Context.None],
    ['class x {foo, bar(){}}', Context.None],
    ['class x {foo}', Context.None],
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
    ['(class A {get prototype(){}})', Context.None],
    ['(class A {set prototype(x){}})', Context.None],
    ['(class A {*prototype(){}})', Context.None],
    ['class x { get prototype(){} }', Context.None],
    ['(class x { async prototype(){} })', Context.None],
    ['class x { static set prototype(x){} }', Context.None],
    ['class x { static *prototype(){} }', Context.None],
    ['class x { static prototype(){} }', Context.None],
    ['class x { static async *prototype(){} }', Context.None],
    ['class x { static async *prot\\u006ftype(){} }', Context.None],
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
    ['(class A {async prototype(){}})', Context.None],
    ['(class A {constructor(){}; constructor(){}})', Context.None],
    ['(class A {a(){}; constructor(){}; constructor(){}})', Context.None],
    ['(class A {a(){}; constructor(){}; a(){}; a(){}; a(){}; constructor(){}; a(){}})', Context.None],
    ['(class A {static constructor(){}; constructor(){}; constructor(){}})', Context.None],
    ['(class A {foo, bar(){}})', Context.None],
    ['(class A {foo})', Context.None],
    ['class A {async get foo(){}}', Context.None],
    ['(class A {foo = x})', Context.None],
    ['(class A {async *prototype(){}})', Context.None],
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
      Context.None
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
    ['async function f(foo = class y extends (await f) {}){}', Context.None]
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
    'st\\u0061tic() {}',
    'get st\\u0061tic() {}',
    'set st\\u0061tic(v) {}',
    'static st\\u0061tic() {}',
    'static get st\\u0061tic() {}',
    'static set st\\u0061tic(v) {}',
    '*st\\u0061tic() {}',
    'static *st\\u0061tic() {}',
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
    "get 'hex\\x45scape'() { return 'get string'; }",
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
    'static(){}'
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
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
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'count'
                            },
                            operator: '++',
                            prefix: false
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'increment'
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
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'count'
                            },
                            operator: '++',
                            prefix: false
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'decrement'
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
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'count'
                            },
                            operator: '--',
                            prefix: false
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'getCount'
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
                            type: 'Identifier',
                            name: 'count'
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    value: 1
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
                            type: 'Literal',
                            value: 1
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    value: 2
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
                            type: 'Literal',
                            value: 2
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    value: 1.1
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
                            type: 'Literal',
                            value: 1.1
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    value: 2.2
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
                            type: 'Literal',
                            value: 2.2
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: true,
                  computed: true,
                  key: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 1
                    },
                    right: {
                      type: 'Literal',
                      value: 3
                    },
                    operator: '+'
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
                            type: 'Literal',
                            value: 4
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: true,
                  key: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 1.1
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
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
                            type: 'Literal',
                            value: 2.1
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: true,
                  key: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
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
                            type: 'Literal',
                            value: 'foo1'
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  }
                },
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'sym1'
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
                            type: 'Literal',
                            value: 'bart'
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'SimpleParent'
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
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AssignmentExpression',
                            left: {
                              type: 'MemberExpression',
                              object: {
                                type: 'ThisExpression'
                              },
                              computed: false,
                              property: {
                                type: 'Identifier',
                                name: 'foo'
                              }
                            },
                            operator: '=',
                            right: {
                              type: 'Literal',
                              value: 'SimpleParent'
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
          },
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Literal',
                  value: 0
                },
                id: {
                  type: 'Identifier',
                  name: 'calls_to_ConstructorCountingParent'
                }
              }
            ]
          },
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'ConstructorCountingParent'
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
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'UpdateExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'calls_to_ConstructorCountingParent'
                            },
                            operator: '++',
                            prefix: false
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
          },
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'UninitializedThisReturningArgumentConstructor'
            },
            superClass: {
              type: 'Identifier',
              name: 'SimpleParent'
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
                        type: 'Identifier',
                        name: 'arg'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Identifier',
                            name: 'arg'
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
          },
          {
            type: 'EmptyStatement'
          },
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'InitializedThisReturningArgumentConstructor'
            },
            superClass: {
              type: 'Identifier',
              name: 'SimpleParent'
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
                        type: 'Identifier',
                        name: 'arg'
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
                        },
                        {
                          type: 'ReturnStatement',
                          argument: {
                            type: 'Identifier',
                            name: 'arg'
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
          },
          {
            type: 'EmptyStatement'
          }
        ]
      }
    ],
    [
      'class await { }',
      Context.None | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'await',
              start: 6,
              end: 11,
              range: [6, 11]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [],
              start: 12,
              end: 15,
              range: [12, 15]
            },
            start: 0,
            end: 15,
            range: [0, 15]
          }
        ],
        start: 0,
        end: 15,
        range: [0, 15]
      }
    ],
    [
      'class x extends await { }',
      Context.None | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: {
              type: 'Identifier',
              name: 'await',
              start: 16,
              end: 21,
              range: [16, 21]
            },
            body: {
              type: 'ClassBody',
              body: [],
              start: 22,
              end: 25,
              range: [22, 25]
            },
            start: 0,
            end: 25,
            range: [0, 25]
          }
        ],
        start: 0,
        end: 25,
        range: [0, 25]
      }
    ],
    [
      'class a extends [] { static set [a] ({w=a}) { for (;;) a } }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'a'
            },
            superClass: {
              type: 'ArrayExpression',
              elements: []
            },
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'set',
                  static: true,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            kind: 'init',
                            key: {
                              type: 'Identifier',
                              name: 'w'
                            },
                            computed: false,
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'w'
                              },
                              right: {
                                type: 'Identifier',
                                name: 'a'
                              }
                            },
                            method: false,
                            shorthand: true
                          }
                        ]
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ForStatement',
                          body: {
                            type: 'ExpressionStatement',
                            expression: {
                              type: 'Identifier',
                              name: 'a'
                            }
                          },
                          init: null,
                          test: null,
                          update: null
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
      'class x extends {} {}',
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
              type: 'ObjectExpression',
              properties: []
            },
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],

    [
      'class x{[x](a=await){}}',
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
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'x'
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
                          type: 'Identifier',
                          name: 'await'
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
      'class x{[x](a=await){}}',
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
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'x'
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
                          type: 'Identifier',
                          name: 'await'
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
      'class x{[x](await){}}',
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
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'await'
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
      '(class x {}.foo)',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'ClassExpression',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: []
                }
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      `var C = class { static async *gen() {
        callCount += 1;
        yield [...yield];
    }}`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ClassExpression',
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'gen'
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
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'callCount'
                                  },
                                  operator: '+=',
                                  right: {
                                    type: 'Literal',
                                    value: 1
                                  }
                                }
                              },
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'YieldExpression',
                                  argument: {
                                    type: 'ArrayExpression',
                                    elements: [
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: null,
                                          delegate: false
                                        }
                                      }
                                    ]
                                  },
                                  delegate: false
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: true,
                          id: null
                        }
                      }
                    ]
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'C'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `var gen = {
          async *method() {
            callCount += 1;
            yield [...yield];
          }
        }.method;`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'MemberExpression',
                  object: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'method'
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
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'callCount'
                                  },
                                  operator: '+=',
                                  right: {
                                    type: 'Literal',
                                    value: 1
                                  }
                                }
                              },
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'YieldExpression',
                                  argument: {
                                    type: 'ArrayExpression',
                                    elements: [
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: null,
                                          delegate: false
                                        }
                                      }
                                    ]
                                  },
                                  delegate: false
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: true,
                          id: null
                        },
                        kind: 'init',
                        computed: false,
                        method: true,
                        shorthand: false
                      }
                    ]
                  },
                  computed: false,
                  property: {
                    type: 'Identifier',
                    name: 'method'
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'gen'
                }
              }
            ]
          }
        ]
      }
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
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'C'
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
                    name: 'gen'
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
                            type: 'YieldExpression',
                            argument: {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'SpreadElement',
                                  argument: {
                                    type: 'YieldExpression',
                                    argument: null,
                                    delegate: false
                                  }
                                },
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'Literal',
                                    value: 1
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                },
                                {
                                  type: 'SpreadElement',
                                  argument: {
                                    type: 'YieldExpression',
                                    argument: {
                                      type: 'YieldExpression',
                                      argument: null,
                                      delegate: false
                                    },
                                    delegate: false
                                  }
                                }
                              ]
                            },
                            delegate: false
                          }
                        }
                      ]
                    },
                    async: true,
                    generator: true,
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
      '(class x {}.foo())',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'ClassExpression',
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: []
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'foo'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      '(class x {}())',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'ClassExpression',
                id: {
                  type: 'Identifier',
                  name: 'x'
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  body: []
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'f = ([xCls = class X {}]) => {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xCls'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: {
                            type: 'Identifier',
                            name: 'X'
                          },
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: []
                          }
                        }
                      }
                    ]
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
      '(class A extends B { constructor() { super() } })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: {
                type: 'Identifier',
                name: 'B'
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
          }
        ]
      }
    ],

    [
      'class x { foo(x=new (await)()){} }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
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
                    name: 'foo',
                    start: 10,
                    end: 13,
                    range: [10, 13]
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x',
                          start: 14,
                          end: 15,
                          range: [14, 15]
                        },
                        right: {
                          type: 'NewExpression',
                          callee: {
                            type: 'Identifier',
                            name: 'await',
                            start: 21,
                            end: 26,
                            range: [21, 26]
                          },
                          arguments: [],
                          start: 16,
                          end: 29,
                          range: [16, 29]
                        },
                        start: 14,
                        end: 29,
                        range: [14, 29]
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 30,
                      end: 32,
                      range: [30, 32]
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 13,
                    end: 32,
                    range: [13, 32]
                  },
                  start: 10,
                  end: 32,
                  range: [10, 32]
                }
              ],
              start: 8,
              end: 34,
              range: [8, 34]
            },
            start: 0,
            end: 34,
            range: [0, 34]
          }
        ],
        start: 0,
        end: 34,
        range: [0, 34]
      }
    ],
    [
      'class x { foo(x=await){} }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
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
                    name: 'foo',
                    start: 10,
                    end: 13,
                    range: [10, 13]
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x',
                          start: 14,
                          end: 15,
                          range: [14, 15]
                        },
                        right: {
                          type: 'Identifier',
                          name: 'await',
                          start: 16,
                          end: 21,
                          range: [16, 21]
                        },
                        start: 14,
                        end: 21,
                        range: [14, 21]
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 22,
                      end: 24,
                      range: [22, 24]
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 13,
                    end: 24,
                    range: [13, 24]
                  },
                  start: 10,
                  end: 24,
                  range: [10, 24]
                }
              ],
              start: 8,
              end: 26,
              range: [8, 26]
            },
            start: 0,
            end: 26,
            range: [0, 26]
          }
        ],
        start: 0,
        end: 26,
        range: [0, 26]
      }
    ],
    [
      'class x extends feh(await) { }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'feh',
                start: 16,
                end: 19,
                range: [16, 19]
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'await',
                  start: 20,
                  end: 25,
                  range: [20, 25]
                }
              ],
              start: 16,
              end: 26,
              range: [16, 26]
            },
            body: {
              type: 'ClassBody',
              body: [],
              start: 27,
              end: 30,
              range: [27, 30]
            },
            start: 0,
            end: 30,
            range: [0, 30]
          }
        ],
        start: 0,
        end: 30,
        range: [0, 30]
      }
    ],
    [
      'class x { foo(await){} }',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
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
                    name: 'foo',
                    start: 10,
                    end: 13,
                    range: [10, 13]
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'await',
                        start: 14,
                        end: 19,
                        range: [14, 19]
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 20,
                      end: 22,
                      range: [20, 22]
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 13,
                    end: 22,
                    range: [13, 22]
                  },
                  start: 10,
                  end: 22,
                  range: [10, 22]
                }
              ],
              start: 8,
              end: 24,
              range: [8, 24]
            },
            start: 0,
            end: 24,
            range: [0, 24]
          }
        ],
        start: 0,
        end: 24,
        range: [0, 24]
      }
    ],
    [
      'class v extends[x] {}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'v'
            },
            superClass: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'Identifier',
                  name: 'x'
                }
              ]
            },
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      'class v extends.9 {}',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'v'
            },
            superClass: {
              type: 'Literal',
              value: 0.9
            },
            body: {
              type: 'ClassBody',
              body: []
            }
          }
        ]
      }
    ],
    [
      '(class A extends B { constructor() { super() } })',
      Context.OptionsWebCompat | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 49,
        range: [0, 49],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 49,
            range: [0, 49],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 48,
              range: [1, 48],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'B'
              },
              body: {
                type: 'ClassBody',
                start: 19,
                end: 48,
                range: [19, 48],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 21,
                    end: 46,
                    range: [21, 46],
                    kind: 'constructor',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 21,
                      end: 32,
                      range: [21, 32],
                      name: 'constructor'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 32,
                      end: 46,
                      range: [32, 46],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 35,
                        end: 46,
                        range: [35, 46],
                        body: [
                          {
                            type: 'ExpressionStatement',
                            start: 37,
                            end: 44,
                            range: [37, 44],
                            expression: {
                              type: 'CallExpression',
                              start: 37,
                              end: 44,
                              range: [37, 44],
                              callee: {
                                type: 'Super',
                                start: 37,
                                end: 42,
                                range: [37, 42]
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
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f = ([cls = class {}]) => {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'cls'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: []
                          }
                        }
                      }
                    ]
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
      'f = ([xCls2 = class { name() {} }]) => {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xCls2'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: null,
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
                                  name: 'name'
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
                      }
                    ]
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
      '(class x{}())',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'CallExpression',
              start: 1,
              end: 12,
              range: [1, 12],
              callee: {
                type: 'ClassExpression',
                start: 1,
                end: 10,
                range: [1, 10],
                id: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'x'
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  start: 8,
                  end: 10,
                  range: [8, 10],
                  body: []
                }
              },
              arguments: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class x{}.foo)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'MemberExpression',
              start: 1,
              end: 14,
              range: [1, 14],
              object: {
                type: 'ClassExpression',
                start: 1,
                end: 10,
                range: [1, 10],
                id: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'x'
                },
                superClass: null,
                body: {
                  type: 'ClassBody',
                  start: 8,
                  end: 10,
                  range: [8, 10],
                  body: []
                }
              },
              property: {
                type: 'Identifier',
                start: 11,
                end: 14,
                range: [11, 14],
                name: 'foo'
              },
              computed: false
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class x{}.foo())',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'CallExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              callee: {
                type: 'MemberExpression',
                start: 1,
                end: 14,
                range: [1, 14],
                object: {
                  type: 'ClassExpression',
                  start: 1,
                  end: 10,
                  range: [1, 10],
                  id: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'x'
                  },
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 8,
                    end: 10,
                    range: [8, 10],
                    body: []
                  }
                },
                property: {
                  type: 'Identifier',
                  start: 11,
                  end: 14,
                  range: [11, 14],
                  name: 'foo'
                },
                computed: false
              },
              arguments: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    /*[
      'class a\\u{77}ait {}',
      Context.None,
      {}], */
    [
      'class await {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 14,
            range: [0, 14],
            id: {
              type: 'Identifier',
              start: 6,
              end: 11,
              range: [6, 11],
              name: 'await'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 12,
              end: 14,
              range: [12, 14],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'class x { [await](){} }',
      Context.OptionsRanges,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
              start: 6,
              end: 7,
              range: [6, 7]
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              body: [
                {
                  type: 'MethodDefinition',
                  kind: 'method',
                  static: false,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    name: 'await',
                    start: 11,
                    end: 16,
                    range: [11, 16]
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      start: 19,
                      end: 21,
                      range: [19, 21]
                    },
                    async: false,
                    generator: false,
                    id: null,
                    start: 17,
                    end: 21,
                    range: [17, 21]
                  },
                  start: 10,
                  end: 21,
                  range: [10, 21]
                }
              ],
              start: 8,
              end: 23,
              range: [8, 23]
            },
            start: 0,
            end: 23,
            range: [0, 23]
          }
        ],
        start: 0,
        end: 23,
        range: [0, 23]
      }
    ],
    [
      'class async {}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 14,
            range: [0, 14],
            id: {
              type: 'Identifier',
              start: 6,
              end: 11,
              range: [6, 11],
              name: 'async'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 12,
              end: 14,
              range: [12, 14],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = class{} / x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'BinaryExpression',
                start: 4,
                end: 15,
                range: [4, 15],
                left: {
                  type: 'ClassExpression',
                  start: 4,
                  end: 11,
                  range: [4, 11],
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 9,
                    end: 11,
                    range: [9, 11],
                    body: []
                  }
                },
                operator: '/',
                right: {
                  type: 'Identifier',
                  start: 14,
                  end: 15,
                  range: [14, 15],
                  name: 'x'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class{} \n / foo / g)',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                left: {
                  body: {
                    body: [],
                    type: 'ClassBody'
                  },
                  id: null,
                  superClass: null,
                  type: 'ClassExpression'
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
    ],
    [
      'f = ([xCls2 = class { static name() {} }]) => {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xCls2'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: [
                              {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: true,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  name: 'name'
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
                      }
                    ]
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
      'f = ([cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }]) => {}',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'cls'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: []
                          }
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xCls'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: {
                            type: 'Identifier',
                            name: 'X'
                          },
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: []
                          }
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'xCls2'
                        },
                        right: {
                          type: 'ClassExpression',
                          id: null,
                          superClass: null,
                          body: {
                            type: 'ClassBody',
                            body: [
                              {
                                type: 'MethodDefinition',
                                kind: 'method',
                                static: true,
                                computed: false,
                                key: {
                                  type: 'Identifier',
                                  name: 'name'
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
                      }
                    ]
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
      '(class A {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: []
              }
            }
          }
        ]
      }
    ],
    [
      '(class A {; ;; ;})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 17,
                range: [9, 17],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A extends B {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 21,
              range: [1, 21],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'B'
              },
              body: {
                type: 'ClassBody',
                start: 19,
                end: 21,
                range: [19, 21],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A extends foo() {})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: {
                type: 'CallExpression',
                start: 17,
                end: 22,
                range: [17, 22],
                callee: {
                  type: 'Identifier',
                  start: 17,
                  end: 20,
                  range: [17, 20],
                  name: 'foo'
                },
                arguments: []
              },
              body: {
                type: 'ClassBody',
                start: 23,
                end: 25,
                range: [23, 25],
                body: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A extends {} {})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: {
                type: 'ObjectExpression',
                properties: []
              },
              body: {
                type: 'ClassBody',
                body: []
              }
            }
          }
        ]
      }
    ],
    [
      '(class A {a(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 16,
                range: [9, 16],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 15,
                    range: [10, 15],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'a'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 11,
                      end: 15,
                      range: [11, 15],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 13,
                        end: 15,
                        range: [13, 15],
                        body: []
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
      '(class A {constructor(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 26,
              range: [1, 26],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 26,
                range: [9, 26],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 25,
                    range: [10, 25],
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
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A {static constructor(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 34,
        range: [0, 34],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 34,
            range: [0, 34],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 33,
              range: [1, 33],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 33,
                range: [9, 33],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 32,
                    range: [10, 32],
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 17,
                      end: 28,
                      range: [17, 28],
                      name: 'constructor'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 28,
                      end: 32,
                      range: [28, 32],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 30,
                        end: 32,
                        range: [30, 32],
                        body: []
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
      '(class A {async foo(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 24,
              range: [1, 24],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 24,
                range: [9, 24],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 23,
                    range: [10, 23],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 16,
                      end: 19,
                      range: [16, 19],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 19,
                      end: 23,
                      range: [19, 23],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 21,
                        end: 23,
                        range: [21, 23],
                        body: []
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
      '(class A {*foo(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 19,
              range: [1, 19],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 19,
                range: [9, 19],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 18,
                    range: [10, 18],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 14,
                      range: [11, 14],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 14,
                      end: 18,
                      range: [14, 18],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 16,
                        end: 18,
                        range: [16, 18],
                        body: []
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
      '(class A {get foo(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 22,
              range: [1, 22],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 22,
                range: [9, 22],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 17,
                      end: 21,
                      range: [17, 21],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 19,
                        end: 21,
                        range: [19, 21],
                        body: []
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
      '(class o {f(){ function x(){}}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 32,
            range: [0, 32],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 31,
              range: [1, 31],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'o'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 31,
                range: [9, 31],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 30,
                    range: [10, 30],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      name: 'f'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 11,
                      end: 30,
                      range: [11, 30],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 13,
                        end: 30,
                        range: [13, 30],
                        body: [
                          {
                            type: 'FunctionDeclaration',
                            start: 15,
                            end: 29,
                            range: [15, 29],
                            id: {
                              type: 'Identifier',
                              start: 24,
                              end: 25,
                              range: [24, 25],
                              name: 'x'
                            },
                            generator: false,
                            async: false,
                            params: [],
                            body: {
                              type: 'BlockStatement',
                              start: 27,
                              end: 29,
                              range: [27, 29],
                              body: []
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
      '(class o {f(f) { }})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'o'
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
                      name: 'f'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'f'
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
          }
        ]
      }
    ],
    [
      '(class M { static foo() {} get foo() {} set foo(x) {}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 55,
        range: [0, 55],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 55,
            range: [0, 55],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 54,
              range: [1, 54],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'M'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 54,
                range: [9, 54],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 11,
                    end: 26,
                    range: [11, 26],
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 18,
                      end: 21,
                      range: [18, 21],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 21,
                      end: 26,
                      range: [21, 26],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 24,
                        end: 26,
                        range: [24, 26],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'MethodDefinition',
                    start: 27,
                    end: 39,
                    range: [27, 39],
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 31,
                      end: 34,
                      range: [31, 34],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 34,
                      end: 39,
                      range: [34, 39],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 37,
                        end: 39,
                        range: [37, 39],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'MethodDefinition',
                    start: 40,
                    end: 53,
                    range: [40, 53],
                    kind: 'set',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 44,
                      end: 47,
                      range: [44, 47],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 47,
                      end: 53,
                      range: [47, 53],
                      id: null,
                      generator: false,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 48,
                          end: 49,
                          range: [48, 49],
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        start: 51,
                        end: 53,
                        range: [51, 53],
                        body: []
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
      '(class OnlyStaticSetter { static set setter(x) { p("ssetter " + x) } })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 71,
        range: [0, 71],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 71,
            range: [0, 71],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 70,
              range: [1, 70],
              id: {
                type: 'Identifier',
                start: 7,
                end: 23,
                range: [7, 23],
                name: 'OnlyStaticSetter'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 24,
                end: 70,
                range: [24, 70],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 26,
                    end: 68,
                    range: [26, 68],
                    kind: 'set',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 37,
                      end: 43,
                      range: [37, 43],
                      name: 'setter'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 43,
                      end: 68,
                      range: [43, 68],
                      id: null,
                      generator: false,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 44,
                          end: 45,
                          range: [44, 45],
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        start: 47,
                        end: 68,
                        range: [47, 68],
                        body: [
                          {
                            type: 'ExpressionStatement',
                            start: 49,
                            end: 66,
                            range: [49, 66],
                            expression: {
                              type: 'CallExpression',
                              start: 49,
                              end: 66,
                              range: [49, 66],
                              callee: {
                                type: 'Identifier',
                                start: 49,
                                end: 50,
                                range: [49, 50],
                                name: 'p'
                              },
                              arguments: [
                                {
                                  type: 'BinaryExpression',
                                  start: 51,
                                  end: 65,
                                  range: [51, 65],
                                  left: {
                                    type: 'Literal',
                                    start: 51,
                                    end: 61,
                                    range: [51, 61],
                                    value: 'ssetter '
                                  },
                                  operator: '+',
                                  right: {
                                    type: 'Identifier',
                                    start: 64,
                                    end: 65,
                                    range: [64, 65],
                                    name: 'x'
                                  }
                                }
                              ]
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
      '(class A {set foo(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set get(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set(){} get(){} async(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 37,
        range: [0, 37],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 37,
            range: [0, 37],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 36,
              range: [1, 36],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 36,
                range: [9, 36],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 17,
                    range: [10, 17],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 10,
                      end: 13,
                      range: [10, 13],
                      name: 'set'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 13,
                      end: 17,
                      range: [13, 17],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 15,
                        end: 17,
                        range: [15, 17],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'MethodDefinition',
                    start: 18,
                    end: 25,
                    range: [18, 25],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 18,
                      end: 21,
                      range: [18, 21],
                      name: 'get'
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
                  },
                  {
                    type: 'MethodDefinition',
                    start: 26,
                    end: 35,
                    range: [26, 35],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 26,
                      end: 31,
                      range: [26, 31],
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 31,
                      end: 35,
                      range: [31, 35],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 33,
                        end: 35,
                        range: [33, 35],
                        body: []
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
      '(class A {"x"(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 18,
                range: [9, 18],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 17,
                    range: [10, 17],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 10,
                      end: 13,
                      range: [10, 13],
                      value: 'x'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 13,
                      end: 17,
                      range: [13, 17],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 15,
                        end: 17,
                        range: [15, 17],
                        body: []
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
      '(class A {"constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'constructor',
                    static: false
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
      '(class A {async "foo"(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 26,
              range: [1, 26],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 26,
                range: [9, 26],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 25,
                    range: [10, 25],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 16,
                      end: 21,
                      range: [16, 21],
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 21,
                      end: 25,
                      range: [21, 25],
                      id: null,
                      generator: false,
                      async: true,
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
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A {*"foo"(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 21,
              range: [1, 21],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 21,
                range: [9, 21],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 20,
                    range: [10, 20],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 11,
                      end: 16,
                      range: [11, 16],
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 16,
                      end: 20,
                      range: [16, 20],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 18,
                        end: 20,
                        range: [18, 20],
                        body: []
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
      '(class A {get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get "set"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'set'
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
          }
        ]
      }
    ],
    [
      '(class A {set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set "get"(x){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 25,
                range: [9, 25],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 24,
                    range: [10, 24],
                    kind: 'set',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 14,
                      end: 19,
                      range: [14, 19],
                      value: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 19,
                      end: 24,
                      range: [19, 24],
                      id: null,
                      generator: false,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 20,
                          end: 21,
                          range: [20, 21],
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        start: 22,
                        end: 24,
                        range: [22, 24],
                        body: []
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
      '(class A {"set"(){} "get"(){} "async"(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 43,
        range: [0, 43],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 43,
            range: [0, 43],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 42,
              range: [1, 42],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 42,
                range: [9, 42],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 19,
                    range: [10, 19],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 10,
                      end: 15,
                      range: [10, 15],
                      value: 'set'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 15,
                      end: 19,
                      range: [15, 19],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 17,
                        end: 19,
                        range: [17, 19],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'MethodDefinition',
                    start: 20,
                    end: 29,
                    range: [20, 29],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 20,
                      end: 25,
                      range: [20, 25],
                      value: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 25,
                      end: 29,
                      range: [25, 29],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 27,
                        end: 29,
                        range: [27, 29],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'MethodDefinition',
                    start: 30,
                    end: 41,
                    range: [30, 41],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 30,
                      end: 37,
                      range: [30, 37],
                      value: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 37,
                      end: 41,
                      range: [37, 41],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 39,
                        end: 41,
                        range: [39, 41],
                        body: []
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
      '(class A {1(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 16,
                range: [9, 16],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 15,
                    range: [10, 15],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      value: 1
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 11,
                      end: 15,
                      range: [11, 15],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 13,
                        end: 15,
                        range: [13, 15],
                        body: []
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
      '(class A {async 3(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 23,
            range: [0, 23],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 22,
              range: [1, 22],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 22,
                range: [9, 22],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 21,
                    range: [10, 21],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 16,
                      end: 17,
                      range: [16, 17],
                      value: 3
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 17,
                      end: 21,
                      range: [17, 21],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 19,
                        end: 21,
                        range: [19, 21],
                        body: []
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
      '(class A {*4(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 17,
                range: [9, 17],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 16,
                    range: [10, 16],
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      value: 4
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 12,
                      end: 16,
                      range: [12, 16],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 14,
                        end: 16,
                        range: [14, 16],
                        body: []
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
      '(class A {async * 34(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 34
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class A {get 5(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 5
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set 9(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 9
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {[a](){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 18,
                range: [9, 18],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 17,
                    range: [10, 17],
                    kind: 'method',
                    static: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'a'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 13,
                      end: 17,
                      range: [13, 17],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 15,
                        end: 17,
                        range: [15, 17],
                        body: []
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
      '(class A {*[foo](){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 21,
              range: [1, 21],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 21,
                range: [9, 21],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 20,
                    range: [10, 20],
                    kind: 'method',
                    static: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 16,
                      end: 20,
                      range: [16, 20],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 18,
                        end: 20,
                        range: [18, 20],
                        body: []
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
      '(class A {get [foo](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set [foo](x){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'ClassExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              id: {
                type: 'Identifier',
                start: 7,
                end: 8,
                range: [7, 8],
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                start: 9,
                end: 25,
                range: [9, 25],
                body: [
                  {
                    type: 'MethodDefinition',
                    start: 10,
                    end: 24,
                    range: [10, 24],
                    kind: 'set',
                    static: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      start: 15,
                      end: 18,
                      range: [15, 18],
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      start: 19,
                      end: 24,
                      range: [19, 24],
                      id: null,
                      generator: false,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 20,
                          end: 21,
                          range: [20, 21],
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        start: 22,
                        end: 24,
                        range: [22, 24],
                        body: []
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
      '(class x { *[y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x { get [y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class x { set [y](z){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { async *[y](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*[x](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*555(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 555
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{async *foo(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *[x](a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *"foo"(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *555(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                      type: 'Literal',
                      value: 555
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],

    [
      '(class A {static a(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
          }
        ]
      }
    ],
    [
      '(class A {static constructor(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      '(class A {static get foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: true
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
      '(class A {static set foo(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: true
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
      '(class A {static "x"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      '(class A {static "constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'constructor'
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
          }
        ]
      }
    ],
    [
      '(class A {static get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: true
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
      '(class A {static set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: true
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
      '(class A {static 2(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 2
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      '(class A {async foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'method',
                    static: false
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
      '(class A {*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get set(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set foo(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set get(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set(){} get(){} async(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"x"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'constructor',
                    static: false
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
      '(class A {async "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'method',
                    static: false
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
      '(class A {*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get "set"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'set'
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
          }
        ]
      }
    ],
    [
      '(class A {set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set "get"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {"set"(){} "get"(){} "async"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 'set'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'get'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'async'
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
          }
        ]
      }
    ],
    [
      '(class A {static "constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'constructor'
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
          }
        ]
      }
    ],
    [
      '(class A {static get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: true
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
      '(class A {static set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: true
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
      '(class A {static 2(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 2
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      '(class A {async foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'method',
                    static: false
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
      '(class A {*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get set(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set foo(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set get(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set(){} get(){} async(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"x"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'constructor',
                    static: false
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
      '(class A {async "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'method',
                    static: false
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
      'var C = class { static async *gen() { yield { ...yield, y: 1, ...yield yield, };}}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'ClassExpression',
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'gen'
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
                                  type: 'YieldExpression',
                                  argument: {
                                    type: 'ObjectExpression',
                                    properties: [
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: null,
                                          delegate: false
                                        }
                                      },
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'y'
                                        },
                                        value: {
                                          type: 'Literal',
                                          value: 1
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: false
                                      },
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: {
                                            type: 'YieldExpression',
                                            argument: null,
                                            delegate: false
                                          },
                                          delegate: false
                                        }
                                      }
                                    ]
                                  },
                                  delegate: false
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: true,
                          id: null
                        }
                      }
                    ]
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'C'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'class c { static *[false]() { "use strict"; } set [this] (q) { "use strict"; } set [true] (u) { "use strict"; } }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 113,
        range: [0, 113],
        body: [
          {
            type: 'ClassDeclaration',
            start: 0,
            end: 113,
            range: [0, 113],
            id: {
              type: 'Identifier',
              start: 6,
              end: 7,
              range: [6, 7],
              name: 'c'
            },
            superClass: null,
            body: {
              type: 'ClassBody',
              start: 8,
              end: 113,
              range: [8, 113],
              body: [
                {
                  type: 'MethodDefinition',
                  start: 10,
                  end: 45,
                  range: [10, 45],
                  kind: 'method',
                  static: true,
                  computed: true,
                  key: {
                    type: 'Literal',
                    start: 19,
                    end: 24,
                    range: [19, 24],
                    value: false
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 25,
                    end: 45,
                    range: [25, 45],
                    id: null,
                    generator: true,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 28,
                      end: 45,
                      range: [28, 45],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 30,
                          end: 43,
                          range: [30, 43],
                          expression: {
                            type: 'Literal',
                            start: 30,
                            end: 42,
                            range: [30, 42],
                            value: 'use strict'
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'MethodDefinition',
                  start: 46,
                  end: 78,
                  range: [46, 78],
                  kind: 'set',
                  static: false,
                  computed: true,
                  key: {
                    type: 'ThisExpression',
                    start: 51,
                    end: 55,
                    range: [51, 55]
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 57,
                    end: 78,
                    range: [57, 78],
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 58,
                        end: 59,
                        range: [58, 59],
                        name: 'q'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 61,
                      end: 78,
                      range: [61, 78],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 63,
                          end: 76,
                          range: [63, 76],
                          expression: {
                            type: 'Literal',
                            start: 63,
                            end: 75,
                            range: [63, 75],
                            value: 'use strict'
                          }
                        }
                      ]
                    }
                  }
                },
                {
                  type: 'MethodDefinition',
                  start: 79,
                  end: 111,
                  range: [79, 111],
                  kind: 'set',
                  static: false,
                  computed: true,
                  key: {
                    type: 'Literal',
                    start: 84,
                    end: 88,
                    range: [84, 88],
                    value: true
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 90,
                    end: 111,
                    range: [90, 111],
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 91,
                        end: 92,
                        range: [91, 92],
                        name: 'u'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 94,
                      end: 111,
                      range: [94, 111],
                      body: [
                        {
                          type: 'ExpressionStatement',
                          start: 96,
                          end: 109,
                          range: [96, 109],
                          expression: {
                            type: 'Literal',
                            start: 96,
                            end: 108,
                            range: [96, 108],
                            value: 'use strict'
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
      'var C = class { static async *gen() { yield [...yield yield]; }}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 64,
        range: [0, 64],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 64,
            range: [0, 64],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 64,
                range: [4, 64],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'C'
                },
                init: {
                  type: 'ClassExpression',
                  start: 8,
                  end: 64,
                  range: [8, 64],
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 14,
                    end: 64,
                    range: [14, 64],
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 16,
                        end: 63,
                        range: [16, 63],
                        kind: 'method',
                        static: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 30,
                          end: 33,
                          range: [30, 33],
                          name: 'gen'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 33,
                          end: 63,
                          range: [33, 63],
                          id: null,
                          generator: true,
                          async: true,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 36,
                            end: 63,
                            range: [36, 63],
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 38,
                                end: 61,
                                range: [38, 61],
                                expression: {
                                  type: 'YieldExpression',
                                  start: 38,
                                  end: 60,
                                  range: [38, 60],
                                  delegate: false,
                                  argument: {
                                    type: 'ArrayExpression',
                                    start: 44,
                                    end: 60,
                                    range: [44, 60],
                                    elements: [
                                      {
                                        type: 'SpreadElement',
                                        start: 45,
                                        end: 59,
                                        range: [45, 59],
                                        argument: {
                                          type: 'YieldExpression',
                                          start: 48,
                                          end: 59,
                                          range: [48, 59],
                                          delegate: false,
                                          argument: {
                                            type: 'YieldExpression',
                                            start: 54,
                                            end: 59,
                                            range: [54, 59],
                                            delegate: false,
                                            argument: null
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
                      }
                    ]
                  }
                }
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(class A {*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get "set"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'set'
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
          }
        ]
      }
    ],
    [
      '(class A {set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set "get"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {"set"(){} "get"(){} "async"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 'set'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'get'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'async'
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
          }
        ]
      }
    ],
    [
      '(class A {async * 34(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 34
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class A {get 5(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 5
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set 9(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 9
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {[a](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
          }
        ]
      }
    ],
    [
      '(class A {*[foo](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get [foo](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set [foo](x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { *[y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x { get [y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class x { set [y](z){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { async *[y](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*[x](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {async * 34(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 34
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class A {get 5(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 5
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set 9(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 9
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {[a](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
          }
        ]
      }
    ],
    [
      '(class A {*[foo](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get [foo](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {set [foo](x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { *[y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x { get [y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class x { set [y](z){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { async *[y](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*[x](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {set(){} get(){} async(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
                  },
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"x"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {"constructor"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'constructor',
                    static: false
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
      '(class A {async "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'method',
                    static: false
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
      '(class A {*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class A {get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class A {get "set"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'get',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'set'
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
          }
        ]
      }
    ],
    [
      '(class A {set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {set "get"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'get'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class A {"set"(){} "get"(){} "async"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 'set'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'get'
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
                  },
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      value: 'async'
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
          }
        ]
      }
    ],
    [
      '(class A {1(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
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
                      type: 'Literal',
                      value: 1
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
          }
        ]
      }
    ],
    [
      '(class x { get [y](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: false
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
      '(class x { set [y](z){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'z'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: false
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
      '(class x { async *[y](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{*foo(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*[x](){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{*555(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    key: {
                      type: 'Literal',
                      value: 555
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'method',
                    static: false
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
      '(class x{async *foo(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *[x](a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                    computed: true,
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *"foo"(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(class x{async *555(a){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
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
                      type: 'Literal',
                      value: 555
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,
                      id: null
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],

    [
      '(class A {static a(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    kind: 'method',
                    static: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      name: 'a'
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
          }
        ]
      }
    ],
    [
      '(class A {static constructor(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Identifier',
                      name: 'constructor'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      '(class A {static get "foo"(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    static: true
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
      '(class A {static set "foo"(x){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'set',
                    static: true
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
      '(class A {static 2(){}})',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ClassExpression',
              id: {
                type: 'Identifier',
                name: 'A'
              },
              superClass: null,
              body: {
                type: 'ClassBody',
                body: [
                  {
                    type: 'MethodDefinition',
                    key: {
                      type: 'Literal',
                      value: 2
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'method',
                    static: true
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
      'class A extends B { *get() {} }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ClassDeclaration',
            id: {
              type: 'Identifier',
              name: 'A'
            },
            superClass: {
              type: 'Identifier',
              name: 'B'
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
                    name: 'get'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
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
      'class a { async *get(){} }',
      Context.None,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  key: {
                    name: 'get',
                    type: 'Identifier'
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: true,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: true,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            id: {
              name: 'a',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { [1n](){} }`,
      Context.None,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: true,
                  key: {
                    bigint: '1',
                    type: 'Literal',
                    value: 1n
                  },
                  kind: 'method',
                  static: false,
                  type: 'MethodDefinition',
                  value: {
                    async: false,
                    body: {
                      body: [],
                      type: 'BlockStatement'
                    },
                    generator: false,
                    id: null,
                    params: [],
                    type: 'FunctionExpression'
                  }
                }
              ],
              type: 'ClassBody'
            },
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `class A { static }`,
      Context.OptionsNext | Context.Module,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'static',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
                  value: null
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `class A { static; }`,
      Context.OptionsNext | Context.Module,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'static',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
                  value: null
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ],
    [
      `class A { static = 1 }`,
      Context.OptionsNext | Context.Module,
      {
        body: [
          {
            body: {
              body: [
                {
                  computed: false,
                  decorators: [],
                  key: {
                    name: 'static',
                    type: 'Identifier'
                  },
                  static: false,
                  type: 'PropertyDefinition',
                  value: {
                    type: 'Literal',
                    value: 1
                  }
                }
              ],
              type: 'ClassBody'
            },
            decorators: [],
            id: {
              name: 'A',
              type: 'Identifier'
            },
            superClass: null,
            type: 'ClassDeclaration'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    ]
  ]);
});
