import axios from 'axios';

import {
  STORAGE_AUTH_CACHE_NAME,
  STORAGE_AUTH_JWT_TOKEN,
} from '@constants/auth';
import {
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import type { IAuthResponse } from '@custom-types/auth';

const API_URL = 'http://localhost:3000/auth';

const authoriseGitHubApp = () => {
  const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const githubApiUrl = import.meta.env.VITE_GITHUB_API_URL;
  window.location.assign(githubApiUrl + githubClientId + '&scope=user:email%20gist');
};

const login = async (code: string): Promise<IAuthResponse> => {
  const response = await axios.post<IAuthResponse>(
    `${API_URL}/login`,
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

const refreshToken = async (): Promise<IAuthResponse> => {
  const response = await axios.post<IAuthResponse>(
    `${API_URL}/refresh`,
    {},
    { withCredentials: true });

  await storageSetItem(
    STORAGE_AUTH_CACHE_NAME,
    STORAGE_AUTH_JWT_TOKEN,
    response?.data?.jwtToken,
  );

  return response.data;
};

const getAccessToken = async (): Promise<string | null> => {
  const token: string | null = await storageGetItem(
    STORAGE_AUTH_CACHE_NAME,
    STORAGE_AUTH_JWT_TOKEN,
  );

  return token;
};

export default {
  login,
  refreshToken,
  authoriseGitHubApp,
  getAccessToken,
  logout,
};
