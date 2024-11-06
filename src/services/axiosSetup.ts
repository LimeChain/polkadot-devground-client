import axios from 'axios';

import authService from './authService';

const MAX_RETRY_COUNT = 3;

axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getJwtToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching JWT token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (originalRequest._retryCount < MAX_RETRY_COUNT && error.response.status === 401) {
      const jwtToken = await authService.getJwtToken();
      if (!jwtToken) {
        return Promise.reject(error);
      }

      originalRequest._retryCount++;
      try {
        await authService.refreshJwtToken();
        console.log('Token refreshed');
        return axios(originalRequest);
      } catch (error) {
        console.log('Error refreshing token', error);
        return Promise.reject(error);
      }
    }

    if (error.response.status === 403) {
      await authService.logout();
      authService.authorizeGitHubApp();
    }

    return Promise.reject(error);
  },
);
