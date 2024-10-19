import { busDispatch } from '@pivanov/event-bus';
import toast from 'react-hot-toast';
import { create } from 'zustand';

import authService from '@services/authService';
import gistService from '@services/gistService';
import { createSelectors } from 'src/stores/createSelectors';

import type { ICodeExample } from '@custom-types/codeSnippet';
import type { IUploadExampleModalClose } from '@custom-types/eventBus';

interface StoreInterface {
  examples: ICodeExample[];
  isUploading: boolean;
  actions: {
    resetStore: () => void;
    uploadCustomExample: (data) => void;
    loadCustomExampleContent: (id: string) => Promise<string>;
    getCustomExamples: () => void;
  };
  init: () => Promise<void>;
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  examples: [],
  isUploading: false,
};

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    uploadCustomExample: async (data) => {
      try {
        set({ isUploading: true });
        const newExamples = await gistService.uploadCustomExample(data);
        set({ examples: newExamples?.data });
        busDispatch<IUploadExampleModalClose>('@@-close-upload-example-modal');
        toast.success('Snippet uploaded');
      } catch (error) {
        console.error('Error uploading snippet', error);
        toast.error('Error uploading snippet');
      } finally {
        set({ isUploading: false });
      }
    },

    getCustomExamples: async () => {
      const data = await gistService.getUserGists();
      set({ examples: data });
    },

    loadCustomExampleContent: async (id: string) => {
      try {
        const snippetContent = await gistService.getGistContent(id);

        return snippetContent?.code;
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

export const baseStoreCustomExamples = baseStore;
export const useStoreCustomExamples = createSelectors(baseStore);

