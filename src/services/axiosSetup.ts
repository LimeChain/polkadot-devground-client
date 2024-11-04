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

    if (error.response.status === 401 && originalRequest._retryCount < MAX_RETRY_COUNT) {
      originalRequest._retryCount += 1;
      try {
        const token = await authService.refreshJwtToken();
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return axios(originalRequest);
        }
      } catch (e) {
        console.error('Error refreshing JWT token', e);
        return Promise.reject(e);
      }
    }

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.logout();
        return;
      } catch (e) {
        console.error('Error during logout', e);
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);
