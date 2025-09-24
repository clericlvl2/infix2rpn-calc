import { Calculator } from '@features/calculator';
import { Operation } from '@features/calculator/config/operations';
import { Signal, signal } from '@preact/signals';
import type { IOperation } from '@shared/lib/math';
import { createContext } from 'preact';

export interface IStoreContext {
    expression: Signal<string>;
    calculationResult: Signal<string>;
    error: Signal<string>;
    operations: Signal<IOperation[]>;
    calculator: Signal<Calculator>;
    addToExpression: (value: string) => void;
    setExpression: (value: string) => void;
    clearExpression: () => void;
    calculate: () => void;
    backspace: () => void;
}

export const DEFAULT_OPERATIONS = [
    Operation.Plus,
    Operation.Minus,
    Operation.UnaryPlus,
    Operation.UnaryMinus,
    Operation.Multiply,
    Operation.Divide,
];

export const initCalculator = () => new Calculator();

export const StoreContext = createContext<IStoreContext>({
    expression: signal(''),
    calculationResult: signal(''),
    error: signal(''),
    operations: signal(DEFAULT_OPERATIONS),
    calculator: signal(initCalculator()),
    addToExpression: () => {
    },
    setExpression: () => {
    },
    clearExpression: () => {
    },
    backspace: () => {
    },
    calculate: () => {
    },
});
