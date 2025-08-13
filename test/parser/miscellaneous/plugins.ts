import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { ParseError } from '../../../src/errors';
import { parseSource } from '../../../src/parser';
import { type Plugin } from '../../../src/plugin';

describe('Miscellaneous - plugins', () => {
  it('should call plugin init hook', () => {
    let initCalled = false;
    let initSource = '';
    let initOptions: any = null;

    const plugin: Plugin = {
      name: 'test-init',
      init: (source, options) => {
        initCalled = true;
        initSource = source;
        initOptions = options;
      },
    };

    parseSource('const x = 1', { plugins: [plugin] });

    t.equal(initCalled, true);
    t.equal(initSource, 'const x = 1');
    t.notEqual(initOptions, null);
  });

  it('should call plugin onNode hook for each node', () => {
    const visitedNodes: string[] = [];

    const plugin: Plugin = {
      name: 'test-onNode',
      onNode: (node) => {
        visitedNodes.push(node.type);
      },
    };

    parseSource('const x = 1', { plugins: [plugin] });

    t.deepEqual(visitedNodes, ['Identifier', 'Literal', 'VariableDeclarator', 'VariableDeclaration', 'Program']);
  });

  it('should call plugin finalize hook with AST', () => {
    let finalizeCalled = false;
    let finalAst: any = null;

    const plugin: Plugin = {
      name: 'test-finalize',
      finalize: (ast) => {
        finalizeCalled = true;
        finalAst = ast;
      },
    };

    const ast = parseSource('const x = 1', { plugins: [plugin] });

    t.equal(finalizeCalled, true);
    t.equal(finalAst, ast);
  });

  it('should support multiple plugins', () => {
    const plugin1Nodes: string[] = [];
    const plugin2Nodes: string[] = [];

    const plugin1: Plugin = {
      name: 'plugin-1',
      onNode: (node) => {
        plugin1Nodes.push(node.type);
      },
    };

    const plugin2: Plugin = {
      name: 'plugin-2',
      onNode: (node) => {
        plugin2Nodes.push(node.type);
      },
    };

    parseSource('const x = 1', { plugins: [plugin1, plugin2] });

    t.deepEqual(plugin1Nodes, plugin2Nodes);
    t.equal(plugin1Nodes.length > 0, true);
  });

  it('should provide parent node to onNode', () => {
    const parents: Array<string | null> = [];

    const plugin: Plugin = {
      name: 'test-parent',
      onNode: (node, parent) => {
        if (node.type === 'Identifier') {
          parents.push(parent ? parent.type : null);
        }
      },
    };

    parseSource('const x = 1', { plugins: [plugin] });

    t.equal(parents.length, 1);
    t.equal(parents[0], 'VariableDeclarator');
  });

  it('should allow plugin to throw errors from onNode', () => {
    const plugin: Plugin = {
      name: 'no-const',
      onNode: (node) => {
        if (node.type === 'VariableDeclaration' && node.kind === 'const') {
          throw new SyntaxError('const declarations are not allowed');
        }
      },
    };

    t.throws(() => parseSource('const x = 1', { plugins: [plugin] }), /const declarations are not allowed/);
  });

  it('should not call onNode for comments', () => {
    const visitedNodes: string[] = [];

    const plugin: Plugin = {
      name: 'test-no-comments',
      onNode: (node) => {
        visitedNodes.push(node.type);
      },
    };

    parseSource('// comment\nconst x = 1', { plugins: [plugin] });

    t.equal(visitedNodes.includes('Comment'), false);
  });

  it('should work with JSX when enabled', () => {
    const jsxNodes: string[] = [];

    const plugin: Plugin = {
      name: 'jsx-onNode',
      onNode: (node) => {
        if (node.type.startsWith('JSX')) {
          jsxNodes.push(node.type);
        }
      },
    };

    parseSource('const x = <div>Hello</div>', {
      plugins: [plugin],
      jsx: true,
    });

    t.equal(jsxNodes.length > 0, true);
    t.equal(jsxNodes.includes('JSXElement'), true);
  });

  it('should work with all hooks combined', () => {
    let initCalled = false;
    let onNodeCallCount = 0;
    let finalizeCalled = false;

    const plugin: Plugin = {
      name: 'full-plugin',
      init: () => {
        initCalled = true;
      },
      onNode: () => {
        onNodeCallCount++;
      },
      finalize: () => {
        finalizeCalled = true;
      },
    };

    parseSource('const x = 1', { plugins: [plugin] });

    t.equal(initCalled, true);
    t.equal(onNodeCallCount > 0, true);
    t.equal(finalizeCalled, true);
  });
});

