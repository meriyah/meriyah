import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { pass } from '../../test-utils';

describe('Expressions - New target', () => {
  for (const arg of [
    'new.target',
    '{ new.target }',
    '() => new.target',
    'if (1) { new.target }',
    'if (1) {} else { new.target }',
    'while (0) { new.target }',
    'do { new.target } while (0)',
    'new new .target',
    'function f(x=() => new."target") {}',
    'new.target',
    'function f(){ new.foo }',
    '_ => new.target',
    '_ => _ => _ => _ => new.target',
    'function f(){ new.target = foo }',
    'function f(){ new.target-- }',
    '(f=new.target) => {}',
    'new await foo;',
    '() => new.target',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    "function foo() { return new['target']; }",
    'function foo(){{if(true){new.target;}}}',
    'function foo(){ var x = function() {new.target;}; x();}',
    'function foo(){ var o = { "foo" : function () { new.target}}; o.foo();}',
    'function f(x=() => new.target) {}',
    'function x(){""[new.target]}',
    'function a(){try { throw Error;} catch(e){new.target;}}',
    'function a(){var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}',
    'function a(){var x = function() {new.target;}; x();}',
    'function a(){var o = { "foo" : function () { new.target}}; o.foo();}',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    'function foo(){with({}) {new.target;}}',
    'function foo() { function parent(x) { new x();}; function child(){ with(new.target) {toString();}}; parent(child); }',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true, sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    'new.target',
    '{ new.target }',
    '() => { new.target }',
    '() => new.target',
    'if (1) { new.target }',
    'if (1) {} else { new.target }',
    'while (0) { new.target }',
    'do { new.target } while (0)',
    'function a(b = new.target){}',
    'class C {get x() { { new.target } }}',
    'class C {get x() { () => new.target }}',
    'class C {get x() { do { new.target } while (0) }}',
    'function f() { new.target }',
    'function f() { () => new.target }',
    'function f() { if (1) { new.target } }',
    'function f() { while (0) { new.target } }',
    'function f() { do { new.target } while (0) }',
    'function a(){{if(true){new.target;}}}',
    'function abc(){ var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}',
    'function a(){ var o = { "foo" : function () { new.target}}; o.foo();}',
    '({ set a(b = new.target){} })',
    '(function a(b = new.target){})',
    'function f() { let x = new.target; }',
    'function f() { new new.target()(); }',
    'function f() { new.target(); }',
  ]) {
    it(`function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() {${arg}}`, { next: true, sourceType: 'module' });
      });
    });

    it(`'use strict'; function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; function f() {${arg}}`, { next: true, sourceType: 'module' });
      });
    });

    it(`var f = function() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`var f = function() {${arg}}`, { next: true, sourceType: 'module' });
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, { next: true, sourceType: 'module' });
      });
    });

    it(`({set x(_) {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({set x(_) {${arg}}})`, { next: true });
      });
    });

    it(`'use strict'; ({get x() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({get x() {${arg}}})`);
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, { next: true, sourceType: 'module' });
      });
    });

    it(`'use strict'; ({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({m: function() {${arg}}})`, { next: true, sourceType: 'module' });
      });
    });

    it(`class C {m() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {m() {${arg}}}`);
      });
    });

    it(`class C {set x(_) {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {set x(_) {${arg}}}`, { next: true, sourceType: 'module' });
      });
    });
  }

  pass('Expressions - New target (pass)', [
    'class C {set x(_) {do { new.target } while (0)}}',
    'function f(){ new new .target; }',
    'function f(){ new.target }',
    { code: 'function f(){ new . target }', options: { ranges: true } },
    { code: 'function f(){ return _ => new.target }', options: { ranges: true } },
    { code: 'function f(){ _ => _ => new.target }', options: { ranges: true } },
    '_ => function(){ new.target }',
    'function f(){ new.target + foo }',
    'function f(){ foo + new.target }',
    'function f(){ foo = new.target }',
    'foo({bar(){ new.target }})',
    { code: 'class X { constructor() { new.target }}', options: { ranges: true } },
    'class X { foo() { new.target }}',
    'class X { static foo() { new.target }}',
    'function f(f=new.target){}',
    'foo(function f(f=new.target){})',
    '({foo(x=new.target){}})',
    'class A {constructor(x=new.target){}}',
    { code: 'class A {a(x=new.target){}}', options: { ranges: true } },
    { code: 'function f(){ [...new.target] }', options: { ranges: true } },
    { code: 'function f(){ class x extends new.target {} }', options: { ranges: true } },
    { code: 'function f(){ x({[new.target]:y}) }', options: { ranges: true } },
    'function a(b = new.target){}',
    'function foo(){with({}) {new.target;}}',
    'function foo() { function parent(x) { new x();}; function child(){ with(new.target) {toString();}}; parent(child); }',
  ]);
});
