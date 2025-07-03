import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Arrows', () => {
  fail('Lexical - Arrows (fail)', [
    { code: '([a]) => { let a; }', options: { lexical: true } },
    { code: '({a}) => { let a; }', options: { lexical: true } },
    { code: '(a) => { const a = 0; }', options: { lexical: true } },
    { code: '([a]) => { const a = 0; }', options: { lexical: true } },
    { code: '({a}) => { const a = 0; }', options: { lexical: true } },
    { code: '() => { let a; var a; }', options: { lexical: true } },
    { code: '([a, a]) => 0;', options: { lexical: true } },
    { code: '({a, a}) => 0;', options: { lexical: true } },
    { code: '([a],...a)=>0', options: { lexical: true } },
    { code: '(a,...a)=>0', options: { lexical: true } },
    { code: '([a],...a)=>0', options: { lexical: true } },
    { code: '(x) => { let x }', options: { lexical: true } },
    { code: '(x) => { const x = y }', options: { lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: '(a, a) => {}', options: { lexical: true } },
    { code: '(a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, a) => {}', options: { lexical: true } },
    { code: '(a, a, b) => {}', options: { lexical: true } },
    { code: 'a => const a', options: { lexical: true } },
    { code: 'a => const [a]', options: { lexical: true } },
    { code: 'a => const {a}', options: { lexical: true } },
    { code: 'a => let {a}', options: { lexical: true } },
    { code: 'async a => let {a}', options: { lexical: true } },
    { code: 'yield => let yield', options: { lexical: true } },
    { code: 'a => { let a }', options: { lexical: true } },
    { code: 'a => { const a }', options: { lexical: true } },
    { code: 'a => const [a]', options: { next: true, lexical: true } },
    { code: 'a => const {a}', options: { sourceType: 'module', lexical: true } },
    { code: 'a => let {a}', options: { sourceType: 'module', lexical: true } },
    { code: 'async a => let {a}', options: { sourceType: 'module', lexical: true } },
    { code: 'yield => let yield', options: { sourceType: 'module', lexical: true } },
    { code: 'a => { let a }', options: { sourceType: 'module', next: true, lexical: true } },
    { code: 'a => { const a }', options: { sourceType: 'module', lexical: true } },
    { code: 'a => { let [a] = x; }', options: { next: true, lexical: true } },
    { code: 'a => { let {a} = x }', options: { next: true, lexical: true } },
    { code: 'a => { let [a] = x; }', options: { lexical: true } },
    { code: 'a => { let {a} = x }', options: { lexical: true } },
    { code: 'a => {  const a = y; function x(){}  }', options: { lexical: true } },
    { code: '({a}) => { let a; }', options: { lexical: true } },
    { code: '({x:x, x:x}) => {}', options: { lexical: true } },
    { code: '() => { return {}; }; let {x:foo()} = {};', options: { lexical: true } },
    { code: '([x, x]) => {}', options: { lexical: true } },
    { code: '([x], [x]) => {}', options: { lexical: true } },
    { code: '([x], {x:x}) => {}', options: { lexical: true } },
    { code: '([x], x) => {}', options: { lexical: true } },
    { code: '(x, [x]) => {}', options: { lexical: true } },
    { code: '([b, a], ...b) => {}', options: { lexical: true } },
    { code: '() => { let x; var x; }', options: { lexical: true } },
    { code: '() => { var x; let x; }', options: { lexical: true } },
    { code: '(a, a = b) => {}', options: { lexical: true } },
    { code: '([foo], [foo]) => {}', options: { lexical: true } },
    { code: '([foo] = x, [foo] = y) => {}', options: { lexical: true } },
    { code: '({foo} = x, {foo}) => {}', options: { lexical: true } },
    { code: '([{foo}] = x, {foo}) => {}', options: { lexical: true } },
    { code: '([{foo}] = x, [{foo}]) => {}', options: { lexical: true } },
    { code: '(b, a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, b, a, [x]) => {}', options: { lexical: true } },
    { code: '(b, a, b, a = x) => {}', options: { lexical: true } },
    { code: '(b, a, b, ...a) => {}', options: { lexical: true } },
    { code: '([a, a]) => {}', options: { lexical: true } },
    { code: 'a => { let a; }', options: { lexical: true } },
    { code: '([a, b, a]) => {}', options: { lexical: true } },
    { code: '([b, a, a]) => {}', options: { lexical: true } },
    { code: '([a, a, b]) => {}', options: { lexical: true } },
    { code: '([b, a, b, a]) => {}', options: { lexical: true } },
    { code: '([b, a], b) => {}', options: { lexical: true } },
    { code: '([b, a], {b}) => {}', options: { lexical: true } },
    { code: '([b, a], b=x) => {}', options: { lexical: true } },
    { code: '([a], a, ...b) => {}', options: { lexical: true } },
    { code: '([b, a, b, a]) => {}', options: { webcompat: true, lexical: true } },
    { code: '([b, a], b) => {}', options: { webcompat: true, lexical: true } },
    { code: '([b, a], {b}) => {}', options: { webcompat: true, lexical: true } },
    { code: '([b, a], b=x) => {}', options: { webcompat: true, lexical: true } },
    { code: '([a], a, ...b) => {}', options: { webcompat: true, lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: '(x, {y: x}) => 1;', options: { lexical: true } },
    { code: '(x, {y: x}) => 1;', options: { impliedStrict: true, lexical: true } },
    { code: '({y: x, x}) => 1;', options: { lexical: true } },
    { code: '({y: x}, ...x) => 1;', options: { lexical: true } },
    { code: 'a = b => { let b; }', options: { lexical: true } },
    { code: '(a = b => { let b; })', options: { lexical: true } },
    { code: 'yield => { let yield; }', options: { lexical: true } },
    { code: '({x: x, x: x}) => a', options: { lexical: true } },
    { code: '(x, {y: x}) => 1;', options: { impliedStrict: true, lexical: true } },
    { code: '({y: x, x}) => 1;', options: { webcompat: true, lexical: true } },
    { code: '({y: x}, ...x) => 1;', options: { sourceType: 'module', lexical: true } },
    { code: 'a = b => { let b; }', options: { sourceType: 'module', lexical: true } },
    { code: '(a = b => { let b; })', options: { sourceType: 'module', lexical: true } },
    { code: 'yield => { let yield; }', options: { impliedStrict: true, lexical: true } },
    { code: '({x: x, x: x}) => a', options: { sourceType: 'module', lexical: true } },
    { code: 'await => { let await; }', options: { lexical: true } },
    { code: '({x: y, x: x = y}) => { let y; }', options: { lexical: true } },
    { code: 'async ({x: y, x: x = y}) => { let y; }', options: { lexical: true } },
    { code: '({"x": x, x: x}) => a', options: { lexical: true } },
    { code: '({"x": y, x: x = y}) => { let y; }', options: { lexical: true } },
    { code: '({1: x, 2: x}) => a', options: { lexical: true } },
    { code: '({2: y, "x": x = y}) => { let y; }', options: { lexical: true } },
    { code: '(a) => { let a; }', options: { lexical: true } },
    { code: '(...a,) => x', options: { lexical: true } },
    { code: '(...a = x,) => x', options: { lexical: true } },
    { code: '(...a,)', options: { lexical: true } },
    { code: '([b, a], b) => {}', options: { lexical: true } },
    { code: '([b, a, b, a]) => {}', options: { lexical: true } },
    { code: '([b, a], b=x) => {}', options: { lexical: true } },
    { code: '([b, a], ...b) => {}', options: { lexical: true } },
    { code: '([b, a], {b}) => {}', options: { lexical: true } },
    { code: '(a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, b, a = x) => {}', options: { lexical: true } },
    { code: '(b, a, b, a, [x]) => {}', options: { lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: '(b, a, b, a = x) => {}', options: { sourceType: 'module', lexical: true } },
    { code: '(b, a, b, a, [x]) => {}', options: { sourceType: 'module', lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { sourceType: 'module', lexical: true } },
    { code: '(x) => { const x = y }', options: { lexical: true } },
    { code: '(x) => { let x }', options: { lexical: true } },
  ]);

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'x => { function x() {} }',
    'x => { var x; }',
    'g => { try {}  catch (g) {} }',
    'g => { try {} catch ([g]) {} }',
    '() => { let foo; }; foo => {}',
    'async a => let [a]',
    'a => a',
    'a => { let {b} = a }',
    '() => { let foo; }; () => { let foo; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { next: true, lexical: true });
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'a => a',
    'g => { try {}  catch (g) {} }',
    'g => { try {} catch ([g]) {} }',
    'x => { function x() {} }',
    'async a => let [a]',
    'x => { var x; }',
    'a => { for (let a of b) c }',
    'a => { let {b} = a }',
    '() => { let foo; }; foo => {}',
    'a => { for (let a of b) c }',
    '() => { let foo; }; () => { let foo; }',
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
