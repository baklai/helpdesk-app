import { inject } from 'vue';
import { defineStore } from 'pinia';
import { useScope } from '@/stores/scope';

export const useUser = defineStore('user', () => {
  const $axios = inject('axios');
  const $scope = useScope();

  function $init({
    id = undefined,
    login = undefined,
    password = undefined,
    fullname = undefined,
    email = undefined,
    phone = undefined,
    timeout = 15,
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
      timeout,
      isActive,
      isAdmin,
      scope: id ? $scope.getCustomScope(scope) : $scope.getDefaultScope()
    };
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

  async function createOne({ scope, ...payload }) {
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

  return { $init, findAll, findOne, createOne, updateOne, removeOne };
});
