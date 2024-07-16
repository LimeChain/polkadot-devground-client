import ChainSelectButton from '@components/chainSelectButton';
import { Logo } from '@components/logo';
import { Navigation } from '@components/navigation';
import { ToggleTheme } from '@components/toggleTheme';

export const Header = () => {

  return (
    <nav className="z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-12">
        <Logo />
        <Navigation />
      </div>
      <div className="flex gap-5">
        <ChainSelectButton />
        <ToggleTheme />
      </div>
    </nav>
  );
};

Header.displayName = 'Header';
