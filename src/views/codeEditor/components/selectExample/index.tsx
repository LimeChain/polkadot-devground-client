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
import { Tabs } from '@components/tabs';
import { snippets } from '@constants/snippets';
import {
  cn,
  sleep,
} from '@utils/helpers';
import { CustomExamples } from '@views/codeEditor/components/customExamples';
import { SnippetList } from '@views/codeEditor/components/selectExample/snippetList';

import type { IEventBusMonacoEditorLoadSnippet } from '@custom-types/eventBus';

export const SelectExample = () => {
  const navigate = useNavigate();

  const [
    isOpened,
    setIsOpened,
  ] = useState(false);

  const [searchParams] = useSearchParams();
  const selectedSnippet = searchParams.get('s');
  const selectedSnippetName = snippets.find((snippet) => snippet.id === Number(selectedSnippet))?.name;

  const refContainer = useRef<HTMLDivElement>(null);

  const handleSetOpen = useCallback(() => {
    setIsOpened((prev) => !prev);
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
      if (refContainer.current && !refContainer.current.contains(event.target as Node)) {
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
      ref={refContainer}
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
        'absolute top-18 z-50 w-full p-2',
        'bg-dev-black-1000 dark:bg-dev-purple-50',
        'pointer-events-none -translate-y-2',
        'transition-all',
        'opacity-0',
        {
          ['opacity-100 translate-y-0 pointer-events-auto']: isOpened,
        },
      )}
      >
        <Tabs
          tabClassName={cn(
            'mb-2 px-10 py-2.5',
            'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
          )}

        >
          <div data-title="Custom">
            <CustomExamples />
          </div>
          <div data-title="Default">
            <SnippetList
              handleChangeExample={handleChangeExample}
              snippets={snippets}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
};
