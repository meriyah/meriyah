import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Declarations - Class', () => {
  // Strict mode errors
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
  }

  // Tests reserved keywords
  for (const arg of [
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
    it(`class ${arg} {};`, () => {
      t.throws(() => {
        parseSource(`class ${arg} {};`, undefined, Context.None);
      });
    });

    it(`"use strict"; class ${arg} {};`, () => {
      t.throws(() => {
        parseSource(`"use strict"; class ${arg} {};`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'class',
    'class name extends',
    'class extends',
    'class name {',
    'class name { get x() }',
    'class name { set x() {) }',
    'class {}',
    'class extends base {}',
    'class name { *'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} `, undefined, Context.OptionsWebCompat);
      });
    });

    it(`if (true) { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`if (true) { ${arg} }`, undefined, Context.OptionsLexical);
      });
    });

    it(`{${arg}}`, () => {
      t.throws(() => {
        parseSource(`{${arg}}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'a class;',
    'a(eval){}',
    'a{ *() {} }',
    'get x',
    'get x() ',
    'get x',
    'get x() ',
    '*',
    '*get x() {}',
    '*set x(_) {}',
    '*static m() {}',
    'a{ get get a() {}',
    'A { get constructor() {} }',
    'C { *method() { with ({}) {} } }',
    '*static x() {}',
    'async x : 0',
    'async : 0',
    'get constructor() {}',
    'get constructor(_) {}',
    '*constructor() {}',
    'async static x(){}',
    'static prototype() {}',
    'static get prototype() {}',
    'static set prototype(_) {}',
    'static *prototype() {}',
    'static *async x(){}',
    'static async *(){}',
    'static async get x(){}',
    'static async set x(y){}',
    'static async x : 0',
    'static async : 0',
    'async foo() { return {await} }',
    'method() { with ({}) {} }',
    '*method() { with ({}) {} }',
    '0123() {}',
    'static get prototype() {} ',
    'static set prototype(x) {}',
    '* constructor() {}',
    'get constructor()',
    'set constructor(x) ',
    'static prototype() {}',
    'static prototype() {}',
    'static prototype() {}',
    'static prototype() {}',
    'static prototype() {}',
    'static * prototype() {}',
    ' * constructor() {}',
    'get constructor() {}',
    'set constructor(_) {}',
    'static async * prototype() {}',
    'static prototype() {}',
    'static * method() { super();  }',
    'static get prototype() {}',
    ' async method(...x = []) {}',
    ' async method(...a,) {}',
    'static method(...x = []) {}',
    'method() { [super.x] = []; }',
    'method() { const [super.x] = []; }',
    'method() { var [super()] = []; }',
    'method() { let [super()] = []; }',
    'method() { [super()] = []; }'
  ]) {
    it(`class ${arg}`, () => {
      t.throws(() => {
        parseSource(`class ${arg} `, undefined, Context.None);
      });
    });
    it(`class { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class { ${arg} }`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'constructor() {}; static constructor() {}',
    'm() {}; static m() {}',
    'm() {}; m() {}',
    'static m() {}; static m() {}',
    'get m() {}; set m(_) {}; get m() {}; set m(_) {};',
    'void',
    'voi\\u0064',
    'get \\u0076oid() {} set voi\\u0064(v) {}',
    'void() {}',
    '\\u0076oid() {}',
    'voi\\u0064() {}',
    'static void',
    'static voi\\u0064',
    'static void() {}',
    'static async *\\u0076oid() {}'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg}}`, undefined, Context.None);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { ${arg} })`, undefined, Context.None);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { ${arg} })`, undefined, Context.OptionsLexical);
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
    it(`class C { ${arg}() {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg}() {}}`, undefined, Context.None);
      });
    });

    it(`class C { *${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { *${arg}(v) {}}`, undefined, Context.None);
      });
    });

    it(`class C { static *${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { static *${arg}(v) {}}`, undefined, Context.None);
      });
    });

    it(`(class {${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class {${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`(class {${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class {${arg}() {}});`, undefined, Context.OptionsLexical);
      });
    });

    it(`(class { static ${arg}() {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class { static ${arg}() {}});`, undefined, Context.None);
      });
    });

    it(`class C { set ${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg}(v) {}}`, undefined, Context.None);
      });
    });

    it(`class C { async *${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { async *${arg}(v) {}}`, undefined, Context.None);
      });
    });

    it(`class C { async *${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { async *${arg}(v) {}}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`(class C { async *${arg}(v) {}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { async *${arg}(v) {}})`, undefined, Context.None);
      });
    });

    it(`(class C { async *${arg}(v) {}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { async *${arg}(v) {}})`, undefined, Context.OptionsLexical);
      });
    });

    it(`class C { static ${arg}(v) {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { static ${arg}(v) {}}`, undefined, Context.None);
      });
    });

    it(`class C { static get ${arg}() {}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { static get ${arg}() {}}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'class name {}',
    'class name extends F {}',
    'class name extends (F, G) {}',
    'class name extends class {} {}',
    'class name extends class base {} {}'
  ]) {
    it(`{ ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; if (true) { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; if (true) { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; if (true) { ${arg} }`, undefined, Context.None);
      });
    });

    it(`'use strict'; if (true) { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; if (true) { ${arg} }`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'class foo { constructor() {} }',
    `class foo { constructor() { class bar { constructor() {} }} }`,
    'class foo extends bar {}',
    'class foo extends bar { method() {} get property() { return this._property; }  set property(value) {  this._property = value; }}',
    'class foo extends class bar {} {}',
    'class foo extends class { constructor() {}} {}',
    'class foo extends class { constructor() {} } { constructor() {} }',
    'class foo { [Symbol.iterator]() {} ["method"]() {} }',
    'class foo { static classMethod() {} method() {} }',
    'class foo { static get property() {} static set property(value) {} }',
    'class foo { async method(a, b = 39,) {} }',
    'class foo { async method(a, b,) {} }',
    'class foo { static method(a,) {} }',
    'class foo { static set a(_ = null) {} }',
    'class foo { static method(a,) {} }'
  ]) {
    it(`{ ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`{ ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`{ ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    ';',
    ';;',
    'm() {}',
    'm() {};',
    '; m() {}',
    'm() {}; n(x) {}',
    'async ["xyz"]() {}',
    'async *method([{ x, y, z } = { x: 44, y: 55, z: 66 }] = []) {}',
    'async *method([{ x }] = []) {}',
    'async yield() {}',
    'static async await() { }',
    'async await() { }',
    'static* async() { }',
    '*async() { }',
    'static async() { }',
    'async() { }',
    'static async foo() { }',
    'async foo() { }',
    'foo() { }',
    ';',
    ';;',
    ';;;;;;;;;;;;;;;;;;;',
    ';;;; a() {}',
    ';;;;  a() {} ;;;; b() {};;;  static a() {};;;',
    'static *bar() { }',
    'static[a](){}; static[b](){}',
    'static a(){} static get a(){} static set a(b){}',
    'static ["prototype"](){}',
    'async *method([arrow = () => {}] = []) { }',
    'async foo(a) { await a }',
    'async() { }',
    '*async() { }',
    'static foo() {} foo() {}',
    'foo() {} foo() {}',
    'get foo() {} get foo() {}',
    'set foo(x) {} set foo(x) {}',
    'get foo() {} set foo(x) {}',
    'static foo() {} static foo() {}',
    'static get foo() {} static get foo() {}',
    'static set foo(x) {} static set foo(x) {}',
    'static get foo() {} static set foo(x) {}static get foo() {} static set foo(x) {}',
    'foo() {} get foo() {} set foo(x) {}',
    'static get foo() {} static set foo(x) {} get foo() {} set foo(x) {}',
    'static foo() {} static get foo() {} static set foo(x) {}',
    'static foo() {} foo() {}',
    'static foo() {} get foo() {} set foo(x) {}',
    'foo() {} static get foo() {} static set foo(x) {}',
    'static* async() { }',
    'static async await() { }',
    'async "foo"(){}',
    'async 100(){}',
    'async await() {}',
    'static async f(){}',
    'async f(a) { await a }',
    'get eval() {}',
    'get arguments() {}',
    'set arguments(_) {}',
    'static arguments() {}',
    'static *arguments() {}',
    'static set arguments(_) {}',
    '*async() {}',
    'static* async() {}',
    'async await() {}',
    'static async await() { }',
    'static async foo() { }',
    '*gen(v) { yield v; }',
    '*static() {}',
    'static get [foo]() {}',
    'set foo(v) {} get foo() {}',
    'constructor() {}; static constructor() {}',
    'prototype() {}',
    'get get() {}',
    "async *gen() {  var v = yield* obj;  return 'return-value'}",
    'eval() {}',
    '*eval() {}',
    'static constructor() {}',
    'static get foo() {}',
    'static set(v) {};',
    "get ['constructor']() {}",
    'get foo() {} set foo(v) {}',
    'static get foo() {} static get bar() {}',
    "[ID(2)]() { return 'D'; }",
    "*['a']() {  yield 1; yield 2; }",
    "*['constructor']() {}",
    "*['constructor']() {}",
    "[key1]() { return 'B'; } c() { return 'C'; }  [key2]() { return 'D'; }",
    "a() { return 'A'; }  [key1]() { return 'B'; }  c() { return 'C'; } [key2]() { return 'D'; }",
    "get d() { return 'D'; }",
    "set ['a'](_) {}",
    "static *['constructor']() {}",
    "static ['constructor']() {}",
    "static set ['constructor'](x) {}",
    "static set ['prototype'](x) {}",
    "set ['constructor'](_) {}",
    "['constructor']() {} ['constructor']() {}",
    "a() { return 'A'; }",
    "[1]() { return 'B'; }",
    "c() { return 'C'; }",
    "static set 'string'(param) { stringSet = param; }",
    "static get ''() { return 'get string'; }",
    "static set ''(param) { stringSet = param; }",
    'static set [a](_) {}',
    "get 0() { return 'get string'; }",
    'set 0(param) { stringSet = param; }',
    'constructor() {}',
    'constructor(a, b, c) {}',
    'constructor(x, y) {}',
    'method() { class SubClass {} }',
    'get c() {}',
    "get ['c']() {}",
    "get ['d']() {}",
    'async *method([]) {}',
    ';;',
    'a(){}',
    'a(){}b(){}',
    'a(){};b(){};',
    'static(){};',
    'static static(){};',
    '"constructor"(){} ["constructor"](){}',
    'static ["prototype"](){}',
    'static constructor(){} static constructor(){}',
    'static async method(a, b,) {}',
    'async method(x, y = x, z = y) {}',
    'async *gen() {}',
    'static async *method() {}',
    'async *method(a, b,) {}',
    'async *method(x, y = x, z = y) {}',
    "static get 'string'() { return 'get string'; }",
    'async *method({...rest} = {a: 3, b: 4}) {}',
    'async *method({ w: { x, y, z } = undefined } = { }) {}',
    'async *method({ w: [x, y, z] = [4, 5, 6] } = { w: null }) {}',
    'async *method({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    'async *method({ x = function() {} } = {}) {}',
    'async *method({ arrow = () => {} } = {}) {}',
    'async *method([...{ length }] = [1, 2, 3]) {}',
    'async *method([, , ...x] = [1, 2]) {}',
    'async *method([, ...x] = (function*() {})()) {}',
    'async *method([{ x }] = [null]) {}',
    'async *method([x, y, z] = [1, 2, 3]) {}',
    'async *method([x] = []) {}',
    'async *method([...{ length }]) {}',
    'async *method([...x]) {}',
    'async *method([, , ...x]) {}',
    'static async *method([...{ length }]) {}',
    'static async *method([...x]) {}',
    'static async *method([...[,]]) {}',
    'static async *method([]) {}',
    'static async *method([{ x, y, z } = { x: 44, y: 55, z: 66 }]) {}',
    'static async *method([ x = y ]) {}',
    'static async *method([w = a(), x = b(), y = c(), z = d()]) {}',
    'static async *method([x, y, z]) {}',
    'static async *method([x]) {}',
    'async *method({ w: { x, y, z } = { x: 4, y: 5, z: 6 } }) {}',
    'async *method({ w: { x, y, z } = undefined }) {}',
    'async *method({ x: y, }) {}',
    'async *method({ a: b = c }) {}',
    'async *method({ s: t = a(), u: v = b(), w: x = c(), y: z = d() }) {}',
    'async *method({ [function icefapper() {}]: x }) {}',
    'async *method({ x: [y], }) {}',
    'async *method({ a, b = function c(){}, d = ++icefapper }) {}',
    'async *method({ a = (function () {}), b = (0, function() {})  }) {}',
    'static constructor() {}',
    'static get constructor() {}',
    'static set constructor(_) {}',
    'static *constructor() {}',
    'static async *method([...[...x]] = [1, 2, 3]) {}',
    'static async *method([...[]] = function*() {}) {}',
    'static async *method([] = function*() {}) {}',
    'static async *method([,] = function*() {}) {}',
    'static async *method([{ x }] = []) {}',
    'static async *method([{ u: v, w: x, y: z } = { u: 444, w: 555, y: 666 }] = []) {}',
    'static async *method([{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }]) {}',
    'static async *method([_, x] = []) {}',
    'static async *method([x] = []) {}',
    "static async *method([w = a(), x = b(), y = c(), z = d()] = [null, 0, false, '']) {}",
    'static async *method([arrow = () => {}] = []) {}',
    'static async *method([[x]] = [null]) {}',
    'static async *method([[...x] = function() { initCount += 1; }()] = [[2, 1, 3]]) {}',
    'static async *method([[] = function() { initCount += 1; }()] = [[23]]) {}',
    'static async *method([x, y, z] = [1, 2, 3]) {}',
    'static async *method([x] = {}) {}',
    'static async x(){}',
    'static async(){}',
    'static *async(){}',
    'async x(){}',
    'async 0(){}',
    '*[Symbol.iterator]() {}',
    'static *bar() {}',
    'static a(){};',
    'a(){}',
    'a(){}b(){}',
    'constructor(){}',
    '*g() {}',
    '*g() {};',
    '; *g() {}',
    '*g() {}; *h(x) {}',
    'get x() {}',
    'set x(v) {}',
    'get() {}',
    'set(a) {}',
    '*[1]() {}',
    'set "doubleQuote"(a) {}',
    'set 0o10(a) {a}',
    'set 0(a) {a}',
    'set "unicod\\u{000065}Escape"(a) {}',
    'static set [_ = "str' + 'ing"](param) {}',
    'get "character\tescape"() { return "get string"; }',
    'get "character\tescape"() { return "get string"; }',
    'get "character\tescape"() { return "get string"; }'
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.None);
      });
    });

    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsLexical);
      });
    });

    it(`class A extends B { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class A extends B { ${arg} }`, undefined, Context.None);
      });
    });
  }
});
