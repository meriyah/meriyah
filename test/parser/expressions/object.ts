import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
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
    'for ({x=1}; 1;) {1}',
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
    '{x=1} ? 2 : 3;',
    '({static a() {}})',
    '({static b})',
    '({a b})',
    '({a b() {}})',
    '{get async(v) {}}',
    '{get let(v) {}}',
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
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
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
    '{ ...1 in {} ? a : []}',
    '{ ...1 ? {} : []}',
    '{ ...[]}',
    '{ ...async function() { }}',
    '{ ...async () => { }}',
    '{ ...new Foo()}',
    '{[a]: {...a}}',
    '{ [a]: {} [a] }',
    '{ [a]: {} = a }',
    '{ [a]: {} + a }',
    '{ [a]: {} /- a }',
    '{ [a]: {} ? a : b }',
    '{ [a]: [] [a] }',
    '{ [a]: [] = a }',
    '{ [a]: [] + a }',
    '{ [a]: [] /- a }',
    '{ [a]: [] ? a : b }',
    '{ a: [] + a }',
    '{ a: [] /- a }',
    '{ a: [] ? a : b }',
    '{ "a": [] + a }',
    '{ "a": [] /- a }',
    '{ a: [([] ? a : b.c[d])] / 2 }',
    'x = { a: { "a": { "a": [] ? a : b } } }',
    'x = { a: {x} = y }',
    'x = { a: {x} = y.z }',
    'x = { a: [x] = y.z }',
    'x = { [a]: { "a": { "a": [] ? a : b } } }',
    'x = { [a]: {x} = y }',
    'x = { [a]: {x} = y.z }',
    'x = { [a]: [x] = y.z }',
    '{ "a": [([] ? a : b.c[d])] / 2 }',
    'x = { "a": { "a": { "a": [] ? a : b } } }',
    'x = { "a": {x} = y }',
    'x = { "a": {x} = y.z }',
    'x = { "a": [x] = y.z }',
    '(x = { a: {x} = y }) / y.z',
    '(x = { a: x = y }) / y.z',
    '(x = { a: (x) = y }) / y.z',
    '(x = { a: x = (y) }) / y.z',
    '(x = { a: (x = (y)) }) / y.z',
    '(x = { "a": {x} = y }) / y.z',
    '(x = { "a": x = y }) / y.z',
    '(x = { "a": (x) = y }) / y.z',
    '(x = { "a": x = (y) }) / y.z',
    '(x = { "a": (x = (y)) }) / y.z',
    '(x = { [a]: {x} = y }) / y.z',
    '(x = { [a]: x = y }) / y.z',
    '(x = { [a]: (x) = y }) / y.z',
    '(x = { [a]: x = (y) }) / y.z',
    '(x = { [a]: (x = (y)) }) / y.z',
    'x = { "a": ([] ? a : b.c[d]) }',
    'x = {"d": {}[d] += a}',
    'x = {d: {}[d] += a}',
    'x = {[d]: {}[d] += a}',
    '{ "a": [] ? a : b.c[d] }',
    '{ "a": [] ? a : b / 2 - 2}',
    '{ "a": [] ? a : b }',
    '{d: {}[d] += a}',
    '{"string": {}[d] += a}',
    '{["d"]: {}[d] += a}',
    '{[d]: {}[d] += a}',
    '{"d": {}[d] += a}',
    '{"d": {}[x ? y : z] += a}',
    '{d: {}[x ? y : z] += a}',
    '{ b: c.d === e ? f : g }',
    '{ "b": c.d === e ? f : g }',
    '{ [b]: c.d === e ? f : g }',
    '{async static() {}}',
    '{async *static() {}}',
    '{set async(v) {}}',
    '{get async() {}}',
    '{get let() {}}',
    'async ({__proto__: a, __proto__: b}) => 1',
  ]) {
    it(`x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = ${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg})`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg})`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
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
    'x = {__proto__: 1, "__proto__": 2}',
    'async ({__proto__: a, __proto__: b});',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    "__proto__: {}, ['__proto__']: {}",
    '__proto__: {}, __proto__() {}',
    '__proto__: {}, get __proto__() {}',
    '__proto__: {}, set __proto__(v) {}',
    '__proto__: {}, __proto__',
  ]) {
    it(`({${arg}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({${arg}});`, undefined, Context.None);
      });
    });

    it(`"use strict"; ({${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({${arg}});`, undefined, Context.None);
      });
    });

    it(`x = {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = {${arg}};`, undefined, Context.None);
      });
    });

    it(`x = {${arg}}`, () => {
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
    '{x: y}.length',
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
    '*1.0() {}, 1: 1',
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
    it(`({ ${arg} } = x);`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} } = x);`, undefined, Context.Strict | Context.OptionsLexical);
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
    '*1.0() {}, 1: 1',
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
    'false', // 'enum',
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
    'yield',
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
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`, undefined, Context.OptionsLexical);
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
    '{ w, x, y = a ? x : b }',
  ]) {
    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, undefined, Context.None);
      });
    });
    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, undefined, Context.OptionsLexical);
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
    'async *method(a, async,) {}',
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
    String.raw`get ['unicod\u{000065}Escape']() { return 'get string'; }`,
    '[++counter]: ++counter, [++counter]: ++counter, [++counter]: ++counter, [++counter]: ++counter',
    'async: foo',
    'await: foo',
    '*method([[x, y, z] = [4, 5, 6]]) {}',
    '*method([[x, async, z] = [4, 5, 6]]) {}',
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
    'async *method([...async] = {}) {}',
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
    'async: {a: b}',
    '"foo": {a: b}',
    '"foo": [a]',
    '"foo": ({a: b})',
    '"foo": [a]',
    '"foo": 123',
    '"foo": [a]',
    '"foo": [async]',
    '"foo": {x} = "bar"',
    '"foo": [x] = "bar"',
    '"foo": (x) = "bar"',
    '"foo": (x) = async',
    'key: bar = x',
    'key: bar + x',
    'key: bar.foo = x',
    'key: bar.foo + x',
    'key: bar.foo + x',
    'async: async.await + x',
    'key: bar/x',
    'key: bar, foo: zoo',
    'x:y} = { ',
    '} = {',
    'x = 1} = {',
    'x, y = 1, z = 2} = {',
    'a: [b = 1, c = 2][1]} = {a:[]',
    'a: [b = 1, c = 2].b} = {a:[]',
    'async',
  ]) {
    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, undefined, Context.OptionsNext);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, undefined, Context.None);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, undefined, Context.OptionsNext | Context.OptionsWebCompat);
      });
    });

    it(`x = { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = { ${arg} }`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`x = { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = { ${arg} }`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`({ ${arg} }) = {}`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) = {}`, undefined, Context.OptionsWebCompat);
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({ ${arg} })`, undefined, Context.OptionsNext);
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
    ['x = { [a]: {} /= a }', Context.None],
    ['x = { [a]: {} ++a }', Context.None],
    ['x = { a: {} /= a }', Context.None],
    ['x = { a: {} ++a }', Context.None],
    ['x = { "a": {} /= a }', Context.None],
    ['x = { "a": {} ++a }', Context.None],
    ['x = { 1: {} /= a }', Context.None],
    ['x = { 1: {} ++a }', Context.None],
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
    ['{...x)', Context.None],
    ['({...x)', Context.None],
    ['({set a() {}})', Context.None],
    ['({1} ? a : b)', Context.None],
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
    ['({a ...b})', Context.None],
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
      Context.None,
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
    ['({ get *x(){} })', Context.None],
    ['({get +:3})', Context.None],
    ['({get bar(x) {})', Context.None],
    ['a = { a: async (){} }', Context.None],
    ['({get bar(x) {})', Context.None],
    ['({get bar(x) {})', Context.None],
    ['({get bar(x) {})', Context.None],
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
    ['{ 1: {} [a] }', Context.None],
    ['{ 1: {} = a }', Context.None],
    ['{ 1: {} + a }', Context.None],
    ['{ 1: {} /- a }', Context.None],
    ['{ 1: {} ? a : b }', Context.None],
    ['{ 1: [] [a] }', Context.None],
    ['{ 1: [] = a }', Context.None],
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
    ['({Object = 0, String = 0}) = {};', Context.None],
    ['({a, b}) = {a: 1, b:2}', Context.None],
    ['({a, b}) = {a: 1, b:2}', Context.None],
    [String.raw`"use\040strict";`, Context.Strict],
    ['var x = 012;', Context.Strict],
    ['({b}) = b;', Context.None],
    ['([b]) = b;', Context.None],
    ['foo({ __proto__: null, other: null, "__proto__": null });', Context.OptionsWebCompat],
    ['({ __proto__: null, other: null, "__proto__": null }) => foo;', Context.OptionsWebCompat],
    ['async ({ __proto__: null, other: null, "__proto__": null }) => foo;', Context.OptionsWebCompat],
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
    ['f = ([...[z] = 1] ) => {};', Context.None],
    ['f = ( [a,,..rest,...rest1] ) => {};', Context.None],
    ['f = ( { ,, ...x } ) => {};', Context.None],
    ['f = ( { ...*method() {} } ) => {};', Context.None],
    ['function f({ ...x, ...y } ) {}', Context.None],
    ['function f( {[1+1]} ) {}', Context.None],
    ['x({get "abc": x});', Context.None],
    ['x({get 123: x});', Context.None],
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
    ['({3200: x() = x}) => x', Context.None],
    ['({3200: x() = x} = x)', Context.None],
    ['({foo: x() = x}) => x', Context.None],
    ['({foo: x() = x} = x)', Context.None],
    ['({foo: x() = a} = b) => c', Context.None],
    ['s = {foo: yield}', Context.Strict],
    ['s = {foo: yield / x}', Context.Strict],
    ['s = {foo: yield /x/}', Context.None],
    ['s = {foo: yield /x/g}', Context.Strict],
    ['s = {"foo": yield}', Context.Strict],
    ['s = {"foo": yield / x}', Context.Strict],
    ['function *f(){   s = {"foo": yield / x}   }', Context.None],
    ['({foo: x() = x}) => x', Context.None],
    ['({foo: x() = x} = x)', Context.None],
    ['({foo: x() = a} = b) => c', Context.None],
    ['({"foo": x() = 1}) => x', Context.None],
    ['({"foo": x() = x}) => x', Context.None],
    ['({"foo": x() = x} = x)', Context.None],
    ['({"foo": x() = a} = b) => c', Context.None],
    ['({3200: x() = a} = b) => c', Context.None],
    ['({foo: x() = x}) => x', Context.None],
    ['({foo: x() = x} = x)', Context.None],
    ['({foo: x() = a} = b) => c', Context.None],
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
    ['(["a"]) = []', Context.None],
    ['({1}) = {}', Context.None],
    ['({"a"}) = 0;', Context.None],
    ['(["x"]) = 0', Context.None],
    ['([a.[b]]) => 0', Context.None],
    ['({+2 : x}) = {};', Context.None],
    ['[...rest,] = {};', Context.None],
    ['({...a, ...b, ...c} = {...a, ...b, ...c})', Context.None],
    ['({ a, b }) = {a: 1, b: 2}', Context.None],
    ['{[1+1] : z} = {};', Context.None],
    ['({x: { y = 10 } })', Context.None],
    ['({x = 42, y = 15})', Context.None],
    ['({"x" = 42, y = 15})', Context.None],
    ['({[x] = 42, y = 15})', Context.None],
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
    ['({*1(){}} = x);', Context.None],
    ['({*foo(){}} = x);', Context.None],
    ['({*"expr"(){}} = x);', Context.None],
    ['({[expr](){}} = x);', Context.None],
    ['({1(){}} = x);', Context.None],
    ['({foo(){}} = x);', Context.None],
    ['({"expr"(){}} = x);', Context.None],
    ['({set 8(y){})', Context.None],
    ['({get 8(){})', Context.None],
    ['({get [x](){})', Context.None],
    ['({set "x"(y){})', Context.None],
    ['({async 8(){})', Context.None],
    ['({set 8(y){})', Context.None],
    ['({,} = {});', Context.None],
    ['var {,} = {}', Context.None],
    ['var {x:y+1} = {};', Context.None],
    ['var {x:y--} = {};', Context.None],
    ['var y; ({x:y--} = {});', Context.None],
    ['var y; ({x:y+1} = {});', Context.None],
    ['function foo() { return {}; }; var {x:foo().x} = {};', Context.None],
    ['function foo() { return {}; }; ({x:foo()} = {});', Context.None],
    ['function foo() { return {}; }; let {x:foo()} = {};', Context.None],
    ['class foo { method() { ({x:super()} = {}); } }', Context.None],
    ['let [...[a] = []] = [[]];', Context.None],
    ['let [...{x} = {}] = [{}];', Context.None],
    ['let a, r1; ({a:(a1 = r1) = 44} = {})', Context.None],
    ['({a: ({d = 1,c = 1}.c) = 2} = {});', Context.None],
    ['({a: {d = 1,c = 1}.c = 2} = {});', Context.None],
    ['for(var [z] = function ([a]) { } in []) {}', Context.None],
    ['var a = 1; ({x, y = 1, z = 2} = {a = 2});', Context.None],
    ['var a = 1; ({x, y = {a = 1}} = {});', Context.None],
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
    ["x = {'__proto__': 1, __proto__: 2}", Context.OptionsWebCompat],
    ["x = {'__proto__': 1, __proto__: 2}", Context.None],
    [String.raw`({g\u0065t m() {} });`, Context.None],
    ['([{web: false, __proto__: a, __proto__: b}]);', Context.None],
    ['({web: false, __proto__: a, __proto__: b});', Context.None],
  ]);

  pass('Expressions - Object (pass)', [
    { code: 'x= { prototype(){} }', options: { ranges: true } },
    { code: '({a: b = c} = [2])', options: { ranges: true } },
    { code: '({a: (b) = c} = [2])', options: { ranges: true } },
    { code: '({a: (b).c} = [2])', options: { ranges: true } },
    { code: '({a: (b).c = d} = [2])', options: { ranges: true } },
    { code: 'var a = { __proto__: { abc: 123 } };', options: { ranges: true } },
    { code: 'var b = { ["__proto__"]: { abc: 123 }};', options: { ranges: true } },
    { code: '({...x = y, y})', options: { ranges: true } },
    { code: '({...a,});', options: { ranges: true } },
    { code: '[...a] = []', options: { ranges: true } },
    { code: '({[sourceKey()]: target()[targetKey()]} = source());', options: { ranges: true } },
    { code: 'f(a, ...1 + 1, b)', options: { ranges: true } },
    { code: 'function *f(){   s = {"foo": yield}   }', options: { ranges: true } },
    'function *f(){   s = {"foo": yield /x/}   }',
    { code: '[{x : [{y:{z = 1}}] }] = [{x:[{y:{}}]}];', options: { ranges: true } },
    { code: 'function *f(){   s = {foo: yield /x/}   }', options: { ranges: true } },
    { code: 's = {"foo": await = x} = x', options: { ranges: true } },
    { code: 'function f([...[a, b]]){}', options: { ranges: true } },
    { code: 'function f({...a}){}', options: { ranges: true, loc: true } },
    '(z = {...x.y} = z) => z',
    { code: '({foo: typeof /x/});', options: { ranges: true } },
    { code: 'function *f(){   s = {foo: yield /x/g}   }', options: { ranges: true, loc: true } },
    '({...obj}) => {}',
    'function *f(){   s = {"foo": yield /x/g}   }',
    {
      code: `var callCount = 0;

  var C = class { static async *gen() {
      callCount += 1;
      yield {
          ...yield,
          y: 1,
          ...yield yield,
        };
  }}`,
      options: { ranges: true },
    },

    { code: 's = {foo: yield}', options: { ranges: true } },
    's = {foo: yield / x}',
    { code: '({...obj} = foo)', options: { ranges: true } },
    { code: 'let { x4: { ...y4 } } = z;', options: { ranges: true } },
    {
      code: `({
        把你想在页面内共享的变量写在这里喔 : 1,
        这是你刚选择的事件: function (e){
          //当按钮被长按时...
        }
        });`,
      options: { ranges: true },
    },
    {
      code: 'var {  a, "b": b1, [`c`]: c1, [d + "e"]: d1, [`${d}e`]: d2, ...e1 } = e;',
      options: { ranges: true, raw: true },
    },
    's = {foo: yield /x/g}',
    's = {"foo": yield /x/g}',
    { code: '({async *5(){}})', options: { ranges: true } },
    { code: '({async 8(){}})', options: { ranges: true } },
    { code: '({5(){}})', options: { ranges: true } },
    { code: '({"foo"(){}})', options: { ranges: true } },
    '({async "a b c"(){}});',
    { code: '({async 15(){}});', options: { loc: true } },
    { code: '({get "a b c"(){}});', options: { loc: true } },
    '({set 15(x){}});',
    '({async *[x](){}})',
    '({a:b,...obj} = foo)',

    '({async *ident(){}})',
    '({set ident(ident){}})',
    '({get ident(){}})',
    '({async ident(){}})',
    '({ident: {}.length} = x)',
    '({ident: {}.length = x} = x)',
    '({ident: [foo].length} = x)',
    '({ident: [foo].length = x} = x)',
    '({ident: {}.length} = x)',
    '({ident: {}.length = x} = x)',
    '({...obj} = {}) => {}',

    '({...x[0] }= {});',
    '({eval});',
    '({eval} = x);',
    '({...x[0] }= {});',
    '({...rest})',
    '({a, b, ...{c, e}})',
    '({ x, ...{y , z} })',
    '({a:b,...obj}) => {}',
    '({a,...obj}) => {}',
    'function f({ x, y, ...z }) {}',
    '({x, ...y} = {x, ...y})',
    '[(function() {})]',
    '([[ x ]] = [undefined]= {});',
    {
      code: 'someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
      options: { webcompat: true },
    },
    { code: '(function({x, ...y}) {})', options: { webcompat: true } },
    'fn = ({text = "default", ...props}) => text + props.children',
    '({x, ...y, a, ...b, c})',
    'assignmentResult = { x: x = yield } = value',
    '({l: 50..foo} = x)',
    '({s: "foo".foo} = x)',
    '({"foo": [x].foo}=y)',
    '({"foo": {x}.foo}=y)',
    '({"foo": 15..foo}=y)',
    '({a: x = true} = y)',
    '({a: {x} = true} = y)',
    '({a: {x = true} = true} = y)',
    '({"x": 600..xyz} = x)',
    '({...x.y} = z)',
    '({...x});',
    'x = ({a:b, c:d});',
    'x = ({a, c:d});',
    'x = ({a:b, c});',
    'x = ({a, c:d} = x);',
    'wrap({1:b, 2:d});',
    'x = ({"a":b});',
    'x = ({"a":b, "c":d});',
    'x = ({"a":b, "c":d});',
    'x = ({[a]:b});',
    'x = ({[a]:b, [15]:d});',
    'x = ({foo(){}});',
    '({typeof: x});',
    '({typeof: x} = y);',
    '({typeof: x}) => x;',
    '({get typeof(){}});',
    '({async typeof(){}});',
    '({async * typeof(){}});',
    'x = { async *[y](){} }',
    '({async "a b c"(){}});',
    '({async 15(){}});',
    '({get 15(){}});',
    '({set "a b c"(x){}});',
    '({set 15(x){}});',
    'x = ({async(){}});',
    'x = ({foo(){}, bar(){}});',
    'x = ({foo(a,b,c){}});',
    'x = ({1(){}});',
    'x = ({"foo"(){}});',
    { code: 'x = ({async foo(){}});', options: { ranges: true } },
    { code: 'x = ({async async(){}});', options: { ranges: true } },
    { code: 'x = ({async "foo"(){}});', options: { ranges: true } },
    'x = ({async 100(){}});',
    { code: 'wrap({async [foo](){}});', options: { ranges: true } },
    { code: 'x = ({async foo(){}, async bar(){}});', options: { ranges: true } },
    { code: '({x: y, z})', options: { ranges: true } },
    { code: 'x = ({async foo(){}, bar(){}});', options: { ranges: true } },
    'x = ({foo(){}, async bar(){}});',
    { code: 'x = ({*foo(){}});', options: { ranges: true } },
    { code: 'x = ({*get(){}});', options: { ranges: true } },
    'x = ({*async(){}});',
    'x = ({*"foo"(){}});',
    'x = ({*[foo](){}});',
    'x = ({* foo(){},*bar(){}});',
    'x = ({* foo(){}, bar(){}});',
    '({get foo(){}});',
    '({get get(){}});',
    '({get foo(){}, get bar(){}});',
    '({get foo(){}, bar(){}});',
    '({foo(){}, get bar(){}});',
    '({get [foo](){}});',
    '({get [foo](){}, [bar](){}});',
    '({[foo](){}, get [bar](){}});',
    '({get "foo"(){}});',
    '({...x, y})',
    '({get "foo"(){}});',
    '({get 123(){}});',
    '({set foo(a){}});',
    '({set get(a){}});',
    '({set foo(b){}, set bar(d){}});',
    '({set foo(c){}, bar(){}});',
    '({set [foo](a){}});',
    '({set [foo](b){}, set [bar](d){}});',
    '({set [foo](c){}, [bar](){}});',
    '({[foo](){}, set [bar](e){}});',
    '({set "foo"(a){}});',
    '({set 123(a){}});',
    '({foo: typeof x});',
    '({}=obj);',
    '({a}=obj);',
    '({a:b}=obj);',
    '({a, b}=obj);',
    '({a:b, c:d}=obj);',
    '({a, c:d}=obj);',
    '({a:b, c}=obj);',
    '({}=x);',
    '({a=b}=c);',
    '({a:v=b}=c);',
    '({foo(){}, set bar(e){}});',
    'x = ({foo(){}, *bar(){}});',
    'x = ({*123(){}});',
    'x = ({async get(){}});',
    '({get "a b c"(){}});',
    '({*typeof(){}});',
    '({typeof(){}});',
    'x = ({"a":b});',
    'x = ({a:b, c} = x);',
    '({[foo]: x} = y)',
    'a = {} = b',
    'a = {"a": b} = b',
    '({x})',
    '({x} = foo )',
    'a = {}',
    'a = {"a": b}',
    'x = {get}',
    'x = {async}',
    'x = {get} = x',
    'x = {async} = x',
    'x = {a:b}',
    'x = {get:b}',
    'x = {async:b}',
    'x = {a, b}',
    'x = {a, b} = x',
    'x = {a:b, c:d}',
    'x = {a, c:d}',
    'x = {a, c:d} = x',
    'x = {a:b, c} = x',
    { code: '({ [a]: {} [a] })', options: { ranges: true } },
    { code: 'x = {15:b}', options: { ranges: true } },
    { code: 'x = {.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e}', options: { ranges: true } },
    { code: 'x = {1:b, 0:d}', options: { ranges: true } },
    { code: 'x = {"a":b}', options: { ranges: true } },
    'x = {"a":b, "c":d}',
    'x = {[a]:b}',
    'x = {[a]:b, [15]:d}',
    'x = { *a() {} }',
    'x = {0(){}}',
    'x = {.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}}',
    'x = {"foo"(){}}',
    'x = {async foo(){}}',
    'x = {async async(){}}',
    'x = {async "foo"(){}}',
    'x = {async 100(){}}',
    'x = {async [foo](){}}',
    'x = {async foo(){}, async bar(){}}',
    'x = {async foo(){}, bar(){}}',
    'x = {foo(){}, async bar(){}}',
    'x = {*foo(){}}',
    'x = {*get(){}}',
    'x = {*set(){}}',
    'x = {*async(){}}',
    'x = {*"foo"(){}}',
    'x = {*123(){}}',
    'x = {*[foo](){}}',
    'x = {* foo(){},*bar(){}}',
    'x = {* foo(){}, bar(){}}',
    'x = {foo(){}, *bar(){}}',
    'x = {get foo(){}}',
    'x = {get get(){}}',
    'x = {get foo(){}, get bar(){}}',
    'x = {get foo(){}, bar(){}}',
    'x = {foo(){}, get bar(){}}',
    'x = {get [foo](){}}',

    'x = {get [foo](){}, get [bar](){}}',
    'x = {get [foo](){}, [bar](){}}',
    'x = {[foo](){}, get [bar](){}}',
    'x = {get "foo"(){}}',
    'x = {get 123(){}}',
    'x = {set foo(a){}}',
    { code: 'x = {set get(a){}}', options: { ranges: true } },
    { code: 'x = {foo: typeof x}', options: { ranges: true } },
    'x = {foo: true / false}',
    'x = {await}  = x',
    'x = {arguments}',
    'x = {eval}',
    'x = {"x": y+z}',
    'x = {"x": [y]}',
    'x = {"x": [y]} = x',
    'x = {"x": [y + x]}',
    'x = {"x": [y].slice(0)}',
    'x = {"x": {y: z}}',
    'x = {"x": {y: z}} = x',
    'x = {"x": {a: y + x}}',
    'x = {"x": {a: y + x}.slice(0)}',
    'x = {"x": 600}',
    'x = {"x": 600..xyz}',
    'x = {...y}',
    'x = {x, ...y}',
    'x = {a, ...y, b}',
    'x = {...y, b}',
    'x = {...a,}',
    { code: 'x = {...a=b}', options: { ranges: true } },
    'x = {...a + b}',
    { code: 'x = {...[a, b]}', options: { ranges: true } },
    { code: 'x = {...{a, b}}', options: { ranges: true } },
    { code: '({...a})', options: { ranges: true } },
    { code: '({...a=b})', options: { ranges: true } },
    '({...a+b})',
    '({...[a, b]})',
    '({...{a, b}})',
    'x = {...a, ...b}',
    { code: '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};', options: { ranges: true, raw: true } },

    { code: '({[foo()] : (z)} = z = {});', options: { ranges: true } },

    '({a: 1, a: 2})',
    '({a: 1, b: 3, a: 2})',
    '({b: x, a: 1, a: 2})',
    '({a: 1, a: 2, b: 3})',
    '({a, a})',
    '({a, a: 1})',
    '({a: 1, a})',
    'wrap({async "foo"(){}});',
    'wrap({async 100(){}});',
    'wrap({foo(){}, async bar(){}});',
    'wrap({*foo(){}});',
    'wrap({*get(){}});',
    'wrap({*set(){}});',
    'wrap({*async(){}});',
    'wrap({*"foo"(){}});',
    'wrap({*123(){}});',
    'wrap({*[foo](){}});',
    'wrap({* foo(){},*bar(){}});',
    'wrap({get foo(){}});',
    '(({a = 0}) => a)',
    '(({a = 0} = {}) => a)({})',
    '({x=1} = {});',
    '(({a = 0} = {}) => a)({a: 1})',
    'wrap({get get(){}});',
    'wrap({get foo(){}, get bar(){}});',
    'wrap({get foo(){}, bar(){}});',
    'wrap({foo(){}, get bar(){}});',
    'wrap({get [foo](){}});',
    'wrap({get [foo](){}, get [bar](){}});',
    'wrap({get [foo](){}, [bar](){}});',
    'wrap({[foo](){}, get [bar](){}});',
    'wrap({get "foo"(){}});',
    'wrap({get 123(){}});',
    'wrap({set get(a){}});',
    'wrap({set foo(b){}, set bar(d){}});',
    'wrap({set foo(c){}, bar(){}});',
    'wrap({set [foo](a){}});',
    'wrap({set [foo](b){}, set [bar](d){}});',
    'wrap({set [foo](c){}, [bar](){}});',
    'function x([a, b]){}',
    'wrap({set [foo]([a, b]){}});',
    'wrap({set "foo"(a){}});',
    'wrap({set 123(a){}});',
    '({foo: typeof x});',
    '({foo: true / false});',
    'wrap({}=obj);',
    'wrap({a}=obj);',
    'wrap({a:b}=obj);',
    'wrap({a, b}=obj);',
    'wrap({a:b, c:d}=obj);',
    'wrap({a, c:d}=obj);',
    'wrap({a:b, c}=obj);',

    '({x:let}) => null',
    'wrap({}=x);',
    'wrap({a=b}=c);',
    'wrap({a:v=b}=c);',
    '({x:let} = null)',
    '({x:let})',
    'wrap({a:b=x}=y);',
    'wrap({"a":b}=obj);',
    'wrap({"a":b, "c":d}=obj);',
    '({"x": y+z})',
    '({"x": [y]})',
    { code: '({"x": [y]} = x)', options: { ranges: true } },
    '({"x": [y]}) => x',
    { code: '({"x": [y + x]})', options: { ranges: true } },
    '({"x": [y].slice(0)})',
    '({"x": {y: z}})',
    { code: '({"x": {y: z}} = x)', options: { ranges: true } },
    '({"x": {a: y + x}})',
    { code: '({"x": {a: y + x}.slice(0)})', options: { ranges: true } },
    '({"x": 600})',
    { code: '({"x": 600..xyz})', options: { ranges: true } },
    { code: 'wrap({[a]:b}=obj);', options: { ranges: true } },
    { code: 'wrap({[a]:b, [15]:d}=obj);', options: { ranges: true } },
    'x, {foo, bar} = doo',
    'x, {foo = y, bar} = doo',
    'x = {a, b} = y',
    '({a, b} = c = d)',
    'result = [x[yield]] = vals;',
    { code: '({ x: x[Y] } = x);', options: { ranges: true } },
    'a={"b":c=d}',
    's = {s: true}',
    's = {s: this}',
    's = {"foo": this}',
    'x={...true}',
    { code: '({x = 1} = {});', options: { ranges: true } },
    { code: '({x, y = 1, z = 2} = {});', options: { ranges: true } },
    {
      code: '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      options: { ranges: true, raw: true },
    },
    {
      code: '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      options: { ranges: true, raw: true },
    },
    '({*ident(){}})',
    '({*get(){}})',
    '({*set(){}})',
    '({*async(){}})',
    '({653: [x].foo})',
    '({"x": {y: z}}) => x',
    '({"a":b}=obj);',
    '({"x": [y]} = x)',
    'o = {f(f) { }}',
    'function *f(){   s = {"foo": yield}   }',
    'function *f(){   s = {foo: yield}   }',
    '({[foo]: x} = x) => y',
    'var someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
    '({x, ...y, a, ...b, c})',
    'z = {x, ...y}',
    'let z = {...x}',
    '({a:b,...obj}) => {}',
    '({a,...obj}) => {}',
    '({...obj} = {}) => {}',
    '({a:b,...obj} = foo)',
    '({a,...obj} = foo)',
    { code: '({...(a,b),c})', options: { ranges: true } },
    { code: '({...a,b,c})', options: { ranges: true } },

    'x = {__proto__: a, __proto__: b} = y',
    '({__proto__: a, __proto__: b} = x)',
    '({x:a["x"]} = {x:20});',
    'async function wrap() { ({a = await b} = obj) }',
    '({x:y} = {});',
    { code: '({y:y2} = {y:y2-2})', options: { ranges: true, raw: true } },
    '({async foo(a) { await a }});',
    '({async, foo})',
    'o({async await() { }})',
    'async ({a: b = c})',
    '({ async *foo() {} })',
    '({x, y} = o)',
    '({ enum: 0 })',
    '({a(b,c){}})',
    '({set a(eval){}})',
    '({ set a([{b = 0}]){}, })',
    '({a(b,...c){}})',
    '(a, {b}) => {}',
    'x = {__proto__(){}, __proto__: 2}',
    'x = {__proto__(){}, __proto__(){}}',
    'x = {async __proto__(){}, *__proto__(){}}',
    'x = {...y}',
    'x = {x, ...y}',
    'x = {...a=b}',

    { code: '({...x=y});', options: { ranges: true } },
    { code: 'x = {...a + b}', options: { ranges: true } },
    { code: 'x = {a, ...y, b}', options: { ranges: true } },
    '({"x": {y: z}}) => x',
    { code: '({1n:1})', options: { ranges: true } },
  ]);
});
