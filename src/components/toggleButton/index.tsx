import {
  type ChangeEvent,
  useId,
} from 'react';

import { cn } from '@utils/helpers';

interface ToggleButtonProps {
  isChecked: boolean;
  handleSetCheck: (e: ChangeEvent<HTMLInputElement>) => void;
  classNames?: string;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const _id = useId();

  const {
    isChecked,
    handleSetCheck,
    classNames,
  } = props;

  return (
    <>
      <input
        checked={isChecked}
        className="sr-only"
        id={_id}
        onChange={handleSetCheck}
        type="checkbox"
      />
      <label
        htmlFor={_id}
        className={cn(
          'flex h-5 w-9 cursor-pointer items-center rounded-full bg-dev-white-900 pl-0.5 pr-0.5',
          'transition-colors duration-500',
          {
            ['bg-dev-pink-500']: isChecked,
          },
          classNames,
        )}
      >
        <div
          className={cn(
            'h-4 w-4 rounded-full bg-dev-white-200 shadow-lg',
            'translate-x-0 transform transition duration-500',
            {
              ['translate-x-4']: isChecked,
            },
          )}
        />
      </label>
    </>
  );
};
