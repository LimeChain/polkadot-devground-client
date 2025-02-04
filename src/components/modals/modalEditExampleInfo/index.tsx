import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
} from 'react';
import { toast } from 'react-hot-toast';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IEditExampleInfoModalClose } from '@custom-types/eventBus';

interface IModalEditExampleInfo extends Pick<IModal, 'onClose'> {
  id: string;
  onClose: () => void;
}

export const ModalEditExampleInfo = (props: IModalEditExampleInfo) => {
  const { id, onClose } = props;

  const examples = useStoreCustomExamples.use.examples();
  const { updateExampleInfo } = useStoreCustomExamples.use.actions();
  const { isSavingInfo } = useStoreCustomExamples.use.loading();

  const example = examples.find((example) => example.id === id);

  const exampleNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const exampleName = exampleNameRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!exampleName || !description) {
      toast.error('Please fill all fields');
      return;
    }

    updateExampleInfo(id, exampleName, description);
  }, [
    id,
    updateExampleInfo,
  ]);

  useEventBus<IEditExampleInfoModalClose>('@@-close-edit-example-modal', () => {
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
      <div className="flex flex-col p-6">
        <h2 className="mb-10 font-body1-bold">Edit Example</h2>
        <input
          ref={exampleNameRef}
          defaultValue={example?.name ?? ''}
          placeholder="Enter Example Name"
          className={cn(
            'mb-6 border border-dev-white-900 bg-transparent p-4',
            'caret-dev-pink-500 focus-visible:outline-none',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <textarea
          ref={descriptionRef}
          defaultValue={example?.description ?? ''}
          placeholder="Enter Description"
          rows={5}
          className={cn(
            'mb-6 border border-dev-white-900 bg-transparent p-4',
            'caret-dev-pink-500 focus-visible:outline-none',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
        />
        <button
          disabled={isSavingInfo}
          onClick={handleSubmit}
          className={cn(
            'mb-2 mt-6 flex justify-center p-4 font-geist text-white transition-colors font-body2-bold',
            'bg-dev-pink-500 hover:bg-dev-pink-400',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {
            isSavingInfo
              ? (
                <Icon
                  className="animate-spin"
                  name="icon-loader"
                />
              )
              : (
                'Submit'
              )
          }
        </button>
        <button
          onClick={onClose}
          className={cn(
            'p-4 font-geist transition-colors font-body2-bold hover:text-dev-white-1000',
          )}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
