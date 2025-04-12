import { describe, it, expect } from 'bun:test';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('src/lexer/scan', () => {
  describe('#scanSingleToken()', () => {
    it('should return EOF if the input is empty', () => {
      const state = create('', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });
    it('should recognise comments', () => {
      const state = create('// this is a comment', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });
    it('should recognise arithmetic operators', () => {
      const state = create('+-*/', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Add);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Subtract);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Multiply);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Divide);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });
    it('should recognise multi character operators', () => {
      const state = create('>= <=', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.GreaterThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.LessThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });
    it('should evaluate to "0"', () => {
      const state = create('0..toString()', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.NumericLiteral);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Period);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Identifier);
      expect(state.tokenValue).toBe('toString');
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.LeftParen);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.RightParen);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });
    it('should recognise a simple statement', () => {
      const state = create('while (foo) { 1; } ', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(state.tokenValue).toBe('while');
      expect(token).toBe(Token.WhileKeyword);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.LeftParen);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Identifier);
      expect(state.tokenValue).toBe('foo');
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.RightParen);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.LeftBrace);
      token = scanSingleToken(state, Context.None, 0);
      expect(state.tokenValue).toBe(1);
      expect(token).toBe(Token.NumericLiteral);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Semicolon);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.RightBrace);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.EOF);
    });

    it('should skip any whitespace', () => {
      const state = create('    \n\t\r  \r \n \t  +', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Add);
    });
    it('should recognise single character numbers', () => {
      const src = '3';
      const state = create(src, '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.NumericLiteral);
      expect(state.tokenValue).toBe(parseInt(src, 10));
    });
    it('should recognise multi character numbers', () => {
      const src = '345';
      const state = create(src, '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.NumericLiteral);
      expect(state.tokenValue).toBe(parseInt(src, 10));
    });
    // tslint:disable quotemark
    it('should recognise strings', () => {
      const state = create("'hello'", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.StringLiteral);
      expect(state.tokenValue).toBe('hello');
    });
    it('should recognise empty strings', () => {
      const state = create("''", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.StringLiteral);
      expect(state.tokenValue).toBe('');
    });
    it('should recognise valid escape sequences.', () => {
      const state = create("'\\\\ \\n \\t \\r \\' \\b \\f \\v \\0'", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.StringLiteral);
      expect(state.tokenValue).toBe("\\ \n \t \r ' \b \f \v \0");
    });
    it('should throw on unterminated string literals', () => {
      const state = create("'abdc", '', undefined);
      expect(() => scanSingleToken(state, Context.None, 0)).toThrow();
    });
    // tslint:enable quotemark
    it('should recognise keywords', () => {
      const state = create('let const', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.LetKeyword);
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.ConstKeyword);
    });
    it('should recognise identifiers', () => {
      const state = create('test _test a1', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Identifier);
      expect(state.tokenValue).toBe('test');
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Identifier);
      expect(state.tokenValue).toBe('_test');
      token = scanSingleToken(state, Context.None, 0);
      expect(token).toBe(Token.Identifier);
      expect(state.tokenValue).toBe('a1');
    });
    it('should report an unknown character for anything else', () => {
      const state = create('€', '', undefined);
      expect(() => scanSingleToken(state, Context.None, 0)).toThrow();
    });
  });
});
