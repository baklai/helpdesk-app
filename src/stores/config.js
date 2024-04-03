import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { usePrimeVue } from 'primevue/config';
import { useI18n } from 'vue-i18n';

import useLocalStorage from '@/service/LocalStorage';

export const useConfig = defineStore('config', () => {
  const primevue = usePrimeVue();

  const { locale, fallbackLocale, availableLocales, tm } = useI18n();

  const scale = ref(useLocalStorage('app-scale', 12));
  const ripple = ref(useLocalStorage('app-ripple', false));
  const menuMode = ref(useLocalStorage('app-menu-mode', 'static'));
  const theme = ref(useLocalStorage('app-theme', 'light'));
  const language = ref(useLocalStorage('app-lang', navigator.language || fallbackLocale));

  const activeMenuItem = ref(null);

  const sidebarMenu = ref(true);

  watch(scale, toggleScale);
  watch(menuMode, toggleSidebarMenu);
  watch(theme, toggleTheme);
  watch(ripple, toggleRipple);

  const isDarkTheme = computed(() => theme.value === 'dark');

  function setActiveMenuItem(item) {
    activeMenuItem.value = item.value || item;
  }

  function toggleSidebarMenu() {
    sidebarMenu.value = !sidebarMenu.value;

    // if (menuMode.value === 'overlay') {
    //   overlayMenuActive.value = !overlayMenuActive.value;
    // }
    // if (window.innerWidth > 991) {
    //   staticMenuDesktopInactive.value = !staticMenuDesktopInactive.value;
    // } else {
    //   staticMenuMobileActive.value = !staticMenuMobileActive.value;
    // }
  }

  function toggleScale() {
    document.documentElement.style.fontSize = `${scale.value}px`;
  }

  function toggleTheme() {
    document.documentElement.className = theme.value;
  }

  function toggleRipple() {
    primevue.config.ripple = ripple.value;
  }

  function toggleLang(value) {
    if (value && availableLocales.includes(value)) {
      locale.value = value;
      language.value = value;
    } else if (language.value && availableLocales.includes(language.value)) {
      locale.value = language.value;
    } else {
      const browserLanguage = navigator.language.slice(0, 2);
      if (availableLocales.includes(browserLanguage)) {
        locale.value = browserLanguage;
        language.value = browserLanguage;
      } else {
        locale.value = fallbackLocale;
        language.value = fallbackLocale;
      }
    }

    primevue.config.locale = tm('primevue');
  }

  function initAppConfigs() {
    toggleScale();
    toggleSidebarMenu();
    toggleTheme();
    toggleRipple();
    toggleLang();
  }

  function setDefaultConfigs() {
    scale.value = 12;
    ripple.value = false;
    menuMode.value = 'static';
    theme.value = 'light';

    document.documentElement.style = '';
  }

  return {
    theme,
    scale,
    ripple,
    menuMode,
    sidebarMenu,
    activeMenuItem,
    isDarkTheme,
    toggleLang,
    toggleScale,
    toggleTheme,
    toggleRipple,
    toggleSidebarMenu,
    setActiveMenuItem,
    initAppConfigs,
    setDefaultConfigs
  };
});
