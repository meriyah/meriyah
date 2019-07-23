import * as t from 'assert';
import { Context } from '../../src/common';
import { Token } from '../../src/token';
import { create } from '../../src/parser';
import { scanSingleToken } from '../../src/lexer/scan';

describe('src/lexer/scan', () => {
  const tokens: [Context, Token, string][] = [
    [Context.None, Token.LeftParen, '('],
    [Context.None, Token.LeftParen, '('],
    [Context.None, Token.LeftBrace, '{'],
    [Context.None, Token.RightBrace, '}'],
    [Context.None, Token.RightParen, ')'],
    [Context.None, Token.Semicolon, ';'],
    [Context.None, Token.Comma, ','],
    [Context.None, Token.LeftBracket, '['],
    [Context.None, Token.RightBracket, ']'],
    [Context.None, Token.Colon, ':'],
    [Context.None, Token.QuestionMark, '?'],
    [Context.None, Token.Arrow, '=>'],
    [Context.None, Token.Period, '.'],
    [Context.None, Token.Ellipsis, '...'],
    [Context.None, Token.Increment, '++'],
    [Context.None, Token.Decrement, '--'],
    [Context.None, Token.Assign, '='],
    [Context.None, Token.ShiftLeftAssign, '<<='],
    [Context.None, Token.ShiftRightAssign, '>>='],
    [Context.None, Token.LogicalShiftRightAssign, '>>>='],
    [Context.None, Token.ExponentiateAssign, '**='],
    [Context.None, Token.AddAssign, '+='],
    [Context.None, Token.SubtractAssign, '-='],
    [Context.None, Token.MultiplyAssign, '*='],
    [Context.None, Token.DivideAssign, '/='],
    [Context.None, Token.ModuloAssign, '%='],
    [Context.None, Token.BitwiseXorAssign, '^='],
    [Context.None, Token.BitwiseOrAssign, '|='],
    [Context.None, Token.BitwiseAndAssign, '&='],
    [Context.None, Token.Negate, '!'],
    [Context.None, Token.Complement, '~'],
    [Context.None, Token.Add, '+'],
    [Context.None, Token.Subtract, '-'],
    [Context.None, Token.Multiply, '*'],
    [Context.None, Token.Modulo, '%'],
    [Context.None, Token.Divide, '/'],
    [Context.None, Token.Exponentiate, '**'],
    [Context.None, Token.LogicalAnd, '&&'],
    [Context.None, Token.LogicalOr, '||'],
    [Context.None, Token.StrictEqual, '==='],
    [Context.None, Token.StrictNotEqual, '!=='],
    [Context.None, Token.LooseEqual, '=='],
    [Context.None, Token.LooseNotEqual, '!='],
    [Context.None, Token.LessThanOrEqual, '<='],
    [Context.None, Token.GreaterThanOrEqual, '>='],
    [Context.None, Token.LessThan, '<'],
    [Context.None, Token.GreaterThan, '>'],
    [Context.None, Token.ShiftLeft, '<<'],
    [Context.None, Token.ShiftRight, '>>'],
    [Context.None, Token.LogicalShiftRight, '>>>'],
    [Context.None, Token.BitwiseAnd, '&'],
    [Context.None, Token.BitwiseOr, '|'],
    [Context.None, Token.BitwiseXor, '^']
  ];

  for (const [ctx, token, op] of tokens) {
    it(`scans '${op}' at the end`, () => {
      const state = create(op, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          index: state.index
        },
        {
          token: token,
          hasNext: false,
          index: op.length
        }
      );
    });

    it(`scans '${op}' with more to go`, () => {
      const state = create(`${op} rest`, '', undefined);
      const found = scanSingleToken(state, ctx, 0);

      t.deepEqual(
        {
          token: found,
          hasNext: state.index < state.source.length,
          index: state.index
        },
        {
          token: token,
          hasNext: true,
          index: op.length
        }
      );
    });
  }
});
