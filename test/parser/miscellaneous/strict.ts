import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - Strict mode', () => {
  for (const arg of ['; with (x) y;', '"use strict"; with (x) y;', 'class X { foo() { with (x) y; } }']) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true, impliedStrict: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { impliedStrict: true });
      });
    });
  }

  for (const arg of [
    '"use strict"; with (x) y;',
    "'use strict'; with (x) y;",
    '"use strict";\nwith (x) y;',
    '"use strict"\n;with (x) y;',
    '"use strict"\nwith (x) y;',
    '"use strict"; "use strict"; with (x) y;',
    '"use strict"; \'use strict\'; with (x) y;',
    '"not a directive"; "use strict"; with (x) y;',
    '"haha\\\nstill\\\nfine"; "use strict"; with (x) y;',
    '// one comment\n/* two \n comment */ "use strict"; with (x) y;',
    'function f(){ "use strict"; with (x) y; }',
    "function f(){ 'use strict'; with (x) y; }",
    'function f(){ "use strict";\nwith (x) y; }',
    'function f(){ "use strict"\n;with (x) y; }',
    'function f(){ "use strict"\nwith (x) y; }',
    '() => { "use strict"; with (x) y; }',
    "() => { 'use strict'; with (x) y; }",
    '() => { "use strict";\nwith (x) y; }',
    '() => { "use strict"\nwith (x) y; }',
    '"use strict"; function f(){ with (x) y; }',
    'function f(){ "use strict"; foo; function g() { with (x) y; } } ',
    'function f(x=y){"use strict";}',
    '+function f(x=y){"use strict";}',
    '({x:function(x=y){"use strict";}})',
    'function f(x=y, a){"use strict";}',
    '+function f(x=y, a){"use strict";}',
    '({x:function(x=y, a){"use strict";}})',
    'function f(a, x=y){"use strict";}',
    '+function f(a, x=y){"use strict";}',
    '({x:function(a, x=y){"use strict";}})',
    'function f([x]){"use strict";}',
    '+function f([x]){"use strict";}',
    'function f(a, [x]){"use strict";}',
    'function f([x], a){"use strict";}',
    '({x:function([x], a){"use strict";}})',
    '([eval]) = [x]',
    'function f(x=package=10){ "use strict"; }',
    'function f(x=yield=10){ "use strict"; }',
    'function f(package){ "use strict"; }',
    'function f(yield){ "use strict"; }',
    'f = (package) => { "use strict"; }',
    'f = (yield) => { "use strict"; }',
    String.raw`"use strict"; "\1";`,
    String.raw`"use strict"; "\7";`,
    String.raw`"\1"; "use strict";`,
    String.raw`"\7"; "use strict";`,
    String.raw`function a() { "use strict"; "\1";}`,
    String.raw`function a() { "use strict"; "\7";}`,
    String.raw`function a() { "\1"; "use strict";}`,
    String.raw`function a() { "\7"; "use strict";}`,
    String.raw`f = () => { "use strict"; "\1";}`,
    String.raw`f = () => { "use strict"; "\7";}`,
    String.raw`f = () => { "\1"; "use strict";}`,
    String.raw`f = () => { "\7"; "use strict";}`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    'eval = x',
    'eval++',
    '--eval',
    'eval += x',
    'async function eval() {}',
    'function* eval() {}',
    'function f(eval) {}',
    'var eval = x;',
    'let eval = x;',
    '(eval) = x;',
    '(eval)\n = x;',
    'x, [eval] = [x]',
    'try {} catch (eval) {}',
    'function eval() {}',
    'function f(){"use strict";}',
    '+function f(){"use strict";}',
    '({x:function(){"use strict";}})',
    'function f(x){"use strict";}',
    '+function f(x){"use strict";}',
    '({x:function(x){"use strict";}})',
    'function f(x, y){"use strict";}',
    '+function f(x, y){"use strict";}',
    '({x:function(x, y){"use strict";}})',
    'var x; "use strict"; with (x) y;',
    'function f(){ `use strict`; with (x) y; }',
    'function f(){ "use strict"; foo; } with (x) y;',
    'function f(){ "use strict"; foo; } function g() { with (x) y; }',
    'function g() { function f(){ "use strict"; foo; } with (x) y; }',
    'if (x) { "use strict"; with (x) y; }',
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`);
      });
    });
  }
});
