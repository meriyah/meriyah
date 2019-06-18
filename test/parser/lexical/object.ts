import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Object', () => {
  fail('Lexical - Object (fail)', [
    ['!{ f(){ let a; var a; } };', Context.OptionsLexical],
    ['!{ *g(){ let a; var a; } };', Context.OptionsLexical],
    ['!{ get f(){ let a; var a; } };', Context.OptionsLexical],
    ['!{ set f(b){ let a; var a; } };', Context.OptionsLexical],
    ['!{ f(a, a){} };', Context.OptionsLexical],
    ['!{ f([a, a]){} };', Context.OptionsLexical],
    ['!{ f({a, a}){} };', Context.OptionsLexical],
    ['!{ *g(a, a){} };', Context.OptionsLexical],
    ['!{ *g([a, a]){} };', Context.OptionsLexical],
    ['!{ *g({a, a}){} };', Context.OptionsLexical],
    ['!{ f(a) { let a; } };', Context.OptionsLexical],
    ['!{ f([a]){ let a; } };', Context.OptionsLexical],
    ['!{ f({a}){ let a; } };', Context.OptionsLexical],
    ['!{ set f({a, a}){} };', Context.OptionsLexical],
    ['!{ set f([a, a]){} };', Context.OptionsLexical],
    ['!{ set f(a) { let a; } };', Context.OptionsLexical],
    ['!{ set f([a]){ let a; } };', Context.OptionsLexical],
    ['!{ set f({a}){ let a; } };', Context.OptionsLexical],
    ['!{f(x) { let x }}', Context.OptionsLexical],
    ['!{f(x) { const x = y }}', Context.OptionsLexical],
    ['!{f(a, a) {}}', Context.OptionsLexical],
    ['!{f(a, b, a) {}}', Context.OptionsLexical],
    ['!{f(b, a, a) {}}', Context.Module | Context.OptionsLexical],
    ['!{f(a, a, b) {}}', Context.OptionsLexical],
    ['!{f(b, a, b, a) {}}', Context.OptionsLexical],
    ['!{f(b, a, b, a, [fine]) {}}', Context.OptionsLexical],
    ['!{f(b, a, b, a = x) {}}', Context.OptionsLexical],
    ['!{f(b, a, b, ...a) {}}', Context.OptionsLexical],
    ['!{f([a, a]) {}}', Context.OptionsLexical],
    ['!{f([a, b, a]) {}}', Context.OptionsLexical],
    ['!{f([b, a, a]) {}}', Context.OptionsLexical],
    ['!{f([a, a, b]) {}}', Context.OptionsLexical],
    ['!{f([b, a, b, a]) {}}', Context.OptionsLexical],
    ['!{f([b, a], b) {}}', Context.OptionsLexical],
    ['!{f([b, a], {b}) {}}', Context.OptionsLexical],
    ['!{f([b, a], b=x) {}}', Context.OptionsLexical],
    ['!{f([b, a], ...b) {}}', Context.OptionsLexical],
    ['!{f(){ let x; var x; }}', Context.OptionsLexical],
    ['!{f(){ var x; let x; }}', Context.OptionsLexical],
    ['!{f(){ const x = y; var x; }}', Context.OptionsLexical],
    ['!{f(){ var x; const x = y; }}', Context.OptionsLexical],
    ['!{f(){ let x; function x(){} }}', Context.OptionsLexical],
    ['!{f(){ function x(){} let x; }}', Context.OptionsLexical],
    ['!{f(){ const x = y; function x(){} }}', Context.OptionsLexical],
    ['!{f(){ function x(){} const x = y; }}', Context.OptionsLexical],
    ['!{ *foo(x) { let x = 3; } }', Context.OptionsLexical],
    ['!{ *foo(x) { const x = 3; } }', Context.OptionsLexical],
    ['!{f({b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({a: b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({"a": b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({2: b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({a = b}, ...a) {}}', Context.OptionsLexical],
    ['!{f({[a]: b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({[x]: b}, b = ((b) => {}) ) {}}', Context.OptionsLexical],
    ['!{f({[a]: b}, ...b) {}}', Context.OptionsLexical],
    ['!{f({[a]: b}, ...b) {}}', Context.OptionsLexical]
  ]);

  for (const arg of [
    '!{f(f) { }}',
    '!{f(x) { function x() {} }}',
    '!{f(){ function x(){} var x = y; }}',
    '!{f(x) { var x; }}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    '!{f(f) { }}',
    '!{f(x) { function x() {} }}',
    '!{f(x) { var x; }}',
    '!{f(){ function x(){} var x = y; }}',
    '!{f({[a]: b}, x = ((b) => {}) ) {}}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
});
