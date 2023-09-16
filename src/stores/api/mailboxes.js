import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useMailbox = defineStore('mailbox', () => {
  const $axios = inject('axios');

  function $init({
    id = null,
    reqnum = null,
    login = null,
    fullname = null,
    phone = null,
    dateOpen = null,
    dateClose = null,
    location = null,
    company = null,
    branch = null,
    enterprise = null,
    department = null,
    position = null,
    comment = null
  }) {
    return {
      id,
      reqnum,
      login,
      fullname,
      phone,
      dateOpen,
      dateClose,
      location,
      company,
      branch,
      enterprise,
      department,
      position,
      comment
    };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/mailboxes', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/mailboxes/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/mailboxes', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
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

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
