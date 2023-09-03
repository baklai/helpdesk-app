import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useBranch = defineStore('branch', () => {
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
      return await axios.get('/branches', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/branches/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, address = null, description = null }) {
    try {
      return await axios.post('/branches', { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, address = null, description = null }) {
    try {
      return await axios.put(`/branches/${id}`, { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/branches/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
