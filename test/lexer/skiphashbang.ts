import * as t from 'assert';
import { Flags, Context } from '../../src/common';
import { create } from '../../src/parser';
import { scanSingleToken, skipHashBang } from '../../src/lexer';

describe('Lexer - skiphashbang', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source);
      const token = skipHashBang(state);
      t.deepEqual(
        {
          value: state.tokenValue,
          index: state.index,
          column: state.column,
          newLine: (state.flags & Flags.NewLine) !== 0
        },
        {
          value: opts.value,
          index: opts.index,
          column: opts.column,
          newLine: opts.newLine
        }
      );
    });
  }

  function fail(name: string, source: string) {
    it(name, () => {
      const parser = create(source);
      t.throws(() => skipHashBang(parser));
    });
  }

  pass('skips nothing in an empty source', {
    source: '',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0
  });

  pass('skips nothing before an identifier', {
    source: 'foo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0
  });
  pass('skips nothing before a lone exclamation', {
    source: '! foo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 0,
    line: 1,
    column: 0
  });

  pass('skips a BOM in an otherwise empty source', {
    source: '\uFFEF',
    newLine: false,
    hasNext: false,
    value: '',
    index: 1,
    line: 1,
    column: 0
  });

  pass('skips a BOM before an identifier', {
    source: '\uFFEFfoo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 1,
    line: 1,
    column: 0
  });

  fail('skips a BOM and fails before a lone hash', '\uFFEF# foo');

  pass('skips a BOM before a lone exclamation', {
    source: '\uFFEF! foo',
    newLine: false,
    hasNext: false,
    value: '',
    index: 1,
    line: 1,
    column: 0
  });

  pass('skips a shebang+LF before a lone hash', {
    source: '#!/foo/bar/baz -abc\n# foo',
    hasNext: true,
    newLine: true,
    value: '',
    index: 20,
    line: 2,
    column: 0
  });

  pass('skips a shebang+LF in an otherwise empty source', {
    source: '#!/foo/bar/baz -abc\n',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0
  });

  pass('skips a shebang+LF before an identifier', {
    source: '#!/foo/bar/baz -abc\nfoo',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0
  });

  pass('skips a shebang+LF before a lone exclamation', {
    source: '#!/foo/bar/baz -abc\n! foo',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0
  });

  pass('skips a shebang+CR in an otherwise empty source', {
    source: '#!/foo/bar/baz -abc\r',
    newLine: true,
    hasNext: false,
    value: '',
    index: 20,
    line: 2,
    column: 0
  });
  pass('skips a BOM+shebang+LF in an otherwise empty source', {
    source: '\uFFEF#!/foo/bar/baz -abc\n',
    newLine: true,
    hasNext: false,
    value: '',
    index: 21,
    line: 2,
    column: 0
  });
});
