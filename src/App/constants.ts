import { ErrorMessage, throwError } from '../shared/errors';

import { isZero } from '../shared/validation';
import { MathOperator } from '../shared/math/MathOperator';

export const Operator = {
  Plus: new MathOperator({
    symbol: '+',
    precedence: 1,
    arity: 2,
    action: (val1: number, val2: number): number => val1 + val2,
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
};
