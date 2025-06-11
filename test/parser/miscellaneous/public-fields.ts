import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Next - Public fields', () => {
  fail('Public fields (fail)', [
    ['class A { "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { x = typeof super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = super(); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    ['var C = class { x = () => arguments); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['var C = class { x = () => eval); }', Context.OptionsWebCompat | Context.OptionsNext],
    ['class A { static "x" = arguments; }', Context.OptionsWebCompat | Context.OptionsNext],
    [
      'class C { #m = function() { return "bar"; }; Child = class extends C { access() { return super.#m; } method() { return super.#m(); } } }',
      Context.OptionsWebCompat | Context.OptionsNext,
    ],
    [
      'class C { #m = function() { return "bar"; }; Child = class extends C { access = () => super.#m; method = () => super.#m(); } }',
      Context.OptionsWebCompat | Context.OptionsNext,
    ],
    ['class A { a, b }', Context.None],
    ['class A { a, b }', Context.OptionsNext],
    ['class A { a b }', Context.None],
    ['class A { a b }', Context.OptionsNext],
    ['class A { a b() {} }', Context.OptionsNext],
    ['class A { a = 1, 2 }', Context.OptionsNext],
    ['class A { a = 1, b = 2 }', Context.OptionsNext],
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
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
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
    `\nx;\ny;\n\n`,
    `static ['constructor'];`,
    `constructor(props) {;([super.client] = props);}`,
    `foo(props) { ;({ client: super.client } = props) }`,
    `constructor(props) {;([super.client] = props);}`,
    `constructor(props) {;({ x, ...super.client } = props)}`,
    `#client
    constructor(props) {;([this.#client] = props);}`,
    `constructor(props) {;({ x, ...super.x } = props)}`, //
    `#x
    constructor(props) {;([this.#x] = props);}`,
    `#x
     constructor(props) {
      this.#x = 1;
      ;([this.x = this.#x, this.#x, this.y = this.#x] = props);
    }`,
    `#x
    constructor(props) { ;([this.#x] = props); }
    getx() { return this.#x; }`,
    `#x
    constructor(props) { let x;  ;([x, ...this.#x] = props); }`,
    `#x
    constructor(props) {;([x, ...this.#x] = props); }`,
    `#x
    constructor(props) {;({ x: this.#x } = props)}`,
    `#x
    constructor(props) {;({ x: this.#x } = props)}`,
    `#x
    constructor(props) {;([x, ...super.x] = props);}`,
    `#x
    constructor(props) {;([super.x] = props);}`,
    `#x
    constructor(props) { ;([this.#x] = props); }
    getx() { this.#x = 'foo'; ;({ x: this.x = this.#x, y: this.#x, z: this.z = this.#x } = props) }`,
  ]) {
    it(`class C { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C { ${arg} }`, undefined, Context.OptionsNext);
      });
    });
  }

  pass('Next - Public fields (pass)', [
    [`var C = class { static async #prototype() {} };`, Context.OptionsNext | Context.OptionsRanges],
    [`class Foo { x = 1; }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { set; }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { set = get; }`, Context.OptionsNext],
    [`const createClass = (k) => class { [k()] = 2 };`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { a = 0; }`, Context.OptionsNext],
    [
      `class A { ;;;;;;[x] = 42; [10] = "meep"; ["not initialized"];;;;;;; }`,
      Context.OptionsNext | Context.OptionsRanges,
    ],
    [`{ class X { static p = function() { return arguments[0]; } } }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { ['a'] = 0; b; }`, Context.OptionsNext | Context.OptionsRanges],
    ['class Some { render=( )=>{ return null; }}', Context.OptionsNext | Context.OptionsRanges],
    [
      `{
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
      }`,
      Context.OptionsNext | Context.OptionsRanges,
    ],
    ['class X { static p = eval("(function() { return arguments[0]; })(1)"); }', Context.OptionsNext],
    ['class Some { render=(a,b)=>{ return null; } }', Context.OptionsNext],
    [`class A {  ;;;; ;;;;;;'a'; "b"; 'c' = 39;  "d" = 42;;;;;;;  ;;;; }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { foo; }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { a = b = c }`, Context.OptionsNext | Context.OptionsRanges],
    [`class A { a = b += c }`, Context.OptionsNext | Context.OptionsRanges],
  ]);
});
