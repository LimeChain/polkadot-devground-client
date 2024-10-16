import { create } from 'zustand';

import { createSelectors } from '../createSelectors';
import { sizeMiddleware } from '../sizeMiddleware';

import {
  type ColorScheme,
  getWindowSize,
  LOCAL_STORAGE_THEME_KEY,
  preferedTheme,
} from './helpers';
interface StoreInterface {
  theme: ColorScheme;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  actions: {
    resetStore: () => void;
    toggleTheme: () => void;
    setWindowSize: () => void;
  };
  init: () => void;
}

const initialState = {
  theme: preferedTheme(),
  ...getWindowSize(),
};

const baseStore = create<StoreInterface>()(sizeMiddleware<StoreInterface>('ui', (set, get) => ({
  ...initialState,
  actions: {
    resetStore: () => {
      set(initialState);
    },
    toggleTheme: () => {
      const newTheme = get().theme === 'dark' ? 'light' : 'dark';
      window.document.documentElement.setAttribute('data-color-scheme', newTheme);
      window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
      set({ theme: newTheme });
    },
    setWindowSize: () => {
      set({ ...getWindowSize() });
    },
  },
  init: () => {
    const theme = preferedTheme();
    window.document.documentElement.setAttribute('data-color-scheme', theme);
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
    set({ theme, ...getWindowSize() });
  },
})));

export const baseStoreUI = baseStore;
export const useStoreUI = createSelectors(baseStore);
