import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parse } from '../../../src/meriyah';
import { pass } from '../../test-utils';

describe('Miscellaneous - loc', () => {
  pass('Miscellaneous - loc (pass)', [
    { code: '[,,x]', options: { ranges: true, loc: true } },
    { code: '[50..foo] = x', options: { ranges: true, loc: true } },
    { code: 'a={"b":c=d}', options: { ranges: true, loc: true } },
    /*  [
            `1 -2 / 4`,
            Context.OptionsRanges | Context.OptionsLoc,
            {
              "type": "Program",
              "start": 0,
              "end": 8,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 0
                },
                "end": {
                  "line": 1,
                  "column": 8
                }
              },
              "body": [
                {
                  "type": "ExpressionStatement",
                  "start": 0,
                  "end": 8,
                  "loc": {
                    "start": {
                      "line": 1,
                      "column": 0
                    },
                    "end": {
                      "line": 1,
                      "column": 8
                    }
                  },
                  "expression": {
                    "type": "BinaryExpression",
                    "start": 0,
                    "end": 8,
                    "loc": {
                      "start": {
                        "line": 1,
                        "column": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 8
                      }
                    },
                    "left": {
                      "type": "Literal",
                      "start": 0,
                      "end": 1,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 0
                        },
                        "end": {
                          "line": 1,
                          "column": 1
                        }
                      },
                      "value": 1
                    },
                    "operator": "-",
                    "right": {
                      "type": "BinaryExpression",
                      "start": 3,
                      "end": 8,
                      "loc": {
                        "start": {
                          "line": 1,
                          "column": 3
                        },
                        "end": {
                          "line": 1,
                          "column": 8
                        }
                      },
                      "left": {
                        "type": "Literal",
                        "start": 3,
                        "end": 4,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 3
                          },
                          "end": {
                            "line": 1,
                            "column": 4
                          }
                        },
                        "value": 2
                      },
                      "operator": "/",
                      "right": {
                        "type": "Literal",
                        "start": 7,
                        "end": 8,
                        "loc": {
                          "start": {
                            "line": 1,
                            "column": 7
                          },
                          "end": {
                            "line": 1,
                            "column": 8
                          }
                        },
                        "value": 4
                      }
                    }
                  }
                }
              ],
              "sourceType": "script"
            }], */
    { code: 'x = {y}', options: { ranges: true, loc: true } },
    { code: '0, [ x = y ] = [];', options: { ranges: true, loc: true } },
    { code: 'of = 42', options: { ranges: true, loc: true } },
    { code: 'a *= b', options: { ranges: true, loc: true } },
    { code: '(2[x,x],x)>x', options: { ranges: true, loc: true } },
    { code: 'a&&(b=c)&&(d=e)', options: { ranges: true, loc: true } },
    { code: 'x = {...y, b}', options: { ranges: true, loc: true } },
    { code: 'x = {...[a, b]}', options: { ranges: true, loc: true } },
    { code: '[,]', options: { ranges: true, loc: true } },
  ]);

  it('Miscellaneous - loc (different line endings)', () => {
    const sourceLF =
      '// Single line comment\n// Single line comment\n// Single line comment\n// Single line comment\nfunction handleAutocomplete() {\n   var prp = this.props; // some error here\n\n   for(let xa=0; xa<100; xa++) {;}\n   }';
    const sourceCRLF = sourceLF.replace(/\n/g, '\r\n');
    t.deepEqual(
      parse(sourceLF, {
        loc: true,
      }),
      parse(sourceCRLF, {
        loc: true,
      }),
    );
  });
});
