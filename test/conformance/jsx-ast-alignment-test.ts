import * as t from 'node:assert/strict';
import * as acorn from 'acorn';
import acornJsx from 'acorn-jsx';
import jsxTestSuite from 'jsx-test-suite';
import { it } from 'vitest';
import type * as ESTree from '../../src/estree.ts';
import * as meriyah from '../../src/meriyah.ts';
import { visitNode } from '../test-utils.ts';

const { TEST_JSX_FILE } = process.env;

const notAlignedTests: Set<string> = new Set([
  // `<A>foo&rbrace;</A>`. Meriyah decodes HTML entities in JSX text with the full
  // https://html.spec.whatwg.org/entities.json table, `acorn-jsx` uses a smaller
  // one, so entities that only exist in the full table (`&rbrace;`, `&AMP;`, ...)
  // stay raw in Acorn and are decoded here. That is deliberate, see
  // https://github.com/meriyah/meriyah/issues/133#issuecomment-770512949
  '0044-16f0.jsx',
]);

// How many of the `jsx-test-suite` cases are actually compared against Acorn.
// `runTest` silently skips every case Acorn cannot parse, so a `parseAcorn` that
// lost its JSX support skips all of them and this test passes while comparing
// nothing. `jsx-test-suite` is version pinned, so this is an exact number.
const EXPECTED_COMPARED_COUNT = 40;

let comparedCount = 0;

it(
  'AST alignment with Acorn (JSX)',
  () => {
    let testCases = jsxTestSuite;
    if (TEST_JSX_FILE) {
      testCases = testCases.filter(({ name }) => name === TEST_JSX_FILE);
      t.equal(testCases.length, 1);
    }

    comparedCount = 0;
    for (const testCase of testCases) {
      runTest(testCase);
    }

    if (!TEST_JSX_FILE) {
      t.equal(
        comparedCount,
        EXPECTED_COMPARED_COUNT,
        `Compared ${comparedCount} of ${testCases.length} 'jsx-test-suite' cases against Acorn, expected ${EXPECTED_COMPARED_COUNT}. ` +
          'Cases Acorn cannot parse are skipped, so a drop means Acorn is no longer parsing JSX and this test is comparing nothing.',
      );
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
  let passed;

  try {
    comparedCount++;
    t.deepEqual(meriyahAst, acornAst);
    passed = true;
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

  if (isNotAlignedTest && passed) {
    throw new Error(
      `'${testCase.name}' now have the same AST shape as Acorn, please remove from the 'notAlignedTests'.`,
    );
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
let acornParser: typeof acorn.Parser | undefined;
function parseAcorn(text: string) {
  acornParser ??= acorn.Parser.extend(acornJsx());

  const comments: acorn.Comment[] = [];
  const ast = acornParser.parse(text, {
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
      case 'ImportDeclaration':
      case 'ImportExpression':
        if (!('phase' in node)) {
          node.phase = null;
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
      case 'JSXOpeningFragment':
        // Not in ESTree, `acorn-jsx` adds them, Babel doesn't
        // https://github.com/react/jsx/blob/main/AST.md#jsx-fragment
        delete node.attributes;
        delete node.selfClosing;
        return node;
    }

    return node;
  });
}
