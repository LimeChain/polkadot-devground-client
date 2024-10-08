import { cn } from '@utils/helpers';

import type { ReactNode } from 'react';

interface IQueryButton {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const QueryButton = ({
  children,
  className,
  disabled,
  onClick,
}: IQueryButton) => {

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={cn(
        'block w-full cursor-pointer',
        'p-4 text-dev-white-200',
        'font-geist font-body2-bold',
        'bg-dev-pink-500 transition-[colors_opacity] hover:bg-dev-pink-400',
        {
          ['cursor-not-allowed opacity-30 hover:bg-dev-pink-500']: disabled,
        },
        className,
      )}
    >
      {children}
    </button>
  );
};
