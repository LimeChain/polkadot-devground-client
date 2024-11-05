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
      set((state) => ({ loading: { ...state.loading, isCreatingExample: true } }));

      if (!data.code || !data.description || !data.exampleName) {
        console.error('Invalid input data: Missing code, description, or exampleName');
        set((state) => ({ loading: { ...state.loading, isCreatingExample: false } }));
        return;
      }

      if (get().examples.some((example) => example.name === data.exampleName)) {
        toast.error('Example with this name already exists');
        set((state) => ({ loading: { ...state.loading, isCreatingExample: false } }));
        return;
      }

      try {
        const { name, id, description } = await gistService.createExample(data);
        set((state) => ({
          examples: [
            ...state.examples,
            { name, id, description },
          ],
        }));

        if (id) {
          busDispatch<IUploadExampleModalClose>({
            type: '@@-close-upload-example-modal',
            data: id,
          });
        }

        toast.success('Snippet uploaded');
      } catch (error) {
        console.error('Error uploading snippet', error);
      } finally {
        set((state) => ({ loading: { ...state.loading, isCreatingExample: false } }));
      }
    },

    getExamples: async () => {
      set((state) => ({ loading: { ...state.loading, isGettingExamples: true } }));
      try {
        const data = await gistService.getUserExamples();
        set({ examples: data });
      } catch (error) {
        console.error('Error getting examples', error);
      } finally {
        set((state) => ({ loading: { ...state.loading, isGettingExamples: false } }));
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
          selectedExample = snippets.find((snippet) => snippet.id === id);
        } else if (type === 'custom') {
          const exampleData = await gistService.getExampleContent(id);
          if (exampleData) {
            selectedExample = { ...exampleData, id };
          }
        }

        set({
          selectedExample: selectedExample || { id: '', name: 'Example Not Found', description: '' },
        });

      } catch (error) {
        console.error('Error loading example content', error);
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

      set((state) => ({ loading: { ...state.loading, isSavingInfo: true } }));

      try {
        const editedGist = await gistService.updateExampleInfo(id, exampleName, description);

        const updatedExamples = get().examples.map((example) =>
          example.id === id ? { ...example, ...editedGist } : example,
        );

        if (get().selectedExample.id === id) {
          set({ selectedExample: editedGist });
        }

        set({ examples: updatedExamples });
        busDispatch<IEditExampleInfoModalClose>('@@-close-edit-example-modal');
        toast.success('Example Information Updated!');
      } catch (error) {
        console.error('Error updating snippet', error);
        toast.error('Failed to update example information');
      } finally {
        set((state) => ({ loading: { ...state.loading, isSavingInfo: false } }));
      }
    },

    updateExampleContent: async (data: string) => {
      set((state) => ({ loading: { ...state.loading, isSavingContent: true } }));
      const { name, id } = get().selectedExample;

      if (!id || !data || !name) {
        toast.error('No selected example id or data');
        return;
      }

      try {
        await gistService.updateExampleContent(id, name, data);
        busDispatch<IUploadExampleModalClose>({
          type: '@@-close-upload-example-modal',
          data: id,
        });
        toast.success('Example Content Updated!');
      } catch (error) {
        console.error('Error updating snippet', error);
      } finally {
        set((state) => ({ loading: { ...state.loading, isSavingContent: false } }));
      }
    },

    deleteExample: async (id: string) => {
      if (!id) {
        toast.error('No selected example id');
        return;
      }

      set((state) => ({ loading: { ...state.loading, isDeleting: true } }));

      try {
        const updatedExampleList = get().examples.filter((example) => example.id !== id);
        set({ examples: updatedExampleList });

        busDispatch<IDeleteExampleModalClose>({
          type: '@@-close-delete-example-modal',
        });

        await gistService.deleteExample(id);
        toast.success('Snippet deleted');
      } catch (error) {
        console.error('Error deleting snippet', error);
      } finally {
        set((state) => ({ loading: { ...state.loading, isDeleting: false } }));
      }
    },

    resetStore: () => set({ ...initialState }),
  },
  init: async () => {
    get().actions.getExamples();
  },
}));

export const baseStoreCustomExamples = baseStore;
export const useStoreCustomExamples = createSelectors(baseStore);

