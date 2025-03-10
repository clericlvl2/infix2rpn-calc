import clsx from 'clsx';
import { ComponentChildren } from 'preact';

export interface IButtonProps {
  onClick: () => void;
  className?: string;
  children: ComponentChildren;
  variant?: 'primary' | 'clear' | 'operator' | 'equal';
}

const VARIANT_CLASSES = {
  primary: 'bg-gray-600 text-green-300',
  clear: 'text-2xl bg-red-600 text-white',
  operator: 'bg-green-500 lg:hover:bg-green-400',
  equal: 'bg-green-600 text-black',
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
        'p-2 text-4xl font-bold cursor-pointer rounded lg:hover:opacity-80 lg:transition-opacity',
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
}

export const ClearButton = ({ onClick }: ISimpleButtonProps) => (
  <Button
    onClick={onClick}
    className="grow"
    variant="clear"
  >
    C
  </Button>
);
export const ResultButton = ({ onClick }: ISimpleButtonProps) => (
  <Button
    onClick={onClick}
    className="grow"
    variant="equal"
  >
    =
  </Button>
);
