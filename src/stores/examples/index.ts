import { busDispatch } from '@pivanov/event-bus';
import { toast } from 'react-hot-toast';
import { create } from 'zustand';

import { snippets } from '@constants/snippets';
import gistService from '@services/examplesService';
import { createSelectors } from 'src/stores/createSelectors';

import type { ICodeExample } from '@custom-types/codeSnippet';
import type {
  IDeleteExampleModalClose,
  IEditExampleInfoModalClose,
  IUploadExampleModalClose,
} from '@custom-types/eventBus';

interface UploadCustomExampleData {
  code: string;
  description: string;
  exampleName: string;
}

interface StoreInterface {
  examples: ICodeExample[];
  selectedExample: ICodeExample;
  loading: {
    isGettingExamples: boolean;
    isCreatingExample: boolean;
    isSavingInfo: boolean;
    isSavingContent: boolean;
    isDeleting: boolean;
  };
  actions: {
    resetStore: () => void;
    createExample: (data: UploadCustomExampleData) => void;
    loadExampleContent: (id: string, type: string) => void;
    updateExampleInfo: (id: string, exampleName: string, description: string) => void;
    updateExampleContent: (data: string) => void;
    getExamples: () => void;
    deleteExample: (id: string) => void;
  };
  init: () => void;

}

const initialState: Omit<StoreInterface, 'actions' | 'init'> = {
  examples: [],
  selectedExample: {
    id: '',
    name: '',
    description: '',
    code: '',
  },
  loading: {
    isGettingExamples: false,
    isCreatingExample: false,
    isSavingInfo: false,
    isSavingContent: false,
    isDeleting: false,
  },
};

const baseStore = create<StoreInterface>()((set, get) => ({
  ...initialState,
  actions: {
    createExample: async (data) => {
      set({ loading: { ...get().loading, isCreatingExample: true } });

      if (!data.code || !data.description || !data.exampleName) {
        console.log(null, 'Invalid input data: Missing code, description, or exampleName');
        set({ loading: { ...get().loading, isCreatingExample: false } });
        return;
      }

      try {
        const { name, id } = await gistService.createExample(data);
        set({
          examples: [
            ...get().examples,
            { name, id },
          ],
        });

        if (id) {
          busDispatch<IUploadExampleModalClose>({
            type: '@@-close-upload-example-modal',
            data: id,
          });
        }

        toast.success('Snippet uploaded');
      } catch (error) {
        console.log('Error uploading snippet', error);
      } finally {
        set({ loading: { ...get().loading, isCreatingExample: false } });
      }
    },

    getExamples: async () => {
      try {
        set({ loading: { ...get().loading, isGettingExamples: true } });
        const data = await gistService.getUserExamples();
        set({ examples: data });
      } catch (error) {
        console.log('Error getting examples', error);
      } finally {
        set({ loading: { ...get().loading, isGettingExamples: false } });
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
          const exampleData = await gistService.getExampleContent(id);
          selectedExample = { ...exampleData, id };
        }

        set({ selectedExample });
      } catch (error) {
        console.log('Error loading example content', error);
        throw error;
      } finally {
        busDispatch({ type: '@@-monaco-editor-hide-loading' });
      }
    },

    updateExampleInfo: async (id: string, exampleName: string, description: string) => {
      if (!id || !exampleName || !description) {
        toast.error('Invalid input data: Missing id, exampleName, or description');
        return;
      }

      set({ loading: { ...get().loading, isSavingInfo: true } });

      try {
        const editedGist = await gistService.updateExampleInfo(id, exampleName, description);

        const updatedExamples = get().examples.map((example) =>
          example.id === id ? { ...example, ...editedGist } : example,
        );

        set({ examples: updatedExamples });

        if (get().selectedExample.id === id) {
          set({ selectedExample: { ...get().selectedExample, ...editedGist } });
        }

        busDispatch<IEditExampleInfoModalClose>('@@-close-edit-example-modal');
        toast.success('Example Information Updated!');
      } catch (error) {
        console.log('Error updating snippet', error);
        toast.error('Failed to update example information');
      } finally {
        set({ loading: { ...get().loading, isSavingInfo: false } });
      }
    },

    updateExampleContent: async (data: string) => {
      set({ loading: { ...get().loading, isSavingContent: true } });
      const id = get().selectedExample.id;

      if (!id || !data) {
        toast.error('No selected example id or data');
        return;
      }

      try {
        await gistService.updateExampleContent(id, data);
        busDispatch<IUploadExampleModalClose>({
          type: '@@-close-upload-example-modal',
          data: id,
        });
        toast.success('Example Content Updated!');
      } catch (error) {
        console.log('Error updating snippet', error);
      } finally {
        set({ loading: { ...get().loading, isSavingContent: false } });
      }
    },

    deleteExample: async (id: string) => {
      if (!id) {
        toast.error('No selected example id');
        return;
      }

      try {
        set({ loading: { ...get().loading, isDeleting: true } });
        await gistService.deleteExample(id);

        const updatedExampleList = get().examples.filter((example) => example.id !== id);
        set({ examples: updatedExampleList });

        busDispatch<IDeleteExampleModalClose>({
          type: '@@-close-delete-example-modal',
        });

        toast.success('Snippet deleted');
      } catch (error) {
        console.log('Error deleting snippet', error);
      } finally {
        set({ loading: { ...get().loading, isDeleting: false } });
      }
    },

    resetStore: () => (
      set({ ...initialState })
    ),
  },
  init: async () => {
    get().actions.getExamples();
  },
}));

export const baseStoreCustomExamples = baseStore;
export const useStoreCustomExamples = createSelectors(baseStore);

