import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { Context } from '../../src/common';
import { scanSingleToken } from '../../src/lexer/scan';
import { Parser } from '../../src/parser/parser';
import { Token } from '../../src/token';

describe('src/lexer/scan', () => {
  describe('#scanSingleToken()', () => {
    it('should return EOF if the input is empty', () => {
      const parser = new Parser('');
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise comments', () => {
      const parser = new Parser('// this is a comment');
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise arithmetic operators', () => {
      const parser = new Parser('+-*/');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Add);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Subtract);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Multiply);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Divide);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise multi character operators', () => {
      const parser = new Parser('>= <=');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.GreaterThanOrEqual);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.LessThanOrEqual);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should evaluate to "0"', () => {
      const parser = new Parser('0..toString()');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.NumericLiteral);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Period);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(parser.tokenValue, 'toString');
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.LeftParen);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.RightParen);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });
    it('should recognise a simple statement', () => {
      const parser = new Parser('while (foo) { 1; } ');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(parser.tokenValue, 'while');
      t.deepEqual(token, Token.WhileKeyword);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.LeftParen);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(parser.tokenValue, 'foo');
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.RightParen);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.LeftBrace);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(parser.tokenValue, 1);
      t.deepEqual(token, Token.NumericLiteral);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Semicolon);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.RightBrace);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.EOF);
    });

    it('should skip any whitespace', () => {
      const parser = new Parser('    \n\t\r  \r \n \t  +');
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Add);
    });
    it('should recognize single character numbers', () => {
      const src = '3';
      const parser = new Parser(src);
      const token = scanSingleToken(parser, Context.None, 0);
      t.equal(token, Token.NumericLiteral);
      t.equal(parser.tokenValue, Number(src));
    });
    it('should recognize multi character numbers', () => {
      const src = '345';
      const parser = new Parser(src);
      const token = scanSingleToken(parser, Context.None, 0);
      t.equal(token, Token.NumericLiteral);
      t.equal(parser.tokenValue, Number(src));
    });
    // tslint:disable quotemark
    it('should recognise strings', () => {
      const parser = new Parser("'hello'");
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(parser.tokenValue, 'hello');
    });
    it('should recognise empty strings', () => {
      const parser = new Parser("''");
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(parser.tokenValue, '');
    });
    it('should recognise valid escape sequences.', () => {
      const parser = new Parser(String.raw`'\\ \n \t \r \' \b \f \v \0'`);
      const token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.StringLiteral);
      t.deepEqual(parser.tokenValue, "\\ \n \t \r ' \b \f \v \0");
    });
    it('should throw on unterminated string literals', () => {
      const parser = new Parser("'abdc");
      t.throws(() => scanSingleToken(parser, Context.None, 0));
    });
    // tslint:enable quotemark
    it('should recognise keywords', () => {
      const parser = new Parser('let const');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.LetKeyword);
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.ConstKeyword);
    });
    it('should recognise identifiers', () => {
      const parser = new Parser('test _test a1');
      let token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(parser.tokenValue, 'test');
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(parser.tokenValue, '_test');
      token = scanSingleToken(parser, Context.None, 0);
      t.deepEqual(token, Token.Identifier);
      t.deepEqual(parser.tokenValue, 'a1');
    });
    it('should report an unknown character for anything else', () => {
      const parser = new Parser('€');
      t.throws(() => scanSingleToken(parser, Context.None, 0));
    });
  });
});
