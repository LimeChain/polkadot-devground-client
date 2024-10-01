import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { ModalReloadPrompt } from './modalReloadPrompt';

export const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [
    ReloadPromptModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalReloadPrompt);

  useEffect(() => {
    if (needRefresh) {
      toggleVisibility();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needRefresh]);

  return (
    <ReloadPromptModal
      updateServiceWorker={updateServiceWorker}
    />
  );
};
