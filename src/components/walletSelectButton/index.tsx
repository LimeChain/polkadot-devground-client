import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useLocation } from 'react-router-dom';

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
              'mb-2 mt-6 p-4 transition-colors',
              'font-geist text-white font-body2-bold',
              'bg-dev-pink-500 ',
              'hover:bg-dev-pink-400',
            )}
          >
            <h5 className="ml-[6px] mr-3 font-h5-bold">
          Disconnect wallet
            </h5>
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleVisibility}
            className={cn(
              'mb-2 mt-6 p-4 transition-colors',
              'font-geist text-white font-body2-bold',
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
