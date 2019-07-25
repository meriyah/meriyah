import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - For statement', () => {
  fail('Lexical - For statement (fail)', [
    ['for (const x = y;;) { var x; }', Context.OptionsLexical],
    ['for (let x;;) { var x; }', Context.OptionsLexical],
    ['for (const x = y;;) { var x; }', Context.OptionsLexical],
    ['for (let x in y) { var x; ', Context.OptionsLexical],
    ['for (const x in y) { var x; }', Context.Module | Context.OptionsLexical],
    ['for (let x of y) { var x; }', Context.OptionsLexical],
    ['for (const x of y) { var x; }', Context.OptionsLexical],
    ['for (let a, b, x, d;;) { var foo; var bar; { var doo, x, ee; } }', Context.OptionsLexical],
    ['for (var a;;) { var b; let b; }', Context.OptionsLexical],
    ['for (const [x, x] in {}) {}', Context.OptionsLexical],
    ['for (let x of []) { var x;  }', Context.OptionsLexical],
    ['function f(){let i; class i{}}', Context.OptionsLexical],
    ['let x; for (;;) { var x; }', Context.OptionsLexical],
    ['for (let x;;) { var x; }', Context.OptionsLexical],
    ['for (const x in {}) { var x; }', Context.OptionsLexical],
    [
      `{
      for (var x;;);
      const x = 1
    }`,
      Context.OptionsWebCompat | Context.OptionsLexical
    ],
    [
      `function f(){
      for (var x;;);
      const x = 1
    }`,
      Context.OptionsWebCompat | Context.OptionsLexical
    ]
  ]);

  for (const arg of [
    'for (var a;;) { let a; }',
    'for (const a = x;;) { let a; }',
    'for (let a;;) { let a; }',
    'try {} catch (e) { for (let e;;) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    '{ { var f; } var f }',
    'function f() {} ; function f() {}',
    'function g(){ function f() {} ; function f() {} }',
    'for (var x;;) { let x; }',
    'var x; for (;;) { let x; }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
  }

  for (const arg of [
    'for (var a;;) { let a; }',
    'for (const a = x;;) { let a; }',
    'for (let a;;) { let a; }',
    'try {} catch (e) { for (let e;;) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (var e of y) {} }',
    'try {} catch (e) { for (const e = y;;) {} }',
    'for (var x;;) { let x; }',
    'var x; for (;;) { let x; }'
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
