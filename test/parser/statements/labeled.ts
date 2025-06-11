import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
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
    ['function *f(){ await: x; }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['await: while (await) { continue await; }', Context.OptionsWebCompat | Context.OptionsRanges],
    ['async: while (async) { continue async; }', Context.OptionsWebCompat],
    ['let, let, let, let', Context.OptionsWebCompat | Context.OptionsRanges],
    ['let: foo', Context.OptionsWebCompat | Context.OptionsRanges],
    ['foo: function bar() {}', Context.OptionsWebCompat | Context.OptionsRanges],
    ['yield: await', Context.None],
    ['a:package', Context.None],
    ['__proto__: test', Context.None],
    ['a:{break a;}', Context.None | Context.OptionsRanges],
    ['async: await', Context.None],
    ['start: while (true) break start', Context.OptionsRanges],
    ['if (false) {\n L: let\nx = 1; \n }', Context.None],
    ['foo: bar: function f(){}', Context.OptionsWebCompat],
    ['foo: bar: third: function f(){}', Context.OptionsWebCompat],
    ['L: let\nx', Context.None],
    ['__proto__: while (true) { break __proto__; }', Context.OptionsRanges],
    ['a:{break a;}', Context.None],
  ]);
});
