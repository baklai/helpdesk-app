import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { usePrimeVue } from 'primevue/config';
import { useI18n } from 'vue-i18n';

import useLocalStorage from '@/service/LocalStorage';

export const useConfig = defineStore('config', () => {
  const primevue = usePrimeVue();

  const { locale, fallbackLocale, availableLocales, tm } = useI18n();

  const activeMenuItem = ref(null);
  const scale = ref(useLocalStorage('app-scale', 12));
  const ripple = ref(useLocalStorage('app-ripple', true));
  const menuMode = ref(useLocalStorage('app-menu-mode', 'static'));
  const theme = ref(useLocalStorage('app-theme', 'light'));
  const language = ref(useLocalStorage('app-lang', navigator.language || fallbackLocale));

  const staticMenuDesktopInactive = ref(true);
  const overlayMenuActive = ref(false);
  const profileSidebarVisible = ref(false);
  const configSidebarVisible = ref(false);
  const staticMenuMobileActive = ref(false);
  const menuHoverActive = ref(false);

  watch(scale, applyScale);
  watch(menuMode, onMenuToggle);
  watch(theme, toggleTheme);

  const isSidebarActive = computed(() => overlayMenuActive.value || staticMenuMobileActive.value);

  const isDarkTheme = computed(() => theme.value === 'dark');

  function setActiveMenuItem(item) {
    activeMenuItem.value = item.value || item;
  }

  function onMenuToggle() {
    if (menuMode.value === 'overlay') {
      overlayMenuActive.value = !overlayMenuActive.value;
    }
    if (window.innerWidth > 991) {
      staticMenuDesktopInactive.value = !staticMenuDesktopInactive.value;
    } else {
      staticMenuMobileActive.value = !staticMenuMobileActive.value;
    }
  }

  function applyScale() {
    document.documentElement.style.fontSize = scale.value + 'px';
  }

  function toggleTheme() {
    const root = document.getElementsByTagName('html')[0];
    root.className = theme.value;
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

  function setDefault() {
    scale.value = 12;
    ripple.value = false;
    menuMode.value = 'static';
    theme.value = 'light';

    document.documentElement.style = '';
  }

  return {
    ripple,
    menuMode,
    theme,
    scale,
    activeMenuItem,
    staticMenuDesktopInactive,
    overlayMenuActive,
    profileSidebarVisible,
    configSidebarVisible,
    staticMenuMobileActive,
    menuHoverActive,
    applyScale,
    toggleTheme,
    setActiveMenuItem,
    onMenuToggle,
    isSidebarActive,
    isDarkTheme,
    toggleLang,
    setDefault
  };
});
