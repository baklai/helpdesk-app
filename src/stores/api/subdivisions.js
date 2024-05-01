import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useSubdivision = defineStore('subdivision', () => {
  const $axios = inject('axios');

  async function findAll(params) {
    try {
      return await $axios.get('/subdivisions', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findAllByOrganizationId({ id }) {
    try {
      return await $axios.get(`/subdivisions/organization/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/subdivisions/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function createOne({ ...payload }) {
    try {
      return await $axios.post('/subdivisions', { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne(id, { ...payload }) {
    try {
      return await $axios.put(`/subdivisions/${id}`, { ...payload });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/subdivisions/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { findAll, findAllByOrganizationId, findOne, createOne, updateOne, removeOne };
});
