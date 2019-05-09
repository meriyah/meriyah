import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Expressions - Object', () => {
  for (const arg of [
    '({x={}={}}),',
    '({y={x={}={}={}={}={}={}={}={}}={}}),',
    '({a=1, b=2, c=3, x=({}={})}),',
    '({x=1, y={z={1}}})',
    '({x=1} = {y=1});',
    '({x: y={z=1}}={})',
    '({x=1}),',
    '({z={x=1}})=>{};',
    '({x = ({y=1}) => y})',
    '(({x=1})) => x',
    '({e=[]}==(;',
    '({x=1}[-1]);',
    '({x=y}[-9])',
    '({x=y}.x.z[-9])',
    '({x=y}`${-9}`)',
    '(new {x=y}(-9))',
    'new {x=1}',
    'new {x=1}={}',
    'typeof {x=1}',
    'typeof ({x=1})',
    '({x=y, [-9]:0})',
    '((({w = x} >(-9)',
    '++({x=1})',
    '--{x=1}',
    '!{x=1}={}',
    'delete {x=1}',
    'delete ({x=1})',
    'delete {x=1} = {}',
    '({x=1}.abc)',
    'x > (0, {a = b} );',
    'var x = 0 + {a=1} = {}',
    'let o = {x=1};',
    'var j = {x=1};',
    'var j = {x={y=1}}={};',
    'const z = {x=1};',
    'const z = {x={y=1}}={};',
    'const {x=1};',
    'const {x={y=33}}={};',
    'var {x=1};',
    'let {x=1};',
    'let x, y, {z=1}={}, {w=2}, {e=3};',
    '[{x=1, y = ({z=2} = {})}];',
    "try {throw 'a';} catch ({x={y=1}}) {}",
    'if ({k: 1, x={y=2}={}}) {}',
    'if (false) {} else if (true) { ({x=1}) }',
    "switch ('c') { case 'c': ({x=1}); }",
    // 'for ({x=1}; 1;) {1}',
    '({ \\u0061sync* m(){}});',
    'for ({x={y=2}}; 1;) {1}',
    'for (var x = 0; x < 2; x++) { ({x=1, y=2}) }',
    'for (let x=1;{x=1};){}',
    'for (let x=1;{x={y=2}};){}',
    'for (let x=1;1;{x=1}){}',
    'for (let x=1;1;{x={y=2}}){}',
    'while ({x=1}) {1};',
    'while ({x={y=2}}={}) {1};',
    'with ({x=1}) {};',
    'with ({x={y=3}={}}) {};',
    'with (Math) { ({x=1}) };',
    'true ? {x=1} : 1;',
    'false ? 1 : {x=1};',
    '{x=1} ? 2 : 3;'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    '{ ...y }',
    '{ a: 1, ...y }',
    '{ b: 1, ...y }',
    '{ y, ...y}',
    '{ ...z = y}',
    '{ ...y, y }',
    '{ ...y, ...y}',
    '{ a: 1, ...y, b: 1}',
    '{ ...y, b: 1}',
    '{ ...1}',
    '{ ...null}',
    '{ ...undefined}',
    '{ ...1 in {}}',
    '{ ...[]}',
    '{ ...async function() { }}',
    '{ ...async () => { }}',
    '{ ...new Foo()}'
  ]) {
    it(`'use strict'; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`'use strict'; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; x = ${arg}`, undefined, Context.None);
      });
    });

    it(`'use strict'; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; x = ${arg}`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    'x = {__proto__: 1, "__proto__": 2}',
    'x = {\'__proto__\': 1, "__proto__": 2}',
    "x = {'__proto__': 1, __proto__: 2}",
    'x = {__proto__: 1, "__proto__": 2}'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    "__proto__: {}, ['__proto__']: {}",
    '__proto__: {}, __proto__() {}',
    '__proto__: {}, get __proto__() {}',
    '__proto__: {}, set __proto__(v) {}',
    '__proto__: {}, __proto__'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`({${arg}});`, undefined, Context.None);
      });
    });

    it(`"use strict"; (${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({${arg}});`, undefined, Context.None);
      });
    });

    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = {${arg}};`, undefined, Context.None);
      });
    });

    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = {${arg}};`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'async ()=>x',
    'class{}',
    'delete x.y',
    'false',
    'function(){}',
    'new x',
    'null',
    'true',
    'this',
    'typeof x',
    'void x',
    'x + y',
    '[].length',
    '[x].length',
    '{}.length',
    '{x: y}.length'
  ]) {
    it(`({${arg}} = x);`, () => {
      t.throws(() => {
        parseSource(`({${arg}} = x);`, undefined, Context.OptionsNext);
      });
    });

    it(`({${arg}} = x) => x;`, () => {
      t.throws(() => {
        parseSource(`({${arg}} = x) => x;`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });

    it(`({${arg}} = x) => x;`, () => {
      t.throws(() => {
        parseSource(`({x: ${arg}} = x) => x;`, undefined, Context.OptionsNext);
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`, undefined, Context.OptionsNext);
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`, undefined, Context.None);
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`, undefined, Context.OptionsWebCompat);
      });
    });
  }
  for (const arg of [
    'x: 1, x() {}',
    'x() {}, x: 1',
    'x() {}, get x() {}',
    'x() {}, set x(_) {}',
    'x() {}, x() {}',
    'x() {}, y() {}, x() {}',
    'x() {}, "x"() {}',
    "x() {}, 'x'() {}",
    '1.0() {}, 1: 1',
    'x: 1, *x() {}',
    '*x() {}, x: 1',
    '*x() {}, get x() {}',
    '*x() {}, set x(_) {}',
    '*x() {}, *x() {}',
    '*x() {}, y() {}, *x() {}',
    '*x() {}, *"x"() {}',
    "*x() {}, *'x'() {}",
    '*1.0() {}, 1: 1'
  ]) {
    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`, undefined, Context.OptionsNext);
      });
    });
  }

  for (const arg of ['eval', 'arguments']) {
    it(`({ ${arg} } = x);`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} } = x);`, undefined, Context.Strict);
      });
    });
    it(`({ ${arg} }) => x;`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) => x;`, undefined, Context.Strict);
      });
    });
    it(`({ ${arg} }) => x;`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) => x;`, undefined, Context.Strict | Context.OptionsWebCompat);
      });
    });
    it(`const { ${arg} } = x;`, () => {
      t.throws(() => {
        parseSource(`const { ${arg} } = x;`, undefined, Context.Strict);
      });
    });
  }

  for (const arg of [
    'x: 1, x() {}',
    'x() {}, x: 1',
    'x() {}, get x() {}',
    'x() {}, set x(_) {}',
    'x() {}, x() {}',
    'x() {}, y() {}, x() {}',
    'x() {}, "x"() {}',
    "x() {}, 'x'() {}",
    '1.0() {}, 1: 1',
    'x: 1, *x() {}',
    '*x() {}, x: 1',
    '*x() {}, get x() {}',
    '*x() {}, set x(_) {}',
    '*x() {}, *x() {}',
    '*x() {}, y() {}, *x() {}',
    '*x() {}, *"x"() {}',
    "*x() {}, *'x'() {}",
    '*1.0() {}, 1: 1'
  ]) {
    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`, undefined, Context.OptionsNext);
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`, undefined, Context.None);
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`, undefined, Context.OptionsWebCompat);
      });
    });
  }

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
    'false' // 'enum',
  ]) {
    it(`({foo: ${arg}}) => null`, () => {
      t.throws(() => {
        parseSource(`({foo: ${arg}}) => null`, undefined, Context.OptionsNext);
      });
    });
    it(`({foo: ${arg}} = null)`, () => {
      t.throws(() => {
        parseSource(`({foo: ${arg}} = null)`, undefined, Context.None);
      });
    });

    it(`({foo: ${arg}} = null)`, () => {
      t.throws(() => {
        parseSource(`({foo: ${arg}} = null)`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of [
    'm',
    "'m'",
    '"m"',
    '"m n"',
    'true',
    'false',
    'null',
    '1.2',
    '1e1',
    '1E1',
    '.12e3',

    // Keywords
    'async',
    'await',
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
    'enum',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
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
    'yield'
  ]) {
    it(`({ ${arg}(x, y) {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}(x, y) {}});`, undefined, Context.None);
      });
    });
    it(`({ ${arg}(x, y) {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}(x, y) {}});`, undefined, Context.OptionsNext);
      });
    });
    it(`({ ${arg}(x, y) {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}(x, y) {}});`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  for (const arg of ['var', 'let', 'const']) {
    it(`${arg} {async async: a} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async: a} = {}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`, undefined, Context.None);
      });
    });
    it(`${arg} {async async, } = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async, } = {}`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg} {async async = 0} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async = 0} = {}`, undefined, Context.OptionsWebCompat);
      });
    });
  }

  // Object assignment
  for (const arg of [
    '{ x: x[yield] }',
    '{ x: [ x ] }',
    '{ x: [x = yield] } ',
    '{ x: { x = yield } }',
    '{ x: { y } }',
    '{...rest}',
    '{...x} ',
    '{...rest["0"]}',
    '{...src.y}',
    '{...src.y.x}',
    '{...rest}',
    '{ a: c }',
    '{ a: c }',
    '{ a: { a: { a: c } } }',
    '{ x: { x } }',
    '{ ["x" + "y"]: x }',
    '{ a: x, }',
    ' { x: [ x ] } = { x: undefined }',
    '{ w, a: x, y }',
    '{ w, a: x }',
    '{ x: prop = "x" in {} }',
    ' { x: y = function* x() {}, x: gen = function*() {} }',
    '{ x: y = function x() {}, x: fn = function() {} }',
    '{ x: y = class x {}, x: cls = class {}, x: e = class { static name() {} } }',
    '{ x: arrow = () => {} }',
    '{ y: x = 1 }',
    '{ c }',
    '{ y = function x() {}, fn = function() {} } ',
    '{ x = 1 }',
    '{ w, x, y }',
    '{}',
    '{ w, x, y }',
    '{ w, x = b, y }',
    '{ w, x, y = c }',
    '{ w, x, y = a ? x : b }'
  ]) {
    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, undefined, Context.OptionsNext);
      });
    });

    it(`a = ${arg} = { a: 2 };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { a: 2 };`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = 51`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = 51`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = false`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = false`, undefined, Context.None);
      });
    });
    it(`a = ${arg} = null `, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = null`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = undefined `, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = undefined`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = { x: { y: 2 } };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: { y: 2 } };`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = { x: null }`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: null }`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = { x: null }`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: null }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`a = ${arg} = {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = {};`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = { x: [] };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: [] };`, undefined, Context.None);
      });
    });

    it(`a = ${arg} = { 1: [] = [(a = b)] };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { 1: [] = [(a = b)] };`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    '*method(a,) {}',
    '*[anonSym]() {}',
    '*id() {}',
    'async method(a,) {}',
    'async method(x, y = x, z = y) {}',
    'async() {}',
    '*async() {}',
    '*await() {}',
    'async get(){}',
    'async set(){}',
    'async static(){}',
    'method(a, b, c) {}',
    'method(a,) {}',
    'method(a, b,) {}',
    'method(x = y, y) {}',
    'async *method(...a) {}',
    'foo: 1, foo: 2',
    '"foo": 1, "foo": 2',
    'foo: 1, "foo": 2',
    '1: 1, 1: 2',
    '1: 1, "1": 2',
    'foo: 1, get foo() {}',
    'foo: 1, set foo(v) {}',
    '"foo": 1, get "foo"() {}',
    '"foo": 1, set "foo"(v) {}',
    '1: 1, get 1() {}',
    '1: 1, set 1(v) {}',
    'get foo() {}, get foo() {}',
    'set foo(_) {}, set foo(v) {}',
    'foo: 1, get "foo"() {}',
    'foo: 1, set "foo"(v) {}',
    '"foo": 1, get foo() {}',
    '"foo": 1, set foo(v) {}',
    '1: 1, get "1"() {}',
    '1: 1, set "1"(v) {}',
    '"a":a',
    '1:a',
    '"1":a',
    '"a":a,b',
    `a:a,b,c`,
    '1:a,b',
    '"1":a,b',
    'a,"b":b',
    'a,1:b',
    'a,"1":b',
    'a,b',
    'a:a,b',
    'a,b:b',
    'a:a,b,c',
    'a,b:b,c',
    'a,b,c:c',
    'a:a,b:b,c',
    'a:a,b,c:c',
    'a,b:b,c:c',
    '"1": 1, get 1() {}',
    '"1": 1, set 1(v) {}',
    'foo: 1, bar: 2',
    '"foo": 1, "bar": 2',
    '1: 1, 2: 2',
    'foo: bar = 5 + baz',
    'get foo() {}',
    'get "foo"() {}',
    'get 1() {}',
    'set foo(v) {}',
    'set "foo"(v) {}',
    'set 1(v) {}',
    'if: 4',
    'interface: 5',
    'super: 6',
    'eval: 7',
    'arguments: 8',
    'async x(){}',
    'async 0(){}',
    'async get(){}',
    'async set(){}',
    'async static(){}',
    'async async(){}',
    'async : 0',
    'async(){}',
    '*async(){}',
    'get: 1, get: 2',
    'set: 1, set: 2',
    'async',
    'await',
    'async *method(a, b,) {}',
    'async *method(x, y = x, z = y) {}',
    'async *method(x = y, y) {}',
    'prop: 12',
    'get foo(){return 1;}',
    'get foo(){return 1;}',
    'set foo(arg){return 1;}',
    'set foo(arg){}',
    '1 : true',
    'prop : true',
    'true : 1',
    "get ['unicod\\u{000065}Escape']() { return 'get string'; }",
    '[++counter]: ++counter, [++counter]: ++counter, [++counter]: ++counter, [++counter]: ++counter',
    'async: foo',
    'await: foo',
    '*method([[x, y, z] = [4, 5, 6]]) {}',
    'async *method([[,] = g()]) {}',
    'async *method([x = 23]) {}',
    'async *method([x]) {}',
    'async *method([_, x]) {}',
    'async *method([...[x, y, z]]) {}',
    'async *method([...x]) {}',
    'async *method([[x, y, z] = [4, 5, 6]] = [[7, 8, 9]]) {}',
    'async *method([[...x] = function() {}()] = [[2, 1, 3]]) {}',
    'async *method([[x]] = [null]) {}',
    'async *method([x = 23] = [undefined]) {}',
    'async *method([x] = g[Symbol.iterator] = function() {}) {}',
    'async *method([...x] = {}) {}',
    'async *method({ w: [x, y, z] = [4, 5, 6] } = {}) {}',
    'async *method({ [function foo() {}]: x } = {}) {}',
    'async *method({ x: y = thrower() } = {}) {}',
    'foo: 1, get foo() {}',
    'foo: 1, set foo(v) {}',
    '"foo": 1, get "foo"() {}',
    '"foo": 1, set "foo"(v) {}',
    '1: 1, get 1() {}',
    '1: 1, set 1(v) {}',
    'get foo() {}, get foo() {}',
    'set foo(_) {}, set foo(v) {}',
    'foo: 1, get "foo"() {}',
    'foo: 1, set "foo"(v) {}',
    'get width() { return m_width }, set width(width) { m_width = width; }',
    'method({ arrow = () => {} }) {}',
    'method({ x: y, }) {}',
    'id: function*() {}',
    'null: 42',
    '"answer": 42',
    'get if() {}',
    '__proto__: 2 ',
    'set i(x) {}, i: 42 ',
    '[a]:()=>{}',
    'async',
    'async: true',
    'async() { }',
    'async foo() { }',
    'foo() { }',
    'x, y, z () {}',
    '[x]: "x"',
    'async delete() {}',
    'async [foo](){}',
    'async 100(){}',
    "async 'foo'(){}",
    'async "foo"(){}',
    'async, foo',
    '.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}',
    '"foo"(){}',
    'async foo(){}',
    ' yield: 1 ',
    ' get yield() { } ',
    ' await: 1 ',
    ' get await() { } ',
    '1: 1, get "1"() {}',
    '1: 1, set "1"(v) {}',
    '"1": 1, get 1() {}',
    '"1": 1, set 1(v) {}',
    'foo: 1, bar: 2',
    '"foo": 1, "bar": 2',
    '1: 1, 2: 2',
    'get foo() {}',
    'get "foo"() {}',
    'get 1() {}',
    'set foo(v) {}',
    'set "foo"(v) {}',
    'set 1(v) {}',
    'foo: 1, get bar() {}',
    'foo: 1, set bar(v) {}',
    '"foo": 1, get "bar"() {}',
    '"foo": 1, set "bar"(v) {}',
    '1: 1, get 2() {}',
    '1: 1, set 2(v) {}',
    'get: 1, get foo() {}',
    'set: 1, set foo(_) {}',
    'get(){}',
    'set(){}',
    'static(){}',
    'async(){}',
    '*get() {}',
    '*set() {}',
    '*static() {}',
    '*async(){}',
    'get : 0',
    'set : 0',
    'static : 0',
    'async : 0',
    'set get(a){}',
    'set foo(b){}, set bar(d){}',
    'set foo(c){}, bar(){}',
    'foo: typeof x',
    'foo: true / false',
    ' ...y ',
    ' a: 1, ...y ',
    ' b: 1, ...y ',
    ' y, ...y',
    ' ...z = y',
    ' ...y, y ',
    ' ...y, ...y',
    ' a: 1, ...y, b: 1',
    ' ...y, b: 1',
    ' ...1',
    ' ...null',
    ' ...undefined',
    ' ...1 in {}',
    ' ...[]',
    ' ...async function() { }',
    ' ...async () => { }',
    '...obj',
    '...obj',
    '"foo": {a: b}',
    '"foo": [a]',
    '"foo": ({a: b})',
    '"foo": [a]',
    '"foo": 123',
    '"foo": [a]',
    '"foo": {x} = "bar"',
    '"foo": [x] = "bar"',
    '"foo": (x) = "bar"',
    'key: bar = x',
    'key: bar + x',
    'key: bar.foo = x',
    'key: bar.foo + x',
    'key: await /foo/g',
    'key: bar/x',
    'key: bar, foo: zoo',
    'key: bar/x',
    'key: bar/x',
    'key: bar/x',
    'key: bar/x',
    'key: bar/x'
  ]) {
    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, undefined, Context.OptionsNext);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}, })`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}, })`, undefined, Context.None);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}, })`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });

    it(`x = { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = { ${arg}, }`, undefined, Context.OptionsWebCompat);
      });
    });

    // should throw
    it(`({ ${arg} }) = {}`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) = {}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({ ${arg}, })`, undefined, Context.OptionsNext);
      });
    });
  }

  fail('Expressions - Object (fail)', [
    ['"use strict"; ({ [...a] = [] })', Context.None],
    ['({ [...a] = [] })', Context.None],
    ['"use strict"; ({ [...a]  })-', Context.None],
    ['({x:y} += x)', Context.None],
    ['x = [{__proto__: 1, __proto__: 2}]', Context.OptionsWebCompat],
    ['({...{x} }= {});', Context.None],
    ['({x:y} += x)', Context.None],
    ['(({x:y}) += x)', Context.None],
    ['({foo: {x:y} += x})', Context.None],
    ['[(a = 0)] = 1', Context.None],
    ['(...a)', Context.None],
    ['({x:y} += x)', Context.None],
    ['({implements}) => null', Context.Strict],
    ['({interface}) => null', Context.Strict],
    ['({await}) => null', Context.Strict | Context.Module],
    ['({yield}) => null', Context.Strict],
    ['({"a": b}) = a;', Context.None],
    ['a = {1} = b', Context.None],
    ['a = {"a"} = b', Context.None],
    ['({x}) = foo', Context.None],
    ['({break})', Context.None],
    ['a = { x: [(x, y)] } = { x: [] };', Context.None],
    ['a = { x: [(x, y)] } = {};', Context.None],
    ['a = { x: [(x, y)] } = { 1: [] = [(a = b)] };', Context.None],
    ['a = { x: [(x, y)] } = undefined', Context.None],
    ['a = { x: [(x, y)] } = null', Context.None],
    ['a = { x: [(x, y)] } = 51', Context.None],
    ['a = { x: [(x, y)] } = false', Context.None],
    ['a = { x: [(x, y)] } = b', Context.None],
    ['a = { x: [(x, y)] } = { x: null }', Context.None],
    ['({break = bones})', Context.None],
    ['({foo += bar})', Context.None],
    ['({* async x(){}})', Context.None],
    ['({* get x(){}})', Context.None],
    ['({* set x(){}})', Context.None],
    ['({*async x(){}})', Context.None],
    ['({*get x(){}})', Context.None],
    ['({*set x(){}})', Context.None],
    ['({*foo: x(){}})', Context.None],
    ['({*: x(){}})', Context.None],
    ['({set a() {}})', Context.None],
    ['({get a(a) {}})', Context.None],
    ['({x: [..] = y})', Context.None],
    ['({x: {..} = y})', Context.None],
    ['({x: [..]})', Context.None],
    ['({x: {..}})', Context.None],
    ['({[foo]-(a) {}})', Context.None],
    ['({a: b => []} = [2])', Context.None],
    ['({b => []} = [2])', Context.None],
    ['({a: b + c} = [2])', Context.None],
    ['({[a]: b => []} = [2])', Context.None],
    ['s = {"foo": await = x} = x', Context.Module],
    ['({a: [foo]-(a) {}})', Context.None],
    ['({set a(...foo) {}})', Context.None],
    ['({*ident: x})', Context.None],
    ['({...})', Context.None],
    ['let {...obj1,} = foo', Context.None],
    ['let {...obj1,a} = foo', Context.None],
    ['let {...obj1,...obj2} = foo', Context.None],
    ['let {...(obj)} = foo', Context.None],
    ['let {...(a,b)} = foo', Context.None],
    ['let {...{a,b}} = foo', Context.None],
    ['let {...[a,b]} = foo', Context.None],
    ['({...obj1,} = foo)', Context.None],
    ['({...obj1,a} = foo)', Context.None],
    ['({...a,} = {});', Context.None],
    ['({...a,} = {});', Context.None],
    ['({...obj1,...obj2} = foo)', Context.None],
    [
      `({
      async
      foo() {}
  })`,
      Context.None
    ],
    ['({...{a,b}} = foo)', Context.None],
    ['({...[a,b]} = foo)', Context.None],
    ['({...[a, b]} = x)', Context.None],
    ['({...{a, b}} = x)', Context.None],
    ['( {...{}} = {} )', Context.None],
    ['({...(obj)}) => {}', Context.None],
    ['({...{}} = {})', Context.None],
    ['({...(a,b)}) => {}', Context.None],
    ['({...{a,b}}) => {}', Context.None],
    ['({...[a,b]}) => {}', Context.None],
    ['({ x } = {x: ...[1,2,3]})', Context.None],
    ['"foo": (x) = (1) = "bar"', Context.None],
    ['({*ident x(){}})', Context.None],
    ['({*ident: x})', Context.None],
    ['s = {"foo": yield /fail/g = x} = x', Context.None],
    ['function *g() {   s = {"foo": yield /brains/ = x} = x   }', Context.None],
    ['s = {"foo": await /fail/g = x} = x', Context.None],
    ['async function g() {   s = {"foo": await /brains/ = x} = x   }', Context.None],
    ['x = { async f: function() {} }', Context.None],
    ['x = { async f: function() {} }', Context.None],
    ['0, {...rest, b} = {}', Context.None],
    ['({...obj1,a} = foo)', Context.None],
    ['({...obj1,...obj2} = foo)', Context.None],
    ['({...x = 1} = {})', Context.None],
    ['({...(obj)}) => {}', Context.None],
    ['({...(a,b)}) => {}', Context.None],
    ['x = {\'__proto__\': 1, "__proto__": 2}', Context.OptionsWebCompat],
    ['x = {__proto__: 1, "__proto__": 2}', Context.OptionsWebCompat],
    ["x = {'__proto__': 1, __proto__: 2}", Context.OptionsWebCompat],
    ['({ get *x(){} })', Context.None],
    ['({get +:3})', Context.None],
    ['({get bar(x) {})', Context.None],
    ['({  async 0 : 0 })', Context.None],
    ['({  async get x(){} })', Context.None],
    ['({ async get *x(){} })', Context.None],
    ['({ async set x(y){} })', Context.None],
    ['({ async get : 0 })', Context.None],
    ['({ *set x(y){} })', Context.None],
    ['({get +:3})', Context.Strict],
    ['({async get : 0})', Context.Strict],
    ['let o = {true, false, super, this, null};', Context.None],
    ['({*get x(){}})', Context.Strict],
    ['({static x: 0})', Context.Strict],
    ['({static async x(){}})', Context.Strict],
    ['({*x: 0})', Context.None],
    ['({*get x(){}})', Context.None],
    ['*async x(){}', Context.None],
    ['async x*(){}', Context.None],
    ['({*get x(){}})', Context.None],
    ['({*set x(){}})', Context.None],
    ['({*ident: x})', Context.None],
    ['({*ident x(){}})', Context.None],
    ['({*async x(){}})', Context.None],
    ['({[fgrumpy] 1(){}})', Context.None],
    ['async 0 : 0"', Context.None],
    ['function f({...[a, b]}){}', Context.None],
    ['async get x(){}', Context.None],
    ['({ *x: 0 })', Context.None],
    ['({ , })', Context.None],
    ['({ * *x(){} })', Context.None],
    ['({ x*(){} })', Context.None],
    ['({ "async foo (arguments) { "use strict"; } })', Context.None],
    ['({ a: () {}a })', Context.None],
    ['({ a: ()a })', Context.None],
    ['({)', Context.None],
    ['({async async});', Context.None],
    ['({async get foo() { }})', Context.None],
    ['({async set foo(value) { }})', Context.None],
    ['({async set foo(value) { }})', Context.None],
    ['({async foo: 1});', Context.None],
    ['x = { async f: function() {} }', Context.None],
    ['call({[x]})', Context.None],
    ['({async get foo(){}});', Context.None],
    ['({get set foo(){}});', Context.None],
    ['({async set foo(){}});', Context.None],
    ['({x:y;a:b})', Context.None],
    ['({x:y;})', Context.None],
    ['({;x:y,a:b})', Context.None],
    ['({;}', Context.None],
    ['wrap({a=b});', Context.None],
    ['s = {"foo": false = x} = x', Context.None],
    ['s = {"foo": null = x} = x', Context.None],
    ['s = {"foo": this = x} = x', Context.None],
    ['s = {"foo": super = x} = x', Context.None],
    ['s = {"foo": yield = x} = x', Context.Strict],
    ['s = {"foo": yield a = x} = x', Context.None],
    ['s = {"foo": yield /fail/g = x} = x', Context.None],
    ['function *g() {   s = {"foo": yield = x} = x   }', Context.None],
    ['function *g() {   s = {"foo": yield a = x} = x   }', Context.None],
    ['s = {"foo": await a = x} = x', Context.None],
    ['s = {"foo": await /fail/g = x} = x', Context.None],
    ['async function g() {   s = {"foo": await = x} = x   }', Context.None],
    ['async function g() {   s = {"foo": await a = x} = x   }', Context.None],
    ['async function g() {   s = {"foo": await /brains/ = x} = x   }', Context.None],
    ['s = {"foo": true = x}', Context.None],
    ['s = {"foo": yield / x}', Context.Strict],
    ['s = {"foo": yield}', Context.Strict],
    ['s = {"foo": yield /x/}', Context.Strict],
    ['s = {"foo": yield /x/g}', Context.Strict],
    ['s = {"foo": yield / x}', Context.Strict],
    ['function *f(){   s = {"foo": yield / x}   }', Context.None],
    ['s = {"foo": this = x} = x', Context.None],
    ['({"x": y+z} = x)', Context.None],
    ['({"x": y+z}) => x', Context.None],
    ['({"x": [y + x]} = x)', Context.None],
    ['({"x": [y + x]}) => x', Context.None],
    ['({"x": [y].slice(0)}) => x', Context.None],
    ['({"x": [y].slice(0)} = x)', Context.None],
    ['({"x": {a: y + x}} = x)', Context.None],
    ['({"x": {a: y + x}}) => x', Context.None],
    ['({"x": {a: y + x}.slice(0)} = x)', Context.None],
    ['({"x": {a: y + x}.slice(0)}) => x', Context.None],
    ['({"foo": [x].foo()}=y);', Context.None],
    ['({"x": [y + x]} = x)', Context.None],
    ['({"x": [y + x]}) => x', Context.None],
    ['({ ... })', Context.None],
    ['async get *x(){}', Context.None],
    ['async set x(y){}', Context.None],
    ['({a({e: a.b}){}})', Context.None],
    ['({set a({e: a.b}){}})', Context.None],
    ['({a([a.b]){}})', Context.None],
    ['({async 8(){});', Context.None],
    ['({get 8(){});', Context.None],
    ['({set 8(){});', Context.None],
    ['({set [x](y){});', Context.None],
    ['({get [x](y){});', Context.None],
    ['({get "x"(){})', Context.None],
    ['({set "x"(y){});', Context.None],
    ['({{eval}) => x);', Context.None],
    ['({eval}) => x);', Context.None],
    ['({eval} = x);', Context.Strict],
    ['({ident: [foo, bar].join("")} = x)', Context.None],
    ['({ident: [foo, bar].join("") = x} = x)', Context.None],
    ['({set a([a.b]){}})', Context.None],
    ['({*a([a.b]){}})', Context.None],
    ['({a}) = 0', Context.None],
    ['([a]) = 0', Context.None],
    ['({Object = 0, String = 0}) = {};', Context.None],
    ['({a, b}) = {a: 1, b:2}', Context.None],
    ['({a, b}) = {a: 1, b:2}', Context.None],
    ['"use\\040strict";', Context.Strict],
    ['var x = 012;', Context.Strict],
    ['({b}) = b;', Context.None],
    ['([b]) = b;', Context.None],
    ['({ __proto__: null, other: null, "__proto__": null });', Context.OptionsWebCompat],
    ['foo({ __proto__: null, other: null, "__proto__": null });', Context.OptionsWebCompat],
    ['({ __proto__: null, other: null, "__proto__": null }) => foo;', Context.OptionsWebCompat],
    ['async ({ __proto__: null, other: null, "__proto__": null }) => foo;', Context.OptionsWebCompat],
    ['({ __proto__: null, other: null, "__proto__": null });', Context.OptionsWebCompat | Context.Strict],
    ['[{ __proto__: null, other: null, "__proto__": null }];', Context.OptionsWebCompat],
    ['x = { __proto__: null, other: null, "__proto__": null };', Context.OptionsWebCompat],
    ['[...a, ] = b', Context.None],
    ['obj = {x = 0}', Context.None],
    ['({ obj:20 }) = 42', Context.None],
    ['( { get x() {} } = 0)', Context.None],
    ['({x, y}) = {}', Context.None],
    ['(1 + 1) = 10', Context.None],
    ['(a = b) = {};', Context.None],
    ['([a]) = []', Context.None],
    ['(a, (b)) => 42', Context.None],
    ['([a.b]) => 0', Context.None],
    ['(function* ({e: a.b}) {})', Context.None],
    ['[{a=0},{b=0},0] = 0', Context.None],
    ['[, x, ...y,] = 0', Context.None],
    ['...(x => y) = {};', Context.None],
    ['f = ( a++ ) => {};', Context.None],
    ['f = (this ) => {};', Context.None],
    ['f = ( {+2 : x} ) => {};', Context.None],
    ['f = ([...z = 1] ) => {};', Context.None],
    ['f = ( [a,,..rest,...rest1] ) => {};', Context.None],
    ['f = ( { ,, ...x } ) => {};', Context.None],
    ['f = ( { ...*method() {} } ) => {};', Context.None],
    ['function f({ ...x, ...y } ) {}', Context.None],
    ['function f( {[1+1]} ) {}', Context.None],
    ['wrap({get "abc": x});', Context.None],
    ['wrap({get 123: x});', Context.None],
    ['({"x": 600} = x)', Context.None],
    ['({"x": 600}) => x', Context.None],
    ['({"x": 600..xyz}) => x', Context.None],
    ['x, {x: foo + y, bar} = doo', Context.None],
    ['x={...x=y}=z', Context.None],
    ['x={...true} = x', Context.None],
    ['x={...true} => x', Context.None],
    ['({...a+b} = x)', Context.None],
    ['({...a=b} = x)', Context.None],
    ['({...a, ...b} = x)', Context.None],
    ['({...a=b}) => x', Context.None],
    ['({...a+b}) => x', Context.None],
    ['({...a, ...b}) => x', Context.None],
    ['({3200: foo() = x}) => x', Context.None],
    ['({[foo]() {}} = y)', Context.None],
    ['({[foo]: x()} = x) => y', Context.None],
    ['({a: b()} = x) => y', Context.None],
    ['({3200: fail() = x}) => x', Context.None],
    ['({3200: fail() = x} = x)', Context.None],
    ['({foo: fail() = x}) => x', Context.None],
    ['({foo: fail() = x} = x)', Context.None],
    ['({foo: fail() = a} = b) => c', Context.None],
    ['s = {foo: yield}', Context.Strict],
    ['s = {foo: yield / x}', Context.Strict],
    ['s = {foo: yield /x/}', Context.None],
    ['s = {foo: yield /x/g}', Context.Strict],
    ['s = {"foo": yield}', Context.Strict],
    ['s = {"foo": yield / x}', Context.Strict],
    ['function *f(){   s = {"foo": yield / x}   }', Context.None],
    ['({foo: fail() = x}) => x', Context.None],
    ['({foo: fail() = x} = x)', Context.None],
    ['({foo: fail() = a} = b) => c', Context.None],
    ['({3200: foo() = a} = b) => c', Context.None],
    ['({foo: foo() = x}) => x', Context.None],
    ['({foo: foo() = x} = x)', Context.None],
    ['({foo: foo() = a} = b) => c', Context.None],
    ['x={..."foo"=x} = x', Context.None],
    ['x={..."foo".foo=x} = x', Context.None],
    ['({..."foo"=x}) => x', Context.None],
    ['({..."foo".foo=x}) => x', Context.None],
    ['({foo += bar})', Context.None],
    ['({0} = 0)', Context.None],
    ['({a.b} = 0)', Context.None],
    ['({get a(){}})=0', Context.None],
    ['({a:this}=0)', Context.None],
    ['({a = 0});', Context.None],
    ['({a} += 0);', Context.None],
    ['({ async}) = 0', Context.None],
    ['({a([a.b]){}})', Context.None],
    ['({a({e: a.b}){}})', Context.None],
    ['({set a({e: a.b}){}})', Context.None],
    ['f = (argument1, {...[ x = 5 ] }) => {};', Context.None],
    ['f = ( {...x[0] } ) => {};', Context.None],
    ['({...{x} }) => {}', Context.None],
    ['({...(x) }) => {}', Context.None],
    ['({...[x] }) => {}', Context.None],
    ['({set a([a.b]){}})', Context.None],
    ['({a}) = 0', Context.None],
    ['(x=1)=y', Context.None],
    ['([a]) = 0', Context.None],
    ['(x=1)=2', Context.None],
    ['(a = b) = {};', Context.None],
    ['([a]) = []', Context.None],
    ['({a}) = {}', Context.None],
    ['({a}) = 0;', Context.None],
    ['([x]) = 0', Context.None],
    ['([a.b]) => 0', Context.None],
    ['({+2 : x}) = {};', Context.None],
    ['[...rest,] = {};', Context.None],
    ['({...a, ...b, ...c} = {...a, ...b, ...c})', Context.None],
    ['({ a, b }) = {a: 1, b: 2}', Context.None],
    ['{[1+1] : z} = {};', Context.None],
    ['({x: { y = 10 } })', Context.None],
    ['({x = 42, y = 15})', Context.None],
    ['(({ x = 10 } = { x = 20 }) => x)({})', Context.None],
    ['{ x = 10 } = (o = { x = 20 });', Context.None],
    ['({ q } = { x = 10 });', Context.None],
    ['[{ x = 10 }]', Context.None],
    ['(true ? { x = true } : { x = false })', Context.None],
    ['({get *ident(){}})', Context.None],
    ['({set *ident(ident){}}) ', Context.None],
    ['({get *5(){}})', Context.None],
    ['({set *5(ident){}})', Context.None],
    ['({get *"x"(){}})', Context.None],
    ['({get *[x](){}})', Context.None],
    ['async (foo = ({static *[await oops](){}})) => {}', Context.None],
    ['({x+=y})', Context.None],
    ['({get *10(){}})', Context.None],
    ['({get *[expr](){}})', Context.None],
    ['({*[expr](){}} = x);', Context.None],
    ['({set 8(y){})', Context.None],
    ['({get 8(){})', Context.None],
    ['({get [x](){})', Context.None],
    ['({set "x"(y){})', Context.None],
    ['({async 8(){})', Context.None],
    ['({set 8(y){})', Context.None],
    ['({"foo": {1 = 2}});', Context.None],
    ['({"foo": {x} = [1] = "bar"});', Context.None],
    ['({"foo": [x] = [1] = "bar"});', Context.None],
    ['({"foo": (x) = [1] = "bar"});', Context.None],
    ['({"foo": 1 = 2});', Context.None],
    ['({"foo": [1 = 2]});', Context.None],
    ['({"foo": [1 = 2] = foo});', Context.None],
    ['({"foo": [1 = 2]} = foo);', Context.None],
    ['function *f(){   s = {foo: yield / x}   }', Context.None],
    ['({get x() {}}) => {}', Context.None],
    ['let {...{x, y}} = {}', Context.None],
    ['let {...{...{x, y}}} = {}', Context.None],
    ['0, {...rest, b} = {}', Context.None],
    ['(([a, ...b = 0]) => {})', Context.None],
    ['(({a, ...b = 0}) => {})', Context.None],
    ['({...x,}) => z', Context.None],
    ['let {...x, ...y} = {}', Context.None],
    ['({...rest, b} = {})', Context.None],
    ['({g\\u0065t m() {} });', Context.None]
  ]);

  pass('Expressions - Object (pass)', [
    [
      '({a: b = c} = [2])',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 2
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({a: (b) = c} = [2])',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 2
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({a: (b).c} = [2])',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'c'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 2
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({a: (b).c = d} = [2])',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      },
                      right: {
                        type: 'Identifier',
                        name: 'd'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'Literal',
                    value: 2
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({ __proto__: null, other: null, "__proto__": null });',
      Context.None,
      {
        body: [
          {
            expression: {
              properties: [
                {
                  computed: false,
                  key: {
                    name: '__proto__',
                    type: 'Identifier'
                  },
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    type: 'Literal',
                    value: null
                  }
                },
                {
                  computed: false,
                  key: {
                    name: 'other',
                    type: 'Identifier'
                  },
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    type: 'Literal',
                    value: null
                  }
                },
                {
                  computed: false,
                  key: {
                    type: 'Literal',
                    value: '__proto__'
                  },
                  kind: 'init',
                  method: false,
                  shorthand: false,
                  type: 'Property',
                  value: {
                    type: 'Literal',
                    value: null
                  }
                }
              ],
              type: 'ObjectExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      '({...x = y, y})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...a,});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '[...a] = []',
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
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: []
              }
            }
          }
        ]
      }
    ],
    [
      '({[sourceKey()]: target()[targetKey()]} = source());',
      Context.None,
      {
        body: [
          {
            expression: {
              left: {
                properties: [
                  {
                    computed: true,
                    key: {
                      arguments: [],
                      callee: {
                        name: 'sourceKey',
                        type: 'Identifier'
                      },
                      type: 'CallExpression'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false,
                    type: 'Property',
                    value: {
                      computed: true,
                      object: {
                        arguments: [],
                        callee: {
                          name: 'target',
                          type: 'Identifier'
                        },
                        type: 'CallExpression'
                      },
                      property: {
                        arguments: [],
                        callee: {
                          name: 'targetKey',
                          type: 'Identifier'
                        },
                        type: 'CallExpression'
                      },
                      type: 'MemberExpression'
                    }
                  }
                ],
                type: 'ObjectPattern'
              },
              operator: '=',
              right: {
                arguments: [],
                callee: {
                  name: 'source',
                  type: 'Identifier'
                },
                type: 'CallExpression'
              },
              type: 'AssignmentExpression'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    ],
    [
      'f(a, ...1 + 1, b)',
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
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: 1
                    },
                    right: {
                      type: 'Literal',
                      value: 1
                    },
                    operator: '+'
                  }
                },
                {
                  type: 'Identifier',
                  name: 'b'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {"foo": yield}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {"foo": yield /x/}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Literal',
                              value: /x/,
                              regex: {
                                pattern: 'x',
                                flags: ''
                              }
                            },
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {foo: yield /x/}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Literal',
                              value: /x/,
                              regex: {
                                pattern: 'x',
                                flags: ''
                              }
                            },
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      's = {"foo": await = x} = x',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'await'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x'
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'function f([...[a, b]]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
                elements: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'ArrayPattern',
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
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function f({...a}){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '(z = {...x.y} = z) => z',
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
                type: 'Identifier',
                name: 'z'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  right: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'RestElement',
                          argument: {
                            type: 'MemberExpression',
                            object: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'y'
                            }
                          }
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'z'
                    }
                  }
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({foo: typeof /x/});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    argument: {
                      type: 'Literal',
                      value: /x/,
                      regex: {
                        pattern: 'x',
                        flags: ''
                      }
                    },
                    prefix: true
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {foo: yield /x/g}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Literal',
                              value: /x/g,
                              regex: {
                                pattern: 'x',
                                flags: 'g'
                              }
                            },
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '({...obj}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'obj'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {"foo": yield /x/g}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: {
                              type: 'Literal',
                              value: /x/g,
                              regex: {
                                pattern: 'x',
                                flags: 'g'
                              }
                            },
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            generator: true,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      `var callCount = 0;

  var C = class { static async *gen() {
      callCount += 1;
      yield {
          ...yield,
          y: 1,
          ...yield yield,
        };
  }}`,
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
                  value: 0
                },
                id: {
                  type: 'Identifier',
                  name: 'callCount'
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
                  type: 'ClassExpression',
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    body: [
                      {
                        type: 'MethodDefinition',
                        kind: 'method',
                        static: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          name: 'gen'
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
                                  type: 'AssignmentExpression',
                                  left: {
                                    type: 'Identifier',
                                    name: 'callCount'
                                  },
                                  operator: '+=',
                                  right: {
                                    type: 'Literal',
                                    value: 1
                                  }
                                }
                              },
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  type: 'YieldExpression',
                                  argument: {
                                    type: 'ObjectExpression',
                                    properties: [
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: null,
                                          delegate: false
                                        }
                                      },
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'y'
                                        },
                                        value: {
                                          type: 'Literal',
                                          value: 1
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: false
                                      },
                                      {
                                        type: 'SpreadElement',
                                        argument: {
                                          type: 'YieldExpression',
                                          argument: {
                                            type: 'YieldExpression',
                                            argument: null,
                                            delegate: false
                                          },
                                          delegate: false
                                        }
                                      }
                                    ]
                                  },
                                  delegate: false
                                }
                              }
                            ]
                          },
                          async: true,
                          generator: true,
                          id: null
                        }
                      }
                    ]
                  }
                },
                id: {
                  type: 'Identifier',
                  name: 'C'
                }
              }
            ]
          }
        ]
      }
    ],

    [
      's = {foo: yield}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'yield'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      's = {foo: yield / x}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'yield'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      operator: '/'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({...obj} = foo)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'obj'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'let { x4: { ...y4 } } = z;',
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
                  name: 'z'
                },
                id: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'Identifier',
                        name: 'x4'
                      },
                      computed: false,
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'RestElement',
                            argument: {
                              type: 'Identifier',
                              name: 'y4'
                            }
                          }
                        ]
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
      `({
        把你想在页面内共享的变量写在这里喔 : 1,
        这是你刚选择的事件: function (e){
          //当按钮被长按时...
        }
        });`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: '把你想在页面内共享的变量写在这里喔'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
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
                    name: '这是你刚选择的事件'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'e'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    expression: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `({//把你想在页面内共享的变量写在这里喔
        qqqq : 1,


        //这是你刚选择的事件
        onButton1Longtap: function (e){
          //当按钮被长按时...
        }
        });`,
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'qqqq'
                  },
                  value: {
                    type: 'Literal',
                    value: 1
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
                    name: 'onButton1Longtap'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'e'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    expression: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'var {  a, "b": b1, [`c`]: c1, [d + "e"]: d1, [`${d}e`]: d2, ...e1 } = e;',
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
                  name: 'e'
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
                        type: 'Literal',
                        value: 'b'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'b1'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'TemplateLiteral',
                        expressions: [],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: 'c',
                              raw: 'c'
                            },
                            tail: true
                          }
                        ]
                      },
                      computed: true,
                      value: {
                        type: 'Identifier',
                        name: 'c1'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        right: {
                          type: 'Literal',
                          value: 'e'
                        },
                        operator: '+'
                      },
                      computed: true,
                      value: {
                        type: 'Identifier',
                        name: 'd1'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      kind: 'init',
                      key: {
                        type: 'TemplateLiteral',
                        expressions: [
                          {
                            type: 'Identifier',
                            name: 'd'
                          }
                        ],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: '',
                              raw: ''
                            },
                            tail: false
                          },
                          {
                            type: 'TemplateElement',
                            value: {
                              cooked: 'e',
                              raw: 'e'
                            },
                            tail: true
                          }
                        ]
                      },
                      computed: true,
                      value: {
                        type: 'Identifier',
                        name: 'd2'
                      },
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'e1'
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
      's = {foo: yield /x/g}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '/'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'g'
                      },
                      operator: '/'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      's = {"foo": yield /x/g}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'yield'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '/'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'g'
                      },
                      operator: '/'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({async *5(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 5
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async 8(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 8
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({5(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 5
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"foo"(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async "a b c"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({async 15(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({get "a b c"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set 15(x){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async *[x](){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: true,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a:b,...obj} = foo)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'obj'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],

    [
      '({async *ident(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set ident(ident){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'ident'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get ident(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async ident(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({ident: {}.length} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({ident: {}.length = x} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ObjectExpression',
                          properties: []
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'length'
                        }
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({ident: [foo].length} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'foo'
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({ident: [foo].length = x} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'foo'
                            }
                          ]
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'length'
                        }
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({ident: {}.length} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: []
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'length'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({ident: {}.length = x} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'ident'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ObjectExpression',
                          properties: []
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'length'
                        }
                      },
                      right: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({...obj} = {}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'obj'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],

    [
      '({...x[0] }= {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 0
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({eval});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'eval'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'eval'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({eval} = x);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'eval'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'eval'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({...x[0] }= {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 0
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({...rest})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'rest'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a, b, ...{c, e}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'e'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'e'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ x, ...{y , z} })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a:b,...obj}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'obj'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a,...obj}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'obj'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'function f({ x, y, ...z }) {}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
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
                      name: 'y'
                    },
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'z'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              body: []
            },
            async: false,
            generator: false,
            expression: false,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '({x, ...y} = {x, ...y})',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[(function() {})]',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrayExpression',
              elements: [
                {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: []
                  },
                  async: false,
                  generator: false,
                  expression: false,
                  id: null
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '([[ x ]] = [undefined]= {});',
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
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'Identifier',
                      name: 'undefined'
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],
    [
      'someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'someObject'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'someKey'
                    },
                    value: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'SpreadElement',
                          argument: {
                            type: 'CallExpression',
                            callee: {
                              type: 'Identifier',
                              name: 'mapGetters'
                            },
                            arguments: [
                              {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'Literal',
                                    value: 'some_val_1'
                                  },
                                  {
                                    type: 'Literal',
                                    value: 'some_val_2'
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '(function({x, ...y}) {})',
      Context.OptionsWebCompat,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  ]
                }
              ],
              body: {
                type: 'BlockStatement',
                body: []
              },
              async: false,
              generator: false,
              expression: false,
              id: null
            }
          }
        ]
      }
    ],
    [
      'fn = ({text = "default", ...props}) => text + props.children',
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
                type: 'Identifier',
                name: 'fn'
              },
              operator: '=',
              right: {
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'Identifier',
                    name: 'text'
                  },
                  right: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Identifier',
                      name: 'props'
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'children'
                    }
                  },
                  operator: '+'
                },
                params: [
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'text'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'text'
                          },
                          right: {
                            type: 'Literal',
                            value: 'default'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'props'
                        }
                      }
                    ]
                  }
                ],
                id: null,
                async: false,
                expression: true
              }
            }
          }
        ]
      }
    ],
    [
      '({x, ...y, a, ...b, c})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'y'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'assignmentResult = { x: x = yield } = value',
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
                type: 'Identifier',
                name: 'assignmentResult'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'yield'
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'value'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({l: 50..foo} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'l'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 50
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({s: "foo".foo} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 's'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({"foo": [x].foo}=y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'x'
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({"foo": {x}.foo}=y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({"foo": 15..foo}=y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 15
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'foo'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({a: x = true} = y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      right: {
                        type: 'Literal',
                        value: true
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({a: {x} = true} = y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      right: {
                        type: 'Literal',
                        value: true
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({a: {x = true} = true} = y)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            value: {
                              type: 'AssignmentPattern',
                              left: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              right: {
                                type: 'Literal',
                                value: true
                              }
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: true
                          }
                        ]
                      },
                      right: {
                        type: 'Literal',
                        value: true
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({"x": 600..xyz} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 600
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'xyz'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({...x.y} = z)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'y'
                      }
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'z'
              }
            }
          }
        ]
      }
    ],
    [
      '({...x});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
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
    ],
    [
      'x = ({a:b, c:d});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = ({a, c:d});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    computed: false,
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = ({a:b, c});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({a, c:d} = x);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'd'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({1:b, 2:d});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 1
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 2
                      },
                      value: {
                        type: 'Identifier',
                        name: 'd'
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
          }
        ]
      }
    ],
    [
      'x = ({"a":b});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({"a":b, "c":d});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({"a":b, "c":d});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({[a]:b});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({[a]:b, [15]:d});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 15
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({foo(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({typeof: x});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({typeof: x} = y);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'typeof'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
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
      '({typeof: x}) => x;',
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
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'typeof'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({get typeof(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({async typeof(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({async * typeof(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: true,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = { async *[y](){} }',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: true,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({async "a b c"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({async 15(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
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
            }
          }
        ]
      }
    ],
    [
      '({get 15(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set "a b c"(x){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set 15(x){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 15
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'x'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = ({async(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({foo(){}, bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({foo(a,b,c){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
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
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({1(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({"foo"(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({async foo(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({async async(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({async "foo"(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({async 100(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 100
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'wrap({async [foo](){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = ({async foo(){}, async bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      '({x: y, z})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
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
                    name: 'z'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'z'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = ({async foo(){}, bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({foo(){}, async bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*foo(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*get(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*async(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*"foo"(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*[foo](){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: true,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({* foo(){},*bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({* foo(){}, bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({get foo(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get get(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'get'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get foo(){}, get bar(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get foo(){}, bar(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({foo(){}, get bar(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get [foo](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'get',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({get [foo](){}, get [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'get',
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'get',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({get [foo](){}, [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'get',
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({[foo](){}, get [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'get',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({get "foo"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...x, y})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'x'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'y'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get "foo"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({get 123(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 123
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set foo(a){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set get(a){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'get'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set foo(b){}, set bar(d){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'd'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set foo(c){}, bar(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set [foo](a){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'set',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({set [foo](b){}, set [bar](d){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'set',
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [
                      {
                        type: 'Identifier',
                        name: 'd'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'set',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({set [foo](c){}, [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'set',
                  method: false,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({[foo](){}, set [bar](e){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'init',
                  method: true,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  computed: true,
                  value: {
                    type: 'FunctionExpression',
                    id: null,
                    params: [
                      {
                        type: 'Identifier',
                        name: 'e'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    generator: false,

                    async: false
                  },
                  kind: 'set',
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({set "foo"(a){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set 123(a){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 123
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({foo: typeof x});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    prefix: true
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({}=obj);',
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
                type: 'ObjectPattern',
                properties: []
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a:b}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a, b}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a:b, c:d}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a, c:d}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({a:b, c}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({}=x);',
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
                type: 'ObjectPattern',
                properties: []
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({a=b}=c);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      '({a:v=b}=c);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'v'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'c'
              }
            }
          }
        ]
      }
    ],
    [
      '({foo(){}, set bar(e){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'bar'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'e'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = ({foo(){}, *bar(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({*123(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 123
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({async get(){}});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      '({get "a b c"(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'a b c'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*typeof(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({typeof(){}});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'typeof'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,

                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = ({"a":b});',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = ({a:b, c} = x);',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      computed: false,
                      value: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      kind: 'init',
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({[foo]: x} = y)',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    method: false,
                    shorthand: false
                  }
                ]
              },
              right: {
                type: 'Identifier',
                name: 'y'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'a = {} = b',
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
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: []
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'a = {"a": b} = b',
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
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'b'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({x})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({x} = foo )',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      'a = {}',
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
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      'a = {"a": b}',
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
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'get'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'get'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a:b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get:b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async:b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, b} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a:b, c:d}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
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
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, c:d}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, c:d} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'd'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a:b, c} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
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
                        name: 'c'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {15:b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 15
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 0.9
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 132
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1
                    },
                    value: {
                      type: 'Identifier',
                      name: 'c'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 23
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1e234
                    },
                    value: {
                      type: 'Identifier',
                      name: 'e'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {1:b, 0:d}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 0
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"a":b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"a":b, "c":d}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'c'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {[a]:b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {[a]:b, [15]:d}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 15
                    },
                    value: {
                      type: 'Identifier',
                      name: 'd'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = { *a() {} }',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {0(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
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
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 0.9
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 132
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 23
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 1e234
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"foo"(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async foo(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async async(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async "foo"(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async 100(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 100
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async [foo](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {async foo(){}, async bar(){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {async foo(){}, bar(){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: true
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {foo(){}, async bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
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
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*foo(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*get(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*set(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'set'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*async(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'async'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*"foo"(){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {*123(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 123
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {*[foo](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: true,
                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {* foo(){},*bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {* foo(){}, bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {foo(){}, *bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get foo(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get get(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get foo(){}, get bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get foo(){}, bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {foo(){}, get bar(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get [foo](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {get [foo](){}, get [bar](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {get [foo](){}, [bar](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {[foo](){}, get [bar](){}}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'bar'
                    },
                    computed: true,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,
                      async: false
                    },
                    kind: 'get',
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {get "foo"(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {get 123(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 123
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'get',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {set foo(a){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'set',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {set get(a){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'get'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [
                        {
                          type: 'Identifier',
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,
                      id: null
                    },
                    kind: 'set',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {foo: typeof x}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'UnaryExpression',
                      operator: 'typeof',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      prefix: true
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {foo: true / false}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'foo'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Literal',
                        value: true
                      },
                      right: {
                        type: 'Literal',
                        value: false
                      },
                      operator: '/'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {await}  = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
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
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {arguments}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'arguments'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'arguments'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {eval}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'eval'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'eval'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": y+z}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'z'
                      },
                      operator: '+'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": [y]}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": [y]} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'x'
                      },
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'y'
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": [y + x]}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '+'
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": [y].slice(0)}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'Identifier',
                              name: 'y'
                            }
                          ]
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'slice'
                        }
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: 0
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": {y: z}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": {y: z}} = x',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'x'
                      },
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": {a: y + x}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'BinaryExpression',
                            left: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            right: {
                              type: 'Identifier',
                              name: 'x'
                            },
                            operator: '+'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": {a: y + x}.slice(0)}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'a'
                              },
                              value: {
                                type: 'BinaryExpression',
                                left: {
                                  type: 'Identifier',
                                  name: 'y'
                                },
                                right: {
                                  type: 'Identifier',
                                  name: 'x'
                                },
                                operator: '+'
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'slice'
                        }
                      },
                      arguments: [
                        {
                          type: 'Literal',
                          value: 0
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": 600}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'Literal',
                      value: 600
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {"x": 600..xyz}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Literal',
                        value: 600
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'xyz'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...y}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {x, ...y}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, ...y, b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...y, b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...a,}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...a=b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...a + b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...[a, b]}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
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
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...{a, b}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        },
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({...a})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...a=b})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...a+b})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    operator: '+'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...[a, b]})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
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
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...{a, b}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = {...a, ...b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'a'
                    }
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'b'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
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
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
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
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            value: 2
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ArrayPattern',
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          value: 3
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        right: {
                          type: 'Literal',
                          value: 4
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        right: {
                          type: 'Literal',
                          value: 5
                        }
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],

    [
      '({[foo()] : (z)} = z = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'CallExpression',
                      callee: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    kind: 'init',
                    computed: true,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'z'
                },
                operator: '=',
                right: {
                  type: 'ObjectExpression',
                  properties: []
                }
              }
            }
          }
        ]
      }
    ],

    [
      '({a: 1, a: 2})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a: 1, b: 3, a: 2})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  value: {
                    type: 'Literal',
                    value: 3
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
                    name: 'a'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({b: x, a: 1, a: 2})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
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
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a: 1, a: 2, b: 3})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Literal',
                    value: 2
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
                    value: 3
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a, a})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a, a: 1})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
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
          }
        ]
      }
    ],
    [
      '({a: 1, a})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
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
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({async "foo"(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({async 100(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 100
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({foo(){}, async bar(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*foo(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*get(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'get'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*set(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'set'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*async(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'async'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*"foo"(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*123(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 123
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({*[foo](){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: true,
                        id: null
                      },
                      kind: 'init',
                      computed: true,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({* foo(){},*bar(){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: true,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: true,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({get foo(){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '(({a = 0}) => a)',
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
                type: 'Identifier',
                name: 'a'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        left: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          value: 0
                        }
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '(({a = 0} = {}) => a)({})',
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
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'a'
                },
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            right: {
                              type: 'Literal',
                              value: 0
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ],
                id: null,
                async: false,
                expression: true
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: []
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({x=1} = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
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
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '(({a = 0} = {}) => a)({a: 1})',
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
                type: 'ArrowFunctionExpression',
                body: {
                  type: 'Identifier',
                  name: 'a'
                },
                params: [
                  {
                    type: 'AssignmentPattern',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            right: {
                              type: 'Literal',
                              value: 0
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    right: {
                      type: 'ObjectExpression',
                      properties: []
                    }
                  }
                ],
                id: null,
                async: false,
                expression: true
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
          }
        ]
      }
    ],
    [
      'wrap({get get(){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'get'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({get foo(){}, get bar(){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({get foo(){}, bar(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'get',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({foo(){}, get bar(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'init',
                      computed: false,
                      method: true,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'get',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({get [foo](){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'get',
                      computed: true,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({get [foo](){}, get [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({get [foo](){}, [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({[foo](){}, get [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'get',
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({get "foo"(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'get',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({get 123(){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 123
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'get',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set get(a){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'get'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set foo(b){}, set bar(d){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'b'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'd'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set foo(c){}, bar(){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [
                          {
                            type: 'Identifier',
                            name: 'c'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'set',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: false,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({set [foo](a){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: true,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set [foo](b){}, set [bar](d){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'b'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: true,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'd'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: true,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set [foo](c){}, [bar](){}});',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [
                          {
                            type: 'Identifier',
                            name: 'c'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'set',
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'bar'
                      },
                      computed: true,
                      value: {
                        type: 'FunctionExpression',
                        id: null,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        generator: false,
                        async: false
                      },
                      kind: 'init',
                      method: true,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function x([a, b]){}',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'FunctionDeclaration',
            params: [
              {
                type: 'ArrayPattern',
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
            ],
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
      'wrap({set [foo]([a, b]){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'ArrayPattern',
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
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: true,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set "foo"(a){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'foo'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({set 123(a){}});',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 123
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [
                          {
                            type: 'Identifier',
                            name: 'a'
                          }
                        ],
                        body: {
                          type: 'BlockStatement',
                          body: []
                        },
                        async: false,
                        generator: false,
                        id: null
                      },
                      kind: 'set',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({foo: typeof x});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'UnaryExpression',
                    operator: 'typeof',
                    argument: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    prefix: true
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({foo: true / false});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Literal',
                      value: true
                    },
                    right: {
                      type: 'Literal',
                      value: false
                    },
                    operator: '/'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: []
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a:b}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a, b}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a:b, c:d}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
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
                          name: 'c'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a, c:d}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a:b, c}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
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
                          name: 'c'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'c'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],

    [
      '({x:let}) => null',
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
                type: 'Literal',
                value: null
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'let'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'wrap({}=x);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: []
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a=b}=c);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a:v=b}=c);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'v'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'b'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'c'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({x:let} = null)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'let'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Literal',
                value: null
              }
            }
          }
        ]
      }
    ],
    [
      '({x:let})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'let'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({a:b=x}=y);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'b'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'x'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'y'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({"a":b}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Literal',
                          value: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({"a":b, "c":d}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Literal',
                          value: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Literal',
                          value: 'c'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": y+z})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    right: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    operator: '+'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": [y]})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'Identifier',
                        name: 'y'
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": [y]} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({"x": [y]}) => x',
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
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'x'
                      },
                      value: {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'y'
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({"x": [y + x]})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'ArrayExpression',
                    elements: [
                      {
                        type: 'BinaryExpression',
                        left: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        right: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        operator: '+'
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": [y].slice(0)})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ArrayExpression',
                        elements: [
                          {
                            type: 'Identifier',
                            name: 'y'
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'slice'
                      }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 0
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": {y: z}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'y'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'z'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": {y: z}} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          value: {
                            type: 'Identifier',
                            name: 'z'
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({"x": {a: y + x}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'BinaryExpression',
                          left: {
                            type: 'Identifier',
                            name: 'y'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'x'
                          },
                          operator: '+'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": {a: y + x}.slice(0)})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'CallExpression',
                    callee: {
                      type: 'MemberExpression',
                      object: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            value: {
                              type: 'BinaryExpression',
                              left: {
                                type: 'Identifier',
                                name: 'y'
                              },
                              right: {
                                type: 'Identifier',
                                name: 'x'
                              },
                              operator: '+'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'slice'
                      }
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        value: 0
                      }
                    ]
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": 600})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'Literal',
                    value: 600
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": 600..xyz})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 'x'
                  },
                  value: {
                    type: 'MemberExpression',
                    object: {
                      type: 'Literal',
                      value: 600
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'xyz'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({[a]:b}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: true,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'wrap({[a]:b, [15]:d}=obj);',
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
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        kind: 'init',
                        computed: true,
                        method: false,
                        shorthand: false
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Literal',
                          value: 15
                        },
                        value: {
                          type: 'Identifier',
                          name: 'd'
                        },
                        kind: 'init',
                        computed: true,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x, {foo, bar} = doo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x, {foo = y, bar} = doo',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'SequenceExpression',
              expressions: [
                {
                  type: 'Identifier',
                  name: 'x'
                },
                {
                  type: 'AssignmentExpression',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          right: {
                            type: 'Identifier',
                            name: 'y'
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      },
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'bar'
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  operator: '=',
                  right: {
                    type: 'Identifier',
                    name: 'doo'
                  }
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'x = {a, b} = y',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
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
          }
        ]
      }
    ],
    [
      '({a, b} = c = d)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'Identifier',
                  name: 'c'
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'd'
                }
              }
            }
          }
        ]
      }
    ],
    [
      'result = [x[yield]] = vals;',
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
                type: 'Identifier',
                name: 'result'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ArrayPattern',
                  elements: [
                    {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'yield'
                      }
                    }
                  ]
                },
                operator: '=',
                right: {
                  type: 'Identifier',
                  name: 'vals'
                }
              }
            }
          }
        ]
      }
    ],
    [
      '({ x: x[Y] } = x);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'x'
                      },
                      computed: true,
                      property: {
                        type: 'Identifier',
                        name: 'Y'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'a={"b":c=d}',
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
                type: 'Identifier',
                name: 'a'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'b'
                    },
                    value: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'c'
                      },
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'd'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      's = {s: true}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 's'
                    },
                    value: {
                      type: 'Literal',
                      value: true
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      's = {s: this}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 's'
                    },
                    value: {
                      type: 'ThisExpression'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      's = {"foo": this}',
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
                type: 'Identifier',
                name: 's'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'foo'
                    },
                    value: {
                      type: 'ThisExpression'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x={...true}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Literal',
                      value: true
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({x = 1} = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
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
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({x, y = 1, z = 2} = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        value: 1
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'z'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      left: {
                        type: 'Identifier',
                        name: 'z'
                      },
                      right: {
                        type: 'Literal',
                        value: 2
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
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
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 1
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
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
                                    name: 'z1'
                                  },
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      value: 2
                                    }
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: true
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x2'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            value: 3
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z3'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 4
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    properties: []
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
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
            }
          }
        ]
      }
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
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
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          elements: [
                            {
                              type: 'ObjectPattern',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 1
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
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
                                    name: 'z1'
                                  },
                                  value: {
                                    type: 'AssignmentPattern',
                                    left: {
                                      type: 'Identifier',
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      value: 2
                                    }
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: true
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x2'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          left: {
                            type: 'Identifier',
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            value: 3
                          }
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: true
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    properties: [
                                      {
                                        type: 'Property',
                                        key: {
                                          type: 'Identifier',
                                          name: 'z3'
                                        },
                                        value: {
                                          type: 'AssignmentPattern',
                                          left: {
                                            type: 'Identifier',
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            value: 4
                                          }
                                        },
                                        kind: 'init',
                                        computed: false,
                                        method: false,
                                        shorthand: true
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          elements: [
                            {
                              type: 'ObjectExpression',
                              properties: [
                                {
                                  type: 'Property',
                                  key: {
                                    type: 'Identifier',
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    properties: []
                                  },
                                  kind: 'init',
                                  computed: false,
                                  method: false,
                                  shorthand: false
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init',
                        computed: false,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          properties: [
                            {
                              type: 'Property',
                              key: {
                                type: 'Identifier',
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init',
                              computed: false,
                              method: false,
                              shorthand: false
                            }
                          ]
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
            }
          }
        ]
      }
    ],
    [
      '({*ident(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'ident'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*get(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'get'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*set(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'set'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({*async(){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({653: [x].foo})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Literal',
                    value: 653
                  },
                  value: {
                    type: 'MemberExpression',
                    object: {
                      type: 'ArrayExpression',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'x'
                        }
                      ]
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'foo'
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({"x": {y: z}}) => x',
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
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'x'
                      },
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({"a":b}=obj);',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'obj'
              }
            }
          }
        ]
      }
    ],
    [
      '({"x": [y]} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Literal',
                      value: 'x'
                    },
                    value: {
                      type: 'ArrayPattern',
                      elements: [
                        {
                          type: 'Identifier',
                          name: 'y'
                        }
                      ]
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      'o = {f(f) { }}',
      Context.None,
      {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'Identifier',
                name: 'o'
              },
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'f'
                    },
                    computed: false,
                    value: {
                      type: 'FunctionExpression',
                      id: null,
                      params: [
                        {
                          type: 'Identifier',
                          name: 'f'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      generator: false,

                      async: false
                    },
                    kind: 'init',
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){   s = {"foo": yield}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Literal',
                            value: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            expression: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      'function *f(){   s = {foo: yield}   }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 's'
                    },
                    operator: '=',
                    right: {
                      type: 'ObjectExpression',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            argument: null,
                            delegate: false
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: false
                        }
                      ]
                    }
                  }
                }
              ]
            },
            async: false,
            expression: false,
            generator: true,
            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '({[foo]: x} = x) => y',
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
                type: 'Identifier',
                name: 'y'
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'Property',
                        key: {
                          type: 'Identifier',
                          name: 'foo'
                        },
                        value: {
                          type: 'Identifier',
                          name: 'x'
                        },
                        kind: 'init',
                        computed: true,
                        method: false,
                        shorthand: false
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    name: 'x'
                  }
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      'var someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
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
                        name: 'someKey'
                      },
                      value: {
                        type: 'ObjectExpression',
                        properties: [
                          {
                            type: 'SpreadElement',
                            argument: {
                              type: 'CallExpression',
                              callee: {
                                type: 'Identifier',
                                name: 'mapGetters'
                              },
                              arguments: [
                                {
                                  type: 'ArrayExpression',
                                  elements: [
                                    {
                                      type: 'Literal',
                                      value: 'some_val_1'
                                    },
                                    {
                                      type: 'Literal',
                                      value: 'some_val_2'
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        ]
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
                  name: 'someObject'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '({x, ...y, a, ...b, c})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'x'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'y'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'b'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'z = {x, ...y}',
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
                type: 'Identifier',
                name: 'z'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'let z = {...x}',
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
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'SpreadElement',
                      argument: {
                        type: 'Identifier',
                        name: 'x'
                      }
                    }
                  ]
                },
                id: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      '({a:b,...obj}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'obj'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a,...obj}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    },
                    {
                      type: 'RestElement',
                      argument: {
                        type: 'Identifier',
                        name: 'obj'
                      }
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '({...obj} = {}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'AssignmentPattern',
                  left: {
                    type: 'ObjectPattern',
                    properties: [
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'obj'
                        }
                      }
                    ]
                  },
                  right: {
                    type: 'ObjectExpression',
                    properties: []
                  }
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      '({a:b,...obj} = foo)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'obj'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '({a,...obj} = foo)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'RestElement',
                    argument: {
                      type: 'Identifier',
                      name: 'obj'
                    }
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'foo'
              }
            }
          }
        ]
      }
    ],
    [
      '({...(a,b),c})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'SequenceExpression',
                    expressions: [
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
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({...a,b,c})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'Identifier',
                    name: 'a'
                  }
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'b'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'c'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],

    [
      'x = {__proto__: a, __proto__: b} = y',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'AssignmentExpression',
                left: {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: '__proto__'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'a'
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
                        name: '__proto__'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
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
          }
        ]
      }
    ],
    [
      '({__proto__: a, __proto__: b} = x)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
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
                      name: '__proto__'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'x'
              }
            }
          }
        ]
      }
    ],
    [
      '({x:a["x"]} = {x:20});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      object: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      computed: true,
                      property: {
                        type: 'Literal',
                        value: 'x'
                      }
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Literal',
                      value: 20
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'async function wrap() { ({a = await b} = obj) }',
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
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'ObjectPattern',
                      properties: [
                        {
                          type: 'Property',
                          key: {
                            type: 'Identifier',
                            name: 'a'
                          },
                          value: {
                            type: 'AssignmentPattern',
                            left: {
                              type: 'Identifier',
                              name: 'a'
                            },
                            right: {
                              type: 'AwaitExpression',
                              argument: {
                                type: 'Identifier',
                                name: 'b'
                              }
                            }
                          },
                          kind: 'init',
                          computed: false,
                          method: false,
                          shorthand: true
                        }
                      ]
                    },
                    operator: '=',
                    right: {
                      type: 'Identifier',
                      name: 'obj'
                    }
                  }
                }
              ]
            },
            async: true,
            expression: false,
            generator: false,
            id: {
              type: 'Identifier',
              name: 'wrap'
            }
          }
        ]
      }
    ],
    [
      '({x:y} = {});',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: []
              }
            }
          }
        ]
      }
    ],
    [
      '({y:y2} = {y:y2-2})',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'y2'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'y2'
                      },
                      right: {
                        type: 'Literal',
                        value: 2
                      },
                      operator: '-'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({async foo(a) { await a }});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'a'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'AwaitExpression',
                            argument: {
                              type: 'Identifier',
                              name: 'a'
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
            }
          }
        ]
      }
    ],
    [
      '({async, foo})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'async'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                },
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: true
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'o({async await() { }})',
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
                name: 'o'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'await'
                      },
                      value: {
                        type: 'FunctionExpression',
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          body: []
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
                }
              ]
            }
          }
        ]
      }
    ],
    [
      'async ({a: b = c})',
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
                name: 'async'
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
                        type: 'AssignmentExpression',
                        left: {
                          type: 'Identifier',
                          name: 'b'
                        },
                        operator: '=',
                        right: {
                          type: 'Identifier',
                          name: 'c'
                        }
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
          }
        ]
      }
    ],
    [
      '({ async *foo() {} })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'foo'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: true,
                    generator: true,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({x, y} = o)',
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
                type: 'ObjectPattern',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'y'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              },
              operator: '=',
              right: {
                type: 'Identifier',
                name: 'o'
              }
            }
          }
        ]
      }
    ],
    [
      '({ enum: 0 })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'enum'
                  },
                  value: {
                    type: 'Literal',
                    value: 0
                  },
                  kind: 'init',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a(b,c){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'Identifier',
                        name: 'c'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({set a(eval){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'eval'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({ set a([{b = 0}]){}, })',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'ArrayPattern',
                        elements: [
                          {
                            type: 'ObjectPattern',
                            properties: [
                              {
                                type: 'Property',
                                kind: 'init',
                                key: {
                                  type: 'Identifier',
                                  name: 'b'
                                },
                                computed: false,
                                value: {
                                  type: 'AssignmentPattern',
                                  left: {
                                    type: 'Identifier',
                                    name: 'b'
                                  },
                                  right: {
                                    type: 'Literal',
                                    value: 0
                                  }
                                },
                                method: false,
                                shorthand: true
                              }
                            ]
                          }
                        ]
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'set',
                  computed: false,
                  method: false,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '({a(b,...c){}})',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'a'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [
                      {
                        type: 'Identifier',
                        name: 'b'
                      },
                      {
                        type: 'RestElement',
                        argument: {
                          type: 'Identifier',
                          name: 'c'
                        }
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      body: []
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      '(a, {b}) => {}',
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
                body: []
              },
              params: [
                {
                  type: 'Identifier',
                  name: 'a'
                },
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      value: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: true
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: false
            }
          }
        ]
      }
    ],
    [
      'x = {__proto__(){}, __proto__: 2}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'Literal',
                      value: 2
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {__proto__(){}, __proto__(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {async __proto__(){}, *__proto__(){}}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: true,
                      generator: false,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: '__proto__'
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: []
                      },
                      async: false,
                      generator: true,

                      id: null
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...y}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {x, ...y}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'x'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {...a=b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'AssignmentExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      operator: '=',
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],

    [
      '({...x=y});',
      Context.None,
      {
        type: 'Program',
        sourceType: 'script',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'SpreadElement',
                  argument: {
                    type: 'AssignmentExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x'
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
          }
        ]
      }
    ],
    [
      'x = {...a + b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'BinaryExpression',
                      left: {
                        type: 'Identifier',
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        name: 'b'
                      },
                      operator: '+'
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      'x = {a, ...y, b}',
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
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'a'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  },
                  {
                    type: 'SpreadElement',
                    argument: {
                      type: 'Identifier',
                      name: 'y'
                    }
                  },
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    value: {
                      type: 'Identifier',
                      name: 'b'
                    },
                    kind: 'init',
                    computed: false,
                    method: false,
                    shorthand: true
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      '({"x": {y: z}}) => x',
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
                type: 'Identifier',
                name: 'x'
              },
              params: [
                {
                  type: 'ObjectPattern',
                  properties: [
                    {
                      type: 'Property',
                      key: {
                        type: 'Literal',
                        value: 'x'
                      },
                      value: {
                        type: 'ObjectPattern',
                        properties: [
                          {
                            type: 'Property',
                            key: {
                              type: 'Identifier',
                              name: 'y'
                            },
                            value: {
                              type: 'Identifier',
                              name: 'z'
                            },
                            kind: 'init',
                            computed: false,
                            method: false,
                            shorthand: false
                          }
                        ]
                      },
                      kind: 'init',
                      computed: false,
                      method: false,
                      shorthand: false
                    }
                  ]
                }
              ],
              id: null,
              async: false,
              expression: true
            }
          }
        ]
      }
    ]
  ]);
});
