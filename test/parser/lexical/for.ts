import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail } from '../../test-utils.ts';

describe('Lexical - For statement', () => {
  fail('Lexical - For statement (fail)', [
    { code: 'for (const x = y;;) { var x; }', options: { lexical: true } },
    { code: 'for (let x;;) { var x; }', options: { lexical: true } },
    { code: 'for (const x = y;;) { var x; }', options: { lexical: true } },
    { code: 'for (let x in y) { var x; ', options: { lexical: true } },
    { code: 'for (const x in y) { var x; }', options: { lexical: true, sourceType: 'module' } },
    { code: 'for (let x of y) { var x; }', options: { lexical: true } },
    { code: 'for (const x of y) { var x; }', options: { lexical: true } },
    { code: 'for (let a, b, x, d;;) { var foo; var bar; { var doo, x, ee; } }', options: { lexical: true } },
    { code: 'for (var a;;) { var b; let b; }', options: { lexical: true } },
    { code: 'for (const [x, x] in {}) {}', options: { lexical: true } },
    { code: 'for (let x of []) { var x;  }', options: { lexical: true } },
    { code: 'function f(){let i; class i{}}', options: { lexical: true } },
    { code: 'let x; for (;;) { var x; }', options: { lexical: true } },
    { code: 'for (let x;;) { var x; }', options: { lexical: true } },
    { code: 'for (const x in {}) { var x; }', options: { lexical: true } },
    {
      code: outdent`
        {
          for (var x;;);
          const x = 1
        }
      `,
      options: { webcompat: true, lexical: true },
    },
    {
      code: outdent`
        function f(){
          for (var x;;);
          const x = 1
        }
      `,
      options: { webcompat: true, lexical: true },
    },
  ]);

  for (const text of [
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
    'var x; for (;;) { let x; }',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { lexical: true });
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });
  }

  for (const text of [
    'for (var a;;) { let a; }',
    'for (const a = x;;) { let a; }',
    'for (let a;;) { let a; }',
    'try {} catch (e) { for (let e;;) {} }',
    'try {} catch (e) { for (const e of y) {} }',
    'try {} catch (e) { for (let e of y) {} }',
    'try {} catch (e) { for (var e of y) {} }',
    'try {} catch (e) { for (const e = y;;) {} }',
    'for (var x;;) { let x; }',
    'var x; for (;;) { let x; }',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true, lexical: true });
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true, webcompat: true, lexical: true });
      });
    });
  }
});
