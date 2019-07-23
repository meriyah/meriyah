import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('src/lexer/scan', () => {
  describe('#scanSingleToken()', () => {
    it('should return EOF if the input is empty', () => {
      const state = create('', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise comments', () => {
      const state = create('// this is a comment', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise arithmetic operators', () => {
      const state = create('+-*/', '', undefined);
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
      const state = create('>= <=', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.GreaterThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LessThanOrEqual);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should evaluate to "0"', () => {
      const state = create('0..toString()', '', undefined);
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
      const state = create('while (foo) { 1; } ', '', undefined);
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
      const state = create('    \n\t\r  \r \n \t  +', '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.Add);
    });
    it('should recognise single character numbers', () => {
      const src = '3';
      const state = create(src, '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.NumericLiteral);
      t.deepEqual(state.tokenValue, src);
    });
    it('should recognise multi character numbers', () => {
      const src = '345';
      const state = create(src, '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.NumericLiteral);
      t.deepEqual(state.tokenValue, src);
    });
    // tslint:disable quotemark
    it('should recognise strings', () => {
      const state = create("'hello'", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, 'hello');
    });
    it('should recognise empty strings', () => {
      const state = create("''", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, '');
    });
    it('should recognise valid escape sequences.', () => {
      const state = create("'\\\\ \\n \\t \\r \\' \\b \\f \\v \\0'", '', undefined);
      const token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(state.tokenValue, "\\ \n \t \r ' \b \f \v \0");
    });
    it('should throw on unterminated string literals', () => {
      const state = create("'abdc", '', undefined);
      t.throws(() => scanSingleToken(state, Context.None, 0));
    });
    // tslint:enable quotemark
    it('should recognise keywords', () => {
      const state = create('let const', '', undefined);
      let token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.LetKeyword);
      token = scanSingleToken(state, Context.None, 0);
      t.deepEqual(token, Token.ConstKeyword);
    });
    it('should recognise identifiers', () => {
      const state = create('test _test a1', '', undefined);
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
      const state = create('€', '', undefined);
      t.throws(() => scanSingleToken(state, Context.None, 0));
    });
  });
});
