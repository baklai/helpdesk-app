import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useLocation = defineStore('location', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      name: null,
      region: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/locations', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/locations/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, region = null }) {
    try {
      return await axios.post('/locations', { name, region });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, region = null }) {
    try {
      return await axios.put(`/locations/${id}`, { name, region });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/locations/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
