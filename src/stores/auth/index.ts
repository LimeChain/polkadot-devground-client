import { create } from 'zustand';

import authService from '@services/authService';

import { createSelectors } from '../createSelectors';

import type { IAuthResponse } from '@custom-types/auth';

interface StoreInterface {
  jwtToken: IAuthResponse['jwtToken'];
  jwtTokenIsLoading: boolean;
  actions: {
    resetStore: () => void;
    login: (gitHubCode: string) => Promise<string>;
    authorize: () => void;
    refreshJwtToken: () => void;
    logout: () => void;
  };
  init: () => void;
}

const initialState = {
  jwtToken: '',
  jwtTokenIsLoading: true,
};

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    resetStore: () => {
      set(initialState);
    },
    login: async (gitHubCode: string) => {
      const { jwtToken } = await authService.login(gitHubCode);
      set({ jwtToken });

      return jwtToken;
    },
    authorize: () => {
      authService.authoriseGitHubApp();
    },

    refreshJwtToken: async () => {
      const { jwtToken } = await authService.refreshJwtToken();
      set({ jwtToken });
    },

    logout: async () => {
      await authService.logout();
      set({ jwtToken: '' });
    },
  },
  init: async () => {
    const token = await authService.getJwtToken();
    set({ jwtToken: token || '', jwtTokenIsLoading: false });
  },
}));

export const baseStoreAuth = baseStore;
export const useStoreAuth = createSelectors(baseStore);
