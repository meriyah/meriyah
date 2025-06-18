import { describe, it, expect } from 'vitest';
import { codeFrameColumns } from '@babel/code-frame';
import { parseSource, type Options } from '../src/parser';
import { Context } from '../src/common';
import { ParseError } from '../src/errors';

const IS_CI = Boolean(process.env.CI);

export const serializeParserError = (code: string, error: unknown) => {
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

export const pass = (
  name: string,
  valid: (string | { code: string; options?: Options; context?: Context; only?: true })[],
): void => {
  describe(name, () => {
    for (let testCase of valid) {
      if (typeof testCase === 'string') {
        testCase = { code: testCase };
      }

      const { code, options, context, only } = testCase;

      if (IS_CI && only) {
        throw new Error(`Please remove 'only'.`);
      }

      // https://github.com/vitest-dev/vitest/issues/8151
      const title = code.replaceAll('\r', '␍␊');
      (only ? it.only : it)(title, () => {
        const parseResult = parseSource(code, options, context ?? Context.None);
        expect(parseResult).toMatchSnapshot();
      });
    }
  });
};

export const fail = (name: string, invalid: [string, Context][]): void => {
  describe(name, () => {
    for (const [source, ctx] of invalid) {
      it(source, () => {
        let error;
        try {
          parseSource(source, undefined, ctx);
        } catch (parseError) {
          error = parseError;
        }

        if (!error) {
          throw new Error('Expect a ParserError thrown');
        }

        expect(serializeParserError(source, error)).toMatchSnapshot();
      });
    }
  });
};
