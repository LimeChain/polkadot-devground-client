import { busDispatch } from '@pivanov/event-bus';
import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useTheme } from '@utils/hooks/useTheme';

import type { IEventBusDemoCodeIndex } from '@custom-types/eventBus';

export const Header = () => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCodeIndex>({
      type: '@@-example-code-index',
      data: exampleIndex,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isDarkTheme, changeTheme } = useTheme();

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme() ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);
  
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </div>
      <div className={cn('flex')}>
        <button type="button" onClick={handleChangeTheme}>
          <Icon
            name="icon-lightMode"
            size={[24]}
            className={cn('hidden text-dev-purple-100 dark:block')}
          />
          <Icon
            name="icon-darkMode"
            size={[24]}
            className={cn('block text-dev-black-600 dark:hidden')}
          />
        </button>
      </div>
      {/* <div className="flex gap-x-4 self-end">
        {snippets.map((snippet) => (
          <Button
            key={snippet.id}
            onClick={handleClick}
            data-example={snippet.id}
          >
            Demo {snippet.id}
          </Button>
        ))}
      </div> */}
    </div>
  );
};

Header.displayName = 'Header';
