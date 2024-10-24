import { busDispatch } from '@pivanov/event-bus';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { snippets } from '@constants/snippets';
import authService from '@services/authService';
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
  exampleDescription: string;
  selectedExampleId: string;
  actions: {
    resetStore: () => void;
    uploadExample: (data: UploadCustomExampleData) => void;
    loadExampleContent: (id: string, type: string) => Promise<string>;
    updateExampleInfo: (id: string, exampleName: string, description: string) => void;
    updateExampleContent: (id: string, data: string) => void;
    getExamples: () => void;
    deleteExample: (id: string) => void;
  };
}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  examples: [],
  exampleDescription: '',
  selectedExampleId: '',
  isUploading: false,
  isSavingContent: false,
};

// Utility function for error handling
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  toast.error(message);
};

// Utility function to get JWT token
const getJwtToken = async (): Promise<string | null> => {
  try {
    return await authService.getJwtToken();
  } catch (error) {
    handleError(error, 'Authentication error');
    return null;
  }
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
        const jwtToken = await getJwtToken();
        if (!jwtToken) return;

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
        const jwtToken = await getJwtToken();
        if (!jwtToken) return;

        const data = await gistService.getUserExamples();
        set({ examples: data });
      } catch (error) {
        handleError(error, 'Error getting snippets');
      }
    },

    loadExampleContent: async (id: string, type: string) => {
      set({ selectedExampleId: id });

      if (type === 'default') {
        const selectedSnippet = snippets.find((f) => f.id === id) || snippets[0];
        set({ exampleDescription: selectedSnippet.description });
        return selectedSnippet.code;
      }

      if (type === 'custom') {
        try {
          const snippetContent = await gistService.getExampleContent(id);
          set({ exampleDescription: snippetContent?.description });
          return snippetContent?.code;
        } catch (error) {
          handleError(error, 'Error loading snippet');
          throw error;
        }
      }
    },

    updateExampleInfo: async (id: string, exampleName: string, description: string) => {

      if (!id || !exampleName || !description) {
        handleError(null, 'No selected example id');
        return;
      }
      set({ isUploading: true });

      try {
        const jwtToken = await getJwtToken();
        if (!jwtToken) return;

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
        const jwtToken = await getJwtToken();
        if (!jwtToken) return;

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
        const jwtToken = await getJwtToken();
        if (!jwtToken) return;

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
