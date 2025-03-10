import { useContext, useMemo } from 'preact/hooks';
import { Button } from './Button';
import { CalculatorContext } from './context';

const NUMBER_BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

export const useNumberButtons = () => {
  const { addToExpression } = useContext(CalculatorContext);

  return useMemo(
    () => NUMBER_BUTTONS.map(num => (
      <Button
        key={num}
        onClick={() => addToExpression(num.toString())}
      >
        {num}
      </Button>
    )),
    [],
  );
};

export const useOperatorsButtons = () => {
  const { addToExpression, operators } = useContext(CalculatorContext);

  return useMemo(
    () => {
      const visibleOperators = operators.value.filter(o => {
        const isBasicUnaryOperator = ['+', '-'].includes(o.symbol) && o.arity === 1;

        return !isBasicUnaryOperator;
      });

      return visibleOperators.map(op => (
        <Button
          key={op.symbol}
          onClick={() => addToExpression(op.symbol)}
          variant="operator"
        >
          {op.symbol}
        </Button>
      ));
    },
    [operators],
  );
};
