import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Next - Public fields', () => {
  fail('Public fields (fail)', [
    { code: 'class A { "x" = arguments; }', options: { webcompat: true, next: true } },
    { code: 'class A { "x" = super(); }', options: { webcompat: true, next: true } },
    { code: 'class A { x = typeof super(); }', options: { webcompat: true, next: true } },
    { code: 'class A { static "x" = super(); }', options: { webcompat: true, next: true } },
    { code: 'class A { static "x" = arguments; }', options: { webcompat: true, next: true } },
    { code: 'var C = class { x = () => arguments); }', options: { webcompat: true, next: true } },
    { code: 'var C = class { x = () => eval); }', options: { webcompat: true, next: true } },
    { code: 'class A { static "x" = arguments; }', options: { webcompat: true, next: true } },
    {
      code: 'class C { #m = function() { return "bar"; }; Child = class extends C { access() { return super.#m; } method() { return super.#m(); } } }',
      options: { webcompat: true, next: true },
    },
    {
      code: 'class C { #m = function() { return "bar"; }; Child = class extends C { access = () => super.#m; method = () => super.#m(); } }',
      options: { webcompat: true, next: true },
    },
    'class A { a, b }',
    { code: 'class A { a, b }', options: { next: true } },
    'class A { a b }',
    { code: 'class A { a b }', options: { next: true } },
    { code: 'class A { a b() {} }', options: { next: true } },
    { code: 'class A { a = 1, 2 }', options: { next: true } },
    { code: 'class A { a = 1, b = 2 }', options: { next: true } },
  ]);

  for (const arg of [
    'static a : 0',
    'static a =',
    'static constructor',
    'static prototype',
    'static *a = 0',
    'static *a',
    'static a = arguments[0]',
    'static c = [1] = [c]',
    'static a = 0\n *b(){}',
    "static a = 0\n ['b'](){}",
    'a : 0',
    'a =',
    'constructor',
    '*a = 0',
    '*a',
    'c = [1] = [c]',
    'a = 0\n *b(){}',
    "a = 0\n ['b'](){}",
    'static prototype',
    'static constructor',
    // 'field = 1 /* no ASI here */ method(){}',
    '#x = false ? {} : arguments;',
    'x = typeof arguments;',
    'x = {} == arguments;',
    'x = false ? {} : arguments;',
    //   'st\\u0061tic m() {}',
    '{ something.#x }',
    'class C { x = () => arguments; }',
  ]) {
    it(`class C { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`class C { ${arg} }`, { next: true });
      });
    });
  }

  for (const arg of [
    'a = 0;',
    'a = (1, 2)',
    'a = 0; b;',
    'a = 0; b(){}',
    'a = 0; *b(){}',
    "a = 0; ['b'](){}",
    'a;',
    'a; b;',
    'a; b(){}',
    'a; *b(){}',
    "a; ['b'](){}",
    "['a'] = 0;",
    "['a'] = 0; b;",
    "['a'] = 0; b(){}",
    "['a'] = 0; *b(){}",
    "['a'] = 0; ['b'](){}",
    "['a'];",
    "['a']; b;",
    "['a']; b(){}",
    "['a']; *b(){}",
    "['a']; ['b'](){}",
    '0 = 0;',
    '0;',
    "'a' = 0;",
    "'a';",
    'c = [c] = c;',
    'a = 0;\n',
    'a = 0;\n b;',
    'a = 0\n b(){}',
    'a;\n;',
    'a;\n b;\n',
    'a;\n b(){}',
    'a;\n *b(){}',
    "a;\n ['b'](){}",
    "['a'] = 0;\n",
    "['a'] = 0;\n b;",
    "['a'] = 0;\n b(){}",
    "['a'];\n",
    "['a'];\n b;\n",
    "['a'];\n b(){}",
    "['a'];\n *b(){}",
    "['a'];\n ['b'](){}",
    'a;\n get;',
    'get;\n *a(){}',
    'a = function t() { arguments; }',
    'a = () => function() { arguments; }',
    'async;',
    'async = await;',
    'yield;',
    'yield = 0;',
    'yield;\n a;',
    'async;',
    'async = 0;',
    'async;\n a(){}',
    'async;\n a;',
    'await;',
    'await = 0;',
    'await;\n a;',
    '\nx;\ny;\n\n',
    "static ['constructor'];",
    'constructor(props) {;([super.client] = props);}',
    'foo(props) { ;({ client: super.client } = props) }',
    'constructor(props) {;([super.client] = props);}',
    'constructor(props) {;({ x, ...super.client } = props)}',
    outdent`
      #client
      constructor(props) {;([this.#client] = props);}
    `,
    'constructor(props) {;({ x, ...super.x } = props)}', //
    outdent`
      #x
      constructor(props) {;([this.#x] = props);}
    `,
    outdent`
      #x
      constructor(props) {
        this.#x = 1;
        ;([this.x = this.#x, this.#x, this.y = this.#x] = props);
      }
    `,
    outdent`
      #x
      constructor(props) { ;([this.#x] = props); }
      getx() { return this.#x; }
    `,
    outdent`
      #x
      constructor(props) { let x;  ;([x, ...this.#x] = props); }
    `,
    outdent`
      #x
      constructor(props) {;([x, ...this.#x] = props); }
    `,
    outdent`
      #x
      constructor(props) {;({ x: this.#x } = props)}
    `,
    outdent`
      #x
      constructor(props) {;({ x: this.#x } = props)}
    `,
    outdent`
      #x
      constructor(props) {;([x, ...super.x] = props);}
    `,
    outdent`
      #x
      constructor(props) {;([super.x] = props);}
    `,
    outdent`
      #x
      constructor(props) { ;([this.#x] = props); }
      getx() { this.#x = 'foo'; ;({ x: this.x = this.#x, y: this.#x, z: this.z = this.#x } = props) }
    `,
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, { next: true });
      });
    });
  }

  pass('Next - Public fields (pass)', [
    { code: 'var C = class { static async #prototype() {} };', options: { next: true, ranges: true } },
    { code: 'class Foo { x = 1; }', options: { next: true, ranges: true } },
    { code: 'class A { set; }', options: { next: true, ranges: true } },
    { code: 'class A { set = get; }', options: { next: true } },
    { code: 'const createClass = (k) => class { [k()] = 2 };', options: { next: true, ranges: true } },
    { code: 'class A { a = 0; }', options: { next: true } },
    {
      code: 'class A { ;;;;;;[x] = 42; [10] = "meep"; ["not initialized"];;;;;;; }',
      options: { next: true, ranges: true },
    },
    { code: '{ class X { static p = function() { return arguments[0]; } } }', options: { next: true, ranges: true } },
    { code: "class A { ['a'] = 0; b; }", options: { next: true, ranges: true } },
    { code: 'class Some { render=( )=>{ return null; }}', options: { next: true, ranges: true } },
    {
      code: outdent`
        {
          class X {
            static p = function() { return arguments[0]; }
          }
        }

        {
          class X {
            static t = () => {
              function p() { return arguments[0]; };
              return p;
            }
          }

          let p = X.t();
        }
      `,
      options: { next: true, ranges: true },
    },
    { code: 'class X { static p = eval("(function() { return arguments[0]; })(1)"); }', options: { next: true } },
    { code: 'class Some { render=(a,b)=>{ return null; } }', options: { next: true } },
    {
      code: 'class A {  ;;;; ;;;;;;\'a\'; "b"; \'c\' = 39;  "d" = 42;;;;;;;  ;;;; }',
      options: { next: true, ranges: true },
    },
    { code: 'class A { foo; }', options: { next: true, ranges: true } },
    { code: 'class A { a = b = c }', options: { next: true, ranges: true } },
    { code: 'class A { a = b += c }', options: { next: true, ranges: true } },
    { code: 'class C { static x }', options: { ranges: true, loc: true } },
  ]);
});
