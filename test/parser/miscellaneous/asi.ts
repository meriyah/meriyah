import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - ASI', () => {
  for (const arg of [
    '{ 1 2 } 3',
    '{} * 1',
    '({};) * 1',
    'if (false) x = 1 else x = -1',
    `var x = 0;
    if (false) {x = 1};
    else x = -1`,
    `var a=1,b=2,c=3,d;
    if(a>b)
    else c=d`,
    `{} * 1`,
    `for(
      ;) {
        break;
      }`,
    `for(
        false
    ) {
      break;
    }`,
    `for(
        false
        false
        false
    ) {
      break;
    }`,
    `do
      while (false)`,
    `do {};
      while (false)`,
    `
      var x=0, y=0;
      var z=
      x
      ++
      ++
      y`,
    `var x = 0;
      if (false) x = 1 else x = -1`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.None);
      });
    });

    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  fail('Expressions - ASI (fail)', [
    [`var x=0, y=0;\nvar z=\nx\n++\n++\ny`, Context.None],
    [`for(\nfalse\n) {\nbreak;\n}`, Context.None],
    [`for(false;false;;false) { break; }`, Context.None],
    [`\n while(false)`, Context.None],
    [`do {}; \n while(false)`, Context.None],
    [`for header is (false \n false \n)`, Context.None],
    ['{} * 1', Context.None],
    ['if (false) x = 1 else x = -1', Context.None],
    [
      `try {
      throw
      1;
    } catch(e) {
    }`,
      Context.None,
    ],
    [
      `var x = 0;
    x
    ++;`,
      Context.None,
    ],
    [
      `var x = 1;
    x
    --;`,
      Context.None,
    ],
    [
      `for(;
      ) {
        break;
      }`,
      Context.None,
    ],
    [
      `for(
      false
  ;) {
    break;
  }`,
      Context.None,
    ],
    [
      `for(
      ;
  ) {
    break;
  }`,
      Context.None,
    ],
    [
      `for(
      ) {
        break;
      }`,
      Context.None,
    ],
    [
      `for(false
      false
  ) {
    break;
  }`,
      Context.None,
    ],
    [
      `do
    while (false)`,
      Context.None,
    ],
  ]);

  pass('Miscellaneous - ASI', [
    // Acorn issue: https://github.com/acornjs/acorn/issues/775
    { code: `;;1;;1;;1`, options: { ranges: true } },
    { code: '"foo"\nx', options: { raw: true, ranges: true } },
    { code: `function f(){\n'foo';\n}`, options: { raw: true } },
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
