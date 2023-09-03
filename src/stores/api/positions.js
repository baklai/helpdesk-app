import { inject } from 'vue';
import { defineStore } from 'pinia';

export const usePosition = defineStore('position', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      name: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/positions', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/positions/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name }) {
    try {
      return await axios.post('/positions', { name });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name }) {
    try {
      return await axios.put(`/positions/${id}`, { name });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/positions/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
