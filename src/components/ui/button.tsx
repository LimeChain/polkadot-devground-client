import React, { type FC } from 'react';

interface IButtonProps {
  children: React.ReactNode;
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: FC<IButtonProps> = (props) => {
  const { children, variant = 'md', ...rest } = props;
  let className =
    'rounded bg-green-600 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600';

  switch (variant) {
    case 'xs':
      className += ' px-2 py-1 text-xs font-semibold';
      break;
    case 'sm':
      className += ' px-2 py-1 text-sm font-semibold';
      break;
    case 'md':
      className += ' rounded-md px-2.5 py-1.5 text-sm font-semibold';
      break;
    case 'lg':
      className += ' rounded-md px-3 py-2 text-sm font-semibold';
      break;
    case 'xl':
      className += ' rounded-md px-3.5 py-2.5 text-sm font-semibold';
      break;
    default:
      className += ' px-2 py-1 text-sm font-semibold';
      break;
  }

  return (
    <button
type="button"
className={className}
{...rest}
    >
      {children}
    </button>
  );
};
