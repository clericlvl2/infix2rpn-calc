import { ErrorMessage, throwError } from '@shared/errors';
import { MathOperator } from '@shared/math/MathOperator';
import { isZero } from '@shared/validation';

export const Operator = {
  Plus: new MathOperator({
    symbol: '+',
    precedence: 1,
    arity: 2,
    action: (val1: number, val2: number): number => val1 + val2,
  }),

  UnaryPlus: new MathOperator({
    symbol: '+',
    precedence: 3,
    arity: 1,
    action: (val: number): number => val,
  }),

  Minus: new MathOperator({
    symbol: '-',
    precedence: 2,
    arity: 2,
    action: (val1: number, val2: number): number => val1 - val2,
  }),

  UnaryMinus: new MathOperator({
    symbol: '-',
    precedence: 3,
    arity: 1,
    action: (val: number) => -1 * val,
  }),

  Multiply: new MathOperator({
    symbol: '*',
    precedence: 2,
    arity: 2,
    action: (val1: number, val2: number): number => val1 * val2,
  }),

  Divide: new MathOperator({
    symbol: '/',
    precedence: 2,
    arity: 2,
    action: (dividend: number, divisor: number): number => {
      if (isZero(divisor)) {
        throwError(ErrorMessage.DivisionByZero);
      }

      return dividend / divisor;
    },
  }),

  Power: new MathOperator({
    symbol: '^',
    arity: 2,
    precedence: 3,
    action: (a: number, b: number): number => Math.pow(a, b),
  }),

  Sin: new MathOperator({
    symbol: 'sin',
    arity: 1,
    precedence: 4,
    action: (a: number): number => Math.sin(a),
  }),

  Cos: new MathOperator({
    symbol: 'cos',
    arity: 1,
    precedence: 4,
    action: (a: number): number => Math.cos(a),
  }),

  Sqrt: new MathOperator({
    symbol: 'sqrt',
    arity: 1,
    precedence: 4,
    action: (a: number): number => Math.sqrt(a),
  }),
};
