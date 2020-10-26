import * as t from 'assert';
import { SourceLocation } from '../../../src/estree';
import { parseScript } from '../../../src/meriyah';
import { Token } from '../../../src/token';

describe('Miscellaneous - onToken', () => {
  it('tokenize braces using array', () => {
    const tokens: Token[] = [];
    parseScript('{}', {
      onToken: tokens
    });
    t.deepEqual(tokens, [
      {
        token: 'Punctuator'
      },
      {
        token: 'Punctuator'
      }
    ]);
  });

  it('tokenize braces using array with ranges', () => {
    const tokens: Token[] = [];
    parseScript('{}', {
      onToken: tokens,
      ranges: true
    });
    t.deepEqual(tokens, [
      {
        end: 1,
        start: 0,
        range: [0, 1],
        token: 'Punctuator'
      },
      {
        end: 2,
        start: 1,
        range: [1, 2],
        token: 'Punctuator'
      }
    ]);
  });

  it('tokenize braces using array with ranges and loc', () => {
    const tokens: Token[] = [];
    parseScript('{}', {
      onToken: tokens,
      ranges: true,
      loc: true
    });
    t.deepEqual(tokens, [
      {
        end: 1,
        start: 0,
        range: [0, 1],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 1 }
        },
        token: 'Punctuator'
      },
      {
        end: 2,
        start: 1,
        range: [1, 2],
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 2 }
        },
        token: 'Punctuator'
      }
    ]);
  });

  it('tokenize boolean using function', () => {
    let onTokenCount = 0;
    parseScript('// c\nfalse', {
      onToken: function (token: string, start: number, end: number, loc: SourceLocation) {
        t.deepEqual(token, 'BooleanLiteral');
        t.deepEqual(start, 5);
        t.deepEqual(end, 10);
        t.deepEqual(loc, {
          start: { line: 2, column: 0 },
          end: { line: 2, column: 5 }
        });
        onTokenCount++;
      },
      loc: true
    });
    t.equal(onTokenCount, 1);
  });
});
