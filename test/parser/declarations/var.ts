import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

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
        parseSource(`let x, y, z; (${arg} = z = {});`, undefined, Context.None);
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; (x = ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (x = ${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; for (x in ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x in ${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; for (x of ${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of ${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; for (x of x =${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x =${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; for (x of x =${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; for (x of x =${arg}= z = {});`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; (${arg}= z = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg}= z = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`var x, y, z; (${arg} = {});`, () => {
      t.doesNotThrow(() => {
        parseSource(`var x, y, z; (${arg} = {});`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`'use strict'; var x, y, z; m(['a']) ? ${arg} = {} : rhs`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `'use strict'; var x, y, z; m(['a']) ? ${arg} = {} : rhs`,
          undefined,
          Context.Strict | Context.Module,
        );
      });
    });

    it(`'use strict'; var x, y, z; m(['b']) ? lhs :${arg} = {}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `'use strict'; var x, y, z; m(['b']) ? lhs : ${arg} = {}`,
          undefined,
          Context.Strict | Context.Module,
        );
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });
  }
  for (const arg of [
    'var [[...x] = function() { initCount += 1; }()] = [[2, 1, 3]];',
    'var [[x]] = [null];',
    'var [cls = class {}, xCls = class X {}, xCls2 = class { static name() {} }] = [];',
    `var first = 0;
    var second = 0;
    function* g() {
      first += 1;
      yield;
      second += 1;
    };
    var [,] = g();`,
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
    `var { w: { x, y, z } = { x: 4, y: 5, z: 6 } } = { w: undefined };`,
    `var { poisoned: x = ++initEvalCount } = poisonedProperty;`,
    `var { w: [x, y, z] = [4, 5, 6] } = { w: [7, undefined, ] };`,
    `var arrow = () => {};`,
    `var xFn = function x() {};`,
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
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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
        parseSource(`for (var ${arg} = x;;);`, undefined, Context.None);
      });
    });

    it(`function f({${arg}}) {}`, () => {
      t.throws(() => {
        parseSource(`function f({${arg}}) {}`, undefined, Context.None);
      });
    });

    it(`function fh({x: ${arg}}) {}`, () => {
      t.throws(() => {
        parseSource(`function fh({x: ${arg}}) {}`, undefined, Context.None);
      });
    });

    it(`function f([${arg}]) {}`, () => {
      t.throws(() => {
        parseSource(`function f([${arg}]) {}`, undefined, Context.None);
      });
    });
    it(`function f([${arg}]) {}`, () => {
      t.throws(() => {
        parseSource(`function f([${arg}]) {}`, undefined, Context.OptionsLexical);
      });
    });
    it(`try {} catch (${arg}) {}`, () => {
      t.throws(() => {
        parseSource(`try {} catch (${arg}) {}`, undefined, Context.None);
      });
    });

    it(`export var ${arg} = 10;`, () => {
      t.throws(() => {
        parseSource(`export var ${arg} = 10;`, undefined, Context.Module);
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
    `var {x, y} = o`,
    'var {x: x, y: y} = o',
    'var {x=1, y=2} = o',
    'var a;',
    'var f, g = 42, h = false;',
    `var a = [ , 1 ], b = [ 1, ], c = [ 1, , 2 ], d = [ 1, , , ];`,
    `var foo = { }; foo.eval = {};`,
    `var TRIM = 'trim' in String.prototype;`,
    `var foo = { eval: 1 };`,
    `var foo = { }; foo.eval = {};`,
    `{ var foo; };`,
    `var foo; { var foo; };`,
    `var foo; { function foo() {} };`,
    `{ var {foo=a} = {}; };`,
    `{ var foo = a; };`,
    `{ var {foo} = {foo: a}; };`,
    `var [[x]] = [null];`,
    `var [fn = function () {}, xFn = function x() {}] = [];`,
    `var arrow = () => {};`,
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
    `try{
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
  };`,
    'var {a: [b]} = c',
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
    it(`"use strict"; ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${arg}`, undefined, Context.None);
      });
    });

    it(`(function() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() { ${arg} })`, undefined, Context.None);
      });
    });

    it(`(function() { ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`(function() /** Comment before body */ { ${arg} }) // Single`, undefined, Context.None);
      });
    });

    it(`async function *foo() { (function() { ${arg} })}`, () => {
      t.doesNotThrow(() => {
        parseSource(`async function *foo() { (function() { ${arg} })} // k`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Declarations - Var (fail)', [
    ['var x += 1;', Context.None],
    ['var x | true;', Context.None],
    ['var x && 1;', Context.None],
    ['var --x;', Context.None],
    ['var x>>1;', Context.None],
    [`var x in [];`, Context.None],
    [`var var`, Context.None],
    [`var var = 2000000;`, Context.None],
    [`var [var] = obj`, Context.None],
    [`[var] = obj`, Context.None],
    // Cannot use abbreviated destructuring syntax for keyword 'var'
    [`function var() { }`, Context.None],
    [`function a({var}) { }`, Context.None],
    [`(function a(var) { })`, Context.None],
    [`(function a([{var}]) { })`, Context.None],
    [`(function a({ hello: {var}}) { })`, Context.None],
    [`(function a({ 0: [var]}) { })`, Context.None],
    [`class var { }`, Context.None],
    [`var [...[ x ] = []] = [];`, Context.None],
    [`var [...{ x } = []] = [];`, Context.None],
    [`var [...x, y] = [1, 2, 3];`, Context.None],
    [`var [...{ x }, y] = [1, 2, 3];`, Context.None],
    ['var a.b;', Context.None],
    ['var [];', Context.None],
    ['var [a];', Context.None],
    ['var { key: bar/x } = {}', Context.None],
    ['var { key: await /foo/g } = {}', Context.None],
    ['var { key: bar + x } = {}', Context.None],
    ['var { "foo": 123 } = {}', Context.None],
    ['var t4 = ++await 1;', Context.None],
    ['var t5 = --await 1;', Context.None],
    ['var {  ...y, ...y } = {}', Context.None],
    ['var { foo: true / false } = {}', Context.None],
    ['var { *static() {} } = {}', Context.None],
    ['var { static(){} } = {}', Context.None],
    ['var { foo: 1, set bar(v) {} } = {}', Context.None],
    ['var {  get yield() { }  } = {}', Context.None],
    [String.raw`var s = "\37"`, Context.Strict],
    ['var { set foo(_) {}, set foo(v) {} } = {}', Context.None],
    ['var { foo: 1, get "foo"() {} } = {}', Context.None],
    ['var { async *method({ w: [x, y, z] = [4, 5, 6] } = {}) {} } = {}', Context.None],
    ['var { async *method([[,] = g()]) {} } = {}', Context.None],
    ['var { true : 1 } = {}', Context.None],
    ['var { set: 1, set: 2 } = {}', Context.None],
    ['var { foo: 1, "foo": 2 } = {}', Context.None],
    ['var [a--] = [];', Context.None],
    ['var [a + 1] = [];', Context.None],
    ['var [++a] = [];', Context.None],
    ['var {...x = 1} = {}', Context.None],
    ['var [a a, b] = c;', Context.None],
    ['var [a, b', Context.None],
    ['var [a, ...rest, b] = c;', Context.None],
    ['var a; [a--] = [];', Context.None],
    ['var a; [++a] = [];', Context.None],
    ['var [1] = [];', Context.None],
    ['var [1, a] = [];', Context.None],
    ['var a; [1, a] = [];', Context.None],
    ['var [...a, ...b] = [];', Context.None],
    ['var a, b; [...a, ...b] = [];', Context.None],
    ['var a, b; [...a, b] = [];', Context.None],
    ['var a; [...a = 1] = [];', Context.None],
    ['var [...a = 1] = [];', Context.None],
    ['var [((a)] = [];', Context.None],
    ['var a; [((a)] = []', Context.None],
    ['var {...a.b} = 0', Context.None],
    ['var [a)] = [];', Context.None],
    ['var a; [a)] = [];', Context.None],
    ['var {...[]} = {}', Context.None],
    ['var {...{z}} = { z: 1};', Context.None],
    ['var { ...{ x = 5 } } = {x : 1};', Context.None],
    ['var { ...{x =5 } } = {x : 1}; console.log(x);', Context.None],
    ['var [((((a)))), b] = [];', Context.None],
    ['var [[(a)], ((((((([b])))))))] = [[],[]];', Context.None],
    ['var a; [([a])] = [[]];"); }', Context.None],
    ['var 𫠞_ = 12;}', Context.None],
    ['var _𖫵 = 11;', Context.None],
    ['var a, b; [([a]), (((([b]))))] = [[], []];', Context.None],
    ['var a, b; [({a}), (((({b}))))] = [{}, {}];', Context.None],
    ['var a, b; ({a:({a}), b:((({b})))} = {a:{}, b:{}} );', Context.None],
    ['function foo() { return {}; }; var [foo()] = [];', Context.None],
    ['function foo() { return {}; }; var [foo().x] = [];', Context.None],
    ['class foo { method() { var [super()] = []; } }', Context.None],
    ['var {foo}', Context.None],
    ['var {foo=a}', Context.None],
    ['var {foo:a}', Context.None],
    ['var {foo:a=b}', Context.None],
    ['var {foo}, bar', Context.None],
    ['var foo, {bar}', Context.None],
    ['var\nfoo()', Context.None],
    ['var [foo];', Context.None],
    ['var [foo = x];', Context.None],
    ['var [foo], bar;', Context.None],
    ['var foo, [bar];', Context.None],
    ['var [foo:bar] = obj;', Context.None],
    ['var [...foo, bar] = obj;', Context.None],
    ['var [...foo,] = obj;', Context.None],
    ['var [...foo,,] = obj;', Context.None],
    ['const var = 1;', Context.None],
    ['var [...[foo, bar],,] = obj;', Context.None],
    ['var [..x] = obj;', Context.None],
    ['var [.x] = obj;', Context.None],
    ['var {foo};', Context.None],
    ['var [.x] = obj;', Context.None],
    ['var {,} = x;', Context.None],
    ['var {foo,,} = x;', Context.None],
    [' var {,foo} = x; ', Context.None],
    ['var {,,foo} = x;', Context.None],
    ['var {foo,,bar} = x;', Context.None],
    ['var\nfoo()', Context.None],
    ['var [foo = x];', Context.None],
    ['var [foo], bar;', Context.None],
    ['var foo, [bar];', Context.None],
    ['var [foo:bar] = obj;', Context.None],
    ['var [...foo, bar] = obj;', Context.None],
    ['var [...foo,] = obj;', Context.None],
    ['var [...foo,,] = obj;', Context.None],
    ['var [...[foo, bar],] = obj;', Context.None],
    ['var [...[foo, bar],,] = obj;', Context.None],
    ['var [... ...foo] = obj;', Context.None],
    ['var [...bar = foo] = obj;', Context.None],
    ['var [.x] = obj;', Context.None],
    ['var [..x] = obj;', Context.None],
    ['var {,} = obj;', Context.None],
    ['var {,,} = obj;', Context.None],
    ['var {,x} = obj;', Context.None],
    ['var {,,x} = obj;', Context.None],
    ['var {x,, y} = obj;', Context.None],
    ['var {x,, y} = obj;', Context.None],
    ['var {x};', Context.None],
    ['var {x}, {y} = z;', Context.None],
  ]);

  pass('Declarations - Var (pass)', [
    ['var ancestors = [/^VarDef$/, /^(Const|Let|Var)$/, /^Export$/];', Context.None],
    ['var idx = reverse ? --to : from++;', Context.None],
    ['for (var [x, ...[foo, bar]] = obj;;);', Context.None],

    ['var await = { await }', Context.None],
    ['for (var [a=[...b], ...c] = obj;;);', Context.None],
    ['for (var x = a, {y} = obj;;);', Context.None],
    ['for (var x, {y} = obj;;);', Context.OptionsRanges],
    ['for (var [] in x);', Context.OptionsRanges],
    ['for (var [,,] in x);', Context.None],
    ['var x; var x = 5;', Context.None],
    ['{ var x; }; x = 0;', Context.None],
    ['var x = 8;', Context.None],
    ['var x; { var x = 5; }', Context.None],
    ['var {x=1} = {a: 4, b: (x = 5)};', Context.None],
    ['var x = {a: 4, b: (x = 5)};', Context.None],
    ['var x; try {} catch (x) { x = 5; }', Context.None],
    ['var x; eval("");', Context.None],
    ['eval(""); var x;', Context.None],
    ['var x; var x;', Context.OptionsRanges],
    ['function x() {}; var x;', Context.OptionsRanges],
    ['var x; try {} catch (x) { var x = 5; }', Context.OptionsWebCompat],
    ['"use strict"; var x = 0; { let x; x = 6; }', Context.OptionsLoc],
    ['"use strict"; let x = 0; { let x = 6; }', Context.None],
    ['var [x, x] = [4, 5];', Context.OptionsRanges],
    ['var x; [x, x] = [4, 5];', Context.OptionsRanges],
    ['var {a: x, b: x} = {a: 4, b: 5};', Context.OptionsRanges],
    ['var x = {a: 4, b: (x = 5)};', Context.None],
    ['var foo = {}; foo.if;', Context.None],
    [
      `var f0 = function (a, b = a, c = b) {
        return [a, b, c];
      };

      expect(f0(1)).toEqual([1, 1, 1]);

      var f1 = function ({a}, b = a, c = b) {
        return [a, b, c];
      };

      expect(f1({a: 1})).toEqual([1, 1, 1]);

      var f2 = function ({a}, b = a, c = a) {
        return [a, b, c];
      };`,
      Context.None,
    ],
    ['var foo = {}; foo.super;', Context.OptionsRanges],
    ['var foo = {}; foo.interface;', Context.None],
    ['var foo = {}; foo.arguments;', Context.None],
    ['var [,] = x;', Context.OptionsRanges],
    ['var [,,] = x;', Context.None],
    ['var\nfoo', Context.None],
    ['var [foo,,] = x;', Context.None],
    ['var [,foo] = x;', Context.None],
    ['var [,,foo] = x;', Context.None],
    ['var [foo,bar] = x;', Context.None],
    ['var [foo] = x, [foo] = y;', Context.None],
    ['var [foo] = x, b;', Context.None],
    ['var [foo] = x, b = y;', Context.None],
    ['var x, [foo] = y;', Context.None],
    ['var [foo=a] = c;', Context.OptionsRanges],
    ['var [foo=a,bar=b] = x;', Context.OptionsRanges],
    ['var {} = x;', Context.None],
    ['var {foo} = x;', Context.None],
    ['var {foo,} = x;', Context.None],
    ['var x = 5; function x() {}', Context.None],
    ['var x; x = 8;', Context.None],
    ['var O = { async method() { await 1; } }', Context.None],
    ['var O = { async ["meth" + "od"]() { await 1; } }', Context.OptionsRanges | Context.OptionsRaw],
    ['var [ a, , b ] = list', Context.OptionsRanges],
    ['var O = { async "method"() { await 1; } }', Context.None],
    ['var O = { async 0() { await 1; } }', Context.OptionsRanges],
    ['var let', Context.None],
    ['var [let] = []', Context.None],
    ['var x; { with ({}) { x = 1; } }', Context.OptionsRanges],
    ['for (var {x : y} of obj);', Context.None],
    ["var o = { get [/./.exec('')](){} }", Context.OptionsRanges | Context.OptionsRaw],
    [
      `var [ a, , b ] = list;
      [ b, a ] = [ a, b ]`,
      Context.OptionsRanges,
    ],
    [
      `var [ a, , b ] = list
  [ b, a ] = [ a, b ]`,
      Context.None,
    ],
    ['var x, {y} = obj;', Context.None],
    ['var {x = y} = obj;', Context.None],
    ['var {x = y, z} = obj;', Context.OptionsRanges],
    ['var foo, bar;', Context.None],
    ['var foo, bar', Context.None],
  ]);
});
