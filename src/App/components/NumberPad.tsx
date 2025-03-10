import { useContext } from 'preact/hooks';
import { ClearButton, ResultButton } from './Button';
import { CalculatorContext } from './context';
import { useNumberButtons, useOperatorsButtons } from './useButtons';

export const NumberPad = () => {
  const { calculate, clearExpression } = useContext(CalculatorContext);
  const numberButtons = useNumberButtons();
  const operatorsButtons = useOperatorsButtons();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <ClearButton onClick={clearExpression}/>
        <ResultButton onClick={calculate}/>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="grid grid-cols-3 gap-4 col-span-3">
          {numberButtons}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {operatorsButtons}
        </div>
      </div>
    </div>
  );
};
