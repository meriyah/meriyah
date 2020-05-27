import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
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
    'let l\\u0065t = 1',
    'const l\\u0065t = 1',
    'let [l\\u0065t] = 1',
    'const [l\\u0065t] = 1',
    'for (let l\\u0065t in {}) {}'
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
    'let h = /* before */async /* a */ a /* b */ => /* c */ 0/* after */;'
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
    'let {a, b} = {}, c = 0;'
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
      Context.None
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
      Context.None
    ],
    // Acorn issue: https://github.com/acornjs/acorn/issues/586
    ['let let', Context.None],
    ['label: let x;', Context.None],
    [
      `do let
      [x] = 0
      while (false);`,
      Context.None
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
      Context.None
    ]
  ]);

  pass('Declarations - Let (pass)', [
    [
      'for (let {[x]: y = z} of obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: true,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'z'
                          }
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            await: false
          }
        ]
      }
    ],
    [
      '[x = true] = y',
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
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    right: {
                      type: 'Literal',
                      value: true
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ]
      }
    ],
    [
      'let [,] = x;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [null]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let [foo=a] = arr;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'arr'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let;;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: {
              type: 'Identifier',
              name: 'let'
            },
            test: null,
            update: null
          }
        ]
      }
    ],

    [
      `if (false) {
      L: let // ASI
      x = 1;
  }`,
      Context.None,
      {
        body: [
          {
            alternate: null,
            consequent: {
              body: [
                {
                  body: {
                    expression: {
                      name: 'let',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  },
                  label: {
                    name: 'L',
                    type: 'Identifier'
                  },
                  type: 'LabeledStatement'
                },
                {
                  expression: {
                    left: {
                      name: 'x',
                      type: 'Identifier'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    type: 'AssignmentExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `if (false) {
        L: let // ASI
        x = 1;
    }`,
      Context.None,
      {
        body: [
          {
            alternate: null,
            consequent: {
              body: [
                {
                  body: {
                    expression: {
                      name: 'let',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  },
                  label: {
                    name: 'L',
                    type: 'Identifier'
                  },
                  type: 'LabeledStatement'
                },
                {
                  expression: {
                    left: {
                      name: 'x',
                      type: 'Identifier'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    type: 'AssignmentExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `if (false) {
          L: let // ASI
          x = 1;
      }`,
      Context.None,
      {
        body: [
          {
            alternate: null,
            consequent: {
              body: [
                {
                  body: {
                    expression: {
                      name: 'let',
                      type: 'Identifier'
                    },
                    type: 'ExpressionStatement'
                  },
                  label: {
                    name: 'L',
                    type: 'Identifier'
                  },
                  type: 'LabeledStatement'
                },
                {
                  expression: {
                    left: {
                      name: 'x',
                      type: 'Identifier'
                    },
                    operator: '=',
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    type: 'AssignmentExpression'
                  },
                  type: 'ExpressionStatement'
                }
              ],
              type: 'BlockStatement'
            },
            test: {
              type: 'Literal',
              value: false
            },
            type: 'IfStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (;let;);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForStatement',
            body: {
              type: 'EmptyStatement'
            },
            init: null,
            test: {
              type: 'Identifier',
              name: 'let'
            },
            update: null
          }
        ]
      }
    ],
    [
      '_ => { let: foo; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'LabeledStatement',
                    label: {
                      type: 'Identifier',
                      name: 'let'
                    },
                    body: {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  }
                ]
              },
              params: [
                {
                  type: 'Identifier',
                  name: '_'
                }
              ],
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'let: let;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'LabeledStatement',
            label: {
              type: 'Identifier',
              name: 'let'
            },
            body: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'let'
              }
            }
          }
        ]
      }
    ],
    [
      'for (let {x, y : z} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x : y = z} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'z'
                          }
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],

    [
      'for (let();;);',
      Context.None,
      {
        body: [
          {
            body: {
              type: 'EmptyStatement'
            },
            init: {
              arguments: [],
              callee: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'CallExpression'
            },
            test: null,
            type: 'ForStatement',
            update: null
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (let {x : y, z, a : b = c} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 39,
            range: [0, 39],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 30,
              range: [5, 30],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 30,
                  range: [9, 30],
                  id: {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 30,
                    range: [9, 30],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 15,
                        range: [10, 15],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          start: 14,
                          end: 15,
                          range: [14, 15],
                          name: 'y'
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 17,
                        end: 18,
                        range: [17, 18],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 17,
                          end: 18,
                          range: [17, 18],
                          name: 'z'
                        },
                        kind: 'init',
                        value: {
                          type: 'Identifier',
                          start: 17,
                          end: 18,
                          range: [17, 18],
                          name: 'z'
                        }
                      },
                      {
                        type: 'Property',
                        start: 20,
                        end: 29,
                        range: [20, 29],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 20,
                          end: 21,
                          range: [20, 21],
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 24,
                          end: 29,
                          range: [24, 29],
                          left: {
                            type: 'Identifier',
                            start: 24,
                            end: 25,
                            range: [24, 25],
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            start: 28,
                            end: 29,
                            range: [28, 29],
                            name: 'c'
                          }
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            right: {
              type: 'Identifier',
              start: 34,
              end: 37,
              range: [34, 37],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 38,
              end: 39,
              range: [38, 39]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let {[x]: y} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 17,
              range: [5, 17],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 17,
                  range: [9, 17],
                  id: {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 17,
                    range: [9, 17],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 16,
                        range: [10, 16],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'x'
                        },
                        value: {
                          type: 'Identifier',
                          start: 15,
                          end: 16,
                          range: [15, 16],
                          name: 'y'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            right: {
              type: 'Identifier',
              start: 21,
              end: 24,
              range: [21, 24],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 25,
              end: 26,
              range: [25, 26]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let {[x]: y = z} in obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 30,
        range: [0, 30],
        body: [
          {
            type: 'ForInStatement',
            start: 0,
            end: 30,
            range: [0, 30],
            left: {
              type: 'VariableDeclaration',
              start: 5,
              end: 21,
              range: [5, 21],
              declarations: [
                {
                  type: 'VariableDeclarator',
                  start: 9,
                  end: 21,
                  range: [9, 21],
                  id: {
                    type: 'ObjectPattern',
                    start: 9,
                    end: 21,
                    range: [9, 21],
                    properties: [
                      {
                        type: 'Property',
                        start: 10,
                        end: 20,
                        range: [10, 20],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 15,
                          end: 20,
                          range: [15, 20],
                          left: {
                            type: 'Identifier',
                            start: 15,
                            end: 16,
                            range: [15, 16],
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            start: 19,
                            end: 20,
                            range: [19, 20],
                            name: 'z'
                          }
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  init: null
                }
              ],
              kind: 'let'
            },
            right: {
              type: 'Identifier',
              start: 25,
              end: 28,
              range: [25, 28],
              name: 'obj'
            },
            body: {
              type: 'EmptyStatement',
              start: 29,
              end: 30,
              range: [29, 30]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'for (let {a, [x]: y} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: true,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'let {...x} = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'for (let [] of x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: []
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [,] of x);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [null]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo,] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo,,] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      null
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo,,bar] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      null,
                      {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo=a] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo, bar=b] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [foo=a, bar=b] of arr);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'a'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'b'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'arr'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [...[foo, bar]] of obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            {
                              type: 'Identifier',
                              name: 'bar'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            await: false
          }
        ]
      }
    ],
    [
      'for (let [a=[...b], ...c] of obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForOfStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'SpreadElement',
                              argument: {
                                type: 'Identifier',
                                name: 'b'
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            },
            await: false
          }
        ]
      }
    ],
    [
      'let foo = bar;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: {
                  type: 'Identifier',
                  name: 'bar'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'if (x) let;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Identifier',
              name: 'x'
            },
            consequent: {
              type: 'ExpressionStatement',
              expression: {
                type: 'Identifier',
                name: 'let'
              }
            },
            alternate: null
          }
        ]
      }
    ],
    [
      'for (let [...[foo, bar]] in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            {
                              type: 'Identifier',
                              name: 'bar'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let [x, ...[foo, bar]] in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'foo'
                            },
                            {
                              type: 'Identifier',
                              name: 'bar'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let [a=[...b], ...c] in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'SpreadElement',
                              argument: {
                                type: 'Identifier',
                                name: 'b'
                              }
                            }
                          ]
                        }
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: []
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x,} in obj);  ',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x = y} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x, y = z} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'z'
                          }
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x = y, z = a} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        computed: false,
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'z'
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
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'for (let {x : y} in obj);',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ForInStatement',
            body: {
              type: 'EmptyStatement'
            },
            left: {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        kind: 'init',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        computed: false,
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'obj'
            }
          }
        ]
      }
    ],
    [
      'let [foo=a, bar] = arr;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    },
                    {
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'arr'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let [...foo] = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let [foo, ...bar] = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'bar'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let {x} = a, y = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'y'
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let foo;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'foo'
                },
                init: null
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      'let a, [...x] = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'a'
                }
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let {...x} = y',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'y'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var let;',
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
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'let'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var [let] = x;',
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
                  type: 'Identifier',
                  name: 'x'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'let'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var {let} = x;',
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
                  type: 'Identifier',
                  name: 'x'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'let'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'let'
                      },
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let.foo;',
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
                type: 'Identifier',
                name: 'let'
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
      'let {let: foo} = x;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'x'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'let'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let {a, let: foo} = x;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'x'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'let'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'let();',
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
                type: 'Identifier',
                name: 'let'
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      'let [x, ...[foo, bar]] = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          {
                            type: 'Identifier',
                            name: 'bar'
                          }
                        ]
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let {} = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ObjectPattern',
                  properties: []
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let {x} = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let {x,} = obj;',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'VariableDeclaration',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let {x, y} = obj;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 17,
            range: [0, 17],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 16,
                range: [4, 16],
                id: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 10,
                  range: [4, 10],
                  properties: [
                    {
                      type: 'Property',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'x'
                      }
                    },
                    {
                      type: 'Property',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'y'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'y'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 13,
                  end: 16,
                  range: [13, 16],
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      `a = let;
      []`,
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                name: 'a',
                type: 'Identifier'
              },
              operator: '=',
              right: {
                name: 'let',
                type: 'Identifier'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          },
          {
            expression: {
              elements: [],
              type: 'ArrayExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'let {x} = a, {y} = obj;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 23,
            range: [0, 23],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 11,
                range: [4, 11],
                id: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 7,
                  range: [4, 7],
                  properties: [
                    {
                      type: 'Property',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'x'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'x'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 10,
                  end: 11,
                  range: [10, 11],
                  name: 'a'
                }
              },
              {
                type: 'VariableDeclarator',
                start: 13,
                end: 22,
                range: [13, 22],
                id: {
                  type: 'ObjectPattern',
                  start: 13,
                  end: 16,
                  range: [13, 16],
                  properties: [
                    {
                      type: 'Property',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'y'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 14,
                        end: 15,
                        range: [14, 15],
                        name: 'y'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 19,
                  end: 22,
                  range: [19, 22],
                  name: 'obj'
                }
              }
            ],
            kind: 'let'
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
