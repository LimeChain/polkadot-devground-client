import { busDispatch } from '@pivanov/event-bus';
import { useRef } from 'react';

import {
  cn,
  debounce,
} from '@utils/helpers';

import type { IEventBusSearchChain } from '@custom-types/eventBus';

export const SearchChain = () => {
  const refInput = useRef<HTMLInputElement>(null);

  const handleOnChange = () => {
    if (refInput.current) {
      busDispatch<IEventBusSearchChain>({
        type: '@@-search-chain',
        data: refInput.current.value,
      });
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 500);

  return (
    <input
      ref={refInput}
      onChange={debouncedHandleOnChange}
      placeholder="Search Parachain"
      type="text"
      className={cn(
        'w-full max-w-[calc(100%-2.5rem)] bg-transparent p-3',
        'border-y border-t-transparent transition-colors',
        'font-geist font-body2-regular focus:outline-none',
        'border-b-dev-white-900 focus:border-b-dev-pink-500 dark:border-b-dev-purple-400/40',
      )}
    />
  );
};
