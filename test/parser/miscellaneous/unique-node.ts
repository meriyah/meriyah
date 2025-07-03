import { describe, expect, it } from 'vitest';
import type * as ESTree from '../../../src/estree';
import { parseSource } from '../../../src/parser';

const assertPropety = (property: ESTree.Property) => {
  expect(property.type).toBe('Property');
  expect(property.shorthand).toBe(true);
  expect(property.key).toEqual(property.value);
  expect(property.key).not.toBe(property.value);
  expect(property.key.range).not.toBe(property.value.range);
  expect(property.key.loc).not.toBe(property.value.loc);
};

describe('Unique node', () => {
  it('ObjectExpression', () => {
    const ast = parseSource('({a})', { uniqueKeyInPattern: true, loc: true, ranges: true });
    const declaration = ast.body[0] as ESTree.ExpressionStatement;
    const object = declaration.expression as ESTree.ObjectExpression;
    const property = object.properties[0] as ESTree.Property;
    assertPropety(property);
  });

  it('ObjectPattern', () => {
    const ast = parseSource('const {a} = {}', { uniqueKeyInPattern: true, loc: true, ranges: true });
    const declaration = ast.body[0] as ESTree.VariableDeclaration;
    const pattern = declaration.declarations[0].id as ESTree.ObjectPattern;
    const property = pattern.properties[0] as ESTree.Property;
    assertPropety(property);
  });
});
