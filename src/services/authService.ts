import axios from 'axios';

import {
  SERVER_URL,
  STORAGE_AUTH_CACHE_NAME,
  STORAGE_AUTH_JWT_TOKEN,
  STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO,
} from '@constants/auth';
import {
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import type { IAuthResponse } from '@custom-types/auth';

const AUTH_URL = `${SERVER_URL}/auth`;

const authorizeGitHubApp = () => {
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const githubApiUrl = import.meta.env.VITE_GITHUB_API_URL;

  const { pathname, search } = location;
  window.localStorage.setItem(
    STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO,
    `${pathname}${search}`,
  );

  location.assign(
    githubApiUrl + githubClientId + '&scope=user:email%20gist',
  );
};

const login = async (code: string): Promise<IAuthResponse> => {
  try {
    const response = await axios.post<IAuthResponse>(
      `${AUTH_URL}/login`,
      { code },
      { withCredentials: true },
    );

    await storageSetItem(
      STORAGE_AUTH_CACHE_NAME,
      STORAGE_AUTH_JWT_TOKEN,
      response?.data?.jwtToken,
    );

    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    await storageRemoveItem(
      STORAGE_AUTH_CACHE_NAME,
      STORAGE_AUTH_JWT_TOKEN,
    );
  } catch (error) {
    console.error('Logout failed', error);
    throw error;
  }
};

const refreshJwtToken = async (): Promise<IAuthResponse> => {
  try {
    const response = await axios.post<IAuthResponse>(
      `${AUTH_URL}/refresh`,
      {},
      { withCredentials: true });

    await storageSetItem(
      STORAGE_AUTH_CACHE_NAME,
      STORAGE_AUTH_JWT_TOKEN,
      response?.data?.jwtToken,
    );

    return response.data;
  } catch (error) {
    console.error('Token refresh failed', error);
    throw error;
  }
};

const getJwtToken = async (): Promise<string | null> => {
  try {
    const jwtToken: string | null = await storageGetItem(
      STORAGE_AUTH_CACHE_NAME,
      STORAGE_AUTH_JWT_TOKEN,
    );

    return jwtToken;
  } catch (error) {
    console.error('Failed to get JWT token', error);
    throw error;
  }
};

export default {
  login,
  refreshJwtToken,
  authorizeGitHubApp,
  getJwtToken,
  logout,
};
