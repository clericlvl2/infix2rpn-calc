import { StoreProvider } from './model/StoreProvider';
import { Display } from './ui/Display';
import { NumberPad } from './ui/NumberPad';

export const View = () => {
    return (
        <StoreProvider>
            <main className="w-3/4 flex flex-col gap-8 p-4 md:w-1/2 md:p-8 bg-gray-800">
                <Display />
                <NumberPad />
            </main>
        </StoreProvider>
    );
};
