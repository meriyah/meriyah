import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Class', () => {
  fail('Lexical - Class (fail)', [
    ['class C {} class C {}', Context.OptionsLexical],
    ['class A { static f(a, a){} }', Context.OptionsLexical],
    ['class A { static f([a, a]){} }', Context.OptionsLexical],
    ['class A { static f({a, a}){} }', Context.OptionsLexical],
    ['class foo {}; class foo {};', Context.OptionsLexical],
    ['class foo {}; const foo = 1;', Context.OptionsLexical],
    ['class foo {}; function foo () {};', Context.OptionsLexical],
    ['class foo {}; let foo = 1;', Context.OptionsLexical],
    ['class foo {}; var foo;', Context.OptionsLexical],
    ['class o {f(x) { let x }}', Context.OptionsLexical],
    ['class o {f(x) { let x }}', Context.OptionsLexical],
    ['class o {f(x) { const x = y }}', Context.OptionsLexical],
    ['class o {f(a, a) {}}', Context.OptionsLexical],
    ['class o {f(a, b, a) {}}', Context.OptionsLexical],
    ['class o {f(b, a, a) {}}', Context.OptionsLexical],
    ['class o {f(a, a, b) {}}', Context.OptionsLexical],
    ['class o {f(b, a, b, a) {}}', Context.OptionsLexical],
    ['class o {f(b, a, b, a, [fine]) {}}', Context.OptionsLexical],
    ['class o {f(b, a, b, a = x) {}}', Context.OptionsLexical],
    ['class o {f(b, a, b, ...a) {}}', Context.OptionsLexical],
    ['class o {f(a, b, a) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f(b, a, a) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f(a, a, b) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f(b, a, b, a) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f(b, a, b, a, [fine]) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f(b, a, b, a = x) {}}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['class o {f([a, a]) {}}', Context.OptionsLexical],
    ['class o {f([a, b, a]) {}}', Context.OptionsLexical],
    ['class o {f([b, a, a]) {}}', Context.OptionsLexical],
    ['class o {f([b, a, b, a]) {}}', Context.OptionsLexical],
    ['class o {f([b, a], b) {}}', Context.OptionsLexical],
    ['class o {f([b, a], {b}) {}}', Context.OptionsLexical],
    ['class o {f([b, a], b=x) {}}', Context.OptionsLexical],
    ['class o {f([b, a], ...b) {}}', Context.OptionsLexical],
    ['class o {f([b, a], b) {}}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['class o {f([b, a], {b}) {}}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['class o {f([b, a], b=x) {}}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['class o {f(){ let x; var x; }}', Context.OptionsLexical],
    ['class o {f(){ var x; let x; }}', Context.OptionsLexical],
    ['class o {f(){ const x = y; var x; }}', Context.OptionsLexical],
    ['class o {f(){ var x; const x = y; }}', Context.OptionsLexical],
    ['class o {f(){ let x; function x(){} }}', Context.OptionsLexical],
    ['class o {f(){ function x(){} let x; }}', Context.OptionsLexical]
  ]);

  for (const arg of [
    'class o {f(f) { }}',
    'class o {f(x) { function x() {} }}',
    'class o {f(x) { var x; }}',
    'function f(x) {{var x}}',
    'function f(x) {{let x}}',
    'function f() {var f}',
    'function f() {{var f}}',
    'function f() {let f}',
    'function f() {{let f}}',
    'var x; { let x; }',
    '{ let x; } var x;',
    'class x {} function y() { let x; }',
    'class x {} function y() { let y; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }

  for (const arg of [
    'class a extends b { constructor(x) { return async() => super(x); } };',
    'class o {f(x) { function x() {} }}',
    'class o {f(x) { var x; }}',
    'function f(x) {{var x}}',
    'function f(x) {{let x}}',
    'function f() {var f}',
    'function f() {{var f}}',
    'function f() {let f}',
    'function f() {{let f}}',
    'var x; { let x; }',
    '{ let x; } var x;',
    'class x {} function y() { let x; }',
    'class x {} function y() { let y; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }
});
