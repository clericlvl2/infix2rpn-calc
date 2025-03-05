import clsx from 'clsx';
import { ComponentChildren } from 'preact';

interface ButtonProps {
  onClick: () => void;
  className?: string;
  children: ComponentChildren;
  variant?: 'primary' | 'clear' | 'operator' | 'equal';
}

export const Button = ({
  onClick,
  className = '',
  children,
  variant = 'primary',
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-gray-600 text-green-300',
    clear: 'bg-red-600 text-white',
    operator: 'bg-green-500 hover:bg-green-400',
    equal: 'bg-green-600 text-black',
  };

  const baseClasses = 'p-2 text-2xl font-bold cursor-pointer rounded hover:opacity-80 transition-opacity';

  return (
    <button
      onClick={onClick}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
};
