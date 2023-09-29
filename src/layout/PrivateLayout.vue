<script setup>
import { ref, computed, watchEffect, defineAsyncComponent } from 'vue';

const AppTopbar = defineAsyncComponent(() => import('@/components/AppTopbar.vue'));
const AppSidebar = defineAsyncComponent(() => import('@/components/AppSidebar.vue'));
const AppConfig = defineAsyncComponent(() => import('@/components/AppConfig.vue'));

import { useConfig } from '@/stores/config';

const $config = useConfig();

const outsideClickListener = ref(null);

const disabledSelectedFromHTML = ref({
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  '-o-user-select': 'none',
  'user-select': 'none'
});

const containerClass = computed(() => {
  return {
    'layout-theme-light': $config.theme === 'light',
    'layout-theme-dark': $config.theme === 'dark',
    'layout-overlay': $config.menuMode === 'overlay',
    'layout-static': $config.menuMode === 'static',
    'layout-static-inactive': $config.staticMenuDesktopInactive && $config.menuMode === 'static',
    'layout-overlay-active': $config.overlayMenuActive,
    'layout-mobile-active': $config.staticMenuMobileActive,
    'p-input-filled': $config.inputStyle === 'filled',
    'p-ripple-disabled': !$config.ripple
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = event => {
      if (isOutsideClicked(event)) {
        $config.overlayMenuActive = false;
        $config.staticMenuMobileActive = false;
        $config.menuHoverActive = false;
      }
    };
    document.addEventListener('click', outsideClickListener.value);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener.value = null;
  }
};

const isOutsideClicked = event => {
  const sidebarEl = document.querySelector('.layout-sidebar');
  const topbarEl = document.querySelector('.layout-menu-button');
  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};

watchEffect(() => {
  if ($config.isSidebarActive) {
    bindOutsideClickListener();
  } else {
    unbindOutsideClickListener();
  }
});
</script>

<template>
  <!-- :style="$helpdesk.hasScope('selected-html') ? '' : disabledSelectedFromHTML" -->
  <div class="layout-wrapper" :class="containerClass">
    <div class="layout-sidebar surface-50">
      <AppSidebar />
    </div>

    <div class="layout-main-container">
      <AppTopbar />
      <div class="layout-main overflow-auto">
        <div class="grid grid-nogutter" style="height: calc(100vh - 9rem)">
          <RouterView />
        </div>
      </div>
    </div>
    <AppConfig />
  </div>
</template>
