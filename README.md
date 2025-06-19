<h1 align="center">Meriyah</h1>

<p align="center"> 100% compliant, self-hosted javascript parser with high focus on both performance and stability. Stable and already used in production.</p>

<p align="center">
    <a href="https://www.npmjs.com/package/meriyah"><img src="https://img.shields.io/npm/v/meriyah.svg?style=flat-square" alt="Meriyah NPM"/></a>
    <a href="https://github.com/meriyah/meriyah/actions/workflows/node.js.yml?query=branch%3Amain"><img src="https://img.shields.io/github/actions/workflow/status/meriyah/meriyah/node.js.yml?branch=main&label=test&style=flat-square" alt="Node.js CI"/></a>
    <a href="https://github.com/meriyah/meriyah/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/meriyah/meriyah.svg?style=flat-square" alt="License" /></a>
</p>

<br>

[Interactive Playground](https://meriyah.github.io/meriyah)
[Benchmark](https://meriyah.github.io/meriyah/performance)

## Features

- Conforms to the standard ECMAScript® 2024 (ECMA-262 15th Edition) language specification
  - See [RegExp support](#regexp-support)
- Support some TC39 stage 3 proposals via option "next"
- Support for additional ECMAScript features for Web Browsers (Annex B)
- JSX support via option "jsx"
- Does **NOT** support TypeScript or Flow syntax
- Track syntactic node locations with option "ranges" or "loc"
- Emits an ESTree-compatible abstract syntax tree
- No backtracking
- Low memory usage

## ESNext Stage 3 features

### Supported stage 3 features:

These features need to be enabled with the `next` option.

- [Decorators](https://github.com/tc39/proposal-decorators)
- [JSON Modules](https://github.com/tc39/proposal-json-modules)

### Not yet supported stage 3 features:

- [Explicit resource management](https://github.com/tc39/proposal-explicit-resource-management)
- [Source phase import](https://github.com/tc39/proposal-source-phase-imports)

## RegExp support

Meriyah doesn't parse RegExp internal syntax, ESTree spec didn't require internal structure of RegExp. Meriyah
does use JavaScript runtime to validate the RegExp literal. That means Meriyah's RegExp support is only as good
as JavaScript runtime's RegExp support.

As of May 2025, some latest RegExp features requires Node.js>=24.

- [RegExp modifiers](https://github.com/tc39/proposal-regexp-modifiers)
- [RegExp duplicate named groups](https://github.com/tc39/proposal-duplicate-named-capturing-groups)

In addition, RegExp v flag (unicodeSets) only works on Nodejs v20+ and latest browsers.

## Installation

```sh
npm install meriyah --save-dev
```

## API

Meriyah generates `AST` according to [ESTree AST format](https://github.com/estree/estree), and can be used to perform [syntactic analysis](https://en.wikipedia.org/wiki/Parsing) (parsing) of a JavaScript program, and with `ES2015` and later a JavaScript program can be either [a script or a module](https://tc39.github.io/ecma262/index.html#sec-ecmascript-language-scripts-and-modules).

The `parse` method exposed by meriyah takes an optional `options` object which allows you to specify whether to parse in [`script`](https://tc39.github.io/ecma262/#sec-parse-script) mode (the default) or in [`module`](https://tc39.github.io/ecma262/#sec-parsemodule) mode.

```js
// There are also "parseScript" and "parseModule" exported.
import { parse } from 'meriyah';
const result = parse('let some = "code";', { ranges: true });
```

The available options:

```js
{
  // The flag to allow module code
  module: false;

  // The flag to enable stage 3 support (ESNext)
  next: false;

  // The flag to enable start, end offsets and range: [start, end] to each node
  ranges: false;

  // Enable web compatibility
  webcompat: false;

  // The flag to enable line/column location information to each node
  loc: false;

  // The flag to attach raw property to each literal and identifier node
  raw: false;

  // The flag to allow return in the global scope
  globalReturn: false;

  // The flag to enable implied strict mode
  impliedStrict: false;

  // Allows comment extraction. Accepts either a function or array
  onComment: [];

  // Allows detection of automatic semicolon insertion. Accepts a callback function that will be passed the character offset where the semicolon was inserted
  onInsertedSemicolon: (pos) => {};

  // Allows token extraction. Accepts either a function or array
  onToken: [];

  // Enable non-standard parenthesized expression node
  preserveParens: false;

  // Enable lexical binding and scope tracking
  lexical: false;

  // Adds a source attribute in every node’s loc object when the locations option is `true`
  source: undefined; // Set to source: 'source-file.js'

  // Enable React JSX parsing
  jsx: false;
}
```

### onComment and onToken

If an array is supplied, comments/tokens will be pushed to the array, the item in the array contains `start/end/range` information when ranges flag is true, it will also contain `loc` information when loc flag is true.

If a function callback is supplied, the signature must be

```ts
declare function onComment(type: string, value: string, start: number, end: number, loc: SourceLocation): void;

declare function onToken(token: string, start: number, end: number, loc: SourceLocation): void;
```

Note the `start/end/loc` information are provided to the function callback regardless of the settings on ranges and loc flags. onComment callback has one extra argument `value: string` for the body string of the comment.

### onInsertedSemicolon

If a function callback is supplied, the signature must be

```ts
declare function onInsertedSemicolon(position: number): void;
```

## Example usage

```js
import { parse } from './meriyah';

parse('({x: [y] = 0} = 1)');
```

This will return when serialized in json:

```js
{
    type: "Program",
    sourceType: "script",
    body: [
        {
            type: "ExpressionStatement",
            expression: {
                type: "AssignmentExpression",
                left: {
                    type: "ObjectPattern",
                    properties: [
                        {
                            type: "Property",
                            key: {
                                type: "Identifier",
                                name: "x"
                            },
                            value: {
                                type: "AssignmentPattern",
                                left: {
                                    type: "ArrayPattern",
                                    elements: [
                                        {
                                            "type": "Identifier",
                                            "name": "y"
                                        }
                                    ]
                                },
                                right: {
                                    type: "Literal",
                                    value: 0
                                }
                            },
                            kind: "init",
                            computed: false,
                            method: false,
                            shorthand: false
                        }
                    ]
                },
                operator: "=",
                right: {
                    type: "Literal",
                    value: 1
                }
            }
        }
    ]
}
```
