import { CalculatorView } from '@entities/calculator';

export const View = () => {
    return (
        <>
            <h1 className="px-2 text-5xl md:text-7xl font-extrabold text-center py-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
                INFIX 2 RPN CALC
            </h1>
            <CalculatorView />
        </>
    );
};
