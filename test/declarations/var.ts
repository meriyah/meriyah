import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

describe('Declarations - Var', () => {
  for (const arg of [
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
    '[ x ]',
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
    '[(foo["bar"])]'
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
          Context.Strict | Context.Module
        );
      });
    });

    it(`'use strict'; var x, y, z; m(['b']) ? lhs :${arg} = {}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `'use strict'; var x, y, z; m(['b']) ? lhs : ${arg} = {}`,
          undefined,
          Context.Strict | Context.Module
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
    'var g6 = async ({x}, g = () => x) => { { var x = 2; } return g(); };',
    'var g8 = async ({x}) => { { var g = () => x; var x = 2; } return g(); };',
    'var g1 = async ({x}) => { var x = 2; return x };',
    'var g2 = async ({x}) => { { var x = 2; } return x; };',
    ' var g3 = async ({x}) => { var y = x; var x = 2; return y; };',
    'var g6 = async ({x}, g = () => x) => { { var x = 2; } return g(); };',
    'var g8 = async ({x}) => { { var g = () => x; var x = 2; } return g(); };',
    'var g9 = async ({x}, g = () => eval("x")) => { var x = 2; return g(); };',
    'var g10 = async ({x}, y) => { var y; return y };',
    ' var g11 = async ({x}, y) => { var z = y; var y = 2; return z; };',
    'var g12 = async (y, g = () => y) => { var y = 2; return g(); };',
    ' var g13 = async ({x}, y, [z], v) => { var x, y, z; return x*y*z*v };',
    ' var g20 = async ({x}) => { function x() { return 2 }; return x(); }',
    'var g21 = async ({x}) => { { function x() { return 2 } } return x(); }',
    'var g1 = async (x = 1) => { return x };',
    'var g2 = async (x, y = x) => { return x + y; };',
    'var g5 = async (x, y = () => x) => { return x + y(); };',
    'var g4 = async (x = () => 1) => { return x() };',
    'var g6 = async (x = {a: 1, m() { return 2 }}) => { return x.a + x.m(); };',
    'var g5 = async (a = () => x) => { var x; return a(); };',
    'var g3 = async (a = eval("x")) => { var x; return a; };',
    'var g1 = async (a = x) => { var x = 2; return a; };',
    'var g61 = async (a = () => { "use strict"; return eval("x") }) => { var x; return a(); };',
    'var f13 = async function f(f = 7, x = f) { return x; }',
    'var {[null]: y, ...x} = {null: 1, x: 1};',
    'var {[true]: y, ...x} = {true: 1, x: 1};',
    'var {[false]: y, ...x} = {false: 1, x: 1};',
    'var { [key]: y, ...x } = { b: 1, a: 1 };',
    'var {[key]: y, ...x} = {1: 1, a: 1};',
    'var { ...y } =  { ...z} ;',
    'var z = { b: 1}',
    'var { 1.5: x, 2: y, ...z } = { 1.5: 1, 2: 2, 3:3 };',
    'var g4 = async (a = eval("x")) => { var x; return a; };',
    'var f13 = async function f(x = f) { function f() {}; return x; }',
    '({ __proto__: x, __proto__: y } = {})',
    'var { x = 10 } = (o = { x = 20 } = {});',
    'var x; (({ x = 10 } = { x = 20 } = {}) => x)({})'
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
    'var a = {}; [a.x] = [];',
    'var a = {}; [a["x"]] = [];',
    'function foo() { return {}; }; [foo().x] = [];',
    'function foo() { return {}; }; [foo()["x"]] = [];',
    'class foo { method() { [super.x] = []; } }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
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
    'false'
    // future reserved keyword,
    //'enum'
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
    'var [foo=a, bar] = arr;',
    'var [foo, bar=b] = arr;',
    'var [foo=a, bar=b] = arr;',
    'var [...foo] = obj;',
    'var [foo, ...bar] = obj;',
    'var [...[foo, bar]] = obj;',
    'var [x, ...[foo, bar]] = obj;',
    'var [a=[...b], ...c] = obj;',
    'var {} = obj;',
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
    'var x; function x() {}',
    'var x; try {} catch (x) { var x = 5; }',
    'var x; var x;',
    'var x; x = 8;',
    'function x() { x = 0; }',
    "'use strict'; let x; eval('');",
    'var [x, x] = [4, 5];',
    'var z = (x %= 2);',
    'var z = (x &= y);',
    'var z = {};',
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
    'var x = -1;'
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
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  fail('Declarations - Var (fail)', [
    ['var [];', Context.None],
    ['var [a];', Context.None],
    ['var { key: bar/x } = {}', Context.None],
    ['var { key: await /foo/g } = {}', Context.None],
    ['var { key: bar + x } = {}', Context.None],
    ['var { "foo": 123 } = {}', Context.None],
    ['var { "foo": 123 } = {}', Context.None],
    ['var {  ...y, ...y } = {}', Context.None],
    ['var { foo: true / false } = {}', Context.None],
    ['var { *static() {} } = {}', Context.None],
    ['var { static(){} } = {}', Context.None],
    ['var { foo: 1, set bar(v) {} } = {}', Context.None],
    ['var {  get yield() { }  } = {}', Context.None],
    ['var s = "\\37"', Context.Strict],
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
    ['var {x}, {y} = z;', Context.None]
  ]);

  pass('Declarations - Var (pass)', [
    [
      'var ancestors = [/^VarDef$/, /^(Const|Let|Var)$/, /^Export$/];',
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'ancestors',
                  type: 'Identifier'
                },
                init: {
                  elements: [
                    {
                      regex: {
                        flags: '',
                        pattern: '^VarDef$'
                      },
                      type: 'Literal',
                      value: /^VarDef$/
                    },
                    {
                      regex: {
                        flags: '',
                        pattern: '^(Const|Let|Var)$'
                      },
                      type: 'Literal',
                      value: /^(Const|Let|Var)$/
                    },
                    {
                      regex: {
                        flags: '',
                        pattern: '^Export$'
                      },
                      type: 'Literal',
                      value: /^Export$/
                    }
                  ],
                  type: 'ArrayExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'var idx = reverse ? --to : from++;',
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'idx',
                  type: 'Identifier'
                },
                init: {
                  alternate: {
                    argument: {
                      name: 'from',
                      type: 'Identifier'
                    },
                    operator: '++',
                    prefix: false,
                    type: 'UpdateExpression'
                  },
                  consequent: {
                    argument: {
                      name: 'to',
                      type: 'Identifier'
                    },
                    operator: '--',
                    prefix: true,
                    type: 'UpdateExpression'
                  },
                  test: {
                    name: 'reverse',
                    type: 'Identifier'
                  },
                  type: 'ConditionalExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'for (var [x, ...[foo, bar]] = obj;;);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  },
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
            test: null,
            update: null
          }
        ]
      }
    ],

    [
      'var await = { await }',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'await'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'await'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'await'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'for (var [a=[...b], ...c] = obj;;);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  },
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
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var x = a, {y} = obj;;);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  },
                  id: {
                    type: 'ObjectPattern',
                    properties: [
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
                          name: 'y'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var x, {y} = obj;;);',
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
              type: 'VariableDeclaration',
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'VariableDeclarator',
                  init: {
                    type: 'Identifier',
                    name: 'obj'
                  },
                  id: {
                    type: 'ObjectPattern',
                    properties: [
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
                          name: 'y'
                        },
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            },
            test: null,
            update: null
          }
        ]
      }
    ],
    [
      'for (var [] in x);',
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
              kind: 'var',
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
            }
          }
        ]
      }
    ],
    [
      'for (var [,,] in x);',
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
              kind: 'var',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  init: null,
                  id: {
                    type: 'ArrayPattern',
                    elements: [null, null]
                  }
                }
              ]
            },
            right: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'var x; var x = 5;',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Literal',
                  value: 5
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '{ var x; }; x = 0;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'BlockStatement',
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
                      name: 'x'
                    }
                  }
                ]
              }
            ]
          },
          {
            type: 'EmptyStatement'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      'var x = 8;',
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
                  type: 'Literal',
                  value: 8
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x; { var x = 5; }',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    init: {
                      type: 'Literal',
                      value: 5
                    },
                    id: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'var {x=1} = {a: 4, b: (x = 5)};',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 4
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
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
                          type: 'Literal',
                          value: 1
                        }
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
      'var x = {a: 4, b: (x = 5)};',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 4
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x; try {} catch (x) { x = 5; }',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'x'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '=',
                      right: {
                        type: 'Literal',
                        value: 5
                      }
                    }
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      'var x; eval("");',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'eval'
              },
              arguments: [
                {
                  type: 'Literal',
                  value: ''
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'eval(""); var x;',
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
                name: 'eval'
              },
              arguments: [
                {
                  type: 'Literal',
                  value: ''
                }
              ]
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x; var x;',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'function x() {}; var x;',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'x'
            }
          },
          {
            type: 'EmptyStatement'
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var x; try {} catch (x) { var x = 5; }',
      Context.OptionsWebCompat,
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'TryStatement',
            block: {
              type: 'BlockStatement',
              body: []
            },
            handler: {
              type: 'CatchClause',
              param: {
                type: 'Identifier',
                name: 'x'
              },
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'VariableDeclaration',
                    kind: 'var',
                    declarations: [
                      {
                        type: 'VariableDeclarator',
                        init: {
                          type: 'Literal',
                          value: 5
                        },
                        id: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      }
                    ]
                  }
                ]
              }
            },
            finalizer: null
          }
        ]
      }
    ],
    [
      '"use strict"; var x = 0; { let x; x = 6; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Literal',
                  value: 0
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'BlockStatement',
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
                      name: 'x'
                    }
                  }
                ]
              },
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  operator: '=',
                  right: {
                    type: 'Literal',
                    value: 6
                  }
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '"use strict"; let x = 0; { let x = 6; }',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'VariableDeclaration',
                kind: 'let',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    init: {
                      type: 'Literal',
                      value: 6
                    },
                    id: {
                      type: 'Identifier',
                      name: 'x'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    [
      'var [x, x] = [4, 5];',
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
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 4
                    },
                    {
                      type: 'Literal',
                      value: 5
                    }
                  ]
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'x'
                    },
                    {
                      type: 'Identifier',
                      name: 'x'
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
      'var x; [x, x] = [4, 5];',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'x'
                  },
                  {
                    type: 'Identifier',
                    name: 'x'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 4
                  },
                  {
                    type: 'Literal',
                    value: 5
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'var {a: x, b: x} = {a: 4, b: 5};',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 4
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Literal',
                        value: 5
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
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
                        name: 'x'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'x'
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
      'var x = {a: 4, b: (x = 5)};',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Literal',
                        value: 4
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var foo = {}; foo.if;',
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'if'
              }
            }
          }
        ]
      }
    ],
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
                  type: 'FunctionExpression',
                  params: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
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
                        name: 'c'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'a'
                            },
                            {
                              type: 'Identifier',
                              name: 'b'
                            },
                            {
                              type: 'Identifier',
                              name: 'c'
                            }
                          ]
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,
                  expression: false,
                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'f0'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'expect'
                  },
                  arguments: [
                    {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'f0'
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: 1
                        }
                      ]
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'toEqual'
                }
              },
              arguments: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 1
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
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
                            name: 'a'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
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
                        name: 'c'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'a'
                            },
                            {
                              type: 'Identifier',
                              name: 'b'
                            },
                            {
                              type: 'Identifier',
                              name: 'c'
                            }
                          ]
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,
                  expression: false,
                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'f1'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  type: 'CallExpression',
                  callee: {
                    type: 'Identifier',
                    name: 'expect'
                  },
                  arguments: [
                    {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'f1'
                      },
                      arguments: [
                        {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'a'
                              },
                              value: {
                                type: 'Literal',
                                value: 1
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'toEqual'
                }
              },
              arguments: [
                {
                  type: 'ArrayExpression',
                  elements: [
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 1
                    },
                    {
                      type: 'Literal',
                      value: 1
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
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
                            name: 'a'
                          },
                          computed: false,
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
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
                        name: 'c'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'a'
                      }
                    }
                  ],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ReturnStatement',
                        argument: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'a'
                            },
                            {
                              type: 'Identifier',
                              name: 'b'
                            },
                            {
                              type: 'Identifier',
                              name: 'c'
                            }
                          ]
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,
                  expression: false,
                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'f2'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var foo = {}; foo.super;',
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'super'
              }
            }
          }
        ]
      }
    ],
    [
      'var foo = {}; foo.interface;',
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'interface'
              }
            }
          }
        ]
      }
    ],
    [
      'var foo = {}; foo.arguments;',
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
                  type: 'ObjectExpression',
                  properties: []
                },
                id: {
                  type: 'Identifier',
                  name: 'foo'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                type: 'Identifier',
                name: 'foo'
              },
              computed: false,
              property: {
                type: 'Identifier',
                name: 'arguments'
              }
            }
          }
        ]
      }
    ],
    [
      'var [,] = x;',
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
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var [,,] = x;',
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
                  elements: [null, null]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var\nfoo',
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'foo',
                  type: 'Identifier'
                },
                init: null,
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'var [foo,,] = x;',
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
                    null
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var [,foo] = x;',
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
                    null,
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var [,,foo] = x;',
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
                    null,
                    null,
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var [foo,bar] = x;',
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
                      type: 'Identifier',
                      name: 'bar'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var [foo] = x, [foo] = y;',
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
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'y'
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
      'var [foo] = x, b;',
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
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'b'
                },
                init: null
              }
            ],
            kind: 'var'
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var [foo] = x, b = y;',
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
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'Identifier',
                  name: 'b'
                },
                init: {
                  type: 'Identifier',
                  name: 'y'
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
      'var x, [foo] = y;',
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
                  name: 'x'
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'y'
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
      'var [foo=a] = c;',
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
                  name: 'c'
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
      'var [foo=a,bar=b] = x;',
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
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var {} = x;',
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
                  name: 'x'
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
      'var {foo} = x;',
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
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var {foo,} = x;',
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
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  name: 'x'
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
      'var x = 5; function x() {}',
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
                  type: 'Literal',
                  value: 5
                },
                id: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'FunctionDeclaration',
            params: [],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'x'
            }
          }
        ]
      }
    ],
    [
      'var x; x = 8;',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: 8
              }
            }
          }
        ]
      }
    ],
    [
      'var O = { async method() { await 1; } }',
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
                                type: 'AwaitExpression',
                                argument: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            }
                          ]
                        },
                        async: true,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'O'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var O = { async ["meth" + "od"]() { await 1; } }',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Literal',
                          value: 'meth'
                        },
                        right: {
                          type: 'Literal',
                          value: 'od'
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
                              type: 'ExpressionStatement',
                              expression: {
                                type: 'AwaitExpression',
                                argument: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            }
                          ]
                        },
                        async: true,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: true,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'O'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var [ a, , b ] = list',
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
                  name: 'list'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'b'
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
      'var O = { async "method"() { await 1; } }',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'method'
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
                                type: 'AwaitExpression',
                                argument: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            }
                          ]
                        },
                        async: true,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'O'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var O = { async 0() { await 1; } }',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 0
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
                                type: 'AwaitExpression',
                                argument: {
                                  type: 'Literal',
                                  value: 1
                                }
                              }
                            }
                          ]
                        },
                        async: true,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'O'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var let',
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
      'var [let] = []',
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
                  type: 'ArrayExpression',
                  elements: []
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
      'var x; { with ({}) { x = 1; } }',
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
                  name: 'x'
                }
              }
            ]
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'WithStatement',
                object: {
                  type: 'ObjectExpression',
                  properties: []
                },
                body: {
                  type: 'BlockStatement',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '=',
                        right: {
                          type: 'Literal',
                          value: 1
                        }
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
      'for (var {x : y} of obj);',
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
              kind: 'var',
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
            },
            await: false
          }
        ]
      }
    ],
    [
      "var o = { get [/./.exec('')](){} }",
      Context.None,
      {
        body: [
          {
            declarations: [
              {
                id: {
                  name: 'o',
                  type: 'Identifier'
                },
                init: {
                  properties: [
                    {
                      computed: true,
                      key: {
                        arguments: [
                          {
                            type: 'Literal',
                            value: ''
                          }
                        ],
                        callee: {
                          computed: false,
                          object: {
                            regex: {
                              flags: '',
                              pattern: '.'
                            },
                            type: 'Literal',
                            value: /./
                          },
                          property: {
                            name: 'exec',
                            type: 'Identifier'
                          },
                          type: 'MemberExpression'
                        },
                        type: 'CallExpression'
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false,
                      type: 'Property',
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
                  type: 'ObjectExpression'
                },
                type: 'VariableDeclarator'
              }
            ],
            kind: 'var',
            type: 'VariableDeclaration'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      `var [ a, , b ] = list;
      [ b, a ] = [ a, b ]`,
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
                  name: 'list'
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'b'
                    }
                  ]
                }
              }
            ]
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'b'
                  },
                  {
                    type: 'Identifier',
                    name: 'a'
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Identifier',
                    name: 'a'
                  },
                  {
                    type: 'Identifier',
                    name: 'b'
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      `var [ a, , b ] = list
  [ b, a ] = [ a, b ]`,
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
                  type: 'AssignmentExpression',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'list'
                    },
                    computed: true,
                    property: {
                      type: 'SequenceExpression',
                      expressions: [
                        {
                          type: 'Identifier',
                          name: 'b'
                        },
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ]
                    }
                  },
                  operator: '=',
                  right: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ]
                  }
                },
                id: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'a'
                    },
                    null,
                    {
                      type: 'Identifier',
                      name: 'b'
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
      'var x, {y} = obj;',
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
                  name: 'x'
                }
              },
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'Identifier',
                  name: 'obj'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
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
                        name: 'y'
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
      'var {x = y} = obj;',
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
                  name: 'obj'
                },
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
          }
        ]
      }
    ],
    [
      'var {x = y, z} = obj;',
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
                  name: 'obj'
                },
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
                        type: 'Identifier',
                        name: 'z'
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
      'var foo, bar;',
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
                  name: 'foo'
                }
              },
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'bar'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      'var foo, bar',
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
                  name: 'foo'
                }
              },
              {
                type: 'VariableDeclarator',
                init: null,
                id: {
                  type: 'Identifier',
                  name: 'bar'
                }
              }
            ]
          }
        ]
      }
    ]
  ]);
});
