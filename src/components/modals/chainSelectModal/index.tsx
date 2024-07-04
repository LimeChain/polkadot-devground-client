import { PDScrollArea } from '@components/scrollArea';

import {
  type IModal,
  Modal,
} from '../modal';

interface IChainSelectModal extends Pick<IModal, 'onClose'> {}
export const ChainSelectModal = ({ onClose }: IChainSelectModal) => {
  return (
    <Modal className="max-w-[1000px] bg-dev-black-950" onClose={onClose} >
      <div className="grid grid-cols-[276fr_708fr] border-b border-b-dev-black-600 px-6 pt-6">
        <h4 className="text-h4-bold">Select Parachain</h4>
        <div> search bar </div>
      </div>
      <div className="grid grid-cols-[276fr_708fr] px-6">
        <PDScrollArea>
          <ul>
            <li>chain</li>
            <li>chain</li>
            <li>chain</li>
            <li>chain</li>
          </ul>
        </PDScrollArea>
        <div className="">chains</div>
      </div>
    </Modal>
  );
  
};