import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { fail, pass } from '../../test-utils.ts';

const invalidPrivateIdentifierPositions = [
  'class C { #x; m() { (#x); } }',
  'class C { #x; m() { [#x]; } }',
  'class C { #x; m() { typeof #x; } }',
  'class C { #x; m() { #x; } }',
  'class C { #x; m() { for (#x in []) {} } }',
  'class C { #field; m() { #field in #field in this; } }',
  'class C { #x; m() { ({ value: #x }); } }',
  'class C { #x; m() { `${#x}`; } }',
];

const validPrivateIdentifierInExpressions = [
  'class C { #x; m(obj) { #x in obj; } }',
  'class C { #x; m(obj) { if (#x in obj) {} } }',
  'class C { #x; m(obj) { #x in obj ? 1 : 0; } }',
  'class C { #x; m(obj) { #x in obj && true; } }',
  'class C { #x; m(obj) { false || #x in obj; } }',
  'class C { #x; m(obj) { (#x in obj); } }',
  'class C { #a; m(b, c) { (#a in b) in c; } }',
  'class C { #x; y = #x in this; }',
];

const privateIdentifierModes = [
  { name: 'script sloppy', prefix: '', sourceType: 'script' },
  { name: 'script strict', prefix: "'use strict';\n", sourceType: 'script' },
  { name: 'module', prefix: '', sourceType: 'module' },
  { name: 'module with directive', prefix: "'use strict';\n", sourceType: 'module' },
] as const;

describe('Expressions -In', () => {
  for (const text of [
    'NaN in a',
    '"string" in a',
    '0 in a',
    'Math.pow(2,30)-1 in {}',
    '+0 in {}',
    '+0 in []',
    '0.001 in a[2]',
    '0.001 in async[2]',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true });
      });
    });
  }

  pass('Expressions -In', [
    'x in async',
    'x in Number',
    '(NUMBER = Number, "MAX_VALUE") in NUMBER',
    { code: '"valueOf" in __proto', options: { raw: true } },
    { code: '"use strict"', options: { raw: true } },
    { code: '"any-string"', options: { raw: true } },
    { code: '"any-string"', options: { raw: true } },
    { code: '123', options: { raw: true } },
  ]);

  for (const { name, prefix, sourceType } of privateIdentifierModes) {
    fail(
      `Private identifiers outside in expressions (${name})`,
      invalidPrivateIdentifierPositions.map((code) => ({ code: prefix + code, options: { sourceType } })),
    );

    for (const code of validPrivateIdentifierInExpressions) {
      it(`Private identifiers in expressions (${name}): ${code}`, () => {
        t.doesNotThrow(() => {
          parseSource(prefix + code, { sourceType });
        });
      });
    }
  }
});
