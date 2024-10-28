import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
import { Tabs } from '@components/tabs';
import { snippets } from '@constants/snippets';
import {
  cn,
  sleep,
} from '@utils/helpers';
import { ExamplesList } from '@views/codeEditor/components/selectExample/snippetList';
import { useStoreCustomExamples } from 'src/stores/examples';

export const SelectExample = () => {
  const refContainer = useRef<HTMLDivElement>(null);
  const { loadExampleContent } = useStoreCustomExamples.use.actions();

  const [
    isOpened,
    setIsOpened,
  ] = useState(false);

  const customExamples = useStoreCustomExamples.use.examples();
  const { getExamples } = useStoreCustomExamples.use.actions();
  const { name: selectedExample } = useStoreCustomExamples.use.selectedExample();
  const navigate = useNavigate();
  const handleSetOpen = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const handleChangeExample = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const id = e.currentTarget.getAttribute('data-example-index') ?? '';
    const type = e.currentTarget.getAttribute('data-example-type') ?? '';

    const queryParam = type === 'default' ? `d=${id}` : `c=${id}`;
    loadExampleContent(id, type);
    navigate(`/code?${queryParam}`);
    setIsOpened(false);

    await sleep(400);
  }, [
    loadExampleContent,
    navigate,
  ]);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (refContainer.current && !refContainer.current.contains(event.target as Node)) {
  //       setIsOpened(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

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
        {selectedExample || 'Select Example'}
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
            'text-dev-white-400 hover:text-dev-white-200',
            'dark:text-dev-black-800 dark:hover:text-dev-black-1000',
          )}

        >
          <div data-title="Default">
            <ExamplesList
              examples={snippets}
              handleChangeExample={handleChangeExample}
              selectedExample={selectedExample}
              type="default"
            />
          </div>
          <div data-title="Custom">
            {
              customExamples?.length >= 1
                ? (
                  <ExamplesList
                    examples={customExamples}
                    handleChangeExample={handleChangeExample}
                    selectedExample={selectedExample}
                    type="custom"
                    editable
                  />
                )
                : (
                  <div className="flex flex-col p-3">
                    <Icon
                      name="icon-group"
                      size={[100]}
                      className={cn(
                        'mb-8',
                        'self-center text-dev-white-1000',
                        'dark:text-dev-purple-50',
                      )}
                    />
                    <div className="flex flex-col items-center justify-center text-white dark:text-dev-black-1000">
                      <h4 className="mb-4 self-center font-h4-bold">Nothing here</h4>
                      <p className="max-w-80 text-center font-geist">
                        Currently, you don't have any custom examples created. Ready to create one?
                      </p>
                      <button
                        className={cn(
                          'mb-2 mt-6 w-full p-4 transition-colors',
                          'font-geist text-white font-body2-bold',
                          'bg-dev-pink-500',
                          'hover:bg-dev-pink-400',
                        )}
                      >
                        Create Example
                      </button>
                    </div>
                  </div>
                )
            }
          </div>
        </Tabs>
      </div>
    </div>
  );
};
