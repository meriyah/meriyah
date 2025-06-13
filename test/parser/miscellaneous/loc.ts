import * as t from 'node:assert/strict';
import { Context } from '../../../src/common';
import { pass } from '../../test-utils';
import { parse } from '../../../src/meriyah';

describe('Miscellaneous - loc', () => {
  pass('Miscellaneous - loc (pass)', [
    [`[,,x]`, Context.OptionsRanges | Context.OptionsLoc],
    [`[50..foo] = x`, Context.OptionsRanges | Context.OptionsLoc],
    [`a={"b":c=d}`, Context.OptionsRanges | Context.OptionsLoc],
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
    [`x = {y}`, Context.OptionsRanges | Context.OptionsLoc],
    [`0, [ x = y ] = [];`, Context.OptionsRanges | Context.OptionsLoc],
    [`of = 42`, Context.OptionsRanges | Context.OptionsLoc],
    [`a *= b`, Context.OptionsRanges | Context.OptionsLoc],
    [`(2[x,x],x)>x`, Context.OptionsRanges | Context.OptionsLoc],
    [`a&&(b=c)&&(d=e)`, Context.OptionsRanges | Context.OptionsLoc],
    [`x = {...y, b}`, Context.OptionsRanges | Context.OptionsLoc],
    [`x = {...[a, b]}`, Context.OptionsRanges | Context.OptionsLoc],
    [`[,]`, Context.OptionsRanges | Context.OptionsLoc],
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
