import axios from 'axios';

import authService from './authService';

const MAX_RETRIES = 3;

axios.interceptors.request.use(
  async (config) => {
    const token = await authService.getJwtToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    if (error.response.status === 401 && originalRequest._retryCount < MAX_RETRIES) {
      originalRequest._retryCount += 1;
      try {
        const token = await authService.getJwtToken();
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        return authService.authorizeGitHubApp();
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
