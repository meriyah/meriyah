import { describe } from 'vitest';
import { fail } from '../../test-utils';

describe('Module - General', () => {
  fail('Module - Import (fail)', [
    { code: 'function () { import { default } from "module";', options: { sourceType: 'module' } },
    { code: 'import { default } from "module" ++ }', options: { sourceType: 'module' } },
    { code: 'import "module" ++ }', options: { sourceType: 'module' } },
    { code: 'class X { foo() { with (x) y; } }', options: { sourceType: 'module' } },
    { code: '"use strict"\n;with (x) y;', options: { sourceType: 'module' } },
    { code: 'yield;', options: { sourceType: 'module' } },
    { code: '?', options: { sourceType: 'module' } },
    { code: 'export * from "foo" null;', options: { sourceType: 'module' } },
    { code: 'return;', options: { sourceType: 'module' } },
    { code: 'export default function* () {}();', options: { sourceType: 'module' } },
    { code: 'export default null null;', options: { sourceType: 'module' } },
    { code: 'var g; function* g() {}', options: { sourceType: 'module', lexical: true } },
    { code: 'var f; function f() {}', options: { sourceType: 'module', lexical: true } },
    { code: 'export default const x = null;', options: { sourceType: 'module' } },
    { code: 'test262: import v from "foo";', options: { sourceType: 'module' } },
    { code: '(class { *method() { export default null; } });', options: { sourceType: 'module' } },
    { code: 'if (false) return;', options: { sourceType: 'module' } },
    { code: 'if (false) {} else return;', options: { sourceType: 'module' } },
    { code: 'do return while(false);', options: { sourceType: 'module' } },
    { code: 'function foo() { }; export foo;', options: { sourceType: 'module' } },
    { code: 'function foo() { export default function() { } }', options: { sourceType: 'module' } },
    { code: 'if (false) {} else export default null;', options: { sourceType: 'module' } },
  ]);
});
