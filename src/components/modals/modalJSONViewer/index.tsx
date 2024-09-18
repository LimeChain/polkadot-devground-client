import { JsonViewer } from '@components/jsonViewer';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

import type {
  IMappedBlockEvent,
  IMappedBlockExtrinsic,
} from '@custom-types/block';

interface IModalJSONViewer extends Pick<IModal, 'onClose'> {
  jsonData?: IMappedBlockExtrinsic | IMappedBlockEvent | unknown;
  title?: string;
  onClose: () => void;
}

export const ModalJSONViewer = (props: IModalJSONViewer) => {
  const {
    jsonData,
    onClose,
    title,
  } = props;

  if (!jsonData) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'p-6',
        'z-[999] w-5/6',
        'flex flex-col gap-8 overflow-auto',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
        'transition-all duration-300 ease-in-out',
      )}
    >
      <h5 className="self-start font-h5-bold">{title}</h5>
      <JsonViewer json={jsonData} />
    </Modal>
  );
};
