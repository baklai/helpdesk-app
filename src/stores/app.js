import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useApp = defineStore('app', () => {
  const user = ref(null);

  const accessToken = ref(null);
  const refreshToken = ref(null);

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
    return refreshToken.value;
  }

  function setRefreshToken(value) {
    refreshToken.value = value;
  }

  function resetAccessRefreshToken() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
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
    resetAccessRefreshToken
  };
});
