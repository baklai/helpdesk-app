import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useRequest = defineStore('request', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      fullname: null,
      phone: null,
      position: null,
      ipaddress: null,
      mail: null,
      location: null,
      company: null,
      branch: null,
      enterprise: null,
      department: null,
      request: null,
      workerOpen: null,
      workerClose: null,
      closed: null,
      comment: null,
      conclusion: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/requests', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id, populate = true }) {
    try {
      return await axios.get(`/requests/${id}`, { params: { populate } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({
    fullname,
    phone,
    position,
    ipaddress,
    mail,
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
  }) {
    try {
      return await axios.post('/requests', {
        fullname,
        phone,
        position,
        ipaddress,
        mail,
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
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({
    id,
    fullname,
    phone,
    position,
    ipaddress,
    mail,
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
  }) {
    try {
      return await axios.put(`/requests/${id}`, {
        fullname,
        phone,
        position,
        ipaddress,
        mail,
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
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/requests/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
