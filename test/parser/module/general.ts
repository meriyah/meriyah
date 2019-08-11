import { Context } from '../../../src/common';
import { fail } from '../../test-utils';

describe('Module - General', () => {
  fail('Module - Import (fail)', [
    ['function () { import { default } from "module";', Context.Strict | Context.Module],
    ['import { default } from "module" ++ }', Context.Strict | Context.Module],
    ['import "module" ++ }', Context.Strict | Context.Module],
    ['class X { foo() { with (x) y; } }', Context.Strict | Context.Module],
    ['"use strict"\n;with (x) y;', Context.Strict | Context.Module],
    ['yield;', Context.Strict | Context.Module],
    ['?', Context.Strict | Context.Module],
    ['export * from "foo" null;', Context.Strict | Context.Module],
    ['return;', Context.Strict | Context.Module],
    ['export default function* () {}();', Context.Strict | Context.Module],
    ['export default null null;', Context.Strict | Context.Module],
    ['var g; function* g() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['var f; function f() {}', Context.Strict | Context.Module | Context.OptionsLexical],
    ['export default const x = null;', Context.Strict | Context.Module],
    ['test262: import v from "foo";', Context.Strict | Context.Module],
    ['(class { *method() { export default null; } });', Context.Strict | Context.Module],
    ['if (false) return;', Context.Strict | Context.Module],
    ['if (false) {} else return;', Context.Strict | Context.Module],
    ['do return while(false);', Context.Strict | Context.Module],
    ['function foo() { }; export foo;', Context.Strict | Context.Module],
    ['function foo() { export default function() { } }', Context.Strict | Context.Module],
    ['if (false) {} else export default null;', Context.Strict | Context.Module]
  ]);
});
