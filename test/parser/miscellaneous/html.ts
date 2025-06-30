import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - HTML Comments', () => {
  for (const arg of [
    `<!-- test --->`,
    `;-->`,
    `---*/
-->`,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { module: true });
      });
    });
  }

  for (const arg of [
    `/*
    */ the comment should not include these characters, regardless of AnnexB extensions -->`,
    ';-->',
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`);
      });
    });
  }

  for (const arg of [
    // Babylon issue: https://github.com/babel/babel/issues/7802
    `<!-- test --->`,
    '<!-- HTML comment (not ECMA)',
    '--> HTML comment',
    'x = -1 <!--x;',
    '<!--the comment extends to these characters',
    /*      '<!--',//*/
    //'/**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters',
    //'/* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters',
    '-->',
    '-->[0];',
    `Function("-->", "");`,
    `/*
    */-->`,
    '0/*\n*/--> a comment',
    //'/* block comment */--> comment',
    //' \t /* block comment */  --> comment',
    //' \t --> comment',
    '<!-- foo',
    //'--> comment'
  ]) {
    it(`${arg}`, () => {
      t.doesNotThrow(() => {
        parseSource(`${arg}`, { webcompat: true });
      });
    });
  }
});
