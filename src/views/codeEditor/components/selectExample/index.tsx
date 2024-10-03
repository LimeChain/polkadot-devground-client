import { busDispatch } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/pdScrollArea';
import { snippets } from '@constants/snippets';
import {
  cn,
  sleep,
} from '@utils/helpers';

import type { IEventBusMonacoEditorLoadSnippet } from '@custom-types/eventBus';

export const SelectExample = () => {
  const navigate = useNavigate();

  const [
    isOpened,
    setIsOpened,
  ] = useState(false);

  const [
    type,
    setType,
  ] = useState('default');

  const [searchParams] = useSearchParams();
  const selectedSnippet = searchParams.get('s');
  const selectedSnippetName = snippets.find((snippet) => snippet.id === Number(selectedSnippet))?.name;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSetOpen = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const handleSetType = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setType(e.currentTarget.textContent?.toLowerCase() || '');
  }, []);

  const handleChangeExample = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    const snippetIndex = Number(e.currentTarget.getAttribute('data-snippet-index'));
    navigate(`/code?s=${snippetIndex}`);
    setIsOpened(false);

    busDispatch({
      type: '@@-monaco-editor-show-loading',
    });

    await sleep(400);

    busDispatch<IEventBusMonacoEditorLoadSnippet>({
      type: '@@-monaco-editor-load-snippet',
      data: snippetIndex,
    });

    busDispatch({
      type: '@@-monaco-editor-hide-loading',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpened(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative max-w-[50vw]"
    >
      <button
        onClick={handleSetOpen}
        className={cn(
          'relative flex w-full items-center justify-between',
          'px-4 py-[18px]',
          'font-geist font-body2-regular',
          'bg-dev-purple-200 hover:bg-dev-purple-300',
          'dark:bg-dev-black-700 hover:dark:bg-dev-black-600',
          'border-2',
          'dark:border-dev-black-700 dark:hover:border-dev-black-600',
          {
            ['border-dev-pink-500']: isOpened,
          },
        )}
      >
        {selectedSnippetName || 'Select Example'}
        <Icon
          name="icon-dropdownArrow"
          className={cn(
            'transition-transform',
            {
              ['rotate-180']: isOpened,
            },
          )}
        />
      </button>

      <div className={cn(
        'absolute top-20 z-50 w-full p-2',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        'pointer-events-none -translate-y-2',
        'transition-all',
        'opacity-0',
        {
          ['opacity-100 translate-y-0 pointer-events-auto']: isOpened,
        },
      )}
      >
        <div className="flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
          <button
            onClick={handleSetType}
            className={cn(
              'px-2 py-2.5 hover:border-dev-pink-500',
              'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
              'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
              'transform transition-colors duration-300 ease-in-out',
              {
                ['border-dev-pink-500']: type === 'custom',
              },
            )}
          >
            Custom
          </button>
          <button
            onClick={handleSetType}
            className={cn(
              'px-2 py-2.5 hover:border-dev-pink-500',
              'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
              'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
              'transform transition-colors duration-300 ease-in-out',
              {
                ['border-dev-pink-500']: type === 'default',
              },
            )}
          >
            Default
          </button>
        </div>

        <PDScrollArea
          verticalScrollClassNames="py-4"
          verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
        >
          <ul className="h-56 py-4">
            {
              type === 'default'
                ? (
                  snippets.map((snippet) => (
                    <li key={snippet.id}>
                      <button
                        data-snippet-index={snippet.id}
                        onClick={handleChangeExample}
                        className={cn(
                          'flex w-full items-center justify-between',
                          'px-4 py-3.5',
                          'transition-[background] duration-300',
                          'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                          {
                            ['bg-dev-black-800 dark:bg-dev-purple-300']: selectedSnippet === snippet.id.toString(),
                          },
                        )}
                      >
                        <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                          Example:
                          {' '}
                          {snippet.id}
                          {snippet.name}
                        </p>
                        <p className="font-geist text-dev-white-1000 font-body3-regular dark:text-dev-black-300">
                          CUSTOM
                        </p>
                      </button>
                    </li>
                  ))
                )
                : (
                  <li className="font-geist text-dev-white-1000 font-body1-regular dark:text-dev-black-300">
                    No examples found
                  </li>
                )
            }
          </ul>
        </PDScrollArea>
      </div>
    </div>
  );
};
