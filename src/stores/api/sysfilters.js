import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useSysfilter = defineStore('sysfilter', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      regex: null,
      type: null,
      status: null,
      description: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/sysfilters', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/sysfilters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ regex, type, status, description }) {
    try {
      return await axios.post('/sysfilters', { regex, type, status, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, regex, type, status, description }) {
    try {
      return await axios.put(`/sysfilters/${id}`, { regex, type, status, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/sysfilters/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
