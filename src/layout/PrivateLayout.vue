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
        'absolute flex',
        { 'w-full': $config.appSideBarVisible },
        { 'md:w-auto md:max-w-md': $config.appSideBarMode === 'static' },
        { 'md:static md:flex-none': $config.appSideBarMode === 'static' },
        { 'bg-transparent backdrop-blur-sm': $config.appSideBarVisible },
        'text-surface-900 dark:text-surface-300'
      ]"
      @click.self="$config.toggleAppSideBar"
    >
      <transition name="slide">
        <AppSidebar v-if="$config.appSideBarVisible" />
      </transition>
    </aside>

    <div class="flex flex-1 flex-col overflow-hidden">
      <AppTopbar />

      <main class="flex-1 overflow-y-auto px-8">
        <RouterView />
      </main>
    </div>
  </div>

  <ConfirmDialog class="max-w-md">
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-col items-center rounded-md bg-surface-0 p-5 dark:bg-surface-700">
        <div
          class="-mt-[3rem] inline-flex h-[6rem] w-[6rem] items-center justify-center rounded-full bg-primary-500 text-surface-0 dark:bg-primary-400 dark:text-surface-900"
        >
          <i :class="[message?.icon || 'pi pi-question', 'text-5xl']"></i>
        </div>
        <span class="mb-2 mt-4 block text-2xl font-bold !text-black dark:!text-white">
          {{ message.message }}
        </span>
        <p class="mb-0 text-surface-500">{{ message.header }}</p>
        <div class="mt-4 flex items-center gap-2">
          <Button
            label="Так"
            :icon="message.acceptIcon || ''"
            @click="acceptCallback"
            class="w-[8rem]"
          />

          <Button
            outlined
            label="Ні"
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
