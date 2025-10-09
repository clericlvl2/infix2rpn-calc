import { AssociativityType, createOperation, SuffixType } from '@shared/lib/math';
import { isZero } from '@shared/model/validation';
import { ErrorMessage } from './errors';

export const Operation = {
    Plus: createOperation({
        symbol: '+',
        precedence: 1,
        arity: 2,
        action: (val1: number, val2: number): number => val1 + val2,
        associativity: AssociativityType.Left,
    }),

    UnaryPlus: createOperation({
        symbol: '+',
        precedence: 3,
        arity: 1,
        suffix: SuffixType.Pre,
        action: (val: number): number => val,
        associativity: AssociativityType.Left,
    }),

    Minus: createOperation({
        symbol: '-',
        precedence: 2,
        arity: 2,
        action: (val1: number, val2: number): number => val1 - val2,
        associativity: AssociativityType.Left,
    }),

    UnaryMinus: createOperation({
        symbol: '-',
        precedence: 3,
        arity: 1,
        suffix: SuffixType.Pre,
        action: (val: number) => -1 * val,
        associativity: AssociativityType.Left,
    }),

    Multiply: createOperation({
        symbol: '*',
        precedence: 2,
        arity: 2,
        action: (val1: number, val2: number): number => val1 * val2,
        associativity: AssociativityType.Left,
    }),

    Divide: createOperation({
        symbol: '/',
        precedence: 2,
        arity: 2,
        action: (dividend: number, divisor: number): number => {
            if (isZero(divisor)) {
                throw new Error(ErrorMessage.DivisionByZeroFound);
            }

            return dividend / divisor;
        },
        associativity: AssociativityType.Left,
    }),

    Power: createOperation({
        symbol: '^',
        arity: 2,
        precedence: 3,
        action: (a: number, b: number): number => Math.pow(a, b),
        associativity: AssociativityType.Right,
    }),

    // todo FUNCTION
    Sin: createOperation({
        symbol: 'sin',
        arity: 1,
        suffix: SuffixType.Pre,
        precedence: 4,
        action: (a: number): number => Math.sin(a),
        associativity: AssociativityType.Left,
    }),

    // todo FUNCTION
    Cos: createOperation({
        symbol: 'cos',
        arity: 1,
        suffix: SuffixType.Pre,
        precedence: 4,
        action: (a: number): number => Math.cos(a),
        associativity: AssociativityType.Left,
    }),

    // todo FUNCTION
    Sqrt: createOperation({
        symbol: 'sqrt',
        arity: 1,
        suffix: SuffixType.Pre,
        precedence: 4,
        action: (a: number): number => Math.sqrt(a),
        associativity: AssociativityType.Left,
    }),

    Factorial: createOperation({
        symbol: '!',
        arity: 1,
        suffix: SuffixType.Post,
        precedence: 4,
        action: (a: number): number => Math.sqrt(a),
        associativity: AssociativityType.Left,
    }),
};
