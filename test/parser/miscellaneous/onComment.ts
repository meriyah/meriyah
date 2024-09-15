import * as t from 'assert';
import { SourceLocation } from '../../../src/estree';
import { parseScript } from '../../../src/meriyah';

describe('Miscellaneous - onComment', () => {
  it('should extract single line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment', {
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(value, ' Single line comment');
          t.equal(start, 0);
          t.equal(end, 22);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 22 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 22 }
        }
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract single line empty comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('//\n', {
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(value, '');
          t.equal(start, 0);
          t.equal(end, 2);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 3,
        range: [0, 3],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 2, column: 0 }
        }
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract single line comment with trailing new line', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('// Single line comment\n', {
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(value, ' Single line comment');
          t.equal(start, 0);
          t.equal(end, 22);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 22 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 23,
        range: [0, 23],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 2, column: 0 }
        }
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract single line comment with trailing new line and leading new line', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('a;\n// Single line comment\n', {
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'SingleLine');
          t.deepEqual(value, ' Single line comment');
          t.equal(start, 3);
          t.equal(end, 25);
          t.deepEqual(loc, {
            start: { line: 2, column: 0 },
            end: { line: 2, column: 22 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [
          {
            end: 2,
            expression: {
              end: 1,
              loc: {
                end: {
                  column: 1,
                  line: 1
                },
                start: {
                  column: 0,
                  line: 1
                }
              },
              name: 'a',
              range: [0, 1],
              start: 0,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 2,
                line: 1
              },
              start: {
                column: 0,
                line: 1
              }
            },
            range: [0, 2],
            start: 0,
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 26,
        range: [0, 26],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 3, column: 0 }
        }
      }
    );
    t.equal(onCommentCount, 1);
  });

  it('should extract multiline line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('/* Multi line comment */', {
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(value, ' Multi line comment ');
          t.equal(start, 0);
          t.equal(end, 24);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 24 }
          });
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

  it('should extract empty multiline line comment', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('/**/', {
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(value, '');
          t.equal(start, 0);
          t.equal(end, 4);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          });
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
      parseScript('a;\n/* Multi line comment */\nb;\n', {
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'MultiLine');
          t.deepEqual(value, ' Multi line comment ');
          t.deepEqual(start, 3);
          t.deepEqual(end, 27);
          t.deepEqual(loc, {
            start: { line: 2, column: 0 },
            end: { line: 2, column: 24 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [
          {
            end: 2,
            expression: {
              end: 1,
              loc: {
                end: {
                  column: 1,
                  line: 1
                },
                start: {
                  column: 0,
                  line: 1
                }
              },
              name: 'a',
              range: [0, 1],
              start: 0,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 2,
                line: 1
              },
              start: {
                column: 0,
                line: 1
              }
            },
            range: [0, 2],
            start: 0,
            type: 'ExpressionStatement'
          },
          {
            end: 30,
            expression: {
              end: 29,
              loc: {
                end: {
                  column: 1,
                  line: 3
                },
                start: {
                  column: 0,
                  line: 3
                }
              },
              name: 'b',
              range: [28, 29],
              start: 28,
              type: 'Identifier'
            },
            loc: {
              end: {
                column: 2,
                line: 3
              },
              start: {
                column: 0,
                line: 3
              }
            },
            range: [28, 30],
            start: 28,
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        start: 0,
        end: 31,
        range: [0, 31],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 4, column: 0 }
        },
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

  it('should extract multiple multiline line comment in array with ranges and loc', () => {
    const arr: any[] = [];
    parseScript('/* a */ function /*b*/foo(/*c*//*d*/) { /* Multi line comment */ } // The end', {
      ranges: true,
      loc: true,
      onComment: arr
    });
    t.deepEqual(arr, [
      {
        start: 0,
        end: 7,
        range: [0, 7],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 7 }
        },
        type: 'MultiLine',
        value: ' a '
      },
      {
        start: 17,
        end: 22,
        range: [17, 22],
        loc: {
          start: { line: 1, column: 17 },
          end: { line: 1, column: 22 }
        },
        type: 'MultiLine',
        value: 'b'
      },
      {
        start: 26,
        end: 31,
        range: [26, 31],
        loc: {
          start: { line: 1, column: 26 },
          end: { line: 1, column: 31 }
        },
        type: 'MultiLine',
        value: 'c'
      },
      {
        start: 31,
        end: 36,
        range: [31, 36],
        loc: {
          start: { line: 1, column: 31 },
          end: { line: 1, column: 36 }
        },
        type: 'MultiLine',
        value: 'd'
      },
      {
        start: 40,
        end: 64,
        range: [40, 64],
        loc: {
          start: { line: 1, column: 40 },
          end: { line: 1, column: 64 }
        },
        type: 'MultiLine',
        value: ' Multi line comment '
      },
      {
        start: 67,
        end: 77,
        range: [67, 77],
        loc: {
          start: { line: 1, column: 67 },
          end: { line: 1, column: 77 }
        },
        type: 'SingleLine',
        value: ' The end'
      }
    ]);
  });

  it('should extract html comments in array', () => {
    const arr: any[] = [];
    parseScript('<!--comment #1\n--> comment #2', {
      ranges: true,
      loc: true,
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        type: 'HTMLOpen',
        value: 'comment #1',
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 14 }
        }
      },
      {
        type: 'HTMLClose',
        value: ' comment #2',
        start: 14,
        end: 29,
        range: [14, 29],
        loc: {
          start: { line: 1, column: 14 },
          end: { line: 2, column: 14 }
        }
      }
    ]);
  });

  it('should extract htmlclose comment on first line', () => {
    const arr: any[] = [];
    parseScript('--> comment #2\n', {
      ranges: true,
      loc: true,
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        type: 'HTMLClose',
        value: ' comment #2',
        start: 0,
        end: 14,
        range: [0, 14],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 14 }
        }
      }
    ]);
  });

  it('should extract htmlclose comment', () => {
    const arr: any[] = [];
    parseScript('a;\n--> comment #2\n', {
      ranges: true,
      loc: true,
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        type: 'HTMLClose',
        value: ' comment #2',
        start: 2,
        end: 17,
        range: [2, 17],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 2, column: 14 }
        }
      }
    ]);
  });

  it('should extract htmlclose comment after multiline comment', () => {
    const arr: any[] = [];
    parseScript('/*\na\n*/\n--> comment #2\n', {
      ranges: true,
      loc: true,
      onComment: arr,
      webcompat: true
    });
    t.deepEqual(arr, [
      {
        start: 0,
        end: 7,
        range: [0, 7],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 3, column: 2 }
        },
        type: 'MultiLine',
        value: '\na\n'
      },
      {
        type: 'HTMLClose',
        value: ' comment #2',
        start: 7,
        end: 22,
        range: [7, 22],
        loc: {
          start: { line: 3, column: 2 },
          end: { line: 4, column: 14 }
        }
      }
    ]);
  });

  it('should extract hashbang comment with next flag', () => {
    let onCommentCount = 0;
    t.deepEqual(
      parseScript('#!/usr/bin/env node\n"use strict";\n', {
        next: true,
        ranges: true,
        loc: true,
        onComment: (type: string, value: string, start: number, end: number, loc: SourceLocation) => {
          t.deepEqual(type, 'HashbangComment');
          t.deepEqual(value, '/usr/bin/env node');
          t.equal(start, 0);
          t.equal(end, 19);
          t.deepEqual(loc, {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 19 }
          });
          onCommentCount++;
        }
      }),
      {
        body: [
          {
            end: 33,
            expression: {
              end: 32,
              loc: {
                end: {
                  column: 12,
                  line: 2
                },
                start: {
                  column: 0,
                  line: 2
                }
              },
              range: [20, 32],
              start: 20,
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict',
            loc: {
              end: {
                column: 13,
                line: 2
              },
              start: {
                column: 0,
                line: 2
              }
            },
            range: [20, 33],
            start: 20,
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program',
        start: 0,
        end: 34,
        range: [0, 34],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 3, column: 0 }
        }
      }
    );
    t.equal(onCommentCount, 1);
  });
});
