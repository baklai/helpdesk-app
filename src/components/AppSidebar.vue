<script setup>
import AppLogo from '@/components/AppLogo.vue';
import SidebarMenu from '@/components/menus/SidebarMenu.vue';
import SidebarMiniMenu from '@/components/menus/SidebarMiniMenu.vue';
import BtnAuth from '@/components/buttons/BtnAuth.vue';
import BtnInfoProfile from '@/components/buttons/BtnInfoProfile.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="flex h-full list-none flex-row">
    <nav
      :class="[
        'z-10',
        'flex flex-col',
        'bg-surface-100 dark:bg-surface-900',
        'border-r border-solid border-r-surface-200 dark:border-r-surface-700'
      ]"
    >
      <div class="flex h-full flex-col">
        <RouterLink :to="{ name: 'home' }" class="flex flex-none justify-center py-4">
          <AppLogo class="text-surface-500" :size="32" />
        </RouterLink>

        <SidebarMiniMenu class="flex flex-auto flex-col justify-center" />

        <div class="flex flex-none justify-center py-2">
          <BtnAuth />
        </div>
      </div>
    </nav>

    <transition name="slide">
      <div
        :class="['flex flex-col', 'h-full w-full px-6', 'bg-surface-100/50 dark:bg-surface-900/50']"
        v-if="!$config.appSideBarMini"
      >
        <RouterLink :to="{ name: 'home' }" class="mb-6 flex justify-center py-4">
          <div class="mb-2 flex flex-col items-center justify-center">
            <div class="flex flex-row items-center text-surface-900 dark:text-surface-50">
              <p class="text-4xl font-bold uppercase" translate="no" lang="en">
                h&nbsp;e&nbsp;l&nbsp;p&nbsp;
              </p>
              <AppLogo class="mx-1 text-primary-500" :size="32" />
              <p class="text-4xl font-bold uppercase" translate="no" lang="en">
                &nbsp;d&nbsp;e&nbsp;s&nbsp;k
              </p>
            </div>
            <div class="flex text-center">
              <p class="text-base font-medium text-surface-500">
                {{ $t('Web Application of technical support') }}
              </p>
            </div>
          </div>
        </RouterLink>

        <div class="mb-10 mt-2 flex justify-start" v-if="$route?.meta?.title">
          <div class="mr-2 flex items-center justify-center">
            <Avatar class="mr-2" size="xlarge">
              <AppIcons :name="$route?.name" :size="32" />
            </Avatar>
          </div>
          <div class="flex flex-col items-start justify-center">
            <span class="text-2xl">{{ $t($route?.meta?.title) }}</span>
            <p class="text-sm text-surface-500">
              {{ $t($route?.meta?.description) }}
            </p>
          </div>
        </div>

        <div class="flex flex-auto flex-col overflow-y-scroll" style="scrollbar-width: none">
          <SidebarMenu />
        </div>

        <div class="flex flex-none flex-row content-center items-center justify-between py-2">
          <BtnInfoProfile />
          <BtnToggleLang />
          <BtnToggleTheme />
          <BtnAuth />
        </div>
      </div>
    </transition>
  </div>
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
