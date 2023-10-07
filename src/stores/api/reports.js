import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useReport = defineStore('report', () => {
  const $axios = inject('axios');

  async function getReport(path) {
    try {
      return await $axios.get(`/reports/${path}`, {});
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { getReport };
});
