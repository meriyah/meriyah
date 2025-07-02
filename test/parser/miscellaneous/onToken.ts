import * as t from 'node:assert/strict';
import { describe, it } from 'vitest';
import { type SourceLocation } from '../../../src/estree';
import { parseSource } from '../../../src/parser';
import { type Token } from '../../../src/token';

describe('Miscellaneous - onToken', () => {
  it('tokenize braces using array', () => {
    const tokens: Token[] = [];
    parseSource('{}', {
      onToken: tokens,
    });
    t.deepEqual(tokens, [
      {
        token: 'Punctuator',
      },
      {
        token: 'Punctuator',
      },
    ]);
  });

  it('tokenize braces using array with ranges', () => {
    const tokens: Token[] = [];
    parseSource('{}', {
      onToken: tokens,
      ranges: true,
    });
    t.deepEqual(tokens, [
      {
        end: 1,
        start: 0,
        range: [0, 1],
        token: 'Punctuator',
      },
      {
        end: 2,
        start: 1,
        range: [1, 2],
        token: 'Punctuator',
      },
    ]);
  });

  it('tokenize braces using array with ranges and loc', () => {
    const tokens: Token[] = [];
    parseSource('{}', {
      onToken: tokens,
      ranges: true,
      loc: true,
    });
    t.deepEqual(tokens, [
      {
        end: 1,
        start: 0,
        range: [0, 1],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 1 },
        },
        token: 'Punctuator',
      },
      {
        end: 2,
        start: 1,
        range: [1, 2],
        loc: {
          start: { line: 1, column: 1 },
          end: { line: 1, column: 2 },
        },
        token: 'Punctuator',
      },
    ]);
  });

  it('tokenize boolean using function', () => {
    let onTokenCount = 0;
    parseSource('// c\nfalse', {
      onToken: function (token: string, start: number, end: number, loc: SourceLocation) {
        t.deepEqual(token, 'BooleanLiteral');
        t.deepEqual(start, 5);
        t.deepEqual(end, 10);
        t.deepEqual(loc, {
          start: { line: 2, column: 0 },
          end: { line: 2, column: 5 },
        });
        onTokenCount++;
      },
      loc: true,
    });
    t.equal(onTokenCount, 1);
  });

  it('tokenize template literal', () => {
    const tokens: any[] = [];
    const source = 'var a = `${a}b${c}d`;';
    parseSource(source, {
      onToken(token: string, start: number, end: number) {
        tokens.push({
          token,
          start,
          end,
          value: source.slice(start, end),
        });
      },
    });
    t.deepEqual(tokens, [
      { token: 'Keyword', value: 'var', start: 0, end: 3 },
      { token: 'Identifier', value: 'a', start: 4, end: 5 },
      { token: 'Punctuator', value: '=', start: 6, end: 7 },
      { token: 'TemplateLiteral', value: '`${', start: 8, end: 11 },
      { token: 'Identifier', value: 'a', start: 11, end: 12 },
      { token: 'TemplateLiteral', value: '}b${', start: 12, end: 16 },
      { token: 'Identifier', value: 'c', start: 16, end: 17 },
      { token: 'TemplateLiteral', value: '}d`', start: 17, end: 20 },
      { token: 'Punctuator', value: ';', start: 20, end: 21 },
    ]);
  });

  it('tokenize jsx', () => {
    const tokens: any[] = [];
    const source = 'var a = <div>\ndemo {w}\n<a-b>hello</a-b><c /></div>;';
    parseSource(source, {
      jsx: true,
      onToken(token: string, start: number, end: number) {
        tokens.push({
          token,
          start,
          end,
          value: source.slice(start, end),
        });
      },
    });
    t.deepEqual(tokens, [
      { token: 'Keyword', start: 0, end: 3, value: 'var' },
      { token: 'Identifier', start: 4, end: 5, value: 'a' },
      { token: 'Punctuator', start: 6, end: 7, value: '=' },
      { token: 'Punctuator', start: 8, end: 9, value: '<' },
      { token: 'Identifier', start: 9, end: 12, value: 'div' },
      { token: 'Punctuator', start: 12, end: 13, value: '>' },
      { token: 'Punctuator', start: 13, end: 19, value: '\ndemo ' },
      { token: 'Punctuator', start: 19, end: 20, value: '{' },
      { token: 'Identifier', start: 20, end: 21, value: 'w' },
      { token: 'Punctuator', start: 21, end: 22, value: '}' },
      { token: 'Punctuator', start: 22, end: 23, value: '\n' },
      { token: 'Punctuator', start: 23, end: 24, value: '<' },
      { token: 'Identifier', start: 24, end: 27, value: 'a-b' },
      { token: 'Punctuator', start: 27, end: 28, value: '>' },
      { token: 'Punctuator', start: 28, end: 33, value: 'hello' },
      { token: 'Punctuator', start: 33, end: 34, value: '<' },
      { token: 'Punctuator', start: 34, end: 35, value: '/' },
      { token: 'Identifier', start: 35, end: 38, value: 'a-b' },
      { token: 'Punctuator', start: 38, end: 39, value: '>' },
      { token: 'Punctuator', start: 39, end: 40, value: '<' },
      { token: 'Identifier', start: 40, end: 41, value: 'c' },
      { token: 'Punctuator', start: 42, end: 43, value: '/' },
      { token: 'Punctuator', start: 43, end: 44, value: '>' },
      { token: 'Punctuator', start: 44, end: 45, value: '<' },
      { token: 'Punctuator', start: 45, end: 46, value: '/' },
      { token: 'Identifier', start: 46, end: 49, value: 'div' },
      { token: 'Punctuator', start: 49, end: 50, value: '>' },
      { token: 'Punctuator', start: 50, end: 51, value: ';' },
    ]);
  });

  it('tokenize jsx fragment', () => {
    const tokens: any[] = [];
    const source = 'var a = <>\ndemo {w}\n<a-b>hello</a-b><c /></>;';
    parseSource(source, {
      jsx: true,
      onToken(token: string, start: number, end: number) {
        tokens.push({
          token,
          start,
          end,
          value: source.slice(start, end),
        });
      },
    });
    t.deepEqual(tokens, [
      { token: 'Keyword', start: 0, end: 3, value: 'var' },
      { token: 'Identifier', start: 4, end: 5, value: 'a' },
      { token: 'Punctuator', start: 6, end: 7, value: '=' },
      { token: 'Punctuator', start: 8, end: 9, value: '<' },
      { token: 'Punctuator', start: 9, end: 10, value: '>' },
      { token: 'Punctuator', start: 10, end: 16, value: '\ndemo ' },
      { token: 'Punctuator', start: 16, end: 17, value: '{' },
      { token: 'Identifier', start: 17, end: 18, value: 'w' },
      { token: 'Punctuator', start: 18, end: 19, value: '}' },
      { token: 'Punctuator', start: 19, end: 20, value: '\n' },
      { token: 'Punctuator', start: 20, end: 21, value: '<' },
      { token: 'Identifier', start: 21, end: 24, value: 'a-b' },
      { token: 'Punctuator', start: 24, end: 25, value: '>' },
      { token: 'Punctuator', start: 25, end: 30, value: 'hello' },
      { token: 'Punctuator', start: 30, end: 31, value: '<' },
      { token: 'Punctuator', start: 31, end: 32, value: '/' },
      { token: 'Identifier', start: 32, end: 35, value: 'a-b' },
      { token: 'Punctuator', start: 35, end: 36, value: '>' },
      { token: 'Punctuator', start: 36, end: 37, value: '<' },
      { token: 'Identifier', start: 37, end: 38, value: 'c' },
      { token: 'Punctuator', start: 39, end: 40, value: '/' },
      { token: 'Punctuator', start: 40, end: 41, value: '>' },
      { token: 'Punctuator', start: 41, end: 42, value: '<' },
      { token: 'Punctuator', start: 42, end: 43, value: '/' },
      { token: 'Punctuator', start: 43, end: 44, value: '>' },
      { token: 'Punctuator', start: 44, end: 45, value: ';' },
    ]);
  });

  it('tokenize jsx with gaps', () => {
    const tokens: any[] = [];
    const source = '<\na>< /a\n>';
    parseSource(source, {
      jsx: true,
      onToken(token: string, start: number, end: number) {
        tokens.push({
          token,
          start,
          end,
          value: source.slice(start, end),
        });
      },
    });
    t.deepEqual(tokens, [
      { token: 'Punctuator', start: 0, end: 1, value: '<' },
      { token: 'Identifier', start: 2, end: 3, value: 'a' },
      { token: 'Punctuator', start: 3, end: 4, value: '>' },
      { token: 'Punctuator', start: 4, end: 5, value: '<' },
      { token: 'Punctuator', start: 6, end: 7, value: '/' },
      { token: 'Identifier', start: 7, end: 8, value: 'a' },
      { token: 'Punctuator', start: 9, end: 10, value: '>' },
    ]);
  });

  it('tokenize jsx with comments', () => {
    const tokens: any[] = [];
    const source = '<// lorem\na>< /* mm */ / /* xx */ a\n>';
    parseSource(source, {
      jsx: true,
      onToken(token: string, start: number, end: number) {
        tokens.push({
          token,
          start,
          end,
          value: source.slice(start, end),
        });
      },
    });
    t.deepEqual(tokens, [
      { token: 'Punctuator', start: 0, end: 1, value: '<' },
      { token: 'Identifier', start: 10, end: 11, value: 'a' },
      { token: 'Punctuator', start: 11, end: 12, value: '>' },
      { token: 'Punctuator', start: 12, end: 13, value: '<' },
      { token: 'Punctuator', start: 23, end: 24, value: '/' },
      { token: 'Identifier', start: 34, end: 35, value: 'a' },
      { token: 'Punctuator', start: 36, end: 37, value: '>' },
    ]);
  });
});
