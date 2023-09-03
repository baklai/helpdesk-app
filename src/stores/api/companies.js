import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useСompany = defineStore('company', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      name: null,
      address: null,
      description: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/companies', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/companies/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, address = null, description = null }) {
    try {
      return await axios.post('/companies', { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, address = null, description = null }) {
    try {
      return await axios.put(`/companies/${id}`, { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/companies/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
