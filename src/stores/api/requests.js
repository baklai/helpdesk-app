import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useRequest = defineStore('request', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/requests', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = false, aggregate = false }) {
    try {
      return await $axios.get(`/requests/${id}`, { params: { populate, aggregate } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/requests', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne(id, { ...payload }) {
    try {
      return await $axios.put(`/requests/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/requests/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, createOne, updateOne, removeOne };
});
