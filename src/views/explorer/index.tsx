import {
  useEffect,
  useRef,
} from 'react';

import { ChainData } from '@components/chainData';
import { ChainState } from '@components/chainState';
import {
  useStoreChain,
  useStoreExplorer,
} from '@stores';

const Explorer = () => {
  const refLatestFinalizedBlock = useRef<string | undefined>();
  const latestFinalizedBlock = useStoreChain.use.latestFinalizedBlock?.();

  const initStoreExplorer = useStoreExplorer.use.init?.();
  const {
    resetStore: resetStoreExplorer,
  } = useStoreExplorer.use.actions();

  useEffect(() => {
    if (latestFinalizedBlock && !refLatestFinalizedBlock.current) {
      refLatestFinalizedBlock.current = latestFinalizedBlock.hash;
      initStoreExplorer();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestFinalizedBlock]);

  useEffect(() => {
    return () => {
      resetStoreExplorer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-12 overflow-hidden lg:max-h-full">
      <div>
        search
      </div>
      <ChainState />
      <ChainData />
    </div>
  );
};

export default Explorer;
