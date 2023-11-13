import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useIPAddress = defineStore('ipaddress', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/ipaddresses', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = false, aggregate = false }) {
    try {
      return await $axios.get(`/ipaddresses/${id}`, {
        params: { populate, aggregate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOneByIP({ ipaddress, populate = false, aggregate = false }) {
    try {
      return await $axios.get('/ipaddresses/find', {
        params: { ipaddress, populate, aggregate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/ipaddresses', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne(id, { ...payload }) {
    try {
      return await $axios.put(`/ipaddresses/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/ipaddresses/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, findOneByIP, createOne, updateOne, removeOne };
});
