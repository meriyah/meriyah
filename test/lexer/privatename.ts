import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { Parser } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('lexer - privatename', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = new Parser(opts.source, '');
      const token = scanSingleToken(state, opts.ctx, 0);
      t.deepEqual(
        {
          token,
          value: state.tokenValue,
          index: state.index,
        },
        {
          token: opts.token,
          value: opts.value,
          index: opts.index,
        },
      );
    });
  }

  pass('scan identifier with backslash middle', {
    source: '#hello',
    ctx: Context.OptionsNext,
    token: Token.PrivateField,
    value: '',
    newline: false,
    index: 1,
  });

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const state = new Parser(source, '');
      t.throws(() => scanSingleToken(state, context, 0));
    });
  }

  fail('fails on # aa', '#123', Context.AllowRegExp);
  fail('fails on # aa', '# aa', Context.AllowRegExp);
});
