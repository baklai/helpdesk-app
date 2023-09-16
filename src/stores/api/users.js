import { inject } from 'vue';
import { defineStore } from 'pinia';

import { useScope } from '@/stores/scope';

export const useUser = defineStore('user', () => {
  const $axios = inject('axios');
  const $scope = useScope();

  function $init({
    id = null,
    login = null,
    password = null,
    fullname = null,
    email = null,
    phone = null,
    isActive = false,
    isAdmin = false,
    scope = []
  }) {
    return {
      id,
      login,
      password,
      fullname,
      email,
      phone,
      isActive,
      isAdmin,
      scope: id ? $scope.getCustomScope(scope) : $scope.getDefaultScope()
    };
  }

  async function find() {
    try {
      return await $axios.get('/users/me');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findAll(params) {
    try {
      return await $axios.get('/users', { params });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function findOne({ id }) {
    try {
      return await $axios.get(`/users/${id}`);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function createOne({ id, scope, ...payload }) {
    try {
      return await $axios.post('/users', { ...payload, scope: $scope.getScopeKeyList(scope) });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOne({ id, scope, ...payload }) {
    try {
      return await $axios.put(`/users/${id}`, { ...payload, scope: $scope.getScopeKeyList(scope) });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function removeOne({ id }) {
    try {
      return await $axios.delete(`/users/${id}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  return { $init, find, findAll, findOne, createOne, updateOne, removeOne };
});