describe('Miscellaneous - plugin error handling', () => {
  it('should handle plugin init errors gracefully', () => {
    const plugin: Plugin = {
      name: 'error-init',
      init: () => {
        throw new Error('Init failed');
      },
    };

    t.throws(() => parseSource('const x = 1', { plugins: [plugin] }), /Init failed/);
  });

  it('should handle plugin onNode errors gracefully', () => {
    const plugin: Plugin = {
      name: 'error-onNode',
      onNode: () => {
        throw new Error('Visitor failed');
      },
    };

    t.throws(() => parseSource('const x = 1', { plugins: [plugin] }), /Visitor failed/);
  });

  it('should handle plugin finalize errors gracefully', () => {
    const plugin: Plugin = {
      name: 'error-finalize',
      finalize: () => {
        throw new Error('Finalize failed');
      },
    };

    t.throws(() => parseSource('const x = 1', { plugins: [plugin] }), /Finalize failed/);
  });
});

describe('Miscellaneous - plugin with valid syntax', () => {
  it('should parse const declaration with noop plugin', () => {
    const ast = parseSource('const x = 1', {
      plugins: [
        {
          name: 'noop',
          onNode: () => {},
        },
      ],
    });

    t.equal(ast.type, 'Program');
    t.equal(ast.body.length, 1);
    t.equal(ast.body[0].type, 'VariableDeclaration');
    const varDecl = ast.body[0] as any;
    t.equal(varDecl.kind, 'const');
    t.equal(varDecl.declarations[0].id.name, 'x');
    t.equal(varDecl.declarations[0].init.value, 1);
  });

  it('should parse function with noop plugin', () => {
    const ast = parseSource('function foo() { return 42; }', {
      plugins: [
        {
          name: 'noop',
          onNode: () => {},
        },
      ],
    });

    t.equal(ast.type, 'Program');
    t.equal(ast.body.length, 1);
    t.equal(ast.body[0].type, 'FunctionDeclaration');
    const funcDecl = ast.body[0] as any;
    t.equal(funcDecl.id.name, 'foo');
    t.equal(funcDecl.body.type, 'BlockStatement');
    t.equal(funcDecl.body.body[0].type, 'ReturnStatement');
    t.equal(funcDecl.body.body[0].argument.value, 42);
  });

  it('should parse class with noop plugin', () => {
    const ast = parseSource('class MyClass { method() {} }', {
      plugins: [
        {
          name: 'noop',
          onNode: () => {},
        },
      ],
    });

    t.equal(ast.type, 'Program');
    t.equal(ast.body.length, 1);
    t.equal(ast.body[0].type, 'ClassDeclaration');
    const classDecl = ast.body[0] as any;
    t.equal(classDecl.id.name, 'MyClass');
    t.equal(classDecl.body.type, 'ClassBody');
    t.equal(classDecl.body.body.length, 1);
    t.equal(classDecl.body.body[0].type, 'MethodDefinition');
    t.equal(classDecl.body.body[0].key.name, 'method');
  });
});

describe('Miscellaneous - plugin with validation', () => {
  it('should throw ParseError for const with no-const plugin', () => {
    let error: any = null;
    try {
      parseSource('const x = 1', {
        plugins: [
          {
            name: 'no-const',
            onNode: (node) => {
              if (node.type === 'VariableDeclaration' && node.kind === 'const') {
                throw new SyntaxError('const not allowed');
              }
            },
          },
        ],
      });
    } catch (e) {
      error = e;
    }

    t.notEqual(error, null);
    t.equal(error instanceof ParseError, true);
    t.equal(error.description, 'const not allowed');
  });

  it('should throw ParseError for arrow function with no-arrow plugin', () => {
    let error: any = null;
    try {
      parseSource('x => x', {
        plugins: [
          {
            name: 'no-arrow',
            onNode: (node) => {
              if (node.type === 'ArrowFunctionExpression') {
                throw new SyntaxError('arrow functions not allowed');
              }
            },
          },
        ],
      });
    } catch (e) {
      error = e;
    }

    t.notEqual(error, null);
    t.equal(error instanceof ParseError, true);
    t.equal(error.description, 'arrow functions not allowed');
  });
});
