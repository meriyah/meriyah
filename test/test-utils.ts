import * as t from 'node:assert/strict';
import { parseSource } from '../src/parser';
import { type Context } from '../src/common';
import { expect } from 'vitest';

export const pass = (name: string, valid: [string, Context][]): void => {
  describe(name, () => {
    for (const [source, ctx] of valid) {
      it(source, () => {
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
