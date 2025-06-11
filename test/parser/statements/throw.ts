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
    ['throw ((((((d = null)))) ? (((--r))) : ((/|[--]*||[^\u2B7a+-?]+|(?!)/giy))));', Context.None],
    ['throw /(?=[^\x4f-\xF5(-)])/imy', Context.None],
    ['throw foo;', Context.OptionsRanges],
    ['throw foo', Context.None],
    ['throw 12', Context.None],
    ['throw x * y', Context.None],
    ['throw foo;', Context.None],
  ]);
});
