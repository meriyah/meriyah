import { outdent } from 'outdent';
import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Statements - Throw', () => {
  fail('Statements - Throw', [
    outdent`
      throw
      x;
    `,
  ]);

  pass('Statements - Throw (pass)', [
    'throw ((((((d = null)))) ? (((--r))) : ((/|[--]*||[^\u2B7a+-?]+|(?!)/giy))));',
    'throw /(?=[^\x4f-\xF5(-)])/imy',
    { code: 'throw foo;', options: { ranges: true } },
    'throw foo',
    'throw 12',
    'throw x * y',
    'throw foo;',
  ]);
});
