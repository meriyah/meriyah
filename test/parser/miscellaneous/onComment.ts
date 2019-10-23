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
        end: 24,
        sourceType: 'script',
        start: 0,
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
        end: 24,
        start: 2,
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
        end: 7,
        start: 2,
        type: 'MultiLine',
        value: ' a '
      },
      {
        end: 22,
        start: 19,
        type: 'MultiLine',
        value: 'b'
      },
      {
        end: 31,
        start: 28,
        type: 'MultiLine',
        value: 'c'
      },
      {
        end: 36,
        start: 33,
        type: 'MultiLine',
        value: 'd'
      },
      {
        end: 64,
        start: 42,
        type: 'MultiLine',
        value: ' Multi line comment '
      },
      {
        end: 77,
        start: 69,
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
