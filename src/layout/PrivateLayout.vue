<script setup>
import { ref, watchEffect } from 'vue';

import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();

const outsideClickListener = ref(null);

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
  <div
    class="layout-wrapper min-h-screen bg-surface-0 dark:bg-surface-800"
    :class="[
      { 'layout-overlay': $config.menuMode === 'overlay' },
      { 'layout-static': $config.menuMode === 'static' },
      {
        'layout-static-inactive': $config.staticMenuDesktopInactive && $config.menuMode === 'static'
      },
      { 'layout-overlay-active': $config.overlayMenuActive },
      { 'layout-mobile-active': $config.staticMenuMobileActive },
      { 'p-ripple-disabled': !$config.ripple }
    ]"
  >
    <div
      class="layout-sidebar text-surface-900 dark:text-surface-300 bg-surface-100 dark:bg-surface-900"
    >
      <AppSidebar />
    </div>

    <div
      class="layout-main-container flex flex-col min-h-screen justify-between transition-margin duration-200 text-surface-900 dark:text-primary-50 bg-surface-0 dark:bg-surface-800"
    >
      <AppTopbar />
      <div class="layout-main flex-auto px-8 overflow-auto">
        <div class="flex flex-wrap m-0" style="height: calc(100vh - 9rem)">
          <RouterView />
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog class="!w-[30rem]">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-700 rounded-md">
        <div
          class="rounded-full bg-primary-500 dark:bg-primary-400 text-surface-0 dark:text-surface-900 inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-[3rem]"
        >
          <i :class="[message?.icon || 'pi pi-question0', 'text-5xl']"></i>
        </div>
        <span class="font-bold !text-black dark:!text-white text-2xl block mb-2 mt-4">
          {{ message.message }}
        </span>
        <p class="mb-0 text-surface-500">{{ message.header }}</p>
        <div class="flex items-center gap-2 mt-4">
          <Button
            :label="$t('Yes')"
            :icon="message.acceptIcon || ''"
            @click="acceptCallback"
            class="w-[8rem]"
          />

          <Button
            outlined
            :label="$t('No')"
            :icon="message.rejectIcon || ''"
            @click="rejectCallback"
            class="w-[8rem]"
          />
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
