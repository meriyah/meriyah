import * as t from 'assert';
import { Flags, Context } from '../../src/common';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('Lexer - Whitespace', () => {
  function pass(name: string, opts: any) {
    it(name, () => {
      const { source, ...otherOpts } = opts;
      const state = create(source, '', undefined);
      scanSingleToken(state, Context.OptionsWebCompat, 0);
      t.deepEqual(
        {
          value: state.tokenValue,
          index: state.index,
          column: state.column,
          line: state.line,
          newLine: (state.flags & Flags.NewLine) !== 0
        },
        otherOpts
      );
    });
  }

  pass('skips nothing', {
    source: '',
    newLine: false,
    index: 0,
    value: '',
    line: 1,
    column: 0
  });

  pass('skips spaces', {
    source: '        ',
    newLine: false,
    index: 8,
    value: '',
    line: 1,
    column: 8
  });

  pass('skips tabs', {
    source: '\t\t\t\t\t\t\t\t',
    newLine: false,
    index: 8,
    value: '',
    line: 1,
    column: 8
  });

  pass('skips vertical tabs', {
    source: '\v\v\v\v\v\v\v\v',
    newLine: false,
    index: 8,
    value: '',

    line: 1,
    column: 8
  });

  pass('skips white spacee', {
    source: '\u0020',
    value: '',
    newLine: false,
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips white space', {
    source: '\u0009\u000B\u000C\u0020\u00A0\u000A\u000D\u2028\u2029',
    value: '',
    newLine: true,
    line: 5,
    index: 9,
    column: 0
  });

  pass('skips paragraphseparator', {
    source: '\u2028',
    value: '',
    newLine: true,
    line: 2,
    index: 1,
    column: 0
  });

  pass('skips paragraphseparator', {
    source: '\u2029',
    value: '',
    newLine: true,
    line: 2,
    index: 1,
    column: 0
  });

  pass('skips white space', {
    source: '\true',
    value: 'rue',
    newLine: false,
    line: 1,
    index: 4,
    column: 4
  });

  pass('skips lineseparator', {
    source: '\u2029',
    value: '',
    newLine: true,
    line: 2,
    index: 1,
    column: 0
  });

  pass('skips lineseparator after identifier', {
    source: 'foo \u2029',
    newLine: false,
    value: 'foo',
    line: 1,
    index: 3,
    column: 3
  });

  pass('skips crlf', {
    source: '\r\n',
    newLine: true,
    value: '',
    line: 2,
    index: 2,
    column: 0
  });

  pass('skips crlf before identifier', {
    source: '\r\n foo',
    newLine: true,
    value: 'foo',
    line: 2,
    index: 6,
    column: 4
  });

  pass('skips form feed', {
    source: '\u000C',
    newLine: false,
    value: '',
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips line feeds', {
    source: '\n\n\n\n\n\n\n\n',
    newLine: true,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips carriage returns', {
    source: '\r\r\r\r\r\r\r\r',
    newLine: true,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips Windows newlines', {
    source: '\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n',
    newLine: true,
    index: 16,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips line separators', {
    source: '\u2028\u2028\u2028\u2028\u2028\u2028\u2028\u2028',
    newLine: true,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });

  pass('skips paragraph separators', {
    source: '\u2029\u2029\u2029\u2029\u2029\u2029\u2029\u2029',
    newLine: true,
    index: 8,
    value: '',
    line: 9,
    column: 0
  });
  pass('skips mixed whitespace', {
    source: '    \t \r\n \n\r \v\f\t ',
    newLine: true,
    index: 16,
    value: '',
    line: 4,
    column: 5
  });

  pass('skips single line comments with line feed', {
    source: '  \t // foo bar\n  ',
    newLine: true,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with carriage return', {
    source: '  \t // foo bar\r  ',
    newLine: true,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with Windows newlines', {
    source: '  \t // foo bar\r\n  ',
    newLine: true,
    index: 18,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with line separators', {
    source: '  \t // foo bar\u2028  ',
    newLine: true,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips single line comments with paragraph separators', {
    source: '  \t // foo bar\u2029  ',
    newLine: true,
    index: 17,
    value: '',
    line: 2,
    column: 2
  });

  pass('skips multiple single line comments with line feed', {
    source: '  \t // foo bar\n // baz \n //',
    newLine: true,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with carriage return', {
    source: '  \t // foo bar\r // baz \n //',
    newLine: true,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with Windows newlines', {
    source: '  \t // foo bar\r\n // baz \n //',
    newLine: true,
    index: 28,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with line separators', {
    source: '  \t // foo bar\u2028 // baz \n //',
    newLine: true,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiple single line comments with paragraph separators', {
    source: '  \t // foo bar\u2029 // baz \n //',
    newLine: true,
    index: 27,
    value: '',
    line: 3,
    column: 3
  });

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    newLine: false,
    index: 24,
    value: '',
    line: 1,
    column: 24
  });

  pass('skips multiline comments with line feed', {
    source: '  \t /* foo * /* bar \n */  ',
    newLine: true,
    value: '',
    index: 26,
    line: 2,
    column: 5
  });

  pass('skips multiline comments with carriage return', {
    source: '  \t /* foo * /* bar \r */  ',
    newLine: true,
    value: '',
    index: 26,
    line: 2,
    column: 5
  });

  pass('skips multiline comments with Windows newlines', {
    source: '  \t /* foo * /* bar \r\n */  ',
    newLine: true,
    value: '',
    index: 27,
    line: 2,
    column: 5
  });

  pass('skips multiple multiline comments with carriage return', {
    source: '  \t /* foo bar\r *//* baz*/ \n /**/',
    newLine: true,
    value: '',
    index: 33,
    line: 3,
    column: 5
  });

  pass('skips vertical tab in a string', {
    source: "'\\u000Bstr\\u000Bing\\u000B'",
    value: '\u000bstr\u000bing\u000b',
    newLine: false,
    line: 1,
    index: 26,
    column: 26
  });

  pass('skips form feed in a string - #1', {
    source: "'\\u000Cstr\\u000Cing\\u000C'",
    value: '\fstr\fing\f',
    newLine: false,
    line: 1,
    index: 26,
    column: 26
  });

  pass('skips form feed in a string - #2', {
    source: "'\\fstr\\fing\\f'",
    value: '\fstr\fing\f',
    newLine: false,
    line: 1,
    index: 14,
    column: 14
  });

  pass('skips multiline comment with space - #1', {
    source: '/*\u0020 multi line \u0020 comment \u0020*/',
    value: '',
    newLine: false,
    line: 1,
    index: 28,
    column: 28
  });

  pass('skips multiline comment with no break space - #1', {
    source: '/*\u00A0 multi line \u00A0 comment \u00A0*/',
    value: '',
    newLine: false,
    line: 1,
    index: 28,
    column: 28
  });

  pass('skips multiline comment with no break space - #2', {
    source: '/*\u00A0 multi line \u00A0 comment \u00A0 x = 1;*/',
    value: '',
    newLine: false,
    line: 1,
    index: 35,
    column: 35
  });

  pass('skips multiline comment with space - #2', {
    source: '/*\u0020 multi line \u0020 comment \u0020 x = 1;*/',
    value: '',
    newLine: false,
    line: 1,
    index: 35,
    column: 35
  });

  pass('skips single comment with veritcal tab - #1', {
    source: '//\u000B single line \u000B comment \u000B',
    value: '',
    newLine: false,
    line: 1,
    index: 27,
    column: 27
  });

  pass('skips single comment with veritcal tab - #2', {
    source: '//\u000B single line \u000B comment \u000B x = 1;',
    value: '',
    newLine: false,
    line: 1,
    index: 34,
    column: 34
  });

  pass('skips exotic whitespace', {
    source:
      '\x20\x09\x0B\x0C\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000',
    newLine: false,
    value: '',
    line: 1,
    index: 20,
    column: 20
  });

  pass('skips single line comment with identifier and newline', {
    source: '// foo\n',
    newLine: true,
    value: '',
    index: 7,
    line: 2,
    column: 0
  });
  pass('skips multi line comment with escaped newline', {
    source: '/* \\n \\r \\x0a \\u000a */',
    newLine: false,
    value: '',
    index: 23,
    line: 1,
    column: 23
  });

  pass('skips single line comment with escaped newlines', {
    source: '//\\n \\r \\x0a \\u000a still comment',
    value: '',
    newLine: false,
    index: 33,
    line: 1,
    column: 33
  });

  pass('skips single line comment with paragrap separator', {
    source: '//Single Line Comments\u2029 var =;',
    newLine: true,
    value: 'var',
    index: 27,
    line: 2,
    column: 4
  });

  pass('skips single line comment with Windows newline', {
    source: '// single line comment\u000D',
    newLine: true,
    value: '',
    index: 23,
    line: 2,
    column: 0
  });

  pass('skips multi line comment with carriage return', {
    source: '/*\\rmulti\\rline\\rcomment\\rx = 1;\\r*/',
    newLine: false,
    value: '',
    index: 36,
    line: 1,
    column: 36
  });

  pass('skips multi line comment with carriage return', {
    source: '/*\\rmulti\\rline\\rcomment\\rx = 1;\\r*/',
    newLine: false,
    value: '',
    index: 36,
    line: 1,
    column: 36
  });

  pass('skips single line comment with no break space', {
    source: '//\u00A0 single line \u00A0 comment \u00A0',
    newLine: false,
    value: '',
    index: 27,
    line: 1,
    column: 27
  });

  pass('skips single line comment with form feed', {
    source: '//\u000C single line \u000C comment \u000C',
    newLine: false,
    value: '',
    index: 27,
    line: 1,
    column: 27
  });

  pass('skips single line comment with identifier and newline', {
    source: '// foo\n',
    newLine: true,
    value: '',
    index: 7,
    line: 2,
    column: 0
  });

  pass('skips text after HTML close', {
    source: '\n-->',
    newLine: true,
    value: '',
    index: 4,
    line: 2,
    column: 3
  });

  pass('skips multi line comment with escaped newline', {
    source: '/* \\n \\r \\x0a \\u000a */',
    newLine: false,
    value: '',
    index: 23,
    line: 1,
    column: 23
  });

  // should fail in the parser
  pass('skips nested multi line comment', {
    source: '/* /* */ */',
    newLine: false,
    value: '',
    index: 10,
    line: 1,
    column: 10
  });

  pass('skips single line comment with slash', {
    source: '// /',
    newLine: false,
    value: '',
    index: 4,
    line: 1,
    column: 4
  });

  pass('skips single line comment with malformed escape', {
    source: '//\\unope \\u{nope} \\xno ',
    newLine: false,
    value: '',
    index: 23,
    line: 1,
    column: 23
  });

  pass('skips multiline comments with nothing', {
    source: '  \t /* foo * /* bar */  ',
    newLine: false,
    value: '',
    line: 1,
    index: 24,
    column: 24
  });

  pass('skips before first real token', {
    source: '--> is eol-comment',
    newLine: false,
    value: '',
    line: 1,
    index: 18,
    column: 18
  });

  pass('skips single line comment with form feed', {
    source: '\n-->\nvar y = 37;\n',
    newLine: true,
    value: 'var',
    line: 3,
    index: 8,
    column: 3
  });

  pass('skips mixed whitespace', {
    source: '\t\u000b\u000c\u00a0',
    newLine: false,
    value: '',
    line: 1,
    index: 4,
    column: 4
  });

  pass('skips simple exotic whitespace', {
    source: '\x85',
    newLine: false,
    value: '',
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips simple exotic whitespace', {
    source: '\xA0',
    newLine: false,
    value: '',
    line: 1,
    index: 1,
    column: 1
  });

  pass('skips complex exotic whitespace', {
    source: '\t\x0B\x0C\xA0\u1680\u2000\u200A\u202F\u205F\u3000',
    newLine: false,
    value: '',
    line: 1,
    index: 10,
    column: 10
  });

  pass('skips multiple comments preceding HTMLEndComment', {
    source: '/* MLC \n */ /* SLDC */ --> is eol-comment\nvar y = 37;\n',
    newLine: true,
    value: 'var',
    line: 3,
    index: 45,
    column: 3
  });
});
