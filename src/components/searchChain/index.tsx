import { useRef } from 'react';

import {
  cn,
  debounce,
} from '@utils/helpers';

const SearchChain = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleOnChange = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value);
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 1000);

  return (
    <input
      type="search"
      ref={inputRef}
      onChange={debouncedHandleOnChange}
      className={cn(
        'w-full max-w-[calc(100%-2.5rem)] bg-transparent p-3',
        'border-b transition-colors',
        'font-geist text-body2-regular focus:outline-none',
        'border-dev-purple-400/40 focus:border-dev-purple-400',
      )}
      placeholder="Search Parachain"
    />
  );
};

export default SearchChain;