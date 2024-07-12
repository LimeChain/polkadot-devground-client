import { create } from 'zustand';

import authService from '@services/authService';

import { createSelectors } from '../createSelectors';

import type { IAuthResponse } from '@custom-types/auth';

interface IAuthStore {
  jwtToken: IAuthResponse['jwtToken'];
  jwtTokenIsLoading: boolean;
  actions: {
    init: () => void;
    login: (gitHubCode: string) => Promise<string>;
    authorize: () => void;
    refreshJwtToken: () => void;
    logout: () => void;
  };
}

const initialState: Omit<IAuthStore, 'actions'> = {
  jwtToken: '',
  jwtTokenIsLoading: true,
};

const authStore = create<IAuthStore>()((set) => ({
  ...initialState,
  actions: {
    async init() {
      const token = await authService.getJwtToken();
      set({ jwtToken: token || '', jwtTokenIsLoading: false });
    },

    async login(gitHubCode: string) {
      const { jwtToken } = await authService.login(gitHubCode);
      set({ jwtToken });

      return jwtToken;
    },

    authorize() {
      authService.authoriseGitHubApp();
    },

    async refreshJwtToken() {
      const { jwtToken } = await authService.refreshJwtToken();
      set({ jwtToken });
    },

    async logout() {
      await authService.logout();
      set({ jwtToken: '' });
    },
  },
}));

export const useAuthStore = createSelectors(authStore);
