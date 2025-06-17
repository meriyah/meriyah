import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Expressions -In', () => {
  for (const arg of [
    'NaN in a',
    '"string" in a',
    '0 in a',
    'Math.pow(2,30)-1 in {}',
    '+0 in {}',
    '+0 in []',
    '0.001 in a[2]',
    '0.001 in async[2]',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext);
      });
    });

    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsWebCompat);
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
