import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@components/icon';
import { CreateExample } from '@components/modals/modalSaveExample/createExample';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IUploadExampleModalClose } from '@custom-types/eventBus';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> {
  code?: string;
  onClose: () => void;
}

export const ModalSaveExample = (props: IModalGithubLogin) => {
  const { code, onClose } = props;

  const selectedExample = useStoreCustomExamples.use.selectedExample();
  const examples = useStoreCustomExamples.use.examples();

  const { updateExampleContent, loadExampleContent } = useStoreCustomExamples.use.actions();
  const { isSavingContent, isCreatingExample } = useStoreCustomExamples.use.loading();
  const navigate = useNavigate();

  const [
    createNewExample,
    setCreateNewExample,
  ] = useState(false);

  const [
    isDefaultExample,
    setIsDefaultExample,
  ] = useState(false);

  const handleUpdateCurrentExample = useCallback(() => {

    if (!code) {
      toast.error('No code to save');
      return;
    }

    updateExampleContent(code);
  }, [
    code,
    updateExampleContent,
  ]);

  const handleChangeIsUpload = useCallback(() => {
    setCreateNewExample(!createNewExample);
  }, [createNewExample]);

  useEffect(() => {
    //Check who is author in order to other users to be able to save as new example directly
    const isAuthor = examples.some((example) => example.id === selectedExample.id);

    if (!isAuthor) {
      setCreateNewExample(true);
      setIsDefaultExample(true);
    }
  }, [
    examples,
    selectedExample.id,
  ]);

  useEventBus<IUploadExampleModalClose>('@@-close-upload-example-modal', ({ data: id }) => {
    navigate(`/code?c=${id}`);
    loadExampleContent(id, 'custom');
    onClose();
  });

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-96',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
      )}
    >
      {
        createNewExample
          ? (
            <CreateExample
              code={code as string}
              handleClose={isDefaultExample ? onClose : handleChangeIsUpload}
            />
          )
          : (
            <>
              <div className="mt-10 flex flex-col items-center justify-center gap-10 p-6">
                <Icon
                  name="icon-save"
                  size={[96]}
                />
                <div className="flex w-full flex-col">
                  <p className="text-center text-2xl font-semibold">Save Changes</p>
                  <button
                    disabled={isSavingContent}
                    onClick={handleUpdateCurrentExample}
                    className={cn(
                      'flex justify-center',
                      'mb-2 mt-6 p-4 transition-colors',
                      'font-geist text-white font-body2-bold',
                      'bg-dev-pink-500',
                      'hover:bg-dev-pink-400',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                    )}
                  >
                    {
                      isSavingContent
                        ? (
                          <Icon
                            className="animate-spin"
                            name="icon-loader"
                          />
                        )
                        : 'Save to Current Example '
                    }
                  </button>
                  <button
                    onClick={handleChangeIsUpload}
                    className={cn(
                      'p-4 transition-colors',
                      'font-geist font-body2-bold',
                      'hover:text-dev-white-1000',
                    )}
                  >
                    {
                      isCreatingExample
                        ? (
                          <Icon
                            className="animate-spin"
                            name="icon-loader"
                          />
                        )
                        : 'Save as New Example'
                    }
                  </button>
                </div>
              </div >
            </>
          )}
    </Modal >
  );
};
