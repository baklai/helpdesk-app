import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useEvent = defineStore('event', () => {
  const $axios = inject('axios');

  function $init({
    id = undefined,
    title = undefined,
    datetime = undefined,
    eventType = undefined,
    description = undefined
  }) {
    return { id, title, datetime, eventType, description };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/events', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/events/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/events', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/events/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/events/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
