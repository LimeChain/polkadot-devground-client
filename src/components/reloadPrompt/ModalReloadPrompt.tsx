import { useCallback } from 'react';

import { Modal } from '@components/modals/modal';
import { cn } from '@utils/helpers';

interface IModalReloadPromptProps {
  updateServiceWorker: (reloadPage: boolean) => void;
}

export const ModalReloadPrompt = (props: IModalReloadPromptProps) => {
  const { updateServiceWorker } = props;

  const handleReload = useCallback(() => {
    updateServiceWorker(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      onClose={handleReload}
      className="flex w-4/12 flex-col p-8"
    >
      <div className="flex gap-x-3 pb-8">
        <span>{'\uD83D\uDE80'}</span>
        <div>
          <h2>Polkadot Devground</h2>
          <span className="text-sm text-gray-300">New version is available!</span>
        </div>
      </div>

      <div
        className={cn(
          'ml-auto rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        )}
        onClick={handleReload}
      >
        Reload
      </div>
    </Modal>
  );
};
