import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Flags } from '../../src/common';
import { skipHashBang } from '../../src/lexer';
import { Parser } from '../../src/parser/parser';

describe('Lexer - skiphashbang', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const parser = new Parser(opts.source);
      skipHashBang(parser);
      t.deepEqual(
        {
          value: parser.tokenValue,
          index: parser.index,
          column: parser.column,
          newLine: (parser.flags & Flags.NewLine) !== 0,
        },
        {
          value: opts.value,
          index: opts.index,
          column: opts.column,
          newLine: opts.newLine,
        },
      );
    });
  }
  pass('skips nothing in an empty source', {
    source: '',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0,
  });

  pass('skips nothing before an identifier', {
    source: 'foo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0,
  });
  pass('skips nothing before a lone exclamation', {
    source: '! foo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0,
  });

  pass('skips a shebang+LF before a lone hash', {
    source: '#!/foo/bar/baz -abc\n# foo',
    hasNext: true,
    newLine: true,
    value: '',
    index: 20,
    line: 2,
    column: 0,
  });

  pass('skips a shebang+LF in an otherwise empty source', {
    source: '#!/foo/bar/baz -abc\n',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0,
  });

  pass('skips a shebang+LF before an identifier', {
    source: '#!/foo/bar/baz -abc\nfoo',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0,
  });

  pass('skips a shebang+LF before a lone exclamation', {
    source: '#!/foo/bar/baz -abc\n! foo',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0,
  });

  pass('skips a shebang+CR in an otherwise empty source', {
    source: '#!/foo/bar/baz -abc\r',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0,
  });
});
