import * as t from 'node:assert/strict';
import * as acorn from 'acorn';
import acornJsx from 'acorn-jsx';
import jsxTestSuite from 'jsx-test-suite';
import { it } from 'vitest';
import type * as ESTree from '../../src/estree';
import * as meriyah from '../../src/meriyah.ts';
import { visitNode } from '../test-utils.ts';

const { TEST_JSX_FILE } = process.env;

const notAlignedTests: Set<string> = new Set([]);

it(
  'AST alignment with Acorn (JSX)',
  () => {
    let testCases = jsxTestSuite;
    if (TEST_JSX_FILE) {
      testCases = testCases.filter(({ name }) => name === TEST_JSX_FILE);
      t.equal(testCases.length, 1);
    }

    for (const testCase of testCases) {
      runTest(testCase);
    }
  },
  Infinity,
);

function runTest(testCase: (typeof jsxTestSuite)[number]) {
  let acornAst: MeriyahAst;
  try {
    acornAst = parseAcorn(testCase.input);
  } catch (error) {
    if (error instanceof SyntaxError && 'loc' in error) {
      return;
    }
    throw error;
  }

  const meriyahAst = parseMeriyah(testCase.input);

  const isNotAlignedTest = notAlignedTests.has(testCase.name);

  try {
    t.deepEqual(meriyahAst, acornAst);

    if (isNotAlignedTest) {
      console.log(`'${testCase.name}' now have the same AST shape as Acorn, please remove from the 'notAlignedTests'.`);
    }
  } catch (error) {
    if (isNotAlignedTest) {
      return;
    }

    if (!TEST_JSX_FILE)
      console.log(
        `Test faild, use this commmand to debug\n$ TEST_JSX_FILE=${testCase.name} npx vitest test/test262-parser-tests/ast-alignment-test.ts`,
      );
    console.error(testCase);
    throw error;
  }
}

type MeriyahAst = ESTree.Program & { comments: ESTree.Comment[] };
function parseMeriyah(text: string) {
  const comments: ESTree.Comment[] = [];
  const ast = meriyah.parse(text, {
    webcompat: true,
    lexical: true,
    next: true,
    ranges: true,
    loc: true,
    raw: true,
    onComment: comments,
    preserveParens: true,
    jsx: true,
  }) as MeriyahAst;

  ast.comments = comments;
  return ast;
}

type AcornAst = acorn.Program & { comments: acorn.Comment[] };
let acornParser;
function parseAcorn(text: string) {
  acornParser ??= acorn.Parser.extend(acornJsx());

  const comments: acorn.Comment[] = [];
  const ast = acorn.parse(text, {
    ecmaVersion: 'latest',
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
      case 'Line': {
        const type = getSingleLineCommentType(node as acorn.Comment, text);
        return Object.assign(node, { type });
      }
    }

    return node;
  });
}
