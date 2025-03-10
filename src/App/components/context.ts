import { Calculator } from '@Calculator/Calculator';
import { Signal, signal } from '@preact/signals';
import type { IMathOperator } from '@shared/math/types';
import { createContext } from 'preact';
import { Operator } from '../constants';

export interface ICalculatorContextType {
  expression: Signal<string>;
  calculationResult: Signal<string>;
  error: Signal<string>;
  operators: Signal<IMathOperator[]>;
  calculator: Signal<Calculator<string>>;
  addToExpression: (value: string) => void;
  setExpression: (value: string) => void;
  clearExpression: () => void;
  calculate: () => void;
  setOperatorsSet: (operatorSet: IMathOperator[]) => void;
}

export const DEFAULT_OPERATORS = [
  Operator.Plus,
  Operator.Minus,
  Operator.UnaryPlus,
  Operator.UnaryMinus,
  Operator.Multiply,
  Operator.Divide,
];

export const initCalculator = (operators: IMathOperator[]) => new Calculator({
  supportedOperators: operators,
});

export const CalculatorContext = createContext<ICalculatorContextType>({
  expression: signal(''),
  calculationResult: signal(''),
  error: signal(''),
  operators: signal(DEFAULT_OPERATORS),
  calculator: signal(initCalculator(DEFAULT_OPERATORS)),
  addToExpression: () => {},
  setExpression: () => {},
  clearExpression: () => {},
  calculate: () => {},
  setOperatorsSet: () => {},
});
