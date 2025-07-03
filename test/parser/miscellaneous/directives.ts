import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';
import { fail, pass } from '../../test-utils';

describe('Miscellaneous - Directives', () => {
  for (const arg of [
    String.raw`"\1;" "use strict";`,
    String.raw`"\2;" "use strict";`,
    String.raw`"\3;" "use strict";`,
    String.raw`"\4;" "use strict";`,
    String.raw`"\5;" "use strict";`,
    String.raw`"\6;" "use strict";`,
    String.raw`"\7;" "use strict";`,
    String.raw`"\8;" "use strict";`,
    String.raw`"\9;" "use strict";`,
    String.raw`"use strict"; function f(){"\1";}`,
    String.raw`"\1;" "use strict"; null`,
    '"use strict"; with (a) b = c;',
    String.raw`"use strict"; "\1;"`,
    String.raw`"use strict"; "\2;"`,
    String.raw`"use strict"; "\3;"`,
    String.raw`"use strict"; "\4;"`,
    String.raw`"use strict"; "\5;"`,
    String.raw`"use strict"; "\6;"`,
    String.raw`"use strict"; "\7;"`,
    String.raw`"use strict"; "\8;"`,
    String.raw`"use strict"; "\9;"`,
    String.raw`"use strict"; "\1;" null`,
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
    String.raw`'random\x foo'`,
    '"random\\u{a\rnewline"',
    String.raw`'random\u foo'`,
    String.raw`'random\u0 foo'`,
    String.raw`'random\u00 foo'`,
    String.raw`'random\u0a foo'`,
    String.raw`'random\x0\ foo'`,
    String.raw`'random\ua\ foo'`,
    String.raw`'random\x0\ foo'`,
    String.raw`'random\u0a\ foo'`,
    String.raw`'random\xx foo'`,
    String.raw`'random\u00a\ foo'`,
    String.raw`'random\uax foo'`,
    String.raw`'random\u0au foo'`,
    '"use strict" ++',
    String.raw`"use strict" \1`,
    String.raw`"use strict" "\1"`,
    String.raw`"use strict"; "\1";`,
    '"use strict" ++',
    'function foo() { "use strict"; with (a) b = c; }',
    '"use strict"; function foo() { with (a) b = c; }',
    String.raw`"use strict"; function hello() { "\000"; }`,
    String.raw`"use strict"; function hello() { "\00"; }`,
    String.raw`"use strict"; function hello() { "\0123"; }`,
    String.raw`function hello() { "use strict"; "\000"; }`,
    String.raw`function hello() { "use strict"; "\00"; }`,
    String.raw`function hello() { "use strict"; "\0123"; }`,
    String.raw`function hello("\000008") { "use strict"; }`,
    outdent`
      function fun() {
          "use strict";
                var public = 1;
      }
    `,
    outdent`
      function fun() {
          "use strict"
                var public = 1;
      }
    `,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });

    it(`/* comment in front */ ${arg}`, () => {
      t.throws(() => {
        parseSource(`/* comment in front */ ${arg}`);
      });
    });

    it(`function foo() { ${arg} }`, () => {
      t.throws(() => {
        parseSource(`function foo() { ${arg} }`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    '("use strict")',
    String.raw`"\n\r\t\v\b\f\\\'\"\0"`,
    '"use some future directive"',
    '"use some future directive";',
    '"use some future directive"; "use strict";',
    String.raw`"Hello\312World"`,
    '"use strict"',
    String.raw`'use\x20strict'`,
    String.raw`"use\x20strict"`,
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
    String.raw`function foo() { "use \u0020strict"; with (a) b = c; }`,
    String.raw`"use \u0020strict"; function foo() { with (a) b = c; }`,
    '"use strict"\n foo',
    "'use strict'; foo",
    'function foo() { "use strict"\n bar }',
    '!function foo() { "use strict"\n bar }',
    '() => { "use strict"\n foo }',
    '() => "use strict"',
    '({ wrap() { "use strict"; foo } })',
    String.raw`"\u0075se strict"`,
    '"use asm"; "use strict"; foo',
    'function wrap() { "use asm"; "use strict"; foo }',
    '"use strict"; foo; "use asm"',
    'function wrap() { "use asm"; foo; "use strict" }',
    '{ "use strict"; }',
    'function wrap() { { "use strict" } foo }',
    '("use strict"); foo',
    'function wrap() { ("use strict"); foo }',
    'function a() { "use strict" } "use strict"; foo',
    'try { "use strict"; var public = 1; } catch (e) {}',
    '"use asm" \u2029 "use strict"',
    String.raw`"\n\r\t\v\b\f\\\'\"\0"`,
    String.raw`"Hello\312World"`,
    '"use strict"; + 1',
    'function wrap() { "use strict"\n foo }',
    String.raw`"\u0075se strict"`,
    'function wrap() { { "use strict" } foo }',
    String.raw`"Hello\0World"`,
    '("use strict"); foo = 42;',
    '("use strict"); eval = 42;',
    '"USE STRICT";  var public = 1;',
    'function wrap() { "use asm"; "use strict"; foo }',
    '{ "use strict"; }',
    'function a() { "use strict" } "use strict"; foo;',
    String.raw`function foo() { "use \u0020strict"; with (a) b = c; }`,
    String.raw`"use \u0020strict"; with (a) b = c;`,
    outdent`
      function foo()
      {
         "bogus directive";
         "use strict";
         return (this === undefined);
      }
    `,
    String.raw`"use strict", "Hello\312World"`,
    String.raw`"use strict" + "Hello\312World"`,
    String.raw`"use strict", "Hello\312World"`,
    String.raw`"use strict", "Hello\312World"`,
    'function foo() { "use strict" .foo }',
    String.raw`"use strict"; "\0";`,
    String.raw`"\0"; "use strict";`,
    String.raw`function a() {"use strict"; "\0";}`,
    String.raw`function a() {"\0"; "use strict";}`,
  ]) {
    it(`/* comment in front */ ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`/* comment in front */ ${arg}`, { raw: true });
      });
    });

    it(`/* comment in front */ ${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`/* comment in front */ ${arg}`, { webcompat: true, raw: true });
      });
    });
  }

  for (const arg of ['.foo', '[foo]', '()', '`x`', ' + x', '/f', '/f/g']) {
    t.throws(() => {
      parseSource(`function f(){ "use strict" \n /* suffix = */   ${arg} ; eval = 1; }`, { impliedStrict: true });
    });
  }

  for (const arg of ['foo', '++x', '--x', 'function f(){}', '{x}', ';', '25', 'true']) {
    t.throws(() => {
      parseSource(`function f(){ "use strict" \n  ${arg} ; eval = 1; }`);
    });
  }

  fail('Miscellaneous - Directives (fail)', [
    '"use strict"; var static;',
    String.raw`\u0061sync function f(){}`,
    String.raw`"use strict" "Hello\312World"`,
    '"use strict" \n "Hello\\312World"',
    String.raw`function a() { "use strict" "Hello\312World" }`,
    'function a() { "use strict" \n "Hello\\312World" }',
    { code: String.raw`"use strict" + "Hello\312World"`, options: { ranges: true, raw: true, sourceType: 'module' } },
  ]);

  pass('Miscellaneous - Directives (pass)', [
    { code: String.raw`"use strict" + "Hello\312World"`, options: { ranges: true, raw: true } },
    { code: '("use strict"); foo = 42;', options: { sourceType: 'module', ranges: true, raw: true } },
    { code: String.raw`"use strict", "Hello\312World"`, options: { ranges: true, raw: true } },
    { code: '"use asm" \n "use strict"', options: { ranges: true, raw: true } },
    { code: '"use strict"; + 1', options: { ranges: true } },
    { code: '("use strict"); foo = 42;', options: { ranges: true } },
    '"\\u0061b"\n"c\\u0064"',
    { code: '"\\u0061b"\n"c\\u0064"', options: { sourceType: 'module' } },
  ]);
});
