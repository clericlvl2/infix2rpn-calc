import { useContext, useMemo } from 'preact/hooks';
import { Button } from './Button';
import { StoreContext } from './Store';

const NUMBER_BUTTONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0] as const;

export const useNumberButtons = () => {
    const { addToExpression } = useContext(StoreContext);

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

export const useOperationsButtons = () => {
    const { addToExpression, operations } = useContext(StoreContext);

    return useMemo(
        () => {
            const visibleOperations = operations.value.filter((o) => {
                const isBasicUnaryOperation = ['+', '-'].includes(o.symbol) && o.arity === 1;

                return !isBasicUnaryOperation;
            });

            return visibleOperations.map(op => (
                <Button
                    key={op.symbol}
                    onClick={() => addToExpression(op.symbol)}
                    variant="operation"
                >
                    {op.symbol}
                </Button>
            ));
        },
        [operations],
    );
};
