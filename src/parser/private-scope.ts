import { type Location, PropertyKind } from '../common';
import { Errors, ParseError } from '../errors';
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
    [name: string]: Location[];
  } = Object.create(null);

  privateIdentifiers = new Map<string, PropertyKind>();

  /**
   * Inherit a private scope
   * private scope is created on class body
   *
   * @return newly created PrivateScope
   */
  constructor(
    public readonly parser: Parser,
    public readonly parent?: PrivateScope,
  ) {}

  /**
   * Adds a private identifier binding
   *
   * @param name Binding name
   * @param type Property kind
   */
  addPrivateIdentifier(name: string, kind: PropertyKind): void {
    const { privateIdentifiers } = this;
    let focusKind = kind & (PropertyKind.Static | PropertyKind.GetSet);
    // if it's not getter or setter, it should take both place in the check
    if (!(focusKind & PropertyKind.GetSet)) focusKind |= PropertyKind.GetSet;
    const value = privateIdentifiers.get(name);

    // It is a Syntax Error if PrivateBoundIdentifiers of ClassElementList
    // contains any duplicate entries, unless the name is used once for
    // a getter and once for a setter and in no other entries, and the getter
    // and setter are either both static or both non-static.
    if (
      this.hasPrivateIdentifier(name) &&
      ((value! & PropertyKind.Static) !== (focusKind & PropertyKind.Static) || value! & focusKind & PropertyKind.GetSet)
    ) {
      // Mix of static and non-static,
      // or duplicated setter, or duplicated getter
      this.parser.report(Errors.DuplicatePrivateIdentifier, name);
    }

    // Merge possible Getter and Setter
    privateIdentifiers.set(name, this.hasPrivateIdentifier(name) ? value! | focusKind : focusKind);
  }

  /**
   * Adds a private identifier reference
   *
   * @param scope PrivateScope
   * @param name Binding name
   */
  addPrivateIdentifierRef(name: string): void {
    this.refs[name] ??= [];
    this.refs[name].push(this.parser.tokenStart);
  }

  /**
   * Checks if a private identifier name is defined in current scope
   *
   * @param name private identifier name
   */
  isPrivateIdentifierDefined(name: string): boolean {
    return this.hasPrivateIdentifier(name) || Boolean(this.parent?.isPrivateIdentifierDefined(name));
  }

  /**
   * Validates all private identifier references in current scope
   */
  validatePrivateIdentifierRefs(): void {
    for (const name in this.refs) {
      if (!this.isPrivateIdentifierDefined(name)) {
        const { index, line, column } = this.refs[name][0];
        throw new ParseError(
          { index, line, column },
          { index: index + name.length, line, column: column + name.length },
          Errors.InvalidPrivateIdentifier,
          name,
        );
      }
    }
  }

  hasPrivateIdentifier(name: string) {
    return this.privateIdentifiers.has(name);
  }
}
