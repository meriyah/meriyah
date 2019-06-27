# Meriyah

[![NPM version](https://img.shields.io/npm/v/meriyah.svg?style=flat-square)](https://www.npmjs.com/package/meriyah)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/meriyah/meriyah/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/meriyah/meriyah.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/meriyah/meriyah/alerts)
[![CircleCI](https://circleci.com/gh/meriyah/meriyah.svg?style=svg)](https://circleci.com/gh/meriyah/meriyah)

A 100% compliant, self-hosted javascript parser with high focus on both performance and stability

## [Demo](https://meriyah.github.io/meriyah/)

## Features

* Conforms to the standard ECMAScript® 2020 (ECMA-262 10th Edition) language specification
* Support TC39 proposals via option
* Support for additional ECMAScript features for Web Browsers
* Optionally track syntactic node locations
* Emits an ESTree-compatible abstract syntax tree.
* No backtracking
* Reduced memory usage
* Very well tested (~81 000 unit tests with full code coverage)
* Lightweight - ~82 KB minified

## ESNext features

* [Decorators](https://github.com/tc39/proposal-decorators)
* [Class Public Instance Fields & Private Instance Fields](https://github.com/tc39/proposal-class-fields)
* [Hashbang Grammar](https://github.com/tc39/proposal-hashbang)
* [Private methods](https://github.com/tc39/proposal-private-methods)
* [Static class fields and private static methods](https://github.com/tc39/proposal-static-class-features/)

**Note:** These features need to be enabled with the `next` option.

## API

Meriyah generates `AST` according to [ESTree AST format](https://github.com/estree/estree), and can be used to perform [syntactic analysis](https://en.wikipedia.org/wiki/Parsing) (parsing) of a JavaScript program, and with `ES2015` and later a JavaScript program can be either [a script or a module](https://tc39.github.io/ecma262/index.html#sec-ecmascript-language-scripts-and-modules).

The `parse` method exposed by meriyah takes an optional `options` object which allows you to specify whether to parse in [`script`](https://tc39.github.io/ecma262/#sec-parse-script) mode (the default) or in [`module`](https://tc39.github.io/ecma262/#sec-parsemodule) mode.


Here is a quick example to parse a script:

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


## Options

The second argument allows you to specify various options:

| Option        | Description |
| ----------- | ------------------------------------------------------------ |
| `directives`      | Enable [directive prologue](https://github.com/danez/estree/blob/directive/es5.md#directive) to each literal node |
| `globalReturn`    | Allow `return` in the global scope |
| `impliedStrict`   | Enable strict mode (*initial enforcement*) |
| `lexical`         | Enable lexical binding and scope tracking |
| `loc`         | Enable line/column location information to each node |
| `module`          | Allow parsing with module goal |
| `next`            | Allow parsing with `ESNext` features  |
| `parenthesizedExpr`	| Enable non-standard parenthesized expression node |
| `raw`             | Attach raw property to each literal node |
| `ranges`          | Append start and end offsets to each node |
| `source`          | Adds a source attribute in every node’s loc object when the locations option is `true`.|
| `webcompat`       | Enable [web compability](https://tc39.github.io/ecma262/#sec-additional-ecmascript-features-for-web-browsers) |

## ECMAScript compability

Meriyah is 100% ECMA spec compatible, but you have to enable several [options](https://github.com/meriyah/meriyah#options) to make sure your code parses with 100% ECMA spec compability. This is done because Meriyah's main focus is on performance, and each option you enable will have impact on it's performance.

Also note that support for additional ECMAScript features for Web Browsers (*annexB*) isn't enabled by default as in other parsers, but you can instead parse with and without web compability .

This is done because AnnexB is an extension of the language, and also beaucse all the `Test262 suite` tests has no web compability. 

Lexical binding and scope tracking has to be enabled with the `lexical` option.
