import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
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
    ['(x) => { let x }', Context.OptionsLexical],
    ['(x) => { const x = y }', Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['(a, a) => {}', Context.OptionsLexical],
    ['(a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, a) => {}', Context.OptionsLexical],
    ['(a, a, b) => {}', Context.OptionsLexical],
    ['a => const a', Context.OptionsLexical],
    ['a => const [a]', Context.OptionsLexical],
    ['a => const {a}', Context.OptionsLexical],
    ['a => let {a}', Context.OptionsLexical],
    ['async a => let {a}', Context.OptionsLexical],
    ['yield => let yield', Context.OptionsLexical],
    ['a => { let a }', Context.OptionsLexical],
    ['a => { const a }', Context.OptionsLexical],
    ['a => const [a]', Context.OptionsLexical | Context.OptionsNext],
    ['a => const {a}', Context.OptionsLexical | Context.Module | Context.Strict],
    ['a => let {a}', Context.OptionsLexical | Context.Module | Context.Strict],
    ['async a => let {a}', Context.OptionsLexical | Context.Module | Context.Strict],
    ['yield => let yield', Context.OptionsLexical | Context.Module | Context.Strict],
    ['a => { let a }', Context.OptionsLexical | Context.Module | Context.Strict | Context.OptionsNext],
    ['a => { const a }', Context.OptionsLexical | Context.Module | Context.Strict],
    ['a => { let [a] = x; }', Context.OptionsLexical | Context.OptionsNext],
    ['a => { let {a} = x }', Context.OptionsLexical | Context.OptionsNext],
    ['a => { let [a] = x; }', Context.OptionsLexical],
    ['a => { let {a} = x }', Context.OptionsLexical],
    ['a => {  const a = y; function x(){}  }', Context.OptionsLexical],
    ['({a}) => { let a; }', Context.OptionsLexical],
    ['({x:x, x:x}) => {}', Context.OptionsLexical],
    ['() => { return {}; }; let {x:foo()} = {};', Context.OptionsLexical],
    ['([x, x]) => {}', Context.OptionsLexical],
    ['([x], [x]) => {}', Context.OptionsLexical],
    ['([x], {x:x}) => {}', Context.OptionsLexical],
    ['([x], x) => {}', Context.OptionsLexical],
    ['(x, [x]) => {}', Context.OptionsLexical],
    ['([b, a], ...b) => {}', Context.OptionsLexical],
    ['() => { let x; var x; }', Context.OptionsLexical],
    ['() => { var x; let x; }', Context.OptionsLexical],
    ['(a, a = b) => {}', Context.OptionsLexical],
    ['([foo], [foo]) => {}', Context.OptionsLexical],
    ['([foo] = x, [foo] = y) => {}', Context.OptionsLexical],
    ['({foo} = x, {foo}) => {}', Context.OptionsLexical],
    ['([{foo}] = x, {foo}) => {}', Context.OptionsLexical],
    ['([{foo}] = x, [{foo}]) => {}', Context.OptionsLexical],
    ['(b, a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, b, a, [x]) => {}', Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.OptionsLexical],
    ['(b, a, b, ...a) => {}', Context.OptionsLexical],
    ['([a, a]) => {}', Context.OptionsLexical],
    ['a => { let a; }', Context.OptionsLexical],
    ['([a, b, a]) => {}', Context.OptionsLexical],
    ['([b, a, a]) => {}', Context.OptionsLexical],
    ['([a, a, b]) => {}', Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.OptionsLexical],
    ['([b, a], b) => {}', Context.OptionsLexical],
    ['([b, a], {b}) => {}', Context.OptionsLexical],
    ['([b, a], b=x) => {}', Context.OptionsLexical],
    ['([a], a, ...b) => {}', Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['([b, a], b) => {}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['([b, a], {b}) => {}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['([b, a], b=x) => {}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['([a], a, ...b) => {}', Context.OptionsLexical | Context.OptionsWebCompat],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['(x, {y: x}) => 1;', Context.OptionsLexical],
    ['(x, {y: x}) => 1;', Context.Strict | Context.OptionsLexical],
    ['({y: x, x}) => 1;', Context.OptionsLexical],
    ['({y: x}, ...x) => 1;', Context.OptionsLexical],
    ['a = b => { let b; }', Context.OptionsLexical],
    ['(a = b => { let b; })', Context.OptionsLexical],
    ['yield => { let yield; }', Context.OptionsLexical],
    ['({x: x, x: x}) => a', Context.OptionsLexical],
    ['(x, {y: x}) => 1;', Context.Strict | Context.OptionsLexical],
    ['({y: x, x}) => 1;', Context.OptionsLexical | Context.OptionsWebCompat],
    ['({y: x}, ...x) => 1;', Context.OptionsLexical | Context.Strict | Context.Module],
    ['a = b => { let b; }', Context.OptionsLexical | Context.Strict | Context.Module],
    ['(a = b => { let b; })', Context.OptionsLexical | Context.Strict | Context.Module],
    ['yield => { let yield; }', Context.OptionsLexical | Context.Strict],
    ['({x: x, x: x}) => a', Context.OptionsLexical | Context.Strict | Context.Module],
    ['await => { let await; }', Context.OptionsLexical],
    ['({x: y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['async ({x: y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['({"x": x, x: x}) => a', Context.OptionsLexical],
    ['({"x": y, x: x = y}) => { let y; }', Context.OptionsLexical],
    ['({1: x, 2: x}) => a', Context.OptionsLexical],
    ['({2: y, "x": x = y}) => { let y; }', Context.OptionsLexical],
    ['(a) => { let a; }', Context.OptionsLexical],
    ['(...a,) => x', Context.OptionsLexical],
    ['(...a = x,) => x', Context.OptionsLexical],
    ['(...a,)', Context.OptionsLexical],
    ['([b, a], b) => {}', Context.OptionsLexical],
    ['([b, a, b, a]) => {}', Context.OptionsLexical],
    ['([b, a], b=x) => {}', Context.OptionsLexical],
    ['([b, a], ...b) => {}', Context.OptionsLexical],
    ['([b, a], {b}) => {}', Context.OptionsLexical],
    ['(a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, b, a) => {}', Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.OptionsLexical],
    ['(b, a, b, a, [x]) => {}', Context.OptionsLexical],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical],
    ['(b, a, b, a = x) => {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['(b, a, b, a, [x]) => {}', Context.OptionsLexical | Context.Strict | Context.Module],
    ['([a,b,c]) => { const c = x; }', Context.OptionsLexical | Context.Strict | Context.Module],
    ['(x) => { const x = y }', Context.OptionsLexical],
    ['(x) => { let x }', Context.OptionsLexical]
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
    '() => { let foo; }; () => { let foo; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical | Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
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
    '() => { let foo; }; () => { let foo; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical | Context.OptionsNext);
      });
    });
  }
});
