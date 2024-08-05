import {
  useCallback,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { Icon } from '@components/icon';
import { snippets } from '@constants/snippets';
import { cn } from '@utils/helpers';

export const SelectExample = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [searchParams] = useSearchParams();
  const selectSnipped = searchParams.get('s');

  const handleSetOpen = useCallback(() => {
    setIsOpened(prev => !prev);
  }
  , []);

  const handleChangeExample = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const snippetIndex = Number(e.currentTarget.getAttribute('data-snippet-index'));
    window.location.href = `/code?s=${snippetIndex}`;
  }, []);

  return (
    <div className="group relative w-6/12	">
   
      <button
        className={cn(
          'flex w-full items-center justify-between px-4 py-[18px]',
          'relative px-2 py-5',
          'border-dev-pink-500 bg-dev-purple-200 group-focus-within:border-2 group-hover:bg-dev-purple-300',
          'flex items-center gap-1',
        )}
      >
        <p className="font-geist text-body2-regular">
            Select Example   
        </p> 
        <Icon
          name="icon-dropdownArrow"
          className="transition-transform group-focus-within:rotate-180"
        />
      </button>

      <div className={cn(
        'absolute top-20 z-50 w-full',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        'hidden group-focus-within:block',
      )}
      >
        <div className={cn(
          'mb-4 px-2 font-geist text-body2-regular',
          'border-b border-dev-purple-700 dark:border-dev-purple-300',
          'text-dev-white-200 dark:text-dev-black-800',
        )}
        >
          <button className="border-b-4 border-dev-pink-500 px-2 py-2.5">Custom</button>
          <button className="px-2 py-2.5">Default</button>
        </div>
          
        {snippets.map((snippet) => (
          <>
            <button
              key={snippet.id}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3.5',
                'transition-[background] duration-300',
                'hover:bg-dev-black-800 hover:dark:bg-dev-purple-300',
              
              )}
              onClick={handleChangeExample}
              data-snippet-index={snippet.id}
            >
              <p className={cn(
                'font-geist text-body2-regular text-dev-white-200',
                'dark:text-dev-black-1000',
              )}
              >
               Example: {snippet.id}
              </p> 
  
              <p className={cn(
                'font-geist text-body3-regular text-dev-white-1000',
                'dark:text-dev-black-300',
              )}
              >
              CUSTOM          
              </p> 
            </button>
            <button
              key={snippet.id}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3.5',
                'transition-[background] duration-300',
                'hover:bg-dev-black-800 hover:dark:bg-dev-purple-300',
              
              )}
              onClick={handleChangeExample}
              data-snippet-index={snippet.id}
            >
              <p className={cn(
                'font-geist text-body2-regular text-dev-white-200',
                'dark:text-dev-black-1000',
              )}
              >
               Example: {snippet.id}
              </p> 
  
              <p className={cn(
                'font-geist text-body3-regular text-dev-white-1000',
                'dark:text-dev-black-300',
              )}
              >
              CUSTOM          
              </p> 
            </button>
            <button
              key={snippet.id}
              className={cn(
                'flex w-full items-center justify-between px-4 py-3.5',
                'transition-[background] duration-300',
                'hover:bg-dev-black-800 hover:dark:bg-dev-purple-300',
              
              )}
              onClick={handleChangeExample}
              data-snippet-index={snippet.id}
            >
              <p className={cn(
                'font-geist text-body2-regular text-dev-white-200',
                'dark:text-dev-black-1000',
              )}
              >
               Example: {snippet.id}
              </p> 
  
              <p className={cn(
                'font-geist text-body3-regular text-dev-white-1000',
                'dark:text-dev-black-300',
              )}
              >
              CUSTOM          
              </p> 
            </button>
          </>
        ))}
      </div>
      
    </div>
  );
};