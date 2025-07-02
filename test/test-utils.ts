import { codeFrameColumns } from '@babel/code-frame';
import { describe, expect, it } from 'vitest';
import { Context } from '../src/common';
import { ParseError } from '../src/errors';
import { type Options } from '../src/options';
import { parseSource } from '../src/parser';

const IS_CI = Boolean(process.env.CI);
// https://github.com/vitest-dev/vitest/issues/8151
const toTestTile = (code: string) => code.replaceAll('\r', '␍␊');

type NormalizedTestCase = { code: string; options?: Options; context?: Context; only?: true };
type TestCase = string | NormalizedTestCase;

const serializeParserError = (code: string, error: unknown) => {
  if (!(error instanceof ParseError)) {
    throw error;
  }

  const {
    message,
    loc: { start, end },
    description,
  } = error;

  const codeFrame = codeFrameColumns(
    code,
    {
      start: { line: start.line, column: start.column + 1 },
      end: { line: end.line, column: end.column + 1 },
    },
    { highlightCode: false, message: description },
  );

  return `${error.name} ${message}\n${codeFrame}`;
};

function runTests(testCases: TestCase[], callback: (testCase: NormalizedTestCase) => void) {
  for (let testCase of testCases) {
    if (typeof testCase === 'string') {
      testCase = { code: testCase };
    }

    const { code, only } = testCase;

    if (IS_CI && only) {
      throw new Error("Please remove 'only'.");
    }

    // https://github.com/vitest-dev/vitest/issues/8151
    (only ? it.only : it)(toTestTile(code), () => {
      callback(testCase);
    });
  }
}

export const pass = (name: string, testCases: TestCase[]) => {
  describe(name, () => {
    runTests(testCases, ({ code, options, context }) => {
      const parseResult = parseSource(code, options, context ?? Context.None);
      expect(parseResult).toMatchSnapshot();
    });
  });
};

export const fail = (name: string, testCases: TestCase[]) => {
  describe(name, () => {
    runTests(testCases, ({ code, options, context }) => {
      let error;
      try {
        parseSource(code, options, context ?? Context.None);
      } catch (parseError) {
        error = parseError;
      }

      if (!error) {
        throw new Error('Expect a ParserError thrown');
      }

      expect(serializeParserError(code, error)).toMatchSnapshot();
    });
  });
};
