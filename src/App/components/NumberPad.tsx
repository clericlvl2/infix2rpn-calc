import { useContext } from 'preact/hooks';
import { Button } from './Button';
import { CalculatorContext } from './context';

const NUMBER_BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

export const NumberPad = () => {
  const {
    addToDisplay,
    calculate,
    clear,
    operators,
  } = useContext(CalculatorContext);

  const visibleOperators = operators.value.filter(o => {
    return ['+', '-'].includes(o.symbol) ? o.arity !== 1 : true;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          onClick={clear}
          variant="clear"
          className="grow"
        >
          C
        </Button>

        <Button
          onClick={calculate}
          className="grow"
          variant="equal"
        >
          =
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="grid grid-cols-3 gap-2 col-span-3">
          {NUMBER_BUTTONS.map(num => (
            <Button
              key={num}
              onClick={() => addToDisplay(num.toString())}
            >
              {num}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2">
          {visibleOperators.map(op => (
            <Button
              key={op.symbol}
              onClick={() => addToDisplay(op.symbol)}
              variant="operator"
            >
              {op.symbol}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
