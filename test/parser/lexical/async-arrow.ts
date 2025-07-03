import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - Arrows', () => {
  fail('Lexical - Arrows (fail)', [
    { code: 'async (ā,食,食) => { /* 𢭃 */ }', options: { lexical: true } },
    { code: '(x) => { let x }', options: { lexical: true } },
    { code: '(x) => { const x = y }', options: { lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: '(a, a) => {}', options: { lexical: true } },
    { code: '(a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, a) => {}', options: { lexical: true } },
    { code: '(a, a, b) => {}', options: { lexical: true } },
    { code: '(b, a, b, a) => {}', options: { lexical: true } },
    { code: '(b, a, b, a, [fine]) => {}', options: { lexical: true } },
    { code: '(b, a, b, a = x) => {}', options: { lexical: true } },
    { code: '(b, a, b, ...a) => {}', options: { lexical: true } },
    { code: '([a, a]) => {}', options: { lexical: true } },
    { code: '([a, b, a]) => {}', options: { lexical: true } },
    { code: '([b, a, a]) => {}', options: { lexical: true } },
    { code: '([a, a, b]) => {}', options: { lexical: true } },
    { code: '([b, a, b, a]) => {}', options: { lexical: true } },
    { code: '([b, a], b) => {}', options: { lexical: true } },
    { code: '([b, a], {b}) => {}', options: { lexical: true } },
    { code: '([b, a], b=x) => {}', options: { lexical: true } },
    { code: '([a], a, ...b) => {}', options: { lexical: true } },
    { code: 'a(async a => { let a; })', options: { lexical: true } },
    { code: 'a(async (a, a) => { let a; })', options: { lexical: true } },
    { code: 'a(async (a, [a]) => { let a; })', options: { lexical: true } },
    { code: 'async a => { let a; }', options: { lexical: true } },
    { code: 'async => { let async; }', options: { lexical: true } },
    { code: 'async (x) => { let x }', options: { lexical: true } },
    { code: 'async (x) => { const x = y }', options: { lexical: true } },
    { code: 'async ([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: 'async (a, a) => {}', options: { lexical: true } },
    { code: 'async (b, a, a) => {}', options: { lexical: true } },
    { code: 'async (b, a, b, a, [fine]) => {}', options: { lexical: true } },
    { code: 'async ([b, a, b, a]) => {}', options: { lexical: true } },
    { code: 'async ([b, a], ...b) => {}', options: { lexical: true } },
    { code: 'async ({"x": x, x: x}) => a', options: { lexical: true } },
    { code: 'async ({x: y, "x": x = y}) => { let y; }', options: { lexical: true } },
    { code: 'async ({3: x, 4: x}) => a', options: { lexical: true } },
    { code: 'async ({x: x, x: x}) => a', options: { lexical: true } },
    { code: 'async ({x: y, "x": x = y}) => { let y; }', options: { lexical: true } },
    { code: '([a,b,c]) => { const c = x; }', options: { lexical: true } },
    { code: 'async b => { let b; }', options: { lexical: true } },
    { code: 'async => { let async; }', options: { lexical: true } },
    { code: 'x = async => { let async; }', options: { lexical: true } },
    { code: 'async (a = b => { let b; })', options: { lexical: true } },
    { code: 'async yield => { let yield; }', options: { lexical: true } },
    { code: 'x = async yield => { let yield; }', options: { lexical: true } },
    { code: 'async await => { let await; }', options: { lexical: true } },
    { code: '(async => { let async; })', options: { lexical: true } },
    { code: '(async (a = b => { let b; }))', options: { lexical: true } },
    { code: '(async yield => { let yield; })', options: { lexical: true } },
    { code: '(async await => { let await; })', options: { lexical: true } },
  ]);

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'x => { function x() {} }',
    'x => { var x; }',
    '() => { let foo; }; foo => {}',
    '() => { let foo; }; () => { let foo; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { lexical: true });
      });
    });
  }

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'x => { function x() {} }',
    'x => { var x; }',
    '() => { let foo; }; foo => {}',
    '() => { let foo; }; () => { let foo; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true, lexical: true });
      });
    });
  }
});
