import { describe, it, expect } from 'bun:test';
import { parseSource } from '../src/parser';
import { Context } from '../src/common';

export const pass = (name: string, valids: [string, Context, any][]): void => {
  describe(name, () => {
    for (const [source, ctx, expected] of valids) {
      it(source, () => {
        const parser = parseSource(source, undefined, ctx);
        expect(parser).toStrictEqual(expected);
      });
    }
  });
};

export const fail = (name: string, invalid: [string, Context][]): void => {
  describe(name, () => {
    for (const [source, ctx] of invalid) {
      it(source, () => {
        expect(() => {
          parseSource(source, undefined, ctx);
        }).toThrow();
      });
    }
  });
};
