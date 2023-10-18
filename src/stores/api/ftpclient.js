import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useFTPClient = defineStore('ftpclient', () => {
  const $axios = inject('axios');

  async function update(params) {
    try {
      return await $axios.get('/ftp', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function download(params) {
    try {
      return await $axios.get('/ftp/download', {
        params,
        responseType: 'blob',
        timeout: 0
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function uploadFile(payload) {
    try {
      return await $axios.post('/ftp/upload/file', payload, {
        headers: {
          'Content-Type': `multipart/form-data;`
        },
        timeout: 10 * 60 * 1000
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function uploadFolder({ ...payload }) {
    try {
      return await $axios.post('/ftp/upload/folder', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function rename({ ...payload }) {
    try {
      return await $axios.put('/ftp', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function remove(params) {
    try {
      return await $axios.delete('/ftp', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { update, download, uploadFile, uploadFolder, rename, remove };
});
