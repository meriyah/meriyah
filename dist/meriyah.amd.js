define(['exports'], function (exports) { 'use strict';

  const errorMessages = {
      [0]: 'Unexpected token',
      [28]: "Unexpected token: '%0'",
      [1]: 'Octal escape sequences are not allowed in strict mode',
      [2]: 'Octal escape sequences are not allowed in template strings',
      [3]: 'Unexpected token `#`',
      [4]: 'Illegal Unicode escape sequence',
      [5]: 'Invalid code point %0',
      [6]: 'Invalid hexadecimal escape sequence',
      [8]: 'Octal literals are not allowed in strict mode',
      [7]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
      [9]: 'Expected number in radix %0',
      [145]: 'Invalid left-hand side assignment to a destructible right-hand side',
      [10]: 'Non-number found after exponent indicator',
      [11]: 'Invalid BigIntLiteral',
      [12]: 'No identifiers allowed directly after numeric literal',
      [13]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
      [14]: 'Unterminated string literal',
      [15]: 'Unterminated template literal',
      [16]: 'Multiline comment was not closed properly',
      [17]: 'The identifier contained dynamic unicode escape that was not closed',
      [18]: "Illegal character '%0'",
      [19]: 'Missing hexadecimal digits',
      [20]: 'Invalid implicit octal',
      [21]: 'Invalid line break in string literal',
      [22]: 'Only unicode escapes are legal in identifier names',
      [23]: "Expected '%0'",
      [24]: 'Invalid left-hand side in assignment',
      [25]: 'Invalid left-hand side in async arrow',
      [26]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
      [27]: 'Member access on super must be in a method',
      [29]: 'Await expression not allowed in formal parameter',
      [30]: 'Yield expression not allowed in formal parameter',
      [92]: "Unexpected token: 'escaped keyword'",
      [31]: 'Unary expressions as the left operand of an exponentiation expression must be disambiguated with parentheses',
      [119]: 'Async functions can only be declared at the top level or inside a block',
      [32]: 'Unterminated regular expression',
      [33]: 'Unexpected regular expression flag',
      [34]: "Duplicate regular expression flag '%0'",
      [35]: '%0 functions must have exactly %1 argument%2',
      [36]: 'Setter function argument must not be a rest parameter',
      [37]: '%0 declaration must have a name in this context',
      [38]: 'Function name may not contain any reserved words or be eval or arguments in strict mode',
      [39]: 'The rest operator is missing an argument',
      [40]: 'A getter cannot be a generator',
      [41]: 'A computed property name must be followed by a colon or paren',
      [130]: 'Object literal keys that are strings or numbers must be a method or have a colon',
      [43]: 'Found `* async x(){}` but this should be `async * x(){}`',
      [42]: 'Getters and setters can not be generators',
      [44]: "'%0' can not be generator method",
      [45]: "No line break is allowed after '=>'",
      [46]: 'The left-hand side of the arrow can only be destructed through assignment',
      [47]: 'The binding declaration is not destructible',
      [48]: 'Async arrow can not be followed by new expression',
      [49]: "Classes may not have a static property named 'prototype'",
      [50]: 'Class constructor may not be a %0',
      [51]: 'Duplicate constructor method in class',
      [52]: 'Invalid increment/decrement operand',
      [53]: 'Invalid use of `new` keyword on an increment/decrement expression',
      [54]: '`=>` is an invalid assignment target',
      [55]: 'Rest element may not have a trailing comma',
      [56]: 'Missing initializer in %0 declaration',
      [57]: "'for-%0' loop head declarations can not have an initializer",
      [58]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
      [59]: 'Invalid shorthand property initializer',
      [60]: 'Property name __proto__ appears more than once in object literal',
      [61]: 'Let is disallowed as a lexically bound name',
      [62]: "Invalid use of '%0' inside new expression",
      [63]: "Illegal 'use strict' directive in function with non-simple parameter list",
      [64]: 'Identifier "let" disallowed as left-hand side expression in strict mode',
      [65]: 'Illegal continue statement',
      [66]: 'Illegal break statement',
      [67]: 'Cannot have `let[...]` as a var name in strict mode',
      [68]: 'Invalid destructuring assignment target',
      [69]: 'Rest parameter may not have a default initializer',
      [70]: 'The rest argument must the be last parameter',
      [71]: 'Invalid rest argument',
      [73]: 'In strict mode code, functions can only be declared at top level or inside a block',
      [74]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
      [75]: 'Without web compatibility enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
      [76]: "Class declaration can't appear in single-statement context",
      [77]: 'Invalid left-hand side in for-%0',
      [78]: 'Invalid assignment in for-%0',
      [79]: 'for await (... of ...) is only valid in async functions and async generators',
      [80]: 'The first token after the template expression should be a continuation of the template',
      [82]: '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
      [81]: '`let \n [` is a restricted production at the start of a statement',
      [83]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
      [84]: 'Catch clause parameter does not support default values',
      [85]: 'Missing catch or finally after try',
      [86]: 'More than one default clause in switch statement',
      [87]: 'Illegal newline after throw',
      [88]: 'Strict mode code may not include a with statement',
      [89]: 'Illegal return statement',
      [90]: 'The left hand side of the for-header binding declaration is not destructible',
      [91]: 'new.target only allowed within functions',
      [92]: "'Unexpected token: 'escaped keyword'",
      [93]: "'#' not followed by identifier",
      [99]: 'Invalid keyword',
      [98]: "Can not use 'let' as a class name",
      [97]: "'A lexical declaration can't define a 'let' binding",
      [96]: 'Can not use `let` as variable name in strict mode',
      [94]: "'%0' may not be used as an identifier in this context",
      [95]: 'Await is only valid in async functions',
      [100]: 'The %0 keyword can only be used with the module goal',
      [101]: 'Unicode codepoint must not be greater than 0x10FFFF',
      [102]: '%0 source must be string',
      [103]: 'Only a identifier can be used to indicate alias',
      [104]: "Only '*' or '{...}' can be imported after default",
      [105]: 'Trailing decorator may be followed by method',
      [106]: "Decorators can't be used with a constructor",
      [107]: "'%0' may not be used as an identifier in this context",
      [108]: 'HTML comments are only allowed with web compatibility (Annex B)',
      [109]: "The identifier 'let' must not be in expression position in strict mode",
      [110]: 'Cannot assign to `eval` and `arguments` in strict mode',
      [111]: "The left-hand side of a for-of loop may not start with 'let'",
      [112]: 'Block body arrows can not be immediately invoked without a group',
      [113]: 'Block body arrows can not be immediately accessed without a group',
      [114]: 'Unexpected strict mode reserved word',
      [115]: 'Unexpected eval or arguments in strict mode',
      [116]: 'Decorators must not be followed by a semicolon',
      [117]: 'Calling delete on expression not allowed in strict mode',
      [118]: 'Pattern can not have a tail',
      [120]: 'Can not have a `yield` expression on the left side of a ternary',
      [121]: 'An arrow function can not have a postfix update operator',
      [122]: 'Invalid object literal key character after generator star',
      [123]: 'Private fields can not be deleted',
      [125]: 'Classes may not have a field called constructor',
      [124]: 'Classes may not have a private element named constructor',
      [126]: 'A class field initializer may not contain arguments',
      [127]: 'Generators can only be declared at the top level or inside a block',
      [128]: 'Async methods are a restricted production and cannot have a newline following it',
      [129]: 'Unexpected character after object literal property name',
      [131]: 'Invalid key token',
      [132]: "Label '%0' has already been declared",
      [133]: 'continue statement must be nested within an iteration statement',
      [134]: "Undefined label '%0'",
      [135]: 'Trailing comma is disallowed inside import(...) arguments',
      [136]: 'import() requires exactly one argument',
      [137]: 'Cannot use new with import(...)',
      [138]: '... is not allowed in import()',
      [139]: "Expected '=>'",
      [140]: "Duplicate binding '%0'",
      [141]: "Cannot export a duplicate name '%0'",
      [144]: 'Duplicate %0 for-binding',
      [142]: "Exported binding '%0' needs to refer to a top-level declared variable",
      [143]: 'Unexpected private field',
      [147]: 'Numeric separators are not allowed at the end of numeric literals',
      [146]: 'Only one underscore is allowed as numeric separator',
      [148]: 'JSX value should be either an expression or a quoted JSX text',
      [149]: 'Expected corresponding JSX closing tag for %0',
      [150]: 'Adjacent JSX elements must be wrapped in an enclosing tag',
      [151]: "JSX attributes must only be assigned a non-empty 'expression'",
      [152]: "'%0' has already been declared",
      [153]: "'%0' shadowed a catch clause binding",
      [154]: 'Dot property must be an identifier',
      [155]: 'Encountered invalid input after spread/rest argument',
      [156]: 'Catch without try',
      [157]: 'Finally without try',
      [158]: 'Expected corresponding closing tag for JSX fragment',
      [159]: 'Coalescing and logical operators used together in the same expression must be disambiguated with parentheses',
      [160]: 'Invalid tagged template on optional chain',
      [161]: 'Invalid optional chain from super property',
      [162]: 'Invalid optional chain from new expression',
      [163]: 'Cannot use "import.meta" outside a module',
      [164]: 'Leading decorators must be attached to a class declaration'
  };
  class ParseError extends SyntaxError {
      constructor(startindex, line, column, type, ...params) {
          const message = '[' + line + ':' + column + ']: ' + errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]);
          super(`${message}`);
          this.index = startindex;
          this.line = line;
          this.column = column;
          this.description = message;
          this.loc = {
              line,
              column
          };
      }
  }
  function report(parser, type, ...params) {
      throw new ParseError(parser.index, parser.line, parser.column, type, ...params);
  }
  function reportScopeError(scope) {
      throw new ParseError(scope.index, scope.line, scope.column, scope.type, scope.params);
  }
  function reportMessageAt(index, line, column, type, ...params) {
      throw new ParseError(index, line, column, type, ...params);
  }
  function reportScannerError(index, line, column, type) {
      throw new ParseError(index, line, column, type);
  }

  const unicodeLookup = ((compressed, lookup) => {
      const result = new Uint32Array(104448);
      let index = 0;
      let subIndex = 0;
      while (index < 3540) {
          const inst = compressed[index++];
          if (inst < 0) {
              subIndex -= inst;
          }
          else {
              let code = compressed[index++];
              if (inst & 2)
                  code = lookup[code];
              if (inst & 1) {
                  result.fill(code, subIndex, subIndex += compressed[index++]);
              }
              else {
                  result[subIndex++] = code;
              }
          }
      }
      return result;
  })([-1, 2, 24, 2, 25, 2, 5, -1, 0, 77595648, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 16, 2, 60, 2, 0, 0, 4294836735, 0, 3221225471, 0, 4294901942, 2, 61, 0, 134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983, 0, 2684354047, 2, 17, 2, 0, 0, 4294961151, 3, 0, 2, 2, 19, 2, 0, 0, 608174079, 2, 0, 2, 131, 2, 6, 2, 56, -1, 2, 37, 0, 4294443263, 2, 1, 3, 0, 3, 0, 4294901711, 2, 39, 0, 4089839103, 0, 2961209759, 0, 1342439375, 0, 4294543342, 0, 3547201023, 0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0, 4261478351, 0, 4294549486, 2, 2, 0, 2967484831, 0, 196559, 0, 3594373100, 0, 3288319768, 0, 8469959, 2, 194, 2, 3, 0, 3825204735, 0, 123747807, 0, 65487, 0, 4294828015, 0, 4092591615, 0, 1080049119, 0, 458703, 2, 3, 2, 0, 0, 2163244511, 0, 4227923919, 0, 4236247022, 2, 66, 0, 4284449919, 0, 851904, 2, 4, 2, 11, 0, 67076095, -1, 2, 67, 0, 1073741743, 0, 4093591391, -1, 0, 50331649, 0, 3265266687, 2, 32, 0, 4294844415, 0, 4278190047, 2, 18, 2, 129, -1, 3, 0, 2, 2, 21, 2, 0, 2, 9, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 10, 0, 261632, 2, 23, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 2088959, 2, 27, 2, 8, 0, 909311, 3, 0, 2, 0, 814743551, 2, 41, 0, 67057664, 3, 0, 2, 2, 40, 2, 0, 2, 28, 2, 0, 2, 29, 2, 7, 0, 268374015, 2, 26, 2, 49, 2, 0, 2, 76, 0, 134153215, -1, 2, 6, 2, 0, 2, 7, 0, 2684354559, 0, 67044351, 0, 3221160064, 0, 1, -1, 3, 0, 2, 2, 42, 0, 1046528, 3, 0, 3, 2, 8, 2, 0, 2, 51, 0, 4294960127, 2, 9, 2, 38, 2, 10, 0, 4294377472, 2, 11, 3, 0, 7, 0, 4227858431, 3, 0, 8, 2, 12, 2, 0, 2, 78, 2, 9, 2, 0, 2, 79, 2, 80, 2, 81, -1, 2, 124, 0, 1048577, 2, 82, 2, 13, -1, 2, 13, 0, 131042, 2, 83, 2, 84, 2, 85, 2, 0, 2, 33, -83, 2, 0, 2, 53, 2, 7, 3, 0, 4, 0, 1046559, 2, 0, 2, 14, 2, 0, 0, 2147516671, 2, 20, 3, 86, 2, 2, 0, -16, 2, 87, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4, 2, 0, 2, 15, 2, 77, 2, 16, 3, 0, 2, 2, 47, 2, 0, -1, 2, 17, -16, 3, 0, 206, -2, 3, 0, 655, 2, 18, 3, 0, 36, 2, 68, -1, 2, 17, 2, 9, 3, 0, 8, 2, 89, 2, 121, 2, 0, 0, 3220242431, 3, 0, 3, 2, 19, 2, 90, 2, 91, 3, 0, 2, 2, 92, 2, 0, 2, 93, 2, 94, 2, 0, 0, 4351, 2, 0, 2, 8, 3, 0, 2, 0, 67043391, 0, 3909091327, 2, 0, 2, 22, 2, 8, 2, 18, 3, 0, 2, 0, 67076097, 2, 7, 2, 0, 2, 20, 0, 67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999, 2, 97, 2, 98, 2, 15, 2, 21, 3, 0, 3, 0, 67057663, 3, 0, 349, 2, 99, 2, 100, 2, 6, -264, 3, 0, 11, 2, 22, 3, 0, 2, 2, 31, -1, 0, 3774349439, 2, 101, 2, 102, 3, 0, 2, 2, 19, 2, 103, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 45, 2, 0, 2, 30, 2, 104, 2, 23, 0, 1638399, 2, 172, 2, 105, 3, 0, 3, 2, 18, 2, 24, 2, 25, 2, 5, 2, 26, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 27, -3, 2, 150, -4, 2, 18, 2, 0, 2, 35, 0, 1, 2, 0, 2, 62, 2, 28, 2, 11, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 21, 2, 111, 2, 6, 2, 0, 2, 112, 2, 0, 2, 48, -4, 3, 0, 9, 2, 20, 2, 29, 2, 30, -4, 2, 113, 2, 114, 2, 29, 2, 20, 2, 7, -2, 2, 115, 2, 29, 2, 31, -2, 2, 0, 2, 116, -2, 0, 4277137519, 0, 2269118463, -1, 3, 18, 2, -1, 2, 32, 2, 36, 2, 0, 3, 29, 2, 2, 34, 2, 19, -3, 3, 0, 2, 2, 33, -1, 2, 0, 2, 34, 2, 0, 2, 34, 2, 0, 2, 46, -10, 2, 0, 0, 203775, -2, 2, 18, 2, 43, 2, 35, -2, 2, 17, 2, 117, 2, 20, 3, 0, 2, 2, 36, 0, 2147549120, 2, 0, 2, 11, 2, 17, 2, 135, 2, 0, 2, 37, 2, 52, 0, 5242879, 3, 0, 2, 0, 402644511, -1, 2, 120, 0, 1090519039, -2, 2, 122, 2, 38, 2, 0, 0, 67045375, 2, 39, 0, 4226678271, 0, 3766565279, 0, 2039759, -4, 3, 0, 2, 0, 3288270847, 0, 3, 3, 0, 2, 0, 67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0, 2, 0, 67043345, -1, 2, 0, 2, 40, 2, 41, -1, 2, 10, 2, 42, -6, 2, 0, 2, 11, -3, 3, 0, 2, 0, 2147484671, 2, 125, 0, 4190109695, 2, 50, -2, 2, 126, 0, 4244635647, 0, 27, 2, 0, 2, 7, 2, 43, 2, 0, 2, 63, -1, 2, 0, 2, 40, -8, 2, 54, 2, 44, 0, 67043329, 2, 127, 2, 45, 0, 8388351, -2, 2, 128, 0, 3028287487, 2, 46, 2, 130, 0, 33259519, 2, 41, -9, 2, 20, -5, 2, 64, -2, 3, 0, 28, 2, 31, -3, 3, 0, 3, 2, 47, 3, 0, 6, 2, 48, -85, 3, 0, 33, 2, 47, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 40, 2, 7, 2, 41, -2, 2, 17, 2, 49, 2, 0, 2, 20, 2, 50, 2, 132, 2, 23, -21, 3, 0, 2, -4, 3, 0, 2, 0, 4294936575, 2, 0, 0, 4294934783, -2, 0, 196635, 3, 0, 191, 2, 51, 3, 0, 38, 2, 29, -1, 2, 33, -279, 3, 0, 8, 2, 7, -1, 2, 133, 2, 52, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 134, 0, 1677656575, -166, 0, 4161266656, 0, 4071, 0, 15360, -4, 0, 28, -13, 3, 0, 2, 2, 37, 2, 0, 2, 136, 2, 137, 2, 55, 2, 0, 2, 138, 2, 139, 2, 140, 3, 0, 10, 2, 141, 2, 142, 2, 15, 3, 37, 2, 3, 53, 2, 3, 54, 2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 88, 2, 0, 0, 2105343, 0, 4160749584, 0, 65534, -42, 0, 4194303871, 0, 2011, -6, 2, 0, 0, 1073684479, 0, 17407, -11, 2, 0, 2, 31, -40, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 42, -37, 2, 55, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -105, 2, 24, -32, 3, 0, 1334, 2, 9, -1, 3, 0, 129, 2, 27, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -47, 3, 0, 154, 2, 56, -22381, 3, 0, 7, 2, 23, -6130, 3, 5, 2, -1, 0, 69207040, 3, 44, 2, 3, 0, 14, 2, 57, 2, 58, -3, 0, 3168731136, 0, 4294956864, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 16, 2, 60, 2, 0, 2, 33, -1, 2, 17, 2, 61, -1, 2, 0, 2, 56, 0, 4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0, 4294770688, 2, 23, 2, 62, 3, 0, 2, 0, 131135, 2, 95, 0, 70256639, 0, 71303167, 0, 272, 2, 40, 2, 56, -1, 2, 37, 2, 30, -1, 2, 96, 2, 63, 0, 4278255616, 0, 4294836227, 0, 4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0, 4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0, 4294688736, 2, 65, 2, 64, 0, 33554435, 2, 123, 2, 65, 2, 151, 0, 131075, 0, 3594373096, 0, 67094296, 2, 64, -1, 0, 4294828000, 0, 603979263, 2, 160, 0, 3, 0, 4294828001, 0, 602930687, 2, 183, 0, 393219, 0, 4294828016, 0, 671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2, 66, 2, 36, -1, 2, 4, 0, 917503, 2, 36, -1, 2, 67, 0, 537788335, 0, 4026531935, -1, 0, 1, -1, 2, 32, 2, 68, 0, 7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930, 0, 16387, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 69, 2, 0, 2, 70, 2, 71, 2, 72, 2, 0, 2, 73, 2, 0, 2, 11, -1, 2, 23, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 74, 2, 5, 3, 0, 2, 2, 75, 0, 253951, 3, 19, 2, 0, 122879, 2, 0, 2, 8, 0, 276824064, -2, 3, 0, 2, 2, 40, 2, 0, 0, 4294903295, 2, 0, 2, 29, 2, 7, -1, 2, 17, 2, 49, 2, 0, 2, 76, 2, 41, -1, 2, 20, 2, 0, 2, 27, -2, 0, 128, -2, 2, 77, 2, 8, 0, 4064, -1, 2, 119, 0, 4227907585, 2, 0, 2, 118, 2, 0, 2, 48, 2, 173, 2, 9, 2, 38, 2, 10, -1, 0, 74440192, 3, 0, 6, -2, 3, 0, 8, 2, 12, 2, 0, 2, 78, 2, 9, 2, 0, 2, 79, 2, 80, 2, 81, -3, 2, 82, 2, 13, -3, 2, 83, 2, 84, 2, 85, 2, 0, 2, 33, -83, 2, 0, 2, 53, 2, 7, 3, 0, 4, 0, 817183, 2, 0, 2, 14, 2, 0, 0, 33023, 2, 20, 3, 86, 2, -17, 2, 87, 0, 524157950, 2, 4, 2, 0, 2, 88, 2, 4, 2, 0, 2, 15, 2, 77, 2, 16, 3, 0, 2, 2, 47, 2, 0, -1, 2, 17, -16, 3, 0, 206, -2, 3, 0, 655, 2, 18, 3, 0, 36, 2, 68, -1, 2, 17, 2, 9, 3, 0, 8, 2, 89, 0, 3072, 2, 0, 0, 2147516415, 2, 9, 3, 0, 2, 2, 23, 2, 90, 2, 91, 3, 0, 2, 2, 92, 2, 0, 2, 93, 2, 94, 0, 4294965179, 0, 7, 2, 0, 2, 8, 2, 91, 2, 8, -1, 0, 1761345536, 2, 95, 0, 4294901823, 2, 36, 2, 18, 2, 96, 2, 34, 2, 166, 0, 2080440287, 2, 0, 2, 33, 2, 143, 0, 3296722943, 2, 0, 0, 1046675455, 0, 939524101, 0, 1837055, 2, 97, 2, 98, 2, 15, 2, 21, 3, 0, 3, 0, 7, 3, 0, 349, 2, 99, 2, 100, 2, 6, -264, 3, 0, 11, 2, 22, 3, 0, 2, 2, 31, -1, 0, 2700607615, 2, 101, 2, 102, 3, 0, 2, 2, 19, 2, 103, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 45, 2, 0, 2, 30, 2, 104, -3, 2, 105, 3, 0, 3, 2, 18, -1, 3, 5, 2, 2, 26, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 27, -8, 2, 18, 2, 0, 2, 35, -1, 2, 0, 2, 62, 2, 28, 2, 29, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 17, 2, 111, 2, 6, 2, 0, 2, 112, 2, 0, 2, 48, -4, 3, 0, 9, 2, 20, 2, 29, 2, 30, -4, 2, 113, 2, 114, 2, 29, 2, 20, 2, 7, -2, 2, 115, 2, 29, 2, 31, -2, 2, 0, 2, 116, -2, 0, 4277075969, 2, 29, -1, 3, 18, 2, -1, 2, 32, 2, 117, 2, 0, 3, 29, 2, 2, 34, 2, 19, -3, 3, 0, 2, 2, 33, -1, 2, 0, 2, 34, 2, 0, 2, 34, 2, 0, 2, 48, -10, 2, 0, 0, 197631, -2, 2, 18, 2, 43, 2, 118, -2, 2, 17, 2, 117, 2, 20, 2, 119, 2, 51, -2, 2, 119, 2, 23, 2, 17, 2, 33, 2, 119, 2, 36, 0, 4294901904, 0, 4718591, 2, 119, 2, 34, 0, 335544350, -1, 2, 120, 2, 121, -2, 2, 122, 2, 38, 2, 7, -1, 2, 123, 2, 65, 0, 3758161920, 0, 3, -4, 2, 0, 2, 27, 0, 2147485568, 0, 3, 2, 0, 2, 23, 0, 176, -5, 2, 0, 2, 47, 2, 186, -1, 2, 0, 2, 23, 2, 197, -1, 2, 0, 0, 16779263, -2, 2, 11, -7, 2, 0, 2, 121, -3, 3, 0, 2, 2, 124, 2, 125, 0, 2147549183, 0, 2, -2, 2, 126, 2, 35, 0, 10, 0, 4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 536871935, -1, 2, 0, 2, 40, -8, 2, 54, 2, 47, 0, 1, 2, 127, 2, 23, -3, 2, 128, 2, 35, 2, 129, 2, 130, 0, 16778239, -10, 2, 34, -5, 2, 64, -2, 3, 0, 28, 2, 31, -3, 3, 0, 3, 2, 47, 3, 0, 6, 2, 48, -85, 3, 0, 33, 2, 47, -126, 3, 0, 18, 2, 36, -269, 3, 0, 17, 2, 40, 2, 7, -3, 2, 17, 2, 131, 2, 0, 2, 23, 2, 48, 2, 132, 2, 23, -21, 3, 0, 2, -4, 3, 0, 2, 0, 67583, -1, 2, 103, -2, 0, 11, 3, 0, 191, 2, 51, 3, 0, 38, 2, 29, -1, 2, 33, -279, 3, 0, 8, 2, 7, -1, 2, 133, 2, 52, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 134, 2, 135, -187, 3, 0, 2, 2, 37, 2, 0, 2, 136, 2, 137, 2, 55, 2, 0, 2, 138, 2, 139, 2, 140, 3, 0, 10, 2, 141, 2, 142, 2, 15, 3, 37, 2, 3, 53, 2, 3, 54, 2, 2, 143, -73, 2, 0, 0, 1065361407, 0, 16384, -11, 2, 0, 2, 121, -40, 3, 0, 6, 2, 117, -1, 3, 0, 2, 0, 2063, -37, 2, 55, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -138, 3, 0, 1334, 2, 9, -1, 3, 0, 129, 2, 27, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -47, 3, 0, 154, 2, 56, -28517, 2, 0, 0, 1, -1, 2, 124, 2, 0, 0, 8193, -21, 2, 193, 0, 10255, 0, 4, -11, 2, 64, 2, 171, -1, 0, 71680, -1, 2, 161, 0, 4292900864, 0, 805306431, -5, 2, 150, -1, 2, 157, -1, 0, 6144, -2, 2, 127, -1, 2, 154, -1, 0, 2147532800, 2, 151, 2, 165, 2, 0, 2, 164, 0, 524032, 0, 4, -4, 2, 190, 0, 205128192, 0, 1333757536, 0, 2147483696, 0, 423953, 0, 747766272, 0, 2717763192, 0, 4286578751, 0, 278545, 2, 152, 0, 4294886464, 0, 33292336, 0, 417809, 2, 152, 0, 1327482464, 0, 4278190128, 0, 700594195, 0, 1006647527, 0, 4286497336, 0, 4160749631, 2, 153, 0, 469762560, 0, 4171219488, 0, 8323120, 2, 153, 0, 202375680, 0, 3214918176, 0, 4294508592, 2, 153, -1, 0, 983584, 0, 48, 0, 58720273, 0, 3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920, 2, 177, 2, 0, 0, 2089, 0, 3221225552, 0, 201375904, 2, 0, -2, 0, 256, 0, 122880, 0, 16777216, 2, 150, 0, 4160757760, 2, 0, -6, 2, 167, -11, 0, 3263218176, -1, 0, 49664, 0, 2160197632, 0, 8388802, -1, 0, 12713984, -1, 2, 154, 2, 159, 2, 178, -2, 2, 162, -20, 0, 3758096385, -2, 2, 155, 0, 4292878336, 2, 90, 2, 169, 0, 4294057984, -2, 2, 163, 2, 156, 2, 175, -2, 2, 155, -1, 2, 182, -1, 2, 170, 2, 124, 0, 4026593280, 0, 14, 0, 4292919296, -1, 2, 158, 0, 939588608, -1, 0, 805306368, -1, 2, 124, 0, 1610612736, 2, 156, 2, 157, 2, 4, 2, 0, -2, 2, 158, 2, 159, -3, 0, 267386880, -1, 2, 160, 0, 7168, -1, 0, 65024, 2, 154, 2, 161, 2, 179, -7, 2, 168, -8, 2, 162, -1, 0, 1426112704, 2, 163, -1, 2, 164, 0, 271581216, 0, 2149777408, 2, 23, 2, 161, 2, 124, 0, 851967, 2, 180, -1, 2, 23, 2, 181, -4, 2, 158, -20, 2, 195, 2, 165, -56, 0, 3145728, 2, 185, -4, 2, 166, 2, 124, -4, 0, 32505856, -1, 2, 167, -1, 0, 2147385088, 2, 90, 1, 2155905152, 2, -3, 2, 103, 2, 0, 2, 168, -2, 2, 169, -6, 2, 170, 0, 4026597375, 0, 1, -1, 0, 1, -1, 2, 171, -3, 2, 117, 2, 64, -2, 2, 166, -2, 2, 176, 2, 124, -878, 2, 159, -36, 2, 172, -1, 2, 201, -10, 2, 188, -5, 2, 174, -6, 0, 4294965251, 2, 27, -1, 2, 173, -1, 2, 174, -2, 0, 4227874752, -3, 0, 2146435072, 2, 159, -2, 0, 1006649344, 2, 124, -1, 2, 90, 0, 201375744, -3, 0, 134217720, 2, 90, 0, 4286677377, 0, 32896, -1, 2, 158, -3, 2, 175, -349, 2, 176, 0, 1920, 2, 177, 3, 0, 264, -11, 2, 157, -2, 2, 178, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0, 524284, -11, 2, 23, -1, 2, 187, -1, 2, 184, 0, 3221291007, 2, 178, -1, 2, 202, 0, 2158720, -3, 2, 159, 0, 1, -4, 2, 124, 0, 3808625411, 0, 3489628288, 2, 200, 0, 1207959680, 0, 3221274624, 2, 0, -3, 2, 179, 0, 120, 0, 7340032, -2, 2, 180, 2, 4, 2, 23, 2, 163, 3, 0, 4, 2, 159, -1, 2, 181, 2, 177, -1, 0, 8176, 2, 182, 2, 179, 2, 183, -1, 0, 4290773232, 2, 0, -4, 2, 163, 2, 189, 0, 15728640, 2, 177, -1, 2, 161, -1, 0, 4294934512, 3, 0, 4, -9, 2, 90, 2, 170, 2, 184, 3, 0, 4, 0, 704, 0, 1849688064, 2, 185, -1, 2, 124, 0, 4294901887, 2, 0, 0, 130547712, 0, 1879048192, 2, 199, 3, 0, 2, -1, 2, 186, 2, 187, -1, 0, 17829776, 0, 2025848832, 0, 4261477888, -2, 2, 0, -1, 0, 4286580608, -1, 0, 29360128, 2, 192, 0, 16252928, 0, 3791388672, 2, 38, 3, 0, 2, -2, 2, 196, 2, 0, -1, 2, 103, -1, 0, 66584576, -1, 2, 191, 3, 0, 9, 2, 124, -1, 0, 4294755328, 3, 0, 2, -1, 2, 161, 2, 178, 3, 0, 2, 2, 23, 2, 188, 2, 90, -2, 0, 245760, 0, 2147418112, -1, 2, 150, 2, 203, 0, 4227923456, -1, 2, 164, 2, 161, 2, 90, -3, 0, 4292870145, 0, 262144, 2, 124, 3, 0, 2, 0, 1073758848, 2, 189, -1, 0, 4227921920, 2, 190, 0, 68289024, 0, 528402016, 0, 4292927536, 3, 0, 4, -2, 0, 268435456, 2, 91, -2, 2, 191, 3, 0, 5, -1, 2, 192, 2, 163, 2, 0, -2, 0, 4227923936, 2, 62, -1, 2, 155, 2, 95, 2, 0, 2, 154, 2, 158, 3, 0, 6, -1, 2, 177, 3, 0, 3, -2, 0, 2146959360, 0, 9440640, 0, 104857600, 0, 4227923840, 3, 0, 2, 0, 768, 2, 193, 2, 77, -2, 2, 161, -2, 2, 119, -1, 2, 155, 3, 0, 8, 0, 512, 0, 8388608, 2, 194, 2, 172, 2, 187, 0, 4286578944, 3, 0, 2, 0, 1152, 0, 1266679808, 2, 191, 0, 576, 0, 4261707776, 2, 95, 3, 0, 9, 2, 155, 3, 0, 5, 2, 16, -1, 0, 2147221504, -28, 2, 178, 3, 0, 3, -3, 0, 4292902912, -6, 2, 96, 3, 0, 85, -33, 0, 4294934528, 3, 0, 126, -18, 2, 195, 3, 0, 269, -17, 2, 155, 2, 124, 2, 198, 3, 0, 2, 2, 23, 0, 4290822144, -2, 0, 67174336, 0, 520093700, 2, 17, 3, 0, 21, -2, 2, 179, 3, 0, 3, -2, 0, 30720, -1, 0, 32512, 3, 0, 2, 0, 4294770656, -191, 2, 174, -38, 2, 170, 2, 0, 2, 196, 3, 0, 279, -8, 2, 124, 2, 0, 0, 4294508543, 0, 65295, -11, 2, 177, 3, 0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 155, -7, 2, 170, -1, 0, 384, -1, 0, 133693440, -3, 2, 196, -2, 2, 26, 3, 0, 4, 2, 169, -2, 2, 90, 2, 155, 3, 0, 4, -2, 2, 164, -1, 2, 150, 0, 335552923, 2, 197, -1, 0, 538974272, 0, 2214592512, 0, 132000, -10, 0, 192, -8, 0, 12288, -21, 0, 134213632, 0, 4294901761, 3, 0, 42, 0, 100663424, 0, 4294965284, 3, 0, 6, -1, 0, 3221282816, 2, 198, 3, 0, 11, -1, 2, 199, 3, 0, 40, -6, 0, 4286578784, 2, 0, -2, 0, 1006694400, 3, 0, 24, 2, 35, -1, 2, 94, 3, 0, 2, 0, 1, 2, 163, 3, 0, 6, 2, 197, 0, 4110942569, 0, 1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2, 0, 2, 45, 3, 0, 8, -1, 2, 158, -2, 2, 169, 0, 98304, 0, 65537, 2, 170, -5, 0, 4294950912, 2, 0, 2, 118, 0, 65528, 2, 177, 0, 4294770176, 2, 26, 3, 0, 4, -30, 2, 174, 0, 3758153728, -3, 2, 169, -2, 2, 155, 2, 188, 2, 158, -1, 2, 191, -1, 2, 161, 0, 4294754304, 3, 0, 2, -3, 0, 33554432, -2, 2, 200, -3, 2, 169, 0, 4175478784, 2, 201, 0, 4286643712, 0, 4286644216, 2, 0, -4, 2, 202, -1, 2, 165, 0, 4227923967, 3, 0, 32, -1334, 2, 163, 2, 0, -129, 2, 94, -6, 2, 163, -180, 2, 203, -233, 2, 4, 3, 0, 96, -16, 2, 163, 3, 0, 47, -154, 2, 165, 3, 0, 22381, -7, 2, 17, 3, 0, 6128], [4294967295, 4294967291, 4092460543, 4294828031, 4294967294, 134217726, 268435455, 2147483647, 1048575, 1073741823, 3892314111, 134217727, 1061158911, 536805376, 4294910143, 4160749567, 4294901759, 4294901760, 536870911, 262143, 8388607, 4294902783, 4294918143, 65535, 67043328, 2281701374, 4294967232, 2097151, 4294903807, 4194303, 255, 67108863, 4294967039, 511, 524287, 131071, 127, 4292870143, 4294902271, 4294549487, 33554431, 1023, 67047423, 4294901888, 4286578687, 4294770687, 67043583, 32767, 15, 2047999, 67043343, 16777215, 4294902000, 4294934527, 4294966783, 4294967279, 2047, 262083, 20511, 4290772991, 41943039, 493567, 4294959104, 603979775, 65536, 602799615, 805044223, 4294965206, 8191, 1031749119, 4294917631, 2134769663, 4286578493, 4282253311, 4294942719, 33540095, 4294905855, 4294967264, 2868854591, 1608515583, 265232348, 534519807, 2147614720, 1060109444, 4093640016, 17376, 2139062143, 224, 4169138175, 4294909951, 4286578688, 4294967292, 4294965759, 2044, 4292870144, 4294966272, 4294967280, 8289918, 4294934399, 4294901775, 4294965375, 1602223615, 4294967259, 4294443008, 268369920, 4292804608, 486341884, 4294963199, 3087007615, 1073692671, 4128527, 4279238655, 4294902015, 4294966591, 2445279231, 3670015, 3238002687, 31, 63, 4294967288, 4294705151, 4095, 3221208447, 4294549472, 2147483648, 4285526655, 4294966527, 4294705152, 4294966143, 64, 4294966719, 16383, 3774873592, 458752, 536807423, 67043839, 3758096383, 3959414372, 3755993023, 2080374783, 4294835295, 4294967103, 4160749565, 4087, 184024726, 2862017156, 1593309078, 268434431, 268434414, 4294901763, 536870912, 2952790016, 202506752, 139264, 402653184, 4261412864, 4227922944, 49152, 61440, 3758096384, 117440512, 65280, 3233808384, 3221225472, 2097152, 4294965248, 32768, 57152, 67108864, 4293918720, 4290772992, 25165824, 57344, 4227915776, 4278190080, 4227907584, 65520, 4026531840, 4227858432, 4160749568, 3758129152, 4294836224, 63488, 1073741824, 4294967040, 4194304, 251658240, 196608, 4294963200, 64512, 417808, 4227923712, 12582912, 50331648, 65472, 4294967168, 4294966784, 16, 4294917120, 2080374784, 4096, 65408, 524288, 65532]);

  const TokenLookup = [
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      125,
      133,
      125,
      125,
      127,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      126,
      125,
      16842797,
      134283267,
      128,
      208897,
      8457012,
      8455748,
      134283267,
      67174411,
      16,
      8457011,
      25233967,
      18,
      25233968,
      67108877,
      8457013,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      134283266,
      21,
      1074790417,
      8456255,
      1077936157,
      8456256,
      22,
      130,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      208897,
      69271571,
      134,
      20,
      8455494,
      208897,
      129,
      4096,
      4096,
      4096,
      4096,
      4096,
      4096,
      4096,
      208897,
      4096,
      208897,
      208897,
      4096,
      208897,
      4096,
      208897,
      4096,
      208897,
      4096,
      4096,
      4096,
      208897,
      4096,
      4096,
      208897,
      4096,
      4096,
      2162700,
      8455237,
      1074790415,
      16842798,
      126
  ];
  function nextToken(parser, context) {
      parser.flags = (parser.flags | 1) ^ 1;
      parser.startPos = parser.index;
      parser.startColumn = parser.column;
      parser.startLine = parser.line;
      parser.token = scanSingleToken(parser, context, 0);
      if (parser.onToken && parser.token !== 1048576) {
          const loc = {
              start: {
                  line: parser.linePos,
                  column: parser.colPos
              },
              end: {
                  line: parser.line,
                  column: parser.column
              }
          };
          parser.onToken(convertTokenType(parser.token), parser.tokenPos, parser.index, loc);
      }
  }
  function scanSingleToken(parser, context, state) {
      const isStartOfLine = parser.index === 0;
      const source = parser.source;
      let startPos = parser.index;
      let startLine = parser.line;
      let startColumn = parser.column;
      while (parser.index < parser.end) {
          parser.tokenPos = parser.index;
          parser.colPos = parser.column;
          parser.linePos = parser.line;
          let char = parser.currentChar;
          if (char <= 0x7e) {
              const token = TokenLookup[char];
              switch (token) {
                  case 67174411:
                  case 16:
                  case 2162700:
                  case 1074790415:
                  case 69271571:
                  case 20:
                  case 21:
                  case 1074790417:
                  case 18:
                  case 16842798:
                  case 130:
                  case 126:
                      advanceChar(parser);
                      return token;
                  case 208897:
                      return scanIdentifier(parser, context, 0);
                  case 4096:
                      return scanIdentifier(parser, context, 1);
                  case 134283266:
                      return scanNumber(parser, context, 16 | 128);
                  case 134283267:
                      return scanString(parser, context, char);
                  case 129:
                      return scanTemplate(parser, context);
                  case 134:
                      return scanUnicodeIdentifier(parser, context);
                  case 128:
                      return scanPrivateName(parser);
                  case 125:
                      advanceChar(parser);
                      break;
                  case 127:
                      state |= 1 | 4;
                      scanNewLine(parser);
                      break;
                  case 133:
                      consumeLineFeed(parser, state);
                      state = (state & ~4) | 1;
                      break;
                  case 8456255:
                      let ch = advanceChar(parser);
                      if (parser.index < parser.end) {
                          if (ch === 60) {
                              if (parser.index < parser.end && advanceChar(parser) === 61) {
                                  advanceChar(parser);
                                  return 4194334;
                              }
                              return 8456513;
                          }
                          else if (ch === 61) {
                              advanceChar(parser);
                              return 8455997;
                          }
                          if (ch === 33) {
                              const index = parser.index + 1;
                              if (index + 1 < parser.end &&
                                  source.charCodeAt(index) === 45 &&
                                  source.charCodeAt(index + 1) == 45) {
                                  parser.column += 3;
                                  parser.currentChar = source.charCodeAt((parser.index += 3));
                                  state = skipSingleHTMLComment(parser, source, state, context, 2, parser.tokenPos, parser.linePos, parser.colPos);
                                  startPos = parser.tokenPos;
                                  startLine = parser.linePos;
                                  startColumn = parser.colPos;
                                  continue;
                              }
                              return 8456255;
                          }
                          if (ch === 47) {
                              if ((context & 16) < 1)
                                  return 8456255;
                              const index = parser.index + 1;
                              if (index < parser.end) {
                                  ch = source.charCodeAt(index);
                                  if (ch === 42 || ch === 47)
                                      break;
                              }
                              advanceChar(parser);
                              return 25;
                          }
                      }
                      return 8456255;
                  case 1077936157: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 61) {
                          if (advanceChar(parser) === 61) {
                              advanceChar(parser);
                              return 8455993;
                          }
                          return 8455995;
                      }
                      if (ch === 62) {
                          advanceChar(parser);
                          return 10;
                      }
                      return 1077936157;
                  }
                  case 16842797:
                      if (advanceChar(parser) !== 61) {
                          return 16842797;
                      }
                      if (advanceChar(parser) !== 61) {
                          return 8455996;
                      }
                      advanceChar(parser);
                      return 8455994;
                  case 8457012:
                      if (advanceChar(parser) !== 61)
                          return 8457012;
                      advanceChar(parser);
                      return 4194342;
                  case 8457011: {
                      advanceChar(parser);
                      if (parser.index >= parser.end)
                          return 8457011;
                      const ch = parser.currentChar;
                      if (ch === 61) {
                          advanceChar(parser);
                          return 4194340;
                      }
                      if (ch !== 42)
                          return 8457011;
                      if (advanceChar(parser) !== 61)
                          return 8457270;
                      advanceChar(parser);
                      return 4194337;
                  }
                  case 8455494:
                      if (advanceChar(parser) !== 61)
                          return 8455494;
                      advanceChar(parser);
                      return 4194343;
                  case 25233967: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 43) {
                          advanceChar(parser);
                          return 33619995;
                      }
                      if (ch === 61) {
                          advanceChar(parser);
                          return 4194338;
                      }
                      return 25233967;
                  }
                  case 25233968: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 45) {
                          advanceChar(parser);
                          if ((state & 1 || isStartOfLine) && parser.currentChar === 62) {
                              if ((context & 256) === 0)
                                  report(parser, 108);
                              advanceChar(parser);
                              state = skipSingleHTMLComment(parser, source, state, context, 3, startPos, startLine, startColumn);
                              startPos = parser.tokenPos;
                              startLine = parser.linePos;
                              startColumn = parser.colPos;
                              continue;
                          }
                          return 33619996;
                      }
                      if (ch === 61) {
                          advanceChar(parser);
                          return 4194339;
                      }
                      return 25233968;
                  }
                  case 8457013: {
                      advanceChar(parser);
                      if (parser.index < parser.end) {
                          const ch = parser.currentChar;
                          if (ch === 47) {
                              advanceChar(parser);
                              state = skipSingleLineComment(parser, source, state, 0, parser.tokenPos, parser.linePos, parser.colPos);
                              startPos = parser.tokenPos;
                              startLine = parser.linePos;
                              startColumn = parser.colPos;
                              continue;
                          }
                          if (ch === 42) {
                              advanceChar(parser);
                              state = skipMultiLineComment(parser, source, state);
                              startPos = parser.tokenPos;
                              startLine = parser.linePos;
                              startColumn = parser.colPos;
                              continue;
                          }
                          if (context & 32768) {
                              return scanRegularExpression(parser, context);
                          }
                          if (ch === 61) {
                              advanceChar(parser);
                              return 4259877;
                          }
                      }
                      return 8457013;
                  }
                  case 67108877:
                      const next = advanceChar(parser);
                      if (next >= 48 && next <= 57)
                          return scanNumber(parser, context, 64 | 16);
                      if (next === 46) {
                          const index = parser.index + 1;
                          if (index < parser.end && source.charCodeAt(index) === 46) {
                              parser.column += 2;
                              parser.currentChar = source.charCodeAt((parser.index += 2));
                              return 14;
                          }
                      }
                      return 67108877;
                  case 8455237: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 124) {
                          advanceChar(parser);
                          return 8979000;
                      }
                      if (ch === 61) {
                          advanceChar(parser);
                          return 4194344;
                      }
                      return 8455237;
                  }
                  case 8456256: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 61) {
                          advanceChar(parser);
                          return 8455998;
                      }
                      if (ch !== 62)
                          return 8456256;
                      advanceChar(parser);
                      if (parser.index < parser.end) {
                          const ch = parser.currentChar;
                          if (ch === 62) {
                              if (advanceChar(parser) === 61) {
                                  advanceChar(parser);
                                  return 4194336;
                              }
                              return 8456515;
                          }
                          if (ch === 61) {
                              advanceChar(parser);
                              return 4194335;
                          }
                      }
                      return 8456514;
                  }
                  case 8455748: {
                      advanceChar(parser);
                      const ch = parser.currentChar;
                      if (ch === 38) {
                          advanceChar(parser);
                          return 8979255;
                      }
                      if (ch === 61) {
                          advanceChar(parser);
                          return 4194345;
                      }
                      return 8455748;
                  }
                  case 22: {
                      let ch = advanceChar(parser);
                      if (ch === 63) {
                          advanceChar(parser);
                          return 276889979;
                      }
                      if (ch === 46) {
                          const index = parser.index + 1;
                          if (index < parser.end) {
                              ch = source.charCodeAt(index);
                              if (!(ch >= 48 && ch <= 57)) {
                                  advanceChar(parser);
                                  return 67108988;
                              }
                          }
                      }
                      return 22;
                  }
              }
          }
          else {
              if ((char ^ 8232) <= 1) {
                  state = (state & ~4) | 1;
                  scanNewLine(parser);
                  continue;
              }
              if ((char & 0xfc00) === 0xd800 || ((unicodeLookup[(char >>> 5) + 34816] >>> char) & 31 & 1) !== 0) {
                  if ((char & 0xfc00) === 0xdc00) {
                      char = ((char & 0x3ff) << 10) | (char & 0x3ff) | 0x10000;
                      if (((unicodeLookup[(char >>> 5) + 0] >>> char) & 31 & 1) === 0) {
                          report(parser, 18, fromCodePoint(char));
                      }
                      parser.index++;
                      parser.currentChar = char;
                  }
                  parser.column++;
                  parser.tokenValue = '';
                  return scanIdentifierSlowCase(parser, context, 0, 0);
              }
              if (isExoticECMAScriptWhitespace(char)) {
                  advanceChar(parser);
                  continue;
              }
              report(parser, 18, fromCodePoint(char));
          }
      }
      return 1048576;
  }

  const CommentTypes = ['SingleLine', 'MultiLine', 'HTMLOpen', 'HTMLClose', 'HashbangComment'];
  function skipHashBang(parser) {
      const source = parser.source;
      if (parser.currentChar === 35 && source.charCodeAt(parser.index + 1) === 33) {
          advanceChar(parser);
          advanceChar(parser);
          skipSingleLineComment(parser, source, 0, 4, parser.tokenPos, parser.linePos, parser.colPos);
      }
  }
  function skipSingleHTMLComment(parser, source, state, context, type, start, line, column) {
      if (context & 2048)
          report(parser, 0);
      return skipSingleLineComment(parser, source, state, type, start, line, column);
  }
  function skipSingleLineComment(parser, source, state, type, start, line, column) {
      const { index } = parser;
      parser.tokenPos = parser.index;
      parser.linePos = parser.line;
      parser.colPos = parser.column;
      while (parser.index < parser.end) {
          if (CharTypes[parser.currentChar] & 8) {
              const isCR = parser.currentChar === 13;
              scanNewLine(parser);
              if (isCR && parser.index < parser.end && parser.currentChar === 10)
                  parser.currentChar = source.charCodeAt(++parser.index);
              break;
          }
          else if ((parser.currentChar ^ 8232) <= 1) {
              scanNewLine(parser);
              break;
          }
          advanceChar(parser);
          parser.tokenPos = parser.index;
          parser.linePos = parser.line;
          parser.colPos = parser.column;
      }
      if (parser.onComment) {
          const loc = {
              start: {
                  line,
                  column
              },
              end: {
                  line: parser.linePos,
                  column: parser.colPos
              }
          };
          parser.onComment(CommentTypes[type & 0xff], source.slice(index, parser.tokenPos), start, parser.tokenPos, loc);
      }
      return state | 1;
  }
  function skipMultiLineComment(parser, source, state) {
      const { index } = parser;
      while (parser.index < parser.end) {
          if (parser.currentChar < 0x2b) {
              let skippedOneAsterisk = false;
              while (parser.currentChar === 42) {
                  if (!skippedOneAsterisk) {
                      state &= ~4;
                      skippedOneAsterisk = true;
                  }
                  if (advanceChar(parser) === 47) {
                      advanceChar(parser);
                      if (parser.onComment) {
                          const loc = {
                              start: {
                                  line: parser.linePos,
                                  column: parser.colPos
                              },
                              end: {
                                  line: parser.line,
                                  column: parser.column
                              }
                          };
                          parser.onComment(CommentTypes[1 & 0xff], source.slice(index, parser.index - 2), index - 2, parser.index, loc);
                      }
                      parser.tokenPos = parser.index;
                      parser.linePos = parser.line;
                      parser.colPos = parser.column;
                      return state;
                  }
              }
              if (skippedOneAsterisk) {
                  continue;
              }
              if (CharTypes[parser.currentChar] & 8) {
                  if (parser.currentChar === 13) {
                      state |= 1 | 4;
                      scanNewLine(parser);
                  }
                  else {
                      consumeLineFeed(parser, state);
                      state = (state & ~4) | 1;
                  }
              }
              else {
                  advanceChar(parser);
              }
          }
          else if ((parser.currentChar ^ 8232) <= 1) {
              state = (state & ~4) | 1;
              scanNewLine(parser);
          }
          else {
              state &= ~4;
              advanceChar(parser);
          }
      }
      report(parser, 16);
  }

  function advanceChar(parser) {
      parser.column++;
      return (parser.currentChar = parser.source.charCodeAt(++parser.index));
  }
  function consumeMultiUnitCodePoint(parser, hi) {
      if ((hi & 0xfc00) !== 55296)
          return 0;
      const lo = parser.source.charCodeAt(parser.index + 1);
      if ((lo & 0xfc00) !== 0xdc00)
          return 0;
      hi = parser.currentChar = 65536 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
      if (((unicodeLookup[(hi >>> 5) + 0] >>> hi) & 31 & 1) === 0) {
          report(parser, 18, fromCodePoint(hi));
      }
      parser.index++;
      parser.column++;
      return 1;
  }
  function consumeLineFeed(parser, state) {
      parser.currentChar = parser.source.charCodeAt(++parser.index);
      parser.flags |= 1;
      if ((state & 4) === 0) {
          parser.column = 0;
          parser.line++;
      }
  }
  function scanNewLine(parser) {
      parser.flags |= 1;
      parser.currentChar = parser.source.charCodeAt(++parser.index);
      parser.column = 0;
      parser.line++;
  }
  function isExoticECMAScriptWhitespace(ch) {
      return (ch === 160 ||
          ch === 65279 ||
          ch === 133 ||
          ch === 5760 ||
          (ch >= 8192 && ch <= 8203) ||
          ch === 8239 ||
          ch === 8287 ||
          ch === 12288 ||
          ch === 8201 ||
          ch === 65519);
  }
  function fromCodePoint(codePoint) {
      return codePoint <= 65535
          ? String.fromCharCode(codePoint)
          : String.fromCharCode(codePoint >>> 10) + String.fromCharCode(codePoint & 0x3ff);
  }
  function toHex(code) {
      return code < 65 ? code - 48 : (code - 65 + 10) & 0xf;
  }
  function convertTokenType(t) {
      switch (t) {
          case 134283266:
              return 'NumericLiteral';
          case 134283267:
              return 'StringLiteral';
          case 86021:
          case 86022:
              return 'BooleanLiteral';
          case 86023:
              return 'NullLiteral';
          case 65540:
              return 'RegularExpression';
          case 67174408:
          case 67174409:
          case 129:
              return 'TemplateLiteral';
          default:
              if ((t & 143360) === 143360)
                  return 'Identifier';
              if ((t & 4096) === 4096)
                  return 'Keyword';
              return 'Punctuator';
      }
  }

  const CharTypes = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      8 | 1024,
      0,
      0,
      8 | 2048,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      8192,
      0,
      1 | 2,
      0,
      0,
      8192,
      0,
      0,
      0,
      256,
      0,
      256 | 32768,
      0,
      0,
      2 | 16 | 128 | 32 | 64,
      2 | 16 | 128 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 32 | 64,
      2 | 16 | 512 | 64,
      2 | 16 | 512 | 64,
      0,
      0,
      16384,
      0,
      0,
      0,
      0,
      1 | 2 | 64,
      1 | 2 | 64,
      1 | 2 | 64,
      1 | 2 | 64,
      1 | 2 | 64,
      1 | 2 | 64,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      1 | 2,
      0,
      1,
      0,
      0,
      1 | 2 | 4096,
      0,
      1 | 2 | 4 | 64,
      1 | 2 | 4 | 64,
      1 | 2 | 4 | 64,
      1 | 2 | 4 | 64,
      1 | 2 | 4 | 64,
      1 | 2 | 4 | 64,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      1 | 2 | 4,
      16384,
      0,
      0,
      0,
      0
  ];
  const isIdStart = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0
  ];
  const isIdPart = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0
  ];
  function isIdentifierStart(code) {
      return code <= 0x7F
          ? isIdStart[code]
          : (unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1;
  }
  function isIdentifierPart(code) {
      return code <= 0x7F
          ? isIdPart[code]
          : (unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1 || (code === 8204 || code === 8205);
  }

  const KeywordDescTable = [
      'end of source',
      'identifier', 'number', 'string', 'regular expression',
      'false', 'true', 'null',
      'template continuation', 'template tail',
      '=>', '(', '{', '.', '...', '}', ')', ';', ',', '[', ']', ':', '?', '\'', '"', '</', '/>',
      '++', '--',
      '=', '<<=', '>>=', '>>>=', '**=', '+=', '-=', '*=', '/=', '%=', '^=', '|=',
      '&=',
      'typeof', 'delete', 'void', '!', '~', '+', '-', 'in', 'instanceof', '*', '%', '/', '**', '&&',
      '||', '===', '!==', '==', '!=', '<=', '>=', '<', '>', '<<', '>>', '>>>', '&', '|', '^',
      'var', 'let', 'const',
      'break', 'case', 'catch', 'class', 'continue', 'debugger', 'default', 'do', 'else', 'export',
      'extends', 'finally', 'for', 'function', 'if', 'import', 'new', 'return', 'super', 'switch',
      'this', 'throw', 'try', 'while', 'with',
      'implements', 'interface', 'package', 'private', 'protected', 'public', 'static', 'yield',
      'as', 'async', 'await', 'constructor', 'get', 'set', 'from', 'of',
      'enum', 'eval', 'arguments', 'escaped keyword', 'escaped future reserved keyword', 'reserved if strict', '#',
      'BigIntLiteral', '??', '?.', 'WhiteSpace', 'Illegal', 'LineTerminator', 'PrivateField',
      'Template', '@', 'target', 'meta', 'LineFeed', 'Escaped', 'JSXText'
  ];
  const descKeywordTable = Object.create(null, {
      this: { value: 86110 },
      function: { value: 86103 },
      if: { value: 20568 },
      return: { value: 20571 },
      var: { value: 86087 },
      else: { value: 20562 },
      for: { value: 20566 },
      new: { value: 86106 },
      in: { value: 8738865 },
      typeof: { value: 16863274 },
      while: { value: 20577 },
      case: { value: 20555 },
      break: { value: 20554 },
      try: { value: 20576 },
      catch: { value: 20556 },
      delete: { value: 16863275 },
      throw: { value: 86111 },
      switch: { value: 86109 },
      continue: { value: 20558 },
      default: { value: 20560 },
      instanceof: { value: 8476722 },
      do: { value: 20561 },
      void: { value: 16863276 },
      finally: { value: 20565 },
      async: { value: 143468 },
      await: { value: 209005 },
      class: { value: 86093 },
      const: { value: 86089 },
      constructor: { value: 12398 },
      debugger: { value: 20559 },
      export: { value: 20563 },
      extends: { value: 20564 },
      false: { value: 86021 },
      from: { value: 12401 },
      get: { value: 12399 },
      implements: { value: 36963 },
      import: { value: 86105 },
      interface: { value: 36964 },
      let: { value: 241736 },
      null: { value: 86023 },
      of: { value: 274546 },
      package: { value: 36965 },
      private: { value: 36966 },
      protected: { value: 36967 },
      public: { value: 36968 },
      set: { value: 12400 },
      static: { value: 36969 },
      super: { value: 86108 },
      true: { value: 86022 },
      with: { value: 20578 },
      yield: { value: 241770 },
      enum: { value: 20595 },
      eval: { value: 537079924 },
      as: { value: 12395 },
      arguments: { value: 537079925 },
      target: { value: 143491 },
      meta: { value: 143492 },
  });

  function scanIdentifier(parser, context, isValidAsKeyword) {
      while (isIdPart[advanceChar(parser)]) { }
      parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
      return parser.currentChar !== 92 && parser.currentChar < 0x7e
          ? descKeywordTable[parser.tokenValue] || 208897
          : scanIdentifierSlowCase(parser, context, 0, isValidAsKeyword);
  }
  function scanUnicodeIdentifier(parser, context) {
      const cookedChar = scanIdentifierUnicodeEscape(parser);
      if (!isIdentifierPart(cookedChar))
          report(parser, 4);
      parser.tokenValue = fromCodePoint(cookedChar);
      return scanIdentifierSlowCase(parser, context, 1, CharTypes[cookedChar] & 4);
  }
  function scanIdentifierSlowCase(parser, context, hasEscape, isValidAsKeyword) {
      let start = parser.index;
      while (parser.index < parser.end) {
          if (parser.currentChar === 92) {
              parser.tokenValue += parser.source.slice(start, parser.index);
              hasEscape = 1;
              const code = scanIdentifierUnicodeEscape(parser);
              if (!isIdentifierPart(code))
                  report(parser, 4);
              isValidAsKeyword = isValidAsKeyword && CharTypes[code] & 4;
              parser.tokenValue += fromCodePoint(code);
              start = parser.index;
          }
          else if (isIdentifierPart(parser.currentChar) || consumeMultiUnitCodePoint(parser, parser.currentChar)) {
              advanceChar(parser);
          }
          else {
              break;
          }
      }
      if (parser.index <= parser.end) {
          parser.tokenValue += parser.source.slice(start, parser.index);
      }
      const length = parser.tokenValue.length;
      if (isValidAsKeyword && length >= 2 && length <= 11) {
          const token = descKeywordTable[parser.tokenValue];
          if (token === void 0)
              return 208897;
          if (!hasEscape)
              return token;
          if (context & 1024) {
              return token === 209005 && (context & (2048 | 4194304)) === 0
                  ? token
                  : token === 36969
                      ? 119
                      : (token & 36864) === 36864
                          ? 119
                          : 118;
          }
          if (context & 1073741824 &&
              (context & 8192) === 0 &&
              (token & 20480) === 20480)
              return token;
          if (token === 241770) {
              return context & 1073741824
                  ? 143480
                  : context & 2097152
                      ? 118
                      : token;
          }
          return token === 143468 && context & 1073741824
              ? 143480
              : (token & 36864) === 36864
                  ? token
                  : token === 209005 && (context & 4194304) === 0
                      ? token
                      : 118;
      }
      return 208897;
  }
  function scanPrivateName(parser) {
      if (!isIdentifierStart(advanceChar(parser)))
          report(parser, 93);
      return 128;
  }
  function scanIdentifierUnicodeEscape(parser) {
      if (parser.source.charCodeAt(parser.index + 1) !== 117) {
          report(parser, 4);
      }
      parser.currentChar = parser.source.charCodeAt((parser.index += 2));
      return scanUnicodeEscape(parser);
  }
  function scanUnicodeEscape(parser) {
      let codePoint = 0;
      const char = parser.currentChar;
      if (char === 123) {
          const begin = parser.index - 2;
          while (CharTypes[advanceChar(parser)] & 64) {
              codePoint = (codePoint << 4) | toHex(parser.currentChar);
              if (codePoint > 1114111)
                  reportScannerError(begin, parser.line, parser.index + 1, 101);
          }
          if (parser.currentChar !== 125) {
              reportScannerError(begin, parser.line, parser.index - 1, 6);
          }
          advanceChar(parser);
          return codePoint;
      }
      if ((CharTypes[char] & 64) === 0)
          report(parser, 6);
      const char2 = parser.source.charCodeAt(parser.index + 1);
      if ((CharTypes[char2] & 64) === 0)
          report(parser, 6);
      const char3 = parser.source.charCodeAt(parser.index + 2);
      if ((CharTypes[char3] & 64) === 0)
          report(parser, 6);
      const char4 = parser.source.charCodeAt(parser.index + 3);
      if ((CharTypes[char4] & 64) === 0)
          report(parser, 6);
      codePoint = (toHex(char) << 12) | (toHex(char2) << 8) | (toHex(char3) << 4) | toHex(char4);
      parser.currentChar = parser.source.charCodeAt((parser.index += 4));
      return codePoint;
  }

  function scanString(parser, context, quote) {
      const { index: start } = parser;
      let ret = '';
      let char = advanceChar(parser);
      let marker = parser.index;
      while ((CharTypes[char] & 8) === 0) {
          if (char === quote) {
              ret += parser.source.slice(marker, parser.index);
              advanceChar(parser);
              if (context & 512)
                  parser.tokenRaw = parser.source.slice(start, parser.index);
              parser.tokenValue = ret;
              return 134283267;
          }
          if ((char & 8) === 8 && char === 92) {
              ret += parser.source.slice(marker, parser.index);
              char = advanceChar(parser);
              if (char < 0x7f || char === 8232 || char === 8233) {
                  const code = parseEscape(parser, context, char);
                  if (code >= 0)
                      ret += fromCodePoint(code);
                  else
                      handleStringError(parser, code, 0);
              }
              else {
                  ret += fromCodePoint(char);
              }
              marker = parser.index + 1;
          }
          if (parser.index >= parser.end)
              report(parser, 14);
          char = advanceChar(parser);
      }
      report(parser, 14);
  }
  function parseEscape(parser, context, first) {
      switch (first) {
          case 98:
              return 8;
          case 102:
              return 12;
          case 114:
              return 13;
          case 110:
              return 10;
          case 116:
              return 9;
          case 118:
              return 11;
          case 13: {
              if (parser.index < parser.end) {
                  const nextChar = parser.source.charCodeAt(parser.index + 1);
                  if (nextChar === 10) {
                      parser.index = parser.index + 1;
                      parser.currentChar = nextChar;
                  }
              }
          }
          case 10:
          case 8232:
          case 8233:
              parser.column = -1;
              parser.line++;
              return -1;
          case 48:
          case 49:
          case 50:
          case 51: {
              let code = first - 48;
              let index = parser.index + 1;
              let column = parser.column + 1;
              if (index < parser.end) {
                  const next = parser.source.charCodeAt(index);
                  if ((CharTypes[next] & 32) === 0) {
                      if ((code !== 0 || CharTypes[next] & 512) && context & 1024)
                          return -2;
                  }
                  else if (context & 1024) {
                      return -2;
                  }
                  else {
                      parser.currentChar = next;
                      code = (code << 3) | (next - 48);
                      index++;
                      column++;
                      if (index < parser.end) {
                          const next = parser.source.charCodeAt(index);
                          if (CharTypes[next] & 32) {
                              parser.currentChar = next;
                              code = (code << 3) | (next - 48);
                              index++;
                              column++;
                          }
                      }
                      parser.flags |= 64;
                      parser.index = index - 1;
                      parser.column = column - 1;
                  }
              }
              return code;
          }
          case 52:
          case 53:
          case 54:
          case 55: {
              if (context & 1024)
                  return -2;
              let code = first - 48;
              const index = parser.index + 1;
              const column = parser.column + 1;
              if (index < parser.end) {
                  const next = parser.source.charCodeAt(index);
                  if (CharTypes[next] & 32) {
                      code = (code << 3) | (next - 48);
                      parser.currentChar = next;
                      parser.index = index;
                      parser.column = column;
                  }
              }
              parser.flags |= 64;
              return code;
          }
          case 120: {
              const ch1 = advanceChar(parser);
              if ((CharTypes[ch1] & 64) === 0)
                  return -4;
              const hi = toHex(ch1);
              const ch2 = advanceChar(parser);
              if ((CharTypes[ch2] & 64) === 0)
                  return -4;
              const lo = toHex(ch2);
              return (hi << 4) | lo;
          }
          case 117: {
              const ch = advanceChar(parser);
              if (parser.currentChar === 123) {
                  let code = 0;
                  while ((CharTypes[advanceChar(parser)] & 64) !== 0) {
                      code = (code << 4) | toHex(parser.currentChar);
                      if (code > 1114111)
                          return -5;
                  }
                  if (parser.currentChar < 1 || parser.currentChar !== 125) {
                      return -4;
                  }
                  return code;
              }
              else {
                  if ((CharTypes[ch] & 64) === 0)
                      return -4;
                  const ch2 = parser.source.charCodeAt(parser.index + 1);
                  if ((CharTypes[ch2] & 64) === 0)
                      return -4;
                  const ch3 = parser.source.charCodeAt(parser.index + 2);
                  if ((CharTypes[ch3] & 64) === 0)
                      return -4;
                  const ch4 = parser.source.charCodeAt(parser.index + 3);
                  if ((CharTypes[ch4] & 64) === 0)
                      return -4;
                  parser.index += 3;
                  parser.column += 3;
                  parser.currentChar = parser.source.charCodeAt(parser.index);
                  return (toHex(ch) << 12) | (toHex(ch2) << 8) | (toHex(ch3) << 4) | toHex(ch4);
              }
          }
          case 56:
          case 57:
              if ((context & 256) === 0)
                  return -3;
          default:
              return first;
      }
  }
  function handleStringError(state, code, isTemplate) {
      switch (code) {
          case -1:
              return;
          case -2:
              report(state, isTemplate ? 2 : 1);
          case -3:
              report(state, 13);
          case -4:
              report(state, 6);
          case -5:
              report(state, 101);
      }
  }

  function scanNumber(parser, context, kind) {
      let char = parser.currentChar;
      let value = 0;
      let digit = 9;
      let atStart = kind & 64 ? 0 : 1;
      let digits = 0;
      let allowSeparator = 0;
      if (kind & 64) {
          value = '.' + scanDecimalDigitsOrSeparator(parser, char);
          char = parser.currentChar;
          if (char === 110)
              report(parser, 11);
      }
      else {
          if (char === 48) {
              char = advanceChar(parser);
              if ((char | 32) === 120) {
                  kind = 8 | 128;
                  char = advanceChar(parser);
                  while (CharTypes[char] & (64 | 4096)) {
                      if (char === 95) {
                          if (!allowSeparator)
                              report(parser, 146);
                          allowSeparator = 0;
                          char = advanceChar(parser);
                          continue;
                      }
                      allowSeparator = 1;
                      value = value * 0x10 + toHex(char);
                      digits++;
                      char = advanceChar(parser);
                  }
                  if (digits < 1 || !allowSeparator) {
                      report(parser, digits < 1 ? 19 : 147);
                  }
              }
              else if ((char | 32) === 111) {
                  kind = 4 | 128;
                  char = advanceChar(parser);
                  while (CharTypes[char] & (32 | 4096)) {
                      if (char === 95) {
                          if (!allowSeparator) {
                              report(parser, 146);
                          }
                          allowSeparator = 0;
                          char = advanceChar(parser);
                          continue;
                      }
                      allowSeparator = 1;
                      value = value * 8 + (char - 48);
                      digits++;
                      char = advanceChar(parser);
                  }
                  if (digits < 1 || !allowSeparator) {
                      report(parser, digits < 1 ? 0 : 147);
                  }
              }
              else if ((char | 32) === 98) {
                  kind = 2 | 128;
                  char = advanceChar(parser);
                  while (CharTypes[char] & (128 | 4096)) {
                      if (char === 95) {
                          if (!allowSeparator) {
                              report(parser, 146);
                          }
                          allowSeparator = 0;
                          char = advanceChar(parser);
                          continue;
                      }
                      allowSeparator = 1;
                      value = value * 2 + (char - 48);
                      digits++;
                      char = advanceChar(parser);
                  }
                  if (digits < 1 || !allowSeparator) {
                      report(parser, digits < 1 ? 0 : 147);
                  }
              }
              else if (CharTypes[char] & 32) {
                  if (context & 1024)
                      report(parser, 1);
                  kind = 1;
                  while (CharTypes[char] & 16) {
                      if (CharTypes[char] & 512) {
                          kind = 32;
                          atStart = 0;
                          break;
                      }
                      value = value * 8 + (char - 48);
                      char = advanceChar(parser);
                  }
              }
              else if (CharTypes[char] & 512) {
                  if (context & 1024)
                      report(parser, 1);
                  parser.flags |= 64;
                  kind = 32;
              }
              else if (char === 95) {
                  report(parser, 0);
              }
          }
          if (kind & 48) {
              if (atStart) {
                  while (digit >= 0 && CharTypes[char] & (16 | 4096)) {
                      if (char === 95) {
                          char = advanceChar(parser);
                          if (char === 95 || kind & 32) {
                              reportScannerError(parser.index, parser.line, parser.index + 1, 146);
                          }
                          allowSeparator = 1;
                          continue;
                      }
                      allowSeparator = 0;
                      value = 10 * value + (char - 48);
                      char = advanceChar(parser);
                      --digit;
                  }
                  if (allowSeparator) {
                      reportScannerError(parser.index, parser.line, parser.index + 1, 147);
                  }
                  if (digit >= 0 && !isIdentifierStart(char) && char !== 46) {
                      parser.tokenValue = value;
                      if (context & 512)
                          parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
                      return 134283266;
                  }
              }
              value += scanDecimalDigitsOrSeparator(parser, char);
              char = parser.currentChar;
              if (char === 46) {
                  if (advanceChar(parser) === 95)
                      report(parser, 0);
                  kind = 64;
                  value += '.' + scanDecimalDigitsOrSeparator(parser, parser.currentChar);
                  char = parser.currentChar;
              }
          }
      }
      const end = parser.index;
      let isBigInt = 0;
      if (char === 110 && kind & 128) {
          isBigInt = 1;
          char = advanceChar(parser);
      }
      else {
          if ((char | 32) === 101) {
              char = advanceChar(parser);
              if (CharTypes[char] & 256)
                  char = advanceChar(parser);
              const { index } = parser;
              if ((CharTypes[char] & 16) < 1)
                  report(parser, 10);
              value += parser.source.substring(end, index) + scanDecimalDigitsOrSeparator(parser, char);
              char = parser.currentChar;
          }
      }
      if ((parser.index < parser.end && CharTypes[char] & 16) || isIdentifierStart(char)) {
          report(parser, 12);
      }
      if (isBigInt) {
          parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
          parser.tokenValue = BigInt(value);
          return 134283386;
      }
      parser.tokenValue =
          kind & (1 | 2 | 8 | 4)
              ? value
              : kind & 32
                  ? parseFloat(parser.source.substring(parser.tokenPos, parser.index))
                  : +value;
      if (context & 512)
          parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
      return 134283266;
  }
  function scanDecimalDigitsOrSeparator(parser, char) {
      let allowSeparator = 0;
      let start = parser.index;
      let ret = '';
      while (CharTypes[char] & (16 | 4096)) {
          if (char === 95) {
              const { index } = parser;
              char = advanceChar(parser);
              if (char === 95) {
                  reportScannerError(parser.index, parser.line, parser.index + 1, 146);
              }
              allowSeparator = 1;
              ret += parser.source.substring(start, index);
              start = parser.index;
              continue;
          }
          allowSeparator = 0;
          char = advanceChar(parser);
      }
      if (allowSeparator) {
          reportScannerError(parser.index, parser.line, parser.index + 1, 147);
      }
      return ret + parser.source.substring(start, parser.index);
  }

  function scanTemplate(parser, context) {
      const { index: start } = parser;
      let token = 67174409;
      let ret = '';
      let char = advanceChar(parser);
      while (char !== 96) {
          if (char === 36 && parser.source.charCodeAt(parser.index + 1) === 123) {
              advanceChar(parser);
              token = 67174408;
              break;
          }
          else if ((char & 8) === 8 && char === 92) {
              char = advanceChar(parser);
              if (char > 0x7e) {
                  ret += fromCodePoint(char);
              }
              else {
                  const code = parseEscape(parser, context | 1024, char);
                  if (code >= 0) {
                      ret += fromCodePoint(code);
                  }
                  else if (code !== -1 && context & 65536) {
                      ret = undefined;
                      char = scanBadTemplate(parser, char);
                      if (char < 0)
                          token = 67174408;
                      break;
                  }
                  else {
                      handleStringError(parser, code, 1);
                  }
              }
          }
          else {
              if (parser.index < parser.end &&
                  char === 13 &&
                  parser.source.charCodeAt(parser.index) === 10) {
                  ret += fromCodePoint(char);
                  parser.currentChar = parser.source.charCodeAt(++parser.index);
              }
              if (((char & 83) < 3 && char === 10) || (char ^ 8232) <= 1) {
                  parser.column = -1;
                  parser.line++;
              }
              ret += fromCodePoint(char);
          }
          if (parser.index >= parser.end)
              report(parser, 15);
          char = advanceChar(parser);
      }
      advanceChar(parser);
      parser.tokenValue = ret;
      parser.tokenRaw = parser.source.slice(start + 1, parser.index - (token === 67174409 ? 1 : 2));
      return token;
  }
  function scanBadTemplate(parser, ch) {
      while (ch !== 96) {
          switch (ch) {
              case 36: {
                  const index = parser.index + 1;
                  if (index < parser.end && parser.source.charCodeAt(index) === 123) {
                      parser.index = index;
                      parser.column++;
                      return -ch;
                  }
                  break;
              }
              case 10:
              case 8232:
              case 8233:
                  parser.column = -1;
                  parser.line++;
          }
          if (parser.index >= parser.end)
              report(parser, 15);
          ch = advanceChar(parser);
      }
      return ch;
  }
  function scanTemplateTail(parser, context) {
      if (parser.index >= parser.end)
          report(parser, 0);
      parser.index--;
      parser.column--;
      return scanTemplate(parser, context);
  }

  function scanRegularExpression(parser, context) {
      const bodyStart = parser.index;
      let preparseState = 0;
      loop: while (true) {
          const ch = parser.currentChar;
          advanceChar(parser);
          if (preparseState & 1) {
              preparseState &= ~1;
          }
          else {
              switch (ch) {
                  case 47:
                      if (!preparseState)
                          break loop;
                      else
                          break;
                  case 92:
                      preparseState |= 1;
                      break;
                  case 91:
                      preparseState |= 2;
                      break;
                  case 93:
                      preparseState &= 1;
                      break;
                  case 13:
                  case 10:
                  case 8232:
                  case 8233:
                      report(parser, 32);
              }
          }
          if (parser.index >= parser.source.length) {
              return report(parser, 32);
          }
      }
      const bodyEnd = parser.index - 1;
      let mask = 0;
      let char = parser.currentChar;
      const { index: flagStart } = parser;
      while (isIdentifierPart(char)) {
          switch (char) {
              case 103:
                  if (mask & 2)
                      report(parser, 34, 'g');
                  mask |= 2;
                  break;
              case 105:
                  if (mask & 1)
                      report(parser, 34, 'i');
                  mask |= 1;
                  break;
              case 109:
                  if (mask & 4)
                      report(parser, 34, 'm');
                  mask |= 4;
                  break;
              case 117:
                  if (mask & 16)
                      report(parser, 34, 'g');
                  mask |= 16;
                  break;
              case 121:
                  if (mask & 8)
                      report(parser, 34, 'y');
                  mask |= 8;
                  break;
              case 115:
                  if (mask & 12)
                      report(parser, 34, 's');
                  mask |= 12;
                  break;
              default:
                  report(parser, 33);
          }
          char = advanceChar(parser);
      }
      const flags = parser.source.slice(flagStart, parser.index);
      const pattern = parser.source.slice(bodyStart, bodyEnd);
      parser.tokenRegExp = { pattern, flags };
      if (context & 512)
          parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
      parser.tokenValue = validate(parser, pattern, flags);
      return 65540;
  }
  function validate(parser, pattern, flags) {
      try {
          return new RegExp(pattern, flags);
      }
      catch (e) {
          report(parser, 32);
      }
  }

  function scanJSXAttributeValue(parser, context) {
      parser.startPos = parser.tokenPos = parser.index;
      parser.startColumn = parser.colPos = parser.column;
      parser.startLine = parser.linePos = parser.line;
      parser.token =
          CharTypes[parser.currentChar] & 8192
              ? scanJSXString(parser, context)
              : scanSingleToken(parser, context, 0);
      return parser.token;
  }
  function scanJSXString(parser, context) {
      const quote = parser.currentChar;
      let char = advanceChar(parser);
      const start = parser.index;
      while (char !== quote) {
          if (parser.index >= parser.end)
              report(parser, 14);
          char = advanceChar(parser);
      }
      if (char !== quote)
          report(parser, 14);
      parser.tokenValue = parser.source.slice(start, parser.index);
      advanceChar(parser);
      if (context & 512)
          parser.tokenRaw = parser.source.slice(parser.tokenPos, parser.index);
      return 134283267;
  }
  function scanJSXToken(parser, context) {
      parser.startPos = parser.tokenPos = parser.index;
      parser.startColumn = parser.colPos = parser.column;
      parser.startLine = parser.linePos = parser.line;
      if (parser.index >= parser.end)
          return (parser.token = 1048576);
      const token = TokenLookup[parser.source.charCodeAt(parser.index)];
      switch (token) {
          case 8456255: {
              advanceChar(parser);
              if (parser.currentChar === 47) {
                  advanceChar(parser);
                  parser.token = 25;
              }
              else {
                  parser.token = 8456255;
              }
              break;
          }
          case 2162700: {
              advanceChar(parser);
              parser.token = 2162700;
              break;
          }
          default: {
              let state = 0;
              while (parser.index < parser.end) {
                  const type = CharTypes[parser.source.charCodeAt(parser.index)];
                  if (type & 1024) {
                      state |= 1 | 4;
                      scanNewLine(parser);
                  }
                  else if (type & 2048) {
                      consumeLineFeed(parser, state);
                      state = (state & ~4) | 1;
                  }
                  else {
                      advanceChar(parser);
                  }
                  if (CharTypes[parser.currentChar] & 16384)
                      break;
              }
              parser.tokenValue = parser.source.slice(parser.tokenPos, parser.index);
              if (context & 512)
                  parser.tokenRaw = parser.tokenValue;
              parser.token = 135;
          }
      }
      return parser.token;
  }
  function scanJSXIdentifier(parser) {
      if ((parser.token & 143360) === 143360) {
          const { index } = parser;
          let char = parser.currentChar;
          while (CharTypes[char] & (32768 | 2)) {
              char = advanceChar(parser);
          }
          parser.tokenValue += parser.source.slice(index, parser.index);
      }
      parser.token = 208897;
      return parser.token;
  }

  function matchOrInsertSemicolon(parser, context, specDeviation) {
      if ((parser.flags & 1) === 0 &&
          (parser.token & 1048576) !== 1048576 &&
          !specDeviation) {
          report(parser, 28, KeywordDescTable[parser.token & 255]);
      }
      consumeOpt(parser, context, 1074790417);
  }
  function isValidStrictMode(parser, index, tokenPos, tokenValue) {
      if (index - tokenPos < 13 && tokenValue === 'use strict') {
          if ((parser.token & 1048576) === 1048576 || parser.flags & 1) {
              return 1;
          }
      }
      return 0;
  }
  function optionalBit(parser, context, t) {
      if (parser.token !== t)
          return 0;
      nextToken(parser, context);
      return 1;
  }
  function consumeOpt(parser, context, t) {
      if (parser.token !== t)
          return false;
      nextToken(parser, context);
      return true;
  }
  function consume(parser, context, t) {
      if (parser.token !== t)
          report(parser, 23, KeywordDescTable[t & 255]);
      nextToken(parser, context);
  }
  function reinterpretToPattern(state, node) {
      switch (node.type) {
          case 'ArrayExpression':
              node.type = 'ArrayPattern';
              const elements = node.elements;
              for (let i = 0, n = elements.length; i < n; ++i) {
                  const element = elements[i];
                  if (element)
                      reinterpretToPattern(state, element);
              }
              return;
          case 'ObjectExpression':
              node.type = 'ObjectPattern';
              const properties = node.properties;
              for (let i = 0, n = properties.length; i < n; ++i) {
                  reinterpretToPattern(state, properties[i]);
              }
              return;
          case 'AssignmentExpression':
              node.type = 'AssignmentPattern';
              if (node.operator !== '=')
                  report(state, 68);
              delete node.operator;
              reinterpretToPattern(state, node.left);
              return;
          case 'Property':
              reinterpretToPattern(state, node.value);
              return;
          case 'SpreadElement':
              node.type = 'RestElement';
              reinterpretToPattern(state, node.argument);
      }
  }
  function validateBindingIdentifier(parser, context, kind, t, skipEvalArgCheck) {
      if (context & 1024) {
          if ((t & 36864) === 36864) {
              report(parser, 114);
          }
          if (!skipEvalArgCheck && (t & 537079808) === 537079808) {
              report(parser, 115);
          }
      }
      if ((t & 20480) === 20480) {
          report(parser, 99);
      }
      if (kind & (8 | 16) && t === 241736) {
          report(parser, 97);
      }
      if (context & (4194304 | 2048) && t === 209005) {
          report(parser, 95);
      }
      if (context & (2097152 | 1024) && t === 241770) {
          report(parser, 94, 'yield');
      }
  }
  function validateFunctionName(parser, context, t) {
      if (context & 1024) {
          if ((t & 36864) === 36864) {
              report(parser, 114);
          }
          if ((t & 537079808) === 537079808) {
              report(parser, 115);
          }
          if (t === 119) {
              report(parser, 92);
          }
          if (t === 118) {
              report(parser, 92);
          }
      }
      if ((t & 20480) === 20480) {
          report(parser, 99);
      }
      if (context & (4194304 | 2048) && t === 209005) {
          report(parser, 95);
      }
      if (context & (2097152 | 1024) && t === 241770) {
          report(parser, 94, 'yield');
      }
  }
  function isStrictReservedWord(parser, context, t) {
      if (t === 209005) {
          if (context & (4194304 | 2048))
              report(parser, 95);
          parser.destructible |= 128;
      }
      if (t === 241770 && context & 2097152)
          report(parser, 94, 'yield');
      return ((t & 20480) === 20480 ||
          (t & 36864) === 36864 ||
          t == 119);
  }
  function isPropertyWithPrivateFieldKey(expr) {
      return !expr.property ? false : expr.property.type === 'PrivateName';
  }
  function isValidLabel(parser, labels, name, isIterationStatement) {
      while (labels) {
          if (labels['$' + name]) {
              if (isIterationStatement)
                  report(parser, 133);
              return 1;
          }
          if (isIterationStatement && labels.loop)
              isIterationStatement = 0;
          labels = labels['$'];
      }
      return 0;
  }
  function validateAndDeclareLabel(parser, labels, name) {
      let set = labels;
      while (set) {
          if (set['$' + name])
              report(parser, 132, name);
          set = set['$'];
      }
      labels['$' + name] = 1;
  }
  function finishNode(parser, context, start, line, column, node) {
      if (context & 2) {
          node.start = start;
          node.end = parser.startPos;
          node.range = [start, parser.startPos];
      }
      if (context & 4) {
          node.loc = {
              start: {
                  line,
                  column
              },
              end: {
                  line: parser.startLine,
                  column: parser.startColumn
              }
          };
          if (parser.sourceFile) {
              node.loc.source = parser.sourceFile;
          }
      }
      return node;
  }
  function isEqualTagName(elementName) {
      switch (elementName.type) {
          case 'JSXIdentifier':
              return elementName.name;
          case 'JSXNamespacedName':
              return elementName.namespace + ':' + elementName.name;
          case 'JSXMemberExpression':
              return isEqualTagName(elementName.object) + '.' + isEqualTagName(elementName.property);
      }
  }
  function createArrowHeadParsingScope(parser, context, value) {
      const scope = addChildScope(createScope(), 1024);
      addBlockName(parser, context, scope, value, 1, 0);
      return scope;
  }
  function recordScopeError(parser, type, ...params) {
      const { index, line, column } = parser;
      return {
          type,
          params,
          index,
          line,
          column
      };
  }
  function createScope() {
      return {
          parent: void 0,
          type: 2
      };
  }
  function addChildScope(parent, type) {
      return {
          parent,
          type,
          scopeError: void 0
      };
  }
  function addVarOrBlock(parser, context, scope, name, kind, origin) {
      if (kind & 4) {
          addVarName(parser, context, scope, name, kind);
      }
      else {
          addBlockName(parser, context, scope, name, kind, origin);
      }
      if (origin & 64) {
          declareUnboundVariable(parser, name);
      }
  }
  function addBlockName(parser, context, scope, name, kind, origin) {
      const value = scope['#' + name];
      if (value && (value & 2) === 0) {
          if (kind & 1) {
              scope.scopeError = recordScopeError(parser, 140, name);
          }
          else if (context & 256 &&
              value & 64 &&
              origin & 2) ;
          else {
              report(parser, 140, name);
          }
      }
      if (scope.type & 128 &&
          (scope.parent['#' + name] && (scope.parent['#' + name] & 2) === 0)) {
          report(parser, 140, name);
      }
      if (scope.type & 1024 && value && (value & 2) === 0) {
          if (kind & 1) {
              scope.scopeError = recordScopeError(parser, 140, name);
          }
      }
      if (scope.type & 64) {
          if (scope.parent['#' + name] & 768)
              report(parser, 153, name);
      }
      scope['#' + name] = kind;
  }
  function addVarName(parser, context, scope, name, kind) {
      let currentScope = scope;
      while (currentScope && (currentScope.type & 256) === 0) {
          const value = currentScope['#' + name];
          if (value & 248) {
              if (context & 256 &&
                  (context & 1024) === 0 &&
                  ((kind & 128 && value & 68) ||
                      (value & 128 && kind & 68))) ;
              else {
                  report(parser, 140, name);
              }
          }
          if (currentScope === scope) {
              if (value & 1 && kind & 1) {
                  currentScope.scopeError = recordScopeError(parser, 140, name);
              }
          }
          if (value & (512 | 256)) {
              if ((value & 512) === 0 ||
                  (context & 256) === 0 ||
                  context & 1024) {
                  report(parser, 140, name);
              }
          }
          currentScope['#' + name] = kind;
          currentScope = currentScope.parent;
      }
  }
  function declareUnboundVariable(parser, name) {
      if (parser.exportedNames !== void 0 && name !== '') {
          if (parser.exportedNames['#' + name]) {
              report(parser, 141, name);
          }
          parser.exportedNames['#' + name] = 1;
      }
  }
  function addBindingToExports(parser, name) {
      if (parser.exportedBindings !== void 0 && name !== '') {
          parser.exportedBindings['#' + name] = 1;
      }
  }
  function pushComment(context, array) {
      return function (type, value, start, end, loc) {
          const comment = {
              type,
              value
          };
          if (context & 2) {
              comment.start = start;
              comment.end = end;
              comment.range = [start, end];
          }
          if (context & 4) {
              comment.loc = loc;
          }
          array.push(comment);
      };
  }
  function pushToken(context, array) {
      return function (token, start, end, loc) {
          const tokens = {
              token
          };
          if (context & 2) {
              tokens.start = start;
              tokens.end = end;
              tokens.range = [start, end];
          }
          if (context & 4) {
              tokens.loc = loc;
          }
          array.push(tokens);
      };
  }
  function isValidIdentifier(context, t) {
      if (context & (1024 | 2097152)) {
          if (context & 2048 && t === 209005)
              return false;
          if (context & 2097152 && t === 241770)
              return false;
          return (t & 143360) === 143360 || (t & 12288) === 12288;
      }
      return ((t & 143360) === 143360 ||
          (t & 12288) === 12288 ||
          (t & 36864) === 36864);
  }
  function classifyIdentifier(parser, context, t, isArrow) {
      if ((t & 537079808) === 537079808) {
          if (context & 1024)
              report(parser, 115);
          if (isArrow)
              parser.flags |= 512;
      }
      if (!isValidIdentifier(context, t))
          report(parser, 0);
  }

  function create(source, sourceFile, onComment, onToken) {
      return {
          source,
          flags: 0,
          index: 0,
          line: 1,
          column: 0,
          startPos: 0,
          end: source.length,
          tokenPos: 0,
          startColumn: 0,
          colPos: 0,
          linePos: 1,
          startLine: 1,
          sourceFile,
          tokenValue: '',
          token: 1048576,
          tokenRaw: '',
          tokenRegExp: void 0,
          currentChar: source.charCodeAt(0),
          exportedNames: [],
          exportedBindings: [],
          assignable: 1,
          destructible: 0,
          onComment,
          onToken,
          leadingDecorators: []
      };
  }
  function parseSource(source, options, context) {
      let sourceFile = '';
      let onComment;
      let onToken;
      if (options != null) {
          if (options.module)
              context |= 2048 | 1024;
          if (options.next)
              context |= 1;
          if (options.loc)
              context |= 4;
          if (options.ranges)
              context |= 2;
          if (options.uniqueKeyInPattern)
              context |= -2147483648;
          if (options.lexical)
              context |= 64;
          if (options.webcompat)
              context |= 256;
          if (options.directives)
              context |= 8 | 512;
          if (options.globalReturn)
              context |= 32;
          if (options.raw)
              context |= 512;
          if (options.preserveParens)
              context |= 128;
          if (options.impliedStrict)
              context |= 1024;
          if (options.jsx)
              context |= 16;
          if (options.identifierPattern)
              context |= 268435456;
          if (options.specDeviation)
              context |= 536870912;
          if (options.source)
              sourceFile = options.source;
          if (options.onComment != null) {
              onComment = Array.isArray(options.onComment) ? pushComment(context, options.onComment) : options.onComment;
          }
          if (options.onToken != null) {
              onToken = Array.isArray(options.onToken) ? pushToken(context, options.onToken) : options.onToken;
          }
      }
      const parser = create(source, sourceFile, onComment, onToken);
      if (context & 1)
          skipHashBang(parser);
      const scope = context & 64 ? createScope() : void 0;
      let body = [];
      let sourceType = 'script';
      if (context & 2048) {
          sourceType = 'module';
          body = parseModuleItemList(parser, context | 8192, scope);
          if (scope) {
              for (const key in parser.exportedBindings) {
                  if (key[0] === '#' && !scope[key])
                      report(parser, 142, key.slice(1));
              }
          }
      }
      else {
          body = parseStatementList(parser, context | 8192, scope);
      }
      const node = {
          type: 'Program',
          sourceType,
          body
      };
      if (context & 2) {
          node.start = 0;
          node.end = source.length;
          node.range = [0, source.length];
      }
      if (context & 4) {
          node.loc = {
              start: { line: 1, column: 0 },
              end: { line: parser.line, column: parser.column }
          };
          if (parser.sourceFile)
              node.loc.source = sourceFile;
      }
      return node;
  }
  function parseStatementList(parser, context, scope) {
      nextToken(parser, context | 32768 | 1073741824);
      const statements = [];
      while (parser.token === 134283267) {
          const { index, tokenPos, tokenValue, linePos, colPos, token } = parser;
          const expr = parseLiteral(parser, context);
          if (isValidStrictMode(parser, index, tokenPos, tokenValue))
              context |= 1024;
          statements.push(parseDirective(parser, context, expr, token, tokenPos, linePos, colPos));
      }
      while (parser.token !== 1048576) {
          statements.push(parseStatementListItem(parser, context, scope, 4, {}));
      }
      return statements;
  }
  function parseModuleItemList(parser, context, scope) {
      nextToken(parser, context | 32768);
      const statements = [];
      if (context & 8) {
          while (parser.token === 134283267) {
              const { tokenPos, linePos, colPos, token } = parser;
              statements.push(parseDirective(parser, context, parseLiteral(parser, context), token, tokenPos, linePos, colPos));
          }
      }
      while (parser.token !== 1048576) {
          statements.push(parseModuleItem(parser, context, scope));
      }
      return statements;
  }
  function parseModuleItem(parser, context, scope) {
      parser.leadingDecorators = parseDecorators(parser, context);
      let moduleItem;
      switch (parser.token) {
          case 20563:
              moduleItem = parseExportDeclaration(parser, context, scope);
              break;
          case 86105:
              moduleItem = parseImportDeclaration(parser, context, scope);
              break;
          default:
              moduleItem = parseStatementListItem(parser, context, scope, 4, {});
      }
      if (parser.leadingDecorators.length) {
          report(parser, 164);
      }
      return moduleItem;
  }
  function parseStatementListItem(parser, context, scope, origin, labels) {
      const start = parser.tokenPos;
      const line = parser.linePos;
      const column = parser.colPos;
      switch (parser.token) {
          case 86103:
              return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 0, start, line, column);
          case 130:
          case 86093:
              return parseClassDeclaration(parser, context, scope, 0, start, line, column);
          case 86089:
              return parseLexicalDeclaration(parser, context, scope, 16, 0, start, line, column);
          case 241736:
              return parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column);
          case 20563:
              report(parser, 100, 'export');
          case 86105:
              nextToken(parser, context);
              switch (parser.token) {
                  case 67174411:
                      return parseImportCallDeclaration(parser, context, start, line, column);
                  case 67108877:
                      return parseImportMetaDeclaration(parser, context, start, line, column);
                  default:
                      report(parser, 100, 'import');
              }
          case 143468:
              return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 1, start, line, column);
          default:
              return parseStatement(parser, context, scope, origin, labels, 1, start, line, column);
      }
  }
  function parseStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
      switch (parser.token) {
          case 86087:
              return parseVariableStatement(parser, context, scope, 0, start, line, column);
          case 20571:
              return parseReturnStatement(parser, context, start, line, column);
          case 20568:
              return parseIfStatement(parser, context, scope, labels, start, line, column);
          case 20566:
              return parseForStatement(parser, context, scope, labels, start, line, column);
          case 20561:
              return parseDoWhileStatement(parser, context, scope, labels, start, line, column);
          case 20577:
              return parseWhileStatement(parser, context, scope, labels, start, line, column);
          case 86109:
              return parseSwitchStatement(parser, context, scope, labels, start, line, column);
          case 1074790417:
              return parseEmptyStatement(parser, context, start, line, column);
          case 2162700:
              return parseBlock(parser, context, scope ? addChildScope(scope, 2) : scope, labels, start, line, column);
          case 86111:
              return parseThrowStatement(parser, context, start, line, column);
          case 20554:
              return parseBreakStatement(parser, context, labels, start, line, column);
          case 20558:
              return parseContinueStatement(parser, context, labels, start, line, column);
          case 20576:
              return parseTryStatement(parser, context, scope, labels, start, line, column);
          case 20578:
              return parseWithStatement(parser, context, scope, labels, start, line, column);
          case 20559:
              return parseDebuggerStatement(parser, context, start, line, column);
          case 143468:
              return parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, 0, start, line, column);
          case 20556:
              report(parser, 156);
          case 20565:
              report(parser, 157);
          case 86103:
              report(parser, context & 1024
                  ? 73
                  : (context & 256) < 1
                      ? 75
                      : 74);
          case 86093:
              report(parser, 76);
          default:
              return parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column);
      }
  }
  function parseExpressionOrLabelledStatement(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
      const { tokenValue, token } = parser;
      let expr;
      switch (token) {
          case 241736:
              expr = parseIdentifier(parser, context, 0);
              if (context & 1024)
                  report(parser, 82);
              if (parser.token === 69271571)
                  report(parser, 81);
              break;
          default:
              expr = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      }
      if (token & 143360 && parser.token === 21) {
          return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, allowFuncDecl, start, line, column);
      }
      expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
      expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
      if (parser.token === 18) {
          expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
      }
      return parseExpressionStatement(parser, context, expr, start, line, column);
  }
  function parseBlock(parser, context, scope, labels, start, line, column) {
      const body = [];
      consume(parser, context | 32768, 2162700);
      while (parser.token !== 1074790415) {
          body.push(parseStatementListItem(parser, context, scope, 2, { $: labels }));
      }
      consume(parser, context | 32768, 1074790415);
      return finishNode(parser, context, start, line, column, {
          type: 'BlockStatement',
          body
      });
  }
  function parseReturnStatement(parser, context, start, line, column) {
      if ((context & 32) < 1 && context & 8192)
          report(parser, 89);
      nextToken(parser, context | 32768);
      const argument = parser.flags & 1 || parser.token & 1048576
          ? null
          : parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.column);
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'ReturnStatement',
          argument
      });
  }
  function parseExpressionStatement(parser, context, expression, start, line, column) {
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'ExpressionStatement',
          expression
      });
  }
  function parseLabelledStatement(parser, context, scope, origin, labels, value, expr, token, allowFuncDecl, start, line, column) {
      validateBindingIdentifier(parser, context, 0, token, 1);
      validateAndDeclareLabel(parser, labels, value);
      nextToken(parser, context | 32768);
      const body = allowFuncDecl &&
          (context & 1024) < 1 &&
          context & 256 &&
          parser.token === 86103
          ? parseFunctionDeclaration(parser, context, addChildScope(scope, 2), origin, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos)
          : parseStatement(parser, context, scope, origin, labels, allowFuncDecl, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, {
          type: 'LabeledStatement',
          label: expr,
          body
      });
  }
  function parseAsyncArrowOrAsyncFunctionDeclaration(parser, context, scope, origin, labels, allowFuncDecl, start, line, column) {
      const { token, tokenValue } = parser;
      let expr = parseIdentifier(parser, context, 0);
      if (parser.token === 21) {
          return parseLabelledStatement(parser, context, scope, origin, labels, tokenValue, expr, token, 1, start, line, column);
      }
      const asyncNewLine = parser.flags & 1;
      if (!asyncNewLine) {
          if (parser.token === 86103) {
              if (!allowFuncDecl)
                  report(parser, 119);
              return parseFunctionDeclaration(parser, context, scope, origin, 1, 0, 1, start, line, column);
          }
          if ((parser.token & 143360) === 143360) {
              expr = parseAsyncArrowAfterIdent(parser, context, 1, start, line, column);
              if (parser.token === 18)
                  expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
              return parseExpressionStatement(parser, context, expr, start, line, column);
          }
      }
      if (parser.token === 67174411) {
          expr = parseAsyncArrowOrCallExpression(parser, context, expr, 1, 1, 0, asyncNewLine, start, line, column);
      }
      else {
          if (parser.token === 10) {
              classifyIdentifier(parser, context, token, 1);
              expr = parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, 0, 1, 0, start, line, column);
          }
          parser.assignable = 1;
      }
      expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
      if (parser.token === 18)
          expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
      expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
      parser.assignable = 1;
      return parseExpressionStatement(parser, context, expr, start, line, column);
  }
  function parseDirective(parser, context, expression, token, start, line, column) {
      if (token !== 1074790417) {
          parser.assignable = 2;
          expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
          if (parser.token !== 1074790417) {
              expression = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expression);
              if (parser.token === 18) {
                  expression = parseSequenceExpression(parser, context, 0, start, line, column, expression);
              }
          }
          matchOrInsertSemicolon(parser, context | 32768);
      }
      return context & 8 && expression.type === 'Literal' && typeof expression.value === 'string'
          ? finishNode(parser, context, start, line, column, {
              type: 'ExpressionStatement',
              expression,
              directive: expression.raw.slice(1, -1)
          })
          : finishNode(parser, context, start, line, column, {
              type: 'ExpressionStatement',
              expression
          });
  }
  function parseEmptyStatement(parser, context, start, line, column) {
      nextToken(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'EmptyStatement'
      });
  }
  function parseThrowStatement(parser, context, start, line, column) {
      nextToken(parser, context | 32768);
      if (parser.flags & 1)
          report(parser, 87);
      const argument = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'ThrowStatement',
          argument
      });
  }
  function parseIfStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context);
      consume(parser, context | 32768, 67174411);
      parser.assignable = 1;
      const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.line, parser.colPos);
      consume(parser, context | 32768, 16);
      const consequent = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
      let alternate = null;
      if (parser.token === 20562) {
          nextToken(parser, context | 32768);
          alternate = parseConsequentOrAlternative(parser, context, scope, labels, parser.tokenPos, parser.linePos, parser.colPos);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'IfStatement',
          test,
          consequent,
          alternate
      });
  }
  function parseConsequentOrAlternative(parser, context, scope, labels, start, line, column) {
      return context & 1024 ||
          (context & 256) < 1 ||
          parser.token !== 86103
          ? parseStatement(parser, context, scope, 0, { $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos)
          : parseFunctionDeclaration(parser, context, addChildScope(scope, 2), 0, 0, 0, 0, start, line, column);
  }
  function parseSwitchStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context);
      consume(parser, context | 32768, 67174411);
      const discriminant = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context, 16);
      consume(parser, context, 2162700);
      const cases = [];
      let seenDefault = 0;
      if (scope)
          scope = addChildScope(scope, 8);
      while (parser.token !== 1074790415) {
          const { tokenPos, linePos, colPos } = parser;
          let test = null;
          const consequent = [];
          if (consumeOpt(parser, context | 32768, 20555)) {
              test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
          }
          else {
              consume(parser, context | 32768, 20560);
              if (seenDefault)
                  report(parser, 86);
              seenDefault = 1;
          }
          consume(parser, context | 32768, 21);
          while (parser.token !== 20555 &&
              parser.token !== 1074790415 &&
              parser.token !== 20560) {
              consequent.push(parseStatementListItem(parser, context | 4096, scope, 2, {
                  $: labels
              }));
          }
          cases.push(finishNode(parser, context, tokenPos, linePos, colPos, {
              type: 'SwitchCase',
              test,
              consequent
          }));
      }
      consume(parser, context | 32768, 1074790415);
      return finishNode(parser, context, start, line, column, {
          type: 'SwitchStatement',
          discriminant,
          cases
      });
  }
  function parseWhileStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context);
      consume(parser, context | 32768, 67174411);
      const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 16);
      const body = parseIterationStatementBody(parser, context, scope, labels);
      return finishNode(parser, context, start, line, column, {
          type: 'WhileStatement',
          test,
          body
      });
  }
  function parseIterationStatementBody(parser, context, scope, labels) {
      return parseStatement(parser, ((context | 134217728) ^ 134217728) | 131072, scope, 0, { loop: 1, $: labels }, 0, parser.tokenPos, parser.linePos, parser.colPos);
  }
  function parseContinueStatement(parser, context, labels, start, line, column) {
      if ((context & 131072) < 1)
          report(parser, 65);
      nextToken(parser, context);
      let label = null;
      if ((parser.flags & 1) < 1 && parser.token & 143360) {
          const { tokenValue } = parser;
          label = parseIdentifier(parser, context | 32768, 0);
          if (!isValidLabel(parser, labels, tokenValue, 1))
              report(parser, 134, tokenValue);
      }
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'ContinueStatement',
          label
      });
  }
  function parseBreakStatement(parser, context, labels, start, line, column) {
      nextToken(parser, context | 32768);
      let label = null;
      if ((parser.flags & 1) < 1 && parser.token & 143360) {
          const { tokenValue } = parser;
          label = parseIdentifier(parser, context | 32768, 0);
          if (!isValidLabel(parser, labels, tokenValue, 0))
              report(parser, 134, tokenValue);
      }
      else if ((context & (4096 | 131072)) < 1) {
          report(parser, 66);
      }
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'BreakStatement',
          label
      });
  }
  function parseWithStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context);
      if (context & 1024)
          report(parser, 88);
      consume(parser, context | 32768, 67174411);
      const object = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 16);
      const body = parseStatement(parser, context, scope, 2, labels, 0, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, {
          type: 'WithStatement',
          object,
          body
      });
  }
  function parseDebuggerStatement(parser, context, start, line, column) {
      nextToken(parser, context | 32768);
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'DebuggerStatement'
      });
  }
  function parseTryStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context | 32768);
      const firstScope = scope ? addChildScope(scope, 32) : void 0;
      const block = parseBlock(parser, context, firstScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
      const { tokenPos, linePos, colPos } = parser;
      const handler = consumeOpt(parser, context | 32768, 20556)
          ? parseCatchBlock(parser, context, scope, labels, tokenPos, linePos, colPos)
          : null;
      let finalizer = null;
      if (parser.token === 20565) {
          nextToken(parser, context | 32768);
          const finalizerScope = firstScope ? addChildScope(scope, 4) : void 0;
          finalizer = parseBlock(parser, context, finalizerScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
      }
      if (!handler && !finalizer) {
          report(parser, 85);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'TryStatement',
          block,
          handler,
          finalizer
      });
  }
  function parseCatchBlock(parser, context, scope, labels, start, line, column) {
      let param = null;
      let additionalScope = scope;
      if (consumeOpt(parser, context, 67174411)) {
          if (scope)
              scope = addChildScope(scope, 4);
          param = parseBindingPattern(parser, context, scope, (parser.token & 2097152) === 2097152
              ? 256
              : 512, 0, parser.tokenPos, parser.linePos, parser.colPos);
          if (parser.token === 18) {
              report(parser, 83);
          }
          else if (parser.token === 1077936157) {
              report(parser, 84);
          }
          consume(parser, context | 32768, 16);
          if (scope)
              additionalScope = addChildScope(scope, 64);
      }
      const body = parseBlock(parser, context, additionalScope, { $: labels }, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, {
          type: 'CatchClause',
          param,
          body
      });
  }
  function parseDoWhileStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context | 32768);
      const body = parseIterationStatementBody(parser, context, scope, labels);
      consume(parser, context, 20577);
      consume(parser, context | 32768, 67174411);
      const test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 16);
      consumeOpt(parser, context, 1074790417);
      return finishNode(parser, context, start, line, column, {
          type: 'DoWhileStatement',
          body,
          test
      });
  }
  function parseLetIdentOrVarDeclarationStatement(parser, context, scope, origin, start, line, column) {
      const { token, tokenValue } = parser;
      let expr = parseIdentifier(parser, context, 0);
      if (parser.token & (143360 | 2097152)) {
          const declarations = parseVariableDeclarationList(parser, context, scope, 8, 0);
          matchOrInsertSemicolon(parser, context | 32768);
          return finishNode(parser, context, start, line, column, {
              type: 'VariableDeclaration',
              kind: 'let',
              declarations
          });
      }
      parser.assignable = 1;
      if (context & 1024)
          report(parser, 82);
      if (parser.token === 21) {
          return parseLabelledStatement(parser, context, scope, origin, {}, tokenValue, expr, token, 0, start, line, column);
      }
      if (parser.token === 10) {
          let scope = void 0;
          if (context & 64)
              scope = createArrowHeadParsingScope(parser, context, tokenValue);
          parser.flags = (parser.flags | 128) ^ 128;
          expr = parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
      }
      else {
          expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
          expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
      }
      if (parser.token === 18) {
          expr = parseSequenceExpression(parser, context, 0, start, line, column, expr);
      }
      return parseExpressionStatement(parser, context, expr, start, line, column);
  }
  function parseLexicalDeclaration(parser, context, scope, kind, origin, start, line, column) {
      nextToken(parser, context);
      const declarations = parseVariableDeclarationList(parser, context, scope, kind, origin);
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'VariableDeclaration',
          kind: kind & 8 ? 'let' : 'const',
          declarations
      });
  }
  function parseVariableStatement(parser, context, scope, origin, start, line, column) {
      nextToken(parser, context);
      const declarations = parseVariableDeclarationList(parser, context, scope, 4, origin);
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'VariableDeclaration',
          kind: 'var',
          declarations
      });
  }
  function parseVariableDeclarationList(parser, context, scope, kind, origin) {
      let bindingCount = 1;
      const list = [parseVariableDeclaration(parser, context, scope, kind, origin)];
      while (consumeOpt(parser, context, 18)) {
          bindingCount++;
          list.push(parseVariableDeclaration(parser, context, scope, kind, origin));
      }
      if (bindingCount > 1 && origin & 32 && parser.token & 262144) {
          report(parser, 58, KeywordDescTable[parser.token & 255]);
      }
      return list;
  }
  function parseVariableDeclaration(parser, context, scope, kind, origin) {
      const { token, tokenPos, linePos, colPos } = parser;
      let init = null;
      const id = parseBindingPattern(parser, context, scope, kind, origin, tokenPos, linePos, colPos);
      if (parser.token === 1077936157) {
          nextToken(parser, context | 32768);
          init = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
          if (origin & 32 || (token & 2097152) < 1) {
              if (parser.token === 274546 ||
                  (parser.token === 8738865 &&
                      (token & 2097152 || (kind & 4) < 1 || context & 1024))) {
                  reportMessageAt(tokenPos, parser.line, parser.index - 3, 57, parser.token === 274546 ? 'of' : 'in');
              }
          }
      }
      else if ((kind & 16 || (token & 2097152) > 0) &&
          (parser.token & 262144) !== 262144) {
          report(parser, 56, kind & 16 ? 'const' : 'destructuring');
      }
      return finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'VariableDeclarator',
          id,
          init
      });
  }
  function parseForStatement(parser, context, scope, labels, start, line, column) {
      nextToken(parser, context);
      const forAwait = (context & 4194304) > 0 && consumeOpt(parser, context, 209005);
      consume(parser, context | 32768, 67174411);
      if (scope)
          scope = addChildScope(scope, 1);
      let test = null;
      let update = null;
      let destructible = 0;
      let init = null;
      let isVarDecl = parser.token === 86087 || parser.token === 241736 || parser.token === 86089;
      let right;
      const { token, tokenPos, linePos, colPos } = parser;
      if (isVarDecl) {
          if (token === 241736) {
              init = parseIdentifier(parser, context, 0);
              if (parser.token & (143360 | 2097152)) {
                  if (parser.token === 8738865) {
                      if (context & 1024)
                          report(parser, 64);
                  }
                  else {
                      init = finishNode(parser, context, tokenPos, linePos, colPos, {
                          type: 'VariableDeclaration',
                          kind: 'let',
                          declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 8, 32)
                      });
                  }
                  parser.assignable = 1;
              }
              else if (context & 1024) {
                  report(parser, 64);
              }
              else {
                  isVarDecl = false;
                  parser.assignable = 1;
                  init = parseMemberOrUpdateExpression(parser, context, init, 0, 0, tokenPos, linePos, colPos);
                  if (parser.token === 274546)
                      report(parser, 111);
              }
          }
          else {
              nextToken(parser, context);
              init = finishNode(parser, context, tokenPos, linePos, colPos, token === 86087
                  ? {
                      type: 'VariableDeclaration',
                      kind: 'var',
                      declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 4, 32)
                  }
                  : {
                      type: 'VariableDeclaration',
                      kind: 'const',
                      declarations: parseVariableDeclarationList(parser, context | 134217728, scope, 16, 32)
                  });
              parser.assignable = 1;
          }
      }
      else if (token === 1074790417) {
          if (forAwait)
              report(parser, 79);
      }
      else if ((token & 2097152) === 2097152) {
          init =
              token === 2162700
                  ? parseObjectLiteralOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos)
                  : parseArrayExpressionOrPattern(parser, context, void 0, 1, 0, 0, 2, 32, tokenPos, linePos, colPos);
          destructible = parser.destructible;
          if (context & 256 && destructible & 64) {
              report(parser, 60);
          }
          parser.assignable =
              destructible & 16 ? 2 : 1;
          init = parseMemberOrUpdateExpression(parser, context | 134217728, init, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      }
      else {
          init = parseLeftHandSideExpression(parser, context | 134217728, 1, 0, 1, tokenPos, linePos, colPos);
      }
      if ((parser.token & 262144) === 262144) {
          if (parser.token === 274546) {
              if (parser.assignable & 2)
                  report(parser, 77, forAwait ? 'await' : 'of');
              reinterpretToPattern(parser, init);
              nextToken(parser, context | 32768);
              right = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
              consume(parser, context | 32768, 16);
              const body = parseIterationStatementBody(parser, context, scope, labels);
              return finishNode(parser, context, start, line, column, {
                  type: 'ForOfStatement',
                  left: init,
                  right,
                  body,
                  await: forAwait
              });
          }
          if (parser.assignable & 2)
              report(parser, 77, 'in');
          reinterpretToPattern(parser, init);
          nextToken(parser, context | 32768);
          if (forAwait)
              report(parser, 79);
          right = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
          consume(parser, context | 32768, 16);
          const body = parseIterationStatementBody(parser, context, scope, labels);
          return finishNode(parser, context, start, line, column, {
              type: 'ForInStatement',
              body,
              left: init,
              right
          });
      }
      if (forAwait)
          report(parser, 79);
      if (!isVarDecl) {
          if (destructible & 8 && parser.token !== 1077936157) {
              report(parser, 77, 'loop');
          }
          init = parseAssignmentExpression(parser, context | 134217728, 0, 0, tokenPos, linePos, colPos, init);
      }
      if (parser.token === 18)
          init = parseSequenceExpression(parser, context, 0, parser.tokenPos, parser.linePos, parser.colPos, init);
      consume(parser, context | 32768, 1074790417);
      if (parser.token !== 1074790417)
          test = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 1074790417);
      if (parser.token !== 16)
          update = parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 16);
      const body = parseIterationStatementBody(parser, context, scope, labels);
      return finishNode(parser, context, start, line, column, {
          type: 'ForStatement',
          init,
          test,
          update,
          body
      });
  }
  function parseRestrictedIdentifier(parser, context, scope) {
      if (!isValidIdentifier(context, parser.token))
          report(parser, 114);
      if ((parser.token & 537079808) === 537079808)
          report(parser, 115);
      if (scope)
          addBlockName(parser, context, scope, parser.tokenValue, 8, 0);
      return parseIdentifier(parser, context, 0);
  }
  function parseImportDeclaration(parser, context, scope) {
      const start = parser.tokenPos;
      const line = parser.linePos;
      const column = parser.colPos;
      nextToken(parser, context);
      let source = null;
      const { tokenPos, linePos, colPos } = parser;
      let specifiers = [];
      if (parser.token === 134283267) {
          source = parseLiteral(parser, context);
      }
      else {
          if (parser.token & 143360) {
              const local = parseRestrictedIdentifier(parser, context, scope);
              specifiers = [
                  finishNode(parser, context, tokenPos, linePos, colPos, {
                      type: 'ImportDefaultSpecifier',
                      local
                  })
              ];
              if (consumeOpt(parser, context, 18)) {
                  switch (parser.token) {
                      case 8457011:
                          specifiers.push(parseImportNamespaceSpecifier(parser, context, scope));
                          break;
                      case 2162700:
                          parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                          break;
                      default:
                          report(parser, 104);
                  }
              }
          }
          else {
              switch (parser.token) {
                  case 8457011:
                      specifiers = [parseImportNamespaceSpecifier(parser, context, scope)];
                      break;
                  case 2162700:
                      parseImportSpecifierOrNamedImports(parser, context, scope, specifiers);
                      break;
                  case 67174411:
                      return parseImportCallDeclaration(parser, context, start, line, column);
                  case 67108877:
                      return parseImportMetaDeclaration(parser, context, start, line, column);
                  default:
                      report(parser, 28, KeywordDescTable[parser.token & 255]);
              }
          }
          source = parseModuleSpecifier(parser, context);
      }
      matchOrInsertSemicolon(parser, context | 32768);
      return finishNode(parser, context, start, line, column, {
          type: 'ImportDeclaration',
          specifiers,
          source
      });
  }
  function parseImportNamespaceSpecifier(parser, context, scope) {
      const { tokenPos, linePos, colPos } = parser;
      nextToken(parser, context);
      consume(parser, context, 12395);
      if ((parser.token & 134217728) === 134217728) {
          reportMessageAt(tokenPos, parser.line, parser.index, 28, KeywordDescTable[parser.token & 255]);
      }
      return finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'ImportNamespaceSpecifier',
          local: parseRestrictedIdentifier(parser, context, scope)
      });
  }
  function parseModuleSpecifier(parser, context) {
      consumeOpt(parser, context, 12401);
      if (parser.token !== 134283267)
          report(parser, 102, 'Import');
      return parseLiteral(parser, context);
  }
  function parseImportSpecifierOrNamedImports(parser, context, scope, specifiers) {
      nextToken(parser, context);
      while (parser.token & 143360) {
          let { token, tokenValue, tokenPos, linePos, colPos } = parser;
          const imported = parseIdentifier(parser, context, 0);
          let local;
          if (consumeOpt(parser, context, 12395)) {
              if ((parser.token & 134217728) === 134217728 || parser.token === 18) {
                  report(parser, 103);
              }
              else {
                  validateBindingIdentifier(parser, context, 16, parser.token, 0);
              }
              tokenValue = parser.tokenValue;
              local = parseIdentifier(parser, context, 0);
          }
          else {
              validateBindingIdentifier(parser, context, 16, token, 0);
              local = imported;
          }
          if (scope)
              addBlockName(parser, context, scope, tokenValue, 8, 0);
          specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
              type: 'ImportSpecifier',
              local,
              imported
          }));
          if (parser.token !== 1074790415)
              consume(parser, context, 18);
      }
      consume(parser, context, 1074790415);
      return specifiers;
  }
  function parseImportMetaDeclaration(parser, context, start, line, column) {
      let expr = parseImportMetaExpression(parser, context, finishNode(parser, context, start, line, column, {
          type: 'Identifier',
          name: 'import'
      }), start, line, column);
      expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
      expr = parseAssignmentExpression(parser, context, 0, 0, start, line, column, expr);
      return parseExpressionStatement(parser, context, expr, start, line, column);
  }
  function parseImportCallDeclaration(parser, context, start, line, column) {
      let expr = parseImportExpression(parser, context, 0, start, line, column);
      expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, start, line, column);
      return parseExpressionStatement(parser, context, expr, start, line, column);
  }
  function parseExportDeclaration(parser, context, scope) {
      const start = parser.tokenPos;
      const line = parser.linePos;
      const column = parser.colPos;
      nextToken(parser, context | 32768);
      const specifiers = [];
      let declaration = null;
      let source = null;
      let key;
      if (consumeOpt(parser, context | 32768, 20560)) {
          switch (parser.token) {
              case 86103: {
                  declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
                  break;
              }
              case 130:
              case 86093:
                  declaration = parseClassDeclaration(parser, context, scope, 1, parser.tokenPos, parser.linePos, parser.colPos);
                  break;
              case 143468:
                  const { tokenPos, linePos, colPos } = parser;
                  declaration = parseIdentifier(parser, context, 0);
                  const { flags } = parser;
                  if ((flags & 1) < 1) {
                      if (parser.token === 86103) {
                          declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 1, 1, tokenPos, linePos, colPos);
                      }
                      else {
                          if (parser.token === 67174411) {
                              declaration = parseAsyncArrowOrCallExpression(parser, context, declaration, 1, 1, 0, flags, tokenPos, linePos, colPos);
                              declaration = parseMemberOrUpdateExpression(parser, context, declaration, 0, 0, tokenPos, linePos, colPos);
                              declaration = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, declaration);
                          }
                          else if (parser.token & 143360) {
                              if (scope)
                                  scope = createArrowHeadParsingScope(parser, context, parser.tokenValue);
                              declaration = parseIdentifier(parser, context, 0);
                              declaration = parseArrowFunctionExpression(parser, context, scope, [declaration], 1, tokenPos, linePos, colPos);
                          }
                      }
                  }
                  break;
              default:
                  declaration = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
                  matchOrInsertSemicolon(parser, context | 32768);
          }
          if (scope)
              declareUnboundVariable(parser, 'default');
          return finishNode(parser, context, start, line, column, {
              type: 'ExportDefaultDeclaration',
              declaration
          });
      }
      switch (parser.token) {
          case 8457011: {
              nextToken(parser, context);
              let exported = null;
              const isNamedDeclaration = consumeOpt(parser, context, 12395);
              if (isNamedDeclaration) {
                  if (scope)
                      declareUnboundVariable(parser, parser.tokenValue);
                  exported = parseIdentifier(parser, context, 0);
              }
              consume(parser, context, 12401);
              if (parser.token !== 134283267)
                  report(parser, 102, 'Export');
              source = parseLiteral(parser, context);
              matchOrInsertSemicolon(parser, context | 32768);
              return finishNode(parser, context, start, line, column, {
                  type: 'ExportAllDeclaration',
                  source,
                  exported
              });
          }
          case 2162700: {
              nextToken(parser, context);
              const tmpExportedNames = [];
              const tmpExportedBindings = [];
              while (parser.token & 143360) {
                  const { tokenPos, tokenValue, linePos, colPos } = parser;
                  const local = parseIdentifier(parser, context, 0);
                  let exported;
                  if (parser.token === 12395) {
                      nextToken(parser, context);
                      if ((parser.token & 134217728) === 134217728) {
                          report(parser, 103);
                      }
                      if (scope) {
                          tmpExportedNames.push(parser.tokenValue);
                          tmpExportedBindings.push(tokenValue);
                      }
                      exported = parseIdentifier(parser, context, 0);
                  }
                  else {
                      if (scope) {
                          tmpExportedNames.push(parser.tokenValue);
                          tmpExportedBindings.push(parser.tokenValue);
                      }
                      exported = local;
                  }
                  specifiers.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                      type: 'ExportSpecifier',
                      local,
                      exported
                  }));
                  if (parser.token !== 1074790415)
                      consume(parser, context, 18);
              }
              consume(parser, context, 1074790415);
              if (consumeOpt(parser, context, 12401)) {
                  if (parser.token !== 134283267)
                      report(parser, 102, 'Export');
                  source = parseLiteral(parser, context);
              }
              else if (scope) {
                  let i = 0;
                  let iMax = tmpExportedNames.length;
                  for (; i < iMax; i++) {
                      declareUnboundVariable(parser, tmpExportedNames[i]);
                  }
                  i = 0;
                  iMax = tmpExportedBindings.length;
                  for (; i < iMax; i++) {
                      addBindingToExports(parser, tmpExportedBindings[i]);
                  }
              }
              matchOrInsertSemicolon(parser, context | 32768);
              break;
          }
          case 86093:
              declaration = parseClassDeclaration(parser, context, scope, 2, parser.tokenPos, parser.linePos, parser.colPos);
              break;
          case 86103:
              declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 0, parser.tokenPos, parser.linePos, parser.colPos);
              break;
          case 241736:
              declaration = parseLexicalDeclaration(parser, context, scope, 8, 64, parser.tokenPos, parser.linePos, parser.colPos);
              break;
          case 86089:
              declaration = parseLexicalDeclaration(parser, context, scope, 16, 64, parser.tokenPos, parser.linePos, parser.colPos);
              break;
          case 86087:
              declaration = parseVariableStatement(parser, context, scope, 64, parser.tokenPos, parser.linePos, parser.colPos);
              break;
          case 143468:
              const { tokenPos, linePos, colPos } = parser;
              nextToken(parser, context);
              if ((parser.flags & 1) < 1 && parser.token === 86103) {
                  declaration = parseFunctionDeclaration(parser, context, scope, 4, 1, 2, 1, tokenPos, linePos, colPos);
                  if (scope) {
                      key = declaration.id ? declaration.id.name : '';
                      declareUnboundVariable(parser, key);
                  }
                  break;
              }
          default:
              report(parser, 28, KeywordDescTable[parser.token & 255]);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'ExportNamedDeclaration',
          declaration,
          specifiers,
          source
      });
  }
  function parseExpression(parser, context, canAssign, isPattern, inGroup, start, line, column) {
      let expr = parsePrimaryExpression(parser, context, 2, 0, canAssign, isPattern, inGroup, 1, start, line, column);
      expr = parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
      return parseAssignmentExpression(parser, context, inGroup, 0, start, line, column, expr);
  }
  function parseSequenceExpression(parser, context, inGroup, start, line, column, expr) {
      const expressions = [expr];
      while (consumeOpt(parser, context | 32768, 18)) {
          expressions.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
      }
      return finishNode(parser, context, start, line, column, {
          type: 'SequenceExpression',
          expressions
      });
  }
  function parseExpressions(parser, context, inGroup, canAssign, start, line, column) {
      const expr = parseExpression(parser, context, canAssign, 0, inGroup, start, line, column);
      return parser.token === 18
          ? parseSequenceExpression(parser, context, inGroup, start, line, column, expr)
          : expr;
  }
  function parseAssignmentExpression(parser, context, inGroup, isPattern, start, line, column, left) {
      const { token } = parser;
      if ((token & 4194304) === 4194304) {
          if (parser.assignable & 2)
              report(parser, 24);
          if ((!isPattern && token === 1077936157 && left.type === 'ArrayExpression') ||
              left.type === 'ObjectExpression') {
              reinterpretToPattern(parser, left);
          }
          nextToken(parser, context | 32768);
          const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
          parser.assignable = 2;
          return finishNode(parser, context, start, line, column, isPattern
              ? {
                  type: 'AssignmentPattern',
                  left,
                  right
              }
              : {
                  type: 'AssignmentExpression',
                  left,
                  operator: KeywordDescTable[token & 255],
                  right
              });
      }
      if ((token & 8454144) === 8454144) {
          left = parseBinaryExpression(parser, context, inGroup, start, line, column, 4, token, left);
      }
      if (consumeOpt(parser, context | 32768, 22)) {
          left = parseConditionalExpression(parser, context, left, start, line, column);
      }
      return left;
  }
  function parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, start, line, column, left) {
      const { token } = parser;
      nextToken(parser, context | 32768);
      const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      left = finishNode(parser, context, start, line, column, isPattern
          ? {
              type: 'AssignmentPattern',
              left,
              right
          }
          : {
              type: 'AssignmentExpression',
              left,
              operator: KeywordDescTable[token & 255],
              right
          });
      parser.assignable = 2;
      return left;
  }
  function parseConditionalExpression(parser, context, test, start, line, column) {
      const consequent = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context | 32768, 21);
      parser.assignable = 1;
      const alternate = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'ConditionalExpression',
          test,
          consequent,
          alternate
      });
  }
  function parseBinaryExpression(parser, context, inGroup, start, line, column, minPrec, operator, left) {
      const bit = -((context & 134217728) > 0) & 8738865;
      let t;
      let prec;
      parser.assignable = 2;
      while (parser.token & 8454144) {
          t = parser.token;
          prec = t & 3840;
          if ((t & 524288 && operator & 268435456) || (operator & 524288 && t & 268435456)) {
              report(parser, 159);
          }
          if (prec + ((t === 8457270) << 8) - ((bit === t) << 12) <= minPrec)
              break;
          nextToken(parser, context | 32768);
          left = finishNode(parser, context, start, line, column, {
              type: t & 524288 || t & 268435456 ? 'LogicalExpression' : 'BinaryExpression',
              left,
              right: parseBinaryExpression(parser, context, inGroup, parser.tokenPos, parser.linePos, parser.colPos, prec, t, parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos)),
              operator: KeywordDescTable[t & 255]
          });
      }
      if (parser.token === 1077936157)
          report(parser, 24);
      return left;
  }
  function parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup) {
      if (!isLHS)
          report(parser, 0);
      const unaryOperator = parser.token;
      nextToken(parser, context | 32768);
      const arg = parseLeftHandSideExpression(parser, context, 0, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
      if (parser.token === 8457270)
          report(parser, 31);
      if (context & 1024 && unaryOperator === 16863275) {
          if (arg.type === 'Identifier') {
              report(parser, 117);
          }
          else if (isPropertyWithPrivateFieldKey(arg)) {
              report(parser, 123);
          }
      }
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'UnaryExpression',
          operator: KeywordDescTable[unaryOperator & 255],
          argument: arg,
          prefix: true
      });
  }
  function parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column) {
      const { token } = parser;
      const expr = parseIdentifier(parser, context, isPattern);
      const { flags } = parser;
      if ((flags & 1) < 1) {
          if (parser.token === 86103) {
              return parseFunctionExpression(parser, context, 1, inGroup, start, line, column);
          }
          if ((parser.token & 143360) === 143360) {
              if (!isLHS)
                  report(parser, 0);
              return parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column);
          }
      }
      if (!inNew && parser.token === 67174411) {
          return parseAsyncArrowOrCallExpression(parser, context, expr, canAssign, 1, 0, flags, start, line, column);
      }
      if (parser.token === 10) {
          classifyIdentifier(parser, context, token, 1);
          if (inNew)
              report(parser, 48);
          return parseArrowFromIdentifier(parser, context, parser.tokenValue, expr, inNew, canAssign, 0, start, line, column);
      }
      return expr;
  }
  function parseYieldExpression(parser, context, inGroup, canAssign, start, line, column) {
      if (inGroup)
          parser.destructible |= 256;
      if (context & 2097152) {
          nextToken(parser, context | 32768);
          if (context & 8388608)
              report(parser, 30);
          if (!canAssign)
              report(parser, 24);
          if (parser.token === 22)
              report(parser, 120);
          let argument = null;
          let delegate = false;
          if ((parser.flags & 1) < 1) {
              delegate = consumeOpt(parser, context | 32768, 8457011);
              if (parser.token & 65536 || delegate) {
                  argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
              }
          }
          parser.assignable = 2;
          return finishNode(parser, context, start, line, column, {
              type: 'YieldExpression',
              argument,
              delegate
          });
      }
      if (context & 1024)
          report(parser, 94, 'yield');
      return parseIdentifierOrArrow(parser, context, start, line, column);
  }
  function parseAwaitExpression(parser, context, inNew, inGroup, start, line, column) {
      if (inGroup)
          parser.destructible |= 128;
      if (context & 4194304) {
          if (inNew)
              report(parser, 0);
          if (context & 8388608) {
              reportMessageAt(parser.index, parser.line, parser.index, 29);
          }
          nextToken(parser, context | 32768);
          const argument = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
          parser.assignable = 2;
          return finishNode(parser, context, start, line, column, {
              type: 'AwaitExpression',
              argument
          });
      }
      if (context & 2048)
          report(parser, 107, 'Await');
      return parseIdentifierOrArrow(parser, context, start, line, column);
  }
  function parseFunctionBody(parser, context, scope, origin, firstRestricted, scopeError) {
      const { tokenPos, linePos, colPos } = parser;
      consume(parser, context | 32768, 2162700);
      const body = [];
      const prevContext = context;
      if (parser.token !== 1074790415) {
          while (parser.token === 134283267) {
              const { index, tokenPos, tokenValue, token } = parser;
              const expr = parseLiteral(parser, context);
              if (isValidStrictMode(parser, index, tokenPos, tokenValue)) {
                  context |= 1024;
                  if (parser.flags & 128) {
                      reportMessageAt(parser.index, parser.line, parser.tokenPos, 63);
                  }
                  if (parser.flags & 64) {
                      reportMessageAt(parser.index, parser.line, parser.tokenPos, 8);
                  }
              }
              body.push(parseDirective(parser, context, expr, token, tokenPos, parser.linePos, parser.colPos));
          }
          if (context & 1024) {
              if (firstRestricted) {
                  if ((firstRestricted & 537079808) === 537079808) {
                      report(parser, 115);
                  }
                  if ((firstRestricted & 36864) === 36864) {
                      report(parser, 38);
                  }
              }
              if (parser.flags & 512)
                  report(parser, 115);
              if (parser.flags & 256)
                  report(parser, 114);
          }
          if (context & 64 &&
              scope &&
              scopeError !== void 0 &&
              (prevContext & 1024) < 1 &&
              (context & 8192) < 1) {
              reportScopeError(scopeError);
          }
      }
      parser.flags =
          (parser.flags | 512 | 256 | 64) ^
              (512 | 256 | 64);
      parser.destructible = (parser.destructible | 256) ^ 256;
      while (parser.token !== 1074790415) {
          body.push(parseStatementListItem(parser, context, scope, 4, {}));
      }
      consume(parser, origin & (16 | 8) ? context | 32768 : context, 1074790415);
      parser.flags &= ~(128 | 64);
      if (parser.token === 1077936157)
          report(parser, 24);
      return finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'BlockStatement',
          body
      });
  }
  function parseSuperExpression(parser, context, start, line, column) {
      nextToken(parser, context);
      switch (parser.token) {
          case 67108988:
              report(parser, 161);
          case 67174411: {
              if ((context & 524288) < 1)
                  report(parser, 26);
              if (context & 16384)
                  report(parser, 143);
              parser.assignable = 2;
              break;
          }
          case 69271571:
          case 67108877: {
              if ((context & 262144) < 1)
                  report(parser, 27);
              if (context & 16384)
                  report(parser, 143);
              parser.assignable = 1;
              break;
          }
          default:
              report(parser, 28, 'super');
      }
      return finishNode(parser, context, start, line, column, { type: 'Super' });
  }
  function parseLeftHandSideExpression(parser, context, canAssign, inGroup, isLHS, start, line, column) {
      const expression = parsePrimaryExpression(parser, context, 2, 0, canAssign, 0, inGroup, isLHS, start, line, column);
      return parseMemberOrUpdateExpression(parser, context, expression, inGroup, 0, start, line, column);
  }
  function parseUpdateExpression(parser, context, expr, start, line, column) {
      if (parser.assignable & 2)
          report(parser, 52);
      const { token } = parser;
      nextToken(parser, context);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'UpdateExpression',
          argument: expr,
          operator: KeywordDescTable[token & 255],
          prefix: false
      });
  }
  function parseMemberOrUpdateExpression(parser, context, expr, inGroup, inChain, start, line, column) {
      if ((parser.token & 33619968) === 33619968 && (parser.flags & 1) < 1) {
          expr = parseUpdateExpression(parser, context, expr, start, line, column);
      }
      else if ((parser.token & 67108864) === 67108864) {
          context = (context | 134217728 | 8192) ^ (134217728 | 8192);
          switch (parser.token) {
              case 67108877: {
                  nextToken(parser, context | 1073741824);
                  parser.assignable = 1;
                  const property = parsePropertyOrPrivatePropertyName(parser, context);
                  expr = finishNode(parser, context, start, line, column, {
                      type: 'MemberExpression',
                      object: expr,
                      computed: false,
                      property
                  });
                  break;
              }
              case 69271571: {
                  let restoreHasOptionalChaining = false;
                  if ((parser.flags & 2048) === 2048) {
                      restoreHasOptionalChaining = true;
                      parser.flags = (parser.flags | 2048) ^ 2048;
                  }
                  nextToken(parser, context | 32768);
                  const { tokenPos, linePos, colPos } = parser;
                  const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
                  consume(parser, context, 20);
                  parser.assignable = 1;
                  expr = finishNode(parser, context, start, line, column, {
                      type: 'MemberExpression',
                      object: expr,
                      computed: true,
                      property
                  });
                  if (restoreHasOptionalChaining) {
                      parser.flags |= 2048;
                  }
                  break;
              }
              case 67174411: {
                  if ((parser.flags & 1024) === 1024) {
                      parser.flags = (parser.flags | 1024) ^ 1024;
                      return expr;
                  }
                  let restoreHasOptionalChaining = false;
                  if ((parser.flags & 2048) === 2048) {
                      restoreHasOptionalChaining = true;
                      parser.flags = (parser.flags | 2048) ^ 2048;
                  }
                  const args = parseArguments(parser, context, inGroup);
                  parser.assignable = 2;
                  expr = finishNode(parser, context, start, line, column, {
                      type: 'CallExpression',
                      callee: expr,
                      arguments: args
                  });
                  if (restoreHasOptionalChaining) {
                      parser.flags |= 2048;
                  }
                  break;
              }
              case 67108988: {
                  nextToken(parser, context);
                  parser.flags |= 2048;
                  parser.assignable = 2;
                  expr = parseOptionalChain(parser, context, expr, start, line, column);
                  break;
              }
              default:
                  if ((parser.flags & 2048) === 2048) {
                      report(parser, 160);
                  }
                  parser.assignable = 2;
                  expr = finishNode(parser, context, start, line, column, {
                      type: 'TaggedTemplateExpression',
                      tag: expr,
                      quasi: parser.token === 67174408
                          ? parseTemplate(parser, context | 65536, parser.tokenPos, parser.linePos, parser.colPos)
                          : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
                  });
          }
          expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 1, start, line, column);
      }
      if (inChain === 0 && (parser.flags & 2048) === 2048) {
          parser.flags = (parser.flags | 2048) ^ 2048;
          expr = finishNode(parser, context, start, line, column, {
              type: 'ChainExpression',
              expression: expr
          });
      }
      return expr;
  }
  function parseOptionalChain(parser, context, expr, start, line, column) {
      let restoreHasOptionalChaining = false;
      let node;
      if (parser.token === 69271571 || parser.token === 67174411) {
          if ((parser.flags & 2048) === 2048) {
              restoreHasOptionalChaining = true;
              parser.flags = (parser.flags | 2048) ^ 2048;
          }
      }
      if (parser.token === 69271571) {
          nextToken(parser, context | 32768);
          const { tokenPos, linePos, colPos } = parser;
          const property = parseExpressions(parser, context, 0, 1, tokenPos, linePos, colPos);
          consume(parser, context, 20);
          parser.assignable = 2;
          node = finishNode(parser, context, start, line, column, {
              type: 'MemberExpression',
              object: expr,
              computed: true,
              optional: true,
              property
          });
      }
      else if (parser.token === 67174411) {
          const args = parseArguments(parser, context, 0);
          parser.assignable = 2;
          node = finishNode(parser, context, start, line, column, {
              type: 'CallExpression',
              callee: expr,
              arguments: args,
              optional: true
          });
      }
      else {
          if ((parser.token & (143360 | 4096)) < 1)
              report(parser, 154);
          const property = parseIdentifier(parser, context, 0);
          parser.assignable = 2;
          node = finishNode(parser, context, start, line, column, {
              type: 'MemberExpression',
              object: expr,
              computed: false,
              optional: true,
              property
          });
      }
      if (restoreHasOptionalChaining) {
          parser.flags |= 2048;
      }
      return node;
  }
  function parsePropertyOrPrivatePropertyName(parser, context) {
      if ((parser.token & (143360 | 4096)) < 1 && parser.token !== 128) {
          report(parser, 154);
      }
      return context & 1 && parser.token === 128
          ? parsePrivateName(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
          : parseIdentifier(parser, context, 0);
  }
  function parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column) {
      if (inNew)
          report(parser, 53);
      if (!isLHS)
          report(parser, 0);
      const { token } = parser;
      nextToken(parser, context | 32768);
      const arg = parseLeftHandSideExpression(parser, context, 0, 0, 1, parser.tokenPos, parser.linePos, parser.colPos);
      if (parser.assignable & 2) {
          report(parser, 52);
      }
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'UpdateExpression',
          argument: arg,
          operator: KeywordDescTable[token & 255],
          prefix: true
      });
  }
  function parsePrimaryExpression(parser, context, kind, inNew, canAssign, isPattern, inGroup, isLHS, start, line, column) {
      if ((parser.token & 143360) === 143360) {
          switch (parser.token) {
              case 209005:
                  return parseAwaitExpression(parser, context, inNew, inGroup, start, line, column);
              case 241770:
                  return parseYieldExpression(parser, context, inGroup, canAssign, start, line, column);
              case 143468:
                  return parseAsyncExpression(parser, context, inGroup, isLHS, canAssign, isPattern, inNew, start, line, column);
          }
          const { token, tokenValue } = parser;
          const expr = parseIdentifier(parser, context | 65536, isPattern);
          if (parser.token === 10) {
              if (!isLHS)
                  report(parser, 0);
              classifyIdentifier(parser, context, token, 1);
              return parseArrowFromIdentifier(parser, context, tokenValue, expr, inNew, canAssign, 0, start, line, column);
          }
          if (context & 16384 && token === 537079925)
              report(parser, 126);
          if (token === 241736) {
              if (context & 1024)
                  report(parser, 109);
              if (kind & (8 | 16))
                  report(parser, 97);
          }
          parser.assignable =
              context & 1024 && (token & 537079808) === 537079808
                  ? 2
                  : 1;
          return expr;
      }
      if ((parser.token & 134217728) === 134217728) {
          return parseLiteral(parser, context);
      }
      switch (parser.token) {
          case 33619995:
          case 33619996:
              return parseUpdateExpressionPrefixed(parser, context, inNew, isLHS, start, line, column);
          case 16863275:
          case 16842797:
          case 16842798:
          case 25233967:
          case 25233968:
          case 16863274:
          case 16863276:
              return parseUnaryExpression(parser, context, isLHS, start, line, column, inGroup);
          case 86103:
              return parseFunctionExpression(parser, context, 0, inGroup, start, line, column);
          case 2162700:
              return parseObjectLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
          case 69271571:
              return parseArrayLiteral(parser, context, canAssign ? 0 : 1, inGroup, start, line, column);
          case 67174411:
              return parseParenthesizedExpression(parser, context, canAssign, 1, 0, start, line, column);
          case 86021:
          case 86022:
          case 86023:
              return parseNullOrTrueOrFalseLiteral(parser, context, start, line, column);
          case 86110:
              return parseThisExpression(parser, context);
          case 65540:
              return parseRegExpLiteral(parser, context, start, line, column);
          case 130:
          case 86093:
              return parseClassExpression(parser, context, inGroup, start, line, column);
          case 86108:
              return parseSuperExpression(parser, context, start, line, column);
          case 67174409:
              return parseTemplateLiteral(parser, context, start, line, column);
          case 67174408:
              return parseTemplate(parser, context, start, line, column);
          case 86106:
              return parseNewExpression(parser, context, inGroup, start, line, column);
          case 134283386:
              return parseBigIntLiteral(parser, context, start, line, column);
          case 128:
              return parsePrivateName(parser, context, start, line, column);
          case 86105:
              return parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column);
          case 8456255:
              if (context & 16)
                  return parseJSXRootElementOrFragment(parser, context, 1, start, line, column);
          default:
              if (isValidIdentifier(context, parser.token))
                  return parseIdentifierOrArrow(parser, context, start, line, column);
              report(parser, 28, KeywordDescTable[parser.token & 255]);
      }
  }
  function parseImportCallOrMetaExpression(parser, context, inNew, inGroup, start, line, column) {
      let expr = parseIdentifier(parser, context, 0);
      if (parser.token === 67108877) {
          return parseImportMetaExpression(parser, context, expr, start, line, column);
      }
      if (inNew)
          report(parser, 137);
      expr = parseImportExpression(parser, context, inGroup, start, line, column);
      parser.assignable = 2;
      return parseMemberOrUpdateExpression(parser, context, expr, inGroup, 0, start, line, column);
  }
  function parseImportMetaExpression(parser, context, meta, start, line, column) {
      if ((context & 2048) === 0)
          report(parser, 163);
      nextToken(parser, context);
      if (parser.token !== 143492 && parser.tokenValue !== 'meta')
          report(parser, 28, KeywordDescTable[parser.token & 255]);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'MetaProperty',
          meta,
          property: parseIdentifier(parser, context, 0)
      });
  }
  function parseImportExpression(parser, context, inGroup, start, line, column) {
      consume(parser, context | 32768, 67174411);
      if (parser.token === 14)
          report(parser, 138);
      const source = parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context, 16);
      return finishNode(parser, context, start, line, column, {
          type: 'ImportExpression',
          source
      });
  }
  function parseBigIntLiteral(parser, context, start, line, column) {
      const { tokenRaw, tokenValue } = parser;
      nextToken(parser, context);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, context & 512
          ? {
              type: 'Literal',
              value: tokenValue,
              bigint: tokenRaw.slice(0, -1),
              raw: tokenRaw
          }
          : {
              type: 'Literal',
              value: tokenValue,
              bigint: tokenRaw.slice(0, -1)
          });
  }
  function parseTemplateLiteral(parser, context, start, line, column) {
      parser.assignable = 2;
      const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
      consume(parser, context, 67174409);
      const quasis = [parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true)];
      return finishNode(parser, context, start, line, column, {
          type: 'TemplateLiteral',
          expressions: [],
          quasis
      });
  }
  function parseTemplate(parser, context, start, line, column) {
      context = (context | 134217728) ^ 134217728;
      const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
      consume(parser, context | 32768, 67174408);
      const quasis = [
          parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false)
      ];
      const expressions = [parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos)];
      if (parser.token !== 1074790415)
          report(parser, 80);
      while ((parser.token = scanTemplateTail(parser, context)) !== 67174409) {
          const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
          consume(parser, context | 32768, 67174408);
          quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, false));
          expressions.push(parseExpressions(parser, context, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
          if (parser.token !== 1074790415)
              report(parser, 80);
      }
      {
          const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
          consume(parser, context, 67174409);
          quasis.push(parseTemplateElement(parser, context, tokenValue, tokenRaw, tokenPos, linePos, colPos, true));
      }
      return finishNode(parser, context, start, line, column, {
          type: 'TemplateLiteral',
          expressions,
          quasis
      });
  }
  function parseTemplateElement(parser, context, cooked, raw, start, line, col, tail) {
      const node = finishNode(parser, context, start, line, col, {
          type: 'TemplateElement',
          value: {
              cooked,
              raw
          },
          tail
      });
      const tailSize = tail ? 1 : 2;
      if (context & 2) {
          node.start += 1;
          node.range[0] += 1;
          node.end -= tailSize;
          node.range[1] -= tailSize;
      }
      if (context & 4) {
          node.loc.start.column += 1;
          node.loc.end.column -= tailSize;
      }
      return node;
  }
  function parseSpreadElement(parser, context, start, line, column) {
      context = (context | 134217728) ^ 134217728;
      consume(parser, context | 32768, 14);
      const argument = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      parser.assignable = 1;
      return finishNode(parser, context, start, line, column, {
          type: 'SpreadElement',
          argument
      });
  }
  function parseArguments(parser, context, inGroup) {
      nextToken(parser, context | 32768);
      const args = [];
      if (parser.token === 16) {
          nextToken(parser, context);
          return args;
      }
      while (parser.token !== 16) {
          if (parser.token === 14) {
              args.push(parseSpreadElement(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
          }
          else {
              args.push(parseExpression(parser, context, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
          }
          if (parser.token !== 18)
              break;
          nextToken(parser, context | 32768);
          if (parser.token === 16)
              break;
      }
      consume(parser, context, 16);
      return args;
  }
  function parseIdentifier(parser, context, isPattern) {
      const { tokenValue, tokenPos, linePos, colPos } = parser;
      nextToken(parser, context);
      return finishNode(parser, context, tokenPos, linePos, colPos, context & 268435456
          ? {
              type: 'Identifier',
              name: tokenValue,
              pattern: isPattern === 1
          }
          : {
              type: 'Identifier',
              name: tokenValue
          });
  }
  function parseLiteral(parser, context) {
      const { tokenValue, tokenRaw, tokenPos, linePos, colPos } = parser;
      if (parser.token === 134283386) {
          return parseBigIntLiteral(parser, context, tokenPos, linePos, colPos);
      }
      nextToken(parser, context);
      parser.assignable = 2;
      return finishNode(parser, context, tokenPos, linePos, colPos, context & 512
          ? {
              type: 'Literal',
              value: tokenValue,
              raw: tokenRaw
          }
          : {
              type: 'Literal',
              value: tokenValue
          });
  }
  function parseNullOrTrueOrFalseLiteral(parser, context, start, line, column) {
      const raw = KeywordDescTable[parser.token & 255];
      const value = parser.token === 86023 ? null : raw === 'true';
      nextToken(parser, context);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, context & 512
          ? {
              type: 'Literal',
              value,
              raw
          }
          : {
              type: 'Literal',
              value
          });
  }
  function parseThisExpression(parser, context) {
      const { tokenPos, linePos, colPos } = parser;
      nextToken(parser, context);
      parser.assignable = 2;
      return finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'ThisExpression'
      });
  }
  function parseFunctionDeclaration(parser, context, scope, origin, allowGen, flags, isAsync, start, line, column) {
      nextToken(parser, context | 32768);
      const isGenerator = allowGen ? optionalBit(parser, context, 8457011) : 0;
      let id = null;
      let firstRestricted;
      let functionScope = scope ? createScope() : void 0;
      if (parser.token === 67174411) {
          if ((flags & 1) < 1)
              report(parser, 37, 'Function');
      }
      else {
          const kind = origin & 4 && ((context & 8192) < 1 || (context & 2048) < 1)
              ? 4
              : 64;
          validateFunctionName(parser, context | ((context & 3072) << 11), parser.token);
          if (scope) {
              if (kind & 4) {
                  addVarName(parser, context, scope, parser.tokenValue, kind);
              }
              else {
                  addBlockName(parser, context, scope, parser.tokenValue, kind, origin);
              }
              functionScope = addChildScope(functionScope, 256);
              if (flags) {
                  if (flags & 2) {
                      declareUnboundVariable(parser, parser.tokenValue);
                  }
              }
          }
          firstRestricted = parser.token;
          id = parseIdentifier(parser, context, 0);
      }
      context =
          ((context | 32243712) ^ 32243712) |
              67108864 |
              ((isAsync * 2 + isGenerator) << 21) |
              (isGenerator ? 0 : 1073741824);
      if (scope)
          functionScope = addChildScope(functionScope, 512);
      const params = parseFormalParametersOrFormalList(parser, context | 8388608, functionScope, 0, 1);
      const body = parseFunctionBody(parser, (context | 8192 | 4096 | 131072) ^
          (8192 | 4096 | 131072), scope ? addChildScope(functionScope, 128) : functionScope, 8, firstRestricted, scope ? functionScope.scopeError : void 0);
      return finishNode(parser, context, start, line, column, {
          type: 'FunctionDeclaration',
          id,
          params,
          body,
          async: isAsync === 1,
          generator: isGenerator === 1
      });
  }
  function parseFunctionExpression(parser, context, isAsync, inGroup, start, line, column) {
      nextToken(parser, context | 32768);
      const isGenerator = optionalBit(parser, context, 8457011);
      const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
      let id = null;
      let firstRestricted;
      let scope = context & 64 ? createScope() : void 0;
      if ((parser.token & (143360 | 4096 | 36864)) > 0) {
          validateFunctionName(parser, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, parser.token);
          if (scope)
              scope = addChildScope(scope, 256);
          firstRestricted = parser.token;
          id = parseIdentifier(parser, context, 0);
      }
      context =
          ((context | 32243712) ^ 32243712) |
              67108864 |
              generatorAndAsyncFlags |
              (isGenerator ? 0 : 1073741824);
      if (scope)
          scope = addChildScope(scope, 512);
      const params = parseFormalParametersOrFormalList(parser, context | 8388608, scope, inGroup, 1);
      const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192 | 4096 | 131072 | 16384), scope ? addChildScope(scope, 128) : scope, 0, firstRestricted, void 0);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'FunctionExpression',
          id,
          params,
          body,
          async: isAsync === 1,
          generator: isGenerator === 1
      });
  }
  function parseArrayLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
      const expr = parseArrayExpressionOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
      if (context & 256 && parser.destructible & 64) {
          report(parser, 60);
      }
      if (parser.destructible & 8) {
          report(parser, 59);
      }
      return expr;
  }
  function parseArrayExpressionOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
      nextToken(parser, context | 32768);
      const elements = [];
      let destructible = 0;
      context = (context | 134217728) ^ 134217728;
      while (parser.token !== 20) {
          if (consumeOpt(parser, context | 32768, 18)) {
              elements.push(null);
          }
          else {
              let left;
              const { token, tokenPos, linePos, colPos, tokenValue } = parser;
              if (token & 143360) {
                  left = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                  if (parser.token === 1077936157) {
                      if (parser.assignable & 2)
                          report(parser, 24);
                      nextToken(parser, context | 32768);
                      if (scope)
                          addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                      const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                      left = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                          ? {
                              type: 'AssignmentPattern',
                              left,
                              right
                          }
                          : {
                              type: 'AssignmentExpression',
                              operator: '=',
                              left,
                              right
                          });
                      destructible |=
                          parser.destructible & 256
                              ? 256
                              : 0 | (parser.destructible & 128)
                                  ? 128
                                  : 0;
                  }
                  else if (parser.token === 18 || parser.token === 20) {
                      if (parser.assignable & 2) {
                          destructible |= 16;
                      }
                      else if (scope) {
                          addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                      }
                      destructible |=
                          parser.destructible & 256
                              ? 256
                              : 0 | (parser.destructible & 128)
                                  ? 128
                                  : 0;
                  }
                  else {
                      destructible |=
                          kind & 1
                              ? 32
                              : (kind & 2) < 1
                                  ? 16
                                  : 0;
                      left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                      if (parser.token !== 18 && parser.token !== 20) {
                          if (parser.token !== 1077936157)
                              destructible |= 16;
                          left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                      }
                      else if (parser.token !== 1077936157) {
                          destructible |=
                              parser.assignable & 2
                                  ? 16
                                  : 32;
                      }
                  }
              }
              else if (token & 2097152) {
                  left =
                      parser.token === 2162700
                          ? parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                          : parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                  destructible |= parser.destructible;
                  parser.assignable =
                      parser.destructible & 16
                          ? 2
                          : 1;
                  if (parser.token === 18 || parser.token === 20) {
                      if (parser.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else if (parser.destructible & 8) {
                      report(parser, 68);
                  }
                  else {
                      left = parseMemberOrUpdateExpression(parser, context, left, inGroup, 0, tokenPos, linePos, colPos);
                      destructible = parser.assignable & 2 ? 16 : 0;
                      if (parser.token !== 18 && parser.token !== 20) {
                          left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                      }
                      else if (parser.token !== 1077936157) {
                          destructible |=
                              parser.assignable & 2
                                  ? 16
                                  : 32;
                      }
                  }
              }
              else if (token === 14) {
                  left = parseSpreadOrRestElement(parser, context, scope, 20, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos);
                  destructible |= parser.destructible;
                  if (parser.token !== 18 && parser.token !== 20)
                      report(parser, 28, KeywordDescTable[parser.token & 255]);
              }
              else {
                  left = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                  if (parser.token !== 18 && parser.token !== 20) {
                      left = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, left);
                      if ((kind & (2 | 1)) < 1 && token === 67174411)
                          destructible |= 16;
                  }
                  else if (parser.assignable & 2) {
                      destructible |= 16;
                  }
                  else if (token === 67174411) {
                      destructible |=
                          parser.assignable & 1 && kind & (2 | 1)
                              ? 32
                              : 16;
                  }
              }
              elements.push(left);
              if (consumeOpt(parser, context | 32768, 18)) {
                  if (parser.token === 20)
                      break;
              }
              else
                  break;
          }
      }
      consume(parser, context, 20);
      const node = finishNode(parser, context, start, line, column, {
          type: isPattern ? 'ArrayPattern' : 'ArrayExpression',
          elements
      });
      if (!skipInitializer && parser.token & 4194304) {
          return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
      }
      parser.destructible = destructible;
      return node;
  }
  function parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node) {
      if (parser.token !== 1077936157)
          report(parser, 24);
      nextToken(parser, context | 32768);
      if (destructible & 16)
          report(parser, 24);
      if (!isPattern)
          reinterpretToPattern(parser, node);
      const { tokenPos, linePos, colPos } = parser;
      const right = parseExpression(parser, context, 1, 1, inGroup, tokenPos, linePos, colPos);
      parser.destructible =
          ((destructible | 64 | 8) ^
              (8 | 64)) |
              (parser.destructible & 128 ? 128 : 0) |
              (parser.destructible & 256 ? 256 : 0);
      return finishNode(parser, context, start, line, column, isPattern
          ? {
              type: 'AssignmentPattern',
              left: node,
              right
          }
          : {
              type: 'AssignmentExpression',
              left: node,
              operator: '=',
              right
          });
  }
  function parseSpreadOrRestElement(parser, context, scope, closingToken, kind, origin, isAsync, inGroup, isPattern, start, line, column) {
      nextToken(parser, context | 32768);
      let argument = null;
      let destructible = 0;
      let { token, tokenValue, tokenPos, linePos, colPos } = parser;
      if (token & (4096 | 143360)) {
          parser.assignable = 1;
          argument = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
          token = parser.token;
          argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
          if (parser.token !== 18 && parser.token !== closingToken) {
              if (parser.assignable & 2 && parser.token === 1077936157)
                  report(parser, 68);
              destructible |= 16;
              argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
          }
          if (parser.assignable & 2) {
              destructible |= 16;
          }
          else if (token === closingToken || token === 18) {
              if (scope)
                  addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
          }
          else {
              destructible |= 32;
          }
          destructible |= parser.destructible & 128 ? 128 : 0;
      }
      else if (token === closingToken) {
          report(parser, 39);
      }
      else if (token & 2097152) {
          argument =
              parser.token === 2162700
                  ? parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                  : parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
          token = parser.token;
          if (token !== 1077936157 && token !== closingToken && token !== 18) {
              if (parser.destructible & 8)
                  report(parser, 68);
              argument = parseMemberOrUpdateExpression(parser, context, argument, inGroup, 0, tokenPos, linePos, colPos);
              destructible |= parser.assignable & 2 ? 16 : 0;
              if ((parser.token & 4194304) === 4194304) {
                  if (parser.token !== 1077936157)
                      destructible |= 16;
                  argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
              }
              else {
                  if ((parser.token & 8454144) === 8454144) {
                      argument = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, argument);
                  }
                  if (consumeOpt(parser, context | 32768, 22)) {
                      argument = parseConditionalExpression(parser, context, argument, tokenPos, linePos, colPos);
                  }
                  destructible |=
                      parser.assignable & 2
                          ? 16
                          : 32;
              }
          }
          else {
              destructible |=
                  closingToken === 1074790415 && token !== 1077936157
                      ? 16
                      : parser.destructible;
          }
      }
      else {
          destructible |= 32;
          argument = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, parser.tokenPos, parser.linePos, parser.colPos);
          const { token, tokenPos, linePos, colPos } = parser;
          if (token === 1077936157 && token !== closingToken && token !== 18) {
              if (parser.assignable & 2)
                  report(parser, 24);
              argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
              destructible |= 16;
          }
          else {
              if (token === 18) {
                  destructible |= 16;
              }
              else if (token !== closingToken) {
                  argument = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, argument);
              }
              destructible |=
                  parser.assignable & 1 ? 32 : 16;
          }
          parser.destructible = destructible;
          if (parser.token !== closingToken && parser.token !== 18)
              report(parser, 155);
          return finishNode(parser, context, start, line, column, {
              type: isPattern ? 'RestElement' : 'SpreadElement',
              argument: argument
          });
      }
      if (parser.token !== closingToken) {
          if (kind & 1)
              destructible |= isAsync ? 16 : 32;
          if (consumeOpt(parser, context | 32768, 1077936157)) {
              if (destructible & 16)
                  report(parser, 24);
              reinterpretToPattern(parser, argument);
              const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
              argument = finishNode(parser, context, tokenPos, linePos, colPos, isPattern
                  ? {
                      type: 'AssignmentPattern',
                      left: argument,
                      right
                  }
                  : {
                      type: 'AssignmentExpression',
                      left: argument,
                      operator: '=',
                      right
                  });
              destructible = 16;
          }
          else {
              destructible |= 16;
          }
      }
      parser.destructible = destructible;
      return finishNode(parser, context, start, line, column, {
          type: isPattern ? 'RestElement' : 'SpreadElement',
          argument: argument
      });
  }
  function parseMethodDefinition(parser, context, kind, inGroup, start, line, column) {
      const modifierFlags = (kind & 64) < 1 ? 31981568 : 14680064;
      context =
          ((context | modifierFlags) ^ modifierFlags) |
              ((kind & 88) << 18) |
              100925440;
      let scope = context & 64 ? addChildScope(createScope(), 512) : void 0;
      const params = parseMethodFormals(parser, context | 8388608, scope, kind, 1, inGroup);
      if (scope)
          scope = addChildScope(scope, 128);
      const body = parseFunctionBody(parser, context & ~(0x8001000 | 8192), scope, 0, void 0, void 0);
      return finishNode(parser, context, start, line, column, {
          type: 'FunctionExpression',
          params,
          body,
          async: (kind & 16) > 0,
          generator: (kind & 8) > 0,
          id: null
      });
  }
  function parseObjectLiteral(parser, context, skipInitializer, inGroup, start, line, column) {
      const expr = parseObjectLiteralOrPattern(parser, context, void 0, skipInitializer, inGroup, 0, 2, 0, start, line, column);
      if (context & 256 && parser.destructible & 64) {
          report(parser, 60);
      }
      if (parser.destructible & 8) {
          report(parser, 59);
      }
      return expr;
  }
  function parseObjectLiteralOrPattern(parser, context, scope, skipInitializer, inGroup, isPattern, kind, origin, start, line, column) {
      nextToken(parser, context);
      const properties = [];
      let destructible = 0;
      let prototypeCount = 0;
      context = (context | 134217728) ^ 134217728;
      while (parser.token !== 1074790415) {
          const { token, tokenValue, linePos, colPos, tokenPos } = parser;
          if (token === 14) {
              properties.push(parseSpreadOrRestElement(parser, context, scope, 1074790415, kind, origin, 0, inGroup, isPattern, tokenPos, linePos, colPos));
          }
          else {
              let state = 0;
              let key = null;
              let value;
              const t = parser.token;
              if (parser.token & (143360 | 4096) || parser.token === 118) {
                  key = parseIdentifier(parser, context, 0);
                  if (parser.token === 18 || parser.token === 1074790415 || parser.token === 1077936157) {
                      state |= 4;
                      if (context & 1024 && (token & 537079808) === 537079808) {
                          destructible |= 16;
                      }
                      else {
                          validateBindingIdentifier(parser, context, kind, token, 0);
                      }
                      if (scope)
                          addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                      if (consumeOpt(parser, context | 32768, 1077936157)) {
                          destructible |= 8;
                          const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                          destructible |=
                              parser.destructible & 256
                                  ? 256
                                  : 0 | (parser.destructible & 128)
                                      ? 128
                                      : 0;
                          value = finishNode(parser, context, tokenPos, linePos, colPos, {
                              type: 'AssignmentPattern',
                              left: context & -2147483648 ? Object.assign({}, key) : key,
                              right
                          });
                      }
                      else {
                          destructible |=
                              (token === 209005 ? 128 : 0) |
                                  (token === 118 ? 16 : 0);
                          value = context & -2147483648 ? Object.assign({}, key) : key;
                      }
                  }
                  else if (consumeOpt(parser, context | 32768, 21)) {
                      const { tokenPos, linePos, colPos } = parser;
                      if (tokenValue === '__proto__')
                          prototypeCount++;
                      if (parser.token & 143360) {
                          const tokenAfterColon = parser.token;
                          const valueAfterColon = parser.tokenValue;
                          destructible |= t === 118 ? 16 : 0;
                          value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                          const { token } = parser;
                          value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (token === 1077936157 || token === 1074790415 || token === 18) {
                                  destructible |= parser.destructible & 128 ? 128 : 0;
                                  if (parser.assignable & 2) {
                                      destructible |= 16;
                                  }
                                  else if (scope && (tokenAfterColon & 143360) === 143360) {
                                      addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                  }
                              }
                              else {
                                  destructible |=
                                      parser.assignable & 1
                                          ? 32
                                          : 16;
                              }
                          }
                          else if ((parser.token & 4194304) === 4194304) {
                              if (parser.assignable & 2) {
                                  destructible |= 16;
                              }
                              else if (token !== 1077936157) {
                                  destructible |= 32;
                              }
                              else if (scope) {
                                  addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                              }
                              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                          }
                          else {
                              destructible |= 16;
                              if ((parser.token & 8454144) === 8454144) {
                                  value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                              }
                              if (consumeOpt(parser, context | 32768, 22)) {
                                  value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                              }
                          }
                      }
                      else if ((parser.token & 2097152) === 2097152) {
                          value =
                              parser.token === 69271571
                                  ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                  : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                          destructible = parser.destructible;
                          parser.assignable =
                              destructible & 16 ? 2 : 1;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2)
                                  destructible |= 16;
                          }
                          else if (parser.destructible & 8) {
                              report(parser, 68);
                          }
                          else {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                              destructible = parser.assignable & 2 ? 16 : 0;
                              if ((parser.token & 4194304) === 4194304) {
                                  value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                              }
                              else {
                                  if ((parser.token & 8454144) === 8454144) {
                                      value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                  }
                                  if (consumeOpt(parser, context | 32768, 22)) {
                                      value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                  }
                                  destructible |=
                                      parser.assignable & 2
                                          ? 16
                                          : 32;
                              }
                          }
                      }
                      else {
                          value = parseLeftHandSideExpression(parser, context, 1, inGroup, 1, tokenPos, linePos, colPos);
                          destructible |=
                              parser.assignable & 1
                                  ? 32
                                  : 16;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2)
                                  destructible |= 16;
                          }
                          else {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, tokenPos, colPos);
                              destructible = parser.assignable & 2 ? 16 : 0;
                              if (parser.token !== 18 && token !== 1074790415) {
                                  if (parser.token !== 1077936157)
                                      destructible |= 16;
                                  value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, tokenPos, colPos, value);
                              }
                          }
                      }
                  }
                  else if (parser.token === 69271571) {
                      destructible |= 16;
                      if (token === 143468)
                          state |= 16;
                      state |=
                          (token === 12399
                              ? 256
                              : token === 12400
                                  ? 512
                                  : 1) | 2;
                      key = parseComputedPropertyName(parser, context, inGroup);
                      destructible |= parser.assignable;
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else if (parser.token & (143360 | 4096)) {
                      destructible |= 16;
                      if (token === 118)
                          report(parser, 92);
                      if (token === 143468) {
                          if (parser.flags & 1)
                              report(parser, 128);
                          state |= 16;
                      }
                      key = parseIdentifier(parser, context, 0);
                      state |=
                          token === 12399
                              ? 256
                              : token === 12400
                                  ? 512
                                  : 1;
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else if (parser.token === 67174411) {
                      destructible |= 16;
                      state |= 1;
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else if (parser.token === 8457011) {
                      destructible |= 16;
                      if (token === 12399 || token === 12400) {
                          report(parser, 40);
                      }
                      else if (token === 143480) {
                          report(parser, 92);
                      }
                      nextToken(parser, context);
                      state |=
                          8 | 1 | (token === 143468 ? 16 : 0);
                      if (parser.token & 143360) {
                          key = parseIdentifier(parser, context, 0);
                      }
                      else if ((parser.token & 134217728) === 134217728) {
                          key = parseLiteral(parser, context);
                      }
                      else if (parser.token === 69271571) {
                          state |= 2;
                          key = parseComputedPropertyName(parser, context, inGroup);
                          destructible |= parser.assignable;
                      }
                      else {
                          report(parser, 28, KeywordDescTable[parser.token & 255]);
                      }
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else if ((parser.token & 134217728) === 134217728) {
                      if (token === 143468)
                          state |= 16;
                      state |=
                          token === 12399
                              ? 256
                              : token === 12400
                                  ? 512
                                  : 1;
                      destructible |= 16;
                      key = parseLiteral(parser, context);
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else {
                      report(parser, 129);
                  }
              }
              else if ((parser.token & 134217728) === 134217728) {
                  key = parseLiteral(parser, context);
                  if (parser.token === 21) {
                      consume(parser, context | 32768, 21);
                      const { tokenPos, linePos, colPos } = parser;
                      if (tokenValue === '__proto__')
                          prototypeCount++;
                      if (parser.token & 143360) {
                          value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                          const { token, tokenValue: valueAfterColon } = parser;
                          value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (token === 1077936157 || token === 1074790415 || token === 18) {
                                  if (parser.assignable & 2) {
                                      destructible |= 16;
                                  }
                                  else if (scope) {
                                      addVarOrBlock(parser, context, scope, valueAfterColon, kind, origin);
                                  }
                              }
                              else {
                                  destructible |=
                                      parser.assignable & 1
                                          ? 32
                                          : 16;
                              }
                          }
                          else if (parser.token === 1077936157) {
                              if (parser.assignable & 2)
                                  destructible |= 16;
                              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                          }
                          else {
                              destructible |= 16;
                              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                          }
                      }
                      else if ((parser.token & 2097152) === 2097152) {
                          value =
                              parser.token === 69271571
                                  ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                  : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                          destructible = parser.destructible;
                          parser.assignable =
                              destructible & 16 ? 2 : 1;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2) {
                                  destructible |= 16;
                              }
                          }
                          else if ((parser.destructible & 8) !== 8) {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                              destructible = parser.assignable & 2 ? 16 : 0;
                              if ((parser.token & 4194304) === 4194304) {
                                  value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                              }
                              else {
                                  if ((parser.token & 8454144) === 8454144) {
                                      value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                  }
                                  if (consumeOpt(parser, context | 32768, 22)) {
                                      value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                  }
                                  destructible |=
                                      parser.assignable & 2
                                          ? 16
                                          : 32;
                              }
                          }
                      }
                      else {
                          value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                          destructible |=
                              parser.assignable & 1
                                  ? 32
                                  : 16;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2) {
                                  destructible |= 16;
                              }
                          }
                          else {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                              destructible = parser.assignable & 1 ? 0 : 16;
                              if (parser.token !== 18 && parser.token !== 1074790415) {
                                  if (parser.token !== 1077936157)
                                      destructible |= 16;
                                  value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                              }
                          }
                      }
                  }
                  else if (parser.token === 67174411) {
                      state |= 1;
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                      destructible = parser.assignable | 16;
                  }
                  else {
                      report(parser, 130);
                  }
              }
              else if (parser.token === 69271571) {
                  key = parseComputedPropertyName(parser, context, inGroup);
                  destructible |= parser.destructible & 256 ? 256 : 0;
                  state |= 2;
                  if (parser.token === 21) {
                      nextToken(parser, context | 32768);
                      const { tokenPos, linePos, colPos, tokenValue, token: tokenAfterColon } = parser;
                      if (parser.token & 143360) {
                          value = parsePrimaryExpression(parser, context, kind, 0, 1, 0, inGroup, 1, tokenPos, linePos, colPos);
                          const { token } = parser;
                          value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                          if ((parser.token & 4194304) === 4194304) {
                              destructible |=
                                  parser.assignable & 2
                                      ? 16
                                      : token === 1077936157
                                          ? 0
                                          : 32;
                              value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                          }
                          else if (parser.token === 18 || parser.token === 1074790415) {
                              if (token === 1077936157 || token === 1074790415 || token === 18) {
                                  if (parser.assignable & 2) {
                                      destructible |= 16;
                                  }
                                  else if (scope && (tokenAfterColon & 143360) === 143360) {
                                      addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
                                  }
                              }
                              else {
                                  destructible |=
                                      parser.assignable & 1
                                          ? 32
                                          : 16;
                              }
                          }
                          else {
                              destructible |= 16;
                              value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                          }
                      }
                      else if ((parser.token & 2097152) === 2097152) {
                          value =
                              parser.token === 69271571
                                  ? parseArrayExpressionOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos)
                                  : parseObjectLiteralOrPattern(parser, context, scope, 0, inGroup, isPattern, kind, origin, tokenPos, linePos, colPos);
                          destructible = parser.destructible;
                          parser.assignable =
                              destructible & 16 ? 2 : 1;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2)
                                  destructible |= 16;
                          }
                          else if (destructible & 8) {
                              report(parser, 59);
                          }
                          else {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                              destructible =
                                  parser.assignable & 2 ? destructible | 16 : 0;
                              if ((parser.token & 4194304) === 4194304) {
                                  if (parser.token !== 1077936157)
                                      destructible |= 16;
                                  value = parseAssignmentExpressionOrPattern(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                              }
                              else {
                                  if ((parser.token & 8454144) === 8454144) {
                                      value = parseBinaryExpression(parser, context, 1, tokenPos, linePos, colPos, 4, token, value);
                                  }
                                  if (consumeOpt(parser, context | 32768, 22)) {
                                      value = parseConditionalExpression(parser, context, value, tokenPos, linePos, colPos);
                                  }
                                  destructible |=
                                      parser.assignable & 2
                                          ? 16
                                          : 32;
                              }
                          }
                      }
                      else {
                          value = parseLeftHandSideExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
                          destructible |=
                              parser.assignable & 1
                                  ? 32
                                  : 16;
                          if (parser.token === 18 || parser.token === 1074790415) {
                              if (parser.assignable & 2)
                                  destructible |= 16;
                          }
                          else {
                              value = parseMemberOrUpdateExpression(parser, context, value, inGroup, 0, tokenPos, linePos, colPos);
                              destructible = parser.assignable & 1 ? 0 : 16;
                              if (parser.token !== 18 && parser.token !== 1074790415) {
                                  if (parser.token !== 1077936157)
                                      destructible |= 16;
                                  value = parseAssignmentExpression(parser, context, inGroup, isPattern, tokenPos, linePos, colPos, value);
                              }
                          }
                      }
                  }
                  else if (parser.token === 67174411) {
                      state |= 1;
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, linePos, colPos);
                      destructible = 16;
                  }
                  else {
                      report(parser, 41);
                  }
              }
              else if (token === 8457011) {
                  consume(parser, context | 32768, 8457011);
                  state |= 8;
                  if (parser.token & 143360) {
                      const { token, line, index } = parser;
                      key = parseIdentifier(parser, context, 0);
                      state |= 1;
                      if (parser.token === 67174411) {
                          destructible |= 16;
                          value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                      }
                      else {
                          reportMessageAt(index, line, index, token === 143468
                              ? 43
                              : token === 12399 || parser.token === 12400
                                  ? 42
                                  : 44, KeywordDescTable[token & 255]);
                      }
                  }
                  else if ((parser.token & 134217728) === 134217728) {
                      destructible |= 16;
                      key = parseLiteral(parser, context);
                      state |= 1;
                      value = parseMethodDefinition(parser, context, state, inGroup, tokenPos, linePos, colPos);
                  }
                  else if (parser.token === 69271571) {
                      destructible |= 16;
                      state |= 2 | 1;
                      key = parseComputedPropertyName(parser, context, inGroup);
                      value = parseMethodDefinition(parser, context, state, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
                  }
                  else {
                      report(parser, 122);
                  }
              }
              else {
                  report(parser, 28, KeywordDescTable[token & 255]);
              }
              destructible |= parser.destructible & 128 ? 128 : 0;
              parser.destructible = destructible;
              properties.push(finishNode(parser, context, tokenPos, linePos, colPos, {
                  type: 'Property',
                  key: key,
                  value,
                  kind: !(state & 768) ? 'init' : state & 512 ? 'set' : 'get',
                  computed: (state & 2) > 0,
                  method: (state & 1) > 0,
                  shorthand: (state & 4) > 0
              }));
          }
          destructible |= parser.destructible;
          if (parser.token !== 18)
              break;
          nextToken(parser, context);
      }
      consume(parser, context, 1074790415);
      if (prototypeCount > 1)
          destructible |= 64;
      const node = finishNode(parser, context, start, line, column, {
          type: isPattern ? 'ObjectPattern' : 'ObjectExpression',
          properties
      });
      if (!skipInitializer && parser.token & 4194304) {
          return parseArrayOrObjectAssignmentPattern(parser, context, destructible, inGroup, isPattern, start, line, column, node);
      }
      parser.destructible = destructible;
      return node;
  }
  function parseMethodFormals(parser, context, scope, kind, type, inGroup) {
      consume(parser, context, 67174411);
      const params = [];
      parser.flags = (parser.flags | 128) ^ 128;
      if (parser.token === 16) {
          if (kind & 512) {
              report(parser, 35, 'Setter', 'one', '');
          }
          nextToken(parser, context);
          return params;
      }
      if (kind & 256) {
          report(parser, 35, 'Getter', 'no', 's');
      }
      if (kind & 512 && parser.token === 14) {
          report(parser, 36);
      }
      context = (context | 134217728) ^ 134217728;
      let setterArgs = 0;
      let isSimpleParameterList = 0;
      while (parser.token !== 18) {
          let left = null;
          const { tokenPos, linePos, colPos } = parser;
          if (parser.token & 143360) {
              if ((context & 1024) < 1) {
                  if ((parser.token & 36864) === 36864) {
                      parser.flags |= 256;
                  }
                  if ((parser.token & 537079808) === 537079808) {
                      parser.flags |= 512;
                  }
              }
              left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
          }
          else {
              if (parser.token === 2162700) {
                  left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
              }
              else if (parser.token === 69271571) {
                  left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, type, 0, tokenPos, linePos, colPos);
              }
              else if (parser.token === 14) {
                  left = parseSpreadOrRestElement(parser, context, scope, 16, type, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
              }
              isSimpleParameterList = 1;
              if (parser.destructible & (32 | 16))
                  report(parser, 47);
          }
          if (parser.token === 1077936157) {
              nextToken(parser, context | 32768);
              isSimpleParameterList = 1;
              const right = parseExpression(parser, context, 1, 1, 0, parser.tokenPos, parser.linePos, parser.colPos);
              left = finishNode(parser, context, tokenPos, linePos, colPos, {
                  type: 'AssignmentPattern',
                  left: left,
                  right
              });
          }
          setterArgs++;
          params.push(left);
          if (!consumeOpt(parser, context, 18))
              break;
          if (parser.token === 16) {
              break;
          }
      }
      if (kind & 512 && setterArgs !== 1) {
          report(parser, 35, 'Setter', 'one', '');
      }
      if (scope && scope.scopeError !== void 0)
          reportScopeError(scope.scopeError);
      if (isSimpleParameterList)
          parser.flags |= 128;
      consume(parser, context, 16);
      return params;
  }
  function parseComputedPropertyName(parser, context, inGroup) {
      nextToken(parser, context | 32768);
      const key = parseExpression(parser, (context | 134217728) ^ 134217728, 1, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context, 20);
      return key;
  }
  function parseParenthesizedExpression(parser, context, canAssign, kind, origin, start, line, column) {
      parser.flags = (parser.flags | 128) ^ 128;
      const { tokenPos: piStart, linePos: plStart, colPos: pcStart } = parser;
      nextToken(parser, context | 32768 | 1073741824);
      const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
      context = (context | 134217728 | 8192) ^ (8192 | 134217728);
      if (consumeOpt(parser, context, 16)) {
          return parseParenthesizedArrow(parser, context, scope, [], canAssign, 0, start, line, column);
      }
      let destructible = 0;
      parser.destructible &= ~(256 | 128);
      let expr;
      let expressions = [];
      let isSequence = 0;
      let isSimpleParameterList = 0;
      const { tokenPos: iStart, linePos: lStart, colPos: cStart } = parser;
      parser.assignable = 1;
      while (parser.token !== 16) {
          const { token, tokenPos, linePos, colPos } = parser;
          if (token & (143360 | 4096)) {
              if (scope)
                  addBlockName(parser, context, scope, parser.tokenValue, 1, 0);
              expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
              if (parser.token === 16 || parser.token === 18) {
                  if (parser.assignable & 2) {
                      destructible |= 16;
                      isSimpleParameterList = 1;
                  }
                  else if ((token & 537079808) === 537079808 ||
                      (token & 36864) === 36864) {
                      isSimpleParameterList = 1;
                  }
              }
              else {
                  if (parser.token === 1077936157) {
                      isSimpleParameterList = 1;
                  }
                  else {
                      destructible |= 16;
                  }
                  expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                  if (parser.token !== 16 && parser.token !== 18) {
                      expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                  }
              }
          }
          else if ((token & 2097152) === 2097152) {
              expr =
                  token === 2162700
                      ? parseObjectLiteralOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                      : parseArrayExpressionOrPattern(parser, context | 1073741824, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
              destructible |= parser.destructible;
              isSimpleParameterList = 1;
              parser.assignable = 2;
              if (parser.token !== 16 && parser.token !== 18) {
                  if (destructible & 8)
                      report(parser, 118);
                  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                  destructible |= 16;
                  if (parser.token !== 16 && parser.token !== 18) {
                      expr = parseAssignmentExpression(parser, context, 0, 0, tokenPos, linePos, colPos, expr);
                  }
              }
          }
          else if (token === 14) {
              expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 0, 1, 0, tokenPos, linePos, colPos);
              if (parser.destructible & 16)
                  report(parser, 71);
              isSimpleParameterList = 1;
              if (isSequence && (parser.token === 16 || parser.token === 18)) {
                  expressions.push(expr);
              }
              destructible |= 8;
              break;
          }
          else {
              destructible |= 16;
              expr = parseExpression(parser, context, 1, 0, 1, tokenPos, linePos, colPos);
              if (isSequence && (parser.token === 16 || parser.token === 18)) {
                  expressions.push(expr);
              }
              if (parser.token === 18) {
                  if (!isSequence) {
                      isSequence = 1;
                      expressions = [expr];
                  }
              }
              if (isSequence) {
                  while (consumeOpt(parser, context | 32768, 18)) {
                      expressions.push(parseExpression(parser, context, 1, 0, 1, parser.tokenPos, parser.linePos, parser.colPos));
                  }
                  parser.assignable = 2;
                  expr = finishNode(parser, context, iStart, lStart, cStart, {
                      type: 'SequenceExpression',
                      expressions
                  });
              }
              consume(parser, context, 16);
              parser.destructible = destructible;
              return expr;
          }
          if (isSequence && (parser.token === 16 || parser.token === 18)) {
              expressions.push(expr);
          }
          if (!consumeOpt(parser, context | 32768, 18))
              break;
          if (!isSequence) {
              isSequence = 1;
              expressions = [expr];
          }
          if (parser.token === 16) {
              destructible |= 8;
              break;
          }
      }
      if (isSequence) {
          parser.assignable = 2;
          expr = finishNode(parser, context, iStart, lStart, cStart, {
              type: 'SequenceExpression',
              expressions
          });
      }
      consume(parser, context, 16);
      if (destructible & 16 && destructible & 8)
          report(parser, 145);
      destructible |=
          parser.destructible & 256
              ? 256
              : 0 | (parser.destructible & 128)
                  ? 128
                  : 0;
      if (parser.token === 10) {
          if (destructible & (32 | 16))
              report(parser, 46);
          if (context & (4194304 | 2048) && destructible & 128)
              report(parser, 29);
          if (context & (1024 | 2097152) && destructible & 256) {
              report(parser, 30);
          }
          if (isSimpleParameterList)
              parser.flags |= 128;
          return parseParenthesizedArrow(parser, context, scope, isSequence ? expressions : [expr], canAssign, 0, start, line, column);
      }
      else if (destructible & 8) {
          report(parser, 139);
      }
      parser.destructible = ((parser.destructible | 256) ^ 256) | destructible;
      return context & 128
          ? finishNode(parser, context, piStart, plStart, pcStart, {
              type: 'ParenthesizedExpression',
              expression: expr
          })
          : expr;
  }
  function parseIdentifierOrArrow(parser, context, start, line, column) {
      const { tokenValue } = parser;
      const expr = parseIdentifier(parser, context, 0);
      parser.assignable = 1;
      if (parser.token === 10) {
          let scope = void 0;
          if (context & 64)
              scope = createArrowHeadParsingScope(parser, context, tokenValue);
          parser.flags = (parser.flags | 128) ^ 128;
          return parseArrowFunctionExpression(parser, context, scope, [expr], 0, start, line, column);
      }
      return expr;
  }
  function parseArrowFromIdentifier(parser, context, value, expr, inNew, canAssign, isAsync, start, line, column) {
      if (!canAssign)
          report(parser, 54);
      if (inNew)
          report(parser, 48);
      parser.flags &= ~128;
      const scope = context & 64 ? createArrowHeadParsingScope(parser, context, value) : void 0;
      return parseArrowFunctionExpression(parser, context, scope, [expr], isAsync, start, line, column);
  }
  function parseParenthesizedArrow(parser, context, scope, params, canAssign, isAsync, start, line, column) {
      if (!canAssign)
          report(parser, 54);
      for (let i = 0; i < params.length; ++i)
          reinterpretToPattern(parser, params[i]);
      return parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column);
  }
  function parseArrowFunctionExpression(parser, context, scope, params, isAsync, start, line, column) {
      if (parser.flags & 1)
          report(parser, 45);
      consume(parser, context | 32768, 10);
      context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
      const expression = parser.token !== 2162700;
      let body;
      if (scope && scope.scopeError !== void 0) {
          reportScopeError(scope.scopeError);
      }
      if (expression) {
          body = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      }
      else {
          if (scope)
              scope = addChildScope(scope, 128);
          body = parseFunctionBody(parser, (context | 134221824 | 8192 | 16384) ^
              (134221824 | 8192 | 16384), scope, 16, void 0, void 0);
          switch (parser.token) {
              case 69271571:
                  if ((parser.flags & 1) < 1) {
                      report(parser, 112);
                  }
                  break;
              case 67108877:
              case 67174409:
              case 22:
                  report(parser, 113);
              case 67174411:
                  if ((parser.flags & 1) < 1) {
                      report(parser, 112);
                  }
                  parser.flags |= 1024;
                  break;
          }
          if ((parser.token & 8454144) === 8454144 && (parser.flags & 1) < 1)
              report(parser, 28, KeywordDescTable[parser.token & 255]);
          if ((parser.token & 33619968) === 33619968)
              report(parser, 121);
      }
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'ArrowFunctionExpression',
          params,
          body,
          async: isAsync === 1,
          expression
      });
  }
  function parseFormalParametersOrFormalList(parser, context, scope, inGroup, kind) {
      consume(parser, context, 67174411);
      parser.flags = (parser.flags | 128) ^ 128;
      const params = [];
      if (consumeOpt(parser, context, 16))
          return params;
      context = (context | 134217728) ^ 134217728;
      let isSimpleParameterList = 0;
      while (parser.token !== 18) {
          let left;
          const { tokenPos, linePos, colPos } = parser;
          if (parser.token & 143360) {
              if ((context & 1024) < 1) {
                  if ((parser.token & 36864) === 36864) {
                      parser.flags |= 256;
                  }
                  if ((parser.token & 537079808) === 537079808) {
                      parser.flags |= 512;
                  }
              }
              left = parseAndClassifyIdentifier(parser, context, scope, kind | 1, 0, tokenPos, linePos, colPos);
          }
          else {
              if (parser.token === 2162700) {
                  left = parseObjectLiteralOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
              }
              else if (parser.token === 69271571) {
                  left = parseArrayExpressionOrPattern(parser, context, scope, 1, inGroup, 1, kind, 0, tokenPos, linePos, colPos);
              }
              else if (parser.token === 14) {
                  left = parseSpreadOrRestElement(parser, context, scope, 16, kind, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
              }
              else {
                  report(parser, 28, KeywordDescTable[parser.token & 255]);
              }
              isSimpleParameterList = 1;
              if (parser.destructible & (32 | 16)) {
                  report(parser, 47);
              }
          }
          if (parser.token === 1077936157) {
              nextToken(parser, context | 32768);
              isSimpleParameterList = 1;
              const right = parseExpression(parser, context, 1, 1, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
              left = finishNode(parser, context, tokenPos, linePos, colPos, {
                  type: 'AssignmentPattern',
                  left,
                  right
              });
          }
          params.push(left);
          if (!consumeOpt(parser, context, 18))
              break;
          if (parser.token === 16) {
              break;
          }
      }
      if (isSimpleParameterList)
          parser.flags |= 128;
      if (scope && (isSimpleParameterList || context & 1024) && scope.scopeError !== void 0) {
          reportScopeError(scope.scopeError);
      }
      consume(parser, context, 16);
      return params;
  }
  function parseMembeExpressionNoCall(parser, context, expr, inGroup, start, line, column) {
      const { token } = parser;
      if (token & 67108864) {
          if (token === 67108877) {
              nextToken(parser, context | 1073741824);
              parser.assignable = 1;
              const property = parsePropertyOrPrivatePropertyName(parser, context);
              return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                  type: 'MemberExpression',
                  object: expr,
                  computed: false,
                  property
              }), 0, start, line, column);
          }
          else if (token === 69271571) {
              nextToken(parser, context | 32768);
              const { tokenPos, linePos, colPos } = parser;
              const property = parseExpressions(parser, context, inGroup, 1, tokenPos, linePos, colPos);
              consume(parser, context, 20);
              parser.assignable = 1;
              return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                  type: 'MemberExpression',
                  object: expr,
                  computed: true,
                  property
              }), 0, start, line, column);
          }
          else if (token === 67174408 || token === 67174409) {
              parser.assignable = 2;
              return parseMembeExpressionNoCall(parser, context, finishNode(parser, context, start, line, column, {
                  type: 'TaggedTemplateExpression',
                  tag: expr,
                  quasi: parser.token === 67174408
                      ? parseTemplate(parser, context | 65536, parser.tokenPos, parser.linePos, parser.colPos)
                      : parseTemplateLiteral(parser, context, parser.tokenPos, parser.linePos, parser.colPos)
              }), 0, start, line, column);
          }
      }
      return expr;
  }
  function parseNewExpression(parser, context, inGroup, start, line, column) {
      const id = parseIdentifier(parser, context | 32768, 0);
      const { tokenPos, linePos, colPos } = parser;
      if (consumeOpt(parser, context, 67108877)) {
          if (context & 67108864 && parser.token === 143491) {
              parser.assignable = 2;
              return parseMetaProperty(parser, context, id, start, line, column);
          }
          report(parser, 91);
      }
      parser.assignable = 2;
      if ((parser.token & 16842752) === 16842752) {
          report(parser, 62, KeywordDescTable[parser.token & 255]);
      }
      const expr = parsePrimaryExpression(parser, context, 2, 1, 0, 0, inGroup, 1, tokenPos, linePos, colPos);
      context = (context | 134217728) ^ 134217728;
      if (parser.token === 67108988)
          report(parser, 162);
      const callee = parseMembeExpressionNoCall(parser, context, expr, inGroup, tokenPos, linePos, colPos);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'NewExpression',
          callee,
          arguments: parser.token === 67174411 ? parseArguments(parser, context, inGroup) : []
      });
  }
  function parseMetaProperty(parser, context, meta, start, line, column) {
      const property = parseIdentifier(parser, context, 0);
      return finishNode(parser, context, start, line, column, {
          type: 'MetaProperty',
          meta,
          property
      });
  }
  function parseAsyncArrowAfterIdent(parser, context, canAssign, start, line, column) {
      if (parser.token === 209005)
          report(parser, 29);
      if (context & (1024 | 2097152) && parser.token === 241770) {
          report(parser, 30);
      }
      if ((parser.token & 537079808) === 537079808) {
          parser.flags |= 512;
      }
      return parseArrowFromIdentifier(parser, context, parser.tokenValue, parseIdentifier(parser, context, 0), 0, canAssign, 1, start, line, column);
  }
  function parseAsyncArrowOrCallExpression(parser, context, callee, canAssign, kind, origin, flags, start, line, column) {
      nextToken(parser, context | 32768);
      const scope = context & 64 ? addChildScope(createScope(), 1024) : void 0;
      context = (context | 134217728) ^ 134217728;
      if (consumeOpt(parser, context, 16)) {
          if (parser.token === 10) {
              if (flags & 1)
                  report(parser, 45);
              return parseParenthesizedArrow(parser, context, scope, [], canAssign, 1, start, line, column);
          }
          return finishNode(parser, context, start, line, column, {
              type: 'CallExpression',
              callee,
              arguments: []
          });
      }
      let destructible = 0;
      let expr = null;
      let isSimpleParameterList = 0;
      parser.destructible =
          (parser.destructible | 256 | 128) ^
              (256 | 128);
      const params = [];
      while (parser.token !== 16) {
          const { token, tokenPos, linePos, colPos } = parser;
          if (token & (143360 | 4096)) {
              if (scope)
                  addBlockName(parser, context, scope, parser.tokenValue, kind, 0);
              expr = parsePrimaryExpression(parser, context, kind, 0, 1, 0, 1, 1, tokenPos, linePos, colPos);
              if (parser.token === 16 || parser.token === 18) {
                  if (parser.assignable & 2) {
                      destructible |= 16;
                      isSimpleParameterList = 1;
                  }
                  else if ((token & 537079808) === 537079808) {
                      parser.flags |= 512;
                  }
                  else if ((token & 36864) === 36864) {
                      parser.flags |= 256;
                  }
              }
              else {
                  if (parser.token === 1077936157) {
                      isSimpleParameterList = 1;
                  }
                  else {
                      destructible |= 16;
                  }
                  expr = parseMemberOrUpdateExpression(parser, context, expr, 1, 0, tokenPos, linePos, colPos);
                  if (parser.token !== 16 && parser.token !== 18) {
                      expr = parseAssignmentExpression(parser, context, 1, 0, tokenPos, linePos, colPos, expr);
                  }
              }
          }
          else if (token & 2097152) {
              expr =
                  token === 2162700
                      ? parseObjectLiteralOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos)
                      : parseArrayExpressionOrPattern(parser, context, scope, 0, 1, 0, kind, origin, tokenPos, linePos, colPos);
              destructible |= parser.destructible;
              isSimpleParameterList = 1;
              if (parser.token !== 16 && parser.token !== 18) {
                  if (destructible & 8)
                      report(parser, 118);
                  expr = parseMemberOrUpdateExpression(parser, context, expr, 0, 0, tokenPos, linePos, colPos);
                  destructible |= 16;
                  if ((parser.token & 8454144) === 8454144) {
                      expr = parseBinaryExpression(parser, context, 1, start, line, column, 4, token, expr);
                  }
                  if (consumeOpt(parser, context | 32768, 22)) {
                      expr = parseConditionalExpression(parser, context, expr, start, line, column);
                  }
              }
          }
          else if (token === 14) {
              expr = parseSpreadOrRestElement(parser, context, scope, 16, kind, origin, 1, 1, 0, tokenPos, linePos, colPos);
              destructible |= (parser.token === 16 ? 0 : 16) | parser.destructible;
              isSimpleParameterList = 1;
          }
          else {
              expr = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
              destructible = parser.assignable;
              params.push(expr);
              while (consumeOpt(parser, context | 32768, 18)) {
                  params.push(parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos));
              }
              destructible |= parser.assignable;
              consume(parser, context, 16);
              parser.destructible = destructible | 16;
              parser.assignable = 2;
              return finishNode(parser, context, start, line, column, {
                  type: 'CallExpression',
                  callee,
                  arguments: params
              });
          }
          params.push(expr);
          if (!consumeOpt(parser, context | 32768, 18))
              break;
      }
      consume(parser, context, 16);
      destructible |=
          parser.destructible & 256
              ? 256
              : 0 | (parser.destructible & 128)
                  ? 128
                  : 0;
      if (parser.token === 10) {
          if (destructible & (32 | 16))
              report(parser, 25);
          if (parser.flags & 1 || flags & 1)
              report(parser, 45);
          if (destructible & 128)
              report(parser, 29);
          if (context & (1024 | 2097152) && destructible & 256)
              report(parser, 30);
          if (isSimpleParameterList)
              parser.flags |= 128;
          return parseParenthesizedArrow(parser, context, scope, params, canAssign, 1, start, line, column);
      }
      else if (destructible & 8) {
          report(parser, 59);
      }
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, {
          type: 'CallExpression',
          callee,
          arguments: params
      });
  }
  function parseRegExpLiteral(parser, context, start, line, column) {
      const { tokenRaw, tokenRegExp, tokenValue } = parser;
      nextToken(parser, context);
      parser.assignable = 2;
      return context & 512
          ? finishNode(parser, context, start, line, column, {
              type: 'Literal',
              value: tokenValue,
              regex: tokenRegExp,
              raw: tokenRaw
          })
          : finishNode(parser, context, start, line, column, {
              type: 'Literal',
              value: tokenValue,
              regex: tokenRegExp
          });
  }
  function parseClassDeclaration(parser, context, scope, flags, start, line, column) {
      context = (context | 16777216 | 1024) ^ 16777216;
      let decorators = parseDecorators(parser, context);
      if (decorators.length) {
          start = parser.tokenPos;
          line = parser.linePos;
          column = parser.colPos;
      }
      if (parser.leadingDecorators.length) {
          parser.leadingDecorators.push(...decorators);
          decorators = parser.leadingDecorators;
          parser.leadingDecorators = [];
      }
      nextToken(parser, context);
      let id = null;
      let superClass = null;
      const { tokenValue } = parser;
      if (((parser.token & 4351) ^ 84) >
          4096) {
          if (isStrictReservedWord(parser, context, parser.token)) {
              report(parser, 114);
          }
          if ((parser.token & 537079808) === 537079808) {
              report(parser, 115);
          }
          if (scope) {
              addBlockName(parser, context, scope, tokenValue, 32, 0);
              if (flags) {
                  if (flags & 2) {
                      declareUnboundVariable(parser, tokenValue);
                  }
              }
          }
          id = parseIdentifier(parser, context, 0);
      }
      else {
          if ((flags & 1) < 1)
              report(parser, 37, 'Class');
      }
      let inheritedContext = context;
      if (consumeOpt(parser, context | 32768, 20564)) {
          superClass = parseLeftHandSideExpression(parser, context, 0, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
          inheritedContext |= 524288;
      }
      else {
          inheritedContext = (inheritedContext | 524288) ^ 524288;
      }
      const body = parseClassBody(parser, inheritedContext, context, scope, 2, 8, 0);
      return finishNode(parser, context, start, line, column, context & 1
          ? {
              type: 'ClassDeclaration',
              id,
              superClass,
              decorators,
              body
          }
          : {
              type: 'ClassDeclaration',
              id,
              superClass,
              body
          });
  }
  function parseClassExpression(parser, context, inGroup, start, line, column) {
      let id = null;
      let superClass = null;
      context = (context | 1024 | 16777216) ^ 16777216;
      const decorators = parseDecorators(parser, context);
      if (decorators.length) {
          start = parser.tokenPos;
          line = parser.linePos;
          column = parser.colPos;
      }
      nextToken(parser, context);
      if (((parser.token & 0x10ff) ^ 0x54) > 0x1000) {
          if (isStrictReservedWord(parser, context, parser.token))
              report(parser, 114);
          if ((parser.token & 537079808) === 537079808) {
              report(parser, 115);
          }
          id = parseIdentifier(parser, context, 0);
      }
      let inheritedContext = context;
      if (consumeOpt(parser, context | 32768, 20564)) {
          superClass = parseLeftHandSideExpression(parser, context, 0, inGroup, 0, parser.tokenPos, parser.linePos, parser.colPos);
          inheritedContext |= 524288;
      }
      else {
          inheritedContext = (inheritedContext | 524288) ^ 524288;
      }
      const body = parseClassBody(parser, inheritedContext, context, void 0, 2, 0, inGroup);
      parser.assignable = 2;
      return finishNode(parser, context, start, line, column, context & 1
          ? {
              type: 'ClassExpression',
              id,
              superClass,
              decorators,
              body
          }
          : {
              type: 'ClassExpression',
              id,
              superClass,
              body
          });
  }
  function parseDecorators(parser, context) {
      const list = [];
      if (context & 1) {
          while (parser.token === 130) {
              list.push(parseDecoratorList(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
          }
      }
      return list;
  }
  function parseDecoratorList(parser, context, start, line, column) {
      nextToken(parser, context | 32768);
      let expression = parsePrimaryExpression(parser, context, 2, 0, 1, 0, 0, 1, start, line, column);
      expression = parseMemberOrUpdateExpression(parser, context, expression, 0, 0, start, line, column);
      return finishNode(parser, context, start, line, column, {
          type: 'Decorator',
          expression
      });
  }
  function parseClassBody(parser, context, inheritedContext, scope, kind, origin, inGroup) {
      const { tokenPos, linePos, colPos } = parser;
      consume(parser, context | 32768, 2162700);
      context = (context | 134217728) ^ 134217728;
      parser.flags = (parser.flags | 32) ^ 32;
      const body = [];
      let decorators;
      while (parser.token !== 1074790415) {
          let length = 0;
          decorators = parseDecorators(parser, context);
          length = decorators.length;
          if (length > 0 && parser.tokenValue === 'constructor') {
              report(parser, 106);
          }
          if (parser.token === 1074790415)
              report(parser, 105);
          if (consumeOpt(parser, context, 1074790417)) {
              if (length > 0)
                  report(parser, 116);
              continue;
          }
          body.push(parseClassElementList(parser, context, scope, inheritedContext, kind, decorators, 0, inGroup, parser.tokenPos, parser.linePos, parser.colPos));
      }
      consume(parser, origin & 8 ? context | 32768 : context, 1074790415);
      return finishNode(parser, context, tokenPos, linePos, colPos, {
          type: 'ClassBody',
          body
      });
  }
  function parseClassElementList(parser, context, scope, inheritedContext, type, decorators, isStatic, inGroup, start, line, column) {
      let kind = isStatic ? 32 : 0;
      let key = null;
      const { token, tokenPos, linePos, colPos } = parser;
      if (token & (143360 | 36864)) {
          key = parseIdentifier(parser, context, 0);
          switch (token) {
              case 36969:
                  if (!isStatic && parser.token !== 67174411) {
                      return parseClassElementList(parser, context, scope, inheritedContext, type, decorators, 1, inGroup, start, line, column);
                  }
                  break;
              case 143468:
                  if (parser.token !== 67174411 && (parser.flags & 1) < 1) {
                      if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                          return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                      }
                      kind |= 16 | (optionalBit(parser, context, 8457011) ? 8 : 0);
                  }
                  break;
              case 12399:
                  if (parser.token !== 67174411) {
                      if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                          return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                      }
                      kind |= 256;
                  }
                  break;
              case 12400:
                  if (parser.token !== 67174411) {
                      if (context & 1 && (parser.token & 1073741824) === 1073741824) {
                          return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
                      }
                      kind |= 512;
                  }
                  break;
          }
      }
      else if (token === 69271571) {
          kind |= 2;
          key = parseComputedPropertyName(parser, inheritedContext, inGroup);
      }
      else if ((token & 134217728) === 134217728) {
          key = parseLiteral(parser, context);
      }
      else if (token === 8457011) {
          kind |= 8;
          nextToken(parser, context);
      }
      else if (context & 1 && parser.token === 128) {
          kind |= 4096;
          key = parsePrivateName(parser, context, tokenPos, linePos, colPos);
          context = context | 16384;
      }
      else if (context & 1 && (parser.token & 1073741824) === 1073741824) {
          kind |= 128;
          context = context | 16384;
      }
      else if (token === 119) {
          key = parseIdentifier(parser, context, 0);
          if (parser.token !== 67174411)
              report(parser, 28, KeywordDescTable[parser.token & 255]);
      }
      else {
          report(parser, 28, KeywordDescTable[parser.token & 255]);
      }
      if (kind & (8 | 16 | 768)) {
          if (parser.token & 143360) {
              key = parseIdentifier(parser, context, 0);
          }
          else if ((parser.token & 134217728) === 134217728) {
              key = parseLiteral(parser, context);
          }
          else if (parser.token === 69271571) {
              kind |= 2;
              key = parseComputedPropertyName(parser, context, 0);
          }
          else if (parser.token === 119) {
              key = parseIdentifier(parser, context, 0);
          }
          else if (context & 1 && parser.token === 128) {
              kind |= 4096;
              key = parsePrivateName(parser, context, tokenPos, linePos, colPos);
          }
          else
              report(parser, 131);
      }
      if ((kind & 2) < 1) {
          if (parser.tokenValue === 'constructor') {
              if ((parser.token & 1073741824) === 1073741824) {
                  report(parser, 125);
              }
              else if ((kind & 32) < 1 && parser.token === 67174411) {
                  if (kind & (768 | 16 | 128 | 8)) {
                      report(parser, 50, 'accessor');
                  }
                  else if ((context & 524288) < 1) {
                      if (parser.flags & 32)
                          report(parser, 51);
                      else
                          parser.flags |= 32;
                  }
              }
              kind |= 64;
          }
          else if ((kind & 4096) < 1 &&
              kind & (32 | 768 | 8 | 16) &&
              parser.tokenValue === 'prototype') {
              report(parser, 49);
          }
      }
      if (context & 1 && parser.token !== 67174411) {
          return parseFieldDefinition(parser, context, key, kind, decorators, tokenPos, linePos, colPos);
      }
      const value = parseMethodDefinition(parser, context, kind, inGroup, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, context & 1
          ? {
              type: 'MethodDefinition',
              kind: (kind & 32) < 1 && kind & 64
                  ? 'constructor'
                  : kind & 256
                      ? 'get'
                      : kind & 512
                          ? 'set'
                          : 'method',
              static: (kind & 32) > 0,
              computed: (kind & 2) > 0,
              key,
              decorators,
              value
          }
          : {
              type: 'MethodDefinition',
              kind: (kind & 32) < 1 && kind & 64
                  ? 'constructor'
                  : kind & 256
                      ? 'get'
                      : kind & 512
                          ? 'set'
                          : 'method',
              static: (kind & 32) > 0,
              computed: (kind & 2) > 0,
              key,
              value
          });
  }
  function parsePrivateName(parser, context, start, line, column) {
      nextToken(parser, context);
      const { tokenValue } = parser;
      if (tokenValue === 'constructor')
          report(parser, 124);
      nextToken(parser, context);
      return finishNode(parser, context, start, line, column, {
          type: 'PrivateName',
          name: tokenValue
      });
  }
  function parseFieldDefinition(parser, context, key, state, decorators, start, line, column) {
      let value = null;
      if (state & 8)
          report(parser, 0);
      if (parser.token === 1077936157) {
          nextToken(parser, context | 32768);
          const { tokenPos, linePos, colPos } = parser;
          if (parser.token === 537079925)
              report(parser, 115);
          value = parsePrimaryExpression(parser, context | 16384, 2, 0, 1, 0, 0, 1, tokenPos, linePos, colPos);
          if ((parser.token & 1073741824) !== 1073741824) {
              value = parseMemberOrUpdateExpression(parser, context | 16384, value, 0, 0, tokenPos, linePos, colPos);
              value = parseAssignmentExpression(parser, context | 16384, 0, 0, tokenPos, linePos, colPos, value);
              if (parser.token === 18) {
                  value = parseSequenceExpression(parser, context, 0, start, line, column, value);
              }
          }
      }
      return finishNode(parser, context, start, line, column, {
          type: 'FieldDefinition',
          key,
          value,
          static: (state & 32) > 0,
          computed: (state & 2) > 0,
          decorators
      });
  }
  function parseBindingPattern(parser, context, scope, type, origin, start, line, column) {
      if (parser.token & 143360)
          return parseAndClassifyIdentifier(parser, context, scope, type, origin, start, line, column);
      if ((parser.token & 2097152) !== 2097152)
          report(parser, 28, KeywordDescTable[parser.token & 255]);
      const left = parser.token === 69271571
          ? parseArrayExpressionOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column)
          : parseObjectLiteralOrPattern(parser, context, scope, 1, 0, 1, type, origin, start, line, column);
      if (parser.destructible & 16)
          report(parser, 47);
      if (parser.destructible & 32)
          report(parser, 47);
      return left;
  }
  function parseAndClassifyIdentifier(parser, context, scope, kind, origin, start, line, column) {
      const { tokenValue, token } = parser;
      if (context & 1024) {
          if ((token & 537079808) === 537079808) {
              report(parser, 115);
          }
          else if ((token & 36864) === 36864) {
              report(parser, 114);
          }
      }
      if ((token & 20480) === 20480) {
          report(parser, 99);
      }
      if (context & (2048 | 2097152) && token === 241770) {
          report(parser, 30);
      }
      if (token === 241736) {
          if (kind & (8 | 16))
              report(parser, 97);
      }
      if (context & (4194304 | 2048) && token === 209005) {
          report(parser, 95);
      }
      nextToken(parser, context);
      if (scope)
          addVarOrBlock(parser, context, scope, tokenValue, kind, origin);
      return finishNode(parser, context, start, line, column, {
          type: 'Identifier',
          name: tokenValue
      });
  }
  function parseJSXRootElementOrFragment(parser, context, inJSXChild, start, line, column) {
      nextToken(parser, context);
      if (parser.token === 8456256) {
          return finishNode(parser, context, start, line, column, {
              type: 'JSXFragment',
              openingFragment: parseOpeningFragment(parser, context, start, line, column),
              children: parseJSXChildren(parser, context),
              closingFragment: parseJSXClosingFragment(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos)
          });
      }
      let closingElement = null;
      let children = [];
      const openingElement = parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column);
      if (!openingElement.selfClosing) {
          children = parseJSXChildren(parser, context);
          closingElement = parseJSXClosingElement(parser, context, inJSXChild, parser.tokenPos, parser.linePos, parser.colPos);
          const close = isEqualTagName(closingElement.name);
          if (isEqualTagName(openingElement.name) !== close)
              report(parser, 149, close);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXElement',
          children,
          openingElement,
          closingElement
      });
  }
  function parseOpeningFragment(parser, context, start, line, column) {
      scanJSXToken(parser, context);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXOpeningFragment'
      });
  }
  function parseJSXClosingElement(parser, context, inJSXChild, start, line, column) {
      consume(parser, context, 25);
      const name = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
      if (inJSXChild) {
          consume(parser, context, 8456256);
      }
      else {
          parser.token = scanJSXToken(parser, context);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXClosingElement',
          name
      });
  }
  function parseJSXClosingFragment(parser, context, inJSXChild, start, line, column) {
      consume(parser, context, 25);
      if (inJSXChild) {
          consume(parser, context, 8456256);
      }
      else {
          consume(parser, context, 8456256);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXClosingFragment'
      });
  }
  function parseJSXChildren(parser, context) {
      const children = [];
      while (parser.token !== 25) {
          parser.index = parser.tokenPos = parser.startPos;
          parser.column = parser.colPos = parser.startColumn;
          parser.line = parser.linePos = parser.startLine;
          scanJSXToken(parser, context);
          children.push(parseJSXChild(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
      }
      return children;
  }
  function parseJSXChild(parser, context, start, line, column) {
      if (parser.token === 135)
          return parseJSXText(parser, context, start, line, column);
      if (parser.token === 2162700)
          return parseJSXExpressionContainer(parser, context, 0, 0, start, line, column);
      if (parser.token === 8456255)
          return parseJSXRootElementOrFragment(parser, context, 0, start, line, column);
      report(parser, 0);
  }
  function parseJSXText(parser, context, start, line, column) {
      scanJSXToken(parser, context);
      const node = {
          type: 'JSXText',
          value: parser.tokenValue
      };
      if (context & 512) {
          node.raw = parser.tokenRaw;
      }
      return finishNode(parser, context, start, line, column, node);
  }
  function parseJSXOpeningFragmentOrSelfCloseElement(parser, context, inJSXChild, start, line, column) {
      if ((parser.token & 143360) !== 143360 && (parser.token & 4096) !== 4096)
          report(parser, 0);
      const tagName = parseJSXElementName(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
      const attributes = parseJSXAttributes(parser, context);
      const selfClosing = parser.token === 8457013;
      if (parser.token === 8456256) {
          scanJSXToken(parser, context);
      }
      else {
          consume(parser, context, 8457013);
          if (inJSXChild) {
              consume(parser, context, 8456256);
          }
          else {
              scanJSXToken(parser, context);
          }
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXOpeningElement',
          name: tagName,
          attributes,
          selfClosing
      });
  }
  function parseJSXElementName(parser, context, start, line, column) {
      scanJSXIdentifier(parser);
      let key = parseJSXIdentifier(parser, context, start, line, column);
      if (parser.token === 21)
          return parseJSXNamespacedName(parser, context, key, start, line, column);
      while (consumeOpt(parser, context, 67108877)) {
          scanJSXIdentifier(parser);
          key = parseJSXMemberExpression(parser, context, key, start, line, column);
      }
      return key;
  }
  function parseJSXMemberExpression(parser, context, object, start, line, column) {
      const property = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXMemberExpression',
          object,
          property
      });
  }
  function parseJSXAttributes(parser, context) {
      const attributes = [];
      while (parser.token !== 8457013 && parser.token !== 8456256 && parser.token !== 1048576) {
          attributes.push(parseJsxAttribute(parser, context, parser.tokenPos, parser.linePos, parser.colPos));
      }
      return attributes;
  }
  function parseJSXSpreadAttribute(parser, context, start, line, column) {
      nextToken(parser, context);
      consume(parser, context, 14);
      const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context, 1074790415);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXSpreadAttribute',
          argument: expression
      });
  }
  function parseJsxAttribute(parser, context, start, line, column) {
      if (parser.token === 2162700)
          return parseJSXSpreadAttribute(parser, context, start, line, column);
      scanJSXIdentifier(parser);
      let value = null;
      let name = parseJSXIdentifier(parser, context, start, line, column);
      if (parser.token === 21) {
          name = parseJSXNamespacedName(parser, context, name, start, line, column);
      }
      if (parser.token === 1077936157) {
          const token = scanJSXAttributeValue(parser, context);
          const { tokenPos, linePos, colPos } = parser;
          switch (token) {
              case 134283267:
                  value = parseLiteral(parser, context);
                  break;
              case 8456255:
                  value = parseJSXRootElementOrFragment(parser, context, 1, tokenPos, linePos, colPos);
                  break;
              case 2162700:
                  value = parseJSXExpressionContainer(parser, context, 1, 1, tokenPos, linePos, colPos);
                  break;
              default:
                  report(parser, 148);
          }
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXAttribute',
          value,
          name
      });
  }
  function parseJSXNamespacedName(parser, context, namespace, start, line, column) {
      consume(parser, context, 21);
      const name = parseJSXIdentifier(parser, context, parser.tokenPos, parser.linePos, parser.colPos);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXNamespacedName',
          namespace,
          name
      });
  }
  function parseJSXExpressionContainer(parser, context, inJSXChild, isAttr, start, line, column) {
      nextToken(parser, context);
      const { tokenPos, linePos, colPos } = parser;
      if (parser.token === 14)
          return parseJSXSpreadChild(parser, context, tokenPos, linePos, colPos);
      let expression = null;
      if (parser.token === 1074790415) {
          if (isAttr)
              report(parser, 151);
          expression = parseJSXEmptyExpression(parser, context, parser.startPos, parser.startLine, parser.startColumn);
      }
      else {
          expression = parseExpression(parser, context, 1, 0, 0, tokenPos, linePos, colPos);
      }
      if (inJSXChild) {
          consume(parser, context, 1074790415);
      }
      else {
          scanJSXToken(parser, context);
      }
      return finishNode(parser, context, start, line, column, {
          type: 'JSXExpressionContainer',
          expression
      });
  }
  function parseJSXSpreadChild(parser, context, start, line, column) {
      consume(parser, context, 14);
      const expression = parseExpression(parser, context, 1, 0, 0, parser.tokenPos, parser.linePos, parser.colPos);
      consume(parser, context, 1074790415);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXSpreadChild',
          expression
      });
  }
  function parseJSXEmptyExpression(parser, context, start, line, column) {
      parser.startPos = parser.tokenPos;
      parser.startLine = parser.linePos;
      parser.startColumn = parser.colPos;
      return finishNode(parser, context, start, line, column, {
          type: 'JSXEmptyExpression'
      });
  }
  function parseJSXIdentifier(parser, context, start, line, column) {
      const { tokenValue } = parser;
      nextToken(parser, context);
      return finishNode(parser, context, start, line, column, {
          type: 'JSXIdentifier',
          name: tokenValue
      });
  }

  var estree = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  var version = "3.1.6";

  const version$1 = version;
  function parseScript(source, options) {
      return parseSource(source, options, 0);
  }
  function parseModule(source, options) {
      return parseSource(source, options, 1024 | 2048);
  }
  function parse(source, options) {
      return parseSource(source, options, 0);
  }

  exports.ESTree = estree;
  exports.parse = parse;
  exports.parseModule = parseModule;
  exports.parseScript = parseScript;
  exports.version = version$1;

  Object.defineProperty(exports, '__esModule', { value: true });

});
