import ChainSelectButton from '@components/chainSelectButton';
import { Logo } from '@components/logo';
import { Navigation } from '@components/navigation';
import { ToggleTheme } from '@components/toggleTheme';
import { useStoreWallet } from 'src/stores/wallet';

export const Header = () => {

  const connectWallet = useStoreWallet?.use?.actions?.()?.connect;
  const disconnectWallet = useStoreWallet?.use?.actions?.()?.disconnect;
  const accounts = useStoreWallet?.use?.accounts?.();

  return (
    <nav className="z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-12">
        <Logo />
        <Navigation />
      </div>
      <div className="flex gap-5">
        {
          accounts.length > 0
            ? <button type="button" onClick={disconnectWallet}>Disconnect Wallet</button>
            : <button type="button" onClick={connectWallet}>Connect Wallet</button>
        }

        <ChainSelectButton />
        <ToggleTheme />
      </div>
    </nav>
  );
};

Header.displayName = 'Header';
