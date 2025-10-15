import clsx from 'clsx';
import { ComponentChildren } from 'preact';

export interface IButtonProps {
    onClick: () => void;
    className?: string;
    children: ComponentChildren;
    variant?: 'primary' | 'clear' | 'operation' | 'equal';
}

const VARIANT_CLASSES = {
    primary: 'bg-gray-600 text-green-300 border-green-400',
    clear: 'text-xl sm:text-2xl bg-red-600 text-white border-red-400',
    operation: 'bg-green-500 lg:hover:bg-green-400 border-green-300',
    equal: 'bg-green-600 text-black border-green-800',
};

export const Button = ({
    onClick,
    className = '',
    children,
    variant = 'primary',
}: IButtonProps) => {
    const handleKeyDown = (event: KeyboardEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.key === 'Enter') {
            onClick();
        }
    };

    return (
        <button
            onKeyDown={handleKeyDown}
            onClick={onClick}
            className={clsx(
                'p-0 sm:p-2 text-3xl sm:text-4xl font-extrabold cursor-pointer rounded lg:hover:opacity-80 lg:transition-opacity bg-clip-text text-transparent bg-gradient-to-r drop-shadow-[0_0_5px_rgba(255,0,255,0.5)] border-2 border-dashed border-gradient-to-r from-purple-400 via-pink-500 to-red-500',
                VARIANT_CLASSES[variant],
                className,
            )}
        >
            {children}
        </button>
    );
};

interface ISimpleButtonProps {
    onClick: IButtonProps['onClick'];
    className?: IButtonProps['className'];
}

export const ClearButton = ({
    onClick,
    className,
}: ISimpleButtonProps) => (
    <Button
        onClick={onClick}
        className={clsx('grow', className)}
        variant="clear"
    >
        C
    </Button>
);

export const ResultButton = ({
    onClick,
    className,
}: ISimpleButtonProps) => (
    <Button
        onClick={onClick}
        className={clsx('grow', className)}
        variant="equal"
    >
        =
    </Button>
);

export const BackspaceButton = ({
    onClick,
    className,
}: ISimpleButtonProps) => (
    <Button
        onClick={onClick}
        className={clsx('grow', className)}
        variant="clear"
    >
        {`<`}
    </Button>
);
