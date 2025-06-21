import * as acorn from 'acorn';
import getTest262Fixtures from '../../test262/get-test262-fixtures.mjs';
import * as meriyah from '../../src/meriyah';
import type * as ESTree from '../../src/estree';
import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';

const { TEST262_FILE } = process.env;

describe(
  'AST alignment with Acorn',
  async () => {
    for await (const testCase of getTest262Fixtures(TEST262_FILE ? [TEST262_FILE] : undefined)) {
      it(`test/test262/test262/test/${testCase.file}`, () => {
        let acornAst: MeriyahAst;
        try {
          acornAst = parseAcorn(testCase.contents, testCase.sourceType);
        } catch (error) {
          if (error instanceof SyntaxError && 'loc' in error) {
            return;
          }

          throw error;
        }

        const meriyahAst = parseMeriyah(testCase.contents, testCase.sourceType);
        try {
          t.deepEqual(meriyahAst, acornAst);
        } catch (error) {
          if (!TEST262_FILE)
            console.log(
              `Test faild, use this commmand to debug\n$ TEST262_FILE=${testCase.file} npx vitest test/test262-parser-tests/ast-alignment-test.ts`,
            );
          console.error(testCase);
          throw error;
        }
      });
    }
  },
  Infinity,
);

type MeriyahAst = ESTree.Program & { comments: ESTree.Comment[] };
function parseMeriyah(text: string, sourceType: 'module' | 'script' | undefined) {
  const comments: ESTree.Comment[] = [];
  const ast = meriyah.parse(text, {
    webcompat: true,
    lexical: true,
    next: true,
    module: sourceType === 'module',
    ranges: true,
    loc: true,
    raw: true,
    onComment: comments,
  }) as MeriyahAst;

  ast.comments = comments;
  return ast;
}

type AcornAst = acorn.Program & { comments: acorn.Comment[] };
function parseAcorn(text: string, sourceType: acorn.Options['sourceType'] = 'script') {
  const comments: acorn.Comment[] = [];
  const ast = acorn.parse(text, {
    ecmaVersion: 'latest',
    sourceType,
    locations: true,
    ranges: true,
    onComment: comments,
  }) as AcornAst;

  ast.comments = comments;

  return fixAcornAst(ast, text);
}

const getSingleLineCommentType = (comment: acorn.Comment, text: string): ESTree.CommentType => {
  const firstThreeCharacters = text.slice(comment.start, comment.start + 3);

  if (firstThreeCharacters === '-->') {
    return 'HTMLClose';
  }

  if (firstThreeCharacters === '<--') {
    return 'HTMLOpen';
  }

  const firstTwoCharacters = firstThreeCharacters.slice(0, -1);

  if (firstTwoCharacters === '#!') {
    return 'HashbangComment';
  }

  return 'SingleLine';
};

function fixAcornAst(ast: acorn.Program, text: string): MeriyahAst {
  return visitNode(ast, (node: Record<string, any>) => {
    // Convert to plain object
    node = {
      ...node,
      loc: { start: { ...node.loc!.start }, end: { ...node.loc!.end } },
    };

    switch (node.type) {
      case 'Block':
        return Object.assign(node, { type: 'MultiLine' });
      case 'Line': {
        const type = getSingleLineCommentType(node as acorn.Comment, text);
        return Object.assign(node, { type });
      }
      case 'FunctionExpression':
      case 'FunctionDeclaration':
        if (node.expression === false) {
          delete node.expression;
        }
        return node;
      case 'ArrowFunctionExpression':
        if (node.id === null) {
          delete node.id;
        }
        return node;
      case 'ClassExpression':
      case 'ClassDeclaration':
      case 'AccessorProperty':
      case 'PropertyDefinition':
      case 'MethodDefinition':
        if (!('decorators' in node)) {
          node.decorators = [];
        }
        return node;
    }

    return node;
  });

  return ast;
}

function visitNode(node: any, fn: any) {
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      node[i] = visitNode(node[i], fn);
    }
    return node;
  }

  if (typeof node?.type !== 'string') {
    return node;
  }

  const keys = Object.keys(node);
  for (let i = 0; i < keys.length; i++) {
    node[keys[i]] = visitNode(node[keys[i]], fn);
  }

  return fn(node) ?? node;
}
