import { Signal, signal } from '@preact/signals';
import { createContext } from 'preact';
import { Calculator } from '../model/Calculator';
import { Operation } from '../model/operations/constants';
import type { IOperation } from '../model/operations/model';

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
