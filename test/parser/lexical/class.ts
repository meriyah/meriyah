import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Class', () => {
  fail('Lexical - Class (fail)', [
    { code: 'class C {} class C {}', options: { lexical: true } },
    { code: 'class A { static f(a, a){} }', options: { lexical: true } },
    { code: 'class A { static f([a, a]){} }', options: { lexical: true } },
    { code: 'class A { static f({a, a}){} }', options: { lexical: true } },
    { code: 'class foo {}; class foo {};', options: { lexical: true } },
    { code: 'class foo {}; const foo = 1;', options: { lexical: true } },
    { code: 'class foo {}; function foo () {};', options: { lexical: true } },
    { code: 'class foo {}; let foo = 1;', options: { lexical: true } },
    { code: 'class foo {}; var foo;', options: { lexical: true } },
    { code: 'class o {f(x) { let x }}', options: { lexical: true } },
    { code: 'class o {f(x) { let x }}', options: { lexical: true } },
    { code: 'class o {f(x) { const x = y }}', options: { lexical: true } },
    { code: 'class o {f(a, a) {}}', options: { lexical: true } },
    { code: 'class o {f(a, b, a) {}}', options: { lexical: true } },
    { code: 'class o {f(b, a, a) {}}', options: { lexical: true } },
    { code: 'class o {f(a, a, b) {}}', options: { lexical: true } },
    { code: 'class o {f(b, a, b, a) {}}', options: { lexical: true } },
    { code: 'class o {f(b, a, b, a, [fine]) {}}', options: { lexical: true } },
    { code: 'class o {f(b, a, b, a = x) {}}', options: { lexical: true } },
    { code: 'class o {f(b, a, b, ...a) {}}', options: { lexical: true } },
    { code: 'class o {f(a, b, a) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f(b, a, a) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f(a, a, b) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f(b, a, b, a) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f(b, a, b, a, [fine]) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f(b, a, b, a = x) {}}', options: { webcompat: true, lexical: true } },
    { code: 'class o {f([a, a]) {}}', options: { lexical: true } },
    { code: 'class o {f([a, b, a]) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a, a]) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a, b, a]) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a], b) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a], {b}) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a], b=x) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a], ...b) {}}', options: { lexical: true } },
    { code: 'class o {f([b, a], b) {}}', options: { sourceType: 'module', lexical: true } },
    { code: 'class o {f([b, a], {b}) {}}', options: { sourceType: 'module', lexical: true } },
    { code: 'class o {f([b, a], b=x) {}}', options: { sourceType: 'module', lexical: true } },
    { code: 'class o {f(){ let x; var x; }}', options: { lexical: true } },
    { code: 'class o {f(){ var x; let x; }}', options: { lexical: true } },
    { code: 'class o {f(){ const x = y; var x; }}', options: { lexical: true } },
    { code: 'class o {f(){ var x; const x = y; }}', options: { lexical: true } },
    { code: 'class o {f(){ let x; function x(){} }}', options: { lexical: true } },
    { code: 'class o {f(){ function x(){} let x; }}', options: { lexical: true } },
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
    'class x {} function y() { let y; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
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
    'class x {} function y() { let y; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
