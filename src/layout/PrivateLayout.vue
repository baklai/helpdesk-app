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
        { 'w-full': $config.appSideBarVisible },
        { 'md:w-auto md:max-w-md': $config.appSideBarMode === 'static' },
        { 'md:flex-none md:static': $config.appSideBarMode === 'static' },
        { 'bg-transparent backdrop-blur-sm': $config.appSideBarVisible },
        'text-surface-900 dark:text-surface-300'
      ]"
      @click.self="$config.toggleAppSideBar"
    >
      <transition name="slide">
        <AppSidebar v-if="$config.appSideBarVisible" />
      </transition>
    </aside>

    <div class="flex flex-col flex-1 overflow-hidden">
      <AppTopbar />

      <main class="flex-1 px-8 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>

  <ConfirmDialog class="max-w-md">
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

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
