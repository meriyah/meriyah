import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Declarations - Let', () => {
  // Invalid 'let' as identifier cases

  for (const arg of [
    'let let = 1',
    'for (let let = 1; let < 1; let++) {}',
    'for (let let in {}) {}',
    'for (let let of []) {}',
    'const let = 1',
    'for (const let = 1; let < 1; let++) {}',
    'for (const let in {}) {}',
    'for (const let of []) {}',
    'let [let] = 1',
    'for (let [let] = 1; let < 1; let++) {}',
    'for (let [let] in {}) {}',
    'for (let [let] of []) {}',
    'const [let] = 1',
    'for (const [let] = 1; let < 1; let++) {}',
    'for (const [let] in {}) {}',
    'for (const [let] of []) {}',
    String.raw`let l\u0065t = 1`,
    String.raw`const l\u0065t = 1`,
    String.raw`let [l\u0065t] = 1`,
    String.raw`const [l\u0065t] = 1`,
    String.raw`for (let l\u0065t in {}) {}`,
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

    it(`(function() {${arg}})()`, () => {
      t.throws(() => {
        parseSource(`(function() {${arg}})()`);
      });
    });

    it(`(function() {${arg}})()`, () => {
      t.throws(() => {
        parseSource(`(function() {${arg}})()`, { lexical: true });
      });
    });
  }

  // Valid 'let' as identifier cases
  for (const arg of [
    'var let;',
    'var foo, let;',
    'try { } catch (let) { }',
    'function let() { }',
    '(function let() { })',
    'function foo(let) { }',
    'function foo(bar, let) { }',
    'let = 1;',
    'var foo = let = 1;',
    'let * 2;',
    '++let;',
    'let++;',
    'let: 34',
    'function let(let) { let: let(let + let(0)); }',
    '({ let: 1 })',
    '({ get let() { 1 } })',
    'let(100)',
    'L: let\nx',
    'L: let\n{x}',
    'let',
    'let = 1',
    'for (let = 1; let < 1; let++) {}',
    'for (let in {}) {}',
    'for (var let = 1; let < 1; let++) {}',
    'for (var let in {}) {}',
    'for (var [let] = 1; let < 1; let++) {}',
    'for (var [let] in {}) {}',
    'var let',
    'let;',
    'let.let = foo',
    'var [let] = []',
    'let f = /* before */async /* a */ ( /* b */ a /* c */ , /* d */ b /* e */ ) /* f */ => /* g */ { /* h */ ; /* i */ }/* after */;',
    'let g = /* before */async /* a */ ( /* b */ ) /* c */ => /* d */ 0/* after */;',
    'let h = /* before */async /* a */ a /* b */ => /* c */ 0/* after */;',
  ]) {
    it(`function f() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() { ${arg}}`);
      });
    });

    it(`function f() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function f() { ${arg}})`);
      });
    });

    it(`function * gen() { function foo() { ${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function * gen() { function foo() { ${arg}}}`);
      });
    });

    it(`(function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`);
      });
    });

    it(`(function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`, { lexical: true });
      });
    });
  }

  // Valid cases
  for (const arg of [
    'let [ , , ...x] = [1, 2, 3, 4, 5];',
    'let test262id8;',
    'let a1; [a1] = [1]',
    'let [...rest2] = [1, 2, 3, 4, 5];',
    'let [a4, b4, c4, ...rest4] = [1, 2, 3];',
    'let a1; [[a1]] = [[1]];',
    'let a1; [[a1, b1] = [1, 2]] = [];',
    'let a1; [a1, b1, c1, d1, ...rest1] = "testing";',
    'let arrow = () => {};',
    outdent`
      let x = class x {};
      let y = class {};
      let z = class { static name() {} };
    `,
    'let [{ a }, { b }, { c = "" }] = [a, b, c];',
    'let [{ x }] = [x];',
    'let [[x]] = [null];',
    'let [x = 23] = [undefined];',
    'let [{ x, y, z } = { x: 44, y: 55, z: 66 }] = [];',
    'let [,] = function* g() { first += 1;  second += 1; };',
    'let [ , , ...x] = [1, 2, 3, 4, 5];',
    'let { arrow = () => {} } = {};',
    'let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: { x: undefined, z: 7 } };',
    'function foo() { var let = 1, test = 2; }',
    'let [arrow = () => {}] = [];',
    'let [{ x, y, z } = { x: 44, y: 55, z: 66 }] = [{ x: 11, y: 22, z: 33 }];',
    'let [{ x }] = [];',
    'let [...x] = [1, 2, 3];',
    'let z = {...x}',
    'z = {x, ...y}',
    'let { x, } = { x: 23 };',
    'let [a,] = 0;',
    'let [...[x]] = y',
    'let a; [[a]] = [[]];',
    'let [[a]] = [[]];',
    'let [a, [b]] = [1, []];',
    'let a, b; [((((a)))), b] = [];',
    'let [[[...a]]] = [[[]]];',
    'let {} = 0',
    'let x  ;\n',
    'let _a = 5;\n',
    'let {a:{}} = 0',
    'let x = 5, y = 6;',
    'let x = 5, y = fcall();',
    'let x = 5, y = 6, z = 7;',
    'let $ = 5;',
    'let x = 5, a = 6, z = 7;',
    'let x = 5, y = 6, a = 7;',
    'let x = /* bef */5 + 3/* aft */;',
    'let x = y + 5;',
    'let x=y + 5;',
    'let [[a]=[1]] = [[2]];',
    'let/foo/g',
    '{ let x = 5; let y = 6; }',
    'let {a,b=0,c:d,e:f=0,[g]:[h]}=0',
    'let [...a] = 0;',
    'let [a,,]=0',
    'let [{a}] = 0',
    'let { x: y = 33 } = { };',
    'let { x: y } = { x: 23 };',
    'let { x, y, } = obj;',
    'let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: null };',
    'let {a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3};',
    outdent`
      let a = "a";
      let b = "b";
      let { x, y, } = obj;
      for (let x = "x", i = 0; i < 1; i++) { let y = "y"; }
    `,
    '[1 <= 0]',
    'let [1 <= 0] = "foo"',
    'let a; [a] = [];',
    'let a, b; [a, b] = [1];',
    'let [a] = [1, 2];',
    'let a; [a,] = [];',
    'let a; [,,a] = [];',
    'let [a] = [,,];',
    'let a; [...a] = [];',
    'let a; [a = 1] = [];',
    'let [[a]] = [[]];',
    'let a, b; [a, [b]] = [1, []];',
    'let [[[...a]]] = [[[]]];',
    'let b = async () => [];',
    'let [[...a], ...b] = [[],];',
    'let a = {}; [a.x] = [];',
    'let a; [a, a] = [];',
    'let [[...x] = [2, 1, 3]] = [];',
    'let [[] = function() {}()] = [[23]];',
    'let [[] = function() { return function*() {}(); }()] = [];',
    'let [foo] = arr;',
    'let [,] = x;',
    'let [,,] = x;',
    'letarguments',
    'letarguments.length',
    'let\nawait',
    'let\nimplements',
    'let\ninterface',
    'letpackage',
    'letprivate',
    'letyield',
    'let eval',
    'let eval',
    'let implements',
    'let eval',
    'let\nfoo',
    'let\n[foo]\r=\n2\n;',
    'let foo = bar, zoo = boo',
    'let foo = bar',
    'let foo = bar;',
    'let foo, bar',
    'let foo, bar;',
    'let foo;',
    'let {foo} = x, b = y;',
    'let {foo} = x, {bar} = y;',
    'let [foo,bar=b] = x;',
    'let x = y, [foo] = z;',
    'let [foo,bar] = x;',
    'let [foo] = x;',
    'let [foo] = arr, [bar] = arr2;',
    'let [foo] = arr, bar;',
    'let [foo] = arr, bar = arr2;',
    'let foo, [bar] = arr2;',
    'let foo = arr, [bar] = arr2;',
    'let [foo=a] = arr;',
    'let [foo=a, bar] = arr;',
    'let [foo, bar=b] = arr;',
    'let [foo=a, bar=b] = arr;',
    'let [foo, ...bar] = obj;',
    'let [...[foo, bar]] = obj;',
    'let [x, ...[foo, bar]] = obj;',
    'let [a=[...b], ...c] = obj;',
    'let {} = obj;',
    'let {x} = obj;',
    'let {x, y} = obj;',
    'let {x} = a, {y} = obj;',
    'let {x} = a, y = obj;',
    'let {x} = a, obj;',
    'let x = a, {y} = obj;',
    'let x, {y} = obj;',
    'let {x = y, z} = obj;',
    'let {x = y} = obj;',
    'let {x, y = z} = obj;',
    'let {x = y, z = a} = obj;',
    'let {x : y} = obj;',
    'let {x : y, z} = obj;',
    'let {x, y : z} = obj;',
    'let {x : y, z : a} = obj;',
    'let {x : y = z} = obj;',
    'let {x : y, z, a : b = c} = obj;',
    'let {[x]: y} = z;',
    'let {[x]: y} = z;',
    'let {[x]: y = z} = a;',
    'let {a, [x]: y} = a;',
    'for (let foo;;);',
    'for (let foo = bar;;);',
    'for (let foo, bar;;);',
    'let obj = { 1: 1, 2: 2, 3: 3, 4: 4 };',
    'for (let foo = bar, zoo = boo;;);',
    'for (let foo in x);',
    'for (let\nfoo;;);',
    'for (let\nfoo in x);',
    'for (let foo of x);',
    'for (let\nfoo of x);',
    'for (let [] = x;;);',
    'for (let [,] = x;;);',
    'for (let [,,] = x;;);',
    'for (let [foo] = arr;;);',
    'for (let [foo,] = arr;;);',
    'for (let [foo,,] = arr;;);',
    'for (let [,foo] = arr;;);',
    'for (let [,,foo] = arr;;);',
    'for (let [foo,bar] = arr;;);',
    'for (let [foo,,bar] = arr;;);',
    'for (let [foo] = arr, [bar] = arr2;;);',
    'for (let [foo] = arr, bar;;);',
    'for (let [foo] = arr, bar = arr2;;);',
    'for (let foo = arr, [bar] = arr2;;);',
    'for (let [foo=a, bar] = arr;;);',
    'for (let [foo, bar=b] = arr;;);',
    'for (let [foo=a, bar=b] = arr;;);',
    'for (let [...foo] = obj;;);',
    'for (let [foo, ...bar] = obj;;);',
    'for (let [...[foo, bar]] = obj;;);',
    'for (let {} = obj;;);',
    'for (let {x} = obj;;);',
    'for (let {x,} = obj;;);',
    'for (let {x, y} = obj;;);',
    'for (let {[x]: y = z} = a;;);',
    'for (let {a, [x]: y} = a;;);',
    'for (let [foo,] in arr);',
    'let x = {y=z} = d',
    'let x = ({y=z}) => d',
    'let x = ({y=z}=e) => d',
    'for (let {[x]: y} in obj);',
    'for (let {[x]: y = z} in obj);',
    'for (let {x, y} of obj);',
    'let { w = a(), x = b(), y = c(), z = d() } = { w: null, x: 0, y: false, z: "" };',
    'let { fn = function () {}, xFn = function x() {} } = {};',
    'switch (true) { case true: let x = 1; }',
    outdent`
      let a = [];
      for (let i = 0; i < 5; a.push(function () { return i; }), ++i) { }
      for (let k = 0; k < 5; ++k) {
      }
    `,
    'let { x, } = { x: 23 };',
    'let { w: [x, y, z] = [4, 5, 6] } = {};',
    'let { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] };',
    'let { x: y = 33 } = { };',
    'let { x: y, } = { x: 23 };',
    'let x',
    'let x = 1',
    'for (let x = 1; x < 1; x++) {}',
    'for (let x in {}) {}',
    'for (let x of []) {}',
    'let xCls = class x {};',
    'let cls = class {};',
    'let\n{x} = x;',
    'let x = {y=z} = d',
    'let x = ({y=z}) => d',
    'let {x}\n= x;',
    'let xCls2 = class { static name() {} };',
    'let { s: t = a(), u: v = b(), w: x = c(), y: z = d() } = { s: null, u: 0, w: false, y: "" };',
    'let {} = obj;',
    'let {} = undefined;',
    'let {} = obj;',
    'let {} = undefined;',
    'let [, , ...x] = [1, 2];',
    'let test262id8;',
    'foo: let: y;',
    'let {a, b, c} = {}, e, f;',
    'let {a, b} = {}, c = 0;',
    'let {a, b} = c, d;',
    'let {a, b, c} = {}, e, f;',
    'if (1) let\n{}',
    'let {a, b} = {}, c = 0;',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  fail('Declarations - Let (fail)', [
    'let [({x: 1})] = [];',
    'let [(x)] = [];',
    'let [({x: 1}) = y] = [];',
    'let [(x) = y] = [];',
    'var [({x: 1})] = [];',
    'var [(x)] = [];',
    'var [({x: 1}) = y] = [];',
    'if (true) let x = 1;',
    'let {x:o.f=1}={x:1}',
    'let [o.x=1]=[]',
    '(o.f=1)=>0',
    'let x = ...y;',
    'let test = 2, let = 1;',
    'const let = 1, test = 2;',
    'let [a, let, b] = [1, 2, 3];',
    'const [a, let, b] = [1, 2, 3];',
    'for(let let in { }) { };',
    'let [a];',
    'let let;',
    'let let x;',
    'if (1) let x = 10;',
    'let [a + 1] = [];',
    'let a; [a--] = [];',
    'let a; [1, a] = [];',
    'let [...a, b] = [];',
    'let a; [...a = 1] = [];',
    'let a; [((a)] = [];',
    'let\neval(foo)',
    'let eval(foo)',
    'let [((a)] = [];',
    'function foo() { return {}; }; let [foo().x] = [];',
    'function foo() { return {}; }; [foo()] = [];',
    'let {a:=c} = z;',
    'let {x:y=z}, {a:b=c} = obj;',
    'let {x:y=z};',
    'let b = async () => []; for (a in await b());',
    'let x = y, {z};',
    'let x, {y};',
    'let {[Symbol.iterator]: a} of []',
    'let {0: a} of []',
    '(let {"a": a = 1} of [])',
    'let {0: a = 1} of []',
    'for (let [let];;;) {}',
    'for (let x, y, z, let = 1;;;) {}',
    'let x,;',
    'let await 0',
    '"use strict"; const let = 1;',
    '"use strict"; let { let } = {};',
    '"use strict"; const { let } = {};',
    '"use strict"; let [let] = [];',
    '"use strict"; const [let] = [];',
    'let {x};',
    'let [x()] = x',
    'let [x().foo] = x',
    'let [...a,] = 0',
    'let [(x)] = x',
    'let [(x().foo)] = x',
    '[x()] = x',
    'let [[(a)], ((((((([b])))))))] = [[],[]];',
    'let a, b; [...a, b] = [];',
    'let [((a)] = [];',
    'let a; [((a)] = [];',
    'let [a)] = [];',
    'let a; [a)] = [];',
    'let [((((a)))), b] = [];',
    'let [...a = 1] = [];',
    'let a; [...a = 1] = [];',
    'let a; [...a,] = [];',
    'let arguments.length',
    'let [...a, ...b] = [];',
    'let [1, a] = [];',
    'let [1] = [];',
    'let [a--] = [];',
    'let [a + 1] = [];',
    'let [++a] = [];',
    'let a; [++a] = [];',
    '([x()]) => x',
    '([x().foo]) => x',
    '([(x)]) => x',
    '([(x().foo)]) => x',
    'let {[x]} = z;',
    'let {[x]};',
    'let {[x]: y};',
    'let x = {y=z}',
    'let x = {y=z} => d',
    'let {[x]: y = z};',
    'let {...let} = {a: 1, b: 2};',
    { code: 'let {...let} = {a: 1, b: 2};', options: { sourceType: 'module' } },
    'let const',
    'const let',
    outdent`
      let
      [let;
    `,
    'for (;false;) let x = 1;',
    'do let x; while (false)',
    'if (true) {} else let x;',
    'if (true) let x;',
    'label: let x;',
    'while (false) let x;',
    outdent`
      let  // start of a LexicalDeclaration, *not* an ASI opportunity
      [let = "irrelevant initializer";
    `,
    // Acorn issue: https://github.com/acornjs/acorn/issues/586
    'let let',
    'label: let x;',
    outdent`
      do let
      [x] = 0
      while (false);
    `,
    'let {a: o.a} = obj;',
    'let default',
    'let test = 2, let = 1;',
    'do let x = 1; while (false)',
    'if (true) {} else let x = 1;',
    'if (true) let x = 1;',
    'do let x; while (false)',
    'let [...x = []] = [];',
    'if (true) {} else let x;',
    'let {...{}} = {};',
    'let [...[ x ] = []] = [];',
    'let [...[ x ] = []] = [];',
    'let [...{ x } = []] = [];',
    'let\nlet',
    'do let [x] = 0; while (false);',
    'if (x) let [x] = y; else x;',
    'do let [] while (a);',
    'let [...x, y] = [1, 2, 3];',
    'let [...{ x }, y] = [1, 2, 3];',
    'let [...x = []] = [];',
    'let\nyield 0',
    // 'let' should not be an allowed name in destructuring let declarations
    'let [a, let, b] = [1, 2, 3];',
    // Babylon issue: https://github.com/babel/babylon/issues/148
    'let { ...x, y, z } = obj;',
    'let { x, ...y, ...z } = obj;',
    'let let',
    'for (let\nfoo();;);',
    'for (let foo);',
    { code: 'while (true) let: continue let;', options: { impliedStrict: true } },
    { code: 'if (x) let: y;', options: { impliedStrict: true } },
    'for (let foo, bar);',
    'for (let foo = bar);',
    'for (let foo = bar, zoo = boo);',
    'for (let\nfoo);',
    'for (let\nfoo());',
    'for (let foo, bar in x);',
    'for (let foo = bar in x);',
    'let { let } = {};',
    'const { let } = {};',
    'let [let] = [];',
    'const [let] = [];',
    'for (let foo = bar, zoo = boo in x);',
    'for (let\nfoo() in x);',
    'for (let foo = bar, zoo = boo of x);',
    'for (let [foo];;);',
    'for (let [foo = x];;);',
    'for (let [foo], bar;;);',
    'for (let [...foo,,] = obj;;);',
    'for (let {x,,} = obj;;);',
    'for (let {,x} = obj;;);',
    'for (let {[x]} = z;;);',
    'for (let {[x]};;);',
    'for (let [] = x);',
    'for (let [foo,,bar] = arr);',
    'for (let [foo], bar);',
    'for (let [...,] = obj);',
    'for (let {x} = a, {y} = obj);',
    'for (let {x} = a, y = obj);',
    'for (let {x = y, z = a} = obj);',
    'for (let {x : y} = obj);',
    'for (let {x : y, z} = obj);',
    'for (let {x, y : z} = obj);',
    'for (let {x}, y);',
    'for (let {x}, {y} in z);',
    'for (let {x}, y);',
    'let {...{a,b}} = foo',
    'let {...obj1,} = foo',
    'let {...obj1,a} = foo',
    'let {...obj1,...obj2} = foo',
    'let {...(obj)} = foo',
    'let {...(a,b)} = foo',
    'let {...{a,b}} = foo',
    'let {...[a,b]} = foo',
    { code: 'let: foo', options: { impliedStrict: true } },
    '"use strict"; let, let, let, let',
    '"use strict"; let(100)',
    '"use strict"; let: 34',
    outdent`
      while (false) let
      [a]
    `,
  ]);

  pass('Declarations - Let (pass)', [
    'for (let {[x]: y = z} of obj);',
    '[x = true] = y',
    'let [,] = x;',
    'let [foo=a] = arr;',
    'for (let;;);',

    outdent`
      if (false) {
          L: let // ASI
          x = 1;
      }
    `,
    outdent`
      if (false) {
          L: let // ASI
          x = 1;
      }
    `,
    outdent`
      if (false) {
          L: let // ASI
          x = 1;
      }
    `,
    'for (;let;);',
    '_ => { let: foo; }',
    'let: let;',
    'for (let {x, y : z} in obj);',
    'for (let {x : y = z} in obj);',

    'for (let();;);',
    { code: 'for (let {x : y, z, a : b = c} in obj);', options: { ranges: true } },
    { code: 'for (let {[x]: y} in obj);', options: { ranges: true } },
    { code: 'for (let {[x]: y = z} in obj);', options: { ranges: true } },
    'for (let {a, [x]: y} in obj);',
    'let {...x} = y',
    'for (let [] of x);',
    'for (let [,] of x);',
    'for (let [foo,] of arr);',
    'for (let [foo,,] of arr);',
    'for (let [foo,,bar] of arr);',
    'for (let [foo=a] of arr);',
    'for (let [foo, bar=b] of arr);',
    'for (let [foo=a, bar=b] of arr);',
    'for (let [...[foo, bar]] of obj);',
    'for (let [a=[...b], ...c] of obj);',
    'let foo = bar;',
    'if (x) let;',
    'for (let [...[foo, bar]] in obj);',
    'for (let [x, ...[foo, bar]] in obj);',
    'for (let [a=[...b], ...c] in obj);',
    'for (let {} in obj);',
    'for (let {x,} in obj);  ',
    'for (let {x = y} in obj);',
    'for (let {x, y = z} in obj);',
    'for (let {x = y, z = a} in obj);',
    'for (let {x : y} in obj);',
    'let [foo=a, bar] = arr;',
    'let [...foo] = obj;',
    'let [foo, ...bar] = obj;',
    'let {x} = a, y = obj;',
    'let foo;',

    'let a, [...x] = y',
    'let {...x} = y',
    'var let;',
    'var [let] = x;',
    'var {let} = x;',
    'let.foo;',
    'let {let: foo} = x;',
    'let {a, let: foo} = x;',
    'let();',
    'let [x, ...[foo, bar]] = obj;',
    'let {} = obj;',
    'let {x} = obj;',
    'let {x,} = obj;',
    { code: 'let {x, y} = obj;', options: { ranges: true } },

    outdent`
      a = let;
      []
    `,
    { code: 'let {x} = a, {y} = obj;', options: { ranges: true } },
  ]);
});
