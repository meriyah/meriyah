import { describe, expect, it } from 'vitest';
import { type Options } from '../../../../src/options.ts';
import { parseSource } from '../../../../src/parser.ts';

const moduleOptions: Options = { sourceType: 'module' };

describe('Statements - using declarations', () => {
  const declarations: Array<{
    code: string;
    kind: 'using' | 'await using';
    options?: Options;
  }> = [
    { code: '{ using resource = acquire(); }', kind: 'using' },
    { code: 'function f() { using resource = acquire(); }', kind: 'using' },
    { code: 'using resource = acquire();', kind: 'using', options: moduleOptions },
    { code: 'await using resource = acquire();', kind: 'await using', options: moduleOptions },
    { code: 'async function f() { await using resource = acquire(); }', kind: 'await using' },
    { code: 'async function f() { await /* no line break */ using resource = acquire(); }', kind: 'await using' },
    { code: '{ using first = a, second = b; }', kind: 'using' },
  ];

  for (const { code, kind, options } of declarations) {
    it(code, () => {
      const program = parseSource(code, options);
      const declaration =
        program.body[0].type === 'BlockStatement'
          ? program.body[0].body[0]
          : program.body[0].type === 'FunctionDeclaration'
            ? program.body[0].body!.body[0]
            : program.body[0];

      expect(declaration).toMatchObject({ type: 'VariableDeclaration', kind });
    });
  }

  it('emits ERM declaration kinds in for heads', () => {
    const classicFor = parseSource('for (using resource = acquire(); condition; update()) {}');
    const forOf = parseSource('for (using resource of resources) {}');
    const awaitForOf = parseSource('async function f() { for (await using resource of resources) {} }');
    const forAwaitUsing = parseSource('async function f() { for await (using resource of resources) {} }');
    const forAwaitAwaitUsing = parseSource('async function f() { for await (await using resource of resources) {} }');

    expect(classicFor.body[0]).toMatchObject({
      type: 'ForStatement',
      init: { type: 'VariableDeclaration', kind: 'using' },
    });
    expect(forOf.body[0]).toMatchObject({
      type: 'ForOfStatement',
      left: { type: 'VariableDeclaration', kind: 'using' },
    });
    expect(awaitForOf.body[0]).toMatchObject({
      type: 'FunctionDeclaration',
      body: {
        body: [
          {
            type: 'ForOfStatement',
            left: { type: 'VariableDeclaration', kind: 'await using' },
          },
        ],
      },
    });
    expect(forAwaitUsing.body[0]).toMatchObject({
      type: 'FunctionDeclaration',
      body: {
        body: [
          {
            type: 'ForOfStatement',
            await: true,
            left: { type: 'VariableDeclaration', kind: 'using' },
          },
        ],
      },
    });
    expect(forAwaitAwaitUsing.body[0]).toMatchObject({
      type: 'FunctionDeclaration',
      body: {
        body: [
          {
            type: 'ForOfStatement',
            await: true,
            left: { type: 'VariableDeclaration', kind: 'await using' },
          },
        ],
      },
    });
  });

  it('keeps using available as an identifier', () => {
    expect(() =>
      parseSource(`
        var using = function () {};
        using = other;
        using();
        using: while (false) break using;
        ({ using: 1, using() {} });
        object.using;
        for (using of resources) {}
        for (using of of) {}
      `),
    ).not.toThrow();
  });

  it('keeps using followed by property access out of the declaration grammar', () => {
    expect(() => parseSource('var using = []; using[index] = value;')).not.toThrow();
    expect(() => parseSource('async function f() { var using = []; await using[index]; }')).not.toThrow();
  });

  it('honors line terminators in contextual declaration heads', () => {
    expect(() => parseSource('{ var using, let; using\nlet = value; }')).not.toThrow();
    expect(() => parseSource('async function f() { var using, let; await using\nlet = value; }')).not.toThrow();
  });

  it('allows await as a using binding after crossing a static-block function boundary', () => {
    expect(() => parseSource('class C { static { (() => { using await = null; }); } }')).not.toThrow();
  });

  it('allows of as a using binding in a classic for statement', () => {
    const program = parseSource('for (using of = acquire(); condition; update()) {}');

    expect(program.body[0]).toMatchObject({
      type: 'ForStatement',
      init: {
        type: 'VariableDeclaration',
        kind: 'using',
        declarations: [{ id: { type: 'Identifier', name: 'of' } }],
      },
    });
  });

  const invalidDeclarations: Array<{ code: string; options?: Options }> = [
    { code: 'using resource = acquire();' },
    { code: 'await using resource = acquire();' },
    { code: 'function f() { await using resource = acquire(); }' },
    { code: '{ using { resource } = acquire(); }' },
    { code: 'async function f() { await using [resource] = acquire(); }' },
    { code: '{ using resource; }' },
    { code: 'async function f() { await using resource; }' },
    { code: 'for (using resource in resources) {}' },
    { code: 'async function f() { for (await using resource in resources) {} }' },
    { code: 'for (using resource = acquire() of resources) {}' },
    { code: 'async function f() { for (await using resource = acquire() of resources) {} }' },
    { code: '{ using let = acquire(); }' },
    { code: 'async function f() { await using let = acquire(); }' },
    { code: '{ using resource = a, resource = b; }' },
    { code: 'for (using of = a, of = b;;) {}' },
    { code: 'if (condition) using resource = acquire();' },
    { code: 'label: using resource = acquire();' },
    { code: 'switch (value) { case 0: using resource = acquire(); }' },
    { code: 'class C { static { using await = acquire(); } }' },
    { code: 'class C { static { await using resource = acquire(); } }' },
  ];

  for (const { code, options } of invalidDeclarations) {
    it(`rejects ${code}`, () => {
      expect(() => parseSource(code, options)).toThrow();
    });
  }
});
