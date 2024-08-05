import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/scrollArea';
import { snippets } from '@constants/snippets';
import { cn } from '@utils/helpers';

export const SelectExample = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [searchParams] = useSearchParams();
  const selectSnipped = searchParams.get('s');
  const containerRef = useRef(null);

  const handleSetOpen = useCallback(() => {
    setIsOpened(prev => !prev);
  }, []);

  const handleChangeExample = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const snippetIndex = Number(e.currentTarget.getAttribute('data-snippet-index'));
    window.location.href = `/code?s=${snippetIndex}`;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((containerRef.current as unknown as HTMLElement) && !(containerRef.current as unknown as HTMLElement).contains(event.target as Node)) {
        setIsOpened(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className="group relative w-6/12" ref={containerRef}>
      <button
        className={cn(
          'relative flex w-full items-center justify-between px-4 py-[18px]',
          'font-geist text-body2-regular',
          'bg-dev-purple-200 hover:bg-dev-purple-300',
          'border-2 border-dev-purple-200',
          'dark:bg-dev-black-700 hover:dark:bg-dev-black-600',
          'dark:border-dev-black-700 dark:hover:border-dev-black-600',
          {
            'border-dev-pink-500': isOpened,
          },
        )}
        onClick={handleSetOpen}
      >
        Select Example
        <Icon
          name="icon-dropdownArrow"
          className={cn('transition-transform', { 'rotate-180': isOpened })}
        />
      </button>

      <div className={cn(
        'absolute top-20 z-50 w-full p-2 transition-all ',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        {
          'opacity-0 transform -translate-y-2 pointer-events-none': !isOpened,
          'opacity-100 transform translate-y-0 pointer-events-auto': isOpened,
        },
      )}
      >
        <div className={cn(
          'px-2 font-geist',
          'border-b border-dev-purple-700 dark:border-dev-purple-300',
          'text-dev-white-200 dark:text-dev-black-800',
        )}
        >
          <button className="border-b-4 border-dev-pink-500 px-2 py-2.5">Custom</button>
          <button className="px-2 py-2.5">Default</button>
        </div>

        <PDScrollArea
          className="h-72 "
          viewportClassNames="py-4"
          verticalScrollClassNames="py-4"
          verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
        >
          <ul>
            {snippets.map((snippet) => (
              <li key={snippet.id}>
                <button
                  className={cn(
                    'flex w-full items-center justify-between px-4 py-3.5',
                    'transition-[background] duration-300',
                    'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                    {
                      'bg-dev-black-800 dark:bg-dev-purple-300': selectSnipped === snippet.id.toString(),
                    },
                  )}
                  onClick={handleChangeExample}
                  data-snippet-index={snippet.id}
                >
                  <p className="font-geist text-body2-regular text-dev-white-200 dark:text-dev-black-1000">
                    Example: {snippet.id}
                  </p>
                  <p className="font-geist text-body3-regular text-dev-white-1000 dark:text-dev-black-300">
                    CUSTOM
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </PDScrollArea>
      </div>
    </div>
  );
};
