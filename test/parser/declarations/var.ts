import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Declarations - Var', () => {
  for (const arg of [
    '[ foo().x ]',
    '[ foo()[x] ]',
    '[ x.y ]',
    '[ x[y] ]',
    '[ { x } ]',
    '[ { x : y } ]',
    '[ { x : foo().y } ]',
    '[ { x : foo()[y] } ]',
    '[ { x : x.y } ]',
    '[ { x : x[y] } ]',
    '[ [ x ] ]',
    '[ [ foo().x ] ]',
    '[ [ foo()[x] ] ]',
    '[ [ x.y ] ]',
    '[ [ x[y] ] ]',
    '[ x = 10 ]',
    '[ foo().x = 10 ]',
    '[ foo()[x] = 10 ]',
    '[ x.y = 10 ]',
    '[ x[y] = 10 ]',
    '[ { x = 10 } = {} ]',
    '[ { x : y = 10 } = {} ]',
    '[ { x : foo().y = 10 } = {} ]',
    '[ { x : foo()[y] = 10 } = {} ]',
    '[ { x : x.y = 10 } = {} ]',
    '[ { x : x[y] = 10 } = {} ]',
    '[ [ x = 10 ] = {} ]',
    '[ [ foo().x = 10 ] = {} ]',
    '[ [ foo()[x] = 10 ] = {} ]',
    '[ [ x.y = 10 ] = {} ]',
    '[ [ x[y] = 10 ] = {} ]',
    '{ x : y = 1 }',
    '{ x }',
    '[ x ]',
    '{ x : y }',
    '{ x : foo().y }',
    '{ x : foo()[y] }',
    '{ x : y.z }',
    '{ x : y[z] }',
    '{ x : { y } }',
    '{ x : { foo: y } }',
    '{ x : { foo: foo().y } }',
    '{ x : { foo: foo()[y] } }',
    '{ x : { foo: y.z } }',
    '{ x : { foo: y[z] } }',
    '{ x : [ y ] }',
    '{ x : [ foo().y ] }',
    '{ x : [ foo()[y] ] }',
    '{ x : [ y.z ] }',
    '{ x : [ y[z] ] }',
    '{ x : y = 10 }',
    '{ x : foo().y = 10 }',
    '{ x : foo()[y] = 10 }',
    '{ x : y.z = 10 }',
    '{ x : y[z] = 10 }',
    '{ x : { y = 10 } = {} }',
    '{ x : { foo: y = 10 } = {} }',
    '{ x : { foo: foo().y = 10 } = {} }',
    '{ x : { foo: foo()[y] = 10 } = {} }',
    '{ x : { foo: y.z = 10 } = {} }',
    '{ x : { foo: y[z] = 10 } = {} }',
    '{ x : [ y = 10 ] = {} }',
    '{ x : [ foo().y = 10 ] = {} }',
    '{ x : [ foo()[y] = 10 ] = {} }',
    '{ x : [ y.z = 10 ] = {} }',
    '{ x : [ y[z] = 10 ] = {} }',
    '{ z : { __proto__: x, __proto__: y } = z }',
    '{ x, y, z }',
    '{ x = 1, y: z, z: y }',
    '{x = 42, y = 15}',
    '[x]',
    '[x = 1]',
    '[x,y,z]',
    '[x, y = 42, z]',
    '{ x : x, y : y }',
    '{ x : x = 1, y : y }',
    '{ x : x, y : y = 42 }',
    '[]',
    '{}',
    '[{x:x, y:y}, [,x,z,]]',
    '[{x:x = 1, y:y = 2}, [z = 3, z = 4, z = 5]]',
    '[x,,y]',
    '[(x),,(y)]',
    '[(x)]',
    '{42 : x}',
    '{42 : x = 42}',
    '{42e-2 : x}',
    '{42e-2 : x = 42}',
    "{'hi' : x}",
    "{'hi' : x = 42}",
    '{var: x}',
    '{var: x = 42}',
    '{var: (x) = 42}',
    '{[x] : z}',
    '{[1+1] : z}',
    '{[1+1] : (z)}',
    '{[foo()] : z}',
    '{[foo()] : (z)}',
    '{[foo()] : foo().bar}',
    "{[foo()] : foo()['bar']}",
    '{[foo()] : this.bar}',
    "{[foo()] : this['bar']}",
    "{[foo()] : 'foo'.bar}",
    "{[foo()] : 'foo'['bar']}",
    '[...x]',
    '[x,y,...z]',
    '[x,,...z]',
    '{ x: y }',
    '[x, y]',
    '[((x, y) => z).x]',
    '{x: ((y, z) => z).x}',
    "[((x, y) => z)['x']]",
    "{x: ((y, z) => z)['x']}",
    '{x: { y = 10 } }',
    '[(({ x } = { x: 1 }) => x).a]',
    '{ ...d.x }',
    '{ ...c[0]}',
    '{ x: (y) }',
    '{ x: (y) = [] }',
    '{ x: (foo.bar) }',
    "{ x: (foo['bar']) }",
    '[ ...(a) ]',
    "[ ...(foo['bar']) ]",
    '[ ...(foo.bar) ]',
    '[ (y) ]',
    '[ (foo.bar) ]',
    '(foo["bar"])',
    '[(foo["bar"])]',
  ]) {
    it(`let x, y, z; (${arg} = z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`let x, y, z; (${arg} = z = {});`);
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; (x = ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (x = ${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; for (x in ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x in ${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; for (x of ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of ${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; for (x of x =${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x =${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; for (x of x =${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x =${arg}= z = {});`, { webcompat: true });
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, { sourceType: 'module' });
      });
    });

    it(`var x, y, z; (${arg} = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg} = {});`, { sourceType: 'module' });
      });
    });

    it(`'use strict'; var x, y, z; m(['a']) ? ${arg} = {} : rhs`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; var x, y, z; m(['a']) ? ${arg} = {} : rhs`, { sourceType: 'module' });
      });
    });

    it(`'use strict'; var x, y, z; m(['b']) ? lhs :${arg} = {}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; var x, y, z; m(['b']) ? lhs : ${arg} = {}`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    'var foo = { x = 10 } = {};',
    'var foo = { q } = { x = 10 } = {};',
    'var foo; foo = { x = 10 } = {};',
    'var foo; foo = { q } = { x = 10 } = {};',
    'var x; ({ x = 10 } = {});',
    'var q, x; ({ q } = { x = 10 } = {});',
    'var x; [{ x = 10 } = {}]',
    'var x; (true ? { x = true } = {} : { x = false } = {})',
    'var q, x; (q, { x = 10 } = {});',
    'var { x = 10 } = { x = 20 } = {};',
    'var { __proto__: x, __proto__: y } = {}',
    'var foo = async ({x}) => { var x = 2; return x };',
    'var foo = async ({x}) => { { var x = 2; } return x; };',
    'var foo = async ({x}) => { var y = x; var x = 2; return y; };',
    'var foo = async ({x}, g = () => x) => { { var x = 2; } return g(); };',
    'var foo = async ({x}) => { { var g = () => x; var x = 2; } return g(); };',
    'var foo = async ({x}, g = () => eval("x")) => { var x = 2; return g(); };',
    'var foo = async ({x}, y) => { var y; return y };',
    'var foo = async ({x}, y) => { var z = y; var y = 2; return z; };',
    'var foo = async (y, g = () => y) => { var y = 2; return g(); };',
    'var foo = async ({x}, y, [z], v) => { var x, y, z; return x*y*z*v };',
    'var foo = async ({x}) => { function x() { return 2 }; return x(); }',
    'var foo = async ({x}) => { { function x() { return 2 } } return x(); }',
    'var foo = async (x = 1) => { return x };',
    'var [,,a,b,,,c=2,...d] = a;',
    'var foo = async (x, y = x) => { return x + y; };',
    'var foo = async (x, y = () => x) => { return x + y(); };',
    'var foo = async (x = () => 1) => { return x() };',
    'var foo = async (x = {a: 1, m() { return 2 }}) => { return x.a + x.m(); };',
    'var foo = async (a = () => x) => { var x; return a(); };',
    'var foo = async (a = eval("x")) => { var x; return a; };',
    'var foo = async (a = x) => { var x = 2; return a; };',
    'var foo = async (a = () => { "use strict"; return eval("x") }) => { var x; return a(); };',
    'var foo = async function f(f = 7, x = f) { return x; }',
    'var {[null]: y, ...x} = {null: 1, x: 1};',
    'var {[true]: y, ...x} = {true: 1, x: 1};',
    'var {[false]: y, ...x} = {false: 1, x: 1};',
    'var { [key]: y, ...x } = { b: 1, a: 1 };',
    'var {[key]: y, ...x} = {1: 1, a: 1};',
    'var { ...y } =  { ...z} ;',
    'var z = { b: 1}',
    'var [,,,,] = a;',
    'var [a, [b, c, d=2], ...rest] = test;',
    'const [...[x, ...[y, ...{z}]]] = [3, 4, 5];',
    'var [a, b,,,,] = test;',
    'var { 1.5: x, 2: y, ...z } = { 1.5: 1, 2: 2, 3:3 };',
    'var g4 = async (a = eval("x")) => { var x; return a; };',
    'var f13 = async function f(x = f) { function f() {}; return x; }',
    String.raw`var \u4e00 = 1;`,
    String.raw`var \u3400 = 1;`,
    String.raw`var \u362e = 1;`,
    String.raw`var \u4db5 = 1;`,
    'var 龥 = 1;',
    'var 㐀 = 1;',
    'var 㘮 = 1;',
    'var 䶵',
    'var\u2028x\u2028=\u20281\u2028;',
    'var\u2029x\u2029=\u20291\u2029;',
    '({ __proto__: x, __proto__: y } = {})',
    'var { x = 10 } = (o = { x = 20 } = {});',
    'var x; (({ x = 10 } = { x = 20 } = {}) => x)({})',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });
  }
  for (const arg of [
    'var [[...x] = function() { initCount += 1; }()] = [[2, 1, 3]];',
    'var [[x]] = [null];',
    'var [cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] = [];',
    outdent`
      var first = 0;
      var second = 0;
      function* g() {
        first += 1;
        yield;
        second += 1;
      };
      var [,] = g();
    `,
    'var { x, } = { x: 23 };',
    'var { w: [x, y, z] = [4, 5, 6] } = {};',
    'var { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] };',
    'var { x: y = 33 } = { };',
    'var { x: y, } = { x: 23 };',
    'var xCls = class x {};',
    'var cls = class {};',
    'var\n{x} = x;',
    'var {x}\n= x;',
    'var [...x] = [1, 2, 3];',
    'var { x, } = { x: 23 };',
    'var { x: y = 33 } = { };',
    'var {...x} = { get v() { count++; return 2; } };',
    'var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined };',
    'var { poisoned: x = ++initEvalCount } = poisonedProperty;',
    'var { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] };',
    'var arrow = () => {};',
    'var xFn = function x() {};',
    'var obj = { test262id: 1 };',
    'var [] = [];',
    'var [a] = [];',
    'var a; [a] = [];',
    'var a; [a] = [1];',
    'var a, b; [a, b] = [1];',
    'var a; [a] = [1, 2];',
    'var a = [1], i = 0; [a[i++]] = [];',
    'var [,] = [];',
    'var [a,] = [];',
    'var a; [a,] = [];',
    'var [a,,b] = [];',
    'var [,,a] = [];',
    'var a; [a] = [,,];',
    'var [...a] = [];',
    'var a; [...a] = [];',
    'var [a = 1] = [];',
    'var [a, b = 1] = [];',
    'var a, b; [a, b = 1] = [];',
    'var [[a]] = [[]];',
    'var a; [[a]] = [[]];',
    'var [a, [b]] = [1, []];',
    'var a, b; [a, [b]] = [1, []];',
    'var a, b; [((((a)))), b] = [];',
    'var [[[...a]]] = [[[]]];',
    'var a; [[[...a]]] = [[[]]];',
    'var [[...a], ...b] = [[],];',
    'var a, b; [[...a], ...b] = [[],];',
    'var [a, a] = [];',
    'var hi = function eval() { };',
    'var f = () => {var O = { method() { var await = 1; return await; } };}',
    'var f = () => {var O = { method(await) { return await; } };}',
    'var f = () => {var O = { *method() { var await = 1; return await; } };}',
    'var O = { *method(await) { return await; } };',
    'var a = {}; [a.x] = [];',
    'var await = 3; async function a() { await 4; }',
    'var a = {}; [a["x"]] = [];',
    'function foo() { return {}; }; [foo().x] = [];',
    'function foo() { return {}; }; [foo()["x"]] = [];',
    'class foo { method() { [super.x] = []; } }',
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
  }

  // Should fail on reserved words

  for (const arg of [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'null',
    'true',
    'false',
    // future reserved keyword,
    'enum',
  ]) {
    it(`for (var ${arg} = x;;);`, () => {
      t.throws(() => {
        parseSource(`for (var ${arg} = x;;);`);
      });
    });

    it(`function f({${arg}}) {}`, () => {
      t.throws(() => {
        parseSource(`function f({${arg}}) {}`);
      });
    });

    it(`function fh({x: ${arg}}) {}`, () => {
      t.throws(() => {
        parseSource(`function fh({x: ${arg}}) {}`);
      });
    });

    it(`function f([${arg}]) {}`, () => {
      t.throws(() => {
        parseSource(`function f([${arg}]) {}`);
      });
    });
    it(`function f([${arg}]) {}`, () => {
      t.throws(() => {
        parseSource(`function f([${arg}]) {}`, { lexical: true });
      });
    });
    it(`try {} catch (${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`try {} catch (${arg}) {}`);
      });
    });

    it(`export var ${arg} = 10;`, () => {
      t.throws(() => {
        parseSource(`export var ${arg} = 10;`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    '[1 <= 0]',
    'var [] = x',
    'var [,] = x',
    'var [,,] = x',
    'var [foo] = x',
    'var [foo,] = x',
    'var [foo,,] = x',
    'var [,foo] = x',
    'var [,,foo] = x',
    'var [foo,bar] = x',
    'var [foo,,bar] = x',
    'var [foo] = x, [foo] = y',
    'var [foo] = x, b',
    'var [foo] = x, b = y',
    'var x, [foo] = y',
    'var x = y, [foo] = z',
    'var [foo=a] = c',
    'var [foo=a,bar] = x',
    'var [foo,bar=b] = x',
    'var [foo=a,bar=b] = x',
    'var [...bar] = obj;',
    'var [foo, ...bar] = obj;',
    'var {foo} = x, {foo} = y',
    'var {foo} = x, b',
    'var {foo} = x, b = y',
    'var x, {foo} = y',
    'var x = y, {foo} = z',
    'var {foo=a} = x',
    'var {foo=a,bar} = x',
    'var {foo,bar=b} = x',
    'var {foo=a,bar=b} = x',
    'var {foo:a} = x',
    'var {foo:a,bar} = x',
    'var {foo,bar:b} = x',
    'var {foo:a,bar:b} = x',
    'var foo = bar\nvar zoo;',
    'var foo = bar',
    'var foo = bar, zoo = boo;',
    'var foo = bar, zoo = boo',
    'var\nfoo',
    'var [] = x;',
    'var [foo,,] = arr;',
    'var [,foo] = arr;',
    'var [,,foo] = arr;',
    'var [foo,bar] = arr;',
    'var [foo,,bar] = arr;',
    'var [foo] = arr, [bar] = arr2;',
    'var [foo] = arr, bar;',
    'var [foo] = arr, bar = arr2;',
    'var foo, [bar] = arr2;',
    'var [foo=a] = arr;',
    'var { [key++]: y, ...x } = { 1: 1, a: 1 };',
    'var { [++key]: y, [++key]: z, ...rest} = {2: 2, 3: 3};',
    'var { [fn()]: x, ...y } = z;',
    'var [foo=a, bar] = arr;',
    'var [foo, bar=b] = arr;',
    'var [foo=a, bar=b] = arr;',
    'var [...foo] = obj;',
    'var [foo, ...bar] = obj;',
    'var [...[foo, bar]] = obj;',
    'var [x, ...[foo, bar]] = obj;',
    'var [a=[...b], ...c] = obj;',
    'var {} = obj;',
    'var {...a} = 0',
    'var {x} = obj;',
    'var {x,} = obj;',
    'var {x, y} = obj;',
    'var {x} = a, {y} = obj;',
    'var {x} = a, y = obj;',
    'var {x} = a, obj;',
    'var x = a, {y} = obj;',
    'var x, {y} = obj;',
    'var {x = y} = obj;',
    'var {x = y, z} = obj;',
    'var {x, y = z} = obj;',
    'var {x = y, z = a} = obj;',
    'var {x : y} = obj;',
    'var {x : y, z} = obj;',
    'var {x, y : z} = obj;',
    'var {x : y, z : a} = obj;',
    'var {x : y = z} = obj;',
    'var {x : y, z, a : b = c} = obj;',
    'var {[x]: y} = z;',
    'var {[x]: y = z} = a;',
    'var {a, [x]: y} = a;',
    'var [...x] = y',
    'var a, [...x] = y',
    'var {...x} = y',
    'var {[2]: y} = {2:3}',
    'var diff = arrayDiff(before, after, function(a, b, callback) {})',
    'var [x, ...[foo, bar]] = obj;',
    'var [a=[...b], ...c] = obj;',
    'var {} = obj;',
    'var {x} = obj;',
    'var {x,} = obj;',
    'for (var [foo] = arr;;);',
    'for (var [foo,] = arr;;);',
    'for (var [foo,,] = arr;;);',
    'for (var [,foo] = arr;;);',
    'for (var [a=[...b], ...c] = obj;;);',
    'for (var {x, y} = obj;;);',
    'for (var {x} = a, {y} = obj;;);',
    'var {a: x, b: x} = {a: 4, b: 5};',
    'var x = 4; var x = 5;',
    'var x; var x = 5;',
    'var {x} = {x: 4, b: (x = 5)};',
    "var x; eval('');",
    'var x; { var x; }',
    'var x; function y() {}',
    'var x; var x;',
    'var x; x = 8;',
    'function x() { x = 0; }',
    "'use strict'; let x; eval('');",
    'var [x, x] = [4, 5];',
    'var z = (x %= 2);',
    'var z = (x &= y);',
    'var z = {};',
    'var {x, y} = o',
    'var {x: x, y: y} = o',
    'var {x=1, y=2} = o',
    'var a;',
    'var f, g = 42, h = false;',
    'var a = [ , 1 ], b = [ 1, ], c = [ 1, , 2 ], d = [ 1, , , ];',
    'var foo = { }; foo.eval = {};',
    "var TRIM = 'trim' in String.prototype;",
    'var foo = { eval: 1 };',
    'var foo = { }; foo.eval = {};',
    '{ var foo; };',
    'var foo; { var foo; };',
    'var foo; { function foo() {} };',
    '{ var {foo=a} = {}; };',
    '{ var foo = a; };',
    '{ var {foo} = {foo: a}; };',
    'var [[x]] = [null];',
    'var [fn = function () {}, xFn = function x() {}] = [];',
    'var arrow = () => {};',
    'var {a: [o, {p}]} = d;',
    'var { ...x } = z;',
    'var _ref = { z: "bar" };',
    'var { x, ...y } = z;',
    'var { [x]: x, ...y } = z;',
    'var [a, b] = [1, 2];',
    'var {} = null;',
    'var [[a, b]] = [[1, 2]];',
    'var [a, b, ...c] = [1, 2, 3, 4];',
    'var [[a, b, ...c]] = [[1, 2, 3, 4]];',
    'var [a, b] = [foo(), bar];',
    'var [a, b] = [clazz.foo(), bar];',
    'var [a, b] = [clazz.foo, bar];',
    'var arr = [ "a",, "b", ...c ];',
    'var arr = ["a",, "b"].concat(c.d(e));',
    'var [a, b] = [, 2];',
    '[a, b] = [1, 2];',
    '[a, b] = [, 2];',
    'var {a: [x1, y1], b: [x2, y2] } = c;',
    'var rect = {};',
    'var x = -1;',
    'var {[a]: [b]} = c',
    'var {[a]: b} = c',
    outdent`
      try{
          try {
            var intry__intry__var;
          } catch (e) {
            var intry__incatch__var;
          }
      }catch(e){
          try {
            var incatch__intry__var;
          } catch (e) {
              var incatch__incatch__var;
          }
      };
    `,
    'var {a: [b]} = c',
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
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`);
      });
    });

    it(`(function() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() { ${arg} })`);
      });
    });

    it(`(function() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() /** Comment before body */ { ${arg} }) // Single`);
      });
    });

    it(`async function *foo() { (function() { ${arg} })}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function *foo() { (function() { ${arg} })} // k`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  fail('Declarations - Var (fail)', [
    'var x += 1;',
    'var x | true;',
    'var x && 1;',
    'var --x;',
    'var x>>1;',
    'var x in [];',
    'var var',
    'var var = 2000000;',
    'var [var] = obj',
    '[var] = obj',
    // Cannot use abbreviated destructuring syntax for keyword 'var'
    'function var() { }',
    'function a({var}) { }',
    '(function a(var) { })',
    '(function a([{var}]) { })',
    '(function a({ hello: {var}}) { })',
    '(function a({ 0: [var]}) { })',
    'class var { }',
    'var [...[ x ] = []] = [];',
    'var [...{ x } = []] = [];',
    'var [...x, y] = [1, 2, 3];',
    'var [...{ x }, y] = [1, 2, 3];',
    'var a.b;',
    'var [];',
    'var [a];',
    'var { key: bar/x } = {}',
    'var { key: await /foo/g } = {}',
    'var { key: bar + x } = {}',
    'var { "foo": 123 } = {}',
    'var t4 = ++await 1;',
    'var t5 = --await 1;',
    'var {  ...y, ...y } = {}',
    'var { foo: true / false } = {}',
    'var { *static() {} } = {}',
    'var { static(){} } = {}',
    'var { foo: 1, set bar(v) {} } = {}',
    'var {  get yield() { }  } = {}',
    { code: String.raw`var s = "\37"`, options: { impliedStrict: true } },
    'var { set foo(_) {}, set foo(v) {} } = {}',
    'var { foo: 1, get "foo"() {} } = {}',
    'var { async *method({ w: [x, y, z] = [4, 5, 6] } = {}) {} } = {}',
    'var { async *method([[,] = g()]) {} } = {}',
    'var { true : 1 } = {}',
    'var { set: 1, set: 2 } = {}',
    'var { foo: 1, "foo": 2 } = {}',
    'var [a--] = [];',
    'var [a + 1] = [];',
    'var [++a] = [];',
    'var {...x = 1} = {}',
    'var [a a, b] = c;',
    'var [a, b',
    'var [a, ...rest, b] = c;',
    'var a; [a--] = [];',
    'var a; [++a] = [];',
    'var [1] = [];',
    'var [1, a] = [];',
    'var a; [1, a] = [];',
    'var [...a, ...b] = [];',
    'var a, b; [...a, ...b] = [];',
    'var a, b; [...a, b] = [];',
    'var a; [...a = 1] = [];',
    'var [...a = 1] = [];',
    'var [((a)] = [];',
    'var a; [((a)] = []',
    'var {...a.b} = 0',
    'var [a)] = [];',
    'var a; [a)] = [];',
    'var {...[]} = {}',
    'var {...{z}} = { z: 1};',
    'var { ...{ x = 5 } } = {x : 1};',
    'var { ...{x =5 } } = {x : 1}; console.log(x);',
    'var [((((a)))), b] = [];',
    'var [[(a)], ((((((([b])))))))] = [[],[]];',
    'var a; [([a])] = [[]];"); }',
    'var 𫠞_ = 12;}',
    'var _𖫵 = 11;',
    'var a, b; [([a]), (((([b]))))] = [[], []];',
    'var a, b; [({a}), (((({b}))))] = [{}, {}];',
    'var a, b; ({a:({a}), b:((({b})))} = {a:{}, b:{}} );',
    'function foo() { return {}; }; var [foo()] = [];',
    'function foo() { return {}; }; var [foo().x] = [];',
    'class foo { method() { var [super()] = []; } }',
    'var {foo}',
    'var {foo=a}',
    'var {foo:a}',
    'var {foo:a=b}',
    'var {foo}, bar',
    'var foo, {bar}',
    'var\nfoo()',
    'var [foo];',
    'var [foo = x];',
    'var [foo], bar;',
    'var foo, [bar];',
    'var [foo:bar] = obj;',
    'var [...foo, bar] = obj;',
    'var [...foo,] = obj;',
    'var [...foo,,] = obj;',
    'const var = 1;',
    'var [...[foo, bar],,] = obj;',
    'var [..x] = obj;',
    'var [.x] = obj;',
    'var {foo};',
    'var [.x] = obj;',
    'var {,} = x;',
    'var {foo,,} = x;',
    ' var {,foo} = x; ',
    'var {,,foo} = x;',
    'var {foo,,bar} = x;',
    'var\nfoo()',
    'var [foo = x];',
    'var [foo], bar;',
    'var foo, [bar];',
    'var [foo:bar] = obj;',
    'var [...foo, bar] = obj;',
    'var [...foo,] = obj;',
    'var [...foo,,] = obj;',
    'var [...[foo, bar],] = obj;',
    'var [...[foo, bar],,] = obj;',
    'var [... ...foo] = obj;',
    'var [...bar = foo] = obj;',
    'var [.x] = obj;',
    'var [..x] = obj;',
    'var {,} = obj;',
    'var {,,} = obj;',
    'var {,x} = obj;',
    'var {,,x} = obj;',
    'var {x,, y} = obj;',
    'var {x,, y} = obj;',
    'var {x};',
    'var {x}, {y} = z;',
  ]);

  pass('Declarations - Var (pass)', [
    'var ancestors = [/^VarDef$/, /^(Const|Let|Var)$/, /^Export$/];',
    'var idx = reverse ? --to : from++;',
    'for (var [x, ...[foo, bar]] = obj;;);',

    'var await = { await }',
    'for (var [a=[...b], ...c] = obj;;);',
    'for (var x = a, {y} = obj;;);',
    { code: 'for (var x, {y} = obj;;);', options: { ranges: true } },
    { code: 'for (var [] in x);', options: { ranges: true } },
    'for (var [,,] in x);',
    'var x; var x = 5;',
    '{ var x; }; x = 0;',
    'var x = 8;',
    'var x; { var x = 5; }',
    'var {x=1} = {a: 4, b: (x = 5)};',
    'var x = {a: 4, b: (x = 5)};',
    'var x; try {} catch (x) { x = 5; }',
    'var x; eval("");',
    'eval(""); var x;',
    { code: 'var x; var x;', options: { ranges: true } },
    { code: 'function x() {}; var x;', options: { ranges: true } },
    { code: 'var x; try {} catch (x) { var x = 5; }', options: { webcompat: true } },
    { code: '"use strict"; var x = 0; { let x; x = 6; }', options: { loc: true } },
    '"use strict"; let x = 0; { let x = 6; }',
    { code: 'var [x, x] = [4, 5];', options: { ranges: true } },
    { code: 'var x; [x, x] = [4, 5];', options: { ranges: true } },
    { code: 'var {a: x, b: x} = {a: 4, b: 5};', options: { ranges: true } },
    'var x = {a: 4, b: (x = 5)};',
    'var foo = {}; foo.if;',
    outdent`
      var f0 = function (a, b = a, c = b) {
        return [a, b, c];
      };

      expect(f0(1)).toEqual([1, 1, 1]);

      var f1 = function ({a}, b = a, c = b) {
        return [a, b, c];
      };

      expect(f1({a: 1})).toEqual([1, 1, 1]);

      var f2 = function ({a}, b = a, c = a) {
        return [a, b, c];
      };
    `,
    { code: 'var foo = {}; foo.super;', options: { ranges: true } },
    'var foo = {}; foo.interface;',
    'var foo = {}; foo.arguments;',
    { code: 'var [,] = x;', options: { ranges: true } },
    'var [,,] = x;',
    'var\nfoo',
    'var [foo,,] = x;',
    'var [,foo] = x;',
    'var [,,foo] = x;',
    'var [foo,bar] = x;',
    'var [foo] = x, [foo] = y;',
    'var [foo] = x, b;',
    'var [foo] = x, b = y;',
    'var x, [foo] = y;',
    { code: 'var [foo=a] = c;', options: { ranges: true } },
    { code: 'var [foo=a,bar=b] = x;', options: { ranges: true } },
    'var {} = x;',
    'var {foo} = x;',
    'var {foo,} = x;',
    'var x = 5; function x() {}',
    'var x; x = 8;',
    'var O = { async method() { await 1; } }',
    { code: 'var O = { async ["meth" + "od"]() { await 1; } }', options: { ranges: true, raw: true } },
    { code: 'var [ a, , b ] = list', options: { ranges: true } },
    'var O = { async "method"() { await 1; } }',
    { code: 'var O = { async 0() { await 1; } }', options: { ranges: true } },
    'var let',
    'var [let] = []',
    { code: 'var x; { with ({}) { x = 1; } }', options: { ranges: true } },
    'for (var {x : y} of obj);',
    { code: "var o = { get [/./.exec('')](){} }", options: { ranges: true, raw: true } },
    {
      code: outdent`
        var [ a, , b ] = list;
        [ b, a ] = [ a, b ]
      `,
      options: { ranges: true },
    },
    outdent`
      var [ a, , b ] = list
      [ b, a ] = [ a, b ]
    `,
    'var x, {y} = obj;',
    'var {x = y} = obj;',
    { code: 'var {x = y, z} = obj;', options: { ranges: true } },
    'var foo, bar;',
    'var foo, bar',
  ]);
});
