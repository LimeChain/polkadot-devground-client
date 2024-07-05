import ChainSelector from '@components/chainSelector';

import {
  type IModal,
  Modal,
} from '../modal';

interface IChainSelectModal extends Pick<IModal, 'onClose'> {}
export const ChainSelectModal = ({ onClose }: IChainSelectModal) => {
  return (
    <Modal className="w-[calc(100%-32px)] max-w-[1000px]" onClose={onClose} >
      <div className="grid grid-cols-chainSelect border-b border-b-dev-black-600 px-8 py-6">
        <h4 className="text-h4-bold">Select Parachain</h4>
        <div className="pl-4"> search bar </div>
      </div>
      <ChainSelector/>
    </Modal>
  );
  
};