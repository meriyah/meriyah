import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`(function() {${arg}})()`, () => {
      t.throws(() => {
        parseSource(`(function() {${arg}})()`, undefined, Context.None);
      });
    });

    it(`(function() {${arg}})()`, () => {
      t.throws(() => {
        parseSource(`(function() {${arg}})()`, undefined, Context.OptionsLexical);
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
    `let.let = foo`,
    'var [let] = []',
    'let f = /* before */async /* a */ ( /* b */ a /* c */ , /* d */ b /* e */ ) /* f */ => /* g */ { /* h */ ; /* i */ }/* after */;',
    'let g = /* before */async /* a */ ( /* b */ ) /* c */ => /* d */ 0/* after */;',
    'let h = /* before */async /* a */ a /* b */ => /* c */ 0/* after */;',
  ]) {
    it(`function f() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() { ${arg}}`, undefined, Context.None);
      });
    });

    it(`function f() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function f() { ${arg}})`, undefined, Context.None);
      });
    });

    it(`function * gen() { function foo() { ${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function * gen() { function foo() { ${arg}}}`, undefined, Context.None);
      });
    });

    it(`(function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`, undefined, Context.None);
      });
    });

    it(`(function foo() { ${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function foo() { ${arg}})`, undefined, Context.OptionsLexical);
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
    `let x = class x {};
    let y = class {};
    let z = class { static name() {} };`,
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
    `{ let x = 5; let y = 6; }`,
    'let {a,b=0,c:d,e:f=0,[g]:[h]}=0',
    'let [...a] = 0;',
    'let [a,,]=0',
    'let [{a}] = 0',
    'let { x: y = 33 } = { };',
    'let { x: y } = { x: 23 };',
    'let { x, y, } = obj;',
    'let { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: null };',
    'let {a, b, ...rest} = {x: 1, y: 2, a: 5, b: 3};',
    `let a = "a";
    let b = "b";
    let { x, y, } = obj;
    for (let x = "x", i = 0; i < 1; i++) { let y = "y"; }`,
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
    `let a = [];
    for (let i = 0; i < 5; a.push(function () { return i; }), ++i) { }
    for (let k = 0; k < 5; ++k) {
    }`,
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
    `let x = {y=z} = d`,
    `let x = ({y=z}) => d`,
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Declarations - Let (fail)', [
    ['let [({x: 1})] = [];', Context.None],
    ['let [(x)] = [];', Context.None],
    ['let [({x: 1}) = y] = [];', Context.None],
    ['let [(x) = y] = [];', Context.None],
    ['var [({x: 1})] = [];', Context.None],
    ['var [(x)] = [];', Context.None],
    ['var [({x: 1}) = y] = [];', Context.None],
    ['if (true) let x = 1;', Context.None],
    ['let {x:o.f=1}={x:1}', Context.None],
    ['let [o.x=1]=[]', Context.None],
    ['(o.f=1)=>0', Context.None],
    ['let x = ...y;', Context.None],
    ['let test = 2, let = 1;', Context.None],
    ['const let = 1, test = 2;', Context.None],
    ['let [a, let, b] = [1, 2, 3];', Context.None],
    ['const [a, let, b] = [1, 2, 3];', Context.None],
    ['for(let let in { }) { };', Context.None],
    ['let [a];', Context.None],
    ['let let;', Context.None],
    ['let let x;', Context.None],
    ['if (1) let x = 10;', Context.None],
    ['let [a + 1] = [];', Context.None],
    ['let a; [a--] = [];', Context.None],
    ['let a; [1, a] = [];', Context.None],
    ['let [...a, b] = [];', Context.None],
    ['let a; [...a = 1] = [];', Context.None],
    ['let a; [((a)] = [];', Context.None],
    ['let\neval(foo)', Context.None],
    ['let eval(foo)', Context.None],
    ['let [((a)] = [];', Context.None],
    ['function foo() { return {}; }; let [foo().x] = [];', Context.None],
    ['function foo() { return {}; }; [foo()] = [];', Context.None],
    ['let {a:=c} = z;', Context.None],
    ['let {x:y=z}, {a:b=c} = obj;', Context.None],
    ['let {x:y=z};', Context.None],
    ['let b = async () => []; for (a in await b());', Context.None],
    ['let x = y, {z};', Context.None],
    ['let x, {y};', Context.None],
    ['let {[Symbol.iterator]: a} of []', Context.None],
    ['let {0: a} of []', Context.None],
    ['(let {"a": a = 1} of [])', Context.None],
    ['let {0: a = 1} of []', Context.None],
    ['for (let [let];;;) {}', Context.None],
    ['for (let x, y, z, let = 1;;;) {}', Context.None],
    ['let x,;', Context.None],
    ['let await 0', Context.None],
    ['"use strict"; const let = 1;', Context.None],
    ['"use strict"; let { let } = {};', Context.None],
    ['"use strict"; const { let } = {};', Context.None],
    ['"use strict"; let [let] = [];', Context.None],
    ['"use strict"; const [let] = [];', Context.None],
    ['let {x};', Context.None],
    ['let [x()] = x', Context.None],
    ['let [x().foo] = x', Context.None],
    ['let [...a,] = 0', Context.None],
    ['let [(x)] = x', Context.None],
    ['let [(x().foo)] = x', Context.None],
    ['[x()] = x', Context.None],
    ['let [[(a)], ((((((([b])))))))] = [[],[]];', Context.None],
    ['let a, b; [...a, b] = [];', Context.None],
    ['let [((a)] = [];', Context.None],
    ['let a; [((a)] = [];', Context.None],
    ['let [a)] = [];', Context.None],
    ['let a; [a)] = [];', Context.None],
    ['let [((((a)))), b] = [];', Context.None],
    ['let [...a = 1] = [];', Context.None],
    ['let a; [...a = 1] = [];', Context.None],
    ['let a; [...a,] = [];', Context.None],
    ['let arguments.length', Context.None],
    ['let [...a, ...b] = [];', Context.None],
    ['let [1, a] = [];', Context.None],
    ['let [1] = [];', Context.None],
    ['let [a--] = [];', Context.None],
    ['let [a + 1] = [];', Context.None],
    ['let [++a] = [];', Context.None],
    ['let a; [++a] = [];', Context.None],
    ['([x()]) => x', Context.None],
    ['([x().foo]) => x', Context.None],
    ['([(x)]) => x', Context.None],
    ['([(x().foo)]) => x', Context.None],
    ['let {[x]} = z;', Context.None],
    ['let {[x]};', Context.None],
    ['let {[x]: y};', Context.None],
    ['let x = {y=z}', Context.None],
    ['let x = {y=z} => d', Context.None],
    ['let {[x]: y = z};', Context.None],
    ['let {...let} = {a: 1, b: 2};', Context.None],
    ['let {...let} = {a: 1, b: 2};', Context.Module | Context.Strict],
    ['let const', Context.None],
    ['const let', Context.None],
    [
      `let
    [let;`,
      Context.None,
    ],
    ['for (;false;) let x = 1;', Context.None],
    ['do let x; while (false)', Context.None],
    ['if (true) {} else let x;', Context.None],
    ['if (true) let x;', Context.None],
    ['label: let x;', Context.None],
    ['while (false) let x;', Context.None],
    [
      `let  // start of a LexicalDeclaration, *not* an ASI opportunity
    [let = "irrelevant initializer";`,
      Context.None,
    ],
    // Acorn issue: https://github.com/acornjs/acorn/issues/586
    ['let let', Context.None],
    ['label: let x;', Context.None],
    [
      `do let
      [x] = 0
      while (false);`,
      Context.None,
    ],
    ['let {a: o.a} = obj;', Context.None],
    ['let default', Context.None],
    ['let test = 2, let = 1;', Context.None],
    ['do let x = 1; while (false)', Context.None],
    ['if (true) {} else let x = 1;', Context.None],
    ['if (true) let x = 1;', Context.None],
    ['do let x; while (false)', Context.None],
    ['let [...x = []] = [];', Context.None],
    ['if (true) {} else let x;', Context.None],
    ['let {...{}} = {};', Context.None],
    ['let [...[ x ] = []] = [];', Context.None],
    ['let [...[ x ] = []] = [];', Context.None],
    ['let [...{ x } = []] = [];', Context.None],
    ['let\nlet', Context.None],
    ['do let [x] = 0; while (false);', Context.None],
    ['if (x) let [x] = y; else x;', Context.None],
    ['do let [] while (a);', Context.None],
    ['let [...x, y] = [1, 2, 3];', Context.None],
    ['let [...{ x }, y] = [1, 2, 3];', Context.None],
    ['let [...x = []] = [];', Context.None],
    ['let\nyield 0', Context.None],
    // 'let' should not be an allowed name in destructuring let declarations
    ['let [a, let, b] = [1, 2, 3];', Context.None],
    // Babylon issue: https://github.com/babel/babylon/issues/148
    ['let { ...x, y, z } = obj;', Context.None],
    ['let { x, ...y, ...z } = obj;', Context.None],
    ['let let', Context.None],
    ['for (let\nfoo();;);', Context.None],
    ['for (let foo);', Context.None],
    ['while (true) let: continue let;', Context.Strict],
    ['if (x) let: y;', Context.Strict],
    ['for (let foo, bar);', Context.None],
    ['for (let foo = bar);', Context.None],
    ['for (let foo = bar, zoo = boo);', Context.None],
    ['for (let\nfoo);', Context.None],
    ['for (let\nfoo());', Context.None],
    ['for (let foo, bar in x);', Context.None],
    ['for (let foo = bar in x);', Context.None],
    ['let { let } = {};', Context.None],
    ['const { let } = {};', Context.None],
    ['let [let] = [];', Context.None],
    ['const [let] = [];', Context.None],
    ['for (let foo = bar, zoo = boo in x);', Context.None],
    ['for (let\nfoo() in x);', Context.None],
    ['for (let foo = bar, zoo = boo of x);', Context.None],
    ['for (let [foo];;);', Context.None],
    ['for (let [foo = x];;);', Context.None],
    ['for (let [foo], bar;;);', Context.None],
    ['for (let [...foo,,] = obj;;);', Context.None],
    ['for (let {x,,} = obj;;);', Context.None],
    ['for (let {,x} = obj;;);', Context.None],
    ['for (let {[x]} = z;;);', Context.None],
    ['for (let {[x]};;);', Context.None],
    ['for (let [] = x);', Context.None],
    ['for (let [foo,,bar] = arr);', Context.None],
    ['for (let [foo], bar);', Context.None],
    ['for (let [...,] = obj);', Context.None],
    ['for (let {x} = a, {y} = obj);', Context.None],
    ['for (let {x} = a, y = obj);', Context.None],
    ['for (let {x = y, z = a} = obj);', Context.None],
    ['for (let {x : y} = obj);', Context.None],
    ['for (let {x : y, z} = obj);', Context.None],
    ['for (let {x, y : z} = obj);', Context.None],
    ['for (let {x}, y);', Context.None],
    ['for (let {x}, {y} in z);', Context.None],
    ['for (let {x}, y);', Context.None],
    ['let {...{a,b}} = foo', Context.None],
    ['let {...obj1,} = foo', Context.None],
    ['let {...obj1,a} = foo', Context.None],
    ['let {...obj1,...obj2} = foo', Context.None],
    ['let {...(obj)} = foo', Context.None],
    ['let {...(a,b)} = foo', Context.None],
    ['let {...{a,b}} = foo', Context.None],
    ['let {...[a,b]} = foo', Context.None],
    ['let: foo', Context.Strict],
    ['"use strict"; let, let, let, let', Context.None],
    ['"use strict"; let(100)', Context.None],
    ['"use strict"; let: 34', Context.None],
    [
      `while (false) let
    [a]`,
      Context.None,
    ],
  ]);

  pass('Declarations - Let (pass)', [
    ['for (let {[x]: y = z} of obj);', Context.None],
    ['[x = true] = y', Context.None],
    ['let [,] = x;', Context.None],
    ['let [foo=a] = arr;', Context.None],
    ['for (let;;);', Context.None],

    [
      `if (false) {
      L: let // ASI
      x = 1;
  }`,
      Context.None,
    ],
    [
      `if (false) {
        L: let // ASI
        x = 1;
    }`,
      Context.None,
    ],
    [
      `if (false) {
          L: let // ASI
          x = 1;
      }`,
      Context.None,
    ],
    ['for (;let;);', Context.None],
    ['_ => { let: foo; }', Context.None],
    ['let: let;', Context.None],
    ['for (let {x, y : z} in obj);', Context.None],
    ['for (let {x : y = z} in obj);', Context.None],

    ['for (let();;);', Context.None],
    ['for (let {x : y, z, a : b = c} in obj);', Context.OptionsRanges],
    ['for (let {[x]: y} in obj);', Context.OptionsRanges],
    ['for (let {[x]: y = z} in obj);', Context.OptionsRanges],
    ['for (let {a, [x]: y} in obj);', Context.None],
    ['let {...x} = y', Context.None],
    ['for (let [] of x);', Context.None],
    ['for (let [,] of x);', Context.None],
    ['for (let [foo,] of arr);', Context.None],
    ['for (let [foo,,] of arr);', Context.None],
    ['for (let [foo,,bar] of arr);', Context.None],
    ['for (let [foo=a] of arr);', Context.None],
    ['for (let [foo, bar=b] of arr);', Context.None],
    ['for (let [foo=a, bar=b] of arr);', Context.None],
    ['for (let [...[foo, bar]] of obj);', Context.None],
    ['for (let [a=[...b], ...c] of obj);', Context.None],
    ['let foo = bar;', Context.None],
    ['if (x) let;', Context.None],
    ['for (let [...[foo, bar]] in obj);', Context.None],
    ['for (let [x, ...[foo, bar]] in obj);', Context.None],
    ['for (let [a=[...b], ...c] in obj);', Context.None],
    ['for (let {} in obj);', Context.None],
    ['for (let {x,} in obj);  ', Context.None],
    ['for (let {x = y} in obj);', Context.None],
    ['for (let {x, y = z} in obj);', Context.None],
    ['for (let {x = y, z = a} in obj);', Context.None],
    ['for (let {x : y} in obj);', Context.None],
    ['let [foo=a, bar] = arr;', Context.None],
    ['let [...foo] = obj;', Context.None],
    ['let [foo, ...bar] = obj;', Context.None],
    ['let {x} = a, y = obj;', Context.None],
    ['let foo;', Context.None],

    ['let a, [...x] = y', Context.None],
    ['let {...x} = y', Context.None],
    ['var let;', Context.None],
    ['var [let] = x;', Context.None],
    ['var {let} = x;', Context.None],
    ['let.foo;', Context.None],
    ['let {let: foo} = x;', Context.None],
    ['let {a, let: foo} = x;', Context.None],
    ['let();', Context.None],
    ['let [x, ...[foo, bar]] = obj;', Context.None],
    ['let {} = obj;', Context.None],
    ['let {x} = obj;', Context.None],
    ['let {x,} = obj;', Context.None],
    ['let {x, y} = obj;', Context.OptionsRanges],
    [
      `a = let;
      []`,
      Context.None,
    ],
    ['let {x} = a, {y} = obj;', Context.OptionsRanges],
  ]);
});
