import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Module - Import', () => {
  for (const arg of [
    'import',
    'import;',
    'import;',
    'import {}',
    'import {};',
    'import {} from;',
    "import {,} from 'a';",
    "import {b,,} from 'a';",
    'import from;',
    "import {b as,} from 'a';",
    "import {function} from 'a';",
    "import {a as function} from 'a';",
    "import {b,,c} from 'a';",
    "import {b,c,,} from 'a';",
    "import * As a from 'a'",
    "import / as a from 'a'",
    "import * as b, a from 'a'",
    "import a as b from 'a'",
    "import a, b from 'a'",
    'import {};',
    'import {} from;',
    "import {,} from 'a';",
    'import from;',
    "import { foo as !d } from 'foo';",
    "import { foo as 123 } from 'foo';",
    "import { foo as [123] } from 'foo';",
    "import { foo as {a: b = 2} } from 'foo';",
    "import { eval } from 'foo';",
    "import { for } from 'foo';",
    "import { y as yield } from 'foo'",
    "import { s as static } from 'foo'",
    "import { l as let } from 'foo'",
    "import { arguments } from 'foo';",
    "import { x }, def from 'foo';",
    "import def, def2 from 'foo';",
    "import * as x, def from 'foo';",
    "import * as x, * as y from 'foo';",
    "import {x}, {y} from 'foo';",
    "import * as x, {y} from 'foo';",
    'import { enum } from "foo"',
    'import { foo, bar }',
    'import foo from bar',
    'import * 12',
    "import a, 12 from 'foo'",
    'import {a as 12} from "foo"',
    'import * as a from 12',
    'import {a as b, e as l 12',
    'import icefapper from ;',
    'import icefapper from {}',
    'import icefapper from 12',
    'import icefapper from /',
    'import icefapper from []',
    'function foo() { import foo from "icefapper.js"; }',
    'import foo, bar from "foo.js";',
    'import { foo }, * as ns1 from "foo.js";',
    'import { foo }',
    'import [ foo ] from "foo.js";',
    '{ import in_block from ""; }',
    'import {',
    'import { foo',
    'import { foo as ',
    'import { foo as bar ',
    'import { foo as bar, ',
    'import { foo as switch } from "module";',
    'import { foo, , } from "module";',
    `for (const y in [])
   import v from './foo`,
    "import { a as await } from 'foo';",
    "import { a as enum } from 'foo';",
    "import { a as arguments } from 'foo';",
    "import {function} from 'a';",
    "import {a as function} from 'a';",
    "import {b,,c} from 'a';",
    "import {b,c,,} from 'a';",
    "import * As a from 'a'",
    "import / as a from 'a'",
    "import * as b, a from 'a'",
    "import a as b from 'a'",
    "import a, b from 'a'",
    "import 'a',",
    'import { };',
    'import {;',
    'import };',
    'import { , };',
    "import { , } from 'foo';",
    'import { null } from "null',
    'import foo, from "bar";',
    'import {bar}, {foo} from "foo";',
    'import {bar}, foo from "foo"',
    "import { [123] } from 'foo';",
    "import { foo as {a: b = 2} } from 'foo';",
    "import { foo as !d } from 'foo';",
    "import { foo as [123] } from 'foo';",
    "import { foo as {a: b = 2} } from 'foo';",
    "import * as x, * as y from 'foo';",
    "import {x}, {y} from 'foo';",
    "import * as x, {y} from 'foo';",
    'import { };',
    'import {;',
    'import };',
    'import { , };',
    "import { , } from 'm.js';",
    'import { a } from;',
    "import { x }, def from 'm.js';",
    "import def, def2 from 'm.js';",
    "import * as x, def from 'm.js';",
    "import * as x, * as y from 'm.js';",
    "import { y as yield } from 'm.js'",
    "import { s as static } from 'm.js'",
    "import { l as let } from 'm.js'",
    "import { a as await } from 'm.js';",
    "import { y as yield } from 'foo'",
    "import { {} } from 'foo';",
    "import { !d } from 'foo';",
    "import { 123 } from 'foo';",
    'import { foo',
    'import { foo as ',
    'import { foo as bar ',
    'import { foo as bar, ',
    'import { foo as switch } from "module";',
    'import { foo, , } from "module";',
    "import def, def2 from 'm.js';",
    "import * as x, def from 'm.js';",
    "import * as x, * as y from 'm.js';",
    "import {x}, {y} from 'm.js';",
    "import * as x, {y} from 'm.js';",
    `for (const y in [])
    import v from './foo`,
    'import from;',
    "import { y as yield } from 'm.js'",
    "import { s as static } from 'm.js'",
    "import { l as let } from 'm.js'",
    'import { };',
    'import {;',
    'import };',
    'import { , };',
    "import { , } from 'm.js';",
    "import , from 'm.js';",
    "import a , from 'm.js';",
    'import { a } from;',
    `for (let x = 0; false;)
     import v from './decl-pos-import-for-let.js';`,
    "import a , from 'foo';",
    "import a { b, c } from 'foo';",
    'import * as import from "./"',
    'function foo() { import foo from "icefapper.js"; }',
    'import * as function',
    'import * as let',
    'import * as var',
    'import * as static',
    'import * as await',
    'import * as async',
    'import * as class',
    'import * as class',
    'import * as new',
    'function foo() { import foo from "foo.js"; }',
    'import foo, bar from "foo.js";',
    'import { foo }, bar from "foo.js";',
    'import { foo }, from "foo.js";',
    'import { foo }, bar from "foo.js";',
    'import { foo }, * as ns1 from "foo.js";',
    'import { foo }',
    'import [ foo ] from "foo.js";',
    'import * foo from "foo.js";',
    'import * as from "foo";',
    'import * as "foo" from "foo.js";',
    'import { , foo } from "foo.js";',
    '() => { import arrow from ""; }',
    'try { import _try from ""; } catch(e) { }',
    'import { foo as bar ',
    'import { foo as bar, ',
    'import { switch } from "module";',
    'import { foo bar } from "module";',
    'import { foo as switch } from "module";',
    'import { foo, , } from "module";',
    'if (false) import { default } from "module";',
    'for(var i=0; i<1; i++) import { default } from "module";',
    'while(false) import { default } from "module";',
    `do import { default } from "module"
                                while (false);`,
    'function () { import { default } from "module"; }',
    'import { "foo"',
    'import { "foo" }',
    'import { "foo" } from',
    'import { "foo", } from "./foo";',
    'import { "foo" as "f" } from "./foo";',
    'import { foo as "f" } from "./foo";'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  for (const arg of [
    'import from "foo";',
    'import a "foo";',
    'import * as a "foo";',
    'import { a } "foo";',
    'import b, { a } "foo";',
    'import { default as a, b } "foo";'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      }, /Expected 'from'$/);
    });
  }

  fail('Module - Import (fail)', [
    ['{import {x} from "y";}', Context.None],
    ['{import {x} from "y";}', Context.Strict | Context.Module],
    ['function f(){import {x} from "y";}', Context.None],
    ['function f(){import {x} from "y";}', Context.Module],
    ['let x = () => {import {x} from "y";}', Context.None],
    ['let x = () => import {x} from "y"', Context.None],
    ['if (x) import {x} from "y";', Context.None],
    ['if (x); else import {x} from "y";', Context.Strict | Context.Module],
    ['do import {x} from "y"; while (x);', Context.None],
    ['for (;;) import {x} from "y";', Context.None],
    ['switch (x) { import {x} from "y"; }', Context.None],
    ['switch (x) { case x: import {x} from "y"; }', Context.Strict | Context.Module],
    ['switch (x) { default: import {x} from "y"; }', Context.None],
    ['with (x) import {x} from "y";', Context.None],
    ['try { } finally { import {x} from "y"; }', Context.Strict | Context.Module],
    ['x = { foo(){ import {x} from "y"; }}', Context.None],
    ['do import {x} from "y"; while (x);', Context.Strict | Context.Module],
    ['import foo from "bar"', Context.None],
    ["import await from 'foo'", Context.None],
    ['import foo', Context.Strict | Context.Module],
    ['import', Context.Strict | Context.Module],
    ['import {await} from "foo";', Context.Strict | Context.Module],
    ['import {foo as await} from "foo";', Context.Strict | Context.Module],
    ['import await, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import eval, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import enum, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import arguments, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import package, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import protected, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import implements, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import await, {x, y, z} from "foo";', Context.Strict | Context.Module],
    ['import await, * as foo from "foo";', Context.Strict | Context.Module],
    ['import eval, * as foo from "foo";', Context.Strict | Context.Module],
    ['import enum, * as foo from "foo";', Context.Strict | Context.Module],
    ['import package, * as foo from "foo";', Context.Strict | Context.Module],
    ['import protected, * as foo from "foo";', Context.Strict | Context.Module],
    ['import implements, * as foo from "foo";', Context.Strict | Context.Module],
    ['{ import in_block from ""; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo as ', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo as bar ', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo as bar, ', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { switch } from "module";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo bar } from "module";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo as switch } from "module";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo, , } from "module";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['if (false) import { default } from "module";', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'for(var i=0; i<1; i++) import { default } from "module";',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['{ export default null; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['{ export default null; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['{ export default null; }', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import;', Context.Strict | Context.Module],
    ['import {}', Context.Strict | Context.Module],
    ['import {} from;', Context.Strict | Context.Module],
    ["import {,} from 'a';", Context.Strict | Context.Module],
    ['import foo, from "bar";', Context.Strict | Context.Module],
    ['import * from "foo"', Context.Strict | Context.Module],
    ['import * as from', Context.Strict | Context.Module],
    ['import * as x', Context.Strict | Context.Module],
    ['import { null } from "null"', Context.Strict | Context.Module],
    ['import { implements } from "null"', Context.Strict | Context.Module],
    ['import foo, from "bar";', Context.Strict | Context.Module],
    ['import cherow from ;', Context.Strict | Context.Module],
    ['import cherow from 12', Context.Strict | Context.Module],
    ['import cherow from []', Context.Strict | Context.Module],
    ['import foo, bar from "foo.js";', Context.Strict | Context.Module],
    ['import { foo }, * as ns1 from "foo.js";', Context.Strict | Context.Module],
    ['import [ foo ] from "foo.js";', Context.Strict | Context.Module],
    ['import { foo as ', Context.Strict | Context.Module],
    ['import { foo as switch } from "module";', Context.Strict | Context.Module],
    ['import { foo, , } from "module";', Context.Strict | Context.Module],
    ['import * as a in b from "foo";', Context.Strict | Context.Module],
    ["import { {} } from 'foo';", Context.Strict | Context.Module],
    ["import { !d } from 'foo';", Context.Strict | Context.Module],
    ["import { 123 } from 'foo';", Context.Strict | Context.Module],
    ["import a, *= from 'foo';", Context.Strict | Context.Module],
    ["import a, ** from 'foo';", Context.Strict | Context.Module],
    ["import a, **= from 'foo';", Context.Strict | Context.Module],
    ["import *= from 'foo';", Context.Strict | Context.Module],
    ["import { [123] } from 'foo';", Context.Strict | Context.Module],
    ['import { a } from;', Context.Strict | Context.Module],
    ["import / as a from 'a'", Context.Strict | Context.Module],
    ["import * as b, a from 'a'", Context.Strict | Context.Module],
    ["import {,} from 'a';", Context.Strict | Context.Module],
    ["import {b,,} from 'a';", Context.Strict | Context.Module],
    ["import * As a from 'a'", Context.Strict | Context.Module],
    ["import {eval} from 'x'", Context.Strict | Context.Module],
    ['import {a b} from "foo";', Context.Strict | Context.Module],
    ['import a, * as a from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a, {a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a, {b as a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, b as a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {b as a, c as a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { x, y, x } from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, b, a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {b, a, a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, a, b} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, b as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a, {a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a, {b as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a, a as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a, * as a from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import {a} from "foo";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import {b, a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import {b as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import a from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import {b as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import {a} from "foo"; import {a as a} from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import a from "foo"; import * as a from "foo"', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import foo, bar from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo, foo } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo, bar as foo } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['const foo = 12; import { foo } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['function foo() { }; import { foo } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo }, from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['mport { foo }, bar from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo }, * as ns1 from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import [ foo ] from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { , foo } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import foo from "string"; import foo from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo } from "string', Context.Strict | Context.Module | Context.OptionsLexical],
    ['import { foo as bar, bar } from "string";', Context.Strict | Context.Module | Context.OptionsLexical],
    ['() => { import arrow from ""; }', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'import * as "foo" from "./f"; import { foo } from "./m";',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    [
      'import * as foo from "./f"; import { foo } from "./m";',
      Context.Strict | Context.Module | Context.OptionsLexical
    ],
    ['import { foo } from "./f"; import { foo } from "./m";', Context.Strict | Context.Module | Context.OptionsLexical],
    [
      'import { b as foo } from "./f"; import { "a" as foo } from "./m";',
      Context.Strict | Context.Module | Context.OptionsLexical
    ]
  ]);

  for (const arg of [
    "import 'foo';",
    "import { a } from 'foo';",
    `import  * as set from "a"`,
    "import { a, b as d, c, } from 'baz';",
    "import * as thing from 'baz';",
    "import thing from 'foo';",
    "import thing, * as rest from 'foo';",
    "import thing, { a, b, c } from 'foo';",
    "import { arguments as a } from 'baz';",
    "import { for as f } from 'foo';",
    "import { yield as y } from 'foo';",
    "import { static as s } from 'foo';",
    "import { let as l } from 'foo';",
    "import { q as z } from 'foo';",
    'import { null as nil } from "bar"',
    'import {bar, baz} from "foo";',
    'import {bar as baz, xyz} from "foo";',
    'import foo, {bar} from "foo";',
    'import C from "foo";',
    'import a, { b, c as d } from "foo"',
    'import * as async from "async";',
    "import foo, * as bar from 'baz';",
    'import $ from "foo"',
    'import {} from "foo";',
    "import n from 'n.js';",
    'import a from "module";',
    'import b, * as c from "module";',
    'import * as d from "module";',
    'import e, {f as g, h as i, j} from "module";',
    'import {k as l, m} from "module";',
    'import {n, o as p} from "module";',
    "import 'q.js';",
    "import a, {b,c,} from 'd'",
    "import a, {b,} from 'foo'",
    "import {as as as} from 'as'",
    "import a, {as} from 'foo'",
    "import a, {function as c} from 'baz'",
    "import a, {b as c} from 'foo'",
    "import a, * as b from 'a'",
    "import a, {} from 'foo'",
    "import a from 'foo'",
    "import * as a from 'a'",
    "import {m as mm} from 'foo';",
    "import {aa} from 'foo';",
    'import { as, get, set, from } from "baz"',
    'import icefapper from "await"',
    "import 'foo';",
    "import get from './get.js';",
    "import { a } from 'foo';",
    "import { a, b as d, c, } from 'baz';",
    "import * as foob from 'bar.js';",
    'import { as, get, set, from } from "baz"',
    "import {} from 'x'",
    "import {a} from 'x'",
    "import {a as b} from 'x'",
    "import {a,b,} from 'x'",
    "import foo, * as bar from 'baz';",
    'import $ from "foo"',
    'import {} from "foo";',
    "import n from 'n.js';",
    'import a from "module";',
    'import b, * as c from "module";',
    "import { yield as y } from 'm.js';",
    "import { static as s } from 'm.js';",
    "import { yield as y } from 'foo';",
    'import async from "foo";',
    'import defexp, {x,} from "foo";',
    'import { Cocoa as async } from "foo"',
    "import 'somemodule.js';",
    "import { } from 'm.js';",
    "import { a } from 'm.js';",
    "import 'foo';",
    "import from from 'foo';",
    "import * as from from 'foo';",
    "import { a } from 'foo';",
    'import { a as of } from "k";',
    // Runtime errors
    'import foo from "foo.js"; try { (() => { foo = 12; })() } catch(e) {}',
    'import { foo } from "foo.js"; try { (() => { foo = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }',
    'import * as foo from "foo.js"; try { (() => { foo = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }',
    'import { foo as foo22 } from "foo.js"; try { (() => { foo22 = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }',
    'import { "foo" as foo } from "./foo";',
    'import { "foo" as foo, } from "./foo";',
    'import { a, "foo" as foo, } from "./foo";',
    'import { "foo" as foo, a } from "./foo";',
    'import { "foo" as foo, a, } from "./foo";',
    'import { "foo" as foo, "a" as a, default as b } from "./foo";'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });

      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module | Context.OptionsLexical);
      });
    });
  }

  // valid tests
  pass('Module - Export', [
    [
      'import {} from "y"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 18,
        range: [0, 18],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 18,
            range: [0, 18],
            specifiers: [],
            source: {
              type: 'Literal',
              start: 15,
              end: 18,
              range: [15, 18],
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import e, {f as g, h as i, j} from "module";',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 44,
        range: [0, 44],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 44,
            range: [0, 44],
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                start: 7,
                end: 8,
                range: [7, 8],
                local: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'e'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 11,
                end: 17,
                range: [11, 17],
                imported: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'f'
                },
                local: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'g'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 19,
                end: 25,
                range: [19, 25],
                imported: {
                  type: 'Identifier',
                  start: 19,
                  end: 20,
                  range: [19, 20],
                  name: 'h'
                },
                local: {
                  type: 'Identifier',
                  start: 24,
                  end: 25,
                  range: [24, 25],
                  name: 'i'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 27,
                end: 28,
                range: [27, 28],
                imported: {
                  type: 'Identifier',
                  start: 27,
                  end: 28,
                  range: [27, 28],
                  name: 'j'
                },
                local: {
                  type: 'Identifier',
                  start: 27,
                  end: 28,
                  range: [27, 28],
                  name: 'j'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 35,
              end: 43,
              range: [35, 43],
              value: 'module'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {n, o as p} from "module";',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 33,
        range: [0, 33],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 33,
            range: [0, 33],
            specifiers: [
              {
                type: 'ImportSpecifier',
                start: 8,
                end: 9,
                range: [8, 9],
                imported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'n'
                },
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'n'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 11,
                end: 17,
                range: [11, 17],
                imported: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'o'
                },
                local: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'p'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 24,
              end: 32,
              range: [24, 32],
              value: 'module'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import { as, get, set, from } from "baz"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 40,
        range: [0, 40],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 40,
            range: [0, 40],
            specifiers: [
              {
                type: 'ImportSpecifier',
                start: 9,
                end: 11,
                range: [9, 11],
                imported: {
                  type: 'Identifier',
                  start: 9,
                  end: 11,
                  range: [9, 11],
                  name: 'as'
                },
                local: {
                  type: 'Identifier',
                  start: 9,
                  end: 11,
                  range: [9, 11],
                  name: 'as'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 13,
                end: 16,
                range: [13, 16],
                imported: {
                  type: 'Identifier',
                  start: 13,
                  end: 16,
                  range: [13, 16],
                  name: 'get'
                },
                local: {
                  type: 'Identifier',
                  start: 13,
                  end: 16,
                  range: [13, 16],
                  name: 'get'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 18,
                end: 21,
                range: [18, 21],
                imported: {
                  type: 'Identifier',
                  start: 18,
                  end: 21,
                  range: [18, 21],
                  name: 'set'
                },
                local: {
                  type: 'Identifier',
                  start: 18,
                  end: 21,
                  range: [18, 21],
                  name: 'set'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 23,
                end: 27,
                range: [23, 27],
                imported: {
                  type: 'Identifier',
                  start: 23,
                  end: 27,
                  range: [23, 27],
                  name: 'from'
                },
                local: {
                  type: 'Identifier',
                  start: 23,
                  end: 27,
                  range: [23, 27],
                  name: 'from'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 35,
              end: 40,
              range: [35, 40],
              value: 'baz'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import x, * as ns from "foo"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 28,
            range: [0, 28],
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                start: 7,
                end: 8,
                range: [7, 8],
                local: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'x'
                }
              },
              {
                type: 'ImportNamespaceSpecifier',
                start: 10,
                end: 17,
                range: [10, 17],
                local: {
                  type: 'Identifier',
                  start: 15,
                  end: 17,
                  range: [15, 17],
                  name: 'ns'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 23,
              end: 28,
              range: [23, 28],
              value: 'foo'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import $ from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: '$'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ]
      }
    ],
    [
      'import from from "foo"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'from'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'foo'
            }
          }
        ]
      }
    ],
    [
      'import * as d from "module";',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 28,
        range: [0, 28],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 28,
            range: [0, 28],
            specifiers: [
              {
                type: 'ImportNamespaceSpecifier',
                start: 7,
                end: 13,
                range: [7, 13],
                local: {
                  type: 'Identifier',
                  start: 12,
                  end: 13,
                  range: [12, 13],
                  name: 'd'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 19,
              end: 27,
              range: [19, 27],
              value: 'module'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {n, o as p} from "module";',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'n'
                },
                imported: {
                  type: 'Identifier',
                  name: 'n'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'p'
                },
                imported: {
                  type: 'Identifier',
                  name: 'o'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'module'
            }
          }
        ]
      }
    ],
    [
      'import icefapper from "await"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'icefapper'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'await'
            }
          }
        ]
      }
    ],
    [
      'import x from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ]
      }
    ],
    [
      'import {a, b} from "c"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 22,
        range: [0, 22],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 22,
            range: [0, 22],
            specifiers: [
              {
                type: 'ImportSpecifier',
                start: 8,
                end: 9,
                range: [8, 9],
                imported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'a'
                },
                local: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'a'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 11,
                end: 12,
                range: [11, 12],
                imported: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'b'
                },
                local: {
                  type: 'Identifier',
                  start: 11,
                  end: 12,
                  range: [11, 12],
                  name: 'b'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 19,
              end: 22,
              range: [19, 22],
              value: 'c'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import * as a from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportNamespaceSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'a'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import x, * as a from "y"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 25,
            range: [0, 25],
            specifiers: [
              {
                type: 'ImportDefaultSpecifier',
                start: 7,
                end: 8,
                range: [7, 8],
                local: {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  range: [7, 8],
                  name: 'x'
                }
              },
              {
                type: 'ImportNamespaceSpecifier',
                start: 10,
                end: 16,
                range: [10, 16],
                local: {
                  type: 'Identifier',
                  start: 15,
                  end: 16,
                  range: [15, 16],
                  name: 'a'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 22,
              end: 25,
              range: [22, 25],
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import "y"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 10,
        range: [0, 10],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 10,
            range: [0, 10],
            specifiers: [],
            source: {
              type: 'Literal',
              start: 7,
              end: 10,
              range: [7, 10],
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ]
      }
    ],
    [
      'import {x,} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ]
      }
    ],
    [
      'import {x as z} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'z'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x as z,} from "y"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 25,
        range: [0, 25],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 25,
            range: [0, 25],
            specifiers: [
              {
                type: 'ImportSpecifier',
                start: 8,
                end: 14,
                range: [8, 14],
                imported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 22,
              end: 25,
              range: [22, 25],
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x, z} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'z'
                },
                imported: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x, z,} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'z'
                },
                imported: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x as a, z} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'a'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'z'
                },
                imported: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ]
      }
    ],
    [
      'import {x, z as b} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'x'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'b'
                },
                imported: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x as a, z as b} from "y"',
      Context.Strict | Context.Module | Context.OptionsRanges,
      {
        type: 'Program',
        start: 0,
        end: 32,
        range: [0, 32],
        body: [
          {
            type: 'ImportDeclaration',
            start: 0,
            end: 32,
            range: [0, 32],
            specifiers: [
              {
                type: 'ImportSpecifier',
                start: 8,
                end: 14,
                range: [8, 14],
                imported: {
                  type: 'Identifier',
                  start: 8,
                  end: 9,
                  range: [8, 9],
                  name: 'x'
                },
                local: {
                  type: 'Identifier',
                  start: 13,
                  end: 14,
                  range: [13, 14],
                  name: 'a'
                }
              },
              {
                type: 'ImportSpecifier',
                start: 16,
                end: 22,
                range: [16, 22],
                imported: {
                  type: 'Identifier',
                  start: 16,
                  end: 17,
                  range: [16, 17],
                  name: 'z'
                },
                local: {
                  type: 'Identifier',
                  start: 21,
                  end: 22,
                  range: [21, 22],
                  name: 'b'
                }
              }
            ],
            source: {
              type: 'Literal',
              start: 29,
              end: 32,
              range: [29, 32],
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import {x as a, z as b,} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'a'
                },
                imported: {
                  type: 'Identifier',
                  name: 'x'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'b'
                },
                imported: {
                  type: 'Identifier',
                  name: 'z'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ],
        sourceType: 'module'
      }
    ],
    [
      'import { default as f2, "foo" as foo } from "./foo";',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'f2'
                },
                imported: {
                  type: 'Identifier',
                  name: 'default'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'foo'
                },
                imported: {
                  type: 'Literal',
                  value: 'foo'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: './foo'
            }
          }
        ]
      }
    ]
  ]);
});
