import { inject } from 'vue';
import { defineStore } from 'pinia';

export const useTool = defineStore('tool', () => {
  const $axios = inject('axios');

  async function getCommandPING({ host = '127.0.0.1' }) {
    try {
      return await $axios.get('/systools/ping-online', { params: { host } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getScriptInspector() {
    try {
      return await $axios.get('/systools/inspector');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getLinkPING({ host }) {
    try {
      return await $axios.get('/systools/ping', { params: { host } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getLinkRDP({ host }) {
    try {
      return await $axios.get('/systools/rdp', { params: { host } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function getLinkVNC({ host }) {
    try {
      return await $axios.get('/systools/vnc', { params: { host } });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return {
    getCommandPING,
    getScriptInspector,
    getLinkPING,
    getLinkRDP,
    getLinkVNC
  };
});
