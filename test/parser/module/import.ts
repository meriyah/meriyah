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
    'function () { import { default } from "module"; }'
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
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
    ["import { [123] } from 'foo';", Context.Strict | Context.Module],
    ['import { a } from;', Context.Strict | Context.Module],
    ["import / as a from 'a'", Context.Strict | Context.Module],
    ["import * as b, a from 'a'", Context.Strict | Context.Module],
    ["import {,} from 'a';", Context.Strict | Context.Module],
    ["import {b,,} from 'a';", Context.Strict | Context.Module],
    ["import * As a from 'a'", Context.Strict | Context.Module],
    ["import {eval} from 'x'", Context.Strict | Context.Module],
    ['import {a nopeNeedsAPrecedingComma} from "MyModule";', Context.Strict | Context.Module]
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
    'import a, { b, c as d } from "foo"',
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
    "import { a } from 'foo';",
    'import { a as of } from "k";',
    // Runtime errors
    'import foo from "foo.js"; try { (() => { foo = 12; })() } catch(e) {}',
    'import { foo } from "foo.js"; try { (() => { foo = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }',
    'import * as foo from "foo.js"; try { (() => { foo = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }',
    'import { foo as foo22 } from "foo.js"; try { (() => { foo22 = 12; })() } catch(e) { assert.areEqual("Assignment to const", e.message); }'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.Strict | Context.Module);
      });
    });
  }

  // valid tests
  pass('Module - Export', [
    [
      'import {} from "y"',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [],
            source: {
              type: 'Literal',
              value: 'y'
            }
          }
        ]
      }
    ],
    [
      'import e, {f as g, h as i, j} from "module";',
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
                  name: 'e'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'g'
                },
                imported: {
                  type: 'Identifier',
                  name: 'f'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'i'
                },
                imported: {
                  type: 'Identifier',
                  name: 'h'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'j'
                },
                imported: {
                  type: 'Identifier',
                  name: 'j'
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
      'import { as, get, set, from } from "baz"',
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
                  name: 'as'
                },
                imported: {
                  type: 'Identifier',
                  name: 'as'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'get'
                },
                imported: {
                  type: 'Identifier',
                  name: 'get'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'set'
                },
                imported: {
                  type: 'Identifier',
                  name: 'set'
                }
              },
              {
                type: 'ImportSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'from'
                },
                imported: {
                  type: 'Identifier',
                  name: 'from'
                }
              }
            ],
            source: {
              type: 'Literal',
              value: 'baz'
            }
          }
        ]
      }
    ],
    [
      'import x, * as ns from "foo"',
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
              },
              {
                type: 'ImportNamespaceSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'ns'
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
      'import * as d from "module";',
      Context.Strict | Context.Module,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ImportDeclaration',
            specifiers: [
              {
                type: 'ImportNamespaceSpecifier',
                local: {
                  type: 'Identifier',
                  name: 'd'
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
                  name: 'a'
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
                  name: 'b'
                }
              }
            ],
            source: {
              type: 'Literal',
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
      Context.Strict | Context.Module,
      {
        type: 'Program',
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
              },
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
        ]
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
    ]
  ]);
});
