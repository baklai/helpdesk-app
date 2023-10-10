import axios from 'axios';

import { useApp } from '@/stores/app';

export default {
  install: (app, { baseURL, prefixAPI = '/', options, refresh }) => {
    const { $error, $router } = app.config.globalProperties;
    const store = useApp();

    const axiosInstance = axios.create({
      baseURL: baseURL + prefixAPI,
      timeout: options.timeout,
      headers: options.headers
    });

    axiosInstance.interceptors.request.use(
      async config => {
        const token = store.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      response => {
        return response.data;
      },
      async error => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('The request has timed out. Please try again later.');
        }
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest?._retry) {
          originalRequest._retry = true;
          try {
            const token = store.getRefreshToken();
            if (!token) {
              throw new Error('Unauthorized');
            }
            store.setAccessToken(token);
            const { accessToken, refreshToken } = await axiosInstance({
              method: refresh.method,
              url: refresh.url
            });
            store.setAccessToken(accessToken);
            store.setRefreshToken(refreshToken);
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (error) {
            store.resetAccessRefreshToken();
            $router.push({ name: 'signin' });
            if (error.response && error.response.data) {
              return Promise.reject(error.response.data);
            }
            return Promise.reject(error);
          } finally {
            originalRequest._retry = false;
          }
        }
        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axios = axiosInstance;

    app.provide('axios', app.config.globalProperties.$axios);
  }
};
