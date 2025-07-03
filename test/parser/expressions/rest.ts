import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';
describe('Expressions - Rest', () => {
  for (const arg of [
    'let { ...x = y } = z;',
    'let { a, ...b, c } = x;',
    'let {...obj1,...obj2} = foo',
    'let {...obj1,a} = foo',
    'let {...(obj)} = foo',
    '({...(a,b)}) => {}',
    'let {...obj1,} = foo',
    'let {...(a,b)} = foo',
    '({...x = 1} = {})',
    'var {...x = 1} = {}',
    'function test({...x = 1}) {}',
    '({...[]} = {})',
    '({...{}} = {})',
    '({...(obj)}) => {}',
    '({...(a,b)}) => {}',
    '({...[a,b]} = foo)',
    '({...{a,b}} = foo)',
    '({...(a,b)} = foo)',
    'let {...(a,b)} = foo',
    'let {...(obj)} = foo',
    'let {...obj1,...obj2} = foo',
    'let {...obj1,a} = foo',
    'let {...obj1,} = foo',
    'let { ...x = y } = z;',
    'let { a, ...b, c } = x;',
    // Object rest element needs to be the last AssignmenProperty in ObjectAssignmentPattern.
    '{...rest, b}',
    'function test({...[]}) {}',
    'var {...[]} = {}',
    'function test({...{a}}) {}',
    // Babylon PR: https://github.com/babel/babylon/issues/667
    ' ( {...{}} = {} ) ',
    // Babylon issue: https://github.com/babel/babylon/issues/661
    'let {...{}} = {};',
    '({...[a,b]}) => {}',
    '({...obj1,a} = foo)',
    '({...obj1,} = foo)',
    'let {...[a,b]} = foo',
    'let {...{a,b}} = foo',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { next: true });
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }

  for (const arg of [
    '({...obj} = foo)',
    '({a,...obj} = foo)',
    '({a:b,...obj} = foo)',
    '({...obj}) => {}',
    '({...obj} = {}) => {}',
    '({a,...obj}) => {}',
    '({a:b,...obj}) => {}',
    '({...rest})',
    'let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };',
    'let { ...x } = y;',
    '({a, b, ...{c, e}})',
    '({ x, ...{y , z} })',
    'function f({ x, y, ...z }) {}',
    '({...(obj)} = foo)',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of ['function f(a, ...b, c) {}']) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    'function empty(...{}) {}',
    'function emptyWithArray(...{p: []}) {}',
    'function emptyWithObject(...{p: {}}) {}',
    'function emptyWithLeading(x, ...{}) {}',
    'function singleElement(...{a: b}) {}',
    'function singleElementWithInitializer(...{a: b = 0}) {}',
    'function singleElementWithArray(...{p: [a]}) {}',
    'function singleElementWithObject(...{p: {a: b}}) {}',
    'function singleElementWithLeading(x, ...{a: b}) {}',
    'function multiElement(...{a: r, b: s, c: t}) {}',
    'function multiElementWithInitializer(...{a: r = 0, b: s, c: t = 1}) {}',
    'function multiElementWithArray(...{p: [a], b, q: [c]}) {}',
    'function multiElementWithObject(...{a: {p: q}, b: {r}, c: {s = 0}}) {}',
    'function multiElementWithLeading(x, y, ...{a: r, b: s, c: t}) {}',
    'function empty(...[]) {}',
    'function emptyWithArray(...[[]]) {}',
    'function emptyWithObject(...[{}]) {}',
    'function emptyWithRest(...[...[]]) {}',
    'function emptyWithLeading(x, ...[]) {}',
    'function singleElement(...[a]) {}',
    'function singleElementWithInitializer(...[a = 0]) {}',
    'function singleElementWithArray(...[[a]]) {}',
    'function singleElementWithObject(...[{p: q}]) {}',
    'function singleElementWithRest(...[...a]) {}',
    'function singleElementWithLeading(x, ...[a]) {}',
    'function multiElement(...[a, b, c]) {}',
    'function multiElementWithInitializer(...[a = 0, b, c = 1]) {}',
    'function multiElementWithArray(...[[a], b, [c]]) {}',
    'function multiElementWithObject(...[{p: q}, {r}, {s = 0}]) {}',
    'function multiElementWithRest(...[a, b, ...c]) {}',
    'function multiElementWithLeading(x, y, ...[a, b, c]) {}',
    'function af(...a) {}',
    'function bf(a, ...b) {}',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true });
      });
    });
  }

  fail('Expressions - Rest (fail)', [
    'function foo(...[a], ...b) {}',
    'function foo(...a, ...[b]) {}',
    'function foo(a, ...b, c) => {}',
    'function foo(a, ...[b], c) => {}',
    'var obj = class { method(a, b = 1, ...c = [2,3]) {} };',
    'function f(a, ...b) { "use strict"; }',
    'function f(a, ...[b]) { "use strict"; }',
    'var x = { set setter(...[x]) {} }',
    'var x = class { set setter(...x) {} }',
    'var x = class { set setter(...[x]) {} }',
    '(a = ...NaN, b = [...[1,2,3]], ...rest) => {};',
    '(a = (...NaN), ...b = [...[1,2,3]], rest) => {};',
    '(a = [...NaN], ...b = [...[1,2,3]], rest) => {};',
    '(a, ...b, ...rest) => {};',
    '(...rest = ...NaN) => {};',
    '[...x,] = [1,2,3];',
    '[...x, y] = [1,2,3];',
    'function foo(...[a],) {}',
  ]);

  pass('Expressions - Rest (pass)', [
    'var obj = { method(a, b, c, ...[d]) { return [a, b, c, d]; } };',
    "function objRest(...{'0': a, '1': b, length}) { return [a, b, length]; }",
    'function singleRest(...[d]) { return d; }',
    'function foo(a, b, c, ...[d]) { arguments; return [a, b, c, d]; }',
    'class restClass { method(a, b, c, ...[d]) { arguments; return [a, b, c, d]; } };',
    'function fooInline(a, b, c, ...rest) { arguments; this; return [a, b, c, ...rest]; }',
    'var func5 = function (...[argArr13]) { function foo() { eval(); } };',
  ]);
});
