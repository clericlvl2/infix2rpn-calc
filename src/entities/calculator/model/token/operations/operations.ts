import { isZero } from '@shared/lib/validation';
import { DivisionByZeroError } from '../../errors';
import { toPrecision } from '../number';
import { ArityType, AssociativityType, IOperation, SuffixType } from './model';

export const BASIC_ARITHMETIC_REGEX = /^[+\-*/]/;
export const OPERATIONS_REGEX = /^[+\-*/^%]/;

export const createOperationKey = (
    symbol: string,
    arity: ArityType,
    suffix?: SuffixType,
) => `${symbol}${arity}${suffix ?? ''}`;

export const createOperation = (op: IOperation): Readonly<IOperation> => Object.freeze({ ...op });

export const Operation = {
    Add: createOperation({
        symbol: '+',
        precedence: 1,
        arity: 2,
        action: (val1: number, val2: number): number => toPrecision(val1 + val2),
        associativity: AssociativityType.Left,
    }),

    UnaryAdd: createOperation({
        symbol: '+',
        precedence: 3,
        arity: 1,
        suffix: SuffixType.Pre,
        action: (val: number): number => val,
        associativity: AssociativityType.Left,
    }),

    Subtract: createOperation({
        symbol: '-',
        precedence: 2,
        arity: 2,
        action: (val1: number, val2: number): number => toPrecision(val1 - val2),
        associativity: AssociativityType.Left,
    }),

    UnarySubtract: createOperation({
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
        action: (val1: number, val2: number): number => toPrecision(val1 * val2),
        associativity: AssociativityType.Left,
    }),

    Divide: createOperation({
        symbol: '/',
        precedence: 2,
        arity: 2,
        action: (dividend: number, divisor: number, position?: number): number => {
            if (isZero(divisor)) {
                throw new DivisionByZeroError(dividend, divisor, position ?? NaN);
            }

            return toPrecision(dividend / divisor);
        },
        associativity: AssociativityType.Left,
    }),

    Power: createOperation({
        symbol: '^',
        arity: 2,
        precedence: 3,
        action: (a: number, b: number): number => toPrecision(Math.pow(a, b)),
        associativity: AssociativityType.Right,
    }),
};
