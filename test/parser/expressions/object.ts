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
    '{get let(v) {}}'
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
    'async ({__proto__: a, __proto__: b}) => 1'
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
    'async ({__proto__: a, __proto__: b});'
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
    '__proto__: {}, __proto__'
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
    '{ w, x, y = a ? x : b }'
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
    "get ['unicod\\u{000065}Escape']() { return 'get string'; }",
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
    'async'
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
    ['"use\\040strict";', Context.Strict],
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
    ['({g\\u0065t m() {} });', Context.None],
    ['([{web: false, __proto__: a, __proto__: b}]);', Context.None],
    ['({web: false, __proto__: a, __proto__: b});', Context.None]
  ]);

  pass('Expressions - Object (pass)', [
    [
      'x= { prototype(){} }',
      Context.OptionsRanges,
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
                name: 'x',
                start: 0,
                end: 1,
                range: [0, 1]
              },
              operator: '=',
              right: {
                type: 'ObjectExpression',
                properties: [
                  {
                    type: 'Property',
                    key: {
                      type: 'Identifier',
                      name: 'prototype',
                      start: 5,
                      end: 14,
                      range: [5, 14]
                    },
                    value: {
                      type: 'FunctionExpression',
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        body: [],
                        start: 16,
                        end: 18,
                        range: [16, 18]
                      },
                      async: false,
                      generator: false,
                      id: null,
                      start: 14,
                      end: 18,
                      range: [14, 18]
                    },
                    kind: 'init',
                    computed: false,
                    method: true,
                    shorthand: false,
                    start: 5,
                    end: 18,
                    range: [5, 18]
                  }
                ],
                start: 3,
                end: 20,
                range: [3, 20]
              },
              start: 0,
              end: 20,
              range: [0, 20]
            },
            start: 0,
            end: 20,
            range: [0, 20]
          }
        ],
        start: 0,
        end: 20,
        range: [0, 20]
      }
    ],
    [
      '({a: b = c} = [2])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 11,
                range: [1, 11],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 10,
                    range: [2, 10],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      left: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        range: [9, 10],
                        name: 'c'
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 14,
                end: 17,
                range: [14, 17],
                elements: [
                  {
                    type: 'Literal',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    value: 2
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
      '({a: (b) = c} = [2])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 19,
              range: [1, 19],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 13,
                range: [1, 13],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 12,
                    range: [2, 12],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 5,
                      end: 12,
                      range: [5, 12],
                      left: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'b'
                      },
                      right: {
                        type: 'Identifier',
                        start: 11,
                        end: 12,
                        range: [11, 12],
                        name: 'c'
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 16,
                end: 19,
                range: [16, 19],
                elements: [
                  {
                    type: 'Literal',
                    start: 17,
                    end: 18,
                    range: [17, 18],
                    value: 2
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
      '({a: (b).c} = [2])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 17,
              range: [1, 17],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 11,
                range: [1, 11],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 10,
                    range: [2, 10],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'MemberExpression',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      object: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'b'
                      },
                      property: {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        range: [9, 10],
                        name: 'c'
                      },
                      computed: false
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 14,
                end: 17,
                range: [14, 17],
                elements: [
                  {
                    type: 'Literal',
                    start: 15,
                    end: 16,
                    range: [15, 16],
                    value: 2
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
      '({a: (b).c = d} = [2])',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 21,
              range: [1, 21],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 15,
                range: [1, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 14,
                    range: [2, 14],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'a'
                    },
                    value: {
                      type: 'AssignmentPattern',
                      start: 5,
                      end: 14,
                      range: [5, 14],
                      left: {
                        type: 'MemberExpression',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        object: {
                          type: 'Identifier',
                          start: 6,
                          end: 7,
                          range: [6, 7],
                          name: 'b'
                        },
                        property: {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          name: 'c'
                        },
                        computed: false
                      },
                      right: {
                        type: 'Identifier',
                        start: 13,
                        end: 14,
                        range: [13, 14],
                        name: 'd'
                      }
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 18,
                end: 21,
                range: [18, 21],
                elements: [
                  {
                    type: 'Literal',
                    start: 19,
                    end: 20,
                    range: [19, 20],
                    value: 2
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
      'var a = { __proto__: { abc: 123 } };',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 36,
        range: [0, 36],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 36,
            range: [0, 36],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 35,
                range: [4, 35],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'a'
                },
                init: {
                  type: 'ObjectExpression',
                  start: 8,
                  end: 35,
                  range: [8, 35],
                  properties: [
                    {
                      type: 'Property',
                      start: 10,
                      end: 33,
                      range: [10, 33],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 10,
                        end: 19,
                        range: [10, 19],
                        name: '__proto__'
                      },
                      value: {
                        type: 'ObjectExpression',
                        start: 21,
                        end: 33,
                        range: [21, 33],
                        properties: [
                          {
                            type: 'Property',
                            start: 23,
                            end: 31,
                            range: [23, 31],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 23,
                              end: 26,
                              range: [23, 26],
                              name: 'abc'
                            },
                            value: {
                              type: 'Literal',
                              start: 28,
                              end: 31,
                              range: [28, 31],
                              value: 123
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
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
      'var b = { ["__proto__"]: { abc: 123 }};',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 39,
            range: [0, 39],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 38,
                range: [4, 38],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 5,
                  range: [4, 5],
                  name: 'b'
                },
                init: {
                  type: 'ObjectExpression',
                  start: 8,
                  end: 38,
                  range: [8, 38],
                  properties: [
                    {
                      type: 'Property',
                      start: 10,
                      end: 37,
                      range: [10, 37],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Literal',
                        start: 11,
                        end: 22,
                        range: [11, 22],
                        value: '__proto__'
                      },
                      value: {
                        type: 'ObjectExpression',
                        start: 25,
                        end: 37,
                        range: [25, 37],
                        properties: [
                          {
                            type: 'Property',
                            start: 27,
                            end: 35,
                            range: [27, 35],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 27,
                              end: 30,
                              range: [27, 30],
                              name: 'abc'
                            },
                            value: {
                              type: 'Literal',
                              start: 32,
                              end: 35,
                              range: [32, 35],
                              value: 123
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
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
      '({...x = y, y})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 14,
              range: [1, 14],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 10,
                  range: [2, 10],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'y'
                    }
                  }
                },
                {
                  type: 'Property',
                  start: 12,
                  end: 13,
                  range: [12, 13],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'y'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 12,
                    end: 13,
                    range: [12, 13],
                    name: 'y'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({...a,});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 8,
              range: [1, 8],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 6,
                  range: [2, 6],
                  argument: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'a'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[...a] = []',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 6,
                range: [0, 6],
                elements: [
                  {
                    type: 'RestElement',
                    start: 1,
                    end: 5,
                    range: [1, 5],
                    argument: {
                      type: 'Identifier',
                      start: 4,
                      end: 5,
                      range: [4, 5],
                      name: 'a'
                    }
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 9,
                end: 11,
                range: [9, 11],
                elements: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({[sourceKey()]: target()[targetKey()]} = source());',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 52,
        range: [0, 52],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 52,
            range: [0, 52],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 50,
              range: [1, 50],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 39,
                range: [1, 39],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 38,
                    range: [2, 38],
                    method: false,
                    shorthand: false,
                    computed: true,
                    key: {
                      type: 'CallExpression',
                      start: 3,
                      end: 14,
                      range: [3, 14],
                      callee: {
                        type: 'Identifier',
                        start: 3,
                        end: 12,
                        range: [3, 12],
                        name: 'sourceKey'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'MemberExpression',
                      start: 17,
                      end: 38,
                      range: [17, 38],
                      object: {
                        type: 'CallExpression',
                        start: 17,
                        end: 25,
                        range: [17, 25],
                        callee: {
                          type: 'Identifier',
                          start: 17,
                          end: 23,
                          range: [17, 23],
                          name: 'target'
                        },
                        arguments: []
                      },
                      property: {
                        type: 'CallExpression',
                        start: 26,
                        end: 37,
                        range: [26, 37],
                        callee: {
                          type: 'Identifier',
                          start: 26,
                          end: 35,
                          range: [26, 35],
                          name: 'targetKey'
                        },
                        arguments: []
                      },
                      computed: true
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'CallExpression',
                start: 42,
                end: 50,
                range: [42, 50],
                callee: {
                  type: 'Identifier',
                  start: 42,
                  end: 48,
                  range: [42, 48],
                  name: 'source'
                },
                arguments: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'f(a, ...1 + 1, b)',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'f'
              },
              arguments: [
                {
                  type: 'Identifier',
                  start: 2,
                  end: 3,
                  range: [2, 3],
                  name: 'a'
                },
                {
                  type: 'SpreadElement',
                  start: 5,
                  end: 13,
                  range: [5, 13],
                  argument: {
                    type: 'BinaryExpression',
                    start: 8,
                    end: 13,
                    range: [8, 13],
                    left: {
                      type: 'Literal',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      value: 1
                    },
                    operator: '+',
                    right: {
                      type: 'Literal',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      value: 1
                    }
                  }
                },
                {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  range: [15, 16],
                  name: 'b'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){   s = {"foo": yield}   }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 39,
        range: [0, 39],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 39,
            range: [0, 39],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 39,
              range: [13, 39],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 17,
                  end: 35,
                  range: [17, 35],
                  expression: {
                    type: 'AssignmentExpression',
                    start: 17,
                    end: 35,
                    range: [17, 35],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      name: 's'
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 21,
                      end: 35,
                      range: [21, 35],
                      properties: [
                        {
                          type: 'Property',
                          start: 22,
                          end: 34,
                          range: [22, 34],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Literal',
                            start: 22,
                            end: 27,
                            range: [22, 27],
                            value: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            start: 29,
                            end: 34,
                            range: [29, 34],
                            delegate: false,
                            argument: null
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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

            id: {
              type: 'Identifier',
              name: 'f'
            }
          }
        ]
      }
    ],
    [
      '[{x : [{y:{z = 1}}] }] = [{x:[{y:{}}]}];',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 40,
        range: [0, 40],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 40,
            range: [0, 40],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 39,
              range: [0, 39],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 22,
                range: [0, 22],
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 21,
                    range: [1, 21],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 19,
                        range: [2, 19],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          start: 6,
                          end: 19,
                          range: [6, 19],
                          elements: [
                            {
                              type: 'ObjectPattern',
                              start: 7,
                              end: 18,
                              range: [7, 18],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 8,
                                  end: 17,
                                  range: [8, 17],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 8,
                                    end: 9,
                                    range: [8, 9],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    start: 10,
                                    end: 17,
                                    range: [10, 17],
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 11,
                                        end: 16,
                                        range: [11, 16],
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 11,
                                          end: 12,
                                          range: [11, 12],
                                          name: 'z'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 11,
                                          end: 16,
                                          range: [11, 16],
                                          left: {
                                            type: 'Identifier',
                                            start: 11,
                                            end: 12,
                                            range: [11, 12],
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 15,
                                            end: 16,
                                            range: [15, 16],
                                            value: 1
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  kind: 'init'
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 25,
                end: 39,
                range: [25, 39],
                elements: [
                  {
                    type: 'ObjectExpression',
                    start: 26,
                    end: 38,
                    range: [26, 38],
                    properties: [
                      {
                        type: 'Property',
                        start: 27,
                        end: 37,
                        range: [27, 37],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 27,
                          end: 28,
                          range: [27, 28],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          start: 29,
                          end: 37,
                          range: [29, 37],
                          elements: [
                            {
                              type: 'ObjectExpression',
                              start: 30,
                              end: 36,
                              range: [30, 36],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 31,
                                  end: 35,
                                  range: [31, 35],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 31,
                                    end: 32,
                                    range: [31, 32],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    start: 33,
                                    end: 35,
                                    range: [33, 35],
                                    properties: []
                                  },
                                  kind: 'init'
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
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
      'function *f(){   s = {foo: yield /x/}   }',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 41,
        range: [0, 41],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 41,
            range: [0, 41],
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 41,
              range: [13, 41],
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 17,
                  end: 37,
                  range: [17, 37],
                  expression: {
                    type: 'AssignmentExpression',
                    start: 17,
                    end: 37,
                    range: [17, 37],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      name: 's'
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 21,
                      end: 37,
                      range: [21, 37],
                      properties: [
                        {
                          type: 'Property',
                          start: 22,
                          end: 36,
                          range: [22, 36],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 22,
                            end: 25,
                            range: [22, 25],
                            name: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            start: 27,
                            end: 36,
                            range: [27, 36],
                            delegate: false,
                            argument: {
                              type: 'Literal',
                              start: 33,
                              end: 36,
                              range: [33, 36],
                              value: /x/,
                              regex: {
                                pattern: 'x',
                                flags: ''
                              }
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      's = {"foo": await = x} = x',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 26,
              range: [0, 26],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 's'
              },
              right: {
                type: 'AssignmentExpression',
                start: 4,
                end: 26,
                range: [4, 26],
                operator: '=',
                left: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 22,
                  range: [4, 22],
                  properties: [
                    {
                      type: 'Property',
                      start: 5,
                      end: 21,
                      range: [5, 21],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Literal',
                        start: 5,
                        end: 10,
                        range: [5, 10],
                        value: 'foo'
                      },
                      value: {
                        type: 'AssignmentPattern',
                        start: 12,
                        end: 21,
                        range: [12, 21],
                        left: {
                          type: 'Identifier',
                          start: 12,
                          end: 17,
                          range: [12, 17],
                          name: 'await'
                        },
                        right: {
                          type: 'Identifier',
                          start: 20,
                          end: 21,
                          range: [20, 21],
                          name: 'x'
                        }
                      },
                      kind: 'init'
                    }
                  ]
                },
                right: {
                  type: 'Identifier',
                  start: 25,
                  end: 26,
                  range: [25, 26],
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
      'function f([...[a, b]]){}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 25,
            range: [0, 25],
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              name: 'f'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'ArrayPattern',
                start: 11,
                end: 22,
                range: [11, 22],
                elements: [
                  {
                    type: 'RestElement',
                    start: 12,
                    end: 21,
                    range: [12, 21],
                    argument: {
                      type: 'ArrayPattern',
                      start: 15,
                      end: 21,
                      range: [15, 21],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 16,
                          end: 17,
                          range: [16, 17],
                          name: 'a'
                        },
                        {
                          type: 'Identifier',
                          start: 19,
                          end: 20,
                          range: [19, 20],
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
              start: 23,
              end: 25,
              range: [23, 25],
              body: []
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function f({...a}){}',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 20
          }
        },
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 20,
            range: [0, 20],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 20
              }
            },
            id: {
              type: 'Identifier',
              start: 9,
              end: 10,
              range: [9, 10],
              loc: {
                start: {
                  line: 1,
                  column: 9
                },
                end: {
                  line: 1,
                  column: 10
                }
              },
              name: 'f'
            },
            generator: false,
            async: false,
            params: [
              {
                type: 'ObjectPattern',
                start: 11,
                end: 17,
                range: [11, 17],
                loc: {
                  start: {
                    line: 1,
                    column: 11
                  },
                  end: {
                    line: 1,
                    column: 17
                  }
                },
                properties: [
                  {
                    type: 'RestElement',
                    start: 12,
                    end: 16,
                    range: [12, 16],
                    loc: {
                      start: {
                        line: 1,
                        column: 12
                      },
                      end: {
                        line: 1,
                        column: 16
                      }
                    },
                    argument: {
                      type: 'Identifier',
                      start: 15,
                      end: 16,
                      range: [15, 16],
                      loc: {
                        start: {
                          line: 1,
                          column: 15
                        },
                        end: {
                          line: 1,
                          column: 16
                        }
                      },
                      name: 'a'
                    }
                  }
                ]
              }
            ],
            body: {
              type: 'BlockStatement',
              start: 18,
              end: 20,
              range: [18, 20],
              loc: {
                start: {
                  line: 1,
                  column: 18
                },
                end: {
                  line: 1,
                  column: 20
                }
              },
              body: []
            }
          }
        ],
        sourceType: 'script'
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

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({foo: typeof /x/});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 20,
        range: [0, 20],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 20,
            range: [0, 20],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 17,
                  range: [2, 17],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 5,
                    range: [2, 5],
                    name: 'foo'
                  },
                  value: {
                    type: 'UnaryExpression',
                    start: 7,
                    end: 17,
                    range: [7, 17],
                    operator: 'typeof',
                    prefix: true,
                    argument: {
                      type: 'Literal',
                      start: 14,
                      end: 17,
                      range: [14, 17],
                      value: /x/,
                      regex: {
                        pattern: 'x',
                        flags: ''
                      }
                    }
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'function *f(){   s = {foo: yield /x/g}   }',
      Context.OptionsRanges | Context.OptionsLoc,
      {
        type: 'Program',
        start: 0,
        end: 42,
        range: [0, 42],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 42
          }
        },
        body: [
          {
            type: 'FunctionDeclaration',
            start: 0,
            end: 42,
            range: [0, 42],
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 42
              }
            },
            id: {
              type: 'Identifier',
              start: 10,
              end: 11,
              range: [10, 11],
              loc: {
                start: {
                  line: 1,
                  column: 10
                },
                end: {
                  line: 1,
                  column: 11
                }
              },
              name: 'f'
            },
            generator: true,
            async: false,
            params: [],
            body: {
              type: 'BlockStatement',
              start: 13,
              end: 42,
              range: [13, 42],
              loc: {
                start: {
                  line: 1,
                  column: 13
                },
                end: {
                  line: 1,
                  column: 42
                }
              },
              body: [
                {
                  type: 'ExpressionStatement',
                  start: 17,
                  end: 38,
                  range: [17, 38],
                  loc: {
                    start: {
                      line: 1,
                      column: 17
                    },
                    end: {
                      line: 1,
                      column: 38
                    }
                  },
                  expression: {
                    type: 'AssignmentExpression',
                    start: 17,
                    end: 38,
                    range: [17, 38],
                    loc: {
                      start: {
                        line: 1,
                        column: 17
                      },
                      end: {
                        line: 1,
                        column: 38
                      }
                    },
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 17,
                      end: 18,
                      range: [17, 18],
                      loc: {
                        start: {
                          line: 1,
                          column: 17
                        },
                        end: {
                          line: 1,
                          column: 18
                        }
                      },
                      name: 's'
                    },
                    right: {
                      type: 'ObjectExpression',
                      start: 21,
                      end: 38,
                      range: [21, 38],
                      loc: {
                        start: {
                          line: 1,
                          column: 21
                        },
                        end: {
                          line: 1,
                          column: 38
                        }
                      },
                      properties: [
                        {
                          type: 'Property',
                          start: 22,
                          end: 37,
                          range: [22, 37],
                          loc: {
                            start: {
                              line: 1,
                              column: 22
                            },
                            end: {
                              line: 1,
                              column: 37
                            }
                          },
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 22,
                            end: 25,
                            range: [22, 25],
                            loc: {
                              start: {
                                line: 1,
                                column: 22
                              },
                              end: {
                                line: 1,
                                column: 25
                              }
                            },
                            name: 'foo'
                          },
                          value: {
                            type: 'YieldExpression',
                            start: 27,
                            end: 37,
                            range: [27, 37],
                            loc: {
                              start: {
                                line: 1,
                                column: 27
                              },
                              end: {
                                line: 1,
                                column: 37
                              }
                            },
                            delegate: false,
                            argument: {
                              type: 'Literal',
                              start: 33,
                              end: 37,
                              range: [33, 37],
                              loc: {
                                start: {
                                  line: 1,
                                  column: 33
                                },
                                end: {
                                  line: 1,
                                  column: 37
                                }
                              },
                              value: /x/g,
                              regex: {
                                pattern: 'x',
                                flags: 'g'
                              }
                            }
                          },
                          kind: 'init'
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 173,
        range: [0, 173],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 18,
            range: [0, 18],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 17,
                range: [4, 17],
                id: {
                  type: 'Identifier',
                  start: 4,
                  end: 13,
                  range: [4, 13],
                  name: 'callCount'
                },
                init: {
                  type: 'Literal',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  value: 0
                }
              }
            ],
            kind: 'var'
          },
          {
            type: 'VariableDeclaration',
            start: 22,
            end: 173,
            range: [22, 173],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 26,
                end: 173,
                range: [26, 173],
                id: {
                  type: 'Identifier',
                  start: 26,
                  end: 27,
                  range: [26, 27],
                  name: 'C'
                },
                init: {
                  type: 'ClassExpression',
                  start: 30,
                  end: 173,
                  range: [30, 173],
                  id: null,
                  superClass: null,
                  body: {
                    type: 'ClassBody',
                    start: 36,
                    end: 173,
                    range: [36, 173],
                    body: [
                      {
                        type: 'MethodDefinition',
                        start: 38,
                        end: 172,
                        range: [38, 172],
                        kind: 'method',
                        static: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 52,
                          end: 55,
                          range: [52, 55],
                          name: 'gen'
                        },
                        value: {
                          type: 'FunctionExpression',
                          start: 55,
                          end: 172,
                          range: [55, 172],
                          id: null,
                          generator: true,
                          async: true,
                          params: [],
                          body: {
                            type: 'BlockStatement',
                            start: 58,
                            end: 172,
                            range: [58, 172],
                            body: [
                              {
                                type: 'ExpressionStatement',
                                start: 66,
                                end: 81,
                                range: [66, 81],
                                expression: {
                                  type: 'AssignmentExpression',
                                  start: 66,
                                  end: 80,
                                  range: [66, 80],
                                  operator: '+=',
                                  left: {
                                    type: 'Identifier',
                                    start: 66,
                                    end: 75,
                                    range: [66, 75],
                                    name: 'callCount'
                                  },
                                  right: {
                                    type: 'Literal',
                                    start: 79,
                                    end: 80,
                                    range: [79, 80],
                                    value: 1
                                  }
                                }
                              },
                              {
                                type: 'ExpressionStatement',
                                start: 88,
                                end: 168,
                                range: [88, 168],
                                expression: {
                                  type: 'YieldExpression',
                                  start: 88,
                                  end: 167,
                                  range: [88, 167],
                                  delegate: false,
                                  argument: {
                                    type: 'ObjectExpression',
                                    start: 94,
                                    end: 167,
                                    range: [94, 167],
                                    properties: [
                                      {
                                        type: 'SpreadElement',
                                        start: 106,
                                        end: 114,
                                        range: [106, 114],
                                        argument: {
                                          type: 'YieldExpression',
                                          start: 109,
                                          end: 114,
                                          range: [109, 114],
                                          delegate: false,
                                          argument: null
                                        }
                                      },
                                      {
                                        type: 'Property',
                                        start: 126,
                                        end: 130,
                                        range: [126, 130],
                                        method: false,
                                        shorthand: false,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 126,
                                          end: 127,
                                          range: [126, 127],
                                          name: 'y'
                                        },
                                        value: {
                                          type: 'Literal',
                                          start: 129,
                                          end: 130,
                                          range: [129, 130],
                                          value: 1
                                        },
                                        kind: 'init'
                                      },
                                      {
                                        type: 'SpreadElement',
                                        start: 142,
                                        end: 156,
                                        range: [142, 156],
                                        argument: {
                                          type: 'YieldExpression',
                                          start: 145,
                                          end: 156,
                                          range: [145, 156],
                                          delegate: false,
                                          argument: {
                                            type: 'YieldExpression',
                                            start: 151,
                                            end: 156,
                                            range: [151, 156],
                                            delegate: false,
                                            argument: null
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
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
      's = {foo: yield}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 's'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 16,
                range: [4, 16],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 15,
                    range: [5, 15],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      name: 'foo'
                    },
                    value: {
                      type: 'Identifier',
                      start: 10,
                      end: 15,
                      range: [10, 15],
                      name: 'yield'
                    },
                    kind: 'init'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 15,
              range: [1, 15],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 9,
                range: [1, 9],
                properties: [
                  {
                    type: 'RestElement',
                    start: 2,
                    end: 8,
                    range: [2, 8],
                    argument: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      name: 'obj'
                    }
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 12,
                end: 15,
                range: [12, 15],
                name: 'foo'
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'let { x4: { ...y4 } } = z;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 26,
            range: [0, 26],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 25,
                range: [4, 25],
                id: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 21,
                  range: [4, 21],
                  properties: [
                    {
                      type: 'Property',
                      start: 6,
                      end: 19,
                      range: [6, 19],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 6,
                        end: 8,
                        range: [6, 8],
                        name: 'x4'
                      },
                      value: {
                        type: 'ObjectPattern',
                        start: 10,
                        end: 19,
                        range: [10, 19],
                        properties: [
                          {
                            type: 'RestElement',
                            start: 12,
                            end: 17,
                            range: [12, 17],
                            argument: {
                              type: 'Identifier',
                              start: 15,
                              end: 17,
                              range: [15, 17],
                              name: 'y4'
                            }
                          }
                        ]
                      },
                      kind: 'init'
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 24,
                  end: 25,
                  range: [24, 25],
                  name: 'z'
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
      `({
        把你想在页面内共享的变量写在这里喔 : 1,
        这是你刚选择的事件: function (e){
          //当按钮被长按时...
        }
        });`,
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 111,
        range: [0, 111],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 111,
            range: [0, 111],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 109,
              range: [1, 109],
              properties: [
                {
                  type: 'Property',
                  start: 11,
                  end: 32,
                  range: [11, 32],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 11,
                    end: 28,
                    range: [11, 28],
                    name: '把你想在页面内共享的变量写在这里喔'
                  },
                  value: {
                    type: 'Literal',
                    start: 31,
                    end: 32,
                    range: [31, 32],
                    value: 1
                  },
                  kind: 'init'
                },
                {
                  type: 'Property',
                  start: 42,
                  end: 99,
                  range: [42, 99],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 42,
                    end: 51,
                    range: [42, 51],
                    name: '这是你刚选择的事件'
                  },
                  value: {
                    type: 'FunctionExpression',
                    start: 53,
                    end: 99,
                    range: [53, 99],
                    id: null,
                    generator: false,
                    async: false,
                    params: [
                      {
                        type: 'Identifier',
                        start: 63,
                        end: 64,
                        range: [63, 64],
                        name: 'e'
                      }
                    ],
                    body: {
                      type: 'BlockStatement',
                      start: 65,
                      end: 99,
                      range: [65, 99],
                      body: []
                    }
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'var {  a, "b": b1, [`c`]: c1, [d + "e"]: d1, [`${d}e`]: d2, ...e1 } = e;',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 72,
        range: [0, 72],
        body: [
          {
            type: 'VariableDeclaration',
            start: 0,
            end: 72,
            range: [0, 72],
            declarations: [
              {
                type: 'VariableDeclarator',
                start: 4,
                end: 71,
                range: [4, 71],
                id: {
                  type: 'ObjectPattern',
                  start: 4,
                  end: 67,
                  range: [4, 67],
                  properties: [
                    {
                      type: 'Property',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      method: false,
                      shorthand: true,
                      computed: false,
                      key: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        range: [7, 8],
                        name: 'a'
                      },
                      kind: 'init',
                      value: {
                        type: 'Identifier',
                        start: 7,
                        end: 8,
                        range: [7, 8],
                        name: 'a'
                      }
                    },
                    {
                      type: 'Property',
                      start: 10,
                      end: 17,
                      range: [10, 17],
                      method: false,
                      shorthand: false,
                      computed: false,
                      key: {
                        type: 'Literal',
                        start: 10,
                        end: 13,
                        range: [10, 13],
                        value: 'b',
                        raw: '"b"'
                      },
                      value: {
                        type: 'Identifier',
                        start: 15,
                        end: 17,
                        range: [15, 17],
                        name: 'b1'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 19,
                      end: 28,
                      range: [19, 28],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'TemplateLiteral',
                        start: 20,
                        end: 23,
                        range: [20, 23],
                        expressions: [],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            start: 21,
                            end: 22,
                            range: [21, 22],
                            value: {
                              raw: 'c',
                              cooked: 'c'
                            },
                            tail: true
                          }
                        ]
                      },
                      value: {
                        type: 'Identifier',
                        start: 26,
                        end: 28,
                        range: [26, 28],
                        name: 'c1'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 30,
                      end: 43,
                      range: [30, 43],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'BinaryExpression',
                        start: 31,
                        end: 38,
                        range: [31, 38],
                        left: {
                          type: 'Identifier',
                          start: 31,
                          end: 32,
                          range: [31, 32],
                          name: 'd'
                        },
                        operator: '+',
                        right: {
                          type: 'Literal',
                          start: 35,
                          end: 38,
                          range: [35, 38],
                          value: 'e',
                          raw: '"e"'
                        }
                      },
                      value: {
                        type: 'Identifier',
                        start: 41,
                        end: 43,
                        range: [41, 43],
                        name: 'd1'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'Property',
                      start: 45,
                      end: 58,
                      range: [45, 58],
                      method: false,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'TemplateLiteral',
                        start: 46,
                        end: 53,
                        range: [46, 53],
                        expressions: [
                          {
                            type: 'Identifier',
                            start: 49,
                            end: 50,
                            range: [49, 50],
                            name: 'd'
                          }
                        ],
                        quasis: [
                          {
                            type: 'TemplateElement',
                            start: 47,
                            end: 47,
                            range: [47, 47],
                            value: {
                              raw: '',
                              cooked: ''
                            },
                            tail: false
                          },
                          {
                            type: 'TemplateElement',
                            start: 51,
                            end: 52,
                            range: [51, 52],
                            value: {
                              raw: 'e',
                              cooked: 'e'
                            },
                            tail: true
                          }
                        ]
                      },
                      value: {
                        type: 'Identifier',
                        start: 56,
                        end: 58,
                        range: [56, 58],
                        name: 'd2'
                      },
                      kind: 'init'
                    },
                    {
                      type: 'RestElement',
                      start: 60,
                      end: 65,
                      range: [60, 65],
                      argument: {
                        type: 'Identifier',
                        start: 63,
                        end: 65,
                        range: [63, 65],
                        name: 'e1'
                      }
                    }
                  ]
                },
                init: {
                  type: 'Identifier',
                  start: 70,
                  end: 71,
                  range: [70, 71],
                  name: 'e'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 15,
              range: [1, 15],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 14,
                  range: [2, 14],
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    value: 5
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 10,
                    end: 14,
                    range: [10, 14],
                    id: null,
                    generator: true,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 12,
                      end: 14,
                      range: [12, 14],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({async 8(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 14,
              range: [1, 14],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 13,
                  range: [2, 13],
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    value: 8
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 9,
                    end: 13,
                    range: [9, 13],
                    id: null,
                    generator: false,
                    async: true,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 11,
                      end: 13,
                      range: [11, 13],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({5(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 9,
        range: [0, 9],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 9,
            range: [0, 9],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 8,
              range: [1, 8],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 7,
                  range: [2, 7],
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    value: 5
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 3,
                    end: 7,
                    range: [3, 7],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 5,
                      end: 7,
                      range: [5, 7],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({"foo"(){}})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 13,
        range: [0, 13],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 13,
            range: [0, 13],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 12,
              range: [1, 12],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 11,
                  range: [2, 11],
                  method: true,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    value: 'foo'
                  },
                  kind: 'init',
                  value: {
                    type: 'FunctionExpression',
                    start: 7,
                    end: 11,
                    range: [7, 11],
                    id: null,
                    generator: false,
                    async: false,
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      start: 9,
                      end: 11,
                      range: [9, 11],
                      body: []
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsLoc,
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
                    value: 15,
                    loc: {
                      start: {
                        line: 1,
                        column: 8
                      },
                      end: {
                        line: 1,
                        column: 10
                      }
                    }
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      loc: {
                        start: {
                          line: 1,
                          column: 12
                        },
                        end: {
                          line: 1,
                          column: 14
                        }
                      }
                    },
                    async: true,
                    generator: false,
                    id: null,
                    loc: {
                      start: {
                        line: 1,
                        column: 10
                      },
                      end: {
                        line: 1,
                        column: 14
                      }
                    }
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 14
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 15
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 17
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 17
          }
        }
      }
    ],
    [
      '({get "a b c"(){}});',
      Context.OptionsLoc,
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
                    value: 'a b c',
                    loc: {
                      start: {
                        line: 1,
                        column: 6
                      },
                      end: {
                        line: 1,
                        column: 13
                      }
                    }
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [],
                      loc: {
                        start: {
                          line: 1,
                          column: 15
                        },
                        end: {
                          line: 1,
                          column: 17
                        }
                      }
                    },
                    async: false,
                    generator: false,
                    id: null,
                    loc: {
                      start: {
                        line: 1,
                        column: 13
                      },
                      end: {
                        line: 1,
                        column: 17
                      }
                    }
                  },
                  kind: 'get',
                  computed: false,
                  method: false,
                  shorthand: false,
                  loc: {
                    start: {
                      line: 1,
                      column: 2
                    },
                    end: {
                      line: 1,
                      column: 17
                    }
                  }
                }
              ],
              loc: {
                start: {
                  line: 1,
                  column: 1
                },
                end: {
                  line: 1,
                  column: 18
                }
              }
            },
            loc: {
              start: {
                line: 1,
                column: 0
              },
              end: {
                line: 1,
                column: 20
              }
            }
          }
        ],
        loc: {
          start: {
            line: 1,
            column: 0
          },
          end: {
            line: 1,
            column: 20
          }
        }
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 22,
            range: [0, 22],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 21,
              range: [0, 21],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 20,
                range: [5, 20],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 19,
                    range: [6, 19],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      name: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 15,
                      end: 19,
                      range: [15, 19],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 17,
                        end: 19,
                        range: [17, 19],
                        body: []
                      }
                    }
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
      'x = ({async async(){}});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 22,
                range: [5, 22],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 21,
                    range: [6, 21],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 17,
                      range: [12, 17],
                      name: 'async'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 17,
                      end: 21,
                      range: [17, 21],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 19,
                        end: 21,
                        range: [19, 21],
                        body: []
                      }
                    }
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
      'x = ({async "foo"(){}});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 22,
                range: [5, 22],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 21,
                    range: [6, 21],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 12,
                      end: 17,
                      range: [12, 17],
                      value: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 17,
                      end: 21,
                      range: [17, 21],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 19,
                        end: 21,
                        range: [19, 21],
                        body: []
                      }
                    }
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 24,
        range: [0, 24],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 24,
            range: [0, 24],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 23,
              range: [0, 23],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'ObjectExpression',
                  start: 5,
                  end: 22,
                  range: [5, 22],
                  properties: [
                    {
                      type: 'Property',
                      start: 6,
                      end: 21,
                      range: [6, 21],
                      method: true,
                      shorthand: false,
                      computed: true,
                      key: {
                        type: 'Identifier',
                        start: 13,
                        end: 16,
                        range: [13, 16],
                        name: 'foo'
                      },
                      kind: 'init',
                      value: {
                        type: 'FunctionExpression',
                        start: 17,
                        end: 21,
                        range: [17, 21],
                        id: null,
                        generator: false,
                        async: true,
                        params: [],
                        body: {
                          type: 'BlockStatement',
                          start: 19,
                          end: 21,
                          range: [19, 21],
                          body: []
                        }
                      }
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
      'x = ({async foo(){}, async bar(){}});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 37,
        range: [0, 37],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 37,
            range: [0, 37],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 36,
              range: [0, 36],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 35,
                range: [5, 35],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 19,
                    range: [6, 19],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      name: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 15,
                      end: 19,
                      range: [15, 19],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 17,
                        end: 19,
                        range: [17, 19],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'Property',
                    start: 21,
                    end: 34,
                    range: [21, 34],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 27,
                      end: 30,
                      range: [27, 30],
                      name: 'bar'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 30,
                      end: 34,
                      range: [30, 34],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 32,
                        end: 34,
                        range: [32, 34],
                        body: []
                      }
                    }
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
      '({x: y, z})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 10,
              range: [1, 10],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 6,
                  range: [2, 6],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    name: 'x'
                  },
                  value: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'y'
                  },
                  kind: 'init'
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
                    name: 'z'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 8,
                    end: 9,
                    range: [8, 9],
                    name: 'z'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = ({async foo(){}, bar(){}});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 31,
        range: [0, 31],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 31,
            range: [0, 31],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 30,
              range: [0, 30],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 29,
                range: [5, 29],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 19,
                    range: [6, 19],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      name: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 15,
                      end: 19,
                      range: [15, 19],
                      id: null,
                      generator: false,
                      async: true,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 17,
                        end: 19,
                        range: [17, 19],
                        body: []
                      }
                    }
                  },
                  {
                    type: 'Property',
                    start: 21,
                    end: 28,
                    range: [21, 28],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 21,
                      end: 24,
                      range: [21, 24],
                      name: 'bar'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 24,
                      end: 28,
                      range: [24, 28],
                      id: null,
                      generator: false,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 26,
                        end: 28,
                        range: [26, 28],
                        body: []
                      }
                    }
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 15,
                range: [5, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 14,
                    range: [6, 14],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 7,
                      end: 10,
                      range: [7, 10],
                      name: 'foo'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 10,
                      end: 14,
                      range: [10, 14],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 12,
                        end: 14,
                        range: [12, 14],
                        body: []
                      }
                    }
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
      'x = ({*get(){}});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 5,
                end: 15,
                range: [5, 15],
                properties: [
                  {
                    type: 'Property',
                    start: 6,
                    end: 14,
                    range: [6, 14],
                    method: true,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 7,
                      end: 10,
                      range: [7, 10],
                      name: 'get'
                    },
                    kind: 'init',
                    value: {
                      type: 'FunctionExpression',
                      start: 10,
                      end: 14,
                      range: [10, 14],
                      id: null,
                      generator: true,
                      async: false,
                      params: [],
                      body: {
                        type: 'BlockStatement',
                        start: 12,
                        end: 14,
                        range: [12, 14],
                        body: []
                      }
                    }
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
      '({ [a]: {} [a] })',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              properties: [
                {
                  type: 'Property',
                  start: 3,
                  end: 14,
                  range: [3, 14],
                  method: false,
                  shorthand: false,
                  computed: true,
                  key: {
                    type: 'Identifier',
                    start: 4,
                    end: 5,
                    range: [4, 5],
                    name: 'a'
                  },
                  value: {
                    type: 'MemberExpression',
                    start: 8,
                    end: 14,
                    range: [8, 14],
                    object: {
                      type: 'ObjectExpression',
                      start: 8,
                      end: 10,
                      range: [8, 10],
                      properties: []
                    },
                    property: {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'a'
                    },
                    computed: true
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {15:b}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 10,
              range: [0, 10],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 10,
                range: [4, 10],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 9,
                    range: [5, 9],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 5,
                      end: 7,
                      range: [5, 7],
                      value: 15
                    },
                    value: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'b'
                    },
                    kind: 'init'
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
      'x = {.9:a, 0x84:b, 0b1:c, 0o27:d, 1e234:e}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 42,
        range: [0, 42],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 42,
            range: [0, 42],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 42,
              range: [0, 42],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 42,
                range: [4, 42],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 9,
                    range: [5, 9],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 5,
                      end: 7,
                      range: [5, 7],
                      value: 0.9
                    },
                    value: {
                      type: 'Identifier',
                      start: 8,
                      end: 9,
                      range: [8, 9],
                      name: 'a'
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 11,
                    end: 17,
                    range: [11, 17],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 11,
                      end: 15,
                      range: [11, 15],
                      value: 132
                    },
                    value: {
                      type: 'Identifier',
                      start: 16,
                      end: 17,
                      range: [16, 17],
                      name: 'b'
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 19,
                    end: 24,
                    range: [19, 24],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 19,
                      end: 22,
                      range: [19, 22],
                      value: 1
                    },
                    value: {
                      type: 'Identifier',
                      start: 23,
                      end: 24,
                      range: [23, 24],
                      name: 'c'
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 26,
                    end: 32,
                    range: [26, 32],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 26,
                      end: 30,
                      range: [26, 30],
                      value: 23
                    },
                    value: {
                      type: 'Identifier',
                      start: 31,
                      end: 32,
                      range: [31, 32],
                      name: 'd'
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 34,
                    end: 41,
                    range: [34, 41],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 34,
                      end: 39,
                      range: [34, 39],
                      value: 1e234
                    },
                    value: {
                      type: 'Identifier',
                      start: 40,
                      end: 41,
                      range: [40, 41],
                      name: 'e'
                    },
                    kind: 'init'
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
      'x = {1:b, 0:d}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 14,
                range: [4, 14],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 8,
                    range: [5, 8],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      value: 1
                    },
                    value: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'b'
                    },
                    kind: 'init'
                  },
                  {
                    type: 'Property',
                    start: 10,
                    end: 13,
                    range: [10, 13],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 10,
                      end: 11,
                      range: [10, 11],
                      value: 0
                    },
                    value: {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'd'
                    },
                    kind: 'init'
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
      'x = {"a":b}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 11,
              range: [0, 11],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 11,
                range: [4, 11],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      value: 'a'
                    },
                    value: {
                      type: 'Identifier',
                      start: 9,
                      end: 10,
                      range: [9, 10],
                      name: 'b'
                    },
                    kind: 'init'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 18,
              range: [0, 18],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 18,
                range: [4, 18],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 17,
                    range: [5, 17],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 9,
                      end: 12,
                      range: [9, 12],
                      name: 'get'
                    },
                    kind: 'set',
                    value: {
                      type: 'FunctionExpression',
                      start: 12,
                      end: 17,
                      range: [12, 17],
                      id: null,
                      generator: false,
                      async: false,
                      params: [
                        {
                          type: 'Identifier',
                          start: 13,
                          end: 14,
                          range: [13, 14],
                          name: 'a'
                        }
                      ],
                      body: {
                        type: 'BlockStatement',
                        start: 15,
                        end: 17,
                        range: [15, 17],
                        body: []
                      }
                    }
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
      'x = {foo: typeof x}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 19,
              range: [0, 19],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 19,
                range: [4, 19],
                properties: [
                  {
                    type: 'Property',
                    start: 5,
                    end: 18,
                    range: [5, 18],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 5,
                      end: 8,
                      range: [5, 8],
                      name: 'foo'
                    },
                    value: {
                      type: 'UnaryExpression',
                      start: 10,
                      end: 18,
                      range: [10, 18],
                      operator: 'typeof',
                      prefix: true,
                      argument: {
                        type: 'Identifier',
                        start: 17,
                        end: 18,
                        range: [17, 18],
                        name: 'x'
                      }
                    },
                    kind: 'init'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 12,
              range: [0, 12],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 12,
                range: [4, 12],
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 11,
                    range: [5, 11],
                    argument: {
                      type: 'AssignmentExpression',
                      start: 8,
                      end: 11,
                      range: [8, 11],
                      operator: '=',
                      left: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'a'
                      },
                      right: {
                        type: 'Identifier',
                        start: 10,
                        end: 11,
                        range: [10, 11],
                        name: 'b'
                      }
                    }
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 15,
                range: [4, 15],
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    argument: {
                      type: 'ArrayExpression',
                      start: 8,
                      end: 14,
                      range: [8, 14],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          name: 'a'
                        },
                        {
                          type: 'Identifier',
                          start: 12,
                          end: 13,
                          range: [12, 13],
                          name: 'b'
                        }
                      ]
                    }
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
      'x = {...{a, b}}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 15,
              range: [0, 15],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 15,
                range: [4, 15],
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 14,
                    range: [5, 14],
                    argument: {
                      type: 'ObjectExpression',
                      start: 8,
                      end: 14,
                      range: [8, 14],
                      properties: [
                        {
                          type: 'Property',
                          start: 9,
                          end: 10,
                          range: [9, 10],
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 9,
                            end: 10,
                            range: [9, 10],
                            name: 'a'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 9,
                            end: 10,
                            range: [9, 10],
                            name: 'a'
                          }
                        },
                        {
                          type: 'Property',
                          start: 12,
                          end: 13,
                          range: [12, 13],
                          method: false,
                          shorthand: true,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 12,
                            end: 13,
                            range: [12, 13],
                            name: 'b'
                          },
                          kind: 'init',
                          value: {
                            type: 'Identifier',
                            start: 12,
                            end: 13,
                            range: [12, 13],
                            name: 'b'
                          }
                        }
                      ]
                    }
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
      '({...a})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 8,
            range: [0, 8],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 7,
              range: [1, 7],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 6,
                  range: [2, 6],
                  argument: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'a'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({...a=b})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 10,
            range: [0, 10],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 9,
              range: [1, 9],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 8,
                  range: [2, 8],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 5,
                    end: 8,
                    range: [5, 8],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'a'
                    },
                    right: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'b'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 49,
        range: [0, 49],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 49,
            range: [0, 49],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 48,
              range: [0, 48],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 43,
                range: [0, 43],
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 19,
                    range: [1, 19],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 9,
                        range: [2, 9],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 4,
                          end: 9,
                          range: [4, 9],
                          left: {
                            type: 'Identifier',
                            start: 4,
                            end: 5,
                            range: [4, 5],
                            name: 'x'
                          },
                          right: {
                            type: 'Literal',
                            start: 8,
                            end: 9,
                            range: [8, 9],
                            value: 1,
                            raw: '1'
                          }
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 11,
                        end: 18,
                        range: [11, 18],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 11,
                          end: 12,
                          range: [11, 12],
                          name: 'y'
                        },
                        value: {
                          type: 'AssignmentPattern',
                          start: 13,
                          end: 18,
                          range: [13, 18],
                          left: {
                            type: 'Identifier',
                            start: 13,
                            end: 14,
                            range: [13, 14],
                            name: 'y'
                          },
                          right: {
                            type: 'Literal',
                            start: 17,
                            end: 18,
                            range: [17, 18],
                            value: 2,
                            raw: '2'
                          }
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ArrayPattern',
                    start: 21,
                    end: 42,
                    range: [21, 42],
                    elements: [
                      {
                        type: 'AssignmentPattern',
                        start: 22,
                        end: 27,
                        range: [22, 27],
                        left: {
                          type: 'Identifier',
                          start: 22,
                          end: 23,
                          range: [22, 23],
                          name: 'a'
                        },
                        right: {
                          type: 'Literal',
                          start: 26,
                          end: 27,
                          range: [26, 27],
                          value: 3,
                          raw: '3'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 29,
                        end: 34,
                        range: [29, 34],
                        left: {
                          type: 'Identifier',
                          start: 29,
                          end: 30,
                          range: [29, 30],
                          name: 'b'
                        },
                        right: {
                          type: 'Literal',
                          start: 33,
                          end: 34,
                          range: [33, 34],
                          value: 4,
                          raw: '4'
                        }
                      },
                      {
                        type: 'AssignmentPattern',
                        start: 36,
                        end: 41,
                        range: [36, 41],
                        left: {
                          type: 'Identifier',
                          start: 36,
                          end: 37,
                          range: [36, 37],
                          name: 'c'
                        },
                        right: {
                          type: 'Literal',
                          start: 40,
                          end: 41,
                          range: [40, 41],
                          value: 5,
                          raw: '5'
                        }
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 46,
                end: 48,
                range: [46, 48],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],

    [
      '({[foo()] : (z)} = z = {});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 27,
        range: [0, 27],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 27,
            range: [0, 27],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 25,
              range: [1, 25],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 16,
                range: [1, 16],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 15,
                    range: [2, 15],
                    method: false,
                    shorthand: false,
                    computed: true,
                    key: {
                      type: 'CallExpression',
                      start: 3,
                      end: 8,
                      range: [3, 8],
                      callee: {
                        type: 'Identifier',
                        start: 3,
                        end: 6,
                        range: [3, 6],
                        name: 'foo'
                      },
                      arguments: []
                    },
                    value: {
                      type: 'Identifier',
                      start: 13,
                      end: 14,
                      range: [13, 14],
                      name: 'z'
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'AssignmentExpression',
                start: 19,
                end: 25,
                range: [19, 25],
                operator: '=',
                left: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  range: [19, 20],
                  name: 'z'
                },
                right: {
                  type: 'ObjectExpression',
                  start: 23,
                  end: 25,
                  range: [23, 25],
                  properties: []
                }
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 15,
              range: [1, 15],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 11,
                range: [1, 11],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 10,
                    range: [2, 10],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 2,
                      end: 5,
                      range: [2, 5],
                      value: 'x'
                    },
                    value: {
                      type: 'ArrayPattern',
                      start: 7,
                      end: 10,
                      range: [7, 10],
                      elements: [
                        {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          range: [8, 9],
                          name: 'y'
                        }
                      ]
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 14,
                end: 15,
                range: [14, 15],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
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

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({"x": [y + x]})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 15,
              range: [1, 15],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 14,
                  range: [2, 14],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 2,
                    end: 5,
                    range: [2, 5],
                    value: 'x'
                  },
                  value: {
                    type: 'ArrayExpression',
                    start: 7,
                    end: 14,
                    range: [7, 14],
                    elements: [
                      {
                        type: 'BinaryExpression',
                        start: 8,
                        end: 13,
                        range: [8, 13],
                        left: {
                          type: 'Identifier',
                          start: 8,
                          end: 9,
                          range: [8, 9],
                          name: 'y'
                        },
                        operator: '+',
                        right: {
                          type: 'Identifier',
                          start: 12,
                          end: 13,
                          range: [12, 13],
                          name: 'x'
                        }
                      }
                    ]
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 14,
                range: [1, 14],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 13,
                    range: [2, 13],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Literal',
                      start: 2,
                      end: 5,
                      range: [2, 5],
                      value: 'x'
                    },
                    value: {
                      type: 'ObjectPattern',
                      start: 7,
                      end: 13,
                      range: [7, 13],
                      properties: [
                        {
                          type: 'Property',
                          start: 8,
                          end: 12,
                          range: [8, 12],
                          method: false,
                          shorthand: false,
                          computed: false,
                          key: {
                            type: 'Identifier',
                            start: 8,
                            end: 9,
                            range: [8, 9],
                            name: 'y'
                          },
                          value: {
                            type: 'Identifier',
                            start: 11,
                            end: 12,
                            range: [11, 12],
                            name: 'z'
                          },
                          kind: 'init'
                        }
                      ]
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 17,
                end: 18,
                range: [17, 18],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 28,
            range: [0, 28],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 27,
              range: [1, 27],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 26,
                  range: [2, 26],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 2,
                    end: 5,
                    range: [2, 5],
                    value: 'x'
                  },
                  value: {
                    type: 'CallExpression',
                    start: 7,
                    end: 26,
                    range: [7, 26],
                    callee: {
                      type: 'MemberExpression',
                      start: 7,
                      end: 23,
                      range: [7, 23],
                      object: {
                        type: 'ObjectExpression',
                        start: 7,
                        end: 17,
                        range: [7, 17],
                        properties: [
                          {
                            type: 'Property',
                            start: 8,
                            end: 16,
                            range: [8, 16],
                            method: false,
                            shorthand: false,
                            computed: false,
                            key: {
                              type: 'Identifier',
                              start: 8,
                              end: 9,
                              range: [8, 9],
                              name: 'a'
                            },
                            value: {
                              type: 'BinaryExpression',
                              start: 11,
                              end: 16,
                              range: [11, 16],
                              left: {
                                type: 'Identifier',
                                start: 11,
                                end: 12,
                                range: [11, 12],
                                name: 'y'
                              },
                              operator: '+',
                              right: {
                                type: 'Identifier',
                                start: 15,
                                end: 16,
                                range: [15, 16],
                                name: 'x'
                              }
                            },
                            kind: 'init'
                          }
                        ]
                      },
                      property: {
                        type: 'Identifier',
                        start: 18,
                        end: 23,
                        range: [18, 23],
                        name: 'slice'
                      },
                      computed: false
                    },
                    arguments: [
                      {
                        type: 'Literal',
                        start: 24,
                        end: 25,
                        range: [24, 25],
                        value: 0
                      }
                    ]
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 17,
        range: [0, 17],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 17,
            range: [0, 17],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              properties: [
                {
                  type: 'Property',
                  start: 2,
                  end: 15,
                  range: [2, 15],
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Literal',
                    start: 2,
                    end: 5,
                    range: [2, 5],
                    value: 'x'
                  },
                  value: {
                    type: 'MemberExpression',
                    start: 7,
                    end: 15,
                    range: [7, 15],
                    object: {
                      type: 'Literal',
                      start: 7,
                      end: 11,
                      range: [7, 11],
                      value: 600
                    },
                    property: {
                      type: 'Identifier',
                      start: 12,
                      end: 15,
                      range: [12, 15],
                      name: 'xyz'
                    },
                    computed: false
                  },
                  kind: 'init'
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({[a]:b}=obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 17,
              range: [0, 17],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 5,
                  end: 16,
                  range: [5, 16],
                  operator: '=',
                  left: {
                    type: 'ObjectPattern',
                    start: 5,
                    end: 12,
                    range: [5, 12],
                    properties: [
                      {
                        type: 'Property',
                        start: 6,
                        end: 11,
                        range: [6, 11],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 7,
                          end: 8,
                          range: [7, 8],
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'b'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 13,
                    end: 16,
                    range: [13, 16],
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'wrap({[a]:b, [15]:d}=obj);',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 26,
            range: [0, 26],
            expression: {
              type: 'CallExpression',
              start: 0,
              end: 25,
              range: [0, 25],
              callee: {
                type: 'Identifier',
                start: 0,
                end: 4,
                range: [0, 4],
                name: 'wrap'
              },
              arguments: [
                {
                  type: 'AssignmentExpression',
                  start: 5,
                  end: 24,
                  range: [5, 24],
                  operator: '=',
                  left: {
                    type: 'ObjectPattern',
                    start: 5,
                    end: 20,
                    range: [5, 20],
                    properties: [
                      {
                        type: 'Property',
                        start: 6,
                        end: 11,
                        range: [6, 11],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Identifier',
                          start: 7,
                          end: 8,
                          range: [7, 8],
                          name: 'a'
                        },
                        value: {
                          type: 'Identifier',
                          start: 10,
                          end: 11,
                          range: [10, 11],
                          name: 'b'
                        },
                        kind: 'init'
                      },
                      {
                        type: 'Property',
                        start: 13,
                        end: 19,
                        range: [13, 19],
                        method: false,
                        shorthand: false,
                        computed: true,
                        key: {
                          type: 'Literal',
                          start: 14,
                          end: 16,
                          range: [14, 16],
                          value: 15
                        },
                        value: {
                          type: 'Identifier',
                          start: 18,
                          end: 19,
                          range: [18, 19],
                          name: 'd'
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  right: {
                    type: 'Identifier',
                    start: 21,
                    end: 24,
                    range: [21, 24],
                    name: 'obj'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 18,
            range: [0, 18],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 16,
              range: [1, 16],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 12,
                range: [1, 12],
                properties: [
                  {
                    type: 'Property',
                    start: 3,
                    end: 10,
                    range: [3, 10],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 3,
                      end: 4,
                      range: [3, 4],
                      name: 'x'
                    },
                    value: {
                      type: 'MemberExpression',
                      start: 6,
                      end: 10,
                      range: [6, 10],
                      object: {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'x'
                      },
                      property: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'Y'
                      },
                      computed: true
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'Identifier',
                start: 15,
                end: 16,
                range: [15, 16],
                name: 'x'
              }
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 15,
        range: [0, 15],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 15,
            range: [0, 15],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 8,
                range: [1, 8],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 7,
                    range: [2, 7],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'x'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 2,
                      end: 7,
                      range: [2, 7],
                      left: {
                        type: 'Identifier',
                        start: 2,
                        end: 3,
                        range: [2, 3],
                        name: 'x'
                      },
                      right: {
                        type: 'Literal',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        value: 1
                      }
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 11,
                end: 13,
                range: [11, 13],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({x, y = 1, z = 2} = {});',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 25,
            range: [0, 25],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 23,
              range: [1, 23],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 18,
                range: [1, 18],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 3,
                    range: [2, 3],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'x'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'x'
                    }
                  },
                  {
                    type: 'Property',
                    start: 5,
                    end: 10,
                    range: [5, 10],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'y'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 5,
                      end: 10,
                      range: [5, 10],
                      left: {
                        type: 'Identifier',
                        start: 5,
                        end: 6,
                        range: [5, 6],
                        name: 'y'
                      },
                      right: {
                        type: 'Literal',
                        start: 9,
                        end: 10,
                        range: [9, 10],
                        value: 1
                      }
                    }
                  },
                  {
                    type: 'Property',
                    start: 12,
                    end: 17,
                    range: [12, 17],
                    method: false,
                    shorthand: true,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 12,
                      end: 13,
                      range: [12, 13],
                      name: 'z'
                    },
                    kind: 'init',
                    value: {
                      type: 'AssignmentPattern',
                      start: 12,
                      end: 17,
                      range: [12, 17],
                      left: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'z'
                      },
                      right: {
                        type: 'Literal',
                        start: 16,
                        end: 17,
                        range: [16, 17],
                        value: 2
                      }
                    }
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 21,
                end: 23,
                range: [21, 23],
                properties: []
              }
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 103,
        range: [0, 103],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 103,
            range: [0, 103],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 102,
              range: [0, 102],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 65,
                range: [0, 65],
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 29,
                    range: [1, 29],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 27,
                        range: [2, 27],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          start: 6,
                          end: 27,
                          range: [6, 27],
                          elements: [
                            {
                              type: 'ObjectPattern',
                              start: 7,
                              end: 26,
                              range: [7, 26],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 8,
                                  end: 17,
                                  range: [8, 17],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 8,
                                    end: 9,
                                    range: [8, 9],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    start: 10,
                                    end: 17,
                                    range: [10, 17],
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 11,
                                        end: 16,
                                        range: [11, 16],
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 11,
                                          end: 12,
                                          range: [11, 12],
                                          name: 'z'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 11,
                                          end: 16,
                                          range: [11, 16],
                                          left: {
                                            type: 'Identifier',
                                            start: 11,
                                            end: 12,
                                            range: [11, 12],
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 15,
                                            end: 16,
                                            range: [15, 16],
                                            value: 1,
                                            raw: '1'
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  kind: 'init'
                                },
                                {
                                  type: 'Property',
                                  start: 19,
                                  end: 25,
                                  range: [19, 25],
                                  method: false,
                                  shorthand: true,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 19,
                                    end: 21,
                                    range: [19, 21],
                                    name: 'z1'
                                  },
                                  kind: 'init',
                                  value: {
                                    type: 'AssignmentPattern',
                                    start: 19,
                                    end: 25,
                                    range: [19, 25],
                                    left: {
                                      type: 'Identifier',
                                      start: 19,
                                      end: 21,
                                      range: [19, 21],
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      start: 24,
                                      end: 25,
                                      range: [24, 25],
                                      value: 2,
                                      raw: '2'
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 31,
                    end: 39,
                    range: [31, 39],
                    properties: [
                      {
                        type: 'Property',
                        start: 32,
                        end: 38,
                        range: [32, 38],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 32,
                          end: 34,
                          range: [32, 34],
                          name: 'x2'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 32,
                          end: 38,
                          range: [32, 38],
                          left: {
                            type: 'Identifier',
                            start: 32,
                            end: 34,
                            range: [32, 34],
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            start: 37,
                            end: 38,
                            range: [37, 38],
                            value: 3,
                            raw: '3'
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 41,
                    end: 63,
                    range: [41, 63],
                    properties: [
                      {
                        type: 'Property',
                        start: 42,
                        end: 62,
                        range: [42, 62],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 42,
                          end: 44,
                          range: [42, 44],
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          start: 47,
                          end: 62,
                          range: [47, 62],
                          properties: [
                            {
                              type: 'Property',
                              start: 48,
                              end: 61,
                              range: [48, 61],
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 48,
                                end: 50,
                                range: [48, 50],
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                start: 51,
                                end: 61,
                                range: [51, 61],
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    start: 52,
                                    end: 60,
                                    range: [52, 60],
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 53,
                                        end: 59,
                                        range: [53, 59],
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 53,
                                          end: 55,
                                          range: [53, 55],
                                          name: 'z3'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 53,
                                          end: 59,
                                          range: [53, 59],
                                          left: {
                                            type: 'Identifier',
                                            start: 53,
                                            end: 55,
                                            range: [53, 55],
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 58,
                                            end: 59,
                                            range: [58, 59],
                                            value: 4,
                                            raw: '4'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 68,
                end: 102,
                range: [68, 102],
                elements: [
                  {
                    type: 'ObjectExpression',
                    start: 69,
                    end: 81,
                    range: [69, 81],
                    properties: [
                      {
                        type: 'Property',
                        start: 70,
                        end: 80,
                        range: [70, 80],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 70,
                          end: 71,
                          range: [70, 71],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          start: 72,
                          end: 80,
                          range: [72, 80],
                          elements: [
                            {
                              type: 'ObjectExpression',
                              start: 73,
                              end: 79,
                              range: [73, 79],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 74,
                                  end: 78,
                                  range: [74, 78],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 74,
                                    end: 75,
                                    range: [74, 75],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    start: 76,
                                    end: 78,
                                    range: [76, 78],
                                    properties: []
                                  },
                                  kind: 'init'
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    start: 83,
                    end: 85,
                    range: [83, 85],
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    start: 87,
                    end: 101,
                    range: [87, 101],
                    properties: [
                      {
                        type: 'Property',
                        start: 88,
                        end: 100,
                        range: [88, 100],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 88,
                          end: 90,
                          range: [88, 90],
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          start: 91,
                          end: 100,
                          range: [91, 100],
                          properties: [
                            {
                              type: 'Property',
                              start: 92,
                              end: 99,
                              range: [92, 99],
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 92,
                                end: 94,
                                range: [92, 94],
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                start: 95,
                                end: 99,
                                range: [95, 99],
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    start: 96,
                                    end: 98,
                                    range: [96, 98],
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
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
      '[{x : [{y:{z = 1}, z1 = 2}] }, {x2 = 3}, {x3 : {y3:[{z3 = 4}]}} ] = [{x:[{y:{}}]}, {}, {x3:{y3:[{}]}}];',
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 103,
        range: [0, 103],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 103,
            range: [0, 103],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 102,
              range: [0, 102],
              operator: '=',
              left: {
                type: 'ArrayPattern',
                start: 0,
                end: 65,
                range: [0, 65],
                elements: [
                  {
                    type: 'ObjectPattern',
                    start: 1,
                    end: 29,
                    range: [1, 29],
                    properties: [
                      {
                        type: 'Property',
                        start: 2,
                        end: 27,
                        range: [2, 27],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 2,
                          end: 3,
                          range: [2, 3],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayPattern',
                          start: 6,
                          end: 27,
                          range: [6, 27],
                          elements: [
                            {
                              type: 'ObjectPattern',
                              start: 7,
                              end: 26,
                              range: [7, 26],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 8,
                                  end: 17,
                                  range: [8, 17],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 8,
                                    end: 9,
                                    range: [8, 9],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectPattern',
                                    start: 10,
                                    end: 17,
                                    range: [10, 17],
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 11,
                                        end: 16,
                                        range: [11, 16],
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 11,
                                          end: 12,
                                          range: [11, 12],
                                          name: 'z'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 11,
                                          end: 16,
                                          range: [11, 16],
                                          left: {
                                            type: 'Identifier',
                                            start: 11,
                                            end: 12,
                                            range: [11, 12],
                                            name: 'z'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 15,
                                            end: 16,
                                            range: [15, 16],
                                            value: 1,
                                            raw: '1'
                                          }
                                        }
                                      }
                                    ]
                                  },
                                  kind: 'init'
                                },
                                {
                                  type: 'Property',
                                  start: 19,
                                  end: 25,
                                  range: [19, 25],
                                  method: false,
                                  shorthand: true,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 19,
                                    end: 21,
                                    range: [19, 21],
                                    name: 'z1'
                                  },
                                  kind: 'init',
                                  value: {
                                    type: 'AssignmentPattern',
                                    start: 19,
                                    end: 25,
                                    range: [19, 25],
                                    left: {
                                      type: 'Identifier',
                                      start: 19,
                                      end: 21,
                                      range: [19, 21],
                                      name: 'z1'
                                    },
                                    right: {
                                      type: 'Literal',
                                      start: 24,
                                      end: 25,
                                      range: [24, 25],
                                      value: 2,
                                      raw: '2'
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 31,
                    end: 39,
                    range: [31, 39],
                    properties: [
                      {
                        type: 'Property',
                        start: 32,
                        end: 38,
                        range: [32, 38],
                        method: false,
                        shorthand: true,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 32,
                          end: 34,
                          range: [32, 34],
                          name: 'x2'
                        },
                        kind: 'init',
                        value: {
                          type: 'AssignmentPattern',
                          start: 32,
                          end: 38,
                          range: [32, 38],
                          left: {
                            type: 'Identifier',
                            start: 32,
                            end: 34,
                            range: [32, 34],
                            name: 'x2'
                          },
                          right: {
                            type: 'Literal',
                            start: 37,
                            end: 38,
                            range: [37, 38],
                            value: 3,
                            raw: '3'
                          }
                        }
                      }
                    ]
                  },
                  {
                    type: 'ObjectPattern',
                    start: 41,
                    end: 63,
                    range: [41, 63],
                    properties: [
                      {
                        type: 'Property',
                        start: 42,
                        end: 62,
                        range: [42, 62],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 42,
                          end: 44,
                          range: [42, 44],
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectPattern',
                          start: 47,
                          end: 62,
                          range: [47, 62],
                          properties: [
                            {
                              type: 'Property',
                              start: 48,
                              end: 61,
                              range: [48, 61],
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 48,
                                end: 50,
                                range: [48, 50],
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayPattern',
                                start: 51,
                                end: 61,
                                range: [51, 61],
                                elements: [
                                  {
                                    type: 'ObjectPattern',
                                    start: 52,
                                    end: 60,
                                    range: [52, 60],
                                    properties: [
                                      {
                                        type: 'Property',
                                        start: 53,
                                        end: 59,
                                        range: [53, 59],
                                        method: false,
                                        shorthand: true,
                                        computed: false,
                                        key: {
                                          type: 'Identifier',
                                          start: 53,
                                          end: 55,
                                          range: [53, 55],
                                          name: 'z3'
                                        },
                                        kind: 'init',
                                        value: {
                                          type: 'AssignmentPattern',
                                          start: 53,
                                          end: 59,
                                          range: [53, 59],
                                          left: {
                                            type: 'Identifier',
                                            start: 53,
                                            end: 55,
                                            range: [53, 55],
                                            name: 'z3'
                                          },
                                          right: {
                                            type: 'Literal',
                                            start: 58,
                                            end: 59,
                                            range: [58, 59],
                                            value: 4,
                                            raw: '4'
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  }
                ]
              },
              right: {
                type: 'ArrayExpression',
                start: 68,
                end: 102,
                range: [68, 102],
                elements: [
                  {
                    type: 'ObjectExpression',
                    start: 69,
                    end: 81,
                    range: [69, 81],
                    properties: [
                      {
                        type: 'Property',
                        start: 70,
                        end: 80,
                        range: [70, 80],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 70,
                          end: 71,
                          range: [70, 71],
                          name: 'x'
                        },
                        value: {
                          type: 'ArrayExpression',
                          start: 72,
                          end: 80,
                          range: [72, 80],
                          elements: [
                            {
                              type: 'ObjectExpression',
                              start: 73,
                              end: 79,
                              range: [73, 79],
                              properties: [
                                {
                                  type: 'Property',
                                  start: 74,
                                  end: 78,
                                  range: [74, 78],
                                  method: false,
                                  shorthand: false,
                                  computed: false,
                                  key: {
                                    type: 'Identifier',
                                    start: 74,
                                    end: 75,
                                    range: [74, 75],
                                    name: 'y'
                                  },
                                  value: {
                                    type: 'ObjectExpression',
                                    start: 76,
                                    end: 78,
                                    range: [76, 78],
                                    properties: []
                                  },
                                  kind: 'init'
                                }
                              ]
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
                  },
                  {
                    type: 'ObjectExpression',
                    start: 83,
                    end: 85,
                    range: [83, 85],
                    properties: []
                  },
                  {
                    type: 'ObjectExpression',
                    start: 87,
                    end: 101,
                    range: [87, 101],
                    properties: [
                      {
                        type: 'Property',
                        start: 88,
                        end: 100,
                        range: [88, 100],
                        method: false,
                        shorthand: false,
                        computed: false,
                        key: {
                          type: 'Identifier',
                          start: 88,
                          end: 90,
                          range: [88, 90],
                          name: 'x3'
                        },
                        value: {
                          type: 'ObjectExpression',
                          start: 91,
                          end: 100,
                          range: [91, 100],
                          properties: [
                            {
                              type: 'Property',
                              start: 92,
                              end: 99,
                              range: [92, 99],
                              method: false,
                              shorthand: false,
                              computed: false,
                              key: {
                                type: 'Identifier',
                                start: 92,
                                end: 94,
                                range: [92, 94],
                                name: 'y3'
                              },
                              value: {
                                type: 'ArrayExpression',
                                start: 95,
                                end: 99,
                                range: [95, 99],
                                elements: [
                                  {
                                    type: 'ObjectExpression',
                                    start: 96,
                                    end: 98,
                                    range: [96, 98],
                                    properties: []
                                  }
                                ]
                              },
                              kind: 'init'
                            }
                          ]
                        },
                        kind: 'init'
                      }
                    ]
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 13,
              range: [1, 13],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 10,
                  range: [2, 10],
                  argument: {
                    type: 'SequenceExpression',
                    start: 6,
                    end: 9,
                    range: [6, 9],
                    expressions: [
                      {
                        type: 'Identifier',
                        start: 6,
                        end: 7,
                        range: [6, 7],
                        name: 'a'
                      },
                      {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'b'
                      }
                    ]
                  }
                },
                {
                  type: 'Property',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    name: 'c'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 11,
                    end: 12,
                    range: [11, 12],
                    name: 'c'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      '({...a,b,c})',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 12,
        range: [0, 12],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 12,
            range: [0, 12],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 11,
              range: [1, 11],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 6,
                  range: [2, 6],
                  argument: {
                    type: 'Identifier',
                    start: 5,
                    end: 6,
                    range: [5, 6],
                    name: 'a'
                  }
                },
                {
                  type: 'Property',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'b'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 7,
                    end: 8,
                    range: [7, 8],
                    name: 'b'
                  }
                },
                {
                  type: 'Property',
                  start: 9,
                  end: 10,
                  range: [9, 10],
                  method: false,
                  shorthand: true,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'c'
                  },
                  kind: 'init',
                  value: {
                    type: 'Identifier',
                    start: 9,
                    end: 10,
                    range: [9, 10],
                    name: 'c'
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
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
      Context.OptionsRanges | Context.OptionsRaw,
      {
        type: 'Program',
        start: 0,
        end: 19,
        range: [0, 19],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 19,
            range: [0, 19],
            expression: {
              type: 'AssignmentExpression',
              start: 1,
              end: 18,
              range: [1, 18],
              operator: '=',
              left: {
                type: 'ObjectPattern',
                start: 1,
                end: 7,
                range: [1, 7],
                properties: [
                  {
                    type: 'Property',
                    start: 2,
                    end: 6,
                    range: [2, 6],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 2,
                      end: 3,
                      range: [2, 3],
                      name: 'y'
                    },
                    value: {
                      type: 'Identifier',
                      start: 4,
                      end: 6,
                      range: [4, 6],
                      name: 'y2'
                    },
                    kind: 'init'
                  }
                ]
              },
              right: {
                type: 'ObjectExpression',
                start: 10,
                end: 18,
                range: [10, 18],
                properties: [
                  {
                    type: 'Property',
                    start: 11,
                    end: 17,
                    range: [11, 17],
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'y'
                    },
                    value: {
                      type: 'BinaryExpression',
                      start: 13,
                      end: 17,
                      range: [13, 17],
                      left: {
                        type: 'Identifier',
                        start: 13,
                        end: 15,
                        range: [13, 15],
                        name: 'y2'
                      },
                      operator: '-',
                      right: {
                        type: 'Literal',
                        start: 16,
                        end: 17,
                        range: [16, 17],
                        value: 2,
                        raw: '2'
                      }
                    },
                    kind: 'init'
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
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 11,
        range: [0, 11],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 11,
            range: [0, 11],
            expression: {
              type: 'ObjectExpression',
              start: 1,
              end: 9,
              range: [1, 9],
              properties: [
                {
                  type: 'SpreadElement',
                  start: 2,
                  end: 8,
                  range: [2, 8],
                  argument: {
                    type: 'AssignmentExpression',
                    start: 5,
                    end: 8,
                    range: [5, 8],
                    operator: '=',
                    left: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'x'
                    },
                    right: {
                      type: 'Identifier',
                      start: 7,
                      end: 8,
                      range: [7, 8],
                      name: 'y'
                    }
                  }
                }
              ]
            }
          }
        ],
        sourceType: 'script'
      }
    ],
    [
      'x = {...a + b}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 14,
        range: [0, 14],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 14,
            range: [0, 14],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 14,
              range: [0, 14],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 14,
                range: [4, 14],
                properties: [
                  {
                    type: 'SpreadElement',
                    start: 5,
                    end: 13,
                    range: [5, 13],
                    argument: {
                      type: 'BinaryExpression',
                      start: 8,
                      end: 13,
                      range: [8, 13],
                      left: {
                        type: 'Identifier',
                        start: 8,
                        end: 9,
                        range: [8, 9],
                        name: 'a'
                      },
                      operator: '+',
                      right: {
                        type: 'Identifier',
                        start: 12,
                        end: 13,
                        range: [12, 13],
                        name: 'b'
                      }
                    }
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
      'x = {a, ...y, b}',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 16,
        range: [0, 16],
        body: [
          {
            type: 'ExpressionStatement',
            start: 0,
            end: 16,
            range: [0, 16],
            expression: {
              type: 'AssignmentExpression',
              start: 0,
              end: 16,
              range: [0, 16],
              operator: '=',
              left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                range: [0, 1],
                name: 'x'
              },
              right: {
                type: 'ObjectExpression',
                start: 4,
                end: 16,
                range: [4, 16],
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
                      name: 'a'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 5,
                      end: 6,
                      range: [5, 6],
                      name: 'a'
                    }
                  },
                  {
                    type: 'SpreadElement',
                    start: 8,
                    end: 12,
                    range: [8, 12],
                    argument: {
                      type: 'Identifier',
                      start: 11,
                      end: 12,
                      range: [11, 12],
                      name: 'y'
                    }
                  },
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
                      name: 'b'
                    },
                    kind: 'init',
                    value: {
                      type: 'Identifier',
                      start: 14,
                      end: 15,
                      range: [14, 15],
                      name: 'b'
                    }
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

              async: false,
              expression: true
            }
          }
        ]
      }
    ],
    [
      '({1n:1})',
      Context.OptionsRanges,
      {
        sourceType: 'script',
        start: 0,
        type: 'Program',
        body: [
          {
            end: 8,
            expression: {
              end: 7,
              properties: [
                {
                  computed: false,
                  end: 6,
                  key: {
                    bigint: '1',
                    end: 4,
                    range: [2, 4],
                    start: 2,
                    type: 'Literal',
                    value: 1n
                  },
                  kind: 'init',
                  method: false,
                  range: [2, 6],
                  shorthand: false,
                  start: 2,
                  type: 'Property',
                  value: {
                    end: 6,
                    range: [5, 6],
                    start: 5,
                    type: 'Literal',
                    value: 1
                  }
                }
              ],
              range: [1, 7],
              start: 1,
              type: 'ObjectExpression'
            },
            range: [0, 8],
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        end: 8,
        range: [0, 8]
      }
    ]
  ]);
});
