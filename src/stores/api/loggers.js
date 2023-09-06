import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useLogger = defineStore('logger', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/loggers', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/loggers/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/loggers/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeAll(payload) {
    try {
      return await $axios.delete('/loggers', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, removeOne, removeAll };
});
