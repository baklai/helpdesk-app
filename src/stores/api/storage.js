import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useStorage = defineStore('storage', () => {
  const $axios = inject('axios');

  async function update(params) {
    try {
      return await $axios.get('/storage', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function download(params) {
    try {
      return await $axios.get('/storage/download', {
        params,
        responseType: 'blob',
        timeout: 0
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function uploadFiles(payload) {
    try {
      return await $axios.post('/storage/upload/file', payload, {
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
      return await $axios.post('/storage/upload/folder', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function rename({ ...payload }) {
    try {
      return await $axios.put('/storage', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function remove(params) {
    try {
      return await $axios.delete('/storage', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { update, download, uploadFiles, uploadFolder, rename, remove };
});
