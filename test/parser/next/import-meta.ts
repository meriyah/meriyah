import { Context } from '../../../src/common';
import { pass, fail } from '../../test-utils';
import * as t from 'assert';
import { parseSource } from '../../../src/parser';

describe('Next - Import Meta', () => {
  for (const arg of [
    'class C {set x(_) { () => import.meta }}',
    'function f() { import.meta}',
    'class C {set x(_) { () => { import.meta } }}',
    'class C {set x(_) { if (1) { import.meta }}}',
    '({m() { if (1) {} else { import.meta }}})',
    '({m() { while (0) { import.meta }}})',
    '({m() { do { import.meta } while (0)}})',
    'class C {set x(_) { import.meta.url }}',
    'class C {set x(_) { import.meta[0] }}',
    'function f() { import.meta.couldBeMutable = true }',
    'class C {set x(_) { import.meta() }}',
    '({set x(_) { new import.meta.MagicClass}})',
    '({set x(_) { new import.meta}})',
    '({set x(_) { t = [...import.meta]}})',
    'class C {set x(_) { f = {...import.meta} }}',
    'class C {set x(_) { delete import.meta }}',
    "'use strict'; import.meta",
    "'use strict'; () => { import.meta }",
    "'use strict'; () => import.meta",
    "'use strict'; if (1) { import.meta }",
    "'use strict'; if (1) {} else { import.meta }",
    "'use strict'; while (0) { import.meta }",
    "'use strict'; do { import.meta } while (0)",
    "'use strict'; import.meta.url",
    "'use strict'; import.meta[0]",
    "'use strict'; import.meta.couldBeMutable = true",
    "'use strict'; import.meta()",
    "'use strict'; new import.meta.MagicClass",
    "'use strict'; new import.meta",
    "'use strict'; t = [...import.meta]",
    "'use strict'; f = {...import.meta}",
    '(import.meta?.a)',
    '(a?.import.meta)',
    "'use strict'; delete import.meta",
    'class C {m() { import.meta }}',
    'class C {m() { () => { import.meta } }}',
    'class C {m() { () => import.meta }}',
    'class C {m() { if (1) { import.meta } }}',
    'class C {m() { if (1) {} else { import.meta } }}',
    'class C {m() { while (0) { import.meta } }}',
    '({m() { do { import.meta } while (0)}})',
    '({m() { import.meta.url}})',
    '({m() { import.meta[0]}})',
    '({m() { import.meta.couldBeMutable = true}})',
    '({m() { import.meta()}})',
    '({m() { new import.meta.MagicClass}})',
    '({m: function() {new import.meta}})',
    '({m: function() {t = [...import.meta]}})',
    '({m: function() {f = {...import.meta}}})',
    '({m: function() {delete import.meta}})',
    '({set x(_) {import.meta}})',
    "'use strict'; ({m: function() { while (0) { import.meta }}})",
    'function f() { do { import.meta } while (0)}',
    'var f = function() {import.meta.url}',
    'var f = function() {import.meta[0]}',
    'var f = function() {import.meta.couldBeMutable = true}',
    'var f = function() {import.meta()}',
    'var f = function() {new import.meta.MagicClass}',
    'var f = function() {new import.meta}',
    'var f = function() {t = [...import.meta]}',
    'var f = function() {f = {...import.meta}}',
    'var f = function() {delete import.meta}',
    'f = {...import.meta}',
    'delete import.meta',
    'import.meta',
    '() => { import.meta }',
    '() => import.meta',
    'if (1) { import.meta }',
    'if (1) {} else { import.meta }',
    'while (0) { import.meta }',
    'do { import.meta } while (0)',
    'import.meta.url',
    'import.meta[0]()',
    'import.meta[0](x = 123) ',
    'import.meta([0](x = 123))',
    '(import.meta([0](x = 123)))',
    '(import.meta([x = (import.meta([x = (x)](x = 123)))](x = 123)))',
    '(import.meta([x = (a??a)](x = 123)))',
    '(import.meta([x = (a??a)](x = a?.b123)))',
    'import.meta[0]',
    'import.meta[0] = 123',
    'import.meta[0] = 123',
    'import.meta.couldBeMutable = true',
    '(import.meta.couldBeMutable = true)',
    'import.meta()',
    'new import.meta.MagicClass',
    'new import.meta',
    't = [...import.meta]',
    'export var meta = import.meta;',
    'export function getMeta() { return import.meta;}',
    'import.meta.url',
    'import("string")?.import.meta',
    '(a?.import("string")?.import.meta??(a))',
    'import.meta?.(a?.import("string")?.import.meta??(a))',
    'var a = import.meta;',
    'import.meta, 1;',
    '1, import.meta;',
    'import.meta, a = 1;',
    'a = 1, import.meta;',
    'import.meta.url = 1, import.meta.url = 2;',
    'import.meta, import.meta.url = 1;',
    'import.meta;'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, undefined, Context.OptionsNext | Context.Strict | Context.Module);
      });
    });
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(
          `${arg}`,
          undefined,
          Context.OptionsNext | Context.OptionsWebCompat | Context.Strict | Context.Module
        );
      });
    });
  }

  fail('Expressions - Import Meta (fail)', [
    ['import?.meta', Context.OptionsNext],
    ['import?.meta', Context.None],
    ['import?.meta', Context.OptionsNext | Context.Strict | Context.Module],
    ['(import?.meta)', Context.OptionsNext | Context.Strict | Context.Module],
    ['(import.meta([1 = ()](x = 123)))', Context.OptionsNext | Context.Strict | Context.Module],
    ['import.(meta([0](x = 123)))', Context.OptionsNext | Context.Strict | Context.Module],
    ['import.meta[0]() = 123', Context.OptionsNext | Context.Strict | Context.Module],
    ['[import.meta] = [];', Context.OptionsNext | Context.Strict | Context.Module],
    ['[...import.meta] = [];', Context.OptionsNext | Context.Strict | Context.Module],
    ['import.meta = 0;', Context.OptionsNext | Context.Strict | Context.Module],
    [
      'async function* f() { for await (import.meta of null) ; }',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    ['for (import.meta in null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['({a: import.meta} = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['({...import.meta} = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['import.meta++;', Context.OptionsNext | Context.Strict | Context.Module],
    ['var x, y, z; ( { import.meta } = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['var x, y, z; ( { x: import.meta } = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['var x, y, z; ( { x: import.meta = 1 } = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['var x, y, z; ( [import.meta] = {});', Context.OptionsNext | Context.Strict | Context.Module],
    ['var x, y, z; ( [import.meta = 1] = {});', Context.OptionsNext | Context.Strict | Context.Module],
    [
      '"use strict"; let x, y, z; for (x of [import.meta] = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      '"use strict"; let x, y, z; for (x of [import.meta = 1] = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      '"use strict"; let x, y, z; for (x of { x: import.meta } = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      '"use strict"; let x, y, z; for (x in [import.meta] = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      '"use strict"; let x, y, z; for (x in [import.meta = 1] = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    [
      '"use strict"; let x, y, z; for (x in { x: import.meta } = {});',
      Context.OptionsNext | Context.Strict | Context.Module
    ],
    ['import.meta++;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['for (import.meta of null) ;', Context.OptionsNext | Context.Strict | Context.Module],
    ['[import.meta] = [];', Context.OptionsNext | Context.Strict | Context.Module],
    ['([import.meta] = [1])', Context.OptionsNext],
    ['var import.meta', Context.OptionsNext],
    ['for (var import.meta of [1]) {}', Context.OptionsWebCompat],
    ['var import.meta', Context.OptionsNext | Context.Module | Context.Strict],
    ['import.m\\u0065ta;', Context.OptionsNext | Context.Module | Context.Strict],
    ['import.\\u006deta;', Context.OptionsNext | Context.Module | Context.Strict],
    ['import.meta2;', Context.OptionsNext | Context.Module | Context.Strict]
  ]);

  pass('Next - Import Meta (pass)', [
    [
      `({m() { import.meta.url}})`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'm'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'ExpressionStatement',
                          expression: {
                            type: 'MemberExpression',
                            object: {
                              meta: {
                                type: 'Identifier',
                                name: 'import'
                              },
                              type: 'MetaProperty',
                              property: {
                                type: 'Identifier',
                                name: 'meta'
                              }
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'url'
                            }
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `if (1) { import.meta }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'IfStatement',
            test: {
              type: 'Literal',
              value: 1
            },
            consequent: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    meta: {
                      type: 'Identifier',
                      name: 'import'
                    },
                    type: 'MetaProperty',
                    property: {
                      type: 'Identifier',
                      name: 'meta'
                    }
                  }
                }
              ]
            },
            alternate: null
          }
        ]
      }
    ],
    [
      `var f = function() {import.meta.couldBeMutable = true}`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'FunctionExpression',
                  params: [],
                  body: {
                    type: 'BlockStatement',
                    body: [
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'AssignmentExpression',
                          left: {
                            type: 'MemberExpression',
                            object: {
                              meta: {
                                type: 'Identifier',
                                name: 'import'
                              },
                              type: 'MetaProperty',
                              property: {
                                type: 'Identifier',
                                name: 'meta'
                              }
                            },
                            computed: false,
                            property: {
                              type: 'Identifier',
                              name: 'couldBeMutable'
                            }
                          },
                          operator: '=',
                          right: {
                            type: 'Literal',
                            value: true
                          }
                        }
                      }
                    ]
                  },
                  async: false,
                  generator: false,
                  id: null
                },
                id: {
                  type: 'Identifier',
                  name: 'f'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `import.meta[0]`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'MemberExpression',
              object: {
                meta: {
                  type: 'Identifier',
                  name: 'import'
                },
                type: 'MetaProperty',
                property: {
                  type: 'Identifier',
                  name: 'meta'
                }
              },
              computed: true,
              property: {
                type: 'Literal',
                value: 0
              }
            }
          }
        ]
      }
    ],
    [
      `do { import.meta } while (0)`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'DoWhileStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    meta: {
                      type: 'Identifier',
                      name: 'import'
                    },
                    type: 'MetaProperty',
                    property: {
                      type: 'Identifier',
                      name: 'meta'
                    }
                  }
                }
              ]
            },
            test: {
              type: 'Literal',
              value: 0
            }
          }
        ]
      }
    ],
    [
      `import.meta()`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                meta: {
                  type: 'Identifier',
                  name: 'import'
                },
                type: 'MetaProperty',
                property: {
                  type: 'Identifier',
                  name: 'meta'
                }
              },
              arguments: []
            }
          }
        ]
      }
    ],
    [
      `t = [...import.meta]`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 't'
              },
              operator: '=',
              right: {
                type: 'ArrayExpression',
                elements: [
                  {
                    type: 'SpreadElement',
                    argument: {
                      meta: {
                        type: 'Identifier',
                        name: 'import'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'meta'
                      }
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    ],
    [
      `"use strict"; ({m() { while (0) { import.meta } }})`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Literal',
              value: 'use strict'
            },
            directive: 'use strict'
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  key: {
                    type: 'Identifier',
                    name: 'm'
                  },
                  value: {
                    type: 'FunctionExpression',
                    params: [],
                    body: {
                      type: 'BlockStatement',
                      body: [
                        {
                          type: 'WhileStatement',
                          test: {
                            type: 'Literal',
                            value: 0
                          },
                          body: {
                            type: 'BlockStatement',
                            body: [
                              {
                                type: 'ExpressionStatement',
                                expression: {
                                  meta: {
                                    type: 'Identifier',
                                    name: 'import'
                                  },
                                  type: 'MetaProperty',
                                  property: {
                                    type: 'Identifier',
                                    name: 'meta'
                                  }
                                }
                              }
                            ]
                          }
                        }
                      ]
                    },
                    async: false,
                    generator: false,
                    id: null
                  },
                  kind: 'init',
                  computed: false,
                  method: true,
                  shorthand: false
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `delete import.meta`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'UnaryExpression',
              operator: 'delete',
              argument: {
                meta: {
                  type: 'Identifier',
                  name: 'import'
                },
                type: 'MetaProperty',
                property: {
                  type: 'Identifier',
                  name: 'meta'
                }
              },
              prefix: true
            }
          }
        ]
      }
    ],
    [
      `import.meta.resolve('something')`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'MemberExpression',
                object: {
                  meta: {
                    type: 'Identifier',
                    name: 'import'
                  },
                  type: 'MetaProperty',
                  property: {
                    type: 'Identifier',
                    name: 'meta'
                  }
                },
                computed: false,
                property: {
                  type: 'Identifier',
                  name: 'resolve'
                }
              },
              arguments: [
                {
                  type: 'Literal',
                  value: 'something'
                }
              ]
            }
          }
        ]
      }
    ],
    [
      `const size = import.meta.scriptElement.dataset.size || 300;`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'VariableDeclaration',
            kind: 'const',
            declarations: [
              {
                type: 'VariableDeclarator',
                init: {
                  type: 'LogicalExpression',
                  left: {
                    type: 'MemberExpression',
                    object: {
                      type: 'MemberExpression',
                      object: {
                        type: 'MemberExpression',
                        object: {
                          meta: {
                            type: 'Identifier',
                            name: 'import'
                          },
                          type: 'MetaProperty',
                          property: {
                            type: 'Identifier',
                            name: 'meta'
                          }
                        },
                        computed: false,
                        property: {
                          type: 'Identifier',
                          name: 'scriptElement'
                        }
                      },
                      computed: false,
                      property: {
                        type: 'Identifier',
                        name: 'dataset'
                      }
                    },
                    computed: false,
                    property: {
                      type: 'Identifier',
                      name: 'size'
                    }
                  },
                  right: {
                    type: 'Literal',
                    value: 300
                  },
                  operator: '||'
                },
                id: {
                  type: 'Identifier',
                  name: 'size'
                }
              }
            ]
          }
        ]
      }
    ],
    [
      `x = import.meta`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              left: {
                type: 'Identifier',
                name: 'x'
              },
              operator: '=',
              right: {
                meta: {
                  type: 'Identifier',
                  name: 'import'
                },
                type: 'MetaProperty',
                property: {
                  type: 'Identifier',
                  name: 'meta'
                }
              }
            }
          }
        ]
      }
    ],
    [
      `() => { import.meta }`,
      Context.Module | Context.Strict | Context.OptionsNext,
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ArrowFunctionExpression',
              body: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      meta: {
                        type: 'Identifier',
                        name: 'import'
                      },
                      type: 'MetaProperty',
                      property: {
                        type: 'Identifier',
                        name: 'meta'
                      }
                    }
                  }
                ]
              },
              params: [],
              async: false,
              expression: false
            }
          }
        ]
      }
    ]
  ]);
});
