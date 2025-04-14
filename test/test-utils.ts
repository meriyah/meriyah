import * as t from 'node:assert/strict';
import { parseSource } from '../src/parser';
import { type Context } from '../src/common';

export const pass = (name: string, valid: [string, Context, any][]): void => {
  describe(name, () => {
    for (const [source, ctx, expected] of valid) {
      it(source, () => {
        const parser = parseSource(source, undefined, ctx);
        t.deepStrictEqual(parser, expected);
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
