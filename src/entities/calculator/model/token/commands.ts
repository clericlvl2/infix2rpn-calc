import { NegativeFactorialError } from '../errors/NegativeFactorialError';
import { toPrecision } from './number';

export interface ICommand {
    symbol: string;
    arity: number;
    action: (...args: number[]) => number;
}

export const COMMANDS_REGEX = /^(sin|cos|exp|tan|log|ln|sqrt|abs|fact)/;

export const createCommand = (props: ICommand): Readonly<ICommand> => Object.freeze({ ...props });

export const Command = {
    Sin: createCommand({
        symbol: 'sin',
        arity: 1,
        action: (a: number): number => toPrecision(Math.sin(a)),
    }),

    Cos: createCommand({
        symbol: 'cos',
        arity: 1,
        action: (a: number): number => toPrecision(Math.cos(a)),
    }),

    Tan: createCommand({
        symbol: 'tan',
        arity: 1,
        action: (a: number): number => toPrecision(Math.tan(a)),
    }),

    Log: createCommand({
        symbol: 'log',
        arity: 1,
        action: (a: number): number => toPrecision(Math.log10(a)),
    }),

    Ln: createCommand({
        symbol: 'ln',
        arity: 1,
        action: (a: number): number => toPrecision(Math.log(a)),
    }),

    Sqrt: createCommand({
        symbol: 'sqrt',
        arity: 1,
        action: (a: number): number => toPrecision(Math.sqrt(a)),
    }),

    Exp: createCommand({
        symbol: 'exp',
        arity: 1,
        action: (a: number): number => toPrecision(Math.exp(a)),
    }),

    Fact: createCommand({
        symbol: 'fact',
        arity: 1,
        action: (n: number) => {
            if (n < 0) {
                throw new NegativeFactorialError(n);
            }

            if (n === 0 || n === 1) {
                return 1;
            }

            let result = 1;

            for (let i = 2; i <= n; i++) {
                result *= i;
            }

            return toPrecision(result);
        },
    }),
};
