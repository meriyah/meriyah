import { describe, expect, it } from 'vitest';
import type * as ESTree from '../../../src/estree';
import { parseSource } from '../../../src/parser';

const parseOption = { source: 'foo.js', uniqueKeyInPattern: true, loc: true, ranges: true };

const assertClone = (nodeA: ESTree.Node, nodeB: ESTree.Node) => {
  // Same struct
  expect(nodeA).toEqual(nodeB);
  // But not same reference
  expect(nodeA).not.toBe(nodeB);
  expect(nodeA.range).not.toBe(nodeB.range);
  expect(nodeA.loc).not.toBe(nodeB.loc);
  expect(nodeA.loc!.start).not.toBe(nodeB.loc!.start);
  expect(nodeA.loc!.end).not.toBe(nodeB.loc!.end);
  expect(nodeA.loc!.source).toBe(parseOption.source);
};

const assertPropety = (property: ESTree.Property) => {
  expect(property.type).toBe('Property');
  expect(property.shorthand).toBe(true);
  assertClone(property.key, property.value);
};

const assertAssignmentPattern = (property: ESTree.Property) => {
  expect(property.type).toBe('Property');
  expect(property.shorthand).toBe(true);
  assertClone(property.key, (property.value as ESTree.AssignmentPattern).left);
};

describe('Unique node', () => {
  it('ObjectExpression', () => {
    const program = parseSource('({a})', parseOption);
    const expression = program.body[0] as ESTree.ExpressionStatement;
    const object = expression.expression as ESTree.ObjectExpression;
    const property = object.properties[0] as ESTree.Property;
    assertPropety(property);
  });

  it('ObjectPattern', () => {
    const program = parseSource('const {a} = {}', parseOption);
    const declaration = program.body[0] as ESTree.VariableDeclaration;
    const pattern = declaration.declarations[0].id as ESTree.ObjectPattern;
    const property = pattern.properties[0] as ESTree.Property;
    assertPropety(property);
  });

  it('AssignmentPattern', () => {
    const program = parseSource('const {a = 1} = {}', parseOption);
    const declaration = program.body[0] as ESTree.VariableDeclaration;
    const pattern = declaration.declarations[0].id as ESTree.ObjectPattern;
    const property = pattern.properties[0] as ESTree.Property;
    assertAssignmentPattern(property);
  });
});
