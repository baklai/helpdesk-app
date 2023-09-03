import { ref, inject } from 'vue';
import { defineStore } from 'pinia';

export const useEvent = defineStore('event', () => {
  const axios = inject('axios');

  function $reset() {
    return {
      id: null,
      title: null,
      datetime: null,
      eventType: null,
      description: null
    };
  }

  async function findAll(params) {
    try {
      return await axios.get('/events', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await axios.get(`/events/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ title, datetime, eventType = 'event', description }) {
    try {
      return await axios.post('/events', { title, datetime, eventType, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, title, datetime, eventType, description }) {
    try {
      return await axios.put(`/events/${id}`, { title, datetime, eventType, description });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await axios.delete(`/events/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $reset, findAll, findOne, createOne, updateOne, removeOne };
});
