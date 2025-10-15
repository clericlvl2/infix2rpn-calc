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
                    'w-full min-h-16 px-4 bg-gray-800 text-green-400 text-4xl text-right focus:outline-none rounded-lg shadow-lg',
                    'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900',
                    'drop-shadow-[0_0_8px_rgba(0,255,0,0.3)] transition-all duration-300',
                    { ['text-red-600 text-xl h-min cursor-default drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]']: hasError },
                )}
            />
        </div>
    );
};
