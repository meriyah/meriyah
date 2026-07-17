import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';
import { pass } from '../../test-utils.ts';

describe('Miscellaneous - Literal', () => {
  for (const text of [
    String.raw`('\u{0000000000F8}')`,
    String.raw`('\u{00F8}')`,
    String.raw`('\7a')`,
    String.raw`('\5a')`,
    String.raw`('\2111')`,
    String.raw`('\1')`,
    "('\u202a')",
    "('\\\u2028')",
    "('\\\n')",
    String.raw`("\\\"")`,
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { next: true, webcompat: true });
      });
    });
  }

  for (const text of [
    String.raw`'use strict'; ('\1')`,
    String.raw`'use strict'; ('\4')`,
    String.raw`'use strict'; ('\11')`,
    String.raw`'use strict'; ('\000')`,
    String.raw`'use strict'; ('\00')`,
    String.raw`'use strict'; ('\123')`,
    String.raw`('\x')`,
    '(")',
    String.raw`\0009`,
    String.raw`("\u{FFFFFFF}")`,
    "'",
    "(')",
    "('\n')",
  ]) {
    it(text, () => {
      t.throws(() => {
        parseSource(text);
      });
    });

    it(text, () => {
      t.throws(() => {
        parseSource(text, { next: true, webcompat: true });
      });
    });
  }

  pass('Miscellaneous - Literal (pass)', [String.raw`('\\\'')`, '("x")', String.raw`('\0')`, String.raw`('\7a')`]);
});
