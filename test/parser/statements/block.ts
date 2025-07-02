import { describe } from 'vitest';
import { fail, pass } from '../../test-utils';

describe('Expressions - Block', () => {
  fail('Expressions - Array (fail)', ['{ let {x} }', '{ let {} }', '{ let [] }']);
  pass('Expressions - Block (pass)', [
    '{}',
    { code: '{ let x }', options: { ranges: true } },
    { code: '{ foo: bar: function f(){} }', options: { webcompat: true } },
    { code: '{ let [] = y }', options: { ranges: true } },
    { code: '{ let {x} = y }', options: { ranges: true } },
    { code: '{debugger;}', options: { ranges: true } },
    { code: 'function f() {} var f;', options: { ranges: true } },

    'var f; function f() {}',
    'function x() { { var f; var f } }',
    '{}\n/foo/',
    '{}\n/foo/g',
    '{a}',
    { code: '{if (false) {} else ;}', options: { ranges: true, raw: true } },
    { code: '{for (;;) ;}', options: { ranges: true } },
    { code: '{with ({}) {}}', options: { ranges: true } },
    '{ { var f; } var f }',
    { code: '{ a(); bt(); }', options: { ranges: true } },
    { code: '{ var {foo=3} = {}; };', options: { ranges: true } },
    { code: '{ var foo = 0; }', options: { ranges: true } },
    { code: '{ async function foo() {}; };', options: { ranges: true } },
    '{\n  debugger;\n}',
    '{}\n/foo/',
    { code: '{ function a() {} ; function b() {} }', options: { ranges: true } },
    { code: '{ function f() {} ; function f() {} }', options: { webcompat: true } },
    { code: '{foo = b}', options: { ranges: true } },
    { code: '{var foo;}', options: { ranges: true } },
    '{}\n/foo/g',
  ]);
});
