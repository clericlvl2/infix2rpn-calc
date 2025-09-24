import { signal } from '@preact/signals';
import type { IOperation } from '@shared/lib/math';
import { ComponentChildren } from 'preact';
import { DEFAULT_OPERATIONS, initCalculator, IStoreContext, StoreContext } from './store';

interface IStoreProviderProps {
    children: ComponentChildren;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
    const expression = signal('');
    const result = signal('');
    const error = signal('');
    const operations = signal<IOperation[]>(DEFAULT_OPERATIONS);
    const calculator = signal(initCalculator());

    const addToExpression = (value: string) => {
        expression.value += value;
    };

    const setExpression = (value: string) => {
        expression.value = value;
    };

    const calculate = () => {
        try {
            const calculatedResult = calculator.value.calculate(expression.value);
            expression.value = String(calculatedResult);
        }
        catch (err) {
            error.value = err instanceof Error ? err.message : 'Error';
        }
    };

    const clearExpression = () => {
        expression.value = '';
        result.value = '';
        error.value = '';
    };

    const backspace = () => {
        const value = expression.value;

        if (value.length > 0) {
            expression.value = value.slice(0, value.length - 1);
        }
    };

    const contextValue: IStoreContext = {
        expression: expression,
        calculationResult: result,
        error,
        operations: operations,
        calculator,
        addToExpression,
        setExpression,
        clearExpression,
        calculate,
        backspace,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
