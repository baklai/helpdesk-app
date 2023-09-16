import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useRequest = defineStore('request', () => {
  const $axios = inject('axios');

  function $init({
    fullname = null,
    phone = null,
    position = null,
    ipaddress = null,
    reqnum = null,
    location = null,
    company = null,
    branch = null,
    enterprise = null,
    department = null,
    request = null,
    workerOpen = null,
    workerClose = null,
    closed = false,
    comment = null,
    conclusion = null
  }) {
    return {
      fullname,
      phone,
      position,
      ipaddress,
      reqnum,
      location,
      company,
      branch,
      enterprise,
      department,
      request,
      workerOpen,
      workerClose,
      closed,
      comment,
      conclusion
    };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/requests', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = true }) {
    try {
      return await $axios.get(`/requests/${id}`, { params: { populate } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/requests', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
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

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
