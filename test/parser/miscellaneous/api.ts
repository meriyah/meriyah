import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parse, parseModule, parseScript } from '../../../src/meriyah';

describe('Expressions - API', () => {
  it('should parse script code with "parse"', () => {
    t.deepEqual(
      parse('foo', {
        loc: true,
        ranges: true,
        webcompat: true,
        sourceType: 'module',
        preserveParens: true,
        jsx: true,
        lexical: true,
        source: 'bullshit',
      }),
      {
        body: [
          {
            start: 0,
            end: 3,
            range: [0, 3],
            expression: {
              loc: {
                end: {
                  column: 3,
                  line: 1,
                },
                source: 'bullshit',
                start: {
                  column: 0,
                  line: 1,
                },
              },
              name: 'foo',
              start: 0,
              end: 3,
              range: [0, 3],
              type: 'Identifier',
            },
            loc: {
              end: {
                column: 3,
                line: 1,
              },
              source: 'bullshit',
              start: {
                column: 0,
                line: 1,
              },
            },
            type: 'ExpressionStatement',
          },
        ],
        loc: {
          end: {
            column: 3,
            line: 1,
          },
          source: 'bullshit',
          start: {
            column: 0,
            line: 1,
          },
        },
        sourceType: 'module',
        start: 0,
        end: 3,
        range: [0, 3],
        type: 'Program',
      },
    );
  });

  it('should parse script code', () => {
    t.deepEqual(parseScript('foo'), {
      body: [
        {
          expression: {
            name: 'foo',
            type: 'Identifier',
          },
          type: 'ExpressionStatement',
        },
      ],
      sourceType: 'script',
      type: 'Program',
    });
  });
  it('should parse module code with directive node', () => {
    t.deepEqual(parseModule('1'), {
      body: [
        {
          expression: {
            type: 'Literal',
            value: 1,
          },
          type: 'ExpressionStatement',
        },
      ],
      sourceType: 'module',
      type: 'Program',
    });
  });

  it('should parse module code with directive node and strict directive', () => {
    t.deepEqual(parseModule('"use strict"; 1', { raw: true }), {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ExpressionStatement',
          directive: 'use strict',
          expression: {
            type: 'Literal',
            value: 'use strict',
            raw: '"use strict"',
          },
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'Literal',
            value: 1,
            raw: '1',
          },
        },
      ],
    });
  });

  it('should parse module code', () => {
    t.deepEqual(parseModule('foo'), {
      body: [
        {
          expression: {
            name: 'foo',
            type: 'Identifier',
          },
          type: 'ExpressionStatement',
        },
      ],
      sourceType: 'module',
      type: 'Program',
    });
  });

  it('should parse with impliedStrict and shebang option', () => {
    t.deepEqual(
      parseScript('foo', {
        impliedStrict: true,
        next: true,
      }),
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier',
            },
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'script',
        type: 'Program',
      },
    );
  });

  it('should parse with raw option', () => {
    t.deepEqual(
      parseModule('foo', {
        raw: true,
      }),
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier',
            },
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'module',
        type: 'Program',
      },
    );
  });

  it('should parse with raw option - string', () => {
    t.deepEqual(
      parseModule('"a"', {
        raw: true,
      }),
      {
        body: [
          {
            expression: {
              type: 'Literal',
              raw: '"a"',
              value: 'a',
            },
            directive: 'a',
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'module',
        type: 'Program',
      },
    );
  });

  it('should parse with directive option', () => {
    t.deepEqual(
      parseModule('"abc"', {
        raw: true,
        next: true,
      }),
      {
        body: [
          {
            directive: 'abc',
            expression: {
              type: 'Literal',
              raw: '"abc"',
              value: 'abc',
            },
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'module',
        type: 'Program',
      },
    );
  });

  it('should parse binary expr correctly', () => {
    t.deepEqual(
      parseModule('a ?? (x || dd && aa) / y - foo', {
        next: true,
        ranges: true,
        loc: true,
      }),
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'LogicalExpression',
              left: {
                type: 'Identifier',
                name: 'a',
                start: 0,
                end: 1,
                range: [0, 1],
                loc: {
                  start: {
                    line: 1,
                    column: 0,
                  },
                  end: {
                    line: 1,
                    column: 1,
                  },
                },
              },
              right: {
                type: 'BinaryExpression',
                left: {
                  type: 'BinaryExpression',
                  left: {
                    type: 'LogicalExpression',
                    left: {
                      type: 'Identifier',
                      name: 'x',
                      start: 6,
                      end: 7,
                      range: [6, 7],
                      loc: {
                        start: {
                          line: 1,
                          column: 6,
                        },
                        end: {
                          line: 1,
                          column: 7,
                        },
                      },
                    },
                    right: {
                      type: 'LogicalExpression',
                      left: {
                        type: 'Identifier',
                        name: 'dd',
                        start: 11,
                        end: 13,
                        range: [11, 13],
                        loc: {
                          start: {
                            line: 1,
                            column: 11,
                          },
                          end: {
                            line: 1,
                            column: 13,
                          },
                        },
                      },
                      right: {
                        type: 'Identifier',
                        name: 'aa',
                        start: 17,
                        end: 19,
                        range: [17, 19],
                        loc: {
                          start: {
                            line: 1,
                            column: 17,
                          },
                          end: {
                            line: 1,
                            column: 19,
                          },
                        },
                      },
                      operator: '&&',
                      start: 11,
                      end: 19,
                      range: [11, 19],
                      loc: {
                        start: {
                          line: 1,
                          column: 11,
                        },
                        end: {
                          line: 1,
                          column: 19,
                        },
                      },
                    },
                    operator: '||',
                    start: 6,
                    end: 19,
                    range: [6, 19],
                    loc: {
                      start: {
                        line: 1,
                        column: 6,
                      },
                      end: {
                        line: 1,
                        column: 19,
                      },
                    },
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y',
                    start: 23,
                    end: 24,
                    range: [23, 24],
                    loc: {
                      start: {
                        line: 1,
                        column: 23,
                      },
                      end: {
                        line: 1,
                        column: 24,
                      },
                    },
                  },
                  operator: '/',
                  start: 5,
                  end: 24,
                  range: [5, 24],
                  loc: {
                    start: {
                      line: 1,
                      column: 5,
                    },
                    end: {
                      line: 1,
                      column: 24,
                    },
                  },
                },
                right: {
                  type: 'Identifier',
                  name: 'foo',
                  start: 27,
                  end: 30,
                  range: [27, 30],
                  loc: {
                    start: {
                      line: 1,
                      column: 27,
                    },
                    end: {
                      line: 1,
                      column: 30,
                    },
                  },
                },
                operator: '-',
                start: 5,
                end: 30,
                range: [5, 30],
                loc: {
                  start: {
                    line: 1,
                    column: 5,
                  },
                  end: {
                    line: 1,
                    column: 30,
                  },
                },
              },
              operator: '??',
              start: 0,
              end: 30,
              range: [0, 30],
              loc: {
                start: {
                  line: 1,
                  column: 0,
                },
                end: {
                  line: 1,
                  column: 30,
                },
              },
            },
            start: 0,
            end: 30,
            range: [0, 30],
            loc: {
              start: {
                line: 1,
                column: 0,
              },
              end: {
                line: 1,
                column: 30,
              },
            },
          },
        ],
        start: 0,
        end: 30,
        range: [0, 30],
        loc: {
          start: {
            line: 1,
            column: 0,
          },
          end: {
            line: 1,
            column: 30,
          },
        },
      },
    );
  });

  it('should parse precedence values correctly', () => {
    t.deepEqual(
      parseModule('x || y || z && a ** x ? b ? c : d : e', {
        jsx: true,
        next: true,
      }),
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ConditionalExpression',
              test: {
                type: 'LogicalExpression',
                left: {
                  type: 'LogicalExpression',
                  left: {
                    type: 'Identifier',
                    name: 'x',
                  },
                  right: {
                    type: 'Identifier',
                    name: 'y',
                  },
                  operator: '||',
                },
                right: {
                  type: 'LogicalExpression',
                  left: {
                    type: 'Identifier',
                    name: 'z',
                  },
                  right: {
                    type: 'BinaryExpression',
                    left: {
                      type: 'Identifier',
                      name: 'a',
                    },
                    right: {
                      type: 'Identifier',
                      name: 'x',
                    },
                    operator: '**',
                  },
                  operator: '&&',
                },
                operator: '||',
              },
              consequent: {
                type: 'ConditionalExpression',
                test: {
                  type: 'Identifier',
                  name: 'b',
                },
                consequent: {
                  type: 'Identifier',
                  name: 'c',
                },
                alternate: {
                  type: 'Identifier',
                  name: 'd',
                },
              },
              alternate: {
                type: 'Identifier',
                name: 'e',
              },
            },
          },
        ],
      },
    );
  });

  it('should parse JSX', () => {
    t.deepEqual(
      parseModule('<ul></ul>', {
        jsx: true,
        next: true,
      }),
      {
        body: [
          {
            expression: {
              children: [],
              closingElement: {
                name: {
                  name: 'ul',
                  type: 'JSXIdentifier',
                },
                type: 'JSXClosingElement',
              },
              openingElement: {
                attributes: [],
                name: {
                  name: 'ul',
                  type: 'JSXIdentifier',
                },
                selfClosing: false,
                type: 'JSXOpeningElement',
              },
              type: 'JSXElement',
            },
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'module',
        type: 'Program',
      },
    );
  });
});
