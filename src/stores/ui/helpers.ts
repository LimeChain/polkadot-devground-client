const STORAGE_COLOR_SCHEME = 'color-scheme';
export const LOCAL_STORAGE_THEME_KEY = STORAGE_COLOR_SCHEME;

export type ColorScheme = 'dark' | 'light';

const getStoredPreference = (): ColorScheme | null => {
  return window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as ColorScheme | null;
};

export const preferedTheme = () => {
  const storedPreference = getStoredPreference();
  if (storedPreference) {
    return storedPreference;
  }

  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

export const getWindowSize = () => {
  const width = window.innerWidth;
  return {
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isDesktop: width >= breakpoints.tablet,
  };
};
