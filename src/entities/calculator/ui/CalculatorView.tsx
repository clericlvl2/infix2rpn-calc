import { Display } from './Display';
import { NumberPad } from './NumberPad';
import { StoreProvider } from './StoreProvider';

export const CalculatorView = () => {
    return (
        <StoreProvider>
            <div className="w-3/4 flex flex-col gap-8 p-4 md:w-1/2 md:p-8 bg-gray-800">
                <Display />
                <NumberPad />
            </div>
        </StoreProvider>
    );
};
