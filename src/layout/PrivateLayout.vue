<script setup>
import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();

// $config.overlayMenuActive = false;
// $config.staticMenuMobileActive = false;
// $config.menuHoverActive = false;
</script>

<template>
  <div
    :class="[
      'min-h-screen bg-surface-0 dark:bg-surface-800'

      // { 'layout-overlay': $config.menuMode === 'overlay' },
      // { 'layout-static': $config.menuMode === 'static' },
      // {
      //   'layout-static-inactive': $config.staticMenuDesktopInactive && $config.menuMode === 'static'
      // },
      // { 'layout-overlay-active': $config.overlayMenuActive },
      // { 'layout-mobile-active': $config.staticMenuMobileActive },
    ]"
  >
    <div
      :class="[
        'z-50',
        'fixed',
        'left-0 inset-y-0',
        'flex justify-start items-center',
        'h-screen w-screen md:w-[25rem]',

        '-translate-x-full md:translate-x-0',

        $config.sidebarMenu ? '!-translate-x-full' : 'translate-x-0',

        'transition-all duration-200',

        'bg-transparent backdrop-blur-sm md:backdrop-blur-none',

        // 'bg-transparent sm:bg-black/50 backdrop-blur-none sm:backdrop-blur-sm',

        // 'sm:!w-[25rem] sm:!fixed',

        // // 'z-40',
        // 'absolute',
        // 'left-0 top-0',
        // 'py-2 px-6',
        // 'h-screen w-[25rem]',

        // 'translate-x-0',
        // 'sm:-translate-x-full',
        // { fixed: $config.menuMode === 'static' },
        // {
        //   '-translate-x-full': $config.staticMenuDesktopInactive && $config.menuMode === 'static'
        // },
        // 'l-0 t-0 h-screen -translate-x-full',
        'select-none',
        // 'overflow-y-auto',
        // 'transition-left duration-200',
        'text-surface-900 dark:text-surface-300'
        // 'bg-surface-100 dark:bg-surface-900'
      ]"
      @click.self="$config.toggleSidebarMenu"
    >
      <AppSidebar />
    </div>

    <div
      :class="[
        'min-h-screen',
        'ml-0 md:ml-[25rem]',

        {
          '!ml-0': $config.sidebarMenu
        },
        // {
        //   'ml-0': $config.staticMenuDesktopInactive && $config.menuMode === 'static'
        // },
        // { 'ml-[25rem]': $config.menuMode === 'static' && !$config.staticMenuDesktopInactive },

        'flex flex-col justify-between',
        'transition-margin duration-200',
        'text-surface-900 dark:text-primary-50',
        'bg-surface-0 dark:bg-surface-800'
      ]"
    >
      <AppTopbar />

      <div class="flex-auto px-8 overflow-auto">
        <div class="flex flex-wrap z-0" style="height: calc(100vh - 9rem)">
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
          <i :class="[message?.icon || 'pi pi-question', 'text-5xl']"></i>
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
