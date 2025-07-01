import { Errors, ParseError } from '../errors';
import { PropertyKind } from '../common';
import { type Parser } from './parser';

// Note PrivateScope doesn't retain a scopeError
// like Scope, because it doesn't need to.
// Private identifier is new in ecma, the spec for it
// is much more strict than other older parts of JavaScript
// For example class A { dup; dup; } is allowed,
// But class A { #dup; #dup; } is not allowed.

/**
 * Lexical scope interface for private identifiers
 */
export class PrivateScope {
  refs: {
    [name: string]: { index: number; line: number; column: number }[];
  } = Object.create(null);

  /**
   * Inherit a private scope
   * private scope is created on class body
   *
   * @return newly created PrivateScope
   */
  constructor(public readonly parent?: PrivateScope) {}
}

/**
 * Adds a private identifier binding
 *
 * @param parser Parser state
 * @param scope PrivateScope
 * @param name Binding name
 * @param type Property kind
 */
export function addPrivateIdentifier(parser: Parser, scope: PrivateScope, name: string, kind: PropertyKind): void {
  let focusKind = kind & (PropertyKind.Static | PropertyKind.GetSet);
  // if it's not getter or setter, it should take both place in the check
  if (!(focusKind & PropertyKind.GetSet)) focusKind |= PropertyKind.GetSet;
  const value = (scope as any)['#' + name];

  // It is a Syntax Error if PrivateBoundIdentifiers of ClassElementList
  // contains any duplicate entries, unless the name is used once for
  // a getter and once for a setter and in no other entries, and the getter
  // and setter are either both static or both non-static.
  if (
    value !== undefined &&
    ((value & PropertyKind.Static) !== (focusKind & PropertyKind.Static) || value & focusKind & PropertyKind.GetSet)
  ) {
    // Mix of static and non-static,
    // or duplicated setter, or duplicated getter
    parser.report(Errors.DuplicatePrivateIdentifier, name);
  }

  // Merge possible Getter and Setter
  (scope as any)['#' + name] = value ? value | focusKind : focusKind;
}

/**
 * Adds a private identifier reference
 *
 * @param parser Parser state
 * @param scope PrivateScope
 * @param name Binding name
 */
export function addPrivateIdentifierRef(parser: Parser, scope: PrivateScope, name: string): void {
  scope.refs[name] ??= [];
  scope.refs[name].push({
    index: parser.tokenIndex,
    line: parser.tokenLine,
    column: parser.tokenColumn,
  });
}

/**
 * Checks if a private identifier name is defined in current scope
 *
 * @param name private identifier name
 * @param scope current PrivateScope
 * @returns 0 for false, and 1 for true
 */
function isPrivateIdentifierDefined(name: string, scope: PrivateScope): 0 | 1 {
  if ((scope as any)['#' + name]) return 1;
  if (scope.parent) return isPrivateIdentifierDefined(name, scope.parent);
  return 0;
}

/**
 * Validates all private identifier references in current scope
 *
 * @param scope current PrivateScope
 */
export function validatePrivateIdentifierRefs(scope: PrivateScope): void {
  for (const name in scope.refs) {
    if (!isPrivateIdentifierDefined(name, scope)) {
      const { index, line, column } = scope.refs[name][0];
      throw new ParseError(
        { index, line, column },
        { index: index + name.length, line, column: column + name.length },
        Errors.InvalidPrivateIdentifier,
        name,
      );
    }
  }
}
