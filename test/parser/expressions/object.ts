import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
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
    [
      'x= { prototype(){} }',
      Context.OptionsRanges,
      
    ],
    [
      '({a: b = c} = [2])',
      Context.OptionsRanges,
      
    ],
    [
      '({a: (b) = c} = [2])',
      Context.OptionsRanges,
      
    ],
    [
      '({a: (b).c} = [2])',
      Context.OptionsRanges,
      
    ],
    [
      '({a: (b).c = d} = [2])',
      Context.OptionsRanges,
      
    ],
    [
      'var a = { __proto__: { abc: 123 } };',
      Context.OptionsRanges,
      
    ],
    [
      'var b = { ["__proto__"]: { abc: 123 }};',
      Context.OptionsRanges,
      
    ],
    [
      '({...x = y, y})',
      Context.OptionsRanges,
      
    ],
    [
      '({...a,});',
      Context.OptionsRanges,
      
    ],
    [
      '[...a] = []',
      Context.OptionsRanges,
      
    ],
    [
      '({[sourceKey()]: target()[targetKey()]} = source());',
      Context.OptionsRanges,
      
    ],
    [
      'f(a, ...1 + 1, b)',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){   s = {"foo": yield}   }',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){   s = {"foo": yield /x/}   }',
      Context.None,
      
    ],
    [
      '[{x : [{y:{z = 1}}] }] = [{x:[{y:{}}]}];',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){   s = {foo: yield /x/}   }',
      Context.OptionsRanges,
      
    ],
    [
      's = {"foo": await = x} = x',
      Context.OptionsRanges,
      
    ],
    [
      'function f([...[a, b]]){}',
      Context.OptionsRanges,
      
    ],
    [
      'function f({...a}){}',
      Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      '(z = {...x.y} = z) => z',
      Context.None,
      
    ],
    [
      '({foo: typeof /x/});',
      Context.OptionsRanges,
      
    ],
    [
      'function *f(){   s = {foo: yield /x/g}   }',
      Context.OptionsRanges | Context.OptionsLoc,
      
    ],
    [
      '({...obj}) => {}',
      Context.None,
      
    ],
    [
      'function *f(){   s = {"foo": yield /x/g}   }',
      Context.None,
      
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
      Context.OptionsRanges,
      
    ],

    [
      's = {foo: yield}',
      Context.OptionsRanges,
      
    ],
    [
      's = {foo: yield / x}',
      Context.None,
      
    ],
    [
      '({...obj} = foo)',
      Context.OptionsRanges,
      
    ],
    [
      'let { x4: { ...y4 } } = z;',
      Context.OptionsRanges,
      
    ],
    [
      `({
        把你想在页面内共享的变量写在这里喔 : 1,
        这是你刚选择的事件: function (e){
          //当按钮被长按时...
        }
        });`,
      Context.OptionsRanges,
      
    ],
    [
      'var {  a, "b": b1, [`c`]: c1, [d + "e"]: d1, [`${d}e`]: d2, ...e1 } = e;',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      's = {foo: yield /x/g}',
      Context.None,
      
    ],
    [
      's = {"foo": yield /x/g}',
      Context.None,
      
    ],
    [
      '({async *5(){}})',
      Context.OptionsRanges,
      
    ],
    [
      '({async 8(){}})',
      Context.OptionsRanges,
      
    ],
    [
      '({5(){}})',
      Context.OptionsRanges,
      
    ],
    [
      '({"foo"(){}})',
      Context.OptionsRanges,
      
    ],
    [
      '({async "a b c"(){}});',
      Context.None,
      
    ],
    [
      '({async 15(){}});',
      Context.OptionsLoc,
      
    ],
    [
      '({get "a b c"(){}});',
      Context.OptionsLoc,
      
    ],
    [
      '({set 15(x){}});',
      Context.None,
      
    ],
    [
      '({async *[x](){}})',
      Context.None,
      
    ],
    [
      '({a:b,...obj} = foo)',
      Context.None,
      
    ],

    [
      '({async *ident(){}})',
      Context.None,
      
    ],
    [
      '({set ident(ident){}})',
      Context.None,
      
    ],
    [
      '({get ident(){}})',
      Context.None,
      
    ],
    [
      '({async ident(){}})',
      Context.None,
      
    ],
    [
      '({ident: {}.length} = x)',
      Context.None,
      
    ],
    [
      '({ident: {}.length = x} = x)',
      Context.None,
      
    ],
    [
      '({ident: [foo].length} = x)',
      Context.None,
      
    ],
    [
      '({ident: [foo].length = x} = x)',
      Context.None,
      
    ],
    [
      '({ident: {}.length} = x)',
      Context.None,
      
    ],
    [
      '({ident: {}.length = x} = x)',
      Context.None,
      
    ],
    [
      '({...obj} = {}) => {}',
      Context.None,
      
    ],

    [
      '({...x[0] }= {});',
      Context.None,
      
    ],
    [
      '({eval});',
      Context.None,
      
    ],
    [
      '({eval} = x);',
      Context.None,
      
    ],
    [
      '({...x[0] }= {});',
      Context.None,
      
    ],
    [
      '({...rest})',
      Context.None,
      
    ],
    [
      '({a, b, ...{c, e}})',
      Context.None,
      
    ],
    [
      '({ x, ...{y , z} })',
      Context.None,
      
    ],
    [
      '({a:b,...obj}) => {}',
      Context.None,
      
    ],
    [
      '({a,...obj}) => {}',
      Context.None,
      
    ],
    [
      'function f({ x, y, ...z }) {}',
      Context.None,
      
    ],
    [
      '({x, ...y} = {x, ...y})',
      Context.None,
      
    ],
    [
      '[(function() {})]',
      Context.None,
      
    ],
    [
      '([[ x ]] = [undefined]= {});',
      Context.None,
      
    ],
    [
      'someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
      Context.OptionsWebCompat,
      
    ],
    [
      '(function({x, ...y}) {})',
      Context.OptionsWebCompat,
      
    ],
    [
      'fn = ({text = "default", ...props}) => text + props.children',
      Context.None,
      
    ],
    [
      '({x, ...y, a, ...b, c})',
      Context.None,
      
    ],
    [
      'assignmentResult = { x: x = yield } = value',
      Context.None,
      
    ],
    [
      '({l: 50..foo} = x)',
      Context.None,
      
    ],
    [
      '({s: "foo".foo} = x)',
      Context.None,
      
    ],
    [
      '({"foo": [x].foo}=y)',
      Context.None,
      
    ],
    [
      '({"foo": {x}.foo}=y)',
      Context.None,
      
    ],
    [
      '({"foo": 15..foo}=y)',
      Context.None,
      
    ],
    [
      '({a: x = true} = y)',
      Context.None,
      
    ],
    [
      '({a: {x} = true} = y)',
      Context.None,
      
    ],
    [
      '({a: {x = true} = true} = y)',
      Context.None,
      
    ],
    [
      '({"x": 600..xyz} = x)',
      Context.None,
      
    ],
    [
      '({...x.y} = z)',
      Context.None,
      
    ],
    [
      '({...x});',
      Context.None,
      
    ],
    [
      'x = ({a:b, c:d});',
      Context.None,
      
    ],
    [
      'x = ({a, c:d});',
      Context.None,
      
    ],
    [
      'x = ({a:b, c});',
      Context.None,
      
    ],
    [
      'x = ({a, c:d} = x);',
      Context.None,
      
    ],
    [
      'wrap({1:b, 2:d});',
      Context.None,
      
    ],
    [
      'x = ({"a":b});',
      Context.None,
      
    ],
    [
      'x = ({"a":b, "c":d});',
      Context.None,
      
    ],
    [
      'x = ({"a":b, "c":d});',
      Context.None,
      
    ],
    [
      'x = ({[a]:b});',
      Context.None,
      
    ],
    [
      'x = ({[a]:b, [15]:d});',
      Context.None,
      
    ],
    [
      'x = ({foo(){}});',
      Context.None,
      
    ],
    [
      '({typeof: x});',
      Context.None,
      
    ],
    [
      '({typeof: x} = y);',
      Context.None,
      
    ],
    [
      '({typeof: x}) => x;',
      Context.None,
      
    ],
    [
      '({get typeof(){}});',
      Context.None,
      
    ],
    [
      '({async typeof(){}});',
      Context.None,
      
    ],
    [
      '({async * typeof(){}});',
      Context.None,
      
    ],
    [
      'x = { async *[y](){} }',
      Context.None,
      
    ],
    [
      '({async "a b c"(){}});',
      Context.None,
      
    ],
    [
      '({async 15(){}});',
      Context.None,
      
    ],
    [
      '({get 15(){}});',
      Context.None,
      
    ],
    [
      '({set "a b c"(x){}});',
      Context.None,
      
    ],
    [
      '({set 15(x){}});',
      Context.None,
      
    ],
    [
      'x = ({async(){}});',
      Context.None,
      
    ],
    [
      'x = ({foo(){}, bar(){}});',
      Context.None,
      
    ],
    [
      'x = ({foo(a,b,c){}});',
      Context.None,
      
    ],
    [
      'x = ({1(){}});',
      Context.None,
      
    ],
    [
      'x = ({"foo"(){}});',
      Context.None,
      
    ],
    [
      'x = ({async foo(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({async async(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({async "foo"(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({async 100(){}});',
      Context.None,
      
    ],
    [
      'wrap({async [foo](){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({async foo(){}, async bar(){}});',
      Context.OptionsRanges,
      
    ],
    [
      '({x: y, z})',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({async foo(){}, bar(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({foo(){}, async bar(){}});',
      Context.None,
      
    ],
    [
      'x = ({*foo(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({*get(){}});',
      Context.OptionsRanges,
      
    ],
    [
      'x = ({*async(){}});',
      Context.None,
      
    ],
    [
      'x = ({*"foo"(){}});',
      Context.None,
      
    ],
    [
      'x = ({*[foo](){}});',
      Context.None,
      
    ],
    [
      'x = ({* foo(){},*bar(){}});',
      Context.None,
      
    ],
    [
      'x = ({* foo(){}, bar(){}});',
      Context.None,
      
    ],
    [
      '({get foo(){}});',
      Context.None,
      
    ],
    [
      '({get get(){}});',
      Context.None,
      
    ],
    [
      '({get foo(){}, get bar(){}});',
      Context.None,
      
    ],
    [
      '({get foo(){}, bar(){}});',
      Context.None,
      
    ],
    [
      '({foo(){}, get bar(){}});',
      Context.None,
      
    ],
    [
      '({get [foo](){}});',
      Context.None,
      
    ],
    [
      '({get [foo](){}, [bar](){}});',
      Context.None,
      
    ],
    [
      '({[foo](){}, get [bar](){}});',
      Context.None,
      
    ],
    [
      '({get "foo"(){}});',
      Context.None,
      
    ],
    [
      '({...x, y})',
      Context.None,
      
    ],
    [
      '({get "foo"(){}});',
      Context.None,
      
    ],
    [
      '({get 123(){}});',
      Context.None,
      
    ],
    [
      '({set foo(a){}});',
      Context.None,
      
    ],
    [
      '({set get(a){}});',
      Context.None,
      
    ],
    [
      '({set foo(b){}, set bar(d){}});',
      Context.None,
      
    ],
    [
      '({set foo(c){}, bar(){}});',
      Context.None,
      
    ],
    [
      '({set [foo](a){}});',
      Context.None,
      
    ],
    [
      '({set [foo](b){}, set [bar](d){}});',
      Context.None,
      
    ],
    [
      '({set [foo](c){}, [bar](){}});',
      Context.None,
      
    ],
    [
      '({[foo](){}, set [bar](e){}});',
      Context.None,
      
    ],
    [
      '({set "foo"(a){}});',
      Context.None,
      
    ],
    [
      '({set 123(a){}});',
      Context.None,
      
    ],
    [
      '({foo: typeof x});',
      Context.None,
      
    ],
    [
      '({}=obj);',
      Context.None,
      
    ],
    [
      '({a}=obj);',
      Context.None,
      
    ],
    [
      '({a:b}=obj);',
      Context.None,
      
    ],
    [
      '({a, b}=obj);',
      Context.None,
      
    ],
    [
      '({a:b, c:d}=obj);',
      Context.None,
      
    ],
    [
      '({a, c:d}=obj);',
      Context.None,
      
    ],
    [
      '({a:b, c}=obj);',
      Context.None,
      
    ],
    [
      '({}=x);',
      Context.None,
      
    ],
    [
      '({a=b}=c);',
      Context.None,
      
    ],
    [
      '({a:v=b}=c);',
      Context.None,
      
    ],
    [
      '({foo(){}, set bar(e){}});',
      Context.None,
      
    ],
    [
      'x = ({foo(){}, *bar(){}});',
      Context.None,
      
    ],
    [
      'x = ({*123(){}});',
      Context.None,
      
    ],
    [
      'x = ({async get(){}});',
      Context.None,
      
    ],
    [
      '({get "a b c"(){}});',
      Context.None,
      
    ],
    [
      '({*typeof(){}});',
      Context.None,
      
    ],
    [
      '({typeof(){}});',
      Context.None,
      
    ],
    [
      'x = ({"a":b});',
      Context.None,
      
    ],
    [
      'x = ({a:b, c} = x);',
      Context.None,
      
    ],
    [
      '({[foo]: x} = y)',
      Context.None,
      
    ],
    [
      'a = {} = b',
      Context.None,
      
    ],
    [
      'a = {"a": b} = b',
      Context.None,
      
    ],
    [
      '({x})',
      Context.None,
      
    ],
    [
      '({x} = foo )',
      Context.None,
      
    ],
    [
      'a = {}',
      Context.None,
      
    ],
    [
      'a = {"a": b}',
      Context.None,
      
    ],
    [
      'x = {get}',
      Context.None,
      
    ],
    [
      'x = {async}',
      Context.None,
      
    ],
    [
      'x = {get} = x',
      Context.None,
      
    ],
    [
      'x = {async} = x',
      Context.None,
      
    ],
    [
      'x = {a:b}',
      Context.None,
      
    ],
    [
      'x = {get:b}',
      Context.None,
      
    ],
    [
      'x = {async:b}',
      Context.None,
      
    ],
    [
      'x = {a, b}',
      Context.None,
      
    ],
    [
      'x = {a, b} = x',
      Context.None,
      
    ],
    [
      'x = {a:b, c:d}',
      Context.None,
      
    ],
    [
      'x = {a, c:d}',
      Context.None,
      
    ],
    [
      'x = {a, c:d} = x',
      Context.None,
      
    ],
    [
      'x = {a:b, c} = x',
      Context.None,
      
    ],
    [
      '({ [a]: {} [a] })',
      Context.OptionsRanges,
      
    ],
    [
      'x = {15:b}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {1:b, 0:d}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {"a":b}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {"a":b, "c":d}',
      Context.None,
      
    ],
    [
      'x = {[a]:b}',
      Context.None,
      
    ],
    [
      'x = {[a]:b, [15]:d}',
      Context.None,
      
    ],
    [
      'x = { *a() {} }',
      Context.None,
      
    ],
    [
      'x = {0(){}}',
      Context.None,
      
    ],
    [
      'x = {.9(){}, 0x84(){}, 0b1(){}, 0o27(){}, 1e234(){}}',
      Context.None,
      
    ],
    [
      'x = {"foo"(){}}',
      Context.None,
      
    ],
    [
      'x = {async foo(){}}',
      Context.None,
      
    ],
    [
      'x = {async async(){}}',
      Context.None,
      
    ],
    [
      'x = {async "foo"(){}}',
      Context.None,
      
    ],
    [
      'x = {async 100(){}}',
      Context.None,
      
    ],
    [
      'x = {async [foo](){}}',
      Context.None,
      
    ],
    [
      'x = {async foo(){}, async bar(){}}',
      Context.None,
      
    ],
    [
      'x = {async foo(){}, bar(){}}',
      Context.None,
      
    ],
    [
      'x = {foo(){}, async bar(){}}',
      Context.None,
      
    ],
    [
      'x = {*foo(){}}',
      Context.None,
      
    ],
    [
      'x = {*get(){}}',
      Context.None,
      
    ],
    [
      'x = {*set(){}}',
      Context.None,
      
    ],
    [
      'x = {*async(){}}',
      Context.None,
      
    ],
    [
      'x = {*"foo"(){}}',
      Context.None,
      
    ],
    [
      'x = {*123(){}}',
      Context.None,
      
    ],
    [
      'x = {*[foo](){}}',
      Context.None,
      
    ],
    [
      'x = {* foo(){},*bar(){}}',
      Context.None,
      
    ],
    [
      'x = {* foo(){}, bar(){}}',
      Context.None,
      
    ],
    [
      'x = {foo(){}, *bar(){}}',
      Context.None,
      
    ],
    [
      'x = {get foo(){}}',
      Context.None,
      
    ],
    [
      'x = {get get(){}}',
      Context.None,
      
    ],
    [
      'x = {get foo(){}, get bar(){}}',
      Context.None,
      
    ],
    [
      'x = {get foo(){}, bar(){}}',
      Context.None,
      
    ],
    [
      'x = {foo(){}, get bar(){}}',
      Context.None,
      
    ],
    [
      'x = {get [foo](){}}',
      Context.None,
      
    ],

    [
      'x = {get [foo](){}, get [bar](){}}',
      Context.None,
      
    ],
    [
      'x = {get [foo](){}, [bar](){}}',
      Context.None,
      
    ],
    [
      'x = {[foo](){}, get [bar](){}}',
      Context.None,
      
    ],
    [
      'x = {get "foo"(){}}',
      Context.None,
      
    ],
    [
      'x = {get 123(){}}',
      Context.None,
      
    ],
    [
      'x = {set foo(a){}}',
      Context.None,
      
    ],
    [
      'x = {set get(a){}}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {foo: typeof x}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {foo: true / false}',
      Context.None,
      
    ],
    [
      'x = {await}  = x',
      Context.None,
      
    ],
    [
      'x = {arguments}',
      Context.None,
      
    ],
    [
      'x = {eval}',
      Context.None,
      
    ],
    [
      'x = {"x": y+z}',
      Context.None,
      
    ],
    [
      'x = {"x": [y]}',
      Context.None,
      
    ],
    [
      'x = {"x": [y]} = x',
      Context.None,
      
    ],
    [
      'x = {"x": [y + x]}',
      Context.None,
      
    ],
    [
      'x = {"x": [y].slice(0)}',
      Context.None,
      
    ],
    [
      'x = {"x": {y: z}}',
      Context.None,
      
    ],
    [
      'x = {"x": {y: z}} = x',
      Context.None,
      
    ],
    [
      'x = {"x": {a: y + x}}',
      Context.None,
      
    ],
    [
      'x = {"x": {a: y + x}.slice(0)}',
      Context.None,
      
    ],
    [
      'x = {"x": 600}',
      Context.None,
      
    ],
    [
      'x = {"x": 600..xyz}',
      Context.None,
      
    ],
    [
      'x = {...y}',
      Context.None,
      
    ],
    [
      'x = {x, ...y}',
      Context.None,
      
    ],
    [
      'x = {a, ...y, b}',
      Context.None,
      
    ],
    [
      'x = {...y, b}',
      Context.None,
      
    ],
    [
      'x = {...a,}',
      Context.None,
      
    ],
    [
      'x = {...a=b}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {...a + b}',
      Context.None,
      
    ],
    [
      'x = {...[a, b]}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {...{a, b}}',
      Context.OptionsRanges,
      
    ],
    [
      '({...a})',
      Context.OptionsRanges,
      
    ],
    [
      '({...a=b})',
      Context.OptionsRanges,
      
    ],
    [
      '({...a+b})',
      Context.None,
      
    ],
    [
      '({...[a, b]})',
      Context.None,
      
    ],
    [
      '({...{a, b}})',
      Context.None,
      
    ],
    [
      'x = {...a, ...b}',
      Context.None,
      
    ],
    [
      '[{x:x = 1, y:y = 2}, [a = 3, b = 4, c = 5]] = {};',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],

    [
      '({[foo()] : (z)} = z = {});',
      Context.OptionsRanges,
      
    ],

    [
      '({a: 1, a: 2})',
      Context.None,
      
    ],
    [
      '({a: 1, b: 3, a: 2})',
      Context.None,
      
    ],
    [
      '({b: x, a: 1, a: 2})',
      Context.None,
      
    ],
    [
      '({a: 1, a: 2, b: 3})',
      Context.None,
      
    ],
    [
      '({a, a})',
      Context.None,
      
    ],
    [
      '({a, a: 1})',
      Context.None,
      
    ],
    [
      '({a: 1, a})',
      Context.None,
      
    ],
    [
      'wrap({async "foo"(){}});',
      Context.None,
      
    ],
    [
      'wrap({async 100(){}});',
      Context.None,
      
    ],
    [
      'wrap({foo(){}, async bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({*foo(){}});',
      Context.None,
      
    ],
    [
      'wrap({*get(){}});',
      Context.None,
      
    ],
    [
      'wrap({*set(){}});',
      Context.None,
      
    ],
    [
      'wrap({*async(){}});',
      Context.None,
      
    ],
    [
      'wrap({*"foo"(){}});',
      Context.None,
      
    ],
    [
      'wrap({*123(){}});',
      Context.None,
      
    ],
    [
      'wrap({*[foo](){}});',
      Context.None,
      
    ],
    [
      'wrap({* foo(){},*bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({get foo(){}});',
      Context.None,
      
    ],
    [
      '(({a = 0}) => a)',
      Context.None,
      
    ],
    [
      '(({a = 0} = {}) => a)({})',
      Context.None,
      
    ],
    [
      '({x=1} = {});',
      Context.None,
      
    ],
    [
      '(({a = 0} = {}) => a)({a: 1})',
      Context.None,
      
    ],
    [
      'wrap({get get(){}});',
      Context.None,
      
    ],
    [
      'wrap({get foo(){}, get bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({get foo(){}, bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({foo(){}, get bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({get [foo](){}});',
      Context.None,
      
    ],
    [
      'wrap({get [foo](){}, get [bar](){}});',
      Context.None,
      
    ],
    [
      'wrap({get [foo](){}, [bar](){}});',
      Context.None,
      
    ],
    [
      'wrap({[foo](){}, get [bar](){}});',
      Context.None,
      
    ],
    [
      'wrap({get "foo"(){}});',
      Context.None,
      
    ],
    [
      'wrap({get 123(){}});',
      Context.None,
      
    ],
    [
      'wrap({set get(a){}});',
      Context.None,
      
    ],
    [
      'wrap({set foo(b){}, set bar(d){}});',
      Context.None,
      
    ],
    [
      'wrap({set foo(c){}, bar(){}});',
      Context.None,
      
    ],
    [
      'wrap({set [foo](a){}});',
      Context.None,
      
    ],
    [
      'wrap({set [foo](b){}, set [bar](d){}});',
      Context.None,
      
    ],
    [
      'wrap({set [foo](c){}, [bar](){}});',
      Context.None,
      
    ],
    [
      'function x([a, b]){}',
      Context.None,
      
    ],
    [
      'wrap({set [foo]([a, b]){}});',
      Context.None,
      
    ],
    [
      'wrap({set "foo"(a){}});',
      Context.None,
      
    ],
    [
      'wrap({set 123(a){}});',
      Context.None,
      
    ],
    [
      '({foo: typeof x});',
      Context.None,
      
    ],
    [
      '({foo: true / false});',
      Context.None,
      
    ],
    [
      'wrap({}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a:b}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a, b}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a:b, c:d}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a, c:d}=obj);',
      Context.None,
      
    ],
    [
      'wrap({a:b, c}=obj);',
      Context.None,
      
    ],

    [
      '({x:let}) => null',
      Context.None,
      
    ],
    [
      'wrap({}=x);',
      Context.None,
      
    ],
    [
      'wrap({a=b}=c);',
      Context.None,
      
    ],
    [
      'wrap({a:v=b}=c);',
      Context.None,
      
    ],
    [
      '({x:let} = null)',
      Context.None,
      
    ],
    [
      '({x:let})',
      Context.None,
      
    ],
    [
      'wrap({a:b=x}=y);',
      Context.None,
      
    ],
    [
      'wrap({"a":b}=obj);',
      Context.None,
      
    ],
    [
      'wrap({"a":b, "c":d}=obj);',
      Context.None,
      
    ],
    [
      '({"x": y+z})',
      Context.None,
      
    ],
    [
      '({"x": [y]})',
      Context.None,
      
    ],
    [
      '({"x": [y]} = x)',
      Context.OptionsRanges,
      
    ],
    [
      '({"x": [y]}) => x',
      Context.None,
      
    ],
    [
      '({"x": [y + x]})',
      Context.OptionsRanges,
      
    ],
    [
      '({"x": [y].slice(0)})',
      Context.None,
      
    ],
    [
      '({"x": {y: z}})',
      Context.None,
      
    ],
    [
      '({"x": {y: z}} = x)',
      Context.OptionsRanges,
      
    ],
    [
      '({"x": {a: y + x}})',
      Context.None,
      
    ],
    [
      '({"x": {a: y + x}.slice(0)})',
      Context.OptionsRanges,
      
    ],
    [
      '({"x": 600})',
      Context.None,
      
    ],
    [
      '({"x": 600..xyz})',
      Context.OptionsRanges,
      
    ],
    [
      'wrap({[a]:b}=obj);',
      Context.OptionsRanges,
      
    ],
    [
      'wrap({[a]:b, [15]:d}=obj);',
      Context.OptionsRanges,
      
    ],
    [
      'x, {foo, bar} = doo',
      Context.None,
      
    ],
    [
      'x, {foo = y, bar} = doo',
      Context.None,
      
    ],
    [
      'x = {a, b} = y',
      Context.None,
      
    ],
    [
      '({a, b} = c = d)',
      Context.None,
      
    ],
    [
      'result = [x[yield]] = vals;',
      Context.None,
      
    ],
    [
      '({ x: x[Y] } = x);',
      Context.OptionsRanges,
      
    ],
    [
      'a={"b":c=d}',
      Context.None,
      
    ],
    [
      's = {s: true}',
      Context.None,
      
    ],
    [
      's = {s: this}',
      Context.None,
      
    ],
    [
      's = {"foo": this}',
      Context.None,
      
    ],
    [
      'x={...true}',
      Context.None,
      
    ],
    [
      '({x = 1} = {});',
      Context.OptionsRanges,
      
    ],
    [
      '({x, y = 1, z = 2} = {});',
      Context.OptionsRanges,
      
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '({*ident(){}})',
      Context.None,
      
    ],
    [
      '({*get(){}})',
      Context.None,
      
    ],
    [
      '({*set(){}})',
      Context.None,
      
    ],
    [
      '({*async(){}})',
      Context.None,
      
    ],
    [
      '({653: [x].foo})',
      Context.None,
      
    ],
    [
      '({"x": {y: z}}) => x',
      Context.None,
      
    ],
    [
      '({"a":b}=obj);',
      Context.None,
      
    ],
    [
      '({"x": [y]} = x)',
      Context.None,
      
    ],
    [
      'o = {f(f) { }}',
      Context.None,
      
    ],
    [
      'function *f(){   s = {"foo": yield}   }',
      Context.None,
      
    ],
    [
      'function *f(){   s = {foo: yield}   }',
      Context.None,
      
    ],
    [
      '({[foo]: x} = x) => y',
      Context.None,
      
    ],
    [
      'var someObject = { someKey: { ...mapGetters([ "some_val_1", "some_val_2" ]) } }',
      Context.None,
      
    ],
    [
      '({x, ...y, a, ...b, c})',
      Context.None,
      
    ],
    [
      'z = {x, ...y}',
      Context.None,
      
    ],
    [
      'let z = {...x}',
      Context.None,
      
    ],
    [
      '({a:b,...obj}) => {}',
      Context.None,
      
    ],
    [
      '({a,...obj}) => {}',
      Context.None,
      
    ],
    [
      '({...obj} = {}) => {}',
      Context.None,
      
    ],
    [
      '({a:b,...obj} = foo)',
      Context.None,
      
    ],
    [
      '({a,...obj} = foo)',
      Context.None,
      
    ],
    [
      '({...(a,b),c})',
      Context.OptionsRanges,
      
    ],
    [
      '({...a,b,c})',
      Context.OptionsRanges,
      
    ],

    [
      'x = {__proto__: a, __proto__: b} = y',
      Context.None,
      
    ],
    [
      '({__proto__: a, __proto__: b} = x)',
      Context.None,
      
    ],
    [
      '({x:a["x"]} = {x:20});',
      Context.None,
      
    ],
    [
      'async function wrap() { ({a = await b} = obj) }',
      Context.None,
      
    ],
    [
      '({x:y} = {});',
      Context.None,
      
    ],
    [
      '({y:y2} = {y:y2-2})',
      Context.OptionsRanges | Context.OptionsRaw,
      
    ],
    [
      '({async foo(a) { await a }});',
      Context.None,
      
    ],
    [
      '({async, foo})',
      Context.None,
      
    ],
    [
      'o({async await() { }})',
      Context.None,
      
    ],
    [
      'async ({a: b = c})',
      Context.None,
      
    ],
    [
      '({ async *foo() {} })',
      Context.None,
      
    ],
    [
      '({x, y} = o)',
      Context.None,
      
    ],
    [
      '({ enum: 0 })',
      Context.None,
      
    ],
    [
      '({a(b,c){}})',
      Context.None,
      
    ],
    [
      '({set a(eval){}})',
      Context.None,
      
    ],
    [
      '({ set a([{b = 0}]){}, })',
      Context.None,
      
    ],
    [
      '({a(b,...c){}})',
      Context.None,
      
    ],
    [
      '(a, {b}) => {}',
      Context.None,
      
    ],
    [
      'x = {__proto__(){}, __proto__: 2}',
      Context.None,
      
    ],
    [
      'x = {__proto__(){}, __proto__(){}}',
      Context.None,
      
    ],
    [
      'x = {async __proto__(){}, *__proto__(){}}',
      Context.None,
      
    ],
    [
      'x = {...y}',
      Context.None,
      
    ],
    [
      'x = {x, ...y}',
      Context.None,
      
    ],
    [
      'x = {...a=b}',
      Context.None,
      
    ],

    [
      '({...x=y});',
      Context.OptionsRanges,
      
    ],
    [
      'x = {...a + b}',
      Context.OptionsRanges,
      
    ],
    [
      'x = {a, ...y, b}',
      Context.OptionsRanges,
      
    ],
    [
      '({"x": {y: z}}) => x',
      Context.None,
      
    ],
    [
      '({1n:1})',
      Context.OptionsRanges,
      
    ],
  ]);
});
