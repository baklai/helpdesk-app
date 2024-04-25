<script setup>
import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="flex h-screen">
    <aside
      :class="[
        'z-50',
        'h-screen',
        'select-none',
        'flex absolute',
        { 'md:w-auto md:max-w-md': $config.appSideBarMode === 'static' },
        { 'md:flex-none md:static': $config.appSideBarMode === 'static' },
        { 'w-full': $config.appSideBarVisible },
        { 'bg-transparent backdrop-blur-sm': $config.appSideBarVisible },
        'transition-transform duration-300 pointer-events-auto',
        'text-surface-900 dark:text-surface-300'
      ]"
      @click.self="$config.toggleAppSideBar"
    >
      <AppSidebar v-if="$config.appSideBarVisible" />
    </aside>

    <div :class="['flex flex-col flex-1', 'overflow-hidden', 'transition-margin duration-200']">
      <AppTopbar />

      <main class="flex-1 px-8 overflow-y-auto">
        <RouterView />
      </main>
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
