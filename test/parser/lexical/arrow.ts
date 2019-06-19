import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - Arrows', () => {
  fail('Lexical - Arrows (fail)', [
    ['([a]) => { let a; }', Context.OptionsLexical],
    ['({a}) => { let a; }', Context.OptionsLexical],
    ['(a) => { const a = 0; }', Context.OptionsLexical],
    ['([a]) => { const a = 0; }', Context.OptionsLexical],
    ['({a}) => { const a = 0; }', Context.OptionsLexical],
    ['() => { let a; var a; }', Context.OptionsLexical],
    ['([a, a]) => 0;', Context.OptionsLexical],
    ['({a, a}) => 0;', Context.OptionsLexical],
    ['([a],...a)=>0', Context.OptionsLexical],
    ['(a,...a)=>0', Context.OptionsLexical],
    ['([a],...a)=>0', Context.OptionsLexical],
    ['(x) => { let x }', Context.None | Context.OptionsLexical],
    ['(x) => { const x = y }', Context.None | Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.None | Context.OptionsLexical],
    ['(a, a) => {}', Context.None | Context.OptionsLexical],
    ['(a, b, a) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, a) => {}', Context.None | Context.OptionsLexical],
    ['(a, a, b) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a, [x]) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.None | Context.OptionsLexical],
    ['(b, a, b, ...a) => {}', Context.None | Context.OptionsLexical],
    ['([a, a]) => {}', Context.None | Context.OptionsLexical],
    ['a => { let a; }', Context.None | Context.OptionsLexical],
    ['([a, b, a]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a, a]) => {}', Context.None | Context.OptionsLexical],
    ['([a, a, b]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], b) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], {b}) => {}', Context.None | Context.OptionsLexical],
    ['([b, a], b=x) => {}', Context.None | Context.OptionsLexical],
    ['([a], a, ...b) => {}', Context.None | Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.None | Context.OptionsLexical],
    ['(x, {y: x}) => 1;', Context.None | Context.OptionsLexical],
    ['(x, {y: x}) => 1;', Context.Strict | Context.OptionsLexical],
    ['({y: x, x}) => 1;', Context.None | Context.OptionsLexical],
    ['({y: x}, ...x) => 1;', Context.None | Context.OptionsLexical],
    ['a = b => { let b; }', Context.None | Context.OptionsLexical],
    ['(a = b => { let b; })', Context.None | Context.OptionsLexical],
    ['yield => { let yield; }', Context.None | Context.OptionsLexical],
    ['({x: x, x: x}) => a', Context.OptionsLexical],
    ['await => { let await; }', Context.None | Context.OptionsLexical],
    ['({x: y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['async ({x: y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['({"x": x, x: x}) => a', Context.OptionsLexical],
    ['({"x": y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['({1: x, 2: x}) => a', Context.OptionsLexical],
    ['({2: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['(a) => { let a; }', Context.OptionsLexical]
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
