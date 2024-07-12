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

const authoriseGitHubApp = () => {
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
};

const logout = async (): Promise<void> => {
  await storageRemoveItem(
    STORAGE_AUTH_CACHE_NAME,
    STORAGE_AUTH_JWT_TOKEN,
  );
};

const refreshJwtToken = async (): Promise<IAuthResponse> => {
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
};

const getJwtToken = async (): Promise<string | null> => {
  const jwtToken: string | null = await storageGetItem(
    STORAGE_AUTH_CACHE_NAME,
    STORAGE_AUTH_JWT_TOKEN,
  );

  return jwtToken;
};

export default {
  login,
  refreshJwtToken,
  authoriseGitHubApp,
  getJwtToken,
  logout,
};
