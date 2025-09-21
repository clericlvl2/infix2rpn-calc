import { signal } from '@preact/signals';
import type { IMathOperator } from '@lib/math/types';
import { ComponentChildren } from 'preact';
import { CalculatorContext, ICalculatorContextType, DEFAULT_OPERATORS, initCalculator } from './context';

interface ICalculatorProviderProps {
  children: ComponentChildren;
}

export const CalculatorProvider = ({ children }: ICalculatorProviderProps) => {
  const expression = signal('');
  const result = signal('');
  const error = signal('');
  const operators = signal<IMathOperator[]>(DEFAULT_OPERATORS);
  const calculator = signal(initCalculator(DEFAULT_OPERATORS));

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
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error';
    }
  };

  const setOperatorsSet = (operatorSet: IMathOperator[]) => {
    operators.value = operatorSet;
    calculator.value = initCalculator(operatorSet);
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

  const contextValue: ICalculatorContextType = {
    expression: expression,
    calculationResult: result,
    error,
    operators,
    calculator,
    addToExpression,
    setExpression,
    clearExpression,
    calculate,
    backspace,
    setOperatorsSet,
  };

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
