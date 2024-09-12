import * as _Select from '@radix-ui/react-select';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type React from 'react';

export interface IPDSelect {
  items?: {
    label: string;
    value: string;
    key: string;
  }[];
  value?: string;
  label?: string;
  onChange: (value: string) => void;
  emptyPlaceHolder?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const PDSelect = ({
  items,
  value,
  onChange,
  label,
  placeholder,
  emptyPlaceHolder = 'No Items',
  disabled = false,
}: IPDSelect) => {
  const hasItems = items ? items.length > 0 : false;
  return (
    <_Select.Root
      onValueChange={onChange}
      value={hasItems ? value : undefined}
    >
      <_Select.Trigger
        disabled={disabled || !hasItems}
        className={cn(
          'w-full max-w-full border border-dev-white-900 dark:border-dev-purple-700',
          'flex items-center justify-between gap-4 p-3',
          'font-geist font-body1-regular',
          'transition-colors disabled:cursor-not-allowed disabled:border-dev-red-700',
          '*:truncate',
        )}
      >
        <_Select.Value
          asChild
          placeholder={(
            <SelectPlaceholder
              label={label}
              value={
                hasItems
                  ? placeholder || emptyPlaceHolder
                  : emptyPlaceHolder || placeholder
              }
            />
          )}
        >
          <div className="flex flex-col items-start gap-1">
            {
              label
              && (
                <span className="w-full truncate text-left font-geist opacity-70 font-body2-regular">
                  {label}
                </span>
              )
            }
            {
              value
              && (
                <span className="w-full truncate text-left">
                  {value}
                </span>
              )
            }
          </div>
        </_Select.Value>
        <_Select.Icon className="shrink-0">
          <Icon name="icon-dropdownArrow" size={[24]} />
        </_Select.Icon>
      </_Select.Trigger>
      <_Select.Portal>
        <_Select.Content className={cn(
          'z-50 flex max-w-[80vw] flex-col gap-1',
          ' bg-dev-black-1000 dark:bg-white',
          'text-white dark:text-black',
        )}
        >
          <_Select.ScrollUpButton className="flex items-center justify-center shadow-[black_-2px_-3px_20px_0]">
            <Icon
              name="icon-dropdownArrow"
              className="rotate-180"
              size={[24]}
            />
          </_Select.ScrollUpButton>

          {/* select options */}
          <_Select.Viewport className="max-h-[1000px] p-2" >
            {
              items?.map(item => {
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

          <_Select.ScrollDownButton className="flex items-center justify-center shadow-[black_2px_3px_20px_0]">
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
        'p-3 pl-8',
        'relative select-none items-center ',
        'cursor-pointer transition-colors',
        'data-[highlighted]:bg-dev-black-400',
        'data-[highlighted]:dark:bg-dev-white-800',
        'data-[highlighted]:outline-none',
        'truncate',
      )}
    >
      <_Select.ItemIndicator className="absolute left-2 top-1/2 -translate-y-1/2">
        <Icon name="icon-check" size={[16]} />
      </_Select.ItemIndicator>
      <_Select.ItemText>{children}</_Select.ItemText>
    </_Select.Item>
  );
};

const SelectPlaceholder = ({
  value,
  label,
}: {
  value?: string;
  label?: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-1">
      {
        label
        && (
          <span className="font-geist opacity-70 font-body2-regular">
            {label}
          </span>
        )
      }
      {
        value
        && (
          <span>
            {value}
          </span>
        )
      }
    </div>
  );
};
