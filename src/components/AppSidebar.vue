<script setup>
import AppLogo from '@/components/AppLogo.vue';
import SidebarMenu from '@/components/menus/SidebarMenu.vue';
import SidebarMiniMenu from '@/components/menus/SidebarMiniMenu.vue';
import BtnAuth from '@/components/buttons/BtnAuth.vue';
import BtnInfoUser from '@/components/buttons/BtnInfoUser.vue';
import BtnToggleTheme from '@/components/buttons/BtnToggleTheme.vue';
import BtnToggleLang from '@/components/buttons/BtnToggleLang.vue';

import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div
    :class="[
      'list-none',
      'shadow-lg',
      'flex flex-row h-full',
      'bg-surface-0 dark:bg-surface-800',
      'border-r border-solid border-r-surface-50 dark:border-r-surface-700'
    ]"
  >
    <nav :class="['flex flex-col', 'bg-surface-100 dark:bg-surface-900']">
      <div class="flex flex-col h-full">
        <RouterLink :to="{ name: 'home' }" class="flex flex-none justify-center py-4">
          <AppLogo class="text-surface-500" :size="32" />
        </RouterLink>

        <SidebarMiniMenu class="flex flex-col flex-auto justify-center" />

        <div class="flex flex-none justify-center py-2">
          <BtnAuth />
        </div>
      </div>
    </nav>

    <div :class="['flex flex-col', 'h-full w-full px-6']" v-if="!$config.appSideBarMini">
      <RouterLink :to="{ name: 'home' }" class="flex justify-center py-4 mb-6">
        <div class="flex flex-col items-center justify-center mb-2">
          <div class="flex flex-row items-center text-surface-900 dark:text-surface-50">
            <p class="uppercase font-bold text-4xl" translate="no" lang="en">
              h&nbsp;e&nbsp;l&nbsp;p&nbsp;
            </p>
            <AppLogo class="mx-1 text-primary-500" :size="32" />
            <p class="uppercase font-bold text-4xl" translate="no" lang="en">
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

      <div class="flex justify-start mt-2 mb-10" v-if="$route?.meta?.title">
        <div class="flex items-center justify-center mr-2">
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

      <div class="flex flex-col flex-auto overflow-y-scroll" style="scrollbar-width: none">
        <SidebarMenu />
      </div>

      <div class="flex flex-row flex-none items-center content-center justify-between py-2">
        <BtnInfoUser />
        <BtnToggleLang />
        <BtnToggleTheme />
        <BtnAuth />
      </div>
    </div>
  </div>
</template>
