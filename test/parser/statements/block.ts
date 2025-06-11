import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';

describe('Expressions - Block', () => {
  fail('Expressions - Array (fail)', [
    ['{ let {x} }', Context.None],
    ['{ let {} }', Context.None],
    ['{ let [] }', Context.None],
  ]);
  pass('Expressions - Block (pass)', [
    ['{}', Context.None],
    ['{ let x }', Context.OptionsRanges],
    ['{ foo: bar: function f(){} }', Context.OptionsWebCompat],
    ['{ let [] = y }', Context.OptionsRanges],
    ['{ let {x} = y }', Context.OptionsRanges],
    ['{debugger;}', Context.OptionsRanges],
    ['function f() {} var f;', Context.OptionsRanges],

    ['var f; function f() {}', Context.None],
    ['function x() { { var f; var f } }', Context.None],
    ['{}\n/foo/', Context.None],
    ['{}\n/foo/g', Context.None],
    ['{a}', Context.None],
    ['{if (false) {} else ;}', Context.OptionsRanges | Context.OptionsRaw],
    ['{for (;;) ;}', Context.OptionsRanges],
    ['{with ({}) {}}', Context.OptionsRanges],
    ['{ { var f; } var f }', Context.None],
    ['{ a(); bt(); }', Context.OptionsRanges],
    ['{ var {foo=3} = {}; };', Context.OptionsRanges],
    ['{ var foo = 0; }', Context.OptionsRanges],
    ['{ async function foo() {}; };', Context.OptionsRanges],
    ['{\n  debugger;\n}', Context.None],
    ['{}\n/foo/', Context.None],
    ['{ function a() {} ; function b() {} }', Context.OptionsRanges],
    ['{ function f() {} ; function f() {} }', Context.OptionsWebCompat],
    ['{foo = b}', Context.OptionsRanges],
    ['{var foo;}', Context.OptionsRanges],
    ['{}\n/foo/g', Context.None],
  ]);
});
