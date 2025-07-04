import { describe, expect, it } from 'vitest';
import type * as ESTree from '../../../src/estree';
import { type Options } from '../../../src/options';
import { parseSource } from '../../../src/parser';

const parseOptions: Options = {
  source: 'foo.js',
  loc: true,
  ranges: true,
  sourceType: 'module',
};

const assertClone = (nodeA: ESTree.Node, nodeB: ESTree.Node) => {
  // Same struct
  expect(nodeA).toEqual(nodeB);
  // But not same reference
  expect(nodeA).not.toBe(nodeB);
  expect(nodeA.range).not.toBe(nodeB.range);
  expect(nodeA.loc).not.toBe(nodeB.loc);
  expect(nodeA.loc!.start).not.toBe(nodeB.loc!.start);
  expect(nodeA.loc!.end).not.toBe(nodeB.loc!.end);
  expect(nodeA.loc!.source).toBe(parseOptions.source);
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

const assertImportSpecifier = (specifier: ESTree.ImportSpecifier) => {
  expect(specifier.type).toBe('ImportSpecifier');
  assertClone(specifier.local, specifier.imported);
};

const assertExportSpecifier = (specifier: ESTree.ExportSpecifier) => {
  expect(specifier.type).toBe('ExportSpecifier');
  assertClone(specifier.local, specifier.exported);
};

describe('Unique node', () => {
  it('ObjectExpression', () => {
    const program = parseSource('({a})', parseOptions);
    const expression = program.body[0] as ESTree.ExpressionStatement;
    const object = expression.expression as ESTree.ObjectExpression;
    const property = object.properties[0] as ESTree.Property;
    assertPropety(property);
  });

  it('ObjectPattern', () => {
    const program = parseSource('const {a} = {}', parseOptions);
    const declaration = program.body[0] as ESTree.VariableDeclaration;
    const pattern = declaration.declarations[0].id as ESTree.ObjectPattern;
    const property = pattern.properties[0] as ESTree.Property;
    assertPropety(property);
  });

  it('AssignmentPattern', () => {
    const program = parseSource('const {a = 1} = {}', parseOptions);
    const declaration = program.body[0] as ESTree.VariableDeclaration;
    const pattern = declaration.declarations[0].id as ESTree.ObjectPattern;
    const property = pattern.properties[0] as ESTree.Property;
    assertAssignmentPattern(property);
  });

  it('ImportSpecifier', () => {
    const program = parseSource('import {foo} from "foo"', parseOptions);
    const declaration = program.body[0] as ESTree.ImportDeclaration;
    const specifier = declaration.specifiers[0] as ESTree.ImportSpecifier;
    assertImportSpecifier(specifier);
  });

  it('ExportSpecifier', () => {
    const program = parseSource('export {foo} from "foo"', parseOptions);
    const declaration = program.body[0] as ESTree.ExportNamedDeclaration;
    const specifier = declaration.specifiers[0] as ESTree.ExportSpecifier;
    assertExportSpecifier(specifier);
  });

  it('ExportSpecifier(string)', () => {
    const program = parseSource('export {"foo"} from "foo"', parseOptions);
    const declaration = program.body[0] as ESTree.ExportNamedDeclaration;
    const specifier = declaration.specifiers[0] as ESTree.ExportSpecifier;
    assertExportSpecifier(specifier);
  });
});
