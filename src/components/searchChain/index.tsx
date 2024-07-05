import { busDispatch } from '@pivanov/event-bus';
import { useRef } from 'react';

import {
  cn,
  debounce,
} from '@utils/helpers';

import type { IEventBusSearchChain } from '@custom-types/eventBus';

const SearchChain = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleOnChange = () => {
    if (inputRef.current) {
      busDispatch<IEventBusSearchChain>({ type: '@@-search-chain', data: inputRef.current.value });
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 500);

  return (
    <input
      type="text"
      ref={inputRef}
      onChange={debouncedHandleOnChange}
      className={cn(
        'w-full max-w-[calc(100%-2.5rem)] bg-transparent p-3',
        'border-b transition-colors',
        'font-geist text-body2-regular focus:outline-none',
        'border-dev-white-900 focus:border-dev-pink-500 dark:border-dev-purple-400/40',
      )}
      placeholder="Search Parachain"
    />
  );
};

export default SearchChain;