import { describe, expect, test } from 'vitest';
import { isParseError, parse, type ParseError } from '../src/meriyah';

describe('ParseError', () => {
  let parseError: ParseError;

  try {
    parse('invalid code');
  } catch (error) {
    parseError = error as ParseError;
  }

  test('isParseError', () => {
    expect(isParseError(parseError)).toBe(true);
    expect(isParseError(parseError.constructor)).toBe(false);
    expect(isParseError(new Error('message'))).toBe(false);
    expect(isParseError(1)).toBe(false);
  });

  test('ParseError properties', () => {
    expect({ ...parseError, message: parseError.message }).toMatchInlineSnapshot(`
      {
        "description": "Unexpected token: 'identifier'",
        "end": 12,
        "loc": {
          "end": {
            "column": 12,
            "line": 1,
          },
          "start": {
            "column": 8,
            "line": 1,
          },
        },
        "message": "[1:8-1:12]: Unexpected token: 'identifier'",
        "range": [
          8,
          12,
        ],
        "start": 8,
      }
    `);
  });
});
