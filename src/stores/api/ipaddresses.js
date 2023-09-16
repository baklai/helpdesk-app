import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useIPAddress = defineStore('ipaddress', () => {
  const $axios = inject('axios');

  function $init({
    id = null,
    ipaddress = null,
    cidr = null,
    reqnum = null,
    date = null,
    fullname = null,
    phone = null,
    internet = {
      reqnum: null,
      dateOpen: null,
      dateClose: null,
      comment: null
    },
    autoanswer = null,
    comment = null,
    unit = null,
    location = null,
    company = null,
    branch = null,
    enterprise = null,
    department = null,
    position = null
  }) {
    return {
      id,
      ipaddress,
      cidr,
      reqnum,
      date,
      fullname,
      phone,
      internet,
      autoanswer,
      comment,
      unit,
      location,
      company,
      branch,
      enterprise,
      department,
      position
    };
  }

  async function findAll(params) {
    try {
      return await $axios.get('/ipaddresses', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id = null, ipaddress = null, populate = false }) {
    try {
      return await $axios.get(`/ipaddresses/${id || ipaddress || '127.0.0.1'}`, {
        params: { populate }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ id, ...payload }) {
    try {
      return await $axios.post('/ipaddresses', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, ...payload }) {
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

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
