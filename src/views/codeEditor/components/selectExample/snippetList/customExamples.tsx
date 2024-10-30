import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useCallback,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
// import { ModalSaveExample } from '@components/modals/modalSaveExample';
import { Loader } from '@components/loader';
import { ModalDeleteExamples } from '@components/modals/modalDeleteExample';
import { ModalEditExampleInfo } from '@components/modals/modalEditExampleInfo';
import { PDScrollArea } from '@components/pdScrollArea';
import {
  cn,
  sleep,
  truncateString,
} from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

interface ExamplesListProps {
  handleClose: () => void;
}
export const CustomExampleList = (props: ExamplesListProps) => {
  const { handleClose } = props;
  const customExamples = useStoreCustomExamples.use.examples();
  const { isGettingExamples } = useStoreCustomExamples.use.loading();
  const { name: selectedExample } = useStoreCustomExamples.use.selectedExample();
  const { loadExampleContent } = useStoreCustomExamples.use.actions();
  const navigate = useNavigate();

  const exampleId = useRef('');

  const [
    EditExampleInfo,
    toggleEditExampleInfoModal,
  ] = useToggleVisibility(ModalEditExampleInfo);

  const [
    DeleteExampleModal,
    toggleDeleteModal,
  ] = useToggleVisibility(ModalDeleteExamples);

  const handleDeleteExample = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const id = e.currentTarget.getAttribute('data-example-index');
    exampleId.current = id as string;
    toggleDeleteModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditExample = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const id = e.currentTarget.getAttribute('data-example-index');
    exampleId.current = id as string;
    toggleEditExampleInfoModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeExample = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const id = e.currentTarget.getAttribute('data-example-index') ?? '';

    loadExampleContent(id, 'custom');
    navigate(`/code?c=${id}`);
    handleClose();
    void sleep(400);
  }, [
    handleClose,
    loadExampleContent,
    navigate,
  ]);

  const handleNavigateToCreateExample = useCallback(() => {
    navigate('/code?d=1');
    loadExampleContent('1', 'default');
    handleClose();
  }, [
    handleClose,
    loadExampleContent,
    navigate,
  ]);

  if (isGettingExamples) {
    return (
      <div className="flex h-full min-h-56 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!customExamples.length) {
    return (
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
            onClick={handleNavigateToCreateExample}
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
    );
  }

  return (
    <>
      <PDScrollArea
        verticalScrollClassNames="py-4"
        verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
      >
        <ul className="max-h-56 ">
          {
            customExamples?.map((example) => (
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
                <div className={cn(
                  'flex gap-2',
                  'px-4 py-3.5',
                  'text-dev-white-1000 dark:text-dev-black-300',
                )}
                >
                  <span
                    data-example-index={example.id}
                    onClick={handleEditExample}
                  >
                    <Icon
                      name="icon-pen"
                      size={[17]}
                    />
                  </span>
                  <span
                    data-example-index={example.id}
                    onClick={handleDeleteExample}
                  >
                    <Icon
                      name="icon-trash"
                      size={[17]}
                    />
                  </span>
                </div>
              </li>
            ))
          }
        </ul>
      </PDScrollArea >
      <DeleteExampleModal
        id={exampleId.current}
        onClose={toggleDeleteModal}
      />
      <EditExampleInfo
        id={exampleId.current}
        onClose={toggleEditExampleInfoModal}
      />
    </>
  );
};
