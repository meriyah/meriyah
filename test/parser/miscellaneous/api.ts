import * as t from 'assert';
import { parseModule, parseScript, parse } from '../../../src/grumpy';

describe('Expressions - API', () => {
  it('should parse script code with "parse"', () => {
    t.deepEqual(
      parse('foo', {
        loc: true,
        globalAwait: true,
        globalReturn: true,
        ranges: true,
        webCompat: true,
        module: true
      }),
      {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'Identifier',
              name: 'foo',
              start: 0,
              end: 3
            },
            start: 0,
            end: 3
          }
        ],
        start: 0,
        end: 3
      }
    );
  });

  it('should parse script code', () => {
    t.deepEqual(parseScript('foo'), {
      body: [
        {
          expression: {
            name: 'foo',
            type: 'Identifier'
          },
          type: 'ExpressionStatement'
        }
      ],
      sourceType: 'script',
      type: 'Program'
    });
  });
  it('should parse module code with directive node', () => {
    t.deepEqual(parseModule('1', { directives: true }), {
      body: [
        {
          expression: {
            raw: '1',
            type: 'Literal',
            value: 1
          },
          type: 'ExpressionStatement'
        }
      ],
      sourceType: 'module',
      type: 'Program'
    });
  });

  it('should parse module code with directive node and strict directive', () => {
    t.deepEqual(parseModule('"use strict"; 1', { directives: true }), {
      type: 'Program',
      sourceType: 'module',
      body: [
        {
          type: 'ExpressionStatement',
          directive: 'use strict',
          expression: {
            type: 'Literal',
            value: 'use strict',
            raw: '"use strict"'
          }
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'Literal',
            value: 1,
            raw: '1'
          }
        }
      ]
    });
  });

  it('should parse module code', () => {
    t.deepEqual(parseModule('foo'), {
      body: [
        {
          expression: {
            name: 'foo',
            type: 'Identifier'
          },
          type: 'ExpressionStatement'
        }
      ],
      sourceType: 'module',
      type: 'Program'
    });
  });

  it('should parse with impliedStrict and shebang option', () => {
    t.deepEqual(
      parseScript('foo', {
        impliedStrict: true,
        next: true
      }),
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'script',
        type: 'Program'
      }
    );
  });

  it('should parse with raw option', () => {
    t.deepEqual(
      parseModule('foo', {
        raw: true
      }) as any,
      {
        body: [
          {
            expression: {
              name: 'foo',
              type: 'Identifier'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    );
  });

  it('should parse with raw option - string', () => {
    t.deepEqual(
      parseModule('"a"', {
        raw: true
      }) as any,
      {
        body: [
          {
            expression: {
              type: 'Literal',
              raw: '"a"',
              value: 'a'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    );
  });

  it('should parse with globalReturn option', () => {
    t.deepEqual(
      parseModule('return', {
        globalReturn: true,
        next: true
      }) as any,
      {
        body: [
          {
            argument: null,
            type: 'ReturnStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    );
  });

  it('should parse with directive option', () => {
    t.deepEqual(
      parseModule('"abc"', {
        directives: true,
        next: true
      }) as any,
      {
        body: [
          {
            directive: 'abc',
            expression: {
              type: 'Literal',
              raw: '"abc"',
              value: 'abc'
            },
            type: 'ExpressionStatement'
          }
        ],
        sourceType: 'module',
        type: 'Program'
      }
    );
  });
});
