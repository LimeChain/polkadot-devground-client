import { BurgerMenu } from '@components/burgerMenu';
import ChainSelectButton from '@components/chainSelectButton';
import { Logo } from '@components/logo';
import { MobileChainSelect } from '@components/mobileChainSelect';
import { Navigation } from '@components/navigation';
import { ToggleTheme } from '@components/toggleTheme';
import WalletSelectButton from '@components/walletSelectButton';
import { useResponsive } from '@utils/hooks/useResponsive';

export const Header = () => {
  const { isMobile } = useResponsive();
  return (
    <nav className="z-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <Logo />
        <Navigation />
      </div>
      {
        isMobile
          ? (
            <div className="flex gap-4">
              <MobileChainSelect />
              <BurgerMenu />
            </div>
          )
          : (

            <div className="flex gap-5">
              <ChainSelectButton />
              <WalletSelectButton />
              <ToggleTheme />
            </div>
          )
      }
    </nav>
  );
};

Header.displayName = 'Header';
