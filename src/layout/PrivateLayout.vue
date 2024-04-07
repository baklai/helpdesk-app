<script setup>
import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="min-h-screen bg-surface-0 dark:bg-surface-800">
    <aside
      :class="[
        'z-50',
        'fixed',
        'select-none',
        'left-0 inset-y-0',
        'h-screen w-screen',
        'flex justify-start items-center',
        '-translate-x-full',
        'bg-transparent backdrop-blur-sm',
        {
          'translate-x-0': $config.appSideBarVisible
        },
        {
          'md:!w-[25rem] md:!backdrop-blur-none':
            $config.appSideBarMode === 'static' && $config.appSideBarVisible
        },
        'transition-all duration-200',
        'text-surface-900 dark:text-surface-300'
      ]"
      @click.self="$config.toggleAppSideBar"
    >
      <AppSidebar />
    </aside>

    <div
      :class="[
        'ml-0',
        'min-h-screen',
        'flex flex-col justify-between',
        {
          'md:!ml-[25rem]': $config.appSideBarMode === 'static' && $config.appSideBarVisible
        },
        'transition-margin duration-200',
        'text-surface-900 dark:text-primary-50',
        'bg-surface-0 dark:bg-surface-800'
      ]"
    >
      <AppTopbar />

      <main class="flex flex-auto px-8 overflow-auto flex-wrap" style="height: calc(100vh - 9rem)">
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
