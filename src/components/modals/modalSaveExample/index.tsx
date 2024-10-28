import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IUploadExampleModalClose } from '@custom-types/eventBus';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> {
  code?: string;
  type: string;
  id?: string;
}

export const ModalSaveExample = (props: IModalGithubLogin) => {
  const { code, onClose, type, id } = props;
  const { uploadExample, updateExampleInfo } = useStoreCustomExamples.use.actions();
  const isUploading = useStoreCustomExamples.use.isUploading();

  const [
    exampleName,
    setExampleName,
  ] = useState('');
  const [
    description,
    setDescription,
  ] = useState('');

  const handleSubmit = useCallback(async () => {
    if (!exampleName || !description || !code || !id) {
      return;
    }

    type === 'upload' && uploadExample({
      code,
      description,
      exampleName,
    });

    type === 'update' && updateExampleInfo(
      id,
      exampleName,
      description,
    );
  }, [
    code,
    description,
    exampleName,
    id,
    type,
    updateExampleInfo,
    uploadExample,
  ]);

  const handleExampleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setExampleName(e.target.value);
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  useEventBus<IUploadExampleModalClose>('@@-close-upload-example-modal', () => {
    onClose();
  });

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-96',
        'flex flex-col gap-10 p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
      )}
    >
      <h5 className="self-start font-h5-bold">
        {
          type === 'upload'
            ? 'Upload Example'
            : 'Edit Example'
        }
      </h5>
      <div className="flex flex-col">
        <input
          onChange={handleExampleNameChange}
          placeholder="Enter Example Name"
          value={exampleName}
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <textarea
          onChange={handleDescriptionChange}
          placeholder="Enter Description"
          value={description}
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <button
          disabled={!exampleName || !description}
          onClick={handleSubmit}
          className={cn(
            'flex justify-center',
            'mb-2 mt-6 p-4 transition-colors',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
            { 'opacity-50 cursor-not-allowed': !exampleName || !description },
          )}
        >
          {
            isUploading
              ? (
                <Icon
                  className="animate-spin"
                  name="icon-loader"
                />
              )
              : 'Save'
          }
        </button>
        <button
          onClick={onClose}
          className={cn(
            'p-4 transition-colors',
            'font-geist font-body2-bold',
            'hover:text-dev-white-1000',
          )}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
