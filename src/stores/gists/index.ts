import { busDispatch } from '@pivanov/event-bus';
import { create } from 'zustand';

import authService from '@services/authService';
import gistService from '@services/gistService';
import { createSelectors } from 'src/stores/createSelectors';

import type { IEventBusMonacoEditorLoadSnippet } from '@custom-types/eventBus';

interface StoreInterface {
  gists: any[];
  actions: {
    resetStore: () => void;
    uploadSnippet: () => void;
    getSnippets: () => void;
  };
  init: () => Promise<void>;
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  gists: [],
};

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    uploadSnippet: async (data) => {
      console.log('uploadSnippet', data);
      try {
        await gistService.uploadSnippet(data);
      } catch (error) {
        console.error('Error uploading snippet', error);
        throw error;
      }
    },

    getSnippets: async () => {
      const data = await gistService.getUserGists();
      set({ gists: data });
    },

    loadSnippet: async (id: string) => {

      try {
        const snippetContent = await gistService.getGistContent(id);

        busDispatch<IEventBusMonacoEditorLoadSnippet>({
          type: '@@-monaco-editor-load-snippet',
          data: {
            id,
            code: snippetContent,
          },
        });
      } catch (error) {
        console.error('Error loading snippet', error);
        throw error;
      }
    },

    resetStore: () => set({ ...initialState }),
  },

  init: async () => {
    try {
      const jwtToken = await authService.getJwtToken();
    } catch (error) {
      console.error('Error initializing auth store', error);
      throw error;
    }
  },
}));

export const baseStoreGists = baseStore;
export const useStoreGists = createSelectors(baseStore);

