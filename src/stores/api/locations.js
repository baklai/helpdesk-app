import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useLocation = defineStore('location', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/locations', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/locations/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/locations', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne(id, { ...payload }) {
    try {
      return await $axios.put(`/locations/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/locations/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findAllGroured(params) {
    try {
      const locations = await $axios.get('/locations', { params });

      return locations.reduce((acc, current) => {
        const regionIndex = acc.findIndex(item => item.group === current.region);
        if (regionIndex !== -1) {
          acc[regionIndex].records.push({
            id: current.id,
            name: current.name,
            region: current.region
          });
        } else {
          acc.push({
            group: current.region,
            records: [{ id: current.id, name: current.name, region: current.region }]
          });
        }
        return acc;
      }, []);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findAllGroured, findOne, createOne, updateOne, removeOne };
});
