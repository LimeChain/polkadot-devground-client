import {
  STORAGE_AUTH_CACHE_LAST_WALLET,
  STORAGE_WALLET_CACHE_NAME,
} from '@constants/wallet';
import {
  storageGetItem,
  storageSetItem,
} from '@utils/storage';

const setLatestWallet = async (walletName: string): Promise<void> => {
  
  await storageSetItem(
    STORAGE_WALLET_CACHE_NAME,
    STORAGE_AUTH_CACHE_LAST_WALLET,
    walletName,
  );

};

const getLatestWallet = async (): Promise<string | null> => {
  const latestWallet: string | null = await storageGetItem(
    STORAGE_WALLET_CACHE_NAME,
    STORAGE_AUTH_CACHE_LAST_WALLET,
  );

  return latestWallet;
};

export default {
  getLatestWallet,
  setLatestWallet,
};
