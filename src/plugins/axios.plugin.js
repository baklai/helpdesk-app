import axios from 'axios';

import { useApp } from '@/stores/app';

export default {
  install: (app, { baseURL, prefixAPI = '', options }) => {
    const { $error, $router } = app.config.globalProperties;
    const store = useApp();

    const axiosInstance = axios.create({
      baseURL: baseURL + prefixAPI,
      timeout: options.timeout,
      headers: options.headers,
      _retry: false
    });

    const refreshAccessToken = async () => {
      try {
        const token = store.getRefreshToken();
        if (!token) {
          throw new Error('Unauthorized');
        }
        store.setAccessToken(token);
        const { accessToken, refreshToken } = await axiosInstance.get('/auth/refresh');
        store.setAccessToken(accessToken);
        store.setRefreshToken(refreshToken);
        return accessToken;
      } catch (error) {
        store.resetAccessRefreshToken();
        $router.push({ name: 'signin' });
        throw error;
      }
    };

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
        console.log(axiosInstance);
        if (error.response && error.response.status === 401 && !axiosInstance.defaults._retry) {
          axiosInstance.defaults._retry = true;
          try {
            const accessToken = await refreshAccessToken();
            const originalRequest = error.config;
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (error) {
            if (error.response && error.response.data) {
              return Promise.reject(error.response.data);
            }
            return Promise.reject(error);
          } finally {
            axiosInstance.defaults._retry = false;
          }
        } else if (
          error.response &&
          (error.response.status === 500 ||
            error.response.status === 501 ||
            error.response.status === 502 ||
            error.response.status === 503)
        ) {
          $error(error.response.data);
        }

        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axios = axiosInstance;
    app.provide('axios', app.config.globalProperties.$axios);
  }
};
