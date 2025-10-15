import { Display } from './Display';
import { NumberPad } from './NumberPad';
import { StoreProvider } from './StoreProvider';

export const CalculatorView = () => {
    return (
        <StoreProvider>
            <div className="w-3/4 flex flex-col gap-8 p-8 md:w-1/2 md:p-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 rounded-3xl shadow-2xl shadow-purple-500/20 transform transition-all duration-300">
                <Display />
                <NumberPad />
            </div>
        </StoreProvider>
    );
};
