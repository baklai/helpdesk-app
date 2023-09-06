import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useSysfilter = defineStore('sysfilter', () => {
  const $axios = inject('axios');

  function $init({
    id = undefined,
    regex = undefined,
    type = undefined,
    status = undefined,
    description = undefined
  }) {
    return { id, regex, type, status, description };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/sysfilters', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/sysfilters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/sysfilters', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/sysfilters/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/sysfilters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
