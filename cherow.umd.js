(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.kleuver = {}));
}(this, function (exports) { 'use strict';

  const errorMessages = {
      [0]: 'Unexpected token',
      [29]: "Unexpected token '%0'",
      [1]: 'Octal escape sequences are not allowed in strict mode',
      [2]: 'Octal escape sequences are not allowed in template strings',
      [3]: 'Unexpected token `#`',
      [4]: 'Invalid Unicode escape sequence',
      [5]: 'Invalid code point %0',
      [6]: 'Invalid hexadecimal escape sequence',
      [8]: 'Octal literals are not allowed in strict mode',
      [7]: 'Decimal integer literals with a leading zero are forbidden in strict mode',
      [9]: 'Expected number in radix %0',
      [10]: 'Non-number found after exponent indicator',
      [11]: 'Invalid BigIntLiteral',
      [12]: 'No identifiers allowed directly after numeric literal',
      [13]: 'Escapes \\8 or \\9 are not syntactically valid escapes',
      [14]: 'Unterminated string literal',
      [15]: 'Unterminated template literal',
      [16]: 'Multiline comment was not closed properly',
      [17]: 'The identifier contained dynamic unicode escape that was not closed',
      [18]: "Illegal character '%0'",
      [19]: 'Missing hex digits',
      [20]: 'Invalid implicit octal',
      [21]: 'Invalid line break in string literal',
      [22]: 'Only unicode escapes are legal in identifier names',
      [23]: "Expected '%0'",
      [24]: 'Invalid left-hand side in assignment',
      [25]: 'Invalid left-hand side in async arrow',
      [26]: 'Only the right-hand side is destructible. The left-hand side is invalid',
      [27]: 'Calls to super must be in the "constructor" method of a class expression or class declaration that has a superclass',
      [28]: 'Member access on super must be in a method',
      [30]: 'Await expression not allowed in formal parameter',
      [31]: 'Yield expression not allowed in formal parameter',
      [32]: 'Unary expressions as the left operand of an exponentation expression must be disambiguated with parentheses',
      [33]: 'Unterminated regular expression',
      [34]: 'Unexpected regular expression flag',
      [35]: "Duplicate regular expression flag '%0'",
      [36]: '%0 functions must have exactly %1 argument%2',
      [37]: 'Setter function argument must not be a rest parameter',
      [38]: '%0 declaration must have a name in this context',
      [39]: 'Function name may not be eval or arguments in strict mode',
      [40]: 'The rest operator is missing an argument',
      [41]: 'Cannot assign to lhs, not destructible with this initializer',
      [42]: 'A getter cannot be a generator',
      [43]: 'A computed property name must be followed by a colon or paren',
      [45]: 'Found `* async x(){}` but this should be `async * x(){}`',
      [44]: 'Getters and setters can not be generators',
      [46]: "'%0' can not be generator method",
      [47]: "No line break is allowed after '=>'",
      [48]: 'Illegal async arrow function parameter list',
      [49]: 'The left hand side of the arrow can only be destructed through assignment',
      [50]: 'The binding declaration is not destructible',
      [51]: 'Invalid non-destructible binding in function parameters',
      [52]: 'Invalid async arrow',
      [53]: "Classes may not have a static property named 'prototype'",
      [54]: 'Class constructor may not be a %0',
      [55]: 'Duplicate constructor method in class',
      [56]: 'Increment/decrement target must be an identifier or member expression',
      [57]: 'Invalid use of `new` keyword on an increment/decrement expression',
      [58]: '`=>` is an invalid assignment target',
      [59]: 'Rest element may not have a trailing comma',
      [60]: 'Destructuring declarations %0 must have an initializer',
      [61]: "'for-%0' loop head declarations can not have an initializer",
      [62]: 'Invalid left-hand side in for-%0 loop: Must have a single binding',
      [63]: 'Invalid shorthand property initializer',
      [64]: 'Duplicate __proto__ fields are not allowed in object literals',
      [65]: 'Let is disallowed as a lexically bound name',
      [66]: "Invalid use of '%0' inside new expression",
      [67]: "Illegal 'use strict' directive in function with non-simple parameter list",
      [68]: 'Let binding missing binding names',
      [69]: 'Illegal continue statement',
      [70]: 'Illegal break statement',
      [71]: 'Cannot have `let[...]` as a var name in strict mode',
      [72]: 'Cannot compound-assign to an array literal',
      [73]: 'Cannot compound-assign to an object literal',
      [74]: 'Invalid destructuring assignment target',
      [75]: 'The rest argument of an object binding pattern must always be a simple ident and not an array pattern',
      [76]: 'Rest parameter may not have a default initializer',
      [77]: 'The rest argument was not destructible as it must be last and can not have a trailing comma',
      [78]: 'The rest argument must the be last parameter',
      [79]: 'The ... argument must be destructible in an arrow header, found something that was not destructible',
      [80]: 'Cannot set a default on a rest value',
      [81]: 'The arguments of an arrow cannot contain a yield expression in their defaults',
      [82]: 'Cannot assign to list of expressions in a group',
      [83]: 'In strict mode code, functions can only be declared at top level or inside a block',
      [84]: 'In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement',
      [85]: 'Without web compability enabled functions can not be declared at top level, inside a block, or as the body of an if statement',
      [86]: "Class declaration can't appear in single-statement context",
      [87]: "'await' may not be used as an identifier in this context",
      [88]: 'Left-hand side of the for-%0 loop must be assignable',
      [89]: '`for await` only accepts the `for-of` type',
      [90]: 'The first token after the template expression should be a continuation of the template',
      [92]: '`let` declaration not allowed here and `let` cannot be a regular var name in strict mode',
      [91]: '`let \n [` is a restricted production at the start of a statement',
      [93]: 'Catch clause requires exactly one parameter, not more (and no trailing comma)',
      [94]: 'Catch clause parameter does not support default values',
      [95]: 'Missing catch or finally after try',
      [96]: 'More than one default clause in switch statement',
      [97]: 'Illegal newline after throw',
      [98]: 'Strict mode code may not include a with statement'
  };
  class ParseError extends SyntaxError {
      constructor(index, line, column, source, type, ...params) {
          let message = errorMessages[type].replace(/%(\d+)/g, (_, i) => params[i]) + ' (' + line + ':' + column + ')';
          const lines = source.split('\n');
          message = message + '\n' + lines[line - 1] + '\n';
          for (let i = 0; i < column; i++) {
              message += ' ';
          }
          message += '^\n';
          super(`${message}`);
          this.index = index;
          this.line = line;
          this.column = column;
          this.description = message;
      }
  }
  function report(state, type, ...params) {
      throw new ParseError(state.index, state.line, state.column, state.source, type, ...params);
  }
  function reportAt(state, index, line, column, type, ...params) {
      throw new ParseError(index, line, column, state.source, type, ...params);
  }

  const DO_NOT_BIND = { var: {}, lexvar: {}, lex: { '#': undefined, type: 1 } };
  const CHECK_DUPE_BINDS = false;
  function createScope(type) {
      let scoop = {
          var: {},
          lexvar: {},
          lex: {
              '#': undefined,
              type,
              funcs: {}
          }
      };
      return scoop;
  }
  function SCOPE_addLexTo(scoop, scopeType) {
      let scoop2 = {
          var: scoop.var,
          lexvar: {
              '#': scoop.lexvar
          },
          lex: {
              '#': scoop.lex,
              type: scopeType,
              funcs: []
          }
      };
      return scoop2;
  }
  function SCOPE_addBinding(state, context, scope, name, type, dupeChecks) {
      if (scope === DO_NOT_BIND)
          return;
      let hashed = '#' + name;
      if (type === 4) {
          let lex = scope.lex;
          do {
              let type = lex.type;
              if (lex[hashed] !== undefined) {
                  if (type === 1) ;
                  else if (type === 1) {
                      report(state, 29, 'Tried to define a var which was already bound as a let/const inside a for-header, which is explicitly illegal');
                  }
                  else if (type === 1) {
                      if (SCOPE_isDupeLexBindingError(context, scope, hashed) === true) {
                          report(state, 29, 'Tried to define a var which was already bound as a lexical binding');
                      }
                  }
              }
              lex = lex['#'];
          } while (lex);
          let x = scope.var[hashed];
          if (x === undefined)
              x = 1;
          else
              ++x;
          scope.var[hashed] = x;
          let lexvar = scope.lexvar;
          do {
              lexvar[hashed] = true;
              lexvar = lexvar['#'];
          } while (lexvar);
      }
      else {
          let lex = scope.lex;
          if (dupeChecks === CHECK_DUPE_BINDS) {
              SCOPE_lexParentDupeCheck(state, context, scope, hashed);
              if (lex[hashed] !== undefined) {
                  if (SCOPE_isDupeLexBindingError(context, scope, hashed) === true) ;
              }
          }
          let x = lex[hashed];
          if (x === undefined)
              x = 1;
          else if (dupeChecks === CHECK_DUPE_BINDS) {
              if (SCOPE_isDupeLexBindingError(context, scope, hashed) === true) ;
          }
          else
              ++x;
          lex[hashed] = x;
      }
  }
  function SCOPE_lexParentDupeCheck(state, context, scope, hashed) {
      let lex = scope.lex;
      let lexParent = lex['#'];
      if (lexParent !== undefined) {
          if (lexParent.type === 1 && lexParent[hashed] !== undefined) ;
          if (lexParent.type === 1 && lexParent[hashed] !== undefined) ;
      }
      if (scope.lexvar[hashed] !== undefined) {
          if (SCOPE_isDupeLexBindingError(context, scope, hashed) === true) {
              report(state, 29, 'Cannot create lexical binding when the name was already `var` bound');
          }
      }
  }
  function SCOPE_isDupeLexBindingError(context, scoop, hashed) {
      if ((context & 256) === 0)
          return true;
      if (SCOPE_isFuncDeclOnly(scoop, hashed) === false)
          return true;
      if (context & 1024)
          return true;
      return false;
  }
  function SCOPE_isFuncDeclOnly(scoop, hashed) {
      return scoop.lex.funcs[hashed] === true;
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
      'enum', 'eval', 'arguments', 'escaped reserved', 'escaped future reserved', 'reserved if strict', '#',
      'BigIntLiteral'
  ];
  const descKeywordTable = Object.create(null, {
      this: { value: 86110 },
      function: { value: 86103 },
      if: { value: 20568 },
      return: { value: 20571 },
      var: { value: 1073827911 },
      else: { value: 20562 },
      for: { value: 20566 },
      new: { value: 86106 },
      in: { value: 16865073 },
      typeof: { value: 33640490 },
      while: { value: 20577 },
      case: { value: 20555 },
      break: { value: 20554 },
      try: { value: 20576 },
      catch: { value: 20556 },
      delete: { value: 33640491 },
      throw: { value: 86111 },
      switch: { value: 86109 },
      continue: { value: 20558 },
      default: { value: 20560 },
      instanceof: { value: 16865074 },
      do: { value: 20561 },
      void: { value: 33640492 },
      finally: { value: 20565 },
      async: { value: 159852 },
      await: { value: 225389 },
      class: { value: 86093 },
      const: { value: 1073827913 },
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
      let: { value: 1073999944 },
      null: { value: 86023 },
      of: { value: 12402 },
      package: { value: 36965 },
      private: { value: 36966 },
      protected: { value: 36967 },
      public: { value: 36968 },
      set: { value: 12400 },
      static: { value: 192617 },
      super: { value: 86108 },
      true: { value: 86022 },
      with: { value: 20578 },
      yield: { value: 258154 },
      enum: { value: 159859 },
      eval: { value: 225396 },
      as: { value: 12395 },
      arguments: { value: 225397 },
  });

  function fromCodePoint(code) {
      if (code > 0xffff) {
          return String.fromCharCode(code >>> 10) + String.fromCharCode(code & 0x3ff);
      }
      else {
          return String.fromCharCode(code);
      }
  }
  function consumeSemicolon(state, context) {
      if (consumeOpt(state, context, 17) ||
          state.flags & 1 ||
          (state.token === 0 || state.token === 15)) {
          return;
      }
      report(state, 29, KeywordDescTable[state.token & 255]);
  }
  function optionalBit(state, context, t) {
      if (state.token === t) {
          nextToken(state, context);
          return 1;
      }
      return 0;
  }
  function consumeOpt(state, context, token) {
      if (state.token !== token) {
          return false;
      }
      nextToken(state, context);
      return true;
  }
  function consume(state, context, token) {
      if (state.token !== token) {
          report(state, 23, KeywordDescTable[token & 255]);
      }
      nextToken(state, context);
  }
  function reinterpretToPattern(state, node) {
      switch (node.type) {
          case 'ArrayExpression':
              node.type = 'ArrayPattern';
              let elements = node.elements;
              for (let i = 0, n = elements.length; i < n; ++i) {
                  let element = elements[i];
                  if (element)
                      reinterpretToPattern(state, element);
              }
              return;
          case 'ObjectExpression':
              node.type = 'ObjectPattern';
              let properties = node.properties;
              for (let i = 0, n = properties.length; i < n; ++i) {
                  reinterpretToPattern(state, properties[i]);
              }
              return;
          case 'AssignmentExpression':
              node.type = 'AssignmentPattern';
              if (node.operator !== '=')
                  report(state, 74);
              delete node.operator;
              reinterpretToPattern(state, node.left);
              return;
          case 'Property':
              reinterpretToPattern(state, node.value);
              return;
          case 'SpreadElement':
              node.type = 'RestElement';
              reinterpretToPattern(state, node.argument);
          default:
      }
  }
  function validateIdentifier(state, context, type, token) {
      if (context & 1024 && token === 159862) {
          report(state, 0, 'asdf');
      }
      if (token === 159862) {
          report(state, 0, 'asdf');
      }
      if (context & 1024 && token === 192617) {
          report(state, 0, 'asdf');
      }
      if ((token & 12288) === 12288) {
          if (token === 225389) {
              if (context & (4194304 | 2048)) {
                  report(state, 0, 'asdf');
              }
              state.flags |= 2;
              state.assignable = 2;
          }
          else if (token === 258154) {
              if (context & (2097152 | 1024)) {
                  report(state, 0, 'asdf');
              }
          }
          else if (token === 1073999944) {
              if (type & 32)
                  report(state, 0, 'asdf');
              if (type & (8 | 16))
                  report(state, 65);
              if (context & 1024) {
                  report(state, 0, 'asdf');
              }
          }
          else if (token === 159859) {
              report(state, 0, 'asdf');
          }
      }
      else if ((token & 36864) === 36864) {
          if (context & 1024) {
              report(state, 0, 'asdf');
          }
      }
      else if ((token & 20480) === 20480) {
          report(state, 0, 'asdf');
      }
      else {
          state.assignable = 1;
      }
  }

  const AsciiLookup = new Int8Array(0x80)
      .fill(256, 0x27, 0x28)
      .fill(256, 0x22, 0x23)
      .fill(640, 0x20, 0x21)
      .fill(640, 0x9, 0xA)
      .fill(640, 0xB, 0xC)
      .fill(128, 0xD, 0xE)
      .fill(640, 0xC, 0xD)
      .fill(128, 0xA, 0xB)
      .fill(32, 0x2B, 0x2C)
      .fill(32, 0x2D, 0x2E)
      .fill(3, 0x24, 0x25)
      .fill(64, 0x5C, 0x5D)
      .fill(4, 0x30, 0x3a)
      .fill(3 | 16, 0x41, 0x5b)
      .fill(3, 0x5f, 0x60)
      .fill(3 | 8, 0x61, 0x7b);

  function nextChar(state) {
      state.column++;
      state.currentChar = state.source.charCodeAt(++state.index);
  }
  function getMostLikelyUnicodeChar(state) {
      state.currentChar = state.source.charCodeAt(state.index++);
      if (state.currentChar >= 0xd800 && state.currentChar <= 0xdbff) {
          const lo = state.source.charCodeAt(state.index);
          if (lo >= 0xdc00 && lo <= 0xdfff) {
              state.currentChar = ((state.currentChar & 0x3ff) << 10) | (lo & 0x3ff) | 0x10000;
              state.index++;
          }
      }
      state.column++;
  }
  function isExoticWhiteSpace(code) {
      return (code === 160 ||
          code === 133 ||
          code === 5760 ||
          (code >= 8192 && code <= 8203) ||
          code === 8239 ||
          code === 8287 ||
          code === 12288 ||
          code === 65519);
  }
  function toHex(code) {
      if (code < 48)
          return -1;
      if (code <= 57)
          return code - 48;
      let lowerCasedLetter = code | 32;
      if (lowerCasedLetter < 97)
          return -1;
      if (lowerCasedLetter <= 102)
          return lowerCasedLetter - 97 + 10;
      return -1;
  }
  function fromCodePoint$1(code) {
      if (code > 0xffff) {
          return String.fromCharCode(code >>> 10) + String.fromCharCode(code & 0x3ff);
      }
      else {
          return String.fromCharCode(code);
      }
  }

  function isIdentifierPart(code) {
      return (unicodeLookup[(code >>> 5) + 0] >>> code & 31 & 1) !== 0;
  }
  function isIdentifierStart(code) {
      return (unicodeLookup[(code >>> 5) + 34816] >>> code & 31 & 1) !== 0;
  }
  const unicodeLookup = ((compressed, lookup) => {
      const result = new Uint32Array(104448);
      let index = 0;
      let subIndex = 0;
      while (index < 3460) {
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
  })([-1, 2, 27, 2, 28, 2, 5, -1, 0, 77595648, 3, 46, 2, 3, 0, 14, 2, 57, 2, 58, 3, 0, 3, 0, 3168796671, 0, 4294956992, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966523, 3, 0, 4, 2, 16, 2, 60, 2, 0, 0, 4294836735, 0, 3221225471, 0, 4294901942, 2, 61, 0, 134152192, 3, 0, 2, 0, 4294951935, 3, 0, 2, 0, 2683305983, 0, 2684354047, 2, 17, 2, 0, 0, 4294961151, 3, 0, 2, 2, 20, 2, 0, 0, 608174079, 2, 0, 2, 128, 2, 6, 2, 62, -1, 2, 64, 2, 25, 2, 1, 3, 0, 3, 0, 4294901711, 2, 41, 0, 4089839103, 0, 2961209759, 0, 1342439375, 0, 4294543342, 0, 3547201023, 0, 1577204103, 0, 4194240, 0, 4294688750, 2, 2, 0, 80831, 0, 4261478351, 0, 4294549486, 2, 2, 0, 2965387679, 0, 196559, 0, 3594373100, 0, 3288319768, 0, 8469959, 2, 192, 0, 4294828031, 0, 3825204735, 0, 123747807, 0, 65487, 2, 3, 0, 4092591615, 0, 1080049119, 0, 458703, 2, 3, 2, 0, 0, 2163244511, 0, 4227923919, 0, 4236247020, 2, 69, 0, 4284449919, 0, 851904, 2, 4, 2, 11, 0, 67076095, -1, 2, 70, 0, 1073741743, 0, 4093591391, -1, 0, 50331649, 0, 3265266687, 2, 35, 0, 4294844415, 0, 4278190047, 2, 22, 2, 126, -1, 3, 0, 2, 2, 32, 2, 0, 2, 9, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 72, 2, 0, 2, 73, 2, 74, 2, 75, 2, 0, 2, 76, 2, 0, 2, 10, 0, 261632, 2, 19, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 77, 2, 5, 3, 0, 2, 2, 78, 0, 2088959, 2, 30, 2, 8, 0, 909311, 3, 0, 2, 0, 814743551, 2, 43, 0, 67057664, 3, 0, 2, 2, 42, 2, 0, 2, 31, 2, 0, 2, 18, 2, 7, 0, 268374015, 2, 29, 2, 51, 2, 0, 2, 79, 0, 134153215, -1, 2, 6, 2, 0, 2, 7, 0, 2684354559, 0, 67044351, 0, 1073676416, -2, 3, 0, 2, 2, 44, 0, 1046528, 3, 0, 3, 2, 8, 2, 0, 2, 52, 0, 4294960127, 2, 9, 2, 40, 2, 10, 0, 4294377472, 2, 11, 3, 0, 7, 0, 4227858431, 3, 0, 8, 2, 12, 2, 0, 2, 81, 2, 9, 2, 0, 2, 82, 2, 83, 2, 84, -1, 2, 122, 0, 1048577, 2, 85, 2, 13, -1, 2, 13, 0, 131042, 2, 86, 2, 87, 2, 88, 2, 0, 2, 36, -83, 2, 0, 2, 54, 2, 7, 3, 0, 4, 0, 1046559, 2, 0, 2, 14, 2, 0, 0, 2147516671, 2, 23, 3, 89, 2, 2, 0, -16, 2, 90, 0, 524222462, 2, 4, 2, 0, 0, 4269801471, 2, 4, 2, 0, 2, 15, 2, 80, 2, 16, 3, 0, 2, 2, 49, 2, 11, -1, 2, 17, -16, 3, 0, 205, 2, 18, -2, 3, 0, 655, 2, 19, 3, 0, 36, 2, 71, -1, 2, 17, 2, 9, 3, 0, 8, 2, 92, 2, 119, 2, 0, 0, 3220242431, 3, 0, 3, 2, 20, 2, 21, 2, 93, 3, 0, 2, 2, 94, 2, 0, 2, 95, 2, 21, 2, 0, 2, 26, 2, 0, 2, 8, 3, 0, 2, 0, 67043391, 0, 3909091327, 2, 0, 2, 24, 2, 8, 2, 22, 3, 0, 2, 0, 67076097, 2, 7, 2, 0, 2, 23, 0, 67059711, 0, 4236247039, 3, 0, 2, 0, 939524103, 0, 8191999, 2, 98, 2, 99, 2, 15, 2, 33, 3, 0, 3, 0, 67057663, 3, 0, 349, 2, 100, 2, 101, 2, 6, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 34, -1, 0, 3774349439, 2, 102, 2, 103, 3, 0, 2, 2, 20, 2, 25, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 47, 2, 0, 2, 26, 2, 104, 2, 19, 0, 1638399, 2, 172, 2, 105, 3, 0, 3, 2, 22, 2, 27, 2, 28, 2, 5, 2, 29, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 30, -3, 2, 150, -4, 2, 22, 2, 0, 2, 38, 0, 1, 2, 0, 2, 63, 2, 31, 2, 11, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 32, 2, 111, 2, 6, 2, 0, 2, 33, 2, 0, 2, 50, -4, 3, 0, 9, 2, 23, 2, 18, 2, 26, -4, 2, 112, 2, 113, 2, 18, 2, 23, 2, 7, -2, 2, 114, 2, 18, 2, 34, -2, 2, 0, 2, 115, -2, 0, 4277137519, 0, 2269118463, -1, 3, 22, 2, -1, 2, 35, 2, 39, 2, 0, 3, 18, 2, 2, 37, 2, 20, -3, 3, 0, 2, 2, 36, -1, 2, 0, 2, 37, 2, 0, 2, 37, 2, 0, 2, 48, -14, 2, 22, 2, 45, 2, 38, -4, 2, 23, 3, 0, 2, 2, 39, 0, 2147549120, 2, 0, 2, 11, 2, 17, 2, 134, 2, 0, 2, 53, 0, 4294901872, 0, 5242879, 3, 0, 2, 0, 402595359, -1, 2, 118, 0, 1090519039, -2, 2, 120, 2, 40, 2, 0, 0, 67045375, 2, 41, 0, 4226678271, 0, 3766565279, 0, 2039759, -4, 3, 0, 2, 0, 3288270847, -1, 3, 0, 2, 0, 67043519, -5, 2, 0, 0, 4282384383, 0, 1056964609, -1, 3, 0, 2, 0, 67043345, -1, 2, 0, 2, 42, 2, 43, -1, 2, 10, 2, 44, -6, 2, 0, 2, 11, -3, 3, 0, 2, 0, 2147484671, -5, 2, 123, 0, 4244635647, 0, 27, 2, 0, 2, 7, 2, 45, 2, 0, 2, 65, -1, 2, 0, 2, 42, -8, 2, 55, 2, 46, 0, 67043329, 2, 124, 2, 47, 0, 8388351, -2, 2, 125, 0, 3028287487, 2, 48, 2, 127, 0, 33259519, 2, 43, -9, 2, 23, -8, 3, 0, 28, 2, 34, -3, 3, 0, 3, 2, 49, 3, 0, 6, 2, 50, -85, 3, 0, 33, 2, 49, -126, 3, 0, 18, 2, 39, -269, 3, 0, 17, 2, 42, 2, 7, 2, 43, -2, 2, 17, 2, 51, 2, 0, 2, 23, 0, 67043343, 2, 129, 2, 19, -21, 3, 0, 2, -4, 3, 0, 2, 0, 4294936575, 2, 0, 0, 4294934783, -2, 2, 130, 3, 0, 191, 2, 52, 3, 0, 23, 2, 37, -296, 3, 0, 8, 2, 7, -1, 2, 131, 2, 132, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 133, 0, 1677656575, -166, 0, 4161266656, 0, 4071, 0, 15360, -4, 0, 28, -13, 3, 0, 2, 2, 53, 2, 0, 2, 135, 2, 136, 2, 56, 2, 0, 2, 137, 2, 138, 2, 139, 3, 0, 10, 2, 140, 2, 141, 2, 15, 3, 53, 2, 3, 54, 2, 3, 55, 2, 0, 4294954999, 2, 0, -16, 2, 0, 2, 91, 2, 0, 0, 2105343, 0, 4160749584, 0, 65534, -42, 0, 4194303871, 0, 2011, -6, 2, 0, 0, 1073684479, 0, 17407, -11, 2, 0, 2, 34, -40, 3, 0, 6, 0, 8323103, -1, 3, 0, 2, 2, 44, -37, 2, 56, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -138, 3, 0, 1334, 2, 23, -1, 3, 0, 129, 2, 30, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -22583, 3, 0, 7, 2, 19, -6130, 3, 5, 2, -1, 0, 69207040, 3, 46, 2, 3, 0, 14, 2, 57, 2, 58, -3, 0, 3168731136, 0, 4294956864, 2, 1, 2, 0, 2, 59, 3, 0, 4, 0, 4294966275, 3, 0, 4, 2, 16, 2, 60, 2, 0, 2, 36, -1, 2, 17, 2, 61, -1, 2, 0, 2, 62, 0, 4294885376, 3, 0, 2, 0, 3145727, 0, 2617294944, 0, 4294770688, 2, 19, 2, 63, 3, 0, 2, 0, 131135, 2, 96, 0, 70256639, 0, 71303167, 0, 272, 2, 42, 2, 62, -1, 2, 64, -2, 2, 97, 2, 65, 0, 4278255616, 0, 4294836227, 0, 4294549473, 0, 600178175, 0, 2952806400, 0, 268632067, 0, 4294543328, 0, 57540095, 0, 1577058304, 0, 1835008, 0, 4294688736, 2, 66, 2, 67, 0, 33554435, 2, 121, 2, 66, 2, 151, 0, 131075, 0, 3594373096, 0, 67094296, 2, 67, -1, 2, 68, 0, 603979263, 2, 160, 0, 3, 0, 4294828001, 0, 602930687, 2, 181, 0, 393219, 2, 68, 0, 671088639, 0, 2154840064, 0, 4227858435, 0, 4236247008, 2, 69, 2, 39, -1, 2, 4, 0, 917503, 2, 39, -1, 2, 70, 0, 537788335, 0, 4026531935, -1, 0, 1, -1, 2, 35, 2, 71, 0, 7936, -3, 2, 0, 0, 2147485695, 0, 1010761728, 0, 4292984930, 0, 16387, 2, 0, 2, 14, 2, 15, 3, 0, 10, 2, 72, 2, 0, 2, 73, 2, 74, 2, 75, 2, 0, 2, 76, 2, 0, 2, 11, -1, 2, 19, 3, 0, 2, 2, 12, 2, 4, 3, 0, 18, 2, 77, 2, 5, 3, 0, 2, 2, 78, 0, 253951, 3, 20, 2, 0, 122879, 2, 0, 2, 8, 0, 276824064, -2, 3, 0, 2, 2, 42, 2, 0, 0, 4294903295, 2, 0, 2, 18, 2, 7, -1, 2, 17, 2, 51, 2, 0, 2, 79, 2, 43, -1, 2, 23, 2, 0, 2, 30, -2, 0, 128, -2, 2, 80, 2, 8, 0, 4064, -1, 2, 117, 0, 4227907585, 2, 0, 2, 116, 2, 0, 2, 50, 0, 4227915776, 2, 9, 2, 40, 2, 10, -1, 0, 74440192, 3, 0, 6, -2, 3, 0, 8, 2, 12, 2, 0, 2, 81, 2, 9, 2, 0, 2, 82, 2, 83, 2, 84, -3, 2, 85, 2, 13, -3, 2, 86, 2, 87, 2, 88, 2, 0, 2, 36, -83, 2, 0, 2, 54, 2, 7, 3, 0, 4, 0, 817183, 2, 0, 2, 14, 2, 0, 0, 33023, 2, 23, 3, 89, 2, -17, 2, 90, 0, 524157950, 2, 4, 2, 0, 2, 91, 2, 4, 2, 0, 2, 15, 2, 80, 2, 16, 3, 0, 2, 2, 49, 2, 11, -1, 2, 17, -16, 3, 0, 205, 2, 18, -2, 3, 0, 655, 2, 19, 3, 0, 36, 2, 71, -1, 2, 17, 2, 9, 3, 0, 8, 2, 92, 0, 3072, 2, 0, 0, 2147516415, 2, 9, 3, 0, 2, 2, 19, 2, 21, 2, 93, 3, 0, 2, 2, 94, 2, 0, 2, 95, 2, 21, 0, 4294965179, 0, 7, 2, 0, 2, 8, 2, 93, 2, 8, -1, 0, 1761345536, 2, 96, 0, 4294901823, 2, 39, 2, 22, 2, 97, 2, 37, 2, 165, 0, 2080440287, 2, 0, 2, 36, 2, 142, 0, 3296722943, 2, 0, 0, 1046675455, 0, 939524101, 0, 1837055, 2, 98, 2, 99, 2, 15, 2, 33, 3, 0, 3, 0, 7, 3, 0, 349, 2, 100, 2, 101, 2, 6, -264, 3, 0, 11, 2, 24, 3, 0, 2, 2, 34, -1, 0, 2700607615, 2, 102, 2, 103, 3, 0, 2, 2, 20, 2, 25, 3, 0, 10, 2, 9, 2, 17, 2, 0, 2, 47, 2, 0, 2, 26, 2, 104, -3, 2, 105, 3, 0, 3, 2, 22, -1, 3, 5, 2, 2, 29, 2, 0, 2, 7, 2, 106, -1, 2, 107, 2, 108, 2, 109, -1, 3, 0, 3, 2, 11, -2, 2, 0, 2, 30, -8, 2, 22, 2, 0, 2, 38, -1, 2, 0, 2, 63, 2, 31, 2, 18, 2, 9, 2, 0, 2, 110, -1, 3, 0, 4, 2, 9, 2, 17, 2, 111, 2, 6, 2, 0, 2, 33, 2, 0, 2, 50, -4, 3, 0, 9, 2, 23, 2, 18, 2, 26, -4, 2, 112, 2, 113, 2, 18, 2, 23, 2, 7, -2, 2, 114, 2, 18, 2, 34, -2, 2, 0, 2, 115, -2, 0, 4277075969, 2, 18, -1, 3, 22, 2, -1, 2, 35, 2, 143, 2, 0, 3, 18, 2, 2, 37, 2, 20, -3, 3, 0, 2, 2, 36, -1, 2, 0, 2, 37, 2, 0, 2, 37, 2, 0, 2, 50, -14, 2, 22, 2, 45, 2, 116, -4, 2, 23, 2, 117, 2, 52, -2, 2, 117, 2, 19, 2, 17, 2, 36, 2, 117, 2, 39, 0, 4294901776, 0, 4718591, 2, 117, 2, 37, 0, 335544350, -1, 2, 118, 2, 119, -2, 2, 120, 2, 40, 2, 7, -1, 2, 121, 2, 66, 0, 3758161920, 0, 3, -4, 2, 0, 2, 30, 0, 2147485568, -1, 2, 0, 2, 19, 0, 176, -5, 2, 0, 2, 49, 2, 183, -1, 2, 0, 2, 19, 2, 195, -1, 2, 0, 0, 16779263, -2, 2, 11, -7, 2, 0, 2, 119, -3, 3, 0, 2, 2, 122, -5, 2, 123, 2, 38, 0, 10, 0, 4294965249, 0, 67633151, 0, 4026597376, 2, 0, 0, 536871935, -1, 2, 0, 2, 42, -8, 2, 55, 2, 49, 0, 1, 2, 124, 2, 19, -3, 2, 125, 2, 38, 2, 126, 2, 127, 0, 16778239, -10, 2, 37, -8, 3, 0, 28, 2, 34, -3, 3, 0, 3, 2, 49, 3, 0, 6, 2, 50, -85, 3, 0, 33, 2, 49, -126, 3, 0, 18, 2, 39, -269, 3, 0, 17, 2, 42, 2, 7, -3, 2, 17, 2, 128, 2, 0, 2, 19, 2, 50, 2, 129, 2, 19, -21, 3, 0, 2, -4, 3, 0, 2, 0, 67583, -1, 2, 25, -2, 2, 130, 3, 0, 191, 2, 52, 3, 0, 23, 2, 37, -296, 3, 0, 8, 2, 7, -1, 2, 131, 2, 132, 3, 0, 11, 2, 6, -72, 3, 0, 3, 2, 133, 2, 134, -187, 3, 0, 2, 2, 53, 2, 0, 2, 135, 2, 136, 2, 56, 2, 0, 2, 137, 2, 138, 2, 139, 3, 0, 10, 2, 140, 2, 141, 2, 15, 3, 53, 2, 3, 54, 2, 3, 55, 2, 2, 142, -73, 2, 0, 0, 1065361407, 0, 16384, -11, 2, 0, 2, 119, -40, 3, 0, 6, 2, 143, -1, 3, 0, 2, 0, 2063, -37, 2, 56, 2, 144, 2, 145, 2, 146, 2, 147, 2, 148, -138, 3, 0, 1334, 2, 23, -1, 3, 0, 129, 2, 30, 3, 0, 6, 2, 9, 3, 0, 180, 2, 149, 3, 0, 233, 0, 1, -96, 3, 0, 16, 2, 9, -28719, 2, 0, 0, 1, -1, 2, 122, 2, 0, 0, 8193, -21, 2, 191, 0, 10255, 0, 4, -11, 2, 67, 2, 170, -1, 0, 71680, -1, 2, 161, 0, 4292900864, 0, 805306431, -5, 2, 150, -1, 2, 177, -1, 2, 200, -2, 2, 124, -1, 2, 154, -1, 2, 157, 2, 151, 2, 164, 2, 0, 0, 3223322624, 2, 37, 0, 4, -4, 2, 189, 0, 205128192, 0, 1333757536, 0, 2147483696, 0, 423953, 0, 747766272, 0, 2717763192, 0, 4286578751, 0, 278545, 2, 152, 0, 4294886464, 0, 33292336, 0, 417809, 2, 152, 0, 1329579616, 0, 4278190128, 0, 700594195, 0, 1006647527, 0, 4286497336, 0, 4160749631, 2, 153, 0, 469762560, 0, 4171219488, 0, 8323120, 2, 153, 0, 202375680, 0, 3214918176, 0, 4294508592, 0, 139280, -1, 0, 983584, 0, 48, 0, 58720275, 0, 3489923072, 0, 10517376, 0, 4293066815, 0, 1, 0, 2013265920, 2, 176, 2, 0, 0, 2089, 0, 3221225552, 0, 201375904, 2, 0, -2, 0, 256, 0, 122880, 0, 16777216, 2, 150, 0, 4160757760, 2, 0, -6, 2, 166, -11, 0, 3263218176, -1, 0, 49664, 0, 2160197632, 0, 8388802, -1, 0, 12713984, -1, 2, 154, 2, 159, 2, 178, -2, 2, 162, -20, 0, 3758096385, -2, 2, 155, 0, 4292878336, 2, 21, 2, 168, 0, 4294057984, -2, 2, 163, 2, 156, 2, 174, -2, 2, 155, -1, 2, 180, -1, 2, 169, 2, 122, 0, 4026593280, 0, 14, 0, 4292919296, -1, 2, 158, 0, 939588608, -1, 0, 805306368, -1, 2, 122, 0, 1610612736, 2, 156, 2, 157, 3, 0, 2, -2, 2, 158, 2, 159, -3, 0, 267386880, -1, 2, 160, 0, 7168, -1, 0, 65024, 2, 154, 2, 161, 2, 171, -7, 2, 167, -8, 2, 162, -1, 0, 1426112704, 2, 163, -1, 2, 186, 0, 271581216, 0, 2149777408, 2, 19, 2, 161, 2, 122, 0, 851967, 0, 3758129152, -1, 2, 19, 2, 179, -4, 2, 158, -20, 2, 193, 2, 164, -56, 0, 3145728, 2, 185, -4, 2, 165, 2, 122, -4, 0, 32505856, -1, 2, 166, -1, 0, 2147385088, 2, 21, 1, 2155905152, 2, -3, 2, 17, 2, 0, 2, 167, -2, 2, 168, -6, 2, 169, 0, 4026597375, 0, 1, -1, 0, 1, -1, 2, 170, -3, 2, 143, 2, 67, -2, 2, 165, 2, 171, -1, 2, 175, 2, 122, -6, 2, 122, -213, 2, 169, -657, 2, 17, -36, 2, 172, -1, 2, 187, -10, 2, 198, -5, 2, 173, -6, 0, 4294967171, 2, 23, -1, 0, 4227919872, -1, 2, 173, -2, 0, 4227874752, -3, 0, 2146435072, 2, 159, -2, 0, 1006649344, 2, 122, -1, 2, 21, 0, 201375744, -3, 0, 134217720, 2, 21, 0, 4286677377, 0, 32896, -1, 2, 161, -3, 2, 174, -349, 2, 175, 0, 1920, 2, 176, 3, 0, 264, -11, 2, 177, -2, 2, 178, 2, 0, 0, 520617856, 0, 2692743168, 0, 36, -3, 0, 524284, -11, 2, 19, -1, 2, 184, -1, 2, 182, 0, 3221291007, 2, 178, -1, 0, 524288, 0, 2158720, -3, 2, 159, 0, 1, -4, 2, 122, 0, 3808625411, 0, 3489628288, 2, 199, 0, 1207959680, 0, 3221274624, 2, 0, -3, 2, 171, 0, 120, 0, 7340032, -2, 0, 4026564608, 2, 4, 2, 19, 2, 163, 3, 0, 4, 2, 159, -1, 2, 179, 2, 176, -1, 0, 8176, 2, 180, 2, 171, 2, 181, -1, 0, 4290773232, 2, 0, -4, 2, 163, 2, 188, 0, 15728640, 2, 176, -1, 2, 161, -1, 0, 4294934512, 3, 0, 4, -9, 2, 21, 2, 169, 2, 182, 3, 0, 4, 0, 704, 0, 1849688064, 0, 4194304, -1, 2, 122, 0, 4294901887, 2, 0, 0, 130547712, 0, 1879048192, 2, 197, 3, 0, 2, -1, 2, 183, 2, 184, -1, 0, 17829776, 0, 2025848832, 0, 4261477888, -2, 2, 0, -1, 0, 4286580608, -1, 0, 29360128, 2, 185, 0, 16252928, 0, 3791388672, 2, 40, 3, 0, 2, -2, 2, 194, 2, 0, -1, 2, 25, -1, 0, 66584576, -1, 2, 190, 3, 0, 9, 2, 122, 3, 0, 4, -1, 2, 161, 2, 178, 3, 0, 4, 2, 21, -2, 0, 245760, 0, 2147418112, -1, 2, 150, 2, 202, 0, 4227923456, -1, 2, 186, 2, 187, 2, 21, -2, 2, 177, 0, 4292870145, 0, 262144, 2, 122, 3, 0, 2, 0, 1073758848, 2, 188, -1, 0, 4227921920, 2, 189, 0, 68289024, 0, 528402016, 0, 4292927536, 3, 0, 4, -2, 0, 335544320, 2, 0, -2, 2, 190, 3, 0, 5, -1, 2, 185, 2, 163, 2, 0, -2, 0, 4227923936, 2, 63, -1, 2, 155, 2, 96, 2, 0, 2, 154, 2, 158, 3, 0, 6, -1, 2, 176, 3, 0, 3, -2, 0, 2146959360, 3, 0, 5, 0, 768, 2, 191, 2, 80, -2, 2, 161, -2, 2, 117, -1, 2, 155, 3, 0, 8, 0, 512, 0, 8388608, 2, 192, 2, 172, 2, 184, 0, 4286578944, 3, 0, 2, 0, 1152, 0, 1266679808, 2, 190, 0, 576, 0, 4261707776, 2, 96, 3, 0, 9, 2, 155, 3, 0, 6, -1, 0, 2147221504, -28, 2, 178, 3, 0, 3, -3, 0, 4292902912, -6, 2, 97, 3, 0, 85, -33, 0, 4294934528, 3, 0, 126, -18, 2, 193, 3, 0, 269, -17, 2, 155, 2, 122, 2, 196, 3, 0, 2, 2, 19, 0, 4290822144, -2, 0, 67174336, 0, 520093700, 2, 17, 3, 0, 21, -2, 2, 171, 3, 0, 3, -2, 0, 30720, -1, 0, 32512, 3, 0, 2, 2, 97, -191, 2, 173, -23, 2, 25, 3, 0, 296, -8, 2, 122, 2, 0, 0, 4294508543, 0, 65295, -11, 2, 176, 3, 0, 72, -3, 0, 3758159872, 0, 201391616, 3, 0, 155, -7, 2, 169, -1, 0, 384, -1, 0, 133693440, -3, 2, 194, -2, 2, 29, 3, 0, 4, 2, 168, -2, 2, 21, 2, 155, 3, 0, 4, -2, 2, 186, -1, 2, 150, 0, 335552923, 2, 195, -1, 0, 538974272, 0, 2214592512, 0, 132000, -10, 0, 192, -8, 0, 12288, -21, 0, 134213632, 0, 4294901761, 3, 0, 42, 0, 100663424, 0, 4294965284, 3, 0, 6, -1, 0, 3221282816, 2, 196, 3, 0, 11, -1, 2, 197, 3, 0, 40, -6, 0, 4286578784, 2, 0, -2, 0, 1006694400, 3, 0, 24, 2, 38, -1, 2, 201, 3, 0, 2, 0, 1, 2, 163, 3, 0, 6, 2, 195, 0, 4110942569, 0, 1432950139, 0, 2701658217, 0, 4026532864, 0, 4026532881, 2, 0, 2, 47, 3, 0, 8, -1, 2, 158, -2, 2, 168, 0, 98304, 0, 65537, 2, 169, 2, 172, -2, 2, 172, -1, 2, 63, 2, 0, 2, 116, 0, 65528, 2, 176, 0, 4294770176, 2, 29, 3, 0, 4, -30, 2, 169, 0, 4160806912, -3, 2, 168, -2, 2, 155, 2, 198, 2, 158, -1, 2, 190, -1, 2, 161, 0, 4294950912, 3, 0, 2, 2, 199, -2, 0, 58982400, -1, 0, 14360, 2, 200, -3, 2, 168, 0, 4176527360, 0, 4290838520, 3, 0, 43, -1334, 2, 21, 2, 0, -129, 2, 201, -6, 2, 163, -180, 2, 202, -233, 2, 4, 3, 0, 96, -16, 2, 163, 3, 0, 22583, -7, 2, 17, 3, 0, 6128], [4294967295, 4294967291, 4092460543, 4294828015, 4294967294, 134217726, 268435455, 2147483647, 1048575, 1073741823, 3892314111, 134217727, 1061158911, 536805376, 4294910143, 4160749567, 4294901759, 4294901760, 4194303, 65535, 262143, 4286578688, 536870911, 8388607, 4294918143, 4294443008, 255, 67043328, 2281701374, 4294967232, 2097151, 4294903807, 4294902783, 4294902015, 67108863, 4294967039, 511, 524287, 131071, 127, 4294902271, 4294549487, 33554431, 1023, 67047423, 4294901888, 4286578687, 4294770687, 67043583, 32767, 15, 2047999, 16777215, 4292870143, 4294934527, 4294966783, 4294967279, 262083, 20511, 4290772991, 41943039, 493567, 2047, 4294959104, 1071644671, 603979775, 602799615, 65536, 4294828000, 805044223, 4294965206, 8191, 1031749119, 4294917631, 2134769663, 4286578493, 4282253311, 4294942719, 33540095, 4294905855, 4294967264, 2868854591, 1608515583, 265232348, 534519807, 2147614720, 1060109444, 4093640016, 17376, 2139062143, 224, 4169138175, 4294909951, 4294967292, 4294965759, 124, 4294966272, 4294967280, 8289918, 4294934399, 4294901775, 4294965375, 1602223615, 4294967259, 268369920, 4292804608, 486341884, 4294963199, 3087007615, 1073692671, 4128527, 4279238655, 4294966591, 2445279231, 3670015, 3238002687, 63, 4294967288, 4294705151, 4095, 3221208447, 4294549472, 2147483648, 4294966527, 4294705152, 4294966143, 64, 4294966719, 16383, 3774873592, 11, 458752, 4294902000, 536807423, 67043839, 3758096383, 3959414372, 3755993023, 2080374783, 4294835295, 4294967103, 4160749565, 4087, 31, 184024726, 2862017156, 1593309078, 268434431, 268434414, 4294901763, 536870912, 2952790016, 202506752, 139264, 402653184, 4261412864, 4227922944, 2147532800, 61440, 3758096384, 117440512, 65280, 3233808384, 3221225472, 4294965248, 32768, 57152, 67108864, 4293918720, 4290772992, 25165824, 4160749568, 57344, 4278190080, 4227907584, 65520, 4026531840, 49152, 4227858432, 4294836224, 63488, 1073741824, 4294967040, 251658240, 196608, 12582912, 2097152, 65408, 64512, 417808, 4227923712, 50331648, 65472, 4294967168, 4294966784, 16, 4294917120, 2080374784, 4294963200, 4096, 6144, 4292870144, 65532]);

  function scanNumericLiterals(state, context, type) {
      let isNotFloat = (type & 32) === 0;
      const marker = state.index;
      let leadingErrPos = marker;
      state.tokenValue = 0;
      if ((type & 32) === 0) {
          if (state.currentChar === 48) {
              nextChar(state);
              const lowerCasedLetters = state.currentChar | 32;
              if (lowerCasedLetters === 120) {
                  nextChar(state);
                  type = 256;
                  state.tokenValue = scanHexDigits(state, marker);
              }
              else if (lowerCasedLetters === 111) {
                  nextChar(state);
                  type = 1024;
                  state.tokenValue = scanOctalDigits(state, marker);
              }
              else if (lowerCasedLetters === 98) {
                  nextChar(state);
                  type = 4096;
                  state.tokenValue = scanBinaryDigits(state, marker);
              }
              else if (AsciiLookup[state.currentChar] & 4) {
                  type = 16384;
                  state.tokenValue = scanImplicitOctalDigits(state, context, marker);
                  if (state.tokenValue === -1) {
                      type = 64;
                      leadingErrPos = state.index;
                      isNotFloat = false;
                  }
              }
              else if (state.currentChar < 48 || state.currentChar > 55) {
                  type = 64;
              }
              else
                  isNotFloat = false;
          }
      }
      if (type & (16 | 64)) {
          if (isNotFloat) {
              let digit = 9;
              while (AsciiLookup[state.currentChar] & 4 && digit >= 0) {
                  state.tokenValue = 0xa * state.tokenValue + (state.currentChar - 48);
                  nextChar(state);
                  --digit;
              }
              if (digit >= 0 && state.currentChar !== 46 && !isIdentifierStart(state.currentChar)) {
                  return 536936450;
              }
              while (AsciiLookup[state.currentChar] & 4) {
                  nextChar(state);
              }
          }
          if (state.currentChar === 46) {
              nextChar(state);
              while (AsciiLookup[state.currentChar] & 4) {
                  nextChar(state);
              }
          }
      }
      let isBigInt = false;
      if (context & 1 &&
          (type & 32) === 0 &&
          state.currentChar === 110 &&
          type & 5392) {
          isBigInt = true;
          nextChar(state);
      }
      else if ((state.currentChar | 32) === 101) {
          if ((type & (16 | 64)) < 1) {
              reportAt(state, marker, state.line, state.column, 7);
          }
          nextChar(state);
          if (AsciiLookup[state.currentChar] & 32) {
              nextChar(state);
          }
          if ((AsciiLookup[state.currentChar] & 4) < 1)
              reportAt(state, marker, state.line, state.index, 10);
          while (AsciiLookup[state.currentChar] & 4) {
              nextChar(state);
          }
      }
      if (AsciiLookup[state.currentChar] & (4 | 3) || isIdentifierStart(state.currentChar)) {
          type & 64
              ? reportAt(state, marker, state.line, leadingErrPos - 1, 20)
              : isBigInt
                  ? report(state, 11)
                  : reportAt(state, marker, state.line, marker, 12);
      }
      if (type & 64) {
          state.octalPos = { index: state.index, line: state.line, column: state.index - 1 };
          state.octalMessage = 7;
      }
      if ((type & 21760) < 1) {
          state.tokenValue =
              type & 64
                  ? parseFloat(state.source.slice(marker, state.index))
                  : isBigInt
                      ? parseInt(state.source.slice(marker, state.index), 0xa)
                      : +state.source.slice(marker, state.index);
      }
      return isBigInt ? 159866 : 536936450;
  }
  function scanImplicitOctalDigits(state, context, startPos) {
      if (context & 1024) {
          reportAt(state, startPos, state.line, state.column, 7);
      }
      let implicitValue = 0;
      while (state.index < state.length) {
          if (state.currentChar < 48 || state.currentChar > 55) {
              nextChar(state);
              return -1;
          }
          implicitValue = implicitValue * 8 + (state.currentChar - 48);
          nextChar(state);
      }
      state.flags |= 64;
      state.octalPos = { index: startPos, line: state.line, column: state.column };
      state.octalMessage = 8;
      return implicitValue;
  }
  function scanHexDigits(state, startPos) {
      let hexValue = 0;
      let digit = toHex(state.currentChar);
      if (digit < 0)
          reportAt(state, startPos, state.line, startPos + 2, 19);
      do {
          hexValue = hexValue * 0x10 + digit;
          nextChar(state);
          digit = toHex(state.currentChar);
      } while (digit >= 0);
      return hexValue;
  }
  function scanOctalDigits(state, startPos) {
      let octalValue = 0;
      let digits = 0;
      while (state.currentChar >= 48 && state.currentChar <= 55) {
          octalValue = octalValue * 8 + (state.currentChar - 48);
          nextChar(state);
          digits++;
      }
      if (digits < 1)
          reportAt(state, startPos, state.line, startPos + 2, 9, `${8}`);
      return octalValue;
  }
  function scanBinaryDigits(state, startPos) {
      let binaryValue = 0;
      let digits = 0;
      while (state.currentChar >= 48 && state.currentChar <= 49) {
          binaryValue = binaryValue * 2 + (state.currentChar - 48);
          nextChar(state);
          digits++;
      }
      if (digits < 1)
          reportAt(state, startPos, state.line, startPos + 2, 9, `${2}`);
      return binaryValue;
  }

  function scanPrivatemame(state, context) {
      nextChar(state);
      const marker = state.index;
      while ((AsciiLookup[state.currentChar] & 3) === 3) {
          nextChar(state);
      }
      state.tokenValue = state.source.slice(marker, state.index);
      if ((context & 1) === 0 ||
          AsciiLookup[state.currentChar] & (4 | 640)) {
          reportAt(state, state.index, state.line, state.startIndex, 3);
      }
      return 159865;
  }
  function scanIdentifierOrKeyword(state, context) {
      let scanFlags = 0;
      if (state.currentChar <= 0x7f) {
          if ((AsciiLookup[state.currentChar] & 64) < 1) {
              while (AsciiLookup[state.currentChar] & (2 | 4)) {
                  scanFlags = scanFlags | AsciiLookup[state.currentChar];
                  nextChar(state);
              }
              if (state.index < state.length)
                  scanFlags = scanFlags | (state.currentChar > 127 ? 64 : AsciiLookup[state.currentChar]);
              state.tokenValue = state.source.slice(state.startIndex, state.index);
              if (context & 512)
                  state.tokenRaw = state.source.slice(state.startIndex, state.index);
              if ((scanFlags & 64) < 1) {
                  if (scanFlags & 16) {
                      return 225281;
                  }
                  const len = state.tokenValue.length;
                  if (len >= 2 && len <= 11) {
                      const keyword = descKeywordTable[state.tokenValue];
                      if (keyword !== undefined)
                          return keyword;
                  }
                  return 225281;
              }
          }
      }
      return scanIdentifierOrKeywordSlowPath(state, context, scanFlags);
  }
  function scanIdentifierOrKeywordSlowPath(state, context, scanFlags) {
      let marker = state.index;
      while (state.index < state.length) {
          if (AsciiLookup[state.currentChar] & 64) {
              state.tokenValue += state.source.slice(marker, state.index);
              const cookedChar = scanIdentifierUnicodeEscape(state);
              if (!isIdentifierPart(cookedChar))
                  return 129;
              state.tokenValue += fromCodePoint$1(cookedChar);
              marker = state.index;
          }
          else {
              if (state.currentChar >= 0xd800 && state.currentChar <= 0xdbff) {
                  const lo = state.source.charCodeAt(state.index + 1);
                  if ((lo & 0xfc00) === 0xdc00) {
                      state.currentChar = ((state.currentChar & 0x3ff) << 10) | (lo & 0x3ff) | 0x10000;
                      state.index++;
                  }
              }
              if (!isIdentifierPart(state.currentChar)) {
                  break;
              }
              nextChar(state);
          }
      }
      state.tokenValue += state.source.slice(marker, state.index);
      if (context & 512)
          state.tokenRaw = state.source.slice(state.startIndex, state.index);
      const length = state.tokenValue.length;
      if ((scanFlags & 8) === 8 && (length >= 2 && length <= 11)) {
          const keyword = descKeywordTable[state.tokenValue];
          if (keyword === undefined)
              return 225281;
          if (keyword === 225281 || keyword === 258154)
              return keyword;
          if (context & 1024) {
              if (keyword === 1073999944 || keyword === 192617)
                  return 159863;
              return (keyword & 36864) === 36864
                  ? 159863
                  : 159862;
          }
          return (keyword & 36864) === 36864 ? keyword : 159862;
      }
      return 225281;
  }
  function scanIdentifierUnicodeEscape(state) {
      nextChar(state);
      if (state.currentChar !== 117)
          reportAt(state, state.index, state.line, state.index - 1, 22);
      const errPos = state.index;
      nextChar(state);
      return scanUnicodeEscape(state, errPos);
  }
  function scanUnicodeEscape(state, errPos) {
      let codePoint = 0;
      if (state.currentChar === 123) {
          nextChar(state);
          let hexValue = toHex(state.currentChar);
          if (hexValue < 0)
              reportAt(state, state.index, state.line, state.index - 1, 4);
          while (hexValue >= 0) {
              codePoint = codePoint * 0x10 + hexValue;
              if (codePoint > 1114111) {
                  reportAt(state, errPos, state.line, errPos + 2, 5, `${codePoint}`);
              }
              nextChar(state);
              hexValue = toHex(state.currentChar);
          }
          if (codePoint < 0 || state.currentChar !== 125) {
              reportAt(state, errPos, state.line, state.index, 4);
          }
          nextChar(state);
      }
      else {
          for (let i = 0; i < 4; i++) {
              const hexValue = toHex(state.currentChar);
              if (hexValue < 0) {
                  reportAt(state, state.index, state.line, errPos, 4);
              }
              codePoint = codePoint * 0x10 + hexValue;
              nextChar(state);
          }
      }
      return codePoint;
  }

  function scanStringLiteral(state, context) {
      const quote = state.currentChar;
      nextChar(state);
      state.tokenValue = '';
      let marker = state.index;
      while (state.index < state.length) {
          if (state.currentChar === quote) {
              state.tokenValue += state.source.slice(marker, state.index);
              nextChar(state);
              if (context & 512)
                  state.tokenRaw = state.source.slice(state.startIndex, state.index);
              return 536936451;
          }
          if ((state.currentChar & 8) === 8) {
              if (AsciiLookup[state.currentChar] & 64) {
                  state.tokenValue += state.source.slice(marker, state.index);
                  nextChar(state);
                  const code = scanEscape(state, context, false);
                  if (code < 0)
                      return 129;
                  state.tokenValue += fromCodePoint$1(code);
                  marker = state.index;
                  continue;
              }
              if (((state.currentChar & 83) < 3 && state.currentChar === 13) ||
                  state.currentChar === 10) {
                  report(state, 21);
              }
          }
          nextChar(state);
      }
      report(state, 14);
  }
  function scanEscape(state, context, isTemplate) {
      const char = state.currentChar;
      nextChar(state);
      switch (char) {
          case 98:
              return 8;
          case 116:
              return 9;
          case 110:
              return 10;
          case 118:
              return 11;
          case 102:
              return 12;
          case 114:
              return 13;
          case 34:
              return 34;
          case 39:
              return 39;
          case 92:
              return 92;
          case 117: {
              let codePoint = 0;
              if (state.currentChar === 123) {
                  const beginPos = state.index - 2;
                  nextChar(state);
                  let digit = toHex(state.currentChar);
                  if (digit < 0)
                      reportAt(state, state.index, state.line, beginPos, 4);
                  while (digit >= 0) {
                      codePoint = codePoint * 0x10 + digit;
                      if (codePoint > 1114111) {
                          reportAt(state, beginPos, state.line, state.index - 1, 5, `${codePoint}`);
                      }
                      nextChar(state);
                      digit = toHex(state.currentChar);
                  }
                  if (codePoint < 0 || state.currentChar !== 125) {
                      reportAt(state, state.index, state.line, beginPos, 4);
                  }
                  nextChar(state);
              }
              else {
                  const beginPos = state.index - 2;
                  for (let i = 0; i < 4; i++) {
                      const digit = toHex(state.currentChar);
                      if (digit < 0) {
                          reportAt(state, state.index, state.line, beginPos, isTemplate ? 6 : 4);
                      }
                      codePoint = codePoint * 0x10 + digit;
                      nextChar(state);
                  }
              }
              return codePoint;
          }
          case 120: {
              let codePoint = 0;
              const beginPos = state.index - 2;
              for (let i = 0; i < 2; i++) {
                  const digit = toHex(state.currentChar);
                  if (digit < 0) {
                      reportAt(state, state.startIndex, state.line, beginPos + 3, isTemplate ? 6 : 4);
                  }
                  codePoint = codePoint * 0x10 + digit;
                  nextChar(state);
              }
              return codePoint;
          }
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55: {
              let codePoint = char - 48;
              let idx = 0;
              for (; idx < 2; idx++) {
                  const digit = state.currentChar - 48;
                  if (digit < 0 || digit > 7)
                      break;
                  const nx = codePoint * 8 + digit;
                  if (nx >= 256)
                      break;
                  codePoint = nx;
                  nextChar(state);
              }
              if (char !== 48 || idx > 0 || (state.currentChar >= 48 && state.currentChar <= 55)) {
                  if (context & 1024 || isTemplate)
                      reportAt(state, state.index, state.line, state.index - 1, isTemplate ? 2 : 1);
                  state.flags |= 64;
                  state.octalPos = { index: state.index, line: state.line, column: state.index - 1 };
                  state.octalMessage = isTemplate ? 2 : 1;
              }
              return codePoint;
          }
          case 56:
          case 57:
              reportAt(state, state.startIndex, state.line, state.index + 3, 13);
          case 13: {
              const i = state.index;
              if (i < state.length) {
                  const ch = state.source.charCodeAt(i);
                  if (ch === 10) {
                      state.index = i + 1;
                  }
              }
          }
          case 8232:
          case 8233:
          case 10:
              state.column = -1;
              state.line++;
              return 0;
          default:
              return char;
      }
  }

  function scanTemplate(state, context) {
      const { index: start } = state;
      let tail = true;
      let result = '';
      nextChar(state);
      while (state.currentChar !== 96) {
          if (state.currentChar === 36) {
              if (state.index + 1 < state.length && state.source.charCodeAt(state.index + 1) === 123) {
                  nextChar(state);
                  tail = false;
                  break;
              }
              else {
                  result += '$';
              }
          }
          else if (AsciiLookup[state.currentChar] & 64) {
              const code = scanEscape(state, context, false);
              if (code >= 0) {
                  result += fromCodePoint$1(code);
              }
              else if (code >= 0) {
                  state.tokenValue += fromCodePoint$1(code);
              }
              else {
                  result = undefined;
                  return 129;
              }
          }
          else if (result != null) {
              result += fromCodePoint$1(state.currentChar);
          }
          if (state.currentChar === 13 ||
              state.currentChar === 10 ||
              (state.currentChar ^ 8233) <= 1) {
              state.column = -1;
              state.line++;
          }
          if (state.index >= state.length)
              report(state, 0);
          nextChar(state);
      }
      nextChar(state);
      state.tokenValue = result;
      if (tail) {
          state.tokenRaw = state.source.slice(start + 1, state.index - 1);
          return 4259849;
      }
      else {
          state.tokenRaw = state.source.slice(start + 1, state.index - 2);
          return 4259848;
      }
  }
  function scanTemplateTail(state, context) {
      if (state.index >= state.length)
          return report(state, 23);
      state.index--;
      state.column--;
      return scanTemplate(state, context);
  }

  var RegexState;
  (function (RegexState) {
      RegexState[RegexState["Empty"] = 0] = "Empty";
      RegexState[RegexState["Escape"] = 1] = "Escape";
      RegexState[RegexState["Class"] = 2] = "Class";
  })(RegexState || (RegexState = {}));
  var RegexFlags;
  (function (RegexFlags) {
      RegexFlags[RegexFlags["Empty"] = 0] = "Empty";
      RegexFlags[RegexFlags["IgnoreCase"] = 1] = "IgnoreCase";
      RegexFlags[RegexFlags["Global"] = 2] = "Global";
      RegexFlags[RegexFlags["Multiline"] = 4] = "Multiline";
      RegexFlags[RegexFlags["Unicode"] = 8] = "Unicode";
      RegexFlags[RegexFlags["Sticky"] = 16] = "Sticky";
      RegexFlags[RegexFlags["DotAll"] = 32] = "DotAll";
  })(RegexFlags || (RegexFlags = {}));
  function scanRegularExpression(state, context) {
      const bodyStart = state.index;
      let preparseState = RegexState.Empty;
      loop: while (true) {
          const ch = state.source.charCodeAt(state.index);
          state.index++;
          state.column++;
          if (preparseState & RegexState.Escape) {
              preparseState &= ~RegexState.Escape;
          }
          else {
              switch (ch) {
                  case 47:
                      if (!preparseState)
                          break loop;
                      else
                          break;
                  case 92:
                      preparseState |= RegexState.Escape;
                      break;
                  case 91:
                      preparseState |= RegexState.Class;
                      break;
                  case 93:
                      preparseState &= RegexState.Escape;
                      break;
                  case 13:
                  case 10:
                  case 8232:
                  case 8233:
                      report(state, 33);
                  default:
              }
          }
          if (state.index >= state.source.length) {
              report(state, 33);
          }
      }
      const bodyEnd = state.index - 1;
      let mask = RegexFlags.Empty;
      const { index: flagStart } = state;
      loop: while (state.index < state.source.length) {
          const code = state.source.charCodeAt(state.index);
          switch (code) {
              case 103:
                  if (mask & RegexFlags.Global)
                      report(state, 35, 'g');
                  mask |= RegexFlags.Global;
                  break;
              case 105:
                  if (mask & RegexFlags.IgnoreCase)
                      report(state, 35, 'i');
                  mask |= RegexFlags.IgnoreCase;
                  break;
              case 109:
                  if (mask & RegexFlags.Multiline)
                      report(state, 35, 'm');
                  mask |= RegexFlags.Multiline;
                  break;
              case 117:
                  if (mask & RegexFlags.Unicode)
                      report(state, 35, 'u');
                  mask |= RegexFlags.Unicode;
                  break;
              case 121:
                  if (mask & RegexFlags.Sticky)
                      report(state, 35, 'y');
                  mask |= RegexFlags.Sticky;
                  break;
              case 115:
                  if (mask & RegexFlags.DotAll)
                      report(state, 35, 's');
                  mask |= RegexFlags.DotAll;
                  break;
              default:
                  if (!isIdentifierPart(code))
                      break loop;
                  report(state, 34, fromCodePoint$1(code));
          }
          state.index++;
          state.column++;
      }
      const flags = state.source.slice(flagStart, state.index);
      const pattern = state.source.slice(bodyStart, bodyEnd);
      state.tokenRegExp = { pattern, flags };
      if (context & 512)
          state.tokenRaw = state.source.slice(state.startIndex, state.index);
      state.tokenValue = validate(state, pattern, flags);
      return 65540;
  }
  function validate(state, pattern, flags) {
      try {
      }
      catch (e) {
          report(state, 33);
      }
      try {
          return new RegExp(pattern, flags);
      }
      catch (e) {
          return null;
      }
  }

  function skipSingleLineComment(state, type) {
      while (state.index < state.length) {
          const next = state.currentChar;
          if (next === 13) {
              state.currentChar = state.source.charCodeAt(++state.index);
              state.column = 0;
              state.line++;
              if (state.index < state.length && state.source.charCodeAt(state.index) === 10)
                  state.index++;
              state.flags |= 1;
              return (type |= 1);
          }
          else if (next === 10 || (next ^ 8233) <= 1) {
              state.currentChar = state.source.charCodeAt(++state.index);
              state.column = 0;
              state.line++;
              state.flags |= 1;
              return (type |= 1);
          }
          nextChar(state);
      }
      return type;
  }
  function skipMultilineComment(state, type) {
      while (state.index < state.length) {
          const next = state.source.charCodeAt(state.index);
          if (next === 13) {
              state.flags |= 1;
              type |= 1 | 2;
              state.currentChar = state.source.charCodeAt(++state.index);
              state.column = 0;
              state.line++;
          }
          else if (next === 10) {
              state.flags |= 1;
              state.currentChar = state.source.charCodeAt(++state.index);
              if ((type & 2) < 1) {
                  state.column = 0;
                  state.line++;
              }
              type = (type & ~2) | 1;
          }
          else if ((next ^ 8233) <= 1) {
              type = (type & ~2) | 1;
              state.flags |= 1;
              state.currentChar = state.source.charCodeAt(++state.index);
              state.column = 0;
              state.line++;
          }
          else if (next === 42) {
              nextChar(state);
              type = type & ~2;
              if (state.currentChar === 47) {
                  nextChar(state);
                  return type;
              }
          }
          else {
              type = type & ~2;
              nextChar(state);
          }
      }
      report(state, 16);
  }

  const tableLookup = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      125,
      124,
      126,
      127,
      123,
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
      128,
      33620013,
      536936451,
      159865,
      225281,
      16845364,
      16844100,
      536936451,
      65547,
      16,
      16845363,
      50399535,
      18,
      50399536,
      13,
      16845365,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      536936450,
      21,
      17,
      16844607,
      8388637,
      16844608,
      22,
      0,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      2162707,
      225281,
      20,
      16843846,
      225281,
      4259840,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      225281,
      2162700,
      16843589,
      15,
      33620014,
      0
  ];
  function nextToken(state, context) {
      state.flags &= ~1;
      state.endIndex = state.index;
      state.endLine = state.line;
      state.endColumn = state.column;
      state.token = scanSingleToken(state, context);
      return state.token;
  }
  function scanSingleToken(state, context) {
      let type = 0;
      while (state.index < state.length) {
          const next = state.source.charCodeAt(state.index);
          state.startIndex = state.index;
          state.startLine = state.line;
          state.startColumn = state.column;
          if (next < 0x7f) {
              const token = tableLookup[next];
              switch (token) {
                  case 65547:
                  case 16:
                  case 2162700:
                  case 2162707:
                  case 15:
                  case 20:
                  case 22:
                  case 33620014:
                  case 21:
                  case 17:
                  case 18:
                      nextChar(state);
                      return token;
                  case 225281:
                      return scanIdentifierOrKeyword(state, context);
                  case 536936450:
                      return scanNumericLiterals(state, context, 16);
                  case 536936451:
                      return scanStringLiteral(state, context);
                  case 159865:
                      return scanPrivatemame(state, context);
                  case 4259840:
                      return scanTemplate(state, context);
                  case 128:
                  case 126:
                  case 125:
                  case 127:
                      nextChar(state);
                      break;
                  case 124:
                      state.currentChar = state.source.charCodeAt(++state.index);
                      state.flags |= 1;
                      if ((type & 2) < 1) {
                          state.column = 0;
                          ++state.line;
                      }
                      type = (type & ~2) | 1;
                      break;
                  case 123:
                      type |= 1 | 2;
                      state.flags |= 1;
                      state.currentChar = state.source.charCodeAt(++state.index);
                      state.column = 0;
                      ++state.line;
                      break;
                  case 13:
                      let index = state.index + 1;
                      if (index < state.length) {
                          const next = state.source.charCodeAt(index);
                          if (next === 46) {
                              index++;
                              if (index < state.length && state.source.charCodeAt(index) === 46) {
                                  state.index = index + 1;
                                  state.column += 3;
                                  state.currentChar = state.source.charCodeAt(state.index);
                                  return 14;
                              }
                          }
                          else if (AsciiLookup[next] & 4) {
                              return scanNumericLiterals(state, context, 16 | 32);
                          }
                      }
                      nextChar(state);
                      return 13;
                  case 33620013:
                      nextChar(state);
                      if (state.currentChar !== 61)
                          return 33620013;
                      nextChar(state);
                      if (state.currentChar !== 61)
                          return 16844348;
                      nextChar(state);
                      return 16844346;
                  case 16845364:
                      nextChar(state);
                      if (state.currentChar !== 61)
                          return 16845364;
                      nextChar(state);
                      return 8388646;
                  case 16845363: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 16845363;
                      const next = state.currentChar;
                      if (next === 61) {
                          nextChar(state);
                          return 8388644;
                      }
                      if (next !== 42)
                          return 16845363;
                      nextChar(state);
                      if (state.currentChar !== 61)
                          return 16845622;
                      nextChar(state);
                      return 8388641;
                  }
                  case 16843846:
                      nextChar(state);
                      if (state.currentChar !== 61)
                          return 16843846;
                      nextChar(state);
                      return 8388647;
                  case 50399535: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 50399535;
                      const next = state.currentChar;
                      if (next === 43) {
                          nextChar(state);
                          return 67174427;
                      }
                      if (next === 61) {
                          nextChar(state);
                          return 8388642;
                      }
                      return 50399535;
                  }
                  case 50399536: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 50399536;
                      const next = state.currentChar;
                      if (next === 45) {
                          if (context & 256 &&
                              (context & 2048) < 1 &&
                              state.source.charCodeAt(state.index + 1) === 62 &&
                              type & (4 | 1)) {
                              nextChar(state);
                              type = skipSingleLineComment(state, type);
                              continue;
                          }
                          nextChar(state);
                          return 67174428;
                      }
                      if (next === 61) {
                          nextChar(state);
                          return 8388643;
                      }
                      return 50399536;
                  }
                  case 16845365: {
                      nextChar(state);
                      if (state.index < state.length) {
                          const ch = state.currentChar;
                          if (ch === 47) {
                              nextChar(state);
                              type = skipSingleLineComment(state, type | 4);
                              break;
                          }
                          else if (ch === 42) {
                              nextChar(state);
                              type = skipMultilineComment(state, type | 4);
                              break;
                          }
                          else if (context & 32768) {
                              return scanRegularExpression(state, context);
                          }
                          else if (ch === 61) {
                              nextChar(state);
                              return 8454181;
                          }
                          else if (ch === 62) {
                              nextChar(state);
                              return 26;
                          }
                      }
                      return 16845365;
                  }
                  case 16844607:
                      nextChar(state);
                      if (state.index >= state.length)
                          return 16844607;
                      switch (state.currentChar) {
                          case 60:
                              nextChar(state);
                              if (state.currentChar === 61) {
                                  nextChar(state);
                                  return 8388638;
                              }
                              else {
                                  return 16844865;
                              }
                          case 61:
                              nextChar(state);
                              return 16844605;
                          case 33:
                              if ((context & 2048) < 1 &&
                                  state.source.charCodeAt(state.index + 1) === 45 &&
                                  state.source.charCodeAt(state.index + 2) === 45) {
                                  type = skipSingleLineComment(state, type);
                                  continue;
                              }
                          case 47: {
                              if ((context & 16) < 1)
                                  break;
                              const index = state.index + 1;
                              if (index < state.length) {
                                  const next = state.source.charCodeAt(index);
                                  if (next === 42 || next === 47)
                                      break;
                              }
                              nextChar(state);
                              return 25;
                          }
                          default:
                              return 16844607;
                      }
                  case 8388637: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 8388637;
                      const next = state.currentChar;
                      if (next === 61) {
                          nextChar(state);
                          if (state.currentChar === 61) {
                              nextChar(state);
                              return 16844345;
                          }
                          else {
                              return 16844347;
                          }
                      }
                      else if (next === 62) {
                          nextChar(state);
                          return 10;
                      }
                      return 8388637;
                  }
                  case 16843589: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 16843589;
                      const next = state.currentChar;
                      if (next === 124) {
                          nextChar(state);
                          return 17367352;
                      }
                      else if (next === 61) {
                          nextChar(state);
                          return 8388648;
                      }
                      return 16843589;
                  }
                  case 16844608: {
                      nextChar(state);
                      if (state.index >= state.length)
                          return 16844608;
                      const next = state.currentChar;
                      if (next === 61) {
                          nextChar(state);
                          return 16844606;
                      }
                      if (next !== 62)
                          return 16844608;
                      nextChar(state);
                      if (state.index < state.length) {
                          const next = state.currentChar;
                          if (next === 62) {
                              nextChar(state);
                              if (state.currentChar === 61) {
                                  nextChar(state);
                                  return 8388640;
                              }
                              else {
                                  return 16844867;
                              }
                          }
                          else if (next === 61) {
                              nextChar(state);
                              return 8388639;
                          }
                      }
                      return 16844866;
                  }
                  case 16844100: {
                      nextChar(state);
                      const next = state.currentChar;
                      if (next === 38) {
                          nextChar(state);
                          return 17367607;
                      }
                      if (next === 61) {
                          nextChar(state);
                          return 8388649;
                      }
                      return 16844100;
                  }
                  default:
                      reportAt(state, state.index, state.line, state.startIndex, 18, fromCodePoint(state.currentChar));
              }
          }
          else {
              if ((state.currentChar ^ 8233) <= 1) {
                  type = (type & ~2) | 1;
                  state.flags |= 1;
                  state.currentChar = state.source.charCodeAt(++state.index);
                  state.column = 0;
                  ++state.line;
                  continue;
              }
              if (isExoticWhiteSpace(state.currentChar)) {
                  nextChar(state);
                  continue;
              }
              getMostLikelyUnicodeChar(state);
              if (!isIdentifierStart(state.currentChar)) {
                  reportAt(state, state.index, state.line, state.startIndex, 18, fromCodePoint(state.currentChar));
              }
              state.tokenValue = state.source.slice(state.startIndex, state.index);
              return 225281;
          }
      }
      return 0;
  }

  function parseExpression(state, context, allowAssignment) {
      return parseAssignmentExpression(state, context, parseLeftHandSideExpression(state, context, allowAssignment));
  }
  function parseSequenceExpression(state, context, expr) {
      const expressions = [expr];
      while (consumeOpt(state, context | 32768, 18)) {
          expressions.push(parseExpression(state, context, true));
      }
      return {
          type: 'SequenceExpression',
          expressions
      };
  }
  function parseExpressions(state, context, allowAssignment) {
      const expr = parseExpression(state, context, allowAssignment);
      return state.token === 18 ? parseSequenceExpression(state, context, expr) : expr;
  }
  function parseAssignmentExpression(state, context, left) {
      if ((state.token & 8388608) > 0) {
          if (state.assignable & 2) {
              report(state, 24);
          }
          if ((state.token === 8388637 && left.type === 'ArrayExpression') ||
              left.type === 'ObjectExpression') {
              reinterpretToPattern(state, left);
          }
          const assignToken = state.token;
          nextToken(state, context | 32768);
          left = {
              type: 'AssignmentExpression',
              left,
              operator: KeywordDescTable[assignToken & 255],
              right: parseExpression(state, context, true)
          };
          return left;
      }
      if ((state.token & 16842752) > 0) {
          left = parseBinaryExpression(state, context, 4, left);
      }
      if (consumeOpt(state, context | 32768, 22)) {
          left = parseConditionalExpression(state, context, left);
      }
      return left;
  }
  function parseConditionalExpression(state, context, test) {
      const consequent = parseExpression(state, (context | 8192) ^ 8192, true);
      consume(state, context | 32768, 21);
      const alternate = parseExpression(state, context, true);
      return {
          type: 'ConditionalExpression',
          test,
          consequent,
          alternate
      };
  }
  function parseBinaryExpression(state, context, minPrec, left) {
      const bit = -((context & 8192) > 0) & 16865073;
      let t;
      let prec;
      state.assignable = 2;
      while ((state.token & 16842752) > 0) {
          t = state.token;
          prec = t & 3840;
          if (prec + ((t === 16845622) << 8) - ((bit === t) << 12) <= minPrec)
              break;
          nextToken(state, context | 32768);
          left = {
              type: t & 524288 ? 'LogicalExpression' : 'BinaryExpression',
              left,
              right: parseBinaryExpression(state, context, prec, parseLeftHandSideExpression(state, context, false)),
              operator: KeywordDescTable[t & 255]
          };
      }
      state.assignable = 2;
      return left;
  }
  function parseUnaryExpression(state, context) {
      const unaryOperator = state.token;
      nextToken(state, context | 32768);
      let arg = parseLeftHandSideExpression(state, context, false);
      if (state.token === 16845622)
          report(state, 32);
      if (context & 1024 && unaryOperator === 33640491) {
          if (arg.type === 'Identifier') {
              report(state, 0);
          }
      }
      state.assignable = 2;
      return {
          type: 'UnaryExpression',
          operator: KeywordDescTable[unaryOperator & 255],
          argument: arg,
          prefix: true
      };
  }
  function parseUpdateExpression(state, context, expr) {
      if (state.flags & 1)
          return expr;
      if (state.assignable & 2)
          report(state, 56);
      const updateOperator = state.token;
      nextToken(state, context);
      state.assignable = 2;
      return {
          type: 'UpdateExpression',
          argument: expr,
          operator: KeywordDescTable[updateOperator & 255],
          prefix: false
      };
  }
  function parseYieldExpressionOrIdentifier(state, context) {
      if ((context & 2097152) < 1) {
          if (context & 1024)
              report(state, 0);
          return parseIdentifier(state, context);
      }
      nextToken(state, context | 32768);
      if (context & 8388608)
          report(state, 31);
      state.flags |= 4;
      let argument = null;
      let delegate = false;
      if ((state.flags & 1) < 1) {
          delegate = consumeOpt(state, context, 16845363);
          if (state.token & 65536 || delegate) {
              argument = parseExpression(state, context, true);
          }
      }
      state.assignable = 2;
      return {
          type: 'YieldExpression',
          argument,
          delegate
      };
  }
  function parseAwaitExpression(state, context, inNewExpression, assignable) {
      state.flags |= 2;
      if ((context & 4194304) < 1) {
          if (context & 2048) {
              report(state, 29, 'await in module code');
          }
          const node = parseMemberOrUpdateExpression(state, context, parseIdentifierOrArrow(state, context, parseIdentifier(state, context), true), inNewExpression);
          if (!assignable)
              state.assignable = state.assignable = 2;
          return parseAssignmentExpression(state, context, node);
      }
      if (inNewExpression) {
          report(state, 87);
      }
      else if (context & 8388608) {
          reportAt(state, state.index, state.line, state.index, 30);
      }
      nextToken(state, context | 32768);
      const argument = parseLeftHandSideExpression(state, context, false);
      state.assignable = 2;
      return {
          type: 'AwaitExpression',
          argument
      };
  }
  function parseFunctionBody(state, context, scope, origin, firstRestricted) {
      consume(state, context | 32768, 2162700);
      const body = [];
      if (state.token !== 15) {
          if (!(context & 1024) && !(context & 8)) {
              while (state.token === 536936451) {
                  if (state.index - state.startIndex < 13 && state.tokenValue === 'use strict') {
                      context |= 1024;
                  }
                  body.push(parseDirective(state, context, scope));
              }
              if (context & 1024) {
                  if (state.flags & 128) {
                      reportAt(state, state.index, state.line, state.startIndex, 67);
                  }
                  if ((firstRestricted && firstRestricted === 225396) || firstRestricted === 225397) {
                      report(state, 39);
                  }
              }
          }
          while (state.token !== 15) {
              body.push(parseStatementListItem(state, context, scope));
          }
      }
      consume(state, origin & (2 | 1) ? context | 32768 : context, 15);
      return {
          type: 'BlockStatement',
          body
      };
  }
  function parseSuperExpression(state, context) {
      nextToken(state, context);
      switch (state.token) {
          case 65547: {
              if ((context & 524288) === 0)
                  report(state, 27);
              state.assignable = 2;
              break;
          }
          case 2162707:
          case 13: {
              if ((context & 262144) === 0)
                  report(state, 28);
              state.assignable = 1;
              break;
          }
          default:
              report(state, 29, 'super');
      }
      return { type: 'Super' };
  }
  function parseLeftHandSideExpression(state, context, assignable) {
      return parseMemberOrUpdateExpression(state, context, parsePrimaryExpressionExtended(state, context, 0, false, assignable), false);
  }
  function parseMemberOrUpdateExpression(state, context, expr, inNewExpression) {
      if ((state.token & 67174400) === 67174400) {
          return parseUpdateExpression(state, context, expr);
      }
      const { assignable } = state;
      switch (state.token) {
          case 13: {
              nextToken(state, context);
              if ((state.token & 0x10ff) < 0x1000)
                  report(state, 0);
              state.assignable = 1;
              return parseMemberOrUpdateExpression(state, context, {
                  type: 'MemberExpression',
                  object: expr,
                  computed: false,
                  property: parseIdentifier(state, context)
              }, inNewExpression);
          }
          case 2162707: {
              nextToken(state, context | 32768);
              const property = parseExpressions(state, (context | 8192) ^ 8192, true);
              state.assignable = state.assignable |=
                  (assignable | 1 | 2) ^
                      (1 | 2);
              expr = {
                  type: 'MemberExpression',
                  object: expr,
                  computed: true,
                  property
              };
              consume(state, context | 32768, 20);
              state.assignable = 1;
              return parseMemberOrUpdateExpression(state, context, expr, inNewExpression);
          }
          case 65547: {
              if (inNewExpression)
                  return expr;
              const args = parseArguments(state, context);
              state.assignable =
                  (state.assignable | 1 | 2) ^ 1;
              return parseMemberOrUpdateExpression(state, context, {
                  type: 'CallExpression',
                  callee: expr,
                  arguments: args
              }, inNewExpression);
          }
          case 4259849: {
              state.assignable = 2;
              return parseMemberOrUpdateExpression(state, context, {
                  type: 'TaggedTemplateExpression',
                  tag: expr,
                  quasi: parseTemplateLiteral(state, (context | 8192) ^ 8192)
              }, inNewExpression);
          }
          case 4259848: {
              state.assignable = 2;
              return parseMemberOrUpdateExpression(state, context, {
                  type: 'TaggedTemplateExpression',
                  tag: expr,
                  quasi: parseTemplate(state, (context | 8192) ^ 8192)
              }, inNewExpression);
          }
          default:
              if (inNewExpression)
                  state.assignable = 2;
              return expr;
      }
  }
  function parsePrimaryExpressionExtended(state, context, type, inNewExpression, allowAssignment) {
      const { token } = state;
      if ((token & 159744) === 159744) {
          if (token === 258154) {
              if (!allowAssignment) {
                  validateIdentifier(state, context, 0, token);
                  state.assignable = 1;
                  return parseIdentifier(state, context);
              }
              return parseYieldExpressionOrIdentifier(state, context);
          }
          if (token === 159852) {
              return parseAsyncExpression(state, context, inNewExpression, allowAssignment);
          }
          if (token === 225389) {
              return parseAwaitExpression(state, context, inNewExpression, allowAssignment);
          }
          if (state.token === 1073999944) {
              if (context & 1024) {
                  report(state, 71);
              }
              if (type & (8 | 16))
                  report(state, 65);
              state.assignable = 1;
          }
          else if (token === 225396 || token === 225397) {
              if (context & 1024) {
                  if ((token & 8388608) === 8388608) {
                      report(state, 0);
                  }
                  if ((token & 67174400) === 67174400) {
                      report(state, 0);
                  }
                  state.assignable = 2;
              }
              else {
                  state.assignable = 1;
              }
          }
          else {
              state.assignable = 1;
          }
          return parseIdentifierOrArrow(state, context, parseIdentifier(state, context), allowAssignment);
      }
      if ((token & 536870912) === 536870912) {
          state.assignable = 2;
          return parseLiteral(state, context);
      }
      if ((token & 67174400) === 67174400) {
          const updateToken = state.token;
          nextToken(state, context);
          if (inNewExpression)
              report(state, 57);
          const arg = parseLeftHandSideExpression(state, context, false);
          if (state.assignable & 2)
              report(state, 56);
          state.assignable = 2;
          return {
              type: 'UpdateExpression',
              argument: arg,
              operator: KeywordDescTable[updateToken & 255],
              prefix: true
          };
      }
      if ((token & 33619968) === 33619968) {
          if (inNewExpression && (token !== 33640492 || token !== 33640490)) {
              report(state, 66);
          }
          state.assignable = 2;
          return parseUnaryExpression(state, context);
      }
      switch (token) {
          case 65540:
              state.assignable = 2;
              return parseRegExpLiteral(state, context);
          case 86110:
              state.assignable = 2;
              return parseThisExpression(state, context);
          case 86021:
          case 86022:
          case 86023:
              state.assignable = 2;
              return parseNullOrTrueOrFalseLiteral(state, context);
          case 86108:
              return parseSuperExpression(state, context);
          case 86103:
              return parseFunctionExpression(state, context, 0);
          case 86093:
              return parseClassExpression(state, context, DO_NOT_BIND);
          case 4259849:
              return parseTemplateLiteral(state, context);
          case 4259848:
              return parseTemplate(state, (context | 8192) ^ 8192);
          case 86106:
              return parseNewExpression(state, context);
          case 2162700:
              return parseObjectExpression(state, context, {}, allowAssignment ? false : true);
          case 2162707:
              return parseArrayLiteral(state, context, {}, allowAssignment ? false : true);
          case 65547:
              return parseCoverParenthesizedExpressionAndArrowParameterList(state, context | 16384, undefined, allowAssignment, false);
          default:
              if ((token & 159744) === 159744 ||
                  (token & 12288) === 12288 ||
                  (token & 36864) === 36864) {
                  return parseIdentifier(state, context);
              }
              report(state, 29, KeywordDescTable[state.token & 255]);
      }
  }
  function parseTemplateLiteral(state, context) {
      state.assignable = 2;
      return {
          type: 'TemplateLiteral',
          expressions: [],
          quasis: [parseTemplateTail(state, context)]
      };
  }
  function parseTemplateTail(state, context) {
      const { tokenValue, tokenRaw } = state;
      consume(state, context | 32768, 4259849);
      return {
          type: 'TemplateElement',
          value: {
              cooked: tokenValue,
              raw: tokenRaw
          },
          tail: true
      };
  }
  function parseTemplate(state, context) {
      const quasis = [parseTemplateSpans(state, false)];
      consume(state, context | 32768, 4259848);
      const expressions = [
          parseExpression(state, ((context | 8192) ^ 8192) | 32768, true)
      ];
      if (state.token !== 15)
          report(state, 90);
      while ((state.token = scanTemplateTail(state, context)) !== 4259849) {
          quasis.push(parseTemplateSpans(state, false));
          consume(state, context | 32768, 4259848);
          expressions.push(parseExpression(state, context, true));
      }
      quasis.push(parseTemplateSpans(state, true));
      nextToken(state, context);
      return {
          type: 'TemplateLiteral',
          expressions,
          quasis
      };
  }
  function parseTemplateSpans(state, tail) {
      return {
          type: 'TemplateElement',
          value: {
              cooked: state.tokenValue,
              raw: state.tokenRaw
          },
          tail
      };
  }
  function parseSpreadElement(state, context) {
      consume(state, context | 32768, 14);
      const argument = parseExpression(state, (context | 8192) ^ 8192, true);
      return {
          type: 'SpreadElement',
          argument
      };
  }
  function parseArguments(state, context) {
      consume(state, context | 32768, 65547);
      const args = [];
      while (state.token !== 16) {
          args.push(state.token === 14
              ? parseSpreadElement(state, context)
              : parseExpression(state, (context | 8192) ^ 8192, true));
          if (state.token !== 18)
              break;
          consume(state, context | 32768, 18);
          if (state.token === 16)
              break;
      }
      consume(state, context, 16);
      return args;
  }
  function parseIdentifier(state, context) {
      const { tokenValue, tokenRaw } = state;
      nextToken(state, context);
      return context & 512
          ? {
              type: 'Identifier',
              name: tokenValue,
              raw: tokenRaw
          }
          : {
              type: 'Identifier',
              name: tokenValue
          };
  }
  function parseLiteral(state, context) {
      const { tokenValue, tokenRaw } = state;
      if (context & 1024 && state.flags & 64)
          report(state, 8);
      nextToken(state, context);
      return context & 512
          ? {
              type: 'Literal',
              value: tokenValue,
              raw: tokenRaw
          }
          : {
              type: 'Literal',
              value: tokenValue
          };
  }
  function parseNullOrTrueOrFalseLiteral(state, context) {
      const raw = KeywordDescTable[state.token & 255];
      const value = state.token === 86023 ? null : raw === 'true';
      nextToken(state, context);
      return context & 512
          ? {
              type: 'Literal',
              value,
              raw
          }
          : {
              type: 'Literal',
              value
          };
  }
  function parseThisExpression(state, context) {
      nextToken(state, context);
      return {
          type: 'ThisExpression'
      };
  }
  function parseArrayLiteral(state, context, scope, skipInit) {
      const expr = parseArrayExpressionOrPattern(state, context, scope, skipInit, 0);
      if (state.destructible & 8 && (state.token & 0x1030) !== 0x1030) {
          report(state, 63);
      }
      state.assignable =
          (state.destructible & 16) === 0 && context & 8192
              ? 1
              : 2;
      return expr;
  }
  function parseArrayExpressionOrPattern(state, context, scope, skipInit, type) {
      nextToken(state, context | 32768);
      const elements = [];
      let destructible = 0;
      let spreadStage = 0;
      context = (context | 268435456) ^ 268435456;
      while (state.token !== 20) {
          if (consumeOpt(state, context, 18)) {
              elements.push(null);
          }
          else {
              let left;
              if ((state.token & 159744) === 159744) {
                  left = parsePrimaryExpressionExtended(state, context, type, false, true);
                  if (consumeOpt(state, context | 32768, 8388637)) {
                      if (state.assignable & 2) {
                          reportAt(state, state.index, state.line, state.index - 3, 24);
                      }
                      let assignBefore = state.assignable;
                      left = {
                          type: 'AssignmentExpression',
                          operator: '=',
                          left,
                          right: parseExpression(state, context, true)
                      };
                      state.assignable =
                          state.assignable |
                              ((assignBefore | 2 | 1) ^
                                  (2 | 1));
                  }
                  else if (state.token === 18 || state.token === 20) {
                      destructible |= state.assignable;
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible |= state.assignable;
                      if (state.token === 18 || state.token === 20) {
                          if (state.assignable & 2) {
                              destructible |= 16;
                          }
                      }
                      else {
                          destructible =
                              (destructible |
                                  16 |
                                  32 |
                                  8) ^
                                  (16 | 32 | 8);
                          left = parseMemberOrUpdateExpression(state, context, left, false);
                          let notAssign = state.token !== 8388637;
                          if (state.token !== 18 && state.token !== 20) {
                              if (notAssign)
                                  destructible |= 16;
                              left = parseAssignmentExpression(state, context, left);
                          }
                          else if (notAssign) {
                              if (state.assignable & 2) {
                                  destructible |= 16;
                              }
                              else {
                                  destructible |= 32;
                              }
                          }
                      }
                      destructible |= state.assignable;
                  }
              }
              else if (state.token === 2162700) {
                  left = parseObjectExpressionOrPattern(state, context, scope, false, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 20) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      left = parseMemberOrUpdateExpression(state, context, left, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 20) {
                          if (notAssign)
                              destructible |= 16;
                          left = parseAssignmentExpression(state, context, left);
                      }
                      else if (notAssign) {
                          if (type !== 0 || state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else if (state.token === 2162707) {
                  left = parseArrayExpressionOrPattern(state, context, scope, skipInit, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 20) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      left = parseMemberOrUpdateExpression(state, context, left, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 20) {
                          if (notAssign)
                              destructible |= 16;
                          left = parseAssignmentExpression(state, context, left);
                      }
                      else if (notAssign) {
                          if (type !== 0 || state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else if (state.token === 14) {
                  left = parseRestOrSpreadElement(state, context, scope, 20, type, false);
                  destructible |= state.destructible;
                  if (state.token !== 18 && state.token !== 20)
                      report(state, 29, KeywordDescTable[(state.token, 255)]);
                  if (spreadStage === 0) {
                      spreadStage = 1;
                  }
              }
              else {
                  left = parseLeftHandSideExpression(state, context, true);
                  destructible =
                      state.assignable & 1 ? 0 : 16;
                  if (state.token === 18 || state.token === 20) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      left = parseMemberOrUpdateExpression(state, context, left, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 2162707) {
                          if (notAssign)
                              destructible |= 16;
                          left = parseAssignmentExpression(state, context, left);
                      }
                      else if (notAssign) {
                          if (type !== 0 || state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
              }
              elements.push(left);
              if (consumeOpt(state, context, 18)) {
                  state.assignable = 1;
                  if (spreadStage === 1) {
                      spreadStage = 2;
                      destructible |= 16;
                  }
                  if (state.token === 20) {
                      break;
                  }
              }
              else {
                  break;
              }
          }
      }
      consume(state, context, 20);
      let node = {
          type: 'ArrayExpression',
          elements
      };
      if (!skipInit) {
          if (consumeOpt(state, context, 8388637)) {
              if (destructible & 16 && destructible & 8) {
                  report(state, 24);
              }
              if (destructible & 16) {
                  report(state, 24);
              }
              destructible =
                  (destructible | 64 | 8) ^
                      (8 | 64);
              reinterpretToPattern(state, node);
              const right = parseExpression(state, context, true);
              destructible |=
                  (state.assignable | 16 | 32) ^
                      (16 | 32);
              node = {
                  type: 'AssignmentExpression',
                  left: node,
                  operator: '=',
                  right
              };
          }
          else if (state.token & 8388608) {
              report(state, 72);
          }
      }
      if (state.flags & 2)
          destructible |= 128;
      if (state.flags & 4)
          destructible |= 256;
      state.destructible = destructible;
      return node;
  }
  function parseRestOrSpreadElement(state, context, scope, closingToken, type, isAsync) {
      nextToken(state, context | 32768);
      let argument;
      let destructible = 0;
      if (state.token & (4096 | 159744)) {
          state.assignable = 1;
          argument = parsePrimaryExpressionExtended(state, context, type, false, true);
          let willBeSimple = state.token === closingToken || state.token === 18;
          argument = parseMemberOrUpdateExpression(state, context, argument, false);
          if (willBeSimple && state.assignable & 2) {
              destructible |= 16;
          }
          if (state.token !== 18 && state.token !== closingToken) {
              if (state.token === 8388637) {
                  if (state.assignable & 2) {
                      report(state, 74);
                  }
              }
              destructible |= 16;
              argument = parseAssignmentExpression(state, context, argument);
          }
          if (state.assignable & 2) {
              destructible |= 16;
          }
          else if (!willBeSimple) {
              destructible |= 32;
          }
      }
      else if (state.token === closingToken) {
          report(state, 40);
      }
      else if (state.token === 2162707) {
          argument = parseArrayExpressionOrPattern(state, context, scope, true, type);
          destructible = state.destructible;
          if (state.token !== 8388637 && state.token !== closingToken && state.token !== 18) {
              if (state.token === 18 || state.token === closingToken) {
                  if (state.assignable & 2) {
                      destructible |= 16;
                  }
              }
              else {
                  destructible =
                      (destructible |
                          16 |
                          32 |
                          8) ^
                          (16 | 32 | 8);
                  argument = parseMemberOrUpdateExpression(state, context, argument, false);
                  let notAssign = state.token !== 8388637;
                  if (state.token !== 18 && state.token !== closingToken) {
                      if (notAssign)
                          destructible |= 16;
                      argument = parseAssignmentExpression(state, context, argument);
                  }
                  else if (notAssign) {
                      if (type !== 0 || state.assignable & 2) {
                          destructible |= 16;
                      }
                      else {
                          destructible |= 32;
                      }
                  }
              }
          }
          state.assignable =
              state.destructible & 16
                  ? 2
                  : 1;
          if (closingToken === 15) {
              if (type !== 0) {
                  report(state, 75);
              }
              destructible |= 16;
          }
      }
      else if (state.token === 2162700) {
          argument = parseObjectExpressionOrPattern(state, context, scope, true, type);
          destructible |= state.destructible;
          if (state.token !== 8388637 && state.token !== closingToken && state.token !== 18) {
              if (state.token === 18 || state.token === closingToken) {
                  if (destructible & 2) {
                      destructible |= 16;
                  }
              }
              else {
                  destructible =
                      (destructible |
                          16 |
                          32 |
                          8) ^
                          (16 | 32 | 8);
                  argument = parseMemberOrUpdateExpression(state, context, argument, false);
                  let notAssign = state.token !== 8388637;
                  if (state.token !== 18 && state.token !== closingToken) {
                      if (notAssign)
                          destructible |= 16;
                      argument = parseAssignmentExpression(state, context, argument);
                  }
                  else if (notAssign) {
                      if (type !== 0 || state.assignable & 2) {
                          destructible |= 16;
                      }
                      else {
                          destructible |= 32;
                      }
                  }
              }
          }
          state.assignable =
              state.destructible & 16
                  ? 2
                  : 1;
          if (closingToken === 15) {
              if (type !== 0) {
                  report(state, 75);
              }
              destructible |= 16;
          }
      }
      else {
          state.assignable = 1;
          argument = parseLeftHandSideExpression(state, context, true);
          if (state.token === 8388637 && state.token !== closingToken && state.token !== 18) {
              if (state.assignable & 2) {
                  report(state, 41);
              }
              argument = parseAssignmentExpression(state, context, argument);
              destructible |= state.assignable | 16;
          }
          else {
              if (state.token !== 18 && state.token !== closingToken) {
                  argument = parseAssignmentExpression(state, context, argument);
              }
              if (state.assignable & 1) {
                  destructible |= 32;
              }
              else {
                  destructible |= 16;
              }
              destructible |= state.assignable;
          }
          if (closingToken === 15)
              destructible |= 16;
          state.destructible = destructible;
          return {
              type: 'SpreadElement',
              argument
          };
      }
      if (state.token !== closingToken) {
          if (type & 1) {
              if (!isAsync) {
                  if (state.token === 18) {
                      report(state, 59);
                  }
                  report(state, state.token === 8388637
                      ? 76
                      : state.token === 18
                          ? 77
                          : 78);
              }
          }
          if (consumeOpt(state, context, 8388637)) {
              if ((destructible | 8) & 16 &&
                  (destructible | 8) & 8) {
                  report(state, 24);
              }
              destructible = 16;
              reinterpretToPattern(state, argument);
              argument = {
                  type: 'AssignmentExpression',
                  left: argument,
                  operator: '=',
                  right: parseExpression(state, context, true)
              };
              destructible |= state.assignable;
          }
          destructible |= 16;
      }
      state.destructible = destructible;
      if (state.flags & 2) {
          destructible |= 128;
      }
      if (state.flags & 4) {
          destructible |= 256;
      }
      return {
          type: 'SpreadElement',
          argument
      };
  }
  function parseObjectExpression(state, context, scope, skipInit) {
      const expr = parseObjectExpressionOrPattern(state, (context | 8192) ^ 8192, scope, skipInit, 0);
      if (state.destructible & 8 && (state.token & 0x1030) !== 0x1030) {
          report(state, 63);
      }
      if (context & 256 && state.destructible & 64) {
          report(state, 64);
      }
      state.assignable =
          !(state.destructible & 16) && context & 8192
              ? 1
              : 2;
      return expr;
  }
  function parseObjectExpressionOrPattern(state, context, scope, skipInit, type) {
      nextToken(state, context);
      let properties = [];
      let kind = 0;
      let destructible = 0;
      let doubleDunderProto = 0;
      while (state.token !== 15) {
          properties.push(parseObjectProperty(state, context, scope, kind, type));
          if (state.destructible & 64) {
              ++doubleDunderProto;
          }
          destructible |= state.destructible;
          consumeOpt(state, context, 18);
      }
      consume(state, context, 15);
      if (doubleDunderProto === 1) {
          state.destructible = (state.destructible | 64) ^ 64;
      }
      const node = {
          type: 'ObjectExpression',
          properties
      };
      if (!skipInit) {
          if (state.token === 8388637) {
              nextToken(state, context);
              if ((destructible | 8) & 16 &&
                  (destructible | 8) & 8) {
                  report(state, 26);
              }
              destructible =
                  (destructible | 8 | 64) ^
                      (8 | 64);
              reinterpretToPattern(state, node);
              const right = parseExpression(state, context, true);
              destructible |=
                  (state.assignable | 16 | 32) ^
                      (16 | 32);
              state.destructible = destructible;
              return {
                  type: 'AssignmentExpression',
                  left: node,
                  operator: '=',
                  right
              };
          }
          else if (state.token & 8388608) {
              report(state, 73);
          }
      }
      state.destructible = destructible;
      return node;
  }
  function parseObjectProperty(state, context, scope, kind, type) {
      let key;
      let value;
      let token;
      let destructible = 0;
      if (state.token & (159744 | (state.token & 4096))) {
          token = state.token;
          let tokenValue = state.tokenValue;
          key = parseIdentifier(state, context);
          if (state.token === 18 || state.token === 15 || state.token === 8388637) {
              kind |= 4;
              if (tokenValue === 'eval' || tokenValue === 'arguments') {
                  if (context & 1024) {
                      destructible |= 16;
                  }
              }
              else {
                  validateIdentifier(state, context, type, token);
              }
              if (consumeOpt(state, context | 32768, 8388637)) {
                  destructible |= 8;
                  value = {
                      type: 'AssignmentPattern',
                      left: key,
                      right: parseExpression(state, (context | 8192) ^ 8192, true)
                  };
                  destructible |=
                      (state.assignable | 16 | 32) ^
                          (16 | 32);
              }
              else {
                  value = key;
              }
          }
          else if (consumeOpt(state, context | 32768, 21)) {
              if (((state.token & 4351) ^ 84) >
                  4096) {
                  if (tokenValue === '__proto__')
                      destructible |= 64;
                  const { token } = state;
                  value = parsePrimaryExpressionExtended(state, context, type, false, true);
                  let willBeUgly = token & 159744 && (state.token === 15 || state.token === 18);
                  value = parseMemberOrUpdateExpression(state, context, value, false);
                  let wasAssign = state.token === 8388637;
                  if (state.token !== 18 && state.token !== 15) {
                      value = parseAssignmentExpression(state, context, value);
                      if (!wasAssign)
                          destructible |= 16;
                  }
                  else if (state.assignable & 2) {
                      destructible |= 16;
                  }
                  else if (!willBeUgly) {
                      destructible |= 32;
                  }
              }
              else if (state.token === 2162707) {
                  state.assignable = 1;
                  value = parseArrayExpressionOrPattern(state, context, scope, false, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 15) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      value = parseMemberOrUpdateExpression(state, context, value, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 15) {
                          if (notAssign)
                              destructible |= 16;
                          value = parseAssignmentExpression(state, context, value);
                      }
                      else if (notAssign) {
                          if (state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else if (state.token === 2162700) {
                  value = parseObjectExpressionOrPattern(state, context, scope, false, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 15) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      value = parseMemberOrUpdateExpression(state, context, value, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 15) {
                          if (notAssign)
                              destructible |= 16;
                          value = parseAssignmentExpression(state, context, value);
                      }
                      else if (notAssign) {
                          if (state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else {
                  value = parseExpression(state, context, true);
                  destructible |=
                      (state.assignable & 1
                          ? 32
                          : 16) | state.assignable;
              }
          }
          else if (state.token === 2162707) {
              destructible |= 16;
              if (token === 159852)
                  kind |= 16;
              if (token === 12399)
                  kind |= 256;
              else if (token === 12400)
                  kind |= 512;
              else
                  kind |= 1;
              key = parseComputedPropertyName(state, context);
              destructible |= state.assignable;
              kind |= 2;
              value = parseMethodDefinition(state, context, kind);
          }
          else if (state.token & (159744 | 4096)) {
              destructible |= 16;
              if (token === 159852) {
                  if (state.flags & 1)
                      report(state, 0);
                  kind |= 16;
              }
              key = parseIdentifier(state, context);
              if (token === 12399)
                  kind |= 256;
              else if (token === 12400)
                  kind |= 512;
              else
                  kind |= 1;
              value = parseMethodDefinition(state, context, kind);
          }
          else if (state.token === 65547) {
              destructible |= 16;
              kind |= 1;
              value = parseMethodDefinition(state, context, kind);
          }
          else if (state.token === 16845363) {
              destructible |= 16;
              if (token === 12399 || token === 12400) {
                  report(state, 42);
              }
              nextToken(state, context);
              kind |= 8 | 1;
              if (token === 159852)
                  kind |= 16;
              if (((state.token & 4351) ^ 84) >
                  4096) {
                  key = parseIdentifier(state, context);
              }
              else if ((state.token & 536870912) === 536870912) {
                  key = parseLiteral(state, context);
              }
              else if (state.token === 2162707) {
                  kind |= 2;
                  key = parseComputedPropertyName(state, context);
                  destructible |= state.assignable;
              }
              else {
                  report(state, 29, KeywordDescTable[state.token & 255]);
              }
              value = parseMethodDefinition(state, context, kind);
          }
          else if ((state.token & 536870912) === 536870912) {
              if (token === 159852)
                  kind |= 16;
              if (token === 12399)
                  kind |= 256;
              else if (token === 12400)
                  kind |= 512;
              else
                  kind |= 1;
              destructible |= 16;
              key = parseLiteral(state, context);
              value = parseMethodDefinition(state, context, kind);
          }
          else {
              report(state, 29, KeywordDescTable[state.token & 255]);
          }
      }
      else if ((state.token & 536870912) === 536870912) {
          const tokenValue = state.tokenValue;
          key = parseLiteral(state, context);
          if (state.token === 21) {
              consume(state, context | 32768, 21);
              if (tokenValue === '__proto__')
                  destructible |= 64;
              if (((state.token & 4351) ^ 84) >
                  4096) {
                  const { token } = state;
                  value = parsePrimaryExpressionExtended(state, context, type, false, true);
                  let willBeUgly = token & 159744 && (state.token === 15 || state.token === 18);
                  value = parseMemberOrUpdateExpression(state, context, value, false);
                  let wasAssign = state.token === 8388637;
                  if (state.token !== 18 && state.token !== 15) {
                      value = parseAssignmentExpression(state, context, value);
                      if (!wasAssign)
                          destructible |= 16;
                  }
                  else if (state.assignable & 2) {
                      destructible |= 16;
                  }
                  else if (!willBeUgly) {
                      destructible |= 32;
                  }
              }
              else if (state.token === 2162707) {
                  state.assignable = 1;
                  value = parseArrayExpressionOrPattern(state, context, scope, false, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 15) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      value = parseMemberOrUpdateExpression(state, context, value, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 15) {
                          if (notAssign)
                              destructible |= 16;
                          value = parseAssignmentExpression(state, context, value);
                      }
                      else if (notAssign) {
                          if (state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else if (state.token === 2162700) {
                  value = parseObjectExpressionOrPattern(state, context, scope, false, type);
                  destructible |= state.destructible;
                  state.assignable =
                      state.destructible & 16
                          ? 2
                          : 1;
                  if (state.token === 18 || state.token === 15) {
                      if (state.assignable & 2) {
                          destructible |= 16;
                      }
                  }
                  else {
                      destructible =
                          (destructible |
                              16 |
                              32 |
                              8) ^
                              (16 | 32 | 8);
                      value = parseMemberOrUpdateExpression(state, context, value, false);
                      let notAssign = state.token !== 8388637;
                      if (state.token !== 18 && state.token !== 15) {
                          if (notAssign)
                              destructible |= 16;
                          value = parseAssignmentExpression(state, context, value);
                      }
                      else if (notAssign) {
                          if (state.assignable & 2) {
                              destructible |= 16;
                          }
                          else {
                              destructible |= 32;
                          }
                      }
                  }
                  destructible |= state.assignable;
              }
              else {
                  value = parseExpression(state, context, true);
                  destructible |=
                      (state.assignable & 1
                          ? 32
                          : 16) | state.assignable;
              }
          }
          else if (state.token === 65547) {
              kind |= 1;
              value = parseMethodDefinition(state, context, kind);
              destructible = state.assignable | 16;
          }
          else {
              report(state, 0);
          }
      }
      else if (state.token === 2162707) {
          key = parseComputedPropertyName(state, context);
          let computedKeyAssignable = state.assignable;
          kind |= 2;
          if (state.token === 21) {
              nextToken(state, context | 32768);
              state.assignable = 1;
              value = parseMemberOrUpdateExpression(state, context, parsePrimaryExpressionExtended(state, context, type, false, true), false);
              let lhsAssignable = state.assignable;
              if (state.assignable & 2 ||
                  (state.token !== 18 && state.token !== 15 && state.token !== 8388637)) {
                  destructible |= 16;
              }
              value = parseAssignmentExpression(state, context, value);
              state.assignable = computedKeyAssignable | lhsAssignable | state.assignable;
          }
          else {
              if (state.token !== 65547) {
                  report(state, 43);
              }
              kind |= 1;
              value = parseMethodDefinition(state, context, kind);
              destructible |= state.assignable | 16;
          }
      }
      else if (state.token === 14) {
          return parseRestOrSpreadElement(state, context, scope, 15, 0, false);
      }
      else if (state.token === 16845363) {
          consume(state, context | 32768, 16845363);
          kind |= 8;
          if (((state.token & 4351) ^ 84) >
              4096) {
              const { token, line, index } = state;
              key = parseIdentifier(state, context);
              kind |= 1;
              if (state.token === 65547) {
                  destructible |= 16;
                  value = parseMethodDefinition(state, context, kind);
              }
              else if (token === 159852) {
                  reportAt(state, index, line, index, 45);
              }
              else if (token === 12399 || state.token === 12400) {
                  reportAt(state, index, line, index, 44);
              }
              else {
                  reportAt(state, index, line, index, 46, KeywordDescTable[token & 255]);
              }
          }
          else if ((state.token & 536870912) === 536870912) {
              destructible |= 16;
              key = parseLiteral(state, context);
              kind |= 1;
              value = parseMethodDefinition(state, context, kind);
          }
          else if (state.token === 2162707) {
              destructible |= 16;
              kind |= 2;
              key = parseComputedPropertyName(state, context);
              kind |= 1;
              destructible |= state.assignable;
              value = parseMethodDefinition(state, context, kind);
              destructible |= state.assignable;
          }
          else {
              report(state, 29, KeywordDescTable[state.token & 255]);
          }
      }
      else {
          report(state, 29, KeywordDescTable[state.token & 255]);
      }
      if (state.flags & 2)
          destructible |= 128;
      if (state.flags & 4)
          destructible |= 256;
      state.destructible = destructible;
      return {
          type: 'Property',
          key,
          value,
          kind: !(kind & 768) ? 'init' : kind & 512 ? 'set' : 'get',
          computed: (kind & 2) > 0,
          method: (kind & 1) > 0,
          shorthand: (kind & 4) > 0
      };
  }
  function parseMethodDefinition(state, context, kind) {
      const functionScope = createScope(1);
      const kindFlags = (kind & 64) === 0 ? 31981568 : 14680064;
      context =
          ((context | kindFlags) ^ kindFlags) |
              ((kind & 88) << 18) |
              100925440;
      const paramScoop = SCOPE_addLexTo(functionScope, 1);
      const params = parseFormalParameters(state, context | 8388608, paramScoop, kind);
      const body = parseFunctionBody(state, (context | 134217728 | 1610612736) ^ (134217728 | 1610612736), SCOPE_addLexTo(functionScope, 1), 0, void 0);
      return {
          type: 'FunctionExpression',
          params,
          body,
          async: (kind & 16) > 0,
          generator: (kind & 8) > 0,
          id: null
      };
  }
  function parseComputedPropertyName(state, context) {
      nextToken(state, context | 32768);
      const key = parseExpression(state, (context | 8192) ^ 8192, true);
      consume(state, context, 20);
      return key;
  }
  function parseCoverParenthesizedExpressionAndArrowParameterList(state, context, isAsync, assignable, asyncNewLine, deletearg = false) {
      if (!deletearg)
          nextToken(state, context | 32768);
      const scope = createScope(1);
      if (state.token === 16) {
          if (isAsync) {
              nextToken(state, context);
              return parseAfterAsyncGroup(state, context, 0, asyncNewLine, [], isAsync, assignable);
          }
          nextToken(state, context | 32768);
          if (!assignable || state.token !== 10) {
              report(state, 29, KeywordDescTable[state.token & 255]);
          }
          else if (state.flags & 1)
              report(state, 47);
          return parseArrowFunctionExpression(state, context, [], 0);
      }
      let destructible = 0;
      let expr;
      let expressions = [];
      let toplevelComma = false;
      let prevAssignable = assignable;
      while (state.token !== 16) {
          if (((state.token & 4351) ^ 84) >
              4096) {
              const token = state.token;
              expr = parsePrimaryExpressionExtended(state, context, 0, false, true);
              if (consumeOpt(state, context | 32768, 8388637)) {
                  state.flags |= 128;
                  state.assignable = 1;
                  validateIdentifier(state, context, 0, token);
                  const right = parseExpression(state, (context | 8192) ^ 8192, true);
                  destructible |=
                      (destructible |
                          ((state.assignable | 2 | 1) ^
                              (2 | 1)) |
                          ((1 | 2) ^ 1) |
                          16 |
                          32) ^
                          (16 | 32);
                  state.assignable = 2;
                  expr = {
                      type: 'AssignmentExpression',
                      left: expr,
                      operator: '=',
                      right
                  };
              }
              else if (state.token === 18 || state.token === 16) {
                  if (state.assignable & 2) {
                      destructible |= 16;
                  }
                  destructible |= state.assignable;
              }
              else {
                  destructible |= 16;
                  expr = parseAssignmentExpression(state, context, parseMemberOrUpdateExpression(state, context, expr, false));
                  destructible |= state.assignable;
              }
          }
          else if (state.token === 2162700) {
              expr = parseObjectExpressionOrPattern(state, context, scope, false, 2);
              state.flags |= 128;
              destructible |= state.destructible;
              if (state.token !== 18 && state.token !== 16) {
                  destructible |= 16;
                  state.assignable = 2;
                  expr = parseMemberOrUpdateExpression(state, context, expr, false);
                  destructible |= state.assignable;
                  if (context & 16384) {
                      expr = parseAssignmentExpression(state, context, expr);
                      destructible |= state.assignable;
                  }
              }
              else {
                  state.assignable = destructible =
                      (destructible | 1 | 2) ^ 1;
              }
          }
          else if (state.token === 2162707) {
              expr = parseArrayExpressionOrPattern(state, context, scope, false, 2);
              destructible |= state.destructible;
              state.flags |= 128;
              if (state.token !== 18 && state.token !== 16) {
                  destructible |= 16;
                  state.assignable = 2;
                  expr = parseMemberOrUpdateExpression(state, context, expr, false);
                  destructible |= state.assignable;
                  if (context & 16384) {
                      expr = parseAssignmentExpression(state, context, expr);
                      destructible |= state.assignable;
                  }
              }
              else {
                  state.assignable = destructible =
                      (destructible | 1 | 2) ^ 1;
              }
          }
          else if (state.token === 14) {
              expr = parseRestOrSpreadElement(state, context, scope, 16, 1, !!isAsync);
              state.flags |= 128;
              if (!isAsync) {
                  if (state.destructible & 16 || state.token === 18) {
                      report(state, 79);
                  }
                  if (state.token === 8388637)
                      report(state, 80);
                  if (state.token === 18)
                      report(state, 59);
                  if (state.token !== 16)
                      report(state, 78);
              }
              destructible |= state.destructible;
              if (isAsync) {
                  if (state.token !== 16) {
                      destructible |= 16;
                  }
              }
              else {
                  if (toplevelComma && (state.token === 18 || state.token === 16)) {
                      expressions.push(expr);
                  }
                  destructible |= 8;
                  break;
              }
          }
          else {
              destructible |= 16;
              expr = parseExpression(state, context, true);
              destructible = state.assignable;
              if (toplevelComma && (state.token === 18 || state.token === 16)) {
                  expressions.push(expr);
              }
              if (state.token === 18) {
                  if (!toplevelComma) {
                      toplevelComma = true;
                      expressions = [expr];
                  }
              }
              if (toplevelComma) {
                  while (consumeOpt(state, context | 32768, 18)) {
                      expressions.push(parseExpression(state, context, true));
                  }
                  state.assignable =
                      (state.assignable | 1 | 2) ^ 1;
                  expr = {
                      type: 'SequenceExpression',
                      expressions
                  };
              }
              destructible |= state.assignable;
              if (toplevelComma) {
                  destructible =
                      (destructible | 1 | 2) ^ 1;
              }
              consume(state, context, 16);
              state.destructible = destructible;
              return isAsync
                  ? parseAfterAsyncGroup(state, context, 16, asyncNewLine, toplevelComma ? expressions : [expr], isAsync, assignable)
                  : expr;
          }
          if (toplevelComma && (state.token === 18 || state.token === 16)) {
              expressions.push(expr);
          }
          if (!consumeOpt(state, context | 32768, 18))
              break;
          if (!toplevelComma) {
              toplevelComma = true;
              expressions = [expr];
          }
          if (state.token === 16) {
              destructible |= 8;
              break;
          }
      }
      assignable = prevAssignable;
      if (toplevelComma) {
          destructible =
              (destructible | 1 | 2) ^ 1;
      }
      consume(state, context, 16);
      if (toplevelComma) {
          expr = {
              type: 'SequenceExpression',
              expressions
          };
      }
      if (destructible & 16 && destructible & 8) {
          report(state, 29);
      }
      if (isAsync)
          return parseAfterAsyncGroup(state, context, destructible, asyncNewLine, toplevelComma ? expressions : [expr], isAsync, assignable);
      if (state.token === 10) {
          if (state.flags & 1)
              report(state, 47);
          if (!assignable)
              report(state, 48);
          if (destructible & 16)
              report(state, 25);
          if (destructible & 32) {
              report(state, 49);
          }
          if (context & (2048 | 4194304) && state.flags & 2)
              report(state, 48);
          if (context & (1024 | 2097152) && state.flags & 4)
              report(state, 48);
          if (state.destructible & 128)
              report(state, 81);
          state.assignable = 2;
          return parseArrowFunctionExpression(state, context, toplevelComma ? expressions : [expr], 0);
      }
      if (destructible & 8) {
          report(state, 29);
      }
      else if ((state.token & 8388608) === 8388608) {
          if (!assignable)
              report(state, 48);
          if (toplevelComma)
              report(state, 82);
          if (destructible & 2) {
              report(state, 24);
          }
          const operator = state.token;
          nextToken(state, context | 32768);
          const right = parseExpression(state, context, true);
          destructible |=
              (state.assignable | 16 | 32) ^
                  (16 | 32);
          expr = {
              type: 'AssignmentExpression',
              left: expr,
              operator: KeywordDescTable[operator & 255],
              right
          };
          state.assignable = 1;
          state.destructible =
              (destructible | 1 | 2) ^ 1;
      }
      state.destructible = destructible;
      return expr;
  }
  function parseIdentifierOrArrow(state, context, expr, assignable) {
      if (state.token === 10) {
          if (state.flags & 1) {
              report(state, 47);
          }
          if (!assignable) {
              report(state, 58);
          }
          return parseArrowFunctionExpression(state, context, [expr], 0);
      }
      return expr;
  }
  function parseArrowFunctionExpression(state, context, params, isAsync) {
      nextToken(state, context | 32768);
      for (let i = 0; i < params.length; ++i) {
          reinterpretToPattern(state, params[i]);
      }
      const scope = createScope(1);
      context = ((context | 15728640) ^ 15728640) | (isAsync << 22);
      let expression = false;
      let body;
      if (state.token === 2162700) {
          body = parseFunctionBody(state, (context | 134217728 | 1610612736 | 8192) ^
              (134217728 | 1610612736 | 8192), scope, 2, void 0);
      }
      else {
          expression = true;
          body = parseExpression(state, (context | 8192) ^ 8192, true);
      }
      state.assignable = 2;
      return {
          type: 'ArrowFunctionExpression',
          body,
          params,
          id: null,
          async: isAsync === 1,
          generator: false,
          expression
      };
  }
  function parseFunctionDeclaration(state, context, scope, origin, requireIdentifier, isAsync) {
      nextToken(state, context | 32768);
      const statementOrigin = origin & 8;
      const isGenerator = statementOrigin === 0 ? optionalBit(state, context, 16845363) : 0;
      let id = null;
      let firstRestricted;
      let funcScope = createScope(1);
      if (state.token & 159744) {
          const type = (context & 6144) === 4096 ? 2 : 4;
          validateIdentifier(state, context | ((context & 3072) << 11), type, state.token);
          if (statementOrigin === 1) {
              scope = SCOPE_addLexTo(scope, 1);
          }
          firstRestricted = state.token;
          id = parseIdentifier(state, context);
      }
      else if (!requireIdentifier) {
          report(state, 38, 'Function');
      }
      context =
          ((context | 32243712) ^ 32243712) |
              67108864 |
              ((isAsync * 2 + isGenerator) << 21);
      const paramScoop = SCOPE_addLexTo(funcScope, 1);
      return {
          type: 'FunctionDeclaration',
          params: parseFormalParameters(state, context | 8388608, paramScoop, 0),
          body: parseFunctionBody(state, (context =
              (context | 134217728 | 1610612736) ^ (134217728 | 1610612736)), SCOPE_addLexTo(paramScoop, 1), 1, firstRestricted),
          async: isAsync === 1,
          generator: isGenerator === 1,
          expression: false,
          id
      };
  }
  function parseFunctionExpression(state, context, isAsync) {
      nextToken(state, context | 32768);
      const isGenerator = optionalBit(state, context, 16845363);
      const generatorAndAsyncFlags = (isAsync * 2 + isGenerator) << 21;
      let id = null;
      let firstRestricted;
      let functionScope = createScope(1);
      if (((state.token & 4351) ^ 84) >
          4096) {
          validateIdentifier(state, ((context | 0x1ec0000) ^ 0x1ec0000) | generatorAndAsyncFlags, 4, state.token);
          functionScope = createScope(1);
          firstRestricted = state.token;
          id = parseIdentifier(state, context);
      }
      context =
          ((context | 32243712) ^ 32243712) |
              67108864 |
              generatorAndAsyncFlags;
      const paramScoop = SCOPE_addLexTo(functionScope, 1);
      const params = parseFormalParameters(state, context | 8388608, paramScoop, 0);
      const body = parseFunctionBody(state, (context | 134217728 | 1610612736) ^ (134217728 | 1610612736), SCOPE_addLexTo(paramScoop, 1), 0, firstRestricted);
      state.assignable = 2;
      return {
          type: 'FunctionExpression',
          params,
          body,
          async: isAsync === 1,
          generator: isGenerator === 1,
          expression: false,
          id
      };
  }
  function parseFormalParameters(state, context, scope, kind) {
      consume(state, context, 65547);
      const params = [];
      state.flags = (state.flags | 128) ^ 128;
      while (state.token !== 16) {
          params.push(parseFormalsList(state, context, scope, kind));
          if (state.token !== 16)
              consume(state, context, 18);
      }
      if (context & 33554432) {
          if (kind & 512 && params.length !== 1) {
              report(state, 36, 'Setter', 'one', '');
          }
          if (kind & 256 && params.length > 0) {
              report(state, 36, 'Getter', 'no', 's');
          }
      }
      consume(state, context, 16);
      return params;
  }
  function parseFormalsList(state, context, scope, modiifers) {
      let left = parseBindingIdentifierOrPattern(state, context, scope, 1, modiifers, false);
      if (consumeOpt(state, context, 8388637)) {
          state.flags |= 128;
          left = {
              type: 'AssignmentPattern',
              left,
              right: parseExpression(state, context, true)
          };
      }
      return left;
  }
  function parseNewExpression(state, context) {
      const id = parseIdentifier(state, context | 32768);
      if (consumeOpt(state, context, 13)) {
          if ((context & 67108864) < 1 || state.tokenValue !== 'target')
              report(state, 0);
          state.assignable = 2;
          return parseMetaProperty(state, context, id);
      }
      const callee = parseMemberOrUpdateExpression(state, context, parsePrimaryExpressionExtended(state, context, 0, true, false), true);
      let args = [];
      if (state.token === 65547) {
          args = parseArguments(state, (context | 8192) ^ 8192);
          state.assignable =
              (state.assignable | 1 | 2) ^ 1;
      }
      return {
          type: 'NewExpression',
          callee,
          arguments: args
      };
  }
  function parseMetaProperty(state, context, meta) {
      return {
          type: 'MetaProperty',
          meta,
          property: parseIdentifier(state, context)
      };
  }
  function parseAsyncExpression(state, context, inNewExpression, assignable) {
      let expr = parseIdentifier(state, context);
      if (state.token === 16865073 || state.token === 16865074 || state.token === 0) {
          return parseIdentifierOrArrow(state, context, expr, assignable);
      }
      if ((state.flags & 1) === 0) {
          if (state.token === 86103) {
              return parseFunctionExpression(state, context, 1);
          }
          if ((state.token & 159744) === 159744 ||
              ((state.token & 20480) === 20480 && state.token === 10)) {
              if (state.assignable & 2)
                  report(state, 48);
              if (state.token === 225389)
                  report(state, 30);
              const arg = parseIdentifier(state, context);
              if (state.token !== 10)
                  report(state, 52);
              if (state.flags & 1)
                  report(state, 47);
              return parseArrowFunctionExpression(state, context, [arg], 1);
          }
      }
      if (state.token === 65547) {
          return inNewExpression
              ? expr
              : parseCoverParenthesizedExpressionAndArrowParameterList(state, context, expr, assignable, (state.flags & 1) !== 0);
      }
      else if (state.token === 10) {
          if (state.flags & 1)
              report(state, 24);
          if (state.assignable & 2)
              report(state, 24);
          if (context & (2097152 | 4194304) && state.token === 258154)
              report(state, 24);
          expr = parseArrowFunctionExpression(state, context, [expr], 0);
      }
      return parseMemberOrUpdateExpression(state, context, expr, inNewExpression);
  }
  function parseAfterAsyncGroup(state, context, destructible, asyncNewLine, params, expr, assignable) {
      if (state.token === 10) {
          if (state.flags & 1) {
              report(state, 47);
          }
          else if (asyncNewLine) {
              report(state, 47);
          }
          else if (!assignable) {
              report(state, 48);
          }
          else if (destructible & (16 | 32)) {
              if (state.token === 10) {
                  report(state, 49);
              }
          }
          else if (state.flags & 2) {
              report(state, 30);
          }
          else if (context & (1024 | 2097152) && state.flags & 4) {
              report(state, 31);
          }
          return parseArrowFunctionExpression(state, context, params, 1);
      }
      else {
          return {
              type: 'CallExpression',
              callee: expr,
              arguments: params
          };
      }
  }
  function parseRegExpLiteral(state, context) {
      const { tokenRegExp: regex, tokenValue: value } = state;
      nextToken(state, context);
      return {
          type: 'Literal',
          value,
          regex
      };
  }
  function parseClassDeclaration(state, context, scope, requireIdentifier) {
      nextToken(state, context);
      context =
          (context = (context | 16778240) ^ 16778240) | 1024;
      let id = null;
      let superClass = null;
      if (((state.token & 4351) ^ 84) >
          4096) {
          validateIdentifier(state, context, 32, state.token);
          id = parseIdentifier(state, context);
      }
      else if (!requireIdentifier) {
          report(state, 38, 'Class');
      }
      if (consumeOpt(state, context | 32768, 20564)) {
          superClass = parseLeftHandSideExpression(state, context, false);
          context |= 524288;
      }
      else {
          context = (context | 524288) ^ 524288;
      }
      const body = parseClassBodyAndElementList(state, context, scope, 0, 1);
      return {
          type: 'ClassDeclaration',
          id,
          superClass,
          body
      };
  }
  function parseClassExpression(state, context, scope) {
      nextToken(state, context);
      context =
          (context = (context | 16778240) ^ 16778240) | 1024;
      let id = null;
      let superClass = null;
      if (((state.token & 4351) ^ 84) >
          4096) {
          validateIdentifier(state, context, 32, state.token);
          id = parseIdentifier(state, context);
      }
      if (consumeOpt(state, context | 32768, 20564)) {
          superClass = parseLeftHandSideExpression(state, context, false);
          context |= 524288;
      }
      else {
          context = (context | 524288) ^ 524288;
      }
      const body = parseClassBodyAndElementList(state, context, scope, 0, 0);
      state.assignable = 2;
      return {
          type: 'ClassExpression',
          id,
          superClass,
          body
      };
  }
  function parseClassBodyAndElementList(state, context, scope, type, origin) {
      consume(state, context | 32768, 2162700);
      const body = [];
      while (state.token !== 15) {
          if (consumeOpt(state, context, 17))
              continue;
          body.push(parseClassElementList(state, context, scope, type, 0));
      }
      state.flags = (state.flags | 32) ^ 32;
      consume(state, origin & 1 ? context | 32768 : context, 15);
      return {
          type: 'ClassBody',
          body
      };
  }
  function parseClassElementList(state, context, scope, type, kind) {
      let key;
      let { token, tokenValue } = state;
      if (state.token & 159744) {
          key = parseIdentifier(state, context);
          switch (token) {
              case 192617:
                  if ((kind & 32) === 0 && state.token !== 65547) {
                      return parseClassElementList(state, context, scope, type, 32);
                  }
                  break;
              case 159852:
                  if (state.token !== 65547 && (state.flags & 1) === 0) {
                      if (consumeOpt(state, context, 16845363))
                          kind |= 8;
                      tokenValue = state.tokenValue;
                      if (state.token & 159744) {
                          if (state.tokenValue === 'prototype')
                              report(state, 0);
                          if (state.flags & 1)
                              report(state, 47);
                          key = parseIdentifier(state, context);
                      }
                      else if (state.token === 536936450 || state.token === 536936451) {
                          key = parseLiteral(state, context);
                      }
                      else if (state.token === 2162707) {
                          kind |= 2;
                          key = parseComputedPropertyName(state, context);
                      }
                      else {
                          report(state, 29);
                      }
                      kind |= 16;
                  }
                  break;
              case 12399:
                  if (state.token !== 65547) {
                      tokenValue = state.tokenValue;
                      if (state.token & 159744) {
                          key = parseIdentifier(state, context);
                      }
                      else if (state.token === 536936450 || state.token === 536936451) {
                          key = parseLiteral(state, context);
                      }
                      else if (state.token === 2162707) {
                          kind |= 2;
                          key = parseComputedPropertyName(state, context);
                      }
                      else {
                          report(state, 29);
                      }
                      kind |= 256;
                  }
                  break;
              case 12400:
                  if (state.token !== 65547) {
                      tokenValue = state.tokenValue;
                      if (state.token & 159744) {
                          key = parseIdentifier(state, context);
                      }
                      else if (state.token === 536936450 || state.token === 536936451) {
                          key = parseLiteral(state, context);
                      }
                      else if (state.token === 2162707) {
                          kind |= 2;
                          key = parseComputedPropertyName(state, context);
                      }
                      else {
                          report(state, 29, KeywordDescTable[state.token & 255]);
                      }
                      kind |= 512;
                  }
                  break;
              default:
          }
      }
      else if (state.token === 2162707) {
          kind |= 2;
          key = parseComputedPropertyName(state, context);
      }
      else if (state.token === 536936450 || state.token === 536936451) {
          if (state.tokenValue === 'constructor')
              kind |= 64;
          key = parseLiteral(state, context);
      }
      else if (state.token === 16845363) {
          nextToken(state, context);
          tokenValue = state.tokenValue;
          if (state.token & 159744) {
              key = parseIdentifier(state, context);
          }
          else if (state.token === 536936450 || state.token === 536936451) {
              key = parseLiteral(state, context);
          }
          else if (state.token === 2162707) {
              kind |= 2;
              key = parseComputedPropertyName(state, context);
          }
          else {
              report(state, 29, KeywordDescTable[state.token & 255]);
          }
          if (state.tokenValue === 'prototype')
              report(state, 0);
          kind |= 8;
      }
      else {
          report(state, 29, KeywordDescTable[state.token & 255]);
      }
      if ((kind & 2) === 0 &&
          kind & (32 | 16 | 768) &&
          state.tokenValue === 'prototype') {
          report(state, 53);
      }
      if (tokenValue === 'constructor') {
          if ((kind & 32) === 0) {
              if (kind & (768 | 16 | 8))
                  report(state, 54, 'accessor');
              if ((context & 524288) === 0 && (kind & 2) === 0) {
                  if (state.flags & 32)
                      report(state, 55);
                  else
                      state.flags |= 32;
              }
          }
          kind |= 64;
      }
      if (state.token !== 65547)
          reportAt(state, state.index, state.line, state.index + 3, 23, '(');
      state.destructible = 16;
      return {
          type: 'MethodDefinition',
          kind: (kind & 32) === 0 && kind & 64
              ? 'constructor'
              : kind & 256
                  ? 'get'
                  : kind & 512
                      ? 'set'
                      : 'method',
          static: (kind & 32) !== 0,
          computed: (kind & 2) !== 0,
          key,
          value: parseMethodDefinition(state, context, kind)
      };
  }
  function parseBindingIdentifierOrPattern(state, context, scope, type, kind, dupeChecks) {
      if (((state.token & 4351) ^ 84) >
          4096) {
          validateIdentifier(state, context, type, state.token);
          if ((context & 1024) === 0 &&
              (state.assignable & 1) === 1) ;
          SCOPE_addBinding(state, context, scope, state.tokenValue, type, dupeChecks);
          return parseIdentifier(state, context);
      }
      let left;
      switch (state.token) {
          case 2162707:
              left = parseArrayExpressionOrPattern(state, context, scope, true, type);
              reinterpretToPattern(state, left);
              break;
          case 2162700:
              left = parseObjectExpressionOrPattern(state, context, scope, true, type);
              reinterpretToPattern(state, left);
              break;
          case 14:
              if (kind & 512)
                  report(state, 37);
              left = parseRestOrSpreadElement(state, context, scope, 16, type, false);
              reinterpretToPattern(state, left);
              break;
          default:
              report(state, 29, KeywordDescTable[state.token & 255]);
      }
      state.flags |= 128;
      if (state.destructible & 16)
          report(state, 50);
      if (state.destructible & 32)
          report(state, 51);
      return left;
  }

  function parseStatementListItem(state, context, scope) {
      switch (state.token) {
          case 20563:
              return parseExportDeclaration(state, context, scope);
          case 86105:
              return parseImportDeclaration(state, context);
          case 86103:
              return parseFunctionDeclaration(state, context, scope, 16, false, 0);
          case 159852:
              return parseCoverCallExpressionAndAsyncArrowHead(state, context, scope);
          case 86093:
              return parseClassDeclaration(state, context, scope, false);
          case 1073827913:
              return parseVariableStatement(state, context, scope, 16, 8);
          case 1073999944:
              return parseVariableOrLabeledStatement(state, context, scope, 8);
          default:
              return parseStatement(state, context, scope);
      }
  }
  function parseStatement(state, context, scope) {
      switch (state.token) {
          case 2162700:
              return parseBlock(state, context, SCOPE_addLexTo(scope, 1));
          case 1073827911:
              return parseVariableStatement(state, context, scope, 4, 8);
          case 20571:
              return parseReturnStatement(state, context);
          case 20568:
              return parseIfStatement(state, context, scope);
          case 20561:
              return parseDoWhileStatement(state, context, scope);
          case 20577:
              return parseWhileStatement(state, context, scope);
          case 20566:
              return parseForStatement(state, context, scope);
          case 86109:
              return parseSwitchStatement(state, context, scope);
          case 17:
              return parseEmptyStatement(state, context);
          case 86111:
              return parseThrowStatement(state, context);
          case 20554:
              return parseBreakStatement(state, context);
          case 20558:
              return parseContinueStatement(state, context);
          case 20576:
              return parseTryStatement(state, context, scope);
          case 20578:
              return parseWithStatement(state, context, scope);
          case 20559:
              return parseDebuggerStatement(state, context);
          case 86103:
              report(state, context & 1024
                  ? 83
                  : (context & 256) === 0
                      ? 85
                      : 84);
          case 86093:
              report(state, 86);
          default:
              return parseExpressionOrLabelledStatement(state, context, scope);
      }
  }
  function parseExpressionOrLabelledStatement(state, context, scope) {
      let expr;
      if (state.token & 536870912) {
          state.assignable = 2;
          expr = parseLiteral(state, context);
      }
      else if (state.token & 159744) {
          if ((state.token & 33619968) === 33619968) {
              state.assignable = 1;
              return parseExpressionStatement(state, context, parseAssignmentExpression(state, context, parseUnaryExpression(state, context)));
          }
          switch (state.token) {
              case 1073999944:
                  expr = parseIdentifier(state, context);
                  if (context & 1024)
                      report(state, 92);
                  if (state.token === 21)
                      return parseLabelledStatement(state, context, scope, expr);
                  if (state.token === 2162707 && state.flags & 1) {
                      report(state, 91);
                  }
                  break;
              case 225389:
                  expr = parseAwaitExpression(state, context, false, true);
                  break;
              case 258154:
                  expr = parseMemberOrUpdateExpression(state, context, parseYieldExpressionOrIdentifier(state, context), false);
                  if (state.token === 18)
                      expr = parseSequenceExpression(state, context, expr);
                  if (context & 2097152)
                      return parseExpressionStatement(state, context, expr);
                  break;
              case 86110:
                  state.assignable = 2;
                  expr = parseThisExpression(state, context);
                  break;
              case 86108:
                  expr = parseSuperExpression(state, context);
                  break;
              case 86106:
                  state.assignable = 2;
                  expr = parseNewExpression(state, context);
                  expr = parseMemberOrUpdateExpression(state, context, expr, false);
                  return parseExpressionStatement(state, context, parseAssignmentExpression(state, context, expr));
              case 86021:
              case 86022:
              case 86023:
                  state.assignable = 2;
                  expr = parseNullOrTrueOrFalseLiteral(state, context);
                  break;
              default:
                  validateIdentifier(state, context, 0, state.token);
                  state.assignable = 1;
                  expr = parseIdentifier(state, context);
          }
          if (state.token === 21) {
              return parseLabelledStatement(state, context, scope, expr);
          }
          if (state.token === 10) {
              expr = parseArrowFunctionExpression(state, context, [expr], 0);
          }
      }
      else {
          state.assignable = 1;
          expr = parseExpression(state, context, true);
      }
      expr = parseMemberOrUpdateExpression(state, context, expr, false);
      expr = parseAssignmentExpression(state, context, expr);
      if (state.token === 18) {
          expr = parseSequenceExpression(state, context, expr);
      }
      return parseExpressionStatement(state, context, expr);
  }
  function parseBlock(state, context, scope) {
      const body = [];
      consume(state, context | 32768, 2162700);
      while (state.token !== 15) {
          body.push(parseStatementListItem(state, context, scope));
      }
      consume(state, context | 32768, 15);
      return {
          type: 'BlockStatement',
          body
      };
  }
  function parseReturnStatement(state, context) {
      if ((context & 32) === 0 && context & 134217728) {
          report(state, 29, 'Not configured to parse `return` statement in global, bailing');
      }
      nextToken(state, context | 32768);
      const argument = (state.flags & 1) === 0 &&
          state.token !== 17 &&
          state.token !== 15 &&
          state.token !== 0
          ? parseExpressions(state, (context | 8192) ^ 8192, true)
          : null;
      consumeSemicolon(state, context | 32768);
      return {
          type: 'ReturnStatement',
          argument
      };
  }
  function parseExpressionStatement(state, context, expr) {
      consumeSemicolon(state, context | 32768);
      return {
          type: 'ExpressionStatement',
          expression: expr
      };
  }
  function parseLabelledStatement(state, context, scope, expr) {
      nextToken(state, context | 32768);
      return {
          type: 'LabeledStatement',
          label: expr,
          body: (context & 1024) === 0 &&
              context & 256 &&
              context & 131072 &&
              state.token === 86103
              ? parseFunctionDeclaration(state, context, scope, 8, false, 0)
              : parseStatement(state, context, scope)
      };
  }
  function parseCoverCallExpressionAndAsyncArrowHead(state, context, scope) {
      let expr = parseIdentifier(state, context);
      if (state.token === 21)
          return parseLabelledStatement(state, context, scope, expr);
      if (state.token === 16865073 || state.token === 16865074 || state.token === 0) {
          return parseExpressionStatement(state, context, parseAssignmentExpression(state, context, parseMemberOrUpdateExpression(state, context, parseIdentifierOrArrow(state, context, expr, true), false)));
      }
      const newLineAfterAsync = (state.flags & 1) !== 0;
      if (!newLineAfterAsync) {
          if (state.token === 86103) {
              return parseFunctionDeclaration(state, context, scope, 1, false, 1);
          }
          if ((state.token & 159744) === 159744 ||
              ((state.token & 20480) === 20480 && state.token === 10)) {
              if (state.assignable & 2)
                  report(state, 30);
              if (state.token === 225389)
                  report(state, 30);
              if (context & (1024 | 2097152) && state.token === 258154) {
                  report(state, 30);
              }
              const arg = parseIdentifier(state, context);
              if (state.flags & 1)
                  report(state, 47);
              return parseExpressionStatement(state, context, parseArrowFunctionExpression(state, context, [arg], 1));
          }
      }
      if (state.token === 65547) {
          expr = parseCoverParenthesizedExpressionAndArrowParameterList(state, context, expr, true, newLineAfterAsync);
      }
      else if (state.token === 10) {
          if (state.flags & 1)
              report(state, 24);
          if (!state.assignable)
              report(state, 24);
          expr = parseArrowFunctionExpression(state, context, [expr], 0);
      }
      expr = parseMemberOrUpdateExpression(state, context, expr, false);
      expr = parseAssignmentExpression(state, context, expr);
      return parseExpressionStatement(state, context, expr);
  }
  function parseEmptyStatement(state, context) {
      nextToken(state, context | 32768);
      return {
          type: 'EmptyStatement'
      };
  }
  function parseThrowStatement(state, context) {
      nextToken(state, context | 32768);
      if (state.flags & 1)
          report(state, 97);
      const argument = parseExpressions(state, (context | 8192) ^ 8192, true);
      consumeSemicolon(state, context);
      return {
          type: 'ThrowStatement',
          argument
      };
  }
  function parseIfStatement(state, context, scope) {
      nextToken(state, context);
      consume(state, context | 32768, 65547);
      const test = parseExpressions(state, (context | 8192) ^ 8192, true);
      consume(state, context | 32768, 16);
      const consequent = parseConsequentOrAlternate(state, context, scope);
      const alternate = consumeOpt(state, context | 32768, 20562)
          ? parseConsequentOrAlternate(state, context, scope)
          : null;
      return {
          type: 'IfStatement',
          test,
          consequent,
          alternate
      };
  }
  function parseConsequentOrAlternate(state, context, scope) {
      return context & 1024 || (context & 256) === 0 || state.token !== 86103
          ? parseStatement(state, (context | 131072) ^ 131072, scope)
          : parseFunctionDeclaration(state, context, scope, 8, false, 0);
  }
  function parseSwitchStatement(state, context, scope) {
      nextToken(state, context);
      consume(state, context | 32768, 65547);
      const discriminant = parseExpressions(state, (context | 8192) ^ 8192, true);
      consume(state, context, 16);
      consume(state, context, 2162700);
      const cases = [];
      let seenDefault = false;
      const switchScope = SCOPE_addLexTo(scope, 1);
      while (state.token !== 15) {
          let test = null;
          const consequent = [];
          if (consumeOpt(state, context | 32768, 20555)) {
              test = parseExpressions(state, (context | 8192) ^ 8192, true);
          }
          else {
              consume(state, context | 32768, 20560);
              if (seenDefault)
                  report(state, 96);
              seenDefault = true;
          }
          consume(state, context | 32768, 21);
          while (state.token !== 20555 &&
              state.token !== 15 &&
              state.token !== 20560) {
              consequent.push(parseStatementListItem(state, ((context | 131072) ^ 131072) | 536870912, switchScope));
          }
          cases.push({
              type: 'SwitchCase',
              test,
              consequent
          });
      }
      consume(state, context | 32768, 15);
      return {
          type: 'SwitchStatement',
          discriminant,
          cases
      };
  }
  function parseWhileStatement(state, context, scope) {
      nextToken(state, context);
      consume(state, context | 32768, 65547);
      const test = parseExpressions(state, (context | (131072 | 8192)) ^
          (131072 | 8192), true);
      consume(state, context | 32768, 16);
      const body = parseStatement(state, context | 1073741824, scope);
      return {
          type: 'WhileStatement',
          test,
          body
      };
  }
  function parseContinueStatement(state, context) {
      if ((context & 1073741824) === 0)
          report(state, 69);
      nextToken(state, context);
      let label = null;
      if ((state.flags & 1) === 0 && state.token & 159744) {
          label = parseIdentifier(state, context | 32768);
      }
      consumeSemicolon(state, context);
      return {
          type: 'ContinueStatement',
          label
      };
  }
  function parseBreakStatement(state, context) {
      nextToken(state, context | 32768);
      let label = null;
      if ((state.flags & 1) === 0 && state.token & 159744) {
          label = parseIdentifier(state, context | 32768);
      }
      else {
          if (!(context & (1073741824 | 536870912)))
              report(state, 70);
      }
      consumeSemicolon(state, context);
      return {
          type: 'BreakStatement',
          label
      };
  }
  function parseWithStatement(state, context, scope) {
      nextToken(state, context);
      if (context & 1024)
          report(state, 98);
      consume(state, context | 32768, 65547);
      const object = parseExpressions(state, (context | (131072 | 8192)) ^
          (131072 | 8192), true);
      consume(state, context | 32768, 16);
      const body = parseStatement(state, context, scope);
      return {
          type: 'WithStatement',
          object,
          body
      };
  }
  function parseDebuggerStatement(state, context) {
      nextToken(state, context | 32768);
      consumeSemicolon(state, context);
      return {
          type: 'DebuggerStatement'
      };
  }
  function parseTryStatement(state, context, scope) {
      nextToken(state, context | 32768);
      const block = parseBlock(state, context, SCOPE_addLexTo(scope, 1));
      if (state.token !== 20556 && state.token !== 20565) {
          report(state, 95);
      }
      const handler = consumeOpt(state, context | 32768, 20556)
          ? parseCatchBlock(state, context, scope)
          : null;
      const finalizer = consumeOpt(state, context | 32768, 20565)
          ? parseBlock(state, context, SCOPE_addLexTo(scope, 1))
          : null;
      return {
          type: 'TryStatement',
          block,
          handler,
          finalizer
      };
  }
  function parseCatchBlock(state, context, scope) {
      let param = null;
      let secondScope = scope;
      if (consumeOpt(state, context, 65547)) {
          param = parseBindingIdentifierOrPattern(state, context, scope, 1, 0, true);
          if (state.token === 18) {
              report(state, 93);
          }
          else if (state.token === 8388637) {
              report(state, 94);
          }
          const catchScope = SCOPE_addLexTo(scope, 1);
          consume(state, context | 32768, 16);
          secondScope = SCOPE_addLexTo(catchScope, 1);
      }
      const body = parseBlock(state, context, secondScope);
      return {
          type: 'CatchClause',
          param,
          body
      };
  }
  function parseDoWhileStatement(state, context, scope) {
      nextToken(state, context | 32768);
      const body = parseStatement(state, context | 1073741824, scope);
      consume(state, context, 20577);
      consume(state, context | 32768, 65547);
      const test = parseExpressions(state, (context | (131072 | 8192)) ^
          (131072 | 8192), true);
      consume(state, context | 32768, 16);
      consumeOpt(state, context, 17);
      return {
          type: 'DoWhileStatement',
          body,
          test
      };
  }
  function parseVariableOrLabeledStatement(state, context, scope, type) {
      let expr = parseIdentifier(state, context);
      if ((state.token & (159744 | 2097152)) === 0) {
          if (context & 1024)
              report(state, 92);
          if (state.token === 21)
              return parseLabelledStatement(state, context, scope, expr);
          expr = parseMemberOrUpdateExpression(state, context, expr, false);
          expr = parseAssignmentExpression(state, (context | 8192) ^ 8192, expr);
          if (state.token === 18) {
              expr = parseSequenceExpression(state, context, expr);
          }
          return parseExpressionStatement(state, context, expr);
      }
      const declarations = parseVariableDeclarationList(state, context, scope, type, 8);
      consumeSemicolon(state, context);
      return {
          type: 'VariableDeclaration',
          kind: 'let',
          declarations
      };
  }
  function parseVariableStatement(state, context, scope, type, origin) {
      const kind = KeywordDescTable[state.token & 255];
      nextToken(state, context);
      const declarations = parseVariableDeclarationList(state, (context | 8192) ^ 8192, scope, type, origin);
      consumeSemicolon(state, context);
      return {
          type: 'VariableDeclaration',
          kind,
          declarations
      };
  }
  function parseVariableDeclarationList(state, context, scope, type, origin) {
      let bindingCount = 1;
      const list = [parseVariableDeclaration(state, context, scope, type, origin)];
      while (consumeOpt(state, context, 18)) {
          bindingCount++;
          list.push(parseVariableDeclaration(state, context, scope, type, origin));
      }
      if (bindingCount > 1 &&
          (origin & 4) === 4 &&
          (state.token & 4144) === 4144) {
          report(state, 62, KeywordDescTable[state.token & 255]);
      }
      return list;
  }
  function parseVariableDeclaration(state, context, scope, type, origin) {
      const { token, index, line } = state;
      let init = null;
      const id = parseBindingIdentifierOrPattern(state, context, scope, type, 0, false);
      if (state.token === 8388637) {
          nextToken(state, context | 32768);
          init = parseExpression(state, context, true);
          if (origin & 4 || (token & 2097152) === 0) {
              if (state.token === 12402 ||
                  (state.token === 16865073 &&
                      (token & 2097152 ||
                          (type & 4) === 0 ||
                          (context & 256) === 0 ||
                          context & 1024))) {
                  report(state, 61);
              }
          }
      }
      else if ((type & 16 || (token & 2097152) !== 0) &&
          (state.token & 4144) !== 4144) {
          reportAt(state, index, line, index, 60, type & 16 ? 'const' : 'destructuring');
      }
      return {
          type: 'VariableDeclarator',
          init,
          id
      };
  }
  function parseForStatement(state, context, scope) {
      nextToken(state, context);
      const forAwait = (context & 4194304) !== 0 && consumeOpt(state, context, 225389);
      scope = SCOPE_addLexTo(scope, 1);
      consume(state, context | 32768, 65547);
      let test = null;
      let update = null;
      let right;
      let isPattern = false;
      let init = null;
      const { token } = state;
      if (token !== 17) {
          if (token & 1073741824) {
              const kind = KeywordDescTable[token & 255];
              switch (token) {
                  case 1073827911: {
                      nextToken(state, context);
                      init = {
                          type: 'VariableDeclaration',
                          kind,
                          declarations: parseVariableDeclarationList(state, context | 8192, scope, 4, 4)
                      };
                      state.assignable = 1;
                      break;
                  }
                  case 1073999944: {
                      const expr = parseIdentifier(state, context);
                      if (state.token & (159744 | 2097152)) {
                          if (state.token === 16865073) {
                              if (context & 1024) {
                                  report(state, 68);
                              }
                              init = expr;
                              state.assignable = 1;
                          }
                          else {
                              init = {
                                  type: 'VariableDeclaration',
                                  kind,
                                  declarations: parseVariableDeclarationList(state, context, scope, 8, 4)
                              };
                              state.assignable = 1;
                          }
                      }
                      else if (context & 1024) {
                          report(state, 68);
                      }
                      else {
                          init = parseAssignmentExpression(state, context, parseMemberOrUpdateExpression(state, context, parseIdentifierOrArrow(state, context, expr, true), false));
                          if (state.token === 18) {
                              state.assignable = 2;
                              init = parseSequenceExpression(state, context, init);
                          }
                      }
                      break;
                  }
                  case 1073827913:
                      nextToken(state, context);
                      init = {
                          type: 'VariableDeclaration',
                          kind,
                          declarations: parseVariableDeclarationList(state, context | 8192, scope, 16, 4)
                      };
                      state.assignable = 1;
                      break;
                  default:
              }
          }
          else {
              isPattern = (state.token & 2097152) !== 0;
              init = parsePrimaryExpressionExtended(state, context | 8192, 0, false, isPattern ? false : true);
              init = parseMemberOrUpdateExpression(state, context, init, false);
          }
      }
      if (state.token === 12402) {
          if (isPattern) {
              reinterpretToPattern(state, init);
          }
          if (state.assignable & 2) {
              report(state, 88, 'of');
          }
          nextToken(state, context | 32768);
          right = parseExpression(state, (context | 8192) ^ 8192, true);
          consume(state, context | 32768, 16);
          const body = parseStatement(state, ((context | 131072) ^ 131072) | 1073741824, scope);
          return {
              type: 'ForOfStatement',
              body,
              left: init,
              right,
              await: forAwait
          };
      }
      if (forAwait)
          report(state, 89);
      if (state.token === 16865073) {
          if (isPattern) {
              reinterpretToPattern(state, init);
          }
          if (state.assignable & 2) {
              if (context & 256 && (context & 1024) === 0) ;
              else {
                  report(state, 88, 'in');
              }
          }
          nextToken(state, context | 32768);
          right = parseExpressions(state, (context | 8192) ^ 8192, true);
          consume(state, context | 32768, 16);
          const body = parseStatement(state, ((context | 131072) ^ 131072) | 1073741824, scope);
          return {
              type: 'ForInStatement',
              body,
              left: init,
              right
          };
      }
      if (forAwait)
          report(state, 89);
      if (init && (token & 1073741824) === 0)
          init = parseAssignmentExpression(state, (context | 8192) ^ 8192, init);
      if (state.token === 18) {
          init = parseSequenceExpression(state, context, init);
      }
      consume(state, context | 32768, 17);
      if (state.token !== 17)
          test = parseExpressions(state, context, true);
      consume(state, context | 32768, 17);
      if (state.token !== 16)
          update = parseExpressions(state, (context | 8192) ^ 8192, true);
      consume(state, context | 32768, 16);
      const body = parseStatement(state, ((context | 131072) ^ 131072) | 1073741824, scope);
      return {
          type: 'ForStatement',
          body,
          init,
          test,
          update
      };
  }
  function parseImportDeclaration(state, context) {
      if ((context & 2048) === 0)
          report(state, 0);
      consume(state, context, 86105);
      let source;
      const specifiers = [];
      if (((state.token & 4351) ^ 84) >
          4096) {
          specifiers.push({
              type: 'ImportDefaultSpecifier',
              local: parseIdentifier(state, context)
          });
          if (consumeOpt(state, context, 18)) {
              if (state.token === 16845363) {
                  parseImportNamespace(state, context, specifiers);
              }
              else if (state.token === 2162700) {
                  parseImportSpecifierOrNamedImports(state, context, specifiers);
              }
              else
                  report(state, 0);
          }
          source = parseModuleSpecifier(state, context);
      }
      else if (state.token === 536936451) {
          source = parseLiteral(state, context);
      }
      else {
          if (state.token === 16845363) {
              parseImportNamespace(state, context, specifiers);
          }
          else if (state.token === 2162700) {
              parseImportSpecifierOrNamedImports(state, context, specifiers);
          }
          else
              report(state, 29, KeywordDescTable[state.token & 255]);
          source = parseModuleSpecifier(state, context);
      }
      consumeSemicolon(state, context);
      return {
          type: 'ImportDeclaration',
          specifiers,
          source
      };
  }
  function parseImportNamespace(state, context, specifiers) {
      nextToken(state, context);
      consumeOpt(state, context, 12395);
      const local = parseIdentifier(state, context);
      specifiers.push({
          type: 'ImportNamespaceSpecifier',
          local
      });
  }
  function parseModuleSpecifier(state, context) {
      consumeOpt(state, context, 12401);
      if (state.token !== 536936451)
          report(state, 0);
      return parseLiteral(state, context);
  }
  function parseImportSpecifierOrNamedImports(state, context, specifiers) {
      consume(state, context, 2162700);
      while (state.token & 159744) {
          const imported = parseIdentifier(state, context);
          let local;
          if (consumeOpt(state, context, 12395)) {
              if (state.token !== 225281)
                  report(state, 0);
              local = parseIdentifier(state, context);
          }
          else {
              local = imported;
          }
          specifiers.push({
              type: 'ImportSpecifier',
              local,
              imported
          });
          if (state.token !== 15)
              consume(state, context, 18);
      }
      consume(state, context, 15);
  }
  function parseExportDeclaration(state, context, scope) {
      if ((context & 2048) === 0)
          report(state, 0);
      if ((context & 134217728) === 0)
          report(state, 0);
      consume(state, context | 32768, 20563);
      const specifiers = [];
      let declaration = null;
      let source = null;
      if (consumeOpt(state, context | 32768, 20560)) {
          switch (state.token) {
              case 86103: {
                  declaration = parseFunctionDeclaration(state, context, scope, 1, true, 0);
                  break;
              }
              case 86093:
                  declaration = parseClassDeclaration(state, context, scope, true);
                  break;
              case 159852:
                  nextToken(state, context | 32768);
                  declaration =
                      state.token === 86103
                          ? parseFunctionDeclaration(state, context, scope, 1, true, 1)
                          : parseCoverCallExpressionAndAsyncArrowHead(state, context, scope);
                  break;
              default:
                  declaration = parseExpression(state, (context | 8192) ^ 8192, true);
                  consumeSemicolon(state, context);
          }
          return {
              type: 'ExportDefaultDeclaration',
              declaration
          };
      }
      switch (state.token) {
          case 16845363: {
              nextToken(state, context);
              if (context & 1 && consumeOpt(state, context, 12395)) {
                  specifiers.push({
                      type: 'ExportNamespaceSpecifier',
                      specifier: parseIdentifier(state, context)
                  });
              }
              consume(state, context, 12401);
              if (state.token !== 536936451)
                  report(state, 0);
              source = parseLiteral(state, context);
              consumeSemicolon(state, context);
              return context & 1 && specifiers
                  ? {
                      type: 'ExportNamedDeclaration',
                      source,
                      specifiers
                  }
                  : {
                      type: 'ExportAllDeclaration',
                      source
                  };
          }
          case 2162700: {
              consume(state, context, 2162700);
              while (state.token & 159744) {
                  const local = parseIdentifier(state, context);
                  let exported;
                  if (state.token === 12395) {
                      nextToken(state, context);
                      if ((state.token & 0x10ff) < 0x1000)
                          report(state, 0);
                      exported = parseIdentifier(state, context);
                  }
                  else {
                      exported = local;
                  }
                  specifiers.push({
                      type: 'ExportSpecifier',
                      local,
                      exported
                  });
                  if (state.token !== 15)
                      consume(state, context, 18);
              }
              consume(state, context, 15);
              if (consumeOpt(state, context, 12401)) {
                  if (state.token !== 536936451)
                      report(state, 0);
                  source = parseLiteral(state, context);
              }
              consumeSemicolon(state, context);
              break;
          }
          case 86093:
              declaration = parseClassDeclaration(state, context, scope, false);
              break;
          case 1073999944:
              declaration = parseVariableStatement(state, context, scope, 8, 16);
              break;
          case 1073827913:
              declaration = parseVariableStatement(state, context, scope, 16, 16);
              break;
          case 1073827911:
              declaration = parseVariableStatement(state, context, scope, 4, 16);
              break;
          case 86103:
              declaration = parseFunctionDeclaration(state, context, scope, 16, false, 0);
              break;
          case 159852:
              nextToken(state, context);
              if ((state.flags & 1) === 0 && state.token === 86103) {
                  declaration = parseFunctionDeclaration(state, context, scope, 16, false, 1);
                  break;
              }
          default:
              report(state, 29, KeywordDescTable[state.token & 255]);
      }
      return {
          type: 'ExportNamedDeclaration',
          source,
          specifiers,
          declaration
      };
  }

  function create(source) {
      return {
          flags: 0,
          source,
          index: 0,
          line: 1,
          column: 0,
          endIndex: 0,
          endLine: 0,
          endColumn: 0,
          length: source.length,
          startIndex: 0,
          startLine: 0,
          startColumn: 0,
          tokenValue: '',
          token: 0,
          tokenRaw: '',
          tokenRegExp: undefined,
          currentChar: source.charCodeAt(0),
          assignable: 1,
          destructible: 0,
          octalPos: undefined,
          octalMessage: undefined
      };
  }
  function parseBody(state, context, scope) {
      nextToken(state, context | 32768);
      const statements = [];
      while (state.token === 536936451) {
          if (state.index - state.startIndex < 13 && state.tokenValue === 'use strict')
              context |= 1024;
          statements.push(parseDirective(state, context, scope));
      }
      while (state.token !== 0) {
          statements.push(parseStatementListItem(state, context | 131072, scope));
      }
      return statements;
  }
  function parseDirective(state, context, scope) {
      if ((context & 8) < 1)
          return parseStatementListItem(state, context, scope);
      const { tokenRaw } = state;
      return {
          type: 'ExpressionStatement',
          expression: parseAssignmentExpression(state, context, parseLiteral(state, context)),
          directive: tokenRaw.slice(1, -1)
      };
  }

  function parseSource(source, options, context) {
      if (options != null) {
          if (options.next)
              context |= 1;
          if (options.jsx)
              context |= 16;
          if (options.loc)
              context |= 4;
          if (options.ranges)
              context |= 2;
          if (options.webCompat)
              context |= 256;
          if (options.directives)
              context |= 8;
          if (options.globalReturn)
              context |= 32;
          if (options.globalAwait)
              context |= 64;
          if (options.scope)
              context |= 128;
          if (options.raw)
              context |= 512;
      }
      const parser = create(source);
      const scope = createScope(1);
      const node = {
          type: 'Program',
          sourceType: context & 2048 ? 'module' : 'script',
          body: parseBody(parser, context | 134217728, scope)
      };
      if (context & 2) {
          node.start = 0;
          node.end = source.length;
      }
      return node;
  }
  function parseScript(source, options) {
      return parseSource(source, options, 0);
  }
  function parseModule(source, options) {
      return parseSource(source, options, 1024 | 2048);
  }
  function parse(source, options) {
      return parseSource(source, options, 0);
  }

  exports.parseSource = parseSource;
  exports.parseScript = parseScript;
  exports.parseModule = parseModule;
  exports.parse = parse;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
