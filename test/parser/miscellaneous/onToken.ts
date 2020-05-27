import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';
import { Token } from '../../../src/token';

describe('Miscellaneous - onToken', () => {
  it('tokenize braces using array', () => {
    const tokens: Token[] = [];
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
    let onTokenCount = 0;
    parseScript('// c\nfalse', {
      onToken: function(token: string, start?: number, end?: number) {
        t.deepEqual(token, 'BooleanLiteral');
        t.deepEqual(start, 5);
        t.deepEqual(end, 10);
        onTokenCount++;
      },
      loc: true
    });
    t.equal(onTokenCount, 1);
  });
});
