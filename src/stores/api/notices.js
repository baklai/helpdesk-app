import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useNotice = defineStore('notice', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      name: null,
      text: null,
      users: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/notices', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, name, text, userId }) {
    try {
      return await axios.post(`/notices/${id}`, { name, text, userId });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/notices/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, createOne, removeOne };
});
