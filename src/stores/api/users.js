import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useUser = defineStore('user', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      login: null,
      password: null,
      fullname: null,
      email: null,
      phone: null,
      timeout: 15,
      isActive: false,
      isAdmin: false,
      scope: []
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/users', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/users/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await axios.post('/users', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await axios.put(`/users/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/users/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
