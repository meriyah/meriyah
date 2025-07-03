import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Next - Private methods', () => {
  fail('Private methods (fail)', [
    'class A { #a b() {} }',
    'class A { #a b }',
    'class A { #a #b }',
    'class A { a #b }',
    'a = { #ab() {} }',
    'class A { [{#ab() {}}]() {} }',
    'class A{ # a() {}}',
    'class C{ #method() { super(); } }',
    'var o = { #m() {} };',
    'var o = { async #m() {} };',
    'var o = { *#m() {} };',
    'class A { constructor = 4 }',
    'class A { #constructor = 4 }',
    'class A { a = () => super() }',
    'class A { # a }',
    'class A { #a; a() { this.# a } }',
    'class A {  #x; g = this.f; x = delete (g().#m); }',
    'class A {  #x; x = delete (this.#m); }',
    'class A {  #x; g = this.f; x = delete (g().#m); }',
    'class A {  #x; x = delete (g().#m); async *#m() {} }',
    'class A {  #x; x() { var g = this.f; delete g().#x; } }',
    'class A {  #x; x() { delete ((this.#m ));  } async #m() {} }',
    'class A { # x }',
    String.raw`class A { #\u0000; }`,
    'class A { * # m() {} }',
    'class A { # x; }',
    'class A { #x; m() { this.# x; }}',
    'class A { # m() {} }',
    'class A { static get # m() {} }',
    'class A { * method() { super(); } }',
    'class A { static async * prototype() {} }',
    'class A { static async #method() { super(); } }',
    String.raw`class A { method() { this.\u0023field; } }`,
    'class C { static #x = super(); }',
    String.raw`class C { async \u0023m() {} } }`,
    'class C { static async *#gen() { var await; } }',
    'class C { static async *#gen() { void await; } }',
    'class C { static async *#gen() { var yield; } }',
    'class C { static async *#gen() { void yield; } }',
    'class C { static async *#gen() { yield: ; } }',
    String.raw`class C { static async *#gen() {  void \u0061wait; } }`,
    String.raw`class C { async \u0023m() {} } }`,
    String.raw`class C { #method() { a() { foo().\u0023field; } } }`,
    String.raw`class C { #method() { \u0023field; } }`,
    String.raw`class C {  async \u0023m() {} }`,
    'var C = class { x = 42  *gen() {} }',
    'class Spaces { #  wrongSpaces() { return fail(); } }',
    'class C{ #method() { #[m] = 1} }',
    'class C{ #method() { #"p" = x } }',
    'class C{ #method() { super(); } }',
    '(class C extends Base { async #*a() { } })',
    'class C{ #method() { super(); } }',
    'class C{ #method() { super(); } }',
    'class C{ #method() { super(); } }',
    'class C { #x = () => arguments; }',
    { code: 'class A { #x; #x }', options: { lexical: true } },
    { code: 'class A { get #x() {} get #x() {} }', options: { lexical: true } },
    { code: 'class A { set #x(v) {} set #x(v) {} }', options: { lexical: true } },
    { code: 'class A { static get #x() {} static get #x() {} }', options: { lexical: true } },
    { code: 'class A { static set #x(v) {} static set #x(v) {} }', options: { lexical: true } },
    { code: 'class A { #x; fn() { return this.#y } }', options: { lexical: true } },
    { code: 'class A { #x } function fn() { return this.#y }', options: { lexical: true } },
    { code: 'class A extends B { #x() {} method() { super.#x() }  }', options: { lexical: true } },
  ]);

  for (const arg of [
    '#a : 0',
    '#a =',
    '#*a = 0',
    '#*a',
    '#constructor',
    'static #constructor',
    '#constructor = function() {}',
    '# a = 0',
    '#0 = 0;',
    '#0;',
    "#'a' = 0;",
    "#'a';",
    "#['a']",
    "#['a'] = 1",
    '#[a]',
    '#[a] = 1',
    '#a = arguments',
    'foo() { delete this.#a }',
    'foo() { delete this.x.#a }',
    'foo() { delete this.x().#a }',
    'foo() { delete f.#a }',
    'foo() { delete f.x.#a }',
    'foo() { delete f.x().#a }',
    '#a = 0\n *b(){}',
    "#a = 0\n ['b'](){}",
    'const { x: x } = this;',
    'var C = class { #x = 1; destructureX() { const { #x: x } = this; } };',
    'get # m() {}',
    'set # m(_) {}',
    'async * # m() {}',
    'async # m() {}',
    'm() { this.f().# x; }',
    '# x = 1;',
    '# x;',
    '* # m() {}',
    '# m() {}',
    'static get # m() {}',
    'async #*a() { }',
    '#x = () => /*{ initializer }*/;',
    '#x = /*{ initializer }*/;',
    '#x = false ? {} : /*{ initializer }*/;',
    '#x = typeof /*{ initializer }*/;',
    'static #x = /*{ initializer }*/;',
    '#x = () => super();',
    '#x = super();',
    String.raw`#\u0000;`,
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`);
      });
    });

    it(`class C extends Base { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C extends Base { ${arg} }`);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.throws(() => {
        parseSource(`(class C { ${arg} })`);
      });
    });

    it(`(class C extends Base { ${arg} })`, () => {
      t.throws(() => {
        parseSource(`(class C extends Base { ${arg} })`);
      });
    });
  }

  for (const arg of [
    '#a = 0;',
    '#a = 0; #b;',
    '#a = 0; b;',
    '#a = 0; b(){}',
    '#a = 0; *b(){}',
    "#a = 0; ['b'](){}",
    '#a;',
    '#a; #b;',
    '#a; b;',
    '#a; b(){}',
    '#a; *b(){}',
    "#a; ['b'](){}",
    'async #a() { }',
    'static #prototype() {}',
    'static * #prototype() {}',
    'async *#a() { }',
    '#a = 0;\n',
    '#a = 0;\n #b;',
    '#a = 0;\n b;',
    '#a = 0;\n b(){}',
    '#a;\n',
    '#a;\n #b;\n',
    '#a;\n b;\n',
    '#a;\n b(){}',
    '#a;\n *b(){}',
    "#a;\n ['b'](){}",
    '#a;\n get;',
    '#get;\n *a(){}',
    '#a;\n static;',
    '#a = function t() { arguments; }',
    '#a = () => function() { arguments; }',
    '#yield;',
    '#yield = 0;',
    '#yield;\n a;',
    '#async;',
    '#async = 0;',
    '#async;',
    '#async = 0;',
    '#async;\n a(){}',
    '#async;\n a;',
    '#await;',
    '* #foo() {}',
    'async * #foo() {}',
    ' get #bar() {}',
    'set #baz(taz) {}',
    'static async foo() {}',
    'static foo() {}',
    'static ["foo"]() {}',
    'async *#foo() {}',
    '#await = 0;',
    '#await;\n a;',
    'foo() { this.#m, (() => this)().#m }',
    ' #_;',
    '#\u2118;',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    'foo() { this.#m, (() => this)().#m }',
    '#method() { super.x(); }',
    String.raw`#\u{61}`,
    '#\\u{61}\n',
    String.raw`#\u{61}bc;`,
    '#\\u{61};\n',
    String.raw`#\u{61} = 2`,
    '#\\u{61} = 2;\n',
    String.raw`static #\u{61}`,
    'static #\\u{61}\n',
    String.raw`static #\u{61};`,
    String.raw`static #\u{61}bc=2`,
    'static #\\u{61} = 2;\n',
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`);
      });
    });

    it(`class C extends Base { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C extends Base { ${arg} }`);
      });
    });

    it(`(class C { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C { ${arg} })`);
      });
    });

    it(`(class C extends Base { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(class C extends Base { ${arg} })`);
      });
    });
  }
  for (const arg of [
    '{ class C { #a() { class B { #a() {  } } new B; } } new C; }',
    '{ class A { #a() { class C extends A { #c() { } } new C; } } new A; }',
    '{ const C = class { #a() { } } }',
    '{ class A { constructor(arg) { return arg; } } class C extends A { #x() { } constructor(arg) { super(arg); } }  let c1 = new C({}); }',
    'class D extends class { #c() {} } { #d() {} }',
    'class E extends D { #e() {} }',
    'var C = class { *m() { return 42; } #m() {}; method() { return this.#m(); } }',
    'var C = class {  *m() { return 42; } static #$; static #_; static _(value) { this.#_ = value; return this.#_; }}',
    'var C = class { static async *m() { return 42; } static async * #$(value) {  yield * await value; } }',
    'var C = class {   static async *m() { return 42; } static async * #$(value) { yield * await value; } }',
    'var C = class { static async *m() { return 42; } static #$; static #_; }',
    'var C = class { static async m() { return 42; } #℘_; ℘(value) { this.#℘_ = value; return this.#℘; }}',
    'var C = class { static async m() { return 42; } static * #$(value) { yield * value; }  static * #_(value) {  yield * value; } }',
    'var C = class { static m() { return 42; } static #$ = 1; static #_ = 1; static _() { return this.#_; } }',
    'var C = class { static m() { return 42; } static #$ = 1; static #_ = 1; static _() { return this.#_; } }',
    '{ class C { #a() { class B { #a() {  } } new B; } } new C; }',
    outdent`
      {
      {\n
        class A {\n
          #a() { return 1; }\n
        }\n
      \n
        new A;\n
      }\n
      {\n
        class D {\n
          #d() {}\n
        }\n
      \n
        class E extends D {\n
          #e() {}\n
        }\n
      \n
        new D;\n
        new E;\n
      }
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }
  pass('Next - Private methods (pass)', [
    'class A { #key; }',
    'class A { static async #_(value) { return await value;} }',
    { code: 'class A { #a; #b; }', options: { ranges: true } },
    { code: 'class A { #yield = b[c]; }', options: { ranges: true } },
    { code: 'class A { #yield = foo + bar; }', options: { ranges: true } },
    { code: 'class A { #yield; }', options: { ranges: true } },
    'class C { static async *#gen() { yield { ...yield,  y: 1, ...yield yield, }; } static get gen() { return this.#gen; } }',
    'class C { static *#gen() { yield [...yield yield]; } static get gen() { return this.#gen; } }',
    'class C { get #℘() {} set #℘(x) {} a() { return this.#℘; } b(value) { this.#℘ = x; } };',
    'class C { #m() { return 42; } get ref() { return this.#m; } }',
    'class A { #foo = bar; }',
    outdent`
      class Cl {
        #privateField = "top secret string";

        constructor() {
          this.publicField = "not secret string";
        }

        get #privateFieldValue() {
          return this.#privateField;
        }

        set #privateFieldValue(newValue) {
          this.#privateField = newValue;
        }

        publicGetPrivateField() {
          return this.#privateFieldValue;
        }

        publicSetPrivateField(newValue) {
          this.#privateFieldValue = newValue;
        }

        get publicFieldValue() {
          return this.publicField;
        }

        set publicFieldValue(newValue) {
          this.publicField = newValue;
        }

        testUpdates() {
          this.#privateField = 0;
          this.publicField = 0;
          this.#privateFieldValue = this.#privateFieldValue++;
          this.publicFieldValue = this.publicFieldValue++;

          ++this.#privateFieldValue;
          ++this.publicFieldValue;

          this.#privateFieldValue += 1;
          this.publicFieldValue += 1;

          this.#privateFieldValue = -(this.#privateFieldValue ** this.#privateFieldValue);
          this.publicFieldValue = -(this.publicFieldValue ** this.publicFieldValue);
        }
      }
    `,
    outdent`
      class Cl {
        #privateField = 0;

        get #privateFieldValue() {
          return this.#privateField;
        }

        constructor() {
          this.#privateFieldValue = 1;
        }
      }
    `,
    outdent`
      class Cl {
        #privateField = "top secret string";

        constructor() {
          this.publicField = "not secret string";
        }

        get #privateFieldValue() {
          return this.#privateField;
        }

        set #privateFieldValue(newValue) {
          this.#privateField = newValue;
        }

        publicGetPrivateField() {
          return this.#privateFieldValue;
        }

        publicSetPrivateField(newValue) {
          this.#privateFieldValue = newValue;
        }
      }
    `,
    'class A { #key() {} }',
    'class A { #yield\n = 0; }',
    'class A { #foo() { #bar } }',
    'class A { static #key; }',
    'class A { static #foo(bar) {} }',
    'class A { m() {} #a; }',
    'class A {  #a; m() {} }',
    'class A {  #a; m() {} #b; }',
    'class A { m() { return 42; } #a;  #__;  #NJ_;  #℘_ ; }',
    outdent`
      class A { #foo = () => 'bar';  method() {
        return this.#foo();
      } }
    `,
    'class B { #x = 0; #y = 1; }',
    outdent`
      class A {
        static #x;
        static #y = 1;
      }
    `,
    "class A {  #m = async function() { return 'foo'; };  method() { return this.#m(); } }",
    "class A { method() { return this.#m(); } #m = function () { return 'foo'; };  }",
    'class A {  #m() { return 42; } get bGetter() { return this.#b; } #b = this.#m(); get ref() { return this.#m; } constructor() {} }',
    'class A { #$_; #℘_; }',
    'class A { $(value) { this.#$_ = value; return this.#$; } }',
    outdent`
      var C = class {
        static *m() { return 42; } #$_; #__;  #℘_;   set #$(value) { this.#$_ = value;
        }
        set #_(value) {
          this.#__ = value;
        }
      }
    `,
    'class A { get #foo/*{ declareWith }*/() {} }',
    outdent`
      var C = class {
        static async *m() { return 42; } #$_; #__;

        get #_() {
          return this.#__;
        }
        $(value) {
          this.#$_ = value;
          return this.#$;
        }
        _(value) {
          this.#__ = value;
          return this.#_;
        }

      }
    `,
    outdent`
      class Hotel {
        get #evil() {
          return ohNo();
        }
        set #evil(x) {
          return makeEvil(x);
        }
      }
    `,
    outdent`
      var C = class {
        ;;;;
        ;;;;;;;;;;;;;
        ;;;;
        static #x(value) {
          return value / 2;
        }
        static #y(value) {
          return value * 2;
        }
        static x() {
          return this.#x(84);
        }
        static y() {
          return this.#y(43);
        }
      }
    `,
    'class A { static set #foo/*{ declareWith }*/(param) {} }',
    'class A { #\\u{61}\nstatic #\\u0062() {} }',
    { code: 'class a {#𐌭人}', options: { ranges: true } },
    { code: 'class a {#人}', options: { ranges: true } },
    { code: 'class a {#𐌭}', options: { ranges: true } },
    { code: 'class C { get \n#m() {} }', options: { ranges: true, loc: true } },
    { code: 'class C { set \n#m(v) {} }', options: { ranges: true, loc: true } },
    { code: 'class C { async #m() {} }', options: { ranges: true, loc: true } },
    { code: 'class C { * \n#m(v) {} }', options: { ranges: true, loc: true } },
    { code: 'class C { async * \n#m() {} }', options: { ranges: true, loc: true } },
    { code: 'class C { accessor #x = 1 }', options: { ranges: true, loc: true, next: true } },
  ]);
});
