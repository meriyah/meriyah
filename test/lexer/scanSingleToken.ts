import * as t from 'node:assert/strict';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { Parser } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('src/lexer/scan', () => {
  describe('#scanSingleToken()', () => {
    it('should return EOF if the input is empty', () => {
      const state = new Parser('', '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise comments', () => {
      const state = new Parser('// this is a comment', '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise arithmetic operators', () => {
      const state = new Parser('+-*/', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Add);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Subtract);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Multiply);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Divide);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise multi character operators', () => {
      const state = new Parser('>= <=', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.GreaterThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LessThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should evaluate to "0"', () => {
      const state = new Parser('0..toString()', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.NumericLiteral);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Period);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(state.tokenValue, 'toString');
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LeftParen);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.RightParen);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise a simple statement', () => {
      const state = new Parser('while (foo) { 1; } ', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(state.tokenValue, 'while');
      t.deepEqual(token, Token.WhileKeyword);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LeftParen);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(state.tokenValue, 'foo');
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.RightParen);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LeftBrace);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(state.tokenValue, 1);
      t.deepEqual(token, Token.NumericLiteral);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Semicolon);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.RightBrace);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });

    it('should skip any whitespace', () => {
      const state = new Parser('    \n\t\r  \r \n \t  +', '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Add);
    });
    it('should recognize single character numbers', () => {
      const src = '3';
      const state = new Parser(src, '');
      const token = scanSingleToken(state, Context.None, 0);
      t.equal(token, Token.NumericLiteral);
      t.equal(state.tokenValue, Number(src));
    });
    it('should recognize multi character numbers', () => {
      const src = '345';
      const state = new Parser(src, '');
      const token = scanSingleToken(state, Context.None, 0);
      t.equal(token, Token.NumericLiteral);
      t.equal(state.tokenValue, Number(src));
    });
    // tslint:disable quotemark
    it('should recognise strings', () => {
      const state = new Parser("'hello'", '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, 'hello');
    });
    it('should recognise empty strings', () => {
      const state = new Parser("''", '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, '');
    });
    it('should recognise valid escape sequences.', () => {
      const state = new Parser(String.raw`'\\ \n \t \r \' \b \f \v \0'`, '');
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, "\\ \n \t \r ' \b \f \v \0");
    });
    it('should throw on unterminated string literals', () => {
      const state = new Parser("'abdc", '');
      t.throws(() => scanSingleToken(state, Context.None, 0));
    });
    // tslint:enable quotemark
    it('should recognise keywords', () => {
      const state = new Parser('let const', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LetKeyword);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.ConstKeyword);
    });
    it('should recognise identifiers', () => {
      const state = new Parser('test _test a1', '');
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(state.tokenValue, 'test');
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(state.tokenValue, '_test');
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(state.tokenValue, 'a1');
    });
    it('should report an unknown character for anything else', () => {
      const state = new Parser('€', '');
      t.throws(() => scanSingleToken(state, Context.None, 0));
    });
  });
});
