import {ErrorMessage} from '@lib/errors';
import {isZero} from '@lib/validation';
import {createOperation} from "@lib/math/operation/createOperation";
import {Suffix} from "@lib/math/operation/model";

export const Operator = {
  Plus: createOperation({
    symbol: '+',
    precedence: 1,
    arity: 2,
    action: (val1: number, val2: number): number => val1 + val2,
  }),

  UnaryPlus: createOperation({
    symbol: '+',
    precedence: 3,
    arity: 1,
    suffix: Suffix.Pre,
    action: (val: number): number => val,
  }),

  Minus: createOperation({
    symbol: '-',
    precedence: 2,
    arity: 2,
    action: (val1: number, val2: number): number => val1 - val2,
  }),

  UnaryMinus: createOperation({
    symbol: '-',
    precedence: 3,
    arity: 1,
    suffix: Suffix.Pre,
    action: (val: number) => -1 * val,
  }),

  Multiply: createOperation({
    symbol: '*',
    precedence: 2,
    arity: 2,
    action: (val1: number, val2: number): number => val1 * val2,
  }),

  Divide: createOperation({
    symbol: '/',
    precedence: 2,
    arity: 2,
    action: (dividend: number, divisor: number): number => {
      if (isZero(divisor)) {
        throw new Error(ErrorMessage.DivisionByZero);
      }

      return dividend / divisor;
    },
  }),

  Power: createOperation({
    symbol: '^',
    arity: 2,
    precedence: 3,
    action: (a: number, b: number): number => Math.pow(a, b),
  }),

  Sin: createOperation({
    symbol: 'sin',
    arity: 1,
    suffix: Suffix.Pre,
    precedence: 4,
    action: (a: number): number => Math.sin(a),
  }),

  Cos: createOperation({
    symbol: 'cos',
    arity: 1,
    suffix: Suffix.Pre,
    precedence: 4,
    action: (a: number): number => Math.cos(a),
  }),

  Sqrt: createOperation({
    symbol: 'sqrt',
    arity: 1,
    suffix: Suffix.Pre,
    precedence: 4,
    action: (a: number): number => Math.sqrt(a),
  }),

  Fact: createOperation({
    symbol: '!',
    arity: 1,
    suffix: Suffix.Pre,
    precedence: 4,
    action: (a: number): number => Math.sqrt(a),
  })
};
