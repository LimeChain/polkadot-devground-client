import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { walletExtensions } from '@constants/wallet';
import { useStoreWallet } from '@stores';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

export interface IWalletExtensions {
  [key: string]: {
    name: string;
    icon: string;
  };
}

interface IModalWalletSelect extends Pick<IModal, 'onClose'> {}

export const ModalWalletSelect = ({ onClose }: IModalWalletSelect) => {

  const extensions = useStoreWallet?.use?.extensions?.();
  const connectWallet = useStoreWallet?.use?.actions?.()?.connect;

  const handleOnConnect = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const extensionName = e.currentTarget.getAttribute('data-wallet-name') || '';
    connectWallet(extensionName);
    onClose();
  }, [connectWallet, onClose]);

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-96',
        'flex flex-col gap-6 p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
      )}
    >
      <h5 className="self-start font-h5-bold">Connect Wallet</h5>
      <div className={cn(
      )}
      >
        {extensions?.map((extension) => (
          <div
            key={extension}
            data-wallet-name={extension}
            onClick={handleOnConnect}
            className={cn(
              'align-center m-1 flex h-16 p-4',
              'cursor-pointer',
              'bg-dev-purple-300 text-dev-black-1000 hover:bg-dev-purple-200',
              'dark:bg-dev-black-600 dark:text-dev-white-200 dark:hover:bg-dev-black-500',
            )}
          >
            <Icon
              size={[38]}
              name={walletExtensions[extension].icon || 'icon-wallet'}
            />
            <div className="pl-4">
              <div className="font-body1-bold">
                {walletExtensions[extension].name}
              </div>
              <div className="font-body3-regular">Not connected</div>
            </div>
          </div>
        ))}
      </div>

    </Modal>
  );
};