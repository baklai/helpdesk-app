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
  const inputStyle = ref(useLocalStorage('app-input-style', 'outlined'));
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
    const elementId = 'app-theme';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl =
      theme.value === 'dark'
        ? linkElement.getAttribute('href').replace('light', theme.value)
        : linkElement.getAttribute('href').replace('dark', theme.value);
    cloneLinkElement.setAttribute('id', elementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
      linkElement.remove();
      cloneLinkElement.setAttribute('id', elementId);
    });
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
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

  return {
    ripple,
    inputStyle,
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
    toggleLang
  };
});
