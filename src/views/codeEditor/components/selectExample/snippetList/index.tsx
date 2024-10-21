import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/customExamples';

import type { ICodeExample } from 'src/types/codeSnippet';
interface ExamplesListProps {
  examples: ICodeExample[];
  selectedExample: string;
  type: string;
  editable?: boolean;
  handleChangeExample: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ExamplesList = (props: ExamplesListProps) => {
  const { examples, selectedExample, type, editable = false, handleChangeExample } = props;
  const { deleteExample } = useStoreCustomExamples.use.actions();

  const handleDeleteExample = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    const id = e.currentTarget.getAttribute('data-example-index');
    deleteExample(id as string);
  }, [deleteExample]);

  return (
    <PDScrollArea
      verticalScrollClassNames="py-4"
      verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
    >
      <ul className="max-h-56 ">
        {
          examples?.map((example) => (
            <li
              key={example.id}
              className={cn(
                'flex items-center justify-between',
                'transition-[background] duration-300',
                'cursor-pointer',
                'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                {
                  ['bg-dev-black-800 dark:bg-dev-purple-300']: selectedExample === example.name,
                },
              )}
            >
              <button
                data-example-index={example.id}
                data-example-type={type}
                onClick={handleChangeExample}
                className={cn(
                  'flex w-full items-center justify-between',
                  'px-4 py-3.5',
                )}
              >
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  {example.name}
                </p>
              </button>
              {
                editable
                && (
                  <div className={cn(
                    'flex gap-2',
                    'px-4 py-3.5',
                    'text-dev-white-1000 dark:text-dev-black-300',
                  )}
                  >
                    <Icon
                      name="icon-pen"
                      size={[16]}
                    />
                    <span
                      data-example-index={example.id}
                      onClick={handleDeleteExample}
                    >
                      <Icon
                        name="icon-trash"
                        size={[16]}
                      />
                    </span>
                  </div>
                )
              }
            </li>
          ))
        }
      </ul>
    </PDScrollArea >
  );
};
