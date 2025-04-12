import * as t from 'node:assert/strict';
import { decodeHTMLStrict } from '../../src/lexer/decodeHTML';

describe('decodeHTMLStrict', () => {
  it('decode named character', () => {
    t.strictEqual(decodeHTMLStrict('&amp;'), '&');
    t.strictEqual(decodeHTMLStrict('&ampa'), '&ampa');
    t.strictEqual(decodeHTMLStrict('&amp;a'), '&a');
  });

  it('decode decimal numeric character', () => {
    t.strictEqual(decodeHTMLStrict('&#38;'), '&');
    t.strictEqual(decodeHTMLStrict('&#38a'), '&#38a');
    t.strictEqual(decodeHTMLStrict('&#38;a'), '&a');
  });

  it('decode hexadecimal numeric character', () => {
    t.strictEqual(decodeHTMLStrict('&#x26;'), '&');
    t.strictEqual(decodeHTMLStrict('&#x26a'), '&#x26a');
    t.strictEqual(decodeHTMLStrict('&#x26;a'), '&a');
  });
});
