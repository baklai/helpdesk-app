import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useInspector = defineStore('inspector', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/inspectors', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id = null, host = null }) {
    try {
      return await $axios.get(`/inspectors/${id || host || '127.0.0.1'}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/inspectors/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, removeOne };
});
