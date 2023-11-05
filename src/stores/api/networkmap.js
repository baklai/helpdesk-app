import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useNetworkMap = defineStore('netmap', () => {
  const $axios = inject('axios');

  async function networkMap(params) {
    try {
      return await $axios.get('/netmaps', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { networkMap };
});
