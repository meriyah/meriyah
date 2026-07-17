import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail } from '../../test-utils.ts';

describe('Lexical - Object', () => {
  fail('Lexical - Object (fail)', [
    { code: '!{ f(){ let a; var a; } };', options: { lexical: true } },
    { code: '!{ *g(){ let a; var a; } };', options: { lexical: true } },
    { code: '!{ get f(){ let a; var a; } };', options: { lexical: true } },
    { code: '!{ set f(b){ let a; var a; } };', options: { lexical: true } },
    { code: '!{ f(a, a){} };', options: { lexical: true } },
    { code: '!{ f([a, a]){} };', options: { lexical: true } },
    { code: '!{ f({a, a}){} };', options: { lexical: true } },
    { code: '!{ *g(a, a){} };', options: { lexical: true } },
    { code: '!{ *g([a, a]){} };', options: { lexical: true } },
    { code: '!{ *g({a, a}){} };', options: { lexical: true } },
    { code: '!{ f(a) { let a; } };', options: { lexical: true } },
    { code: '!{ f([a]){ let a; } };', options: { lexical: true } },
    { code: '!{ f({a}){ let a; } };', options: { lexical: true } },
    { code: '!{ set f({a, a}){} };', options: { lexical: true } },
    { code: '!{ set f([a, a]){} };', options: { lexical: true } },
    { code: '!{ set f(a) { let a; } };', options: { lexical: true } },
    { code: '!{ f({a, a}){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ *g(a, a){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ *g([a, a]){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ *g({a, a}){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ f(a) { let a; } };', options: { webcompat: true, lexical: true } },
    { code: '!{ f([a]){ let a; } };', options: { webcompat: true, lexical: true } },
    { code: '!{ f({a}){ let a; } };', options: { webcompat: true, lexical: true } },
    { code: '!{ set f({a, a}){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ set f([a, a]){} };', options: { webcompat: true, lexical: true } },
    { code: '!{ set f(a) { let a; } };', options: { webcompat: true, lexical: true } },
    { code: '!{ set f([a]){ let a; } };', options: { lexical: true } },
    { code: '!{ set f({a}){ let a; } };', options: { lexical: true } },
    { code: '!{f(x) { let x }}', options: { lexical: true } },
    { code: '!{f(x) { const x = y }}', options: { lexical: true } },
    { code: '!{f(a, a) {}}', options: { lexical: true } },
    { code: '!{f(a, b, a) {}}', options: { lexical: true } },
    { code: '!{f(b, a, a) {}}', options: { lexical: true, sourceType: 'module' } },
    { code: '!{f(a, a, b) {}}', options: { lexical: true } },
    { code: '!{f(b, a, b, a) {}}', options: { lexical: true } },
    { code: '!{f(b, a, b, a, [fine]) {}}', options: { lexical: true } },
    { code: '!{f(b, a, b, a = x) {}}', options: { lexical: true } },
    { code: '!{f(b, a, b, ...a) {}}', options: { lexical: true } },
    { code: '!{f([a, a]) {}}', options: { lexical: true } },
    { code: '!{f([a, b, a]) {}}', options: { lexical: true } },
    { code: '!{f([b, a, a]) {}}', options: { lexical: true } },
    { code: '!{f([a, a, b]) {}}', options: { lexical: true } },
    { code: '!{f([b, a, b, a]) {}}', options: { lexical: true } },
    { code: '!{f([b, a], b) {}}', options: { lexical: true } },
    { code: '!{f([b, a], {b}) {}}', options: { lexical: true } },
    { code: '!{f([b, a], b=x) {}}', options: { lexical: true } },
    { code: '!{f([b, a], ...b) {}}', options: { lexical: true } },
    { code: '!{f(){ let x; var x; }}', options: { lexical: true } },
    { code: '!{f(){ var x; let x; }}', options: { lexical: true } },
    { code: '!{f([b, a], {b}) {}}', options: { webcompat: true, lexical: true } },
    { code: '!{f([b, a], b=x) {}}', options: { webcompat: true, lexical: true } },
    { code: '!{f([b, a], ...b) {}}', options: { impliedStrict: true, lexical: true } },
    { code: '!{f(){ let x; var x; }}', options: { sourceType: 'module', lexical: true } },
    { code: '!{f(){ var x; let x; }}', options: { sourceType: 'module', lexical: true } },
    { code: '!{f(){ const x = y; var x; }}', options: { lexical: true } },
    { code: '!{f(){ var x; const x = y; }}', options: { lexical: true } },
    { code: '!{f(){ let x; function x(){} }}', options: { lexical: true } },
    { code: '!{f(){ function x(){} let x; }}', options: { lexical: true } },
    { code: '!{f(){ const x = y; function x(){} }}', options: { lexical: true } },
    { code: '!{f(){ function x(){} const x = y; }}', options: { lexical: true } },
    { code: '!{ *foo(x) { let x = 3; } }', options: { lexical: true } },
    { code: '!{ *foo(x) { const x = 3; } }', options: { lexical: true } },
    { code: '!{f(){ const x = y; function x(){} }}', options: { sourceType: 'module', lexical: true } },
    { code: '!{f(){ function x(){} const x = y; }}', options: { sourceType: 'module', lexical: true } },
    { code: '!{ *foo(x) { let x = 3; } }', options: { sourceType: 'module', lexical: true } },
    { code: '!{ *foo(x) { const x = 3; } }', options: { sourceType: 'module', lexical: true } },
    { code: '!{f({b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({a: b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({"a": b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({2: b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({a = b}, ...a) {}}', options: { lexical: true } },
    { code: '!{f({[a]: b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({[x]: b}, b = ((b) => {}) ) {}}', options: { lexical: true } },
    { code: '!{f({[a]: b}, ...b) {}}', options: { lexical: true } },
    { code: '!{f({[a]: b}, ...b) {}}', options: { lexical: true } },
  ]);

  for (const text of [
    '!{f(f) { }}',
    '!{f(x) { function x() {} }}',
    '!{f(){ function x(){} var x = y; }}',
    '!{f(x) { var x; }}',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { lexical: true });
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true, lexical: true });
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });
  }

  for (const text of [
    '!{f(f) { }}',
    '!{f(x) { function x() {} }}',
    '!{f(x) { var x; }}',
    '!{f(){ function x(){} var x = y; }}',
    '!{f({[a]: b}, x = ((b) => {}) ) {}}',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true, lexical: true });
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
