import * as t from 'assert';
import { Flags, Context } from '../../src/common';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Whitespace', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const state = create(opts.source, '', undefined);
      scanSingleToken(state, Context.OptionsWebCompat, 0);
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

  pass('skips nothing', {
    source: '',
    newLine: false,
    hasNext: false,
    index: 0,
    value: '',
    line: 1,
    column: 0
  });

  pass('skips spaces', {
    source: '        ',
    newLine: false,
    hasNext: false,
    index: 8,
    value: '',
    line: 1,
    column: 8
  });

  pass('skips tabs', {
    source: '\t\t\t\t\t\t\t\t',
    newLine: false,
    hasNext: false,
    index: 8,
    value: '',
    line: 1,
    column: 8
  });

  pass('skips vertical tabs', {
    source: '\v\v\v\v\v\v\v\v',
    newLine: false,
    hasNext: false,
    index: 8,
    value: '',

    line: 1,
    column: 8
  });

  pass('skips white spacee', {
    source: '\u0020',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips white space', {
    source: '\u0009\u000B\u000C\u0020\u00A0\u000A\u000D\u2028\u2029',
    hasNext: false,
    value: '',
    newLine: true,
    line: 1,
    index: 9,
    column: 0
  });

  pass('skips paragraphseparator', {
    source: '\u2028',
    hasNext: false,
    value: '',
    newLine: true,
    line: 1,
    index: 1,
    column: 0
  });

  pass('skips paragraphseparator', {
    source: '\u2029',
    hasNext: false,
    value: '',
    newLine: true,
    line: 1,
    index: 1,
    column: 0
  });

  pass('skips white space', {
    source: '\true',
    hasNext: false,
    value: 'rue',
    newLine: false,
    line: 1,
    index: 4,
    column: 4
  });

  pass('skips lineseparator', {
    source: '\u2029',
    hasNext: false,
    value: '',
    newLine: true,
    line: 1,
    index: 1,
    column: 0
  });

  pass('skips lineseparator after identifier', {
    source: 'foo \u2029',
    hasNext: false,
    newLine: false,
    value: 'foo',
    line: 1,
    index: 3,
    column: 3
  });

  pass('skips crlf', {
    source: '\r\n',
    hasNext: false,
    newLine: true,
    value: '',
    line: 2,
    index: 2,
    column: 0
  });

  pass('skips crlf before identifier', {
    source: '\r\n foo',
    hasNext: false,
    newLine: true,
    value: 'foo',
    line: 1,
    index: 6,
    column: 4
  });

  pass('skips form feed', {
    source: '\u000C',
    hasNext: false,
    newLine: false,
    value: '',
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips line feeds', {
    source: '\n\n\n\n\n\n\n\n',
    newLine: true,
    hasNext: false,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips carriage returns', {
    source: '\r\r\r\r\r\r\r\r',
    newLine: true,
    hasNext: false,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips Windows newlines', {
    source: '\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n',
    newLine: true,
    hasNext: false,
    index: 16,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips line separators', {
    source: '\u2028\u2028\u2028\u2028\u2028\u2028\u2028\u2028',
    newLine: true,
    hasNext: false,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips paragraph separators', {
    source: '\u2029\u2029\u2029\u2029\u2029\u2029\u2029\u2029',
    newLine: true,
    hasNext: false,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });
  pass('skips mixed whitespace', {
    source: '    \t \r\n \n\r \v\f\t ',
    newLine: true,
    hasNext: false,
    index: 16,
    value: '',
    line: 4,
    column: 5
  });

  pass('skips single line comments with line feed', {
    source: '  \t // foo bar\n  ',
    newLine: true,
    hasNext: false,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with carriage return', {
    source: '  \t // foo bar\r  ',
    newLine: true,
    hasNext: false,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with Windows newlines', {
    source: '  \t // foo bar\r\n  ',
    newLine: true,
    hasNext: false,
    index: 18,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with line separators', {
    source: '  \t // foo bar\u2028  ',
    newLine: true,
    hasNext: false,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with paragraph separators', {
    source: '  \t // foo bar\u2029  ',
    newLine: true,
    hasNext: false,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips multiple single line comments with line feed', {
    source: '  \t // foo bar\n // baz \n //',
    newLine: true,
    hasNext: false,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with carriage return', {
    source: '  \t // foo bar\r // baz \n //',
    newLine: true,
    hasNext: false,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with Windows newlines', {
    source: '  \t // foo bar\r\n // baz \n //',
    newLine: true,
    hasNext: false,
    index: 28,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with line separators', {
    source: '  \t // foo bar\u2028 // baz \n //',
    newLine: true,
    hasNext: false,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with paragraph separators', {
    source: '  \t // foo bar\u2029 // baz \n //',
    newLine: true,
    hasNext: false,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    newLine: false,
    hasNext: false,
    index: 24,
    value: '',
    line: 1,
    column: 24
  });

  pass('skips multiline comments with line feed', {
    source: '  \t /* foo * /* bar \n */  ',
    newLine: true,
    hasNext: false,
    value: '',
    index: 26,
    line: 2,
    column: 5
  });

  pass('skips multiline comments with carriage return', {
    source: '  \t /* foo * /* bar \r */  ',
    newLine: true,
    hasNext: false,
    value: '',
    index: 26,
    line: 2,
    column: 5
  });

  pass('skips multiline comments with Windows newlines', {
    source: '  \t /* foo * /* bar \r\n */  ',
    newLine: true,
    hasNext: false,
    value: '',
    index: 27,
    line: 2,
    column: 5
  });

  pass('skips multiple multiline comments with carriage return', {
    source: '  \t /* foo bar\r *//* baz*/ \n /**/',
    newLine: true,
    hasNext: false,
    value: '',
    index: 33,
    line: 3,
    column: 5
  });

  pass('skips vertical tab in a string', {
    source: "'\\u000Bstr\\u000Bing\\u000B'",
    hasNext: false,
    value: '\u000bstr\u000bing\u000b',
    newLine: false,
    line: 1,
    index: 26,
    column: 26
  });

  pass('skips form feed in a string - #1', {
    source: "'\\u000Cstr\\u000Cing\\u000C'",
    hasNext: false,
    value: '\fstr\fing\f',
    newLine: false,
    line: 1,
    index: 26,
    column: 26
  });

  pass('skips form feed in a string - #2', {
    source: "'\\fstr\\fing\\f'",
    hasNext: false,
    value: '\fstr\fing\f',
    newLine: false,
    line: 1,
    index: 14,
    column: 14
  });

  pass('skips multiline comment with space - #1', {
    source: '/*\u0020 multi line \u0020 comment \u0020*/',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 28,
    column: 28
  });

  pass('skips multiline comment with no break space - #1', {
    source: '/*\u00A0 multi line \u00A0 comment \u00A0*/',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 28,
    column: 28
  });

  pass('skips multiline comment with no break space - #2', {
    source: '/*\u00A0 multi line \u00A0 comment \u00A0 x = 1;*/',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 35,
    column: 35
  });

  pass('skips multiline comment with space - #2', {
    source: '/*\u0020 multi line \u0020 comment \u0020 x = 1;*/',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 35,
    column: 35
  });

  pass('skips single comment with veritcal tab - #1', {
    source: '//\u000B single line \u000B comment \u000B',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 27,
    column: 27
  });

  pass('skips single comment with veritcal tab - #2', {
    source: '//\u000B single line \u000B comment \u000B x = 1;',
    hasNext: false,
    value: '',
    newLine: false,
    line: 1,
    index: 34,
    column: 34
  });

  pass('skips exotic whitespace', {
    source:
      '\x20\x09\x0B\x0C\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000',
    hasNext: false,
    newLine: false,
    value: '',
    line: 1,
    index: 20,
    column: 20
  });

  pass('skips single line comment with identifier and newline', {
    source: '// foo\n',
    hasNext: false,
    newLine: true,
    value: '',
    index: 7,
    column: 0
  });
  pass('skips multi line comment with escaped newline', {
    source: '/* \\n \\r \\x0a \\u000a */',
    hasNext: false,
    newLine: false,
    value: '',
    index: 23,
    column: 23
  });

  pass('skips single line comment with malformed escape', {
    source: '//\\unope \\u{nope} \\xno ',
    hasNext: false,
    value: '',
    newLine: false,
    index: 23,
    column: 23
  });

  pass('skips single line comment with escaped newlines', {
    source: '//\\n \\r \\x0a \\u000a still comment',
    hasNext: false,
    value: '',
    newLine: false,
    index: 33,
    column: 33
  });

  pass('skips single line comment with paragrap separator', {
    source: '//Single Line Comments\u2029 var =;',
    hasNext: true,
    newLine: true,
    value: 'var',
    index: 27,
    column: 4
  });

  pass('skips single line comment with Windows newline', {
    source: '// single line comment\u000D',
    hasNext: false,
    newLine: true,
    value: '',
    index: 23,
    column: 0
  });

  pass('skips multi line comment with carriage return', {
    source: '/*\\rmulti\\rline\\rcomment\\rx = 1;\\r*/',
    hasNext: false,
    newLine: false,
    value: '',
    index: 36,
    column: 36
  });

  pass('skips multi line comment with carriage return', {
    source: '/*\\rmulti\\rline\\rcomment\\rx = 1;\\r*/',
    hasNext: false,
    newLine: false,
    value: '',
    index: 36,
    column: 36
  });

  pass('skips single line comment with no break space', {
    source: '//\u00A0 single line \u00A0 comment \u00A0',
    hasNext: false,
    newLine: false,
    value: '',
    index: 27,
    column: 27
  });

  pass('skips single line comment with form feed', {
    source: '//\u000C single line \u000C comment \u000C',
    hasNext: false,
    newLine: false,
    value: '',
    index: 27,
    column: 27
  });

  pass('skips single line comment with identifier and newline', {
    source: '// foo\n',
    hasNext: false,
    newLine: true,
    value: '',
    index: 7,
    column: 0
  });

  pass('skips text after HTML close', {
    source: '\n-->',
    hasNext: false,
    newLine: true,
    value: '',
    index: 4,
    column: 3
  });

  pass('skips multi line comment with escaped newline', {
    source: '/* \\n \\r \\x0a \\u000a */',
    hasNext: false,
    newLine: false,
    value: '',
    index: 23,
    column: 23
  });

  // should fail in the parser
  pass('skips nested multi line comment', {
    source: '/* /* */ */',
    hasNext: true,
    newLine: false,
    value: '',
    index: 10,
    column: 10
  });

  pass('skips single line comment with slash', {
    source: '// /',
    hasNext: false,
    newLine: false,
    value: '',
    index: 4,
    column: 4
  });

  pass('skips single line comment with malformed escape', {
    source: '//\\unope \\u{nope} \\xno ',
    hasNext: false,
    newLine: false,
    value: '',
    index: 23,
    column: 23
  });

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    hasNext: false,
    newLine: false,
    value: '',
    index: 24,
    column: 24
  });

  pass('skips before first real token', {
    source: '--> is eol-comment',
    hasNext: false,
    newLine: false,
    value: '',
    index: 18,
    column: 18
  });

  pass('skips single line comment with form feed', {
    source: '\n-->\nvar y = 37;\n',
    hasNext: true,
    newLine: true,
    value: 'var',
    line: 3,
    index: 8,
    column: 3
  });

  pass('skips mixed whitespace', {
    source: '\t\u000b\u000c\u00a0',
    hasNext: true,
    newLine: false,
    value: '',
    line: 3,
    index: 4,
    column: 4
  });

  pass('skips simple exotic whitespace', {
    source: '\x85',
    hasNext: true,
    newLine: false,
    value: '',
    line: 3,
    index: 1,
    column: 1
  });

  pass('skips simple exotic whitespace', {
    source: '\xA0',
    hasNext: true,
    newLine: false,
    value: '',
    line: 3,
    index: 1,
    column: 1
  });

  pass('skips complex exotic whitespace', {
    source: '\t\x0B\x0C\xA0\u1680\u2000\u200A\u202F\u205F\u3000',
    hasNext: true,
    newLine: false,
    value: '',
    line: 3,
    index: 10,
    column: 10
  });

  pass('skips multiple comments preceding HTMLEndComment', {
    source: '/* MLC \n */ /* SLDC */ --> is eol-comment\nvar y = 37;\n',
    hasNext: true,
    newLine: true,
    value: 'var',
    line: 3,
    index: 45,
    column: 3
  });
});
