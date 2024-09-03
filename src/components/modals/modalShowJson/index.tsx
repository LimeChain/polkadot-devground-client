import { JsonViewer } from '@components/jsonViewer';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

import type { IMappedBlockExtrinsic } from '@custom-types/block';

interface IModalShowJson extends Pick<IModal, 'onClose'> {
  onClose: () => void;
  extrinsic: IMappedBlockExtrinsic;
}

export const ModalShowJson = (props: IModalShowJson) => {
  const { onClose, extrinsic } = props;

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-5/6',
        'flex max-h-screen flex-col gap-8 overflow-auto p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
        'transition-all duration-300 ease-in-out',
      )}
    >
      <h5 className="self-start font-h5-bold">Extrinsics: ${extrinsic.id}</h5>
      <JsonViewer json={extrinsic} />
    </Modal>
  );
};
