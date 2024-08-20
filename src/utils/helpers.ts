import {
  type ClassValue,
  clsx,
} from 'clsx';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const uid = (length = 8): string => {
  return nanoid(length);
};

export const formatConsoleMessage = (_key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

/**
 * getSearchParam - Retrieves the value of a search parameter from the current URL.
 *
 * @param {string} key - The key of the search parameter to retrieve.
 * @returns {string | null} - The value of the search parameter, or null if the parameter is not present in the URL.
 */
export const getSearchParam = (key: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(key);
};

/**
 * setSearchParam - Updates the value of a search parameter in the current URL.
 * If the specified search parameter does not exist, it will be added.
 *
 * @param {string} key - The key of the search parameter to update.
 * @param {string} value - The new value to set for the search parameter.
 * @param {boolean} [reload=false] - Optional. If true, a full page reload will be triggered after updating the search parameter.
 * If false (default), the URL will be updated without triggering a full page reload.
 */
export const setSearchParam = (
  key: string,
  value: string | number | boolean,
  reload = false,
) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(key, String(value));

  if (reload) {
    // Replace the current URL and trigger a full page reload
    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
  } else {
    // Replace the current URL without triggering a full page reload
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
  }
};

export const debounce = (func:(...args:unknown[]) => unknown, wait: number) => {
  let timeout:NodeJS.Timeout;

  return (...args:unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * removeSearchParam - Removes a search parameter from the current URL.
 *
 * @param {string} key - The key of the search parameter to remove.
 * @param {boolean} [reload=false] - Optional. If true, a full page reload will be triggered after removing the search parameter.
 * If false (default), the URL will be updated without triggering a full page reload.
 */
export const removeSearchParam = (key: string, reload = false) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete(key);

  if (reload) {
    // Replace the current URL and trigger a full page reload
    window.location.href = `${window.location.pathname}?${searchParams.toString()}`;
  } else {
    // Replace the current URL without triggering a full page reload
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
  }
};

/**
 * sleep - Asynchronously waits for the specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait before resolving the Promise.
 * @returns {Promise<null>} - A Promise that resolves after the specified number of milliseconds.
 */
export const sleep = (ms: number): Promise<null> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const formatNumber = (num: number) => {
  const formater = new Intl.NumberFormat('en-GB', {});

  return formater.format(num);
};

export const formatPrettyNumberString = (value: string = '') => {
  return Number(value?.replaceAll(',', ''));
};

export const truncateAddress = (address: string = '', chars: number = 3) => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const formatTokenValue = (
  { value = 0,
    tokenDecimals = 10,
    precision = 2,
  }: {
    value: number;
    tokenDecimals?: number;
    precision?: number;
  }) => {
  return (value / 10 ** tokenDecimals).toFixed(precision);
};
