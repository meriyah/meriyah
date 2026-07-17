import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { pass } from '../../test-utils.ts';

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
        parseSource(text, { next: true });
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
});
