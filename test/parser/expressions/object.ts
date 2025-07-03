import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
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
        parseSource(`x = ${arg}`, { webcompat: true });
      });
    });

    it(`(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg})`, { webcompat: true });
      });
    });

    it(`(${arg})`, () => {
      t.doesNotThrow(() => {
        parseSource(`(${arg})`, { webcompat: true, lexical: true });
      });
    });

    it(`'use strict'; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; x = ${arg}`);
      });
    });

    it(`'use strict'; x = ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; x = ${arg}`, { next: true });
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
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
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
        parseSource(`({${arg}});`);
      });
    });

    it(`"use strict"; ({${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({${arg}});`);
      });
    });

    it(`x = {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = {${arg}};`);
      });
    });

    it(`x = {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = {${arg}};`, { webcompat: true });
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
        parseSource(`({${arg}} = x);`, { next: true });
      });
    });

    it(`({${arg}} = x) => x;`, () => {
      t.throws(() => {
        parseSource(`({${arg}} = x) => x;`, { next: true, webcompat: true });
      });
    });

    it(`({${arg}} = x) => x;`, () => {
      t.throws(() => {
        parseSource(`({x: ${arg}} = x) => x;`, { next: true });
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`, { next: true });
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`);
      });
    });

    it(`({x: ${arg}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({x: ${arg}});`, { webcompat: true });
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
        parseSource(`"use strict";  ({ ${arg} });`, { next: true });
      });
    });
  }

  for (const arg of ['eval', 'arguments']) {
    it(`({ ${arg} } = x);`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} } = x);`, { impliedStrict: true });
      });
    });
    it(`({ ${arg} } = x);`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} } = x);`, { lexical: true, impliedStrict: true });
      });
    });
    it(`({ ${arg} }) => x;`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) => x;`, { impliedStrict: true });
      });
    });
    it(`({ ${arg} }) => x;`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) => x;`, { webcompat: true, impliedStrict: true });
      });
    });
    it(`const { ${arg} } = x;`, () => {
      t.throws(() => {
        parseSource(`const { ${arg} } = x;`, { impliedStrict: true });
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
        parseSource(`"use strict";  ({ ${arg} });`, { next: true });
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`);
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict";  ({ ${arg} });`, { webcompat: true });
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
        parseSource(`({foo: ${arg}}) => null`, { next: true });
      });
    });
    it(`({foo: ${arg}} = null)`, () => {
      t.throws(() => {
        parseSource(`({foo: ${arg}} = null)`);
      });
    });

    it(`({foo: ${arg}} = null)`, () => {
      t.throws(() => {
        parseSource(`({foo: ${arg}} = null)`, { webcompat: true });
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
        parseSource(`({ ${arg}(x, y) {}});`);
      });
    });
    it(`({ ${arg}(x, y) {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}(x, y) {}});`, { next: true });
      });
    });
    it(`({ ${arg}(x, y) {}});`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg}(x, y) {}});`, { webcompat: true });
      });
    });
  }

  for (const arg of ['var', 'let', 'const']) {
    it(`${arg} {async async: a} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async: a} = {}`, { webcompat: true });
      });
    });
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`, { webcompat: true });
      });
    });
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`);
      });
    });
    it(`${arg} {async async} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async} = {}`, { lexical: true });
      });
    });
    it(`${arg} {async async, } = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async, } = {}`, { webcompat: true });
      });
    });
    it(`${arg} {async async = 0} = {}`, () => {
      t.throws(() => {
        parseSource(`${arg} {async async = 0} = {}`, { webcompat: true });
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
        parseSource(`a = ${arg} = b`);
      });
    });
    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, { lexical: true });
      });
    });
    it(`a = ${arg} = b`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = b`, { next: true });
      });
    });

    it(`a = ${arg} = { a: 2 };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { a: 2 };`);
      });
    });

    it(`a = ${arg} = 51`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = 51`);
      });
    });

    it(`a = ${arg} = false`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = false`);
      });
    });
    it(`a = ${arg} = null `, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = null`);
      });
    });

    it(`a = ${arg} = undefined `, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = undefined`);
      });
    });

    it(`a = ${arg} = { x: { y: 2 } };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: { y: 2 } };`);
      });
    });

    it(`a = ${arg} = { x: null }`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: null }`);
      });
    });

    it(`a = ${arg} = { x: null }`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: null }`, { webcompat: true });
      });
    });

    it(`a = ${arg} = {};`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = {};`);
      });
    });

    it(`a = ${arg} = { x: [] };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { x: [] };`);
      });
    });

    it(`a = ${arg} = { 1: [] = [(a = b)] };`, () => {
      t.doesNotThrow(() => {
        parseSource(`a = ${arg} = { 1: [] = [(a = b)] };`);
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
    'a:a,b,c',
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
        parseSource(`({ ${arg} })`, { next: true });
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, { webcompat: true });
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`);
      });
    });

    it(`({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`({ ${arg} })`, { next: true, webcompat: true });
      });
    });

    it(`x = { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = { ${arg} }`, { webcompat: true });
      });
    });

    it(`x = { ${arg} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`x = { ${arg} }`, { webcompat: true, lexical: true });
      });
    });

    it(`({ ${arg} }) = {}`, () => {
      t.throws(() => {
        parseSource(`({ ${arg} }) = {}`, { webcompat: true });
      });
    });

    it(`"use strict"; ({ ${arg} })`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ({ ${arg} })`, { next: true });
      });
    });
  }

  fail('Expressions - Object (fail)', [
    '"use strict"; ({ [...a] = [] })',
    '({ [...a] = [] })',
    '"use strict"; ({ [...a]  })-',
    '({x:y} += x)',
    { code: 'x = [{__proto__: 1, __proto__: 2}]', options: { webcompat: true } },
    '({...{x} }= {});',
    '({x:y} += x)',
    '(({x:y}) += x)',
    '({foo: {x:y} += x})',
    '[(a = 0)] = 1',
    '(...a)',
    '({x:y} += x)',
    { code: '({implements}) => null', options: { impliedStrict: true } },
    { code: '({interface}) => null', options: { impliedStrict: true } },
    { code: '({await}) => null', options: { sourceType: 'module' } },
    { code: '({yield}) => null', options: { impliedStrict: true } },
    '({"a": b}) = a;',
    'a = {1} = b',
    'a = {"a"} = b',
    '({x}) = foo',
    '({break})',
    'a = { x: [(x, y)] } = { x: [] };',
    'a = { x: [(x, y)] } = {};',
    'a = { x: [(x, y)] } = { 1: [] = [(a = b)] };',
    'a = { x: [(x, y)] } = undefined',
    'a = { x: [(x, y)] } = null',
    'a = { x: [(x, y)] } = 51',
    'a = { x: [(x, y)] } = false',
    'a = { x: [(x, y)] } = b',
    'a = { x: [(x, y)] } = { x: null }',
    'x = { [a]: {} /= a }',
    'x = { [a]: {} ++a }',
    'x = { a: {} /= a }',
    'x = { a: {} ++a }',
    'x = { "a": {} /= a }',
    'x = { "a": {} ++a }',
    'x = { 1: {} /= a }',
    'x = { 1: {} ++a }',
    '({break = bones})',
    '({foo += bar})',
    '({* async x(){}})',
    '({* get x(){}})',
    '({* set x(){}})',
    '({*async x(){}})',
    '({*get x(){}})',
    '({*set x(){}})',
    '({*foo: x(){}})',
    '({*: x(){}})',
    '{...x)',
    '({...x)',
    '({set a() {}})',
    '({1} ? a : b)',
    '({get a(a) {}})',
    '({x: [..] = y})',
    '({x: {..} = y})',
    '({x: [..]})',
    '({x: {..}})',
    '({[foo]-(a) {}})',
    '({a: b => []} = [2])',
    '({b => []} = [2])',
    '({a: b + c} = [2])',
    '({[a]: b => []} = [2])',
    { code: 's = {"foo": await = x} = x', options: { sourceType: 'module' } },
    '({a: [foo]-(a) {}})',
    '({set a(...foo) {}})',
    '({*ident: x})',
    '({...})',
    '({a ...b})',
    'let {...obj1,} = foo',
    'let {...obj1,a} = foo',
    'let {...obj1,...obj2} = foo',
    'let {...(obj)} = foo',
    'let {...(a,b)} = foo',
    'let {...{a,b}} = foo',
    'let {...[a,b]} = foo',
    '({...obj1,} = foo)',
    '({...obj1,a} = foo)',
    '({...a,} = {});',
    '({...a,} = {});',
    '({...obj1,...obj2} = foo)',
    outdent`
      ({
          async
          foo() {}
      })
    `,
    '({...{a,b}} = foo)',
    '({...[a,b]} = foo)',
    '({...[a, b]} = x)',
    '({...{a, b}} = x)',
    '( {...{}} = {} )',
    '({...(obj)}) => {}',
    '({...{}} = {})',
    '({...(a,b)}) => {}',
    '({...{a,b}}) => {}',
    '({...[a,b]}) => {}',
    '({ x } = {x: ...[1,2,3]})',
    '"foo": (x) = (1) = "bar"',
    '({*ident x(){}})',
    '({*ident: x})',
    's = {"foo": yield /fail/g = x} = x',
    'function *g() {   s = {"foo": yield /brains/ = x} = x   }',
    's = {"foo": await /fail/g = x} = x',
    'async function g() {   s = {"foo": await /brains/ = x} = x   }',
    'x = { async f: function() {} }',
    'x = { async f: function() {} }',
    '0, {...rest, b} = {}',
    '({...obj1,a} = foo)',
    '({...obj1,...obj2} = foo)',
    '({...x = 1} = {})',
    '({...(obj)}) => {}',
    '({...(a,b)}) => {}',
    { code: 'x = {\'__proto__\': 1, "__proto__": 2}', options: { webcompat: true } },
    { code: 'x = {__proto__: 1, "__proto__": 2}', options: { webcompat: true } },
    '({ get *x(){} })',
    '({get +:3})',
    '({get bar(x) {})',
    'a = { a: async (){} }',
    '({get bar(x) {})',
    '({get bar(x) {})',
    '({get bar(x) {})',
    '({get bar(x) {})',
    '({  async 0 : 0 })',
    '({  async get x(){} })',
    '({ async get *x(){} })',
    '({ async set x(y){} })',
    '({ async get : 0 })',
    '({ *set x(y){} })',
    { code: '({get +:3})', options: { impliedStrict: true } },
    { code: '({async get : 0})', options: { impliedStrict: true } },
    'let o = {true, false, super, this, null};',
    { code: '({*get x(){}})', options: { impliedStrict: true } },
    { code: '({static x: 0})', options: { impliedStrict: true } },
    { code: '({static async x(){}})', options: { impliedStrict: true } },
    '({*x: 0})',
    '({*get x(){}})',
    '*async x(){}',
    'async x*(){}',
    '({*get x(){}})',
    '({*set x(){}})',
    '({*ident: x})',
    '({*ident x(){}})',
    '({*async x(){}})',
    '({[fgrumpy] 1(){}})',
    'async 0 : 0"',
    'function f({...[a, b]}){}',
    'async get x(){}',
    '({ *x: 0 })',
    '({ , })',
    '({ * *x(){} })',
    '({ x*(){} })',
    '({ "async foo (arguments) { "use strict"; } })',
    '({ a: () {}a })',
    '({ a: ()a })',
    '({)',
    '({async async});',
    '({async get foo() { }})',
    '({async set foo(value) { }})',
    '({async set foo(value) { }})',
    '({async foo: 1});',
    'x = { async f: function() {} }',
    'call({[x]})',
    '({async get foo(){}});',
    '({get set foo(){}});',
    '({async set foo(){}});',
    '({x:y;a:b})',
    '({x:y;})',
    '({;x:y,a:b})',
    '({;}',
    'wrap({a=b});',
    '{ 1: {} [a] }',
    '{ 1: {} = a }',
    '{ 1: {} + a }',
    '{ 1: {} /- a }',
    '{ 1: {} ? a : b }',
    '{ 1: [] [a] }',
    '{ 1: [] = a }',
    's = {"foo": false = x} = x',
    's = {"foo": null = x} = x',
    's = {"foo": this = x} = x',
    's = {"foo": super = x} = x',
    { code: 's = {"foo": yield = x} = x', options: { impliedStrict: true } },
    's = {"foo": yield a = x} = x',
    's = {"foo": yield /fail/g = x} = x',
    'function *g() {   s = {"foo": yield = x} = x   }',
    'function *g() {   s = {"foo": yield a = x} = x   }',
    's = {"foo": await a = x} = x',
    's = {"foo": await /fail/g = x} = x',
    'async function g() {   s = {"foo": await = x} = x   }',
    'async function g() {   s = {"foo": await a = x} = x   }',
    'async function g() {   s = {"foo": await /brains/ = x} = x   }',
    's = {"foo": true = x}',
    { code: 's = {"foo": yield / x}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield /x/}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield /x/g}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield / x}', options: { impliedStrict: true } },
    'function *f(){   s = {"foo": yield / x}   }',
    's = {"foo": this = x} = x',
    '({"x": y+z} = x)',
    '({"x": y+z}) => x',
    '({"x": [y + x]} = x)',
    '({"x": [y + x]}) => x',
    '({"x": [y].slice(0)}) => x',
    '({"x": [y].slice(0)} = x)',
    '({"x": {a: y + x}} = x)',
    '({"x": {a: y + x}}) => x',
    '({"x": {a: y + x}.slice(0)} = x)',
    '({"x": {a: y + x}.slice(0)}) => x',
    '({"foo": [x].foo()}=y);',
    '({"x": [y + x]} = x)',
    '({"x": [y + x]}) => x',
    '({ ... })',
    'async get *x(){}',
    'async set x(y){}',
    '({a({e: a.b}){}})',
    '({set a({e: a.b}){}})',
    '({a([a.b]){}})',
    '({async 8(){});',
    '({get 8(){});',
    '({set 8(){});',
    '({set [x](y){});',
    '({get [x](y){});',
    '({get "x"(){})',
    '({set "x"(y){});',
    '({{eval}) => x);',
    '({eval}) => x);',
    { code: '({eval} = x);', options: { impliedStrict: true } },
    '({ident: [foo, bar].join("")} = x)',
    '({ident: [foo, bar].join("") = x} = x)',
    '({set a([a.b]){}})',
    '({*a([a.b]){}})',
    '({Object = 0, String = 0}) = {};',
    '({a, b}) = {a: 1, b:2}',
    '({a, b}) = {a: 1, b:2}',
    { code: String.raw`"use\040strict";`, options: { impliedStrict: true } },
    { code: 'var x = 012;', options: { impliedStrict: true } },
    '({b}) = b;',
    '([b]) = b;',
    { code: 'foo({ __proto__: null, other: null, "__proto__": null });', options: { webcompat: true } },
    { code: '({ __proto__: null, other: null, "__proto__": null }) => foo;', options: { webcompat: true } },
    { code: 'async ({ __proto__: null, other: null, "__proto__": null }) => foo;', options: { webcompat: true } },
    { code: '[{ __proto__: null, other: null, "__proto__": null }];', options: { webcompat: true } },
    { code: 'x = { __proto__: null, other: null, "__proto__": null };', options: { webcompat: true } },
    '[...a, ] = b',
    'obj = {x = 0}',
    '({ obj:20 }) = 42',
    '( { get x() {} } = 0)',
    '({x, y}) = {}',
    '(1 + 1) = 10',
    '(a = b) = {};',
    '([a]) = []',
    '(a, (b)) => 42',
    '([a.b]) => 0',
    '(function* ({e: a.b}) {})',
    '[{a=0},{b=0},0] = 0',
    '[, x, ...y,] = 0',
    '...(x => y) = {};',
    'f = ( a++ ) => {};',
    'f = (this ) => {};',
    'f = ( {+2 : x} ) => {};',
    'f = ([...z = 1] ) => {};',
    'f = ([...[z] = 1] ) => {};',
    'f = ( [a,,..rest,...rest1] ) => {};',
    'f = ( { ,, ...x } ) => {};',
    'f = ( { ...*method() {} } ) => {};',
    'function f({ ...x, ...y } ) {}',
    'function f( {[1+1]} ) {}',
    'x({get "abc": x});',
    'x({get 123: x});',
    '({"x": 600} = x)',
    '({"x": 600}) => x',
    '({"x": 600..xyz}) => x',
    'x, {x: foo + y, bar} = doo',
    'x={...x=y}=z',
    'x={...true} = x',
    'x={...true} => x',
    '({...a+b} = x)',
    '({...a=b} = x)',
    '({...a, ...b} = x)',
    '({...a=b}) => x',
    '({...a+b}) => x',
    '({...a, ...b}) => x',
    '({3200: foo() = x}) => x',
    '({[foo]() {}} = y)',
    '({[foo]: x()} = x) => y',
    '({a: b()} = x) => y',
    '({3200: x() = x}) => x',
    '({3200: x() = x} = x)',
    '({foo: x() = x}) => x',
    '({foo: x() = x} = x)',
    '({foo: x() = a} = b) => c',
    { code: 's = {foo: yield}', options: { impliedStrict: true } },
    { code: 's = {foo: yield / x}', options: { impliedStrict: true } },
    's = {foo: yield /x/}',
    { code: 's = {foo: yield /x/g}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield}', options: { impliedStrict: true } },
    { code: 's = {"foo": yield / x}', options: { impliedStrict: true } },
    'function *f(){   s = {"foo": yield / x}   }',
    '({foo: x() = x}) => x',
    '({foo: x() = x} = x)',
    '({foo: x() = a} = b) => c',
    '({"foo": x() = 1}) => x',
    '({"foo": x() = x}) => x',
    '({"foo": x() = x} = x)',
    '({"foo": x() = a} = b) => c',
    '({3200: x() = a} = b) => c',
    '({foo: x() = x}) => x',
    '({foo: x() = x} = x)',
    '({foo: x() = a} = b) => c',
    'x={..."foo"=x} = x',
    'x={..."foo".foo=x} = x',
    '({..."foo"=x}) => x',
    '({..."foo".foo=x}) => x',
    '({foo += bar})',
    '({0} = 0)',
    '({a.b} = 0)',
    '({get a(){}})=0',
    '({a:this}=0)',
    '({a = 0});',
    '({a} += 0);',
    '({ async}) = 0',
    '({a([a.b]){}})',
    '({a({e: a.b}){}})',
    '({set a({e: a.b}){}})',
    'f = (argument1, {...[ x = 5 ] }) => {};',
    'f = ( {...x[0] } ) => {};',
    '({...{x} }) => {}',
    '({...(x) }) => {}',
    '({...[x] }) => {}',
    '({set a([a.b]){}})',
    '({a}) = 0',
    '(x=1)=y',
    '([a]) = 0',
    '(x=1)=2',
    '(a = b) = {};',
    '([a]) = []',
    '({a}) = {}',
    '({a}) = 0;',
    '([x]) = 0',
    '([a.b]) => 0',
    '(["a"]) = []',
    '({1}) = {}',
    '({"a"}) = 0;',
    '(["x"]) = 0',
    '([a.[b]]) => 0',
    '({+2 : x}) = {};',
    '[...rest,] = {};',
    '({...a, ...b, ...c} = {...a, ...b, ...c})',
    '({ a, b }) = {a: 1, b: 2}',
    '{[1+1] : z} = {};',
    '({x: { y = 10 } })',
    '({x = 42, y = 15})',
    '({"x" = 42, y = 15})',
    '({[x] = 42, y = 15})',
    '(({ x = 10 } = { x = 20 }) => x)({})',
    '{ x = 10 } = (o = { x = 20 });',
    '({ q } = { x = 10 });',
    '[{ x = 10 }]',
    '(true ? { x = true } : { x = false })',
    '({get *ident(){}})',
    '({set *ident(ident){}}) ',
    '({get *5(){}})',
    '({set *5(ident){}})',
    '({get *"x"(){}})',
    '({get *[x](){}})',
    'async (foo = ({static *[await oops](){}})) => {}',
    '({x+=y})',
    '({get *10(){}})',
    '({get *[expr](){}})',
    '({*[expr](){}} = x);',
    '({*1(){}} = x);',
    '({*foo(){}} = x);',
    '({*"expr"(){}} = x);',
    '({[expr](){}} = x);',
    '({1(){}} = x);',
    '({foo(){}} = x);',
    '({"expr"(){}} = x);',
    '({set 8(y){})',
    '({get 8(){})',
    '({get [x](){})',
    '({set "x"(y){})',
    '({async 8(){})',
    '({set 8(y){})',
    '({,} = {});',
    'var {,} = {}',
    'var {x:y+1} = {};',
    'var {x:y--} = {};',
    'var y; ({x:y--} = {});',
    'var y; ({x:y+1} = {});',
    'function foo() { return {}; }; var {x:foo().x} = {};',
    'function foo() { return {}; }; ({x:foo()} = {});',
    'function foo() { return {}; }; let {x:foo()} = {};',
    'class foo { method() { ({x:super()} = {}); } }',
    'let [...[a] = []] = [[]];',
    'let [...{x} = {}] = [{}];',
    'let a, r1; ({a:(a1 = r1) = 44} = {})',
    '({a: ({d = 1,c = 1}.c) = 2} = {});',
    '({a: {d = 1,c = 1}.c = 2} = {});',
    'for(var [z] = function ([a]) { } in []) {}',
    'var a = 1; ({x, y = 1, z = 2} = {a = 2});',
    'var a = 1; ({x, y = {a = 1}} = {});',
    '({"foo": {1 = 2}});',
    '({"foo": {x} = [1] = "bar"});',
    '({"foo": [x] = [1] = "bar"});',
    '({"foo": (x) = [1] = "bar"});',
    '({"foo": 1 = 2});',
    '({"foo": [1 = 2]});',
    '({"foo": [1 = 2] = foo});',
    '({"foo": [1 = 2]} = foo);',
    'function *f(){   s = {foo: yield / x}   }',
    '({get x() {}}) => {}',
    'let {...{x, y}} = {}',
    'let {...{...{x, y}}} = {}',
    '0, {...rest, b} = {}',
    '(([a, ...b = 0]) => {})',
    '(({a, ...b = 0}) => {})',
    '({...x,}) => z',
    'let {...x, ...y} = {}',
    '({...rest, b} = {})',
    { code: "x = {'__proto__': 1, __proto__: 2}", options: { webcompat: true } },
    "x = {'__proto__': 1, __proto__: 2}",
    String.raw`({g\u0065t m() {} });`,
    '([{web: false, __proto__: a, __proto__: b}]);',
    '({web: false, __proto__: a, __proto__: b});',
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
      code: outdent`
        var callCount = 0;

        var C = class { static async *gen() {
            callCount += 1;
            yield {
                ...yield,
                y: 1,
                ...yield yield,
              };
        }}
      `,
      options: { ranges: true },
    },

    { code: 's = {foo: yield}', options: { ranges: true } },
    's = {foo: yield / x}',
    { code: '({...obj} = foo)', options: { ranges: true } },
    { code: 'let { x4: { ...y4 } } = z;', options: { ranges: true } },
    {
      code: outdent`
        ({
        把你想在页面内共享的变量写在这里喔 : 1,
        这是你刚选择的事件: function (e){
          //当按钮被长按时...
        }
        });
      `,
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
    { code: '({*1n\n(){}})', options: { ranges: true, loc: true } },
  ]);
});
