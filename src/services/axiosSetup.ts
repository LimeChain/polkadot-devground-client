import axios from 'axios';

import authService from './authService';

axios.interceptors.request.use(
  async (config) => {
    console.log('request');

    const token = await authService.getAccessToken();
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
    console.log('response errro');
    const originalRequest = error.config;
    console.log(error);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await authService.refreshToken();
        const token = await authService.getAccessToken();
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
        return authService.authoriseGitHubApp();
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);
