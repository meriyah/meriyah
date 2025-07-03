import * as t from 'node:assert/strict';
import { outdent } from 'outdent';
import { describe, it } from 'vitest';
import { parseSource } from '../../../src/parser';

describe('Miscellaneous - HTML Comments', () => {
  for (const arg of [
    '<!-- test --->',
    ';-->',
    outdent`
      ---*/
      -->
    `,
  ]) {
    it(`${arg}`, () => {
      t.throws(() => {
        parseSource(`${arg}`, { sourceType: 'module' });
      });
    });
  }

  for (const arg of [
    outdent`
      /*
      */ the comment should not include these characters, regardless of AnnexB extensions -->
    `,
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
    '<!-- test --->',
    '<!-- HTML comment (not ECMA)',
    '--> HTML comment',
    'x = -1 <!--x;',
    '<!--the comment extends to these characters',
    /*      '<!--',//*/
    //'/**/ /* second optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters',
    //'/* optional SingleLineDelimitedCommentSequence */-->the comment extends to these characters',
    '-->',
    '-->[0];',
    'Function("-->", "");',
    outdent`
      /*
      */-->
    `,
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
