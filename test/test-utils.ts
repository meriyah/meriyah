import * as t from 'node:assert/strict';
import { describe, it, expect } from 'vitest';
import { parseSource, type Options } from '../src/parser';
import { Context } from '../src/common';

export const pass = (
  name: string,
  valid: (string | { code: string; options?: Options; context?: Context })[],
): void => {
  describe(name, () => {
    for (let testCase of valid) {
      if (typeof testCase === 'string') {
        testCase = { code: testCase };
      }

      const { code, options, context } = testCase;

      // https://github.com/vitest-dev/vitest/issues/8151
      const title = code.replaceAll('\r', '␍␊');
      it(title, () => {
        const parseResult = parseSource(code, options, context ?? Context.None);
        expect(parseResult).toMatchSnapshot();
      });
    }
  });
};

export const fail = (name: string, invalid: [string, Context][]): void => {
  describe(name, () => {
    for (const [source, ctx] of invalid) {
      it(source, () => {
        t.throws(() => {
          parseSource(source, undefined, ctx);
        });
      });
    }
  });
};
