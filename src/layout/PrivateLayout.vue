<script setup>
import { ref, computed, watchEffect } from 'vue';

import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();

const outsideClickListener = ref(null);

const containerClass = computed(() => {
  return {
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
  <div class="layout-wrapper min-h-screen" :class="containerClass">
    <div
      class="layout-sidebar text-surface-900 dark:text-surface-300 bg-surface-100 dark:bg-surface-900"
    >
      <AppSidebar />
    </div>

    <div
      class="layout-main-container flex flex-col min-h-screen justify-between transition-margin duration-200 text-surface-900 dark:text-primary-50 bg-surface-50 dark:bg-surface-800"
    >
      <AppTopbar />
      <div class="layout-main flex-auto px-8 overflow-auto">
        <div class="flex flex-wrap m-0" style="height: calc(100vh - 9rem)">
          <RouterView />
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog :style="{ minWidth: '350px' }">
    <template #message="slotProps">
      <div class="flex items-center justify-start">
        <i class="text-4xl mr-3" :class="slotProps.message.icon" />
        <span class="font-medium">{{ slotProps.message.message }} </span>
      </div>
    </template>
  </ConfirmDialog>
</template>
