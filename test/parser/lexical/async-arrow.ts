import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Arrows', () => {
  fail('Lexical - Arrows (fail)', [
    [`async (ā,食,食) => { /* 𢭃 */ }`, Context.OptionsLexical],
    ['(x) => { let x }', Context.OptionsLexical],
    ['(x) => { const x = y }', Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['(a, a) => {}', Context.OptionsLexical],
    ['(a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, a) => {}', Context.OptionsLexical],
    ['(a, a, b) => {}', Context.OptionsLexical],
    ['(b, a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, b, a, [fine]) => {}', Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.OptionsLexical],
    ['(b, a, b, ...a) => {}', Context.OptionsLexical],
    ['([a, a]) => {}', Context.OptionsLexical],
    ['([a, b, a]) => {}', Context.OptionsLexical],
    ['([b, a, a]) => {}', Context.OptionsLexical],
    ['([a, a, b]) => {}', Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.OptionsLexical],
    ['([b, a], b) => {}', Context.OptionsLexical],
    ['([b, a], {b}) => {}', Context.OptionsLexical],
    ['([b, a], b=x) => {}', Context.OptionsLexical],
    ['([a], a, ...b) => {}', Context.OptionsLexical],
    ['a(async a => { let a; })', Context.OptionsLexical],
    ['a(async (a, a) => { let a; })', Context.OptionsLexical],
    ['a(async (a, [a]) => { let a; })', Context.OptionsLexical],
    ['async a => { let a; }', Context.OptionsLexical],
    ['async => { let async; }', Context.OptionsLexical],
    ['async (x) => { let x }', Context.OptionsLexical],
    ['async (x) => { const x = y }', Context.OptionsLexical],
    ['async ([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['async (a, a) => {}', Context.OptionsLexical],
    ['async (b, a, a) => {}', Context.OptionsLexical],
    ['async (b, a, b, a, [fine]) => {}', Context.OptionsLexical],
    ['async ([b, a, b, a]) => {}', Context.OptionsLexical],
    ['async ([b, a], ...b) => {}', Context.OptionsLexical],
    ['async ({"x": x, x: x}) => a', Context.OptionsLexical],
    ['async ({x: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['async ({3: x, 4: x}) => a', Context.OptionsLexical],
    ['async ({x: x, x: x}) => a', Context.OptionsLexical],
    ['async ({x: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['async b => { let b; }', Context.OptionsLexical],
    ['async => { let async; }', Context.OptionsLexical],
    ['x = async => { let async; }', Context.OptionsLexical],
    ['async (a = b => { let b; })', Context.OptionsLexical],
    ['async yield => { let yield; }', Context.OptionsLexical],
    ['x = async yield => { let yield; }', Context.OptionsLexical],
    ['async await => { let await; }', Context.OptionsLexical],
    ['(async => { let async; })', Context.OptionsLexical],
    ['(async (a = b => { let b; }))', Context.OptionsLexical],
    ['(async yield => { let yield; })', Context.OptionsLexical],
    ['(async await => { let await; })', Context.OptionsLexical]
  ]);

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'x => { function x() {} }',
    'x => { var x; }',
    '() => { let foo; }; foo => {}',
    '() => { let foo; }; () => { let foo; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    '(x) => { function x() {} }',
    '(x) => { var x; }',
    'x => { function x() {} }',
    'x => { var x; }',
    '() => { let foo; }; foo => {}',
    '() => { let foo; }; () => { let foo; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }
});
