import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useCallback,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { ExampleNotFound } from '@components/exampleNotFound';
import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { ModalDeleteExample } from '@components/modals/modalDeleteExample';
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
  ] = useToggleVisibility(ModalDeleteExample);

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
      <ExampleNotFound
        classes="p-2"
        iconClasses="dark:text-dev-black-1000"
        onClick={handleNavigateToCreateExample}
        textClasses={cn(
          'self-center',
          'text-dev-purple-50',
          'dark:text-dev-black-1000',
        )}
      />
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
                    className="duration-200 hover:text-dev-pink-500"
                    data-example-index={example.id}
                    onClick={handleEditExample}
                  >
                    <Icon
                      name="icon-pen"
                      size={[17]}
                    />
                  </span>
                  <span
                    className="duration-200 hover:text-dev-pink-500"
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
