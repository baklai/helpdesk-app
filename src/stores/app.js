import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import useLocalStorage from '@/service/LocalStorage';

export const useApp = defineStore('app', () => {
  const user = ref(null);

  const accessToken = ref(null);
  const refreshToken = ref(null);
  const rememberToken = ref(useLocalStorage('app-auth-remember', false));

  const loggedIn = computed(() => {
    return user.value !== null && accessToken.value !== null && refreshToken.value !== null;
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
    return accessToken.value;
  }

  function setAccessToken(value) {
    accessToken.value = value;
  }

  function getRefreshToken() {
    if (rememberToken.value) {
      refreshToken.value = localStorage.getItem('app-auth-token');
    }
    return refreshToken.value;
  }

  function setRefreshToken(value) {
    refreshToken.value = value;
    if (rememberToken.value) {
      localStorage.setItem('app-auth-token', value);
    }
  }

  function setRememberToken(value) {
    rememberToken.value = value;
  }

  function resetAccessRefreshToken() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    localStorage.removeItem('app-auth-token');
  }

  return {
    user,
    isAdmin,
    isActive,
    loggedIn,
    setUser,
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    setRememberToken,
    resetAccessRefreshToken
  };
});
