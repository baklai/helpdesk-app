import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useNotice = defineStore('notice', () => {
  const $axios = inject('axios');

  function $init({ name = undefined, text = undefined }) {
    return { name, text };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/notices', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, text, userId }) {
    try {
      return await $axios.post('/notices', { name, text, userId });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/notices/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, createOne, removeOne };
});
