import { useContext } from 'preact/hooks';
import { BackspaceButton, ClearButton, ResultButton } from './Button';
import { StoreContext } from './Store';
import { useNumberButtons, useOperationsButtons } from './useButtons';

export const NumberPad = () => {
    const { calculate, clearExpression, backspace } = useContext(StoreContext);
    const numberButtons = useNumberButtons();
    const operationsButtons = useOperationsButtons();

    return (
        <div className="flex flex-col gap-4">
            <div className="grid gap-4 grid-cols-4">
                <ClearButton
                    className="col-span-1"
                    onClick={clearExpression}
                />
                <ResultButton
                    onClick={calculate}
                    className="col-span-2"
                />
                <BackspaceButton
                    onClick={backspace}
                    className="col-span-1"
                />
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="grid grid-cols-3 gap-4 col-span-3">
                    {numberButtons}
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {operationsButtons}
                </div>
            </div>
        </div>
    );
};
