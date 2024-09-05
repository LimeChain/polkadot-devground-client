import * as _Select from '@radix-ui/react-select';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type React from 'react';

export interface ISelect {
  items: {
    label: string;
    value: string;
    key: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  emptyPlaceHolder?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const Select = ({
  items,
  value,
  onChange,
  placeholder,
  emptyPlaceHolder = 'No Items',
  disabled = false,
}: ISelect) => {
  const hasItems = items.length > 0;
  return (
    <_Select.Root
      onValueChange={onChange}
      value={value}
    >
      <_Select.Trigger
        disabled={disabled || !hasItems}
        className={cn(
          'w-full max-w-full border border-dev-white-900 dark:border-dev-purple-700',
          'flex items-center justify-between gap-4 p-4',
          'font-geist font-body1-regular',
          'transition-colors disabled:cursor-not-allowed disabled:border-dev-red-700',
          '*:truncate',
        )}
      >
        <_Select.Value
          placeholder={hasItems ? placeholder : emptyPlaceHolder}
        />
        <_Select.Icon className="shrink-0">
          <Icon name="icon-dropdownArrow" size={[24]} />
        </_Select.Icon>
      </_Select.Trigger>
      <_Select.Portal>
        <_Select.Content className={cn(
          'z-50 flex max-w-[80vw] flex-col gap-1 p-2',
          ' bg-dev-black-1000 dark:bg-white',
          'text-white dark:text-black',
        )}
        >
          <_Select.ScrollUpButton className="flex items-center justify-center">
            <Icon
              name="icon-dropdownArrow"
              className="rotate-180"
              size={[24]}
            />
          </_Select.ScrollUpButton>

          {/* select options */}
          <_Select.Viewport >
            {
              items.map(item => {
                return (
                  <SelectItem
                    key={item.key}
                    value={item.value}
                  >
                    {item.label}
                  </SelectItem>
                );
              })
            }
          </_Select.Viewport>
          {/* select options */}

          <_Select.ScrollDownButton className="flex items-center justify-center">
            <Icon name="icon-dropdownArrow" size={[24]} />
          </_Select.ScrollDownButton>
        </_Select.Content>
      </_Select.Portal>
    </_Select.Root>
  );
};

interface ISelectItem {
  value: string;
  children: React.ReactNode;
}

const SelectItem = ({ children, value }: ISelectItem) => {
  return (
    <_Select.Item
      value={value}
      className={cn(
        'relative select-none items-center ',
        'cursor-pointer p-3 transition-colors',
        'data-[highlighted]:bg-dev-black-400',
        'data-[highlighted]:dark:bg-dev-white-800',
        'data-[highlighted]:outline-none',
        'overflow-hidden text-ellipsis',
        'truncate',
      )}
    >
      <_Select.ItemText>{children}</_Select.ItemText>
      {/* <_Select.ItemIndicator className="">
        <CheckIcon />
      </_Select.ItemIndicator> */}
    </_Select.Item>
  );
};
