import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { ModalWalletSelect } from '@components/modals/modalWalletSelect';
import { useStoreWallet } from '@stores';
import { cn } from '@utils/helpers';

const WalletSelectButton = () => {

  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const disconnectWallet = useStoreWallet?.use?.actions?.()?.disconnect;
  const accounts = useStoreWallet?.use?.accounts?.();

  const [
    WalletSelectModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalWalletSelect);

  if (isHomePage) {
    return null;
  }

  return (
    <>
      {
        accounts.length > 0 ? (
          <button
            type="button"
            onClick={disconnectWallet}
            className={cn(
              'flex min-h-10 items-center px-6 py-1 transition-colors',
              'font-geist text-white',
              'bg-dev-purple-700 hover:bg-dev-purple-600',
              'dark:bg-dev-purple-50 dark:text-dev-black-1000 dark:hover:bg-dev-purple-200',
            )}
          >
            <Icon
              name="icon-wallet"
            />
            <h5 className="ml-[6px] mr-3 font-h5-bold">

              {accounts[0].address.slice(0, 6)}...{accounts[0].address.slice(-4)}
            </h5>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleVisibility}
            className={cn(
              'min-h-10 items-center px-6 py-1 transition-colors',
              'font-geist text-white font-h5-regular',
              'bg-dev-pink-500 ',
              'hover:bg-dev-pink-400',
            )}
          >
            <h5 className="ml-[6px] mr-3 font-h5-bold">
          Connect wallet
            </h5>
          </button>
        )
      }
      <WalletSelectModal onClose={toggleVisibility}/>

    </>
  );
};

export default WalletSelectButton;