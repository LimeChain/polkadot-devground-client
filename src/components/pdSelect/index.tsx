import * as SelectPrimitive from '@radix-ui/react-select';
import {
  type ReactNode,
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

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
  const [container, setContainer] = useState<HTMLDivElement>();

  const refContainer = useCallback((node: HTMLDivElement) => {
    if (node) {
      setContainer(node);
    }
  }, []);

  const hasItems = items ? items.length > 0 : false;

  return (
    <div
      ref={refContainer}
      className={cn(
        'inline-flex w-full',
        'focus-within:z-50',
      )}
    >
      <SelectPrimitive.Root
        onValueChange={onChange}
        value={hasItems ? value : undefined}
      >
        <SelectPrimitive.Trigger
          disabled={disabled || !hasItems}
          className={cn(
            'w-full max-w-full border border-dev-white-900 dark:border-dev-purple-700',
            'flex items-center justify-between gap-4 p-3',
            'font-geist font-body1-regular',
            'transition-colors disabled:cursor-not-allowed disabled:border-dev-red-700',
            '*:truncate',
          )}
        >
          <SelectPrimitive.Value
            asChild
            placeholder={(
              <SelectPlaceholder
                label={label}
                value={placeholder || emptyPlaceHolder}
              />
            )}
          >
            <div className="flex flex-col items-start gap-1">
              {
                label && (
                  <span className="w-full truncate text-left font-geist opacity-70 font-body2-regular">
                    {label}
                  </span>
                )
              }
              {
                value && (
                  <span className="w-full truncate text-left">
                    {value}
                  </span>
                )
              }
            </div>
          </SelectPrimitive.Value>
          <SelectPrimitive.Icon className="shrink-0">
            <Icon name="icon-dropdownArrow" size={[24]} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            className={cn(
              'z-50 flex w-full max-w-96 flex-col gap-1',
              'bg-dev-black-1000 dark:bg-white',
              'text-white dark:text-black',
            )}
            style={{
              minWidth: container?.clientWidth,
            }}
          >
            <SelectPrimitive.Viewport className="max-h-96 p-2">
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
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
};

interface ISelectItem {
  value: string;
  children: ReactNode;
}

const SelectItem = ({ children, value }: ISelectItem) => {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        'p-3 pl-8',
        'relative select-none items-center',
        'cursor-pointer transition-colors',
        'data-[highlighted]:bg-dev-black-400',
        'data-[highlighted]:dark:bg-dev-white-800',
        'data-[highlighted]:outline-none',
        'truncate',
      )}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2 top-1/2 -translate-y-1/2">
        <Icon name="icon-check" size={[16]} />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
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
        label && (
          <span className="font-geist opacity-70 font-body2-regular">
            {label}
          </span>
        )
      }
      {
        value && (
          <span>
            {value}
          </span>
        )
      }
    </div>
  );
};
