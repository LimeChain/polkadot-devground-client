// import { ModalSaveExample } from '@components/modals/modalSaveExample';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { PDScrollArea } from '@components/pdScrollArea';
import { snippets } from '@constants/snippets';
import {
  cn,
  sleep,
  truncateString,
} from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

interface DefaultExamplesListProps {
  handleClose: () => void;
}

export const DefaultExamplesList = (props: DefaultExamplesListProps) => {
  const { handleClose } = props;

  const { loadExampleContent } = useStoreCustomExamples.use.actions();
  const { name: selectedExample } = useStoreCustomExamples.use.selectedExample();
  const navigate = useNavigate();

  const handleChangeExample = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const id = e.currentTarget.getAttribute('data-example-index') ?? '';

    loadExampleContent(id, 'default');
    navigate(`/code?d=${id}`);
    handleClose();
    void sleep(400);
  }, [
    handleClose,
    loadExampleContent,
    navigate,
  ]);

  return (
    <PDScrollArea
      verticalScrollClassNames="py-4"
      verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
    >
      <ul className="max-h-56 ">
        {
          snippets?.slice(1).map((example) => (
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
                onClick={handleChangeExample}
                className={cn(
                  'flex w-full items-center justify-between',
                  'px-4 py-3.5',
                )}
              >
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  {truncateString(example.name, 60)}
                </p>
              </button>

            </li>
          ))
        }
      </ul>
    </PDScrollArea >
  );
};
