import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Statements - Labeled', () => {
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
    'enum',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.OptionsWebCompat);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, undefined, Context.Strict);
      });
    });
  }

  fail('Statements - Labeled (fail)', [
    ['label: class C {};', Context.None],
    ['label: let x;', Context.None],
    ['a: async function* a(){}', Context.None],
    ['if (false) label1: label2: function test262() {} else ;', Context.None],
    ['label: function* g() {}', Context.None],
    ['label: const x = null;', Context.None],
    ['label: function g() {}', Context.Strict],
    ['label: let x;', Context.None],
    ['await: 1;', Context.Module],
    ['bar: function* x() {}', Context.None],
    ['await: 1;', Context.Strict | Context.Module],
    ['yield: 1;', Context.Strict],
    ['foo:for;', Context.None],
    ['super: while(true) { break super; }"', Context.None],
    ['function test_func() { super: while(true) { break super; }}"', Context.None],
    ['() => {super: while(true) { break super; }}"', Context.None],
    ['do { test262: { continue test262; } } while (false)', Context.None],
    ['"use strict"; super: while(true) { break super; }', Context.None],
    ['"use strict"; package: while(true) { break package; }', Context.None],
    ['false: ;', Context.None],
    ['true: ;', Context.None],
    ['(async function*() { yield: 1; });', Context.None],
    ['function *gen() { yield: ;}', Context.None],
    ['function *gen() { yield: ;}', Context.Strict],
    ['var obj = { *method() { yield: ; } };', Context.None],
    ['var obj = { *method() { yield: ; } };', Context.Strict],
    ['foo: function f() {}', Context.None],
    [String.raw`async () => { \u{61}wait: x }`, Context.None],
    [String.raw`async () => { aw\u{61}it: x }`, Context.None],
    [String.raw`async () => { \u{61}wait: x }`, Context.Strict | Context.Module],
    [String.raw`async () => { aw\u{61}it: x }`, Context.None],
    ['function *f(){ await: x; }', Context.Module],
    ['await: x', Context.Strict | Context.Module],
    ['await: 1;', Context.Strict | Context.Module],
    ['false: x', Context.None],
    ['implements: x', Context.Strict],
    ['package: x', Context.Strict],
    ['let: x', Context.Strict],
    ['yield: x', Context.Strict],
    ['function *f(){ yield: x; }', Context.Strict],
    ['yield: { function *f(){ break await; } }', Context.Strict],
    ['bar: foo: ding: foo: x', Context.None],
    ['foo: bar: foo: x', Context.None],
    ['a: { a: x }', Context.None],
    ['yield: { function *f(){ break await; } }', Context.None],
    ['yield: { function *f(){ break await; } }', Context.None],
  ]);

  pass('Statements - Labeled (pass)', [
    { code: 'function *f(){ await: x; }', options: { webcompat: true, ranges: true } },
    { code: 'await: while (await) { continue await; }', options: { webcompat: true, ranges: true } },
    { code: 'async: while (async) { continue async; }', options: { webcompat: true } },
    { code: 'let, let, let, let', options: { webcompat: true, ranges: true } },
    { code: 'let: foo', options: { webcompat: true, ranges: true } },
    { code: 'foo: function bar() {}', options: { webcompat: true, ranges: true } },
    'yield: await',
    'a:package',
    '__proto__: test',
    { code: 'a:{break a;}', options: { ranges: true } },
    'async: await',
    { code: 'start: while (true) break start', options: { ranges: true } },
    'if (false) {\n L: let\nx = 1; \n }',
    { code: 'foo: bar: function f(){}', options: { webcompat: true } },
    { code: 'foo: bar: third: function f(){}', options: { webcompat: true } },
    'L: let\nx',
    { code: '__proto__: while (true) { break __proto__; }', options: { ranges: true } },
    'a:{break a;}',
  ]);
});
