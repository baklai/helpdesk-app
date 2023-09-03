import axios from 'axios';

import { useApp } from '@/stores/app';

export default {
  install: async (app, { baseURL, prefixAPI = '', options }) => {
    const { $router } = app.config.globalProperties;

    const store = useApp();

    const axiosInstance = axios.create({
      baseURL: baseURL + prefixAPI,
      timeout: options.timeout,
      headers: options.headers
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const refreshToken = async () => {
      try {
        const refreshToken = store.getRefreshToken();
        if (!refreshToken) {
          throw new Error('Unauthorized');
        }
        store.setAccessToken(refreshToken);
        const data = await axiosInstance.get('/auth/refresh');
        store.setAccessToken(data.accessToken);
        store.setRefreshToken(data.refreshToken);
        return data.accessToken;
      } catch (error) {
        throw error;
      }
    };

    axiosInstance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            $router.push({ name: 'signin' });
            throw refreshError;
          }
        }
        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axios = axiosInstance;

    app.provide('axios', app.config.globalProperties.$axios);
  }
};
