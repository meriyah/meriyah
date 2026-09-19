import { type ImportAttribute, type Node as EstreeNode } from 'estree';
import { type JSXSpreadChild } from 'estree-jsx';
import { type Node as MeriyahNode } from '../src/estree.ts';

/**
 * Type-only test for https://github.com/meriyah/meriyah/issues/199.
 *
 * It is not run by vitest; `npm run lint:types` type checks it. Every node type
 * meriyah and estree have in common is checked for assignability to its estree
 * counterpart, and the ones that are not assignable yet are listed in
 * `KnownGaps`. The list is asserted to be exact, so this file fails to compile
 * both when a gap is closed and when a new one appears.
 */

type Assignable<From, To> = [From] extends [To] ? true : false;

type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

type Expect<T extends true> = T;

// estree declares these two, but neither is reachable from its `Node` union.
type AnyEstreeNode = EstreeNode | ImportAttribute | JSXSpreadChild;

type MeriyahNodeOfType<Type extends string> = Extract<MeriyahNode, { type: Type }>;

type EstreeNodeOfType<Type extends string> = Extract<AnyEstreeNode, { type: Type }>;

type SharedNodeType = Extract<MeriyahNode['type'], AnyEstreeNode['type']>;

type NotAssignableToEstree = {
  [Type in SharedNodeType]: Assignable<MeriyahNodeOfType<Type>, EstreeNodeOfType<Type>> extends true ? never : Type;
}[SharedNodeType];

type NodeTypesMissingFromEstree = Exclude<MeriyahNode['type'], AnyEstreeNode['type']>;

type KnownGaps =
  | 'ArrayExpression'
  | 'ArrayPattern'
  | 'ArrowFunctionExpression'
  | 'AssignmentExpression'
  | 'AssignmentPattern'
  | 'AwaitExpression'
  | 'BinaryExpression'
  | 'BlockStatement'
  | 'CallExpression'
  | 'CatchClause'
  | 'ChainExpression'
  | 'ClassBody'
  | 'ClassDeclaration'
  | 'ClassExpression'
  | 'ConditionalExpression'
  | 'DoWhileStatement'
  | 'ExportDefaultDeclaration'
  | 'ExportNamedDeclaration'
  | 'ExpressionStatement'
  | 'ForInStatement'
  | 'ForOfStatement'
  | 'ForStatement'
  | 'FunctionDeclaration'
  | 'FunctionExpression'
  | 'IfStatement'
  | 'ImportExpression'
  | 'JSXAttribute'
  | 'JSXElement'
  | 'JSXExpressionContainer'
  | 'JSXFragment'
  | 'JSXOpeningElement'
  | 'JSXSpreadAttribute'
  | 'JSXSpreadChild'
  | 'JSXText'
  | 'LabeledStatement'
  | 'LogicalExpression'
  | 'MemberExpression'
  | 'MethodDefinition'
  | 'NewExpression'
  | 'ObjectExpression'
  | 'ObjectPattern'
  | 'Program'
  | 'Property'
  | 'PropertyDefinition'
  | 'RestElement'
  | 'ReturnStatement'
  | 'SequenceExpression'
  | 'SpreadElement'
  | 'StaticBlock'
  | 'SwitchCase'
  | 'SwitchStatement'
  | 'TaggedTemplateExpression'
  | 'TemplateLiteral'
  | 'ThrowStatement'
  | 'TryStatement'
  | 'UnaryExpression'
  | 'UpdateExpression'
  | 'VariableDeclaration'
  | 'VariableDeclarator'
  | 'WhileStatement'
  | 'WithStatement'
  | 'YieldExpression';

type KnownNodeTypesMissingFromEstree = 'AccessorProperty' | 'Decorator' | 'ParenthesizedExpression';

export type GapsAreExactlyTheKnownOnes = Expect<Equals<NotAssignableToEstree, KnownGaps>>;

export type MissingNodeTypesAreExactlyTheKnownOnes = Expect<
  Equals<NodeTypesMissingFromEstree, KnownNodeTypesMissingFromEstree>
>;
