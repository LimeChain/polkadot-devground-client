import { cn } from '@utils/helpers';

import type React from 'react';

export interface IQueryButton {
  children: React.ReactNode;
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
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'block w-full cursor-pointer',
        'p-4',
        'font-geist font-body2-bold',
        'bg-dev-pink-500 transition-[colors_opacity] active:bg-dev-pink-400',
        'hov',
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
