import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useIPAddress = defineStore('ipaddress', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      ipaddress: null,
      indexip: null,
      cidr: null,
      unit: null,
      internet: {
        mail: null,
        dateOpen: null,
        dateClose: null,
        comment: null
      },
      email: [],
      autoanswer: null,
      mail: null,
      date: null,
      location: null,
      company: null,
      branch: null,
      enterprise: null,
      department: null,
      fullname: null,
      position: null,
      phone: null,
      comment: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/ipaddresses', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id = null, ipaddress = null, populate = false }) {
    try {
      return await axios.get(`/ipaddresses/${id || ipaddress}`, { params: { populate } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({
    ipaddress,
    cidr,
    unit,
    internet,
    email = [],
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
  }) {
    try {
      return await axios.post('/ipaddresses', {
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
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({
    id,
    ipaddress,
    cidr,
    unit,
    internet,
    email = [],
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
  }) {
    try {
      return await axios.put(`/ipaddresses/${id}`, {
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
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/ipaddresses/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
