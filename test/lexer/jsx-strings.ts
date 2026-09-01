import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import type * as ESTree from '../../src/estree.ts';
import { parseSource } from '../../src/parser.ts';

function decodeJsxString(text: string): string {
  const ast = parseSource(`<>${text}</>`, { jsx: true });
  const expressionStatement = ast.body[0];
  t.ok(expressionStatement.type, 'ExpressionStatement');
  const jsxFragment = (expressionStatement as ESTree.ExpressionStatement).expression;
  t.ok(jsxFragment.type, 'JSXFragment');
  const [jsxText] = (jsxFragment as ESTree.JSXFragment).children;
  t.ok(jsxText.type, 'JSXText');
  return (jsxText as ESTree.JSXText).value;
}

describe('decodeJsxString', () => {
  it('decode named character', () => {
    t.equal(decodeJsxString('&amp;'), '&');
    t.equal(decodeJsxString('&ampa'), '&ampa');
    t.equal(decodeJsxString('&amp;a'), '&a');
  });

  it('decode non-named character', () => {
    t.equal(decodeJsxString('&constructor;'), '&constructor;');
    t.equal(decodeJsxString('&__proto__;'), '&__proto__;');
    t.equal(decodeJsxString('&toString;'), '&toString;');
  });

  it('decode decimal numeric character', () => {
    t.equal(decodeJsxString('&#38;'), '&');
    t.equal(decodeJsxString('&#38a'), '&#38a');
    t.equal(decodeJsxString('&#38;a'), '&a');
  });

  it('decode hexadecimal numeric character', () => {
    t.equal(decodeJsxString('&#x26;'), '&');
    t.equal(decodeJsxString('&#x26a'), '&#x26a');
    t.equal(decodeJsxString('&#x26;a'), '&a');
  });

  it('Should not decode HTML5 entries', () => {
    t.equal(decodeJsxString('&rbrace;'), '&rbrace;');
  });
});
