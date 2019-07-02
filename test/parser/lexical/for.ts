import { Context } from '../../../src/common';
import { fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Lexical - For statement', () => {
  fail('Lexical - For statement (fail)', [
    ['for(let a in 0) { var a; }', Context.OptionsLexical],
    ['for(const a in 0) { var a; }', Context.OptionsLexical],
    ['for(let a of 0) { var a; }', Context.OptionsLexical],
    ['for(const a of 0) { var a; }', Context.OptionsLexical],
    ['for(let {a, a} in 0);', Context.OptionsLexical],
    ['for(const {a, a} in 0);', Context.OptionsLexical],
    ['for(let a;;) { var a; }', Context.OptionsLexical],
    ['for(const a = 0;;) { var a; }', Context.OptionsLexical],
    ['for(let {a, a} of 0);', Context.OptionsLexical],
    ['for(const {a, a} of 0);', Context.OptionsLexical],
    ['for (let x;;) { var x; }', Context.OptionsLexical],
    ['for (const x = y;;) { var x; }', Context.OptionsLexical],
    ['for (let x in y) { var x; }', Context.OptionsLexical],
    ['for (const x in y) { var x; }', Context.OptionsLexical],
    ['for (let x of y) { var x; }', Context.OptionsLexical],
    ['for (const x of y) { var x; }', Context.OptionsLexical],
    ['for (let a, b, x, d;;) { var foo; var bar; { var x, y, z; } }', Context.OptionsLexical],
    ['for (var a;;) { var b; let b; }', Context.OptionsLexical],
    ['for (const [x, x] in {}) {}', Context.OptionsLexical],
    ['for (;;) var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['for (const x of y) var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['for (const x in y) var foo = 1; let foo = 1;', Context.OptionsLexical],
    ['for (var x;;); const x = 1', Context.OptionsLexical],
    ['for (const x of obj) { var x = 14 }', Context.OptionsLexical],
    ['for (const x in obj) { var x = 13 }', Context.OptionsLexical],
    ['for (const x = 1;;) { var x = 2 }', Context.OptionsLexical],
    ['for(let {a, a} of 1);', Context.OptionsLexical],
    ['for(const {a, a} of 1);', Context.OptionsLexical],
    ['for(let [a, a] of 1);', Context.OptionsLexical],
    ['for(const [a, a] of 1);', Context.OptionsLexical]
  ]);

  for (const arg of [
    'for (let a;;) { let a; }',
    'for (const a = x;;) { let a; }',
    'for (var a;;) { let a; }',
    'try {} catch (e) { for (let e;;) {} }',
    'try {} catch (e) { for (const e = y;;) {} }',
    'try {} catch (e) { for (let e in y) {} }',
    'try {} catch (e) { for (const e in y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'for (let i = 0;;); for (let i = 0;;);',
    'for (const foo of bar); for (const foo of bar);',
    'for (const foo in bar); for (const foo in bar);',
    'for (let foo in bar) { let foo = 1; }',
    'for (let foo of bar) { let foo = 1; }',
    'for (var x = 3;;) { const x = 1 }',
    'for (var x in obj) { const x = 1 }',
    'for (var x of obj) { const x = 1 }',
    'let x = 1; for (const x in { x }) {}'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsLexical | Context.OptionsLexical);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat | Context.OptionsLexical);
      });
    });
  }

  for (const arg of [
    'for (const x in obj) { var x = 13 }',
    'for (const x = 1;;) { var x = 2 }',
    'for(let {a, a} of 1);',
    'for(const {a, a} of 1);',
    'for(let [a, a] of 1);',
    'for(const [a, a] of 1);'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
      });
    });
  }
});
