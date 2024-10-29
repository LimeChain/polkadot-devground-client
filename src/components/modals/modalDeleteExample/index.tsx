import { useEventBus } from '@pivanov/event-bus';
import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IDeleteExampleModalClose } from '@custom-types/eventBus';

interface IModalDeleteExample extends Pick<IModal, 'onClose'> {
  id: string;
  onClose: () => void;
}

export const ModalDeleteExamples = (props: IModalDeleteExample) => {
  const { id, onClose } = props;
  const { deleteExample } = useStoreCustomExamples.use.actions();
  const { isDeleting } = useStoreCustomExamples.use.loading();

  const handleDelete = useCallback(async () => {
    deleteExample(id);

  }, [
    deleteExample,
    id,
  ]);

  useEventBus<IDeleteExampleModalClose>('@@-close-delete-example-modal', () => {
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
      <div className="mt-10 flex flex-col items-center justify-center gap-10 p-6">
        <Icon
          name="icon-trash"
          size={[96]}
        />
        <div className="flex w-full flex-col">
          <p className="text-center text-2xl font-semibold">Delete Example</p>
          <button
            onClick={handleDelete}
            className={cn(
              'flex justify-center',
              'mb-2 mt-6 p-4 transition-colors',
              'font-geist text-white font-body2-bold',
              'bg-dev-pink-500',
              'hover:bg-dev-pink-400',
            )}
          >
            {
              isDeleting
                ? (
                  <Icon
                    className="animate-spin"
                    name="icon-loader"
                  />
                )
                : 'Delete Example'
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
      </div >

    </Modal >
  );
};
