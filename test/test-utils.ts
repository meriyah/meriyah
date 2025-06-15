import * as t from 'node:assert/strict';
import { describe, it, expect } from 'vitest';
import { parseSource } from '../src/parser';
import { type Context } from '../src/common';

export const pass = (name: string, valid: [string, Context][]): void => {
  describe(name, () => {
    for (const [source, ctx] of valid) {
      // https://github.com/vitest-dev/vitest/issues/8151
      const title = source.replaceAll('\r', '␍␊');
      it(title, () => {
        const parseResult = parseSource(source, undefined, ctx);
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
