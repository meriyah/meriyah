import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail } from '../../test-utils';

describe('Lexical - If', () => {
  fail('Lexical - If (fail)', [
    { code: 'if (x) var foo = 1; let foo = 1;', options: { lexical: true } },
    { code: 'if (x) {} else var foo = 1; let foo = 1;', options: { lexical: true } },
    { code: 'if (x) var foo = 1; else {} let foo = 1;', options: { lexical: true } },
    { code: 'if (x) var foo = 1; let foo = 1;', options: { lexical: true } },
    { code: 'if (x) var foo = 1; let foo = 1;', options: { webcompat: true, lexical: true } },
    { code: 'do async function f(){} while (x);', options: { lexical: true } },
    {
      code: outdent`
        if (x) x;
        else async function f(){}
      `,
      options: { lexical: true },
    },
    {
      code: outdent`
        if (x) x;
        else async function *f(){}
      `,
      options: { lexical: true },
    },
    {
      code: outdent`
        if (x) x;
        else function *f(){}
      `,
      options: { lexical: true },
    },
    {
      code: outdent`
        if (x) x;
        else function(){}
      `,
      options: { lexical: true },
    },
    { code: 'if (x) async function f(){}', options: { lexical: true } },
    { code: 'if (x) {} else if (y) {} else var foo = 1; let foo = 1;', options: { lexical: true } },
    { code: 'if (x) { if (y) var foo = 1; } let foo = 1;', options: { next: true, lexical: true } },
    { code: 'if (x) { if (y) var foo = 1; } let foo = 1;', options: { webcompat: true, next: true, lexical: true } },
    { code: 'const x = a; function x(){};', options: { sourceType: 'module', lexical: true } },
    { code: 'if (x) var foo = 1; let foo = 1;', options: { impliedStrict: true, webcompat: true, lexical: true } },
    { code: 'if (x) { if (y) var foo = 1; } let foo = 1;', options: { lexical: true } },
    { code: 'const x = a; function x(){};', options: { lexical: true } },
    { code: 'if (x) var foo = 1; let foo = 1;', options: { webcompat: true, lexical: true } },
    { code: 'if (x) {} else var foo = 1; let foo = 1;', options: { webcompat: true, lexical: true } },
    { code: 'if (x) var foo = 1; else {} let foo = 1;', options: { webcompat: true, lexical: true } },
    { code: 'if (x) {} else if (y) {} else var foo = 1; let foo = 1;', options: { webcompat: true, lexical: true } },
    { code: 'if (x) { if (y) var foo = 1; } let foo = 1;', options: { webcompat: true, lexical: true } },
  ]);

  for (const arg of ['if (x) var foo = 1; var foo = 1;']) {
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
