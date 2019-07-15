<h1 align="center">Meriyah</h1>

<p align="center"> 100% compliant, self-hosted javascript parser with high focus on both performance and stability</p>

<p align="center">
    <a href="https://www.npmjs.com/package/meriyah"><img src="https://img.shields.io/npm/v/meriyah.svg?style=flat-square" alt="Azure Pipelines"/></a>
    <a href="https://lgtm.com/projects/g/meriyah/meriyah/context:javascript"><img src="https://img.shields.io/lgtm/grade/javascript/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18" alt="GitHub license" /></a>
    <a href="https://lgtm.com/projects/g/meriyah/meriyah/alerts"><img src="https://img.shields.io/lgtm/alerts/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18" alt="Total alerts" /></a>
    <a href="https://circleci.com/gh/meriyah/meriyah"><img src="https://circleci.com/gh/meriyah/meriyah.svg?style=svg" alt="Circle" /></a>
    <a href="https://github.com/meriyah/meriyah/blob/master/LICENSE.md"><img src="https://img.shields.io/github/license/meriyah/meriyah.svg" alt="Circle" /></a>

</p>

<br>

## Features

* Conforms to the standard ECMAScript® 2020 (ECMA-262 10th Edition) language specification
* Support TC39 proposals via option
* Support for additional ECMAScript features for Web Browsers
* JSX support via option
* Optionally track syntactic node locations
* Emits an ESTree-compatible abstract syntax tree.
* No backtracking
* Reduced memory usage
* Very well tested (~81 000 unit tests with full code coverage)
* Lightweight - ~82 KB minified

## ESNext features

* [Decorators](https://github.com/tc39/proposal-decorators)
* [Class Public Instance Fields & Private Instance Fields](https://github.com/tc39/proposal-class-fields)
* [Hashbang grammar](https://github.com/tc39/proposal-hashbang)
* [Numeric separators](https://github.com/tc39/proposal-numeric-separator)
* [Private methods](https://github.com/tc39/proposal-private-methods)
* [Static class fields and private static methods](https://github.com/tc39/proposal-static-class-features/)

**Note:** These features need to be enabled with the `next` option.

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
  // The flag to enable start and end offsets to each node
  ranges: false;
  // Enable web compability
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
  deFacto: false
}
```

Example usage:

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
## ECMAScript compability

Meriyah is 100% ECMA spec compatible, but you have to enable several [options](https://github.com/meriyah/meriyah#options) to make sure your code parses with 100% ECMA spec compability. This is done because Meriyah's main focus is on performance, and each option you enable will have impact on it's performance.

Also note that support for additional ECMAScript features for Web Browsers (*annexB*) isn't enabled by default as in other parsers, but you can instead parse with and without web compability .

This is done because AnnexB is an extension of the language, and also beaucse all the `Test262 suite` tests has no web compability.

Lexical binding and scope tracking has to be enabled with the `lexical` option.
