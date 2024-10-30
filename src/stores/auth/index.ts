import { create } from 'zustand';

import authService from '@services/authService';

import { createSelectors } from '../createSelectors';

interface StoreInterface {
  user: {
    name: string;
    avatar: string;
  };
  jwtToken: string | null;
  jwtTokenIsLoading: boolean;
  actions: {
    resetStore: () => void;
    login: (gitHubCode: string) => Promise<string>;
    authorize: () => void;
    refreshJwtToken: () => Promise<void>;
    logout: () => Promise<void>;
  };
  init: () => Promise<void>;
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  user: {
    name: '',
    avatar: '',
  },
  jwtToken: '',
  jwtTokenIsLoading: true,
};

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    resetStore: () => set({ ...initialState }),

    login: async (gitHubCode: string) => {
      try {
        const { userName, userAvatar, jwtToken } = await authService.login(gitHubCode);
        set({ user: { name: userName, avatar: userAvatar }, jwtToken });
        return jwtToken;
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },

    authorize: () => {
      authService.authorizeGitHubApp();
    },

    refreshJwtToken: async () => {
      try {
        const { jwtToken } = await authService.refreshJwtToken();
        set((state) => (state.jwtToken !== jwtToken ? { jwtToken } : state));
      } catch (error) {
        console.error('Token refresh failed', error);
        throw error;
      }
    },

    logout: async () => {
      try {
        await authService.logout();
        set({ ...initialState, jwtTokenIsLoading: false, user: { name: '', avatar: '' } });
      } catch (error) {
        console.error('Logout failed', error);
        throw error;
      }
    },
  },

  init: async () => {
    try {
      const token = await authService.getJwtToken();
      const user = await authService.getUserData();

      set({ jwtToken: token, user, jwtTokenIsLoading: false });
    } catch (error) {
      console.error('Initialization failed', error);
      set({ jwtTokenIsLoading: false });
    }
  },
}));

export const baseStoreAuth = baseStore;
export const useStoreAuth = createSelectors(baseStore);
