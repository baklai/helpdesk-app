import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useFilter = defineStore('filter', () => {
  const $axios = inject('axios');

  function $init({ id = null, regex = null, type = null, status = null, description = null }) {
    return { id, regex, type, status, description };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/filters', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/filters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/filters', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/filters/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/filters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
