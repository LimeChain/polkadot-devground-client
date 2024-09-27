import type { IWalletExtensions } from '@components/modals/modalWalletSelect';

export const STORAGE_WALLET_CACHE_NAME = 'polkadot-devground-wallet-cache';
export const STORAGE_AUTH_CACHE_LAST_WALLET = 'last-wallet';

export const walletExtensions: IWalletExtensions = {
  'subwallet-js': {
    name: 'Subwallet',
    icon: 'logo-subwallet-js',
  },
  'talisman': {
    name: 'Talisman',
    icon: 'logo-talisman',
  },
  'fearless-wallet': {
    name: 'Fearless Wallet',
    icon: 'icon-wallet',
  },
  'polkadot-js': {
    name: 'Polkadot{.js}',
    icon: 'logo-polkadot-js',
  },

};