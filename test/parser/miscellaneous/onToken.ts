import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';
import { Token } from 'token';

describe('Miscellaneous - onToken', () => {
  it('tokenize braces using array', () => {
    let tokens: Token[] = [];
    parseScript('{}', {
      onToken: tokens,
      loc: true
    });
    t.deepEqual(tokens, [
      {
        end: 1,
        start: 0,
        token: 'Punctuator'
      },
      {
        end: 2,
        start: 1,
        token: 'Punctuator'
      }
    ]);
  });

  it('tokenize boolean using function', () => {
    let called = false;
    parseScript('false', {
      onToken: function(token: string, start?: number, end?: number) {
        t.deepEqual(token, 'BooleanLiteral');
        t.deepEqual(start, 0);
        t.deepEqual(end, 5);
        called = true;
      },
      loc: true
    });
    t.deepEqual(called, true);
  });
});
