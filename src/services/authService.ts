import axios from 'axios';

import {
  SERVER_URL,
  STORAGE_AUTH_CACHE_NAME,
  STORAGE_AUTH_JWT_TOKEN,
  STORAGE_AUTH_SUCCESSFUL_REDIRECT_TO,
} from '@constants/auth';
import {
  storageClear,
  storageGetItem,
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

    await storageSetItem(
      STORAGE_AUTH_CACHE_NAME,
      'user',
      JSON.stringify({ name: response?.data?.userName, avatar: response?.data?.userAvatar }),
    );

    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    await axios.post<IAuthResponse>(
      `${AUTH_URL}/logout`,
      {},
      { withCredentials: true },
    );

    await storageClear(STORAGE_AUTH_CACHE_NAME);
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

const getUserData = async (): Promise<string> => {
  try {
    const userData: string | null = await storageGetItem(
      STORAGE_AUTH_CACHE_NAME,
      'user',
    );

    if (userData === null) {
      throw new Error('User data not found');
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error('Failed to get user data', error);
    throw error;
  }
};
export default {
  login,
  refreshJwtToken,
  authorizeGitHubApp,
  getJwtToken,
  getUserData,
  logout,
};
