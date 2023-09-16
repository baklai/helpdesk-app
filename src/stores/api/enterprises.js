import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useEnterprise = defineStore('enterprise', () => {
  const $axios = inject('axios');

  function $init({ id = null, name = null, address = null, description = null }) {
    return {
      id,
      name,
      address,
      description
    };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/enterprises', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/enterprises/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/enterprises', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/enterprises/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/enterprises/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
