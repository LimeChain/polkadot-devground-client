import {
  useLayoutEffect,
  useState,
} from 'react';

import { STORAGE_CACHE_NAME } from '@views/codeEditor/constants';

const STORAGE_COLOR_SCHEME = 'color-scheme';
const LOCAL_STORAGE_THEME_KEY = `${STORAGE_CACHE_NAME}-${STORAGE_COLOR_SCHEME}`;

type ColorScheme = 'dark' | 'light';

export const useTheme = () => {

  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkTheme());

  const changeTheme = async (theme:ColorScheme) => {
    setIsDarkTheme(theme === 'dark');
    window.document.documentElement.setAttribute('data-color-scheme', theme);
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  };
    
  function getStoredPreference () : ColorScheme | null {
    return window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ColorScheme | null;
  }
    
  function getSystemPreference () {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
    
  function prefersDarkTheme () {
    const storedPreference = getStoredPreference();
    if (storedPreference) {
      return storedPreference === 'dark' ? true : false;
    } 
        
    return getSystemPreference();
  }
    
  useLayoutEffect(() => {
    (async () => {
      const currentTheme = prefersDarkTheme() ? 'dark' : 'light';
  
      setIsDarkTheme(currentTheme === 'dark');
      window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, currentTheme);
      window.document.documentElement.setAttribute('data-color-scheme', currentTheme);
    })().catch(err => console.log(err));
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDarkTheme, changeTheme,
  };
};