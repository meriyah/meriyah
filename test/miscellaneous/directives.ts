import { Context } from '../../src/common';
import { pass, fail } from '../test-utils';
import * as t from 'assert';
import { parseSource } from '../../src/parser';

describe('Miscellaneous - Directives', () => {
  for (const arg of [
    '"\\1;" "use strict";',
    '"use strict"; function f(){"\\1";}',
    '"\\1;" "use strict"; null',
    '"use strict"; with (a) b = c;',
    '"use strict"; "\\1;"',
    '"use strict"; "\\1;" null',
    '"random\\x0\nnewline"',
    '"random\\u\nnewline"',
    '"random\\u0\nnewline"',
    '"random\\ua\u2029newline"',
    '"random\\ua\rnewline"',
    '"random\\u0a\nnewline"',
    '"random\\u000\nnewline"',
    '"random\\u00a\nnewline"',
    '"random\\u{0\nnewline"',
    '"random\\u{a\nnewline"',
    "'random\\x foo'",
    '"random\\u{a\rnewline"',
    "'random\\u foo'",
    "'random\\u0 foo'",
    "'random\\u00 foo'",
    "'random\\u0a foo'",
    "'random\\x0\\ foo'",
    "'random\\ua\\ foo'",
    "'random\\x0\\ foo'",
    "'random\\u0a\\ foo'",
    "'random\\xx foo'",
    "'random\\u00a\\ foo'",
    "'random\\uax foo'",
    "'random\\u0au foo'",
    'function foo() { "use strict"; with (a) b = c; }',
    '"use strict"; function foo() { with (a) b = c; }',
    //'"use strict"; function hello() { "\\000"; }',
    //'"use strict"; function hello() { "\\00"; }',
    //'"use strict"; function hello() { "\\0123"; }',
    //'function hello() { "use strict"; "\\000"; }',
    //'function hello() { "use strict"; "\\00"; }',
    //'function hello() { "use strict"; "\\0123"; }',
    //'function hello("\\000008") { "use strict"; }',
    ` function fun() {
                "use strict";
                       var public = 1;
            }`
  ]) {
    it(`/* comment in front */ ${arg}`, () => {
      t.throws(() => {
        parseSource(`/* comment in front */ ${arg}`, undefined, Context.None);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg} }`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    '("use strict")',
    '"\\n\\r\\t\\v\\b\\f\\\\\\\'\\"\\0"',
    '"use some future directive"',
    '"use some future directive";',
    '"use some future directive"; "use strict";',
    '"Hello\\312World"',
    '"use strict"',
    "'use\\x20strict'",
    '"use\\x20strict"',
    "'use asm'",
    "'use asm'; 'use strict'",
    "'use asm' \n 'use strict'",
    '"use asm" \n "use strict"',
    "'use asm' \r 'use strict'",
    '"use asm" \r "use strict"',
    "'use asm' \r\n 'use strict'",
    '"use asm" \r\n "use strict"',
    "'use asm' \u2028 'use strict'",
    '"use asm" \u2028 "use strict"',
    "'use asm' \u2029 'use strict'",
    '"use asm" \u2029 "use strict"',
    'function foo() { "use \\u0020strict"; with (a) b = c; }',
    '"use \\u0020strict"; function foo() { with (a) b = c; }',
    '"use strict"\n foo',
    "'use strict'; foo",
    'function foo() { "use strict"\n bar }',
    '!function foo() { "use strict"\n bar }',
    '() => { "use strict"\n foo }',
    '() => "use strict"',
    '({ wrap() { "use strict"; foo } })',
    '"\\u0075se strict"',
    '"use asm"; "use strict"; foo',
    'function wrap() { "use asm"; "use strict"; foo }',
    '"use strict"; foo; "use asm"',
    'function wrap() { "use asm"; foo; "use strict" }',
    '{ "use strict"; }',
    'function wrap() { { "use strict" } foo }',
    '("use strict"); foo',
    'function wrap() { ("use strict"); foo }',
    'function a() { "use strict" } "use strict"; foo',
    'function a(a = function() { "use strict"; foo }) { "use strict" }',
    'try { "use strict"; var public = 1; } catch (e) {}',
    '"use asm" \u2029 "use strict"',
    '"\\n\\r\\t\\v\\b\\f\\\\\\\'\\"\\0"',
    '"Hello\\312World"',
    `"use strict"; + 1`,
    `function wrap() { "use strict"\n foo }`,
    `"\\u0075se strict"`,
    'function wrap() { { "use strict" } foo }',
    '"Hello\\0World"',
    '("use strict"); foo = 42;',
    '("use strict"); eval = 42;',
    '"USE STRICT";  var public = 1;',
    'function wrap() { "use asm"; "use strict"; foo }',
    '{ "use strict"; }',
    'function a() { "use strict" } "use strict"; foo;',
    'function foo() { "use \\u0020strict"; with (a) b = c; }',
    '"use \\u0020strict"; with (a) b = c;',
    `function foo()
    {
       "bogus directive";
       "use strict";
       return (this === undefined);
    }`
  ]) {
    it(`/* comment in front */ ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`/* comment in front */ ${arg}`, undefined, Context.OptionsDirectives);
      });
    });
  }
});
