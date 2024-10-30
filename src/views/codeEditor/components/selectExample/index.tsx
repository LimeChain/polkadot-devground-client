import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { Tabs } from '@components/tabs';
import {
  cn,
  truncateString,
} from '@utils/helpers';
import { CustomExampleList } from '@views/codeEditor/components/selectExample/snippetList/customExamples';
import { DefaultExamplesList } from '@views/codeEditor/components/selectExample/snippetList/defaultExamples';
import { useStoreCustomExamples } from 'src/stores/examples';

export const SelectExample = () => {
  const { name: selectedExample } = useStoreCustomExamples.use.selectedExample();
  const { getExamples } = useStoreCustomExamples.use.actions();

  const refContainer = useRef<HTMLDivElement>(null);

  const [
    isOpened,
    setIsOpened,
  ] = useState(false);

  const [
    initialTab,
    setInitialTab,
  ] = useState(0);

  const handleSetOpen = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpened(false);
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

  useEffect(() => {
    getExamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {truncateString(selectedExample, 60) || 'Select Example'}
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
          initialTab={initialTab}
          onChange={setInitialTab}
          tabClassName={cn(
            'mb-2 px-10 py-2.5',
            'text-dev-white-400 hover:text-dev-white-200',
            'dark:text-dev-black-800 dark:hover:text-dev-black-1000',
          )}

        >
          <div
            data-title="Default"
          >
            <DefaultExamplesList handleClose={handleClose} />
          </div>
          <div data-title="Custom">
            <CustomExampleList handleClose={handleClose} />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

