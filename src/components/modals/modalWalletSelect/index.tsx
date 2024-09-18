import { useCallback } from 'react';

import { useStoreWallet } from '@stores';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IModalWalletSelect extends Pick<IModal, 'onClose'> {}

export const ModalWalletSelect = ({ onClose }: IModalWalletSelect) => {

  const extensions = useStoreWallet?.use?.extensions?.();
  const connectWallet = useStoreWallet?.use?.actions?.()?.connect;

  const handleOnConnect = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const extensionName = e.currentTarget.getAttribute('data-wallet-name') || '';
    connectWallet(extensionName);
    onClose();
  }, [connectWallet, onClose]);

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
      <h5 className="self-start font-h5-bold">Connect Wallet</h5>

      <div className="flex flex-col" >

        <div className={cn(
          'flex flex-col items-center',
          'gap-6 p-4',
        )}
        >
          {extensions?.map((extension) => (
            <button
          
              key={extension}
              data-wallet-name={extension}
              onClick={handleOnConnect}
              className={cn(
                'flex items-center justify-center',
                'h-12 w-full',
                'rounded-md',
                'bg-dev-purple-300',
                'dark:bg-dev-purple-700',
                'text-white',
                'font-geist font-body1-regular',
              )}
            > 
              {extension}
            </button>
          ))}
        </div>

      </div>
    </Modal>
  );
};

/* Frame 1547767555 */

/* Auto layout */

/* Inside auto layout */

