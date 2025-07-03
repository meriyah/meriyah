import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Miscellaneous - ASI', () => {
  for (const arg of [
    '{ 1 2 } 3',
    '{} * 1',
    '({};) * 1',
    'if (false) x = 1 else x = -1',
    outdent`
      var x = 0;
      if (false) {x = 1};
      else x = -1
    `,
    outdent`
      var a=1,b=2,c=3,d;
      if(a>b)
      else c=d
    `,
    '{} * 1',
    outdent`
      for(
      ;) {
        break;
      }
    `,
    outdent`
      for(
          false
      ) {
        break;
      }
    `,
    outdent`
      for(
          false
          false
          false
      ) {
        break;
      }
    `,
    outdent`
      do
      while (false)
    `,
    outdent`
      do {};
      while (false)
    `,
    outdent`
      var x=0, y=0;
      var z=
      x
      ++
      ++
      y
    `,
    outdent`
      var x = 0;
      if (false) x = 1 else x = -1
    `,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }

  fail('Expressions - ASI (fail)', [
    'var x=0, y=0;\nvar z=\nx\n++\n++\ny',
    'for(\nfalse\n) {\nbreak;\n}',
    'for(false;false;;false) { break; }',
    '\n while(false)',
    'do {}; \n while(false)',
    'for header is (false \n false \n)',
    '{} * 1',
    'if (false) x = 1 else x = -1',
    outdent`
      try {
        throw
        1;
      } catch(e) {
      }
    `,
    outdent`
      var x = 0;
      x
      ++;
    `,
    outdent`
      var x = 1;
      x
      --;
    `,
    outdent`
      for(;
      ) {
        break;
      }
    `,
    outdent`
      for(
          false
      ;) {
        break;
      }
    `,
    outdent`
      for(
          ;
      ) {
        break;
      }
    `,
    outdent`
      for(
      ) {
        break;
      }
    `,
    outdent`
      for(false
          false
      ) {
        break;
      }
    `,
    outdent`
      do
      while (false)
    `,
  ]);

  pass('Miscellaneous - ASI', [
    // Acorn issue: https://github.com/acornjs/acorn/issues/775
    { code: ';;1;;1;;1', options: { ranges: true } },
    { code: '"foo"\nx', options: { raw: true, ranges: true } },
    { code: "function f(){\n'foo';\n}", options: { raw: true } },
    { code: 'function f(){\n"foo"\n}', options: { raw: true } },
    { code: '"ignore me"\n++x', options: { raw: true } },
    { code: '("use strict"); foo = 42;', options: { raw: true } },
    { code: '("use strict"); eval = 42;', options: { raw: true } },
    { code: '"USE STRICT";  var public = 1;', options: { raw: true } },
    { code: '() => { "use strict"; }', options: { raw: true } },
    { code: 'function wrap() { "use asm"; "use strict"; foo }', options: { raw: true, ranges: true } },
    { code: '{ "use strict"; }', options: { raw: true } },
    { code: 'function a() { "use strict" } "use strict"; foo;', options: { raw: true } },
    { code: 'function f(){ "Esprima uses directives"; "use strict";}', options: { raw: true } },
    { code: 'function f(){ 123; "use strict";}', options: { raw: true } },
    { code: 'function f(){"use strict";}', options: { raw: true } },
    { code: '+function f(){"use strict";}', options: { raw: true } },
    { code: '({x:function(){"use strict";}})', options: { raw: true } },
    { code: 'function f(x){"use strict";}', options: { raw: true } },
    { code: 'function f(x, y){"use strict";}', options: { raw: true } },
  ]);
});
