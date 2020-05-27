import { Context } from '../../../src/common';
import { pass } from '../../test-utils';

describe('Statements - Empty', () => {
  pass('Statements - Empty (pass)', [
    [
      ';;;;;;;;',
      Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 8,
        range: [0, 8],
        body: [
          {
            type: 'EmptyStatement',
            start: 0,
            end: 1,
            range: [0, 1]
          },
          {
            type: 'EmptyStatement',
            start: 1,
            end: 2,
            range: [1, 2]
          },
          {
            type: 'EmptyStatement',
            start: 2,
            end: 3,
            range: [2, 3]
          },
          {
            type: 'EmptyStatement',
            start: 3,
            end: 4,
            range: [3, 4]
          },
          {
            type: 'EmptyStatement',
            start: 4,
            end: 5,
            range: [4, 5]
          },
          {
            type: 'EmptyStatement',
            start: 5,
            end: 6,
            range: [5, 6]
          },
          {
            type: 'EmptyStatement',
            start: 6,
            end: 7,
            range: [6, 7]
          },
          {
            type: 'EmptyStatement',
            start: 7,
            end: 8,
            range: [7, 8]
          }
        ],
        sourceType: 'script'
      }
    ]
  ]);
});
