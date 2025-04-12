import { describe, it, expect } from 'bun:test';
import { decodeHTMLStrict } from '../../src/lexer/decodeHTML';

describe('decodeHTMLStrict', () => {
  it('decode named character', () => {
    expect(decodeHTMLStrict('&amp;')).toBe('&');
    expect(decodeHTMLStrict('&ampa')).toBe('&ampa');
    expect(decodeHTMLStrict('&amp;a')).toBe('&a');
  });

  it('decode decimal numeric character', () => {
    expect(decodeHTMLStrict('&#38;')).toBe('&');
    expect(decodeHTMLStrict('&#38a')).toBe('&#38a');
    expect(decodeHTMLStrict('&#38;a')).toBe('&a');
  });

  it('decode hexadecimal numeric character', () => {
    expect(decodeHTMLStrict('&#x26;')).toBe('&');
    expect(decodeHTMLStrict('&#x26a')).toBe('&#x26a');
    expect(decodeHTMLStrict('&#x26;a')).toBe('&a');
  });
});
