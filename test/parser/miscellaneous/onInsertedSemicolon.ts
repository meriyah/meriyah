import * as t from 'assert';
import { parseScript } from '../../../src/meriyah';

describe('Miscellaneous - oninsertedSemicolon', () => {
  it('invokes the callback when automatic semicolon insertion occurs', () => {
    const semicolons: number[] = [];
    const lines = ['"use strict"', 'self.a;', 'self.b'];
    const input = lines.join('\n');
    parseScript(input, {
      onInsertedSemicolon: (pos) => semicolons.push(pos)
    });
    t.deepEqual(semicolons, [lines[0].length, input.length]);
  });
});
