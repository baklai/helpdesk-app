import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { usePrimeVue } from 'primevue/config';
import { useI18n } from 'vue-i18n';

import useLocalStorage from '@/service/LocalStorage';

export const useConfig = defineStore('config', () => {
  const primevue = usePrimeVue();

  const { locale, fallbackLocale, availableLocales, tm } = useI18n();

  const appScale = ref(useLocalStorage('app-scale', 12));
  const appRipple = ref(useLocalStorage('app-ripple', false));
  const appSideBarMini = ref(useLocalStorage('app-sidebar-mini', false));
  const appSideBarMode = ref(useLocalStorage('app-sidebar-mode', 'static'));
  const appTheme = ref(useLocalStorage('app-theme', 'light'));
  const appLanguage = ref(useLocalStorage('app-language', navigator.language || fallbackLocale));

  const appSideBarVisible = ref(null);
  const activeMenuItem = ref(null);

  watch(appTheme, toggleAppTheme);
  watch(appScale, toggleAppScale);
  watch(appRipple, toggleAppRipple);
  watch(appSideBarMode, toggleAppSideBarMode);

  const isDarkAppTheme = computed(() => appTheme.value === 'dark');

  function setActiveMenuItem(item) {
    activeMenuItem.value = item.value || item;
  }

  function toggleAppScale() {
    document.documentElement.style.fontSize = `${appScale.value}px`;
  }

  function toggleAppTheme() {
    document.documentElement.className = appTheme.value;
  }

  function toggleAppRipple() {
    primevue.config.ripple = appRipple.value;
  }

  function toggleAppSideBarMode() {
    appSideBarVisible.value = true;
  }

  function toggleAppSideBar() {
    appSideBarVisible.value = !appSideBarVisible.value;
  }

  function toggleAppLang(value) {
    if (value && availableLocales.includes(value)) {
      locale.value = value;
      appLanguage.value = value;
    } else if (appLanguage.value && availableLocales.includes(appLanguage.value)) {
      locale.value = appLanguage.value;
    } else {
      const browserLanguage = navigator.language.slice(0, 2);
      if (availableLocales.includes(browserLanguage)) {
        locale.value = browserLanguage;
        appLanguage.value = browserLanguage;
      } else {
        locale.value = fallbackLocale;
        appLanguage.value = fallbackLocale;
      }
    }

    primevue.config.locale = tm('primevue');
  }

  function initAppConfigs() {
    toggleAppLang();
    toggleAppScale();
    toggleAppTheme();
    toggleAppRipple();
    toggleAppSideBar();
  }

  function setDefaultConfigs() {
    appScale.value = 12;
    appRipple.value = false;
    appTheme.value = 'light';
    appSideBarMode.value = 'static';
    document.documentElement.style = '';
  }

  return {
    appTheme,
    appScale,
    appRipple,
    appSideBarMini,
    appSideBarMode,
    appSideBarVisible,
    activeMenuItem,
    isDarkAppTheme,
    toggleAppLang,
    toggleAppScale,
    toggleAppTheme,
    toggleAppRipple,
    toggleAppSideBar,
    setActiveMenuItem,
    initAppConfigs,
    setDefaultConfigs
  };
});
