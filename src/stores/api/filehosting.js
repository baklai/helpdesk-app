import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useFileHosting = defineStore('filehosting', () => {
  const axios = inject('axios');

  async function findAll(params) {
    try {
      return await axios.get('/filehosting', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll };
});
