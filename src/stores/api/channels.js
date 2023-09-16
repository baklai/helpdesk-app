import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useChannel = defineStore('channel', () => {
  const $axios = inject('axios');

  function $init({
    id = null,
    locationFrom = null,
    unitFrom = null,
    locationTo = null,
    unitTo = null,
    level = null,
    type = null,
    speed = null,
    status = null,
    operator = null,
    composition = null
  }) {
    return {
      id,
      locationFrom,
      unitFrom,
      locationTo,
      unitTo,
      level,
      type,
      speed,
      status,
      operator,
      composition
    };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/channels', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/channels/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/channels', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
    try {
      return await $axios.put(`/channels/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/channels/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
