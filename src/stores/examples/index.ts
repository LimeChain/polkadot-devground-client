import { busDispatch } from '@pivanov/event-bus';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { snippets } from '@constants/snippets';
import gistService from '@services/examplesService';
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
  isSavingContent: boolean;
  selectedExample: ICodeExample;
  actions: {
    resetStore: () => void;
    uploadExample: (data: UploadCustomExampleData) => void;
    loadExampleContent: (id: string, type: string) => void;
    updateExampleInfo: (id: string, exampleName: string, description: string) => void;
    updateExampleContent: (id: string, data: string) => void;
    getExamples: () => void;
    deleteExample: (id: string) => void;
  };
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  examples: [],
  selectedExample: {
    id: '',
    name: '',
    description: '',
    code: '',
  },
  isUploading: false,
  isSavingContent: false,
};

// Utility function for error handling
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  toast.error(message);
};

const baseStore = create<StoreInterface>()((set) => ({
  ...initialState,
  actions: {
    uploadExample: async (data) => {
      set({ isUploading: true });

      if (!data.code || !data.description || !data.exampleName) {
        handleError(null, 'Invalid input data: Missing code, description, or exampleName');
        set({ isUploading: false });
        return;
      }

      try {
        const newExamples = await gistService.uploadExample(data);
        set({ examples: newExamples });
        toast.success('Snippet uploaded');
        busDispatch<IUploadExampleModalClose>('@@-close-upload-example-modal');
      } catch (error) {
        handleError(error, 'Error uploading snippet');
      } finally {
        set({ isUploading: false });
      }
    },

    getExamples: async () => {
      try {
        const data = await gistService.getUserExamples();
        set({ examples: data });
      } catch (error) {
        handleError(error, 'Error getting snippets');
      }
    },

    loadExampleContent: async (id: string, type: string) => {
      busDispatch({ type: '@@-monaco-editor-show-loading' });
      busDispatch({ type: '@@-problems-message', data: [] });
      busDispatch({ type: '@@-console-message-reset' });
      busDispatch({ type: '@@-monaco-editor-types-progress', data: 0 });

      try {
        let selectedExample;

        if (type === 'default') {
          selectedExample = snippets.find((snippet) => snippet.id === id) || snippets[0];
        } else if (type === 'custom') {
          const { code, description } = await gistService.getExampleContent(id);
          const name = baseStore.getState().examples.find((example) => example.id === id)?.name || 'Untitled Gist';
          selectedExample = { id, name, description, code };
        }

        set({ selectedExample });
      } catch (error) {
        handleError(error, 'Error loading snippet');
        throw error;
      } finally {
        busDispatch({ type: '@@-monaco-editor-hide-loading' });
      }
    },

    updateExampleInfo: async (id: string, exampleName: string, description: string) => {

      if (!id || !exampleName || !description) {
        handleError(null, 'No selected example id');
        return;
      }
      set({ isUploading: true });

      try {
        const gistsArray = await gistService.updateExampleInfo(id, exampleName, description);
        set({ examples: gistsArray, isUploading: false });
        busDispatch<IUploadExampleModalClose>('@@-close-upload-example-modal');
        toast.success('Example Information Updated!');
      } catch (error) {
        handleError(error, 'Error updating snippet');
      } finally {
        set({ isUploading: false });
      }
    },

    updateExampleContent: async (id: string, data: string) => {
      set({ isSavingContent: true });

      if (!id || !data) {
        handleError(null, 'No selected example id or data');
        return;
      }

      try {
        await gistService.updateExampleContent(id, data);
        busDispatch<IUploadExampleModalClose>('@@-close-upload-example-modal');
        toast.success('Example Content Updated!');
      } catch (error) {
        handleError(error, 'Error updating snippet');
      } finally {
        set({ isSavingContent: false });
      }
    },

    deleteExample: async (id: string) => {
      if (!id) {
        handleError(null, 'No selected example id');
        return;
      }

      try {
        const newExamples = await gistService.deleteExample(id);
        set({ examples: newExamples });
        toast.success('Snippet deleted');
      } catch (error) {
        handleError(error, 'Error deleting snippet');
      }
    },

    resetStore: () => set({ ...initialState }),
  },
}));

export const baseStoreCustomExamples = baseStore;
export const useStoreCustomExamples = createSelectors(baseStore);
