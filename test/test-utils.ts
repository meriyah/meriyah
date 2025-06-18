import * as t from 'node:assert/strict';
import { describe, it, expect } from 'vitest';
import { parseSource, type Options } from '../src/parser';
import { Context } from '../src/common';

const IS_CI = Boolean(process.env.CI);

export const pass = (
  name: string,
  valid: (string | { code: string; options?: Options; context?: Context; only?: true })[],
): void => {
  describe(name, () => {
    for (let testCase of valid) {
      if (typeof testCase === 'string') {
        testCase = { code: testCase };
      }

      const { code, options, context, only } = testCase;

      if (IS_CI && only) {
        throw new Error(`Please remove 'only'.`);
      }

      // https://github.com/vitest-dev/vitest/issues/8151
      const title = code.replaceAll('\r', '␍␊');
      (only ? it.only : it)(title, () => {
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
