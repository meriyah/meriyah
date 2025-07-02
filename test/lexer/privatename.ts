import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';

describe('lexer - privatename', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const parser = new Parser(opts.source, opts.options);
      const token = scanSingleToken(parser, opts.ctx, 0);
      t.deepEqual(
        {
          token,
          value: parser.tokenValue,
          index: parser.index,
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
    ctx: Context.None,
    options: { next: true },
    token: Token.PrivateField,
    value: '',
    newline: false,
    index: 1,
  });

  function fail(name: string, source: string, context: Context) {
    it(name, () => {
      const parser = new Parser(source);
      t.throws(() => scanSingleToken(parser, context, 0));
    });
  }

  fail('fails on # aa', '#123', Context.AllowRegExp);
  fail('fails on # aa', '# aa', Context.AllowRegExp);
});
