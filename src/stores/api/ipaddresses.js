import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useIPAddress = defineStore('ipaddress', () => {
  const $axios = inject('axios');

  function $init({
    id = undefined,
    ipaddress = undefined,
    cidr = undefined,
    unit = undefined,
    internet = {
      mail: undefined,
      dateOpen: undefined,
      dateClose: undefined,
      comment: undefined
    },
    email = [],
    autoanswer = undefined,
    mail = undefined,
    date = undefined,
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
      cidr,
      unit,
      internet,
      email,
      autoanswer,
      mail,
      date,
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

  async function createOne({ ...payload }) {
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
