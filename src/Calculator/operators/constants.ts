import { ErrorMessage, throwError } from '../../common/errors';
import { isZero } from '../../common/utils';
import type { ObjectValuesAsUnion } from '../../common/types';
import { type IMathOperatorOptions, MathOperator } from './MathOperator';

export const Sign = {
  Plus: '+',
  Minus: '-',
  UnaryMinus: '%',
  Multiply: '*',
  Divide: '/',
} as const;

export type TOperator = ObjectValuesAsUnion<typeof Sign>;

type TOperatorsConfig = {
  [Sign in TOperator]: IMathOperatorOptions<Sign>
}

const OPERATORS_CONFIGS: TOperatorsConfig = {
  [Sign.Plus]: {
    symbol: Sign.Plus,
    priority: 1,
    arity: 2,
    action: (val1: number, val2: number) => val1 + val2,
  },
  [Sign.Minus]: {
    symbol: Sign.Minus,
    priority: 2,
    arity: 2,
    action: (val1: number, val2: number) => val1 - val2,
  },
  [Sign.UnaryMinus]: {
    symbol: Sign.UnaryMinus,
    priority: 1,
    arity: 1,
    action: (val: number) => -1 * val,
  },
  [Sign.Multiply]: {
    symbol: Sign.Multiply,
    priority: 2,
    arity: 2,
    action: (val1: number, val2: number) => val1 * val2,
  },
  [Sign.Divide]: {
    symbol: Sign.Divide,
    priority: 2,
    arity: 2,
    action: (dividend: number, divisor: number) => {
      if (isZero(divisor)) {
        throwError(ErrorMessage.DivisionByZero);
      }

      return dividend / divisor;
    },
  },
};

export const Operator = {
  Plus: new MathOperator(OPERATORS_CONFIGS[Sign.Plus]),
  Minus: new MathOperator(OPERATORS_CONFIGS[Sign.Minus]),
  UnaryMinus: new MathOperator(OPERATORS_CONFIGS[Sign.UnaryMinus]),
  Multiply: new MathOperator(OPERATORS_CONFIGS[Sign.Multiply]),
  Divide: new MathOperator(OPERATORS_CONFIGS[Sign.Divide]),
};
