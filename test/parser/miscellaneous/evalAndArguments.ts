import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser.ts';

describe('Miscellaneous - Eval and arguments', () => {
  for (const text of [
    'arguments--;',
    '{ eval }',
    '{ arguments }',
    '{ foo: eval }',
    '{ foo: arguments }',
    '{ eval = 0 }',
    '{ arguments = 0 }',
    '{ foo: eval = 0 }',
    '{ foo: arguments = 0 }',
    '[ eval ]',
    '[ arguments ]',
    '[ eval = 0 ]',
    '[ arguments = 0 ]',
    '{ x: (eval) }',
    '{ x: (arguments) }',
    '{ x: (eval = 0) }',
    '{ x: (arguments = 0) }',
    '{ x: (eval) = 0 }',
    '{ x: (arguments) = 0 }',
    '[ (eval) ]',
    '[ (arguments) ]',
    '[ (eval = 0) ]',
    '[ (arguments = 0) ]',
    '[ (eval) = 0 ]',
    '[ (arguments) = 0 ]',
    '[ ...(eval) ]',
    '[ ...(arguments) ]',
    '[ ...(eval = 0) ]',
    '[ ...(arguments = 0) ]',
    '[ ...(eval) = 0 ]',
    '[ ...(arguments) = 0 ]',
  ]) {
    it(`'use strict'; (${text} = {})`, () => {
      t.throws(() => {
        parseSource(`'use strict'; (${text} = {})`, { webcompat: true });
      });
    });

    it(`'use strict'; for (${text} of {}) {}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; for (${text} of {}) {}`, { webcompat: true });
      });
    });

    it(`'use strict'; for (${text} in {}) {}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; for (${text} in {}) {}`, { webcompat: true });
      });
    });

    it(`'use strict'; for (${text} in {}) {}`, () => {
      t.throws(() => {
        parseSource(`'use strict'; for (${text} in {}) {}`, { next: true });
      });
    });

    it(`for (${text} in {}) {}`, () => {
      t.throws(() => {
        parseSource(`for (${text} in {}) {}`, { sourceType: 'module' });
      });
    });
  }

  for (const text of [
    'var eval',
    'var arguments',
    'var foo, eval;',
    'var foo, arguments;',
    'try { } catch (eval) { }',
    'try { } catch (arguments) { }',
    'function eval() { }',
    'function foo(eval) { }',
    'function foo(arguments) { }',
    'function foo(bar, eval) { }',
    'function foo(bar, arguments) { }',
    'eval => foo',
    '(eval) => { }',
    '(arguments) => { }',
    '(foo, eval) => { }',
    '(foo, arguments) => { }',
    'eval = 1;',
    'arguments = 1;',
    '[ arguments = 0 ]',
    'var foo = eval = 1;',
    'var foo = arguments = 1;',
    '++eval;',
    '++arguments;',
    'eval++;',
    'arguments++;',
    '--arguments;',
    '{ eval = 0 }',
    '{ arguments = 0 }',
    '[ arguments = 0 ]',
    '[ (eval = 0) ]',
    '[ (arguments = 0) ]',
    '[ (eval) = 0 ]',
    '[ (arguments) = 0 ]',
    '[ ...(eval) = 0 ]',
    '[ ...(arguments) = 0 ]',
    '[...eval] = arr',
    '(arguments)++;',
    '++(arguments);',
    '++(eval);',
    '(eval)++;',
    '(arguments) = 1;',
    'eval++',
    '--arguments',
    "'use strict'; [eval] = 0",
    "'use strict'; [,,,eval,] = 0",
    "'use strict'; ({a: eval} = 0)",
    "'use strict'; ({a: eval = 0} = 0)",
    "'use strict'; [arguments] = 0",
    "'use strict'; ({a: arguments = 0} = 0)",
    '"use strict"; let [eval];',
    'eval=>0',
    'arguments=>0',
    '(eval)=>0',
    '(arguments)=>0',
    "'use strict'; var { x : arguments } = {};",
    "'use strict'; var { eval } = {};",
    "'use strict'; var { ...arguments } = {};",
    "'use strict'; var [arguments] = {};",
    "'use strict'; var { eval = false } = {};",
    "'use strict'; var { x : arguments } = {};",
    "'use strict'; function f(arguments) {}",
    "'use strict'; var { x : arguments } = {};",
    "'use strict'; function f(argument1, { x : arguments }) {}",
    "'use strict'; function f(argument1, { a : arguments }) {}",
    "'use strict'; function f(argument1, { x : private }) {}",
    "'use strict'; function f(argument1, { arguments = false }) {}",
    'arguments[0],',
  ]) {
    it(text, () => {
      t.throws(() => {
        parseSource(text, { impliedStrict: true });
      });
    });
  }

  // Valid in strict mode
  for (const text of [
    'eval;',
    'arguments;',
    'eval: a',
    'arguments[1] = 7;',
    'arguments[1]--;',
    'arguments[1] = 7;',
    '--arguments[1];',
    'var foo = eval;',
    'var foo = arguments;',
    'var foo = { eval: 1 };',
    'var foo = { arguments: 1 };',
    'var foo = { }; foo.eval = {};',
    'var foo = { }; foo.arguments = {};',
    '(0,eval)(true)',
  ]) {
    it(`"use strict"; ${text}`, () => {
      t.doesNotThrow(() => {
        parseSource(`"use strict"; ${text}`);
      });
    });

    it(`function foo() { "use strict"; ${text} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { "use strict";  ${text} }`);
      });
    });

    it(`() => { "use strict"; ${text} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { "use strict";  ${text} }`);
      });
    });

    it(`() => { "use strict"; ${text} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`() => { "use strict";  ${text} }`, { webcompat: true });
      });
    });
  }

  // Valid 'eval' and 'arguments' in sloppy mode
  for (const text of [
    'var eval;',
    'var arguments',
    'var foo, eval;',
    'var foo, arguments;',
    'try { } catch (eval) { }',
    'try { } catch (arguments) { }',
    'function eval() { }',
    'function arguments() { }',
    'function foo(eval) { }',
    'function foo(arguments) { }',
    'function foo(bar, eval) { }',
    'function foo(bar, arguments) { }',
    'eval = 1;',
    'arguments = 1;',
    'var foo = eval = 1;',
    'var foo = arguments = 1;',
    '++eval;',
    '++arguments;',
    'eval++;',
    'arguments++;',
    'eval;',
    'arguments;',
    'arguments[1] = 7;',
    'arguments[1]--;',
    'foo = arguments[1];',
    '({*eval() {}})',
    '"use strict"; ({*eval() {}})',
    '({*arguments() {}})',
    '({get eval() {}})',
    '({get arguments() {}})',
    '({set eval(_) {}})',
    '({set arguments(_) {}})',
    '"use strict"; ({set eval(_) {}})',
    '"use strict"; ({set arguments(_) {}})',
    'class C {eval() {}}',
    'class C {arguments() {}}',
    'class C {*eval() {}}',
    'class C {*arguments() {}}',
    'class C {get eval() {}}',
    'class C {get arguments() {}}',
    'class C {set eval(_) {}}',
    'class C {set arguments(_) {}}',
    'class C {static eval() {}}',
    'class C {static arguments() {}}',
    'class C {static *eval() {}}',
    'class C {static *arguments() {}}',
    'class C {static get eval() {}}',
    'class C {static get arguments() {}}',
    'class C {static set eval(_) {}}',
    'class C {static set arguments(_) {}}',
    'var actual = "" + function ([arguments]) {return arguments;};',
    '(function ([a, b, arguments, d], [e, f, g]) {return arguments();})',
    'var f = function ([arguments]) {return arguments + 1;};',
    'var o = {"arguments": 42};',
    'delete o.arguments;',
    'var arguments = 42;',
    'var equalityCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultEqualityCheck;',
    'function get_arg_2() { return arguments[2]; }',
    'var n = arguments.length > 1 ? ToInteger(arguments[1]) + 0 : 0;',
    'var lastIndex = arguments.length - 1, lastArg = arguments[lastIndex];',
    'arguments[0]',
    'arguments[0] /** the image src url */',
    'function foo(){writeLine(typeMap[typeof(arguments)]);}foo(1);',
    'function foo(){var arguments;writeLine(typeMap[typeof(arguments)]);}foo(1);',
    'eval(\'arguments="test1"\');',
    'arguments[0] = "arguments[0]";',
    'write("args[1] : " + arguments[1]);',
    'target.apply(that, arguments);',
    'write(x + " " + arguments[0]);',
    'arguments.callee ',
    'arguments.callee.configurable = true',
    'Test4.arguments = 10;',
    'class c { constructor() { result = [...arguments]; } };',
    'eval[0]++;',
    '++eval[0];',
    'eval.a++;',
    '++eval.a;',
    'arguments[0]++;',
    '++arguments[0];',
    ' arguments.a++;',
    ' ++arguments.a;',
    'eval[0] = 1;',
    'arguments.a = 1;',
    '++arguments[0];',
  ]) {
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text, { webcompat: true });
      });
    });

    it(`function foo() { ${text} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${text} }`, { webcompat: true });
      });
    });
    it(text, () => {
      t.doesNotThrow(() => {
        parseSource(text);
      });
    });

    it(`function foo() { ${text} }`, () => {
      t.doesNotThrow(() => {
        parseSource(`function foo() { ${text} }`);
      });
    });
  }
});
