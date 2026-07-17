import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';

describe('Miscellaneous - Enum', () => {
  for (const text of [
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
    'try {} catch (enum) {} finally {}',
  ]) {
    it(`"use strict"; ${text}`, () => {
      t.throws(() => {
        parseSource(text, { impliedStrict: true });
      });
    });
  }

  for (const text of ['x = { enum: false }', 'class X { enum(){} }', 'class X { static enum(){} }']) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { sourceType: 'module' });
      });
    });
  }
});
