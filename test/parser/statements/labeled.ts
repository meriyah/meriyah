import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

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
        parseSource(`${arg} : x`);
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, { lexical: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, { webcompat: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg} : x`, { impliedStrict: true });
      });
    });
  }

  fail('Statements - Labeled (fail)', [
    'label: class C {};',
    'label: let x;',
    'a: async function* a(){}',
    'if (false) label1: label2: function test262() {} else ;',
    'label: function* g() {}',
    'label: const x = null;',
    { code: 'label: function g() {}', options: { impliedStrict: true } },
    'label: let x;',
    { code: 'await: 1;', options: { sourceType: 'module' } },
    'bar: function* x() {}',
    { code: 'await: 1;', options: { sourceType: 'module' } },
    { code: 'yield: 1;', options: { impliedStrict: true } },
    'foo:for;',
    'super: while(true) { break super; }"',
    'function test_func() { super: while(true) { break super; }}"',
    '() => {super: while(true) { break super; }}"',
    'do { test262: { continue test262; } } while (false)',
    '"use strict"; super: while(true) { break super; }',
    '"use strict"; package: while(true) { break package; }',
    'false: ;',
    'true: ;',
    '(async function*() { yield: 1; });',
    'function *gen() { yield: ;}',
    { code: 'function *gen() { yield: ;}', options: { impliedStrict: true } },
    'var obj = { *method() { yield: ; } };',
    { code: 'var obj = { *method() { yield: ; } };', options: { impliedStrict: true } },
    'foo: function f() {}',
    String.raw`async () => { \u{61}wait: x }`,
    String.raw`async () => { aw\u{61}it: x }`,
    { code: String.raw`async () => { \u{61}wait: x }`, options: { sourceType: 'module' } },
    String.raw`async () => { aw\u{61}it: x }`,
    { code: 'function *f(){ await: x; }', options: { sourceType: 'module' } },
    { code: 'await: x', options: { sourceType: 'module' } },
    { code: 'await: 1;', options: { sourceType: 'module' } },
    'false: x',
    { code: 'implements: x', options: { impliedStrict: true } },
    { code: 'package: x', options: { impliedStrict: true } },
    { code: 'let: x', options: { impliedStrict: true } },
    { code: 'yield: x', options: { impliedStrict: true } },
    { code: 'function *f(){ yield: x; }', options: { impliedStrict: true } },
    { code: 'yield: { function *f(){ break await; } }', options: { impliedStrict: true } },
    'bar: foo: ding: foo: x',
    'foo: bar: foo: x',
    'a: { a: x }',
    'yield: { function *f(){ break await; } }',
    'yield: { function *f(){ break await; } }',
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
