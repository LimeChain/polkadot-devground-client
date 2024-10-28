import axios from 'axios';

import authService from './authService';

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

    if (error.response.status === 401) {
      try {
        const token = await authService.refreshJwtToken();
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
        authService.authorizeGitHubApp();
        return;
      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
