import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useApp = defineStore('app', () => {
  const user = ref(null);

  const loggedIn = computed(() => {
    return user.value != null;
  });

  const isActive = computed(() => {
    return user.value?.isActive;
  });

  const isAdmin = computed(() => {
    return user.value?.isAdmin;
  });

  function setUser(value) {
    user.value = value;
  }

  function getAccessToken() {
    return localStorage.getItem('app-auth-access-token');
  }

  function setAccessToken(value) {
    return localStorage.setItem('app-auth-access-token', value);
  }

  function getRefreshToken() {
    return localStorage.getItem('app-auth-refresh-token');
  }

  function setRefreshToken(value) {
    return localStorage.setItem('app-auth-refresh-token', value);
  }

  function resetAccessRefreshToken() {
    user.value = null;
    localStorage.removeItem('app-auth-access-token');
    localStorage.removeItem('app-auth-refresh-token');
  }

  return {
    user,
    loggedIn,
    isAdmin,
    isActive,

    setUser,
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    resetAccessRefreshToken
  };
});
