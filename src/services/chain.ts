import { baseStoreChain } from '@stores';

import type { SetStateAction } from 'react';
import type React from 'react';

interface ISubscriptionFn {
  setData: React.Dispatch<SetStateAction<number>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

export const subscribeToFinalizedBlocks = (
  { setData, setIsLoading }: ISubscriptionFn,
): () => void => {
  const client = baseStoreChain.getState().client;

  if (!client) {
    return () => {};
  }

  const subscription = client.finalizedBlock$.subscribe((finalizedBlock) => {
    setData(finalizedBlock.number);
    setIsLoading(false);
  });

  return () => {
    subscription?.unsubscribe();
  };
};

export const subscribeToLatestBlocks = (
  { setData, setIsLoading }: ISubscriptionFn,
): () => void => {
  const client = baseStoreChain.getState().client;

  if (!client) {
    return () => {};
  }

  const subscription = client.bestBlocks$.subscribe((bestBlocks) => {
    const latestBlock = bestBlocks[0];

    setData(latestBlock.number);
    setIsLoading(false);
  });

  return () => {
    subscription?.unsubscribe();
  };
};

export const subscribeToCirculatingSupply = (
  { setData, setIsLoading }: ISubscriptionFn,
): () => void => {
  const api = baseStoreChain.getState().api;

  if (!api) {
    return () => {};
  }

  const subscription = api.query.System.ExtrinsicCount.getValue();
  console.log(subscription);

  return () => {
    // subscription?.unsubscribe();
  };
};
