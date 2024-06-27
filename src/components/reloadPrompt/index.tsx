import {
useCallback,
useEffect,
} from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { Button } from '@components/ui';

export const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      const el = document.getElementById('root');
      (el as HTMLElement).innerHTML = '';
    }
  }, [needRefresh]);

  const handleReload = useCallback(async () => {
    await updateServiceWorker(true);
  }, [updateServiceWorker]);

  const Content = () => {
    return (
      <div className="fixed inset-0 z-[9999] bg-gray-600">
        <h2 className="truncate">
          <span className="mr-2 text-2xl leading-none">{'\uD83D\uDE80'}</span>
          New <span className="font-semibold">Polkadot Devground</span> version
          is available!
        </h2>

        <Button onClick={handleReload}>Reload</Button>
      </div>
    );
  };

  if (needRefresh) {
    return <Content />;
  }

  return null;
};
