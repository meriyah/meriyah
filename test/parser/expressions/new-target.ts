import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

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
    `new await foo;`,
    `() => new.target`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    `function foo() { return new['target']; }`,
    'function foo(){with({}) {new.target;}}',
    'function foo(){{if(true){new.target;}}}',
    'function foo(){ var x = function() {new.target;}; x();}',
    'function foo(){ var o = { "foo" : function () { new.target}}; o.foo();}',
    `function f(x=() => new.target) {}`,
    'function x(){""[new.target]}',
    'function foo(){with({}) {new.target;}}',
    'function foo() { function parent(x) { new x();}; function child(){ with(new.target) {toString();}}; parent(child); }',
    'function a(){try { throw Error;} catch(e){new.target;}}',
    'function a(){var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}',
    'function a(){var x = function() {new.target;}; x();}',
    'function a(){var o = { "foo" : function () { new.target}}; o.foo();}',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Module);
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
    `function a(){{if(true){new.target;}}}`,
    `function abc(){ var a = b = c = 1; try {} catch([a,b,c]) { new.target;}}`,
    `function a(){ var o = { "foo" : function () { new.target}}; o.foo();}`,
    '({ set a(b = new.target){} })',
    '(function a(b = new.target){})',
    'function f() { let x = new.target; }',
    'function f() { new new.target()(); }',
    'function f() { new.target(); }',
  ]) {
    it(`function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`'use strict'; function f() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; function f() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`var f = function() {${arg}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`var f = function() {${arg}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`({set x(_) {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({set x(_) {${arg}}})`, undefined, Context.OptionsNext);
      });
    });

    it(`'use strict'; ({get x() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({get x() {${arg}}})`, undefined, Context.None);
      });
    });

    it(`({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`'use strict'; ({m: function() {${arg}}})`, () => {
      t.doesNotThrow(() => {
        parseSource(`'use strict'; ({m: function() {${arg}}})`, undefined, Context.OptionsNext | Context.Module);
      });
    });

    it(`class C {m() {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {m() {${arg}}}`, undefined, Context.None);
      });
    });

    it(`class C {set x(_) {${arg}}}`, () => {
      t.doesNotThrow(() => {
        parseSource(`class C {set x(_) {${arg}}}`, undefined, Context.OptionsNext | Context.Module);
      });
    });
  }

  pass('Expressions - New target (pass)', [
    ['class C {set x(_) {do { new.target } while (0)}}', Context.None],
    ['function f(){ new new .target; }', Context.None],
    ['function f(){ new.target }', Context.None],
    ['function f(){ new . target }', Context.OptionsRanges],
    ['function f(){ return _ => new.target }', Context.OptionsRanges],
    ['function f(){ _ => _ => new.target }', Context.OptionsRanges],
    ['_ => function(){ new.target }', Context.None],
    ['function f(){ new.target + foo }', Context.None],
    ['function f(){ foo + new.target }', Context.None],
    ['function f(){ foo = new.target }', Context.None],
    ['foo({bar(){ new.target }})', Context.None],
    ['class X { constructor() { new.target }}', Context.OptionsRanges],
    ['class X { foo() { new.target }}', Context.None],
    ['class X { static foo() { new.target }}', Context.None],
    ['function f(f=new.target){}', Context.None],
    ['foo(function f(f=new.target){})', Context.None],
    ['({foo(x=new.target){}})', Context.None],
    ['class A {constructor(x=new.target){}}', Context.None],
    ['class A {a(x=new.target){}}', Context.OptionsRanges],
    ['function f(){ [...new.target] }', Context.OptionsRanges],
    ['function f(){ class x extends new.target {} }', Context.OptionsRanges],
    ['function f(){ x({[new.target]:y}) }', Context.OptionsRanges],
    ['function a(b = new.target){}', Context.None],
  ]);
});
