import * as t from 'assert';
import { parseSource } from '../src/parser';
import { type Context } from '../src/common';

export const pass = (name: string, valids: [string, Context, any][]): void => {
  describe(name, () => {
    for (const [source, ctx, expected] of valids) {
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
