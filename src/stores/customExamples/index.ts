import { busDispatch } from '@pivanov/event-bus';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { snippets } from '@constants/snippets';
import gistService from '@services/gistService';
import { createSelectors } from 'src/stores/createSelectors';

import type { ICodeExample } from '@custom-types/codeSnippet';
import type { IUploadExampleModalClose } from '@custom-types/eventBus';

interface UploadCustomExampleData {
  code: string;
  description: string;
  exampleName: string;
}

interface StoreInterface {
  examples: ICodeExample[];
  isUploading: boolean;
  exampleDescription: string;
  selectedExampleId: string;
  actions: {
    resetStore: () => void;
    uploadCustomExample: (data: UploadCustomExampleData) => void;
    loadCustomExampleContent: (id: string, type: string) => Promise<string>;
    updateCustomExampleInfo: (exampleName: string, description: string) => void;
    updateCustomExampleContent: (id: string, data: string) => void;
    getCustomExamples: () => void;
    deleteExample: (id: string) => void;
  };
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  examples: [],
  exampleDescription: '',
  selectedExampleId: '',
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

    loadCustomExampleContent: async (id: string, type: string) => {
      set({ selectedExampleId: id });

      if (type === 'default') {
        const selectedSnippet = snippets.find((f) => f.id === id) || snippets[0];
        set({ exampleDescription: selectedSnippet.description });
        return selectedSnippet.code;
      }

      if (type === 'custom') {
        try {
          const snippetContent = await gistService.getGistContent(id);
          set({ exampleDescription: snippetContent?.description });
          return snippetContent?.code;
        } catch (error) {
          console.error('Error loading snippet', error);
          throw error;
        }
      }
    },

    updateCustomExampleInfo: async (exampleName: string, description: string) => {
      const { selectedExampleId } = baseStore.getState();

      const gistsArray = await gistService.editGistInfo(selectedExampleId, exampleName, description);
      set({ examples: gistsArray });
    },

    updateCustomExampleContent: async (id: string, data: string) => {
      await gistService.editGistContent(id, data);
    },

    deleteExample: async (id: string) => {
      try {
        const newExamples = await gistService.deleteExample(id);
        set({ examples: newExamples });
        toast.success('Snippet deleted');
      } catch (error) {
        console.error('Error deleting snippet', error);
        toast.error('Error deleting snippet');
      }
    },

    resetStore: () => set({ ...initialState }),
  },
}));

export const baseStoreCustomExamples = baseStore;
export const useStoreCustomExamples = createSelectors(baseStore);

