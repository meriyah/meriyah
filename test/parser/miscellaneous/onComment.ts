import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';

describe('Miscellaneous - onComment', () => {
  it('should extract single line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment', {
        ranges: true,
        onComment: (type: any, body: any, start?: number, end?: number) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(body, ' Single line comment');
          t.equal(start, 0);
          t.equal(end, 22);
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22]
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract single line comment with trailing new line', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment\n', {
        ranges: true,
        onComment: (type: any, body: any, start?: number, end?: number) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(body, ' Single line comment');
          t.equal(start, 0);
          t.equal(end, 22);
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23]
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract multiline line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('/* Multi line comment */', {
        onComment: (type: any, body: any) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(body, ' Multi line comment ');
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program'
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract multiline line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('/* Multi line comment */', {
        ranges: true,
        onComment: (type: any, body: any, start: any, end: any) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(body, ' Multi line comment ');
          t.deepEqual(start, 0);
          t.deepEqual(end, 24);
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        start: 0,
        end: 24,
        range: [0, 24],
        type: 'Program'
      }
    );
    t.equal(onCommentCount, 1);
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
        start: 0,
        end: 24,
        range: [0, 24],
        type: 'MultiLine',
        value: ' Multi line comment '
      }
    ]);
  });

  it('should extract multiple multiline line comment in array with ranges', () => {
    const arr: any[] = [];
    parseScript('/* a */ function /*b*/foo(/*c*//*d*/) { /* Multi line comment */ } // The end', {
      ranges: true,
      onComment: arr
    });
    t.deepEqual(arr, [
      {
        start: 0,
        end: 7,
        range: [0, 7],
        type: 'MultiLine',
        value: ' a '
      },
      {
        start: 17,
        end: 22,
        range: [17, 22],
        type: 'MultiLine',
        value: 'b'
      },
      {
        start: 26,
        end: 31,
        range: [26, 31],
        type: 'MultiLine',
        value: 'c'
      },
      {
        start: 31,
        end: 36,
        range: [31, 36],
        type: 'MultiLine',
        value: 'd'
      },
      {
        start: 40,
        end: 64,
        range: [40, 64],
        type: 'MultiLine',
        value: ' Multi line comment '
      },
      {
        start: 67,
        end: 77,
        range: [67, 77],
        type: 'SingleLine',
        value: ' The end'
      }
    ]);
  });

  it('should extract html comments in array', () => {
    const arr: any[] = [];
    parseScript('<!--comment #1\n--> comment #2', {
      ranges: true,
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        type: 'HTMLOpen',
        value: 'comment #1',
        start: 0,
        end: 14,
        range: [0, 14]
      },
      {
        type: 'HTMLClose',
        value: ' comment #2',
        start: 14,
        end: 29,
        range: [14, 29]
      }
    ]);
  });
});
