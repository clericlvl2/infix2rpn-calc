import { signal } from '@preact/signals';
import type { IMathOperator } from '@shared/math/types';
import { CalculatorContext, CalculatorContextType, DEFAULT_OPERATORS, initCalculator } from './context';
import { ComponentChildren } from 'preact';

interface CalculatorProviderProps {
  children: ComponentChildren;
}

export const CalculatorProvider = ({ children }: CalculatorProviderProps) => {
  const display = signal('');
  const result = signal('');
  const error = signal('');
  const operators = signal<IMathOperator[]>(DEFAULT_OPERATORS);
  const calculator = signal(initCalculator(DEFAULT_OPERATORS));

  const addToDisplay = (value: string) => {
    display.value += value;
  };

  const calculate = () => {
    try {
      const calculatedResult = calculator.value.calculate(display.value);
      display.value = String(calculatedResult);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error';
    }
  };

  const setOperatorSet = (operatorSet: IMathOperator[]) => {
    operators.value = operatorSet;
    calculator.value = initCalculator(operatorSet);
  };

  const clear = () => {
    display.value = '';
    result.value = '';
    error.value = ''
  };

  const contextValue: CalculatorContextType = {
    display,
    result,
    error,
    operators,
    calculator,
    addToDisplay,
    clear,
    calculate,
    setOperatorSet
  };

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
