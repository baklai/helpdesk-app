import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useNetworkMap = defineStore('netmap', () => {
  const $axios = inject('axios');

  async function networkMap({ id }) {
    try {
      return await $axios.get(`/netmaps/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { networkMap };
});
