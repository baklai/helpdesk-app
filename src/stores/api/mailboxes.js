import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useMailbox = defineStore('mailbox', () => {
  const $axios = inject('axios');

  function $init({
    id = undefined,
    ipaddress = undefined,
    mail = undefined,
    login = undefined,
    dateOpen = undefined,
    dateClose = undefined,
    location = undefined,
    company = undefined,
    branch = undefined,
    enterprise = undefined,
    department = undefined,
    fullname = undefined,
    position = undefined,
    phone = undefined,
    comment = undefined
  }) {
    return {
      id,
      ipaddress,
      mail,
      login,
      dateOpen,
      dateClose,
      location,
      company,
      branch,
      enterprise,
      department,
      fullname,
      position,
      phone,
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

  async function createOne({ ...payload }) {
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
