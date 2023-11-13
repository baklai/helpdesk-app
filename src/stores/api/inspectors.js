import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useInspector = defineStore('inspector', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/inspectors', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = false, aggregate = false }) {
    try {
      return await $axios.get(`/inspectors/${id}`, {
        params: { populate, aggregate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOneByHost({ host, populate = false, aggregate = false }) {
    try {
      return await $axios.get('/inspectors/find', {
        params: { host, populate, aggregate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/inspectors/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, findOneByHost, removeOne };
});
