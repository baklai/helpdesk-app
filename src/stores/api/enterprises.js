import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useEnterprise = defineStore('enterprise', () => {
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
      return await axios.get('/enterprises', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/enterprises/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, address = null, description = null }) {
    try {
      return await axios.post('/enterprises', { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, address = null, description = null }) {
    try {
      return await axios.put(`/enterprises/${id}`, { name, address, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/enterprises/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
