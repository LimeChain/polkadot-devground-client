import { JsonViewer } from '@components/jsonViewer';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

interface IModalJSONViewer extends Pick<IModal, 'onClose'> {
  extrinsic?: IMappedBlockExtrinsic;
  onClose: () => void;
}

export const ModalJSONViewer = (props: IModalJSONViewer) => {
  const {
    extrinsic,
    onClose,
  } = props;

  if (!extrinsic) {
    return null;
  }

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'z-[999] w-5/6',
        'flex flex-col gap-8 overflow-auto p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
        'transition-all duration-300 ease-in-out',
      )}
    >
      <h5 className="self-start font-h5-bold">Extrinsics: #{extrinsic.id}</h5>
      <JsonViewer json={extrinsic} />
    </Modal>
  );
};
