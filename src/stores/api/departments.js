import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useDepartment = defineStore('department', () => {
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
      return await axios.get('/departments', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/departments/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ name, description = null }) {
    try {
      return await axios.post('/departments', { name, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, name, description = null }) {
    try {
      return await axios.put(`/departments/${id}`, { name, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/departments/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
