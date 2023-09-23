import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useMailbox = defineStore('mailbox', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/mailboxes', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = true }) {
    try {
      return await $axios.get(`/mailboxes/${id}`, {
        params: { populate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/mailboxes', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne(id, { ...payload }) {
    try {
      return await $axios.put(`/mailboxes/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/mailboxes/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findOne, createOne, updateOne, removeOne };
});
