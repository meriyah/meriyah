import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';

describe('Expressions - API', () => {
  it('should extract single line comment', () => {
    t.deepEqual(
      parseScript('// Single line comment', {
        onComment: (type: any, body: any) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(body, ' Single line comment');
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program'
      }
    );
  });

  it('should extract multiline line comment', () => {
    t.deepEqual(
      parseScript('/* Multi line comment */', {
        onComment: (type: any, body: any) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(body, ' Multi line comment ');
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program'
      }
    );
  });

  it('should extract multiline line comment', () => {
    t.deepEqual(
      parseScript('/* Multi line comment */', {
        ranges: true,
        onComment: (type: any, body: any, start: any, end: any) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(body, ' Multi line comment ');
          t.deepEqual(start, 2);
          t.deepEqual(end, 24);
        }
      }),
      {
        body: [],
        end: 24,
        sourceType: 'script',
        start: 0,
        type: 'Program'
      }
    );
  });

  it('should extract multiline line comment in array', () => {
    const arr: any[] = [];
    parseScript('/* Multi line comment */', {
      onComment: arr
    });
    t.deepEqual(arr, [
      {
        type: 'MultiLine',
        value: ' Multi line comment '
      }
    ]);
  });

  it('should extract multiline line comment in array with ranges', () => {
    const arr: any[] = [];
    parseScript('/* Multi line comment */', {
      ranges: true,
      onComment: arr
    });
    t.deepEqual(arr, [
      {
        end: 24,
        start: 2,
        type: 'MultiLine',
        value: ' Multi line comment '
      }
    ]);
  });
});
