import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useUnit = defineStore('unit', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      name: null,
      description: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/units', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/units/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, description = null }) {
    try {
      return await axios.post('/units', { name, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, description = null }) {
    try {
      return await axios.put(`/units/${id}`, { name, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/units/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
