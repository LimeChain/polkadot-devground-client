import {
  useCallback,
  useLayoutEffect,
} from 'react';

import { STORAGE_CACHE_NAME } from '@views/codeEditor/constants';

const STORAGE_COLOR_SCHEME = 'color-scheme';
const LOCAL_STORAGE_THEME_KEY = `${STORAGE_CACHE_NAME}-${STORAGE_COLOR_SCHEME}`;

type ColorScheme = 'dark' | 'light';

export const useTheme = () => {

  const changeTheme = async (theme:ColorScheme) => {
    window.document.documentElement.setAttribute('data-color-scheme', theme);
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  };
    
  function getStoredPreference () : ColorScheme | null {
    return window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ColorScheme | null;
  }
    
  function getSystemPreference () {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
    
  const isDarkTheme = useCallback(() => {
    const storedPreference = getStoredPreference();
    if (storedPreference) {
      return storedPreference === 'dark' ? true : false;
    } 
        
    return getSystemPreference();
  }, []);
    
  useLayoutEffect(() => {
    (async () => {
      const currentTheme = isDarkTheme() ? 'dark' : 'light';
  
      window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, currentTheme);
      window.document.documentElement.setAttribute('data-color-scheme', currentTheme);
    })().catch(err => console.log(err));
  
  }, [isDarkTheme]);

  return {
    isDarkTheme, changeTheme,
  };
};