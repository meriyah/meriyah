import { describe } from 'vitest';
import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Statements - Throw', () => {
  const inValids: [string, Context][] = [
    [
      `throw
    x;`,
      Context.None,
    ],
  ];

  fail('Statements - Throw', inValids);

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
