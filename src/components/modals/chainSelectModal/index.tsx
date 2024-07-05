import ChainSelector from '@components/chainSelector';
import SearchChain from '@components/searchChain';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IChainSelectModal extends Pick<IModal, 'onClose'> {}
export const ChainSelectModal = ({ onClose }: IChainSelectModal) => {
  return (
    <Modal className="w-[calc(100%-32px)] max-w-[1000px]" onClose={onClose} >
      <div className={cn(
        'grid grid-cols-chainSelect border-b px-8 py-6',
        'border-b-dev-purple-300 dark:border-b-dev-black-600',
      )}
      >
        <h4 className="flex items-center text-h4-bold">Select Parachain</h4>
        <div className="pl-4"> <SearchChain/> </div>
      </div>
      <ChainSelector/>
    </Modal>
  );
  
};