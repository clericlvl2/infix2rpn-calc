import clsx from 'clsx';
import { useContext } from 'preact/hooks';
import { CalculatorContext } from './context';

const DISPLAY_MAX_LENGTH = 50;

export const Display = () => {
  const { display, error } = useContext(CalculatorContext);
  const baseClasses = 'px-4 bg-gray-700 text-green-400 min-h-16 w-full text-4xl text-right focus:outline-none';
  const hasError = Boolean(error.value);

  return (
    <div>
      <input
        maxLength={DISPLAY_MAX_LENGTH}
        autoFocus
        type="text"
        readOnly={hasError}
        value={error.value || display.value}
        className={clsx(
          baseClasses,
          { ['text-red-600 text-xl h-min cursor-default']: hasError }
        )}
      />
    </div>
  );
};
