import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';

describe('Miscellaneous - onComment', () => {
  it('should extract single line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment', {
        onComment: (type: any, body: any) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(body, ' Single line comment');
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

  it('should extract single line comment with trailing new line', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment\n', {
        onComment: (type: any, body: any) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(body, ' Single line comment\n');
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
          t.deepEqual(start, 2);
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
        start: 2,
        end: 24,
        range: [2, 24],
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
        start: 2,
        end: 7,
        range: [2, 7],
        type: 'MultiLine',
        value: ' a '
      },
      {
        start: 19,
        end: 22,
        range: [19, 22],
        type: 'MultiLine',
        value: 'b'
      },
      {
        start: 28,
        end: 31,
        range: [28, 31],
        type: 'MultiLine',
        value: 'c'
      },
      {
        start: 33,
        end: 36,
        range: [33, 36],
        type: 'MultiLine',
        value: 'd'
      },
      {
        start: 42,
        end: 64,
        range: [42, 64],
        type: 'MultiLine',
        value: ' Multi line comment '
      },
      {
        start: 69,
        end: 77,
        range: [69, 77],
        type: 'SingleLine',
        value: ' The end'
      }
    ]);
  });

  it('should extract html comments in array', () => {
    const arr: any[] = [];
    parseScript('<!--comment #1\n--> comment #2', {
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        type: 'HTMLOpen',
        value: 'comment #1\n'
      },
      {
        type: 'HTMLClose',
        value: ' comment #2'
      }
    ]);
  });
});
