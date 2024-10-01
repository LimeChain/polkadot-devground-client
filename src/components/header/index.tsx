import BurgerMenu from '@components/burgerMenu';
import ChainSelectButton from '@components/chainSelectButton';
import { Logo } from '@components/logo';
import { Navigation } from '@components/navigation';
import { ToggleTheme } from '@components/toggleTheme';
import WalletSelectButton from '@components/walletSelectButton';

export const Header = () => {

  return (
    <nav className="z-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Logo />
        <Navigation />
      </div>
      <div className="hidden gap-5 md:flex">
        <ChainSelectButton />
        <WalletSelectButton />
        <ToggleTheme />
      </div>
      <div className="flex md:hidden">
        <ChainSelectButton />
        <BurgerMenu />
      </div>
    </nav>
  );
};

Header.displayName = 'Header';
