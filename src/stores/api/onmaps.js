import { inject } from 'vue';
import { defineStore } from 'pinia';
export const useOnmap = defineStore('onmap', () => {
  const $axios = inject('axios');
  async function findAll(params) {
    try {
      return await $axios.get('/onmaps', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async function findOne({ id }) {
    try {
      return await $axios.get(`/onmaps/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/onmaps', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/onmaps/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  return { findAll, findOne, createOne, removeOne };
});
