import * as t from 'node:assert/strict';
import * as acorn from 'acorn';
import { it } from 'vitest';
import type * as ESTree from '../../src/estree';
import * as meriyah from '../../src/meriyah';
import getTest262Fixtures, { type TestCase } from '../../test262/get-test262-fixtures.mjs';

const { TEST262_FILE } = process.env;

const notAlignedTests = new Set([
  // https://github.com/meriyah/meriyah/issues/460
  'language/expressions/template-literal/tv-line-continuation.js',
  'language/expressions/template-literal/tv-line-terminator-sequence.js',
  'built-ins/String/raw/special-characters.js',

  // https://github.com/meriyah/meriyah/issues/475
  'staging/sm/Function/function-name-computed-01.js',
  'staging/sm/Function/function-name-computed-02.js',
]);

it(
  'AST alignment with Acorn',
  async () => {
    // For some unknown reason, can't run tests directly inside the `for..await..of` loop
    const tests = [];
    for await (const testCase of getTest262Fixtures(TEST262_FILE ? [TEST262_FILE] : undefined)) {
      tests.push(testCase);
    }

    if (TEST262_FILE) {
      t.equal(tests.length, 1);
    }

    for (const testCase of tests) {
      runTest(testCase);
    }
  },
  Infinity,
);

function runTest(testCase: TestCase) {
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

  const isNotAlignedTest = notAlignedTests.has(testCase.file);

  try {
    t.deepEqual(meriyahAst, acornAst);

    if (isNotAlignedTest) {
      console.log(`'${testCase.file}' now have the same AST shape as Acorn, please remove from the 'notAlignedTests'.`);
    }
  } catch (error) {
    if (isNotAlignedTest) {
      return;
    }

    if (!TEST262_FILE)
      console.log(
        `Test faild, use this commmand to debug\n$ TEST262_FILE=${testCase.file} npx vitest test/test262-parser-tests/ast-alignment-test.ts`,
      );
    console.error(testCase);
    throw error;
  }
}

type MeriyahAst = ESTree.Program & { comments: ESTree.Comment[] };
function parseMeriyah(text: string, sourceType: 'module' | 'script') {
  const comments: ESTree.Comment[] = [];
  const ast = meriyah.parse(text, {
    sourceType,
    webcompat: true,
    lexical: true,
    next: true,
    ranges: true,
    loc: true,
    raw: true,
    onComment: comments,
    preserveParens: true,
  }) as MeriyahAst;

  ast.comments = comments;
  return ast;
}

type AcornAst = acorn.Program & { comments: acorn.Comment[] };
function parseAcorn(text: string, sourceType: acorn.Options['sourceType']) {
  const comments: acorn.Comment[] = [];
  const ast = acorn.parse(text, {
    ecmaVersion: 'latest',
    sourceType,
    locations: true,
    ranges: true,
    onComment: comments,
    preserveParens: true,
  }) as AcornAst;

  ast.comments = comments;

  return fixAcornAst(ast, text);
}

const getSingleLineCommentType = (comment: acorn.Comment, text: string): ESTree.CommentType => {
  const firstFourCharacters = text.slice(comment.start, comment.start + 4);

  if (firstFourCharacters === '<!--') {
    return 'HTMLOpen';
  }

  const firstThreeCharacters = firstFourCharacters.slice(0, -1);

  if (firstThreeCharacters === '-->') {
    return 'HTMLClose';
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
        // Depreacted property https://github.com/acornjs/acorn/pull/1361
        if (node.expression === false) {
          delete node.expression;
        }
        return node;
      case 'ArrowFunctionExpression':
        // Not in ESTree
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
