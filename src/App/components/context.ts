import type { IMathOperator } from '@shared/math/types';
import { createContext } from 'preact';
import { Signal, signal } from '@preact/signals';
import { Calculator } from '@Calculator/Calculator';
import { Operator } from '../constants';

export interface CalculatorContextType {
  display: Signal<string>;
  result: Signal<string>;
  error: Signal<string>;
  operators: Signal<IMathOperator[]>;
  calculator: Signal<Calculator<string>>;
  addToDisplay: (value: string) => void;
  clear: () => void;
  calculate: () => void;
  setOperatorSet: (operatorSet: IMathOperator[]) => void;
}

export const DEFAULT_OPERATORS = [
  Operator.Plus,
  Operator.Minus,
  Operator.UnaryPlus,
  Operator.UnaryMinus,
  Operator.Multiply,
  Operator.Divide,
]

export const initCalculator = (operators: IMathOperator[]) => new Calculator({
  supportedOperators: operators,
})

export const CalculatorContext = createContext<CalculatorContextType>({
  display: signal(''),
  result: signal(''),
  error: signal(''),
  operators: signal(DEFAULT_OPERATORS),
  calculator: signal(initCalculator(DEFAULT_OPERATORS)),
  addToDisplay: () => {},
  clear: () => {},
  calculate: () => {},
  setOperatorSet: () => {}
});
