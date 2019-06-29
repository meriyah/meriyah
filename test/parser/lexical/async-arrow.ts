import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Arrows', () => {
  fail('Lexical - Arrows (fail)', [
    ['(x) => { let x }', Context.None | Context.OptionsLexical],
    ['(x) => { const x = y }', Context.None | Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.None | Context.OptionsLexical],
    ['(a, a) => {}', Context.None | Context.OptionsLexical],
    ['(a, b, a) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, a) => {}', Context.None | Context.OptionsLexical],
    ['(a, a, b) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a, [fine]) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, ...a) => {}', Context.None | Context.OptionsLexical],
    ['([a, a]) => {}', Context.None | Context.OptionsLexical],
    ['([a, b, a]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a, a]) => {}', Context.None | Context.OptionsLexical],
    ['([a, a, b]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], b) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], {b}) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], b=x) => {}', Context.None | Context.OptionsLexical],
    ['([a], a, ...b) => {}', Context.None | Context.OptionsLexical],
    ['a(async a => { let a; })', Context.None | Context.OptionsLexical],
    ['a(async (a, a) => { let a; })', Context.None | Context.OptionsLexical],
    ['a(async (a, [a]) => { let a; })', Context.None | Context.OptionsLexical],
    ['async a => { let a; }', Context.None | Context.OptionsLexical],
    ['async => { let async; }', Context.None | Context.OptionsLexical],
    ['async (x) => { let x }', Context.None | Context.OptionsLexical],
    ['async (x) => { const x = y }', Context.None | Context.OptionsLexical],
    ['async ([a,b,c]) => { const c = x; }', Context.None | Context.OptionsLexical],
    ['async (a, a) => {}', Context.None | Context.OptionsLexical],
    ['async (b, a, a) => {}', Context.None | Context.OptionsLexical],
    ['async (b, a, b, a, [fine]) => {}', Context.None | Context.OptionsLexical],
    ['async ([b, a, b, a]) => {}', Context.None | Context.OptionsLexical],
    ['async ([b, a], ...b) => {}', Context.None | Context.OptionsLexical],
    ['async ({"x": x, x: x}) => a', Context.OptionsLexical],
    ['async ({x: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['async ({3: x, 4: x}) => a', Context.OptionsLexical],
    ['async ({x: x, x: x}) => a', Context.OptionsLexical],
    ['async ({x: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.None | Context.OptionsLexical],
    ['async b => { let b; }', Context.None | Context.OptionsLexical],
    ['async => { let async; }', Context.None | Context.OptionsLexical],
    ['x = async => { let async; }', Context.None | Context.OptionsLexical],
    ['async (a = b => { let b; })', Context.None | Context.OptionsLexical],
    ['async yield => { let yield; }', Context.None | Context.OptionsLexical],
    ['x = async yield => { let yield; }', Context.None | Context.OptionsLexical],
    ['async await => { let await; }', Context.None | Context.OptionsLexical],
    ['(async => { let async; })', Context.None | Context.OptionsLexical],
    ['(async (a = b => { let b; }))', Context.None | Context.OptionsLexical],
    ['(async yield => { let yield; })', Context.None | Context.OptionsLexical],
    ['(async await => { let await; })', Context.None | Context.OptionsLexical]
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
        parseSource(`${arg}`, undefined, Context.None | Context.OptionsLexical);
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
