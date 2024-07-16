import { baseStoreChain } from '@stores';

import type { TChainSubscription } from '@custom-types/chain';

export interface ISubscriptionFn {
  type: TChainSubscription;
  handleOnSubcriptionData: ({
    data,
    isLoadingData,
  }: {
    data: any;
    isLoadingData: boolean;
  }) => void;
}

export const subscribeToChainData = (
  {
    type,
    handleOnSubcriptionData,
  }: ISubscriptionFn,
): () => void => {
  const client = baseStoreChain.getState()?.client;
  const api = baseStoreChain.getState()?.api;

  if (!client || !api) {
    return () => {};
  }

  let subscription: {
    unsubscribe: () => void;
  };

  switch (type) {
    case 'finalised-block':
      subscription = client.finalizedBlock$.subscribe((finalizedBlock) => {
        handleOnSubcriptionData({
          data: finalizedBlock.number,
          isLoadingData: false,
        });
      });
      break;

    case 'latest-block':
      subscription = client.bestBlocks$.subscribe((bestBlocks) => {
        handleOnSubcriptionData({
          data: bestBlocks[0].number,
          isLoadingData: false,
        });
      });
      break;

    default:
      handleOnSubcriptionData({
        data: 0,
        isLoadingData: false,
      });
      break;
  }

  return () => {
    subscription?.unsubscribe?.();
    handleOnSubcriptionData({
      data: 0,
      isLoadingData: true,
    });
  };
};
