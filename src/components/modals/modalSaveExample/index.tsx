import { busDispatch } from '@pivanov/event-bus';
import { useRef } from 'react';

import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IEventBusMonacoEditorUploadExample } from '@custom-types/eventBus';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> { }

export const ModalSaveExample = ({ onClose }: IModalGithubLogin) => {
  const exampleNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const exampleName = exampleNameRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!exampleName || !description) {
      return;
    }

    busDispatch<IEventBusMonacoEditorUploadExample>({
      type: '@@-monaco-editor-upload-example',
      data: {
        name: exampleName,
        description,
      },
    });
  };

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
      <h5 className="self-start font-h5-bold">Save Example</h5>
      <div className="flex flex-col">
        <input
          ref={exampleNameRef}
          placeholder="Enter Example Name"
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <textarea
          ref={descriptionRef}
          placeholder="Enter Description"
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <button
          // disabled={!exampleNameRef.current?.value || !descriptionRef.current?.value}
          onClick={handleSubmit}
          className={cn(
            'mb-2 mt-6 p-4 transition-colors',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
          )}
        >
          Submit
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
