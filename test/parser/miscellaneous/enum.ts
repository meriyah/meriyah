import { Context } from '../../../src/common';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Enum', () => {
  for (const arg of [
    'enum;',
    'enum: ;',
    'var enum;',
    'var [enum] = [];',
    'var { enum } = {};',
    'var { x: enum } = {};',
    '{ var enum; }',
    'let enum;',
    'let [enum] = [];',
    'let { enum } = {};',
    'let { x: enum } = {};',
    '{ let enum; }',
    'const enum = null;',
    'const [enum] = [];',
    'const { enum } = {};',
    'const { x: enum } = {};',
    '{ const enum = null; }',
    'function enum() {}',
    'function f(enum) {}',
    'function* enum() {}',
    'function* g(enum) {}',
    '(function enum() {});',
    '(function (enum) {});',
    '(function* enum() {});',
    '(function* (enum) {});',
    '(enum) => {};',
    'enum => {};',
    'class enum {}',
    'class C { constructor(enum) {} }',
    'class C { m(enum) {} }',
    'class C { static m(enum) {} }',
    'class C { *m(enum) {} }',
    'class C { static *m(enum) {} }',
    '(class enum {})',
    '(class { constructor(enum) {} });',
    '(class { m(enum) {} });',
    '(class { static m(enum) {} });',
    '(class { *m(enum) {} });',
    '(class { static *m(enum) {} });',
    '({ m(enum) {} });',
    '({ *m(enum) {} });',
    '({ set p(enum) {} });',
    'try {} catch (enum) {}',
    'try {} catch (enum) {} finally {}'
  ]) {
    it(`"use strict"; ${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict);
      });
    });
  }

  for (const arg of ['x = { enum: false }', 'class X { enum(){} }', 'class X { static enum(){} }']) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }
});
