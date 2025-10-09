import clsx from 'clsx';
import { useContext } from 'preact/hooks';
import { StoreContext } from './Store';

const DISPLAY_MAX_LENGTH = 50;

export const Display = () => {
    const {
        expression,
        error,
        setExpression,
        calculate,
    } = useContext(StoreContext);
    const hasError = Boolean(error.value);

    const handleInputChange = (e: Event) => {
        setExpression((e.target as HTMLInputElement).value);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        event.stopPropagation();

        if (event.key === 'Enter') {
            calculate();
        }
    };

    return (
        <div>
            <input
                maxLength={DISPLAY_MAX_LENGTH}
                onKeyDown={handleKeyDown}
                onInput={handleInputChange}
                autoFocus
                type="text"
                readOnly={hasError}
                value={error.value || expression.value}
                className={clsx(
                    'w-full min-h-16 px-4 bg-gray-700 text-green-400 text-4xl text-right focus:outline-none',
                    { ['text-red-600 text-xl h-min cursor-default']: hasError },
                )}
            />
        </div>
    );
};
