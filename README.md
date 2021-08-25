<h1 align="center">Meriyah</h1>

<p align="center"> 100% compliant, self-hosted javascript parser with high focus on both performance and stability. Stable and already used in production.</p>

<p align="center">
    <a href="https://www.npmjs.com/package/meriyah"><img src="https://img.shields.io/npm/v/meriyah.svg?style=flat-square" alt="Meriyah NPM"/></a>
    <a href="https://lgtm.com/projects/g/meriyah/meriyah/context:javascript"><img src="https://img.shields.io/lgtm/grade/javascript/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18" alt="GitHub license" /></a>
    <a href="https://lgtm.com/projects/g/meriyah/meriyah/alerts"><img src="https://img.shields.io/lgtm/alerts/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18" alt="Total alerts" /></a>
    <a href="https://circleci.com/gh/meriyah/meriyah"><img src="https://circleci.com/gh/meriyah/meriyah.svg?style=svg" alt="Circle" /></a>
    <a href="https://github.com/meriyah/meriyah/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/meriyah/meriyah.svg" alt="License" /></a>

</p>

<br>

## [Demo](https://meriyah.github.io/meriyah)

## Features

* Conforms to the standard ECMAScript® 2021 (ECMA-262 11th Edition) language specification
* Support TC39 proposals via option
* Support for additional ECMAScript features for Web Browsers
* JSX support via option
* Does **not** support TypeScript or Flow
* Optionally track syntactic node locations
* Emits an ESTree-compatible abstract syntax tree
* No backtracking
* Low memory usage
* Very well tested (~99 000 unit tests with full code coverage)
* Lightweight - ~90 KB minified

## ESNext features

* [Decorators](https://github.com/tc39/proposal-decorators)
* [Class Public Instance Fields & Private Instance Fields](https://github.com/tc39/proposal-class-fields)
* [Hashbang grammar](https://github.com/tc39/proposal-hashbang)
* [Private methods](https://github.com/tc39/proposal-private-methods)
* [Static class fields and private static methods](https://github.com/tc39/proposal-static-class-features/)

**Note:** These features need to be enabled with the `next` option.

## Installation

```sh
npm install meriyah --save-dev
```

## API

Meriyah generates `AST` according to [ESTree AST format](https://github.com/estree/estree), and can be used to perform [syntactic analysis](https://en.wikipedia.org/wiki/Parsing) (parsing) of a JavaScript program, and with `ES2015` and later a JavaScript program can be either [a script or a module](https://tc39.github.io/ecma262/index.html#sec-ecmascript-language-scripts-and-modules).

The `parse` method exposed by meriyah takes an optional `options` object which allows you to specify whether to parse in [`script`](https://tc39.github.io/ecma262/#sec-parse-script) mode (the default) or in [`module`](https://tc39.github.io/ecma262/#sec-parsemodule) mode.

This is the available options:

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

  // Enabled directives
  directives: false;

  // The flag to allow return in the global scope
  globalReturn: false;

  // The flag to enable implied strict mode
  impliedStrict: false;

  // Allows comment extraction. Accepts either a function or array
  onComment: []

  // Allows token extraction. Accepts either a function or array
  onToken: []

  // Enable non-standard parenthesized expression node
  preserveParens: false;

  // Enable lexical binding and scope tracking
  lexical: false;

  // Adds a source attribute in every node’s loc object when the locations option is `true`
  source: false;

  // Distinguish Identifier from IdentifierPattern
  identifierPattern: false;

   // Enable React JSX parsing
  jsx: false

  // Allow edge cases that deviate from the spec
  specDeviation: false
}

```

### onComment and onToken
If an array is supplied, comments/tokens will be pushed to the array, the item in the array contains `start/end/range` information when ranges flag is true, it will also contain `loc` information when loc flag is true.

If a function callback is supplied, the signature must be

```ts
function onComment(type: string, value: string, start: number, end: number, loc: SourceLocation): void {}

function onToken(token: string, start: number, end: number, loc: SourceLocation): void {}
```

Note the `start/end/loc` information are provided to the function callback regardless of the settings on ranges and loc flags. onComment callback has one extra argument `value: string` for the body string of the comment.

## Example usage

```js

import { parseScript } from './meriyah';

parseScript('({x: [y] = 0} = 1)');

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
