import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - oninsertedSemicolon', () => {
  it('invokes the callback when automatic semicolon insertion occurs', () => {
    const semicolons: number[] = [];
    const lines = ['"use strict"', 'self.a;', 'self.b'];
    const input = lines.join('\n');
    parseSource(input, {
      onInsertedSemicolon: (pos) => semicolons.push(pos),
    });
    t.deepEqual(semicolons, [lines[0].length, input.length]);
  });
});
