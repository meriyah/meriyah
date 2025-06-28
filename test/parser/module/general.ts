import { describe } from 'vitest';
import { fail } from '../../test-utils';

describe('Module - General', () => {
  fail('Module - Import (fail)', [
    { code: 'function () { import { default } from "module";', options: { module: true } },
    { code: 'import { default } from "module" ++ }', options: { module: true } },
    { code: 'import "module" ++ }', options: { module: true } },
    { code: 'class X { foo() { with (x) y; } }', options: { module: true } },
    { code: '"use strict"\n;with (x) y;', options: { module: true } },
    { code: 'yield;', options: { module: true } },
    { code: '?', options: { module: true } },
    { code: 'export * from "foo" null;', options: { module: true } },
    { code: 'return;', options: { module: true } },
    { code: 'export default function* () {}();', options: { module: true } },
    { code: 'export default null null;', options: { module: true } },
    { code: 'var g; function* g() {}', options: { module: true, lexical: true } },
    { code: 'var f; function f() {}', options: { module: true, lexical: true } },
    { code: 'export default const x = null;', options: { module: true } },
    { code: 'test262: import v from "foo";', options: { module: true } },
    { code: '(class { *method() { export default null; } });', options: { module: true } },
    { code: 'if (false) return;', options: { module: true } },
    { code: 'if (false) {} else return;', options: { module: true } },
    { code: 'do return while(false);', options: { module: true } },
    { code: 'function foo() { }; export foo;', options: { module: true } },
    { code: 'function foo() { export default function() { } }', options: { module: true } },
    { code: 'if (false) {} else export default null;', options: { module: true } },
  ]);
});
