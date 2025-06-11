import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { parseSource } from '../../../src/parser';

describe('Module - Export', () => {
  // Async await module errors
  for (const arg of [
    'export default (async function await() {})',
    'export default async function await() {}',
    'export async function await() {}',
    'export async function() {}',
    'export async',
    'export async\nfunction async() { await 1; }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsWebCompat);
      });
    });
  }

  // Async await module
  for (const arg of [
    'export default async function() { await 1; }',
    'export default async function async() { await 1; }',
    'export async function async() { await 1; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsWebCompat | Context.OptionsLexical,
        );
      });
    });
  }

  for (const arg of [
    'export {',
    'var a; export { a',
    'var a; export { a',
    'var a; export { a,',
    'var a; export { a, ;',
    'var a; export { a as };',
    'var a, b; export { a as , b};',
    'export function () {}',
    'export class () {}',
    'export var {[x]} = z;',
    'export var {[x]};',
    'export default async function() { yield = 1; }',
    'export default async function() { yield; }',
    'export const await = 5',
    String.raw`export function p\u0061ckage() {}`,
    String.raw`export function br\u0065ak() {}`,
    'export var {[x] = y} = z;',
    `export default var x = null;
    export default var x = null;`,
    'export { , };',
    'export default let x = 7;',
    'export default const x = 7;',
    'export *;',
    'export * from;',
    'export { Q } from;',
    'export { 123 } from;',
    'export { # } from;',
    'export {',
    'var a; export { a',
    'var a; export { a,',
    'var a; export { a, ;',
    'var a; export { a as };',
    'var a, b; export { a as , b};',
    'export }',
    'var foo, bar; export { foo bar };',
    'export { , };',
    'export var await',
    'export typeof foo;',
    'export new Foo();',
    'function foo() { export default function() { } }',
    'function foo() { }; export { , foo };',
    'function foo() { }; () => { export { foo }; }',
    'function foo() { }; try { export { foo }; } catch(e) { }',
    // 'Syntax error if export is followed by non-identifier'
    'export 12;',
    'export *',
    'export * from foo',
    'export { bar } from foo',
    'export const const1;',
    'function foo() { }; export foo;',
    'export function () { }',
    'export function* () { }',
    'export B, * as A, { C, D } from "test";',
    'export default;',
    'export default var x = 7;',
    'export default let x = 7;',
    'export default const x = 7;',
    'export * as;',
    'export * as foo;',
    'export * as foo from;',
    "export * as foo from ';",
    "export * as ,foo from 'bar'",
    'export *;',
    'export 12;',
    'export function() {}',
    'export function*() {}',
    'export class {}',
    'export class extends C {}',
    'export const const1;',
    'function foo() { }; export foo;',
    'export function () { }',
    'export function* () { }',
    'export class { }',
    'function foo() { }; export [ foo ];',
    'function foo() { export default function() { } }',
    'function foo() { }; export { , foo };',
    'function foo() { }; () => { export { foo }; }',
    'function foo() { }; try { export { foo }; } catch(e) { }',
    'function foo() { }; { export { foo }; }',
    'export default 1, 2, 3;',
    'export ',
    'if (false) export default null;',
    'if (false) {} else export default null;',
    'for(var i=0; i<1; i++) export default null;',
    'while(false) export default null;',
    `do export default null
                                while (false);`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  fail('Module - Export (fail)', [
    ['export const x = x, x = y;', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const [x, x] = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const [x, {x}] = y', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const {x:x, x:x} = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export const a = b; let a = c', Context.OptionsLexical | Context.Strict | Context.Module],
    ['var x; export {x: a}', Context.Strict | Context.Module],
    ['var x; export {x: a}', Context.OptionsWebCompat],
    ['export async function(){}', Context.Strict | Context.Module],
    ['export async', Context.Strict | Context.Module],
    ['export let ...x = y', Context.Strict | Context.Module],
    ['export ...x = y', Context.Strict | Context.Module],
    ['export default ...x = y', Context.Strict | Context.Module],
    ['export async function f(){} foo', Context.None],
    ['export class x {} foo', Context.None],
    ['export default await', Context.Strict | Context.Module],
    ['export var let = x;', Context.Strict | Context.Module],
    ['{export {x};}', Context.Strict | Context.Module],
    ['let x = () => {export {x};}', Context.Strict | Context.Module],
    ['if (x) export {x};', Context.Strict | Context.Module],
    ['for (;;) export {x};', Context.Strict | Context.Module],
    ['x = { foo(){ export {x}; }}', Context.Strict | Context.Module],
    ['x = { foo(){ export {x}; }}', Context.None],
    ['class x { foo(){ export {x}; }}', Context.Strict | Context.Module],
    ['var foo, bar; export {foo, ...bar}', Context.Strict | Context.Module],
    ['var foo, bar; export {[foo]}', Context.Strict | Context.Module],
    ['var foo, bar; export {{foo}}', Context.Strict | Context.Module],
    ['var foo, bar, x; export {{foo: x}}', Context.Strict | Context.Module],
    ['var foo; export {foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {[foo](){}}', Context.Strict | Context.Module],
    ['export let await;', Context.Strict | Context.Module],
    ['var foo; export {async foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {*foo(){}}', Context.Strict | Context.Module],
    ['var foo; export {*foo(){}}', Context.None],
    ['export foo', Context.Strict | Context.Module],
    ['export {', Context.Strict | Context.Module],
    ['export async;', Context.Strict | Context.Module],
    ['export async () => y', Context.Strict | Context.Module],
    ['var a; export { a,', Context.Strict | Context.Module],
    ['class A extends B { foo() { (super).foo } }', Context.OptionsWebCompat],
    ['export class extends C {}', Context.None],
    ['export *;', Context.Strict | Context.Module],
    ['export * as;', Context.Strict | Context.Module],
    [
      'var x; export { x as z }; export * as z from "string";',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export {', Context.Strict | Context.Module],
    ['export *;', Context.Strict | Context.Module],
    ['export * as;', Context.Strict | Context.Module],
    ['export * as foo;', Context.Strict | Context.Module],
    ['export * as foo from;', Context.Strict | Context.Module],
    ["export * as foo from ';", Context.Strict | Context.Module],
    ["export * as ,foo from 'bar'", Context.Strict | Context.Module],
    ['export * as foo from;', Context.Strict | Context.Module | Context.OptionsNext],
    ["export * as foo from ';", Context.Strict | Context.Module | Context.OptionsNext],
    ["export * as ,foo from 'bar'", Context.Strict | Context.Module | Context.OptionsNext],
    ['var a; export { a', Context.Strict | Context.Module],
    ['var a; export { a,', Context.Strict | Context.Module],
    ['var a; export { a, ;', Context.Strict | Context.Module],
    ['var a; export { a as };', Context.Strict | Context.Module],
    ['var a, b; export { a as , b};', Context.Strict | Context.Module],
    ['export default = 42', Context.Strict | Context.Module],
    ['export {default} +', Context.Strict | Context.Module],
    ['export default from "foo"', Context.Strict | Context.Module],
    ['({ set m(x) { export default null; } });', Context.Strict | Context.Module],
    ['for (let y in []) import v from "foo"', Context.Strict | Context.Module],
    ['for (let y in []) import v from "foo"', Context.Strict | Context.Module],
    ['switch(0) { default: export default null; }', Context.Strict | Context.Module],
    ['switch(0) { case 1: export default null; }', Context.Strict | Context.Module],
    ['if (true) { } else export default null;', Context.Strict | Context.Module],
    ['function* g() { export default null; }', Context.None],
    ['test262: export default null;', Context.Strict | Context.Module],
    ['(function() { export default null; });', Context.Strict | Context.Module],
    ['for (x = 0; false;) export default null;', Context.Strict | Context.Module],
    ['do export default null; while (false)', Context.Strict | Context.Module],
    ['export default async x \n() => {}', Context.Strict | Context.Module],
    ['{export default 3}', Context.Strict | Context.Module],
    ['while (1) export default 3', Context.Strict | Context.Module],
    ['export {a,,b}', Context.Strict | Context.Module],
    ['export {function} from a', Context.Strict | Context.Module],
    ['export let[a] = 0 export let[b] = 0', Context.Strict | Context.Module],
    ['export 3', Context.Strict | Context.Module],
    ['export function () {}', Context.Strict | Context.Module],
    ['export default default', Context.Strict | Context.Module],
    ['export default function', Context.Strict | Context.Module],
    ['export default let', Context.Strict | Context.Module],
    ['let a; let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const a = 0; export const a = 1;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; var a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a; export var a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a, a as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export class a{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export function a(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export const a = 0; export const a = 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let a; export let a;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default 0;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 0; export default class a {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a as b}; var b;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['let a; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a as b}; let b;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {b, a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, c}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b as a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x, x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function x(){}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {b, a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {a}; export {a, b};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {b as a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { x as y };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; class f{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; class f{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f{}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f{}; async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export foo; export bar; class f{}; async function foo(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export async function f(){}; function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default function(){}; export default function(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'export default class x{}; export default async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'export default class x{}; export async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'export class x{}; export default async function x(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export class x{}; export async function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default class x{}; export default function(){};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export default class x{}; export default class x{};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default class x{}; export default () => {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default async x => { let x; };', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export default function() {} export default function() {}',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export function a() {} export default function a() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {} export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f} export class f {};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export const x = y; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f}; export const x = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {f}; export async function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var x, y; export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; const f = foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const f = foo; export async function f(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { Q } from;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var foo; export let foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let foo; export let foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {b, a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a,b; export {a, b}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a){ let a; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a){ const a = 0; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function(a, a){}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default function([a, a]){}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {b as a}; export {a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {a}; export {b as a};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let x = y, [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export function x(){};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function x(){}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let {...x} = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let [...x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {x}; export let [x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x] = y; export {x};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export async function f(){}; export {f};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {}; export function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class f {}; export function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export var a = x, a = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export let [x, x] = y;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, a, b}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {b, a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a, b; export {a, b, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var a; export {a, a}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['class C { method() { export default null; } }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['{ export default null; }', Context.Strict | Context.Module | Context.OptionsLexical],

    ['export const const1;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['function foo() { }; export foo;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export function* () { }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export class { }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['function foo() { }; export [ foo ];', Context.Strict | Context.Module | Context.OptionsLexical],
    ['function foo() { export default function() { } }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default 1, 2, 3;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export 12;', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export "string_constant";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export ', Context.Strict | Context.Module | Context.OptionsLexical],
    ['function foo() { }; export { foo as 100 };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {foo}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {Array}', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      `export function f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      `export class f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      `export function f() {}
    export class f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      `export async function *f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      `export default async function *f() {}
    export function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      `export async function *f() {}
    export default function *f() {}`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'var canBeUndeclared; export {mustExist as canBeUndeclared};',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    ['export {mustExist as canBeUndeclared};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var x, y; export default x; export {y as default};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {foo, bar,};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { for as foo }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { arguments }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { bar, };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo2, baz }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo3, baz as baz2, }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { foo as foo4, bar as bar2, foobar }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { x as default };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {aa as bb, x};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export {foob};', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export { "a" as b };', Context.Strict | Context.Module | Context.OptionsLexical],
    [String.raw`export { "\uD83C" as b } from "./foo";`, Context.Strict | Context.Module | Context.OptionsLexical],
    [String.raw`export { a as "\uD83C" } from "./foo";`, Context.Strict | Context.Module | Context.OptionsLexical],
    ['export * as "foo" from "./f"; export { foo };', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export * as foo from "./f"; export { foo };', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'export * as foo from "./f"; export { "foo" } from "./m";',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'export * as foo from "./f"; export { "a" as "foo" } from "./m";',
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      String.raw`export { a }; export { "\u0061" } from "./m";`,
      Context.Strict | Context.Module | Context.OptionsLexical,
    ],
    [
      'export async function a() {}\nexport async function a() {}',
      Context.OptionsLexical | Context.Strict | Context.Module,
    ],
    ['export function a() {}\nexport async function a() {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export async function a() {}\nexport function a() {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export async function a() {}\nexport const a = 1;', Context.OptionsLexical | Context.Strict | Context.Module],
    ['export let a = 1;\nexport async function a() {}', Context.OptionsLexical | Context.Strict | Context.Module],
  ]);

  for (const arg of [
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export default async function() {}',
    'export default async function f() {}',
    'export default x;',
    'export const foo = async function() { }',
    'export function async() { }',
    'export function func() { };',
    'export class C { };',
    'export class A extends B {};',
    'export default class A extends B {};',
    'export { };',
    'export {get}; function get() {};',
    'function f() {}; f(); export { f };',
    'export let x = 0;',
    "export { a as b } from 'm.js';",
    "export * from 'p.js';",
    'export var foo;',
    'export {b as a}; export {a};',
    'export default class cName { valueOf() { return 45; } }',
    'export function goo() {};',
    'export let hoo;',
    'export const joo = 42;',
    'export default (function koo() {});',
    'export var y = 0;',
    'export const z = 0;',
    'export function func() { };',
    'export class C { };',
    'export { };',
    'export function foo () { return "foo"; }',
    'export const boo = 5;',
    'import {ns} from "three";',
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export default x;',
    'export function func() { };',
    'export class C { };',
    'export var j = 42;',
    'export let k = 42;',
    'export function l() {}',
    'export default function () {}',
    'export default class extends C {}',
    'export default 42',
    'var x; export default x = 7',
    "export { Q } from 'somemodule.js';",
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { for } from 'm.js';",
    "export { yield } from 'm.js'",
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'export default [];',
    'export default 42;',
    'export default { foo: 1 };',
    'export * from "foo";',
    'export {default} from "foo";',
    'export {foo as bar} from "foo";',
    'export function *foo () {}',
    'export default function(){}; export default function(){};',
    'export function a() {} export default function a() {}',
    'export let x = y, [x] = y;',
    'export function x(){}; export let [z] = y;',
    'export class f{}; async function f(){};',
    'export var a = x, b = y;',
    'export {a as b};',
    'export var foo = 1;',
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    "export {thing}; import thing from 'a.js';",
    "export {thing}; import {thing} from 'a.js';",
    "export {thing}; import * as thing from 'a.js';",
    'export { x as y };',
    "export { a as b } from 'm.js';",
    "export * from 'p.js';",
    'export var foo;',
    'export function goo() {};',
    'export let hoo;',
    `export default class { constructor() {	foo() } a() {	bar()	}	}`,
    'export const joo = 42;',
    'export default (function koo() {});',
    'export { };',
    'export {get}; function get() {};',
    'function f() {}; f(); export { f };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function *a() {}',
    'export var foo = function () {};',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function*() {}',
    'export default class C {}',
    'export default class {}',
    'export default class extends C {}',
    'export default 42',
    `export var x;
    x = 'Pass';`,
    'var x; export default x = 7',
    "export { Q } from 'somemodule.js';",
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { for } from 'm.js';",
    "export { yield } from 'm.js'",
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function *a() {}',
    'export let x = 0;',
    'export var y = 0;',
    'export const z = 0;',
    'export function func() { };',
    'export class C { };',
    'export { };',
    'function f() {}; f(); export { f };',
    'var a, b, c; export { a, b as baz, c };',
    'var d, e; export { d as dreary, e, };',
    'export default function f() {}',
    'export default function() {}',
    'export default function*() {}',
    'export default class C {}',
    'export default class {}',
    'export default class extends C {}',
    'export default 42',
    'var x; export default x = 7',
    "export * from 'somemodule.js';",
    'var foo; export { foo as for };',
    "export { arguments } from 'm.js';",
    "export { yield } from 'm.js'",
    'export default function f(){}; export {f};',
    'export default async function f(){}; export {f};',
    "export { static } from 'm.js'",
    "export { let } from 'm.js'",
    'var a; export { a as b, a as c };',
    'var a; export { a as await };',
    'var a; export { a as enum };',
    'export var document',
    'export var document = {}',
    'export var document',
    'export class Class {}',
    'export default 42',
    'export default class A {}',
    'export default (class{});',
    'export default /foo/',
    'export var namedOther = null;',
    'export var starAsVarDecl;',
    'export let starAsLetDecl;',
    'export const starAsConstDecl = null;',
    'export function starAsFuncDecl() {}',
    'export function* starAsGenDecl() {}',
    'export class starAsClassDecl {}',
    'export default class Foo {}++x',
    "export { x as y } from './y.js';\nexport { x as z } from './z.js';",
    "export { default as y } from './y.js';\nexport default 42;",
    'export default function(x) {};',
    'export default function () { };',
    'export default function _fn2 () { }',
    'class c { }; export default c',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    'var a; export default a = 10;',
    'export default () => 3',
    'function _default() { }; export default _default',
    'export let a, [...x] = y',
    'export let [...x] = y',
    // Named generator function statement
    'function* g() { }; export default g',
    'class c { }; export default c',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    'export default async \nfunction f(){}',
    'function foo() { }',
    "export const const2 = 'str';",
    'export const const3 = 3, const4 = 4;',
    'export const const5 = { }',
    'export const const6 = [ ]',
    'export {};',
    'class bar { }',
    'function* baz() { }',
    'function foobar() { }',
    "export var var1 = 'string';",
    "export default 'default';",
    'export var var2;',
    'export var var3 = 5, var4',
    'export var var5, var6, var7',
    'export default 1;',
    'var a; export default a = 10;',
    'function _default() { }; export default _default',
    'function* g() { }; export default g',
    'export function *g() { } if (true) { }',
    'export class c1 { } if (true) { }',
    'export default function* _gn2 () { } if (true) { }',
    'export default class _cl2 { } if (true) { }',
    'export default function _fn2 () { } if (true) { }',
    'class c { }; export default c',
    'export function a() {} export default function a() {}',
    'export function f(){}; export {f};',
    'export function f(){}; export {f};',
    'export class f {} export {f};',
    'export {x}; export class y {};',
    'export const x = y; export {f};',
    'export let x = y; export {f};',
    'export {f}; export const x = y;',
    'export {f}; export async function f() {}',
    'export default x; export {y as default};',
    'var x, y; export default x; export {y as default};',
    'export async function f(){}; const z = foo;',
    'const f = foo; export async function z(){};',
    'export var foo; export let foo;',
    'export let foo; export let foo;',
    'var a,b; export {c, d}; export {e};',
    'export { for }',
    'export {b as a}; export {a};',
    'export {a}; export {b as c};',
    'export {x}; export let {...x} = y;',
    'export let x = y, {...z} = y;',
    'export let x = y, [...z] = y;',
    'export {x}; export let [...z] = y;',
    'export let [x] = y; export function z(){};',
    'export function x(){}; export let [z] = y;',
    'export async function f(){}; export {z};',
    'export class f {}; export function y() {}',
    'export class f {}; export function y() {}',
    'export default function () {}',
    'export default class {}',
    'export var a = x, b = y;',
    'export let [x, z] = y;',
    "var _ = { method: function() { return 'method_result'; }, method2: function() { return 'method2_result'; } }; export default _",
    `export{};
      export {};
      export {}
      export { };
      export
      {
      };
      export//-
      {//-
      //-
      };
      export/**/{/**/};`,
    `import {} from 'a';
      import 'b';
      import * as ns1 from 'c';
      import dflt1 from 'd';
      export {} from 'e';
      import dflt2, {} from 'f';
      export * from 'g';
      import dflt3, * as ns2 from 'h';`,
    'var a; export { a as b };',
    'export default 1',
    'export default () => {}',
    'export * as "foo" from "./foo";',
    'export { "a" as "b" } from "./foo";',
    'export { a as "b" } from "./foo";',
    'let a = 1; export { a as "b" };',
    'export { "a" as b } from "./foo";',
    String.raw`export { "\uD83C\uDF19" as b } from "./foo";`,
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsWebCompat,
        );
      });
    });
  }
  for (const arg of [
    "export var var1 = 'string';",
    "export default 'default';",
    'export var var2;',
    'export var var3 = 5, var4',
    'export var var5, var6, var7',
    'export default 1;',
    'var a; export default a = 10;',
    "export { let } from 'm.js'",
    'export default [];',
    'export default 42;',
    'export default { foo: 1 };',
    'export * from "foo";',
    'export {default} from "foo";',
    'export {foo as bar} from "foo";',
    'export function *foo () {}',
    "export {thing}; import thing from 'a.js';",
    "export {thing}; import {thing} from 'a.js';",
    "export {thing}; import * as thing from 'a.js';",
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.Strict | Context.Module | Context.OptionsLexical | Context.OptionsNext,
        );
      });
    });
  }

  pass('Module - Export (pass)', [
    [
      'export default async',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsRanges,
      
    ],
    [
      'export default class f{}; export {f};',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsLexical,
      
    ],
    [
      'export default function f(){}; export {f};',
      Context.Module | Context.OptionsNext | Context.Strict | Context.OptionsLexical,
      
    ],
    [
      'export default async \nfunction f(){}',
      Context.Module | Context.OptionsNext | Context.Strict,
      
    ],
    [
      "export * as class from 'source';",
      Context.Module | Context.OptionsNext | Context.Strict,
      
    ],
    [
      'export * as ns from "source";',
      Context.Module | Context.OptionsNext | Context.Strict,
      
    ],
    [
      'export * from "a"',
      Context.Module | Context.Strict | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export * as foo from "./foo";',
      Context.Module | Context.Strict | Context.OptionsNext,
      
    ],
    [
      'export {}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {x}; var x;',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'var x; export {x as a}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'var x; export {x,}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {x} from "foo"',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {x as a} from "foo"',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {x,} from "foo"',
      Context.Module,
      
    ],
    [
      'var x; export {x as a,}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'var x,y; export {x as a, y as b}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export var x = 10, y = 20',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export let x',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export let x, y',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export const x = 10, y = 20',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export function f(){}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export async function f(){}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export function* f(){}',
      Context.Module,
      
    ],
    [
      'export default function f(){}',
      Context.Module,
      
    ],
    [
      'export default async function f(){}',
      Context.Module | Context.OptionsRanges,
      
    ],

    [
      'export default function* f(){}',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export class x {}',
      Context.Module | Context.OptionsRanges,
      
    ],

    [
      'export default class x {}',
      Context.OptionsWebCompat | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export let [...x] = y',
      Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export let {...x} = y',
      Context.Module,
      
    ],
    [
      'export default [x] = y',
      Context.Module,
      
    ],
    [
      'var a,b; export {a}; export {b};',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default async () => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default async (x) => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default async function(){}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default function* (){}',
      Context.Strict | Context.Module | Context.OptionsNext,
      
    ],
    [
      'export default class x{}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export {} from "x"',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default async x => y',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default (a,b) => {}',
      Context.Strict | Context.Module | Context.OptionsNext | Context.OptionsRanges,
      
    ],
    [
      'export default () => {}',
      Context.Strict | Context.Module | Context.OptionsNext,
      
    ],
    [
      'export {};',
      Context.Strict | Context.Module,
      
    ],
    [
      'export var foo = 1;',
      Context.Strict | Context.Module,
      
    ],
    [
      'export function foo () {}',
      Context.Strict | Context.Module,
      
    ],
    [
      String.raw`export function \u{5A}() {}`,
      Context.Strict | Context.Module,
      
    ],

    [
      'export {foo} from "foo";',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default function () {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default (1 + 2);',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],

    [
      'export class a {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default class A {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default [];',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],

    [
      'export default function foo() {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default function *foo() {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'var foo; export {foo as new}',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {a as b}; var a;',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'var a; export {a as b};',
      Context.Strict | Context.Module,
      
    ],
    [
      `[function* (...{}) {  switch (yield) {}  }]
        a = (u) => {}`,
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export {foo}; function foo() {};',
      Context.Strict | Context.Module,
      
    ],
    [
      'export var x = 1;',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default 3;',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x; export { x as a }; export { x as b };',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'export default [x] = y',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'let foo, bar; export {foo, bar}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export default function *f(){} foo',
      Context.Strict | Context.Module,
      
    ],
    [
      'export {}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export {x}; var x;',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x; export {x as a}',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x; export {x,}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export {x} from "foo"',
      Context.Strict | Context.Module,
      
    ],
    [
      'export {x as a} from "foo"',
      Context.Strict | Context.Module,
      
    ],
    [
      'export {x,} from "foo"',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x; export {x as a,}',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x,y; export {x, y}',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x,y; export {x as a, y as b}',
      Context.Strict | Context.Module | Context.OptionsRanges,
      
    ],
    [
      'var x,y; export {x, y,}',
      Context.Strict | Context.Module,
      
    ],
    [
      'var x,y; export {x as a, y as b,}',
      Context.Strict | Context.Module,
      
    ],
    [
      'export var x',
      Context.Strict | Context.Module,
      
    ],
    [
      'export var x, y',
      Context.Strict | Context.Module,
      
    ],
    [
      'export var x = 10, y = 20',
      Context.Strict | Context.Module,
      
    ],
    [
      'export let x',
      Context.Strict | Context.Module,
      
    ],
    [
      'export let x, y',
      Context.Strict | Context.Module,
      
    ],
    [
      'export let a = 1;',
      Context.Strict | Context.Module,
      
    ],
    [
      'export * as "foo" from "./foo";',
      Context.Strict | Context.Module,
      
    ],
    [
      String.raw`export { "\uD83C\uDF19" as "a"} from "./foo";`,
      Context.Strict | Context.Module | Context.OptionsLoc,
      
    ],
  ]);
});
