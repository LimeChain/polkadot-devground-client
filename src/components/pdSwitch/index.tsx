import * as _Switch from '@radix-ui/react-switch';

import { cn } from '@utils/helpers';

interface IPDSwitch {
  title?: string;
  checked: boolean;
  onChange: () => void;
}

export const PDSwitch = ({ title, checked, onChange }: IPDSwitch) => {
  return (
    <label className="flex w-fit cursor-pointer items-center gap-2" >
      <_Switch.Root
        className={cn(
          'group h-7 w-11 rounded-[50px]',
          'bg-dev-black-200 transition-colors data-[state=checked]:bg-dev-pink-500',
        )}
        checked={checked}
        onCheckedChange={onChange}
      >
        <_Switch.Thumb className={cn(
          'block size-5 rounded-full bg-dev-white-200 transition-transform',
          'translate-x-1 group-data-[state=checked]:translate-x-5',
        )}
        />
      </_Switch.Root>
      {
        title
        && <span>{title}</span>
      }
    </label>
  );
};
